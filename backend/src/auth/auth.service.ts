import {Injectable,UnauthorizedException,NotFoundException,BadRequestException,ForbiddenException} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CaptchaService } from './captcha/captcha.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly captchaService: CaptchaService,
  ) {}

  // ================= LOGIN =================
  async login(dto: LoginDto) {

    const captchaValid = this.captchaService.validate(
      dto.captchaId,
      dto.captchaAnswer,
    );

    if (!captchaValid) {
      throw new BadRequestException(
        'Invalid or expired captcha. Please refresh and try again.',
      );
    }

    const pool = await this.dbService.connect();

    const result = await pool
      .request()
      .input('UseridID', dto.userId)
      .execute('USP_Validateuser');

    const user = result.recordset[0];

    if (!user) {
      throw new UnauthorizedException('Invalid UserID or Password');
    }

    if (user.Isaccountlocked) {
      throw new UnauthorizedException('Account is locked. Contact administrator.');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.PasswordHash,
    );

    if (!isPasswordValid) {
      await pool
        .request()
        .input('EmployeeID', user.EmployeeID)
        .input('flag', 1)
        .execute('USP_UpdateLoginInfo');

      throw new UnauthorizedException('Invalid UserID or Password');
    }

    const isFirstLogin = user.LastLoginDateTime === null;

    // update login ONLY after first login is completed
    if (!isFirstLogin) {
      await pool
        .request()
        .input('EmployeeID', user.EmployeeID)
        .input('flag', 2)
        .execute('USP_UpdateLoginInfo');
    }

    const accessToken = this.jwtService.sign({
      employeeId: user.EmployeeID,
      userId: user.UserID,
    });

    return {
      success: true,
      message: 'Login successful',
      accessToken,
      isFirstLogin,
      data: {
        employeeId: user.EmployeeID,
        userId: user.UserID,
      },
    };
  }

  // ================= VERIFY COMPANY =================
  async verifyCompany(tenantCode: string) {
    const pool = await this.dbService.connect();

    const result = await pool
      .request()
      .execute('USP_GetCompanyInfo');

    const company = result.recordset.find(
      (x) =>
        x.DomainName?.toLowerCase() === tenantCode.toLowerCase(),
    );

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return {
      exists: true,
      companyId: company.CompanyID,
      companyName: company.CompanyCode,
      domain: company.DomainName,
    };
  }

 async resetPassword(userId: string, dto: ResetPasswordDto) {
  const pool = await this.dbService.connect();

  const result = await pool
      .request()
      .input('UseridID', userId)
      .execute('USP_Validateuser');

  const user = result.recordset[0];

  if (!user) {
    throw new BadRequestException('User not found');
  }

  if (user.LastLoginDateTime !== null) {
    throw new ForbiddenException(
      'Password reset is allowed only on first login',
    );
  }

  const passwordMatch = await bcrypt.compare(
    dto.currentPassword,
    user.PasswordHash,
  );

  if (!passwordMatch) {
    throw new BadRequestException('Current password is incorrect');
  }

  if (dto.newPassword !== dto.confirmPassword) {
    throw new BadRequestException('Passwords do not match');
  }

  const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

  await pool
      .request()
      .input('EmployeeID', user.EmployeeID) 
      .input('PasswordHash', hashedPassword)
      .input('Modifiedby', user.EmployeeID)
      .execute('USP_UpdatePassword');
      
  return {
    success: true,
    message: 'Password changed successfully',
  };
}

  // ================= TEMP PASSWORD =================
  private generateTempPassword(length = 10): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';

    let password = '';

    for (let i = 0; i < length; i++) {
      password += chars.charAt(
        Math.floor(Math.random() * chars.length),
      );
    }

    return password;
  }

  async sendTemporaryPassword(employeeId: string) {
    const pool = await this.dbService.connect();

    const result = await pool
      .request()
      .input('EmployeeID', employeeId)
      .execute('USP_ValidateUser');

    const user = result.recordset[0];

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const tempPassword = this.generateTempPassword();

    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await pool
      .request()
      .input('EmployeeID', employeeId)
      .input('PasswordHash', hashedPassword)
      .input('flag', 1)
      .input('Modifiedby', 'SYSTEM')
      .execute('USP_UpdatePassword');

    await this.mailService.sendTempPassword(
      user.Email,
      tempPassword,
    );

    return {
      success: true,
      message: 'Temporary password sent successfully',
    };
  }

  async testMail() {
    return this.mailService.sendTempPassword(
      'test@gmail.com',
      'TEST1234',
    );
  }
}
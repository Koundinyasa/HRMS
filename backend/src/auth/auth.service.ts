import { Injectable, UnauthorizedException, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CaptchaService } from './captcha/captcha.service';
import { LoginDto } from './dto/login.dto';
import { ResetForgotPasswordDto } from './dto/reset-forgot-password.dto';
import { randomBytes } from 'crypto';


@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly captchaService: CaptchaService,
  ) { }

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
      .input('EmailID', dto.userId)
      .execute('USP_Validateuser');

    const user = result.recordset[0];

    if (!user) {
      throw new UnauthorizedException('Invalid UserID or Password');
    }

    if (user.Isaccountlocked) {
      throw new UnauthorizedException('Account is locked. Contact administrator.');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.PasswordHash);

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
      roleId: user.RoleID,
    });


    let loginMessage = 'Login successful';
    if (user.RoleID === 1) {
      loginMessage = 'Super Admin login successful';
    } else if (user.RoleID === 2) {
      loginMessage = 'HR Admin login successful';
    }

    return {
      success: true,
      message: loginMessage,
      accessToken,
      isFirstLogin,
      data: {
        employeeId: user.EmployeeID,
        userId: user.UserID,
        roleId:user.RoleID,
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
      (x) => x.DomainName?.toLowerCase() === tenantCode?.toLowerCase(),
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



  // ================= RESET PASSWORD =================
  async resetPassword(userId: string, dto: ResetPasswordDto) {
    const pool = await this.dbService.connect();

    // Get user using UserID (email)
    const result = await pool
      .request()
      .input('EmailID', userId.trim())
      .execute('USP_Validateuser');

    const user = result.recordset?.[0];

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.LastLoginDateTime !== null) {
      throw new ForbiddenException(
        'Password reset is allowed only on first login',
      );
    }
    // Validate current password
    const isMatch = await bcrypt.compare(
      dto.currentPassword,
      user.PasswordHash,
    );

    if (!isMatch) {
      throw new BadRequestException(
        'Current password is incorrect',
      );
    }

    // Prevent same password reuse
    const samePassword = await bcrypt.compare(
      dto.newPassword,
      user.PasswordHash,
    );

    if (samePassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }

    // Confirm password check
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException(
        'Passwords do not match',
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      dto.newPassword,
      10,
    );

    // USP_UpdatePassword expects EmployeeID
    await pool
      .request()
      .input('EmployeeID', user.EmployeeID)
      .input('PasswordHash', hashedPassword)
      .input('flag', 1)
      .input('Modifiedby', user.EmployeeID)
      .execute('USP_UpdatePassword');

    // STEP 2: Mark first login completed
    await pool
      .request()
      .input('EmployeeID', user.EmployeeID)
      .input('PasswordHash', hashedPassword)
      .input('flag', 2)
      .input('Modifiedby', user.EmployeeID)
      .execute('USP_UpdatePassword');

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }

  // ================= TEMP PASSWORD =================

  private generateTempPassword(length = 10): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
    const bytes = randomBytes(length);
    return Array.from(bytes)
      .map((b) => chars[b % chars.length])
      .join('');
  }

  async sendTemporaryPassword(employeeId: string) {
    const pool = await this.dbService.connect();

    const result = await pool
      .request()
      .input('EmployeeID', employeeId)
      .execute('USP_GetUserInfo');


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


  private generateOtp(): string {
    return Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
  }


  async forgotPassword(userId: string) {
    const pool = await this.dbService.connect();

    const result = await pool
      .request()
      .input('EmailID', userId)
      .execute('USP_Validateuser');

    const user = result.recordset?.[0];

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    const otp = this.generateOtp();

    console.log("OTP", otp);

    const otpResult = await pool
      .request()
      .input('EmployeeID', user.EmployeeID)
      .input('UserID', user.UserID)
      .input('OTP', otp)
      .input('GeneratedOn', new Date())
      .input(
        'ExpiresOn',
        new Date(Date.now() + 3 * 60 * 1000),
      )
      .execute('USP_SaveGeneratedOTP');

    const otpResponse =
      otpResult.recordset[0];

    await this.mailService.sendOtp(
      user.Email,
      otp,
    );

    return {
      success: true,
      message: 'OTP sent successfully',
      employeeId: user.EmployeeID,
      expiresOn: otpResponse.ExpiresOn,
      remainingSeconds:
        otpResponse.RemainingSeconds,
      remainingMinutes:
        otpResponse.RemainingMinutes,
    };
  }



  async verifyOtp(
    employeeId: string,
    otp: string,
  ) {
    const pool = await this.dbService.connect();

    const result = await pool
      .request()
      .input('EmployeeID', employeeId)
      .input('OTP', otp)
      .execute('USP_VerifyOTP');

    const response =
      result.recordset[0];

    if (response.StatusCode === 0) {
      throw new BadRequestException(
        response.Message,
      );
    }

    return {
      success: true,
      message: response.Message,
    };
  }


  async resetForgotPassword(dto: ResetForgotPasswordDto) {
    const pool = await this.dbService.connect();

    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await pool
      .request()
      .input('EmployeeID', dto.employeeId)
      .input('PasswordHash', hashedPassword)
      .input('flag', 2)
      .input('Modifiedby', dto.employeeId)
      .execute('USP_UpdatePassword');

    return {
      success: true,
      message: 'Password updated successfully',
    };
  }
}
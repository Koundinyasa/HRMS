import { Injectable, UnauthorizedException,NotFoundException,BadRequestException,ForbiddenException } from '@nestjs/common';
import * as sql from 'mssql';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CaptchaService } from './captcha/captcha.service';
import { LoginDto } from './dto/login.dto';
import { ResetForgotPasswordDto } from './dto/reset-forgot-password.dto';
import { randomBytes } from 'crypto';
import { DraftService } from '../chatbot/services/draft.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SendWishDto } from './dto/SendWish.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly captchaService: CaptchaService,
    private readonly draftService: DraftService,
  ) { }
  // A login (or logout) is a hard session boundary. Any chatbot flow that
  // was left mid-way — most commonly "apply leave", the one multi-step flow
  // that can be abandoned partway — must not survive into a new session.
  // Drafts are otherwise keyed only by employeeId with a time-based expiry,
  // so without this, a logout/login within that window resumes the old,
  // now-stale flow as if nothing happened.
  private clearChatbotState(employeeId: string): void {
    this.draftService.deleteDraft(this.draftService.leaveDrafts, employeeId);
    this.draftService.deleteDraft(this.draftService.partialCancelDrafts, employeeId);
    this.draftService.deleteDraft(this.draftService.cancelChoiceDrafts, employeeId);
    this.draftService.cancelList.delete(employeeId);
    this.draftService.cancelTarget.delete(employeeId);
  }
 
  // ================= LOGIN =================
   async login(dto: LoginDto) {
     try {
       // ================= CAPTCHA VALIDATION =================
       const captchaValid = this.captchaService.validate(
         dto.captchaId,
         dto.captchaAnswer,
       );

       if (!captchaValid) {
         throw new BadRequestException(
           'Invalid or expired captcha. Please refresh and try again.',
         );
       }

       // ================= DATABASE CONNECTION =================
       const pool = await this.dbService.connect();

       // ================= VALIDATE USER =================
       const result = await pool
         .request()
         .input('EmailID', dto.userId)
         .execute('USP_Validateuser');

       const user = result.recordset?.[0];

       // ================= USER NOT FOUND =================
       if (!user) {
         throw new UnauthorizedException('Invalid UserID or Password');
       }

       // ================= ACCOUNT ALREADY LOCKED =================
       if (user.IsAccountLocked === true || user.IsAccountLocked === 1) {
         throw new UnauthorizedException(
           'Account is locked. Contact administrator.',
         );
       }

       // ================= PASSWORD VALIDATION =================
       const isPasswordValid = await bcrypt.compare(
         dto.password,
         user.PasswordHash,
       );

       // ========================================================
       // WRONG PASSWORD
       // ========================================================
       if (!isPasswordValid) {
         const updateResult = await pool
           .request()
           .input('EmployeeID', sql.VarChar(100), user.EmployeeID)
           .input('flag', sql.Int, 1)
           .output('StatusCode', sql.Int)
           .output('StatusMessage', sql.NVarChar(200))
           .execute('USP_UpdateLoginInfo');

         // Read OUTPUT parameters returned by SP
         const statusCode = updateResult.output?.StatusCode;
         const statusMessage = updateResult.output?.StatusMessage;

         console.log('🔥 LOGIN FAILED UPDATE:', {
           EmployeeID: user.EmployeeID,
           StatusCode: statusCode,
           StatusMessage: statusMessage,
         });

         // ================= ACCOUNT LOCKED =================
         if (statusCode === 2) {
           throw new UnauthorizedException(
             statusMessage || 'Account is locked. Contact administrator.',
           );
         }

         // ================= INVALID PASSWORD =================
         throw new UnauthorizedException(
           statusMessage || 'Invalid UserID or Password',
         );
       }

       // ========================================================
       // FIRST LOGIN CHECK
       // ========================================================
       const isFirstLogin = user.LastLoginDateTime === null;

       // ========================================================
       // SUCCESSFUL LOGIN
       // ========================================================
       // Update login information only after first login
       // has already been completed.
       if (!isFirstLogin) {
         const loginUpdateResult = await pool
           .request()
           .input('EmployeeID', sql.VarChar(100), user.EmployeeID)
           .input('flag', sql.Int, 2)
           .output('StatusCode', sql.Int)
           .output('StatusMessage', sql.NVarChar(200))
           .execute('USP_UpdateLoginInfo');

         console.log('🔥 SUCCESS LOGIN UPDATE:', {
           EmployeeID: user.EmployeeID,
           StatusCode: loginUpdateResult.output?.StatusCode,
           StatusMessage: loginUpdateResult.output?.StatusMessage,
         });
       }

       // ========================================================
       // GENERATE JWT
       // ========================================================
       const accessToken = this.jwtService.sign({
         employeeId: user.EmployeeID,
         userId: user.UserID,
         roleId: user.RoleID,
         companyId: user.CompanyID,
         createdBy: user.Sessionuserid,
         name: user.FullName,
         role:
           user.RoleID === 1 ? 'admin' : user.RoleID === 2 ? 'hr' : 'employee',
       });

       // ========================================================
       // LOGIN MESSAGE
       // ========================================================
       let loginMessage = 'Login successful';

       if (user.RoleID === 1) {
         loginMessage = 'Super Admin login successful';
       } else if (user.RoleID === 2) {
         loginMessage = 'HR Admin login successful';
       }

       // ========================================================
       // CLEAR PREVIOUS CHATBOT SESSION
       // ========================================================
       this.clearChatbotState(String(user.EmployeeID));

       // ========================================================
       // SUCCESS RESPONSE
       // ========================================================
       return {
         success: true,
         message: loginMessage,
         accessToken,
         isFirstLogin,
         data: {
           employeeId: user.EmployeeID,
           userId: user.UserID,
           roleId: user.RoleID,
         },
       };
     } catch (error) {
       throw error;
     }
   }
 
 
 

  // ================= VERIFY COMPANY =================
 async verifyCompany(tenantCode: string) {
  try {
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
  } catch (error) {
    throw error;
  }
}
 
 
 
  // ================= RESET PASSWORD =================
 
  async resetPassword(
    userId: string,
    dto: ResetPasswordDto,
  ) {
    try {
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
    } catch (error) {
      throw error;
    }
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
    try {
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
      await this.mailService.sendTempPassword(user.Email, tempPassword,user.ApplicationURL);
      return {
        success: true,
        message: 'Temporary password sent successfully',
      };
    } catch (error) {
      throw error;
    }
  }
 
  async testMail() {
    return this.mailService.sendTempPassword(
      'test@gmail.com',
      'TEST1234',
    );
  }
 
  // async testMail() {
  //   return this.mailService.sendTempPassword(
  //     'test@gmail.com',
  //     'TEST1234',
  //   );
  // }
 
 
  private generateOtp(): string {
    return Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
  }
 
 
  async forgotPassword(userId: string) {
    try {
      const pool = await this.dbService.connect();
 
      const result = await pool
        .request()
        .input('EmailID', userId)
        .execute('USP_Validateuser');
 
      const user = result.recordset?.[0];
 
      if (!user) {
      throw new NotFoundException('User not found');
    }
 
      const otp = this.generateOtp();
 
      console.log('========================================');
      console.log(`OTP for ${user.UserID}: ${otp}`);
      console.log('========================================');
 
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
    } catch (error) {
      throw error;
    }
  }
 
 
 
  async verifyOtp(
    employeeId: string,
    otp: string,
  ) {
    try {
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
    } catch (error) {
      throw error;
    }
  }
 
 
  async resetForgotPassword(dto: ResetForgotPasswordDto) {
    try {
      const pool = await this.dbService.connect();
 
      const userResult = await pool
        .request()
        .input(
          'EmailID',
          (dto.userId ?? dto.employeeId).trim(),
        )
        .execute('USP_Validateuser');
 
      const user = userResult.recordset?.[0];
 
      if (!user) {
        throw new BadRequestException('User not found');
      }
 
      if (dto.newPassword !== dto.confirmPassword) {
        throw new BadRequestException('Passwords do not match');
      }
 
      const samePassword = await bcrypt.compare(
        dto.newPassword,
        user.PasswordHash,
      );
 
      if (samePassword) {
        throw new BadRequestException(
          'User not found',
        );
      }
 
      const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
 
      await pool
        .request()
        .input(
          'EmployeeID',
          dto.employeeId,
        )
        .input(
          'PasswordHash',
          hashedPassword,
        )
        .input('flag', 2)
        .input(
          'Modifiedby',
          dto.employeeId,
        )
        .execute('USP_UpdatePassword');
 
      return {
        success: true,
        message: 'Password updated successfully',
      };
    } catch (error) {
      throw error;
    }
  }
 
  verifyAccessToken(token: string): Record<string, any> | null {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }
 
  async logout(employeeId: string) {
    try {
      const pool = await this.dbService.connect();
 
      await pool
        .request()
        .input(
          'EmployeeID',
          employeeId,
        )
        .input('flag', 3)
        .execute('USP_UpdateLoginInfo');
 
      // Defense in depth alongside the login-time clear above.
      this.clearChatbotState(String(employeeId));
 
      return {
        success: true,
        message: 'Logout successful',
      };
    } catch (error) {
      throw error;
    }
  }
 
  // ================= CHANGE PASSWORD =================
  async changePassword(userId: string, dto: ChangePasswordDto) {
  try {
    const pool = await this.dbService.connect();
 
    const result = await pool
      .request()
      .input('EmailID', userId.trim())
      .execute('USP_Validateuser');
 
    const user = result.recordset?.[0];
 
    if (!user) {
      throw new BadRequestException('User not found');
    }
 
    const isMatch = await bcrypt.compare(
      dto.currentPassword,
      user.PasswordHash,
    );
 
    if (!isMatch) {
      throw new BadRequestException(
        'Current password is incorrect',
      );
    }
 
    if (dto.newPassword !== dto.confirmPassword) {
      throw new BadRequestException(
        'Passwords do not match',
      );
    }
 
    const samePassword = await bcrypt.compare(
      dto.newPassword,
      user.PasswordHash,
    );
 
    if (samePassword) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }
 
    const hashedPassword = await bcrypt.hash(
      dto.newPassword,
      10,
    );
 
    await pool
      .request()
      .input('EmployeeID', user.EmployeeID)
      .input('PasswordHash', hashedPassword)
      .input('Flag', 2)
      .input('ModifiedBy', user.EmployeeID)
      .execute('USP_UpdatePassword');
 
    return {
      success: true,
      message: 'Password changed successfully',
    };
  } catch (error) {
    throw error;
  }
}

async sendWish(
    senderEmployeeId: string,
    dto: SendWishDto,
  ) {
    try {
      const pool = await this.dbService.connect();
 
 
      // ================= RECIPIENT / WISHED PERSON =================
      const recipientResult = await pool
        .request()
        .input('EmployeeID', dto.employeeId)
        .execute('USP_GetUserInfo');
 
 
      const recipient = recipientResult.recordset[0];
      console.log('RECIPIENT EMPLOYEE ID:', dto.employeeId);
      console.log('SENDER EMPLOYEE ID:', senderEmployeeId);
 
      if (!recipient) {
        throw new NotFoundException(
          'Wished employee not found',
        );
      }
 
      if (!recipient.Email) {
        throw new BadRequestException(
          'Wished employee email not found',
        );
      }
 
      // ================= SENDER / PERSON SENDING WISH =================
      const senderResult = await pool
        .request()
        .input('EmployeeID', senderEmployeeId)
        .execute('USP_GetUserInfo');
 
      const sender = senderResult.recordset[0];
 
      if (!sender) {
        throw new NotFoundException(
          'Sender employee not found',
        );
      }
 
      // ================= SEND EMAIL =================
      await this.mailService.sendCelebrationWish(
        recipient.Email,
        recipient.FullName,
        dto.eventType,
        dto.message,
        sender.FullName,
        sender.Email,
      );
 
      return {
        success: true,
        message: 'Wish sent successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
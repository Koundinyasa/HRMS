// import {
//   Injectable,
//   UnauthorizedException,
//   NotFoundException,
//   BadRequestException,
//   ForbiddenException,
// } from '@nestjs/common';

// import * as bcrypt from 'bcrypt';

// import { DatabaseService } from '../database/database.service';
// import { JwtService } from '@nestjs/jwt';
// import { MailService } from '../mail/mail.service';

// import { ResetPasswordDto } from './dto/reset-password.dto';

// @Injectable()
// export class AuthService {
//   constructor(
//     private readonly dbService: DatabaseService,
//     private readonly jwtService: JwtService,
//     private readonly mailService: MailService,
//   ) {}

//    async login(userId: string, password: string) {
//       const pool = await this.dbService.connect();
  
//       const result = await pool
//         .request()
//         .input('UseridID', userId)
//         .execute('USP_Validateuser');
  
//       console.log('UserId:', userId);
//       console.log('Password:', password);
  
//       const user = result.recordset[0];
  
//       console.log('User:', user);
  
//       if (!user) {
//         throw new UnauthorizedException('Invalid UserID or Password');
//       }
  
//       if (user.Isaccountlocked === 1 || user.Isaccountlocked === true) {
//         throw new UnauthorizedException(
//           'Account is locked. Contact administrator.',
//         );
//       }
  
//       const isPasswordValid = await bcrypt.compare(
//         password,
//         user.PasswordHash,
//       );
//       console.log('Password Match:', isPasswordValid);
  
  
//       if (!isPasswordValid) {
//         await pool
//           .request()
//           .input('EmployeeID', user.EmployeeID)
//           .input('flag', 1)
//           .execute('USP_UpdateLoginInfo');
  
//         throw new UnauthorizedException('Invalid UserID or Password');
//       }
  
//       const isFirstLogin =
//       user.LastLoginDateTime === null;
  
  
//       if (!isFirstLogin){
//         await pool
//         .request()
//         .input('EmployeeID', user.EmployeeID)
//         .input('flag', 2)
//         .execute('USP_UpdateLoginInfo');
  
//       }
      
  
//       const payload = {
//         employeeId: user.EmployeeID,
//         userId: user.UserID,
//       };
  
//       const accessToken = this.jwtService.sign(payload);
  
      
  
//       return {
//         success: true,
//         message: 'Login successful',
//         accessToken,
//         expiresIn: '5m',
//         isFirstLogin,
//         data: {
//           employeeId: user.EmployeeID,
//           userId: user.UserID,
//         },
//       };
//     }


//   async verifyCompany(
//   tenantCode: string,
// ) {
//   const pool = await this.dbService.connect();

//   const result = await pool
//     .request()
//     .execute('USP_GetCompanyInfo');

//   const company = result.recordset.find(
//     (x) =>
//       x.DomainName?.toLowerCase() ===
//       tenantCode.toLowerCase(),
//   );

//   if (!company) {
//     throw new NotFoundException(
//       'Company not found',
//     );
//   }

//   return {
//     exists: true,
//     companyId: company.CompanyID,
//     companyName: company.CompanyCode,
//     domain: company.DomainName,
//   };
// }


// async resetPassword(
//     employeeId: string,
//     dto: ResetPasswordDto,
//   ) {
//     const pool = await this.dbService.connect();

//     const result = await pool
//     .request()
//     .input('EmployeeID', employeeId)
//     .execute('USP_GetUserInfo');

//     const user = result.recordset[0];

//     console.log('User =>', user);

//     if (!user) {
//       throw new BadRequestException('User not found');
//     }

//     // if (user.LastLoginDateTime !== null) {
//     //   throw new ForbiddenException(
//     //     'Password reset is only allowed on first login',
//     //   );
//     // }

//     console.log('DTO:', dto);
//   console.log('currentPassword:', dto?.currentPassword);
//   console.log('PasswordHash:', user?.PasswordHash);
//     const passwordMatch = await bcrypt.compare(
//       dto.currentPassword,
//       user.PasswordHash,
//     );

//     if (!passwordMatch) {
//       throw new BadRequestException(
//         'Current password is incorrect',
//       );
//     }

//     if (dto.newPassword !== dto.confirmPassword) {
//       throw new BadRequestException('Passwords do not match');
//     }

//     const samePassword = await bcrypt.compare(
//       dto.newPassword,
//       user.PasswordHash,
//     );

//     if (samePassword) {
//       throw new BadRequestException(
//         'New password must be different from current password',
//       );
//     }

//     const hashedPassword = await bcrypt.hash(
//       dto.newPassword,
//       10,
//     );

//     // await pool
//     //   .request()
//     //   .input('EmployeeID', employeeId)
//     //   .input('PasswordHash', hashedPassword)
//     //   .execute('USP_UpdatePassword');

//   await pool
//   .request()
//   .input('EmployeeID', employeeId)
//   .input('PasswordHash', hashedPassword)
//   .input('flag', 1)
//   .input('Modifiedby', employeeId)
//   .execute('USP_UpdatePassword');

//   await pool
//   .request()
//   .input('EmployeeID', employeeId)
//   .input('PasswordHash', hashedPassword)
//   .input('flag', 2)
//   .input('Modifiedby', employeeId)
//   .execute('USP_UpdatePassword');

//     return {
//       success: true,
//       message: 'Password changed successfully',
//     };
//   }

//    private generateTempPassword(length = 10): string {
//     const chars =
//       'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
//     let password = '';

//     for (let i = 0; i < length; i++) {
//       password += chars.charAt(
//         Math.floor(Math.random() * chars.length),
//       );
//     }

//     return password;
//   }


//   async sendTemporaryPassword(employeeId: string) {
//       const pool = await this.dbService.connect();
  
//       const result = await pool
//         .request()
//         .input('EmployeeID', employeeId)
//         .execute('USP_ValidateUser');
  
//       const user = result.recordset[0];
  
//       if (!user) {
//         throw new NotFoundException('User not found');
//       }
  
//       // 1. Generate temp password
//       const tempPassword = this.generateTempPassword();

//       console.log('Temp Password:', tempPassword);
  
//       // 2. Hash password
//       const hashedPassword = await bcrypt.hash(
//         tempPassword,
//         10,
//       );
  
//       // 3. Update DB
//       await pool
//         .request()
//         .input('EmployeeID', employeeId)
//         .input('PasswordHash', hashedPassword)
//         .input('flag', 1)
//         .input('Modifiedby', 'SYSTEM')
//         .execute('USP_UpdatePassword');
  
//       // 4. Send email
//       await this.mailService.sendTempPassword(
//         user.Email,
//         tempPassword,
//       );
  
//       return {
//         success: true,
//         message: 'Temporary password sent successfully',
//       };
//     }


//     async testMail() {
//   return this.mailService.sendTempPassword(
//     'nagarjunaputarun@gmail.com',
//     'TEST1234'
//   );
// }

// }



import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotResetPasswordDto } from './dto/forgot-reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // ================= LOGIN =================
  async login(userId: string, password: string) {
    const pool = await this.dbService.connect();

    const result = await pool
      .request()
      .input('UseridID', userId)
      .execute('USP_Validateuser');

    const user = result.recordset[0];

    if (!user) {
      throw new UnauthorizedException('Invalid UserID or Password');
    }

    if (user.Isaccountlocked) {
      throw new UnauthorizedException('Account is locked. Contact administrator.');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
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

  // ================= RESET PASSWORD =================
 async resetPassword(
  userId: string,
  dto: ResetPasswordDto,
) {
  const pool = await this.dbService.connect();

  // Get user using UserID (email)
  const result = await pool
    .request()
    .input('UseridID', userId.trim())
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
      .input('PasswordHash', hashedPassword) // keep because SP parameter exists
      .input('flag', 2)
      .input('Modifiedby', user.EmployeeID)
      .execute('USP_UpdatePassword');

  return {
    success: true,
    message: 'Password reset successfully',
  };
}

//  async resetPassword(req: any, dto: ResetPasswordDto) {
//   const pool = await this.dbService.connect();

//    const userId = req.user?.userId || req.user?.employeeId;

//   const result = await pool
//     .request()
//     .input('UseridID', userId)
//     .execute('USP_Validateuser');

//   const user = result.recordset[0];

//   if (!user) {
//     throw new BadRequestException('User not found');
//   }

//   const passwordMatch = await bcrypt.compare(
//     dto.currentPassword,
//     user.PasswordHash,
//   );

//   if (!passwordMatch) {
//     throw new BadRequestException('Current password is incorrect');
//   }

//   const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

//   await pool
//     .request()
//     .input('EmployeeID', user.EmployeeID)
//     .input('PasswordHash', hashedPassword)
//     .input('flag', 1) // REQUIRED FIX
//     .input('Modifiedby', user.EmployeeID)
//     .execute('USP_UpdatePassword');

//   return {
//     success: true,
//     message: 'Password changed successfully',
//   };
// }

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
      .execute('USP_GetUserInfo');

    const user = result.recordset[0];

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const tempPassword = this.generateTempPassword();

     console.log('EmployeeID:', employeeId);
    console.log('Email:', user.Email);
    console.log('Temp Password:', tempPassword);

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
    .input('UseridID', userId)
    .execute('USP_Validateuser');

  const user = result.recordset?.[0];

  if (!user) {
    throw new NotFoundException(
      'User not found',
    );
  }

  const otp = this.generateOtp();

  console.log("OTP", otp);

  await pool
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

  await this.mailService.sendOtp(
    user.Email,
    otp,
  );

  return {
    success: true,
    message: 'OTP sent successfully',
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

async resetForgotPassword(
  dto: ForgotResetPasswordDto,
) {
  const pool = await this.dbService.connect();

  if (
    dto.newPassword !== dto.confirmPassword
  ) {
    throw new BadRequestException(
      'Passwords do not match',
    );
  }

  const hashedPassword = await bcrypt.hash(
    dto.newPassword,
    10,
  );

  await pool
    .request()
    .input('EmployeeID', dto.employeeId)
    .input('PasswordHash', hashedPassword)
    .input('flag', 1)
    .input('Modifiedby', dto.employeeId)
    .execute('USP_UpdatePassword');

  return {
    success: true,
    message:
      'Password updated successfully',
  };
}


}
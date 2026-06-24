// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class EmployeeService {}


import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';


@Injectable()
export class EmployeeService {
  constructor(
    private readonly dbService: DatabaseService,
  ) {}

  // async login(userId: string, password: string) {
  //   const pool = await this.dbService.connect();

  //   const result = await pool
  //     .request()
  //     .input('UseridID', userId)
  //     .execute('USP_Validateuser');

  //   console.log('UserId:', userId);
  //   console.log('Password:', password);

  //   const user = result.recordset[0];

  //   console.log('User:', user);

  //   if (!user) {
  //     throw new UnauthorizedException('Invalid UserID or Password');
  //   }

  //   if (user.Isaccountlocked === 1 || user.Isaccountlocked === true) {
  //     throw new UnauthorizedException(
  //       'Account is locked. Contact administrator.',
  //     );
  //   }

  //   const isPasswordValid = await bcrypt.compare(
  //     password,
  //     user.PasswordHash,
  //   );
  //   console.log('Password Match:', isPasswordValid);


  //   if (!isPasswordValid) {
  //     await pool
  //       .request()
  //       .input('EmployeeID', user.EmployeeID)
  //       .input('flag', 1)
  //       .execute('USP_UpdateLoginInfo');

  //     throw new UnauthorizedException('Invalid UserID or Password');
  //   }

  //   const isFirstLogin =
  //   user.LastLoginDateTime === null;


  //   if (!isFirstLogin){
  //     await pool
  //     .request()
  //     .input('EmployeeID', user.EmployeeID)
  //     .input('flag', 2)
  //     .execute('USP_UpdateLoginInfo');

  //   }
    

  //   const payload = {
  //     employeeId: user.EmployeeID,
  //     userId: user.UserID,
  //   };

  //   const accessToken = this.jwtService.sign(payload);

    

  //   return {
  //     success: true,
  //     message: 'Login successful',
  //     accessToken,
  //     expiresIn: '5m',
  //     isFirstLogin,
  //     data: {
  //       employeeId: user.EmployeeID,
  //       userId: user.UserID,
  //     },
  //   };
  // }

  // async getProfile(employeeId: string) {
  //   const pool = await this.dbService.connect();

  //   const result = await pool
  //     .request()
  //     .input('EmployeeID', employeeId)
  //     .execute('USP_GetUserInfo');

  //   return {
  //     success: true,
  //     data: result.recordset[0],
  //   };
  // }
  async getProfile(employeeId: string) {
  const pool = await this.dbService.connect();

  const result = await pool
    .request()
    .input('EmployeeID', employeeId)
    .execute('USP_GetUserInfo');

  const profile = result.recordsets?.[0]?.[0];

  if (!profile) {
  throw new NotFoundException('Employee not found');
  }

  const menus = result.recordsets?.[1] || [];

  return {
    success: true,
    data: {
      ...profile,
      menus: this.buildMenuTree(menus),
    },
  };
}

  private buildMenuTree(menus: any[], parentId: number | null = null): any[] {
  return menus
    .filter(menu => (menu.ParentId ?? null) === parentId)
    .sort((a, b) => a.DisplayOrder - b.DisplayOrder)
    .map(menu => ({
      menuId: menu.MenuId,
      menuName: menu.MenuName,
      routeUrl: menu.RouteUrl,
      children: this.buildMenuTree(menus, menu.MenuId),
    }));
}

  async getRoleMenus(employeeId: string) {
  const pool = await this.dbService.connect();

  const result = await pool
    .request()
    .input('EmployeeID', employeeId)
    .execute('USP_GetUserInfo');

  const menus = Array.isArray(result.recordsets?.[1])
  ? result.recordsets[1]
  : [];

  return {
    success: true,
    data: this.buildMenuTree(menus),
  };
}

  async getWelcomeMessage(employeeId: string) {
    const pool = await this.dbService.connect();

    const result = await pool
      .request()
      .input('EmployeeID', employeeId)
      .execute('USP_Welcomemessage');

    return {
      success: true,
      data: result.recordset[0],
    };
  }


// async verifyCompany(
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
//   employeeId: string,
//   dto: ResetPasswordDto,
// ) {
//   const pool = await this.dbService.connect();

//   const result = await pool
//     .request()
//     .input('EmployeeID', employeeId)
//     .execute('USP_Validateuser');

//   const user = result.recordset[0];

//   if (!user) {
//     throw new BadRequestException(
//       'User not found',
//     );
//   }

//   // Allow only first login reset
//   if (user.LastLoginDateTime !== null) {
//     throw new ForbiddenException(
//       'Password reset is only allowed on first login',
//     );
//   }

//   const passwordMatch =
//     await bcrypt.compare(
//       dto.currentPassword,
//       user.PasswordHash,
//     );

//   if (!passwordMatch) {
//     throw new BadRequestException(
//       'Current password is incorrect',
//     );
//   }

//   if (
//     dto.newPassword !== dto.confirmPassword
//   ) {
//     throw new BadRequestException(
//       'Passwords do not match',
//     );
//   }

//   const samePassword =
//     await bcrypt.compare(
//       dto.newPassword,
//       user.PasswordHash,
//     );

//   if (samePassword) {
//     throw new BadRequestException(
//       'New password must be different from current password',
//     );
//   }

//   const hashedPassword =
//     await bcrypt.hash(
//       dto.newPassword,
//       10,
//     );

//   await pool
//     .request()
//     .input('EmployeeID', employeeId)
//     .input('PasswordHash', hashedPassword)
//     .execute('USP_ResetPassword');

//   return {
//     success: true,
//     message:
//       'Password changed successfully',
//   };
// }

//  async resetPassword(
//     employeeId: string,
//     dto: ResetPasswordDto,
//   ) {
//     const pool = await this.dbService.connect();

//     const result = await pool
//       .request()
//       .input('EmployeeID', employeeId)
//       .execute('USP_Validateuser');

//     const user = result.recordset[0];

//     if (!user) {
//       throw new BadRequestException('User not found');
//     }

//     if (user.LastLoginDateTime !== null) {
//       throw new ForbiddenException(
//         'Password reset is only allowed on first login',
//       );
//     }

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

//     await pool
//       .request()
//       .input('EmployeeID', employeeId)
//       .input('PasswordHash', hashedPassword)
//       .execute('USP_ResetPassword');

//     return {
//       success: true,
//       message: 'Password changed successfully',
//     };
//   }

  // =========================
  // 📧 TEMP PASSWORD FEATURE (NEW)
  // =========================

  // private generateTempPassword(length = 10): string {
  //   const chars =
  //     'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
  //   let password = '';

  //   for (let i = 0; i < length; i++) {
  //     password += chars.charAt(
  //       Math.floor(Math.random() * chars.length),
  //     );
  //   }

  //   return password;
  // }

  // async sendTemporaryPassword(employeeId: string) {
  //   const pool = await this.dbService.connect();

  //   const result = await pool
  //     .request()
  //     .input('EmployeeID', employeeId)
  //     .execute('USP_GetUserInfo');

  //   const user = result.recordset[0];

  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   // 1. Generate temp password
  //   const tempPassword = this.generateTempPassword();

  //   // 2. Hash password
  //   const hashedPassword = await bcrypt.hash(
  //     tempPassword,
  //     10,
  //   );

  //   // 3. Update DB
  //   await pool
  //     .request()
  //     .input('EmployeeID', employeeId)
  //     .input('PasswordHash', hashedPassword)
  //     .execute('USP_ResetPassword');

  //   // 4. Send email
  //   await this.mailService.sendTempPassword(
  //     user.Email,
  //     tempPassword,
  //   );

  //   return {
  //     success: true,
  //     message: 'Temporary password sent successfully',
  //   };
  // }

//   async testMail() {
//   return this.mailService.sendTempPassword(
//     'nagarjunaputarun@gmail.com',
//     'TEST1234'
//   );
// }

}
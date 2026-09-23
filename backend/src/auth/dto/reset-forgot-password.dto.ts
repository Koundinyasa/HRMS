// import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

// export class ResetForgotPasswordDto {
//   @IsString()
//   @IsNotEmpty()
//   employeeId!: string;

//   @IsNotEmpty()
//   @MinLength(8)
//   @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
//     message:
//       'Password must contain uppercase, lowercase, number and special character',
//   })
//   newPassword!: string;

//   @IsNotEmpty()
//   confirmPassword!: string;
// }

import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
 
export class ResetForgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  employeeId!: string;
  @IsString()
  userId?: string;
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message:
      'Password must contain uppercase, lowercase, number and special character',
  })
  newPassword!: string;
 
  @IsNotEmpty()
  confirmPassword!: string;
}
 
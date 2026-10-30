import { IsNotEmpty, MinLength, Matches } from 'class-validator';
 
export class ResetForgotPasswordDto {
  // Who is resetting is decided by the reset cookie, not by anything sent here.
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

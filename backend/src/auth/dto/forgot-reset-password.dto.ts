import {
  IsNotEmpty,
  MinLength,
  Matches,
} from 'class-validator';

export class ForgotResetPasswordDto {
  @IsNotEmpty()
  employeeId!: string;

  @IsNotEmpty()
  otp!: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
  )
  newPassword!: string;

  @IsNotEmpty()
  confirmPassword!: string;
}
import { IsNotEmpty, IsString, Length, Matches, MaxLength } from 'class-validator';

export class VerifyOtpDto {
  // The user ID typed on the forgot-password screen (not the employee id).
  @IsString()
  @IsNotEmpty()
  @MaxLength(254)
  userId!: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'OTP must contain digits only' })
  otp!: string;
}

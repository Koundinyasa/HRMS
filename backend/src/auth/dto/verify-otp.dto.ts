import { IsNotEmpty } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  employeeId!: string;

  @IsNotEmpty()
  otp!: string;
}
import { IsString, IsNotEmpty, IsUUID, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @IsUUID('4', { message: 'Invalid captcha session' })
  @IsNotEmpty({ message: 'Captcha ID is required' })
  captchaId: string;

  @IsString()
  @IsNotEmpty({ message: 'Captcha answer is required' })
  captchaAnswer: string;
}
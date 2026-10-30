import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'User ID is required' })
  @MaxLength(254)
  userId!: string;
}

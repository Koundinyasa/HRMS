import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SendWelcomeEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  candidateName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  position!: string;
}

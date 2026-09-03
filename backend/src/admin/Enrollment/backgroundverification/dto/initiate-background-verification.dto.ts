import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InitiateBackgroundVerificationDto {
  @IsNotEmpty()
  @IsString()
  applicationIds!: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
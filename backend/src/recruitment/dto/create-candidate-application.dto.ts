import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
 
export class CreateCandidateApplicationDto {
  @Type(() => Number)
  @IsInt()
  jobOpeningId!: number;
 
  @IsString()
  @IsNotEmpty()
  fullName!: string;
 
  @IsEmail()
  email!: string;
 
  @IsString()
  @IsNotEmpty()
  phone!: string;
 
  @IsOptional()
  @IsString()
  address?: string;
 
  @IsOptional()
  @IsString()
  source?: string;
 
  @IsOptional()
  @IsString()
  referredBy?: string;
}
 
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateEmployeeGeneralDetailsDto {
  @IsString()
  @MaxLength(25)
  employeeId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  genderId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maritalStatusId?: number;

  @IsOptional()
  @IsDateString()
  dob?: string;

  @IsOptional()
  @IsDateString()
  doj?: string;

  @IsOptional()
  @IsDateString()
  dol?: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  grade?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  profilePhoto?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  reportingManagerId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  fatherName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  spouseName?: string;
}

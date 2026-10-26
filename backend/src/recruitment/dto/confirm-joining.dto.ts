import {
  IsDateString,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class ConfirmJoiningDto {
  @IsString()
  @MaxLength(50)
  employeeId!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  initialPassword!: string;

  @IsString()
  @MaxLength(100)
  firstName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @IsInt()
  @Min(1)
  companyId!: number;

  @IsInt()
  @Min(1)
  branchId!: number;

  @IsInt()
  @Min(1)
  deptId!: number;

  @IsInt()
  @Min(1)
  roleId!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  designationId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  reportingManagerId?: string;

  @IsDateString()
  dob!: string;

  @IsInt()
  @Min(1)
  genderId!: number;

  @IsInt()
  @Min(1)
  employmentTypeId!: number;

  @IsInt()
  @Min(1)
  employmentStatusId!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  maritalStatusId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  grade?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  mobileNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  alternateMobileNo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  emergencyNo?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  alternateEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  aadhaarNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  panNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  uanNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  pfNumber?: string;
}

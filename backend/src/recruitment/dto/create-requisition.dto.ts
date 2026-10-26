import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateRequisitionDto {
  @IsOptional()
  @IsInt()
  companyId?: number;

  @IsInt()
  branchId!: number;

  @IsInt()
  designationId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  jobTitle!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  jobDescription!: string;

  @IsInt()
  @Min(1)
  vacancies!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryRangeMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salaryRangeMax?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  experienceRequired?: string;

  @IsOptional()
  @IsInt()
  priority?: number;
}
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateCandidateAssessmentResultDto {
  @IsNotEmpty()
  @IsNumber()
  assessmentId!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  score!: number;

  @IsNotEmpty()
  @IsBoolean()
  isQualified!: boolean;

  @IsOptional()
  @IsString()
  remarks?: string;
}
import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class SkipCandidateAssessmentDto {
  @IsInt()
  applicationId!: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;
}
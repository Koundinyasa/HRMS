import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class ScheduleCandidateAssessmentDto {
  @IsInt()
  applicationId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  assessmentType!: string;

  @IsDateString()
  scheduledDate!: string;
}
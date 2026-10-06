import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class ScheduleCandidateInterviewDto {
  @IsInt()
  applicationId!: number;

  @IsInt()
  interviewTypeId!: number;

  @IsDateString()
  scheduledDate!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  interviewerEmployeeId!: string;
}
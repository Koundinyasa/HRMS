 
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';
 
export class ScheduleCandidateAssessmentDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  applicationId!: number;
 
  @Type(() => Number)
  @IsInt()
  @Min(1)
  assessmentTypeId!: number;
 
  @IsDateString()
  scheduledDate!: string;
}
 
 
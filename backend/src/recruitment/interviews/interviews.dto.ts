import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  Validate,
  ValidateNested,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Type } from 'class-transformer';

@ValidatorConstraint({ name: 'halfStep' })
class HalfStep implements ValidatorConstraintInterface {
  validate(value: unknown) {
    return typeof value === 'number' && Number.isInteger(value * 2);
  }

  defaultMessage() {
    return 'Rating must be in increments of 0.5.';
  }
}

export class InterviewScheduleDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  interviewTypeId!: number;

  @Type(() => Number)
  @IsInt()
  @IsIn([19, 20])
  interviewModeId!: number;

  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date!: string;

  @IsString()
  @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/)
  time!: string;

  @IsString()
  @MaxLength(25)
  @Matches(/\S/)
  interviewerEmployeeId!: string;
}

export class UpdateInterviewDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  @Matches(/\S/)
  roundName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(?:[01]\d|2[0-3]):[0-5]\d$/)
  time?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(15)
  @Max(480)
  durationMinutes?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(6)
  @ArrayUnique()
  @IsString({ each: true })
  @MaxLength(25, { each: true })
  interviewerIds?: string[];

  @IsOptional()
  @IsIn(['video', 'in_person', 'phone'])
  mode?: 'video' | 'in_person' | 'phone';

  @IsOptional()
  @IsString()
  @MaxLength(300)
  locationOrLink?: string;
}

export class InterviewCancelDto {
  @IsString()
  @MaxLength(500)
  @Matches(/\S/)
  reason!: string;
}

export class InterviewListQueryDto {
  @IsOptional()
  @IsIn(['today', 'upcoming', 'past'])
  period?: 'today' | 'upcoming' | 'past';

  @IsOptional()
  @IsString()
  @MaxLength(200)
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;
}

export class InterviewFeedbackDto {
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(5)
  @Validate(HalfStep)
  rating!: number;

  @IsIn(['strong_hire', 'hire', 'hold', 'no_hire'])
  recommendation!: 'strong_hire' | 'hire' | 'hold' | 'no_hire';

  @IsString()
  @MaxLength(4000)
  @Matches(/\S/)
  feedback!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  strengths?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  concerns?: string;
}

export class InterviewCompetencyRatingDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  rating!: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  comments?: string;
}

export class InterviewerCompetencyFeedbackDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ArrayUnique((rating: InterviewCompetencyRatingDto) => rating.categoryId)
  @ValidateNested({ each: true })
  @Type(() => InterviewCompetencyRatingDto)
  feedbackDetails!: InterviewCompetencyRatingDto[];

  @IsString()
  @MaxLength(4000)
  @Matches(/\S/)
  overallFeedback!: string;
}

export class InterviewStatusDto {
  @IsIn(['completed', 'no_show'])
  status!: 'completed' | 'no_show';

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}

import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePollDto {
  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsDateString()
  @IsNotEmpty()
  endDate!: string;

  @IsInt()
  @IsNotEmpty()
  targetAudienceFilterId!: number;

  @IsInt()
  @IsNotEmpty()
  questionTypeId!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  question!: string;
}
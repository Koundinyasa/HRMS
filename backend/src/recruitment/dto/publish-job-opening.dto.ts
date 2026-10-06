import {
  IsDateString,
  IsInt,
} from 'class-validator';

export class PublishJobOpeningDto {
  @IsInt()
  jobOpeningId!: number;

  @IsDateString()
  closingDate!: string;
}
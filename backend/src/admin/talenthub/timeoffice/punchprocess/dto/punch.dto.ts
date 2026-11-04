import {
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class PunchDto {
  @IsDateString()
  date!: string;

  @IsOptional()
  @IsString()
  search?: string;
}
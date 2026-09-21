import {
  IsDateString,
  IsOptional,
} from 'class-validator';

export class MissedPunchEmployeesDto {
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;
}
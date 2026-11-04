import { IsDateString, IsOptional } from 'class-validator';

export class GetAverageOtWorkHoursDto {
  @IsOptional()
  @IsDateString()
  toDate?: string;
}

import { IsDateString, IsOptional } from 'class-validator';

export class GetEarlyOutEmployeesDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}

import { IsDateString, IsOptional } from 'class-validator';

export class GetEarlyInEmployeesDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}

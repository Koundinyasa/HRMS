import { IsDateString, IsOptional } from 'class-validator';

export class GetLateInEmployeesDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}

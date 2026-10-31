import { IsDateString, IsOptional } from 'class-validator';

export class GetOnLeaveEmployeesDto {
  @IsOptional()
  @IsDateString()
  fromDate?: string;
}

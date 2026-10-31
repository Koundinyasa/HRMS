import { IsDateString } from 'class-validator';

export class GetMissedPunchEmployeesDto {
  @IsDateString()
  fromDate!: string;

  @IsDateString()
  toDate!: string;
}

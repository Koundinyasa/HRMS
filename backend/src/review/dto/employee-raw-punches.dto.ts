import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class EmployeeRawPunchesDto {
  @IsString()
  @IsNotEmpty()
  employeeId!: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}
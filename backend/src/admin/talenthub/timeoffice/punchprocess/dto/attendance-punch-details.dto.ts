import {
  IsDateString,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class AttendancePunchDetailsDto {
  @IsDateString()
  @IsNotEmpty()
  date!: string;

  @IsString()
  @IsNotEmpty()
  employeeId!: string;
}
import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class AttendanceOverviewDto {
  @IsString()
  @IsNotEmpty()
  month!: string;

  @IsString()
  @IsNotEmpty()
  employeeId!: string;
}
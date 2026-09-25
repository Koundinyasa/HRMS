import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateAttendanceConfigurationDto {
  @MaxLength(100)
  attendanceName!: string;

  @MaxLength(20)
  shortName!: string;

  @IsInt()
  salaryCalendarDayId!: number;

  @IsInt()
  attendanceTypeId!: number;

  @IsBoolean()
  independent!: boolean;

  @IsBoolean()
  ot2Enable!: boolean;

  @IsBoolean()
  overtime!: boolean;

  @IsBoolean()
  lateInEarlyOut!: boolean;
}

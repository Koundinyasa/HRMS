import {
  IsBoolean,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateHolidayDto {
  @IsString()
  @IsNotEmpty()
  holidayName!: string;

  @IsString()
  @IsNotEmpty()
  holidayDate!: string;

  @IsBoolean()
  nationalHoliday!: boolean;

  @IsBoolean()
  restrictedHoliday!: boolean;
}
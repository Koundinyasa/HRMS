import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UpdateGeoLocationDto {
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  employeeIds!: string[];

  @IsNotEmpty()
  @IsString()
  locationId!: string;

  @IsDateString()
  @IsNotEmpty()
  effectiveDate!: string;
}
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class ReadPunchDataDto {
  @IsNotEmpty()
  @IsString()
  locationId!: string;

  @IsDateString()
  fromDate!: string;

  @IsDateString()
  toDate!: string;
}

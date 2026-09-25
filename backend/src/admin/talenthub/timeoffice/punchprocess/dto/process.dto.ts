import { IsDateString, IsNotEmpty } from 'class-validator';

export class ProcessDto {
  @IsDateString()
  @IsNotEmpty()
  fromDate!: string;

  @IsDateString()
  @IsNotEmpty()
  tillDate!: string;
}

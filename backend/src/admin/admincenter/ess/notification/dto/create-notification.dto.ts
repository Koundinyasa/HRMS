import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  eventName!: string;

  @IsDateString()
  @IsNotEmpty()
  fromDate!: string;

  @IsDateString()
  @IsOptional()
  toDate?: string;
}

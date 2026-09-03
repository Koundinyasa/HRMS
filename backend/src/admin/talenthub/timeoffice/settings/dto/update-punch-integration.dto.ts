import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePunchIntegrationDto {
  @IsOptional()
  @IsString()
  integrationId?: string;

  @IsNotEmpty()
  @IsString()
  locationId!: string;

  @IsNotEmpty()
  @IsString()
  inputType!: string;

  @IsNotEmpty()
  @IsString()
  vendor!: string;

  @IsBoolean()
  userAccessEventApi!: boolean;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  employeeIdMappedTo?: string;

  @IsOptional()
  @IsString()
  customField?: string;

  @IsNotEmpty()
  @IsString()
  autoPunchReadingIntervalType!: string;

  @IsNotEmpty()
  @IsNumber()
  autoPunchReadingIntervalValue!: number;
}
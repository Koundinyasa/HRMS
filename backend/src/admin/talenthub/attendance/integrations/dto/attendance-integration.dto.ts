import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class AttendanceIntegrationDto {
  @IsString()
  description!: string;

  @IsNumber()
  integrationTypeId!: number;

  @IsOptional()
  @IsUrl({}, { message: 'url must be a valid URL' })
  url?: string;

  @ValidateIf((o) => !!o.url)
  @IsNotEmpty({ message: 'userName is required when url is provided' })
  userName?: string;

  @ValidateIf((o) => !!o.url)
  @IsNotEmpty({ message: 'password is required when url is provided' })
  password?: string;

  @IsNumber()
  applicableAttendanceId!: number;

  @IsOptional()
  @IsString()
  present?: string;

  @IsOptional()
  @IsString()
  absent?: string;

  @IsOptional()
  @IsString()
  weeklyOff?: string;

  @IsOptional()
  @IsString()
  holiday?: string;

  @IsOptional()
  @IsBoolean()
  skipHolidays?: boolean;

  @IsOptional()
  @IsNumber()
  autoIntegrationHours?: number;

  @IsOptional()
  @IsNumber()
  calculateOTId?: number;

  @IsOptional()
  @IsString()
  refNo?: string;

  @IsOptional()
  @IsString()
  processDate?: string;

  @IsOptional()
  @IsString()
  firstHalf?: string;

  @IsOptional()
  @IsString()
  secondHalf?: string;

  @IsOptional()
  @IsString()
  otUnits?: string;
}

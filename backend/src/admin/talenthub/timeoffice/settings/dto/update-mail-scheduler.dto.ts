import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateMailSchedulerDto {
  @IsBoolean()
  active!: boolean;

  @IsOptional()
  @IsString()
  scheduleFor?: string;

  @IsOptional()
  @IsString()
  reportingType?: string;

  @IsOptional()
  @IsString()
  reportingFormat?: string;

  @IsOptional()
  @IsString()
  autoMailTo?: string;

  @IsOptional()
  @IsString()
  mailBody?: string;

  @IsOptional()
  @IsString()
  mailSendingType?: string;
}

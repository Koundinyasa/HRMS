import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateGeneralSettingsDto {
  @IsBoolean()
  overTime!: boolean;

  @IsBoolean()
  compensatoryWork!: boolean;

  @IsBoolean()
  workFromHome!: boolean;

  @IsBoolean()
  enableTASupervisor!: boolean;

  @IsBoolean()
  autoShift!: boolean;

  @IsOptional()
  @IsString()
  taProcessStartDate?: string;

  @IsBoolean()
  displayAllScreensBasedOnProcessDate!: boolean;

  @IsOptional()
  @IsString()
  punchSecondsRoundOff?: string;

  @IsOptional()
  @IsNumber()
  duplicatePunchPeriod?: number;

  @IsOptional()
  @IsString()
  mapGeoLocationToClassification?: string;

  @IsBoolean()
  considerPunchDirection!: boolean;

  @IsBoolean()
  doNotDisplayPunchDirection!: boolean;

  @IsOptional()
  @IsString()
  minimumEarlyInAllowed?: string;

  @IsOptional()
  @IsString()
  maximumLateOutAllowed?: string;
}
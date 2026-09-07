import {
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

export class SaveBackgroundVerificationSettingsDto {
  @IsOptional()
  @IsString()
  configKey?: string;

  @IsOptional()
  @IsString()
  configValue?: string;

  @IsOptional()
  @IsBoolean()
  requireExternalVerifier?: boolean;
}
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateLeavePolicySettingsDto {
  @IsOptional()
  @IsString()
  effectiveFrom?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsBoolean()
  hideInESS?: boolean;
}

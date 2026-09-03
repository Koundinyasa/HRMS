import {
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class OnDutyPolicyDto {
  @IsOptional()
  @IsBoolean()
  allowOnDuty?: boolean;

  @IsOptional()
  @IsBoolean()
  requiredApprovalForOdPunches?: boolean;
}
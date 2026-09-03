import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class WorkFromHomePolicyDto {
  @IsOptional()
  @IsBoolean()
  allowWorkFromHome?: boolean;

  @IsOptional()
  @IsNumber()
  maximumWfhAllowed?: number;

  @IsOptional()
  @IsBoolean()
  restrictPastDatedWfhRequest?: boolean;

  @IsOptional()
  @IsString()
  restrictWfhRequestOn?: string;

  @IsOptional()
  @IsBoolean()
  requiredApprovalForWfhPunches?: boolean;
}
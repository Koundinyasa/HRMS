import {
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CompanyConfigurationDto {
  @IsDateString()
  dateOfEstablishment!: string;

  @IsString()
  cin_LPIN!: string;

  @IsString()
  tan!: string;

  @IsString()
  website!: string;

  @IsString()
  address1!: string;

  @IsOptional()
  @IsString()
  address2?: string;

  @IsOptional()
  @IsString()
  address3?: string;

  @IsString()
  contactMobile!: string;

  @IsString()
  companyCode!: string;

  @IsBoolean()
  isPFApplicable!: boolean;

  @IsBoolean()
  isESIApplicable!: boolean;

  @IsBoolean()
  isPTApplicable!: boolean;

  @IsBoolean()
  isTDSApplicable!: boolean;

  @IsBoolean()
  tdsFilingMarToFeb!: boolean;

  @IsBoolean()
  isLWFAvailable!: boolean;

  @IsOptional()
  @IsString()
  companyLogoPath?: string;
}
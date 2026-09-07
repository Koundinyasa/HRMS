import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class EstablishmentConfigurationResponseDto {
  nameAndAddressOfEstablishment!: string;
  nameAndAddressOfEmployer!: string;
  nameAndAddressOfPrincipalEmployer!: string;
  nameAndAddressOfContractor!: string;
  nameAndAddressOfManager!: string;
  natureOfBusiness!: string | null;
}


export class EstablishmentConfigurationDto {

  @IsString()
  establishmentName!: string;

  @IsString()
  establishmentAddress!: string;

  @IsString()
  employerName!: string;

  @IsString()
  employerAddress!: string;

  @IsString()
  principalEmployerName!: string;

  @IsString()
  principalEmployerAddress!: string;


  // CHANGE START
  @IsOptional()
  @IsString()
  contractorName?: string;

  @IsOptional()
  @IsString()
  contractorAddress?: string;

  @IsOptional()
  @IsString()
  managerName?: string;

  @IsOptional()
  @IsString()
  managerAddress?: string;
  // CHANGE END


  @IsOptional()
  @IsString()
  natureOfBusiness?: string;


  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
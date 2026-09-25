import { IsString, IsOptional, IsInt, IsBoolean } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  branchCode!: string;

  @IsString()
  branchName!: string;

  @IsOptional()
  @IsString()
  address1?: string;

  @IsOptional()
  @IsString()
  address2?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsInt()
  stateId?: number;

  @IsOptional()
  @IsInt()
  countryId?: number;

  @IsOptional()
  @IsString()
  zipCode?: string;

  @IsOptional()
  @IsString()
  phoneNo?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

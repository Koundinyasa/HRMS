import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateBranchDto {
  @IsInt()
  branchId!: number;

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
}

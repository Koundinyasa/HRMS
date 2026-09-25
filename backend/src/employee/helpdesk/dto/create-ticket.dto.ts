import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateTicketDto {
  @IsInt()
  departmentId!: number;

  @IsInt()
  categoryId!: number;

  @IsInt()
  subCategoryId!: number;

  @IsOptional()
  @IsString()
  assetNumber?: string;

  @IsString()
  location!: string;

  @IsString()
  contactNo!: string;

  @IsString()
  subject!: string;

  @IsString()
  description!: string;
}

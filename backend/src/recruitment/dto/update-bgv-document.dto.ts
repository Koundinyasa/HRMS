import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateBgvDocumentDto {
  @IsIn(['approved', 'rejected'])
  status!: 'approved' | 'rejected';

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;
}

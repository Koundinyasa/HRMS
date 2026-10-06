import {
  IsInt,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ResumeScreeningDto {
  @IsInt()
  applicationId!: number;

  @IsIn(['APPROVE', 'REJECT'])
  action!: 'APPROVE' | 'REJECT';

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reviewRemarks?: string;
}
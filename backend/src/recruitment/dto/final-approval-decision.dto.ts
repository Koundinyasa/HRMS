import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class FinalApprovalDecisionDto {
  @IsIn(['selected', 'rejected'])
  decision!: 'selected' | 'rejected';

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  remarks?: string;
}

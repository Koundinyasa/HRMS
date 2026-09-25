import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateSeparationApprovalDto {
  @IsInt()
  resignationId!: number;

  @IsInt()
  stageOrder!: number;

  @IsInt()
  actionStatus!: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsBoolean()
  isExitInterviewCompleted?: boolean;
}

import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApproveAssetStageDto {
  @IsNotEmpty()
  @IsInt()
  requestId!: number;

  @IsNotEmpty()
  @IsInt()
  stageOrder!: number;

  @IsNotEmpty()
  @IsInt()
  actionStatusId!: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}

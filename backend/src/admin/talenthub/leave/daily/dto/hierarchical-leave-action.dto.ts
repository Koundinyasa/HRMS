import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class HierarchicalLeaveActionDto {
  @IsInt()
  @Min(1)
  approvalId!: number;

  @IsInt()
  actionStatusId!: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}

import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class HierarchicalLeaveActionDto {

  @Type(() => Number)
  @IsNumber()
  approvalId!: number;

  @Type(() => Number)
  @IsNumber()
  actionStatusId!: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}
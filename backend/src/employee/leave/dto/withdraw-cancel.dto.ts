import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class WithdrawCancelDto {

  @Type(() => Number)
  @IsNumber()
  leaveApplicationId!: number;

  @Type(() => Number)
  @IsNumber()
  actionId!: number;

  @IsOptional()
  @IsString()
  reason?: string;
}
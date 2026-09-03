import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateLeaveAdjustmentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  employeeId!: string;

  @IsInt()
  leaveTypeId!: number;

  @IsNumber()
  @Min(0.01)
  adjustmentDays!: number;

  @IsBoolean()
  isAllot!: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @IsDateString()
  adjustmentMonth!: string;
}
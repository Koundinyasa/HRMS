import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class SaveManualLeaveAllotmentDto {
  @IsString()
  @IsNotEmpty()
  employeeId!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  adjustmentMonth?: number;

  @IsNumber()
  @Min(0.01)
  allotment!: number;
}
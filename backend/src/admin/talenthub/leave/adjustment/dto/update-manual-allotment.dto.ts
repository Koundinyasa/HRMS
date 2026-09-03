import {
  IsArray,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ManualAllotmentEmployeeDto {
  @IsInt()
  employeeId!: number;

  @IsInt()
  allotment!: number;
}

export class UpdateManualAllotmentDto {
  @IsInt()
  policyId!: number;

  @IsInt()
  leaveId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ManualAllotmentEmployeeDto)
  employees!: ManualAllotmentEmployeeDto[];
}
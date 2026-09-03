import {
  IsArray,
  IsInt,
  IsString,
} from 'class-validator';

export class ApplyLeaveDto {
  @IsInt()
  employeeId!: number;

  @IsArray()
  dates!: string[];

  @IsString()
  leaveType!: string;
}
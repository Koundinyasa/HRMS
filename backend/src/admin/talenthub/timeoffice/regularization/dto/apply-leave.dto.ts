import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ApplyLeaveDto {
  @IsInt()
  leaveTypeId!: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}
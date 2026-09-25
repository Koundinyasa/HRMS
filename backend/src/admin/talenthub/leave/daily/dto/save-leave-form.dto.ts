import { IsInt, IsOptional, IsString } from 'class-validator';

export class SaveLeaveFormDto {
  @IsInt()
  employeeId!: number;

  @IsString()
  date!: string;

  @IsString()
  firstHalf!: string;

  @IsString()
  secondHalf!: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}

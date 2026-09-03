import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ShiftMasterDto {
  @IsNotEmpty()
  @IsString()
  shiftName!: string;

  @IsOptional()
  @IsString()
  shiftCode?: string;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
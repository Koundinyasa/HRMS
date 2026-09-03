import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

/* ===========================
   GET Response DTOs
=========================== */

export class PTGroupDto {
  id!: number;
  name!: string;
  state!: string;
}

export class PTSlabResponseDto {
  effectiveFrom!: Date;
  period!: string;
  fromSalary!: number;
  toSalary!: number;
  ptAmount!: number;
}

export class PTConfigurationResponseDto {
  group!: PTGroupDto[];
  slabs!: PTSlabResponseDto[];
}

/* ===========================
   PUT Request DTOs
=========================== */

export class PTSlabDto {
  @IsOptional()
  @IsInt()
  slabId?: number | null;

  @IsNumber()
  fromSalary!: number;

  @IsNumber()
  toSalary!: number;

  @IsNumber()
  ptAmount!: number;
}

export class PTConfigurationDto {
  @IsInt()
  ptGroupId!: number;

  @IsInt()
  stateId!: number;

  @IsDateString()
  effectiveFrom!: string;

  @IsInt()
  periodTypeId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PTSlabDto)
  slabs!: PTSlabDto[];
}
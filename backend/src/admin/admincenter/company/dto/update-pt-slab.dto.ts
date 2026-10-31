import {
  IsInt,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdatePTSlabDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  fromSalary?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  toSalary?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  ptAmount?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
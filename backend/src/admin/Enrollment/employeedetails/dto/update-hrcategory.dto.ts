import { IsOptional, IsInt } from 'class-validator';

export class UpdateHrCategoryDto {
  @IsOptional()
  @IsInt()
  hrCategoryId?: number;
}
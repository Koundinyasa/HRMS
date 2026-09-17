import { IsOptional, IsInt } from 'class-validator';

export class UpdateClassificationDto {
  @IsOptional()
  @IsInt()
  classificationId?: number;
}
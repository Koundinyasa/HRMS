import { IsOptional, IsString } from 'class-validator';

export class UpdateGeneralDto {
  @IsOptional()
  @IsString()
  remarks?: string;
}
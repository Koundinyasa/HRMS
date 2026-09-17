import { IsOptional, IsString } from 'class-validator';

export class UpdateStatutoryDto {
  @IsOptional()
  @IsString()
  remarks?: string;
}
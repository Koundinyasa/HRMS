import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CorrectStatusDto {
  @IsNotEmpty()
  @IsString()
  status!: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
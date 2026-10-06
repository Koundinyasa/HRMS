import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class BgvCandidateDto {
  @IsInt()
  @IsNotEmpty()
  applicationId!: number;

  @IsBoolean()
  @IsNotEmpty()
  isClear!: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;
}
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class RelieveEmployeeDto {
  @IsInt()
  resignationId!: number;

  @IsOptional()
  @IsBoolean()
  relievingLetterIssued?: boolean;

  @IsOptional()
  @IsBoolean()
  experienceLetterIssued?: boolean;

  @IsOptional()
  @IsString()
  remarks?: string;
}

import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class FinalInterviewApprovalDto {
  @IsInt()
  applicationId!: number;

  @IsBoolean()
  isSelected!: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;
}
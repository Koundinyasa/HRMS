import { IsOptional, IsDateString, IsString } from 'class-validator';

export class SubmitResignationDto {
  @IsOptional()
  @IsDateString()
  requestedLastWorkingDate?: string;

  @IsString()
  reason!: string;
}

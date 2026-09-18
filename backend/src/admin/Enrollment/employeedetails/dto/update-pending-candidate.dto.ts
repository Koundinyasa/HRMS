import { IsOptional, IsString } from 'class-validator';

export class UpdatePendingCandidateDto {
  @IsOptional()
  @IsString()
  status?: string;
}
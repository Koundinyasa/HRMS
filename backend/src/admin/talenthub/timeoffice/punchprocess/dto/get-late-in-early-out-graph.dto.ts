import { IsDateString, IsOptional } from 'class-validator';

export class GetLateInEarlyOutGraphDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}

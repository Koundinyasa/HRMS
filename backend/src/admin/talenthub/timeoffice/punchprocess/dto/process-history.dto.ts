import { IsDateString, IsOptional } from 'class-validator';
 
export class ProcessHistoryDto {
  @IsOptional()
  @IsDateString()
  fromDate?: string;
 
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
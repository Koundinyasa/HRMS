import { IsDateString, IsOptional } from 'class-validator';

export class GetYesterdayPresentCountDto {
  @IsOptional()
  @IsDateString()
  date?: string;
}

import {
  IsDateString,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
 
export class CreateEssModuleDto {
  // 1 = Circular, 2 = Notification, 3 = Flash News,
  // 4 = Poll, 5 = Policy
  @IsNumberString({ no_symbols: true })
  essInsightId!: string;
 
  // Mandatory; SP validates the allowed date range.
  @IsDateString()
  fromDate!: string;
 
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;
 
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  categoryId?: string;
 
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  ackTypeId?: string;
 
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  questionTypeId?: string;
 
  @IsOptional()
  @IsString()
  content?: string;
 
  @IsOptional()
  @IsDateString()
  toDate?: string;
 
  // Accepts "true", "false", "1", or "0".
  @IsOptional()
  @Matches(/^(true|false|1|0)$/i, {
    message: 'isDownloadRestricted must be true, false, 1, or 0.',
  })
  isDownloadRestricted?: string;
 
  // 3 = Department, 5 = Designation, null = All Employees.
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  filter?: string;
 
  // Department ID or Designation ID, depending on filter.
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  subFilter?: string;
}
 
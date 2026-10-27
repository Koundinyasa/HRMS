import {
  IsDateString,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
 
export class UpdateEssModuleDto {
  @IsNumberString({ no_symbols: true })
  essInsightId!: string;
 
  // Positive ID ensures this endpoint updates, rather than inserts.
  @Matches(/^[1-9]\d*$/, {
    message: 'id must be a positive whole number.',
  })
  id!: string;
 
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
 
  @IsOptional()
  @Matches(/^(true|false|1|0)$/i, {
    message: 'isDownloadRestricted must be true, false, 1, or 0.',
  })
  isDownloadRestricted?: string;
 
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  filter?: string;
 
  @IsOptional()
  @IsNumberString({ no_symbols: true })
  subFilter?: string;
}
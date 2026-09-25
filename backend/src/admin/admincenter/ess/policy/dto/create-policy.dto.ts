import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePolicyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  policyName!: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @IsInt()
  @IsOptional()
  filterId?: number;

  @IsDateString()
  @IsOptional()
  date?: string;

  @IsInt()
  @IsOptional()
  acknowledgementTypeId?: number;

  @IsBoolean()
  @IsOptional()
  disableAttachmentDownload?: boolean;
}

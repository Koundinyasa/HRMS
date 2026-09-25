import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class AddReminderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  code!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  displayName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  shortLabel!: string;

  @IsInt()
  sortOrder!: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  templateName?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  subject!: string;

  @IsString()
  @IsNotEmpty()
  body!: string;
}

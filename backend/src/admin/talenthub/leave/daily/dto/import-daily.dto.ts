import {
  IsInt,
  IsString,
} from 'class-validator';

export class ImportDailyDto {
  @IsString()
  templateType!: string;

  @IsInt()
  policyId!: number;

  @IsString()
  month!: string;
}
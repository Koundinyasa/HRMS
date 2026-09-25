import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddPunchDto {
  @IsDateString()
  date!: string;

  @IsIn(['In', 'Out'])
  punchType!: string;

  @IsNotEmpty()
  @IsString()
  time!: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}

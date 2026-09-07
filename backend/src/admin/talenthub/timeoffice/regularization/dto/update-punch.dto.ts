import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePunchDto {
  @IsIn(['In', 'Out'])
  punchType!: string;

  @IsNotEmpty()
  @IsString()
  time!: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
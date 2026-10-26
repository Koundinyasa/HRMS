import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateBgvDto {
  @IsIn(['clear', 'failed'])
  status!: 'clear' | 'failed';

  @IsOptional()
  @IsString()
  @MaxLength(500)
  remarks?: string;
}

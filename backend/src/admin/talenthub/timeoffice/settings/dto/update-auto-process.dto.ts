import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateAutoProcessDto {
  @IsNotEmpty()
  @IsIn(['SECONDS', 'MINUTES', 'HOURS', 'DAILY', 'MONTHLY'])
  intervalType!: string;

  @IsNotEmpty()
  @IsNumber()
  intervalValue!: number;
}

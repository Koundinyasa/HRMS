import { IsInt } from 'class-validator';

export class ImportLeaveAdjustmentDto {
  @IsInt()
  templateTypeId!: number;

  @IsInt()
  payMonthId!: number;
}

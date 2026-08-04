import {
  IsInt,
  IsString,
} from 'class-validator';

export class WithdrawResignationDto {
  @IsInt()
  resignationId!: number;

  @IsString()
  withdrawalReason!: string;
}
import {
  IsInt,
  IsNotEmpty,
} from 'class-validator';

export class UnblockUserDto {
  @IsInt()
  @IsNotEmpty()
  userId!: number;
}
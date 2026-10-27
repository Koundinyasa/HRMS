import { IsInt, IsString } from 'class-validator';

export class ReprocessDto {
  @IsInt()
  policyId!: number;

  @IsString()
  month!: string;
}

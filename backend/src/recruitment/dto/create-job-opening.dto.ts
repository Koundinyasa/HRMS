import { IsInt } from 'class-validator';

export class CreateJobOpeningDto {
  @IsInt()
  requisitionId!: number;
}
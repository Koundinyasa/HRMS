import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateCandidateOfferDto {
  @IsInt()
  applicationId!: number;

  @IsNumber()
  @Min(0.01)
  offeredSalary!: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  negotiatedSalary?: number;
}
import { IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateOfferDto {
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  offeredSalary?: number;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  negotiatedSalary?: number | null;
}

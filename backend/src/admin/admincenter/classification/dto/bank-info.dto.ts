import { IsNotEmpty, IsString } from 'class-validator';

export class BankInfoDto {
  @IsNotEmpty()
  @IsString()
  ifsc!: string;
}

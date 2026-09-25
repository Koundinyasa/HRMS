import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UpdatePolicyDto {
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  employeeIds!: string[];

  @IsNotEmpty()
  @IsString()
  fromPolicyId!: string;

  @IsNotEmpty()
  @IsString()
  toPolicyId!: string;

  @IsDateString()
  @IsNotEmpty()
  effectiveDate!: string;

  @IsBoolean()
  temporary!: boolean;
}

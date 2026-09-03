import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateEmployeeStatusDto {
  @IsNotEmpty()
  @IsInt()
  userId!: number;

  @IsNotEmpty()
  @IsString()
  @IsIn([
    'LOCK',
    'UNLOCK',
    'RESET_PASSWORD',
  ])
  securityAction!: string;

  @IsOptional()
  @IsString()
  passwordHash?: string;
}
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  employeeId!: string;

  @IsNotEmpty()
  @IsInt()
  roleId!: number;

  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsOptional()
  @IsString()
  passwordHash?: string;
}

import { IsInt, IsEmail, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsInt()
  roleId!: number;

  @IsEmail()
  email!: string;

  @IsString()
  mobile!: string;
}

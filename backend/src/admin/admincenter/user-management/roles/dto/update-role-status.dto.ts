import { IsNotEmpty, IsBoolean } from 'class-validator';

export class UpdateRoleStatusDto {
  @IsNotEmpty()
  @IsBoolean()
  isActive!: boolean;
}

import { IsBoolean, IsInt } from 'class-validator';

export class UpdateBranchStatusDto {
  @IsInt()
  branchId!: number;

  @IsBoolean()
  isActive!: boolean;
}

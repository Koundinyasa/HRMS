import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class UpdateAssetTypeStatusDto {
  @IsNotEmpty()
  @IsString()
  assetName!: string;

  @IsNotEmpty()
  @IsInt()
  @IsIn([0, 1])
  isActive!: number;
}

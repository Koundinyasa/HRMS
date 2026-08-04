import {
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class UpdateAssetTypeDto {
  @IsNotEmpty()
  @IsString()
  assetName!: string;

  @IsNotEmpty()
  @IsString()
  newAssetName!: string;
}
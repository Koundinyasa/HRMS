import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAssetTypeDto {
  @IsNotEmpty()
  @IsString()
  assetName!: string;
}

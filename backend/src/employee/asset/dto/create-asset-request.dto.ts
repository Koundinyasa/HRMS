import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateAssetRequestDto {
  @IsNotEmpty()
  @IsInt()
  assetId!: number;

  @IsNotEmpty()
  @IsString()
  remarks!: string;
}

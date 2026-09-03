import {
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateAssetAllocationDto {
  @IsNotEmpty()
  @IsInt()
  assetRequestId!: number;

  @IsNotEmpty()
  @IsString()
  assetNumber!: string;

  @IsNotEmpty()
  @IsString()
  configuration!: string;

  @IsNotEmpty()
  @IsString()
  assetCondition!: string;

  @IsNotEmpty()
  @IsString()
  location!: string;

  @IsNotEmpty()
  @IsString()
  assignedBy!: string;
}
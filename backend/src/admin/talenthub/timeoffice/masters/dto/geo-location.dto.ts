import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class GeoLocationDto {
  @IsNotEmpty()
  @IsString()
  locationName!: string;

  @IsOptional()
  @IsString()
  locationCode?: string;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsOptional()
  @IsString()
  radius?: string;
}
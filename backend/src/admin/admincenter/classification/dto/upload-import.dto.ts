import { IsNotEmpty, IsString } from 'class-validator';

export class UploadImportDto {
  @IsString()
  @IsNotEmpty()
  templateType!: string;
}

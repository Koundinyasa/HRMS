import {
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateDocumentsDto {
  @IsOptional()
  @IsString()
  documentTypeId?: string;

  @IsOptional()
  @IsString()
  documentName?: string;
}
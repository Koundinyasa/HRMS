import { IsInt, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UploadCandidateDocumentDto {
  @IsInt()
  @IsNotEmpty()
  applicationId!: number;

  @IsInt()
  @IsNotEmpty()
  documentType!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  documentUrl!: string;
}
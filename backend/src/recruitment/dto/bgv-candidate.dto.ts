import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class BgvDocumentVerificationDto {
  @IsInt()
  @Min(1)
  documentId!: number;

  @IsString()
  @IsIn(['Approved', 'Rejected'])
  verificationStatus!: 'Approved' | 'Rejected';

  @ValidateIf((document: BgvDocumentVerificationDto) =>
    document.verificationStatus === 'Rejected',
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  remarks?: string;
}

export class BgvCandidateDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => BgvDocumentVerificationDto)
  documents!: BgvDocumentVerificationDto[];
}

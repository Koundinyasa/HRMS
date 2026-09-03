import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ReopenTicketDto {
  @IsInt()
  ticketId!: number;

  @IsString()
  @IsNotEmpty()
  remarks!: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsString()
  filePath?: string;
}
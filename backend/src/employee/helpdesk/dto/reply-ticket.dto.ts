import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReplyTicketDto {
  @Type(() => Number)
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
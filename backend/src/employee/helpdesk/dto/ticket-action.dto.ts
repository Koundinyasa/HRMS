import { IsInt, IsOptional, IsString } from 'class-validator';

export class TicketActionDto {
  @IsInt()
  ticketId!: number;

  @IsInt()
  actionStatusId!: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}

import {
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class AssignTicketDto {
  @IsInt()
  ticketId!: number;

  @IsString()
  @IsNotEmpty()
  assignToEmployeeId!: string;
}
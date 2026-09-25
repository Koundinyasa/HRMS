import { IsInt, IsNotEmpty } from 'class-validator';

export class ResendInvitationDto {
  @IsNotEmpty()
  @IsInt()
  employeeId!: number;
}

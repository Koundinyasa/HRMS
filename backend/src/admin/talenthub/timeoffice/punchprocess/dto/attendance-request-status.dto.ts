import { IsNotEmpty, IsString } from 'class-validator';

export class AttendanceRequestStatusDto {
  @IsString()
  @IsNotEmpty()
  employeeId!: string;
}

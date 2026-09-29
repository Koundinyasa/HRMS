import { IsIn, IsNotEmpty, IsString } from 'class-validator';
export class SendWishDto {
  @IsNotEmpty()
  @IsString()
  employeeId!: string;
 
  @IsNotEmpty()
  @IsIn(['BIRTHDAY', 'WORK_ANNIVERSARY'])
  eventType!: 'BIRTHDAY' | 'WORK_ANNIVERSARY';
 
  @IsNotEmpty()
  @IsString()
  message!: string;
}
import { IsDateString } from 'class-validator';

export class UpdateJoiningDto {
  @IsDateString()
  joiningDate!: string;
}

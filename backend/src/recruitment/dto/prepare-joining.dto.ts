import { IsDateString, IsInt, Min } from 'class-validator';

export class PrepareJoiningDto {
  @IsInt()
  @Min(1)
  applicationId!: number;

  @IsDateString()
  joiningDate!: string;
}

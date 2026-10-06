import { IsDateString, IsInt } from 'class-validator';

export class ApproveCandidateJoiningDto {
  @IsInt()
  applicationId!: number;

  @IsDateString()
  joiningDate!: string;
}
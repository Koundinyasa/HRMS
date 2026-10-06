import { IsInt, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class SubmitInterviewFeedbackDto {
  @IsInt()
  interviewId!: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating!: number;

  @IsString()
  @IsNotEmpty()
  feedback!: string;
}
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SendInterviewInvitationDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  candidateName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  position!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  interviewerName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  scheduledDate!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5)
  scheduledTime!: string;
}

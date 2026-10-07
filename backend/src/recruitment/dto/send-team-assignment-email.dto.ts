import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class SendTeamAssignmentEmailDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(254)
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  employeeName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  department!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  team!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  manager!: string;
}

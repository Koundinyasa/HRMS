import {IsNotEmpty,MinLength,Matches} from 'class-validator';


export class ResetPasswordDto {
  @IsNotEmpty()
  currentPassword!: string;

  @IsNotEmpty()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
    {
      message:
        'Password must contain uppercase, lowercase, number and special character',
    },
  )
  newPassword!: string;

  @IsNotEmpty()
  confirmPassword!: string;
}
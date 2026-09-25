import { IsBoolean, IsInt } from 'class-validator';

export class UpdateReminderStatusDto {
  @IsInt()
  reminderTypeId!: number;

  @IsBoolean()
  isActive!: boolean;
}

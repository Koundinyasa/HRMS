export class ReminderEmailConfigurationResponseDto {
  ID!: number;
  CompanyID!: number;
  ReminderTypeID!: number;
  ReminderType!: string;

  FromEmail!: string | null;
  ToRecipient!: string | null;
  CCRecipient!: string | null;

  ReminderBefore!: number;

  IsHRMS!: boolean;
  IsSendMail!: boolean;
  IsActive!: boolean;
}
export class ReminderDetailsResponseDto {
  ID!: number;
  CompanyID!: number;
  ReminderTypeID!: number;
  ReminderType!: string;

  ReminderBefore!: number;

  FromEmail!: string | null;
  ToRecipient!: string | null;
  CCRecipient!: string | null;

  IsHRMS!: boolean;
  IsSendMail!: boolean;
  IsActive!: boolean;

  TemplateName!: string | null;
  Subject!: string | null;
  Body!: string | null;
}
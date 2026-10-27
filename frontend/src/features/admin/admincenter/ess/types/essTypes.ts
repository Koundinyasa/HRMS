export type EssInsightId = 1 | 2 | 3 | 4;

export type EssModuleType = "CURRENT" | "PREVIOUS";

export interface EssModuleRow {
  ID?: number;
  Id?: number;
  id?: number;
  Name?: string;
  CategoryID?: number;
  AckTypeID?: number;
  AckTypeName?: string;
  Description?: string;
  FilePath?: string;
  EventName?: string;
  FlashNews?: string;
  Question?: string;
  QuestionTypeID?: number;
  QuestionTypeName?: string;
  StartDate?: string;
  EndDate?: string;
  FromDate?: string;
  ToDate?: string;
  Status?: string;
  StatusCode?: string;
  Message?: string;
  [key: string]: unknown;
}

export interface EssModuleResponse {
  success: boolean;
  message: string;
  data: EssModuleRow[];
}

export interface EssSaveResponse {
  success: boolean;
  message: string;
  data: {
    recordId: number;
    filePath: string | null;
  };
}

export interface SaveEssModulePayload {
  essInsightId: EssInsightId | number;
  fromDate: string;
  id?: number | string;
  toDate?: string;
  title?: string;
  content?: string;
  categoryId?: number | string;
  ackTypeId?: number | string;
  questionTypeId?: number | string;
  file?: File | null;
}

export interface CircularFormData {
  circularName: string;
  description: string;
  filter: string;
  date: string;
  acknowledgementType: string;
  file: File | null;
}

export interface CircularValidationErrors {
  circularName?: string;
}

export interface NotificationFormErrors {
  eventName: string;
  fromDate: string;
}

export interface NotificationFormState {
  eventName: string;
  notificationText: string;
  fromDate: string;
  toDate: string;
  attachment: File | null;
}

export interface PollFormState {
  startDate: string;
  endDate: string;
  questionType: string;
  question: string;
}

export interface FlashNewsFormState {
  content: string;
  fromDate: string;
  toDate: string;
}
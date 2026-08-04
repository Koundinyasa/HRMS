export interface ChatAction {
  label: string;
  send: string;
}

export interface ChatLeaveTypeOption {
  code: string;
  name: string;
  balance: number | null;
}

export interface ChatTeamMember {
  employeeId: string;
  name: string;
  designation: string;
}

export interface ChatListPreviewRow {
  primary: string;
  secondary?: string;
  meta?: string;
  status?: string;
  tone?: "pending" | "success" | "danger" | "neutral";
  action?: string;
}

export interface ChatDataCardField {
  label: string;
  value: string;
}

export interface ChatWidget {
  type: "date" | "leaveTypes" | "download" | "teamPreview" | "listPreview" | "dataCard" | "notice" | "steps";
  step?: string;
  minDate?: string;
  options?: ChatLeaveTypeOption[];
  url?: string;
  filename?: string;
  teamName?: string;
  members?: ChatTeamMember[];
  listTitle?: string;
  listRows?: ChatListPreviewRow[];
  cardTitle?: string;
  cardSubtitle?: string;
  cardFields?: ChatDataCardField[];
  noticeTone?: "info" | "warning" | "danger";
  stepsTitle?: string;
  stepsList?: string[];
  stepsNote?: string;
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  actions?: ChatAction[];
  widget?: ChatWidget;
  retryText?: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  success: boolean;
  userMessage: string;
  botResponse: string;
  actions: ChatAction[];
  widget: ChatWidget | null;
  confidence: string;
  timestamp: string;
  user: Record<string, unknown>;
}
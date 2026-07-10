export interface ChatAction {
  label: string;
  send: string;
}



export interface ChatLeaveTypeOption {
  code: string;
  name: string;
  balance: number | null;
}

export interface ChatWidget {
  type: "date" | "leaveTypes";
  step?: string;
  minDate?: string;
  options?: ChatLeaveTypeOption[];
}

export interface ChatMessage {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  actions?: ChatAction[];
  widget?: ChatWidget;
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
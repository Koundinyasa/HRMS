export interface Stamped<T> {
  data: T;
  savedAt: number;
}
 
export interface ChatResult {
  success: boolean;
  userMessage: string;
  botResponse: string;
  actions: { label: string; send: string }[];
  widget: unknown;
  confidence: 'LOCAL' | 'AI' | 'FALLBACK';
  timestamp: Date;
  user: { name: string; role: string };
}
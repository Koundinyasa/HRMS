export type LeaveStep =
  | 'awaiting_start'
  | 'awaiting_end'
  | 'awaiting_type'
  | 'awaiting_dayChoice'
  | 'awaiting_session'
  | 'awaiting_reason'
  | 'ready';

export interface LeaveDraft {
  leaveType: string;
  leaveDate: string;
  startDate: string;
  endDate: string;
  duration: number;
  dayType: string;
  reason: string;
  step: LeaveStep;
  isHalfDay: boolean;
  session: string;
}

export interface PartialCancelDraft {
  requestCode: string;
  dates: string[];
  originalRequest: Record<string, any>;
}

export interface CancelChoiceDraft {
  requestCode: string;
  specificDate: string;
  fullLeave: Record<string, any>;
}

export interface LeaveTypeOption {
  code: string;
  name: string;
  balance: number | null;
}
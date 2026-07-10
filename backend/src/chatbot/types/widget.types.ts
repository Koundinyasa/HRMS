import { LeaveTypeOption } from './leave.types';

export interface ActionButton {
  label: string;
  send: string;
}

export interface ResponseWidget {
  type: 'date' | 'leaveTypes';
  step?: string;
  minDate?: string;
  options?: LeaveTypeOption[];
}

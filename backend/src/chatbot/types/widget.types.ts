import { LeaveTypeOption } from './leave.types';
import { TeamMember } from './team.types';

export interface ActionButton {
  label: string;
  send: string;
}

export interface ListPreviewRow {
  primary: string;
  secondary?: string;
  meta?: string;
  status?: string;
  tone?: 'pending' | 'success' | 'danger' | 'neutral';
  action?: string;
}

export interface DataCardField {
  label: string;
  value: string;
}

export interface ResponseWidget {
  type:
    | 'date'
    | 'leaveTypes'
    | 'download'
    | 'teamPreview'
    | 'listPreview'
    | 'dataCard'
    | 'notice'
    | 'steps';
  step?: string;
  minDate?: string;
  holidays?: { date: string; name?: string }[];
  leaveDates?: { date: string; leaveType: string; status: string }[];
  options?: LeaveTypeOption[];
  url?: string;
  filename?: string;
  teamName?: string;
  members?: TeamMember[];
  listTitle?: string;
  listRows?: ListPreviewRow[];
  cardTitle?: string;
  cardSubtitle?: string;
  cardFields?: DataCardField[];
  noticeTone?: 'info' | 'warning' | 'danger';
  stepsTitle?: string;
  stepsList?: string[];
  stepsNote?: string;
}

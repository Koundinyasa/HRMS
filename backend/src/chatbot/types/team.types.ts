export type TeamStep =
  | 'awaiting_team'
  | 'awaiting_action'
  | 'viewed'
  | 'awaiting_format'
  | 'ready_download';

export interface TeamListItem {
  id: number;
  name: string;
  badgeColor: string;
}

export interface TeamMember {
  employeeId: string;
  name: string;
  designation: string;
}

export interface TeamDraft {
  step: TeamStep;
  teams: TeamListItem[]; // snapshot fetched once, so we don't re-query on every reply
  teamId: number | null;
  teamName: string;
  action: 'view' | 'download' | '';
  format: 'pdf' | 'excel' | '';
  members: TeamMember[]; // populated when 'view' fetches data, reused by the preview widget
}

export type EmployeeDirectoryStep =
  | 'awaiting_action'
  | 'viewed'
  | 'awaiting_format'
  | 'ready_download';

export interface EmployeeDirectoryDraft {
  step: EmployeeDirectoryStep;
  action: 'view' | 'download' | '';
  format: 'pdf' | 'excel' | '';
  // Snapshot of ctx.directory taken once when the flow starts, so the
  // 'viewed' step (built later in response.service.ts, which has no
  // access to ctx) can still render the roster without re-fetching it.
  directory: { id: string; name: string; designation: string }[];
}
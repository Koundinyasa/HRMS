export type ExitEmployee = {
  id: number;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  joiningDate: string;
  relievingDate: string;
  exitReason: string;
  status: string;
};

/** Generic option shape used by every checkbox filter dropdown (Branch,
 * Salary Structure, Leave, Attendance, Designation, Emp Status, Query). */
export type ExitFilterOption = {
  id: string;
  label: string;
};

export type ExitReportKind =
  | "exit-report"
  | "relieving-letter"
  | "experience-letter";

export type ExitReportFilters = {
  search: string;
  query: string[];
  branch: string[];
  salaryStructure: string[];
  leave: string[];
  attendance: string[];
  designation: string[];
  empStatus: string[];
};

export type LetterEmployee = {
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  joiningDate: string;
  relievingDate: string;
};

export type RelievingLetterData = {
  employee: LetterEmployee;
  letterDate: string;
};

export type ExperienceLetterData = {
  employee: LetterEmployee;
  letterDate: string;
};

export type AuditLogEntry = {
  id: string | number;
  recordDetails: string;
  recordChanges: string;
  actionTime: string;
  user: string;
  employeeName: string;
};

export type AuditLogQuery = {
  reportType: ExitReportKind;
  search?: string;
  employee?: string[];
  action?: string[];
};

export interface CandidateDashboardStats {
  total: number;
  progress: number;
  completed: number;
}

export interface Candidate {
  id: number;
  candidateName: string;
  email: string;
  mobile: string;
  joiningDate: string;
  status?: string;
}

export interface CandidateForm {
  candidateName: string;
  email: string;
  mobile: string;
  joiningDate: string;
}

export type CandidateStatus = "Completed" | "Pending";

export interface CompletedCandidateRow {
  id: number;
  name: string;
  email: string;
  mobile: string;
  joiningDate: string;
  designation: string;
  employeeId: string;
  reportingTo: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  profilePhotoUrl: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  qualification: string;
  status: string;
  progress: number;
}

export interface CandidateTaskItem {
  id: string;
  activity: string;
  status: CandidateStatus;
}

export interface CandidateDocumentItem {
  id: string;
  label: string;
  fileName: string;
}

export interface OffboardCandidate {
  id: number;
  candidateName: string;
  email: string;
  mobile: string;
  joiningDate?: string;
  offboardDate?: string;
  reason?: string;
  status?: string;
}

export type SettingsTab =
  | "general-settings"
  | "mail-settings"
  | "notification-settings";

export interface PreEnrollmentSettings {
  onboardingPolicy?: string;
  notificationEnabled?: boolean;
  mailEnabled?: boolean;
}

export interface ImportCandidateRow {
  id: number;
  fileName: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  status: string;
  uploadedOn: string;
}

export type PreEnrollmentTab =
  | "dashboard"
  | "candidate"
  | "completed-candidate"
  | "offboard"
  | "settings"
  | "import";

export interface DashboardStat {
  id: number;
  title: string;
  value: number;
  icon: string;
  iconBg: string;
  iconColor: string;
}

export interface ChartData {
  month: string;
  candidates: number;
  joined: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  scheduledFor: string;
  done?: boolean;
}

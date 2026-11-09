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
 
export interface UnavailableProfileSection {
  status: "unavailable";
  reason: string;
}
 
export type EmployeeProfileValue = string | number | boolean | null;
 
export interface EmployeeProfileField {
  label: string;
  value: EmployeeProfileValue;
}
 
export interface EmployeeProfileRecord {
  heading?: string;
  fields: EmployeeProfileField[];
}
 
export interface EmployeeProfileSection {
  title: string;
  icon: string;
  fields?: EmployeeProfileField[];
  records?: EmployeeProfileRecord[];
}
 
export interface EmployeeBusinessProfile {
  sections: EmployeeProfileSection[];
  identity: {
    employeeId: string | null;
    fullName: string | null;
    firstName: string | null;
    lastName: string | null;
    profilePhoto: string | null;
    dateOfBirth: string | null;
    gender: string | null;
  };
  employment: {
    dateOfJoining: string | null;
    dateOfLeaving: string | null;
    grade: string | number | null;
  };
  organization: {
    companyName: string | null;
    branchName: string | null;
    departmentName: string | null;
    designationName: string | null;
    reportingManagerName: string | null;
    employmentType: string | null;
    employmentTypeId: string | null;
    employmentStatus: string | null;
    employmentStatusId: string | null;
  };
  contact: {
    email: string | null;
    mobileNo: string | null;
    alternateMobileNo: string | null;
    emergencyNo: string | null;
    alternateEmail: string | null;
  };
  unavailableSections: {
    education: UnavailableProfileSection;
    experience: UnavailableProfileSection;
    address: UnavailableProfileSection;
  };
}
 
export interface ChatWidget {
  type: "date" | "leaveTypes" | "download" | "teamPreview" | "listPreview" | "dataCard" | "notice" | "steps";
  step?: string;
  minDate?: string;
  holidays?: { date: string; name?: string }[];
  leaveDates?: {
    date: string;
    leaveType: string;
    status: string;
    leaveId?: number;
    sessionFrom?: string;
    sessionTo?: string;
    isHalfDay?: boolean;
  }[];
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
  /** Data the page should reload because this reply changed it. */
  refresh?: "leave"[];
  employeeProfile?: EmployeeBusinessProfile;
}

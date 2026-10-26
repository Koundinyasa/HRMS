// ======================================================
// UI TYPES (original)
// ======================================================

export type RecruitmentTab =
  | "pipeline"
  | "openings"
  | "interviews"
  | "approvals";
export type CandidateStage =
  | "Applied"
  | "Screening"
  | "Interview"
  | "Documents"
  | "Offer"
  | "Hired";

export type Candidate = {
  id: number;
  name: string;
  email?: string;
  candidateCode?: string;
  role: string;
  stage: CandidateStage;
  rating: number;
  daysInStage: number;
  resumeUrl?: string;
};

export type InterviewSchedule = {
  interviewerName: string;
  date: string;
  time: string;
};

export type JobOpening = {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  applicants: number | null;
  positions: number;
  positionsFilled: number;
  status: "Open" | "Pending approval" | "Sent back" | "Draft" | "On hold";
  posted: string;
};

export type ApprovalStatus = "waiting" | "ready" | "sent-back";
export type ApprovalStep = {
  name: string;
  role: string;
  status: "submitted" | "approved" | "reviewing" | "waiting" | "sent-back";
  date?: string;
  note?: string;
};
export type Approval = {
  id: number;
  openingId?: number;
  title: string;
  department: string;
  location: string;
  requestedBy: string;
  requestedDate: string;
  positions: number;
  reason: string;
  salaryBand: string;
  targetJoining: string;
  justification: string;
  jobDescription: string;
  status: ApprovalStatus;
  chain: ApprovalStep[];
};

// ======================================================
// API REQUEST / RESPONSE TYPES (used by recruitment.api.ts)
// ======================================================

export interface CreateRequisitionRequest {
  branchId: number;
  designationId: number;
  jobTitle: string;
  vacancies: number;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  experienceRequired?: string;
  priority?: number;
}

export interface RequisitionActionRequest {
  requisitionId: number;
  action: "APPROVE" | "REJECT";
  reviewRemarks?: string;
}

export interface RequisitionMasterResponse {
  success: boolean;
  data: {
    companies: Record<string, unknown>[];
    branches: Record<string, unknown>[];
    departments: Record<string, unknown>[];
    designations: Record<string, unknown>[];
  };
}

export interface CandidateApplicationRequest {
  jobOpeningId: number;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  resume?: File;
  source?: string;
  referredBy?: string;
}

export interface RecruitmentDashboardResponse {
  success: boolean;
  data: {
    applications: unknown[];
    summary: Record<string, number>;
  };
  message?: string;
}

export interface RecruitmentLookupResponse {
  success: boolean;
  data: unknown[];
  message?: string;
}

export interface RecruitmentEmailResponse {
  success: boolean;
  message: string;
}

export interface PublishJobOpeningRequest {
  jobOpeningId: number;
  closingDate: string;
}

export interface ResumeScreeningRequest {
  applicationId: number;
  action: "APPROVE" | "REJECT";
  reviewRemarks?: string;
}

// POST /recruitment/screening -> [{ StatusCode: 1, Message: "..." }]
// StatusCode 1 = success; 0 or negative = business-rule failure
export interface ResumeScreeningResponse {
  StatusCode: number;
  Message: string;
}

export interface ScheduleAssessmentRequest {
  applicationId: number;
  assessmentType: string;
  scheduledDate: string;
}

export interface SkipAssessmentRequest {
  applicationId: number;
  remarks?: string;
}

export interface AssessmentResultRequest {
  assessmentId: number;
  score: number;
  isQualified: boolean;
  remarks?: string;
}

export interface ScheduleInterviewRequest {
  applicationId: number;
  interviewTypeId: number;
  scheduledDate: string;
  interviewerEmployeeId: string;
}

export interface SendInterviewInvitationRequest {
  email: string;
  candidateName: string;
  position: string;
  interviewerName: string;
  scheduledDate: string;
  scheduledTime: string;
}

export interface InterviewFeedbackRequest {
  interviewId: number;
  rating: number;
  feedback: string;
}

export interface FinalInterviewApprovalRequest {
  applicationId: number;
  isSelected: boolean;
  remarks?: string;
}

export interface CandidateOfferRequest {
  applicationId: number;
  offeredSalary: number;
  negotiatedSalary?: number;
}

export interface UploadCandidateDocumentRequest {
  applicationId: number;
  documentType: number;
  documentUrl: string;
}

export interface UploadCandidateDocumentFileRequest {
  applicationId: number;
  documentType: number;
  file: File;
}

export interface UploadCandidateDocumentFileResponse {
  documentUrl: string;
}

export interface CandidateBgvRequest {
  applicationId: number;
  isClear: boolean;
  remarks?: string;
}

export interface SendWelcomeEmailRequest {
  email: string;
  candidateName: string;
  position: string;
}

export interface SendJoiningEmailRequest {
  email: string;
  candidateName: string;
  position: string;
  joiningDate: string;
}

export interface SendTeamAssignmentEmailRequest {
  email: string;
  employeeName: string;
  department: string;
  team: string;
  manager: string;
}

export interface ApproveCandidateJoiningRequest {
  applicationId: number;
  joiningDate: string;
}
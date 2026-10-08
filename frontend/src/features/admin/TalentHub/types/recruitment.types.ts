export type RecruitmentTab =
  | "pipeline"
  | "openings"
  | "interviews"
  | "approvals";
export type CandidateStage =
  | "Applied"
  | "Screening"
  | "Interview"
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

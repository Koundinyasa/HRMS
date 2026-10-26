// ======================================================
// UI TYPES (original)
// ======================================================

export type RecruitmentTab = "pipeline" | "openings" | "approvals";
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

export type JobOpening = {
  id: number | string;
  requisitionNo?: string;
  title: string;
  department: string;
  location: string;
  type: string;
  applicants: number | null;
  positions: number;
  positionsFilled: number;
  salaryRange?: string;
  experienceRequired?: string;
  closingDate?: string;
  status: "Open" | "Pending approval" | "Sent back" | "Draft" | "On hold";
  posted: string;
};

export type JobOpeningsResponse = {
  success: boolean;
  data: Record<string, unknown>[];
  message: string;
};

export type JobOpeningsApiResponse =
  | JobOpeningsResponse
  | Record<string, unknown>[];

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
  requisitionNo?: string;
  openingId?: number;
  title: string;
  department: string;
  location: string;
  designation?: string;
  requestedBy: string;
  requestedDate: string;
  positions: number;
  experienceRequired?: string;
  priority?: string;
  reviewedDate?: string;
  reviewRemarks?: string;
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

export type CreateRequisitionRequest = {
  branchId: number;
  designationId: number;
  jobTitle: string;
  jobDescription: string;
  vacancies: number;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
  experienceRequired?: string;
  priority?: number;
};

export type RequisitionActionRequest = {
  requisitionId: number;
  action: "APPROVE" | "REJECT";
  reviewRemarks?: string;
};

export type RequisitionMasterResponse = {
  success: boolean;
  data: {
    companies: Record<string, unknown>[];
    branches: Record<string, unknown>[];
    departments: Record<string, unknown>[];
    designations: Record<string, unknown>[];
  };
};

export type JobRequisitionDetails = {
  RequisitionID: number;
  RequisitionNo: string;
  JobTitle: string;
  DepartmentName: string;
  DesignationName: string;
  Vacancies: number;
  SalaryRangeMin: number;
  SalaryRangeMax: number;
  ExperienceRequired: string;
  PriorityName: string;
  HiringManagerName: string;
  StatusName: string;
  CreatedDate: string;
};

export type JobRequisitionDetailsResponse = {
  success: boolean;
  message: string;
  data: JobRequisitionDetails;
};

export type CandidateApplicationRequest = {
  jobOpeningId: number;
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  resume?: File;
  source?: string;
  referredBy?: string;
};

export type RecruitmentDashboardResponse = {
  success: boolean;
  data: {
    applications: unknown[];
    summary: Record<string, number>;
  };
  message?: string;
};

export type RecruitmentLookupResponse = {
  success: boolean;
  data: unknown[];
  message?: string;
};

export type RecruitmentEmailResponse = {
  success: boolean;
  message: string;
};

export type PublishJobOpeningRequest = {
  jobOpeningId: number;
  closingDate: string;
};

export type ResumeScreeningRequest = {
  applicationId: number;
  action: "APPROVE" | "REJECT";
  reviewRemarks?: string;
};

export type ScheduleAssessmentRequest = {
  applicationId: number;
  assessmentTypeId: number;
  scheduledDate: string;
};

export type AssessmentScheduleDropdownsResponse = {
  candidates: Record<string, unknown>[];
  assessmentTypes: Record<string, unknown>[];
};

export type InterviewEligibleCandidate = {
  ApplicationID: number;
  CandidateID: string;
  CandidateName: string;
  Email: string;
  JobTitle: string;
};

export type PendingInterviewCandidate = {
  applicationId: number;
  applicationCode: string;
  candidateCode: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
};

export type RecruitmentInterviewer = {
  id: string;
  name: string;
};

export type InterviewScheduleOption = {
  id: number;
  name: string;
};

export type InterviewScheduleOptions = {
  interviewTypes: InterviewScheduleOption[];
  interviewModes: InterviewScheduleOption[];
};

export type RecruitmentInterviewPeriod = "today" | "upcoming" | "past";

export type ScheduledCandidateInterview = {
  id: string;
  scheduledDate: string;
  scheduledTime: string;
  scheduledAt: string;
  candidateName: string;
  interviewerName: string;
  interviewType: string;
};

export type RecruitmentInterview = {
  id: number;
  code: string;
  applicationId?: number;
  applicationCode?: string;
  candidateCode: string;
  candidateName: string;
  candidateEmail?: string;
  position: string;
  roundName: string;
  scheduledAt: string;
  durationMinutes: number;
  mode: "video" | "in_person" | "phone";
  locationOrLink: string | null;
  status: "scheduled" | "completed" | "no_show" | "cancelled";
  statusNote: string | null;
  panel: string | null;
  feedbackRecords?: RecruitmentInterviewFeedbackRecord[];
};

export type InterviewerFeedbackWorklistItem = {
  id: number;
  code: string;
  applicationId: number;
  applicationCode: string;
  candidateCode: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  roundName: string;
  scheduledAt: string;
  status: "scheduled" | "completed";
  interviewerName: string;
  feedbackSubmitted: boolean;
  canSubmitFeedback: boolean;
  feedbackRating: number | null;
  feedbackText: string | null;
};

export type InterviewFeedbackCategory = {
  categoryId: number;
  categoryName: string;
};

export type InterviewerFeedbackWorklistResponse = {
  interviews: InterviewerFeedbackWorklistItem[];
  categories: InterviewFeedbackCategory[];
};

export type InterviewerCompetencyRating = {
  categoryId: number;
  rating: number;
  comments?: string;
};

export type SubmitInterviewerCompetencyFeedbackRequest = {
  interviewId: number;
  feedbackDetails: InterviewerCompetencyRating[];
  overallFeedback: string;
};

export type SubmitInterviewerCompetencyFeedbackResponse = {
  success: boolean;
  message: string;
};

export type RecruitmentInterviewFeedbackRecord = {
  employeeId: string;
  submittedAt: string;
  rating: number;
  recommendation: "strong_hire" | "hire" | "hold" | "no_hire";
  feedback: string;
  strengths: string | null;
  concerns: string | null;
};

export type RecruitmentInterviewListQuery = {
  period: RecruitmentInterviewPeriod;
  search?: string;
  page: number;
  limit: number;
};

export type RecruitmentInterviewListResponse = {
  data: ScheduledCandidateInterview[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type ScheduleRecruitmentInterviewRequest = {
  applicationId: number;
  interviewTypeId: number;
  interviewModeId: number;
  date: string;
  time: string;
  interviewerEmployeeId: string;
};

export type ScheduleRecruitmentInterviewResponse = {
  success: boolean;
  message: string;
  interviewScheduleId: number;
};

export type UpdateRecruitmentInterviewRequest = {
  interviewId: number;
  roundName?: string;
  date?: string;
  time?: string;
  durationMinutes?: number;
  interviewerIds?: string[];
  mode?: "video" | "in_person" | "phone";
  locationOrLink?: string;
};

export type CancelRecruitmentInterviewRequest = {
  interviewId: number;
  reason: string;
};

export type RecruitmentInterviewFeedbackRequest = {
  interviewId: number;
  rating: number;
  recommendation: "strong_hire" | "hire" | "hold" | "no_hire";
  feedback: string;
  strengths?: string;
  concerns?: string;
};

export type RecruitmentInterviewStatusRequest = {
  interviewId: number;
  status: "completed" | "no_show";
  note?: string;
};

export type FinalApprovalDecision = "pending" | "selected" | "rejected" | "all";

export type FinalApprovalsQuery = {
  decision: FinalApprovalDecision;
  search?: string;
  page: number;
  limit: number;
};

export type FinalApprovalDecisionRequest = {
  decision: "selected" | "rejected";
  remarks?: string;
};

export type FinalApprovalListResponse = {
  data: Record<string, unknown>[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
};

export type SkipAssessmentRequest = {
  applicationId: number;
  remarks?: string;
};

export type AssessmentResultRequest = {
  assessmentId: number;
  score: number;
  isQualified: boolean;
  remarks?: string;
};

export type SendInterviewInvitationRequest = {
  email: string;
  candidateName: string;
  position: string;
  interviewerName: string;
  scheduledDate: string;
  scheduledTime: string;
};

export type InterviewFeedbackRequest = {
  interviewId: number;
  rating: number;
  feedback: string;
};

export type FinalInterviewApprovalRequest = {
  applicationId: number;
  isSelected: boolean;
  remarks?: string;
};

export type CandidateOfferRequest = {
  applicationId: number;
  offeredSalary: number;
  negotiatedSalary?: number;
};

export type OfferStatus =
  | "all"
  | "draft"
  | "extended"
  | "accepted"
  | "rejected";

export type OffersQuery = {
  search?: string;
  status: OfferStatus;
  page: number;
  limit: number;
};

export type OfferRecord = {
  id: number;
  applicationId: number;
  offerReferenceNo: string;
  candidateCode: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  offeredSalary: number;
  negotiatedSalary: number | null;
  status: Exclude<OfferStatus, "all">;
  response: "accepted" | "rejected" | null;
  approvalDate: string | null;
  offerLetterGeneratedDate: string | null;
  responseDate: string | null;
  createdDate: string;
  salaryRangeMin?: number;
  salaryRangeMax?: number;
};

export type OffersListResponse = {
  data: OfferRecord[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type UpdateOfferRequest = {
  offeredSalary?: number;
  negotiatedSalary?: number | null;
};

export type OfferResponseRequest = {
  response: "accepted" | "rejected";
};

export type UploadCandidateDocumentRequest = {
  applicationId: number;
  documentType: number;
  documentUrl: string;
};

export type UploadCandidateDocumentFileRequest = {
  applicationId: number;
  documentType: number;
  file: File;
};

export type UploadCandidateDocumentFileResponse = {
  documentUrl: string;
};

export type BgvDocumentVerificationRequest = {
  documentId: number;
  verificationStatus: "Approved" | "Rejected";
  remarks?: string;
};

export type CandidateBgvRequest = {
  documents: BgvDocumentVerificationRequest[];
};

export type CandidateBgvResultRow = {
  StatusCode: number;
  ApplicationID: number;
  DocumentID: number;
  DocumentType: number;
  VerificationStatus: "Approved" | "Rejected";
  VerificationRemarks: string | null;
  OverallBGVClear: boolean;
  ApplicationStatusID: number;
  ApplicationStatus: string;
};

export type CandidateBgvResponse = {
  success: boolean;
  message: string;
  data: CandidateBgvResultRow[];
};

export type PendingBgvDocumentRow = {
  DocumentID: number;
  DocumentType: number;
  DocumentName: string;
  DocumentURL: string;
  ActualFileName: string | null;
  FileName: string | null;
  FileExtension: string | null;
  VerificationStatus: string | null;
  VerificationRemarks: string | null;
};

export type BgvStatus = "all" | "in-progress" | "clear" | "failed";

export type BgvQuery = {
  search?: string;
  status: BgvStatus;
  page: number;
  limit: number;
};

export type BgvRecord = {
  id: number;
  applicationId: number;
  candidateCode: string;
  candidateName: string;
  candidateEmail: string;
  position: string;
  offerReferenceNo: string | null;
  status: Exclude<BgvStatus, "all">;
  isClear: boolean | null;
  startedBy: string | null;
  verifiedBy: string | null;
  verificationDate: string | null;
  remarks: string | null;
  documentCount?: number;
};

export type BgvDocument = {
  id: number;
  documentTypeId: number;
  documentCode: string | null;
  documentName: string | null;
  documentUrl: string;
  actualFileName: string | null;
  fileName: string | null;
  fileExtension: string | null;
  uploadedDate: string;
  verificationStatus: string | null;
  verificationRemarks: string | null;
  verifiedBy?: string | null;
  verifiedDate?: string | null;
};

export type BgvDetail = BgvRecord & {
  documents: BgvDocument[];
};

export type BgvListResponse = {
  data: BgvRecord[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type VerificationCandidate = {
  ApplicationID: number;
  FullName: string;
  Email: string;
  Position: string;
  Noofdocumentsuploded: number;
  BGVStatus: string;
  actionDate: string | null;
};

export type VerificationCandidatesResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: VerificationCandidate[];
};

export type UpdateBgvRequest = {
  status: "clear" | "failed";
  remarks?: string;
};

export type UpdateBgvDocumentRequest = {
  status: "approved" | "rejected";
  remarks?: string;
};

export type SendWelcomeEmailRequest = {
  email: string;
  candidateName: string;
  position: string;
};

export type SendJoiningEmailRequest = {
  email: string;
  candidateName: string;
  position: string;
  joiningDate: string;
};

export type SendTeamAssignmentEmailRequest = {
  email: string;
  employeeName: string;
  department: string;
  team: string;
  manager: string;
};

export type ApproveCandidateJoiningRequest = {
  applicationId: number;
  joiningDate: string;
};

export type JoiningEligibleCandidate = {
  ApplicationID: number;
  CandidateID: string | number;
  FullName: string;
  Email: string;
  JobTitle: string;
  OfferedSalary?: number;
  NegotiatedSalary?: number;
  OfferAcceptedDate?: string;
  VerificationDate?: string;
  IsClear: boolean;
  VerificationRemarks?: string | null;
};

export type JoiningRecord = {
  id: number;
  applicationId: number;
  candidateCode: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string | null;
  position: string;
  joiningDate: string;
  employeeCode: string | null;
  employeeId: string | null;
  status: "prepared" | "confirmed";
};

export type JoiningsResponse = {
  eligible: JoiningEligibleCandidate[];
  prepared: JoiningRecord[];
};

export type PrepareJoiningRequest = {
  applicationId: number;
  joiningDate: string;
};

export type UpdateJoiningRequest = {
  joiningDate: string;
};

export type ConfirmJoiningRequest = {
  employeeId: string;
  initialPassword: string;
  firstName: string;
  lastName?: string;
  companyId: number;
  branchId: number;
  deptId: number;
  roleId: number;
  designationId?: number;
  reportingManagerId?: string;
  dob: string;
  genderId: number;
  employmentTypeId: number;
  employmentStatusId: number;
  maritalStatusId?: number;
  grade?: string;
  mobileNo?: string;
  alternateMobileNo?: string;
  emergencyNo?: string;
  alternateEmail?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  uanNumber?: string;
  pfNumber?: string;
};

export type ConfirmJoiningResponse = {
  success: boolean;
  message: string;
  joiningId: number;
  applicationId: number;
  employeeId: string;
  employeeCode: string;
  employeeRowId: number;
};

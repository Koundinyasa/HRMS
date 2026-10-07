import axios from "axios";

const recruitmentClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3001/api",
  timeout: 15000,
  withCredentials: true,
});

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
  resumeUrl?: string;
  source?: string;
}

export interface RecruitmentDashboardResponse {
  success: boolean;
  data: {
    applications: unknown[];
    summary: Record<string, number>;
  };
  message?: string;
}

export const recruitmentApi = {
  getRecruitmentDashboard: async () =>
    (
      await recruitmentClient.get<RecruitmentDashboardResponse>(
        "/recruitment/dashboard",
      )
    ).data,
  getPendingRequisitions: async () =>
    (await recruitmentClient.get<unknown[]>("/recruitment/pendingrequisitions"))
      .data,
  updateRequisition: async (request: RequisitionActionRequest) =>
    (
      await recruitmentClient.post<unknown>(
        "/recruitment/requisitionaction",
        request,
      )
    ).data,
  createJobOpening: async (requisitionId: number) =>
    (
      await recruitmentClient.post<unknown>("/recruitment/jobopening", {
        requisitionId,
      })
    ).data,
  publishJobOpening: async (jobOpeningId: number, closingDate: string) =>
    (
      await recruitmentClient.post<unknown>(
        "/recruitment/jobopeningpublish",
        { jobOpeningId, closingDate },
      )
    ).data,
  getJobOpenings: async () =>
    (await recruitmentClient.get<unknown[]>("/recruitment/jobopenings")).data,
  getRequisitionMaster: async () =>
    (
      await recruitmentClient.get<RequisitionMasterResponse>(
        "/recruitment/requisitionmaster",
      )
    ).data,
  createRequisition: async (request: CreateRequisitionRequest) =>
    (
      await recruitmentClient.post<unknown>(
        "/recruitment/requisition",
        request,
      )
    ).data,
  createCandidateApplication: async (
    request: CandidateApplicationRequest,
  ) =>
    (
      await recruitmentClient.post<unknown>(
        "/recruitment/candidateapplication",
        request,
      )
    ).data,
  uploadCandidateResume: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return (
      await recruitmentClient.post<{ resumeUrl: string }>(
        "/recruitment/resumes",
        formData,
      )
    ).data;
  },
  getCandidatesForScreening: async (jobOpeningId: number) =>
    (
      await recruitmentClient.get<unknown[]>(
        `/recruitment/candidatescreening/${jobOpeningId}`,
      )
    ).data,
  updateResumeScreening: async (request: {
    applicationId: number;
    action: "APPROVE" | "REJECT";
    reviewRemarks?: string;
  }) =>
    (await recruitmentClient.post<unknown>("/recruitment/screening", request))
      .data,
  getCandidatesForAssessment: async () =>
    (
      await recruitmentClient.get<unknown[]>(
        "/recruitment/assessmentscheduling",
      )
    ).data,
  scheduleAssessment: async (request: {
    applicationId: number;
    assessmentType: string;
    scheduledDate: string;
  }) =>
    (
      await recruitmentClient.post<unknown>(
        "/recruitment/assessmentschedule",
        request,
      )
    ).data,
  skipAssessment: async (request: {
    applicationId: number;
    remarks?: string;
  }) =>
    (
      await recruitmentClient.post<unknown>(
        "/recruitment/skipcandidateassessment",
        request,
      )
    ).data,
  getCandidatesEligibleForInterview: async () =>
    (
      await recruitmentClient.get<unknown[]>(
        "/recruitment/intervieweligible",
      )
    ).data,
  scheduleInterview: async (request: {
    applicationId: number;
    interviewTypeId: number;
    scheduledDate: string;
    interviewerEmployeeId: string;
  }) =>
    (
      await recruitmentClient.post<unknown>(
        "/recruitment/interviewschedule",
        request,
      )
    ).data,
  updateAssessmentResult: async (request: {
    assessmentId: number;
    score: number;
    isQualified: boolean;
    remarks?: string;
  }) =>
    (
      await recruitmentClient.post<unknown>(
        "/recruitment/assessmentresult",
        request,
      )
    ).data,
  updateFinalInterviewApproval: async (request: {
    applicationId: number;
    isSelected: boolean;
    remarks?: string;
  }) =>
    (
      await recruitmentClient.post<unknown>(
        "/recruitment/finalinterviewapproval",
        request,
      )
    ).data,
  submitInterviewFeedback: async (request: {
    interviewId: number;
    rating: number;
    feedback: string;
  }) =>
    (
      await recruitmentClient.post<unknown>(
        "/recruitment/interviewfeedback",
        request,
      )
    ).data,
  createCandidateOffer: async (request: {
    applicationId: number;
    offeredSalary: number;
    negotiatedSalary?: number;
  }) =>
    (
      await recruitmentClient.post<unknown>(
        "/recruitment/candidateoffer",
        request,
      )
    ).data,
  getCandidatesForVerification: async () =>
    (
      await recruitmentClient.get<unknown[]>(
        "/recruitment/candidatesforverification",
      )
    ).data,
  uploadCandidateDocument: async (request: {
    applicationId: number;
    documentType: number;
    documentUrl: string;
  }) =>
    (
      await recruitmentClient.post<unknown>(
        "/recruitment/uploadcandidatedocument",
        request,
      )
    ).data,
  uploadCandidateDocumentFile: async (request: {
    applicationId: number;
    documentType: number;
    file: File;
  }) => {
    const formData = new FormData();
    formData.append("applicationId", String(request.applicationId));
    formData.append("documentType", String(request.documentType));
    formData.append("file", request.file);
    return (
      await recruitmentClient.post<{ documentUrl: string }>(
        "/recruitment/candidate-documents",
        formData,
      )
    ).data;
  },
  getCandidateDocumentFile: async (documentUrl: string) =>
    (
      await recruitmentClient.get<Blob>(documentUrl, {
        responseType: "blob",
      })
    ).data,
  performCandidateBgv: async (request: {
    applicationId: number;
    isClear: boolean;
    remarks?: string;
  }) =>
    (
      await recruitmentClient.post<unknown>(
        "/recruitment/bgvcandidate",
        request,
      )
    ).data,
  sendWelcomeEmail: async (request: {
    email: string;
    candidateName: string;
    position: string;
  }) =>
    (
      await recruitmentClient.post<{ success: boolean; message: string }>(
        "/recruitment/send-welcome-email",
        request,
      )
    ).data,
  sendJoiningEmail: async (request: {
    email: string;
    candidateName: string;
    position: string;
    joiningDate: string;
  }) =>
    (
      await recruitmentClient.post<{ success: boolean; message: string }>(
        "/recruitment/send-joining-email",
        request,
      )
    ).data,
  sendTeamAssignmentEmail: async (request: {
    email: string;
    employeeName: string;
    department: string;
    team: string;
    manager: string;
  }) =>
    (
      await recruitmentClient.post<{ success: boolean; message: string }>(
        "/recruitment/send-team-assignment-email",
        request,
      )
    ).data,
  getCandidatesForJoining: async () =>
    (
      await recruitmentClient.get<unknown[]>(
        "/recruitment/candidatesforjoining",
      )
    ).data,
  approveCandidateJoining: async (request: {
    applicationId: number;
    joiningDate: string;
  }) =>
    (
      await recruitmentClient.post<unknown>(
        "/recruitment/approvecandidatejoining",
        request,
      )
    ).data,
};

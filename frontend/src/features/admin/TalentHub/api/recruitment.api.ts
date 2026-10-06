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

export const recruitmentApi = {
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

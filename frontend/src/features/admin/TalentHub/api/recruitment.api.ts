import { baseApi } from "@/app/baseApi";
import { toast } from "react-toastify";

import type {
  CreateRequisitionRequest,
  JobRequisitionDetailsResponse,
  RequisitionActionRequest,
  RequisitionMasterResponse,
  CandidateApplicationRequest,
  RecruitmentDashboardResponse,
  RecruitmentLookupResponse,
  ResumeScreeningRequest,
  ScheduleAssessmentRequest,
  SkipAssessmentRequest,
  SendInterviewInvitationRequest,
  AssessmentResultRequest,
  FinalInterviewApprovalRequest,
  InterviewFeedbackRequest,
  CandidateOfferRequest,
  UploadCandidateDocumentRequest,
  UploadCandidateDocumentFileRequest,
  UploadCandidateDocumentFileResponse,
  CandidateBgvRequest,
  CandidateBgvResponse,
  SendWelcomeEmailRequest,
  SendJoiningEmailRequest,
  SendTeamAssignmentEmailRequest,
  ApproveCandidateJoiningRequest,
  PublishJobOpeningRequest,
  RecruitmentEmailResponse,
  AssessmentScheduleDropdownsResponse,
  InterviewEligibleCandidate,
  FinalApprovalsQuery,
  FinalApprovalListResponse,
  FinalApprovalDecisionRequest,
  OffersQuery,
  OffersListResponse,
  OfferRecord,
  UpdateOfferRequest,
  OfferResponseRequest,
  BgvQuery,
  BgvListResponse,
  VerificationCandidatesResponse,
  BgvDetail,
  UpdateBgvRequest,
  UpdateBgvDocumentRequest,
  JoiningsResponse,
  JoiningRecord,
  PrepareJoiningRequest,
  UpdateJoiningRequest,
  ConfirmJoiningRequest,
  ConfirmJoiningResponse,
  PendingInterviewCandidate,
  RecruitmentInterviewer,
  InterviewScheduleOptions,
  RecruitmentInterviewListQuery,
  RecruitmentInterviewListResponse,
  RecruitmentInterview,
  RecruitmentInterviewFeedbackRecord,
  ScheduleRecruitmentInterviewRequest,
  ScheduleRecruitmentInterviewResponse,
  UpdateRecruitmentInterviewRequest,
  CancelRecruitmentInterviewRequest,
  RecruitmentInterviewFeedbackRequest,
  InterviewerFeedbackWorklistResponse,
  SubmitInterviewerCompetencyFeedbackRequest,
  SubmitInterviewerCompetencyFeedbackResponse,
  RecruitmentInterviewStatusRequest,
  JobOpeningsApiResponse,
} from "../types/recruitment.types";

// ======================================================
// FILE URL HELPER (not an API call – plain utility)
// ======================================================

const API_URL: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";
const FINAL_APPROVALS_API_URL =
  import.meta.env.VITE_FINAL_APPROVALS_API_URL?.trim().replace(/\/+$/, "") ??
  "";

function finalApprovalsUrl(path = "") {
  return `${FINAL_APPROVALS_API_URL}/final-approvals${path}`;
}

function responseMessage(value: unknown, depth = 0): string | undefined {
  if (depth > 4 || value === null || value === undefined) return undefined;
  if (typeof value === "string" && value.trim()) return value;
  if (Array.isArray(value)) {
    for (const item of value) {
      const message = responseMessage(item, depth + 1);
      if (message) return message;
    }
    return undefined;
  }
  if (typeof value !== "object") return undefined;

  const record = value as Record<string, unknown>;
  for (const key of ["message", "Message", "error", "Error"]) {
    if (
      key !== "error" &&
      key !== "Error" &&
      typeof record[key] === "string" &&
      (record[key] as string).trim()
    ) {
      return record[key] as string;
    }
  }
  for (const key of ["data", "recordset", "recordsets"]) {
    const message = responseMessage(record[key], depth + 1);
    if (message) return message;
  }
  for (const key of ["error", "Error"]) {
    if (typeof record[key] === "string" && record[key].trim()) {
      return record[key] as string;
    }
  }
  return undefined;
}

function hasFailedResponseStatus(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some(hasFailedResponseStatus);
  }
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  if (record.success === false) return true;
  const statusCode = Number(record.statusCode ?? record.StatusCode);
  return Number.isFinite(statusCode) && (statusCode <= 0 || statusCode >= 400);
}

function submissionToasts(
  successFallback: string,
  errorFallback = "The request failed. Please try again.",
) {
  return {
    async onQueryStarted(
      _arg: unknown,
      {
        queryFulfilled,
      }: { queryFulfilled: Promise<{ data: unknown }> },
    ) {
      try {
        const { data } = await queryFulfilled;
        if (hasFailedResponseStatus(data)) {
          toast.error(responseMessage(data) ?? errorFallback);
          return;
        }
        toast.success(responseMessage(data) ?? successFallback);
      } catch (error: unknown) {
        toast.error(responseMessage(error) ?? errorFallback);
      }
    },
  };
}

export function recruitmentFileUrl(filePath: string, fileExtension?: string) {
  if (/^https?:\/\//i.test(filePath)) return filePath;

  const apiBaseUrl = new URL(API_URL);
  const normalizedPath = filePath.startsWith("/") ? filePath : `/${filePath}`;

  const resumePathMatch = normalizedPath.match(
    /^\/?uploads\/recruitment\/resumes\/([^/?#]+)$/i
  );

  if (resumePathMatch) {
    const fileName = resumePathMatch[1];

    const extension =
      fileName.match(/\.(pdf|doc|docx)$/i)?.[1] ??
      fileExtension?.match(/\.(pdf|doc|docx)$/i)?.[1] ??
      fileExtension?.replace(/^\./, "").toLowerCase();

    const previewUrl = new URL(
      `recruitment/resume-preview/${encodeURIComponent(fileName)}`,
      `${apiBaseUrl.toString().replace(/\/$/, "")}/`
    );

    if (extension && ["pdf", "doc", "docx"].includes(extension)) {
      previewUrl.searchParams.set("extension", extension);
    }

    return previewUrl.toString();
  }

  const publicPath = normalizedPath.replace(/^\/api(?=\/uploads\/)/i, "");

  return new URL(publicPath, apiBaseUrl.origin).toString();
}

export const recruitmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==================================================
    // DASHBOARD
    // ==================================================

    getRecruitmentDashboard: builder.query<RecruitmentDashboardResponse, void>({
      query: () => ({
        url: "/recruitment/dashboard",
        method: "GET",
      }),

      providesTags: ["Recruitment"],
    }),

    // ==================================================
    // REQUISITIONS
    // ==================================================

    getPendingRequisitions: builder.query<unknown[], void>({
      query: () => ({
        url: "/recruitment/pendingrequisitions",
        method: "GET",
      }),

      providesTags: ["Recruitment"],
    }),

    getAllRequisitionsForHR: builder.query<unknown, void>({
      query: () => ({
        url: "/recruitment/all-requisitions-for-hr",
        method: "GET",
      }),

      providesTags: ["Recruitment"],
    }),

    getJobRequisitionDetails: builder.query<
      JobRequisitionDetailsResponse,
      number
    >({
      query: (requisitionId) => ({
        url: `/recruitment/jobrequisitiondetails/${requisitionId}`,
        method: "GET",
      }),

      providesTags: ["Recruitment"],
    }),

    getRequisitionMaster: builder.query<RequisitionMasterResponse, void>({
      query: () => ({
        url: "/recruitment/requisitionmaster",
        method: "GET",
      }),

      providesTags: ["Recruitment"],
    }),

    createRequisition: builder.mutation<unknown, CreateRequisitionRequest>({
      query: (body) => ({
        url: "/recruitment/requisition",
        method: "POST",
        body,
      }),

      ...submissionToasts("Requisition submitted successfully."),
      invalidatesTags: ["Recruitment"],
    }),

    updateRequisition: builder.mutation<unknown, RequisitionActionRequest>({
      query: (body) => ({
        url: "/recruitment/requisitionaction",
        method: "POST",
        body,
      }),

      ...submissionToasts("Requisition action completed successfully."),
      invalidatesTags: ["Recruitment"],
    }),

    // ==================================================
    // JOB OPENINGS
    // ==================================================

    getJobOpenings: builder.query<JobOpeningsApiResponse, void>({
      query: () => ({
        url: "/recruitment/jobopenings",
        method: "GET",
      }),

      providesTags: ["Recruitment"],
    }),

    getJobOpeningMaster: builder.query<RecruitmentLookupResponse, void>({
      query: () => ({
        url: "/recruitment/jobopeningmaster",
        method: "GET",
      }),

      providesTags: ["Recruitment"],
    }),

    getRecruitmentSources: builder.query<RecruitmentLookupResponse, void>({
      query: () => ({
        url: "/recruitment/sources",
        method: "GET",
      }),

      providesTags: ["Recruitment"],
    }),

    createJobOpening: builder.mutation<unknown, number>({
      query: (requisitionId) => ({
        url: "/recruitment/jobopening",
        method: "POST",
        body: { requisitionId },
      }),

      ...submissionToasts("Job opening created successfully."),
      invalidatesTags: ["Recruitment"],
    }),

    publishJobOpening: builder.mutation<unknown, PublishJobOpeningRequest>({
      query: ({ jobOpeningId, closingDate }) => ({
        url: "/recruitment/jobopeningpublish",
        method: "POST",
        body: { jobOpeningId, closingDate },
      }),

      ...submissionToasts("Job opening published successfully."),
      invalidatesTags: ["Recruitment"],
    }),

    // ==================================================
    // CANDIDATE APPLICATIONS
    // ==================================================

    createCandidateApplication: builder.mutation<
      unknown,
      CandidateApplicationRequest
    >({
      query: (request) => {
        const formData = new FormData();

        formData.append("jobOpeningId", String(request.jobOpeningId));

        formData.append("fullName", request.fullName);
        formData.append("email", request.email);
        formData.append("phone", request.phone);

        if (request.address) {
          formData.append("address", request.address);
        }

        if (request.resume) {
          formData.append("resume", request.resume);
        }

        if (request.source) {
          formData.append("source", request.source);
        }

        if (request.referredBy) {
          formData.append("referredBy", request.referredBy);
        }

        return {
          url: "/recruitment/candidateapplication",
          method: "POST",
          body: formData,
        };
      },

      ...submissionToasts("Candidate application submitted successfully."),
      invalidatesTags: ["Recruitment"],
    }),

    // applicationStatusId is optional – pass undefined to fetch all
    getCandidateApplications: builder.query<unknown[], number | void>({
      query: (applicationStatusId) => ({
        url: "/recruitment/candidateapplications",
        method: "GET",
        params:
          applicationStatusId === undefined
            ? undefined
            : { applicationStatusId },
      }),

      providesTags: ["Recruitment"],
    }),

    // ==================================================
    // RESUME SCREENING
    // ==================================================

    updateResumeScreening: builder.mutation<unknown, ResumeScreeningRequest>({
      query: (body) => ({
        url: "/recruitment/screening",
        method: "POST",
        body,
      }),

      ...submissionToasts("Resume screening decision saved successfully."),
      invalidatesTags: ["Recruitment"],
    }),

    // ==================================================
    // ASSESSMENTS
    // ==================================================

    getCandidatesForAssessment: builder.query<unknown[], void>({
      query: () => ({
        url: "/recruitment/assessmentscheduling",
        method: "GET",
      }),

      providesTags: ["Recruitment"],
    }),

    getInterviewEligibleCandidates: builder.query<
      InterviewEligibleCandidate[],
      void
    >({
      query: () => ({
        url: "/recruitment/intervieweligible",
        method: "GET",
      }),

      providesTags: ["Recruitment"],
    }),

    getPendingInterviewSchedule: builder.query<
      PendingInterviewCandidate[],
      { search?: string } | void
    >({
      query: (params) => ({
        url: "/recruitment/interviews/pending-schedule",
        params: params?.search ? { search: params.search } : undefined,
      }),
      providesTags: ["Recruitment"],
    }),

    getInterviewScheduleOptions: builder.query<InterviewScheduleOptions, void>({
      query: () => ({ url: "/recruitment/interviews/schedule-options" }),
    }),

    getRecruitmentInterviewers: builder.query<RecruitmentInterviewer[], void>({
      query: () => ({ url: "/recruitment/interviewers" }),
      providesTags: ["Recruitment"],
    }),

    getRecruitmentInterviews: builder.query<
      RecruitmentInterviewListResponse,
      RecruitmentInterviewListQuery
    >({
      query: ({ period, search, page, limit }) => ({
        url: "/recruitment/interviews",
        params: { period, search: search || undefined, page, limit },
      }),
      providesTags: ["Recruitment"],
    }),

    getInterviewerFeedbackWorklist: builder.query<
      InterviewerFeedbackWorklistResponse,
      void
    >({
      query: () => ({ url: "/recruitment/interviewer-feedback" }),
      providesTags: ["Recruitment"],
    }),

    getTodayRecruitmentInterviews: builder.query<
      RecruitmentInterviewListResponse,
      { page: number; limit: number; search?: string }
    >({
      query: ({ page, limit, search }) => ({
        url: "/recruitment/interviews/today",
        params: { page, limit, search: search || undefined },
      }),
      providesTags: ["Recruitment"],
    }),

    getRecruitmentInterview: builder.query<RecruitmentInterview, number>({
      query: (id) => ({ url: `/recruitment/interviews/${id}` }),
      providesTags: ["Recruitment"],
    }),

    getRecruitmentInterviewFeedback: builder.query<
      RecruitmentInterviewFeedbackRecord[],
      number
    >({
      query: (id) => ({ url: `/recruitment/interviews/${id}/feedback` }),
      providesTags: ["Recruitment"],
    }),

    scheduleRecruitmentInterview: builder.mutation<
      ScheduleRecruitmentInterviewResponse,
      ScheduleRecruitmentInterviewRequest
    >({
      query: ({ applicationId, ...body }) => ({
        url: `/recruitment/applications/${applicationId}/interviews`,
        method: "POST",
        body,
      }),
      ...submissionToasts("Interview scheduled successfully."),
      invalidatesTags: ["Recruitment"],
    }),

    updateRecruitmentInterview: builder.mutation<
      RecruitmentInterview,
      UpdateRecruitmentInterviewRequest
    >({
      query: ({ interviewId, ...body }) => ({
        url: `/recruitment/interviews/${interviewId}`,
        method: "PATCH",
        body,
      }),
      ...submissionToasts("Interview updated successfully."),
      invalidatesTags: ["Recruitment"],
    }),

    cancelRecruitmentInterview: builder.mutation<
      RecruitmentInterview,
      CancelRecruitmentInterviewRequest
    >({
      query: ({ interviewId, reason }) => ({
        url: `/recruitment/interviews/${interviewId}/cancel`,
        method: "POST",
        body: { reason },
      }),
      ...submissionToasts("Interview cancelled successfully."),
      invalidatesTags: ["Recruitment"],
    }),

    submitRecruitmentInterviewFeedback: builder.mutation<
      { success: boolean; message: string },
      RecruitmentInterviewFeedbackRequest
    >({
      query: ({ interviewId, ...body }) => ({
        url: `/recruitment/interviews/${interviewId}/feedback`,
        method: "POST",
        body,
      }),
      ...submissionToasts("Interview feedback submitted successfully."),
      invalidatesTags: ["Recruitment"],
    }),

    submitInterviewerCompetencyFeedback: builder.mutation<
      SubmitInterviewerCompetencyFeedbackResponse,
      SubmitInterviewerCompetencyFeedbackRequest
    >({
      query: ({ interviewId, ...body }) => ({
        url: `/recruitment/interviews/${interviewId}/competency-feedback`,
        method: "POST",
        body,
      }),
      ...submissionToasts("Interviewer competency feedback submitted successfully."),
      invalidatesTags: ["Recruitment"],
    }),

    updateRecruitmentInterviewStatus: builder.mutation<
      RecruitmentInterview,
      RecruitmentInterviewStatusRequest
    >({
      query: ({ interviewId, ...body }) => ({
        url: `/recruitment/interviews/${interviewId}/status`,
        method: "PATCH",
        body,
      }),
      ...submissionToasts("Interview status updated successfully."),
      invalidatesTags: ["Recruitment"],
    }),

    getAssessmentScheduleDropdowns: builder.query<
      AssessmentScheduleDropdownsResponse,
      void
    >({
      query: () => ({
        url: "/recruitment/assessment-schedule-dropdowns",
        method: "GET",
      }),

      providesTags: ["Recruitment"],
    }),

    scheduleAssessment: builder.mutation<unknown, ScheduleAssessmentRequest>({
      query: (body) => ({
        url: "/recruitment/assessmentschedule",
        method: "POST",
        body,
      }),

      ...submissionToasts("Assessment scheduled successfully."),
      invalidatesTags: ["Recruitment"],
    }),

    skipAssessment: builder.mutation<unknown, SkipAssessmentRequest>({
      query: (body) => ({
        url: "/recruitment/skipcandidateassessment",
        method: "POST",
        body,
      }),

      ...submissionToasts("Assessment skipped successfully."),
      invalidatesTags: ["Recruitment"],
    }),

    updateAssessmentResult: builder.mutation<unknown, AssessmentResultRequest>({
      query: (body) => ({
        url: "/recruitment/assessmentresult",
        method: "POST",
        body,
      }),

      ...submissionToasts("Assessment result saved successfully."),
      invalidatesTags: ["Recruitment"],
    }),

    sendInterviewInvitation: builder.mutation<
      RecruitmentEmailResponse,
      SendInterviewInvitationRequest
    >({
      query: (body) => ({
        url: "/recruitment/send-interview-invitation",
        method: "POST",
        body,
      }),
      ...submissionToasts("Interview invitation sent successfully."),
    }),

    submitInterviewFeedback: builder.mutation<
      unknown,
      InterviewFeedbackRequest
    >({
      query: (body) => ({
        url: "/recruitment/interviewfeedback",
        method: "POST",
        body,
      }),

      ...submissionToasts("Interview feedback submitted successfully."),
      invalidatesTags: ["Recruitment"],
    }),

    updateFinalInterviewApproval: builder.mutation<
      unknown,
      FinalInterviewApprovalRequest
    >({
      query: (body) => ({
        url: "/recruitment/finalinterviewapproval",
        method: "POST",
        body,
      }),

      ...submissionToasts("Final interview approval updated successfully."),
      invalidatesTags: ["Recruitment"],
    }),

    getFinalApprovals: builder.query<
      FinalApprovalListResponse,
      FinalApprovalsQuery
    >({
      query: ({ decision, search, page, limit }) => {
        const token = localStorage.getItem("hrms_auth_accessToken");
        return {
          url: finalApprovalsUrl(),
          method: "GET",
          params: { decision, search: search || undefined, page, limit },
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        };
      },
      providesTags: ["Recruitment"],
    }),

    getFinalApproval: builder.query<Record<string, unknown>, string>({
      query: (id) => {
        const token = localStorage.getItem("hrms_auth_accessToken");
        return {
          url: finalApprovalsUrl(`/${encodeURIComponent(id)}`),
          method: "GET",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        };
      },
      providesTags: ["Recruitment"],
    }),

    decideFinalApproval: builder.mutation<
      Record<string, unknown>,
      { id: string; body: FinalApprovalDecisionRequest }
    >({
      ...submissionToasts("Final approval decision submitted successfully."),
      query: ({ id, body }) => {
        const token = localStorage.getItem("hrms_auth_accessToken");
        return {
          url: finalApprovalsUrl(`/${encodeURIComponent(id)}/decision`),
          method: "POST",
          body,
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        };
      },
      invalidatesTags: ["Recruitment"],
    }),

    // ==================================================
    // OFFERS
    // ==================================================

    createCandidateOffer: builder.mutation<unknown, CandidateOfferRequest>({
      ...submissionToasts("Candidate offer submitted successfully."),
      query: (body) => ({
        url: "/recruitment/candidateoffer",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Recruitment"],
    }),

    getOffers: builder.query<OffersListResponse, OffersQuery>({
      query: ({ search, status, page, limit }) => ({
        url: "/offers",
        params: {
          ...(search ? { search } : {}),
          status,
          page,
          limit,
        },
        method: "GET",
      }),
      providesTags: ["Recruitment"],
    }),

    getOffer: builder.query<OfferRecord, number>({
      query: (id) => ({ url: `/offers/${id}`, method: "GET" }),
      providesTags: ["Recruitment"],
    }),

    createOffer: builder.mutation<OfferRecord, CandidateOfferRequest>({
      ...submissionToasts("Offer created successfully."),
      query: (body) => ({ url: "/offers", method: "POST", body }),
      invalidatesTags: ["Recruitment"],
    }),

    updateOffer: builder.mutation<
      OfferRecord,
      { id: number; body: UpdateOfferRequest }
    >({
      ...submissionToasts("Offer updated successfully."),
      query: ({ id, body }) => ({
        url: `/offers/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Recruitment"],
    }),

    extendOffer: builder.mutation<OfferRecord, number>({
      ...submissionToasts("Offer extended successfully."),
      query: (id) => ({ url: `/offers/${id}/extend`, method: "POST" }),
      invalidatesTags: ["Recruitment"],
    }),

    respondToOffer: builder.mutation<
      OfferRecord,
      { id: number; body: OfferResponseRequest }
    >({
      ...submissionToasts("Offer response recorded successfully."),
      query: ({ id, body }) => ({
        url: `/offers/${id}/response`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Recruitment"],
    }),

    getOfferLetterUrl: builder.query<{ url: string }, number>({
      query: (id) => ({ url: `/offers/${id}/letter-url`, method: "GET" }),
    }),

    // ==================================================
    // DOCUMENT VERIFICATION
    // ==================================================

    getCandidatesForVerification: builder.query<unknown[], void>({
      query: () => ({
        url: "/recruitment/candidatesforverification",
        method: "GET",
      }),

      providesTags: ["Recruitment"],
    }),

    getPendingBgvDocuments: builder.query<
      {
        success: boolean;
        statusCode: number;
        message: string;
        data: unknown[];
      },
      { applicationId?: number; flag?: 1 | 2 } | void
    >({
      query: (params) => ({
        url: "/recruitment/pending-bgv-documents",
        method: "GET",
        params: {
          flag: params?.flag ?? 1,
          ...(params?.applicationId
            ? { applicationId: params.applicationId }
            : {}),
        },
      }),

      providesTags: ["Recruitment"],
    }),

    getAllVerificationCandidates: builder.query<
      VerificationCandidatesResponse,
      void
    >({
      query: () => ({
        url: "/recruitment/all-verification-candidates",
        method: "GET",
      }),
      providesTags: ["Recruitment"],
    }),

    uploadCandidateDocument: builder.mutation<
      unknown,
      UploadCandidateDocumentRequest
    >({
      ...submissionToasts("Candidate document uploaded successfully."),
      query: (body) => ({
        url: "/recruitment/uploadcandidatedocument",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Recruitment"],
    }),

    uploadCandidateDocumentFile: builder.mutation<
      UploadCandidateDocumentFileResponse,
      UploadCandidateDocumentFileRequest
    >({
      ...submissionToasts("Candidate document uploaded successfully."),
      query: ({ applicationId, documentType, file }) => {
        const formData = new FormData();

        formData.append("applicationId", String(applicationId));

        formData.append("documentType", String(documentType));

        formData.append("file", file);

        return {
          url: "/recruitment/candidate-documents",
          method: "POST",
          body: formData,
        };
      },

      invalidatesTags: ["Recruitment"],
    }),

    // Returns a Blob (pdf / image etc.). documentUrl may be absolute or relative.
    getCandidateDocumentFile: builder.query<Blob, string>({
      query: (documentUrl) => ({
        url: documentUrl,
        method: "GET",
        responseHandler: (response: Response) => response.blob(),
      }),

      providesTags: ["Recruitment"],
    }),

    // ==================================================
    // BACKGROUND VERIFICATION
    // ==================================================

    performCandidateBgv: builder.mutation<
      CandidateBgvResponse,
      CandidateBgvRequest
    >({
      ...submissionToasts("BGV document verification completed successfully."),
      query: (body) => ({
        url: "/recruitment/bgvcandidate",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Recruitment"],
    }),

    getBgvs: builder.query<BgvListResponse, BgvQuery>({
      query: ({ search, status, page, limit }) => ({
        url: "/bgv",
        params: {
          ...(search ? { search } : {}),
          status,
          page,
          limit,
        },
        method: "GET",
      }),
      providesTags: ["Recruitment"],
    }),

    startBgv: builder.mutation<BgvDetail, { applicationId: number }>({
      ...submissionToasts("Background verification started successfully."),
      query: (body) => ({ url: "/bgv", method: "POST", body }),
      invalidatesTags: ["Recruitment"],
    }),

    getBgv: builder.query<BgvDetail, number>({
      query: (id) => ({ url: `/bgv/${id}`, method: "GET" }),
      providesTags: ["Recruitment"],
    }),

    updateBgv: builder.mutation<
      BgvDetail,
      { id: number; body: UpdateBgvRequest }
    >({
      ...submissionToasts("Background verification result saved successfully."),
      query: ({ id, body }) => ({
        url: `/bgv/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Recruitment"],
    }),

    updateBgvDocument: builder.mutation<
      BgvDetail["documents"][number],
      { id: number; body: UpdateBgvDocumentRequest }
    >({
      ...submissionToasts("BGV document decision saved successfully."),
      query: ({ id, body }) => ({
        url: `/bgv/documents/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Recruitment"],
    }),

    getJoinings: builder.query<JoiningsResponse, void>({
      query: () => ({ url: "/joinings", method: "GET" }),
      providesTags: ["Recruitment"],
    }),

    getJoining: builder.query<JoiningRecord, number>({
      query: (id) => ({ url: `/joinings/${id}`, method: "GET" }),
      providesTags: ["Recruitment"],
    }),

    prepareJoining: builder.mutation<JoiningRecord, PrepareJoiningRequest>({
      ...submissionToasts("Joining preparation completed successfully."),
      query: (body) => ({ url: "/joinings", method: "POST", body }),
      invalidatesTags: ["Recruitment"],
    }),

    updateJoining: builder.mutation<
      JoiningRecord,
      { id: number; body: UpdateJoiningRequest }
    >({
      ...submissionToasts("Joining record updated successfully."),
      query: ({ id, body }) => ({
        url: `/joinings/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Recruitment"],
    }),

    sendJoiningEmailForRecord: builder.mutation<
      RecruitmentEmailResponse,
      number
    >({
      ...submissionToasts("Joining email sent successfully."),
      query: (id) => ({
        url: `/joinings/${id}/send-email`,
        method: "POST",
      }),
    }),

    confirmJoining: builder.mutation<
      ConfirmJoiningResponse,
      { id: number; body: ConfirmJoiningRequest }
    >({
      ...submissionToasts("Candidate joining confirmed successfully."),
      query: ({ id, body }) => ({
        url: `/joinings/${id}/confirm`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Recruitment"],
    }),

    // ==================================================
    // JOINING
    // ==================================================

    getCandidatesForJoining: builder.query<unknown[], void>({
      query: () => ({
        url: "/recruitment/candidatesforjoining",
        method: "GET",
      }),

      providesTags: ["Recruitment"],
    }),

    approveCandidateJoining: builder.mutation<
      unknown,
      ApproveCandidateJoiningRequest
    >({
      ...submissionToasts("Candidate joining approved successfully."),
      query: (body) => ({
        url: "/recruitment/approvecandidatejoining",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Recruitment"],
    }),

    // ==================================================
    // EMAILS
    // ==================================================

    sendWelcomeEmail: builder.mutation<
      RecruitmentEmailResponse,
      SendWelcomeEmailRequest
    >({
      ...submissionToasts("Welcome email sent successfully."),
      query: (body) => ({
        url: "/recruitment/send-welcome-email",
        method: "POST",
        body,
      }),
    }),

    sendJoiningEmail: builder.mutation<
      RecruitmentEmailResponse,
      SendJoiningEmailRequest
    >({
      ...submissionToasts("Joining email sent successfully."),
      query: (body) => ({
        url: "/recruitment/send-joining-email",
        method: "POST",
        body,
      }),
    }),

    sendTeamAssignmentEmail: builder.mutation<
      RecruitmentEmailResponse,
      SendTeamAssignmentEmailRequest
    >({
      ...submissionToasts("Team assignment email sent successfully."),
      query: (body) => ({
        url: "/recruitment/send-team-assignment-email",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetRecruitmentDashboardQuery,
  useGetPendingRequisitionsQuery,
  useGetAllRequisitionsForHRQuery,
  useGetJobRequisitionDetailsQuery,
  useGetRequisitionMasterQuery,
  useCreateRequisitionMutation,
  useUpdateRequisitionMutation,
  useGetJobOpeningsQuery,
  useGetJobOpeningMasterQuery,
  useGetRecruitmentSourcesQuery,
  useCreateJobOpeningMutation,
  usePublishJobOpeningMutation,
  useCreateCandidateApplicationMutation,
  useGetCandidateApplicationsQuery,
  useUpdateResumeScreeningMutation,
  useGetCandidatesForAssessmentQuery,
  useGetInterviewEligibleCandidatesQuery,
  useGetPendingInterviewScheduleQuery,
  useGetRecruitmentInterviewersQuery,
  useGetInterviewScheduleOptionsQuery,
  useGetRecruitmentInterviewsQuery,
  useGetInterviewerFeedbackWorklistQuery,
  useGetTodayRecruitmentInterviewsQuery,
  useGetRecruitmentInterviewQuery,
  useGetRecruitmentInterviewFeedbackQuery,
  useScheduleRecruitmentInterviewMutation,
  useUpdateRecruitmentInterviewMutation,
  useCancelRecruitmentInterviewMutation,
  useSubmitRecruitmentInterviewFeedbackMutation,
  useSubmitInterviewerCompetencyFeedbackMutation,
  useUpdateRecruitmentInterviewStatusMutation,
  useGetAssessmentScheduleDropdownsQuery,
  useScheduleAssessmentMutation,
  useSkipAssessmentMutation,
  useUpdateAssessmentResultMutation,
  useSendInterviewInvitationMutation,
  useSubmitInterviewFeedbackMutation,
  useUpdateFinalInterviewApprovalMutation,
  useGetFinalApprovalsQuery,
  useGetFinalApprovalQuery,
  useDecideFinalApprovalMutation,
  useCreateCandidateOfferMutation,
  useGetOffersQuery,
  useGetOfferQuery,
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useExtendOfferMutation,
  useRespondToOfferMutation,
  useGetOfferLetterUrlQuery,
  useLazyGetOfferLetterUrlQuery,
  useGetCandidatesForVerificationQuery,
  useGetPendingBgvDocumentsQuery,
  useGetAllVerificationCandidatesQuery,
  useUploadCandidateDocumentMutation,
  useUploadCandidateDocumentFileMutation,
  useGetCandidateDocumentFileQuery,
  useLazyGetCandidateDocumentFileQuery,
  usePerformCandidateBgvMutation,
  useGetBgvsQuery,
  useStartBgvMutation,
  useGetBgvQuery,
  useUpdateBgvMutation,
  useUpdateBgvDocumentMutation,
  useGetCandidatesForJoiningQuery,
  useApproveCandidateJoiningMutation,
  useGetJoiningsQuery,
  useGetJoiningQuery,
  usePrepareJoiningMutation,
  useUpdateJoiningMutation,
  useSendJoiningEmailForRecordMutation,
  useConfirmJoiningMutation,
  useSendWelcomeEmailMutation,
  useSendJoiningEmailMutation,
  useSendTeamAssignmentEmailMutation,
} = recruitmentApi;

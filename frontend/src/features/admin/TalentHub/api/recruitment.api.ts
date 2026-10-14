import { baseApi } from "@/app/baseApi";
import type {
  CreateRequisitionRequest,
  RequisitionActionRequest,
  RequisitionMasterResponse,
  CandidateApplicationRequest,
  RecruitmentDashboardResponse,
  RecruitmentLookupResponse,
  ResumeScreeningRequest,
  ResumeScreeningResponse,
  ScheduleAssessmentRequest,
  SkipAssessmentRequest,
  ScheduleInterviewRequest,
  SendInterviewInvitationRequest,
  AssessmentResultRequest,
  FinalInterviewApprovalRequest,
  InterviewFeedbackRequest,
  CandidateOfferRequest,
  UploadCandidateDocumentRequest,
  UploadCandidateDocumentFileRequest,
  UploadCandidateDocumentFileResponse,
  CandidateBgvRequest,
  SendWelcomeEmailRequest,
  SendJoiningEmailRequest,
  SendTeamAssignmentEmailRequest,
  ApproveCandidateJoiningRequest,
  PublishJobOpeningRequest,
  RecruitmentEmailResponse,
} from "../types/recruitment.types";

// ======================================================
// FILE URL HELPER (not an API call – plain utility)
// ======================================================

const API_URL: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:3001/api";

export function recruitmentFileUrl(
  filePath: string,
  fileExtension?: string
) {
  if (/^https?:\/\//i.test(filePath)) return filePath;

  const apiBaseUrl = new URL(API_URL);
  const normalizedPath = filePath.startsWith("/")
    ? filePath
    : `/${filePath}`;

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

    getRecruitmentDashboard: builder.query<
      RecruitmentDashboardResponse,
      void
    >({
      query: () => ({
        url: "/recruitment/dashboard",
        method: "GET",
      }),

      providesTags: ["Recruitment"],
    }),


    // ==================================================
    // REQUISITIONS
    // ==================================================

    getPendingRequisitions: builder.query<
      unknown[],
      void
    >({
      query: () => ({
        url: "/recruitment/pendingrequisitions",
        method: "GET",
      }),

      providesTags: ["Recruitment"],
    }),

    getRequisitionMaster: builder.query<
      RequisitionMasterResponse,
      void
    >({
      query: () => ({
        url: "/recruitment/requisitionmaster",
        method: "GET",
      }),

      providesTags: ["Recruitment"],
    }),

    createRequisition: builder.mutation<
      unknown,
      CreateRequisitionRequest
    >({
      query: (body) => ({
        url: "/recruitment/requisition",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Recruitment"],
    }),

    updateRequisition: builder.mutation<
      unknown,
      RequisitionActionRequest
    >({
      query: (body) => ({
        url: "/recruitment/requisitionaction",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Recruitment"],
    }),


    // ==================================================
    // JOB OPENINGS
    // ==================================================

    getJobOpenings: builder.query<
      unknown[],
      void
    >({
      query: () => ({
        url: "/recruitment/jobopenings",
        method: "GET",
      }),

      providesTags: ["Recruitment"],
    }),

    getJobOpeningMaster: builder.query<
      RecruitmentLookupResponse,
      void
    >({
      query: () => ({
        url: "/recruitment/jobopeningmaster",
        method: "GET",
      }),

      providesTags: ["Recruitment"],
    }),

    getRecruitmentSources: builder.query<
      RecruitmentLookupResponse,
      void
    >({
      query: () => ({
        url: "/recruitment/sources",
        method: "GET",
      }),

      providesTags: ["Recruitment"],
    }),

    createJobOpening: builder.mutation<
      unknown,
      number
    >({
      query: (requisitionId) => ({
        url: "/recruitment/jobopening",
        method: "POST",
        body: { requisitionId },
      }),

      invalidatesTags: ["Recruitment"],
    }),

    publishJobOpening: builder.mutation<
      unknown,
      PublishJobOpeningRequest
    >({
      query: ({ jobOpeningId, closingDate }) => ({
        url: "/recruitment/jobopeningpublish",
        method: "POST",
        body: { jobOpeningId, closingDate },
      }),

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

        formData.append(
          "jobOpeningId",
          String(request.jobOpeningId)
        );

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

      invalidatesTags: ["Recruitment"],
    }),

    // applicationStatusId is optional – pass undefined to fetch all
    getCandidateApplications: builder.query<
      unknown[],
      number | void
    >({
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

    updateResumeScreening: builder.mutation<
      ResumeScreeningResponse[],
      ResumeScreeningRequest
    >({
      query: (body) => ({
        url: "/recruitment/screening",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Recruitment"],
    }),


    // ==================================================
    // ASSESSMENTS
    // ==================================================

    getCandidatesForAssessment: builder.query<
      unknown[],
      void
    >({
      query: () => ({
        url: "/recruitment/assessmentscheduling",
        method: "GET",
      }),

      providesTags: ["Recruitment"],
    }),

    scheduleAssessment: builder.mutation<
      unknown,
      ScheduleAssessmentRequest
    >({
      query: (body) => ({
        url: "/recruitment/assessmentschedule",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Recruitment"],
    }),

    skipAssessment: builder.mutation<
      unknown,
      SkipAssessmentRequest
    >({
      query: (body) => ({
        url: "/recruitment/skipcandidateassessment",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Recruitment"],
    }),

    updateAssessmentResult: builder.mutation<
      unknown,
      AssessmentResultRequest
    >({
      query: (body) => ({
        url: "/recruitment/assessmentresult",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Recruitment"],
    }),


    // ==================================================
    // INTERVIEWS
    // ==================================================

    getCandidatesEligibleForInterview: builder.query<
      unknown[],
      void
    >({
      query: () => ({
        url: "/recruitment/intervieweligible",
        method: "GET",
      }),

      providesTags: ["Recruitment"],
    }),

    scheduleInterview: builder.mutation<
      unknown,
      ScheduleInterviewRequest
    >({
      query: (body) => ({
        url: "/recruitment/interviewschedule",
        method: "POST",
        body,
      }),

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

      invalidatesTags: ["Recruitment"],
    }),


    // ==================================================
    // OFFERS
    // ==================================================

    createCandidateOffer: builder.mutation<
      unknown,
      CandidateOfferRequest
    >({
      query: (body) => ({
        url: "/recruitment/candidateoffer",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Recruitment"],
    }),


    // ==================================================
    // DOCUMENT VERIFICATION
    // ==================================================

    getCandidatesForVerification: builder.query<
      unknown[],
      void
    >({
      query: () => ({
        url: "/recruitment/candidatesforverification",
        method: "GET",
      }),

      providesTags: ["Recruitment"],
    }),

    uploadCandidateDocument: builder.mutation<
      unknown,
      UploadCandidateDocumentRequest
    >({
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
      query: ({ applicationId, documentType, file }) => {

        const formData = new FormData();

        formData.append(
          "applicationId",
          String(applicationId)
        );

        formData.append(
          "documentType",
          String(documentType)
        );

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
    getCandidateDocumentFile: builder.query<
      Blob,
      string
    >({
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
      unknown,
      CandidateBgvRequest
    >({
      query: (body) => ({
        url: "/recruitment/bgvcandidate",
        method: "POST",
        body,
      }),

      invalidatesTags: ["Recruitment"],
    }),


    // ==================================================
    // JOINING
    // ==================================================

    getCandidatesForJoining: builder.query<
      unknown[],
      void
    >({
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
  useScheduleAssessmentMutation,
  useSkipAssessmentMutation,
  useUpdateAssessmentResultMutation,
  useGetCandidatesEligibleForInterviewQuery,
  useScheduleInterviewMutation,
  useSendInterviewInvitationMutation,
  useSubmitInterviewFeedbackMutation,
  useUpdateFinalInterviewApprovalMutation,
  useCreateCandidateOfferMutation,
  useGetCandidatesForVerificationQuery,
  useUploadCandidateDocumentMutation,
  useUploadCandidateDocumentFileMutation,
  useGetCandidateDocumentFileQuery,
  useLazyGetCandidateDocumentFileQuery,
  usePerformCandidateBgvMutation,
  useGetCandidatesForJoiningQuery,
  useApproveCandidateJoiningMutation,
  useSendWelcomeEmailMutation,
  useSendJoiningEmailMutation,
  useSendTeamAssignmentEmailMutation,
} = recruitmentApi;

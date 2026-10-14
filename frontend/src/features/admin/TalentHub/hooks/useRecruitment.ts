import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { toast } from "react-toastify";

import {
  INITIAL_CANDIDATES,
  OPENING_DEPARTMENTS,
} from "../constants/recruitment.constants";

import {
  useGetJobOpeningsQuery,
  useGetPendingRequisitionsQuery,
  useGetRecruitmentDashboardQuery,
  useGetCandidateApplicationsQuery,
  useCreateRequisitionMutation,
  useUpdateRequisitionMutation,
  useCreateJobOpeningMutation,
  recruitmentFileUrl,
} from "../api/recruitment.api";

import type {
  CreateRequisitionRequest,
  Approval,
  ApprovalStatus,
  Candidate,
  CandidateStage,
  InterviewSchedule,
  JobOpening,
  RecruitmentTab,
} from "../types/recruitment.types";

import { validateJobOpening } from "../validation/recruitment.validation";

// ======================================================
// RE-EXPORTS FOR COMPONENTS
// Components import API hooks from this file, never from
// "../api/recruitment.api" directly.
// ======================================================

export {
  recruitmentFileUrl,
  useGetRecruitmentDashboardQuery,
  useGetRequisitionMasterQuery,
  useCreateRequisitionMutation,
  useGetJobOpeningMasterQuery,
  useGetRecruitmentSourcesQuery,
  useCreateCandidateApplicationMutation,
  useGetCandidateApplicationsQuery,
  useSendInterviewInvitationMutation,
  useUpdateResumeScreeningMutation,
  useUploadCandidateDocumentFileMutation,
  useLazyGetCandidateDocumentFileQuery,
  usePerformCandidateBgvMutation,
  useApproveCandidateJoiningMutation,
  useSendWelcomeEmailMutation,
  useSendJoiningEmailMutation,
  useSendTeamAssignmentEmailMutation,
} from "../api/recruitment.api";

// ======================================================
// HELPERS
// ======================================================

type RecruitmentRow = Record<string, unknown>;

function toRows(response: unknown): RecruitmentRow[] {
  if (!Array.isArray(response)) {
    throw new Error("Recruitment API returned an invalid response.");
  }

  return response.map((row) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      throw new Error("Recruitment API returned an invalid record.");
    }
    return row as RecruitmentRow;
  });
}

function readValue(row: RecruitmentRow, ...aliases: string[]) {
  const normalizedAliases = new Set(
    aliases.map((alias) => alias.toLowerCase())
  );
  const entry = Object.entries(row).find(([key]) =>
    normalizedAliases.has(key.toLowerCase())
  );
  return entry?.[1];
}

function readText(row: RecruitmentRow, aliases: string[], fallback: string) {
  const value = readValue(row, ...aliases);
  return value === null || value === undefined || value === ""
    ? fallback
    : String(value);
}

function readNumber(row: RecruitmentRow, aliases: string[], fallback = 0) {
  const value = Number(readValue(row, ...aliases));
  return Number.isFinite(value) ? value : fallback;
}

// Works for RTK Query errors (FetchBaseQueryError / SerializedError), plain Errors
// and string / array `message` bodies.
// Components import this as `getApiErrorMessage`.
function getErrorMessage(error: unknown, fallback: string): string {
  if (!error) return fallback;

  if (typeof error === "string") return error || fallback;

  const errorResponse = error as {
    data?: unknown;
    message?: unknown;
    error?: unknown;
  };

  const { data } = errorResponse;

  if (data && typeof data === "object") {
    const body = data as { message?: unknown; Message?: unknown };
    const message = body.Message ?? body.message;

    if (Array.isArray(message) && message.length > 0) {
      return message.map(String).join(", ");
    }

    if (typeof message === "string" && message) return message;
  }

  if (typeof errorResponse.message === "string" && errorResponse.message) {
    return errorResponse.message;
  }

  if (typeof errorResponse.error === "string" && errorResponse.error) {
    return errorResponse.error;
  }

  return fallback;
}

export { getErrorMessage as getApiErrorMessage };

// Runs a mapper and captures its error instead of throwing during render
function safeMap<T>(
  run: () => T,
  fallbackMessage: string
): { value?: T; error?: string } {
  try {
    return { value: run() };
  } catch (error) {
    return { error: getErrorMessage(error, fallbackMessage) };
  }
}

function openingStatus(value: string): JobOpening["status"] {
  const status = value.toLowerCase();
  if (status.includes("draft")) return "Draft";
  if (status.includes("sent back") || status.includes("returned")) {
    return "Sent back";
  }
  if (status.includes("hold")) return "On hold";
  if (status.includes("pending") || status.includes("approval")) {
    return "Pending approval";
  }
  return "Open";
}

function mapOpening(row: RecruitmentRow): JobOpening {
  const id = readNumber(row, ["JobOpeningID", "OpeningID", "ID"]);
  const title = readText(row, ["JobTitle", "Title", "OpeningTitle"], "");
  if (!id || !title) {
    throw new Error("Job opening response is missing its ID or title.");
  }

  return {
    id,
    title,
    department: readText(row, ["DepartmentName", "Department"], "—"),
    location: readText(row, ["Location", "BranchName"], "—"),
    type: readText(row, ["EmploymentType", "JobType"], "—"),
    applicants: readNumber(
      row,
      ["ApplicantCount", "ApplicantsCount", "TotalApplicants"],
      0
    ),
    positions: readNumber(row, ["Vacancies", "Positions", "NoOfPositions"], 1),
    positionsFilled: readNumber(row, ["PositionsFilled", "FilledPositions"]),
    status: openingStatus(readText(row, ["Status", "OpeningStatus"], "Open")),
    posted: readText(row, ["PostedDate", "CreatedDate", "CreatedOn"], "—"),
  };
}

function mapDashboardCandidate(row: RecruitmentRow): Candidate | null {
  const id = readNumber(row, ["ApplicationID"]);
  const name = readText(row, ["CandidateName"], "");
  const role = readText(row, ["JobTitle"], "");
  if (!id || !name || !role) {
    throw new Error(
      "Recruitment dashboard application is missing its ID, candidate name, or job title."
    );
  }

  const status = readText(row, ["StatusName"], "Applied").toLowerCase();
  if (status.includes("reject") || status.includes("withdraw")) return null;

  let stage: CandidateStage = "Applied";
  if (
    status.includes("shortlist") ||
    status.includes("assessment") ||
    status.includes("screen")
  ) {
    stage = "Screening";
  } else if (status.includes("interview") || status.includes("scheduled")) {
    stage = "Interview";
  } else if (
    status.includes("document") ||
    status.includes("verif") ||
    status.includes("bgv")
  ) {
    stage = "Documents";
  } else if (status.includes("offer")) {
    stage = "Offer";
  } else if (status.includes("hired") || status.includes("joined")) {
    stage = "Hired";
  }

  const stageDuration = readText(row, ["StageDuration"], "");
  const durationMatch = stageDuration.match(/(\d+)\s*d/i);

  return {
    id,
    name,
    email: readText(row, ["Email", "CandidateEmail", "EmailAddress"], ""),
    candidateCode: readText(row, ["CandidateID", "CandidateCode"], ""),
    role,
    stage,
    rating: 0,
    daysInStage: durationMatch ? Number(durationMatch[1]) : 0,
    resumeUrl: (() => {
      const resumeUrl = readText(
        row,
        ["ResumeURL", "ResumeUrl", "ResumePath", "ResumeFilePath"],
        ""
      );
      const resumeExtension = readText(
        row,
        ["FileExtension", "ResumeFileExtension", "ResumeExtension", "ActualFileName"],
        ""
      );
      return resumeUrl
        ? recruitmentFileUrl(resumeUrl, resumeExtension || undefined)
        : "";
    })(),
  };
}

function mapPendingRequisition(row: RecruitmentRow): Approval | null {
  const id = readNumber(row, ["RequisitionID", "ID"]);
  const title = readText(
    row,
    ["JobTitle", "Title", "DesignationName", "Position"],
    ""
  );
  if (!id || !title) {
    return null;
  }

  const salaryMin = readValue(row, "SalaryRangeMin", "SalaryMin");
  const salaryMax = readValue(row, "SalaryRangeMax", "SalaryMax");
  const salaryBand =
    salaryMin !== undefined || salaryMax !== undefined
      ? `${salaryMin ?? "—"}–${salaryMax ?? "—"}`
      : "—";

  return {
    id,
    title,
    department: readText(row, ["DepartmentName", "Department"], "—"),
    location: readText(row, ["BranchName", "Location"], "—"),
    requestedBy: readText(row, ["RequestedByName", "EmployeeName"], "—"),
    requestedDate: readText(row, ["RequestedDate", "CreatedDate"], "—"),
    positions: readNumber(row, ["Vacancies", "Positions"], 0),
    reason: readText(row, ["Reason"], "—"),
    salaryBand,
    targetJoining: "—",
    justification: readText(row, ["Justification", "Remarks"], "—"),
    jobDescription: readText(row, ["JobDescription"], "—"),
    status: "waiting",
    chain: [],
  };
}

// ======================================================
// HOOK
// ======================================================

export const useRecruitment = () => {

  // ==================================================
  // LOCAL UI STATE
  // ==================================================

  const [activeTab, setActiveTab] = useState<RecruitmentTab>("pipeline");
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All open roles");
  const [selectedDepartment, setSelectedDepartment] =
    useState<(typeof OPENING_DEPARTMENTS)[number]>("All");
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [interviewSchedules, setInterviewSchedules] = useState<
    Record<number, InterviewSchedule>
  >({});
  const [actionError, setActionError] = useState("");
  const [selectedApprovalStatus, setSelectedApprovalStatus] =
    useState<ApprovalStatus>("waiting");
  const [approvalComments, setApprovalComments] = useState<
    Record<number, string>
  >({});
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [jobFormError, setJobFormError] = useState("");
  const [completedFeedbackTasks, setCompletedFeedbackTasks] = useState<
    number[]
  >([]);

  // ==================================================
  // JOB OPENINGS
  // ==================================================

  const {
    data: openingsResponse,
    error: openingsQueryError,
    isFetching: openingsFetching,
    refetch: refetchOpenings,
  } = useGetJobOpeningsQuery();

  // ==================================================
  // PENDING REQUISITIONS (APPROVALS)
  // ==================================================

  const {
    data: requisitionsResponse,
    error: requisitionsQueryError,
    isFetching: requisitionsFetching,
    refetch: refetchRequisitions,
  } = useGetPendingRequisitionsQuery();

  // ==================================================
  // DASHBOARD (PIPELINE CANDIDATES)
  // ==================================================

  const {
    data: dashboardResponse,
    error: dashboardQueryError,
    isFetching: dashboardFetching,
    refetch: refetchDashboard,
  } = useGetRecruitmentDashboardQuery();

  // ==================================================
  // CANDIDATE APPLICATIONS (RESUME URLS)
  // ==================================================

  const {
    data: applicationsResponse,
    error: applicationsQueryError,
    isFetching: applicationsFetching,
    refetch: refetchApplications,
  } = useGetCandidateApplicationsQuery();

  // ==================================================
  // MUTATIONS
  // ==================================================

  const [
    updateRequisition,
    {
      isLoading: isUpdatingRequisition,
    },
  ] = useUpdateRequisitionMutation();

  const [
    createJobOpeningFromRequisition,
    {
      isLoading: isCreatingJobOpening,
    },
  ] = useCreateJobOpeningMutation();

  const [
    createRequisition,
    {
      isLoading: isSubmittingRequisition,
    },
  ] = useCreateRequisitionMutation();

  // ==================================================
  // MAPPED DATA
  // ==================================================

  const openingsResult = useMemo(
    () =>
      openingsResponse === undefined
        ? undefined
        : safeMap(
            () => toRows(openingsResponse).map(mapOpening),
            "Unable to load job openings."
          ),
    [openingsResponse]
  );

  const approvalsResult = useMemo(
    () =>
      requisitionsResponse === undefined
        ? undefined
        : safeMap(
            () =>
              toRows(requisitionsResponse)
                .map(mapPendingRequisition)
                .filter(
                  (approval): approval is Approval => approval !== null
                ),
            "Unable to load requisitions."
          ),
    [requisitionsResponse]
  );

  const dashboardResult = useMemo(
    () =>
      dashboardResponse === undefined
        ? undefined
        : safeMap(() => {
            if (
              !dashboardResponse.success ||
              !Array.isArray(dashboardResponse.data?.applications)
            ) {
              throw new Error(
                dashboardResponse.message ??
                  "Recruitment dashboard returned an invalid application list."
              );
            }

            return toRows(dashboardResponse.data.applications)
              .map(mapDashboardCandidate)
              .filter(
                (candidate): candidate is Candidate => candidate !== null
              );
          }, "Unable to load recruitment applications."),
    [dashboardResponse]
  );

  const resumesResult = useMemo(
    () =>
      applicationsResponse === undefined
        ? undefined
        : safeMap(() => {
            const resumesByApplicationId = new Map<number, string>();

            toRows(applicationsResponse).forEach((row) => {
              const applicationId = readNumber(row, [
                "ApplicationID",
                "CandidateApplicationID",
                "ApplicationId",
              ]);
              const resumeUrl = readText(
                row,
                ["ResumeURL", "ResumeUrl", "ResumePath", "ResumeFilePath"],
                ""
              );

              if (applicationId > 0 && resumeUrl) {
                const resumeExtension = readText(
                  row,
                  [
                    "FileExtension",
                    "ResumeFileExtension",
                    "ResumeExtension",
                    "ActualFileName",
                  ],
                  ""
                );

                resumesByApplicationId.set(
                  applicationId,
                  recruitmentFileUrl(resumeUrl, resumeExtension || undefined)
                );
              }
            });

            return resumesByApplicationId;
          }, "Unable to load candidate application details."),
    [applicationsResponse]
  );

  const openings: JobOpening[] = openingsResult?.value ?? [];
  const approvals: Approval[] = approvalsResult?.value ?? [];

  // Dashboard candidates + resume urls from the applications list
  const serverCandidates = useMemo(() => {
    const dashboardCandidates = dashboardResult?.value;
    if (!dashboardCandidates) return undefined;

    const resumes = resumesResult?.value;

    return dashboardCandidates.map((candidate) => ({
      ...candidate,
      resumeUrl: candidate.resumeUrl || resumes?.get(candidate.id) || "",
    }));
  }, [dashboardResult, resumesResult]);

  // Keep candidates editable locally (stage changes), re-synced on every fetch
  useEffect(() => {
    if (serverCandidates) {
      setCandidates(serverCandidates);
    }
  }, [serverCandidates]);

  // ==================================================
  // LOADING / ERROR
  // ==================================================

  const isRecruitmentLoading =
    openingsFetching ||
    requisitionsFetching ||
    dashboardFetching ||
    applicationsFetching;

  const loadErrors = [
    dashboardQueryError
      ? getErrorMessage(
          dashboardQueryError,
          "Unable to load recruitment applications."
        )
      : dashboardResult?.error,
    openingsQueryError
      ? getErrorMessage(openingsQueryError, "Unable to load job openings.")
      : openingsResult?.error,
    applicationsQueryError
      ? getErrorMessage(
          applicationsQueryError,
          "Unable to load candidate application details."
        )
      : resumesResult?.error,
    requisitionsQueryError
      ? getErrorMessage(requisitionsQueryError, "Unable to load requisitions.")
      : approvalsResult?.error,
  ].filter(Boolean);

  const recruitmentError = actionError || loadErrors.join(" ");

  // ==================================================
  // FILTERS
  // ==================================================

  const filteredCandidates = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return candidates.filter((candidate) => {
      const matchesSearch =
        !normalizedSearch ||
        candidate.name.toLowerCase().includes(normalizedSearch) ||
        candidate.role.toLowerCase().includes(normalizedSearch);
      const matchesRole =
        selectedRole === "All open roles" || candidate.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [candidates, search, selectedRole]);

  const filteredOpenings = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return openings.filter((opening) => {
      const matchesSearch =
        !normalizedSearch ||
        opening.title.toLowerCase().includes(normalizedSearch) ||
        opening.department.toLowerCase().includes(normalizedSearch) ||
        opening.location.toLowerCase().includes(normalizedSearch);
      const matchesDepartment =
        selectedDepartment === "All" ||
        opening.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });
  }, [openings, search, selectedDepartment]);

  const approvalCount = approvals.filter(
    (approval) => approval.status === "waiting"
  ).length;

  // ==================================================
  // REFRESH
  // ==================================================

  const refreshRecruitment = async () => {
    setActionError("");

    await Promise.allSettled([
      refetchOpenings(),
      refetchRequisitions(),
      refetchDashboard(),
      refetchApplications(),
    ]);
  };

  // ==================================================
  // APPROVE REQUISITION (CREATES JOB OPENING)
  // ==================================================

  const approveOpening = async (approvalId: number) => {
    setActionError("");

    try {
      await updateRequisition({
        requisitionId: approvalId,
        action: "APPROVE",
      }).unwrap();

      await createJobOpeningFromRequisition(approvalId).unwrap();

      await refreshRecruitment();

      toast.success("Requisition approved successfully.");

    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Unable to approve this requisition."
      );

      setActionError(message);
      toast.error(message);
    }
  };

  // ==================================================
  // REJECT / SEND BACK REQUISITION
  // ==================================================

  const sendBackOpening = async (approvalId: number) => {
    const comment = approvalComments[approvalId]?.trim();
    setActionError("");

    try {
      await updateRequisition({
        requisitionId: approvalId,
        action: "REJECT",
        reviewRemarks: comment,
      }).unwrap();

      setApprovalComments((previous) => ({ ...previous, [approvalId]: "" }));

      await refreshRecruitment();

      toast.success("Requisition sent back successfully.");

    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Unable to reject this requisition."
      );

      setActionError(message);
      toast.error(message);
    }
  };

  // ==================================================
  // CREATE REQUISITION (JOB OPENING FORM)
  // ==================================================

  const createJobOpening = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = validateJobOpening(new FormData(event.currentTarget));

    if (!validation.valid) {
      setJobFormError(validation.message);
      return false;
    }

    const {
      title,
      branchId,
      designationId,
      vacancies,
      salaryFrom,
      salaryTo,
      experienceRequired,
      priority,
    } = validation.values;

    const request: CreateRequisitionRequest = {
      jobTitle: title,
      branchId,
      designationId,
      vacancies,
      ...(salaryFrom ? { salaryRangeMin: Number(salaryFrom) } : {}),
      ...(salaryTo ? { salaryRangeMax: Number(salaryTo) } : {}),
      ...(experienceRequired ? { experienceRequired } : {}),
      ...(priority !== undefined ? { priority } : {}),
    };

    try {
      setActionError("");

      await createRequisition(request).unwrap();

      setIsJobDialogOpen(false);
      setSelectedApprovalStatus("waiting");
      setActiveTab("approvals");
      setJobFormError("");

      await refreshRecruitment();

      toast.success("Requisition submitted successfully.");

      return true;

    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Unable to submit this requisition."
      );

      setJobFormError(message);
      toast.error(message);

      return false;
    }
  };

  // ==================================================
  // CANDIDATE HELPERS
  // ==================================================

  const updateCandidateStage = (
    candidateId: number,
    stage: CandidateStage
  ) => {
    setCandidates((previous) =>
      previous.map((candidate) =>
        candidate.id === candidateId
          ? { ...candidate, stage, daysInStage: 0 }
          : candidate
      )
    );
  };

  const scheduleCandidateInterview = (
    candidateId: number,
    schedule: InterviewSchedule
  ) => {
    setInterviewSchedules((previous) => ({
      ...previous,
      [candidateId]: schedule,
    }));
  };

  // ==================================================
  // RETURN
  // ==================================================

  return {
    // ================================================
    // UI STATE
    // ================================================

    activeTab,
    setActiveTab,
    search,
    setSearch,
    selectedRole,
    setSelectedRole,
    selectedDepartment,
    setSelectedDepartment,
    selectedApprovalStatus,
    setSelectedApprovalStatus,
    approvalComments,
    setApprovalComments,
    isJobDialogOpen,
    setIsJobDialogOpen,
    jobFormError,
    setJobFormError,
    completedFeedbackTasks,
    setCompletedFeedbackTasks,

    // ================================================
    // DATA
    // ================================================

    candidates,
    interviewSchedules,
    filteredCandidates,
    openings,
    filteredOpenings,
    approvals,
    approvalCount,

    // ================================================
    // LOADING
    // ================================================

    isRecruitmentLoading,
    isUpdatingRequisition,
    isCreatingJobOpening,
    isSubmittingRequisition,

    // ================================================
    // ERROR
    // ================================================

    recruitmentError,

    // ================================================
    // ACTIONS
    // ================================================

    approveOpening,
    sendBackOpening,
    refreshRecruitment,
    createJobOpening,
    updateCandidateStage,
    scheduleCandidateInterview,
  };
};
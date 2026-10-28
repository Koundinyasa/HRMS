import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import { toast } from "react-toastify";

import {
  INITIAL_CANDIDATES,
  OPENING_DEPARTMENTS,
  REQUISITION_APPROVER_EMPLOYEE_ID,
} from "../constants/recruitment.constants";
import { useAppSelector } from "@/hooks/useAppSelector";

import {
  useGetJobOpeningsQuery,
  useGetAllRequisitionsForHRQuery,
  useGetPendingRequisitionsQuery,
  useGetRecruitmentDashboardQuery,
  useGetCandidateApplicationsQuery,
  useCreateRequisitionMutation,
  useUpdateRequisitionMutation,
  useUpdateResumeScreeningMutation,
  recruitmentFileUrl,
} from "../api/recruitment.api";

import type {
  CreateRequisitionRequest,
  Approval,
  ApprovalStatus,
  Candidate,
  CandidateStage,
  JobOpening,
  RecruitmentTab,
  ResumeScreeningRequest,
} from "../types/recruitment.types";

import { validateJobOpening } from "../validation/recruitment.validation";
import { getApiErrorMessage as getErrorMessage } from "../utils/recruitmentErrors";

const EMPTY_JOB_OPENINGS: JobOpening[] = [];

// ======================================================
// HELPERS
// ======================================================

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
type CandidateStageOverride = Pick<Candidate, "stage" | "daysInStage"> & {
  sourceStage: CandidateStage;
};

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
  const requisitionNo = readText(row, ["RequisitionNo", "RequisitionNumber"], "");
  const openingId = readValue(
    row,
    "JobOpeningID",
    "OpeningID",
    "JobID",
    "ID",
  );
  const parsedOpeningId = Number(openingId);
  const id =
    openingId !== null &&
    openingId !== undefined &&
    openingId !== "" &&
    Number.isFinite(parsedOpeningId)
      ? parsedOpeningId
      : requisitionNo;
  const title = readText(
    row,
    ["Role", "JobTitle", "Title", "OpeningTitle", "Position"],
    "",
  );
  if (!id || !title) {
    throw new Error("Job opening response is missing its ID or title.");
  }

  const salaryMin = readValue(row, "SalaryRangeMin");
  const salaryMax = readValue(row, "SalaryRangeMax");
  const salaryRange =
    salaryMin !== undefined || salaryMax !== undefined
      ? `${salaryMin == null ? "—" : Number(salaryMin).toLocaleString("en-IN")} – ${
          salaryMax == null ? "—" : Number(salaryMax).toLocaleString("en-IN")
        }`
      : undefined;

  return {
    id,
    requisitionNo: requisitionNo || undefined,
    title,
    department: readText(row, ["DepartmentName", "Department"], "—"),
    location: readText(row, ["Location", "BranchName"], "—"),
    type: readText(row, ["EmploymentType", "JobType", "Designation"], "—"),
    applicants: readNumber(
      row,
      ["ApplicantCount", "ApplicantsCount", "TotalApplicants", "Applicants"],
      0
    ),
    positions: readNumber(
      row,
      ["Vacancies", "Positions", "NoOfPositions", "TotalPositions"],
      1,
    ),
    positionsFilled: readNumber(row, ["PositionsFilled", "FilledPositions"]),
    salaryRange,
    experienceRequired: readText(row, ["ExperienceRequired"], ""),
    closingDate: readText(row, ["ClosingDate"], ""),
    status: openingStatus(
      readText(row, ["Status", "StatusName", "OpeningStatus"], "Open")
    ),
    posted: readText(
      row,
      ["PostedDate", "PublishedDate", "CreatedDate", "CreatedOn", "Posted", "ClosingDate"],
      "—"
    ),
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

  const providedSalaryBand = readText(
    row,
    ["SalaryRange", "SalaryBand"],
    "",
  );
  const salaryMin = readValue(row, "SalaryRangeMin", "SalaryMin");
  const salaryMax = readValue(row, "SalaryRangeMax", "SalaryMax");
  const salaryBand =
    providedSalaryBand ||
    (salaryMin !== undefined || salaryMax !== undefined
      ? `${salaryMin ?? "—"}–${salaryMax ?? "—"}`
      : "—");

  const rawStatus = readText(
    row,
    [
      "RequisitionApprovalStatus",
      "ApprovalStatus",
      "ApprovalStatusName",
      "RequisitionStatus",
      "StatusName",
      "Status",
    ],
    "Pending",
  )
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
  const status: Approval["status"] =
    rawStatus.includes("reject") || rawStatus.includes("sendback")
      ? "sent-back"
      : rawStatus.includes("approv") ||
          rawStatus.includes("accept") ||
          rawStatus.includes("ready")
        ? "ready"
        : "waiting";

  return {
    id,
    requisitionNo: readText(
      row,
      ["RequisitionNo", "RequisitionNumber"],
      `REQ-${id}`,
    ),
    title,
    department: readText(row, ["DepartmentName", "Department"], "—"),
    location: readText(row, ["BranchName", "Location"], "—"),
    designation: readText(row, ["DesignationName", "Designation"], "—"),
    requestedBy: readText(
      row,
      [
        "HiringManagerName",
        "HiringManager",
        "RequestedByName",
        "RequestedBy",
        "EmployeeName",
      ],
      "—",
    ),
    requestedDate: readText(
      row,
      ["RequestedDate", "RequisitionDate", "CreatedDate", "CreatedOn"],
      "—",
    ),
    positions: readNumber(row, ["Vacancies", "Positions"], 0),
    experienceRequired: readText(
      row,
      ["ExperienceRequired", "Experience", "RequiredExperience"],
      "—",
    ),
    priority: readText(row, ["PriorityName", "Priority"], "—"),
    reviewedDate: readText(row, ["ReviewedDate"], "—"),
    reviewRemarks: readText(
      row,
      ["ReviewRemarks", "ApprovalRemarks", "Remarks"],
      "—",
    ),
    reason: readText(row, ["Reason", "RequisitionReason"], "—"),
    salaryBand,
    targetJoining: readText(
      row,
      ["TargetJoining", "TargetJoiningDate", "ExpectedJoiningDate"],
      "—",
    ),
    justification: readText(row, ["Justification", "Remarks"], "—"),
    jobDescription: readText(
      row,
      ["JobDescription", "RoleDescription", "Description"],
      "—",
    ),
    status,
    chain: [],
  };
}

function assertStoredProcedureSuccess(
  response: unknown,
  fallback: string,
): string | undefined {
  const rows = Array.isArray(response)
    ? response
    : response && typeof response === "object" && "data" in response
      ? Array.isArray(response.data)
        ? response.data
        : [response.data]
      : response && typeof response === "object"
        ? [response]
        : [];
  const statusRow = Array.isArray(rows)
    ? [...rows].reverse().find(
        (row): row is RecruitmentRow =>
          Boolean(row) &&
          typeof row === "object" &&
          !Array.isArray(row) &&
          readValue(row as RecruitmentRow, "StatusCode", "statusCode") !==
            undefined,
      )
    : undefined;

  if (response && typeof response === "object" && "success" in response) {
    if (response.success === false) {
      const message =
        "message" in response && typeof response.message === "string"
          ? response.message
          : fallback;
      throw new Error(message);
    }
  }

  if (statusRow) {
    const statusCode = Number(readValue(statusRow, "StatusCode", "statusCode"));
    if (
      Number.isFinite(statusCode) &&
      (statusCode <= 0 || statusCode >= 400)
    ) {
      throw new Error(
        readText(statusRow, ["Message", "message"], fallback),
      );
    }

    return readText(statusRow, ["Message", "message"], "");
  }

  return undefined;
}

function verifyRequisitionStatus(
  response: unknown,
  requisitionId: number,
  expectedStatus: Approval["status"],
) {
  if (
    !response ||
    typeof response !== "object" ||
    !("success" in response) ||
    response.success !== true ||
    !("data" in response) ||
    !Array.isArray(response.data)
  ) {
    throw new Error("Unable to verify the updated requisition status.");
  }

  const row = toRows(response.data).find(
    (candidate) =>
      readNumber(candidate, ["RequisitionID", "ID"]) === requisitionId,
  );
  const approval = row ? mapPendingRequisition(row) : null;
  if (!approval || approval.status !== expectedStatus) {
    throw new Error(
      expectedStatus === "ready"
        ? "The requisition is still pending approval. Check the action result and try again."
        : "The requisition is still pending. Check the action result and try again.",
    );
  }
}

// ======================================================
// HOOK
// ======================================================

export const useRecruitment = () => {
  const roleId = useAppSelector((state) => state.auth.roleId);
  const isHrRole = roleId === "1" || roleId === "2";
  const canManageRequisitionApprovals = roleId === "3";

  // ==================================================
  // LOCAL UI STATE
  // ==================================================

  const [activeTab, setActiveTab] = useState<RecruitmentTab>("pipeline");
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All open roles");
  const [selectedDepartment, setSelectedDepartment] =
    useState<(typeof OPENING_DEPARTMENTS)[number]>("All");
  const [candidateStageOverrides, setCandidateStageOverrides] = useState<
    Record<number, CandidateStageOverride>
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

  const hrRequisitionsQuery = useGetAllRequisitionsForHRQuery(undefined, {
    skip: !isHrRole,
    refetchOnMountOrArgChange: true,
    pollingInterval: activeTab === "approvals" ? 15000 : 0,
  });
  const managerRequisitionsQuery = useGetPendingRequisitionsQuery(undefined, {
    skip: !canManageRequisitionApprovals,
    refetchOnMountOrArgChange: true,
    pollingInterval: activeTab === "approvals" ? 15000 : 0,
  });
  const requisitionsResponse = isHrRole
    ? hrRequisitionsQuery.data
    : managerRequisitionsQuery.data;
  const requisitionsQueryError = isHrRole
    ? hrRequisitionsQuery.error
    : managerRequisitionsQuery.error;
  const requisitionsFetching = isHrRole
    ? hrRequisitionsQuery.isFetching
    : managerRequisitionsQuery.isFetching;
  const refetchRequisitions = isHrRole
    ? hrRequisitionsQuery.refetch
    : managerRequisitionsQuery.refetch;

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
    createRequisition,
    {
      isLoading: isSubmittingRequisition,
    },
  ] = useCreateRequisitionMutation();

  const [updateResumeScreening] = useUpdateResumeScreeningMutation();
  // ==================================================
  // MAPPED DATA
  // ==================================================

  const openingsResult = useMemo(
    () =>
      openingsResponse === undefined
        ? undefined
        : safeMap(
            () => {
              if (Array.isArray(openingsResponse)) {
                return toRows(openingsResponse).map(mapOpening);
              }
              if (!openingsResponse.success || !Array.isArray(openingsResponse.data)) {
                throw new Error(
                  openingsResponse?.message ||
                    "Recruitment API returned an invalid job openings response.",
                );
              }
              return toRows(openingsResponse.data).map(mapOpening);
            },
            "Unable to load job openings."
          ),
    [openingsResponse]
  );

  const approvalsResult = useMemo(
    () =>
      requisitionsResponse === undefined
        ? undefined
        : safeMap(
            () => {
              if (Array.isArray(requisitionsResponse)) {
                return toRows(requisitionsResponse)
                  .map(mapPendingRequisition)
                  .filter(
                    (approval): approval is Approval => approval !== null,
                  );
              }

              if (
                !requisitionsResponse ||
                typeof requisitionsResponse !== "object" ||
                !("success" in requisitionsResponse) ||
                !requisitionsResponse.success ||
                !("data" in requisitionsResponse) ||
                !Array.isArray(requisitionsResponse.data)
              ) {
                const message =
                  requisitionsResponse &&
                  typeof requisitionsResponse === "object" &&
                  "message" in requisitionsResponse
                    ? requisitionsResponse.message
                    : undefined;
                throw new Error(
                  typeof message === "string"
                    ? message
                    : "Recruitment API returned an invalid requisition list.",
                );
              }
              return toRows(requisitionsResponse.data)
                .map(mapPendingRequisition)
                .filter(
                  (approval): approval is Approval => approval !== null
                );
            },
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

  const openings: JobOpening[] = useMemo(
    () => openingsResult?.value ?? [],
    [openingsResult?.value]
  );
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
    if (!serverCandidates) return;
    queueMicrotask(() => setCandidates(serverCandidates));
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
  // APPROVE REQUISITION
  // ==================================================

  const approveOpening = async (approvalId: number) => {
    if (!canManageRequisitionApprovals) {
      toast.error("Only an authorized hiring manager can approve requisitions.");
      return;
    }

    setActionError("");

    try {
      const actionResponse = await updateRequisition({
        requisitionId: approvalId,
        action: "APPROVE",
      }).unwrap();
      assertStoredProcedureSuccess(
        actionResponse,
        "The requisition approval was not applied.",
      );

      const requisitionsResponse = await refetchRequisitions().unwrap();
      verifyRequisitionStatus(requisitionsResponse, approvalId, "ready");

    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Unable to approve this requisition."
      );

      setActionError(message);
    }
  };

  // ==================================================
  // REJECT / SEND BACK REQUISITION
  // ==================================================

  const sendBackOpening = async (approvalId: number) => {
    if (!canManageRequisitionApprovals) {
      toast.error("Only an authorized hiring manager can reject requisitions.");
      return;
    }

    const comment = approvalComments[approvalId]?.trim();
    setActionError("");

    try {
      const actionResponse = await updateRequisition({
        requisitionId: approvalId,
        action: "REJECT",
        reviewRemarks: comment,
      }).unwrap();
      assertStoredProcedureSuccess(
        actionResponse,
        "The requisition rejection was not applied.",
      );

      const requisitionsResponse = await refetchRequisitions().unwrap();
      verifyRequisitionStatus(requisitionsResponse, approvalId, "sent-back");

      setApprovalComments((previous) => ({ ...previous, [approvalId]: "" }));

    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Unable to reject this requisition."
      );

      setActionError(message);
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
      jobDescription,
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
      jobDescription,
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

      return true;

    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Unable to submit this requisition."
      );
      setJobFormError(message);
      setJobFormError(message);

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
    const candidate = candidates.find((item) => item.id === candidateId);
    if (!candidate) return;

    setCandidateStageOverrides((previous) => ({
      ...previous,
      [candidateId]: {
        stage,
        daysInStage: 0,
        sourceStage:
          previous[candidateId]?.sourceStage ?? candidate.stage,
      },
    }));
  };

  const screenCandidate = async (
    applicationId: number,
    action: ResumeScreeningRequest["action"],
    reviewRemarks: string
  ): Promise<string | null> => {
    try {
      const response = await updateResumeScreening({
        applicationId,
        action,
        reviewRemarks,
      }).unwrap();
      return (
        assertStoredProcedureSuccess(
          response,
          action === "APPROVE"
            ? "Unable to shortlist this candidate."
            : "Unable to reject this candidate.",
        ) ||
        (action === "APPROVE"
          ? "Candidate shortlisted successfully."
          : "Candidate rejected successfully.")
      );
    } catch {
      return null;
    }
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
    filteredCandidates,
    openings,
    filteredOpenings,
    approvals,
    canManageRequisitionApprovals,
    approvalCount,

    // ================================================
    // LOADING
    // ================================================

    isRecruitmentLoading,
    isUpdatingRequisition,
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
    screenCandidate,
  };
};
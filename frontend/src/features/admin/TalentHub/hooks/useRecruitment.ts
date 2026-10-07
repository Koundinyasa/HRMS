import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import axios from "axios";
import { INITIAL_CANDIDATES, OPENING_DEPARTMENTS } from "../constants/recruitment.constants";
import {
  recruitmentApi,
  type CreateRequisitionRequest,
} from "../api/recruitment.api";
import type {
  Approval,
  ApprovalStatus,
  Candidate,
  CandidateStage,
  InterviewSchedule,
  JobOpening,
  RecruitmentTab,
} from "../types/recruitment.types";
import { validateJobOpening } from "../validation/recruitment.validation";

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
  const normalizedAliases = new Set(aliases.map((alias) => alias.toLowerCase()));
  const entry = Object.entries(row).find(([key]) =>
    normalizedAliases.has(key.toLowerCase()),
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
      0,
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
      "Recruitment dashboard application is missing its ID, candidate name, or job title.",
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
  } else if (
    status.includes("interview") ||
    status.includes("scheduled")
  ) {
    stage = "Interview";
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
    candidateCode: readText(row, ["CandidateID", "CandidateCode"], ""),
    role,
    stage,
    rating: 0,
    daysInStage: durationMatch ? Number(durationMatch[1]) : 0,
    resumeUrl: readText(
      row,
      ["ResumeURL", "ResumeUrl", "ResumePath", "ResumeFilePath"],
      "",
    ),
  };
}

function mapPendingRequisition(row: RecruitmentRow): Approval | null {
  const id = readNumber(row, ["RequisitionID", "ID"]);
  const title = readText(
    row,
    ["JobTitle", "Title", "DesignationName", "Position"],
    "",
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

export function useRecruitment() {
  const [activeTab, setActiveTab] = useState<RecruitmentTab>("pipeline");
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All open roles");
  const [selectedDepartment, setSelectedDepartment] =
    useState<(typeof OPENING_DEPARTMENTS)[number]>("All");
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [interviewSchedules, setInterviewSchedules] = useState<
    Record<number, InterviewSchedule>
  >({});
  const [openings, setOpenings] = useState<JobOpening[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [recruitmentError, setRecruitmentError] = useState("");
  const [isRecruitmentLoading, setIsRecruitmentLoading] = useState(true);
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

  const refreshRecruitment = useCallback(async () => {
    setIsRecruitmentLoading(true);
    setRecruitmentError("");
    const [openingResult, requisitionResult, dashboardResult] =
      await Promise.allSettled([
        recruitmentApi.getJobOpenings(),
        recruitmentApi.getPendingRequisitions(),
        recruitmentApi.getRecruitmentDashboard(),
      ]);
    const errors: string[] = [];
    const getErrorMessage = (error: unknown, fallback: string) =>
      axios.isAxiosError(error)
        ? String(error.response?.data?.message ?? error.message ?? fallback)
        : error instanceof Error
          ? error.message
          : fallback;

    if (dashboardResult.status === "fulfilled") {
      try {
        const dashboardResponse = dashboardResult.value;
        if (
          !dashboardResponse.success ||
          !Array.isArray(dashboardResponse.data?.applications)
        ) {
          throw new Error(
            dashboardResponse.message ??
              "Recruitment dashboard returned an invalid application list.",
          );
        }
        setCandidates(
          toRows(dashboardResponse.data.applications)
            .map(mapDashboardCandidate)
            .filter((candidate): candidate is Candidate => candidate !== null),
        );
      } catch (error) {
        errors.push(
          getErrorMessage(error, "Unable to load recruitment applications."),
        );
      }
    } else {
      errors.push(
        getErrorMessage(
          dashboardResult.reason,
          "Unable to load recruitment applications.",
        ),
      );
    }

    if (openingResult.status === "fulfilled") {
      try {
        const loadedOpenings = toRows(openingResult.value).map(mapOpening);
        setOpenings(loadedOpenings);

        const screeningResults = await Promise.allSettled(
          loadedOpenings.map((opening) =>
            recruitmentApi.getCandidatesForScreening(opening.id),
          ),
        );
        const resumesByApplicationId = new Map<number, string>();
        screeningResults.forEach((result) => {
          if (result.status !== "fulfilled") return;
          toRows(result.value).forEach((row) => {
            const applicationId = readNumber(row, [
              "ApplicationID",
              "CandidateApplicationID",
              "ApplicationId",
            ]);
            const resumeUrl = readText(
              row,
              ["ResumeURL", "ResumeUrl", "ResumePath", "ResumeFilePath"],
              "",
            );
            if (applicationId > 0 && resumeUrl) {
              resumesByApplicationId.set(applicationId, resumeUrl);
            }
          });
        });
        setCandidates((previous) =>
          previous.map((candidate) => ({
            ...candidate,
            resumeUrl:
              candidate.resumeUrl ||
              resumesByApplicationId.get(candidate.id) ||
              "",
          })),
        );
      } catch (error) {
        errors.push(getErrorMessage(error, "Unable to load job openings."));
      }
    } else {
      errors.push(
        getErrorMessage(openingResult.reason, "Unable to load job openings."),
      );
    }

    if (requisitionResult.status === "fulfilled") {
      try {
        setApprovals(
          toRows(requisitionResult.value)
            .map(mapPendingRequisition)
            .filter((approval): approval is Approval => approval !== null),
        );
      } catch (error) {
        errors.push(getErrorMessage(error, "Unable to load requisitions."));
      }
    } else {
      errors.push(
        getErrorMessage(
          requisitionResult.reason,
          "Unable to load requisitions.",
        ),
      );
    }

    setRecruitmentError(errors.join(" "));
    setIsRecruitmentLoading(false);
  }, []);

  useEffect(() => {
    void Promise.resolve().then(refreshRecruitment);
  }, [refreshRecruitment]);

  const approveOpening = async (approvalId: number) => {
    setRecruitmentError("");
    try {
      await recruitmentApi.updateRequisition({
        requisitionId: approvalId,
        action: "APPROVE",
      });
      await recruitmentApi.createJobOpening(approvalId);
      await refreshRecruitment();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? String(error.response?.data?.message ?? error.message)
        : error instanceof Error
          ? error.message
          : "Unable to approve this requisition.";
      setRecruitmentError(message);
    }
  };

  const sendBackOpening = async (approvalId: number) => {
    const comment = approvalComments[approvalId]?.trim();
    setRecruitmentError("");
    try {
      await recruitmentApi.updateRequisition({
        requisitionId: approvalId,
        action: "REJECT",
        reviewRemarks: comment,
      });
      setApprovalComments((previous) => ({ ...previous, [approvalId]: "" }));
      await refreshRecruitment();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? String(error.response?.data?.message ?? error.message)
        : error instanceof Error
          ? error.message
          : "Unable to reject this requisition.";
      setRecruitmentError(message);
    }
  };

  const createJobOpening = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateJobOpening(
      new FormData(event.currentTarget)
    );
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
      setRecruitmentError("");
      await recruitmentApi.createRequisition(request);
      setIsJobDialogOpen(false);
      setSelectedApprovalStatus("waiting");
      setActiveTab("approvals");
      setJobFormError("");
      await refreshRecruitment();
      return true;
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? String(error.response?.data?.message ?? error.message)
        : error instanceof Error
          ? error.message
          : "Unable to submit this requisition.";
      setJobFormError(message);
      return false;
    }
  };

  const updateCandidateStage = (candidateId: number, stage: CandidateStage) => {
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
    schedule: InterviewSchedule,
  ) => {
    setInterviewSchedules((previous) => ({
      ...previous,
      [candidateId]: schedule,
    }));
  };

  return {
    activeTab,
    setActiveTab,
    search,
    setSearch,
    selectedRole,
    setSelectedRole,
    selectedDepartment,
    setSelectedDepartment,
    candidates,
    interviewSchedules,
    filteredCandidates,
    openings,
    filteredOpenings,
    approvals,
    recruitmentError,
    isRecruitmentLoading,
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
    approvalCount,
    approveOpening,
    sendBackOpening,
    refreshRecruitment,
    createJobOpening,
    updateCandidateStage,
    scheduleCandidateInterview,
  };
}

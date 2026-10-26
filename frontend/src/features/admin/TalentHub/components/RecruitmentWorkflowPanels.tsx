import { useMemo, useState, type FormEvent } from "react";
import { ArrowUpRight, CalendarDays, X } from "lucide-react";
import type { ReactNode } from "react";
import { recruitmentFileUrl } from "../api/recruitment.api";
import {
  useGetAssessmentScheduleDropdownsQuery,
  useGetCandidatesForAssessmentQuery,
  useScheduleAssessmentMutation,
  useSkipAssessmentMutation,
  useUpdateAssessmentResultMutation,
} from "../api/recruitment.api";
import type {
  Candidate,
  CandidateStage,
  ResumeScreeningRequest,
} from "../types/recruitment.types";
import { EmptyState } from "./RecruitmentShared";
import { RecruitmentPagination } from "./RecruitmentPagination";

type ReviewDecision = "Reviewing" | "Shortlisted" | "Rejected";

function candidateCode(candidate: Candidate) {
  return (
    candidate.candidateCode ||
    `CAND-2026-${String(candidate.id + 77).padStart(3, "0")}`
  );
}

function resumeHref(candidate: Candidate) {
  const url = candidate.resumeUrl?.trim();
  if (!url) return "";
  return recruitmentFileUrl(url);
}

function PanelCard({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#e8e5dc] bg-white shadow-[0_8px_24px_rgba(39,48,41,0.04)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#efeee9] px-5 py-4 sm:px-6">
        <h2 className="text-base font-bold text-[#26332c]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function StatusPill({ children }: { children: ReactNode }) {
  const tone =
    children === "Scheduled"
      ? "bg-[#fff3d6] text-[#9b6811]"
      : children === "Skipped"
        ? "bg-[#f3eee2] text-[#786747]"
        : children === "Shortlisted" || children === "Qualified"
          ? "bg-[#e8f4ec] text-[#39724f]"
          : children === "Rejected"
            ? "bg-[#fbeceb] text-[#aa504c]"
            : "bg-[#f1f3f1] text-[#68756d]";

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tone}`}>
      {children}
    </span>
  );
}

function TableFrame({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] border-collapse whitespace-nowrap text-left text-sm">
        {children}
      </table>
    </div>
  );
}

function TableHeading({ children }: { children: ReactNode }) {
  return (
    <th className="bg-[#f8f8f5] px-4 py-3 text-xs font-semibold text-[#66736b] first:pl-5 last:pr-5 sm:first:pl-6 sm:last:pr-6">
      {children}
    </th>
  );
}

function TableCell({ children }: { children: ReactNode }) {
  return (
    <td className="border-t border-[#f0f0eb] px-4 py-3.5 text-xs text-[#55635a] first:pl-5 last:pr-5 sm:first:pl-6 sm:last:pr-6">
      {children}
    </td>
  );
}

export function ResumeScreeningPanel({
  candidates,
  updateCandidateStage,
  screenCandidate,
}: {
  candidates: Candidate[];
  updateCandidateStage: (candidateId: number, stage: CandidateStage) => void;
  screenCandidate: (
    applicationId: number,
    action: ResumeScreeningRequest["action"],
    reviewRemarks: string
  ) => Promise<string | null>;
}) {
  const [decisions, setDecisions] = useState<Record<number, ReviewDecision>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pendingCandidateId, setPendingCandidateId] = useState<number | null>(
    null
  );
  const [successMessage, setSuccessMessage] = useState("");
  const screeningCandidates = candidates.filter(
    (candidate) =>
      candidate.stage === "Applied" &&
      decisions[candidate.id] !== "Rejected" &&
      decisions[candidate.id] !== "Shortlisted"
  );
  const totalPages = Math.max(
    1,
    Math.ceil(screeningCandidates.length / pageSize),
  );
  const currentPage = Math.min(page, totalPages);
  const pageCandidates = screeningCandidates.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const setDecision = async (
    candidate: Candidate,
    action: ResumeScreeningRequest["action"]
  ) => {
    setPendingCandidateId(candidate.id);
    try {
      const reviewRemarks =
        action === "APPROVE"
          ? "Resume shortlisted for the next recruitment stage."
          : "Candidate does not meet the required experience.";
      const message = await screenCandidate(
        candidate.id,
        action,
        reviewRemarks
      );
      if (!message) return;

      const decision = action === "APPROVE" ? "Shortlisted" : "Rejected";
      setDecisions((previous) => ({ ...previous, [candidate.id]: decision }));
      setSuccessMessage(message);
      if (action === "APPROVE") {
        updateCandidateStage(candidate.id, "Screening");
      }
    } finally {
      setPendingCandidateId(null);
    }
  };

  return (
    <>
      <PanelCard
        title="Resume Screening"
        action={
          <span className="rounded-lg border border-[#eee9dc] bg-[#fcfaf5] px-3 py-2 text-xs font-medium text-[#74684d]">
            HR Manager · 294676
          </span>
        }
      >
        {screeningCandidates.length === 0 ? (
          <div className="p-5">
            <EmptyState message="No candidates are available for resume screening." />
          </div>
        ) : (
          <>
            <TableFrame>
              <thead>
                <tr>
                  <TableHeading>Candidate</TableHeading>
                  <TableHeading>Name</TableHeading>
                  <TableHeading>Job</TableHeading>
                  <TableHeading>Resume URL</TableHeading>
                  <TableHeading>Action</TableHeading>
                </tr>
              </thead>
              <tbody>
                {pageCandidates.map((candidate) => {
                const decision = decisions[candidate.id] ?? "Reviewing";
                return (
                  <tr
                    key={candidate.id}
                    className="odd:bg-white even:bg-[#fffaf0] transition-colors hover:bg-[#f3e4c5]"
                  >
                    <TableCell>
                      <span className="font-medium text-[#59665d]">
                        {candidateCode(candidate)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-[#303d34]">
                        {candidate.name}
                      </span>
                    </TableCell>
                    <TableCell>{candidate.role}</TableCell>
                    <TableCell>
                      {candidate.resumeUrl ? (
                        <>
                          <a
                            href={resumeHref(candidate)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 font-semibold text-[#a87519] hover:text-[#80540d]"
                          >
                            View Resume{" "}
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                          <span className="mt-1 block max-w-xs truncate text-[11px] text-[#939b95]">
                            {candidate.resumeUrl}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-[#939b95]">
                          Resume not available
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {decision === "Reviewing" ? (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={pendingCandidateId !== null}
                            onClick={() =>
                              void setDecision(candidate, "APPROVE")
                            }
                            className="rounded-lg bg-[#e8f4ec] px-3 py-2 text-xs font-semibold text-[#39724f] transition hover:bg-[#d9ecdf] disabled:cursor-wait disabled:opacity-60"
                          >
                            {pendingCandidateId === candidate.id
                              ? "Submitting..."
                              : "Shortlist"}
                          </button>
                          <button
                            type="button"
                            disabled={pendingCandidateId !== null}
                            onClick={() =>
                              void setDecision(candidate, "REJECT")
                            }
                            className="rounded-lg bg-[#fbeceb] px-3 py-2 text-xs font-semibold text-[#aa504c] transition hover:bg-[#f5dcda] disabled:cursor-wait disabled:opacity-60"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <StatusPill>{decision}</StatusPill>
                      )}
                    </TableCell>
                  </tr>
                );
              })}
              </tbody>
            </TableFrame>
            <RecruitmentPagination
              page={currentPage}
              pageSize={pageSize}
              totalCount={screeningCandidates.length}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </>
        )}
      </PanelCard>
      {successMessage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSuccessMessage("")}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="screening-success-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="screening-success-title"
              className="text-lg font-semibold text-[#28332d]"
            >
              Success
            </h2>
            <p className="mt-3 text-sm text-[#536159]">{successMessage}</p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSuccessMessage("")}
                className="rounded-lg bg-[#e5a538] px-4 py-2 text-sm font-semibold text-[#342712] hover:bg-[#d99a2b]"
              >
                OK
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

type AssessmentRecord = {
  candidate: Candidate;
  status: string;
  required: boolean;
  result: "Pending" | "Direct Interview" | "Qualified" | "Rejected";
  remarks: string;
  applicationId: number;
  candidateId: number | null;
  email: string | null;
  phone: string | null;
  jobOpeningId: number | null;
  isEligible: boolean | null;
  screeningDate: string | null;
  screeningRemarks: string | null;
  currentAssessmentRound: number | null;
  assessmentId: number | null;
  assessmentTypeId: number | null;
  assessmentTypeName: string | null;
  scheduledDate: string | null;
  assessmentStatusId: number | string | null;
  assessmentStatusName: string | null;
};

function assessmentRows(response: unknown): Record<string, unknown>[] {
  const rows =
    Array.isArray(response)
      ? response
      : response &&
          typeof response === "object" &&
          "data" in response &&
          Array.isArray(response.data)
        ? response.data
        : null;

  if (!rows) {
    throw new Error("Assessment API returned an invalid response.");
  }

  return rows.filter(
    (row): row is Record<string, unknown> =>
      Boolean(row) && typeof row === "object" && !Array.isArray(row),
  );
}

function hasProperty<K extends string>(
  value: unknown,
  key: K,
): value is Record<K, unknown> {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    key in value
  );
}

function dropdownRows(
  response: unknown,
  key: "candidates" | "assessmentTypes",
): Record<string, unknown>[] {
  if (!hasProperty(response, key)) {
    throw new Error("Assessment schedule dropdowns returned an invalid response.");
  }

  const rows = response[key];
  if (!Array.isArray(rows)) {
    throw new Error("Assessment schedule dropdowns returned an invalid response.");
  }
  return rows.filter(
    (row): row is Record<string, unknown> =>
      Boolean(row) && typeof row === "object" && !Array.isArray(row),
  );
}

function assessmentValue(
  row: Record<string, unknown>,
  ...names: string[]
): unknown {
  const wanted = new Set(
    names.map((name) => name.toLowerCase().replace(/[^a-z0-9]/g, "")),
  );
  const entry = Object.entries(row).find(([name]) =>
    wanted.has(name.toLowerCase().replace(/[^a-z0-9]/g, "")),
  );
  return entry?.[1];
}

function mapAssessmentRecords(
  response: unknown,
  candidates: Candidate[],
): AssessmentRecord[] {
  const candidatesById = new Map(
    candidates.map((candidate) => [candidate.id, candidate]),
  );
  return assessmentRows(response).map((row) => {
    const applicationId = Number(
      assessmentValue(row, "ApplicationID", "ApplicationId", "CandidateApplicationID"),
    );
    if (!Number.isInteger(applicationId) || applicationId <= 0) {
      throw new Error(
        "Assessment API returned a record without a valid application ID.",
      );
    }

    const existingCandidate = candidatesById.get(applicationId);
    const candidateName = assessmentValue(
      row,
      "CandidateName",
      "FullName",
      "Name",
    );
    const jobTitle = assessmentValue(row, "JobTitle", "Role", "Position");
    const candidate: Candidate = {
      id: applicationId,
      name:
        typeof candidateName === "string" && candidateName
          ? candidateName
          : existingCandidate?.name ?? `Candidate ${applicationId}`,
      email: existingCandidate?.email,
      candidateCode:
        String(assessmentValue(row, "CandidateCode", "CandidateNumber") ?? "") ||
        existingCandidate?.candidateCode,
      role:
        typeof jobTitle === "string" && jobTitle
          ? jobTitle
          : existingCandidate?.role ?? "—",
      stage: "Screening",
      rating: existingCandidate?.rating ?? 0,
      daysInStage: existingCandidate?.daysInStage ?? 0,
      resumeUrl: existingCandidate?.resumeUrl,
    };
    const rawStatus = String(
      assessmentValue(row, "AssessmentStatusName", "StatusName") ?? "",
    ).toLowerCase();
    const rawResult = String(
      assessmentValue(row, "AssessmentResult", "Result") ?? "",
    ).toLowerCase();
    const rawRequired = assessmentValue(row, "IsRequired", "Required");
    const rawEligible = assessmentValue(row, "IsEligible");
    const rawAssessmentStatus = assessmentValue(row, "AssessmentStatus");
    const toNullableNumber = (value: unknown) => {
      if (value === undefined || value === null || value === "") return null;
      const numberValue = Number(value);
      return Number.isFinite(numberValue) ? numberValue : null;
    };
    const toNullableString = (value: unknown) =>
      value === undefined || value === null || value === ""
        ? null
        : String(value);
    const isEligible =
      rawEligible === undefined || rawEligible === null
        ? null
        : rawEligible === true ||
          rawEligible === 1 ||
          String(rawEligible).toLowerCase() === "true";
    const required =
      rawRequired === undefined
        ? true
        : rawRequired === true ||
          rawRequired === 1 ||
          String(rawRequired).toLowerCase() === "true";

    return {
      candidate,
      status: rawStatus.includes("skip")
        ? "Skipped"
        : rawStatus.includes("sched")
          ? "Scheduled"
          : rawStatus.includes("reject")
            ? "Rejected"
            : rawStatus.includes("qualif")
              ? "Qualified"
              : rawStatus
                ? rawStatus.replace(/\b\w/g, (character) =>
                    character.toUpperCase(),
                  )
                : toNullableNumber(
                      assessmentValue(
                        row,
                        "AssessmentID",
                        "AssessmentId",
                        "CandidateAssessmentID",
                        "CandidateAssessmentId",
                        "AssessmentResultID",
                        "AssessmentResultId",
                        "ID",
                      ),
                    ) !== null
                  ? "Scheduled"
                  : "Pending",
      required,
      result: rawResult.includes("reject")
        ? "Rejected"
        : rawResult.includes("direct") || rawStatus.includes("skip")
          ? "Direct Interview"
          : rawResult.includes("qualif")
            ? "Qualified"
            : "Pending",
      remarks: String(assessmentValue(row, "Remarks", "ReviewRemarks") ?? ""),
      applicationId,
      candidateId: toNullableNumber(
        assessmentValue(row, "CandidateID", "CandidateId"),
      ),
      email: toNullableString(assessmentValue(row, "Email")),
      phone: toNullableString(assessmentValue(row, "Phone")),
      jobOpeningId: toNullableNumber(
        assessmentValue(row, "JobOpeningID", "JobOpeningId"),
      ),
      isEligible,
      screeningDate: toNullableString(
        assessmentValue(row, "ScreeningDate"),
      ),
      screeningRemarks: toNullableString(
        assessmentValue(row, "ScreeningRemarks"),
      ),
      currentAssessmentRound: toNullableNumber(
        assessmentValue(row, "CurrentAssessmentRound"),
      ),
      assessmentId: toNullableNumber(
        assessmentValue(
          row,
          "AssessmentID",
          "AssessmentId",
          "CandidateAssessmentID",
          "CandidateAssessmentId",
          "AssessmentResultID",
          "AssessmentResultId",
          "ID",
        ),
      ),
      assessmentTypeId: toNullableNumber(
        assessmentValue(row, "AssessmentTypeID", "AssessmentTypeId"),
      ),
      assessmentTypeName: toNullableString(
        assessmentValue(
          row,
          "AssessmentTypeName",
          "AssessmentType",
          "AssessmentName",
          "AssessmentTitle",
        ),
      ),
      scheduledDate: toNullableString(
        assessmentValue(row, "ScheduledDate"),
      ),
      assessmentStatusId:
        typeof rawAssessmentStatus === "number" ||
        typeof rawAssessmentStatus === "string"
          ? rawAssessmentStatus
          : null,
      assessmentStatusName: toNullableString(
        assessmentValue(row, "AssessmentStatusName"),
      ),
    };
  });
}

function assessmentErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "data" in error) {
    const data = error.data;
    if (data && typeof data === "object" && "message" in data) {
      const message = data.message;
      if (typeof message === "string") return message;
      if (Array.isArray(message)) return message.map(String).join(", ");
    }
  }
  return "Unable to load assessment candidates.";
}

function assessmentMutationErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "data" in error) {
    const data = error.data;
    if (data && typeof data === "object" && "message" in data) {
      const message = data.message;
      if (typeof message === "string") return message;
      if (Array.isArray(message)) return message.map(String).join(", ");
    }
  }
  return error instanceof Error ? error.message : fallback;
}

export function AssessmentManagementPanel({
  candidates,
}: {
  candidates: Candidate[];
}) {
  const {
    data: assessmentsResponse,
    error: assessmentsError,
    isLoading: assessmentsLoading,
    refetch: refetchAssessments,
  } = useGetCandidatesForAssessmentQuery();
  const {
    data: scheduleDropdownsResponse,
    error: scheduleDropdownsError,
    isLoading: scheduleDropdownsLoading,
  } = useGetAssessmentScheduleDropdownsQuery();
  const [recordOverrides, setRecordOverrides] = useState<
    Record<number, Partial<Omit<AssessmentRecord, "candidate">>>
  >({});
  const [isSkipDialogOpen, setIsSkipDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [assessmentDecisionRecord, setAssessmentDecisionRecord] =
    useState<AssessmentRecord | null>(null);
  const [assessmentDecision, setAssessmentDecision] = useState<boolean | null>(
    null,
  );
  const [assessmentScore, setAssessmentScore] = useState("");
  const [assessmentRemarks, setAssessmentRemarks] = useState("");
  const [assessmentResultError, setAssessmentResultError] = useState("");
  const [updateAssessmentResult, { isLoading: isUpdatingAssessmentResult }] =
    useUpdateAssessmentResultMutation();
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [scheduleCandidateId, setScheduleCandidateId] = useState("");
  const [assessmentTypeIdValue, setAssessmentTypeId] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [scheduleError, setScheduleError] = useState("");
  const [skipError, setSkipError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [scheduleAssessment, { isLoading: isScheduling }] =
    useScheduleAssessmentMutation();
  const [skipAssessment, { isLoading: isSkipping }] =
    useSkipAssessmentMutation();

  const mappedAssessments = useMemo(() => {
    if (assessmentsResponse === undefined) {
      return { records: [], error: "" };
    }
    try {
      return {
        records: mapAssessmentRecords(assessmentsResponse, candidates),
        error: "",
      };
    } catch (error) {
      return {
        records: [],
        error:
          error instanceof Error
            ? error.message
            : "Unable to load assessment candidates.",
      };
    }
  }, [assessmentsResponse, candidates]);
  const records = mappedAssessments.records.map((record) => ({
    ...record,
    ...recordOverrides[record.candidate.id],
  }));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const scheduleDropdowns = useMemo(() => {
    if (scheduleDropdownsResponse === undefined) {
      return { assessmentTypes: [], error: "" };
    }
    try {
      return {
        assessmentTypes: dropdownRows(scheduleDropdownsResponse, "assessmentTypes"),
        error: "",
      };
    } catch (error) {
      return {
        assessmentTypes: [],
        error:
          error instanceof Error
            ? error.message
            : "Unable to load assessment schedule dropdowns.",
      };
    }
  }, [scheduleDropdownsResponse]);

  const updateRecord = (
    candidateId: number,
    updates: Partial<Omit<AssessmentRecord, "candidate">>
  ) => {
    setRecordOverrides((previous) => ({
      ...previous,
      [candidateId]: { ...previous[candidateId], ...updates },
    }));
  };

  const schedulableRecords = records.filter(
    (record) => record.status === "Pending" && record.required,
  );
  const totalPages = Math.max(1, Math.ceil(records.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRecords = records.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const scheduleCandidates = schedulableRecords;
  const scheduleAssessmentTypes = useMemo(
    () =>
      scheduleDropdowns.assessmentTypes.flatMap((row) => {
        const id = Number(
          assessmentValue(
            row,
            "AssessmentTypeID",
            "AssessmentTypeId",
            "AssessmentID",
            "AssessmentId",
            "ID",
            "Id",
          ),
        );
        const name = assessmentValue(
          row,
          "AssessmentType",
          "AssessmentTypeName",
          "AssessmentTypeDescription",
          "AssessmentName",
          "Name",
        );
        return Number.isInteger(id) && id > 0 && typeof name === "string"
          ? [{ id, name }]
          : [];
      }),
    [scheduleDropdowns.assessmentTypes],
  );
  const handleOpenSchedule = (applicationId?: number) => {
    const selectedApplicationId = scheduleCandidates.some(
      (record) => record.candidate.id === applicationId,
    )
      ? applicationId
      : scheduleCandidates[0]?.candidate.id;
    setScheduleCandidateId(String(selectedApplicationId ?? ""));
    setAssessmentTypeId(String(scheduleAssessmentTypes[0]?.id ?? ""));
    setScheduledDate("");
    setScheduleError("");
    setSuccessMessage("");
    setIsScheduleDialogOpen(true);
  };

  const handleSchedule = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const applicationId = Number(scheduleCandidateId);
    const assessmentTypeId = Number(
      assessmentTypeIdValue || scheduleAssessmentTypes[0]?.id,
    );
    if (
      !Number.isInteger(applicationId) ||
      !scheduleCandidates.some((record) => record.candidate.id === applicationId)
    ) {
      setScheduleError("Select a candidate who is pending assessment.");
      return;
    }
    if (
      !Number.isInteger(assessmentTypeId) ||
      !scheduleAssessmentTypes.some((assessmentType) => assessmentType.id === assessmentTypeId)
    ) {
      setScheduleError("Select a valid assessment type.");
      return;
    }

    setScheduleError("");
    try {
      const scheduleResponse = await scheduleAssessment({
        applicationId,
        assessmentTypeId,
        scheduledDate: new Date(scheduledDate).toISOString(),
      }).unwrap();

      const scheduleResponseData =
        scheduleResponse &&
        typeof scheduleResponse === "object" &&
        !Array.isArray(scheduleResponse) &&
        "data" in scheduleResponse
          ? scheduleResponse.data
          : scheduleResponse;
      const scheduleRows = Array.isArray(scheduleResponseData)
        ? scheduleResponseData.filter(
            (row): row is Record<string, unknown> =>
              Boolean(row) && typeof row === "object" && !Array.isArray(row),
          )
        : scheduleResponseData &&
            typeof scheduleResponseData === "object" &&
            !Array.isArray(scheduleResponseData)
          ? [scheduleResponseData as Record<string, unknown>]
        : [];
      const scheduledRecord = scheduleRows.find(
        (row) =>
          Number(
            assessmentValue(
              row,
              "ApplicationID",
              "ApplicationId",
              "CandidateApplicationID",
            ),
          ) === applicationId,
      ) ?? (scheduleRows.length === 1 ? scheduleRows[0] : undefined);
      const scheduledAssessmentId = Number(
        scheduledRecord
          ? assessmentValue(
              scheduledRecord,
              "AssessmentID",
              "AssessmentId",
              "CandidateAssessmentID",
              "CandidateAssessmentId",
              "AssessmentResultID",
              "AssessmentResultId",
              "ID",
            )
          : NaN,
      );
      const refreshed = await refetchAssessments().unwrap();
      const refreshedRecord = mapAssessmentRecords(
        refreshed,
        candidates,
      ).find((record) => record.applicationId === applicationId);
      const assessmentId =
        refreshedRecord?.assessmentId ??
        (Number.isInteger(scheduledAssessmentId) && scheduledAssessmentId > 0
          ? scheduledAssessmentId
          : null);

      if (!assessmentId) {
        setScheduleError(
          "Assessment was scheduled, but the refreshed assessment list did not return its assessment ID. Refresh the page or check the assessment scheduling API response.",
        );
        return;
      }

      updateRecord(applicationId, {
        assessmentId,
        assessmentTypeId,
        assessmentTypeName:
          scheduleAssessmentTypes.find((item) => item.id === assessmentTypeId)
            ?.name ?? null,
        scheduledDate,
        status: "Scheduled",
        assessmentStatusName: "Scheduled",
        result: "Pending",
      });
      setIsScheduleDialogOpen(false);
      setSuccessMessage("Assessment scheduled successfully.");
    } catch (error) {
      setScheduleError(
        assessmentMutationErrorMessage(error, "Unable to schedule assessment."),
      );
    }

  };

  const handleSkip = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const candidateId = Number(selectedCandidateId);
    if (
      !Number.isFinite(candidateId) ||
      !records.some((record) => record.candidate.id === candidateId)
    ) {
      setSkipError("Select a valid candidate.");
      return;
    }
    setSkipError("");
    try {
      await skipAssessment({
        applicationId: candidateId,
        remarks: remarks.trim() || undefined,
      }).unwrap();
      setIsSkipDialogOpen(false);
      setSelectedCandidateId("");
      setRemarks("");
      setSuccessMessage("Assessment skipped successfully.");
    } catch (error) {
      setSkipError(
        assessmentMutationErrorMessage(error, "Unable to skip assessment."),
      );
    }
  };

  const openAssessmentDecision = (
    record: AssessmentRecord,
    isQualified: boolean,
  ) => {
    setAssessmentDecisionRecord(record);
    setAssessmentDecision(isQualified);
    setAssessmentScore("");
    setAssessmentRemarks("");
    setAssessmentResultError("");
  };

  const handleAssessmentResult = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (
      assessmentDecisionRecord?.assessmentId === null ||
      assessmentDecisionRecord?.assessmentId === undefined ||
      assessmentDecision === null
    ) {
      setAssessmentResultError(
        "This candidate does not have a scheduled assessment to update.",
      );
      return;
    }
    const score = Number(assessmentScore);
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      setAssessmentResultError("Enter a score between 0 and 100.");
      return;
    }

    setAssessmentResultError("");
    try {
      await updateAssessmentResult({
        assessmentId: assessmentDecisionRecord.assessmentId,
        score,
        isQualified: assessmentDecision,
        remarks: assessmentRemarks.trim() || undefined,
      }).unwrap();
      setAssessmentDecisionRecord(null);
      setAssessmentDecision(null);
      setSuccessMessage("Assessment result saved successfully.");
    } catch (error) {
      setAssessmentResultError(
        assessmentMutationErrorMessage(
          error,
          "Unable to update assessment result.",
        ),
      );
    }
  };

  return (
    <>
      <div className="space-y-5">
        <PanelCard
          title="Assessment Management"
          action={
            <div className="punch-horizontal-scroll w-full min-w-0 overflow-x-auto sm:w-auto">
              <div className="flex w-max min-w-full flex-nowrap items-center gap-2 sm:min-w-0">
                <button
                  type="button"
                  onClick={() => handleOpenSchedule()}
                  disabled={scheduleCandidates.length === 0}
                  className="inline-flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-[#e5a538] px-3.5 text-xs font-semibold text-[#342712] transition hover:bg-[#d99a2b] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CalendarDays className="h-3.5 w-3.5" />
                  Schedule Assessment
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSkipError("");
                    setSuccessMessage("");
                    setSelectedCandidateId(
                      String(records.find((record) => record.status !== "Skipped")?.candidate.id ?? "")
                    );
                    setIsSkipDialogOpen(true);
                  }}
                  disabled={!records.some((record) => record.status !== "Skipped")}
                  className="h-9 shrink-0 whitespace-nowrap rounded-lg border border-[#e8e6de] bg-[#faf9f5] px-3.5 text-xs font-semibold text-[#566258] transition hover:bg-[#f1eee5] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Skip Assessment
                </button>
              </div>
            </div>
          }
        >
          {successMessage && (
            <p role="status" className="border-b border-[#dcebdc] bg-[#f2faf3] px-5 py-3 text-sm text-[#39724f] sm:px-6">
              {successMessage}
            </p>
          )}
          {(scheduleDropdownsError || scheduleDropdowns.error) && (
            <p role="alert" className="border-b border-rose-100 bg-rose-50 px-5 py-3 text-sm text-rose-700 sm:px-6">
              {scheduleDropdownsError
                ? assessmentMutationErrorMessage(
                    scheduleDropdownsError,
                    "Unable to load assessment schedule dropdowns.",
                  )
                : scheduleDropdowns.error}
            </p>
          )}
          {assessmentsLoading ? (
            <div className="p-5 text-sm text-[#78867e]">
              Loading assessment candidates…
            </div>
          ) : assessmentsError || mappedAssessments.error ? (
            <div role="alert" className="p-5 text-sm text-rose-700">
              {assessmentsError
                ? assessmentErrorMessage(assessmentsError)
                : mappedAssessments.error}
            </div>
          ) : records.length === 0 ? (
            <div className="p-5">
              <EmptyState message="No shortlisted candidates are ready for assessment." />
            </div>
          ) : (
            <>
              <TableFrame>
                <thead>
                  <tr>
                    <TableHeading>Candidate</TableHeading>
                    <TableHeading>Assessment</TableHeading>
                    <TableHeading>Round</TableHeading>
                    <TableHeading>Required</TableHeading>
                    <TableHeading>Status</TableHeading>
                    <TableHeading>Result</TableHeading>
                    <TableHeading>Action</TableHeading>
                  </tr>
                </thead>
                <tbody>
                  {pageRecords.map((record) => {
                    const { candidate } = record;
                    const assessmentType =
                      record.assessmentTypeName ??
                      scheduleAssessmentTypes.find(
                        (item) => item.id === record.assessmentTypeId,
                      )?.name ??
                      "—";
                    return (
                      <tr
                        key={candidate.id}
                        className="odd:bg-white even:bg-[#fffaf0] transition-colors hover:bg-[#f3e4c5]"
                      >
                        <TableCell>
                          <span className="block font-medium text-[#344138]">
                            {candidateCode(candidate)}
                          </span>
                          <span className="mt-1 block text-[11px] text-[#87938c]">
                            {candidate.name}
                          </span>
                        </TableCell>
                        <TableCell>{assessmentType}</TableCell>
                        <TableCell>
                          {record.currentAssessmentRound ??
                            (record.assessmentId ? 1 : "—")}
                        </TableCell>
                        <TableCell>
                          {record.required ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>
                          <StatusPill>
                            {record.status === "Scheduled"
                              ? "Pending"
                              : record.status}
                          </StatusPill>
                        </TableCell>
                        <TableCell>{record.result}</TableCell>
                        <TableCell>
                        {record.status === "Skipped" ? (
                          <button
                            type="button"
                            onClick={() =>
                              updateRecord(candidate.id, {
                                required: true,
                                status: "Scheduled",
                                result: "Pending",
                                remarks: "",
                              })
                            }
                            className="rounded-lg bg-[#f1f3f1] px-3 py-2 text-xs font-semibold text-[#566258] transition hover:bg-[#e5e9e5]"
                          >
                            Undo Skip
                          </button>
                        ) : record.assessmentId === null ? (
                          <button
                            type="button"
                            onClick={() => handleOpenSchedule(candidate.id)}
                            disabled={
                              isScheduling ||
                              !scheduleCandidates.some(
                                (item) => item.candidate.id === candidate.id,
                              )
                            }
                            title="Schedule this candidate's assessment before recording a result."
                            className="rounded-lg bg-[#fff3d6] px-3 py-2 text-xs font-semibold text-[#9b6811] transition hover:bg-[#f8e8bd] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Schedule first
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                openAssessmentDecision(record, true)
                              }
                              disabled={isUpdatingAssessmentResult}
                              className="rounded-lg bg-[#e8f4ec] px-3 py-2 text-xs font-semibold text-[#39724f] transition hover:bg-[#d9ecdf]"
                            >
                              Qualify
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                openAssessmentDecision(record, false)
                              }
                              disabled={isUpdatingAssessmentResult}
                              className="rounded-lg bg-[#fbeceb] px-3 py-2 text-xs font-semibold text-[#aa504c] transition hover:bg-[#f5dcda]"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        </TableCell>
                      </tr>
                    );
                  })}
                </tbody>
              </TableFrame>
              <RecruitmentPagination
                page={currentPage}
                pageSize={pageSize}
                totalCount={records.length}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
              />
            </>
          )}
          <p className="border-t border-[#efeee9] bg-[#fcfaf5] px-5 py-3 text-xs text-[#7c725e] sm:px-6">
            Skip Assessment sets Required to No and moves the candidate directly to interviewing.
          </p>
        </PanelCard>

      </div>

      {assessmentDecisionRecord && assessmentDecision !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#202a26]/55 p-4"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !isUpdatingAssessmentResult
            ) {
              setAssessmentDecisionRecord(null);
              setAssessmentDecision(null);
            }
          }}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="assessment-result-title"
            onSubmit={handleAssessmentResult}
            className="w-full max-w-md rounded-2xl border border-[#eee9dc] bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2
                  id="assessment-result-title"
                  className="text-lg font-bold text-[#26332c]"
                >
                  {assessmentDecision ? "Qualify Candidate" : "Reject Candidate"}
                </h2>
                <p className="mt-1 text-xs text-[#78867e]">
                  {candidateCode(assessmentDecisionRecord.candidate)} ·{" "}
                  {assessmentDecisionRecord.candidate.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setAssessmentDecisionRecord(null);
                  setAssessmentDecision(null);
                }}
                aria-label="Close dialog"
                disabled={isUpdatingAssessmentResult}
                className="rounded-lg p-1.5 text-[#7e8981] transition hover:bg-[#f5f4ef] disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <label className="mb-3 block space-y-1.5 text-xs font-semibold text-[#59665d]">
              <span>Score (0-100)</span>
              <input
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={assessmentScore}
                onChange={(event) => setAssessmentScore(event.target.value)}
                required
                className="h-10 w-full rounded-lg border border-[#dddcd5] bg-white px-3 text-sm font-normal text-[#303d34] outline-none focus:border-[#e5a538] focus:ring-2 focus:ring-[#e5a538]/20"
              />
            </label>
            <label className="block space-y-1.5 text-xs font-semibold text-[#59665d]">
              <span>Remarks</span>
              <textarea
                value={assessmentRemarks}
                onChange={(event) => setAssessmentRemarks(event.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Add assessment feedback (optional)."
                className="w-full resize-y rounded-lg border border-[#dddcd5] bg-white px-3 py-2.5 text-sm font-normal text-[#303d34] outline-none placeholder:text-[#a3aaa4] focus:border-[#e5a538] focus:ring-2 focus:ring-[#e5a538]/20"
              />
            </label>
            {assessmentResultError && (
              <p role="alert" className="mt-3 text-sm text-rose-700">
                {assessmentResultError}
              </p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setAssessmentDecisionRecord(null);
                  setAssessmentDecision(null);
                }}
                disabled={isUpdatingAssessmentResult}
                className="h-9 rounded-lg border border-[#e8e6de] px-4 text-xs font-semibold text-[#566258] transition hover:bg-[#f8f7f2] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdatingAssessmentResult || !assessmentScore}
                className="h-9 rounded-lg bg-[#e5a538] px-4 text-xs font-semibold text-[#342712] transition hover:bg-[#d99a2b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUpdatingAssessmentResult ? "Saving..." : "Save Result"}
              </button>
            </div>
          </form>
        </div>
      )}

      {isScheduleDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#202a26]/55 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isScheduling) {
              setIsScheduleDialogOpen(false);
            }
          }}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="schedule-assessment-title"
            onSubmit={handleSchedule}
            className="w-full max-w-md rounded-2xl border border-[#eee9dc] bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="schedule-assessment-title" className="text-lg font-bold text-[#26332c]">
                Schedule Assessment
              </h2>
              <button
                type="button"
                onClick={() => setIsScheduleDialogOpen(false)}
                aria-label="Close dialog"
                disabled={isScheduling}
                className="rounded-lg p-1.5 text-[#7e8981] transition hover:bg-[#f5f4ef] disabled:opacity-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <label className="mb-3 block space-y-1.5 text-xs font-semibold text-[#59665d]">
              <span>Candidate (Application ID)</span>
              <select
                value={scheduleCandidateId}
                onChange={(event) => setScheduleCandidateId(event.target.value)}
                required
                className="h-10 w-full rounded-lg border border-[#dddcd5] bg-white px-3 text-sm font-normal text-[#303d34] outline-none focus:border-[#e5a538] focus:ring-2 focus:ring-[#e5a538]/20"
              >
                {scheduleCandidates.map((record) => (
                  <option key={record.candidate.id} value={record.candidate.id}>
                    {candidateCode(record.candidate)} - {record.candidate.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="mb-3 block space-y-1.5 text-xs font-semibold text-[#59665d]">
              <span>Assessment Type</span>
              <select
                value={
                  assessmentTypeIdValue ||
                  String(scheduleAssessmentTypes[0]?.id ?? "")
                }
                onChange={(event) => setAssessmentTypeId(event.target.value)}
                required
                disabled={scheduleDropdownsLoading}
                className="h-10 w-full rounded-lg border border-[#dddcd5] bg-white px-3 text-sm font-normal text-[#303d34] outline-none focus:border-[#e5a538] focus:ring-2 focus:ring-[#e5a538]/20 disabled:bg-[#f5f5f2]"
              >
                {scheduleAssessmentTypes.map((assessmentType) => (
                  <option key={assessmentType.id} value={assessmentType.id}>
                    {assessmentType.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5 text-xs font-semibold text-[#59665d]">
              <span>Scheduled Date and Time</span>
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(event) => setScheduledDate(event.target.value)}
                required
                className="h-10 w-full rounded-lg border border-[#dddcd5] bg-white px-3 text-sm font-normal text-[#303d34] outline-none focus:border-[#e5a538] focus:ring-2 focus:ring-[#e5a538]/20"
              />
            </label>
            {scheduleDropdownsLoading && (
              <p role="status" className="mt-3 text-sm text-[#78867e]">
                Loading assessment options...
              </p>
            )}
            {(scheduleDropdownsError || scheduleDropdowns.error) && (
              <p role="alert" className="mt-3 text-sm text-rose-700">
                {scheduleDropdownsError
                  ? assessmentMutationErrorMessage(
                      scheduleDropdownsError,
                      "Unable to load assessment schedule dropdowns.",
                    )
                  : scheduleDropdowns.error}
              </p>
            )}
            {scheduleError && (
              <p role="alert" className="mt-3 text-sm text-rose-700">
                {scheduleError}
              </p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsScheduleDialogOpen(false)}
                disabled={isScheduling}
                className="h-9 rounded-lg border border-[#e8e6de] px-4 text-xs font-semibold text-[#566258] transition hover:bg-[#f8f7f2] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  isScheduling ||
                  scheduleDropdownsLoading ||
                  Boolean(scheduleDropdownsError || scheduleDropdowns.error) ||
                  !scheduleCandidateId ||
                  !assessmentTypeIdValue ||
                  scheduleAssessmentTypes.length === 0 ||
                  !scheduledDate
                }
                className="h-9 rounded-lg bg-[#e5a538] px-4 text-xs font-semibold text-[#342712] transition hover:bg-[#d99a2b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isScheduling ? "Scheduling..." : "Schedule"}
              </button>
            </div>
          </form>
        </div>
      )}

      {isSkipDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#202a26]/55 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSkipping) setIsSkipDialogOpen(false);
          }}
        >
          <form
            role="dialog"
            aria-modal="true"
            aria-labelledby="skip-assessment-title"
            onSubmit={handleSkip}
            className="w-full max-w-md rounded-2xl border border-[#eee9dc] bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="skip-assessment-title" className="text-lg font-bold text-[#26332c]">
                Skip Assessment
              </h2>
              <button
                type="button"
                onClick={() => setIsSkipDialogOpen(false)}
                disabled={isSkipping}
                aria-label="Close dialog"
                className="rounded-lg p-1.5 text-[#7e8981] transition hover:bg-[#f5f4ef]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <label className="mb-3 block space-y-1.5 text-xs font-semibold text-[#59665d]">
              <span>Candidate</span>
              <select
                value={selectedCandidateId}
                onChange={(event) => setSelectedCandidateId(event.target.value)}
                required
                className="h-10 w-full rounded-lg border border-[#dddcd5] bg-white px-3 text-sm font-normal text-[#303d34] outline-none focus:border-[#e5a538] focus:ring-2 focus:ring-[#e5a538]/20"
              >
                {records.filter((record) => record.status !== "Skipped").map((record) => (
                  <option key={record.candidate.id} value={record.candidate.id}>
                    {candidateCode(record.candidate)} - {record.candidate.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5 text-xs font-semibold text-[#59665d]">
              <span>Remarks</span>
              <textarea
                value={remarks}
                onChange={(event) => setRemarks(event.target.value)}
                rows={3}
                placeholder="Assessment not required for this candidate."
                maxLength={500}
                className="w-full resize-y rounded-lg border border-[#dddcd5] bg-white px-3 py-2.5 text-sm font-normal text-[#303d34] outline-none placeholder:text-[#a3aaa4] focus:border-[#e5a538] focus:ring-2 focus:ring-[#e5a538]/20"
              />
            </label>
            {skipError && (
              <p role="alert" className="mt-3 text-sm text-rose-700">
                {skipError}
              </p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSkipDialogOpen(false)}
                disabled={isSkipping}
                className="h-9 rounded-lg border border-[#e8e6de] px-4 text-xs font-semibold text-[#566258] transition hover:bg-[#f8f7f2]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSkipping || !selectedCandidateId}
                className="h-9 rounded-lg bg-[#e5a538] px-4 text-xs font-semibold text-[#342712] transition hover:bg-[#d99a2b] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSkipping ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

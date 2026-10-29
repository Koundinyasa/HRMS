import {
  recruitmentFileName,
  recruitmentFileUrl,
} from "../api/recruitment.api";

export type WorkflowRow = Record<string, string>;
export type DropdownOption = { value: string; label: string };
export const EMPTY_WORKFLOW_ROWS: WorkflowRow[] = [];
export const EMPTY_DROPDOWN_OPTIONS: DropdownOption[] = [];

function readLookupText(record: Record<string, unknown>, aliases: string[]) {
  const normalizedAliases = new Set(
    aliases.map((alias) => alias.toLowerCase().replace(/[^a-z0-9]/g, "")),
  );
  const entry = Object.entries(record).find(([key]) =>
    normalizedAliases.has(key.toLowerCase().replace(/[^a-z0-9]/g, "")),
  );
  const value = entry?.[1];
  return value === null || value === undefined || value === ""
    ? ""
    : String(value);
}

export function mapLookupRows(
  response: unknown,
  aliases: { value: string[]; label: string[] },
  description: string,
): DropdownOption[] {
  if (
    !response ||
    typeof response !== "object" ||
    !("success" in response) ||
    !response.success ||
    !("data" in response) ||
    !Array.isArray(response.data)
  ) {
    const message =
      response && typeof response === "object" && "message" in response
        ? response.message
        : undefined;
    throw new Error(
      typeof message === "string"
        ? message
        : `Recruitment API returned an invalid ${description} list.`,
    );
  }

  return response.data.map((record) => {
    if (!record || typeof record !== "object" || Array.isArray(record)) {
      throw new Error(`Recruitment API returned an invalid ${description}.`);
    }
    const row = record as Record<string, unknown>;
    const value = readLookupText(row, aliases.value);
    const label = readLookupText(row, aliases.label);
    if (!value || !label) {
      throw new Error(
        `Recruitment API returned a ${description} without its value or name.`,
      );
    }
    return { value, label };
  });
}

export function mapCandidateApplication(record: unknown): WorkflowRow {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    throw new Error("Recruitment API returned an invalid candidate record.");
  }

  const candidate = record as Record<string, unknown>;
  const value = (...aliases: string[]) => {
    const normalizeKey = (key: string) =>
      key.toLowerCase().replace(/[^a-z0-9]/g, "");
    const aliasSet = new Set(aliases.map(normalizeKey));
    const entry = Object.entries(candidate).find(([key]) =>
      aliasSet.has(normalizeKey(key)),
    );
    const field = entry?.[1];
    return field === null || field === undefined || field === ""
      ? "—"
      : String(field);
  };
  const rawSource = value("Source", "ApplicationSource", "SourceName");
  const referralMatch = rawSource.match(/^Employee Referral\s*-\s*(.+)$/i);

  const resumeUrl = value(
    "ResumeURL",
    "ResumeUrl",
    "ResumePath",
    "ResumeFilePath",
    "ResumeFileURL",
  );
  const resumeExtension = value(
    "FileExtension",
    "ResumeFileExtension",
    "ResumeExtension",
    "ActualFileName",
  );
  const resumeFileName = value(
    "ActualFileName",
    "ResumeFileName",
    "OriginalFileName",
  );

  return {
    application: value(
      "ApplicationID",
      "CandidateApplicationID",
      "ApplicationId",
      "ApplicationNumber",
      "ApplicationNo",
    ),
    candidateId: value(
      "CandidateID",
      "CandidateId",
      "ApplicantID",
      "ApplicantId",
      "CandidateCode",
    ),
    candidate: value(
      "FullName",
      "CandidateName",
      "CandidateFullName",
      "ApplicantName",
      "Name",
    ),
    position: value(
      "JobTitle",
      "Position",
      "OpeningTitle",
      "JobOpeningTitle",
      "JobOpeningName",
      "Designation",
    ),
    opening: value("JobOpeningID", "OpeningID", "JobId", "JobOpeningNumber"),
    appliedDate: value(
      "AppliedDate",
      "ApplicationDate",
      "DateApplied",
      "ApplicationCreatedDate",
      "CreatedDate",
      "CreatedOn",
      "CreatedAt",
    ),
    source: referralMatch
      ? "Employee Referral"
      : rawSource,
    referringEmployee:
      value(
        "ReferringEmployee",
        "ReferralName",
        "ReferredBy",
        "ReferrerName",
        "ReferredByName",
      ) !== "—"
        ? value(
            "ReferringEmployee",
            "ReferralName",
            "ReferredBy",
            "ReferrerName",
            "ReferredByName",
          )
        : referralMatch?.[1].trim() ?? "—",
    status: value(
      "ApplicationStatus",
      "CandidateStatus",
      "CurrentStage",
      "Status",
      "StatusName",
      "Stage",
    ),
    resume:
      resumeUrl === "—"
        ? "—"
        : recruitmentFileUrl(
            resumeUrl,
            resumeExtension === "—" ? undefined : resumeExtension,
          ),
    resumeFileName:
      resumeUrl === "—"
        ? ""
        : recruitmentFileName(
            resumeUrl,
            resumeFileName === "—" ? undefined : resumeFileName,
          ),
  };
}

export function mapJobRequisition(record: unknown): WorkflowRow {
  if (!record || typeof record !== "object" || Array.isArray(record)) {
    throw new Error("Recruitment API returned an invalid requisition record.");
  }

  const requisition = record as Record<string, unknown>;
  const readText = (aliases: string[], fallback = "—") => {
    const value = readLookupText(requisition, aliases);
    return value || fallback;
  };
  const salaryMin = readText(["SalaryRangeMin", "SalaryMin"], "");
  const salaryMax = readText(["SalaryRangeMax", "SalaryMax"], "");
  const salaryRange = readText(["SalaryRange", "SalaryBand"], "");

  return {
    requisitionId: readText(["RequisitionID", "ID"], ""),
    requisition: readText([
      "RequisitionNo",
      "RequisitionNumber",
      "RequisitionID",
      "ID",
    ]),
    position: readText([
      "JobTitle",
      "DesignationName",
      "Position",
      "Title",
    ]),
    department: readText(["DepartmentName", "Department"]),
    grade: readText(["GradeName", "Grade"]),
    vacancies: readText(["Vacancies", "Positions"]),
    location: readText(["BranchName", "Location", "Branch"]),
    salaryRange:
      salaryRange ||
      (salaryMin || salaryMax
        ? `${salaryMin || "—"}–${salaryMax || "—"}`
        : "—"),
    status: readText(
      [
        "RequisitionStatus",
        "RequisitionApprovalStatus",
        "ApprovalStatus",
        "ApprovalStatusName",
        "DecisionStatus",
        "WorkflowStatus",
        "StatusName",
        "Status",
      ],
      "Pending Approval",
    ),
  };
}

export function mapJobRequisitionDetails(record: unknown): WorkflowRow[] {
  if (
    !record ||
    typeof record !== "object" ||
    !("success" in record) ||
    record.success !== true ||
    !("data" in record) ||
    !record.data ||
    typeof record.data !== "object" ||
    Array.isArray(record.data)
  ) {
    const message =
      record && typeof record === "object" && "message" in record
        ? record.message
        : undefined;
    throw new Error(
      typeof message === "string"
        ? message
        : "Recruitment API returned invalid requisition details.",
    );
  }

  const details = record.data as Record<string, unknown>;
  const fields: [string, string[]][] = [
    ["Requisition ID", ["RequisitionID"]],
    ["Requisition Number", ["RequisitionNo"]],
    ["Job Title", ["JobTitle"]],
    ["Department", ["DepartmentName"]],
    ["Designation", ["DesignationName"]],
    ["Vacancies", ["Vacancies"]],
    ["Salary Range Min", ["SalaryRangeMin"]],
    ["Salary Range Max", ["SalaryRangeMax"]],
    ["Experience Required", ["ExperienceRequired"]],
    ["Priority", ["PriorityName"]],
    ["Hiring Manager", ["HiringManagerName"]],
    ["Status", ["StatusName"]],
    ["Created Date", ["CreatedDate"]],
  ];

  return fields.map(([label, aliases]) => ({
    label,
    value: readLookupText(details, aliases) || "—",
  }));
}

export interface WorkflowScreenConfig {
  title: string;
  description: string;
  createAction: string;
  columns: { key: string; label: string }[];
  rows: WorkflowRow[];
  statusKey: string;
}

export const WORKFLOW_SCREENS: Record<string, WorkflowScreenConfig> = {
  "job-requisition": {
    title: "Job Requisition",
    description: "Create a manpower request for a position.",
    createAction: "New Requisition",
    statusKey: "status",
    columns: [
      { key: "requisition", label: "Requisition" },
      { key: "position", label: "Position" },
      { key: "department", label: "Department" },
      { key: "vacancies", label: "Vacancies" },
      { key: "salaryRange", label: "Salary Range" },
      { key: "status", label: "Status" },
    ],
    rows: [],
  },
  "candidate-applications": {
    title: "Candidate Applications",
    description: "Review candidate applications submitted for job openings.",
    createAction: "Create Application",
    statusKey: "status",
    columns: [
      { key: "application", label: "Application" },
      { key: "candidateId", label: "Candidate ID" },
      { key: "candidate", label: "Candidate" },
      { key: "position", label: "Position" },
      { key: "opening", label: "Opening" },
      { key: "appliedDate", label: "Applied Date" },
      { key: "source", label: "Source" },
      { key: "referringEmployee", label: "Referring Employee" },
      { key: "resume", label: "Resume" },
      { key: "status", label: "Status" },
    ],
    rows: EMPTY_WORKFLOW_ROWS,
  },
  "final-interview-approval": {
    title: "Final Interview Approval",
    description: "Review completed interview feedback and make the final decision.",
    createAction: "Update Approval",
    statusKey: "decision",
    columns: [
      { key: "application", label: "Application" },
      { key: "candidateId", label: "Candidate ID" },
      { key: "candidate", label: "Candidate" },
      { key: "interview", label: "Interview" },
      { key: "rating", label: "Rating" },
      { key: "decision", label: "Decision" },
    ],
    rows: [
      {
        application: "APP-2026-222",
        candidateId: "CAND-2026-079",
        candidate: "Priya Sharma",
        interview: "INT-2026-062",
        rating: "4.5 / 5",
        decision: "Selected",
      },
      {
        application: "APP-2026-221",
        candidateId: "CAND-2026-078",
        candidate: "Arjun Kumar",
        interview: "INT-2026-061",
        rating: "4 / 5",
        decision: "Pending Approval",
      },
    ],
  },
  "offer-management": {
    title: "Offer Management",
    description: "Create, extend, and track candidate offers.",
    createAction: "Create Offer",
    statusKey: "status",
    columns: [
      { key: "offer", label: "Offer" },
      { key: "application", label: "Application" },
      { key: "candidate", label: "Candidate" },
      { key: "position", label: "Position" },
      { key: "ctc", label: "CTC" },
      { key: "joiningDate", label: "Joining Date" },
      { key: "status", label: "Status" },
    ],
    rows: [],
  },
  "verification-bgv": {
    title: "Verification / BGV",
    description: "Review candidate documents and manage background verification.",
    createAction: "Start BGV",
    statusKey: "status",
    columns: [
      { key: "application", label: "Application" },
      { key: "candidateId", label: "Candidate ID" },
      { key: "candidate", label: "Candidate" },
      { key: "offer", label: "Offer" },
      { key: "documents", label: "Documents" },
      { key: "bgvResult", label: "BGV Result" },
      { key: "status", label: "Status" },
    ],
    rows: [],
  },
  joining: {
    title: "Joining",
    description: "Prepare joining for candidates with accepted offer and cleared BGV.",
    createAction: "Prepare Joining",
    statusKey: "eligibility",
    columns: [
      { key: "application", label: "Application" },
      { key: "candidateId", label: "Candidate ID" },
      { key: "candidate", label: "Candidate" },
      { key: "joiningDate", label: "Joining Date" },
      { key: "employeeCode", label: "Employee Code" },
      { key: "eligibility", label: "Eligibility" },
    ],
    rows: [
      {
        application: "APP-2026-221",
        candidateId: "CAND-2026-078",
        candidate: "Arjun Kumar",
        joiningDate: "15 Oct 2026",
        employeeCode: "EMP-2026-115",
        eligibility: "Eligible",
      },
    ],
  },
  onboarding: {
    title: "Onboarding",
    description: "Track pre-joining tasks, required documents, and welcome communication.",
    createAction: "Start Onboarding",
    statusKey: "status",
    columns: [
      { key: "candidate", label: "Candidate" },
      { key: "position", label: "Position" },
      { key: "offerStatus", label: "Offer Status" },
      { key: "welcomeEmail", label: "Welcome Email" },
      { key: "status", label: "Onboarding Status" },
    ],
    rows: [
      {
        candidate: "Sample Candidate A",
        position: "Software Engineer",
        offerStatus: "Accepted",
        email: "",
        welcomeEmail: "Sent",
        status: "In Progress",
      },
    ],
  },
  induction: {
    title: "Induction",
    description: "Schedule induction sessions and track attendance and completion.",
    createAction: "Schedule Induction",
    statusKey: "status",
    columns: [
      { key: "candidate", label: "Candidate" },
      { key: "position", label: "Position" },
      { key: "inductionDate", label: "Induction Date" },
      { key: "program", label: "Program" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        candidate: "Sample Candidate A",
        position: "Software Engineer",
        inductionDate: "14 Oct 2026",
        program: "New Hire Orientation",
        status: "Scheduled",
      },
    ],
  },
  "team-assignment": {
    title: "Team Assignment",
    description: "Assign the joining employee to a team, department, and reporting manager.",
    createAction: "Assign Team",
    statusKey: "status",
    columns: [
      { key: "employee", label: "Employee" },
      { key: "employeeCode", label: "Employee Code" },
      { key: "department", label: "Department" },
      { key: "team", label: "Team" },
      { key: "manager", label: "Reporting Manager" },
      { key: "notification", label: "Notification" },
      { key: "status", label: "Assignment Status" },
    ],
    rows: [
      {
        employee: "Sample Candidate A",
        employeeCode: "EMP-SAMPLE-001",
        department: "Engineering",
        team: "Platform",
        manager: "Manager not assigned",
        notification: "Not Sent",
        status: "Pending",
      },
    ],
  },
  "asset-assignment": {
    title: "Asset Assignment",
    description: "Track requested equipment, asset handover, and assignment status.",
    createAction: "Assign Assets",
    statusKey: "status",
    columns: [
      { key: "employee", label: "Employee" },
      { key: "employeeCode", label: "Employee Code" },
      { key: "requestedAssets", label: "Requested Assets" },
      { key: "assignedAssets", label: "Assigned Assets" },
      { key: "handoverDate", label: "Handover Date" },
      { key: "status", label: "Asset Status" },
    ],
    rows: [
      {
        employee: "Sample Candidate A",
        employeeCode: "EMP-SAMPLE-001",
        requestedAssets: "Laptop, access card",
        assignedAssets: "Laptop",
        handoverDate: "—",
        status: "Partially Assigned",
      },
    ],
  },
};

export function statusClasses(status: string) {
  const normalizedStatus = status.toLowerCase();
  if (
    normalizedStatus.includes("approved") ||
    normalizedStatus.includes("selected") ||
    normalizedStatus.includes("accepted") ||
    normalizedStatus.includes("complete") ||
    normalizedStatus.includes("eligible")
  ) {
    return "bg-[#e8f4ec] text-[#39724f]";
  }
  if (
    normalizedStatus.includes("pending") ||
    normalizedStatus.includes("scheduled") ||
    normalizedStatus.includes("progress") ||
    normalizedStatus.includes("extended")
  ) {
    return "bg-[#fff3d6] text-[#9b6811]";
  }
  return "bg-[#f1f3f1] text-[#68756d]";
}

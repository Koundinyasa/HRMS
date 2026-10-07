import { useEffect, useMemo, useState } from "react";
import { Mail, Plus, RotateCcw, Search, X } from "lucide-react";
import axios from "axios";
import { recruitmentApi } from "../api/recruitment.api";
import type { JobOpening } from "../types/recruitment.types";

type WorkflowRow = Record<string, string>;
const EMPTY_WORKFLOW_ROWS: WorkflowRow[] = [];

type WorkflowFormField = {
  key: string;
  label: string;
  type?: "text" | "date" | "email" | "number";
  options?: string[];
  placeholder?: string;
};

interface WorkflowScreenConfig {
  title: string;
  description: string;
  createAction: string;
  columns: { key: string; label: string }[];
  rows: WorkflowRow[];
  statusKey: string;
}

const WORKFLOW_SCREENS: Record<string, WorkflowScreenConfig> = {
  "job-requisition": {
    title: "Job Requisition",
    description: "Create a manpower request for a position.",
    createAction: "New Requisition",
    statusKey: "status",
    columns: [
      { key: "requisition", label: "Requisition" },
      { key: "position", label: "Position" },
      { key: "department", label: "Department" },
      { key: "grade", label: "Grade" },
      { key: "vacancies", label: "Vacancies" },
      { key: "location", label: "Location" },
      { key: "salaryRange", label: "Salary Range" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        requisition: "REQ-2026-001",
        position: "Software Engineer",
        department: "IT",
        grade: "G5",
        vacancies: "3",
        location: "Hyderabad",
        salaryRange: "₹6–9 L",
        status: "Pending Approval",
      },
      {
        requisition: "REQ-2026-002",
        position: "HR Executive",
        department: "Human Resources",
        grade: "G4",
        vacancies: "1",
        location: "Hyderabad",
        salaryRange: "₹4–6 L",
        status: "Approved",
      },
    ],
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
    description: "Create and release offer for a selected candidate.",
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
    rows: [
      {
        offer: "OFF-2026-022",
        application: "APP-2026-221",
        candidate: "Arjun Kumar",
        position: "Software Engineer",
        ctc: "₹8.2 L",
        joiningDate: "15 Oct 2026",
        status: "Accepted",
      },
      {
        offer: "OFF-2026-023",
        application: "APP-2026-222",
        candidate: "Priya Sharma",
        position: "Software Engineer",
        ctc: "₹8.6 L",
        joiningDate: "20 Oct 2026",
        status: "Offer Extended",
      },
    ],
  },
  "verification-bgv": {
    title: "Verification / BGV",
    description: "Verify documents and complete background verification for accepted offers.",
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
    rows: [
      {
        application: "APP-2026-221",
        candidateId: "CAND-2026-078",
        candidate: "Arjun Kumar",
        offer: "OFF-2026-022",
        documents: "5 / 5",
        bgvResult: "Clear",
        status: "Complete",
      },
      {
        application: "APP-2026-222",
        candidateId: "CAND-2026-079",
        candidate: "Priya Sharma",
        offer: "OFF-2026-023",
        documents: "4 / 5",
        bgvResult: "Pending",
        status: "In Progress",
      },
    ],
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

function statusClasses(status: string) {
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

export function RecruitmentOperationalScreen({
  view,
  onCreateAction,
  openings = [],
}: {
  view: string;
  onCreateAction?: () => void;
  openings?: JobOpening[];
}) {
  const config = WORKFLOW_SCREENS[view];
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedRow, setSelectedRow] = useState<WorkflowRow | null>(null);
  const [actionMessage, setActionMessage] = useState("");
  const [showBgvForm, setShowBgvForm] = useState(false);
  const [bgvApplicationId, setBgvApplicationId] = useState("");
  const [bgvResult, setBgvResult] = useState("");
  const [bgvRemarks, setBgvRemarks] = useState("");
  const [isSubmittingBgv, setIsSubmittingBgv] = useState(false);
  const [bgvError, setBgvError] = useState("");
  const [showPostJoiningForm, setShowPostJoiningForm] = useState(false);
  const [postJoiningFormValues, setPostJoiningFormValues] = useState<
    Record<string, string>
  >({});
  const [postJoiningRows, setPostJoiningRows] = useState<
    Record<string, WorkflowRow[]>
  >({});
  const [welcomeEmailDrafts, setWelcomeEmailDrafts] = useState<
    Record<string, string>
  >({});
  const [sendingWelcomeEmail, setSendingWelcomeEmail] = useState<string | null>(
    null,
  );
  const [welcomeEmailError, setWelcomeEmailError] = useState("");
  const [showJoiningForm, setShowJoiningForm] = useState(false);
  const [joiningFormValues, setJoiningFormValues] = useState<
    Record<string, string>
  >({});
  const [joiningFormError, setJoiningFormError] = useState("");
  const [isSubmittingJoining, setIsSubmittingJoining] = useState(false);
  const [joiningEmailDrafts, setJoiningEmailDrafts] = useState<
    Record<string, string>
  >({});
  const [sendingJoiningEmail, setSendingJoiningEmail] = useState<string | null>(
    null,
  );
  const [showTeamAssignmentForm, setShowTeamAssignmentForm] = useState(false);
  const [teamAssignmentValues, setTeamAssignmentValues] = useState<
    Record<string, string>
  >({});
  const [teamAssignmentEmailDrafts, setTeamAssignmentEmailDrafts] = useState<
    Record<string, string>
  >({});
  const [sendingTeamAssignmentEmail, setSendingTeamAssignmentEmail] = useState<
    string | null
  >(null);
  const [teamAssignmentError, setTeamAssignmentError] = useState("");
  const [candidateApplicationRows, setCandidateApplicationRows] =
    useState<WorkflowRow[]>([]);
  const [candidateApplicationsLoading, setCandidateApplicationsLoading] =
    useState(false);
  const [candidateApplicationsError, setCandidateApplicationsError] =
    useState("");

  const rows =
    view === "candidate-applications"
      ? candidateApplicationRows
      : postJoiningRows[view] ?? config?.rows ?? EMPTY_WORKFLOW_ROWS;
  const statusKey = config?.statusKey ?? "";

  useEffect(() => {
    if (view !== "candidate-applications") return;

    let isCurrent = true;

    const loadApplications = async () => {
      try {
        const results = await Promise.all(
          openings.map(async (opening) => {
            const response = await recruitmentApi.getCandidatesForScreening(
              opening.id,
            );
            if (!Array.isArray(response)) {
              throw new Error(
                "Recruitment API returned an invalid candidate list.",
              );
            }

            return response.map((record) => {
              if (
                !record ||
                typeof record !== "object" ||
                Array.isArray(record)
              ) {
                throw new Error(
                  "Recruitment API returned an invalid candidate record.",
                );
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
              const referralMatch = rawSource.match(
                /^Employee Referral\s*-\s*(.+)$/i,
              );

              return {
                application:
                  value(
                    "ApplicationID",
                    "CandidateApplicationID",
                    "ApplicationId",
                    "ApplicationNumber",
                    "ApplicationNo",
                  ) === "—"
                    ? "—"
                    : value(
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
                  "Designation",
                ),
                opening: value(
                  "JobOpeningID",
                  "OpeningID",
                  "JobId",
                  "JobOpeningNumber",
                ) === "—"
                  ? String(opening.id)
                  : value(
                      "JobOpeningID",
                      "OpeningID",
                      "JobId",
                      "JobOpeningNumber",
                    ),
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
                  : value("Source", "ApplicationSource", "SourceName"),
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
                  "Stage",
                ),
                resume: value(
                  "ResumeURL",
                  "ResumeUrl",
                  "ResumePath",
                  "ResumeFilePath",
                  "ResumeFileURL",
                ),
              };
            });
          }),
        );
        if (isCurrent) setCandidateApplicationRows(results.flat());
      } catch (error) {
        if (!isCurrent) return;
        const message = axios.isAxiosError(error)
          ? String(error.response?.data?.message ?? error.message)
          : error instanceof Error
            ? error.message
            : "Unable to load candidate applications.";
        setCandidateApplicationsError(message);
      } finally {
        if (isCurrent) setCandidateApplicationsLoading(false);
      }
    };

    void Promise.resolve().then(() => {
      if (!isCurrent) return;
      setCandidateApplicationsLoading(true);
      setCandidateApplicationsError("");
      return loadApplications();
    });
    return () => {
      isCurrent = false;
    };
  }, [view, openings]);

  const statuses = useMemo(
    () => Array.from(new Set(rows.map((row) => row[statusKey]))),
    [rows, statusKey]
  );
  const filteredRows = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch =
        !normalizedSearch ||
        Object.values(row).some((value) =>
          value.toLowerCase().includes(normalizedSearch)
        );
      const matchesStatus =
        selectedStatus === "All Statuses" ||
        row[statusKey] === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [rows, search, selectedStatus, statusKey]);
  const submitBgv = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBgvError("");
    const applicationId = Number(bgvApplicationId);
    if (!Number.isInteger(applicationId) || applicationId <= 0) {
      setBgvError("Enter a valid candidate application ID.");
      return;
    }
    if (!bgvResult) {
      setBgvError("Select a BGV result.");
      return;
    }

    setIsSubmittingBgv(true);
    try {
      await recruitmentApi.performCandidateBgv({
        applicationId,
        isClear: bgvResult === "clear",
        remarks: bgvRemarks.trim() || undefined,
      });
      setShowBgvForm(false);
      setBgvApplicationId("");
      setBgvResult("");
      setBgvRemarks("");
      setActionMessage("BGV result submitted successfully.");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? String(error.response?.data?.message ?? error.message)
        : error instanceof Error
          ? error.message
          : "Unable to submit the BGV result.";
      setBgvError(message);
    } finally {
      setIsSubmittingBgv(false);
    }
  };
  const postJoiningFormFields: WorkflowFormField[] =
    view === "onboarding"
      ? [
          { key: "candidate", label: "Candidate name", placeholder: "Enter candidate name" },
          {
            key: "email",
            label: "Candidate email",
            type: "email",
            placeholder: "Enter candidate email",
          },
          { key: "position", label: "Position", placeholder: "Enter position" },
          {
            key: "offerStatus",
            label: "Offer status",
            options: ["Accepted", "Pending"],
          },
          {
            key: "welcomeEmail",
            label: "Welcome email",
            options: ["Sent", "Pending"],
          },
          {
            key: "status",
            label: "Onboarding status",
            options: ["In Progress", "Complete", "Pending"],
          },
        ]
      : [
          { key: "candidate", label: "Candidate name", placeholder: "Enter candidate name" },
          { key: "position", label: "Position", placeholder: "Enter position" },
          { key: "inductionDate", label: "Induction date", type: "date" },
          { key: "program", label: "Program", placeholder: "Enter induction program" },
          {
            key: "status",
            label: "Status",
            options: ["Scheduled", "In Progress", "Complete"],
          },
        ];
  const submitPostJoiningForm = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (view !== "onboarding" && view !== "induction") return;

    const row: WorkflowRow = {};
    postJoiningFormFields.forEach(({ key }) => {
      row[key] = postJoiningFormValues[key]?.trim() ?? "";
    });
    setPostJoiningRows((previous) => ({
      ...previous,
      [view]: [...(previous[view] ?? config.rows), row],
    }));
    setPostJoiningFormValues({});
    setShowPostJoiningForm(false);
    setActionMessage(
      `${config.createAction} added to this session. This preview is not connected to a backend.`,
    );
  };
  const submitJoiningForm = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setJoiningFormError("");
    const applicationId = Number(joiningFormValues.application);
    const joiningDate = joiningFormValues.joiningDate;
    if (!Number.isInteger(applicationId) || applicationId <= 0) {
      setJoiningFormError("Enter a valid candidate application ID.");
      return;
    }
    if (!joiningDate) {
      setJoiningFormError("Select a joining date.");
      return;
    }

    setIsSubmittingJoining(true);
    try {
      await recruitmentApi.approveCandidateJoining({
        applicationId,
        joiningDate,
      });
      const row: WorkflowRow = {
        application: String(applicationId),
        candidateId: joiningFormValues.candidateId.trim(),
        candidate: joiningFormValues.candidate.trim(),
        position: joiningFormValues.position.trim(),
        joiningDate,
        employeeCode: joiningFormValues.employeeCode.trim(),
        eligibility: joiningFormValues.eligibility,
        email: joiningFormValues.email.trim(),
      };
      setPostJoiningRows((previous) => ({
        ...previous,
        joining: [...(previous.joining ?? config.rows), row],
      }));
      setJoiningFormValues({});
      setShowJoiningForm(false);
      setActionMessage("Joining preparation submitted successfully.");
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? String(error.response?.data?.message ?? error.message)
        : error instanceof Error
          ? error.message
          : "Unable to prepare candidate joining.";
      setJoiningFormError(message);
    } finally {
      setIsSubmittingJoining(false);
    }
  };
  const sendJoiningEmail = async (row: WorkflowRow, rowKey: string) => {
    const email = (joiningEmailDrafts[rowKey] ?? row.email ?? "").trim();
    setWelcomeEmailError("");
    setActionMessage("");
    if (!email) {
      setWelcomeEmailError("Enter the candidate's email address first.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setWelcomeEmailError("Enter a valid candidate email address.");
      return;
    }
    setSendingJoiningEmail(rowKey);
    try {
      await recruitmentApi.sendJoiningEmail({
        email,
        candidateName: row.candidate,
        position: row.position ?? "your role",
        joiningDate: row.joiningDate,
      });
      setActionMessage(`Joining email sent to ${email}.`);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? String(error.response?.data?.message ?? error.message)
        : error instanceof Error
          ? error.message
          : "Unable to send the joining email.";
      setWelcomeEmailError(message);
    } finally {
      setSendingJoiningEmail(null);
    }
  };
  const submitTeamAssignment = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTeamAssignmentError("");
    const row: WorkflowRow = {
      employee: teamAssignmentValues.employee.trim(),
      employeeCode: teamAssignmentValues.employeeCode.trim(),
      department: teamAssignmentValues.department.trim(),
      team: teamAssignmentValues.team.trim(),
      manager: teamAssignmentValues.manager.trim(),
      notification: "Pending",
      status: "Assigned",
      email: teamAssignmentValues.email.trim(),
    };
    setPostJoiningRows((previous) => ({
      ...previous,
      "team-assignment": [
        ...(previous["team-assignment"] ?? config.rows),
        row,
      ],
    }));
    setTeamAssignmentValues({});
    setShowTeamAssignmentForm(false);
    setActionMessage(
      "Team assignment added to this session. This preview is not connected to a backend.",
    );
  };
  const sendTeamAssignmentEmail = async (row: WorkflowRow, rowKey: string) => {
    const email = (teamAssignmentEmailDrafts[rowKey] ?? row.email ?? "").trim();
    setTeamAssignmentError("");
    setActionMessage("");
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setTeamAssignmentError("Enter a valid employee email address.");
      return;
    }
    if (!row.employee || !row.department || !row.team || !row.manager) {
      setTeamAssignmentError(
        "Employee, department, team, and manager details are required to send this email.",
      );
      return;
    }

    setSendingTeamAssignmentEmail(rowKey);
    try {
      await recruitmentApi.sendTeamAssignmentEmail({
        email,
        employeeName: row.employee,
        department: row.department,
        team: row.team,
        manager: row.manager,
      });
      setActionMessage(`Team assignment email sent to ${email}.`);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? String(error.response?.data?.message ?? error.message)
        : error instanceof Error
          ? error.message
          : "Unable to send the team assignment email.";
      setTeamAssignmentError(message);
    } finally {
      setSendingTeamAssignmentEmail(null);
    }
  };
  const sendWelcomeEmail = async (row: WorkflowRow, rowKey: string) => {
    const email = (welcomeEmailDrafts[rowKey] ?? row.email ?? "").trim();
    setWelcomeEmailError("");
    setActionMessage("");
    if (!email) {
      setWelcomeEmailError("Enter the candidate's email address first.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setWelcomeEmailError("Enter a valid candidate email address.");
      return;
    }
    if (!row.candidate || !row.position) {
      setWelcomeEmailError(
        "Candidate name and position are required to send the welcome email.",
      );
      return;
    }

    setSendingWelcomeEmail(rowKey);
    try {
      await recruitmentApi.sendWelcomeEmail({
        email,
        candidateName: row.candidate,
        position: row.position,
      });
      setPostJoiningRows((previous) => {
        const onboardingRows = previous.onboarding ?? config.rows;
        const rowIndex = onboardingRows.findIndex(
          (candidateRow, index) =>
            `${candidateRow.candidate}-${candidateRow.position}-${index}` ===
            rowKey,
        );
        if (rowIndex < 0) return previous;
        const updatedRows = [...onboardingRows];
        updatedRows[rowIndex] = {
          ...updatedRows[rowIndex],
          email,
          welcomeEmail: "Sent",
        };
        return { ...previous, onboarding: updatedRows };
      });
      setActionMessage(`Welcome email sent to ${email}.`);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? String(error.response?.data?.message ?? error.message)
        : error instanceof Error
          ? error.message
          : "Unable to send the welcome email.";
      setWelcomeEmailError(message);
    } finally {
      setSendingWelcomeEmail(null);
    }
  };
  const isPostJoiningPreview = [
    "onboarding",
    "induction",
    "team-assignment",
    "asset-assignment",
  ].includes(view);
  const joiningFormFields: WorkflowFormField[] = [
    {
      key: "application",
      label: "Candidate application ID",
      type: "number",
      placeholder: "Enter application ID",
    },
    {
      key: "candidateId",
      label: "Candidate ID",
      placeholder: "Enter candidate ID",
    },
    { key: "candidate", label: "Candidate name", placeholder: "Enter candidate name" },
    { key: "position", label: "Position", placeholder: "Enter position" },
    { key: "joiningDate", label: "Joining date", type: "date" },
    { key: "employeeCode", label: "Employee code", placeholder: "Enter employee code" },
    {
      key: "eligibility",
      label: "Eligibility",
      options: ["Eligible", "Not Eligible"],
    },
    {
      key: "email",
      label: "Candidate email",
      type: "email",
      placeholder: "Enter candidate email",
    },
  ];
  const teamAssignmentFields: WorkflowFormField[] = [
    { key: "employee", label: "Employee name", placeholder: "Enter employee name" },
    { key: "employeeCode", label: "Employee code", placeholder: "Enter employee code" },
    { key: "department", label: "Department", placeholder: "Enter department" },
    { key: "team", label: "Team", placeholder: "Enter team" },
    { key: "manager", label: "Reporting manager", placeholder: "Enter manager name" },
    {
      key: "email",
      label: "Employee email",
      type: "email",
      placeholder: "Enter employee email",
    },
  ];

  if (!config) return null;

  return (
    <>
      <section className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.13em] text-[#8b8068]">
              Recruitment workflow
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-[#26332c] sm:text-[30px]">
              {config.title}
            </h2>
            <p className="mt-1.5 text-sm text-[#7b8981]">{config.description}</p>
          </div>
          {view !== "candidate-applications" &&
            view !== "final-interview-approval" &&
            (
            <button
              type="button"
              onClick={() => {
                if (view === "verification-bgv") {
                  setShowBgvForm((isOpen) => !isOpen);
                  setBgvError("");
                  setActionMessage("");
                  return;
                }
                if (view === "onboarding" || view === "induction") {
                  setShowPostJoiningForm((isOpen) => !isOpen);
                  setPostJoiningFormValues({});
                  setActionMessage("");
                  return;
                }
                if (view === "joining") {
                  setShowJoiningForm((isOpen) => !isOpen);
                  setJoiningFormValues({});
                  setJoiningFormError("");
                  setActionMessage("");
                  return;
                }
                if (view === "team-assignment") {
                  setShowTeamAssignmentForm((isOpen) => !isOpen);
                  setTeamAssignmentValues({});
                  setTeamAssignmentError("");
                  setActionMessage("");
                  return;
                }
                if (onCreateAction) {
                  onCreateAction();
                  return;
                }
                setActionMessage(
                  `${config.createAction} is a sample action and is not connected to a live service yet.`
                );
              }}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#e5a538] px-4 text-sm font-semibold text-[#342712] shadow-sm transition hover:bg-[#d99a2b] focus:outline-none focus:ring-2 focus:ring-[#e5a538]/35"
            >
              {view === "verification-bgv" && showBgvForm ? (
                <X className="h-4 w-4" />
              ) : (view === "onboarding" || view === "induction") &&
                showPostJoiningForm ? (
                <X className="h-4 w-4" />
              ) : view === "joining" && showJoiningForm ? (
                <X className="h-4 w-4" />
              ) : view === "team-assignment" && showTeamAssignmentForm ? (
                <X className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              {view === "verification-bgv" && showBgvForm
                ? "Cancel BGV"
                : (view === "onboarding" || view === "induction") &&
                    showPostJoiningForm
                  ? "Cancel"
                : view === "joining" && showJoiningForm
                  ? "Cancel"
                : view === "team-assignment" && showTeamAssignmentForm
                  ? "Cancel"
                : config.createAction}
            </button>
            )}
        </div>
        {isPostJoiningPreview && (
          <p
            role="note"
            className="rounded-lg border border-[#eee4c9] bg-[#fffaf0] px-4 py-2.5 text-sm text-[#78643c]"
          >
            Preview screen: sample rows only. These post-joining workflows are
            not connected to a live backend yet.
          </p>
        )}
        {actionMessage && (
          <p
            role="status"
            className="rounded-lg border border-[#eee4c9] bg-[#fffaf0] px-4 py-2.5 text-sm text-[#78643c]"
          >
            {actionMessage}
          </p>
        )}
        {(view === "onboarding" || view === "joining") &&
          welcomeEmailError && (
          <p
            role="alert"
            className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {welcomeEmailError}
          </p>
        )}
        {view === "team-assignment" && teamAssignmentError && (
          <p
            role="alert"
            className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
          >
            {teamAssignmentError}
          </p>
        )}
        {view === "team-assignment" && showTeamAssignmentForm && (
          <form
            onSubmit={submitTeamAssignment}
            className="space-y-4 rounded-2xl border border-[#e6e8e3] bg-white p-5 shadow-[0_8px_24px_rgba(39,48,41,0.04)]"
          >
            <h3 className="text-base font-semibold text-[#354239]">
              Assign Employee to Team
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {teamAssignmentFields.map((field) => (
                <label
                  key={field.key}
                  className="space-y-1.5 text-sm font-medium text-[#46534a]"
                >
                  {field.label}
                  <input
                    type={field.type ?? "text"}
                    required
                    value={teamAssignmentValues[field.key] ?? ""}
                    onChange={(event) =>
                      setTeamAssignmentValues((previous) => ({
                        ...previous,
                        [field.key]: event.target.value,
                      }))
                    }
                    placeholder={field.placeholder}
                    className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                  />
                </label>
              ))}
            </div>
            <button
              type="submit"
              className="inline-flex h-10 items-center rounded-lg bg-[#38634a] px-4 text-sm font-semibold text-white transition hover:bg-[#2e533d]"
            >
              Assign Team
            </button>
          </form>
        )}
        {view === "joining" && showJoiningForm && (
          <form
            onSubmit={(event) => void submitJoiningForm(event)}
            className="space-y-4 rounded-2xl border border-[#e6e8e3] bg-white p-5 shadow-[0_8px_24px_rgba(39,48,41,0.04)]"
          >
            <h3 className="text-base font-semibold text-[#354239]">
              Prepare Candidate Joining
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {joiningFormFields.map((field) => (
                <label
                  key={field.key}
                  className="space-y-1.5 text-sm font-medium text-[#46534a]"
                >
                  {field.label}
                  {field.options ? (
                    <select
                      required
                      value={joiningFormValues[field.key] ?? ""}
                      onChange={(event) =>
                        setJoiningFormValues((previous) => ({
                          ...previous,
                          [field.key]: event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                    >
                      <option value="">Select {field.label.toLowerCase()}</option>
                      {field.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type ?? "text"}
                      min={field.type === "number" ? 1 : undefined}
                      step={field.type === "number" ? 1 : undefined}
                      required
                      value={joiningFormValues[field.key] ?? ""}
                      onChange={(event) =>
                        setJoiningFormValues((previous) => ({
                          ...previous,
                          [field.key]: event.target.value,
                        }))
                      }
                      placeholder={field.placeholder}
                      className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                    />
                  )}
                </label>
              ))}
            </div>
            {joiningFormError && (
              <p
                role="alert"
                className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              >
                {joiningFormError}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmittingJoining}
              className="inline-flex h-10 items-center rounded-lg bg-[#38634a] px-4 text-sm font-semibold text-white transition hover:bg-[#2e533d] disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmittingJoining ? "Preparing..." : "Prepare Joining"}
            </button>
          </form>
        )}
        {view === "verification-bgv" && showBgvForm && (
          <form
            onSubmit={(event) => void submitBgv(event)}
            className="space-y-4 rounded-2xl border border-[#e6e8e3] bg-white p-5 shadow-[0_8px_24px_rgba(39,48,41,0.04)]"
          >
            <h3 className="text-base font-semibold text-[#354239]">
              Start Background Verification
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1.5 text-sm font-medium text-[#46534a]">
                Candidate application ID
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={bgvApplicationId}
                  onChange={(event) => setBgvApplicationId(event.target.value)}
                  placeholder="Enter application ID"
                  className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                />
              </label>
              <label className="space-y-1.5 text-sm font-medium text-[#46534a]">
                BGV result
                <select
                  required
                  value={bgvResult}
                  onChange={(event) => setBgvResult(event.target.value)}
                  className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                >
                  <option value="">Select result</option>
                  <option value="clear">Clear</option>
                  <option value="not-clear">Not Clear</option>
                </select>
              </label>
            </div>
            <label className="block space-y-1.5 text-sm font-medium text-[#46534a]">
              Remarks
              <textarea
                value={bgvRemarks}
                onChange={(event) => setBgvRemarks(event.target.value)}
                maxLength={500}
                rows={3}
                placeholder="Add verification remarks (optional)"
                className="w-full rounded-lg border border-[#dfe4df] bg-white px-3 py-2 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
              />
            </label>
            {bgvError && (
              <p
                role="alert"
                className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
              >
                {bgvError}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmittingBgv}
              className="inline-flex h-10 items-center rounded-lg bg-[#38634a] px-4 text-sm font-semibold text-white transition hover:bg-[#2e533d] disabled:cursor-wait disabled:opacity-60"
            >
              {isSubmittingBgv ? "Submitting..." : "Submit BGV"}
            </button>
          </form>
        )}
        {(view === "onboarding" || view === "induction") &&
          showPostJoiningForm && (
            <form
              onSubmit={submitPostJoiningForm}
              className="space-y-4 rounded-2xl border border-[#e6e8e3] bg-white p-5 shadow-[0_8px_24px_rgba(39,48,41,0.04)]"
            >
              <h3 className="text-base font-semibold text-[#354239]">
                {view === "onboarding"
                  ? "Start Candidate Onboarding"
                  : "Schedule Candidate Induction"}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {postJoiningFormFields.map((field) => (
                  <label
                    key={field.key}
                    className="space-y-1.5 text-sm font-medium text-[#46534a]"
                  >
                    {field.label}
                    {field.options ? (
                      <select
                        required
                        value={postJoiningFormValues[field.key] ?? ""}
                        onChange={(event) =>
                          setPostJoiningFormValues((previous) => ({
                            ...previous,
                            [field.key]: event.target.value,
                          }))
                        }
                        className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                      >
                        <option value="">Select {field.label.toLowerCase()}</option>
                        {field.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type ?? "text"}
                        required
                        value={postJoiningFormValues[field.key] ?? ""}
                        onChange={(event) =>
                          setPostJoiningFormValues((previous) => ({
                            ...previous,
                            [field.key]: event.target.value,
                          }))
                        }
                        placeholder={field.placeholder}
                        className="h-11 w-full rounded-lg border border-[#dfe4df] bg-white px-3 text-sm outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                      />
                    )}
                  </label>
                ))}
              </div>
              <button
                type="submit"
                className="inline-flex h-10 items-center rounded-lg bg-[#38634a] px-4 text-sm font-semibold text-white transition hover:bg-[#2e533d]"
              >
                {view === "onboarding" ? "Save Onboarding" : "Schedule Induction"}
              </button>
            </form>
          )}
        {view === "candidate-applications" && candidateApplicationsError && (
          <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {candidateApplicationsError}
          </p>
        )}

        <section className="overflow-hidden rounded-2xl border border-[#e6e8e3] bg-white shadow-[0_8px_24px_rgba(39,48,41,0.04)]">
          <div className="flex flex-wrap items-center gap-2.5 border-b border-[#eceee9] px-4 py-3.5 sm:px-5">
            <label className="relative min-w-[210px] flex-1 sm:max-w-[360px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#88938c]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search..."
                aria-label={`Search ${config.title}`}
                className="h-10 w-full rounded-lg border border-[#dfe4df] bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-[#929c95] focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
              />
            </label>
            <select
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
              aria-label="Filter by status"
              className="h-10 min-w-[150px] rounded-lg border border-[#dfe4df] bg-white px-3 text-sm text-[#354239] outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
            >
              <option>All Statuses</option>
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedStatus("All Statuses");
              }}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#e2e5df] px-3.5 text-sm font-semibold text-[#58655c] transition hover:bg-[#f8f8f4]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left">
              <thead>
                <tr>
                  {config.columns.map((column) => (
                    <th
                      key={column.key}
                      className="whitespace-nowrap bg-[#f8f9f7] px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#758078] first:pl-5 last:pr-5"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="bg-[#f8f9f7] px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#758078] last:pr-5">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, index) => (
                  <tr
                    key={`${row[config.columns[0].key]}-${index}`}
                    className="transition-colors hover:bg-[#fdfcf9]"
                  >
                    {config.columns.map((column) => (
                      <td
                        key={column.key}
                        className="whitespace-nowrap border-t border-[#eef0eb] px-4 py-3.5 text-xs text-[#344138] first:pl-5 last:pr-5"
                      >
                        {column.key === config.statusKey ? (
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClasses(row[column.key])}`}
                          >
                            {row[column.key]}
                          </span>
                        ) : column.key === "resume" && row[column.key] !== "—" ? (
                          <a
                            href={
                              /^https?:\/\//i.test(row[column.key])
                                ? row[column.key]
                                : `${(import.meta.env.VITE_API_URL ?? "http://localhost:3001/api").replace(/\/$/, "")}/${row[column.key].replace(/^\//, "")}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="font-semibold text-[#a87519] hover:text-[#80540d]"
                          >
                            View Resume
                          </a>
                        ) : (
                          row[column.key]
                        )}
                      </td>
                    ))}
                    <td className="border-t border-[#eef0eb] px-4 py-3.5 pr-5">
                      <div className="flex items-center gap-2">
                        {view === "onboarding" && (
                          <>
                            <input
                              type="email"
                              required
                              aria-label={`Email address for ${row.candidate}`}
                              value={
                                welcomeEmailDrafts[
                                  `${row.candidate}-${row.position}-${index}`
                                ] ??
                                row.email ??
                                ""
                              }
                              onChange={(event) => {
                                const rowKey = `${row.candidate}-${row.position}-${index}`;
                                setWelcomeEmailDrafts((previous) => ({
                                  ...previous,
                                  [rowKey]: event.target.value,
                                }));
                                setWelcomeEmailError("");
                              }}
                              placeholder="Candidate email"
                              className="h-9 w-44 rounded-lg border border-[#dfe4df] bg-white px-2.5 text-xs outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                void sendWelcomeEmail(
                                  row,
                                  `${row.candidate}-${row.position}-${index}`,
                                )
                              }
                              disabled={
                                sendingWelcomeEmail ===
                                `${row.candidate}-${row.position}-${index}`
                              }
                              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#dfe4df] bg-white px-3 py-2 text-xs font-semibold text-[#58655c] transition hover:border-[#d8a43b] hover:bg-[#fffaf0] disabled:cursor-wait disabled:opacity-60"
                            >
                              <Mail className="h-3.5 w-3.5" />
                              {sendingWelcomeEmail ===
                              `${row.candidate}-${row.position}-${index}`
                                ? "Sending..."
                                : "Send Email"}
                            </button>
                          </>
                        )}
                        {view === "joining" && (
                          <>
                            <input
                              type="email"
                              required
                              aria-label={`Email address for ${row.candidate}`}
                              value={
                                joiningEmailDrafts[
                                  `${row.application}-${row.candidate}-${index}`
                                ] ??
                                row.email ??
                                ""
                              }
                              onChange={(event) => {
                                const rowKey = `${row.application}-${row.candidate}-${index}`;
                                setJoiningEmailDrafts((previous) => ({
                                  ...previous,
                                  [rowKey]: event.target.value,
                                }));
                                setWelcomeEmailError("");
                              }}
                              placeholder="Candidate email"
                              className="h-9 w-44 rounded-lg border border-[#dfe4df] bg-white px-2.5 text-xs outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                void sendJoiningEmail(
                                  row,
                                  `${row.application}-${row.candidate}-${index}`,
                                )
                              }
                              disabled={
                                sendingJoiningEmail ===
                                `${row.application}-${row.candidate}-${index}`
                              }
                              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#dfe4df] bg-white px-3 py-2 text-xs font-semibold text-[#58655c] transition hover:border-[#d8a43b] hover:bg-[#fffaf0] disabled:cursor-wait disabled:opacity-60"
                            >
                              <Mail className="h-3.5 w-3.5" />
                              {sendingJoiningEmail ===
                              `${row.application}-${row.candidate}-${index}`
                                ? "Sending..."
                                : "Send Email"}
                            </button>
                          </>
                        )}
                        {view === "team-assignment" && (
                          <>
                            <input
                              type="email"
                              required
                              aria-label={`Email address for ${row.employee}`}
                              value={
                                teamAssignmentEmailDrafts[
                                  `${row.employeeCode}-${row.employee}-${index}`
                                ] ??
                                row.email ??
                                ""
                              }
                              onChange={(event) => {
                                const rowKey = `${row.employeeCode}-${row.employee}-${index}`;
                                setTeamAssignmentEmailDrafts((previous) => ({
                                  ...previous,
                                  [rowKey]: event.target.value,
                                }));
                                setTeamAssignmentError("");
                              }}
                              placeholder="Employee email"
                              className="h-9 w-44 rounded-lg border border-[#dfe4df] bg-white px-2.5 text-xs outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                void sendTeamAssignmentEmail(
                                  row,
                                  `${row.employeeCode}-${row.employee}-${index}`,
                                )
                              }
                              disabled={
                                sendingTeamAssignmentEmail ===
                                `${row.employeeCode}-${row.employee}-${index}`
                              }
                              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#dfe4df] bg-white px-3 py-2 text-xs font-semibold text-[#58655c] transition hover:border-[#d8a43b] hover:bg-[#fffaf0] disabled:cursor-wait disabled:opacity-60"
                            >
                              <Mail className="h-3.5 w-3.5" />
                              {sendingTeamAssignmentEmail ===
                              `${row.employeeCode}-${row.employee}-${index}`
                                ? "Sending..."
                                : "Send Email"}
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedRow(row)}
                          className="whitespace-nowrap rounded-lg border border-[#e4d5b5] bg-white px-3 py-2 text-xs font-semibold text-[#8a641d] transition hover:border-[#d8a43b] hover:bg-[#fffaf0]"
                        >
                          View / Action
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={config.columns.length + 1}
                      className="border-t border-[#eef0eb] px-5 py-12 text-center text-sm text-[#7b8981]"
                    >
                      {view === "candidate-applications" &&
                      candidateApplicationsLoading
                        ? "Loading candidate applications…"
                        : "No records match your search and status filter."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </section>

      {selectedRow && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#202a26]/45 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedRow(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="workflow-record-title"
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-[#eee9dc] bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#efeee9] px-5 py-4">
              <h3 id="workflow-record-title" className="font-bold text-[#26332c]">
                {selectedRow[config.columns[0].key]}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedRow(null)}
                aria-label="Close record details"
                className="rounded-lg p-1.5 text-[#7e8981] transition hover:bg-[#f5f4ef]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <dl className="grid gap-x-6 px-5 py-2 sm:grid-cols-2">
              {config.columns.map((column) => (
                <div
                  key={column.key}
                  className="border-b border-[#f0f0eb] py-3"
                >
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#849087]">
                    {column.label}
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-[#354239]">
                    {selectedRow[column.key]}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="flex justify-end border-t border-[#efeee9] px-5 py-3">
              <button
                type="button"
                onClick={() => setSelectedRow(null)}
                className="h-9 rounded-lg bg-[#e5a538] px-4 text-xs font-semibold text-[#342712] transition hover:bg-[#d99a2b]"
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

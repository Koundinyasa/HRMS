import { useMemo, useState } from "react";
import { Plus, RotateCcw, Search, X } from "lucide-react";

type WorkflowRow = Record<string, string>;
const EMPTY_WORKFLOW_ROWS: WorkflowRow[] = [];

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
    description: "Create an application against an active open job opening.",
    createAction: "Create Application",
    statusKey: "status",
    columns: [
      { key: "application", label: "Application" },
      { key: "candidateId", label: "Candidate ID" },
      { key: "candidate", label: "Candidate" },
      { key: "position", label: "Position" },
      { key: "opening", label: "Opening" },
      { key: "appliedDate", label: "Applied Date" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        application: "APP-2026-221",
        candidateId: "CAND-2026-078",
        candidate: "Arjun Kumar",
        position: "Software Engineer",
        opening: "JOB-2026-014",
        appliedDate: "02 Sep 2026",
        status: "Applied",
      },
      {
        application: "APP-2026-222",
        candidateId: "CAND-2026-079",
        candidate: "Priya Sharma",
        position: "Software Engineer",
        opening: "JOB-2026-014",
        appliedDate: "03 Sep 2026",
        status: "Screened",
      },
      {
        application: "APP-2026-223",
        candidateId: "CAND-2026-080",
        candidate: "Rahul Verma",
        position: "QA Engineer",
        opening: "JOB-2026-016",
        appliedDate: "04 Sep 2026",
        status: "Assessment Scheduled",
      },
    ],
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
      { key: "documents", label: "Documents" },
      { key: "welcomeEmail", label: "Welcome Email" },
      { key: "checklist", label: "Checklist" },
      { key: "status", label: "Onboarding Status" },
    ],
    rows: [
      {
        candidate: "Sample Candidate A",
        position: "Software Engineer",
        offerStatus: "Accepted",
        documents: "4 / 5 received",
        welcomeEmail: "Sent",
        checklist: "3 / 5 complete",
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
      { key: "attendance", label: "Attendance" },
      { key: "status", label: "Status" },
    ],
    rows: [
      {
        candidate: "Sample Candidate A",
        position: "Software Engineer",
        inductionDate: "14 Oct 2026",
        program: "New Hire Orientation",
        attendance: "Not Marked",
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
}: {
  view: string;
  onCreateAction?: () => void;
}) {
  const config = WORKFLOW_SCREENS[view];
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [selectedRow, setSelectedRow] = useState<WorkflowRow | null>(null);
  const [actionMessage, setActionMessage] = useState("");
  const rows = config?.rows ?? EMPTY_WORKFLOW_ROWS;
  const statusKey = config?.statusKey ?? "";

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
  const isPostJoiningPreview = [
    "onboarding",
    "induction",
    "team-assignment",
    "asset-assignment",
  ].includes(view);

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
          <button
            type="button"
            onClick={() => {
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
            <Plus className="h-4 w-4" />
            {config.createAction}
          </button>
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
                        ) : (
                          row[column.key]
                        )}
                      </td>
                    ))}
                    <td className="border-t border-[#eef0eb] px-4 py-3.5 pr-5">
                      <button
                        type="button"
                        onClick={() => setSelectedRow(row)}
                        className="whitespace-nowrap rounded-lg border border-[#e4d5b5] bg-white px-3 py-2 text-xs font-semibold text-[#8a641d] transition hover:border-[#d8a43b] hover:bg-[#fffaf0]"
                      >
                        View / Action
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={config.columns.length + 1}
                      className="border-t border-[#eef0eb] px-5 py-12 text-center text-sm text-[#7b8981]"
                    >
                      No records match your search and status filter.
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

import { useState } from "react";
import { ChevronLeft, ChevronRight, Mail, RotateCcw, Search } from "lucide-react";
import { recruitmentFileUrl } from "../api/recruitment.api";
import {
  statusClasses,
  type WorkflowRow,
  type WorkflowScreenConfig,
} from "./recruitmentOperationalConfig";

interface OperationalWorkflowTableProps {
  view: string;
  config: WorkflowScreenConfig;
  filteredRows: WorkflowRow[];
  statuses: string[];
  search: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onSelectedStatusChange: (value: string) => void;
  isLoading: boolean;
  welcomeEmailDrafts: Record<string, string>;
  onWelcomeEmailChange: (rowKey: string, email: string) => void;
  sendingWelcomeEmail: string | null;
  onSendWelcomeEmail: (row: WorkflowRow, rowKey: string) => void;
  joiningEmailDrafts: Record<string, string>;
  onJoiningEmailChange: (rowKey: string, email: string) => void;
  sendingJoiningEmail: string | null;
  onSendJoiningEmail: (row: WorkflowRow, rowKey: string) => void;
  teamAssignmentEmailDrafts: Record<string, string>;
  onTeamAssignmentEmailChange: (rowKey: string, email: string) => void;
  sendingTeamAssignmentEmail: string | null;
  onSendTeamAssignmentEmail: (row: WorkflowRow, rowKey: string) => void;
  onViewAction: (row: WorkflowRow) => void;
}

export function OperationalWorkflowTable({
  view,
  config,
  filteredRows,
  statuses,
  search,
  onSearchChange,
  selectedStatus,
  onSelectedStatusChange,
  isLoading,
  welcomeEmailDrafts,
  onWelcomeEmailChange,
  sendingWelcomeEmail,
  onSendWelcomeEmail,
  joiningEmailDrafts,
  onJoiningEmailChange,
  sendingJoiningEmail,
  onSendJoiningEmail,
  teamAssignmentEmailDrafts,
  onTeamAssignmentEmailChange,
  sendingTeamAssignmentEmail,
  onSendTeamAssignmentEmail,
  onViewAction,
}: OperationalWorkflowTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pageRows = filteredRows.slice(startIndex, startIndex + pageSize);
  const firstRow = filteredRows.length === 0 ? 0 : startIndex + 1;
  const lastRow = Math.min(startIndex + pageSize, filteredRows.length);

  return (
        <section className="overflow-hidden rounded-2xl border border-[#e6e8e3] bg-white shadow-[0_8px_24px_rgba(39,48,41,0.04)]">
          <div className="punch-horizontal-scroll w-full min-w-0 overflow-x-auto border-b border-[#eceee9]">
            <div className="flex w-max min-w-full flex-nowrap items-center gap-2.5 px-4 py-3.5 sm:px-5">
              <label className="relative w-[220px] shrink-0 sm:w-[360px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#88938c]" />
                <input
                  value={search}
                  onChange={(event) => {
                    onSearchChange(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search..."
                  aria-label={`Search ${config.title}`}
                  className="h-10 w-full rounded-lg border border-[#dfe4df] bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-[#929c95] focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
                />
              </label>
              <select
                value={selectedStatus}
                onChange={(event) => {
                  onSelectedStatusChange(event.target.value);
                  setPage(1);
                }}
                aria-label="Filter by status"
                className="h-10 w-[170px] shrink-0 rounded-lg border border-[#dfe4df] bg-white px-3 text-sm text-[#354239] outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15"
              >
                <option>All Statuses</option>
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  onSearchChange("");
                  onSelectedStatusChange("All Statuses");
                  setPage(1);
                }}
                className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-lg border border-[#e2e5df] px-3.5 text-sm font-semibold text-[#58655c] transition hover:bg-[#f8f8f4]"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            </div>
          </div>

          <div className="punch-horizontal-scroll w-full min-w-0 touch-pan-x overflow-x-scroll overscroll-x-contain">
            <table className="w-full min-w-[850px] border-collapse whitespace-nowrap text-left">
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
                  <th className="min-w-[11rem] whitespace-nowrap bg-[#f8f9f7] px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-[#758078]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row, index) => {
                  const rowIndex = startIndex + index;
                  return (
                    <tr
                      key={`${row[config.columns[0].key]}-${rowIndex}`}
                      className="odd:bg-white even:bg-[#fffaf0] transition-colors hover:bg-[#f3e4c5]"
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
                            href={recruitmentFileUrl(row[column.key])}
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
                    <td className="min-w-[11rem] border-t border-[#eef0eb] bg-transparent px-3 py-3.5">
                      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
                        {view === "onboarding" && (
                          <>
                            <input
                              type="email"
                              required
                              aria-label={`Email address for ${row.candidate}`}
                              value={
                                welcomeEmailDrafts[
                                  `${row.candidate}-${row.position}-${rowIndex}`
                                ] ??
                                row.email ??
                                ""
                              }
                              onChange={(event) => {
                                const rowKey = `${row.candidate}-${row.position}-${rowIndex}`;
                                onWelcomeEmailChange(rowKey, event.target.value);
                              }}
                              placeholder="Candidate email"
                              className="h-9 w-full min-w-0 rounded-lg border border-[#dfe4df] bg-white px-2.5 text-xs outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15 sm:w-44"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                void onSendWelcomeEmail(
                                  row,
                                  `${row.candidate}-${row.position}-${rowIndex}`,
                                )
                              }
                              disabled={
                                sendingWelcomeEmail ===
                                `${row.candidate}-${row.position}-${rowIndex}`
                              }
                              className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#dfe4df] bg-white px-3 py-2 text-xs font-semibold text-[#58655c] transition hover:border-[#d8a43b] hover:bg-[#fffaf0] disabled:cursor-wait disabled:opacity-60"
                            >
                              <Mail className="h-3.5 w-3.5" />
                              {sendingWelcomeEmail ===
                              `${row.candidate}-${row.position}-${rowIndex}`
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
                                  `${row.application}-${row.candidate}-${rowIndex}`
                                ] ??
                                row.email ??
                                ""
                              }
                              onChange={(event) => {
                                const rowKey = `${row.application}-${row.candidate}-${rowIndex}`;
                                onJoiningEmailChange(rowKey, event.target.value);
                              }}
                              placeholder="Candidate email"
                              className="h-9 w-full min-w-0 rounded-lg border border-[#dfe4df] bg-white px-2.5 text-xs outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15 sm:w-44"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                void onSendJoiningEmail(
                                  row,
                                  `${row.application}-${row.candidate}-${rowIndex}`,
                                )
                              }
                              disabled={
                                sendingJoiningEmail ===
                                `${row.application}-${row.candidate}-${rowIndex}`
                              }
                              className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#dfe4df] bg-white px-3 py-2 text-xs font-semibold text-[#58655c] transition hover:border-[#d8a43b] hover:bg-[#fffaf0] disabled:cursor-wait disabled:opacity-60"
                            >
                              <Mail className="h-3.5 w-3.5" />
                              {sendingJoiningEmail ===
                              `${row.application}-${row.candidate}-${rowIndex}`
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
                                  `${row.employeeCode}-${row.employee}-${rowIndex}`
                                ] ??
                                row.email ??
                                ""
                              }
                              onChange={(event) => {
                                const rowKey = `${row.employeeCode}-${row.employee}-${rowIndex}`;
                                onTeamAssignmentEmailChange(rowKey, event.target.value);
                              }}
                              placeholder="Employee email"
                              className="h-9 w-full min-w-0 rounded-lg border border-[#dfe4df] bg-white px-2.5 text-xs outline-none focus:border-[#d8a43b] focus:ring-2 focus:ring-[#e5a538]/15 sm:w-44"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                void onSendTeamAssignmentEmail(
                                  row,
                                  `${row.employeeCode}-${row.employee}-${rowIndex}`,
                                )
                              }
                              disabled={
                                sendingTeamAssignmentEmail ===
                                `${row.employeeCode}-${row.employee}-${rowIndex}`
                              }
                              className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#dfe4df] bg-white px-3 py-2 text-xs font-semibold text-[#58655c] transition hover:border-[#d8a43b] hover:bg-[#fffaf0] disabled:cursor-wait disabled:opacity-60"
                            >
                              <Mail className="h-3.5 w-3.5" />
                              {sendingTeamAssignmentEmail ===
                              `${row.employeeCode}-${row.employee}-${rowIndex}`
                                ? "Sending..."
                                : "Send Email"}
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            onViewAction(row);
                          }}
                          className="whitespace-nowrap rounded-lg border border-[#e4d5b5] bg-white px-3 py-2 text-xs font-semibold text-[#8a641d] transition hover:border-[#d8a43b] hover:bg-[#fffaf0]"
                        >
                          View / Action
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
                {filteredRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={config.columns.length + 1}
                      className="border-t border-[#eef0eb] px-5 py-12 text-center text-sm text-[#7b8981]"
                    >
                      {isLoading
                        ? `Loading ${config.title.toLowerCase()}…`
                        : "No records match your search and status filter."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col items-center justify-between gap-3 border-t border-[#eceee9] px-4 py-3 text-xs text-[#68756d] sm:flex-row sm:px-5">
            <div className="flex items-center gap-2">
              <label htmlFor="workflow-page-size">Rows per page</label>
              <select
                id="workflow-page-size"
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  setPage(1);
                }}
                className="rounded-lg border border-[#dfe4df] bg-white px-2 py-1.5 text-xs text-[#354239] outline-none focus:border-[#d8a43b]"
              >
                {[10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>
                Showing {firstRow}–{lastRow} of {filteredRows.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 rounded-lg border border-[#e2e5df] px-3 py-1.5 font-semibold text-[#58655c] transition hover:bg-[#f8f8f4] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </button>
              <span aria-live="polite">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() =>
                  setPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-[#e2e5df] px-3 py-1.5 font-semibold text-[#58655c] transition hover:bg-[#f8f8f4] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </section>
  );
}

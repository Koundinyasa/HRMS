import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { EmptyState } from "./RecruitmentShared";
import { OPENING_DEPARTMENTS } from "../constants/recruitment.constants";
import type { JobOpening } from "../types/recruitment.types";

interface JobOpeningsPanelProps {
  filteredOpenings: JobOpening[];
  search: string;
  selectedDepartment: string;
  setSelectedDepartment: (
    department: (typeof OPENING_DEPARTMENTS)[number]
  ) => void;
}

export function JobOpeningsPanel({
  filteredOpenings,
  search,
  selectedDepartment,
  setSelectedDepartment,
}: JobOpeningsPanelProps) {
  const filterKey = `${search}\u0000${selectedDepartment}`;
  const [pagination, setPagination] = useState({ page: 1, filterKey });
  const [pageSize, setPageSize] = useState(10);
  const [selectedOpening, setSelectedOpening] = useState<JobOpening | null>(
    null,
  );

  const totalPages = Math.max(1, Math.ceil(filteredOpenings.length / pageSize));
  const currentPage = Math.min(
    pagination.filterKey === filterKey ? pagination.page : 1,
    totalPages,
  );
  const changePage = (nextPage: number) =>
    setPagination({ page: nextPage, filterKey });
  const startIndex = (currentPage - 1) * pageSize;
  const pageOpenings = filteredOpenings.slice(startIndex, startIndex + pageSize);
  const firstRow = filteredOpenings.length === 0 ? 0 : startIndex + 1;
  const lastRow = Math.min(startIndex + pageSize, filteredOpenings.length);

  return (
    <section>
      <div className="punch-horizontal-scroll mb-5 w-full min-w-0 overflow-x-auto">
        <div
          className="flex w-max min-w-full flex-nowrap gap-2 pb-1"
          role="group"
          aria-label="Filter openings by department"
        >
          {OPENING_DEPARTMENTS.map((department) => (
            <button
              key={department}
              type="button"
              onClick={() => {
                setSelectedDepartment(department);
              }}
              aria-pressed={selectedDepartment === department}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedDepartment === department
                  ? "bg-[#38634a] text-white shadow-sm"
                  : "border border-[#dfe6e1] bg-white text-[#68776e] hover:bg-[#edf3ef]"
              }`}
            >
              {department}
            </button>
          ))}
        </div>
      </div>
      {filteredOpenings.length === 0 ? (
        <EmptyState message="No job openings match your search or department filter." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#e0e7e2] bg-white">
          <table className="w-full min-w-[900px] border-collapse whitespace-nowrap text-left">
            <thead className="bg-[#f8faf8]">
              <tr className="border-b border-[#e8ede9] text-xs font-semibold uppercase tracking-wide text-[#849088]">
                <th className="px-5 py-3.5">Role</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">Applicants</th>
                <th className="px-4 py-3.5">Positions filled</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0ed]">
              {pageOpenings.map((opening) => {
                const fillPercentage =
                  (opening.positionsFilled / opening.positions) * 100;
                const statusClass = {
                  Open: "bg-emerald-50 text-emerald-700",
                  "Pending approval": "bg-amber-50 text-amber-700",
                  "Sent back": "bg-rose-50 text-rose-700",
                  Draft: "bg-slate-100 text-slate-600",
                  "On hold": "bg-orange-50 text-orange-700",
                }[opening.status];

                return (
                  <tr
                    key={opening.id}
                    className="odd:bg-white even:bg-[#fffaf0] text-sm text-[#536159] transition hover:bg-[#f3e4c5]"
                  >
                    <td className="px-5 py-4">
                      <span className="font-semibold text-[#28332d]">
                        {opening.title}
                      </span>
                      {opening.requisitionNo && (
                        <span className="ml-2 text-xs text-[#718078]">
                          {opening.requisitionNo}
                        </span>
                      )}
                      <span className="ml-2 text-xs text-[#8a968f]">
                        {opening.positions}{" "}
                        {opening.positions === 1 ? "position" : "positions"}
                      </span>
                    </td>
                    <td className="px-4 py-4">{opening.department}</td>
                    <td className="px-4 py-4">{opening.location}</td>
                    <td className="px-4 py-4">{opening.applicants ?? "—"}</td>
                    <td className="px-4 py-4">
                      <div className="flex min-w-32 items-center gap-3">
                        <div
                          className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#e8ede9]"
                          role="progressbar"
                          aria-label={`${opening.title} positions filled`}
                          aria-valuemin={0}
                          aria-valuemax={opening.positions}
                          aria-valuenow={opening.positionsFilled}
                        >
                          <div
                            className="h-full rounded-full bg-[#4b8962]"
                            style={{ width: `${fillPercentage}%` }}
                          />
                        </div>
                        <span className="whitespace-nowrap text-xs text-[#718078]">
                          {opening.positionsFilled} of {opening.positions}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass}`}
                      >
                        {opening.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedOpening(opening)}
                        className="whitespace-nowrap rounded-lg border border-[#ead9b7] bg-white px-3 py-2 text-xs font-semibold text-[#986713] transition hover:bg-[#fffaf0]"
                      >
                        View / Action
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex flex-col items-center justify-between gap-3 border-t border-[#e8ede9] px-4 py-3 text-xs text-[#68756d] sm:flex-row sm:px-5">
            <div className="flex items-center gap-2">
              <label htmlFor="opening-page-size">Rows per page</label>
              <select
                id="opening-page-size"
                value={pageSize}
                onChange={(event) => {
                  setPageSize(Number(event.target.value));
                  changePage(1);
                }}
                className="rounded-lg border border-[#dfe6e1] bg-white px-2 py-1.5 text-xs text-[#354239] outline-none focus:border-[#537b65]"
              >
                {[10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>
                Showing {firstRow}–{lastRow} of {filteredOpenings.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => changePage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 rounded-lg border border-[#dfe6e1] px-3 py-1.5 font-semibold text-[#566258] transition hover:bg-[#f8faf8] disabled:cursor-not-allowed disabled:opacity-50"
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
                  changePage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-[#dfe6e1] px-3 py-1.5 font-semibold text-[#566258] transition hover:bg-[#f8faf8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedOpening && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#202a26]/45 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedOpening(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-opening-details-title"
            className="my-auto max-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-2xl border border-[#eee9dc] bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#efeee9] px-5 py-4">
              <h2
                id="job-opening-details-title"
                className="font-bold text-[#26332c]"
              >
                {selectedOpening.title}
                {selectedOpening.requisitionNo && (
                  <span className="mt-1 block text-xs font-medium text-[#7b8981]">
                    {selectedOpening.requisitionNo}
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={() => setSelectedOpening(null)}
                aria-label="Close job opening details"
                className="rounded-lg p-1.5 text-[#7e8981] transition hover:bg-[#f5f4ef]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <dl className="grid gap-x-6 px-5 py-2 sm:grid-cols-2">
              {[
                ["Role", selectedOpening.title],
                ["Department", selectedOpening.department],
                ["Location", selectedOpening.location],
                ["Designation", selectedOpening.type],
                ["Positions", String(selectedOpening.positions)],
                ["Applicants", selectedOpening.applicants ?? "—"],
                ["Salary Range (INR)", selectedOpening.salaryRange ?? "—"],
                [
                  "Experience Required",
                  selectedOpening.experienceRequired || "—",
                ],
                [
                  "Positions Filled",
                  `${selectedOpening.positionsFilled} of ${selectedOpening.positions}`,
                ],
                ["Status", selectedOpening.status],
                ["Closing Date", selectedOpening.closingDate || "—"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border-b border-[#f0f0eb] py-3"
                >
                  <dt className="text-[11px] font-semibold uppercase tracking-wide text-[#849087]">
                    {label}
                  </dt>
                  <dd className="mt-1 break-words text-sm font-medium text-[#354239]">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      )}
    </section>
  );
}

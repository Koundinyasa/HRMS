import { EmptyState } from "./RecruitmentShared";
import { OPENING_DEPARTMENTS } from "../constants/recruitment.constants";
import type { JobOpening } from "../types/recruitment.types";

interface JobOpeningsPanelProps {
  filteredOpenings: JobOpening[];
  selectedDepartment: string;
  setSelectedDepartment: (
    department: (typeof OPENING_DEPARTMENTS)[number]
  ) => void;
}

export function JobOpeningsPanel({
  filteredOpenings,
  selectedDepartment,
  setSelectedDepartment,
}: JobOpeningsPanelProps) {
  return (
    <section>
      <div
        className="mb-5 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter openings by department"
      >
        {OPENING_DEPARTMENTS.map((department) => (
          <button
            key={department}
            type="button"
            onClick={() => setSelectedDepartment(department)}
            aria-pressed={selectedDepartment === department}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              selectedDepartment === department
                ? "bg-[#38634a] text-white shadow-sm"
                : "border border-[#dfe6e1] bg-white text-[#68776e] hover:bg-[#edf3ef]"
            }`}
          >
            {department}
          </button>
        ))}
      </div>
      {filteredOpenings.length === 0 ? (
        <EmptyState message="No job openings match your search or department filter." />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#e0e7e2] bg-white">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead className="bg-[#f8faf8]">
              <tr className="border-b border-[#e8ede9] text-xs font-semibold uppercase tracking-wide text-[#849088]">
                <th className="px-5 py-3.5">Role</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">Applicants</th>
                <th className="px-4 py-3.5">Positions filled</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Posted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf0ed]">
              {filteredOpenings.map((opening) => {
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
                    className="text-sm text-[#536159] transition hover:bg-[#fafcfa]"
                  >
                    <td className="px-5 py-4">
                      <span className="font-semibold text-[#28332d]">
                        {opening.title}
                      </span>
                      <span className="mt-1 block text-xs text-[#8a968f]">
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
                    <td className="whitespace-nowrap px-4 py-4 text-[#78867e]">
                      {opening.posted}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

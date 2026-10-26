// import { useNavigate, useParams } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";
// import {
//   MOCK_COMPANY,
//   MOCK_SALARY_ROWS,
//   MONTH_OPTIONS,
// } from "../constants/details.constants";
// import ConsolidatedSalarySheet from "../components/ConsolidatedSalarySheet";

// export default function ConsolidatedSalarySheetPage() {
//   const navigate = useNavigate();
//   const { domain } = useParams();

//   return (
//     <div className="flex w-full min-w-0 flex-col gap-4">
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <h2 className="text-base font-semibold text-blue-600">
//           Consolidated Salary Sheet
//         </h2>
//         <div className="flex flex-wrap items-center gap-2">
//           <button
//             type="button"
//             onClick={() =>
//               navigate(
//                 `/${domain}/admin/organizations/details/consolidated-salary`
//               )
//             }
//             className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 hover:bg-slate-50"
//           >
//             <ArrowLeft size={14} />
//             Back
//           </button>
//           <select
//             defaultValue={MONTH_OPTIONS[0]}
//             className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
//           >
//             {MONTH_OPTIONS.map((m) => (
//               <option key={m} value={m}>
//                 {m}
//               </option>
//             ))}
//           </select>
//           <button
//             type="button"
//             className="h-9 rounded-lg bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700"
//           >
//             Advance Filter
//           </button>
//         </div>
//       </div>

//       <div className="w-fit">
//         <select
//           defaultValue="1"
//           className="h-9 min-w-[160px] rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
//         >
//           <option value="1">{MOCK_COMPANY.name}</option>
//         </select>
//       </div>

//       <ConsolidatedSalarySheet rows={MOCK_SALARY_ROWS} />
//     </div>
//   );
// }






import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Search, ListFilter, Download, X } from "lucide-react";
import {
  MOCK_COMPANY,
  MOCK_SALARY_ROWS,
  MONTH_OPTIONS,
} from "../constants/details.constants";
import ConsolidatedSalarySheet from "../components/ConsolidatedSalarySheet";
import FilterDropdown from "../components/FilterDropdown";
import CompanyDropdown from "../components/CompanyDropdown";

// Placeholder option lists — swap for real backend-provided lists once
// branch/salary-structure/leave/attendance/designation/emp-status
// endpoints exist. Selecting these updates state but can't narrow
// SalaryParticularRow yet since it has no matching field — see
// "REAL FILTERING GOES HERE" below.
const FILTER_OPTIONS: Record<string, string[]> = {
  Query: ["All Queries", "Saved Query 1", "Saved Query 2"],
  Branch: ["All Branches", "Head Office", "Branch 1", "Branch 2"],
  "Salary Structure": ["All Structures", "Structure A", "Structure B"],
  Leave: ["All", "On Leave", "Not on Leave"],
  Attendance: ["All", "Present", "Absent"],
  Designation: ["All Designations", "Associate", "Senior", "Manager"],
  "Emp Status": ["All", "Active", "Inactive"],
};

const FILTER_KEYS = Object.keys(FILTER_OPTIONS);

function defaultFilters() {
  const initial: Record<string, string> = {};
  FILTER_KEYS.forEach((key) => {
    initial[key] = FILTER_OPTIONS[key][0];
  });
  return initial;
}

function downloadCsv(rows: typeof MOCK_SALARY_ROWS) {
  const headers = ["Particular", "Current Month", "Previous Month", "Difference", "% Inc/Dec", "FY YTD"];
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [r.particular, r.currentMonth, r.previousMonth, r.difference, r.pctIncDec, r.pyYtd].join(",")
    ),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "consolidated-salary-sheet.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export default function ConsolidatedSalarySheetPage() {
  const navigate = useNavigate();
  const { domain } = useParams();

  const [month, setMonth] = useState(MONTH_OPTIONS[0]);
  const [company, setCompany] = useState(MOCK_COMPANY.name);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [showAdvancePanel, setShowAdvancePanel] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>(defaultFilters());

  const activeFilterCount = FILTER_KEYS.filter(
    (key) => filters[key] !== FILTER_OPTIONS[key][0]
  ).length;

  const filteredRows = useMemo(() => {
    // REAL FILTERING GOES HERE once branch/designation/leave/attendance/
    // emp-status fields exist on the row data. Only `search` (particular
    // name) actually narrows results right now — this part is real,
    // working, wired to actual data.
    const q = search.trim().toLowerCase();
    if (!q) return MOCK_SALARY_ROWS;
    return MOCK_SALARY_ROWS.filter((r) => r.particular.toLowerCase().includes(q));
  }, [search]);

  function resetFilters() {
    setFilters(defaultFilters());
    setSearch("");
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      {/* Top bar — title chip + back/month/advance filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span
          className="
            inline-flex h-9 items-center rounded-lg border border-[#2563EB]
            bg-white px-3 text-sm font-semibold text-[#2563EB]
          "
        >
          Consolidated Salary Sheet
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/${domain}/admin/organizations/details/consolidated-salary`
              )
            }
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft size={14} />
            Back
          </button>

          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
          >
            {MONTH_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setShowAdvancePanel((o) => !o)}
            className={`
              inline-flex h-9 items-center gap-1 rounded-lg px-3 text-sm font-medium
              transition-colors
              ${showAdvancePanel ? "bg-blue-700 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}
            `}
          >
            <ListFilter size={14} />
            Advance Filter
            {activeFilterCount > 0 && (
              <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-blue-600">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Advance filter panel */}
      {showAdvancePanel && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs text-slate-500">
            {activeFilterCount > 0
              ? `${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} active`
              : "No filters applied"}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 hover:bg-slate-50"
            >
              <X size={12} />
              Reset All
            </button>
            <button
              type="button"
              onClick={() => setShowAdvancePanel(false)}
              className="inline-flex h-8 items-center rounded-lg bg-blue-600 px-3 text-xs font-medium text-white hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* ONE unified card — left company panel + right content together */}
      <div
        className="
          flex w-full min-w-0 flex-col gap-4 rounded-2xl border border-slate-100
          bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)] lg:flex-row
        "
      >
        {/* Left panel */}
        <div className="w-full shrink-0 lg:w-48">
          <CompanyDropdown
            companies={[MOCK_COMPANY.name]}
            value={company}
            onChange={setCompany}
          />
        </div>

        {/* Right content */}
        <div className="flex w-full min-w-0 flex-1 flex-col gap-3">
          {/* Search + filter/export icons */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex h-9 max-w-xs flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3">
              <Search size={14} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search particular..."
                className="w-full min-w-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} title="Clear">
                  <X size={13} className="text-slate-400 hover:text-slate-600 shrink-0" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                title="Toggle filters"
                onClick={() => setShowFilters((o) => !o)}
                className={`
                  flex h-9 w-9 items-center justify-center rounded-lg border
                  transition-colors
                  ${showFilters ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]" : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"}
                `}
              >
                <ListFilter size={15} />
              </button>
              <button
                type="button"
                title="Export CSV"
                onClick={() => downloadCsv(filteredRows)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
              >
                <Download size={15} />
              </button>
            </div>
          </div>

          {/* Filter pill toolbar */}
          {showFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowFilters(true)}
                className="inline-flex h-8 items-center gap-1 rounded-lg bg-blue-600 px-3 text-xs font-medium text-white hover:bg-blue-700 shrink-0"
              >
                <ListFilter size={12} />
                Add Filter
              </button>

              {FILTER_KEYS.map((key) => (
                <FilterDropdown
                  key={key}
                  label={key}
                  options={FILTER_OPTIONS[key]}
                  value={filters[key]}
                  onChange={(val) =>
                    setFilters((prev) => ({ ...prev, [key]: val }))
                  }
                />
              ))}

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-red-500 hover:bg-red-50 shrink-0"
                >
                  <X size={12} />
                  Clear
                </button>
              )}
            </div>
          )}

          <ConsolidatedSalarySheet rows={filteredRows} />
        </div>
      </div>
    </div>
  );
}
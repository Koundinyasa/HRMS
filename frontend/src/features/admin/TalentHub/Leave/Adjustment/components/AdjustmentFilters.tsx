// import {
//   ChevronDown,
//   MoreVertical,
//   Plus,
//   Search,
//   X,
// } from "lucide-react";

// interface AdjustmentFiltersProps {
//   searchValue?: string;
//   onSearchChange?: (value: string) => void;
//   onAddFilter?: () => void;
//   onClear?: () => void;
// }

// const AdjustmentFilters = ({
//   searchValue = "",
//   onSearchChange,
//   onAddFilter,
//   onClear,
// }: AdjustmentFiltersProps) => {
//   const dropdownClass =
//     "flex h-9 shrink-0 items-center gap-1 whitespace-nowrap text-[14px] font-medium text-slate-600";

//   return (
//     <div className="w-full rounded-lg border border-slate-200 bg-white font-[Urbanist] shadow-sm">
//       {/* TOP ROW - More + Clear */}
//       <div className="flex h-[38px] items-center gap-2 px-4">
//         <button
//           type="button"
//           className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-50"
//           aria-label="More"
//         >
//           <MoreVertical size={18} strokeWidth={1.8} />
//         </button>

//         <button
//           type="button"
//           onClick={onClear}
//           className="flex h-7 w-7 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50"
//           aria-label="Clear"
//         >
//           <X size={20} strokeWidth={1.8} />
//         </button>
//       </div>

//       {/* SECOND ROW */}
//       <div className="flex h-[48px] w-full items-center gap-6 overflow-x-auto px-4">
//         {/* Search */}
//         <div className="relative flex min-w-[190px] flex-1 items-center">
//           <Search
//             size={19}
//             strokeWidth={1.8}
//             className="absolute left-0 text-slate-400"
//           />

//           <input
//             type="text"
//             value={searchValue}
//             onChange={(event) => onSearchChange?.(event.target.value)}
//             placeholder="Start Typing..."
//             className="h-9 w-full border-0 bg-transparent pl-8 pr-2 text-[14px] font-normal text-slate-700 outline-none placeholder:text-slate-300"
//           />
//         </div>

//         {/* Add Filter */}
//         <button
//           type="button"
//           onClick={onAddFilter}
//           className="flex h-9 shrink-0 items-center gap-2 whitespace-nowrap text-[14px] font-medium text-slate-600 transition hover:text-slate-800"
//         >
//           <Plus size={19} strokeWidth={1.8} />
//           Add Filter
//         </button>

//         {/* Query */}
//         <button type="button" className={dropdownClass}>
//           Query
//           <ChevronDown size={15} strokeWidth={1.8} />
//         </button>

//         {/* Branch */}
//         <button type="button" className={dropdownClass}>
//           Branch
//           <ChevronDown size={15} strokeWidth={1.8} />
//         </button>

//         {/* Salary Structure */}
//         <button type="button" className={dropdownClass}>
//           Salary Structure
//           <ChevronDown size={15} strokeWidth={1.8} />
//         </button>

//         {/* Leave */}
//         <button type="button" className={dropdownClass}>
//           Leave
//           <ChevronDown size={15} strokeWidth={1.8} />
//         </button>

//         {/* Attendance */}
//         <button type="button" className={dropdownClass}>
//           Attendance
//           <ChevronDown size={15} strokeWidth={1.8} />
//         </button>

//         {/* Designation */}
//         <button type="button" className={dropdownClass}>
//           Designation
//           <ChevronDown size={15} strokeWidth={1.8} />
//         </button>

//         {/* Emp Status */}
//         <button type="button" className={dropdownClass}>
//           Emp Status
//           <ChevronDown size={15} strokeWidth={1.8} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AdjustmentFilters;

import {
  ChevronDown,
  MoreVertical,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";
import LeaveQueryFilter from "../../components/LeaveQueryFilter";

interface AdjustmentFiltersProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onAddFilter?: () => void;
  onClear?: () => void;
  onHideFilters?: () => void;
}

const AdjustmentFilters = ({
  searchValue = "",
  onSearchChange,
  onAddFilter,
  onClear,
  onHideFilters,
}: AdjustmentFiltersProps) => {
  const [leavePolicy, setLeavePolicy] = useState("");
  const [leaveMenuOpen, setLeaveMenuOpen] = useState(false);
  const [branch, setBranch] = useState("");
  const [branchMenuOpen, setBranchMenuOpen] = useState(false);
  const dropdownClass =
    "flex h-9 shrink-0 items-center gap-1 whitespace-nowrap text-[12px] font-medium text-slate-600";

  return (
    <div className="relative z-10 w-full overflow-visible rounded-lg border border-slate-200 bg-white font-[Urbanist] shadow-sm">
      {/* Top row - More and Clear */}
      <div className="flex h-[36px] items-center gap-2 px-4">
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-50"
          aria-label="More"
        >
          <MoreVertical size={18} strokeWidth={1.8} />
        </button>

        <button
          type="button"
          onClick={() => {
            onClear?.();
            onHideFilters?.();
          }}
          className="flex h-7 w-7 items-center justify-center rounded-md text-red-500 transition hover:bg-red-50"
          aria-label="Clear"
        >
          <X size={19} strokeWidth={1.8} />
        </button>
      </div>

      {/* Second row - Search and filters */}
      <div className="w-full overflow-x-auto px-3 py-2 [scrollbar-color:#a45a4a_#f3e5e1] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#f3e5e1] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#a45a4a] xl:overflow-x-visible xl:[scrollbar-width:none] xl:[&::-webkit-scrollbar]:hidden">
      <div className="flex min-h-[48px] w-max min-w-full flex-nowrap items-center gap-x-3 overflow-visible xl:w-full xl:flex-wrap">
        {/* Search */}
        <div className="relative flex min-w-[85px] flex-[1_1_100px] items-center">
          <Search
            size={18}
            strokeWidth={1.8}
            className="absolute left-0 text-slate-400"
          />

          <input
            type="text"
            value={searchValue}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder="Start Typing..."
            className="h-9 w-full min-w-0 border-0 bg-transparent pl-7 pr-1 text-[12px] font-normal text-slate-700 outline-none placeholder:text-slate-300"
          />
        </div>

        {/* Add Filter */}
        <button
          type="button"
          onClick={onAddFilter}
          className="flex h-9 shrink-0 items-center gap-1 whitespace-nowrap text-[12px] font-medium text-slate-600 transition hover:text-slate-800"
        >
          <Plus size={18} strokeWidth={1.8} />
          Add Filter
        </button>

        {/* Query */}
        <LeaveQueryFilter value={searchValue} onChange={(value) => onSearchChange?.(value)} />

        {/* Branch */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setBranchMenuOpen((open) => !open)}
            aria-label="Branch"
            aria-expanded={branchMenuOpen}
            className={dropdownClass}
          >
            Branch
            <ChevronDown size={14} strokeWidth={1.8} />
          </button>
          {branchMenuOpen && (
            <div className="absolute left-0 top-full z-30 mt-1 min-w-[280px] rounded-md border border-[#ead2cc] bg-white p-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setBranch("Koundinyasa Technology Services Pvt. Ltd.");
                  setBranchMenuOpen(false);
                }}
                className={`block w-full rounded px-3 py-2 text-left text-[13px] font-medium hover:bg-[#fff1ed] hover:text-[#9a5547] ${branch ? "bg-[#fff1ed] text-[#9a5547]" : "text-slate-600"}`}
              >
                Koundinyasa Technology Services Pvt. Ltd.
              </button>
            </div>
          )}
        </div>

        {/* Salary Structure */}
        <button type="button" className={dropdownClass}>
          Salary Structure
          <ChevronDown size={14} strokeWidth={1.8} />
        </button>

        {/* Leave policy */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setLeaveMenuOpen((open) => !open)}
            aria-label="Leave policy"
            aria-expanded={leaveMenuOpen}
            className={dropdownClass}
          >
            Leave
            <ChevronDown size={14} strokeWidth={1.8} />
          </button>
          {leaveMenuOpen && (
            <div className="absolute left-0 top-full z-30 mt-1 max-h-[360px] min-w-[210px] overflow-y-auto rounded-md border border-[#ead2cc] bg-white p-1 shadow-lg">
              <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Leave</p>
              {[
                "Casual Leave",
                "Compensatory Off",
                "Loss of Pay",
                "Medical Wellness Leave",
                "Restricted Holiday",
                "Sick Leave",
              ].map((policy) => (
                <button
                  key={policy}
                  type="button"
                  onClick={() => {
                    setLeavePolicy(policy);
                    setLeaveMenuOpen(false);
                  }}
                  className={`block w-full rounded px-3 py-2 text-left text-[13px] font-medium hover:bg-[#fff1ed] hover:text-[#9a5547] ${leavePolicy === policy ? "bg-[#fff1ed] text-[#9a5547]" : "text-slate-600"}`}
                >
                  {policy}
                </button>
              ))}
              <div className="my-1 border-t border-slate-100" />
              <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Leave Policy</p>
              {["Employee Leave Policy", "Intern Leave Policy"].map((policy) => (
                <button
                  key={policy}
                  type="button"
                  onClick={() => {
                    setLeavePolicy(policy);
                    setLeaveMenuOpen(false);
                  }}
                  className={`block w-full rounded px-3 py-2 text-left text-[13px] font-medium hover:bg-[#fff1ed] hover:text-[#9a5547] ${leavePolicy === policy ? "bg-[#fff1ed] text-[#9a5547]" : "text-slate-600"}`}
                >
                  {policy}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Attendance */}
        <button type="button" className={dropdownClass}>
          Attendance
          <ChevronDown size={14} strokeWidth={1.8} />
        </button>

        {/* Designation */}
        <button type="button" className={dropdownClass}>
          Designation
          <ChevronDown size={14} strokeWidth={1.8} />
        </button>

        {/* Employment Status */}
        <button type="button" className={dropdownClass}>
          Emp Status
          <ChevronDown size={14} strokeWidth={1.8} />
        </button>
      </div>
      </div>
    </div>
  );
};

export default AdjustmentFilters;

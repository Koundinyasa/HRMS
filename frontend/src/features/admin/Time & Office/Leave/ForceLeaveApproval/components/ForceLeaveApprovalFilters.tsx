// import {
//   ChevronDown,
//   MoreVertical,
//   Plus,
//   Search,
//   X,
// } from "lucide-react";

// interface ForceLeaveApprovalFiltersProps {
//   searchValue?: string;
//   onSearchChange?: (value: string) => void;
//   onAddFilter?: () => void;
//   onClear?: () => void;
// }

// const ForceLeaveApprovalFilters = ({
//   searchValue = "",
//   onSearchChange,
//   onAddFilter,
//   onClear,
// }: ForceLeaveApprovalFiltersProps) => {
//   const filterClass =
//     "flex h-9 shrink-0 items-center gap-1 whitespace-nowrap text-[14px] font-medium text-slate-600";

//   return (
//     <div className="flex h-[52px] w-full min-w-0 items-center overflow-hidden rounded-lg border border-slate-200 bg-white px-4 font-[Urbanist] shadow-sm">
//       {/* Search */}
//       <div className="relative flex min-w-0 flex-1 items-center">
//         <Search
//           size={18}
//           strokeWidth={1.8}
//           className="absolute left-0 text-slate-400"
//         />

//         <input
//           type="text"
//           value={searchValue}
//           onChange={(event) => onSearchChange?.(event.target.value)}
//           placeholder="Start Typing..."
//           className="h-9 w-full min-w-0 border-0 bg-transparent pl-8 pr-3 text-[14px] text-slate-700 outline-none placeholder:text-slate-300"
//         />
//       </div>

//       {/* Add Filter */}
//       <button
//         type="button"
//         onClick={onAddFilter}
//         className="ml-5 flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[14px] font-medium text-slate-600"
//       >
//         <Plus size={18} strokeWidth={1.8} />
//         Add Filter
//       </button>

//       {/* Query */}
//       <button type="button" className={`ml-6 ${filterClass}`}>
//         Query
//         <ChevronDown size={14} />
//       </button>

//       {/* Branch */}
//       <button type="button" className={`ml-6 ${filterClass}`}>
//         Branch
//         <ChevronDown size={14} />
//       </button>

//       {/* Salary Structure */}
//       <button type="button" className={`ml-6 ${filterClass}`}>
//         Salary Structure
//         <ChevronDown size={14} />
//       </button>

//       {/* Leave */}
//       <button type="button" className={`ml-6 ${filterClass}`}>
//         Leave
//         <ChevronDown size={14} />
//       </button>

//       {/* Attendance */}
//       <button type="button" className={`ml-6 ${filterClass}`}>
//         Attendance
//         <ChevronDown size={14} />
//       </button>

//       {/* Designation */}
//       <button type="button" className={`ml-6 ${filterClass}`}>
//         Designation
//         <ChevronDown size={14} />
//       </button>

//       {/* Emp Status */}
//       <button type="button" className={`ml-6 ${filterClass}`}>
//         Emp Status
//         <ChevronDown size={14} />
//       </button>

//       {/* More */}
//       <button
//         type="button"
//         aria-label="More"
//         className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center text-[#929DBB]"
//       >
//         <MoreVertical size={19} strokeWidth={1.8} />
//       </button>

//       {/* Clear */}
//       <button
//         type="button"
//         onClick={onClear}
//         aria-label="Clear"
//         className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center text-red-500"
//       >
//         <X size={19} strokeWidth={1.8} />
//       </button>
//     </div>
//   );
// };

// export default ForceLeaveApprovalFilters;

import {
  ChevronDown,
  MoreVertical,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";
import LeaveQueryFilter from "../../components/LeaveQueryFilter";

interface ForceLeaveApprovalFiltersProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onAddFilter?: () => void;
  onClear?: () => void;
}

const ForceLeaveApprovalFilters = ({
  searchValue = "",
  onSearchChange,
  onAddFilter,
  onClear,
}: ForceLeaveApprovalFiltersProps) => {
  const [query, setQuery] = useState("");
  const filterClass =
    "flex h-9 shrink-0 items-center gap-1 whitespace-nowrap text-[14px] font-medium text-slate-600";

  return (
    <div className="flex h-[52px] w-full min-w-0 items-center overflow-hidden rounded-lg border border-slate-200 bg-white px-4 font-[Urbanist] shadow-sm">
      <div className="relative flex min-w-0 flex-1 items-center">
        <Search
          size={18}
          strokeWidth={1.8}
          className="absolute left-0 text-slate-400"
        />

        <input
          type="text"
          value={searchValue}
          onChange={(event) =>
            onSearchChange?.(event.target.value)
          }
          placeholder="Start Typing..."
          className="h-9 w-full min-w-0 border-0 bg-transparent pl-8 pr-3 text-[14px] text-slate-700 outline-none placeholder:text-slate-300"
        />
      </div>

      <button
        type="button"
        onClick={onAddFilter}
        className="ml-5 flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[14px] font-medium text-slate-600"
      >
        <Plus size={18} strokeWidth={1.8} />
        Add Filter
      </button>

      <LeaveQueryFilter value={query} onChange={setQuery} />

      <button
        type="button"
        className={`ml-6 ${filterClass}`}
      >
        Branch
        <ChevronDown size={14} />
      </button>

      <button
        type="button"
        className={`ml-6 ${filterClass}`}
      >
        Salary Structure
        <ChevronDown size={14} />
      </button>

      <button
        type="button"
        className={`ml-6 ${filterClass}`}
      >
        Leave
        <ChevronDown size={14} />
      </button>

      <button
        type="button"
        className={`ml-6 ${filterClass}`}
      >
        Attendance
        <ChevronDown size={14} />
      </button>

      <button
        type="button"
        className={`ml-6 ${filterClass}`}
      >
        Designation
        <ChevronDown size={14} />
      </button>

      <button
        type="button"
        className={`ml-6 ${filterClass}`}
      >
        Emp Status
        <ChevronDown size={14} />
      </button>

      <button
        type="button"
        aria-label="More"
        className="ml-4 flex h-8 w-8 shrink-0 items-center justify-center text-[#929DBB]"
      >
        <MoreVertical size={19} strokeWidth={1.8} />
      </button>

      <button
        type="button"
        onClick={() => {
          onClear?.();
          setQuery("");
        }}
        aria-label="Clear"
        className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center text-red-500"
      >
        <X size={19} strokeWidth={1.8} />
      </button>
    </div>
  );
};

export default ForceLeaveApprovalFilters;

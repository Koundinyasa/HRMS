// import {
//   MoreVertical,
//   Plus,
//   Search,
//   X,
// } from "lucide-react";
 
// import FilterDropdown from "./FilterDropdown";
 
// import { useExitFilters } from "../hooks/useExitFilters";
 
// type FilterBarProps = {
//   filters: ReturnType<typeof useExitFilters>;
//   onOpenAuditLog: () => void;
// };
 
// export default function FilterBar({
//   filters,
//   onOpenAuditLog,
// }: FilterBarProps) {
//   const {
//     filters: values,
//     setSearch,
//     setValues,
//     clearAll,
//     activeCount,
//     options,
//   } = filters;
 
//   const hasAnyFilter =
//     activeCount > 0 ||
//     values.search.trim().length > 0;
 
//   return (
//     <div className="w-full overflow-hidden border-t border-gray-100 bg-white">
//       {/*
//         IMPORTANT:
//         This row is fixed in place — no horizontal scrolling, no drag,
//         no wheel movement, ever. "Add Filter" and "Clear" never shrink
//         or get clipped. To guarantee that, everything else can compress
//         under pressure: the Search box shrinks between 110–200px, and
//         each filter pill's label truncates with an ellipsis (see the
//         `truncate` on FilterDropdown's label span) before anything is
//         pushed off-screen. With normal desktop widths nothing actually
//         truncates — this only kicks in if the container is unusually
//         narrow.
//       */}
//       <div className="w-full min-w-0 overflow-x-auto overflow-y-hidden">
//          <div className="flex w-max min-w-max flex-nowrap items-center gap-2 px-1">
//           {/* SEARCH */}
//           <div
//             className="
//               flex
//               h-10
//               w-full
//               max-w-[200px]
//               min-w-[110px]
//               flex-1
//               items-center
//               gap-2
//               rounded-lg
//               border
//               border-gray-200
//               bg-white
//               px-2.5
//             "
//           >
//             <Search
//               size={16}
//               strokeWidth={2}
//               className="shrink-0 text-[#94A3B8]"
//             />
 
//             <input
//               type="text"
//               value={values.search}
//               onChange={(event) =>
//                 setSearch(event.target.value)
//               }
//               placeholder="Search..."
//               className="
//                 h-full
//                 w-full
//                 border-none
//                 bg-transparent
//                 text-sm
//                 text-gray-700
//                 outline-none
//                 placeholder:text-[#94A3B8]
//                 focus:ring-0
//               "
//             />
//           </div>
 
//           {/* ADD FILTER */}
//           <button
//             type="button"
//             className="
//               flex
//               h-10
//               shrink-0
//               items-center
//               gap-1
//               whitespace-nowrap
//               rounded-lg
//               bg-[#814A3C]
//               px-3
//               text-sm
//               font-medium
//               text-white
//               transition-colors
//               hover:bg-[#6d3f33]
//             "
//           >
//             <Plus size={16} strokeWidth={2} />
//             <span>Add Filter</span>
//           </button>
 
//           {/* QUERY */}
//           <div className="flex h-10 min-w-[56px] shrink items-center overflow-hidden rounded-lg border border-gray-200 bg-white px-2.5">
//             <FilterDropdown
//               label="Query"
//               options={options.query.data}
//               selected={values.query}
//               onChange={(next) =>
//                 setValues("query", next)
//               }
//               isLoading={options.query.isLoading}
//             />
//           </div>
 
//           {/* BRANCH */}
//           <div className="flex h-10 min-w-[56px] shrink items-center overflow-hidden rounded-lg border border-gray-200 bg-white px-2.5">
//             <FilterDropdown
//               label="Branch"
//               options={options.branch.data}
//               selected={values.branch}
//               onChange={(next) =>
//                 setValues("branch", next)
//               }
//               isLoading={options.branch.isLoading}
//             />
//           </div>
 
//           {/* SALARY STRUCTURE */}
//           <div className="flex h-10 min-w-[56px] shrink items-center overflow-hidden rounded-lg border border-gray-200 bg-white px-2.5">
//             <FilterDropdown
//               label="Salary Structure"
//               options={options.salaryStructure.data}
//               selected={values.salaryStructure}
//               onChange={(next) =>
//                 setValues("salaryStructure", next)
//               }
//               isLoading={options.salaryStructure.isLoading}
//             />
//           </div>
 
//           {/* LEAVE */}
//           <div className="flex h-10 min-w-[56px] shrink items-center overflow-hidden rounded-lg border border-gray-200 bg-white px-2.5">
//             <FilterDropdown
//               label="Leave"
//               options={options.leave.data}
//               selected={values.leave}
//               onChange={(next) =>
//                 setValues("leave", next)
//               }
//               isLoading={options.leave.isLoading}
//             />
//           </div>
 
//           {/* ATTENDANCE */}
//           <div className="flex h-10 min-w-[56px] shrink items-center overflow-hidden rounded-lg border border-gray-200 bg-white px-2.5">
//             <FilterDropdown
//               label="Attendance"
//               options={options.attendance.data}
//               selected={values.attendance}
//               onChange={(next) =>
//                 setValues("attendance", next)
//               }
//               isLoading={options.attendance.isLoading}
//             />
//           </div>
 
//           {/* DESIGNATION */}
//           <div className="flex h-10 min-w-[56px] shrink items-center overflow-hidden rounded-lg border border-gray-200 bg-white px-2.5">
//             <FilterDropdown
//               label="Designation"
//               options={options.designation.data}
//               selected={values.designation}
//               onChange={(next) =>
//                 setValues("designation", next)
//               }
//               isLoading={options.designation.isLoading}
//             />
//           </div>
 
//           {/* EMP STATUS */}
//           <div className="flex h-10 min-w-[56px] shrink items-center overflow-hidden rounded-lg border border-gray-200 bg-white px-2.5">
//             <FilterDropdown
//               label="Emp Status"
//               options={options.empStatus.data}
//               selected={values.empStatus}
//               onChange={(next) =>
//                 setValues("empStatus", next)
//               }
//               isLoading={options.empStatus.isLoading}
//             />
//           </div>
 
//           {/* Spacer pushes Clear (and the audit-log trigger) to the far right */}
//           <div className="flex-1" />
 
//           {/*
//             AUDIT LOG TRIGGER
//             Not shown as a visible icon in the reference design (only
//             "Clear" appears on the right), but the callback is kept wired
//             here so ReportViewShell's onOpenAuditLog / AuditLogModal still
//             works if you want to re-expose it — e.g. swap `hidden` for a
//             visible icon button, or trigger it from elsewhere.
//           */}
//           <button
//             type="button"
//             onClick={onOpenAuditLog}
//             title="Audit Log"
//             className="hidden"
//             aria-hidden="true"
//             tabIndex={-1}
//           >
//             <MoreVertical size={19} />
//           </button>
 
//           {/* CLEAR ALL */}
//           <button
//             type="button"
//             onClick={clearAll}
//             disabled={!hasAnyFilter}
//             title="Clear all filters"
//             className="
//               flex
//               h-10
//               shrink-0
//               items-center
//               gap-1
//               whitespace-nowrap
//               text-sm
//               font-medium
//               text-gray-400
//               transition-colors
//               hover:text-red-500
//               disabled:cursor-not-allowed
//               disabled:text-gray-300
//             "
//           >
//             <X size={16} />
//             <span>Clear</span>
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
 

import {
  MoreVertical,
  Plus,
  Search,
  X,
} from "lucide-react";

import FilterDropdown from "./FilterDropdown";

import { useExitFilters } from "../hooks/useExitFilters";

type FilterBarProps = {
  filters: ReturnType<typeof useExitFilters>;
  onOpenAuditLog: () => void;
};

export default function FilterBar({
  filters,
  onOpenAuditLog,
}: FilterBarProps) {
  const {
    filters: values,
    setSearch,
    setValues,
    clearAll,
    activeCount,
    options,
  } = filters;

  const hasAnyFilter =
    activeCount > 0 ||
    values.search.trim().length > 0;

  return (
    <div
      className="
        w-full
        min-w-0
        overflow-visible
        border-t
        border-gray-100
        bg-white
      "
    >
      {/* =====================================================
          FILTER ROW
          Desktop: fits in one row
          Mobile: horizontally scrollable
         ===================================================== */}
      <div
        className="
          w-full
          min-w-0
          overflow-x-auto
          overflow-y-visible
          scrollbar-thin
        "
      >
        <div
          className="
            flex
            w-max
            min-w-max
            flex-nowrap
            items-center
            gap-2
            px-2
            py-2
            sm:gap-2
            sm:px-3
          "
        >
          {/* =================================================
              SEARCH
             ================================================= */}
          <div
            className="
              relative
              flex
              h-[32px]
              w-[210px]
              shrink-0
              items-center
              gap-2
              rounded-[8px]
              border
              border-[#D9DDE5]
              bg-white
              px-2.5
              sm:w-[210px]
            "
          >
            <Search
              size={16}
              strokeWidth={2}
              className="shrink-0 text-[#94A3B8]"
            />

            <input
              type="text"
              value={values.search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search..."
              className="
                h-full
                min-w-0
                w-full
                border-none
                bg-transparent
                text-[12px]
                text-gray-700
                outline-none
                placeholder:text-[#94A3B8]
                focus:ring-0
              "
            />
          </div>

          {/* =================================================
              ADD FILTER
             ================================================= */}
          <button
            type="button"
            className="
              flex
              h-[32px]
              shrink-0
              items-center
              gap-1.5
              whitespace-nowrap
              rounded-[7px]
              bg-[#814A3C]
              px-3
              text-[12px]
              font-medium
              text-white
              transition-colors
              hover:bg-[#6d3f33]
            "
          >
            <Plus
              size={15}
              strokeWidth={2.5}
            />

            <span>Add Filter</span>
          </button>

          {/* =================================================
              QUERY
             ================================================= */}
          <div
            className="
              h-[32px]
              w-auto
              shrink-0
              overflow-visible
            "
          >
            <FilterDropdown
              label="Query"
              options={options.query.data}
              selected={values.query}
              onChange={(next) =>
                setValues("query", next)
              }
              isLoading={options.query.isLoading}
            />
          </div>

          {/* =================================================
              BRANCH
             ================================================= */}
          <div
            className="
              h-[32px]
              w-auto
              shrink-0
              overflow-visible
            "
          >
            <FilterDropdown
              label="Branch"
              options={options.branch.data}
              selected={values.branch}
              onChange={(next) =>
                setValues("branch", next)
              }
              isLoading={options.branch.isLoading}
            />
          </div>

          {/* =================================================
              SALARY STRUCTURE
             ================================================= */}
          <div
            className="
              h-[32px]
              w-auto
              shrink-0
              overflow-visible
            "
          >
            <FilterDropdown
              label="Salary Structure"
              options={options.salaryStructure.data}
              selected={values.salaryStructure}
              onChange={(next) =>
                setValues(
                  "salaryStructure",
                  next
                )
              }
              isLoading={
                options.salaryStructure.isLoading
              }
            />
          </div>

          {/* =================================================
              LEAVE
             ================================================= */}
          <div
            className="
              h-[32px]
              w-auto
              shrink-0
              overflow-visible
            "
          >
            <FilterDropdown
              label="Leave"
              options={options.leave.data}
              selected={values.leave}
              onChange={(next) =>
                setValues("leave", next)
              }
              isLoading={
                options.leave.isLoading
              }
            />
          </div>

          {/* =================================================
              ATTENDANCE
             ================================================= */}
          <div
            className="
              h-[32px]
              w-auto
              shrink-0
              overflow-visible
            "
          >
            <FilterDropdown
              label="Attendance"
              options={options.attendance.data}
              selected={values.attendance}
              onChange={(next) =>
                setValues(
                  "attendance",
                  next
                )
              }
              isLoading={
                options.attendance.isLoading
              }
            />
          </div>

          {/* =================================================
              DESIGNATION
             ================================================= */}
          <div
            className="
              h-[32px]
              w-auto
              shrink-0
              overflow-visible
            "
          >
            <FilterDropdown
              label="Designation"
              options={options.designation.data}
              selected={values.designation}
              onChange={(next) =>
                setValues(
                  "designation",
                  next
                )
              }
              isLoading={
                options.designation.isLoading
              }
            />
          </div>

          {/* =================================================
              EMP STATUS
             ================================================= */}
          <div
            className="
              h-[32px]
              w-auto
              shrink-0
              overflow-visible
            "
          >
            <FilterDropdown
              label="Emp Status"
              options={options.empStatus.data}
              selected={values.empStatus}
              onChange={(next) =>
                setValues(
                  "empStatus",
                  next
                )
              }
              isLoading={
                options.empStatus.isLoading
              }
            />
          </div>

          {/* =================================================
              SPACER
             ================================================= */}
          <div className="flex-1" />

          {/* =================================================
              AUDIT LOG TRIGGER
              Functionality preserved
             ================================================= */}
          <button
            type="button"
            onClick={onOpenAuditLog}
            title="Audit Log"
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
          >
            <MoreVertical size={19} />
          </button>

          {/* =================================================
              CLEAR ALL
             ================================================= */}
          <button
            type="button"
            onClick={clearAll}
            disabled={!hasAnyFilter}
            title="Clear all filters"
            className="
              flex
              h-[32px]
              shrink-0
              items-center
              gap-1
              whitespace-nowrap
              px-1
              text-[12px]
              font-medium
              text-gray-400
              transition-colors
              hover:text-red-500
              disabled:cursor-not-allowed
              disabled:text-gray-300
            "
          >
            <X
              size={15}
              strokeWidth={2}
            />

            <span>Clear</span>
          </button>
        </div>
      </div>
    </div>
  );
}
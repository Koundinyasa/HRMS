// import { useEffect, useRef, useState } from "react";
// import { NavLink } from "react-router-dom";
// import { Search, ChevronDown, Bookmark, Plus, MoreVertical, X, Filter, Clock } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Button } from "@/components/ui/button";
// import {
//   BULK_UPDATE_FILTER_FIELDS,
//   CLASSIFICATION_FIELD_OPTIONS,
// } from "../constants/bulkUpdate.constants";
// import type { ClassificationEmployeeRow, BulkUpdateFilters } from "../types/bulkUpdate.types";
// import BulkUpdatePagination from "./BulkUpdatePagination";
// import BulkUpdateEmptyState from "./BulkUpdateEmptyState";

// interface TabItem {
//   label: string;
//   path: string;
// }

// interface BulkUpdateClassificationTableProps {
//   basePath: string;
//   tabs: TabItem[];
//   employees: ClassificationEmployeeRow[];
//   filters: BulkUpdateFilters;
//   onFiltersChange: (filters: BulkUpdateFilters) => void;
//   selectedIds: string[];
//   onToggleId: (employeeId: string) => void;
//   onBulkSelectAll: (checked: boolean) => void;
//   month: string;
//   onMonthChange: (month: string) => void;
//   field: string;
//   onFieldChange: (value: string) => void;
//   onUpdateAll: () => void;
//   isUpdating?: boolean;
// }

// function useOutsideClick(onOutside: () => void) {
//   const ref = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, [onOutside]);
//   return ref;
// }

// function ChangeFieldDropdown({ value, onChange }: { value: string; onChange: (value: string) => void }) {
//   const [open, setOpen] = useState(false);
//   const ref = useOutsideClick(() => setOpen(false));

//   const selected = CLASSIFICATION_FIELD_OPTIONS.find((o) => o.value === value) ?? CLASSIFICATION_FIELD_OPTIONS[0];

//   return (
//     <div className="flex items-center gap-2 shrink-0">
//       <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">To Change -</span>
//       <div className="relative" ref={ref}>
//         <button
//           type="button"
//           onClick={() => setOpen((o) => !o)}
//           className="flex items-center gap-1 text-sm font-medium text-blue-600 whitespace-nowrap"
//         >
//           {selected?.label ?? "Classification"}
//           <ChevronDown size={14} />
//         </button>
//         {open && (
//           <div className="absolute z-20 right-0 mt-1 w-48 rounded-md border bg-popover shadow-lg overflow-hidden">
//             {CLASSIFICATION_FIELD_OPTIONS.map((opt) => (
//               <button
//                 key={opt.value}
//                 type="button"
//                 onClick={() => {
//                   onChange(opt.value);
//                   setOpen(false);
//                 }}
//                 className={`block w-full text-left px-3 py-2 text-sm hover:bg-muted ${
//                   opt.value === value ? "text-blue-600 font-medium" : "text-slate-700"
//                 }`}
//               >
//                 {opt.label}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function BulkUpdateClassificationTable({
//   basePath,
//   tabs,
//   employees,
//   filters,
//   onFiltersChange,
//   selectedIds,
//   onToggleId,
//   onBulkSelectAll,
//   month,
//   onMonthChange,
//   field,
//   onFieldChange,
//   onUpdateAll,
//   isUpdating,
// }: BulkUpdateClassificationTableProps) {
//   const [activeFilter, setActiveFilter] = useState<string | null>(null);
//   const [page, setPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   useEffect(() => {
//     setPage(1);
//   }, [employees.length, pageSize]);

//   const allSelected = employees.length > 0 && selectedIds.length === employees.length;
//   const totalCount = employees.length;
//   const pagedEmployees = employees.slice((page - 1) * pageSize, page * pageSize);

//   return (
//     <div className="flex flex-col gap-3">
//       {/* Tab strip + "To Change" controls, all on one row */}
//       <div className="flex items-center justify-between gap-4 border-b flex-wrap">
//         <div className="flex items-center gap-8 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//           {tabs.map((tab) => (
//             <NavLink
//               key={tab.path}
//               to={`${basePath}/${tab.path}`}
//               className={({ isActive }) =>
//                 `pb-3 pt-1 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
//                   isActive
//                     ? "border-blue-600 text-blue-600"
//                     : "border-transparent text-slate-500 hover:text-slate-700"
//                 }`
//               }
//             >
//               {tab.label}
//             </NavLink>
//           ))}
//         </div>

//         <div className="flex items-center gap-3 pb-2 flex-wrap">
//           <ChangeFieldDropdown value={field} onChange={onFieldChange} />

//           <input
//             type="month"
//             value={month}
//             onChange={(e) => onMonthChange(e.target.value)}
//             className="rounded-md border bg-background px-3 py-2 text-sm"
//           />

//           <Button
//             onClick={onUpdateAll}
//             disabled={selectedIds.length === 0 || isUpdating}
//             className="bg-blue-600 hover:bg-blue-700"
//           >
//             <Bookmark size={14} className="mr-1" />
//             Update All
//           </Button>

//           <div className="flex items-center gap-4 text-slate-400 pl-1">
//             <button type="button" className="hover:text-slate-600" aria-label="Filter">
//               <Filter size={16} />
//             </button>
//             <button type="button" className="hover:text-slate-600" aria-label="History">
//               <Clock size={16} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Filter bar — single line, scrolls horizontally instead of wrapping */}
//       <div className="flex items-center gap-4 flex-nowrap overflow-x-auto pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
//         <div className="relative shrink-0 w-56">
//           <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
//           <Input
//             className="pl-8 border-0 shadow-none focus-visible:ring-0"
//             placeholder="Start Typing..."
//             value={filters.search ?? ""}
//             onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
//           />
//         </div>

//         <button
//           type="button"
//           className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 whitespace-nowrap shrink-0"
//         >
//           <Plus size={14} />
//           Add Filter
//         </button>

//         {BULK_UPDATE_FILTER_FIELDS.map((filterField) => (
//           <button
//             key={filterField.value}
//             type="button"
//             onClick={() => setActiveFilter((prev) => (prev === filterField.value ? null : filterField.value))}
//             className={`flex items-center gap-1 text-sm whitespace-nowrap shrink-0 ${
//               activeFilter === filterField.value ? "text-blue-600 font-medium" : "text-slate-600 hover:text-slate-900"
//             }`}
//           >
//             {filterField.label}
//             <ChevronDown size={14} />
//           </button>
//         ))}

//         <div className="flex items-center gap-1 ml-auto shrink-0 text-muted-foreground">
//           <Button variant="ghost" size="icon" className="h-8 w-8">
//             <MoreVertical size={16} />
//           </Button>
//           <Button
//             variant="ghost"
//             size="icon"
//             className="h-8 w-8 text-destructive"
//             onClick={() => onFiltersChange({})}
//           >
//             <X size={16} />
//           </Button>
//         </div>
//       </div>

//       {/* Table / empty state */}
//       {employees.length === 0 ? (
//         <BulkUpdateEmptyState label="Classification" />
//       ) : (
//         <>
//           <div className="rounded-xl border overflow-hidden">
//             <table className="w-full text-sm">
//               <thead className="bg-[#EAF2FE]">
//                 <tr className="text-left">
//                   <th className="font-semibold px-4 py-3">Employee ID</th>
//                   <th className="font-semibold px-4 py-3">Employee Name</th>
//                   <th className="font-semibold px-4 py-3">DOS</th>
//                   <th className="font-semibold px-4 py-3">Classification</th>
//                   <th className="font-semibold px-4 py-3 text-right">
//                     <button
//                       type="button"
//                       className="underline underline-offset-2"
//                       onClick={() => onBulkSelectAll(!allSelected)}
//                     >
//                       Bulk Select
//                     </button>
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pagedEmployees.map((row, idx) => (
//                   <tr key={`${row.employeeId}-${idx}`} className="border-t hover:bg-slate-50">
//                     <td className="px-4 py-3">{row.employeeId}</td>
//                     <td className="px-4 py-3">{row.employeeName}</td>
//                     <td className="px-4 py-3">{row.dos}</td>
//                     <td className="px-4 py-3">{row.classification ?? ""}</td>
//                     <td className="px-4 py-3 flex justify-end">
//                       <Checkbox
//                         checked={selectedIds.includes(row.employeeId)}
//                         onCheckedChange={() => onToggleId(row.employeeId)}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <BulkUpdatePagination
//             page={page}
//             pageSize={pageSize}
//             totalCount={totalCount}
//             onPageChange={setPage}
//             onPageSizeChange={setPageSize}
//           />
//         </>
//       )}
//     </div>
//   );
// }/

import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Search, ChevronDown, Bookmark, Plus, MoreVertical, X, Filter, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  BULK_UPDATE_FILTER_FIELDS,
  CLASSIFICATION_FIELD_OPTIONS,
} from "../constants/bulkUpdate.constants";
import type { ClassificationEmployeeRow, BulkUpdateFilters } from "../types/bulkUpdate.types";
import BulkUpdatePagination from "./BulkUpdatePagination";
import BulkUpdateEmptyState from "./BulkUpdateEmptyState";

interface TabItem {
  label: string;
  path: string;
}

interface BulkUpdateClassificationTableProps {
  basePath: string;
  tabs: TabItem[];
  employees: ClassificationEmployeeRow[];
  filters: BulkUpdateFilters;
  onFiltersChange: (filters: BulkUpdateFilters) => void;
  selectedIds: string[];
  onToggleId: (employeeId: string) => void;
  onBulkSelectAll: (checked: boolean) => void;
  month: string;
  onMonthChange: (month: string) => void;
  field: string;
  onFieldChange: (value: string) => void;
  onUpdateAll: () => void;
  isUpdating?: boolean;
}

function useOutsideClick(onOutside: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onOutside]);
  return ref;
}

function ChangeFieldDropdown({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClick(() => setOpen(false));

  const selected = CLASSIFICATION_FIELD_OPTIONS.find((o) => o.value === value) ?? CLASSIFICATION_FIELD_OPTIONS[0];

  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-sm font-semibold text-slate-800 whitespace-nowrap">To Change -</span>
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 whitespace-nowrap"
        >
          {selected?.label ?? "Classification"}
          <ChevronDown size={14} />
        </button>
        {open && (
          <div className="absolute z-20 right-0 mt-1 w-48 rounded-md border bg-popover shadow-lg overflow-hidden">
            {CLASSIFICATION_FIELD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`block w-full text-left px-3 py-2 text-sm hover:bg-muted ${opt.value === value ? "text-blue-600 font-medium" : "text-slate-700"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BulkUpdateClassificationTable({
  basePath,
  tabs,
  employees,
  filters,
  onFiltersChange,
  selectedIds,
  onToggleId,
  onBulkSelectAll,
  month,
  onMonthChange,
  field,
  onFieldChange,
  onUpdateAll,
  isUpdating,
}: BulkUpdateClassificationTableProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setPage(1);
  }, [employees.length, pageSize]);

  const allSelected = employees.length > 0 && selectedIds.length === employees.length;
  const totalCount = employees.length;
  const pagedEmployees = employees.slice((page - 1) * pageSize, page * pageSize);

  return (
    // <div className="flex flex-col gap-3">
    //   {/* Tab strip + "To Change" controls, all on one row */}
    //   <div className="flex items-center justify-between gap-4 border-b flex-wrap">
    //     <div className="flex items-center gap-8 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex flex-col gap-3 px-2 sm:px-0">
          <div className="flex items-center justify-between gap-4 border-b flex-wrap">
     <div className="flex items-center gap-5 sm:gap-8 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">      
    {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={`${basePath}/${tab.path}`}
              className={({ isActive }) =>
                `pb-3 pt-1 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-700"
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3 pb-2 flex-wrap">
          <ChangeFieldDropdown value={field} onChange={onFieldChange} />

          <input
            type="month"
            value={month}
            onChange={(e) => onMonthChange(e.target.value)}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          />

          <Button
            onClick={onUpdateAll}
            disabled={selectedIds.length === 0 || isUpdating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Bookmark size={14} className="mr-1" />
            Update All
          </Button>

          <div className="flex items-center gap-4 text-slate-400 pl-1">
            <button type="button" className="hover:text-slate-600" aria-label="Filter">
              <Filter size={16} />
            </button>
            <button type="button" className="hover:text-slate-600" aria-label="History">
              <Clock size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter bar — single line, scrolls horizontally instead of wrapping */}
      {/* <div className="flex items-center gap-4 flex-nowrap overflow-x-auto pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="relative shrink-0 w-56"> */}
        <div className="flex items-center gap-3 sm:gap-4 flex-nowrap overflow-x-auto pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="relative shrink-0 w-44 sm:w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
          <Input
            className="pl-8 border-0 shadow-none focus-visible:ring-0"
            placeholder="Start Typing..."
            value={filters.search ?? ""}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          />
        </div>

        <button
          type="button"
          className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 whitespace-nowrap shrink-0"
        >
          <Plus size={14} />
          Add Filter
        </button>

        {BULK_UPDATE_FILTER_FIELDS.map((filterField) => (
          <button
            key={filterField.value}
            type="button"
            onClick={() => setActiveFilter((prev) => (prev === filterField.value ? null : filterField.value))}
            className={`flex items-center gap-1 text-sm whitespace-nowrap shrink-0 ${activeFilter === filterField.value ? "text-blue-600 font-medium" : "text-slate-600 hover:text-slate-900"
              }`}
          >
            {filterField.label}
            <ChevronDown size={14} />
          </button>
        ))}

        <div className="flex items-center gap-1 ml-auto shrink-0 text-muted-foreground">
          <Button variant="ghost" className="h-8 w-8">
            <MoreVertical size={16} />
          </Button>

          <Button
            variant="ghost"
            className="h-8 w-8 text-destructive"
            onClick={() => onFiltersChange({})}
          >
            <X size={16} />
          </Button>
        </div>
      </div>

      {/* Table / empty state */}
      {employees.length === 0 ? (
        <BulkUpdateEmptyState label="Classification" />
      ) : (
        <>
          {/* <div className="rounded-xl border overflow-hidden">
            <table className="w-full text-sm"> */}
            <div className="rounded-xl border overflow-x-auto">
              <table className="w-full min-w-[620px] text-sm">
              <thead className="bg-[#EAF2FE]">
                <tr className="text-left">
                  <th className="font-semibold px-4 py-3">Employee ID</th>
                  <th className="font-semibold px-4 py-3">Employee Name</th>
                  <th className="font-semibold px-4 py-3">DOS</th>
                  <th className="font-semibold px-4 py-3">Classification</th>
                  <th className="font-semibold px-4 py-3 text-right">
                    <button
                      type="button"
                      className="underline underline-offset-2"
                      onClick={() => onBulkSelectAll(!allSelected)}
                    >
                      Bulk Select
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {pagedEmployees.map((row, idx) => (
                  <tr key={`${row.employeeId}-${idx}`} className="border-t hover:bg-slate-50">
                    <td className="px-4 py-3">{row.employeeId}</td>
                    <td className="px-4 py-3">{row.employeeName}</td>
                    <td className="px-4 py-3">{row.dos}</td>
                    <td className="px-4 py-3">{row.classification ?? ""}</td>
                    <td className="px-4 py-3 flex justify-end">
                      <Checkbox
                        checked={selectedIds.includes(row.employeeId)}
                        onCheckedChange={() => onToggleId(row.employeeId)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <BulkUpdatePagination
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}
    </div>
  );
}
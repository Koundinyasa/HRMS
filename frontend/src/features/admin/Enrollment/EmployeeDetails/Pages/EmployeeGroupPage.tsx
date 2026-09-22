// import React, { useState, useRef, useEffect } from "react";
// import { Search, Save, Plus, X } from "lucide-react";

// /* Swap this for your own asset if you host one locally */
// const EMPTY_STATE_ILLUSTRATION =
//   "https://cdni.iconscout.com/illustration/premium/thumb/no-data-found-4470957-3728636.png";

// const fieldOptions = [
//   "Employee Name",
//   "Ref No",
//   "Branch",
//   "Salary Structure",
//   "Leave",
//   "Attendance",
//   "Designation",
//   "Cost Center",
//   "Department",
//   "Team",
//   "Banks",
//   "DOJ",
//   "Gender",
//   "Authority",
//   "State",
//   "Marital Status",
//   "Pan Status",
//   "Emp Status",
// ];

// interface FilterRow {
//   id: number;
//   field: string;
//   value: string;
// }

// let rowIdCounter = 1;

// /* ============================================================
//    FIELD SELECT — custom panel so it can be styled like the design
//    ============================================================ */

// interface FieldSelectProps {
//   value: string;
//   onChange: (next: string) => void;
//   onOpenChange: (open: boolean) => void;
// }

// const FieldSelect: React.FC<FieldSelectProps> = ({
//   value,
//   onChange,
//   onOpenChange,
// }) => {
//   const [open, setOpen] = useState(false);
//   const wrapRef = useRef<HTMLDivElement | null>(null);

//   const setOpenState = (next: boolean) => {
//     setOpen(next);
//     onOpenChange(next);
//   };

//   useEffect(() => {
//     if (!open) return;

//     const onDown = (e: MouseEvent) => {
//       if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
//         setOpenState(false);
//       }
//     };
//     const onEsc = (e: KeyboardEvent) => {
//       if (e.key === "Escape") setOpenState(false);
//     };

//     document.addEventListener("mousedown", onDown);
//     document.addEventListener("keydown", onEsc);
//     return () => {
//       document.removeEventListener("mousedown", onDown);
//       document.removeEventListener("keydown", onEsc);
//     };
//   }, [open]);

//   return (
//     <div ref={wrapRef} className="relative">
//       <button
//         type="button"
//         onClick={() => setOpenState(!open)}
//         className={`flex h-[32px] w-[168px] items-center justify-between rounded-[4px] border bg-white pl-3 pr-2.5 text-left text-[13px] transition-colors ${
//           open
//             ? "border-[#F0B429] text-[#3C4858] shadow-[0_0_0_2px_rgba(240,180,41,0.15)]"
//             : "border-[#DCE0E6] text-[#5A6472] hover:border-[#C3CAD4]"
//         }`}
//       >
//         <span className={value ? "text-[#3C4858]" : "text-[#5A6472]"}>
//           {value || "Select"}
//         </span>
//         <span className="text-[7px] leading-none text-[#98A2B3]">▼</span>
//       </button>

//       {open && (
//         <div className="group-select-panel absolute left-0 top-[calc(100%+4px)] z-50 max-h-[300px] w-[168px] overflow-y-auto rounded-[3px] border border-[#E4E7EC] bg-white py-1 shadow-[0_4px_16px_rgba(16,24,40,0.18)]">
//           <button
//             type="button"
//             onClick={() => {
//               onChange("");
//               setOpenState(false);
//             }}
//             className={`block w-full px-3 py-[5px] text-left text-[12.5px] text-[#3C4858] hover:bg-[#E8EEF7] ${
//               value === "" ? "bg-[#F0F1F3]" : ""
//             }`}
//           >
//             Select
//           </button>

//           {fieldOptions.map((opt) => (
//             <button
//               type="button"
//               key={opt}
//               onClick={() => {
//                 onChange(opt);
//                 setOpenState(false);
//               }}
//               className={`block w-full px-3 py-[5px] text-left text-[12.5px] text-[#3C4858] hover:bg-[#E8EEF7] ${
//                 value === opt ? "bg-[#F0F1F3]" : ""
//               }`}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// /* ============================================================
//    PAGE
//    ============================================================ */

// const EmployeeGroupPage: React.FC = () => {
//   const [rows, setRows] = useState<FilterRow[]>([
//     { id: rowIdCounter, field: "", value: "" },
//   ]);
//   const [activeRowId, setActiveRowId] = useState<number | null>(null);

//   const addRow = () => {
//     rowIdCounter += 1;
//     setRows((prev) => [...prev, { id: rowIdCounter, field: "", value: "" }]);
//   };

//   const removeRow = (id: number) => {
//     setRows((prev) => prev.filter((r) => r.id !== id));
//     if (activeRowId === id) setActiveRowId(null);
//   };

//   const updateRow = (id: number, patch: Partial<FilterRow>) => {
//     setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
//   };

//   const canSave = rows.some((r) => r.field && r.value.trim());

//   const handleSaveGroup = () => {
//     if (!canSave) return;
//     console.log("Saving group with rows:", rows);
//   };

//   return (
//     <div className="relative pb-16">
//       {/* Thin scrollbar for the dropdown panel */}
//       <style>{`
//         .group-select-panel::-webkit-scrollbar { width: 8px; }
//         .group-select-panel::-webkit-scrollbar-track { background: #F4F5F7; }
//         .group-select-panel::-webkit-scrollbar-thumb { background: #C9CFD8; border-radius: 4px; }
//         .group-select-panel::-webkit-scrollbar-thumb:hover { background: #AEB6C2; }
//       `}</style>

//       {/* ---------- FILTER TOOLBAR ---------- */}
//       <div className="mt-2 rounded-[10px] bg-white px-4 py-2.5 shadow-[0_1px_3px_rgba(16,24,40,0.08)]">
//         <div className="flex items-start justify-between gap-4">
//           <div className="flex flex-col gap-2">
//             {rows.map((row, i) => {
//               const active = activeRowId === row.id;
//               return (
//                 <div key={row.id} className="flex items-center gap-2">
//                   <FieldSelect
//                     value={row.field}
//                     onChange={(field) => updateRow(row.id, { field })}
//                     onOpenChange={(open) => setActiveRowId(open ? row.id : null)}
//                   />

//                   <div className="relative">
//                     <Search
//                       size={13}
//                       className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#98A2B3]"
//                     />
//                     <input
//                       type="text"
//                       value={row.value}
//                       onChange={(e) => updateRow(row.id, { value: e.target.value })}
//                       onFocus={() => setActiveRowId(row.id)}
//                       onBlur={() => setActiveRowId(null)}
//                       placeholder="start typing..."
//                       className={`h-[32px] w-[168px] rounded-[4px] border pl-[30px] pr-3 text-[13px] text-[#3C4858] placeholder:text-[#98A2B3] focus:outline-none ${
//                         active
//                           ? "border-[#F0B429] shadow-[0_0_0_2px_rgba(240,180,41,0.15)]"
//                           : "border-[#DCE0E6] hover:border-[#C3CAD4]"
//                       }`}
//                     />
//                   </div>

//                   {i === rows.length - 1 ? (
//                     <button
//                       type="button"
//                       onClick={addRow}
//                       title="Add filter row"
//                       className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded text-[#2D8CF0] transition-colors hover:bg-[#E8F2FE]"
//                     >
//                       <Plus size={17} strokeWidth={2.2} />
//                     </button>
//                   ) : (
//                     <button
//                       type="button"
//                       onClick={() => removeRow(row.id)}
//                       title="Remove filter row"
//                       className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded text-[#98A2B3] transition-colors hover:bg-[#FEF3F2] hover:text-[#F04438]"
//                     >
//                       <X size={16} strokeWidth={2.2} />
//                     </button>
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           <button
//             type="button"
//             onClick={handleSaveGroup}
//             disabled={!canSave}
//             className={`flex h-[32px] shrink-0 items-center gap-1.5 rounded-[4px] border px-3.5 text-[13px] font-medium transition-colors ${
//               canSave
//                 ? "border-[#DCE0E6] bg-white text-[#3C4858] hover:border-[#C3CAD4] hover:bg-[#F7F9FC]"
//                 : "cursor-not-allowed border-[#E4E7EC] bg-white text-[#A6AEBB]"
//             }`}
//           >
//             <Save size={14} />
//             Save Group
//           </button>
//         </div>
//       </div>

//       {/* ---------- EMPTY STATE ---------- */}
//       <div className="mt-2 flex flex-col items-center justify-center rounded-[10px] bg-white px-4 pb-20 pt-20 shadow-[0_1px_3px_rgba(16,24,40,0.08)]">
//         <img
//           src={EMPTY_STATE_ILLUSTRATION}
//           alt=""
//           className="mb-5 h-[210px] w-auto object-contain"
//         />
//         <p className="text-[14px] font-medium tracking-[0.01em] text-[#EF4444]">
//           No Data Found in - Employee group
//         </p>
//       </div>

//       {/* ---------- FLOATING CHAT ---------- */}
//       <div className="fixed bottom-5 right-6 z-40 flex flex-col items-center gap-1">
//         <button
//           type="button"
//           className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3B82F6] text-white shadow-[0_4px_12px_rgba(59,130,246,0.35)] transition-transform hover:scale-105 hover:bg-[#2563EB] active:scale-95"
//         >
//           <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
//             <path d="M12 2a2 2 0 012 2v1h1a3 3 0 013 3v2h1a2 2 0 012 2v6a2 2 0 01-2 2h-1v2a3 3 0 01-3 3H9a3 3 0 01-3-3v-2H5a2 2 0 01-2-2v-6a2 2 0 012-2h1V7a3 3 0 013-3h1V4a2 2 0 012-2zm0 6a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-4 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm8 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
//           </svg>
//         </button>
//         <span className="rounded bg-white px-2 py-0.5 text-[11px] font-medium text-[#5A6472] shadow-sm border border-[#EEF0F3]">
//           Let's Chat
//         </span>
//       </div>
//     </div>
//   );
// };

// export default EmployeeGroupPage;





// import React, { useState, useRef, useEffect } from "react";
// import { Search, Save, Plus, X } from "lucide-react";

// /* Swap this for your own asset if you host one locally */
// const EMPTY_STATE_ILLUSTRATION =
//   "https://cdni.iconscout.com/illustration/premium/thumb/no-data-found-4470957-3728636.png";

// const fieldOptions = [
//   "Employee Name",
//   "Ref No",
//   "Branch",
//   "Salary Structure",
//   "Leave",
//   "Attendance",
//   "Designation",
//   "Cost Center",
//   "Department",
//   "Team",
//   "Banks",
//   "DOJ",
//   "Gender",
//   "Authority",
//   "State",
//   "Marital Status",
//   "Pan Status",
//   "Emp Status",
// ];

// interface FilterRow {
//   id: number;
//   field: string;
//   value: string;
// }

// let rowIdCounter = 1;

// /* ============================================================
//    FIELD SELECT — custom panel so it can be styled like the design
//    ============================================================ */

// interface FieldSelectProps {
//   value: string;
//   onChange: (next: string) => void;
//   onOpenChange: (open: boolean) => void;
// }

// const FieldSelect: React.FC<FieldSelectProps> = ({
//   value,
//   onChange,
//   onOpenChange,
// }) => {
//   const [open, setOpen] = useState(false);
//   const wrapRef = useRef<HTMLDivElement | null>(null);

//   const setOpenState = (next: boolean) => {
//     setOpen(next);
//     onOpenChange(next);
//   };

//   useEffect(() => {
//     if (!open) return;

//     const onDown = (e: MouseEvent) => {
//       if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
//         setOpenState(false);
//       }
//     };
//     const onEsc = (e: KeyboardEvent) => {
//       if (e.key === "Escape") setOpenState(false);
//     };

//     document.addEventListener("mousedown", onDown);
//     document.addEventListener("keydown", onEsc);
//     return () => {
//       document.removeEventListener("mousedown", onDown);
//       document.removeEventListener("keydown", onEsc);
//     };
//   }, [open]);

//   return (
//     <div ref={wrapRef} className="relative">
//       <button
//         type="button"
//         onClick={() => setOpenState(!open)}
//         className={`flex h-[32px] w-[168px] items-center justify-between rounded-[4px] border bg-white pl-3 pr-2.5 text-left text-[13px] transition-colors ${
//           open
//             ? "border-[#F0B429] text-[#3C4858] shadow-[0_0_0_2px_rgba(240,180,41,0.15)]"
//             : "border-[#DCE0E6] text-[#5A6472] hover:border-[#C3CAD4]"
//         }`}
//       >
//         <span className={value ? "text-[#3C4858]" : "text-[#5A6472]"}>
//           {value || "Select"}
//         </span>
//         <span className="text-[7px] leading-none text-[#98A2B3]">▼</span>
//       </button>

//       {open && (
//         <div className="group-select-panel absolute left-0 top-[calc(100%+4px)] z-50 max-h-[300px] w-[168px] overflow-y-auto rounded-[3px] border border-[#E4E7EC] bg-white py-1 shadow-[0_4px_16px_rgba(16,24,40,0.18)]">
//           <button
//             type="button"
//             onClick={() => {
//               onChange("");
//               setOpenState(false);
//             }}
//             className={`block w-full px-3 py-[5px] text-left text-[12.5px] text-[#3C4858] hover:bg-[#E8EEF7] ${
//               value === "" ? "bg-[#F0F1F3]" : ""
//             }`}
//           >
//             Select
//           </button>

//           {fieldOptions.map((opt) => (
//             <button
//               type="button"
//               key={opt}
//               onClick={() => {
//                 onChange(opt);
//                 setOpenState(false);
//               }}
//               className={`block w-full px-3 py-[5px] text-left text-[12.5px] text-[#3C4858] hover:bg-[#E8EEF7] ${
//                 value === opt ? "bg-[#F0F1F3]" : ""
//               }`}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// /* ============================================================
//    PAGE
//    ============================================================ */

// const EmployeeGroupPage: React.FC = () => {
//   const [rows, setRows] = useState<FilterRow[]>([
//     { id: rowIdCounter, field: "", value: "" },
//   ]);
//   const [activeRowId, setActiveRowId] = useState<number | null>(null);

//   const addRow = () => {
//     rowIdCounter += 1;
//     setRows((prev) => [...prev, { id: rowIdCounter, field: "", value: "" }]);
//   };

//   const removeRow = (id: number) => {
//     setRows((prev) => prev.filter((r) => r.id !== id));
//     if (activeRowId === id) setActiveRowId(null);
//   };

//   const updateRow = (id: number, patch: Partial<FilterRow>) => {
//     setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
//   };

//   const canSave = rows.some((r) => r.field && r.value.trim());

//   const handleSaveGroup = () => {
//     if (!canSave) return;
//     console.log("Saving group with rows:", rows);
//   };

//   return (
//     <div className="relative pb-16">
//       {/* Thin scrollbar for the dropdown panel */}
//       <style>{`
//         .group-select-panel::-webkit-scrollbar { width: 8px; }
//         .group-select-panel::-webkit-scrollbar-track { background: #F4F5F7; }
//         .group-select-panel::-webkit-scrollbar-thumb { background: #C9CFD8; border-radius: 4px; }
//         .group-select-panel::-webkit-scrollbar-thumb:hover { background: #AEB6C2; }
//       `}</style>

//       {/* ---------- FILTER TOOLBAR ---------- */}
//       <div className="mt-2 rounded-[10px] bg-white px-4 py-2.5 shadow-[0_1px_3px_rgba(16,24,40,0.08)]">
//         <div className="flex items-start justify-between gap-4">
//           <div className="flex flex-col gap-2">
//             {rows.map((row, i) => {
//               const active = activeRowId === row.id;
//               return (
//                 <div key={row.id} className="flex items-center gap-2">
//                   <FieldSelect
//                     value={row.field}
//                     onChange={(field) => updateRow(row.id, { field })}
//                     onOpenChange={(open) => setActiveRowId(open ? row.id : null)}
//                   />

//                   <div className="relative">
//                     <Search
//                       size={13}
//                       className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#98A2B3]"
//                     />
//                     <input
//                       type="text"
//                       value={row.value}
//                       onChange={(e) => updateRow(row.id, { value: e.target.value })}
//                       onFocus={() => setActiveRowId(row.id)}
//                       onBlur={() => setActiveRowId(null)}
//                       placeholder="start typing..."
//                       className={`h-[32px] w-[168px] rounded-[4px] border pl-[30px] pr-3 text-[13px] text-[#3C4858] placeholder:text-[#98A2B3] focus:outline-none ${
//                         active
//                           ? "border-[#F0B429] shadow-[0_0_0_2px_rgba(240,180,41,0.15)]"
//                           : "border-[#DCE0E6] hover:border-[#C3CAD4]"
//                       }`}
//                     />
//                   </div>

//                   {i === rows.length - 1 ? (
//                     <button
//                       type="button"
//                       onClick={addRow}
//                       title="Add filter row"
//                       className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded text-[#F97316] transition-colors hover:bg-[#E8F2FE]"
//                     >
//                       <Plus size={17} strokeWidth={2.2} />
//                     </button>
//                   ) : (
//                     <button
//                       type="button"
//                       onClick={() => removeRow(row.id)}
//                       title="Remove filter row"
//                       className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded text-[#98A2B3] transition-colors hover:bg-[#FEF3F2] hover:text-[#F04438]"
//                     >
//                       <X size={16} strokeWidth={2.2} />
//                     </button>
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           <button
//             type="button"
//             onClick={handleSaveGroup}
//             disabled={!canSave}
//             className={`flex h-[32px] shrink-0 items-center gap-1.5 rounded-[4px] border px-3.5 text-[13px] font-medium transition-colors ${
//               canSave
//                 ? "border-[#DCE0E6] bg-white text-[#3C4858] hover:border-[#C3CAD4] hover:bg-[#F7F9FC]"
//                 : "cursor-not-allowed border-[#E4E7EC] bg-white text-[#A6AEBB]"
//             }`}
//           >
//             <Save size={14} />
//             Save Group
//           </button>
//         </div>
//       </div>

//       {/* ---------- EMPTY STATE ---------- */}
//       <div className="mt-2 flex flex-col items-center justify-center rounded-[10px] bg-white px-4 pb-20 pt-20 shadow-[0_1px_3px_rgba(16,24,40,0.08)]">
//         <img
//           src={EMPTY_STATE_ILLUSTRATION}
//           alt=""
//           className="mb-5 h-[210px] w-auto object-contain"
//         />
//         <p className="text-[14px] font-medium tracking-[0.01em] text-[#EF4444]">
//           No Data Found in - Employee group
//         </p>
//       </div>

//       {/* ---------- FLOATING CHAT ---------- */}
//       <div className="fixed bottom-5 right-6 z-40 flex flex-col items-center gap-1">
//         <button
//           type="button"
//           className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3B82F6] text-white shadow-[0_4px_12px_rgba(59,130,246,0.35)] transition-transform hover:scale-105 hover:bg-[#2563EB] active:scale-95"
//         >
//           <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
//             <path d="M12 2a2 2 0 012 2v1h1a3 3 0 013 3v2h1a2 2 0 012 2v6a2 2 0 01-2 2h-1v2a3 3 0 01-3 3H9a3 3 0 01-3-3v-2H5a2 2 0 01-2-2v-6a2 2 0 012-2h1V7a3 3 0 013-3h1V4a2 2 0 012-2zm0 6a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-4 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm8 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
//           </svg>
//         </button>
//         <span className="rounded bg-white px-2 py-0.5 text-[11px] font-medium text-[#5A6472] shadow-sm border border-[#EEF0F3]">
//           Let's Chat
//         </span>
//       </div>
//     </div>
//   );
// };

// export default EmployeeGroupPage;











// import React, { useState } from "react";
// import { Plus, Save, X } from "lucide-react";

// const NO_DATA_IMG = "/assets/images/no-data.png"; // your local image

// const COLUMN_OPTIONS = [
//   { key: "select", label: "Select", locked: true },
//   { key: "employeeName", label: "Employee Name", locked: true },
//   { key: "refNo", label: "Ref No", locked: true },
//   { key: "branch", label: "Branch", locked: true },
//   { key: "salaryStructure", label: "Salary Structure" },
//   { key: "leave", label: "Leave" },
//   { key: "attendance", label: "Attendance" },
//   { key: "designation", label: "Designation", locked: true },
//   { key: "costCenter", label: "Cost Center" },
//   { key: "department", label: "Department", locked: true },
//   { key: "team", label: "Team" },
//   { key: "banks", label: "Banks" },
//   { key: "doj", label: "DOJ" },
//   { key: "gender", label: "Gender" },
//   { key: "authority", label: "Authority" },
//   { key: "state", label: "State" },
//   { key: "maritalStatus", label: "Marital Status" },
//   { key: "panStatus", label: "Pan Status" },
//   { key: "empStatus", label: "Emp Status", locked: true },
// ] as const;

// type ColumnKey = (typeof COLUMN_OPTIONS)[number]["key"];

// export interface EmployeeGroupRow {
//   id: string | number;
//   employeeName: string;
//   refNo?: string;
//   branch?: string;
//   designation?: string;
//   department?: string;
//   empStatus?: string;
//   [key: string]: unknown;
// }

// interface Props {
//   groups?: EmployeeGroupRow[];   // from backend — empty = show no-data
//   isLoading?: boolean;
//   onSaveGroups?: (p: { includeAllNonSelected: boolean; columns: ColumnKey[] }) => void;
//   onInclude?: () => void;
// }

// const EmployeeGroupPage: React.FC<Props> = ({
//   groups = [],
//   isLoading = false,
//   onSaveGroups,
//   onInclude,
// }) => {
//   const [panelOpen, setPanelOpen] = useState(true);
//   const [includeAll, setIncludeAll] = useState(true);
//   const [cols, setCols] = useState<Set<ColumnKey>>(
//     () =>
//       new Set(
//         COLUMN_OPTIONS.filter(
//           (c) => c.locked || ["designation", "department", "empStatus"].includes(c.key)
//         ).map((c) => c.key)
//       )
//   );

//   const toggle = (key: ColumnKey, locked?: boolean) => {
//     if (locked) return;
//     setCols((prev) => {
//       const n = new Set(prev);
//       n.has(key) ? n.delete(key) : n.add(key);
//       return n;
//     });
//   };

//   const hasData = groups.length > 0;

//   return (
//     <div className="relative flex min-h-[calc(100vh-140px)] bg-[#F5F7FA]">
//       {/* MAIN */}
//       <div className="flex min-w-0 flex-1 flex-col p-3">
//         <div className="flex flex-1 flex-col overflow-hidden rounded-[12px] border border-[#E8ECF0] bg-white shadow-sm">
//           {isLoading ? (
//             <div className="flex flex-1 items-center justify-center py-24 text-[13px] text-[#98A2B3]">
//               Loading…
//             </div>
//           ) : hasData ? (
//             <div className="overflow-auto p-4">
//               <table className="w-full min-w-[720px] text-left text-[13px]">
//                 <thead>
//                   <tr className="border-b bg-[#FFF7ED] text-[#9A3412]">
//                     {COLUMN_OPTIONS.filter((c) => cols.has(c.key)).map((c) => (
//                       <th key={c.key} className="px-3 py-2.5 font-semibold">{c.label}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {groups.map((row) => (
//                     <tr key={row.id} className="border-b border-[#F0F2F5] hover:bg-[#FFFBF5]">
//                       {cols.has("select") && (
//                         <td className="px-3 py-2.5">
//                           <input type="checkbox" className="accent-[#F97316]" />
//                         </td>
//                       )}
//                       {cols.has("employeeName") && (
//                         <td className="px-3 py-2.5 font-medium">{row.employeeName}</td>
//                       )}
//                       {cols.has("refNo") && <td className="px-3 py-2.5">{String(row.refNo ?? "—")}</td>}
//                       {cols.has("branch") && <td className="px-3 py-2.5">{String(row.branch ?? "—")}</td>}
//                       {cols.has("designation") && (
//                         <td className="px-3 py-2.5">{String(row.designation ?? "—")}</td>
//                       )}
//                       {cols.has("department") && (
//                         <td className="px-3 py-2.5">{String(row.department ?? "—")}</td>
//                       )}
//                       {cols.has("empStatus") && (
//                         <td className="px-3 py-2.5">{String(row.empStatus ?? "—")}</td>
//                       )}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
//               <img
//                 src={NO_DATA_IMG}
//                 alt="No data"
//                 className="mb-4 h-[180px] w-auto max-w-[280px] object-contain"
//                 onError={(e) => {
//                   (e.target as HTMLImageElement).src = "/src/assets/images/no-data.png";
//                 }}
//               />
//               <p className="text-[14px] font-medium text-[#667085]">
//                 No data found in Employee Group
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* RIGHT PANEL */}
//       {panelOpen && (
//         <aside className="flex w-[280px] shrink-0 flex-col border-l border-[#E8ECF0] bg-white shadow-sm">
//           <div className="flex items-center justify-between border-b px-4 py-3">
//             <h3 className="text-[14px] font-semibold text-[#1D2939]">Employee Group</h3>
//             <button type="button" onClick={() => setPanelOpen(false)} className="rounded p-1 text-[#98A2B3] hover:bg-[#F2F4F7]">
//               <X size={16} />
//             </button>
//           </div>

//           <div className="flex items-center gap-2 border-b px-4 py-3">
//             <button
//               type="button"
//               role="switch"
//               aria-checked={includeAll}
//               onClick={() => setIncludeAll((v) => !v)}
//               className={`relative h-[20px] w-[36px] rounded-full transition-colors ${includeAll ? "bg-[#F97316]" : "bg-[#D0D5DD]"}`}
//             >
//               <span className={`absolute top-[2px] h-[16px] w-[16px] rounded-full bg-white shadow transition-transform ${includeAll ? "left-[18px]" : "left-[2px]"}`} />
//             </button>
//             <span className="text-[12px] text-[#475467]">Include all non-selected employee</span>
//           </div>

//           <div className="flex gap-2 border-b px-4 py-3">
//             <button
//               type="button"
//               onClick={() => onInclude?.()}
//               className="flex h-[32px] flex-1 items-center justify-center gap-1 rounded-[6px] border border-[#FDBA74] bg-[#FFF7ED] text-[12.5px] font-medium text-[#C2410C] hover:bg-[#FFEDD5]"
//             >
//               <Plus size={14} strokeWidth={2.5} /> Include
//             </button>
//             <button
//               type="button"
//               onClick={() => onSaveGroups?.({ includeAllNonSelected: includeAll, columns: Array.from(cols) })}
//               className="flex h-[32px] flex-1 items-center justify-center gap-1 rounded-[6px] bg-[#16A34A] text-[12.5px] font-medium text-white hover:bg-[#15803D]"
//             >
//               <Save size={14} /> Save Groups
//             </button>
//           </div>

//           <div className="flex-1 overflow-y-auto px-4 py-3">
//             <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#98A2B3]">Select Columns</p>
//             <ul className="space-y-1">
//               {COLUMN_OPTIONS.map((c) => (
//                 <li key={c.key}>
//                   <label className="flex cursor-pointer items-center gap-2.5 rounded-[6px] px-2 py-1.5 text-[13px] hover:bg-[#FFF7ED]">
//                     <input
//                       type="checkbox"
//                       checked={cols.has(c.key)}
//                       disabled={!!c.locked}
//                       onChange={() => toggle(c.key, c.locked)}
//                       className="h-[15px] w-[15px] accent-[#F97316]"
//                     />
//                     <span className={cols.has(c.key) ? "font-medium text-[#344054]" : "text-[#667085]"}>
//                       {c.label}
//                     </span>
//                   </label>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </aside>
//       )}
//     </div>
//   );
// };

// export default EmployeeGroupPage;
















import React, { useState } from "react";
import { Plus, Save, X } from "lucide-react";
import EnrollmentTabs from "../components/EnrollmentTabs";

/** Your local empty-state image */
const NO_DATA_IMG = "/assets/images/no-data.png";

const COLUMN_OPTIONS = [
  { key: "select", label: "Select", locked: true },
  { key: "employeeName", label: "Employee Name", locked: true },
  { key: "refNo", label: "Ref No", locked: true },
  { key: "branch", label: "Branch", locked: true },
  { key: "salaryStructure", label: "Salary Structure" },
  { key: "leave", label: "Leave" },
  { key: "attendance", label: "Attendance" },
  { key: "designation", label: "Designation", locked: true },
  { key: "costCenter", label: "Cost Center" },
  { key: "department", label: "Department", locked: true },
  { key: "team", label: "Team" },
  { key: "banks", label: "Banks" },
  { key: "doj", label: "DOJ" },
  { key: "gender", label: "Gender" },
  { key: "authority", label: "Authority" },
  { key: "state", label: "State" },
  { key: "maritalStatus", label: "Marital Status" },
  { key: "panStatus", label: "Pan Status" },
  { key: "empStatus", label: "Emp Status", locked: true },
] as const;

type ColumnKey = (typeof COLUMN_OPTIONS)[number]["key"];

export interface EmployeeGroupRow {
  id: string | number;
  employeeName: string;
  refNo?: string;
  branch?: string;
  designation?: string;
  department?: string;
  empStatus?: string;
  salaryStructure?: string;
  leave?: string;
  attendance?: string;
  costCenter?: string;
  team?: string;
  banks?: string;
  doj?: string;
  gender?: string;
  authority?: string;
  state?: string;
  maritalStatus?: string;
  panStatus?: string;
  [key: string]: unknown;
}

interface Props {
  /** From backend API — pass [] when empty */
  groups?: EmployeeGroupRow[];
  isLoading?: boolean;
  onSaveGroups?: (p: {
    includeAllNonSelected: boolean;
    columns: ColumnKey[];
  }) => void;
  onInclude?: () => void;
}

const EmployeeGroupPage: React.FC<Props> = ({
  groups = [],
  isLoading = false,
  onSaveGroups,
  onInclude,
}) => {
  const [panelOpen, setPanelOpen] = useState(true);
  const [includeAll, setIncludeAll] = useState(true);
  const [cols, setCols] = useState<Set<ColumnKey>>(
    () =>
      new Set(
        COLUMN_OPTIONS.filter(
          (c) =>
            c.locked ||
            ["designation", "department", "empStatus"].includes(c.key)
        ).map((c) => c.key)
      )
  );

  const toggle = (key: ColumnKey, locked?: boolean) => {
    if (locked) return;
    setCols((prev) => {
      const n = new Set(prev);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
  };

  const hasData = groups.length > 0;

  const visibleCols = COLUMN_OPTIONS.filter((c) => cols.has(c.key));

  const cellValue = (row: EmployeeGroupRow, key: ColumnKey): string => {
    if (key === "select") return "";
    const v = row[key];
    return v != null && v !== "" ? String(v) : "—";
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-[#EDEDED] text-[#131313]">
      {/* TOP TAB BAR (Figma) */}
      <div className="px-3 pt-2">
        <EnrollmentTabs />
      </div>

      <div className="relative flex gap-0 px-3 pb-3">
        {/* MAIN CONTENT */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex min-h-[520px] flex-1 flex-col overflow-hidden rounded-[8px] border border-[#E2E2E2] bg-white shadow-[0_1px_3px_rgba(19,19,19,0.07)]">
            {isLoading ? (
              <div className="flex flex-1 items-center justify-center text-[13px] text-[#626262]">
                Loading…
              </div>
            ) : hasData ? (
              /* DATA FROM BACKEND */
              <div className="overflow-auto p-4">
                <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-[#E2E2E2] bg-[#FFF5EE] text-[#131313]">
                      {visibleCols.map((col) => (
                        <th
                          key={col.key}
                          className="whitespace-nowrap px-3 py-2.5 font-semibold"
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b border-[#E2E2E2] text-[#626262] hover:bg-[#FFF5EE]"
                      >
                        {visibleCols.map((col) =>
                          col.key === "select" ? (
                            <td key={col.key} className="px-3 py-2.5">
                              <input
                                type="checkbox"
                                className="h-[15px] w-[15px] accent-[#F97316]"
                              />
                            </td>
                          ) : (
                            <td
                              key={col.key}
                              className={`px-3 py-2.5 ${
                                col.key === "employeeName" ? "font-medium" : ""
                              }`}
                            >
                              {cellValue(row, col.key)}
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* EMPTY — no-data image (Figma) */
              <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
                <img
                  src={NO_DATA_IMG}
                  alt="No data"
                  className="mb-4 h-[200px] w-auto max-w-[320px] object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/src/assets/images/no-data.png";
                  }}
                />
                <p className="text-[14px] font-medium text-[#626262]">
                  No data found in Employee Group
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL (Figma) */}
        {panelOpen && (
          <aside className="ml-0 flex w-[280px] shrink-0 flex-col rounded-r-[8px] border border-l-0 border-[#E2E2E2] bg-white shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E2E2E2] px-4 py-3">
              <h3 className="text-[14px] font-semibold text-[#131313]">
                Employee Group
              </h3>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="rounded p-1 text-[#626262] hover:bg-[#FFF5EE] hover:text-[#FF6200]"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Toggle */}
            <div className="flex items-center gap-2 border-b border-[#E2E2E2] px-4 py-3">
              <button
                type="button"
                role="switch"
                aria-checked={includeAll}
                onClick={() => setIncludeAll((v) => !v)}
                className={`relative h-[20px] w-[36px] shrink-0 rounded-full transition-colors ${
                    includeAll ? "bg-[#FF6200]" : "bg-[#BFBFBF]"
                }`}
              >
                <span
                  className={`absolute top-[2px] h-[16px] w-[16px] rounded-full bg-white shadow transition-transform ${
                    includeAll ? "left-[18px]" : "left-[2px]"
                  }`}
                />
              </button>
              <span className="text-[12px] text-[#626262]">
                Include all non-selected employee
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 border-b border-[#E2E2E2] px-4 py-3">
              <button
                type="button"
                onClick={() => onInclude?.()}
                className="flex h-[32px] flex-1 items-center justify-center gap-1 rounded-[6px] border border-[#FF6200] bg-[#FFF5EE] text-[12.5px] font-medium text-[#FF6200] transition-colors hover:bg-[#FFE5D6]"
              >
                <Plus size={14} strokeWidth={2.5} />
                Include
              </button>
              <button
                type="button"
                onClick={() =>
                  onSaveGroups?.({
                    includeAllNonSelected: includeAll,
                    columns: Array.from(cols),
                  })
                }
                className="flex h-[32px] flex-1 items-center justify-center gap-1 rounded-[6px] bg-[#FF6200] text-[12.5px] font-medium text-white shadow-[0_1px_2px_rgba(255,98,0,0.24)] transition-colors hover:bg-[#E55600]"
              >
                <Save size={14} />
                Save Groups
              </button>
            </div>

            {/* Column checkboxes */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#626262]">
                Select Columns
              </p>
              <ul className="space-y-0.5">
                {COLUMN_OPTIONS.map((c) => {
                  const checked = cols.has(c.key);
                  return (
                    <li key={c.key}>
                      <label className="flex cursor-pointer items-center gap-2.5 rounded-[6px] px-2 py-1.5 text-[13px] transition-colors hover:bg-[#FFF5EE]">
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={!!c.locked}
                          onChange={() => toggle(c.key, c.locked)}
                          className="h-[15px] w-[15px] rounded border-[#D0D5DD] accent-[#F97316] disabled:cursor-not-allowed"
                        />
                        <span
                          className={
                            checked
                              ? "font-medium text-[#131313]"
                              : "text-[#626262]"
                          }
                        >
                          {c.label}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        )}

        {!panelOpen && (
          <button
            type="button"
            onClick={() => setPanelOpen(true)}
            className="fixed right-3 top-1/2 z-20 -translate-y-1/2 rounded-l-[8px] bg-[#FF6200] px-2 py-3 text-[11px] font-semibold text-white shadow-md"
          >
            Group
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeGroupPage; 
// import React, { useState, useMemo } from "react";
// import { Search, Ban, Clock, ChevronDown } from "lucide-react";

// import AuditLogModal, { type AuditLogEntry } from "./AuditLogModal";
// import EnrollmentToolbarPortal from "../components/EnrollmentToolbarPortal";

// export interface BlockedUserRow {
//   employeeId: string;
//   employeeName: string;
//   status: "Blocked" | "Active";
// }

// const sampleRows: BlockedUserRow[] = [
//   { employeeId: "294633", employeeName: "Sai Teja Resham", status: "Blocked" },
//   { employeeId: "1", employeeName: "RAJESH UBBAPALLY", status: "Active" },
//   { employeeId: "264631", employeeName: "Anusha Mavellapalli", status: "Active" },
//   { employeeId: "284512", employeeName: "Varalaxmi Gumudala", status: "Active" },
//   { employeeId: "284513", employeeName: "Nikhitha Narala", status: "Active" },
//   { employeeId: "284514", employeeName: "Sreya Chaluvadi", status: "Active" },
// ];

// const sampleAuditEntries: AuditLogEntry[] = [
//   {
//     id: "1",
//     recordDetails: "Unblocked user Rohith Kumar Karkonda",
//     recordChanges: "",
//     actionTime: "10/Apr/2026, 02:08 PM",
//     user: "Support",
//     employeeName: "Rohith Kumar Karkonda",
//   },
// ];

// const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

// /* Header + rows share this grid so the columns line up exactly */
// const GRID = "grid grid-cols-[minmax(160px,1.1fr)_minmax(220px,2fr)_minmax(160px,1.2fr)_90px]";

// const ResetBlockedUserPage: React.FC = () => {
//   const [rows] = useState<BlockedUserRow[]>(sampleRows);
//   const [selected, setSelected] = useState<Set<string>>(new Set());
//   const [query, setQuery] = useState("");
//   const [auditOpen, setAuditOpen] = useState(false);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [page, setPage] = useState(1);

//   const filtered = useMemo(
//     () =>
//       rows.filter((r) =>
//         `${r.employeeId} ${r.employeeName}`
//           .toLowerCase()
//           .includes(query.toLowerCase())
//       ),
//     [rows, query]
//   );

//   const totalCount = 87; // wire to your API total
//   const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage));

//   const toggleRow = (id: string) => {
//     setSelected((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) {
//         next.delete(id);
//       } else {
//         next.add(id);
//       }
//       return next;
//     });
//   };

//   const handleUnblock = () => {
//     console.log("Unblocking:", Array.from(selected));
//     setSelected(new Set());
//   };

//   const pageNumbers = useMemo(() => {
//     const nums: (number | string)[] = [];
//     for (let i = 1; i <= totalPages; i++) {
//       if (i <= 5 || i === totalPages || Math.abs(i - page) <= 1) {
//         nums.push(i);
//       } else if (nums[nums.length - 1] !== "…") {
//         nums.push("…");
//       }
//     }
//     return nums;
//   }, [totalPages, page]);

//   return (
//     <div className="relative">
//       {/* Search / Unblock / audit sit on the tab row */}
//       <EnrollmentToolbarPortal>
//         <div className="relative">
//           <Search
//             size={13}
//             className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9FB3CC]"
//           />
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search..."
//             className="h-[28px] w-[190px] rounded-[5px] border border-[#E4E7EC] bg-white pl-[28px] pr-3 text-[12.5px] text-[#33415C] placeholder:text-[#9FB3CC] focus:border-[#2D8CF0] focus:outline-none"
//           />
//         </div>

//         <button
//           type="button"
//           onClick={handleUnblock}
//           disabled={selected.size === 0}
//           className={`flex h-[28px] items-center gap-1.5 rounded-[5px] border px-3 text-[12.5px] font-medium transition-colors ${
//             selected.size === 0
//               ? "cursor-not-allowed border-[#E4E7EC] text-[#A6AEBB]"
//               : "border-[#DCE0E6] text-[#33415C] hover:bg-[#F5F8FC]"
//           }`}
//         >
//           <Ban size={13} />
//           Unblock
//         </button>

//         <button
//           type="button"
//           onClick={() => setAuditOpen(true)}
//           title="View audit log"
//           className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] text-[#9FB3CC] transition-colors hover:text-[#2D8CF0]"
//         >
//           <Clock size={16} strokeWidth={1.9} />
//         </button>
//       </EnrollmentToolbarPortal>

//       <div className="mt-2 overflow-hidden rounded-[10px] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.08)]">
//         {/* ---------- HEADER ---------- */}
//         <div
//           className={`${GRID} items-center border-b border-[#DDE9F8] bg-[#EAF2FD] py-2.5 text-[12.5px] font-semibold text-[#2B3A55]`}
//         >
//           <div className="px-6">Employee ID</div>
//           <div className="px-6">Employee Name</div>
//           <div className="px-6">Status</div>
//           <div className="px-6 text-right">Action</div>
//         </div>

//         {/* ---------- ROWS ---------- */}
//         {filtered.length === 0 ? (
//           <div className="px-6 py-16 text-center text-[13px] text-[#8494AB]">
//             No employees match that search.
//           </div>
//         ) : (
//           filtered.map((row) => (
//             <div
//               key={row.employeeId}
//               className={`${GRID} items-center border-b border-[#F1F3F6] py-[13px] text-[13px] text-[#33415C] transition-colors hover:bg-[#FAFBFD]`}
//             >
//               <div className="px-6">{row.employeeId}</div>

//               <div className="px-6">
//                 <button
//                   type="button"
//                   className="text-[#2D8CF0] hover:underline"
//                 >
//                   {row.employeeName}
//                 </button>
//               </div>

//               <div className="px-6">
//                 {row.status === "Blocked" && (
//                   <span className="inline-flex items-center gap-1 rounded-full bg-[#F4F5F7] px-2 py-[3px] text-[11px] font-medium text-[#5A6472]">
//                     <Ban size={11} className="text-[#F04438]" />
//                     Blocked
//                   </span>
//                 )}
//               </div>

//               <div className="flex justify-end px-6">
//                 <input
//                   type="checkbox"
//                   checked={selected.has(row.employeeId)}
//                   onChange={() => toggleRow(row.employeeId)}
//                   className="h-[14px] w-[14px] cursor-pointer rounded-[3px] accent-[#2D8CF0]"
//                 />
//               </div>
//             </div>
//           ))
//         )}

//         {/* ---------- PAGINATION ---------- */}
//         <div className="flex items-center justify-end gap-4 px-6 py-2.5 text-[12px] text-[#5B6B80]">
//           <div className="flex items-center gap-1.5">
//             <span>Rows per page:</span>
//             <div className="relative">
//               <select
//                 value={rowsPerPage}
//                 onChange={(e) => {
//                   setRowsPerPage(Number(e.target.value));
//                   setPage(1);
//                 }}
//                 className="h-[24px] cursor-pointer appearance-none border-none bg-transparent pl-1 pr-5 text-[12px] text-[#33415C] focus:outline-none"
//               >
//                 {ROWS_PER_PAGE_OPTIONS.map((n) => (
//                   <option key={n} value={n}>
//                     {n}
//                   </option>
//                 ))}
//               </select>
//               <ChevronDown
//                 size={12}
//                 className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#5B6B80]"
//               />
//             </div>
//           </div>

//           <span>
//             {(page - 1) * rowsPerPage + 1} to{" "}
//             {Math.min(page * rowsPerPage, totalCount)} of {totalCount}
//           </span>

//           <div className="flex items-center gap-1">
//             <button
//               type="button"
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page === 1}
//               className="px-1 text-[#8494AB] disabled:opacity-30"
//             >
//               ‹
//             </button>

//             {pageNumbers.map((n, i) =>
//               n === "…" ? (
//                 <span key={`e${i}`} className="px-1 text-[#C0CCDC]">
//                   …
//                 </span>
//               ) : (
//                 <button
//                   key={n}
//                   type="button"
//                   onClick={() => setPage(n as number)}
//                   className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-[12px] transition-colors ${
//                     n === page
//                       ? "bg-[#2D8CF0] font-semibold text-white"
//                       : "text-[#5B6B80] hover:bg-[#EEF3F9]"
//                   }`}
//                 >
//                   {n}
//                 </button>
//               )
//             )}

//             <button
//               type="button"
//               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//               disabled={page === totalPages}
//               className="px-1 text-[#8494AB] disabled:opacity-30"
//             >
//               ›
//             </button>
//           </div>
//         </div>
//       </div>

//       <AuditLogModal
//         open={auditOpen}
//         onClose={() => setAuditOpen(false)}
//         entries={sampleAuditEntries}
//         onExport={() => console.log("export audit log")}
//       />
//     </div>
//   );
// };

// export default ResetBlockedUserPage;












// import React, { useState, useMemo } from "react";
// import { Search, Ban, Clock, ChevronDown } from "lucide-react";

// import AuditLogModal, { type AuditLogEntry } from "./AuditLogModal";
// import EnrollmentToolbarPortal from "../components/EnrollmentToolbarPortal";

// export interface BlockedUserRow {
//   employeeId: string;
//   employeeName: string;
//   status: "Blocked" | "Active";
// }

// const sampleRows: BlockedUserRow[] = [
//   { employeeId: "294633", employeeName: "Sai Teja Resham", status: "Blocked" },
//   { employeeId: "1", employeeName: "RAJESH UBBAPALLY", status: "Active" },
//   { employeeId: "264631", employeeName: "Anusha Mavellapalli", status: "Active" },
//   { employeeId: "284512", employeeName: "Varalaxmi Gumudala", status: "Active" },
//   { employeeId: "284513", employeeName: "Nikhitha Narala", status: "Active" },
//   { employeeId: "284514", employeeName: "Sreya Chaluvadi", status: "Active" },
// ];

// const sampleAuditEntries: AuditLogEntry[] = [
//   {
//     id: "1",
//     recordDetails: "Unblocked user Rohith Kumar Karkonda",
//     recordChanges: "",
//     actionTime: "10/Apr/2026, 02:08 PM",
//     user: "Support",
//     employeeName: "Rohith Kumar Karkonda",
//   },
// ];

// const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

// /* Header + rows share this grid so the columns line up exactly */
// const GRID = "grid grid-cols-[minmax(160px,1.1fr)_minmax(220px,2fr)_minmax(160px,1.2fr)_90px]";

// const ResetBlockedUserPage: React.FC = () => {
//   const [rows] = useState<BlockedUserRow[]>(sampleRows);
//   const [selected, setSelected] = useState<Set<string>>(new Set());
//   const [query, setQuery] = useState("");
//   const [auditOpen, setAuditOpen] = useState(false);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [page, setPage] = useState(1);

//   const filtered = useMemo(
//     () =>
//       rows.filter((r) =>
//         `${r.employeeId} ${r.employeeName}`
//           .toLowerCase()
//           .includes(query.toLowerCase())
//       ),
//     [rows, query]
//   );

//   const totalCount = 87; // wire to your API total
//   const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage));

//   const toggleRow = (id: string) => {
//     setSelected((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) {
//         next.delete(id);
//       } else {
//         next.add(id);
//       }
//       return next;
//     });
//   };

//   const handleUnblock = () => {
//     console.log("Unblocking:", Array.from(selected));
//     setSelected(new Set());
//   };

//   const pageNumbers = useMemo(() => {
//     const nums: (number | string)[] = [];
//     for (let i = 1; i <= totalPages; i++) {
//       if (i <= 5 || i === totalPages || Math.abs(i - page) <= 1) {
//         nums.push(i);
//       } else if (nums[nums.length - 1] !== "…") {
//         nums.push("…");
//       }
//     }
//     return nums;
//   }, [totalPages, page]);

//   return (
//     <div className="relative">
//       {/* Search / Unblock / audit sit on the tab row */}
//       <EnrollmentToolbarPortal>
//         <div className="relative">
//           <Search
//             size={13}
//             className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9FB3CC]"
//           />
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search..."
//             className="h-[28px] w-[190px] rounded-[5px] border border-[#E4E7EC] bg-white pl-[28px] pr-3 text-[12.5px] text-[#33415C] placeholder:text-[#9FB3CC] focus:border-[#F97316] focus:outline-none"
//           />
//         </div>

//         <button
//           type="button"
//           onClick={handleUnblock}
//           disabled={selected.size === 0}
//           className={`flex h-[28px] items-center gap-1.5 rounded-[5px] border px-3 text-[12.5px] font-medium transition-colors ${
//             selected.size === 0
//               ? "cursor-not-allowed border-[#E4E7EC] text-[#A6AEBB]"
//               : "border-[#DCE0E6] text-[#33415C] hover:bg-[#F5F8FC]"
//           }`}
//         >
//           <Ban size={13} />
//           Unblock
//         </button>

//         <button
//           type="button"
//           onClick={() => setAuditOpen(true)}
//           title="View audit log"
//           className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] text-[#9FB3CC] transition-colors hover:text-[#F97316]"
//         >
//           <Clock size={16} strokeWidth={1.9} />
//         </button>
//       </EnrollmentToolbarPortal>

//       <div className="mt-2 overflow-hidden rounded-[10px] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.08)]">
//         {/* ---------- HEADER ---------- */}
//         <div
//           className={`${GRID} items-center border-b border-[#DDE9F8] bg-[#EAF2FD] py-2.5 text-[12.5px] font-semibold text-[#2B3A55]`}
//         >
//           <div className="px-6">Employee ID</div>
//           <div className="px-6">Employee Name</div>
//           <div className="px-6">Status</div>
//           <div className="px-6 text-right">Action</div>
//         </div>

//         {/* ---------- ROWS ---------- */}
//         {filtered.length === 0 ? (
//           <div className="px-6 py-16 text-center text-[13px] text-[#8494AB]">
//             No employees match that search.
//           </div>
//         ) : (
//           filtered.map((row) => (
//             <div
//               key={row.employeeId}
//               className={`${GRID} items-center border-b border-[#F1F3F6] py-[13px] text-[13px] text-[#33415C] transition-colors hover:bg-[#FAFBFD]`}
//             >
//               <div className="px-6">{row.employeeId}</div>

//               <div className="px-6">
//                 <button
//                   type="button"
//                   className="text-[#F97316] hover:underline"
//                 >
//                   {row.employeeName}
//                 </button>
//               </div>

//               <div className="px-6">
//                 {row.status === "Blocked" && (
//                   <span className="inline-flex items-center gap-1 rounded-full bg-[#F4F5F7] px-2 py-[3px] text-[11px] font-medium text-[#5A6472]">
//                     <Ban size={11} className="text-[#F04438]" />
//                     Blocked
//                   </span>
//                 )}
//               </div>

//               <div className="flex justify-end px-6">
//                 <input
//                   type="checkbox"
//                   checked={selected.has(row.employeeId)}
//                   onChange={() => toggleRow(row.employeeId)}
//                   className="h-[14px] w-[14px] cursor-pointer rounded-[3px] accent-[#F97316]"
//                 />
//               </div>
//             </div>
//           ))
//         )}

//         {/* ---------- PAGINATION ---------- */}
//         <div className="flex items-center justify-end gap-4 px-6 py-2.5 text-[12px] text-[#5B6B80]">
//           <div className="flex items-center gap-1.5">
//             <span>Rows per page:</span>
//             <div className="relative">
//               <select
//                 value={rowsPerPage}
//                 onChange={(e) => {
//                   setRowsPerPage(Number(e.target.value));
//                   setPage(1);
//                 }}
//                 className="h-[24px] cursor-pointer appearance-none border-none bg-transparent pl-1 pr-5 text-[12px] text-[#33415C] focus:outline-none"
//               >
//                 {ROWS_PER_PAGE_OPTIONS.map((n) => (
//                   <option key={n} value={n}>
//                     {n}
//                   </option>
//                 ))}
//               </select>
//               <ChevronDown
//                 size={12}
//                 className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#5B6B80]"
//               />
//             </div>
//           </div>

//           <span>
//             {(page - 1) * rowsPerPage + 1} to{" "}
//             {Math.min(page * rowsPerPage, totalCount)} of {totalCount}
//           </span>

//           <div className="flex items-center gap-1">
//             <button
//               type="button"
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//               disabled={page === 1}
//               className="px-1 text-[#8494AB] disabled:opacity-30"
//             >
//               ‹
//             </button>

//             {pageNumbers.map((n, i) =>
//               n === "…" ? (
//                 <span key={`e${i}`} className="px-1 text-[#C0CCDC]">
//                   …
//                 </span>
//               ) : (
//                 <button
//                   key={n}
//                   type="button"
//                   onClick={() => setPage(n as number)}
//                   className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-[12px] transition-colors ${
//                     n === page
//                       ? "bg-[#F97316] font-semibold text-white"
//                       : "text-[#5B6B80] hover:bg-[#EEF3F9]"
//                   }`}
//                 >
//                   {n}
//                 </button>
//               )
//             )}

//             <button
//               type="button"
//               onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//               disabled={page === totalPages}
//               className="px-1 text-[#8494AB] disabled:opacity-30"
//             >
//               ›
//             </button>
//           </div>
//         </div>
//       </div>

//       <AuditLogModal
//         open={auditOpen}
//         onClose={() => setAuditOpen(false)}
//         entries={sampleAuditEntries}
//         onExport={() => console.log("export audit log")}
//       />
//     </div>
//   );
// };

// export default ResetBlockedUserPage;












// import React, { useMemo, useState } from "react";
// import { Search, Ban, Clock } from "lucide-react";
// import AuditLogModal, { type AuditLogEntry } from "./AuditLogModal";
// import EnrollmentToolbarPortal from "../components/EnrollmentToolbarPortal";

// export interface BlockedUserRow {
//   employeeId: string;
//   employeeName: string;
//   status: "Blocked" | "Active" | string;
// }

// interface Props {
//   rows?: BlockedUserRow[];       // from API
//   totalCount?: number;           // from API
//   isLoading?: boolean;
//   auditEntries?: AuditLogEntry[]; // from API
//   onUnblock?: (ids: string[]) => void | Promise<void>;
//   onExportAudit?: () => void;
// }

// const GRID = "grid grid-cols-[minmax(160px,1.1fr)_minmax(220px,2fr)_minmax(160px,1.2fr)_90px]";

// const ResetBlockedUserPage: React.FC<Props> = ({
//   rows = [],
//   totalCount = 0,
//   isLoading = false,
//   auditEntries = [],
//   onUnblock,
//   onExportAudit,
// }) => {
//   const [selected, setSelected] = useState<Set<string>>(new Set());
//   const [query, setQuery] = useState("");
//   const [auditOpen, setAuditOpen] = useState(false);
//   const [page, setPage] = useState(1);
//   const rowsPerPage = 10;

//   const filtered = useMemo(
//     () =>
//       rows.filter((r) =>
//         `${r.employeeId} ${r.employeeName}`.toLowerCase().includes(query.toLowerCase())
//       ),
//     [rows, query]
//   );

//   const total = totalCount || filtered.length;
//   const totalPages = Math.max(1, Math.ceil(total / rowsPerPage));
//   const pageRows = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

//   const toggle = (id: string) => {
//     setSelected((prev) => {
//       const n = new Set(prev);
//       n.has(id) ? n.delete(id) : n.add(id);
//       return n;
//     });
//   };

//   const handleUnblock = async () => {
//     if (!selected.size) return;
//     await onUnblock?.(Array.from(selected));
//     setSelected(new Set());
//   };

//   return (
//     <div className="relative min-h-[calc(100vh-140px)] bg-[#F5F7FA] p-3">
//       <EnrollmentToolbarPortal>
//         <div className="flex items-center gap-2">
//           <button
//             type="button"
//             onClick={handleUnblock}
//             disabled={!selected.size}
//             className="flex h-[32px] items-center gap-1.5 rounded-[6px] border border-[#D0D5DD] bg-white px-3 text-[12.5px] font-medium text-[#344054] hover:bg-[#F9FAFB] disabled:opacity-40"
//           >
//             <Ban size={14} /> Unblock
//           </button>
//           <button
//             type="button"
//             onClick={() => setAuditOpen(true)}
//             className="flex h-[32px] items-center gap-1.5 rounded-[6px] border border-[#FDBA74] bg-[#FFF7ED] px-3 text-[12.5px] font-medium text-[#C2410C] hover:bg-[#FFEDD5]"
//           >
//             <Clock size={14} /> Audit Log
//           </button>
//         </div>
//       </EnrollmentToolbarPortal>

//       <div className="mb-3">
//         <div className="relative max-w-[280px]">
//           <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]" />
//           <input
//             value={query}
//             onChange={(e) => {
//               setQuery(e.target.value);
//               setPage(1);
//             }}
//             placeholder="Search..."
//             className="h-[36px] w-full rounded-[8px] border border-[#D0D5DD] bg-white pl-9 pr-3 text-[13px] outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
//           />
//         </div>
//       </div>

//       <div className="overflow-hidden rounded-[12px] border border-[#E8ECF0] bg-white shadow-sm">
//         <div className={`${GRID} border-b border-[#E8ECF0] bg-[#FFF7ED] px-4 py-2.5 text-[12px] font-semibold text-[#9A3412]`}>
//           <div>Employee ID</div>
//           <div>Employee Name</div>
//           <div>Status</div>
//           <div className="text-center">Action</div>
//         </div>

//         {isLoading ? (
//           <div className="py-16 text-center text-[13px] text-[#98A2B3]">Loading…</div>
//         ) : pageRows.length === 0 ? (
//           <div className="flex flex-col items-center py-16">
//             <img src="/assets/images/no-data.png" alt="" className="mb-3 h-[140px] object-contain" />
//             <p className="text-[13px] text-[#667085]">No blocked users found</p>
//           </div>
//         ) : (
//           pageRows.map((r) => (
//             <div key={r.employeeId} className={`${GRID} items-center border-b border-[#F0F2F5] px-4 py-3 text-[13px] text-[#344054] hover:bg-[#FFFBF5]`}>
//               <div>{r.employeeId}</div>
//               <div className="font-medium">{r.employeeName}</div>
//               <div>
//                 {r.status === "Blocked" ? (
//                   <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3F2] px-2 py-0.5 text-[11px] font-medium text-[#D92D20]">
//                     <span className="h-1.5 w-1.5 rounded-full bg-[#D92D20]" /> Blocked
//                   </span>
//                 ) : (
//                   <span className="text-[#98A2B3]">—</span>
//                 )}
//               </div>
//               <div className="flex justify-center">
//                 <input
//                   type="checkbox"
//                   checked={selected.has(r.employeeId)}
//                   onChange={() => toggle(r.employeeId)}
//                   className="h-4 w-4 accent-[#F97316]"
//                 />
//               </div>
//             </div>
//           ))
//         )}

//         <div className="flex items-center justify-between px-4 py-3 text-[12px] text-[#667085]">
//           <span>
//             Showing {(page - 1) * rowsPerPage + 1} to {Math.min(page * rowsPerPage, total)} of {total} entries
//           </span>
//           <div className="flex items-center gap-1">
//             <button type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="px-2 disabled:opacity-30">
//               Previous
//             </button>
//             <span className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#F97316] text-[12px] font-semibold text-white">
//               {page}
//             </span>
//             <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-2 disabled:opacity-30">
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       <AuditLogModal
//         open={auditOpen}
//         onClose={() => setAuditOpen(false)}
//         entries={auditEntries}
//         onExport={() => onExportAudit?.()}
//       />
//     </div>
//   );
// };

// export default ResetBlockedUserPage;








import React, { useEffect, useMemo, useState } from "react";
import { Search, Ban, History } from "lucide-react";

import EnrollmentTabs from "../components/EnrollmentTabs";
import AuditLogModal, { type AuditLogEntry } from "./AuditLogModal";
import {
  useGetBlockedUsersQuery,
  useUnblockUsersMutation,
  useGetBlockedUserAuditLogQuery,
  type BlockedUserDTO,
  type AuditLogEntryDTO,
} from "../api/employeedetailsApi";

export interface BlockedUserRow {
  employeeId: string;
  employeeName: string;
  status: string;
}

const ROWS_PER_PAGE = 6;

/* =========================================================
   DTO -> UI mapping (everything below comes from the backend)
========================================================= */

const mapRow = (d: BlockedUserDTO): BlockedUserRow => ({
  employeeId: String(d.EmployeeID),
  employeeName: d.EmployeeName,
  status: d.Status,
});

const mapAuditEntry = (d: AuditLogEntryDTO): AuditLogEntry => ({
  id: String(d.ID),
  recordDetails: d.RecordDetails,
  recordChanges: d.RecordChanges ?? "",
  actionTime: d.ActionTime,
  user: d.UserName,
  employeeName: d.EmployeeName,
});

/* =========================================================
   PAGE
========================================================= */

const ResetBlockedUserPage: React.FC = () => {
  const [queryInput, setQueryInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // debounce the search box before it hits the backend
  useEffect(() => {
    const t = setTimeout(() => setSearch(queryInput.trim()), 400);
    return () => clearTimeout(t);
  }, [queryInput]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const { data, isLoading, isFetching, isError, refetch } =
    useGetBlockedUsersQuery({
      search: search || undefined,
      page,
      pageSize: ROWS_PER_PAGE,
    });

  const rows = useMemo(() => (data?.data ?? []).map(mapRow), [data]);
  const total = data?.totalCount ?? rows.length;
  const totalPages = Math.max(1, Math.ceil(total / ROWS_PER_PAGE));

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [unblockUsers, { isLoading: isUnblocking }] = useUnblockUsersMutation();
  const [actionError, setActionError] = useState<string | null>(null);

  // clear stale selections whenever the page or search result set changes
  useEffect(() => {
    setSelected(new Set());
  }, [page, search]);

  /* ---------------- audit log ---------------- */

  const [auditOpen, setAuditOpen] = useState(false);

  const {
    data: auditData,
    isLoading: auditLoading,
    isFetching: auditFetching,
    isError: auditError,
    refetch: refetchAudit,
  } = useGetBlockedUserAuditLogQuery(undefined, { skip: !auditOpen });

  const auditEntries = useMemo(
    () => (auditData?.data ?? []).map(mapAuditEntry),
    [auditData]
  );

  /* ---------------- actions ---------------- */

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleUnblock = async () => {
    if (!selected.size) return;
    setActionError(null);
    try {
      await unblockUsers({ employeeIds: Array.from(selected) }).unwrap();
      setSelected(new Set());
    } catch (err) {
      console.error("Failed to unblock users", err);
      setActionError("Couldn't unblock the selected users. Try again.");
    }
  };

  const pageStart = total === 0 ? 0 : (page - 1) * ROWS_PER_PAGE + 1;
  const pageEnd = Math.min(page * ROWS_PER_PAGE, total);

  return (
    <div
      className="min-h-[calc(100vh-100px)] bg-[#EDEDED] text-[#131313]"
      style={{ fontFamily: "Urbanist, Geist Variable, sans-serif" }}
    >
      {/* ---------- TOP TAB BAR ---------- */}
      <div className="px-3 pt-2">
        <EnrollmentTabs />
      </div>

      <div className="px-3 pb-3">
        {/* ---------- TOOLBAR ---------- */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="relative w-[280px]">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
            />
            <input
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Search..."
              className="h-[36px] w-full rounded-[8px] border border-[#D0D5DD] bg-white pl-9 pr-3 text-[13px] text-[#344054] outline-none placeholder:text-[#98A2B3] focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleUnblock}
              disabled={!selected.size || isUnblocking}
              className="flex h-[34px] items-center gap-1.5 rounded-[8px] border border-[#D0D5DD] bg-white px-3.5 text-[12.5px] font-medium text-[#344054] transition-colors hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Ban size={14} />
              {isUnblocking ? "Unblocking…" : "Unblock"}
            </button>

            <button
              type="button"
              onClick={() => setAuditOpen(true)}
              className="flex h-[34px] items-center gap-1.5 rounded-[8px] border border-[#FF6200] bg-[#FFF5EE] px-3.5 text-[12.5px] font-medium text-[#FF6200] transition-colors hover:bg-[#FFE5D6]"
            >
              <History size={14} />
              Audit Log
            </button>
          </div>
        </div>

        {actionError && (
          <div className="mb-3 rounded-[8px] border border-[#FECDCA] bg-[#FEF3F2] px-4 py-2.5 text-[12.5px] text-[#D92D20]">
            {actionError}
          </div>
        )}

        {/* ---------- TABLE ---------- */}
        <div className="overflow-hidden rounded-[12px] border border-[#E8ECF0] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#E2E2E2] bg-[#FFF5EE] text-[12px] font-semibold text-[#131313]">
                  <th className="px-5 py-3">Employee ID</th>
                  <th className="px-5 py-3">Employee Name</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="w-[90px] px-5 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-16 text-center text-[13px] text-[#98A2B3]"
                    >
                      Loading blocked users…
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-16 text-center">
                      <p className="text-[13px] text-[#D92D20]">
                        Couldn't load blocked users.
                      </p>
                      <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-1 text-[12px] font-medium text-[#C2410C] underline"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-16 text-center text-[13px] text-[#667085]"
                    >
                      {search
                        ? `No employees match “${search}”.`
                        : "No blocked users right now."}
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => {
                    const blocked = r.status === "Blocked";
                    return (
                      <tr
                        key={r.employeeId}
                        className="border-b border-[#F0F2F5] text-[#344054] transition-colors last:border-b-0 hover:bg-[#FFFBF5]"
                      >
                        <td className="px-5 py-3">{r.employeeId}</td>
                        <td className="px-5 py-3 font-medium">
                          {r.employeeName}
                        </td>
                        <td className="px-5 py-3">
                          {blocked ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-[#FECDCA] bg-[#FEF3F2] px-2 py-0.5 text-[11px] font-medium text-[#D92D20]">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#D92D20]" />
                              Blocked
                            </span>
                          ) : (
                            <span className="text-[#98A2B3]">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={selected.has(r.employeeId)}
                            disabled={!blocked}
                            onChange={() => toggle(r.employeeId)}
                            aria-label={`Select ${r.employeeName}`}
                            className="h-4 w-4 cursor-pointer accent-[#F97316] disabled:cursor-not-allowed disabled:opacity-30"
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ---------- PAGINATION ---------- */}
          <div className="flex items-center justify-between border-t border-[#F0F2F5] px-5 py-3 text-[12px] text-[#667085]">
            <span>
              {total === 0
                ? "Showing 0 of 0 entries"
                : `Showing ${pageStart} to ${pageEnd} of ${total} entries`}
              {isFetching && !isLoading && "  •  refreshing…"}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-[6px] border border-[#E4E7EC] px-2.5 py-1 transition-colors hover:bg-[#F9FAFB] disabled:opacity-30 disabled:hover:bg-transparent"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (n) =>
                    n === 1 || n === totalPages || Math.abs(n - page) <= 1
                )
                .map((n, i, arr) => (
                  <React.Fragment key={n}>
                    {i > 0 && n - arr[i - 1] > 1 && (
                      <span className="px-1 text-[#C0CCDC]">…</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setPage(n)}
                      className={`flex h-[26px] min-w-[26px] items-center justify-center rounded-[6px] px-1.5 text-[12px] transition-colors ${
                        n === page
                          ? "bg-[#F97316] font-semibold text-white"
                          : "border border-[#E4E7EC] text-[#5B6B80] hover:bg-[#F9FAFB]"
                      }`}
                    >
                      {n}
                    </button>
                  </React.Fragment>
                ))}

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-[6px] border border-[#E4E7EC] px-2.5 py-1 transition-colors hover:bg-[#F9FAFB] disabled:opacity-30 disabled:hover:bg-transparent"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <AuditLogModal
        open={auditOpen}
        onClose={() => setAuditOpen(false)}
        entries={auditEntries}
        isLoading={auditLoading || auditFetching}
        isError={auditError}
        onRetry={() => refetchAudit()}
      />
    </div>
  );
};

export default ResetBlockedUserPage;
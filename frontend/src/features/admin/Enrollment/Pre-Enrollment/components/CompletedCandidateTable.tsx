// // import { useEffect, useMemo, useState } from "react";
// // import { Eye } from "lucide-react";
// // import type { CompletedCandidateRow } from "../types/completed-candidate.types";

// // interface CompletedCandidateTableProps {
// //   rows: CompletedCandidateRow[];
// //   searchTerm?: string;
// //   onView: (candidateId: number) => void;
// // }

// // export default function CompletedCandidateTable({
// //   rows,
// //   searchTerm = "",
// //   onView,
// // }: CompletedCandidateTableProps) {
// //   const [sortField, setSortField] =
// //     useState<keyof CompletedCandidateRow>("name");

// //   const [sortDirection, setSortDirection] =
// //     useState<"asc" | "desc">("asc");

// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [rowsPerPage, setRowsPerPage] = useState(10);

// //   // Search
// //   const filteredRows = useMemo(() => {
// //     const query = searchTerm.trim().toLowerCase();

// //     if (!query) {
// //       return rows;
// //     }

// //     return rows.filter((candidate) =>
// //       [
// //         candidate.name,
// //         candidate.email,
// //         candidate.mobile,
// //         candidate.joiningDate,
// //         candidate.designation,
// //         candidate.employeeId,
// //         candidate.reportingTo,
// //       ].some((value) =>
// //         value.toLowerCase().includes(query),
// //       ),
// //     );
// //   }, [rows, searchTerm]);

// //   // Sorting
// //   const sortedRows = useMemo(() => {
// //     return [...filteredRows].sort((a, b) => {
// //       const aValue = String(a[sortField] ?? "").toLowerCase();
// //       const bValue = String(b[sortField] ?? "").toLowerCase();

// //       if (aValue === bValue) {
// //         return 0;
// //       }

// //       const result = aValue > bValue ? 1 : -1;

// //       return sortDirection === "asc" ? result : -result;
// //     });
// //   }, [filteredRows, sortField, sortDirection]);

// //   const totalPages = Math.max(
// //     1,
// //     Math.ceil(sortedRows.length / rowsPerPage),
// //   );

// //   useEffect(() => {
// //     setCurrentPage((page) =>
// //       Math.min(page, totalPages),
// //     );
// //   }, [totalPages]);

// //   // Current page rows
// //   const pageRows = useMemo(() => {
// //     const start = (currentPage - 1) * rowsPerPage;
// //     const end = start + rowsPerPage;

// //     return sortedRows.slice(start, end);
// //   }, [sortedRows, currentPage, rowsPerPage]);

// //   // Sorting
// //   const handleSort = (
// //     accessor: keyof CompletedCandidateRow,
// //   ) => {
// //     if (sortField === accessor) {
// //       setSortDirection((direction) =>
// //         direction === "asc" ? "desc" : "asc",
// //       );
// //     } else {
// //       setSortField(accessor);
// //       setSortDirection("asc");
// //       setCurrentPage(1);
// //     }
// //   };

// //   // Rows per page
// //   const handleRowsPerPageChange = (
// //     event: React.ChangeEvent<HTMLSelectElement>,
// //   ) => {
// //     setRowsPerPage(Number(event.target.value));
// //     setCurrentPage(1);
// //   };

// //   const startItem =
// //     pageRows.length === 0
// //       ? 0
// //       : (currentPage - 1) * rowsPerPage + 1;

// //   const endItem = Math.min(
// //     currentPage * rowsPerPage,
// //     sortedRows.length,
// //   );

// //   // Get candidate initial
// //   const getInitial = (name: string) => {
// //     return name.trim().charAt(0).toUpperCase();
// //   };

// //   return (
// //     <div className="w-full min-w-0 overflow-hidden">
// //       <div className="w-full min-w-0 overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.12)]">

// //         {/* Table */}
// //         <div className="w-full overflow-x-auto">
// //           <table className="min-w-[900px] w-full border-collapse text-left">

// //             {/* Header */}
// //             <thead>
// //               <tr className="border-b border-slate-200 bg-slate-50">
// //                 <th
// //                   onClick={() => handleSort("name")}
// //                   className="w-[22%] cursor-pointer px-5 py-4 text-[12px] font-semibold uppercase text-slate-600"
// //                 >
// //                   Candidate Name
// //                 </th>

// //                 <th
// //                   onClick={() => handleSort("email")}
// //                   className="w-[24%] cursor-pointer px-5 py-4 text-[12px] font-semibold uppercase text-slate-600"
// //                 >
// //                   Email Id
// //                 </th>

// //                 <th
// //                   onClick={() => handleSort("mobile")}
// //                   className="w-[20%] cursor-pointer px-5 py-4 text-[12px] font-semibold uppercase text-slate-600"
// //                 >
// //                   Mobile No
// //                 </th>

// //                 <th
// //                   onClick={() => handleSort("joiningDate")}
// //                   className="w-[20%] cursor-pointer px-5 py-4 text-[12px] font-semibold uppercase text-slate-600"
// //                 >
// //                   Joining Date
// //                 </th>

// //                 <th className="w-[14%] px-5 py-4 text-center text-[12px] font-semibold uppercase text-slate-600">
// //                   Actions
// //                 </th>
// //               </tr>
// //             </thead>

// //             {/* Body */}
// //             <tbody>
// //               {pageRows.map((candidate) => (
// //                 <tr
// //                   key={candidate.id}
// //                   className="border-b border-slate-200 transition-colors hover:bg-slate-50"
// //                 >

// //                   {/* Candidate */}
// //                   <td className="px-5 py-4">
// //                     <div className="flex items-center gap-3">

// //                       {/* Initial */}
// //                       <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[12px] font-semibold text-orange-500">
// //                         {getInitial(candidate.name)}
// //                       </div>

// //                       <span className="truncate text-[13px] font-semibold text-slate-800">
// //                         {candidate.name}
// //                       </span>
// //                     </div>
// //                   </td>

// //                   {/* Email */}
// //                   <td className="px-5 py-4">
// //                     <span className="text-[13px] text-slate-500">
// //                       {candidate.email}
// //                     </span>
// //                   </td>

// //                   {/* Mobile */}
// //                   <td className="px-5 py-4">
// //                     <span className="text-[13px] text-slate-500">
// //                       {candidate.mobile}
// //                     </span>
// //                   </td>

// //                   {/* Joining Date */}
// //                   <td className="px-5 py-4">
// //                     <span className="text-[13px] text-slate-500">
// //                       {candidate.joiningDate}
// //                     </span>
// //                   </td>

// //                   {/* Action */}
// //                   <td className="px-5 py-4 text-center">
// //                     <button
// //                       type="button"
// //                       onClick={() => onView(candidate.id)}
// //                       className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-[12px] font-semibold text-emerald-600 transition hover:bg-emerald-100"
// //                     >
// //                       <Eye
// //                         size={14}
// //                         strokeWidth={2.5}
// //                       />

// //                       View
// //                     </button>
// //                   </td>
// //                 </tr>
// //               ))}

// //               {/* Empty */}
// //               {pageRows.length === 0 && (
// //                 <tr>
// //                   <td
// //                     colSpan={5}
// //                     className="px-5 py-10 text-center text-sm text-slate-500"
// //                   >
// //                     No candidates found.
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>

// //         {/* Footer */}
// //         <div className="flex min-h-[70px] w-full flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

// //           {/* Rows per page */}
// //           <div className="flex items-center gap-2 text-[12px] text-slate-600">
// //             <span className="whitespace-nowrap">
// //               Rows per page:
// //             </span>

// //             <select
// //               value={rowsPerPage}
// //               onChange={handleRowsPerPageChange}
// //               className="h-8 cursor-pointer rounded-md border border-slate-200 bg-white px-2 text-[12px] text-slate-700 outline-none focus:border-orange-400"
// //             >
// //               <option value={5}>5</option>
// //               <option value={10}>10</option>
// //               <option value={20}>20</option>
// //               <option value={50}>50</option>
// //             </select>
// //           </div>

// //           {/* Right side */}
// //           <div className="flex items-center gap-5">

// //             {/* Count */}
// //             <span className="whitespace-nowrap text-[12px] text-slate-500">
// //               {startItem}-{endItem} of {sortedRows.length} candidates
// //             </span>

// //             {/* Pagination */}
// //             <div className="flex items-center gap-2">

// //               {/* Previous */}
// //               <button
// //                 type="button"
// //                 disabled={currentPage === 1}
// //                 onClick={() =>
// //                   setCurrentPage((page) =>
// //                     Math.max(1, page - 1),
// //                   )
// //                 }
// //                 className="flex h-8 w-8 items-center justify-center text-sm text-slate-500 transition hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
// //               >
// //                 ‹
// //               </button>

// //               {/* Pages */}
// //               {Array.from(
// //                 { length: totalPages },
// //                 (_, index) => index + 1,
// //               )
// //                 .slice(0, 7)
// //                 .map((page) => (
// //                   <button
// //                     key={page}
// //                     type="button"
// //                     onClick={() => setCurrentPage(page)}
// //                     className={`flex h-8 w-8 items-center justify-center rounded-md text-[12px] font-medium transition ${
// //                       currentPage === page
// //                         ? "bg-orange-500 text-white"
// //                         : "text-slate-600 hover:bg-slate-100"
// //                     }`}
// //                   >
// //                     {page}
// //                   </button>
// //                 ))}

// //               {/* Next */}
// //               <button
// //                 type="button"
// //                 disabled={currentPage === totalPages}
// //                 onClick={() =>
// //                   setCurrentPage((page) =>
// //                     Math.min(totalPages, page + 1),
// //                   )
// //                 }
// //                 className="flex h-8 w-8 items-center justify-center text-sm text-slate-500 transition hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-30"
// //               >
// //                 ›
// //               </button>

// //             </div>
// //           </div>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // }


// import { useEffect, useMemo, useState } from "react";
// import { Eye } from "lucide-react";
// import type { CompletedCandidateRow } from "../types/completed-candidate.types";

// interface CompletedCandidateTableProps {
//   rows: CompletedCandidateRow[];
//   searchTerm?: string;
//   onView: (candidateId: number) => void;
// }

// export default function CompletedCandidateTable({
//   rows,
//   searchTerm = "",
//   onView,
// }: CompletedCandidateTableProps) {
//   const [sortField, setSortField] =
//     useState<keyof CompletedCandidateRow>("name");

//   const [sortDirection, setSortDirection] =
//     useState<"asc" | "desc">("asc");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(10);

//   // =========================================================
//   // SEARCH
//   // =========================================================

//   const filteredRows = useMemo(() => {
//     const query = searchTerm.trim().toLowerCase();

//     if (!query) {
//       return rows;
//     }

//     return rows.filter((candidate) =>
//       [
//         candidate.name,
//         candidate.email,
//         candidate.mobile,
//         candidate.joiningDate,
//         candidate.designation,
//         candidate.employeeId,
//         candidate.reportingTo,
//       ].some((value) =>
//         value.toLowerCase().includes(query),
//       ),
//     );
//   }, [rows, searchTerm]);

//   // =========================================================
//   // SORTING
//   // =========================================================

//   const sortedRows = useMemo(() => {
//     return [...filteredRows].sort((a, b) => {
//       const aValue = String(
//         a[sortField] ?? "",
//       ).toLowerCase();

//       const bValue = String(
//         b[sortField] ?? "",
//       ).toLowerCase();

//       if (aValue === bValue) {
//         return 0;
//       }

//       const result =
//         aValue > bValue ? 1 : -1;

//       return sortDirection === "asc"
//         ? result
//         : -result;
//     });
//   }, [
//     filteredRows,
//     sortField,
//     sortDirection,
//   ]);

//   // =========================================================
//   // PAGINATION
//   // =========================================================

//   const totalPages = Math.max(
//     1,
//     Math.ceil(
//       sortedRows.length / rowsPerPage,
//     ),
//   );

//   useEffect(() => {
//     setCurrentPage((page) =>
//       Math.min(page, totalPages),
//     );
//   }, [totalPages]);

//   const pageRows = useMemo(() => {
//     const start =
//       (currentPage - 1) *
//       rowsPerPage;

//     const end =
//       start + rowsPerPage;

//     return sortedRows.slice(
//       start,
//       end,
//     );
//   }, [
//     sortedRows,
//     currentPage,
//     rowsPerPage,
//   ]);

//   // =========================================================
//   // SORT HANDLER
//   // =========================================================

//   const handleSort = (
//     accessor: keyof CompletedCandidateRow,
//   ) => {
//     if (sortField === accessor) {
//       setSortDirection(
//         (direction) =>
//           direction === "asc"
//             ? "desc"
//             : "asc",
//       );
//     } else {
//       setSortField(accessor);
//       setSortDirection("asc");
//       setCurrentPage(1);
//     }
//   };

//   // =========================================================
//   // ROWS PER PAGE
//   // =========================================================

//   const handleRowsPerPageChange = (
//     event: React.ChangeEvent<HTMLSelectElement>,
//   ) => {
//     setRowsPerPage(
//       Number(event.target.value),
//     );

//     setCurrentPage(1);
//   };

//   // =========================================================
//   // PAGINATION COUNT
//   // =========================================================

//   const startItem =
//     pageRows.length === 0
//       ? 0
//       : (currentPage - 1) *
//           rowsPerPage +
//         1;

//   const endItem = Math.min(
//     currentPage * rowsPerPage,
//     sortedRows.length,
//   );

//   // =========================================================
//   // INITIAL
//   // =========================================================

//   const getInitial = (name: string) => {
//     return (
//       name
//         .trim()
//         .charAt(0)
//         .toUpperCase()
//     );
//   };

//   // =========================================================
//   // UI
//   // =========================================================

//   return (
//     <div
//       className="
//         w-full
//         min-w-0
//         overflow-hidden
//         rounded-[18px]
//         border
//         border-slate-200
//         bg-white
//         shadow-[0_8px_24px_rgba(15,23,42,0.16)]
//       "
//     >
//       {/* =====================================================
//           TABLE
//       ===================================================== */}

//       <div className="w-full overflow-x-auto">
//         <table
//           className="
//             min-w-[900px]
//             w-full
//             border-collapse
//             text-left
//           "
//         >
//           {/* =================================================
//               HEADER
//           ================================================= */}

//           <thead>
//             <tr
//               className="
//                 h-[47px]
//                 border-b
//                 border-slate-200
//                 bg-slate-50/80
//               "
//             >
//               <th
//                 onClick={() =>
//                   handleSort("name")
//                 }
//                 className="
//                   w-[22%]
//                   cursor-pointer
//                   px-5
//                   py-3
//                   text-[11px]
//                   font-semibold
//                   uppercase
//                   text-slate-700
//                   sm:px-6
//                 "
//               >
//                 Candidate Name
//               </th>

//               <th
//                 onClick={() =>
//                   handleSort("email")
//                 }
//                 className="
//                   w-[24%]
//                   cursor-pointer
//                   px-5
//                   py-3
//                   text-[11px]
//                   font-semibold
//                   uppercase
//                   text-slate-700
//                   sm:px-6
//                 "
//               >
//                 Email Id
//               </th>

//               <th
//                 onClick={() =>
//                   handleSort("mobile")
//                 }
//                 className="
//                   w-[20%]
//                   cursor-pointer
//                   px-5
//                   py-3
//                   text-[11px]
//                   font-semibold
//                   uppercase
//                   text-slate-700
//                   sm:px-6
//                 "
//               >
//                 Mobile No
//               </th>

//               <th
//                 onClick={() =>
//                   handleSort("joiningDate")
//                 }
//                 className="
//                   w-[20%]
//                   cursor-pointer
//                   px-5
//                   py-3
//                   text-[11px]
//                   font-semibold
//                   uppercase
//                   text-slate-700
//                   sm:px-6
//                 "
//               >
//                 Joining Date
//               </th>

//               <th
//                 className="
//                   w-[14%]
//                   px-5
//                   py-3
//                   text-center
//                   text-[11px]
//                   font-semibold
//                   uppercase
//                   text-slate-700
//                   sm:px-6
//                 "
//               >
//                 Actions
//               </th>
//             </tr>
//           </thead>

//           {/* =================================================
//               BODY
//           ================================================= */}

//           <tbody>
//             {pageRows.map((candidate) => (
//               <tr
//                 key={candidate.id}
//                 className="
//                   h-[63px]
//                   border-b
//                   border-slate-200
//                   bg-white
//                   transition-colors
//                   hover:bg-slate-50
//                 "
//               >
//                 {/* Candidate */}

//                 <td className="px-5 py-3 sm:px-6">
//                   <div className="flex items-center gap-3">
//                     <div
//                       className="
//                         flex
//                         h-8
//                         w-8
//                         shrink-0
//                         items-center
//                         justify-center
//                         rounded-full
//                         bg-orange-50
//                         text-[12px]
//                         font-semibold
//                         text-orange-500
//                       "
//                     >
//                       {getInitial(
//                         candidate.name,
//                       )}
//                     </div>

//                     <span
//                       className="
//                         truncate
//                         text-[13px]
//                         font-semibold
//                         text-slate-800
//                       "
//                     >
//                       {candidate.name}
//                     </span>
//                   </div>
//                 </td>

//                 {/* Email */}

//                 <td className="px-5 py-3 sm:px-6">
//                   <span
//                     className="
//                       truncate
//                       text-[13px]
//                       text-slate-500
//                     "
//                   >
//                     {candidate.email}
//                   </span>
//                 </td>

//                 {/* Mobile */}

//                 <td className="px-5 py-3 sm:px-6">
//                   <span
//                     className="
//                       whitespace-nowrap
//                       text-[13px]
//                       text-slate-500
//                     "
//                   >
//                     {candidate.mobile}
//                   </span>
//                 </td>

//                 {/* Joining Date */}

//                 <td className="px-5 py-3 sm:px-6">
//                   <span
//                     className="
//                       whitespace-nowrap
//                       text-[13px]
//                       text-slate-500
//                     "
//                   >
//                     {candidate.joiningDate}
//                   </span>
//                 </td>

//                 {/* Action */}

//                 <td className="px-5 py-3 text-center sm:px-6">
//                   <button
//                     type="button"
//                     onClick={() =>
//                       onView(candidate.id)
//                     }
//                     className="
//                       inline-flex
//                       h-8
//                       items-center
//                       gap-2
//                       rounded-full
//                       bg-emerald-50
//                       px-4
//                       text-[12px]
//                       font-semibold
//                       text-emerald-600
//                       transition
//                       hover:bg-emerald-100
//                     "
//                   >
//                     <Eye
//                       size={14}
//                       strokeWidth={2.5}
//                     />

//                     View
//                   </button>
//                 </td>
//               </tr>
//             ))}

//             {/* =================================================
//                 EMPTY STATE
//             ================================================= */}

//             {pageRows.length === 0 && (
//               <tr>
//                 <td
//                   colSpan={5}
//                   className="
//                     h-[160px]
//                     px-5
//                     text-center
//                     text-sm
//                     text-slate-500
//                   "
//                 >
//                   No candidates found.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* =====================================================
//           FOOTER
//       ===================================================== */}

//       <div
//         className="
//           flex
//           min-h-[77px]
//           w-full
//           flex-col
//           gap-3
//           border-t
//           border-slate-200
//           bg-white
//           px-5
//           py-4
//           sm:flex-row
//           sm:items-center
//           sm:justify-between
//           sm:px-6
//         "
//       >
//         {/* Rows per page */}

//         <div
//           className="
//             flex
//             items-center
//             gap-2
//             text-[12px]
//             text-slate-600
//           "
//         >
//           <span className="whitespace-nowrap">
//             Rows per page:
//           </span>

//           <select
//             value={rowsPerPage}
//             onChange={
//               handleRowsPerPageChange
//             }
//             className="
//               h-8
//               cursor-pointer
//               rounded-md
//               border
//               border-slate-200
//               bg-white
//               px-2
//               text-[12px]
//               font-medium
//               text-slate-700
//               outline-none
//               focus:border-orange-400
//             "
//           >
//             <option value={5}>5</option>
//             <option value={10}>10</option>
//             <option value={20}>20</option>
//             <option value={50}>50</option>
//           </select>
//         </div>

//         {/* Right side */}

//         <div
//           className="
//             flex
//             items-center
//             gap-5
//           "
//         >
//           {/* Count */}

//           <span
//             className="
//               whitespace-nowrap
//               text-[12px]
//               text-slate-500
//             "
//           >
//             {startItem}-{endItem} of{" "}
//             {sortedRows.length} candidates
//           </span>

//           {/* Pagination */}

//           <div
//             className="
//               flex
//               items-center
//               gap-2
//             "
//           >
//             {/* Previous */}

//             <button
//               type="button"
//               disabled={
//                 currentPage === 1
//               }
//               onClick={() =>
//                 setCurrentPage(
//                   (page) =>
//                     Math.max(
//                       1,
//                       page - 1,
//                     ),
//                 )
//               }
//               className="
//                 flex
//                 h-8
//                 w-8
//                 items-center
//                 justify-center
//                 text-sm
//                 text-slate-500
//                 transition
//                 hover:text-slate-800
//                 disabled:cursor-not-allowed
//                 disabled:opacity-30
//               "
//             >
//               ‹
//             </button>

//             {/* Pages */}

//             {Array.from(
//               {
//                 length: totalPages,
//               },
//               (_, index) =>
//                 index + 1,
//             )
//               .slice(0, 7)
//               .map((page) => (
//                 <button
//                   key={page}
//                   type="button"
//                   onClick={() =>
//                     setCurrentPage(page)
//                   }
//                   className={`
//                     flex
//                     h-8
//                     w-8
//                     items-center
//                     justify-center
//                     rounded-md
//                     text-[12px]
//                     font-medium
//                     transition
//                     ${
//                       currentPage ===
//                       page
//                         ? "bg-orange-500 text-white shadow-sm"
//                         : "text-slate-600 hover:bg-orange-50 hover:text-orange-500"
//                     }
//                   `}
//                 >
//                   {page}
//                 </button>
//               ))}

//             {/* Next */}

//             <button
//               type="button"
//               disabled={
//                 currentPage ===
//                 totalPages
//               }
//               onClick={() =>
//                 setCurrentPage(
//                   (page) =>
//                     Math.min(
//                       totalPages,
//                       page + 1,
//                     ),
//                 )
//               }
//               className="
//                 flex
//                 h-8
//                 w-8
//                 items-center
//                 justify-center
//                 text-sm
//                 text-slate-500
//                 transition
//                 hover:text-slate-800
//                 disabled:cursor-not-allowed
//                 disabled:opacity-30
//               "
//             >
//               ›
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { Eye } from "lucide-react";
import type { CompletedCandidateRow } from "../types/preEnrollment.types";

interface CompletedCandidateTableProps {
  rows: CompletedCandidateRow[];
  searchTerm?: string;
  onView: (candidateId: number) => void;
}

export default function CompletedCandidateTable({
  rows,
  searchTerm = "",
  onView,
}: CompletedCandidateTableProps) {
  const [sortField, setSortField] =
    useState<keyof CompletedCandidateRow>("name");

  const [sortDirection, setSortDirection] =
    useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredRows = useMemo(() => {
    const query = searchTerm
      .trim()
      .toLowerCase();

    if (!query) {
      return rows;
    }

    return rows.filter((candidate) =>
      [
        candidate.name,
        candidate.email,
        candidate.mobile,
        candidate.joiningDate,
        candidate.designation,
        candidate.employeeId,
        candidate.reportingTo,
      ].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [rows, searchTerm]);

  // =========================================================
  // SORTING
  // =========================================================

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      const aValue = String(
        a[sortField] ?? "",
      ).toLowerCase();

      const bValue = String(
        b[sortField] ?? "",
      ).toLowerCase();

      if (aValue === bValue) {
        return 0;
      }

      const result =
        aValue > bValue ? 1 : -1;

      return sortDirection === "asc"
        ? result
        : -result;
    });
  }, [
    filteredRows,
    sortField,
    sortDirection,
  ]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      sortedRows.length /
        rowsPerPage,
    ),
  );

  useEffect(() => {
    setCurrentPage((page) =>
      Math.min(page, totalPages),
    );
  }, [totalPages]);

  const pageRows = useMemo(() => {
    const start =
      (currentPage - 1) *
      rowsPerPage;

    const end =
      start + rowsPerPage;

    return sortedRows.slice(
      start,
      end,
    );
  }, [
    sortedRows,
    currentPage,
    rowsPerPage,
  ]);

  // =========================================================
  // SORT HANDLER
  // =========================================================

  const handleSort = (
    accessor: keyof CompletedCandidateRow,
  ) => {
    if (sortField === accessor) {
      setSortDirection(
        (direction) =>
          direction === "asc"
            ? "desc"
            : "asc",
      );
    } else {
      setSortField(accessor);
      setSortDirection("asc");
      setCurrentPage(1);
    }
  };

  // =========================================================
  // ROWS PER PAGE
  // =========================================================

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setRowsPerPage(
      Number(event.target.value),
    );

    setCurrentPage(1);
  };

  // =========================================================
  // PAGINATION COUNT
  // =========================================================

  const startItem =
    pageRows.length === 0
      ? 0
      : (currentPage - 1) *
          rowsPerPage +
        1;

  const endItem = Math.min(
    currentPage * rowsPerPage,
    sortedRows.length,
  );

  // =========================================================
  // INITIAL
  // =========================================================

  const getInitial = (
    name: string,
  ) => {
    return name
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  // =========================================================
  // PAGE NUMBERS
  // =========================================================

  const visiblePages = Array.from(
    {
      length: Math.min(
        totalPages,
        4,
      ),
    },
    (_, index) => index + 1,
  );

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      className="
        w-full
        min-w-0
        overflow-hidden
        rounded-[18px]
        border
        border-slate-200
        bg-white
        shadow-[0_8px_24px_rgba(15,23,42,0.16)]
      "
    >
      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="w-full overflow-x-auto">
        <table
          className="
            min-w-[900px]
            w-full
            border-collapse
            text-left
          "
        >
          {/* =================================================
              TABLE HEADER
          ================================================= */}

          <thead>
            <tr
              className="
                h-[47px]
                border-b
                border-slate-200
                bg-slate-50/80
              "
            >
              {/* Candidate Name */}

              <th
                onClick={() =>
                  handleSort("name")
                }
                className="
                  w-[22%]
                  cursor-pointer
                  px-5
                  py-3
                  text-[11px]
                  font-semibold
                  uppercase
                  text-slate-700
                  sm:px-6
                "
              >
                Candidate Name
              </th>

              {/* Email */}

              <th
                onClick={() =>
                  handleSort("email")
                }
                className="
                  w-[24%]
                  cursor-pointer
                  px-5
                  py-3
                  text-[11px]
                  font-semibold
                  uppercase
                  text-slate-700
                  sm:px-6
                "
              >
                Email Id
              </th>

              {/* Mobile */}

              <th
                onClick={() =>
                  handleSort("mobile")
                }
                className="
                  w-[20%]
                  cursor-pointer
                  px-5
                  py-3
                  text-[11px]
                  font-semibold
                  uppercase
                  text-slate-700
                  sm:px-6
                "
              >
                Mobile No
              </th>

              {/* Joining Date */}

              <th
                onClick={() =>
                  handleSort(
                    "joiningDate",
                  )
                }
                className="
                  w-[20%]
                  cursor-pointer
                  px-5
                  py-3
                  text-[11px]
                  font-semibold
                  uppercase
                  text-slate-700
                  sm:px-6
                "
              >
                Joining Date
              </th>

              {/* Actions */}

              <th
                className="
                  w-[14%]
                  px-5
                  py-3
                  text-center
                  text-[11px]
                  font-semibold
                  uppercase
                  text-slate-700
                  sm:px-6
                "
              >
                Actions
              </th>
            </tr>
          </thead>

          {/* =================================================
              TABLE BODY
          ================================================= */}

          <tbody>
            {pageRows.map(
              (candidate) => (
                <tr
                  key={candidate.id}
                  className="
                    h-[63px]
                    border-b
                    border-slate-200
                    bg-white
                    transition-colors
                    hover:bg-slate-50
                  "
                >
                  {/* =========================================
                      CANDIDATE NAME
                  ========================================= */}

                  <td
                    className="
                      px-5
                      py-3
                      sm:px-6
                    "
                  >
                    <div className="flex items-center gap-3">
                      {/* Initial */}

                      <div
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-orange-50
                          text-[12px]
                          font-semibold
                          text-orange-500
                        "
                      >
                        {getInitial(
                          candidate.name,
                        )}
                      </div>

                      {/* Name */}

                      <span
                        className="
                          truncate
                          text-[13px]
                          font-semibold
                          text-slate-800
                        "
                      >
                        {
                          candidate.name
                        }
                      </span>
                    </div>
                  </td>

                  {/* =========================================
                      EMAIL
                  ========================================= */}

                  <td
                    className="
                      px-5
                      py-3
                      sm:px-6
                    "
                  >
                    <span
                      className="
                        truncate
                        text-[13px]
                        text-slate-500
                      "
                    >
                      {
                        candidate.email
                      }
                    </span>
                  </td>

                  {/* =========================================
                      MOBILE
                  ========================================= */}

                  <td
                    className="
                      px-5
                      py-3
                      sm:px-6
                    "
                  >
                    <span
                      className="
                        whitespace-nowrap
                        text-[13px]
                        text-slate-500
                      "
                    >
                      {
                        candidate.mobile
                      }
                    </span>
                  </td>

                  {/* =========================================
                      JOINING DATE
                  ========================================= */}

                  <td
                    className="
                      px-5
                      py-3
                      sm:px-6
                    "
                  >
                    <span
                      className="
                        whitespace-nowrap
                        text-[13px]
                        text-slate-500
                      "
                    >
                      {
                        candidate.joiningDate
                      }
                    </span>
                  </td>

                  {/* =========================================
                      VIEW BUTTON
                  ========================================= */}

                  <td
                    className="
                      px-5
                      py-3
                      text-center
                      sm:px-6
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        onView(
                          candidate.id,
                        )
                      }
                      className="
                        inline-flex
                        h-8
                        items-center
                        gap-2
                        rounded-full
                        bg-emerald-50
                        px-4
                        text-[12px]
                        font-semibold
                        text-emerald-600
                        transition
                        hover:bg-emerald-100
                      "
                    >
                      <Eye
                        size={14}
                        strokeWidth={
                          2.5
                        }
                      />

                      View
                    </button>
                  </td>
                </tr>
              ),
            )}

            {/* ===============================================
                EMPTY STATE
            =============================================== */}

            {pageRows.length ===
              0 && (
              <tr>
                <td
                  colSpan={5}
                  className="
                    h-[160px]
                    px-5
                    text-center
                    text-sm
                    text-slate-500
                  "
                >
                  No candidates
                  found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <div
        className="
          flex
          min-h-[77px]
          w-full
          items-center
          justify-end
          border-t
          border-slate-200
          bg-white
          px-5
          sm:px-6
          sm:px-6
        "
      >
        {/* ===================================================
            LEFT SIDE
        =================================================== */}

        <div
          className="
            flex
            items-center
            gap-2
            text-[12px]
            text-slate-500
          "
        >
          <span className="whitespace-nowrap">
            Rows per page:
          </span>

          <select
            value={rowsPerPage}
            onChange={
              handleRowsPerPageChange
            }
            className="
              h-8
              cursor-pointer
              rounded-md
              border
              border-slate-200
              bg-white
              px-2
              text-[12px]
              font-medium
              text-slate-700
              outline-none
              focus:border-orange-400
            "
          >
            <option value={5}>
              5
            </option>

            <option value={10}>
              10
            </option>

            <option value={20}>
              20
            </option>

            <option value={50}>
              50
            </option>
          </select>
        </div>

        {/* ===================================================
            RIGHT SIDE
        =================================================== */}

        <div
          className="
            flex
            items-center
            gap-6
          "
        >
          {/* Candidate Count */}

          <span
            className="
              whitespace-nowrap
              text-[12px]
              font-normal
              text-slate-500
            "
          >
            {startItem}-
            {endItem} of{" "}
            {sortedRows.length}{" "}
            candidates
          </span>

          {/* Page Numbers */}

          <div
            className="
              flex
              items-center
              gap-5
            "
          >
            {visiblePages.map(
              (page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() =>
                    setCurrentPage(
                      page,
                    )
                  }
                  className={`
                    flex
                    h-8
                    min-w-8
                    items-center
                    justify-center
                    rounded-md
                    text-[12px]
                    font-medium
                    transition
                    ${
                      currentPage ===
                      page
                        ? "bg-orange-500 text-white shadow-sm"
                        : "bg-transparent text-slate-600 hover:bg-orange-50 hover:text-orange-500"
                    }
                  `}
                >
                  {page}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// // interface ForceLeaveApprovalRecord {
// //   id: number;
// //   approverName: string;
// //   employeeId: string;
// //   employeeName: string;
// //   leaveName: string;
// //   date: string;
// //   days: string;
// // }

// // interface ForceLeaveApprovalTableProps {
// //   rows: ForceLeaveApprovalRecord[];
// //   selectedIds?: number[];
// //   onSelectionChange?: (ids: number[]) => void;
// //   loading?: boolean;
// // }

// // const ForceLeaveApprovalTable = ({
// //   rows,
// //   selectedIds = [],
// //   onSelectionChange,
// //   loading = false,
// // }: ForceLeaveApprovalTableProps) => {
// //   const allSelected =
// //     rows.length > 0 &&
// //     rows.every((row) => selectedIds.includes(row.id));

// //   const handleSelectAll = () => {
// //     if (allSelected) {
// //       onSelectionChange?.([]);
// //     } else {
// //       onSelectionChange?.(rows.map((row) => row.id));
// //     }
// //   };

// //   const handleSelectRow = (id: number) => {
// //     if (selectedIds.includes(id)) {
// //       onSelectionChange?.(
// //         selectedIds.filter((selectedId) => selectedId !== id),
// //       );
// //     } else {
// //       onSelectionChange?.([...selectedIds, id]);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex min-h-[400px] items-center justify-center font-[Urbanist]">
// //         <span className="text-[14px] text-slate-400">
// //           Loading...
// //         </span>
// //       </div>
// //     );
// //   }

// //   if (!rows.length) {
// //     return null;
// //   }

// //   return (
// //     <div className="w-full overflow-hidden font-[Urbanist]">
// //       {/* Table Header */}
// //       <div className="grid grid-cols-[1.3fr_0.8fr_1.5fr_1.8fr_1fr_0.9fr_50px] items-center rounded-md bg-[#E7EBF3] px-4 py-3">
// //         <span className="text-[13px] font-semibold text-slate-700">
// //           Approver Name
// //         </span>

// //         <span className="text-[13px] font-semibold text-slate-700">
// //           Employee Id
// //         </span>

// //         <span className="text-[13px] font-semibold text-slate-700">
// //           Employee Name
// //         </span>

// //         <span className="text-[13px] font-semibold text-slate-700">
// //           Leave Name
// //         </span>

// //         <span className="text-[13px] font-semibold text-slate-700">
// //           Date
// //         </span>

// //         <span className="text-[13px] font-semibold text-slate-700">
// //           Days
// //         </span>

// //         <div className="flex justify-center">
// //           <input
// //             type="checkbox"
// //             checked={allSelected}
// //             onChange={handleSelectAll}
// //             className="h-[17px] w-[17px] accent-[#269BD7]"
// //             aria-label="Select all"
// //           />
// //         </div>
// //       </div>

// //       {/* Rows */}
// //       <div className="mt-2">
// //         {rows.map((row) => {
// //           const selected = selectedIds.includes(row.id);

// //           return (
// //             <div
// //               key={row.id}
// //               className={`grid grid-cols-[1.3fr_0.8fr_1.5fr_1.8fr_1fr_0.9fr_50px] items-center border-b border-slate-100 px-4 py-4 ${
// //                 selected ? "bg-[#F0F8FC]" : "bg-white"
// //               }`}
// //             >
// //               <span className="truncate pr-3 text-[13px] text-slate-700">
// //                 {row.approverName}
// //               </span>

// //               <span className="truncate pr-3 text-[13px] text-slate-700">
// //                 {row.employeeId}
// //               </span>

// //               <span className="truncate pr-3 text-[13px] text-slate-700">
// //                 {row.employeeName}
// //               </span>

// //               <span className="truncate pr-3 text-[13px] text-slate-700">
// //                 {row.leaveName}
// //               </span>

// //               <span className="truncate pr-3 text-[13px] text-slate-700">
// //                 {row.date}
// //               </span>

// //               <span className="truncate pr-3 text-[13px] text-slate-700">
// //                 {row.days}
// //               </span>

// //               <div className="flex justify-center">
// //                 <input
// //                   type="checkbox"
// //                   checked={selected}
// //                   onChange={() => handleSelectRow(row.id)}
// //                   className="h-[17px] w-[17px] accent-[#269BD7]"
// //                   aria-label={`Select ${row.employeeName}`}
// //                 />
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ForceLeaveApprovalTable;

// interface ForceLeaveApprovalRecord {
//   id: number;
//   approverName: string;
//   employeeId: string;
//   employeeName: string;
//   leaveName: string;
//   date: string;
//   days: string;
// }

// interface ForceLeaveApprovalTableProps {
//   rows: ForceLeaveApprovalRecord[];
//   selectedIds?: number[];
//   onSelectionChange?: (ids: number[]) => void;
//   loading?: boolean;
// }

// const ForceLeaveApprovalTable = ({
//   rows,
//   selectedIds = [],
//   onSelectionChange,
//   loading = false,
// }: ForceLeaveApprovalTableProps) => {
//   const allSelected =
//     rows.length > 0 &&
//     rows.every((row) =>
//       selectedIds.includes(row.id),
//     );

//   const handleSelectAll = () => {
//     if (allSelected) {
//       onSelectionChange?.([]);
//     } else {
//       onSelectionChange?.(
//         rows.map((row) => row.id),
//       );
//     }
//   };

//   const handleSelectRow = (id: number) => {
//     if (selectedIds.includes(id)) {
//       onSelectionChange?.(
//         selectedIds.filter(
//           (selectedId) => selectedId !== id,
//         ),
//       );
//     } else {
//       onSelectionChange?.([
//         ...selectedIds,
//         id,
//       ]);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex min-h-[300px] items-center justify-center font-[Urbanist]">
//         <span className="text-[14px] text-slate-400">
//           Loading...
//         </span>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full overflow-hidden font-[Urbanist]">

//       {/* =====================================================
//           TABLE HEADER
//           ===================================================== */}

//       <div className="grid grid-cols-[1.35fr_0.8fr_1.45fr_1.8fr_0.9fr_0.7fr_42px] items-center rounded-lg bg-[#CFE5F3] px-4 py-4">

//         <span className="truncate text-[15px] font-medium text-[#071B41]">
//           Approver Name
//         </span>

//         <span className="truncate text-[15px] font-medium text-[#071B41]">
//           Employee Id
//         </span>

//         <span className="truncate text-[15px] font-medium text-[#071B41]">
//           Employee Name
//         </span>

//         <span className="truncate text-[15px] font-medium text-[#071B41]">
//           Leave Name
//         </span>

//         <span className="truncate text-[15px] font-medium text-[#071B41]">
//           Date
//         </span>

//         <span className="truncate text-[15px] font-medium text-[#071B41]">
//           Days
//         </span>

//         <div className="flex items-center justify-center">
//           <input
//             type="checkbox"
//             checked={allSelected}
//             onChange={handleSelectAll}
//             disabled={rows.length === 0}
//             className="h-[19px] w-[19px] cursor-pointer rounded border border-[#8D9AB3] accent-[#269BD7] disabled:cursor-default"
//             aria-label="Select all"
//           />
//         </div>
//       </div>

//       {/* =====================================================
//           TABLE ROWS
//           ===================================================== */}

//       {rows.length > 0 && (
//         <div className="mt-2">

//           {rows.map((row) => {
//             const selected =
//               selectedIds.includes(row.id);

//             return (
//               <div
//                 key={row.id}
//                 className={`grid grid-cols-[1.35fr_0.8fr_1.45fr_1.8fr_0.9fr_0.7fr_42px] items-center border-b border-slate-100 px-4 py-4 ${
//                   selected
//                     ? "bg-[#F0F8FC]"
//                     : "bg-white"
//                 }`}
//               >

//                 <span className="truncate pr-3 text-[14px] font-medium text-[#269BD7]">
//                   {row.approverName}
//                 </span>

//                 <span className="truncate pr-3 text-[14px] text-[#27364F]">
//                   {row.employeeId}
//                 </span>

//                 <span className="truncate pr-3 text-[14px] text-[#27364F]">
//                   {row.employeeName}
//                 </span>

//                 <span className="truncate pr-3 text-[14px] text-[#27364F]">
//                   {row.leaveName}
//                 </span>

//                 <span className="truncate pr-3 text-[14px] text-[#27364F]">
//                   {row.date}
//                 </span>

//                 <span className="truncate pr-3 text-[14px] text-[#27364F]">
//                   {row.days}
//                 </span>

//                 <div className="flex items-center justify-center">
//                   <input
//                     type="checkbox"
//                     checked={selected}
//                     onChange={() =>
//                       handleSelectRow(row.id)
//                     }
//                     className="h-[19px] w-[19px] cursor-pointer rounded border border-[#8D9AB3] accent-[#269BD7]"
//                     aria-label={`Select ${row.employeeName}`}
//                   />
//                 </div>

//               </div>
//             );
//           })}

//         </div>
//       )}

//     </div>
//   );
// };

// export default ForceLeaveApprovalTable;

import type { LeaveApprovalRow } from "../api/forceleaveapprovalApi";

interface ForceLeaveApprovalTableProps {
  rows: LeaveApprovalRow[];
  selectedIds?: number[];
  onSelectionChange?: (ids: number[]) => void;
  loading?: boolean;
}

const ForceLeaveApprovalTable = ({
  rows,
  selectedIds = [],
  onSelectionChange,
  loading = false,
}: ForceLeaveApprovalTableProps) => {
  const allSelected =
    rows.length > 0 &&
    rows.every((row) => selectedIds.includes(row.id));

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange?.([]);
      return;
    }

    onSelectionChange?.(rows.map((row) => row.id));
  };

  const handleSelectRow = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange?.(
        selectedIds.filter((selectedId) => selectedId !== id),
      );
    } else {
      onSelectionChange?.([...selectedIds, id]);
    }
  };

  return (
    <div className="w-full overflow-x-auto font-[Urbanist] [scrollbar-color:#c58b7f_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#c58b7f]">
      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <span className="text-[14px] text-slate-400">
            Loading...
          </span>
        </div>
      ) : (
        <>
          {/* Table Header */}
          <div
            className="min-w-[760px]
              grid
              grid-cols-[1.3fr_0.8fr_1.5fr_1.8fr_1fr_0.9fr_50px]
              items-center
              rounded-md
              bg-[#fff1ed]
              px-4
              py-3
            "
          >
            <span className="text-[13px] font-semibold text-[#9a5547]">
              Approver Name
            </span>

            <span className="text-[13px] font-semibold text-[#9a5547]">
              Employee Id
            </span>

            <span className="text-[13px] font-semibold text-[#9a5547]">
              Employee Name
            </span>

            <span className="text-[13px] font-semibold text-[#9a5547]">
              Leave Name
            </span>

            <span className="text-[13px] font-semibold text-[#9a5547]">
              Date
            </span>

            <span className="text-[13px] font-semibold text-[#9a5547]">
              Days
            </span>

            {/* Select All */}
            <div className="flex justify-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                disabled={rows.length === 0}
                className="h-[19px] w-[19px] cursor-pointer appearance-auto rounded border-2 border-[#9a5547] bg-white opacity-100 accent-[#9a5547] disabled:cursor-not-allowed disabled:opacity-100"
                aria-label="Select all leave approvals"
              />
            </div>
          </div>

          {/* Table Rows */}
          {rows.length > 0 && (
            <div className="mt-2">
              {rows.map((row) => {
                const selected = selectedIds.includes(row.id);

                return (
                  <div
                    key={row.id}
                    className={`
                      grid min-w-[760px]
                      grid-cols-[1.3fr_0.8fr_1.5fr_1.8fr_1fr_0.9fr_50px]
                      items-center
                      border-b
                      border-slate-100
                      px-4
                      py-4
                      transition-colors
                      ${
                        selected
                          ? "bg-[#fff7f5]"
                          : "bg-white"
                      }
                    `}
                  >
                    {/* Approver Name */}
                    <span
                      className="
                        truncate
                        pr-3
                        text-[13px]
                        font-medium
                        text-[#9a5547]
                      "
                      title={row.approverName}
                    >
                      {row.approverName}
                    </span>

                    {/* Employee ID */}
                    <span
                      className="
                        truncate
                        pr-3
                        text-[13px]
                        text-[#9a5547]
                      "
                      title={row.employeeId}
                    >
                      {row.employeeId}
                    </span>

                    {/* Employee Name */}
                    <span
                      className="
                        truncate
                        pr-3
                        text-[13px]
                        text-[#9a5547]
                      "
                      title={row.employeeName}
                    >
                      {row.employeeName}
                    </span>

                    {/* Leave Name */}
                    <span
                      className="
                        truncate
                        pr-3
                        text-[13px]
                        text-slate-700
                      "
                      title={row.leaveName}
                    >
                      {row.leaveName}
                    </span>

                    {/* Date */}
                    <span
                      className="
                        truncate
                        pr-3
                        text-[13px]
                        text-slate-700
                      "
                      title={row.date}
                    >
                      {row.date}
                    </span>

                    {/* Days */}
                    <span
                      className="
                        truncate
                        pr-3
                        text-[13px]
                        text-slate-700
                      "
                      title={row.days}
                    >
                      {row.days}
                    </span>

                    {/* Row Checkbox */}
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleSelectRow(row.id)}
                        className="h-[17px] w-[17px] accent-[#269BD7]"
                        aria-label={`Select ${row.employeeName}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ForceLeaveApprovalTable;

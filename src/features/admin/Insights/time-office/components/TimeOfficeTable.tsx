// import { Button } from "@/components/ui/button";
// import noDataImage from "@/assets/images/no-data.png";
// import TimeOfficeEmptyState from "./TimeOfficeEmptyState";

// interface TimeOfficeTableProps {
//   columns: string[];
//   rows: Record<string, unknown>[];
//   loading?: boolean;
//   emptyMessage?: string;
//   onView?: (row: Record<string, unknown>) => void;
//   actionLabel?: string;
// }

// export default function TimeOfficeTable({
//   columns,
//   rows,
//   loading = false,
//   emptyMessage = "No records found.",
//   onView,
//   actionLabel = "View",
// }: TimeOfficeTableProps) {
//   return (
//     <div className="w-full overflow-hidden">
//       <div className="w-full overflow-x-hidden">
//         <table className="w-full table-fixed border-separate border-spacing-y-2">
//           <thead>
//             <tr className="bg-[#d5eaf5]">
//               {columns.map((column) => (
//                 <th
//                   key={column}
//                     className={`break-words px-2 py-3 text-center text-[13px] font-semibold leading-5 ${
//                     column === "Emp ID" ||
//                     column === "Employee ID" ||
//                     column === "Emp Name" ||
//                     column === "Employee Name"
//                       ? "text-[#2fa4dc]"
//                       : "text-[#17283a]"
//                   }`}
//                 >
//                   {column}
//                 </th>
//               ))}

//               {onView && (
//                 <th className="whitespace-nowrap px-3 py-3 text-center text-[13px] font-semibold text-[#2fa4dc]">
//                   {actionLabel}
//                 </th>
//               )}
//             </tr>
//           </thead>

//           <tbody>
//             {loading ? (
//               <tr>
//                 <td
//                   colSpan={columns.length + (onView ? 1 : 0)}
//                   className="bg-white py-12 text-center text-sm text-[#777]"
//                 >
//                   Loading...
//                 </td>
//               </tr>
//             ) : rows.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={columns.length + (onView ? 1 : 0)}
//                   className="bg-[#f5f6fa] p-0 text-center"
//                 >
//                   <TimeOfficeEmptyState message={emptyMessage} />
//                 </td>
//               </tr>
//             ) : (
//               rows.map((row, rowIndex) => (
//                 <tr key={rowIndex}>
//                   {columns.map((column) => {
//                     const value = row[column];
//                     const isMissingDate =
//                       column === "Date" &&
//                       (value === null ||
//                         value === undefined ||
//                         String(value).trim() === "");

//                     return (
//                       <td
//                         key={column}
//                         className={`break-words bg-white px-2 py-3 text-center text-[13px] font-medium shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${
//                           column === "Emp ID" ||
//                           column === "Employee ID" ||
//                           column === "Emp Name" ||
//                           column === "Employee Name"
//                             ? "text-[#2fa4dc]"
//                             : "text-[#111827]"
//                         }`}
//                       >
//                         {isMissingDate ? (
//                           <img
//                             src={noDataImage}
//                             alt="No date data"
//                             className="mx-auto h-8 w-8 object-contain"
//                           />
//                         ) : value !== null && value !== undefined && value !== "" ? (
//                           String(value)
//                         ) : (
//                           "0"
//                         )}
//                       </td>
//                     );
//                   })}

//                   {onView && (
//                     <td className="bg-white px-3 py-3 text-center">
//                       <Button variant="ghost"
//                         type="button"
//                         onClick={() => onView(row)}
//                         title="View"
//                         className="inline-flex items-center justify-center text-[#269bd8]"
//                       >
//                         <svg
//                           width="24"
//                           height="24"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                           strokeWidth="2"
//                         >
//                           <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
//                           <circle cx="12" cy="12" r="3" />
//                         </svg>
//                       </Button>
//                     </td>
//                   )}
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


import { Button } from "@/components/ui/button";
import noDataImage from "@/assets/images/no-data.png";
import TimeOfficeEmptyState from "./TimeOfficeEmptyState";

interface TimeOfficeTableProps {
  columns: string[];
  rows: Record<string, unknown>[];
  loading?: boolean;
  emptyMessage?: string;
  onView?: (row: Record<string, unknown>) => void;
  actionLabel?: string;
}

export default function TimeOfficeTable({
  columns,
  rows,
  loading = false,
  emptyMessage = "No records found.",
  onView,
  actionLabel = "View",
}: TimeOfficeTableProps) {
  return (
    <div className="mt-8 w-full overflow-hidden rounded-[14px] border border-[#d5d9df] bg-white shadow-[0_6px_18px_rgba(15,23,42,0.18)]">
      <div className="w-full overflow-hidden">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="border-b border-[#eaded9] bg-[#fff5f2]">
              {columns.map((column) => (
                <th
                  key={column}
                  className={`break-words px-2 py-3 text-center font-[Urbanist] text-[11px] font-semibold leading-4 ${
                    "text-[#7f4b3d]"
                  }`}
                >
                  {column}
                </th>
              ))}

              {onView && (
                <th className="break-words px-2 py-3 text-center font-[Urbanist] text-[11px] font-semibold leading-4 text-[#7f4b3d]">
                  {actionLabel}
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (onView ? 1 : 0)}
                  className="bg-white px-4 py-10 text-center font-[Urbanist] text-[12px] font-medium text-[#98a2b3]"
                >
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (onView ? 1 : 0)}
                  className="bg-white p-0 text-center"
                >
                  <TimeOfficeEmptyState message={emptyMessage} />
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-[#eef0f3] last:border-b-0 hover:bg-[#fafbfc]"
                >
                  {columns.map((column) => {
                    const value = row[column];

                    const isMissingDate =
                      column === "Date" &&
                      (value === null ||
                        value === undefined ||
                        String(value).trim() === "");

                    return (
                      <td
                        key={column}
                        className={`break-words px-4 py-3 text-center font-[Urbanist] text-[13px] font-normal leading-5 ${
                          column === "Emp ID" ||
                          column === "Employee ID"
                            ? "text-[#249bd7]"
                            : column === "Emp Name" ||
                                column === "Employee Name"
                                ? "!text-[#7f4b3d]"
                              : "text-[#344054]"
                        }`}
                      >
                        {isMissingDate ? (
                          <img
                            src={noDataImage}
                            alt="No date data"
                            className="mx-auto h-8 w-8 object-contain"
                          />
                        ) : value !== null &&
                          value !== undefined &&
                          value !== "" ? (
                          String(value)
                        ) : (
                          "0"
                        )}
                      </td>
                    );
                  })}

                  {onView && (
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => onView(row)}
                        title="View"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md p-0 text-[#249bd7] shadow-none hover:bg-[#eef8fd]"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </Button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// import React from "react";

// import TDSReportEmptyState from "./TDSReportEmptyState";

// interface TDSReportTableProps {
//   columns: string[];
//   rows: Record<string, unknown>[];
//   loading?: boolean;
//   emptyMessage?: string;
//   onAction?: (row: Record<string, unknown>) => void;
//   fitColumns?: boolean;
// }

// export default function TDSReportTable({
//   columns,
//   rows,
//   loading = false,
//   emptyMessage = "No records found.",
//   onAction,
//   fitColumns = false,
// }: TDSReportTableProps) {
//   const totalColumns = columns.length + (onAction ? 1 : 0);

//   return (
//     <div className="w-full overflow-hidden rounded-xl border border-[#b9b9b9] bg-white">
//       <div className={fitColumns ? "w-full" : "w-full overflow-x-auto"}>
//         <table
//           className={
//             fitColumns
//               ? "w-full table-fixed border-collapse"
//               : "w-full min-w-max border-collapse"
//           }
//         >
//           <thead>
//             <tr className="bg-[#f3f8ff]">
//               {columns.map((column) => (
//                 <th
//                   key={column}
//                   className={`${
//                     fitColumns
//                       ? "whitespace-normal break-words px-2"
//                       : "whitespace-nowrap px-4"
//                   } border-b border-[#d9e1ea] py-3.5 text-left font-[Urbanist] text-[13px] font-semibold text-[#333]`}
//                 >
//                   {/* Label */}
//                   {column}
//                 </th>
//               ))}

//               {onAction && (
//                 <th
//                   className={`${
//                     fitColumns
//                       ? "whitespace-normal px-2"
//                       : "whitespace-nowrap px-4"
//                   } border-b border-[#d9e1ea] py-3.5 text-center font-[Urbanist] text-[13px] font-semibold text-[#333]`}
//                 >
//                   {/* Label */}
//                   Action
//                 </th>
//               )}
//             </tr>
//           </thead>

//           <tbody>
//             {loading ? (
//               <tr>
//                 <td
//                   colSpan={totalColumns}
//                   className="h-[420px] text-center font-[Urbanist] text-[13px] font-normal text-[#777]"
//                 >
//                   {/* Utility / UI */}
//                   Loading...
//                 </td>
//               </tr>
//             ) : rows.length === 0 ? (
//               <tr>
//                 <td colSpan={totalColumns} className="p-0">
//                   <TDSReportEmptyState message={emptyMessage} />
//                 </td>
//               </tr>
//             ) : (
//               rows.map((row, rowIndex) => (
//                 <tr
//                   key={rowIndex}
//                   className="border-b border-[#e5e5e5] last:border-b-0"
//                 >
//                   {columns.map((column) => {
//                     const value = row[column];

//                     return (
//                       <td
//                         key={column}
//                         className="whitespace-nowrap px-4 py-3 font-[Urbanist] text-[13px] font-normal text-[#222]"
//                       >
//                         {/* Body */}
//                         {value !== null &&
//                         value !== undefined &&
//                         value !== ""
//                           ? String(value)
//                           : ""}
//                       </td>
//                     );
//                   })}

//                   {onAction && (
//                     <td className="px-4 py-3 text-center">
//                       <button
//                         type="button"
//                         onClick={() => onAction(row)}
//                         className="font-[Urbanist] text-[13px] text-[#8b4f40] hover:opacity-80"
//                         title="Action"
//                       >
//                         {/* Utility / UI */}
//                         ⋮
//                       </button>
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
import React from "react";

import TDSReportEmptyState from "./TDSReportEmptyState";

interface TDSReportTableProps {
  columns: string[];
  rows: Record<string, unknown>[];
  loading?: boolean;
  emptyMessage?: string;
  onAction?: (row: Record<string, unknown>) => void;
  fitColumns?: boolean;
}

export default function TDSReportTable({
  columns,
  rows,
  loading = false,
  emptyMessage = "No records found.",
  onAction,
  fitColumns = false,
}: TDSReportTableProps) {
  const totalColumns = columns.length + (onAction ? 1 : 0);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-[#b9b9b9] bg-white">
      <div className={fitColumns ? "w-full" : "w-full overflow-x-auto"}>
        <table
          className={
            fitColumns
              ? "w-full table-fixed border-collapse"
              : "w-full min-w-max border-collapse"
          }
        >
          <thead>
            <tr className="bg-[#f3f8ff]">
              {columns.map((column) => (
                <th
                  key={column}
                  className={`${
                    fitColumns
                      ? "whitespace-normal break-words px-2"
                      : "whitespace-nowrap px-4"
                  } border-b border-[#d9e1ea] py-3.5 text-left font-[Urbanist] text-[13px] font-semibold text-[#333]`}
                >
                  {/* Label */}
                  {column === "Gross Income(New)" ? (
                    <>
                      Gross
                      <br />
                      Income(New)
                    </>
                  ) : (
                    column
                  )}
                </th>
              ))}

              {onAction && (
                <th
                  className={`${
                    fitColumns
                      ? "whitespace-normal px-2"
                      : "whitespace-nowrap px-4"
                  } border-b border-[#d9e1ea] py-3.5 text-center font-[Urbanist] text-[13px] font-semibold text-[#333]`}
                >
                  {/* Label */}
                  Action
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={totalColumns}
                  className="h-[420px] text-center font-[Urbanist] text-[13px] font-normal text-[#777]"
                >
                  {/* Utility / UI */}
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={totalColumns} className="p-0">
                  <TDSReportEmptyState message={emptyMessage} />
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-[#e5e5e5] last:border-b-0"
                >
                  {columns.map((column) => {
                    const value = row[column];

                    return (
                      <td
                        key={column}
                        className="whitespace-nowrap px-4 py-3 font-[Urbanist] text-[13px] font-normal text-[#222]"
                      >
                        {/* Body */}
                        {value !== null &&
                        value !== undefined &&
                        value !== ""
                          ? String(value)
                          : ""}
                      </td>
                    );
                  })}

                  {onAction && (
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => onAction(row)}
                        className="font-[Urbanist] text-[13px] text-[#8b4f40] hover:opacity-80"
                        title="Action"
                      >
                        {/* Utility / UI */}
                        ⋮
                      </button>
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
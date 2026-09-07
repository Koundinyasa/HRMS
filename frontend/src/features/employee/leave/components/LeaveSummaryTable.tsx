import type { LeaveSummaryTableProps } from "../types/leave.types";
 
// Preferred order and display names. A column is only rendered when the API
// actually returns its field, so the two balance sources (own vs another
// employee) each show exactly what they carry — and Lapsed/Adjusted appear on
// their own if the stored procedure ever starts returning them.
const COLUMNS: { header: string; field: string }[] = [
  { header: "Leave", field: "Leave Type" },
  { header: "Opening Bal", field: "Opening Balance" },
  { header: "Accrued", field: "Accrued" },
  { header: "Availed", field: "Availed" },
  { header: "Lapsed", field: "Lapsed" },
  { header: "Encashed", field: "Encashed" },
  { header: "Adjusted", field: "Adjusted" },
  { header: "Balance", field: "Closing Balance" },
];
 
export default function LeaveSummaryTable({
  balances,
  loading = false,
}: LeaveSummaryTableProps) {
  const records = balances?.records ?? [];
 
  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-sm text-slate-500">Loading summary...</p>
      </div>
    );
  }
 
  if (records.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-slate-500">
          No leave summary available.
        </p>
      </div>
    );
  }
 
  // Only the fields this response actually carries.
  const present = new Set(
    records.flatMap((record) => record.fields.map((field) => field.label))
  );
 
  const columns = COLUMNS.filter((column) => present.has(column.field));
 
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full text-sm">
 
        <thead className="bg-[#7A5BED]">
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.header}
                className={`px-5 py-4 font-semibold text-white ${index === 0 ? "text-left" : "text-right"
                  }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
 
        <tbody>
          {records.map((record, index) => (
            <tr
              key={index}
              className={`border-b transition hover:bg-slate-50 ${index % 2 === 0 ? "bg-white" : "bg-slate-50/40"
                }`}
            >
              {columns.map((column, columnIndex) => {
                const value = record.fields.find(
                  (field) => field.label === column.field
                )?.value;
 
                return (
                  <td
                    key={column.header}
                    className={`px-5 py-4 ${columnIndex === 0
                      ? "font-medium text-slate-800"
                      : "text-right text-slate-700"
                      }`}
                  >
                    {value ?? ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
 
      </table>
    </div>
  );
}


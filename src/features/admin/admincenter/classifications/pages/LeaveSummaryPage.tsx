import { LEAVE_SUMMARY_COLUMNS } from "../constants/leave.constants";
import { useLeave } from "../hooks/useLeave";

export default function LeaveSummaryPage() {
  const { summary } = useLeave();

  return (
    <div className="bg-white rounded-md shadow-sm overflow-x-auto">
      <table className="w-full text-sm text-slate-800 min-w-[900px]">
        <thead>
          <tr className="bg-[#EDEBFB]">
            {LEAVE_SUMMARY_COLUMNS.map((col, i) => (
              <th
                key={col.key}
                className={`px-5 py-4 font-bold ${i === 0 ? "text-left" : "text-right"} ${col.header}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {summary.data?.map((row) => (
            <tr key={row.code}>
              {LEAVE_SUMMARY_COLUMNS.map((col, i) => (
                <td
                  key={col.key}
                  className={`px-5 py-4 border-b-4 border-white ${col.cell} ${
                    i === 0 ? "text-left" : "text-right"
                  }`}
                >
                  {row[col.key] ?? ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!summary.isLoading && !summary.data?.length && (
        <div className="py-10 text-center text-sm text-slate-500">No leave summary available</div>
      )}
    </div>
  );
}

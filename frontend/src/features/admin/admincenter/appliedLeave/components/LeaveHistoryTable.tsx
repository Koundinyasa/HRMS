import { Card, CardContent } from "@/components/ui/card";

import type { LeaveHistoryTableProps } from "../types/appliedLeave.types";



export default function LeaveHistoryTable({
  history,
  loading = false,
}: LeaveHistoryTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#7A5BED]" />
      </div>
    );
  }

  if (!history.length) {
    return (
      <div className="rounded-xl border border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
        No leave history available.
      </div>
    );
  }

  return (
    <Card className="overflow-hidden rounded-xl border border-slate-200 shadow-none">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#7654E8] text-white">
                <th className="px-5 py-4 text-left font-semibold">
                  Leave Type
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  From Date
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  To Date
                </th>

                <th className="px-5 py-4 text-center font-semibold">
                  Days
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Applied Date
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Reason
                </th>

                <th className="px-5 py-4 text-center font-semibold">
                  Status
                </th>

                <th className="px-5 py-4 text-left font-semibold">
                  Approved By
                </th>
              </tr>
            </thead>

            <tbody>
              {history.map((leave, index) => (
                <tr
                  key={`${leave.LeaveId}-${index}`}
                  className="border-b border-slate-200 last:border-b-0"
                >
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                      {leave.LeaveTypeName}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {leave.FromDate}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {leave.ToDate}
                  </td>

                  <td className="px-5 py-4 text-center text-slate-700">
                    {leave.NoOfDays}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {leave.AppliedDate}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {leave.Reason || "-"}
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span
                      className={
                        leave.Status?.toLowerCase() === "approved"
                          ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                          : leave.Status?.toLowerCase() === "rejected"
                            ? "rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700"
                            : "rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                      }
                    >
                      {leave.Status}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {leave.ActionBy || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
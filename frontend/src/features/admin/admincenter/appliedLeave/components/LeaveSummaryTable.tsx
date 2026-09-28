import { Card, CardContent } from "@/components/ui/card";
import type { LeaveSummaryTableProps } from "../types/appliedLeave.types";
export default function LeaveSummaryTable({
  balances,
  loading = false,
}: LeaveSummaryTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#7A5BED]" />
      </div>
    );
  }

  if (!balances.length) {
    return (
      <div className="rounded-xl border border-slate-200 px-4 py-10 text-center text-sm text-slate-500">
        No leave balance available.
      </div>
    );
  }

  return (
    <Card className="overflow-hidden rounded-xl border border-slate-200 shadow-none">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#7654E8] text-white">
                <th className="px-5 py-4 text-left font-semibold">
                  Leave
                </th>
                <th className="px-5 py-4 text-center font-semibold">
                  Opening Bal
                </th>
                <th className="px-5 py-4 text-center font-semibold">
                  Accrued
                </th>
                <th className="px-5 py-4 text-center font-semibold">
                  Availed
                </th>
                <th className="px-5 py-4 text-center font-semibold">
                  Encashed
                </th>
                <th className="px-5 py-4 text-center font-semibold">
                  Adjusted
                </th>
                <th className="px-5 py-4 text-center font-semibold">
                  Balance
                </th>
              </tr>
            </thead>

            <tbody>
              {balances.map((balance, index) => (
                <tr
                  key={`${balance.LeaveName}-${index}`}
                  className="border-b border-slate-200 last:border-b-0"
                >
                  <td className="px-5 py-4 font-medium text-slate-800">
                    {balance.LeaveName}
                  </td>

                  <td className="px-5 py-4 text-center text-slate-700">
                    {balance.OpeningBalance ?? 0}
                  </td>

                  <td className="px-5 py-4 text-center text-slate-700">
                    {balance.Accrued ?? 0}
                  </td>

                  <td className="px-5 py-4 text-center text-slate-700">
                    {balance.Availed ?? 0}
                  </td>

                  <td className="px-5 py-4 text-center text-slate-700">
                    {balance.Encashed ?? 0}
                  </td>

                  <td className="px-5 py-4 text-center text-slate-700">
                    {balance.Adjusted ?? 0}
                  </td>

                  <td className="px-5 py-4 text-center text-slate-700">
                    {balance.ClosingBalance ?? 0}
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
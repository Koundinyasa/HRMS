import { Card, CardContent } from "@/components/ui/card";
import type { LeaveBalance,LeaveBalanceCardProps } from "../types/appliedLeave.types";
const DOT_COLORS = [
  "#22c55e",
  "#f97316",
  "#8b5cf6",
  "#0ea5e9",
  "#ef4444",
];

export default function LeaveBalanceCard({ balances }: LeaveBalanceCardProps) {
  if (!balances || balances.length === 0) {
    return null;
  }

  return (
    <Card className="h-fit self-start rounded-2xl border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-4">
        <h3 className="text-xl font-bold">
          Available Leave Balance
        </h3>

        <p className="mb-4 text-sm text-slate-500">
          Available leaves for this year.
        </p>

        <div className="space-y-3">
          {balances.map((balance, index) => (
            <div
              key={`${balance.LeaveName}-${index}`}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      DOT_COLORS[index % DOT_COLORS.length],
                  }}
                />

                <p className="font-semibold text-slate-800">
                  {balance.LeaveName}
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-semibold text-gray-800">
                  {balance.ClosingBalance ?? 0}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
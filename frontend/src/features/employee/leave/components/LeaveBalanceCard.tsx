import { Card, CardContent } from "@/components/ui/card";

import type { LeaveBalanceCardProps } from "../types/leave.types";

const DOT_COLORS = ["#22c55e", "#f97316", "#8b5cf6", "#0ea5e9", "#ef4444"];
export default function LeaveBalanceCard({
  balances,
}: LeaveBalanceCardProps) {
  const records = balances?.records ?? [];

  if (records.length === 0) {
  return (
    <Card className="h-fit self-start rounded-2xl border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-4">
        <h3 className="text-xl font-bold">
          Available Leave Balance
        </h3>

        <p className="mb-4 text-sm text-slate-500">
          Available leaves for this year.
        </p>

        <p className="py-6 text-center text-sm text-slate-500">
          No leave balance available.
        </p>
      </CardContent>
    </Card>
  );
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
          {records.map((record, index) => {
            const leaveType =
              record.fields.find(
                (field) => field.label === "Leave Type"
              )?.value ?? "-";

            const closingBalance =
              record.fields.find(
                (field) => field.label === "Closing Balance"
              )?.value ?? "-";

            return (
              <div
                key={index}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-3
                  transition
                  hover:shadow-sm
                "
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
                    {leaveType}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-semibold text-gray-800">
                    {closingBalance}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}


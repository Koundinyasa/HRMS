import { Card, CardContent } from "@/components/ui/card";

import type { LeaveBalanceSection } from "../types/leave.types";

interface LeaveBalanceCardProps {
  balances: LeaveBalanceSection | null;
}

export default function LeaveBalanceCard({
  balances,
}: LeaveBalanceCardProps) {
  const records = balances?.records ?? [];

  if (records.length === 0) return null;

  return (
    <Card className="h-full min-h-[520px] rounded-2xl border border-slate-200 shadow-sm">
      <CardContent className="p-5">
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
                <div>
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
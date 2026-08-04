// import Loader from "@/components/ui/loader";

import LeaveStatusCard from "../components/LeaveStatusCard";

import { useLeave } from "../hooks/useLeave";

export default function LeaveStatus() {
  const {
    leaveStatus,
    statusLoading,
  } = useLeave();

  if (statusLoading) {
    return (
      <div className="flex justify-center py-12">
        {/* <Loader /> */}
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>

        <h1 className="text-2xl font-bold">
          Leave Status
        </h1>

        <p className="text-sm text-slate-500">
          Track your leave approval progress.
        </p>

      </div>



      {leaveStatus.length === 0 ? (

        <div className="rounded-lg border border-dashed py-12 text-center">

          <p className="text-slate-500">
            No leave requests found.
          </p>

        </div>

      ) : (

        <div className="space-y-4">

          {[...leaveStatus]
            .sort((a, b) => {
              // Parse AppliedDate (DD-MM-YYYY)
              const parseAppliedDate = (date: string) => {
                const [day, month, year] = date.split("-").map(Number);
                return new Date(year, month - 1, day).getTime();
              };

              // First compare AppliedDate
              const appliedDateDiff =
                parseAppliedDate(b.AppliedDate) -
                parseAppliedDate(a.AppliedDate);

              if (appliedDateDiff !== 0) {
                return appliedDateDiff;
              }

              // If AppliedDate is same, compare FromDate (YYYY-MM-DD)
              return (
                new Date(b.FromDate).getTime() -
                new Date(a.FromDate).getTime()
              );
            })
            .map((leave, index) => (
              <LeaveStatusCard
                key={leave.Id}
                leave={leave}
                defaultExpanded={index === 0}
              />
            ))}

        </div>

      )}

    </div>
  );
}
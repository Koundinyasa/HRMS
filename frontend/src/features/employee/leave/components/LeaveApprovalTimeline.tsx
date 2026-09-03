import {
  Check,
  Clock3,
  X,
} from "lucide-react";

import type {
  LeaveApprovalTimelineProps,
  LeaveStage,
} from "../types/leave.types";

type StageStatus =
  | "completed"
  | "current"
  | "pending"
  | "rejected";

const getStageStatus = (
  state: string
): StageStatus => {
  switch (state.toUpperCase()) {
    case "COMPLETED":
    case "APPROVED":
      return "completed";

    case "CURRENT":
      return "current";

    case "REJECTED":
      return "rejected";

    default:
      return "pending";
  }
};

const getCircleClasses = (
  status: StageStatus
) => {
  switch (status) {
    case "completed":
      return "border-emerald-500 bg-emerald-500 text-white";

    case "current":
      return "border-amber-500 bg-amber-500 text-white";

    case "rejected":
      return "border-red-500 bg-red-500 text-white";

    default:
      return "border-slate-300 bg-white text-slate-500";
  }
};

const getConnectorClasses = (
  previousStage?: LeaveStage
) => {
  if (!previousStage)
    return "bg-emerald-500";

  const state =
    previousStage.StageState.toUpperCase();

  if (
    state === "COMPLETED" ||
    state === "APPROVED"
  ) {
    return "bg-emerald-500";
  }

  if (state === "REJECTED") {
    return "bg-red-500";
  }

  return "bg-slate-300";
};

export default function LeaveApprovalTimeline({
  leave,
}: LeaveApprovalTimelineProps) {
  return (
    <div className="overflow-x-auto">

      <div className="flex min-w-max items-center px-6 py-8">

        {/* Request Submitted */}

        <div className="flex w-40 flex-col items-center">

          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-500 text-white shadow">

            <Check className="h-5 w-5" />

          </div>

          <p className="mt-3 text-center text-sm font-semibold">
            Request Submitted
          </p>

          <p className="text-xs text-slate-500">
            Employee
          </p>

        </div>

        {leave.Stages.map(
          (
            stage,
            index
          ) => {

            const status =
              getStageStatus(
                stage.StageState
              );

            return (
              <div
                key={stage.LevelNo}
                className="flex items-center"
              >

                {/* Connector */}

                <div
                  className={`h-1 w-24 ${getConnectorClasses(
                    index === 0
                      ? undefined
                      : leave.Stages[
                          index - 1
                        ]
                  )}`}
                />

                {/* Stage */}

                <div className="flex w-44 flex-col items-center">                  {/* Circle */}

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 shadow ${getCircleClasses(
                      status
                    )}`}
                  >
                    {status === "completed" ? (
                      <Check className="h-5 w-5" />
                    ) : status === "current" ? (
                      <Clock3 className="h-5 w-5" />
                    ) : status === "rejected" ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <span className="font-semibold">
                        {stage.LevelNo}
                      </span>
                    )}
                  </div>

                  {/* Stage Name */}

                  <p className="mt-3 text-center text-sm font-semibold leading-5">
                    {stage.StageName}
                  </p>

                  {/* Status */}

                  {status === "completed" ? (
                    <>
                      <p className="mt-2 text-[11px] text-slate-500">
                        Approved By
                      </p>

                      <p className="text-center text-xs font-medium text-slate-700">
                        {stage.ApproverId}
                      </p>
                    </>
                  ) : status === "current" ? (
                    <p className="mt-2 text-xs font-semibold uppercase text-amber-600">
                      CURRENT
                    </p>
                  ) : status === "rejected" ? (
                    <p className="mt-2 text-xs font-semibold uppercase text-red-600">
                      REJECTED
                    </p>
                  ) : (
                    <p className="mt-2 text-xs font-semibold uppercase text-slate-500">
                      PENDING
                    </p>
                  )}
                </div>
              </div>
            );
          }
        )}

      </div>

    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  X,
} from "lucide-react";

import type { AssetRequestStatus } from "../types/assetTypes";

interface Props {
  requests: AssetRequestStatus[];
}

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

const getStageClasses = (
  status: StageStatus
) => {
  switch (status) {
    case "completed":
      return {
        circle:
          "bg-emerald-500 border-emerald-500 text-white",
        line: "bg-emerald-500",
        text: "text-emerald-600",
      };

    case "current":
      return {
        circle:
          "bg-amber-500 border-amber-500 text-white",
        line: "bg-slate-300",
        text: "text-amber-600",
      };

    case "rejected":
      return {
        circle:
          "bg-red-500 border-red-500 text-white",
        line: "bg-red-500",
        text: "text-red-600",
      };

    default:
      return {
        circle:
          "bg-white border-slate-300 text-slate-500",
        line: "bg-slate-300",
        text: "text-slate-500",
      };
  }
};

export default function AssetStatusTimeline({
  requests,
}: Props) {
  const [expandedId, setExpandedId] =
    useState<number | null>(null);

  const sortedRequests = useMemo(() => {
    return [...requests].sort((a, b) => {
      return (
        new Date(b.RequestDate).getTime() -
        new Date(a.RequestDate).getTime()
      );
    });
  }, [requests]);

  useEffect(() => {
    if (sortedRequests.length) {
      setExpandedId(sortedRequests[0].Id);
    }
  }, [sortedRequests]);

  const toggleExpand = (id: number) => {
    setExpandedId((prev) =>
      prev === id ? null : id
    );
  };

  return (
    <div className="space-y-5">
      {sortedRequests.map((request) => {
        const isExpanded =
          expandedId === request.Id;

        const completedStages =
          request.Stages.filter(
            (stage) =>
              stage.StageState === "COMPLETED"
          ).length;

        const currentStage =
          request.Stages.find(
            (stage) =>
              stage.StageState ===
              "CURRENT"
          );

        const rejectedStage =
          request.Stages.find(
            (stage) =>
              stage.StageState ===
              "REJECTED"
          );

        const isCompleted =
          completedStages ===
          request.TotalLevels;

        const progress = Math.round(
          (completedStages /
            request.TotalLevels) *
          100
        );

        return (
          <div
            key={request.Id}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >            <div
            className="flex cursor-pointer items-center justify-between border-b p-5"
            onClick={() => toggleExpand(request.Id)}
          >
              <div className="grid flex-1 grid-cols-4 gap-10">
                <div>
                  <p className="text-xs text-slate-500 uppercase">
                    Asset
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-slate-800">
                    {request.AssetName}
                  </h3>
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase">
                    Requested On
                  </p>

                  <p className="mt-1 font-medium">
                    {request.RequestDate}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase">
                    Status
                  </p>

                  <span
                    className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${request.OverallStatus?.toUpperCase() === "APPROVED"
                      ? "bg-emerald-100 text-emerald-700"
                      : request.OverallStatus?.toUpperCase() === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : request.OverallStatus?.toUpperCase() === "WITHDRAWN"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                  >
                    {request.OverallStatus}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase">
                    Progress
                  </p>

                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full transition-all duration-500 ${rejectedStage
                          ? "bg-red-500"
                          : "bg-emerald-500"
                          }`}
                        style={{
                          width: `${rejectedStage
                            ? progress
                            : isCompleted
                              ? 100
                              : progress
                            }%`,
                        }}
                      />
                    </div>

                    <span className="text-sm font-semibold">
                      {rejectedStage
                        ? "Stopped"
                        : `${isCompleted ? 100 : progress}%`}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="ml-6 rounded-full p-2 hover:bg-slate-100"
              >
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
            </div>

            <div
              className={`grid transition-all duration-300 ${isExpanded
                ? "grid-rows-[1fr]"
                : "grid-rows-[0fr]"
                }`}
            >
              <div className="overflow-hidden">
                <div className="p-6">                  <div className="overflow-x-auto">
                  <div className="flex min-w-max items-center">

                    {/* Request Submitted */}

                    <div className="flex w-36 flex-col items-center">
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

                    {request.Stages.map((stage, index) => {
                      const status = getStageStatus(stage.StageState);
                      const style = getStageClasses(status);

                      return (
                        <div
                          key={stage.LevelNo}
                          className="flex items-center"
                        >
                          {/* Connector */}

                          <div
                            className={`h-1 w-20 ${status === "completed" || status === "current"
                              ? "bg-emerald-500"
                              : status === "rejected"
                                ? "bg-red-500"
                                : "bg-slate-300"
                              }`}
                          />

                          {/* Stage */}

                          <div className="flex w-40 flex-col items-center">
                            <div
                              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 font-semibold shadow ${style.circle}`}
                            >
                              {status === "completed" ? (
                                <Check className="h-5 w-5" />
                              ) : status === "current" ? (
                                <Clock3 className="h-5 w-5" />
                              ) : status === "rejected" ? (
                                <X className="h-5 w-5" />
                              ) : (
                                stage.LevelNo
                              )}
                            </div>

                            <p className="mt-3 text-center text-sm font-semibold leading-5">
                              {stage.StageName}
                            </p>

                            <div className="mt-2 text-center">
                              {status !== "completed" && (
                                <p className={`text-xs font-semibold ${style.text}`}>
                                  {stage.StageState}
                                </p>
                              )}

                              {status === "completed" && (
                                <>
                                  <p className="text-[11px] text-slate-500">
                                    Approved By
                                  </p>

                                  <p className="text-xs font-medium text-slate-700">
                                    {stage.ApproverId}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>


                </div>
              </div>
            </div>
          </div>

        );
      })}
    </div>
  );
}
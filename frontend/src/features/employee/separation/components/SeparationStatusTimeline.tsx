import { useEffect, useState } from "react";

import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  X,
} from "lucide-react";

import type {
  SeparationTimelineProps,
} from "../types/separation.types";

type StageStatus =
  | "completed"
  | "current"
  | "pending"
  | "rejected"
  | "withdrawn";

/**
 * Convert backend status into UI status
 */
const getStageStatus = (
  state: string
): StageStatus => {
  switch (state.toUpperCase()) {
    case "APPROVED":
    case "COMPLETED":
      return "completed";

    case "CURRENT":
      return "current";

    case "REJECTED":
      return "rejected";

    case "NOT VERIFIED":
      return "withdrawn";

    default:
      return "pending";
  }
};

/**
 * Stage colors
 */
const getStageClasses = (
  status: StageStatus
) => {
  switch (status) {
    case "completed":
      return {
        circle:
          "bg-emerald-500 border-emerald-500 text-white",
        line: "bg-emerald-500",
      };

    case "current":
      return {
        circle:
          "bg-orange-500 border-orange-500 text-white",
        line: "bg-slate-300",
      };

    case "rejected":
      return {
        circle:
          "bg-red-500 border-red-500 text-white",
        line: "bg-red-500",
      };

    case "withdrawn":
      return {
        circle:
          "bg-orange-50 border-orange-300 text-orange-400",
        line: "bg-gray-300",
      };

    default:
      return {
        circle:
          "bg-white border-slate-300 text-slate-500",
        line: "bg-slate-300",
      };
  }
};

/**
 * Progress Percentage
 */
const getProgress = (
  totalLevels: number,
  completedLevels: number
) => {
  if (!totalLevels) return 0;

  return Math.round(
    (completedLevels / totalLevels) * 100
  );
};

export default function SeparationStatusTimeline({
  request,
}: SeparationTimelineProps) {
  const [expanded, setExpanded] =
    useState(false);

  useEffect(() => {
    setExpanded(true);
  }, [request]);

  const overallStatus =
    request.OverallStatus.toUpperCase();

  const completedStages =
    request.Stages.filter((stage) =>
      ["APPROVED", "COMPLETED"].includes(
        stage.StageState.toUpperCase()
      )
    ).length;

  const progress = getProgress(
    request.TotalLevels,
    completedStages
  );

  const toggleExpand = () =>
    setExpanded((prev) => !prev);
  return (
    <div className="space-y-5">
     <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div
          className="flex cursor-pointer items-center justify-between border-b border-orange-200 px-4 py-2 transition-colors hover:bg-slate-50"
          onClick={toggleExpand}
        >
          <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-4">
            {/* Notice Period */}
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Notice Period
              </p>

              <h3 className="text-base font-semibold text-slate-800">
                {request.FromDate} - {request.ToDate}
              </h3>
            </div>

            {/* Applied Date */}
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Applied On
              </p>

              <p className="mt-1 font-medium text-slate-700">
                {request.AppliedDate}
              </p>
            </div>

            {/* Overall Status */}
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Status
              </p>

              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold
                ${overallStatus === "APPROVED"
                    ? "bg-emerald-100 text-emerald-700"
                    : overallStatus === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : overallStatus === "WITHDRAWN"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-orange-100 text-orange-700"
                  }`}
              >
                {request.OverallStatus}
              </span>
            </div>

            {/* Progress */}
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Progress
              </p>

              <div className="mt-2 flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-orange-100">
                  <div
                    className={`h-full transition-all duration-500
                    ${overallStatus === "APPROVED"
                        ? "bg-emerald-500"
                        : overallStatus === "REJECTED"
                          ? "bg-red-500"
                          : overallStatus === "WITHDRAWN"
                            ? "bg-orange-500"
                            : "bg-orange-500"
                      }`}
                    style={{
                      width: `${overallStatus === "APPROVED"
                          ? 100
                          : progress
                        }%`,
                    }}
                  />
                </div>

                <span className="text-sm font-semibold">
                  {overallStatus === "WITHDRAWN"
                    ? "Withdrawn"
                    : overallStatus === "REJECTED"
                      ? "Stopped"
                      : overallStatus === "APPROVED"
                        ? "100%"
                        : `${progress}%`}
                </span>
              </div>
            </div>
          </div>

          {/* Expand / Collapse */}
          <button
            type="button"
            className="ml-3 rounded-full p-1 transition hover:bg-slate-100"
          >
            {expanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Timeline */}
        <div
          className={`grid transition-all duration-300 ${expanded
              ? "grid-rows-[1fr]"
              : "grid-rows-[0fr]"
            }`}
        >
          <div className="overflow-hidden">
            <div className="p-3">
              <div className="overflow-x-auto">
                <div className="flex min-w-max items-center">                  {/* Request Submitted */}
                  <div className="flex w-36 flex-col items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-500 text-white shadow">
                      <Check className="h-5 w-5" />
                    </div>

                    <p className="mt-2 text-center text-xs font-semibold">
                      Request Submitted
                    </p>

                    <p className="text-xs text-slate-500">
                      Employee
                    </p>
                  </div>

                  {/* Approval Stages */}
                  {request.Stages.map((stage) => {
                    const status = getStageStatus(
                      stage.StageState
                    );

                    const style =
                      getStageClasses(status);

                    return (
                      <div
                        key={stage.LevelNo}
                        className="flex items-center"
                      >
                        {/* Connector */}
                        <div
                          className={`h-1 w-20 ${status === "completed"
                              ? "bg-emerald-500"
                              : status === "rejected"
                                ? "bg-red-500"
                                : status === "withdrawn"
                                  ? "bg-orange-300"
                                  : "bg-orange-300"
                            }`}
                        />

                        {/* Stage */}
                        <div
                          className={`flex w-40 flex-col items-center ${status === "withdrawn"
                              ? "opacity-40"
                              : ""
                            }`}
                        >
                          {/* Circle */}
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full border-2 shadow ${style.circle}`}
                          >
                            {status ===
                              "completed" ? (
                              <Check className="h-5 w-5" />
                            ) : status ===
                              "current" ? (
                              <Clock3 className="h-5 w-5" />
                            ) : status ===
                              "rejected" ? (
                              <X className="h-5 w-5" />
                            ) : (
                              <span className="font-semibold">
                                {stage.LevelNo}
                              </span>
                            )}
                          </div>

                          {/* Stage Name */}
                          <p className="mt-2 text-center text-xs font-semibold leading-4">
                            {stage.StageName}
                          </p>

                          {/* Approver */}
                          {/* Stage Status / Approver */}
                          <p
                            className={`mt-2 text-center text-xs font-medium ${status === "completed"
                                ? "text-slate-500"
                                : status === "current"
                                  ? "text-orange-600 uppercase"
                                  : status === "pending"
                                    ? "text-slate-500 uppercase"
                                    : status === "rejected"
                                      ? "text-red-600 uppercase"
                                      : "text-orange-400 uppercase"
                              }`}
                          >
                            {status === "completed"
                              ? stage.ApproverId
                              : status === "current"
                                ? "CURRENT"
                                : status === "pending"
                                  ? "PENDING"
                                  : status === "rejected"
                                    ? "REJECTED"
                                    : "WITHDRAWN"}
                          </p>
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
    </div>
  );
}
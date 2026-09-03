import { useEffect, useState } from "react";

import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import CancelLeaveDialog from "./CancelLeaveDialog";
import LeaveApprovalTimeline from "./LeaveApprovalTimeline";

import type {
  LeaveApplication,
} from "../types/leave.types";

interface Props {
  leave: LeaveApplication;
  defaultExpanded?: boolean;
}

export default function LeaveStatusCard({
  leave,
  defaultExpanded = false,
}: Props) {

  const [expanded, setExpanded] =
    useState(defaultExpanded);

  const [cancelOpen, setCancelOpen] =
    useState(false);

  useEffect(() => {
    setExpanded(defaultExpanded);
  }, [defaultExpanded]);

  const completedStages =
    leave.Stages.filter((stage) =>
      ["COMPLETED", "APPROVED"].includes(
        stage.StageState.toUpperCase()
      )
    ).length;

  const progress = Math.round(
    (completedStages /
      leave.TotalLevels) *
    100
  );

  const overallStatus =
    leave.OverallStatus.toUpperCase();

  const formatDate = (
    value: string
  ) => {
    const date = new Date(value);

    if (isNaN(date.getTime()))
      return value;

    return date.toLocaleDateString(
      "en-GB"
    );
  };

  const badgeClass =
    overallStatus === "APPROVED"
      ? "bg-emerald-100 text-emerald-700"
      : overallStatus === "REJECTED"
        ? "bg-red-100 text-red-700"
        : overallStatus === "WITHDRAWN"
          ? "bg-slate-100 text-slate-700"
          : "bg-amber-100 text-amber-700";
  return (
    <>
      <Card className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <CardContent className="p-0">

          {/* Summary */}

          <div
            className="flex cursor-pointer items-center justify-between px-4 py-2 transition-colors hover:bg-slate-50"
            onClick={() =>
              setExpanded((prev) => !prev)
            }
          >
            <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-4">

              {/* Leave */}

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Leave
                </p>

                <h3 className="text-base font-semibold text-slate-800">
                  {leave.LeaveName}
                </h3>

                <p className="text-xs text-slate-500">
                  {formatDate(leave.FromDate)} →{" "}
                  {formatDate(leave.ToDate)}
                </p>
              </div>

              {/* Applied On */}

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Applied On
                </p>

                <p className="mt-1 font-medium text-slate-700">
                  {formatDate(leave.AppliedDate)}
                </p>
              </div>

              {/* Status */}

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Status
                </p>

                <span
                  className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
                >
                  {leave.OverallStatus}
                </span>
              </div>

              {/* Progress */}

              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Progress
                </p>

                <div className="mt-2 flex items-center gap-3">

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">

                    <div
                      className={`h-full transition-all duration-500 ${overallStatus === "APPROVED"
                        ? "bg-emerald-500"
                        : overallStatus === "REJECTED"
                          ? "bg-red-500"
                          : "bg-amber-500"
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
                    {overallStatus === "APPROVED"
                      ? "100%"
                      : overallStatus === "REJECTED"
                        ? "Stopped"
                        : `${progress}%`}
                  </span>

                </div>
              </div>

            </div>

            <div className="ml-3 flex items-center gap-2">

              {(overallStatus === "SUBMITTED" ||
                overallStatus === "APPROVED") && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCancelOpen(true);
                    }}
                  >
                    Cancel Leave
                  </Button>
                )}

              {expanded ? (
                <ChevronUp className="h-5 w-5 text-slate-600" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-600" />
              )}

            </div>

          </div>

          {/* Timeline */}

          {expanded && (
            <div className="border-t">
              <LeaveApprovalTimeline leave={leave} />
            </div>
          )}

        </CardContent>
      </Card>

      <CancelLeaveDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        leave={leave}
      />
    </>
  );
}
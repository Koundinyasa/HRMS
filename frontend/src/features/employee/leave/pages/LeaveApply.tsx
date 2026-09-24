 
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Tags, CalendarDays, PenLine } from "lucide-react";
 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 
import { Button } from "@/components/ui/button";
 
import { Label } from "@/components/ui/label";
 
import DateField from "../components/DateField";
 
import LeaveBalanceCard from "../components/LeaveBalanceCard";
 
import { useLeave } from "../hooks/useLeave";
import { useApplyLeave } from "../hooks/useApplyLeave";
 
import { leaveApplySchema } from "../validation/leaveValidation";
import { minFromDateIso, maxApplyDateIso } from "../constants/leave.constants";
 
import type { LeaveApplyForm } from "../types/leave.types";
 
const DEFAULT_VALUES: LeaveApplyForm = {
  leaveType: "",
  fromDate: "",
  toDate: "",
  reason: "",
  isHalfDay: false,
  sessionFrom: "",
  sessionTo: "",
 
  attachment: null,
};
 
export default function LeaveApply() {
  const location = useLocation();
  const navigate = useNavigate();
 
  const {
    leaveTypes,
    leaveTypesLoading,
    leaveBalance,
    holidayDates,
    refetchLeaveBalance,
    refetchLeaveHistory,
    refetchLeaveStatus,
  } = useLeave();
 
  const { applyLeave, isSubmitting } = useApplyLeave();
 
  const [leaveTypeOpen, setLeaveTypeOpen] = useState(false);
  const leaveTypeRef = useRef<HTMLDivElement>(null);
 
  useEffect(() => {
    if (!leaveTypeOpen) return;
 
    const handleClickOutside = (event: MouseEvent) => {
      if (
        leaveTypeRef.current &&
        !leaveTypeRef.current.contains(event.target as Node)
      ) {
        setLeaveTypeOpen(false);
      }
    };
 
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [leaveTypeOpen]);
 
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LeaveApplyForm>({
    resolver: zodResolver(leaveApplySchema),
    defaultValues: DEFAULT_VALUES,
    // Surfaces the weekend error as soon as a date is chosen.
    mode: "onTouched",
  });
 
  const fromDate = watch("fromDate");
  const leaveType = watch("leaveType");
  const toDate = watch("toDate");
 
  const isSingleDay = fromDate && toDate && fromDate === toDate;
 
  useEffect(() => {
    if (!isSingleDay) {
      setValue("isHalfDay", false);
      setValue("sessionFrom", "");
      setValue("sessionTo", "");
    }
  }, [isSingleDay, setValue]);
 
  const totalDays =
    fromDate && toDate
      ? Math.floor(
          (new Date(toDate).getTime() - new Date(fromDate).getTime()) /
            (1000 * 60 * 60 * 24),
        ) + 1
      : 0;
 
  // From Date opens a week back; To Date can never precede From Date.
  const minFromDate = minFromDateIso();
  const minToDate = fromDate || minFromDate;
 
  const onSubmit = async (data: LeaveApplyForm) => {
    const isHalfDay =
      data.sessionFrom === "First Half" || data.sessionFrom === "Second Half";
 
    const payload = {
      leaveTypeId: Number(data.leaveType),
      fromDate: data.fromDate,
      toDate: data.toDate,
      reason: data.reason,
      isHalfDay: (isHalfDay ? "true" : "false") as "true" | "false",
      sessionFrom: data.sessionFrom,
      sessionTo: data.sessionTo,
      attachment: data.attachment,
    };
 
    const response = await applyLeave(payload);
 
    if (response) {
      await refetchLeaveBalance();
      await refetchLeaveHistory();
      await refetchLeaveStatus();
 
      reset(DEFAULT_VALUES);
      navigate(`/${location.pathname.split("/")[1]}/employee/leave/status`);
    }
  };
 
  return (
    <div className="w-full px-4 sm:px-6">
      <div className="grid w-full gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-6">
          <LeaveBalanceCard balances={leaveBalance} />
        </div>
 
        <Card className="w-full overflow-visible rounded-2xl border border-indigo-100 shadow-sm">
          <div>
            <CardHeader className="border-b border-slate-100 pb-3">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <CardTitle className="text-lg font-bold tracking-tight sm:text-x">
                  Apply Leave
                </CardTitle>
              </div>
            </CardHeader>
          </div>
 
          <CardContent className="relative space-y-4 overflow-visible p-4">
            <form
              onSubmit={handleSubmit(onSubmit, (errors) => {
                console.log("Validation Errors:", errors);
              })}
              className="space-y-6"
            >
              {/* Dates */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Leave Type */}
                <div className="space-y-2">
                  <Label
                    htmlFor="leaveType"
                    className="flex items-center gap-1"
                  >
                    <Tags className="h-3.5 w-3.5" />
                    Leave Type
                  </Label>
 
                  <Controller
                    control={control}
                    name="leaveType"
                    render={({ field }) => {
                      const selectedName = leaveTypes.find(
                        (leave) => String(leave.ID) === field.value,
                      )?.Name;
 
                      return (
                        <div className="relative" ref={leaveTypeRef}>
                          <button
                            type="button"
                            id="leaveType"
                            onClick={() => setLeaveTypeOpen((prev) => !prev)}
                            className="flex h-[47px] w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-4 text-sm"
                          >
                            <span
                              className={selectedName ? "" : "text-slate-400"}
                            >
                              {selectedName ?? "Select Leave Type"}
                            </span>
 
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                          </button>
 
                          {leaveTypeOpen && (
                            <div className="absolute z-50 mt-2 max-h-[112px] w-full overflow-y-auto rounded-xl border border-slate-300 bg-white p-1 shadow-lg">
                              {leaveTypes.length > 0 ? (
                                leaveTypes.map((leave) => (
                                  <button
                                    type="button"
                                    key={leave.ID}
                                    onClick={() => {
                                      field.onChange(String(leave.ID));
                                      setLeaveTypeOpen(false);
                                    }}
                                    className={`block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-900 ${
                                      String(leave.ID) === field.value
                                        ? "bg-purple-50 font-semibold"
                                        : "hover:bg-slate-100"
                                    }`}
                                  >
                                    {leave.Name}
                                  </button>
                                ))
                              ) : (
                                <div className="px-3 py-2 text-sm text-slate-500">
                                  No leave types available
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
 
                  {errors.leaveType && (
                    <p className="text-sm text-red-500">
                      {errors.leaveType.message}
                    </p>
                  )}
                </div>
 
                {/* From Date */}
                <div className="relative space-y-2">
                  <Label
                    htmlFor="fromDate"
                    className="flex items-center gap-1"
                  >
                    <CalendarDays className="h-3.5 w-3.5" />
                    From Date
                  </Label>
 
                  <Controller
                    control={control}
                    name="fromDate"
                    render={({ field }) => (
                      <DateField
                        id="fromDate"
                        value={field.value}
                        onChange={field.onChange}
                        min={minFromDateIso()}
                        max={maxApplyDateIso()}
                        holidays={holidayDates}
                        inputClassName="!border-slate-300 focus:!border-slate-400 focus:!ring-0 focus-visible:!border-slate-400 focus-visible:!ring-0 focus-visible:!ring-offset-0"
                      />
                    )}
                  />
 
                  {errors.fromDate && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {errors.fromDate.message}
                    </p>
                  )}
                </div>
 
                {/* To Date */}
                <div className="relative space-y-2">
                  <Label htmlFor="toDate" className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    To Date
                  </Label>
 
                  <Controller
                    control={control}
                    name="toDate"
                    render={({ field }) => (
                      <DateField
                        id="toDate"
                        value={field.value}
                        min={minToDate}
                        max={maxApplyDateIso()}
                        onChange={field.onChange}
                        disablePreviousYears
                        initialMonth={fromDate}
                        holidays={holidayDates}
                        inputClassName="!border-slate-300 focus:!border-slate-400 focus:!ring-0 focus-visible:!border-slate-400 focus-visible:!ring-0 focus-visible:!ring-offset-0"
                      />
                    )}
                  />
 
                  {errors.toDate && (
                    <p className="mt-1 text-xs font-medium text-red-500">
                      {errors.toDate.message}
                    </p>
                  )}
                </div>
              </div>
 
              {/* Half Day */}
              {isSingleDay && (
                <div className="space-y-3 rounded-xl bg-blue-50 p-4">
                  <Label className="font-medium">Half Day</Label>
 
                  <Controller
                    control={control}
                    name="sessionFrom"
                    render={({ field }) => (
                      <div className="flex gap-6">
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="halfDay"
                            value="First Half"
                            checked={field.value === "First Half"}
                            onChange={() => {
                              field.onChange("First Half");
                              setValue("isHalfDay", true);
                              setValue("sessionFrom", "First Half");
                              setValue("sessionTo", "First Half");
                            }}
                          />
                          First Half
                        </label>
 
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="radio"
                            name="halfDay"
                            value="Second Half"
                            checked={field.value === "Second Half"}
                            onChange={() => {
                              field.onChange("Second Half");
                              setValue("isHalfDay", true);
                              setValue("sessionFrom", "Second Half");
                              setValue("sessionTo", "Second Half");
                            }}
                          />
                          Second Half
                        </label>
                      </div>
                    )}
                  />
                </div>
              )}
 
              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason" className="flex items-center gap-1">
                  <PenLine className="h-3.5 w-3.5" />
 
                  <span>Reason</span>
 
                  <span className="font-normal text-slate-500">
                    (Optional)
                  </span>
                </Label>
 
                <Controller
                  control={control}
                  name="reason"
                  render={({ field }) => (
                    <textarea
                      id="reason"
                      rows={3}
                      value={field.value}
                      disabled={isSubmitting}
                      placeholder="Enter the reason for your leave..."
                      onChange={(e) => field.onChange(e.target.value)}
                      className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm transition focus:outline-none focus:ring-2 focus:ring-[#7A5BED]"
                    />
                  )}
                />
 
                {errors.reason && (
                  <p className="text-sm text-red-500">
                    {errors.reason.message}
                  </p>
                )}
              </div>
 
              {leaveType === "2" && totalDays > 1 && (
                <div className="space-y-2">
                  <Label htmlFor="attachment">Medical Certificate</Label>
 
                  <Controller
                    control={control}
                    name="attachment"
                    render={({ field }) => (
                      <input
                        id="attachment"
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                        onChange={(e) =>
                          field.onChange(e.target.files?.[0] ?? null)
                        }
                        className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                      />
                    )}
                  />
 
                  <p className="text-xs text-slate-500">
                    Upload JPG, PNG, PDF or DOCX (Max 5 MB)
                  </p>
 
                  {errors.attachment && (
                    <p className="text-sm text-red-500">
                      {errors.attachment.message}
                    </p>
                  )}
                </div>
              )}
 
              {/* Buttons */}
              <div className="flex flex-wrap justify-end gap-4 border-t border-slate-100 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => reset(DEFAULT_VALUES)}
                  className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                >
                  Reset
                </Button>
 
                <Button
                  type="submit"
                  disabled={isSubmitting || leaveTypesLoading}
                  className="min-w-[150px] rounded-xl shadow-md"
                  style={{
                    backgroundColor: "#7c3aed",
                    color: "#fff",
                  }}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
 
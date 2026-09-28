import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, ChevronDown, PenLine, Tags } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ApplyForEmployeeSelector from "./ApplyForEmployeeSelector";
import EmployeeInfoCard from "./EmployeeInfoCard";
import LeaveBalanceCard from "./LeaveBalanceCard";
import LeaveSummaryTable from "./LeaveSummaryTable";
import LeaveHistoryTable from "./LeaveHistoryTable";
import DateField from "./DateField";
import { useGetReportingEmployeesForAppliedLeaveQuery } from "../api/appliedLeaveApi";
import { useAppliedLeave } from "../hooks/useAppliedLeave";
import { useAppliedHRLeave } from "../hooks/useAppliedHRLeave";
import { appliedLeaveSchema } from "../validation/appliedLeaveValidation";
import {
  maxApplyDateIso,
  minFromDateIso,
} from "../constants/appliedLeave.constants";
import type { LeaveApplyForm } from "../types/appliedLeave.types";

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

export default function ApplyForEmployee() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [activeTab, setActiveTab] = useState<"apply" | "summary" | "history">(
    "apply",
  );

  const [leaveTypeOpen, setLeaveTypeOpen] = useState(false);

  const leaveTypeRef = useRef<HTMLDivElement>(null);

  const { data: employees = [], isLoading: employeesLoading } =
    useGetReportingEmployeesForAppliedLeaveQuery();

  const {
    leaveTypes,
    leaveTypesLoading,
    employeeDetails,
    employeeDetailsLoading,
    refetchEmployeeDetails,
  } = useAppliedLeave(selectedEmployeeId);

  const { applyLeaveForEmployee, isSubmittingForEmployee } =
    useAppliedHRLeave();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LeaveApplyForm>({
    resolver: zodResolver(appliedLeaveSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched",
  });

  const fromDate = watch("fromDate");

  const toDate = watch("toDate");

  const leaveType = watch("leaveType");
  const availableEmployeeLeaveTypes =
    employeeDetails?.employeeLeaveBalance ?? [];

  const isSingleDay = Boolean(fromDate && toDate && fromDate === toDate);

  const totalDays =
    fromDate && toDate
      ? (() => {
          const start = new Date(`${fromDate}T00:00:00`);
          const end = new Date(`${toDate}T00:00:00`);

          let days = 0;

          const current = new Date(start);

          while (current <= end) {
            const day = current.getDay();

            // Monday-Friday only
            if (day !== 0 && day !== 6) {
              days++;
            }

            current.setDate(current.getDate() + 1);
          }

          return days;
        })()
      : 0;

  const selectedEmployee = employees.find(
    (employee) => employee.EmployeeID === selectedEmployeeId,
  );

  useEffect(() => {
    if (!isSingleDay) {
      setValue("isHalfDay", false);

      setValue("sessionFrom", "");

      setValue("sessionTo", "");
    }
  }, [isSingleDay, setValue]);

  useEffect(() => {
    if (!leaveTypeOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        leaveTypeRef.current &&
        !leaveTypeRef.current.contains(event.target as Node)
      ) {
        setLeaveTypeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [leaveTypeOpen]);

  const onSubmit = async (data: LeaveApplyForm) => {
    if (!selectedEmployeeId) {
      return;
    }

    const isHalfDay =
      data.sessionFrom === "First Half" || data.sessionFrom === "Second Half";

    // -----------------------------------------
    // 1. FIND SELECTED LEAVE TYPE
    // -----------------------------------------
    const selectedLeaveType = leaveTypes.find(
      (leave) => String(leave.ID) === data.leaveType,
    );

    // -----------------------------------------
    // 2. FIND AVAILABLE LEAVE BALANCE
    // -----------------------------------------
    const selectedBalance = availableEmployeeLeaveTypes.find(
      (balance) =>
        balance.LeaveName?.trim().toLowerCase() ===
        selectedLeaveType?.Name?.trim().toLowerCase(),
    );

    const isLossOfPay =
      selectedLeaveType?.Name?.trim().toLowerCase() === "loss of pay";

    // -----------------------------------------
    // 3. CALCULATE REQUESTED DAYS
    // -----------------------------------------
    const requestedDays = isHalfDay ? 0.5 : totalDays;

    const availableBalance = Number(selectedBalance?.ClosingBalance ?? 0);

    // -----------------------------------------
    // 4. CHECK LEAVE BALANCE
    // -----------------------------------------
    if (!isLossOfPay && requestedDays > availableBalance) {
      toast.error("Insufficient leave balance.");
      return;
    }

    // -----------------------------------------
    // 5. CHECK EXISTING / OVERLAPPING LEAVE
    // -----------------------------------------
    const existingLeaves = employeeDetails?.employeeLeaveHistory ?? [];

    const requestedFrom = new Date(`${data.fromDate}T00:00:00`);

    const requestedTo = new Date(`${data.toDate}T00:00:00`);

    const hasOverlappingLeave = existingLeaves.some((leave) => {
      const status = leave.Status?.trim().toLowerCase();

      // Rejected/cancelled leaves should
      // not block a new leave application.
      if (
        status === "rejected" ||
        status === "cancelled" ||
        status === "canceled"
      ) {
        return false;
      }

      if (!leave.FromDate || !leave.ToDate) {
        return false;
      }

      const existingFrom = new Date(`${leave.FromDate}T00:00:00`);

      const existingTo = new Date(`${leave.ToDate}T00:00:00`);

      // Check whether the date ranges overlap.
      return requestedFrom <= existingTo && requestedTo >= existingFrom;
    });

    if (hasOverlappingLeave) {
      toast.error(
        "Leave has already been applied or approved within this date range",
      );
      return;
    }

    // -----------------------------------------
    // 6. APPLY LEAVE
    // -----------------------------------------
    const response = await applyLeaveForEmployee({
      employeeId: selectedEmployeeId,

      leaveTypeId: Number(data.leaveType),

      fromDate: data.fromDate,

      toDate: data.toDate,

      reason: data.reason ?? "",

      isHalfDay: (isHalfDay ? "true" : "false") as "true" | "false",

      sessionFrom: data.sessionFrom,

      sessionTo: data.sessionTo,

      attachment: data.attachment ?? null,

      isHRForceApply: 1,
    });

    if (response) {
      await refetchEmployeeDetails();

      reset(DEFAULT_VALUES);

      setSelectedEmployeeId("");
    }
  };
  return (
    <div className="w-full">
      <div className="grid w-full gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        {/* LEFT SIDE */}
        <div className="space-y-6">
          <Card className="overflow-visible rounded-2xl border border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <ApplyForEmployeeSelector
                id="admin-apply-for-employee"
                employees={employees}
                value={selectedEmployeeId}
                onChange={(employeeId) => {
                  setSelectedEmployeeId(employeeId);
                  setActiveTab("apply");
                }}
                loading={employeesLoading}
                placeholder="Search employee..."
              />
            </CardContent>
          </Card>

          {selectedEmployee && (
            <>
              <EmployeeInfoCard
                employee={selectedEmployee}
                details={employeeDetails?.employeeDetails?.[0] ?? null}
                loading={employeeDetailsLoading}
              />

              <LeaveBalanceCard
                balances={employeeDetails?.employeeLeaveBalance ?? []}
              />
            </>
          )}
        </div>

        {/* RIGHT SIDE */}
        <Card className="min-h-[600px] overflow-visible overflow-visible rounded-2xl border border-indigo-100 shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-lg font-bold">
              Apply Leave for Employee
            </CardTitle>
          </CardHeader>

          <CardContent className="p-5">
            {/* TABS */}
            <div className="mb-6 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("apply")}
                className={`rounded-lg px-5 py-2 text-sm font-medium transition ${
                  activeTab === "apply"
                    ? "bg-[#EEEAFE] text-[#7654E8]"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                Apply
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("summary")}
                disabled={!selectedEmployeeId}
                className={`rounded-lg px-5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  activeTab === "summary"
                    ? "bg-[#EEEAFE] text-[#7654E8]"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                Summary
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("history")}
                disabled={!selectedEmployeeId}
                className={`rounded-lg px-5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  activeTab === "history"
                    ? "bg-[#EEEAFE] text-[#7654E8]"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                History
              </button>
            </div>

            {/* APPLY TAB */}
            {activeTab === "apply" && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* LEAVE TYPE + DATES */}
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
                        const selectedLeaveType = leaveTypes.find(
                          (leave) => String(leave.ID) === field.value,
                        );

                        const selectedBalance =
                          availableEmployeeLeaveTypes.find(
                            (balance) =>
                              balance.LeaveName?.trim().toLowerCase() ===
                              selectedLeaveType?.Name?.trim().toLowerCase(),
                          );

                        const selectedName =
                          selectedLeaveType?.Name ?? selectedBalance?.LeaveName;
                        return (
                          <div ref={leaveTypeRef} className="relative">
                            <button
                              type="button"
                              disabled={
                                !selectedEmployeeId || leaveTypesLoading
                              }
                              onClick={() =>
                                setLeaveTypeOpen((previous) => !previous)
                              }
                              className="flex h-11 w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-4 text-sm disabled:cursor-not-allowed disabled:bg-slate-50"
                            >
                              <span
                                className={
                                  selectedName
                                    ? "text-slate-800"
                                    : "text-slate-400"
                                }
                              >
                                {leaveTypesLoading
                                  ? "Loading..."
                                  : selectedName ?? "Select Leave Type"}
                              </span>

                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            </button>

                            {leaveTypeOpen && (
                              <div className="absolute z-50 mt-2 max-h-31 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                                {leaveTypes.length > 0 ? (
                                  leaveTypes.map((leaveType) => {
                                    const matchingBalance =
                                      availableEmployeeLeaveTypes.find(
                                        (balance) =>
                                          balance.LeaveName?.trim().toLowerCase() ===
                                          leaveType.Name?.trim().toLowerCase(),
                                      );

                                    const balanceValue = Number(
                                      matchingBalance?.ClosingBalance ?? 0,
                                    );

                                    // Loss of Pay can always be applied,
                                    // regardless of available balance.
                                    const isLossOfPay =
                                      leaveType.Name?.trim().toLowerCase() ===
                                      "loss of pay";

                                    const isDisabled =
                                      !isLossOfPay && balanceValue <= 0;

                                    return (
                                      <button
                                        key={leaveType.ID}
                                        type="button"
                                        onClick={() => {
                                          field.onChange(String(leaveType.ID));
                                          setLeaveTypeOpen(false);
                                        }}
                                        disabled={isDisabled}
                                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                                          String(leaveType.ID) === field.value
                                            ? "bg-purple-50 font-semibold"
                                            : isDisabled
                                            ? "cursor-not-allowed text-slate-400"
                                            : "hover:bg-slate-50"
                                        }`}
                                      >
                                        <span>{leaveType.Name}</span>

                                        {/* <span
      className={
        isLossOfPay
          ? "font-semibold text-slate-500"
          : balanceValue > 0
            ? "font-semibold text-green-600"
            : "text-slate-400"
      }
    >
      {balanceValue}
    </span> */}
                                      </button>
                                    );
                                  })
                                ) : (
                                  <p className="px-3 py-2 text-sm text-slate-500">
                                    No leave types available
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      }}
                    />

                    {errors.leaveType && (
                      <p className="text-xs text-red-500">
                        {errors.leaveType.message}
                      </p>
                    )}
                  </div>

                  {/* From Date */}
                  <div className="space-y-2">
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
                          disabled={!selectedEmployeeId}
                        />
                      )}
                    />

                    {errors.fromDate && (
                      <p className="text-xs text-red-500">
                        {errors.fromDate.message}
                      </p>
                    )}
                  </div>

                  {/* To Date */}
                  <div className="space-y-2">
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
                          onChange={field.onChange}
                          min={fromDate || minFromDateIso()}
                          max={maxApplyDateIso()}
                          disabled={!selectedEmployeeId}
                          align="right"
                          initialMonth={fromDate}
                        />
                      )}
                    />

                    {errors.toDate && (
                      <p className="text-xs text-red-500">
                        {errors.toDate.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* HALF DAY */}
                {isSingleDay && (
                  <div className="space-y-3 rounded-xl bg-blue-50 p-4">
                    <Label>Half Day</Label>

                    <Controller
                      control={control}
                      name="sessionFrom"
                      render={({ field }) => (
                        <div className="flex gap-6">
                          <label className="flex cursor-pointer items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              value="First Half"
                              checked={field.value === "First Half"}
                              onChange={(event) => {
                                const selected = event.target.checked;
                                const session = selected ? "First Half" : "";
                                field.onChange(session);
                                setValue("isHalfDay", selected);
                                setValue("sessionFrom", session);
                                setValue("sessionTo", session);
                              }}
                            />
                            First Half
                          </label>

                          <label className="flex cursor-pointer items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              value="Second Half"
                              checked={field.value === "Second Half"}
                              onChange={(event) => {
                                const selected = event.target.checked;
                                const session = selected ? "Second Half" : "";
                                field.onChange(session);
                                setValue("isHalfDay", selected);
                                setValue("sessionFrom", session);
                                setValue("sessionTo", session);
                              }}
                            />
                            Second Half
                          </label>
                        </div>
                      )}
                    />
                  </div>
                )}

                {/* REASON */}
                <div className="space-y-2">
                  <Label htmlFor="reason" className="flex items-center gap-1">
                    <PenLine className="h-3.5 w-3.5" />
                    Reason
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
                        onChange={(event) => field.onChange(event.target.value)}
                        placeholder="Enter the reason for leave..."
                        className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#7A5BED] focus:ring-1 focus:ring-[#7A5BED]"
                      />
                    )}
                  />

                  {errors.reason && (
                    <p className="text-xs text-red-500">
                      {errors.reason.message}
                    </p>
                  )}
                </div>

                {/* ATTACHMENT */}
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
                          onChange={(event) =>
                            field.onChange(event.target.files?.[0] ?? null)
                          }
                          className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                        />
                      )}
                    />

                    <p className="text-xs text-slate-500">
                      Upload JPG, PNG, PDF, DOC or DOCX (Max 5 MB)
                    </p>

                    {errors.attachment && (
                      <p className="text-xs text-red-500">
                        {errors.attachment.message}
                      </p>
                    )}
                  </div>
                )}

                {/* TOTAL DAYS */}
                {/* {totalDays > 0 && (
                  <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                    Total Days:{" "}
                    <span className="font-semibold text-slate-800">
                      {totalDays}
                    </span>
                  </div>
                )} */}

                {/* BUTTONS */}
                <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmittingForEmployee}
                    onClick={() => {
                      reset(DEFAULT_VALUES);

                      setSelectedEmployeeId("");
                    }}
                  >
                    Reset
                  </Button>

                  <Button
                    type="submit"
                    disabled={
                      !selectedEmployeeId ||
                      isSubmittingForEmployee ||
                      leaveTypesLoading
                    }
                    className="min-w-[150px] rounded-xl"
                  >
                    {isSubmittingForEmployee ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </form>
            )}

            {/* SUMMARY TAB */}
            {activeTab === "summary" && (
              <LeaveSummaryTable
                balances={employeeDetails?.employeeLeaveBalance ?? []}
                loading={employeeDetailsLoading}
              />
            )}

            {/* HISTORY TAB */}
            {activeTab === "history" && (
              <LeaveHistoryTable
                history={employeeDetails?.employeeLeaveHistory ?? []}
                loading={employeeDetailsLoading}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, ChevronDown, PenLine, Tags } from "lucide-react";
import { toast } from "react-toastify";
 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useGetHolidayListQuery } from "@/features/employee/dashboard/api/dashboardApi";
import {
  useGetEmployeeLeaveDetailsQuery,
  useGetLeaveTypesQuery,
  useGetReportingEmployeesQuery,
} from "../api/leaveApi";
import ApplyForEmployeeSelector from "./ApplyForEmployeeSelector";
import DateField from "./DateField";
import EmployeeInfoCard from "./EmployeeInfoCard";
import LeaveBalanceCard from "./LeaveBalanceCard";
import { useHrApplyLeave } from "../hooks/useHRApplyLeave";
import {
  maxApplyDateIso,
  minFromDateIso,
} from "../constants/leave.constants";
import { makeLeaveApplySchema } from "../validation/leaveValidation";
import type {
  EmployeeLeaveBalanceRow,
  EmployeeLeaveHistoryRow,
  LeaveApplyForm,
  LeaveBalanceSection,
} from "../types/leave.types";
 
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
 
type ActiveTab = "apply" | "summary" | "history";
 
function toBalanceSection(
  balances: EmployeeLeaveBalanceRow[],
): LeaveBalanceSection {
  return {
    title: "Leave Balance",
    records: balances.map((balance) => ({
      fields: [
        { label: "Leave Type", value: balance.LeaveName },
        { label: "Opening Balance", value: balance.OpeningBalance },
        { label: "Accrued", value: balance.Accrued },
        { label: "Availed", value: balance.Availed },
        { label: "Adjusted", value: balance.Adjusted },
        { label: "Encashed", value: balance.Encashed },
        { label: "Closing Balance", value: balance.ClosingBalance },
      ],
    })),
  };
}
 
function EmployeeLeaveSummary({ balances }: { balances: EmployeeLeaveBalanceRow[] }) {
  if (balances.length === 0) {
    return <p className="py-10 text-center text-sm text-slate-500">No leave summary available.</p>;
  }
 
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full text-sm">
        <thead className="bg-[#7A5BED] text-white">
          <tr>
            {["Leave", "Opening Balance", "Accrued", "Availed", "Encashed", "Adjusted", "Balance"].map((heading) => (
              <th key={heading} className="whitespace-nowrap px-4 py-3 text-left font-semibold">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {balances.map((balance, index) => (
            <tr key={`${balance.LeaveName}-${index}`} className="border-b last:border-b-0">
              <td className="px-4 py-3 font-medium">{balance.LeaveName}</td>
              <td className="px-4 py-3">{balance.OpeningBalance ?? 0}</td>
              <td className="px-4 py-3">{balance.Accrued ?? 0}</td>
              <td className="px-4 py-3">{balance.Availed ?? 0}</td>
              <td className="px-4 py-3">{balance.Encashed ?? 0}</td>
              <td className="px-4 py-3">{balance.Adjusted ?? 0}</td>
              <td className="px-4 py-3">{balance.ClosingBalance ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
 
function EmployeeLeaveHistory({ history }: { history: EmployeeLeaveHistoryRow[] }) {
  if (history.length === 0) {
    return <p className="py-10 text-center text-sm text-slate-500">No leave history available.</p>;
  }
 
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full text-sm">
        <thead className="bg-[#7A5BED] text-white">
          <tr>
            {["Leave Type", "From Date", "To Date", "Days", "Applied Date", "Reason", "Status", "Approved By"].map((heading) => (
              <th key={heading} className="whitespace-nowrap px-4 py-3 text-left font-semibold">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {history.map((leave, index) => (
            <tr key={`${leave.LeaveId}-${index}`} className="border-b last:border-b-0">
              <td className="whitespace-nowrap px-4 py-3">{leave.LeaveTypeName}</td>
              <td className="whitespace-nowrap px-4 py-3">{leave.FromDate}</td>
              <td className="whitespace-nowrap px-4 py-3">{leave.ToDate}</td>
              <td className="px-4 py-3">{leave.NoOfDays}</td>
              <td className="whitespace-nowrap px-4 py-3">{leave.AppliedDate}</td>
              <td className="px-4 py-3">{leave.Reason || "-"}</td>
              <td className="px-4 py-3">{leave.Status}</td>
              <td className="px-4 py-3">{leave.ActionBy || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
 
export default function ApplyLeaveForEmployee() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("apply");
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
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLeaveTypeOpen(false);
    };
 
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [leaveTypeOpen]);
 
  const {
    data: employees = [],
    isLoading: employeesLoading,
    isError: employeesError,
  } = useGetReportingEmployeesQuery();
  const {
    data: leaveTypes = [],
    isLoading: leaveTypesLoading,
  } = useGetLeaveTypesQuery(selectedEmployeeId, { skip: !selectedEmployeeId });
  const {
    data: employeeDetails,
    isLoading: employeeDetailsLoading,
    isError: employeeDetailsError,
    refetch: refetchEmployeeDetails,
  } = useGetEmployeeLeaveDetailsQuery(selectedEmployeeId, {
    skip: !selectedEmployeeId,
  });
  const { data: holidayResponse } = useGetHolidayListQuery();
  const { hrApplyLeave, isSubmittingForEmployee } = useHrApplyLeave();
 
  const holidayList = useMemo(
    () => holidayResponse?.data ?? [],
    [holidayResponse?.data],
  );
  const holidayDates = useMemo(
    () =>
      new Map(
        holidayList.map((holiday) => [
          holiday.HolidayDate.slice(0, 10),
          { name: holiday.HolidayName, isOptional: holiday.IsOptional },
        ]),
      ),
    [holidayList],
  );
  const blockedHolidayIsos = useMemo(
    () =>
      new Set(
        holidayList
          .filter((holiday) => !holiday.IsOptional)
          .map((holiday) => holiday.HolidayDate.slice(0, 10)),
      ),
    [holidayList],
  );
 
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<LeaveApplyForm>({
    resolver: zodResolver(makeLeaveApplySchema(blockedHolidayIsos)),
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched",
  });
 
  const fromDate = useWatch({ control, name: "fromDate" });
  const toDate = useWatch({ control, name: "toDate" });
  const sessionFrom = useWatch({ control, name: "sessionFrom" });
  const isSingleDay = Boolean(fromDate && toDate && fromDate === toDate);
  const selectedEmployee = employees.find(
    (employee) => employee.EmployeeID === selectedEmployeeId,
  ) ?? null;
  const balances = employeeDetails?.employeeLeaveBalance ?? [];
  const history = employeeDetails?.employeeLeaveHistory ?? [];
 
  const changeEmployee = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
    setActiveTab("apply");
    setLeaveTypeOpen(false);
    reset(DEFAULT_VALUES);
  };
 
  const onSubmit = async (data: LeaveApplyForm) => {
    if (!selectedEmployeeId) {
      toast.error("Select an employee before submitting.");
      return;
    }
 
    const response = await hrApplyLeave({
      employeeId: selectedEmployeeId,
      leaveTypeId: Number(data.leaveType),
      fromDate: data.fromDate,
      toDate: data.toDate,
      reason: data.reason,
      isHalfDay: data.isHalfDay ? "true" : "false",
      sessionFrom: data.sessionFrom,
      sessionTo: data.sessionTo,
      attachment: data.attachment,
      isHRForceApply: 0,
    });
 
    if (response) {
      await refetchEmployeeDetails();
      reset(DEFAULT_VALUES);
    }
  };
 
  return (
    <div className="w-full">
      <div className="grid w-full gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className="space-y-6">
          <Card className="overflow-visible rounded-2xl border border-slate-200 shadow-sm">
            <CardContent className="p-5">
              <ApplyForEmployeeSelector
                id="employee-leave-selector"
                employees={employees}
                value={selectedEmployeeId}
                onChange={changeEmployee}
                loading={employeesLoading}
                placeholder="Search employee..."
              />
              {employeesError && (
                <p className="mt-2 text-sm text-red-600">
                  Could not load reporting employees.
                </p>
              )}
            </CardContent>
          </Card>
 
          {selectedEmployee && (
            <>
              <EmployeeInfoCard
                employee={selectedEmployee}
                details={employeeDetails?.employeeDetails?.[0] ?? null}
                loading={employeeDetailsLoading}
              />
              <LeaveBalanceCard balances={toBalanceSection(balances)} />
            </>
          )}
          {employeeDetailsError && (
            <p className="text-sm text-red-600">Could not load employee leave details.</p>
          )}
        </div>
 
        <Card className="min-h-[388px] overflow-visible rounded-2xl border border-indigo-100 shadow-sm">
          <CardHeader className="border-b border-slate-100">
            <CardTitle className="text-lg font-bold">Apply Leave for Employee</CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="mb-6 flex items-center gap-2">
              {(["apply", "summary", "history"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  disabled={tab !== "apply" && !selectedEmployeeId}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-5 py-2 text-sm font-medium capitalize transition ${
                    activeTab === tab
                      ? "bg-[#EEEAFE] text-[#7654E8]"
                      : "text-slate-700 hover:bg-slate-100"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {tab}
                </button>
              ))}
            </div>
 
            {activeTab === "apply" && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="leaveType" className="flex items-center gap-1">
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
                              aria-haspopup="listbox"
                              aria-expanded={leaveTypeOpen}
                              disabled={!selectedEmployeeId || leaveTypesLoading}
                              onClick={() =>
                                setLeaveTypeOpen((previous) => !previous)
                              }
                              className="flex h-[47px] w-full items-center justify-between rounded-xl border border-slate-300 bg-white px-4 text-sm disabled:cursor-not-allowed disabled:bg-slate-50"
                            >
                              <span
                                className={
                                  selectedName ? "text-slate-800" : "text-slate-400"
                                }
                              >
                                {leaveTypesLoading
                                  ? "Loading leave types..."
                                  : selectedName ?? "Select Leave Type"}
                              </span>
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            </button>
 
                            {leaveTypeOpen && (
                              <div
                                role="listbox"
                                className="absolute z-50 mt-2 max-h-[112px] w-full overflow-y-auto rounded-xl border border-slate-300 bg-white p-1 shadow-lg"
                                style={{
                                  scrollbarWidth: "thin",
                                  scrollbarColor: "#94a3b8 #e2e8f0",
                                }}
                              >
                                {leaveTypes.length > 0 ? (
                                  leaveTypes.map((leave) => (
                                    <button
                                      key={leave.ID}
                                      type="button"
                                      role="option"
                                      aria-selected={String(leave.ID) === field.value}
                                      onClick={() => {
                                        field.onChange(String(leave.ID));
                                        setLeaveTypeOpen(false);
                                      }}
                                      className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${
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
                      <p className="text-sm text-red-500">{errors.leaveType.message}</p>
                    )}
                  </div>
 
                  <div className="space-y-2">
                    <Label htmlFor="fromDate" className="flex items-center gap-1">
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
                          readOnly
                          min={minFromDateIso()}
                          max={maxApplyDateIso()}
                          holidays={holidayDates}
                        />
                      )}
                    />
                    {errors.fromDate && (
                      <p className="text-sm text-red-500">{errors.fromDate.message}</p>
                    )}
                  </div>
 
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
                          readOnly
                          min={fromDate || minFromDateIso()}
                          max={maxApplyDateIso()}
                          initialMonth={fromDate}
                          holidays={holidayDates}
                        />
                      )}
                    />
                    {errors.toDate && (
                      <p className="text-sm text-red-500">{errors.toDate.message}</p>
                    )}
                  </div>
                </div>
 
                {isSingleDay && (
                  <div className="space-y-3 rounded-xl bg-blue-50 p-4">
                    <Label className="font-medium">Half Day</Label>
                    <div className="flex gap-6">
                      {["First Half", "Second Half"].map((session) => (
                        <label key={session} className="flex cursor-pointer items-center gap-2">
                          <input
                            type="checkbox"
                            checked={sessionFrom === session}
                            onChange={(event) => {
                              const value = event.target.checked ? session : "";
                              setValue("isHalfDay", Boolean(value));
                              setValue("sessionFrom", value);
                              setValue("sessionTo", value);
                            }}
                          />
                          {session}
                        </label>
                      ))}
                    </div>
                  </div>
                )}
 
                <div className="space-y-2">
                  <Label htmlFor="reason" className="flex items-center gap-1">
                    <PenLine className="h-3.5 w-3.5" />
                    Reason <span className="font-normal text-slate-500">(Optional)</span>
                  </Label>
                  <Controller
                    control={control}
                    name="reason"
                    render={({ field }) => (
                      <textarea
                        {...field}
                        id="reason"
                        rows={3}
                        disabled={!selectedEmployeeId || isSubmittingForEmployee}
                        placeholder="Enter the reason for the leave..."
                        className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7A5BED]"
                      />
                    )}
                  />
                </div>
 
                <div className="flex flex-wrap justify-end gap-4 border-t border-slate-100 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmittingForEmployee}
                    onClick={() => reset(DEFAULT_VALUES)}
                    className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    disabled={!selectedEmployeeId || isSubmittingForEmployee || leaveTypesLoading}
                    className="min-w-[150px] rounded-xl bg-[#7c3aed] text-white shadow-md hover:bg-[#6d28d9]"
                  >
                    {isSubmittingForEmployee ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </form>
            )}
 
            {activeTab === "summary" && (
              <EmployeeLeaveSummary balances={balances} />
            )}
            {activeTab === "history" && (
              <EmployeeLeaveHistory history={history} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

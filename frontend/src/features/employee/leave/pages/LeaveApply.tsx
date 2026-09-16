import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Tags, CalendarDays, PenLine } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";

import DateField from "../components/DateField";

import LeaveBalanceCard from "../components/LeaveBalanceCard";

import { useLeave } from "../hooks/useLeave";
import { useApplyLeave } from "../hooks/useApplyLeave";
import { useHrApplyLeave } from "../hooks/useHrApplyLeave";
import {
  useGetReportingEmployeesQuery,
  useGetEmployeeLeaveDetailsQuery,
} from "../api/leaveApi";
import { useGetProfileInfoQuery } from "../../profile/api/profileApi";
import ApplyForEmployee from "../components/Applyforemployee";
import EmployeeInfoCard from "../components/EmployeeInfoCard";
import LeaveSummaryTable from "../components/LeaveSummaryTable";
import LeaveHistoryTable from "../components/LeaveHistoryTable";

import { leaveApplySchema } from "../validation/leaveValidation";
import { minFromDateIso, maxApplyDateIso } from "../constants/leave.constants";

import type { LeaveApplyForm } from "../types/leave.types";

const APPLY_FOR_EMPLOYEE_ALLOWED = ["294663"];

function SelectEmployeeFirst() {
  return (
    <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
      <p className="text-sm text-slate-500">Select an employee to view this.</p>
    </div>
  );
}

const TABS = [
  { id: "apply", label: "Apply" },
  { id: "summary", label: "Summary" },
  { id: "history", label: "History" },
] as const;

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

  const forceApplyForEmployee = Boolean(
    (location.state as { forceApplyForEmployee?: boolean } | null)
      ?.forceApplyForEmployee,
  );
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

  const { hrApplyLeave, isSubmittingForEmployee } = useHrApplyLeave();

  const { data: profile } = useGetProfileInfoQuery();

  const myEmployeeId = profile?.sections
    .find((section) => section.title === "Personal Information")
    ?.fields?.find((field) => field.label === "Employee ID")?.value;

  const canApplyForEmployee = APPLY_FOR_EMPLOYEE_ALLOWED.includes(
    String(myEmployeeId ?? ""),
  );

  const { data: reportingEmployees = [], isLoading: employeesLoading } =
    useGetReportingEmployeesQuery(undefined, {
      skip: !canApplyForEmployee,
    });

  const [applyForEmployee, setApplyForEmployee] = useState(false);

  const [applyForEmployeeId, setApplyForEmployeeId] = useState("");

  // canApplyForEmployee depends on the profile fetch, so it isn't known on
  // the first render yet — force HR mode on once it resolves true.
  useEffect(() => {
    if (forceApplyForEmployee && canApplyForEmployee) {
      setApplyForEmployee(true);
    }
  }, [forceApplyForEmployee, canApplyForEmployee]);

  const wasForced = useRef(forceApplyForEmployee);
  useEffect(() => {
    if (wasForced.current && !forceApplyForEmployee) {
      setApplyForEmployee(false);
      setApplyForEmployeeId("");
      setActiveTab("apply");
    }
    wasForced.current = forceApplyForEmployee;
  }, [forceApplyForEmployee]);

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

  const [activeTab, setActiveTab] =
    useState<(typeof TABS)[number]["id"]>("apply");

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
    console.log("onSubmit called");
    console.log(data);

    console.log("Calling Apply API...");

    const isHalfDay =
      data.sessionFrom === "First Half" || data.sessionFrom === "Second Half";

    console.log("Before API");
    console.log({
      sessionFrom: data.sessionFrom,
      sessionTo: data.sessionTo,
      isHalfDay,
    });

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

    const response = applyForEmployeeId
      ? await hrApplyLeave({
          ...payload,
          employeeId: applyForEmployeeId,
        })
      : await applyLeave(payload);

    if (response) {
      if (applyForEmployeeId) {
        await refetchEmployeeDetails();
      } else {
        await refetchLeaveBalance();
        await refetchLeaveHistory();
        await refetchLeaveStatus();
      }

      reset(DEFAULT_VALUES);
      setApplyForEmployeeId("");
      navigate(`/${location.pathname.split("/")[1]}/employee/leave/status`);
    }
  };

  const selectedEmployee = reportingEmployees.find(
    (employee) => employee.EmployeeID === applyForEmployeeId,
  );

  const {
    data: employeeDetails,
    isLoading: employeeDetailsLoading,
    refetch: refetchEmployeeDetails,
  } = useGetEmployeeLeaveDetailsQuery(applyForEmployeeId, {
    skip: !applyForEmployeeId,
  });

  // Reshaped into the label/value form the balance and history components
  // already render, so both data sources share one set of components.
  const employeeBalanceSection = employeeDetails
    ? {
        title: "Leave Balance",
        records: employeeDetails.employeeLeaveBalance.map((row) => ({
          fields: [
            { label: "Leave Type", value: row.LeaveName },
            { label: "Opening Balance", value: row.OpeningBalance },
            { label: "Accrued", value: row.Accrued },
            { label: "Availed", value: row.Availed },
            { label: "Adjusted", value: row.Adjusted },
            { label: "Encashed", value: row.Encashed },
            { label: "Closing Balance", value: row.ClosingBalance },
          ],
        })),
      }
    : null;

  const employeeHistorySection = employeeDetails
    ? {
        title: "Leave History",
        records: employeeDetails.employeeLeaveHistory.map((row) => ({
          fields: [
            { label: "Leave Type", value: row.LeaveTypeName },
            { label: "From Date", value: row.FromDate },
            { label: "To Date", value: row.ToDate },
            { label: "Days", value: row.NoOfDays },
            { label: "Applied Date", value: row.AppliedDate },
            { label: "Reason", value: row.Reason },
            { label: "Status", value: row.Status },
            { label: "Approved By", value: row.ActionBy },
          ],
        })),
      }
    : null;

  return (
    <div className="w-full px-4 sm:px-6">
      <div className="grid w-full gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-6">
          {applyForEmployee ? (
            <>
              <Card className="overflow-visible rounded-2xl border border-slate-200 shadow-sm">
                <CardContent className="p-5">
                  <ApplyForEmployee
                    id="applyFor"
                    employees={reportingEmployees}
                    value={applyForEmployeeId}
                    onChange={setApplyForEmployeeId}
                    loading={employeesLoading}
                    placeholder="Search employee..."
                  />
                </CardContent>
              </Card>

              {selectedEmployee && (
                <>
                  <EmployeeInfoCard
                    employee={selectedEmployee}
                    details={employeeDetails?.employeeDetails[0] ?? null}
                    loading={employeeDetailsLoading}
                  />

                  <LeaveBalanceCard balances={employeeBalanceSection} />
                </>
              )}
            </>
          ) : (
            <LeaveBalanceCard balances={leaveBalance} />
          )}
        </div>

        <Card className="w-full overflow-visible rounded-2xl border border-indigo-100 shadow-sm">
          <div>
            <CardHeader className="border-b border-slate-100 pb-3">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <CardTitle className="text-lg font-bold tracking-tight sm:text-x">
                  Apply Leave
                </CardTitle>

                {/* <p className="mt-1 text-sm text-slate-500">
                  Submit your leave request for approval.
                </p> */}
              </div>
            </CardHeader>
          </div>

          {canApplyForEmployee && !forceApplyForEmployee && (
            <label className="hidden cursor-pointer items-center gap-2 whitespace-nowrap text-base font-medium text-slate-700">
              Apply for employee
              <input
                type="checkbox"
                checked={applyForEmployee}
                onChange={(e) => {
                  setApplyForEmployee(e.target.checked);

                  // Leaving the mode resets both the target and the tab.
                  if (!e.target.checked) {
                    setApplyForEmployeeId("");
                    setActiveTab("apply");
                  }
                }}
                className="h-4 w-4 rounded border-slate-300"
              />
            </label>
          )}

          <div>
            {applyForEmployee && (
              <div className="mt-4 flex flex-wrap gap-2">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-lg px-6 py-2 text-sm font-medium transition ${
                      activeTab === tab.id
                        ? "bg-[#7A5BED]/10 text-[#7A5BED]"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
            {canApplyForEmployee && !forceApplyForEmployee && (
              <label className="hidden cursor-pointer items-center gap-2 whitespace-nowrap text-base font-medium text-slate-700">
                Apply for employee
                <input
                  type="checkbox"
                  checked={applyForEmployee}
                  onChange={(e) => {
                    setApplyForEmployee(e.target.checked);

                    // Leaving the mode resets both the target and the tab.
                    if (!e.target.checked) {
                      setApplyForEmployeeId("");
                      setActiveTab("apply");
                    }
                  }}
                  className="h-4 w-4 rounded border-slate-300"
                />
              </label>
            )}
          </div>

          <CardContent className="relative space-y-4 overflow-visible p-4">
            {/* Both tabs belong to the picked employee, so they stay empty
                until one is chosen rather than falling back to own data. */}
            {activeTab === "summary" &&
              (selectedEmployee ? (
                <LeaveSummaryTable
                  balances={employeeBalanceSection}
                  loading={employeeDetailsLoading}
                />
              ) : (
                <SelectEmployeeFirst />
              ))}

            {activeTab === "history" &&
              (selectedEmployee ? (
                <LeaveHistoryTable
                  section={employeeHistorySection}
                  loading={employeeDetailsLoading}
                  refetchLeaveHistory={refetchEmployeeDetails}
                />
              ) : (
                <SelectEmployeeFirst />
              ))}

            {activeTab === "apply" && (
              <form
                onSubmit={handleSubmit(onSubmit, (errors) => {
                  console.log("Validation Errors:", errors);
                })}
                className="space-y-6"
              >
                {/* Dates */}

                {/* ✅ STYLING CHANGE — grid-cols-2 → grid-cols-3 so Leave Type, From Date, To Date sit on ONE row on md+ screens (was: md:grid-cols-2, which pushed To Date to a second row) */}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* Leave Type */}

                  {/* ✅ STYLING CHANGE — removed "md:col-span-2" so Leave Type takes 1 of 3 columns instead of the full row (was: className="space-y-2 md:col-span-2") */}

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

                    {/* Controller will go here */}
                    <Controller
                      control={control}
                      name="sessionFrom"
                      render={({ field }) => (
                        // radio buttons
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
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

                          <label className="flex items-center gap-2 cursor-pointer">
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
                        className="
w-full
resize-none
rounded-xl
border
border-slate-300
bg-white
px-4
py-3
text-sm
transition
focus:outline-none
focus:ring-2
focus:ring-[#7A5BED]
"
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
                          className="
            block
            w-full
            rounded-xl
            border
            border-slate-300
            bg-white
            px-3
            py-2
            text-sm
          "
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
                    disabled={
                      isSubmitting ||
                      isSubmittingForEmployee ||
                      leaveTypesLoading ||
                      (applyForEmployee && !applyForEmployeeId)
                    }
                    className="min-w-[150px] rounded-xl shadow-md"
                    style={{
                      backgroundColor: "#7c3aed",
                      color: "#fff",
                    }}
                  >
                    {isSubmitting || isSubmittingForEmployee
                      ? "Submitting..."
                      : "Submit"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

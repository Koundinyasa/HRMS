
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import DateField from "../components/DateField";
import { useNavigate, useParams } from "react-router-dom";
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

  attachment: null
};

export default function LeaveApply() {
  const {
    leaveTypes,
    leaveTypesLoading,
    leaveBalance,
    refetchLeaveBalance,
    refetchLeaveHistory,
    refetchLeaveStatus,
  } = useLeave();

  const {
    applyLeave,
    isSubmitting,
  } = useApplyLeave();

  const navigate = useNavigate();

  const { domain } = useParams();

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

  const isSingleDay =
    fromDate &&
    toDate &&
    fromDate === toDate;

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
        (new Date(toDate).getTime() -
          new Date(fromDate).getTime()) /
        (1000 * 60 * 60 * 24)
      ) + 1
      : 0;

  // From Date opens a week back; To Date can never precede From Date.
  const minFromDate = minFromDateIso();
  const minToDate = fromDate || minFromDate;

  const onSubmit = async (
    data: LeaveApplyForm
  ) => {
    console.log("onSubmit called");
    console.log(data);

    console.log("Calling Apply API...");

    const isHalfDay =
      data.sessionFrom === "First Half" ||
      data.sessionFrom === "Second Half";

    console.log("Before API");
    console.log({
      sessionFrom: data.sessionFrom,
      sessionTo: data.sessionTo,
      isHalfDay,
    });

    const response = await applyLeave({
      leaveTypeId: Number(data.leaveType),
      fromDate: data.fromDate,
      toDate: data.toDate,
      reason: data.reason,
      isHalfDay: isHalfDay ? "true" : "false",
      sessionFrom: data.sessionFrom,
      sessionTo: data.sessionTo,
      attachment: data.attachment,
    });

    if (response) {
      await refetchLeaveBalance();
      await refetchLeaveHistory();
      await refetchLeaveStatus();

      reset(DEFAULT_VALUES);

      setTimeout(() => {
        navigate(`/${domain}/employee/leave/status`);
      }, 1500);
    }
  };

  console.log("Leave Balance:", leaveBalance);
  return (
    <div className="w-full px-6">
      <div className="grid w-full gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">



        <LeaveBalanceCard balances={leaveBalance} />

        <Card className="w-full min-h-[520px] rounded-2xl border border-slate-200 shadow-sm">

          <CardHeader className="border-b border-slate-100 pb-4">

            <CardTitle className="text-3xl font-bold tracking-tight">
              Apply Leave
            </CardTitle>

            <p className="mt-1 text-sm text-slate-500">
              Submit your leave request for approval.
            </p>

          </CardHeader>

          <CardContent className="space-y-6 p-6">

            <form
              onSubmit={handleSubmit(
                onSubmit,
                (errors) => {
                  console.log("Validation Errors:", errors);
                }
              )}
              className="space-y-6"
            >



              {/* Dates */}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                {/* Leave Type */}

                <div className="space-y-2">

                  <Label htmlFor="leaveType">
                    Leave Type
                  </Label>

                  <Controller
                    control={control}
                    name="leaveType"
                    render={({ field }) => (

                      <select
                        id="leaveType"
                        value={field.value}
                        disabled={
                          leaveTypesLoading ||
                          isSubmitting
                        }
                        onChange={(e) =>
                          field.onChange(e.target.value)
                        }
                        className="
w-full
h-12
rounded-xl
border
border-slate-300
bg-white
px-4
text-sm
transition
focus:outline-none
focus:ring-2
focus:ring-blue-500
"
                      >
                        {field.value === "" && (
                          <option value="" >
                            Select Leave Type
                          </option>
                        )}

                        {leaveTypes.map((leave) => (
                          <option
                            key={leave.ID}
                            value={leave.ID}
                          >
                            {leave.Name}
                          </option>
                        ))}

                      </select>

                    )}
                  />

                  {errors.leaveType && (
                    <p className="text-sm text-red-500">
                      {errors.leaveType.message}
                    </p>
                  )}

                </div>


                {/* From Date */}

                <div className="space-y-2">
                  <Label htmlFor="fromDate">
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

                <div className="space-y-2">
                  <Label htmlFor="toDate">
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
                  <Label className="font-medium">
                    Half Day
                  </Label>

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

                <Label htmlFor="reason">
                  Reason
                  <span className="ml-1 font-normal text-slate-500">
                    (Optional)
                  </span>
                </Label>

                <Controller
                  control={control}
                  name="reason"
                  render={({ field }) => (
                    <textarea
                      id="reason"
                      rows={4}
                      value={field.value}
                      disabled={isSubmitting}
                      placeholder="Enter the reason for your leave..."
                      onChange={(e) =>
                        field.onChange(e.target.value)
                      }
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
focus:ring-blue-500
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

                  <Label htmlFor="attachment">
                    Medical Certificate
                  </Label>

                  <Controller
                    control={control}
                    name="attachment"
                    render={({ field }) => (
                      <input
                        id="attachment"
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                        onChange={(e) =>
                          field.onChange(
                            e.target.files?.[0] ?? null
                          )
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

              <div className="flex justify-end gap-4 border-t border-slate-100 pt-4">

                <Button
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() =>
                    reset(DEFAULT_VALUES)
                  }
                >
                  Reset
                </Button>

                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    leaveTypesLoading
                  }
                  className="min-w-[150px] rounded-xl shadow-md"
                  style={{
                    backgroundColor: "var(--primary-color)",
                    color: "#fff",
                  }}
                >
                  {isSubmitting
                    ? "Submitting..."
                    : "Submit"}
                </Button>

              </div>

            </form>

          </CardContent>

        </Card>

      </div>
    </div>
  );
}
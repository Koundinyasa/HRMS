import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import DatePicker from "@/components/ui/datepicker";
import { useLeave } from "../hooks/useLeave";
import { useDateField } from "../hooks/useDateField";
import { applyLeaveHrSchema, type ApplyLeaveHrFormValues } from "../validation/leaveSchema";

function DateField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (iso: string) => void;
  error?: string;
}) {
  const picker = useDateField(value, onChange);
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-slate-800">
        {label}
        <span className="text-red-500">*</span>
      </span>
      <DatePicker {...picker} placeholder="DD-MM-YYYY" isInvalid={!!error} />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

export default function LeaveApplyPage() {
  const { leaveTypes, selectedEmployee, selectedEmployeeId, applyLeaveAsHr, applyLeaveAsHrState } =
    useLeave();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplyLeaveHrFormValues>({
    resolver: zodResolver(applyLeaveHrSchema),
    values: {
      employeeId: selectedEmployeeId ?? "",
      leaveTypeId: "",
      fromDate: "",
      toDate: "",
    },
  });

  const onSubmit = async (values: ApplyLeaveHrFormValues) => {
    try {
      await applyLeaveAsHr(values).unwrap();
      toast.success("Leave applied");
      reset();
    } catch {
      toast.error("Could not apply leave");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-md p-4 sm:p-6 shadow-sm min-h-[420px] flex flex-col gap-6"
    >
      <p className="text-sm text-slate-600">
        Applying for:{" "}
        <span className="font-semibold text-slate-800">
          {selectedEmployee ? `${selectedEmployee.name} (${selectedEmployee.code})` : "no one selected"}
        </span>
      </p>
      {errors.employeeId && <span className="text-xs text-red-500">{errors.employeeId.message}</span>}

      <div className="grid gap-6 md:grid-cols-3 items-start">
        <div className="flex flex-col gap-2">
          <span className="text-sm text-slate-800">
            Leave Type<span className="text-red-500">*</span>
          </span>
          <select
            {...register("leaveTypeId")}
            className="h-12 rounded-xl border border-slate-800 bg-white px-4 text-sm text-slate-800"
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.data?.map((t) => (
              <option key={t.leaveTypeId} value={t.leaveTypeId}>
                {t.name} ({t.code})
              </option>
            ))}
          </select>
          {errors.leaveTypeId && <span className="text-xs text-red-500">{errors.leaveTypeId.message}</span>}
        </div>

        <Controller
          control={control}
          name="fromDate"
          render={({ field }) => (
            <DateField
              label="From Date"
              value={field.value}
              onChange={field.onChange}
              error={errors.fromDate?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="toDate"
          render={({ field }) => (
            <DateField
              label="To Date"
              value={field.value}
              onChange={field.onChange}
              error={errors.toDate?.message}
            />
          )}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-auto">
        <button
          type="submit"
          disabled={applyLeaveAsHrState.isLoading}
          className="bg-indigo-600 text-white text-sm font-semibold px-8 py-2.5 rounded-lg disabled:opacity-60"
        >
          {applyLeaveAsHrState.isLoading ? "Applying..." : "Apply"}
        </button>

        <button
          type="button"
          onClick={() => reset()}
          disabled={applyLeaveAsHrState.isLoading}
          className="border border-slate-300 text-slate-700 text-sm font-semibold px-8 py-2.5 rounded-lg hover:bg-slate-50 disabled:opacity-60"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

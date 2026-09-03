import {
  Calendar,
  CalendarDays,
  Building2,
  RotateCcw,
  TrendingUp,
  MapPinned,
  Languages,
  Landmark,
  Wallet,
  Clock3,
  Info,
  Grid3X3,
  User,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StyledSelect } from "@/components/ui/select";
import { MonthPicker } from "@/components/ui/monthpicker";

import { usePayrollSettings } from "./hooks/usePayrollSettings";

export default function PayrollSettings() {
  const {
    formData,
    setFormData,
    isLoading,
    isSaving,
    toggleModule,
    handleSave,
    handleCancel,
  } = usePayrollSettings();

  if (isLoading) {
    return (
      <div className="text-sm text-slate-500 p-6">
        Loading payroll settings…
      </div>
    );
  }

  const payCycleDays = Array.from({ length: 31 }, (_, index) => String(index + 1));

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
        <div className="space-y-4 sm:space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-md sm:px-6 sm:py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                <CalendarDays className="h-5 w-5 text-violet-600" />
              </div>
              <span className="text-sm font-medium text-gray-800 sm:text-[15px]">
                Pay Cycle Start Date
              </span>
            </div>

            <StyledSelect
              value={formData.payCycleDate}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  payCycleDate: value,
                }))
              }
              options={payCycleDays}
              className="!h-10 !w-20"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-md sm:px-6 sm:py-5">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={formData.companyRoleCreation}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    companyRoleCreation: checked === true,
                  }))
                }
                className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
              <span className="text-sm font-medium text-gray-800 sm:text-[15px]">
                Company-wise Role Creation
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm font-medium text-violet-600">
              <Info className="h-4 w-4" />
              <span>Mandatory Setting</span>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white shadow-md">
            <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 sm:px-6">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                <Grid3X3 className="h-5 w-5 text-violet-600" />
              </div>
              <h2 className="text-[16px] font-semibold text-gray-800">
                Enable Modules
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-x-4 gap-y-4 p-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-5 sm:p-6 lg:grid-cols-3">
              {(
                [
                  ["attendance", "Time And Attendance", Clock3],
                  ["loan", "Loan", Landmark],
                  ["insurance", "Insurance", Building2],
                  ["advance", "Advance", Wallet],
                  ["arrear", "Arrear", RotateCcw],
                  ["bonus", "Bonus", TrendingUp],
                  ["reimbursement", "Reimbursement", Wallet],
                  ["disbursement", "Disbursement", Wallet],
                  ["costCenter", "Cost Center", MapPinned],
                  ["additionalSalary", "Additional Salary", Wallet],
                  ["attendanceIntegration", "Attendance Integration", Languages],
                ] as const
              ).map(([key, label, Icon]) => (
                <label
                  key={key}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Checkbox
                    checked={formData.modules[key]}
                    onCheckedChange={() => toggleModule(key)}
                    className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <Icon className="h-4 w-4 text-violet-600 shrink-0" />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white shadow-md">
          <div className="space-y-5 p-4 sm:space-y-6 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-violet-600" />
                <span className="text-sm font-medium text-gray-700">
                  Effective From
                </span>
              </div>

              <div className="w-full max-w-[220px] sm:w-[180px]">
                <MonthPicker
                  value={formData.effectiveFrom}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      effectiveFrom: value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-violet-500" />
                <Label className="text-sm font-medium text-gray-700">
                  Holidays Defined On
                </Label>
              </div>
              <StyledSelect
                value={formData.holidayDefinedOn}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    holidayDefinedOn: value,
                  }))
                }
                options={["None", "Head Office", "Branch Office"]}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-violet-500" />
                <Label className="text-sm font-medium text-gray-700">
                  Weekly Holiday Defined On
                </Label>
              </div>
              <StyledSelect
                value={formData.weeklyHoliday}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    weeklyHoliday: value,
                  }))
                }
                options={["None", "Sunday", "Saturday"]}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-violet-500" />
                <Label className="text-sm font-medium text-gray-700">
                  Net Salary Round Off
                </Label>
              </div>
              <StyledSelect
                value={formData.salaryRoundOff}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    salaryRoundOff: value,
                  }))
                }
                options={["Nearest Amount", "Nearest Rupee", "No Round Off"]}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-violet-500" />
                <Label className="text-sm font-medium text-gray-700">
                  Retirement Age
                </Label>
              </div>
              <Input
                value={formData.retirementAge}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    retirementAge: e.target.value,
                  }))
                }
                className="h-11 rounded-xl border border-gray-200"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Checkbox
                checked={formData.customPayslip}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({
                    ...prev,
                    customPayslip: checked === true,
                  }))
                }
                className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
              />
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-violet-500" />
                <span className="text-sm font-medium text-gray-700">
                  Custom Language Payslip
                </span>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end sm:pt-6">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="w-full rounded-xl px-6 sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full rounded-xl bg-violet-600 px-6 hover:bg-violet-700 sm:w-auto"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

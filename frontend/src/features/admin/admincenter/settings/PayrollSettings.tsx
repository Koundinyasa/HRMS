// import { useRef } from "react";
// import {
//   Calendar,
//   CalendarDays,
//   Building2,
//   RotateCcw,
//   TrendingUp,
//   MapPinned,
//   Languages,
//   Landmark,
//   Wallet,
//   Clock3,
//   Info,
//   Grid3X3,
//   User,
//   FileText,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// import { usePayrollSettings } from "./hooks/usePayrollSettings";

// export default function PayrollSettings() {
//   const {
//     formData,
//     setFormData,
//     isLoading,
//     isSaving,
//     toggleModule,
//     handleSave,
//     handleCancel,
//   } = usePayrollSettings();

//   const monthInputRef = useRef<HTMLInputElement>(null);

//   // Convert "Feb/2026" → "2026-02"
//   const getMonthValue = (value: string) => {
//     if (!value) return "";
//     const months: Record<string, string> = {
//       Jan: "01", Feb: "02", Mar: "03", Apr: "04",
//       May: "05", Jun: "06", Jul: "07", Aug: "08",
//       Sep: "09", Oct: "10", Nov: "11", Dec: "12",
//     };
//     const [month, year] = value.split("/");
//     return year && months[month] ? `${year}-${months[month]}` : "";
//   };

//   // Convert "2026-02" → "Feb/2026"
//   const formatMonth = (value: string) => {
//     if (!value) return "";
//     const [year, month] = value.split("-");
//     const months = [
//       "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//       "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//     ];
//     return `${months[Number(month) - 1]}/${year}`;
//   };

//   const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const formatted = formatMonth(e.target.value);
//     setFormData((prev) => ({
//       ...prev,
//       effectiveFrom: formatted,
//     }));
//   };

//   if (isLoading) {
//     return (
//       <div className="text-sm text-slate-500 p-6">Loading payroll settings…</div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#F8F7FC] p-6">
//       {/* Tab bar removed as requested */}

//       <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
//         {/* ==================== LEFT COLUMN ==================== */}
//         <div className="space-y-5">
//           {/* Pay Cycle Start Date */}
//           <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-md">
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
//                 <CalendarDays className="h-5 w-5 text-violet-600" />
//               </div>
//               <span className="text-[15px] font-medium text-gray-800">
//                 Pay Cycle Start Date
//               </span>
//             </div>

//             <select
//               value={formData.payCycleDate}
//               onChange={(e) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   payCycleDate: e.target.value,
//                 }))
//               }
//               className="h-10 w-20 rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-violet-500"
//             >
//               {Array.from({ length: 31 }, (_, index) => (
//                 <option key={index + 1} value={String(index + 1)}>
//                   {index + 1}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Company-wise Role Creation */}
//           <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-6 py-5 shadow-md">
//             <div className="flex items-center gap-3">
//               <Checkbox
//                 checked={formData.companyRoleCreation}
//                 onCheckedChange={(checked) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     companyRoleCreation: checked === true,
//                   }))
//                 }
//                 className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
//               />
//               <span className="text-[15px] font-medium text-gray-800">
//                 Company-wise Role Creation
//               </span>
//             </div>

//             <div className="flex items-center gap-2 text-sm font-medium text-violet-600">
//               <Info className="h-4 w-4" />
//               <span>Mandatory Setting</span>
//             </div>
//           </div>

//           {/* Enable Modules */}
//           <div className="rounded-2xl border border-gray-100 bg-white shadow-md">
//             <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
//               <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
//                 <Grid3X3 className="h-5 w-5 text-violet-600" />
//               </div>
//               <h2 className="text-[16px] font-semibold text-gray-800">
//                 Enable Modules
//               </h2>
//             </div>

//             <div className="grid grid-cols-2 gap-x-6 gap-y-5 p-6 lg:grid-cols-3">
//               {(
//                 [
//                   ["attendance", "Time And Attendance", Clock3],
//                   ["loan", "Loan", Landmark],
//                   ["insurance", "Insurance", Building2],
//                   ["advance", "Advance", Wallet],
//                   ["arrear", "Arrear", RotateCcw],
//                   ["bonus", "Bonus", TrendingUp],
//                   ["reimbursement", "Reimbursement", Wallet],
//                   ["disbursement", "Disbursement", Wallet],
//                   ["costCenter", "Cost Center", MapPinned],
//                   ["additionalSalary", "Additional Salary", Wallet],
//                   ["attendanceIntegration", "Attendance Integration", Languages],
//                 ] as const
//               ).map(([key, label, Icon]) => (
//                 <label
//                   key={key}
//                   className="flex items-center gap-3 cursor-pointer"
//                 >
//                   <Checkbox
//                     checked={formData.modules[key]}
//                     onCheckedChange={() => toggleModule(key)}
//                     className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
//                   />
//                   <Icon className="h-4 w-4 text-violet-600" />
//                   <span className="text-sm text-gray-700">{label}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* ==================== RIGHT COLUMN ==================== */}
//         <div className="rounded-2xl border border-gray-100 bg-white shadow-md">
//           <div className="space-y-6 p-6">
//             {/* Effective From */}
//             <div className="flex items-center justify-between gap-4">
//               <div className="flex items-center gap-3">
//                 <Calendar className="h-5 w-5 text-violet-600" />
//                 <span className="text-sm font-medium text-gray-700">
//                   Effective From
//                 </span>
//               </div>

//               <div className="relative w-[180px]">
//                 <Input
//                   value={formData.effectiveFrom}
//                   readOnly
//                   className="h-10 rounded-xl border border-gray-200 bg-gray-50 pr-14 text-sm cursor-pointer"
//                   onClick={() => monthInputRef.current?.showPicker()}
//                 />
//                 <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
//                   <Calendar
//                     className="h-4 w-4 cursor-pointer text-gray-400 hover:text-violet-600"
//                     onClick={() => monthInputRef.current?.showPicker()}
//                   />
//                   <Clock3 className="h-4 w-4 text-gray-400" />
//                 </div>

//                 {/* Hidden month picker */}
//                 <input
//                   ref={monthInputRef}
//                   type="month"
//                   value={getMonthValue(formData.effectiveFrom)}
//                   onChange={handleMonthChange}
//                   className="sr-only"
//                 />
//               </div>
//             </div>

//             {/* Holidays Defined On */}
//             <div className="space-y-2">
//               <div className="flex items-center gap-2">
//                 <CalendarDays className="h-4 w-4 text-violet-500" />
//                 <Label className="text-sm font-medium text-gray-700">
//                   Holidays Defined On
//                 </Label>
//               </div>
//               <select
//                 value={formData.holidayDefinedOn}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     holidayDefinedOn: e.target.value,
//                   }))
//                 }
//                 className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-violet-500"
//               >
//                 <option>None</option>
//                 <option>Head Office</option>
//                 <option>Branch Office</option>
//               </select>
//             </div>

//             {/* Weekly Holiday Defined On */}
//             <div className="space-y-2">
//               <div className="flex items-center gap-2">
//                 <Calendar className="h-4 w-4 text-violet-500" />
//                 <Label className="text-sm font-medium text-gray-700">
//                   Weekly Holiday Defined On
//                 </Label>
//               </div>
//               <select
//                 value={formData.weeklyHoliday}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     weeklyHoliday: e.target.value,
//                   }))
//                 }
//                 className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-violet-500"
//               >
//                 <option>None</option>
//                 <option>Sunday</option>
//                 <option>Saturday</option>
//               </select>
//             </div>

//             {/* Net Salary Round Off */}
//             <div className="space-y-2">
//               <div className="flex items-center gap-2">
//                 <RotateCcw className="h-4 w-4 text-violet-500" />
//                 <Label className="text-sm font-medium text-gray-700">
//                   Net Salary Round Off
//                 </Label>
//               </div>
//               <select
//                 value={formData.salaryRoundOff}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     salaryRoundOff: e.target.value,
//                   }))
//                 }
//                 className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-violet-500"
//               >
//                 <option>Nearest Amount</option>
//                 <option>Nearest Rupee</option>
//                 <option>No Round Off</option>
//               </select>
//             </div>

//             {/* Retirement Age */}
//             <div className="space-y-2">
//               <div className="flex items-center gap-2">
//                 <User className="h-4 w-4 text-violet-500" />
//                 <Label className="text-sm font-medium text-gray-700">
//                   Retirement Age
//                 </Label>
//               </div>
//               <Input
//                 value={formData.retirementAge}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     retirementAge: e.target.value,
//                   }))
//                 }
//                 className="h-11 rounded-xl border border-gray-200"
//               />
//             </div>

//             {/* Custom Language Payslip */}
//             <div className="flex items-center gap-3 pt-2">
//               <Checkbox
//                 checked={formData.customPayslip}
//                 onCheckedChange={(checked) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     customPayslip: checked === true,
//                   }))
//                 }
//                 className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
//               />
//               <div className="flex items-center gap-2">
//                 <FileText className="h-4 w-4 text-violet-500" />
//                 <span className="text-sm font-medium text-gray-700">
//                   Custom Language Payslip
//                 </span>
//               </div>
//             </div>

//             {/* Buttons */}
//             <div className="flex justify-end gap-3 pt-6">
//               <Button
//                 variant="outline"
//                 onClick={handleCancel}
//                 className="rounded-xl px-6"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleSave}
//                 disabled={isSaving}
//                 className="rounded-xl bg-violet-600 px-6 hover:bg-violet-700"
//               >
//                 {isSaving ? "Saving..." : "Save Changes"}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// File: src/features/admin/admincenter/settings/PayrollSettings.tsx



















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
  className="
    h-11 rounded-xl border border-gray-200
    bg-white
    outline-none
    transition-colors
    focus:border-[#A78BFA]
    focus:ring-1
    focus:ring-[#DDD6FE]
    focus-visible:border-[#A78BFA]
    focus-visible:ring-1
    focus-visible:ring-[#DDD6FE]
  "
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

// export default function PayrollSettings() {
//   return (
//     <div className="p-6">
//       <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
//         <h1 className="text-xl font-semibold text-violet-600">
//           Payroll Settings
//         </h1>
//         <p className="mt-2 text-sm text-slate-600">
//           Component is loading correctly. We can restore the full form next.
//         </p>
//       </div>
//     </div>
//   );
// }
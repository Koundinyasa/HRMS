// import { useEffect, useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useLwfDetails, monthsToArray, arrayToMonths } from "../hooks/useLwfDetails";
// import { Clock, Bookmark } from "lucide-react";

// const ALL_MONTHS = [
//   "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December",
// ];

// // Generates month/year options, e.g. last 12 months through next 12 months
// function generateMonthYearOptions(): string[] {
//   const shortMonths = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//   ];
//   const now = new Date();
//   const options: string[] = [];
//   for (let i = -12; i <= 12; i++) {
//     const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
//     options.push(`${shortMonths[d.getMonth()]}/${d.getFullYear()}`);
//   }
//   return options;
// }

// const MONTH_YEAR_OPTIONS = generateMonthYearOptions();

// export default function LwfDetailsForm() {
//   const { lwf, isLoading, updateLwf, isSaving } = useLwfDetails();

//   const [effectiveFrom, setEffectiveFrom] = useState("Jun/2026");
//   const [cutoffAmount, setCutoffAmount] = useState(0);
//   const [employeeContribution, setEmployeeContribution] = useState(0);
//   const [employerContribution, setEmployerContribution] = useState(0);
//   const [deductionMonths, setDeductionMonths] = useState<string[]>([]);

//   useEffect(() => {
//     if (lwf) {
//       setEffectiveFrom(lwf.effectiveFrom);
//       setCutoffAmount(lwf.cutoffAmount);
//       setEmployeeContribution(lwf.employeeContribution);
//       setEmployerContribution(lwf.employerContribution);
//       setDeductionMonths(monthsToArray(lwf));
//     }
//   }, [lwf]);

//   function handleMonthChange(month: string) {
//     setDeductionMonths((prev) =>
//       prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
//     );
//   }

//   async function handleSave() {
//     if (!lwf) return;

//     const payload = {
//       ...lwf,
//       ...arrayToMonths(
//         { effectiveFrom, cutoffAmount, employeeContribution, employerContribution },
//         deductionMonths
//       ),
//     };

//     try {
//       await updateLwf(payload).unwrap();
//     } catch (err) {
//       console.error("Failed to save LWF details", err);
//     }
//   }

//   if (isLoading) return <div className="text-sm text-slate-500 p-6">Loading LWF details…</div>;

//   const firstColumnMonths = ALL_MONTHS.slice(0, 6); // January - June
//   const secondColumnMonths = ALL_MONTHS.slice(6);   // July - December

//   return (
//     <div>
//       <Card className="rounded-2xl border border-gray-200 shadow-sm p-6">
//         {/* Effective From */}
//         <div className="flex items-center gap-4 bg-violet-100 rounded-xl px-4 py-3 mb-6">
//           <Label htmlFor="effectiveFrom" className="text-base font-medium">
//             Effective From
//           </Label>
//           <select
//             id="effectiveFrom"
//             value={effectiveFrom}
//             onChange={(e) => setEffectiveFrom(e.target.value)}
//             className="h-9 w-32 bg-white border rounded-md px-3 text-sm"
//           >
//             {MONTH_YEAR_OPTIONS.map((m) => (
//               <option key={m} value={m}>
//                 {m}
//               </option>
//             ))}
//           </select>
//           <Clock className="h-5 w-5 text-gray-500" />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Left Side */}
//           <div className="space-y-5">
//             <div>
//               <Label htmlFor="cutoffAmount">Cut Off (Amount)</Label>
//               <Input
//                 id="cutoffAmount"
//                 value={cutoffAmount}
//                 onChange={(e) => setCutoffAmount(Number(e.target.value))}
//                 className="mt-2 h-11"
//                 placeholder="0"
//               />
//             </div>
//             <div>
//               <Label htmlFor="employeeContribution">Employee Contribution (Amount)</Label>
//               <Input
//                 id="employeeContribution"
//                 value={employeeContribution}
//                 onChange={(e) => setEmployeeContribution(Number(e.target.value))}
//                 className="mt-2 h-11"
//                 placeholder="0"
//               />
//             </div>
//             <div>
//               <Label htmlFor="employerContribution">Employer Contribution (Amount)</Label>
//               <Input
//                 id="employerContribution"
//                 value={employerContribution}
//                 onChange={(e) => setEmployerContribution(Number(e.target.value))}
//                 className="mt-2 h-11"
//                 placeholder="0"
//               />
//             </div>
//           </div>

//           {/* Right Side — Deduction Months, ordered Jan-Jun / Jul-Dec */}
//           <div className="border rounded-xl p-4">
//             <h3 className="font-semibold mb-4">Deduction Months</h3>
//             <div className="grid grid-cols-2 gap-x-8">
//               <div className="space-y-4">
//                 {firstColumnMonths.map((month) => (
//                   <label key={month} className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={deductionMonths.includes(month)}
//                       onChange={() => handleMonthChange(month)}
//                     />
//                     {month}
//                   </label>
//                 ))}
//               </div>
//               <div className="space-y-4">
//                 {secondColumnMonths.map((month) => (
//                   <label key={month} className="flex items-center gap-2">
//                     <input
//                       type="checkbox"
//                       checked={deductionMonths.includes(month)}
//                       onChange={() => handleMonthChange(month)}
//                     />
//                     {month}
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </Card>

//       {/* Buttons — outside the card */}
//       <div className="flex justify-end gap-4 mt-6">
//         <button type="button" className="px-5 py-2 border rounded-lg bg-white hover:bg-gray-100">
//           Load Default Value
//         </button>
//         <button
//           type="button"
//           className="flex items-center gap-2 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-60"
//           onClick={handleSave}
//           disabled={isSaving}
//         >
//           <Bookmark className="h-4 w-4" />
//           {isSaving ? "Saving…" : "Save"}
//         </button>
//       </div>
//     </div>
//   );
// }







// import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { StyledSelect } from "@/components/ui/select";
// import { useLwfDetails, monthsToArray, arrayToMonths } from "../hooks/useLwfDetails";
// import { Clock, Bookmark, CalendarDays } from "lucide-react";

// const ALL_MONTHS = [
//   "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December",
// ];

// function generateMonthYearOptions(): string[] {
//   const shortMonths = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//   ];
//   const now = new Date();
//   const options: string[] = [];
//   for (let i = -12; i <= 12; i++) {
//     const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
//     options.push(`${shortMonths[d.getMonth()]}/${d.getFullYear()}`);
//   }
//   return options;
// }

// const MONTH_YEAR_OPTIONS = generateMonthYearOptions();

// export default function LwfDetailsForm() {
//   const { lwf, isLoading, updateLwf, isSaving } = useLwfDetails();

//   const [effectiveFrom, setEffectiveFrom] = useState("Jun/2026");
//   const [cutoffAmount, setCutoffAmount] = useState(0);
//   const [employeeContribution, setEmployeeContribution] = useState(0);
//   const [employerContribution, setEmployerContribution] = useState(0);
//   const [deductionMonths, setDeductionMonths] = useState<string[]>([]);

//   useEffect(() => {
//     if (lwf) {
//       setEffectiveFrom(lwf.effectiveFrom);
//       setCutoffAmount(lwf.cutoffAmount);
//       setEmployeeContribution(lwf.employeeContribution);
//       setEmployerContribution(lwf.employerContribution);
//       setDeductionMonths(monthsToArray(lwf));
//     }
//   }, [lwf]);

//   function handleMonthChange(month: string) {
//     setDeductionMonths((prev) =>
//       prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
//     );
//   }

//   async function handleSave() {
//     if (!lwf) return;

//     const payload = {
//       ...lwf,
//       ...arrayToMonths(
//         { effectiveFrom, cutoffAmount, employeeContribution, employerContribution },
//         deductionMonths
//       ),
//     };

//     try {
//       await updateLwf(payload).unwrap();
//     } catch (err) {
//       console.error("Failed to save LWF details", err);
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="p-4 text-sm text-slate-500 sm:p-6">
//         Loading LWF details…
//       </div>
//     );
//   }

//   const firstColumnMonths = ALL_MONTHS.slice(0, 6);  // Jan - Jun
//   const secondColumnMonths = ALL_MONTHS.slice(6);    // Jul - Dec

//   return (
//     <div className="w-full">
//       <Card>
//         <CardContent className="space-y-6 p-4 sm:space-y-8 sm:p-6">
//           {/* Effective From — responsive + StyledSelect */}
//           <div className="flex flex-col gap-3 rounded-xl bg-violet-100 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-white">
//                 <CalendarDays className="h-5 w-5 text-violet-600" />
//               </div>
//               <Label className="font-semibold">Effective From</Label>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="w-full max-w-[160px] sm:w-36">
//                 <StyledSelect
//                   value={effectiveFrom}
//                   onValueChange={setEffectiveFrom}
//                   options={MONTH_YEAR_OPTIONS}
//                   className="!h-9"
//                 />
//               </div>
//               <Clock className="h-5 w-5 shrink-0 text-gray-500" />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//             {/* Left Side — Inputs */}
//             <div className="space-y-5">
//               <div>
//                 <Label htmlFor="cutoffAmount">Cut Off (Amount)</Label>
//                 <Input
//                   id="cutoffAmount"
//                   value={cutoffAmount}
//                   onChange={(e) => setCutoffAmount(Number(e.target.value))}
//                   className="mt-2 h-11"
//                   placeholder="0"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="employeeContribution">
//                   Employee Contribution (Amount)
//                 </Label>
//                 <Input
//                   id="employeeContribution"
//                   value={employeeContribution}
//                   onChange={(e) =>
//                     setEmployeeContribution(Number(e.target.value))
//                   }
//                   className="mt-2 h-11"
//                   placeholder="0"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="employerContribution">
//                   Employer Contribution (Amount)
//                 </Label>
//                 <Input
//                   id="employerContribution"
//                   value={employerContribution}
//                   onChange={(e) =>
//                     setEmployerContribution(Number(e.target.value))
//                   }
//                   className="mt-2 h-11"
//                   placeholder="0"
//                 />
//               </div>
//             </div>

//             {/* Right Side — Deduction Months */}
//             <div className="rounded-xl border p-4">
//               <h3 className="mb-4 font-semibold">Deduction Months</h3>
//               <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:gap-x-8">
//                 <div className="space-y-3">
//                   {firstColumnMonths.map((month) => (
//                     <label
//                       key={month}
//                       className="flex cursor-pointer items-center gap-2 text-sm"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={deductionMonths.includes(month)}
//                         onChange={() => handleMonthChange(month)}
//                         className="h-4 w-4 rounded border-gray-300 text-violet-600"
//                       />
//                       {month}
//                     </label>
//                   ))}
//                 </div>
//                 <div className="space-y-3">
//                   {secondColumnMonths.map((month) => (
//                     <label
//                       key={month}
//                       className="flex cursor-pointer items-center gap-2 text-sm"
//                     >
//                       <input
//                         type="checkbox"
//                         checked={deductionMonths.includes(month)}
//                         onChange={() => handleMonthChange(month)}
//                         className="h-4 w-4 rounded border-gray-300 text-violet-600"
//                       />
//                       {month}
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Footer Buttons — responsive */}
//       <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end sm:gap-4">
//         <Button variant="outline" type="button" className="w-full sm:w-auto">
//           Load Default Value
//         </Button>
//         <Button
//           type="button"
//           onClick={handleSave}
//           disabled={isSaving}
//           className="flex w-full items-center justify-center gap-2 bg-violet-600 text-white hover:bg-violet-700 sm:w-auto"
//         >
//           <Bookmark className="h-4 w-4" />
//           {isSaving ? "Saving…" : "Save"}
//         </Button>
//       </div>
//     </div>
//   );
// }











import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { StyledSelect } from "@/components/ui/select";
import { useLwfDetails, monthsToArray, arrayToMonths } from "../hooks/useLwfDetails";
import { Clock, Bookmark, CalendarDays } from "lucide-react";

const ALL_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function generateMonthYearOptions(): string[] {
  const shortMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const now = new Date();
  const options: string[] = [];
  for (let i = -12; i <= 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    options.push(`${shortMonths[d.getMonth()]}/${d.getFullYear()}`);
  }
  return options;
}

const MONTH_YEAR_OPTIONS = generateMonthYearOptions();

/* =======================================================
   SHARED STYLE CONSTANTS (Figma match)
======================================================= */

const inputClass =
  "mt-2 h-11 rounded-lg border-[#E4DFFB] focus-visible:border-[#7C3AED] focus-visible:ring-[#EDE9FE] focus-visible:ring-2";

const labelClass = "text-sm font-medium text-gray-800";

export default function LwfDetailsForm() {
  const { lwf, isLoading, updateLwf, isSaving } = useLwfDetails();

  const [effectiveFrom, setEffectiveFrom] = useState("Jun/2026");
  const [cutoffAmount, setCutoffAmount] = useState(0);
  const [employeeContribution, setEmployeeContribution] = useState(0);
  const [employerContribution, setEmployerContribution] = useState(0);
  const [deductionMonths, setDeductionMonths] = useState<string[]>([]);

  useEffect(() => {
    if (lwf) {
      setEffectiveFrom(lwf.effectiveFrom);
      setCutoffAmount(lwf.cutoffAmount);
      setEmployeeContribution(lwf.employeeContribution);
      setEmployerContribution(lwf.employerContribution);
      setDeductionMonths(monthsToArray(lwf));
    }
  }, [lwf]);

  function handleMonthChange(month: string) {
    setDeductionMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  }

  async function handleSave() {
    if (!lwf) return;

    const payload = {
      ...lwf,
      ...arrayToMonths(
        { effectiveFrom, cutoffAmount, employeeContribution, employerContribution },
        deductionMonths
      ),
    };

    try {
      await updateLwf(payload).unwrap();
    } catch (err) {
      console.error("Failed to save LWF details", err);
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-slate-500 sm:p-6">
        Loading LWF details…
      </div>
    );
  }

  const firstColumnMonths = ALL_MONTHS.slice(0, 6);  // Jan - Jun
  const secondColumnMonths = ALL_MONTHS.slice(6);    // Jul - Dec

  return (
    <div className="w-full">
      <Card className="rounded-2xl border border-[#E9D5FF] shadow-sm">
        <CardContent className="space-y-6 p-4 sm:space-y-8 sm:p-6">
          {/* Effective From */}
          <div
            className="flex flex-col gap-3 rounded-xl px-4 py-4 sm:flex-row sm:items-center sm:gap-4"
            style={{ backgroundColor: "#EDE9FE" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-white"
                style={{ borderColor: "#E9D5FF" }}
              >
                <CalendarDays className="h-5 w-5 text-[#7C3AED]" />
              </div>
              <Label className="text-base font-semibold text-gray-900">
                Effective From
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-full max-w-[180px] sm:w-40">
                <StyledSelect
                  value={effectiveFrom}
                  onValueChange={setEffectiveFrom}
                  options={MONTH_YEAR_OPTIONS}
                  className="!h-11 !rounded-lg !border-[#E4DFFB] bg-white"
                />
              </div>
              <Clock className="h-5 w-5 shrink-0 text-gray-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Side — Inputs */}
            <div className="space-y-5">
              <div>
                <Label htmlFor="cutoffAmount" className={labelClass}>
                  Cut Off (Amount)
                </Label>
                <Input
                  id="cutoffAmount"
                  value={cutoffAmount}
                  onChange={(e) => setCutoffAmount(Number(e.target.value))}
                  className={inputClass}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="employeeContribution" className={labelClass}>
                  Employee Contribution (Amount)
                </Label>
                <Input
                  id="employeeContribution"
                  value={employeeContribution}
                  onChange={(e) =>
                    setEmployeeContribution(Number(e.target.value))
                  }
                  className={inputClass}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="employerContribution" className={labelClass}>
                  Employer Contribution (Amount)
                </Label>
                <Input
                  id="employerContribution"
                  value={employerContribution}
                  onChange={(e) =>
                    setEmployerContribution(Number(e.target.value))
                  }
                  className={inputClass}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Right Side — Deduction Months */}
            <div
              className="rounded-xl border p-4"
              style={{ borderColor: "#E9D5FF" }}
            >
              <h3 className="mb-4 text-base font-semibold text-gray-900">
                Deduction Months
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:gap-x-8">
                <div className="space-y-3">
                  {firstColumnMonths.map((month) => (
                    <label
                      key={month}
                      className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={deductionMonths.includes(month)}
                        onChange={() => handleMonthChange(month)}
                        className="h-4 w-4 rounded border-[#DDD6FE] accent-[#7C3AED]"
                      />
                      {month}
                    </label>
                  ))}
                </div>
                <div className="space-y-3">
                  {secondColumnMonths.map((month) => (
                    <label
                      key={month}
                      className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={deductionMonths.includes(month)}
                        onChange={() => handleMonthChange(month)}
                        className="h-4 w-4 rounded border-[#DDD6FE] accent-[#7C3AED]"
                      />
                      {month}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Buttons */}
      <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end sm:gap-4">
        <Button variant="outline" type="button" className="w-full border-[#E4DFFB] sm:w-auto">
          Load Default Value
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex w-full items-center justify-center gap-2 bg-[#7C3AED] text-white hover:bg-[#6D28D9] sm:w-auto"
        >
          <Bookmark className="h-4 w-4" />
          {isSaving ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}
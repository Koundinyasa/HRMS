




// import { useEffect, useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useLwfDetails, monthsToArray, arrayToMonths } from "../hooks/useLwfDetails";
// import { useToast, Toast } from "./common/Toast";
// import { Clock, Bookmark, Loader2 } from "lucide-react";
// import { MonthPicker } from "@/components/ui/monthpicker";

// const ALL_MONTHS = [
//   "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December",
// ];

// export default function LwfDetailsForm() {
//   const { lwf, isLoading, updateLwf, isSaving, refetch } = useLwfDetails();

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

//   const { toast, showToast } = useToast();

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
//       await refetch();
//       showToast("LWF details saved successfully");
//     } catch (err) {
//       console.error("Failed to save LWF details", err);
//       showToast("Failed to save LWF details. Please try again.", "error");
//     }
//   }

//   if (isLoading) return <div className="text-sm text-slate-500 p-4 sm:p-6">Loading LWF details…</div>;

//   const firstColumnMonths = ALL_MONTHS.slice(0, 6);
//   const secondColumnMonths = ALL_MONTHS.slice(6);

//   return (
//     <div className="w-full min-w-0 max-w-full">
//       <Toast toast={toast} />
//       <Card data-company-module-card className="w-full min-w-0 rounded-2xl border border-gray-200 p-4 shadow-sm sm:p-6">
//         <div className="flex flex-wrap items-center gap-2 sm:gap-4 bg-violet-100 rounded-xl px-3 sm:px-4 py-3 mb-5 sm:mb-6">
//           <Label htmlFor="effectiveFrom" className="text-sm sm:text-base font-medium whitespace-nowrap">
//             Effective From
//           </Label>
//           <div className="w-full max-w-[160px] sm:w-36">
//             <MonthPicker
//               value={effectiveFrom}
//               onChange={(value) => setEffectiveFrom(value)}
//               className="h-9"
//             />
//           </div>
//           <Clock className="h-5 w-5 text-gray-500 hidden sm:block shrink-0" />
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
//           <div className="space-y-4 sm:space-y-5 min-w-0">
//             <div>
//               <Label htmlFor="cutoffAmount">Cut Off (Amount)</Label>
//               <Input
//                 id="cutoffAmount"
//                 value={cutoffAmount}
//                 onChange={(e) => setCutoffAmount(Number(e.target.value))}
//                 className="mt-2 h-10 sm:h-11 w-full"
//                 placeholder="0"
//               />
//             </div>
//             <div>
//               <Label htmlFor="employeeContribution">Employee Contribution (Amount)</Label>
//               <Input
//                 id="employeeContribution"
//                 value={employeeContribution}
//                 onChange={(e) => setEmployeeContribution(Number(e.target.value))}
//                 className="mt-2 h-10 sm:h-11 w-full"
//                 placeholder="0"
//               />
//             </div>
//             <div>
//               <Label htmlFor="employerContribution">Employer Contribution (Amount)</Label>
//               <Input
//                 id="employerContribution"
//                 value={employerContribution}
//                 onChange={(e) => setEmployerContribution(Number(e.target.value))}
//                 className="mt-2 h-10 sm:h-11 w-full"
//                 placeholder="0"
//               />
//             </div>
//           </div>

//           <div className="border rounded-xl p-3 sm:p-4 min-w-0">
//             <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Deduction Months</h3>
//             <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2">
//               <div className="space-y-2 sm:space-y-3">
//                 {firstColumnMonths.map((month) => (
//                   <label key={month} className="flex items-center gap-2 text-sm">
//                     <input
//                       type="checkbox"
//                       checked={deductionMonths.includes(month)}
//                       onChange={() => handleMonthChange(month)}
//                       className="shrink-0"
//                     />
//                     <span className="truncate">{month}</span>
//                   </label>
//                 ))}
//               </div>
//               <div className="space-y-2 sm:space-y-3">
//                 {secondColumnMonths.map((month) => (
//                   <label key={month} className="flex items-center gap-2 text-sm">
//                     <input
//                       type="checkbox"
//                       checked={deductionMonths.includes(month)}
//                       onChange={() => handleMonthChange(month)}
//                       className="shrink-0"
//                     />
//                     <span className="truncate">{month}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </Card>

//       <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-4 sm:mt-6">
//         <button type="button" className="px-5 py-2 border rounded-lg bg-white hover:bg-gray-100 w-full sm:w-auto text-sm">
//           Load Default Value
//         </button>
//         <button
//           type="button"
//           className="flex items-center justify-center gap-2 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-60 w-full sm:w-auto text-sm"
//           onClick={handleSave}
//           disabled={isSaving}
//         >
//           {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bookmark className="h-4 w-4" />}
//           {isSaving ? "Saving…" : "Save"}
//         </button>
//       </div>
//     </div>
//   );
// }


















import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLwfDetails, monthsToArray, arrayToMonths } from "../hooks/useLwfDetails";
import { useToast, Toast } from "./common/Toast";
import { Clock, Bookmark, Loader2 } from "lucide-react";
import { MonthPicker } from "@/components/ui/monthpicker";

const ALL_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function LwfDetailsForm() {
  const { lwf, isLoading, updateLwf, isSaving, refetch } = useLwfDetails();

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

  const { toast, showToast } = useToast();

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
      await refetch();
      showToast("LWF details saved successfully");
    } catch (err) {
      console.error("Failed to save LWF details", err);
      showToast("Failed to save LWF details. Please try again.", "error");
    }
  }

  if (isLoading) return <div className="text-sm text-[#626262] p-4 sm:p-6">Loading LWF details…</div>;

  const firstColumnMonths = ALL_MONTHS.slice(0, 6);
  const secondColumnMonths = ALL_MONTHS.slice(6);

  return (
    <div className="w-full min-w-0 max-w-full">
      <Toast toast={toast} />
      <Card data-company-module-card className="w-full min-w-0 rounded-2xl border border-[#EDEDED] p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 bg-[#ECE7FF] rounded-xl px-3 sm:px-4 py-3 mb-5 sm:mb-6">
          <Label htmlFor="effectiveFrom" className="text-sm sm:text-base font-medium whitespace-nowrap">
            Effective From
          </Label>
          <div className="w-full max-w-[160px] sm:w-36">
            <MonthPicker
              value={effectiveFrom}
              onChange={(value) => setEffectiveFrom(value)}
              className="h-9"
            />
          </div>
          <Clock className="h-5 w-5 text-[#626262] hidden sm:block shrink-0" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          <div className="space-y-4 sm:space-y-5 min-w-0">
            <div>
              <Label htmlFor="cutoffAmount">Cut Off (Amount)</Label>
              <Input
                id="cutoffAmount"
                value={cutoffAmount}
                onChange={(e) => setCutoffAmount(Number(e.target.value))}
                className="mt-2 h-10 sm:h-11 w-full"
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="employeeContribution">Employee Contribution (Amount)</Label>
              <Input
                id="employeeContribution"
                value={employeeContribution}
                onChange={(e) => setEmployeeContribution(Number(e.target.value))}
                className="mt-2 h-10 sm:h-11 w-full"
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="employerContribution">Employer Contribution (Amount)</Label>
              <Input
                id="employerContribution"
                value={employerContribution}
                onChange={(e) => setEmployerContribution(Number(e.target.value))}
                className="mt-2 h-10 sm:h-11 w-full"
                placeholder="0"
              />
            </div>
          </div>

          <div className="border rounded-xl p-3 sm:p-4 min-w-0">
            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Deduction Months</h3>
            <div className="grid grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2">
              <div className="space-y-2 sm:space-y-3">
                {firstColumnMonths.map((month) => (
                  <label key={month} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={deductionMonths.includes(month)}
                      onChange={() => handleMonthChange(month)}
                      className="shrink-0"
                    />
                    <span className="truncate">{month}</span>
                  </label>
                ))}
              </div>
              <div className="space-y-2 sm:space-y-3">
                {secondColumnMonths.map((month) => (
                  <label key={month} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={deductionMonths.includes(month)}
                      onChange={() => handleMonthChange(month)}
                      className="shrink-0"
                    />
                    <span className="truncate">{month}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-4 sm:mt-6">
        <button type="button" className="px-5 py-2 border rounded-lg bg-white hover:bg-[#DDDDDD] w-full sm:w-auto text-sm">
          Load Default Value
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 px-6 py-2 bg-[#7A5BED] text-white rounded-lg hover:bg-[#5932E9] disabled:opacity-60 w-full sm:w-auto text-sm"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bookmark className="h-4 w-4" />}
          {isSaving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
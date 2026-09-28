// import { useState, useEffect } from "react";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useEsiDetails } from "../hooks/useEsiDetails";
// import { useToast, Toast } from "./common/Toast";
// import type { EsiConfiguration } from "../types/company.types";
// import { CalendarDays, Clock, Bookmark, Loader2 } from "lucide-react";
// import { MonthPicker } from "@/components/ui/monthpicker";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
 
// const EMPTY_ESI: EsiConfiguration = {
//   effectiveFrom: "Feb/2026",
//   cutOffAmount: 0,
//   employeeRate: 0,
//   employerRate: 0,
//   minimumDailyWage: 0,
//   roundOff: "Higher Amount",
// };
 
// export default function EsiDetailsForm() {
//   const { esi, isLoading, updateEsi, isSaving, refetch } = useEsiDetails();
//   const [esiData, setEsiData] = useState<EsiConfiguration>(EMPTY_ESI);
 
//   useEffect(() => {
//     if (esi) setEsiData(esi);
//   }, [esi]);
 
//   function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
//     const { id, value } = e.target;
//     setEsiData((prev) => ({ ...prev, [id]: value }));
//   }
 
//   const { toast, showToast } = useToast();
 
//   async function handleSave() {
//     try {
//       await updateEsi(esiData).unwrap();
//       await refetch();
//       showToast("ESI details saved successfully");
//     } catch (err) {
//       console.error("Failed to save ESI details", err);
//       showToast("Failed to save ESI details. Please try again.", "error");
//     }
//   }
 
//   if (isLoading) return <div className="text-sm text-slate-500 p-6">Loading ESI details…</div>;
 
//   return (
//     <div className="w-full min-w-0 font-['Urbanist'] text-slate-800">
//       <Toast toast={toast} />
//       <Card data-company-module-card className="w-full min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
//         {/* Effective From */}
//         <div className="mb-8 grid grid-cols-3 items-center rounded-xl bg-violet-100 p-4">
//           <div className="flex items-center gap-3">
//             <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-200 bg-white">
//               <CalendarDays className="h-5 w-5 text-violet-600" />
//             </div>
//             <Label htmlFor="effectiveFrom" className="text-[13px] font-medium leading-5 text-slate-700">
//               Effective From
//             </Label>
//           </div>
 
//           <div className="flex justify-center">
//             <div className="w-full max-w-[10rem]">
//               <MonthPicker
//                 value={esiData.effectiveFrom}
//                 onChange={(value) =>
//                   setEsiData((prev) => ({ ...prev, effectiveFrom: value }))
//                 }
//                 className="h-10 rounded-xl border-slate-200"
//               />
//             </div>
//           </div>
 
//           <div className="flex justify-end">
//             <Clock className="h-5 w-5 text-slate-500" />
//           </div>
//         </div>
 
//         {/* First Row */}
//         <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
//           <div>
//             <Label htmlFor="cutOffAmount" className="text-[13px] font-medium leading-5 text-slate-700">Cut Off(Amount)</Label>
//             <Input
//               id="cutOffAmount"
//               placeholder="21000"
//               className="mt-2 h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400"
//               value={esiData.cutOffAmount}
//               onChange={handleChange}
//             />
//           </div>
//           <div>
//             <Label htmlFor="employeeRate" className="text-[13px] font-medium leading-5 text-slate-700">Employee Rate(%)</Label>
//             <Input
//               id="employeeRate"
//               placeholder="0.75"
//               className="mt-2 h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400"
//               value={esiData.employeeRate}
//               onChange={handleChange}
//             />
//           </div>
//         </div>
 
//         {/* Second Row */}
//         <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
//           <div>
//             <Label htmlFor="employerRate" className="text-[13px] font-medium leading-5 text-slate-700">Employer Rate(%)</Label>
//             <Input
//               id="employerRate"
//               placeholder="3.25"
//               className="mt-2 h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400"
//               value={esiData.employerRate}
//               onChange={handleChange}
//             />
//           </div>
//           <div>
//             <Label htmlFor="minimumDailyWage" className="text-[13px] font-medium leading-5 text-slate-700">Minimum Daily Wage (Amount)</Label>
//             <Input
//               id="minimumDailyWage"
//               placeholder="137"
//               className="mt-2 h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 placeholder:text-slate-400"
//               value={esiData.minimumDailyWage}
//               onChange={handleChange}
//             />
//           </div>
//         </div>
 
//         {/* Round Off */}
//         <div className="inline-block">
//           <Label htmlFor="roundOff" className="text-[13px] font-medium leading-5 text-slate-700">Round Off</Label>
//           <div className="mt-2 w-44 max-w-full">
//             <Select
//               value={esiData.roundOff}
//               onValueChange={(value) => setEsiData((prev) => ({ ...prev, roundOff: value }))}
//             >
//               <SelectTrigger size="sm" className="h-11">
//                 <SelectValue placeholder="Select" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="Higher Amount">Higher Amount</SelectItem>
//                 <SelectItem value="Lower Amount">Lower Amount</SelectItem>
//                 <SelectItem value="Nearest Amount">Nearest Amount</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       </Card>
 
//       {/* Buttons — outside the card, on the page background */}
//       <div className="mt-6 flex justify-end gap-4">
//         <button type="button" className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
//           Load Default Value
//         </button>
//         <button
//           type="button"
//           className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
//           onClick={handleSave}
//           disabled={isSaving}
//         >
//           {isSaving ? (
//             <Loader2 className="h-4 w-4 animate-spin" />
//           ) : (
//             <Bookmark className="h-4 w-4" />
//           )}
//           {isSaving ? "Saving" : "Save"}
//         </button>
//       </div>
//     </div>
//   );
// }













import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEsiDetails } from "../hooks/useEsiDetails";
import { useToast, Toast } from "./common/Toast";
import type { EsiConfiguration } from "../types/company.types";
import { CalendarDays, Clock, Bookmark, Loader2 } from "lucide-react";
import { MonthPicker } from "@/components/ui/monthpicker";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
 
const EMPTY_ESI: EsiConfiguration = {
  effectiveFrom: "Feb/2026",
  cutOffAmount: 0,
  employeeRate: 0,
  employerRate: 0,
  minimumDailyWage: 0,
  roundOff: "Higher Amount",
};
 
export default function EsiDetailsForm() {
  const { esi, isLoading, updateEsi, isSaving, refetch } = useEsiDetails();
  const [esiData, setEsiData] = useState<EsiConfiguration>(EMPTY_ESI);
 
  useEffect(() => {
    if (esi) setEsiData(esi);
  }, [esi]);
 
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { id, value } = e.target;
    setEsiData((prev) => ({ ...prev, [id]: value }));
  }
 
  const { toast, showToast } = useToast();
 
  async function handleSave() {
    try {
      await updateEsi(esiData).unwrap();
      await refetch();
      showToast("ESI details saved successfully");
    } catch (err) {
      console.error("Failed to save ESI details", err);
      showToast("Failed to save ESI details. Please try again.", "error");
    }
  }
 
  if (isLoading) return <div className="text-sm text-[#626262] p-6">Loading ESI details…</div>;
 
  return (
    <div className="w-full min-w-0 font-['Urbanist'] text-[#131313]">
      <Toast toast={toast} />
      <Card data-company-module-card className="w-full min-w-0 rounded-2xl border border-[#EDEDED] bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.02)]">
        {/* Effective From */}
        <div className="mb-8 grid grid-cols-3 items-center rounded-xl bg-[#ECE7FF] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#ECE7FF] bg-white">
              <CalendarDays className="h-5 w-5 text-[#7A5BED]" />
            </div>
            <Label htmlFor="effectiveFrom" className="text-[13px] font-medium leading-5 text-[#2E2E2E]">
              Effective From
            </Label>
          </div>
 
          <div className="flex justify-center">
            <div className="w-full max-w-[10rem]">
              <MonthPicker
                value={esiData.effectiveFrom}
                onChange={(value) =>
                  setEsiData((prev) => ({ ...prev, effectiveFrom: value }))
                }
                className="h-10 rounded-xl border-[#EDEDED]"
              />
            </div>
          </div>
 
          <div className="flex justify-end">
            <Clock className="h-5 w-5 text-[#626262]" />
          </div>
        </div>
 
        {/* First Row */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="cutOffAmount" className="text-[13px] font-medium leading-5 text-[#2E2E2E]">Cut Off(Amount)</Label>
            <Input
              id="cutOffAmount"
              placeholder="21000"
              className="mt-2 h-11 rounded-xl border border-[#EDEDED] bg-white px-3 text-sm text-[#2E2E2E] placeholder:text-[#626262]"
              value={esiData.cutOffAmount}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="employeeRate" className="text-[13px] font-medium leading-5 text-[#2E2E2E]">Employee Rate(%)</Label>
            <Input
              id="employeeRate"
              placeholder="0.75"
              className="mt-2 h-11 rounded-xl border border-[#EDEDED] bg-white px-3 text-sm text-[#2E2E2E] placeholder:text-[#626262]"
              value={esiData.employeeRate}
              onChange={handleChange}
            />
          </div>
        </div>
 
        {/* Second Row */}
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="employerRate" className="text-[13px] font-medium leading-5 text-[#2E2E2E]">Employer Rate(%)</Label>
            <Input
              id="employerRate"
              placeholder="3.25"
              className="mt-2 h-11 rounded-xl border border-[#EDEDED] bg-white px-3 text-sm text-[#2E2E2E] placeholder:text-[#626262]"
              value={esiData.employerRate}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="minimumDailyWage" className="text-[13px] font-medium leading-5 text-[#2E2E2E]">Minimum Daily Wage (Amount)</Label>
            <Input
              id="minimumDailyWage"
              placeholder="137"
              className="mt-2 h-11 rounded-xl border border-[#EDEDED] bg-white px-3 text-sm text-[#2E2E2E] placeholder:text-[#626262]"
              value={esiData.minimumDailyWage}
              onChange={handleChange}
            />
          </div>
        </div>
 
        {/* Round Off */}
        <div className="inline-block">
          <Label htmlFor="roundOff" className="text-[13px] font-medium leading-5 text-[#2E2E2E]">Round Off</Label>
          <div className="mt-2 w-44 max-w-full">
            <Select
              value={esiData.roundOff}
              onValueChange={(value) => setEsiData((prev) => ({ ...prev, roundOff: value }))}
            >
              <SelectTrigger size="sm" className="h-11">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Higher Amount">Higher Amount</SelectItem>
                <SelectItem value="Lower Amount">Lower Amount</SelectItem>
                <SelectItem value="Nearest Amount">Nearest Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
 
      {/* Buttons — outside the card, on the page background */}
      <div className="mt-6 flex justify-end gap-4">
        <button type="button" className="rounded-xl border border-[#EDEDED] bg-white px-5 py-2 text-sm font-medium text-[#2E2E2E] transition hover:bg-[#EDEDED]">
          Load Default Value
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-[#7A5BED] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#5932E9]"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
          {isSaving ? "Saving" : "Save"}
        </button>
      </div>
    </div>
  );
}
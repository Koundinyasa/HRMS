// import { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { usePfDetails } from "../hooks/usePfDetails";
// import type { PfConfiguration } from "../types/company.types";
// import { CalendarDays, Clock, Bookmark } from "lucide-react";

// const EMPTY_PF: PfConfiguration = {
//   effectiveFrom: "Feb/2026",
//   epfPercentage: 0,
//   cutoff: 0,
//   pfOnPayDays: false,
//   pensionFundPercentage: 0,
//   employerEPFPercentage: 0,
//   roundOff: "Nearest Amount",
//   accountNo02Rate: 0,
//   accountNo21Rate: 0,
//   minimumChargesAccNo02: 0,
//   restrictEmployerShare: true,
//   restrictEmployerEmployeeWise: false,
// };

// // Generates month/year options, e.g. last 12 months through next 12 months
// function generateMonthOptions(): string[] {
//   const months = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//   ];
//   const now = new Date();
//   const options: string[] = [];
//   for (let i = -12; i <= 12; i++) {
//     const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
//     options.push(`${months[d.getMonth()]}/${d.getFullYear()}`);
//   }
//   return options;
// }

// const MONTH_OPTIONS = generateMonthOptions();

// export default function PfDetailsForm() {
//   const { pf, isLoading, updatePf, isSaving } = usePfDetails();
//   const [pfData, setPfData] = useState<PfConfiguration>(EMPTY_PF);

//   useEffect(() => {
//     if (pf) setPfData(pf);
//   }, [pf]);

//   function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
//     const { id, value } = e.target;
//     setPfData((prev) => ({ ...prev, [id]: value }));
//   }

//   async function handleSave() {
//     try {
//       await updatePf(pfData).unwrap();
//     } catch (err) {
//       console.error("Failed to save PF details", err);
//     }
//   }

//   if (isLoading) return <div className="text-sm text-slate-500 p-6">Loading PF details…</div>;

//   return (
//     <div>
//       <Card>
//         <CardContent className="space-y-8">
//           {/* Effective From */}
//           <div className="grid grid-cols-3 items-center rounded-xl bg-violet-100 px-5 py-3">
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white">
//                 <CalendarDays className="h-5 w-5 text-violet-600" />
//               </div>
//               <Label htmlFor="effectiveFrom" className="font-semibold">
//                 Effective From
//               </Label>
//             </div>

//             <div className="flex justify-center">
//               <select
//                 id="effectiveFrom"
//                 value={pfData.effectiveFrom}
//                 onChange={handleChange}
//                 className="h-9 w-40 rounded-md border bg-white px-3 text-sm"
//               >
//                 {MONTH_OPTIONS.map((m) => (
//                   <option key={m} value={m}>
//                     {m}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="flex justify-end">
//               <Clock className="h-5 w-5 text-gray-500" />
//             </div>
//           </div>

//           {/* For Employee */}
//           <div>
//             <div className="mb-5 flex items-center gap-3">
//               <h3 className="font-semibold">For Employee</h3>
//               <div className="h-px flex-1 bg-gray-200"></div>
//             </div>

//             <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//               <div>
//                 <Label htmlFor="epfPercentage">
//                   EPF(A)-(%) <span className="text-red-500">*</span>
//                 </Label>
//                 <Input id="epfPercentage" value={pfData.epfPercentage} onChange={handleChange} placeholder="12" className="mt-2" />
//               </div>
//               <div>
//                 <Label htmlFor="cutoff">
//                   Cutoff <span className="text-red-500">*</span>
//                 </Label>
//                 <Input id="cutoff" value={pfData.cutoff} onChange={handleChange} placeholder="15000" className="mt-2" />
//               </div>
//               <div className="flex flex-col h-full">
//                <Label className="text-sm text-gray-700 font-medium">
//   Placeholder alignment
// </Label>
//                 <div className="flex h-11 items-center gap-3 mt-2">
//                   <Checkbox
//                     checked={pfData.pfOnPayDays}
//                     onCheckedChange={(checked) => setPfData((prev) => ({ ...prev, pfOnPayDays: checked === true }))}
//                   />
//                   <span>PF On Pay Days</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* For Employer */}
//           <div>
//             <div className="mb-5 flex items-center gap-3">
//               <h3 className="font-semibold">For Employer</h3>
//               <div className="h-px flex-1 bg-gray-200"></div>
//             </div>
//             <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//               <div>
//                 <Label htmlFor="pensionFundPercentage">
//                   Pension Fund(B)-(%) <span className="text-red-500">*</span>
//                 </Label>
//                 <Input id="pensionFundPercentage" value={pfData.pensionFundPercentage} onChange={handleChange} placeholder="8.33" className="mt-2" />
//               </div>
//               <div>
//                 <Label htmlFor="employerEPFPercentage">
//                   EPF(A-B)-(%) <span className="text-red-500">*</span>
//                 </Label>
//                 <Input id="employerEPFPercentage" value={pfData.employerEPFPercentage} onChange={handleChange} placeholder="3.67" className="mt-2" />
//               </div>
//               <div>
//                 <Label htmlFor="roundOff">
//                   Round Off <span className="text-red-500">*</span>
//                 </Label>
//                 <select id="roundOff" value={pfData.roundOff} onChange={handleChange} className="mt-2 h-8 w-full rounded-md border px-3">
//                   <option value="Nearest Amount">Nearest Amount</option>
//                   <option value="Higher Amount">Higher Amount</option>
//                   <option value="Lower Amount">Lower Amount</option>
//                 </select>
//               </div>
//               <div>
//                 <Label htmlFor="accountNo02Rate">
//                   Account No. 02(%) <span className="text-red-500">*</span>
//                 </Label>
//                 <Input id="accountNo02Rate" value={pfData.accountNo02Rate} onChange={handleChange} placeholder="0.50" className="mt-2" />
//               </div>
//               <div>
//                 <Label htmlFor="accountNo21Rate">
//                   Account No. 21(%) <span className="text-red-500">*</span>
//                 </Label>
//                 <Input id="accountNo21Rate" value={pfData.accountNo21Rate} onChange={handleChange} placeholder="0.50" className="mt-2" />
//               </div>
//               <div>
//                 <Label htmlFor="minimumChargesAccNo02">
//                   Minimum Charges For ACC.No.2 <span className="text-red-500">*</span>
//                 </Label>
//                 <Input id="minimumChargesAccNo02" value={pfData.minimumChargesAccNo02} onChange={handleChange} placeholder="500" className="mt-2" />
//               </div>
//             </div>
//           </div>

//           {/* Restrict Employer Share — mutually exclusive, side by side */}
//           <div className="flex items-center gap-8">
//             <label className="flex items-center gap-3 cursor-pointer">
//               <input
//                 type="radio"
//                 name="restrictEmployerShareMode"
//                 checked={pfData.restrictEmployerShare}
//                 onChange={() =>
//                   setPfData((prev) => ({
//                     ...prev,
//                     restrictEmployerShare: true,
//                     restrictEmployerEmployeeWise: false,
//                   }))
//                 }
//                 className="h-4 w-4 text-violet-600 focus:ring-violet-500"
//               />
//               <span>Restrict Employer Share</span>
//             </label>
//             <label className="flex items-center gap-3 cursor-pointer">
//               <input
//                 type="radio"
//                 name="restrictEmployerShareMode"
//                 checked={pfData.restrictEmployerEmployeeWise}
//                 onChange={() =>
//                   setPfData((prev) => ({
//                     ...prev,
//                     restrictEmployerShare: false,
//                     restrictEmployerEmployeeWise: true,
//                   }))
//                 }
//                 className="h-4 w-4 text-violet-600 focus:ring-violet-500"
//               />
//               <span>Restrict Employer Share Employee Wise</span>
//             </label>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Footer Buttons — outside the card */}
//       <div className="flex justify-end gap-4 pt-4">
//         <Button variant="outline" type="button">
//           Load Default Value
//         </Button>
//         <Button
//           type="button"
//           onClick={handleSave}
//           disabled={isSaving}
//           className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white"
//         >
//           <Bookmark className="h-4 w-4" />
//           {isSaving ? "Saving..." : "Save"}
//         </Button>
//       </div>
//     </div>
//   );
// }











// import { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { StyledSelect } from "@/components/ui/select";
// import { usePfDetails } from "../hooks/usePfDetails";
// import type { PfConfiguration } from "../types/company.types";
// import { CalendarDays, Clock, Bookmark } from "lucide-react";

// const EMPTY_PF: PfConfiguration = {
//   effectiveFrom: "Feb/2026",
//   epfPercentage: 0,
//   cutoff: 0,
//   pfOnPayDays: false,
//   pensionFundPercentage: 0,
//   employerEPFPercentage: 0,
//   roundOff: "Nearest Amount",
//   accountNo02Rate: 0,
//   accountNo21Rate: 0,
//   minimumChargesAccNo02: 0,
//   restrictEmployerShare: true,
//   restrictEmployerEmployeeWise: false,
// };

// // Generates month/year options
// function generateMonthOptions(): string[] {
//   const months = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//   ];
//   const now = new Date();
//   const options: string[] = [];
//   for (let i = -12; i <= 12; i++) {
//     const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
//     options.push(`${months[d.getMonth()]}/${d.getFullYear()}`);
//   }
//   return options;
// }

// const MONTH_OPTIONS = generateMonthOptions();

// const ROUND_OFF_OPTIONS = [
//   "Nearest Amount",
//   "Higher Amount",
//   "Lower Amount",
// ];

// export default function PfDetailsForm() {
//   const { pf, isLoading, updatePf, isSaving } = usePfDetails();
//   const [pfData, setPfData] = useState<PfConfiguration>(EMPTY_PF);

//   useEffect(() => {
//     if (pf) setPfData(pf);
//   }, [pf]);

//   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const { id, value } = e.target;
//     setPfData((prev) => ({ ...prev, [id]: value }));
//   }

//   async function handleSave() {
//     try {
//       await updatePf(pfData).unwrap();
//     } catch (err) {
//       console.error("Failed to save PF details", err);
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="p-4 text-sm text-slate-500 sm:p-6">
//         Loading PF details…
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       <Card>
//         <CardContent className="space-y-6 p-4 sm:space-y-8 sm:p-6">
//           {/* Effective From */}
//           <div className="flex flex-col gap-3 rounded-xl bg-violet-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-white">
//                 <CalendarDays className="h-5 w-5 text-violet-600" />
//               </div>
//               <Label className="font-semibold">Effective From</Label>
//             </div>

//             <div className="flex items-center gap-3 sm:gap-4">
//               <div className="w-full max-w-[180px] sm:w-40">
//                 <StyledSelect
//                   value={pfData.effectiveFrom}
//                   onValueChange={(value) =>
//                     setPfData((prev) => ({ ...prev, effectiveFrom: value }))
//                   }
//                   options={MONTH_OPTIONS}
//                   className="!h-9"
//                 />
//               </div>
//               <Clock className="h-5 w-5 shrink-0 text-gray-500" />
//             </div>
//           </div>

//           {/* For Employee */}
//           <div>
//             <div className="mb-4 flex items-center gap-3 sm:mb-5">
//               <h3 className="font-semibold">For Employee</h3>
//               <div className="h-px flex-1 bg-gray-200" />
//             </div>

//             <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
//               <div>
//                 <Label htmlFor="epfPercentage">
//                   EPF(A)-(%) <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="epfPercentage"
//                   value={pfData.epfPercentage}
//                   onChange={handleChange}
//                   placeholder="12"
//                   className="mt-2"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="cutoff">
//                   Cutoff <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="cutoff"
//                   value={pfData.cutoff}
//                   onChange={handleChange}
//                   placeholder="15000"
//                   className="mt-2"
//                 />
//               </div>
//               <div className="flex flex-col">
//                 <Label className="text-sm font-medium text-gray-700">
//                   Placeholder alignment
//                 </Label>
//                 <div className="mt-2 flex h-11 items-center gap-3">
//                   <Checkbox
//                     checked={pfData.pfOnPayDays}
//                     onCheckedChange={(checked) =>
//                       setPfData((prev) => ({
//                         ...prev,
//                         pfOnPayDays: checked === true,
//                       }))
//                     }
//                   />
//                   <span className="text-sm">PF On Pay Days</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* For Employer */}
//           <div>
//             <div className="mb-4 flex items-center gap-3 sm:mb-5">
//               <h3 className="font-semibold">For Employer</h3>
//               <div className="h-px flex-1 bg-gray-200" />
//             </div>

//             <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
//               <div>
//                 <Label htmlFor="pensionFundPercentage">
//                   Pension Fund(B)-(%) <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="pensionFundPercentage"
//                   value={pfData.pensionFundPercentage}
//                   onChange={handleChange}
//                   placeholder="8.33"
//                   className="mt-2"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="employerEPFPercentage">
//                   EPF(A-B)-(%) <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="employerEPFPercentage"
//                   value={pfData.employerEPFPercentage}
//                   onChange={handleChange}
//                   placeholder="3.67"
//                   className="mt-2"
//                 />
//               </div>
//               <div>
//                 <Label>
//                   Round Off <span className="text-red-500">*</span>
//                 </Label>
//                 <div className="mt-2">
//                   <StyledSelect
//                     value={pfData.roundOff}
//                     onValueChange={(value) =>
//                       setPfData((prev) => ({ ...prev, roundOff: value }))
//                     }
//                     options={ROUND_OFF_OPTIONS}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <Label htmlFor="accountNo02Rate">
//                   Account No. 02(%) <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="accountNo02Rate"
//                   value={pfData.accountNo02Rate}
//                   onChange={handleChange}
//                   placeholder="0.50"
//                   className="mt-2"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="accountNo21Rate">
//                   Account No. 21(%) <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="accountNo21Rate"
//                   value={pfData.accountNo21Rate}
//                   onChange={handleChange}
//                   placeholder="0.50"
//                   className="mt-2"
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="minimumChargesAccNo02">
//                   Minimum Charges For ACC.No.2{" "}
//                   <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="minimumChargesAccNo02"
//                   value={pfData.minimumChargesAccNo02}
//                   onChange={handleChange}
//                   placeholder="500"
//                   className="mt-2"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Restrict options */}
        
//         {/* Restrict options */}
// <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
//   <label className="flex cursor-pointer items-center gap-3">
//     <input
//       type="radio"
//       name="restrictEmployerShareMode"
//       checked={pfData.restrictEmployerShare}
//       onChange={() =>
//         setPfData((prev) => ({
//           ...prev,
//           restrictEmployerShare: true,
//           restrictEmployerEmployeeWise: false,
//         }))
//       }
//       className="h-4 w-4 shrink-0 text-violet-600 focus:ring-violet-500"
//     />
//     <span className="text-sm">Restrict Employer Share</span>
//   </label>

//   <label className="flex cursor-pointer items-center gap-3">
//     <input
//       type="radio"
//       name="restrictEmployerShareMode"
//       checked={pfData.restrictEmployerEmployeeWise}
//       onChange={() =>
//         setPfData((prev) => ({
//           ...prev,
//           restrictEmployerShare: false,
//           restrictEmployerEmployeeWise: true,
//         }))
//       }
//       className="h-4 w-4 shrink-0 text-violet-600 focus:ring-violet-500"
//     />
//     <span className="text-sm">Restrict Employee Share</span>
//   </label>
// </div>
//         </CardContent>
//       </Card>

//       {/* Footer Buttons */}
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
//           {isSaving ? "Saving..." : "Save"}
//         </Button>
//       </div>
//     </div>
//   );
// }












// import { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { StyledSelect } from "@/components/ui/select";
// import { usePfDetails } from "../hooks/usePfDetails";
// import type { PfConfiguration } from "../types/company.types";
// import { CalendarDays, Clock, Bookmark } from "lucide-react";

// const EMPTY_PF: PfConfiguration = {
//   effectiveFrom: "Feb/2026",
//   epfPercentage: 0,
//   cutoff: 0,
//   pfOnPayDays: false,
//   pensionFundPercentage: 0,
//   employerEPFPercentage: 0,
//   roundOff: "Nearest Amount",
//   accountNo02Rate: 0,
//   accountNo21Rate: 0,
//   minimumChargesAccNo02: 0,
//   restrictEmployerShare: true,
//   restrictEmployerEmployeeWise: false,
// };

// // Generates month/year options
// function generateMonthOptions(): string[] {
//   const months = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//   ];
//   const now = new Date();
//   const options: string[] = [];
//   for (let i = -12; i <= 12; i++) {
//     const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
//     options.push(`${months[d.getMonth()]}/${d.getFullYear()}`);
//   }
//   return options;
// }

// const MONTH_OPTIONS = generateMonthOptions();

// const ROUND_OFF_OPTIONS = [
//   "Nearest Amount",
//   "Higher Amount",
//   "Lower Amount",
// ];

// /* =======================================================
//    SHARED STYLE CONSTANTS (Figma match)
// ======================================================= */

// const inputClass =
//   "mt-2 h-11 border-[#E4DFFB] rounded-lg focus-visible:border-[#7C3AED] focus-visible:ring-[#EDE9FE] focus-visible:ring-2";

// const labelClass = "text-sm font-medium text-gray-800";

// export default function PfDetailsForm() {
//   const { pf, isLoading, updatePf, isSaving } = usePfDetails();
//   const [pfData, setPfData] = useState<PfConfiguration>(EMPTY_PF);

//   useEffect(() => {
//     if (pf) setPfData(pf);
//   }, [pf]);

//   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const { id, value } = e.target;
//     setPfData((prev) => ({ ...prev, [id]: value }));
//   }

//   async function handleSave() {
//     try {
//       await updatePf(pfData).unwrap();
//     } catch (err) {
//       console.error("Failed to save PF details", err);
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="p-4 text-sm text-slate-500 sm:p-6">
//         Loading PF details…
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       <Card className="rounded-2xl border border-[#E9D5FF] shadow-sm">
//         <CardContent className="space-y-6 p-4 sm:space-y-8 sm:p-6">
//           {/* Effective From */}
//           <div
//             className="flex flex-col gap-3 rounded-xl px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
//             style={{ backgroundColor: "#EDE9FE" }}
//           >
//             <div className="flex items-center gap-3">
//               <div
//                 className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-white"
//                 style={{ borderColor: "#E9D5FF" }}
//               >
//                 <CalendarDays className="h-5 w-5 text-[#7C3AED]" />
//               </div>
//               <Label className="text-base font-semibold text-gray-900">
//                 Effective From
//               </Label>
//             </div>

//             <div className="flex items-center gap-3 sm:gap-4">
//               <div className="w-full max-w-[180px] sm:w-40">
//                 <StyledSelect
//                   value={pfData.effectiveFrom}
//                   onValueChange={(value) =>
//                     setPfData((prev) => ({ ...prev, effectiveFrom: value }))
//                   }
//                   options={MONTH_OPTIONS}
//                   className="!h-11 !rounded-lg !border-[#E4DFFB] bg-white"
//                 />
//               </div>
//               <Clock className="h-5 w-5 shrink-0 text-gray-500" />
//             </div>
//           </div>

//           {/* For Employee */}
//           <div>
//             <div className="mb-4 flex items-center gap-3 sm:mb-5">
//               <h3 className="text-base font-semibold text-gray-900">
//                 For Employee
//               </h3>
//               <div className="h-px flex-1 bg-gray-200" />
//             </div>

//             <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:gap-y-6 md:grid-cols-2 lg:grid-cols-3">
//               <div>
//                 <Label htmlFor="epfPercentage" className={labelClass}>
//                   EPF(A)-(%) <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="epfPercentage"
//                   value={pfData.epfPercentage}
//                   onChange={handleChange}
//                   placeholder="12"
//                   className={inputClass}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="cutoff" className={labelClass}>
//                   Cutoff <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="cutoff"
//                   value={pfData.cutoff}
//                   onChange={handleChange}
//                   placeholder="15000"
//                   className={inputClass}
//                 />
//               </div>
//               <div className="flex flex-col">
//                 <Label className={labelClass}>Placeholder alignment</Label>
//                 <div className="mt-2 flex h-11 items-center gap-3">
//                   <Checkbox
//                     checked={pfData.pfOnPayDays}
//                     onCheckedChange={(checked) =>
//                       setPfData((prev) => ({
//                         ...prev,
//                         pfOnPayDays: checked === true,
//                       }))
//                     }
//                     className="h-4 w-4 border-[#DDD6FE] data-[state=checked]:bg-[#7C3AED] data-[state=checked]:border-[#7C3AED]"
//                   />
//                   <span className="text-sm text-gray-700">PF On Pay Days</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* For Employer */}
//           <div>
//             <div className="mb-4 flex items-center gap-3 sm:mb-5">
//               <h3 className="text-base font-semibold text-gray-900">
//                 For Employer
//               </h3>
//               <div className="h-px flex-1 bg-gray-200" />
//             </div>

//             <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:gap-y-6 md:grid-cols-2 lg:grid-cols-3">
//               <div>
//                 <Label htmlFor="pensionFundPercentage" className={labelClass}>
//                   Pension Fund(B)-(%) <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="pensionFundPercentage"
//                   value={pfData.pensionFundPercentage}
//                   onChange={handleChange}
//                   placeholder="8.33"
//                   className={inputClass}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="employerEPFPercentage" className={labelClass}>
//                   EPF(A-B)-(%) <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="employerEPFPercentage"
//                   value={pfData.employerEPFPercentage}
//                   onChange={handleChange}
//                   placeholder="3.67"
//                   className={inputClass}
//                 />
//               </div>
//               <div>
//                 <Label className={labelClass}>
//                   Round Off <span className="text-red-500">*</span>
//                 </Label>
//                 <div className="mt-2">
//                   <StyledSelect
//                     value={pfData.roundOff}
//                     onValueChange={(value) =>
//                       setPfData((prev) => ({ ...prev, roundOff: value }))
//                     }
//                     options={ROUND_OFF_OPTIONS}
//                     className="!h-11 !rounded-lg !border-[#E4DFFB]"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <Label htmlFor="accountNo02Rate" className={labelClass}>
//                   Account No. 02(%) <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="accountNo02Rate"
//                   value={pfData.accountNo02Rate}
//                   onChange={handleChange}
//                   placeholder="0.50"
//                   className={inputClass}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="accountNo21Rate" className={labelClass}>
//                   Account No. 21(%) <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="accountNo21Rate"
//                   value={pfData.accountNo21Rate}
//                   onChange={handleChange}
//                   placeholder="0.50"
//                   className={inputClass}
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="minimumChargesAccNo02" className={labelClass}>
//                   Minimum Charges For ACC.No.2{" "}
//                   <span className="text-red-500">*</span>
//                 </Label>
//                 <Input
//                   id="minimumChargesAccNo02"
//                   value={pfData.minimumChargesAccNo02}
//                   onChange={handleChange}
//                   placeholder="500"
//                   className={inputClass}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Restrict options */}
//           <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
//             <label className="flex cursor-pointer items-center gap-2">
//               <input
//                 type="radio"
//                 name="restrictEmployerShareMode"
//                 checked={pfData.restrictEmployerShare}
//                 onChange={() =>
//                   setPfData((prev) => ({
//                     ...prev,
//                     restrictEmployerShare: true,
//                     restrictEmployerEmployeeWise: false,
//                   }))
//                 }
//                 className="h-4 w-4 shrink-0 accent-[#7C3AED] focus:ring-[#7C3AED]"
//               />
//               <span className="text-sm text-gray-700">Restrict Employer Share</span>
//             </label>

//             <label className="flex cursor-pointer items-center gap-2">
//               <input
//                 type="radio"
//                 name="restrictEmployerShareMode"
//                 checked={pfData.restrictEmployerEmployeeWise}
//                 onChange={() =>
//                   setPfData((prev) => ({
//                     ...prev,
//                     restrictEmployerShare: false,
//                     restrictEmployerEmployeeWise: true,
//                   }))
//                 }
//                 className="h-4 w-4 shrink-0 accent-[#7C3AED] focus:ring-[#7C3AED]"
//               />
//               <span className="text-sm text-gray-700">Restrict Employee Share</span>
//             </label>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Footer Buttons */}
//       <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end sm:gap-4">
//         <Button variant="outline" type="button" className="w-full border-[#E4DFFB] sm:w-auto">
//           Load Default Value
//         </Button>
//         <Button
//           type="button"
//           onClick={handleSave}
//           disabled={isSaving}
//           className="flex w-full items-center justify-center gap-2 bg-[#7C3AED] text-white hover:bg-[#6D28D9] sm:w-auto"
//         >
//           <Bookmark className="h-4 w-4" />
//           {isSaving ? "Saving..." : "Save"}
//         </Button>
//       </div>
//     </div>
//   );
// }





import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StyledSelect } from "@/components/ui/select";
import { usePfDetails } from "../hooks/usePfDetails";
import type { PfConfiguration } from "../types/company.types";
import { CalendarDays, Clock, Bookmark } from "lucide-react";

const EMPTY_PF: PfConfiguration = {
  effectiveFrom: "Feb/2026",
  epfPercentage: 0,
  cutoff: 0,
  pfOnPayDays: false,
  pensionFundPercentage: 0,
  employerEPFPercentage: 0,
  roundOff: "Nearest Amount",
  accountNo02Rate: 0,
  accountNo21Rate: 0,
  minimumChargesAccNo02: 0,
  restrictEmployerShare: true,
  restrictEmployerEmployeeWise: false,
};

// Generates month/year options
function generateMonthOptions(): string[] {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const now = new Date();
  const options: string[] = [];

  for (let i = -12; i <= 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    options.push(`${months[d.getMonth()]}/${d.getFullYear()}`);
  }

  return options;
}

const MONTH_OPTIONS = generateMonthOptions();

const ROUND_OFF_OPTIONS = [
  "Nearest Amount",
  "Higher Amount",
  "Lower Amount",
];

/* =======================================================
   FIGMA INPUT STYLES
======================================================= */

/*
  Normal:
  - White background
  - Thin border

  Focus:
  - Border becomes #4DD2FF
  - Very light focus ring
  - No thick border
*/
const inputClass =
  "mt-2 h-11 rounded-lg border border-[#E4DFFB] bg-white transition-colors duration-150 " +
  "focus-visible:border-[#4DD2FF] " +
  "focus-visible:ring-1 focus-visible:ring-[#4DD2FF]/20 " +
  "focus-visible:outline-none";

const labelClass = "text-sm font-medium text-gray-800";

export default function PfDetailsForm() {
  const { pf, isLoading, updatePf, isSaving } = usePfDetails();

  const [pfData, setPfData] =
    useState<PfConfiguration>(EMPTY_PF);

  useEffect(() => {
    if (pf) {
      setPfData(pf);
    }
  }, [pf]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { id, value } = e.target;

    setPfData((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  async function handleSave() {
    try {
      await updatePf(pfData).unwrap();
    } catch (err) {
      console.error("Failed to save PF details", err);
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-slate-500 sm:p-6">
        Loading PF details…
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* =================================================
          MAIN CARD
      ================================================= */}

      <Card className="rounded-2xl border border-[#E9D5FF] shadow-sm">
        <CardContent className="space-y-6 p-4 sm:space-y-8 sm:p-6">

          {/* =================================================
              EFFECTIVE FROM
          ================================================= */}

          <div
            className="
              flex
              flex-col
              gap-3
              rounded-xl
              px-4
              py-4
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:px-5
            "
            style={{
              backgroundColor: "#EDE9FE",
            }}
          >
            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  border
                  bg-white
                "
                style={{
                  borderColor: "#E9D5FF",
                }}
              >
                <CalendarDays
                  className="h-5 w-5 text-[#7C3AED]"
                />
              </div>

              <Label className="text-base font-semibold text-gray-900">
                Effective From
              </Label>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">

              <div className="w-full max-w-[180px] sm:w-40">
                <StyledSelect
                  value={pfData.effectiveFrom}
                  onValueChange={(value) =>
                    setPfData((prev) => ({
                      ...prev,
                      effectiveFrom: value,
                    }))
                  }
                  options={MONTH_OPTIONS}
                  className="
                    !h-11
                    !rounded-lg
                    !border-[#E4DFFB]
                    bg-white
                  "
                />
              </div>

              <Clock className="h-5 w-5 shrink-0 text-gray-500" />
            </div>
          </div>

          {/* =================================================
              FOR EMPLOYEE
          ================================================= */}

          <div>
            <div className="mb-4 flex items-center gap-3 sm:mb-5">

              <h3 className="text-base font-semibold text-gray-900">
                For Employee
              </h3>

              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div
              className="
                grid
                grid-cols-1
                gap-x-8
                gap-y-5
                sm:gap-y-6
                md:grid-cols-2
                lg:grid-cols-3
              "
            >

              {/* EPF */}
              <div>
                <Label
                  htmlFor="epfPercentage"
                  className={labelClass}
                >
                  EPF(A)-(%){" "}
                  <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="epfPercentage"
                  value={pfData.epfPercentage}
                  onChange={handleChange}
                  placeholder="12"
                  className={inputClass}
                />
              </div>

              {/* Cutoff */}
              <div>
                <Label
                  htmlFor="cutoff"
                  className={labelClass}
                >
                  Cutoff{" "}
                  <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="cutoff"
                  value={pfData.cutoff}
                  onChange={handleChange}
                  placeholder="15000"
                  className={inputClass}
                />
              </div>

              {/* PF On Pay Days */}
              <div className="flex flex-col">

                <Label className={labelClass}>
                  Placeholder alignment
                </Label>

                <div className="mt-2 flex h-11 items-center gap-3">

                  <Checkbox
                    checked={pfData.pfOnPayDays}
                    onCheckedChange={(checked) =>
                      setPfData((prev) => ({
                        ...prev,
                        pfOnPayDays: checked === true,
                      }))
                    }
                    className="
                      h-4
                      w-4
                      border-[#DDD6FE]
                      data-[state=checked]:border-[#7C3AED]
                      data-[state=checked]:bg-[#7C3AED]
                    "
                  />

                  <span className="text-sm text-gray-700">
                    PF On Pay Days
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              FOR EMPLOYER
          ================================================= */}

          <div>
            <div className="mb-4 flex items-center gap-3 sm:mb-5">

              <h3 className="text-base font-semibold text-gray-900">
                For Employer
              </h3>

              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div
              className="
                grid
                grid-cols-1
                gap-x-8
                gap-y-5
                sm:gap-y-6
                md:grid-cols-2
                lg:grid-cols-3
              "
            >

              {/* Pension Fund */}
              <div>
                <Label
                  htmlFor="pensionFundPercentage"
                  className={labelClass}
                >
                  Pension Fund(B)-(%){" "}
                  <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="pensionFundPercentage"
                  value={pfData.pensionFundPercentage}
                  onChange={handleChange}
                  placeholder="8.33"
                  className={inputClass}
                />
              </div>

              {/* Employer EPF */}
              <div>
                <Label
                  htmlFor="employerEPFPercentage"
                  className={labelClass}
                >
                  EPF(A-B)-(%){" "}
                  <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="employerEPFPercentage"
                  value={pfData.employerEPFPercentage}
                  onChange={handleChange}
                  placeholder="3.67"
                  className={inputClass}
                />
              </div>

              {/* Round Off */}
              <div>
                <Label className={labelClass}>
                  Round Off{" "}
                  <span className="text-red-500">*</span>
                </Label>

                <div className="mt-2">
                  <StyledSelect
                    value={pfData.roundOff}
                    onValueChange={(value) =>
                      setPfData((prev) => ({
                        ...prev,
                        roundOff: value,
                      }))
                    }
                    options={ROUND_OFF_OPTIONS}
                    className="
                      !h-11
                      !rounded-lg
                      !border-[#E4DFFB]
                    "
                  />
                </div>
              </div>

              {/* Account No 02 */}
              <div>
                <Label
                  htmlFor="accountNo02Rate"
                  className={labelClass}
                >
                  Account No. 02(%){" "}
                  <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="accountNo02Rate"
                  value={pfData.accountNo02Rate}
                  onChange={handleChange}
                  placeholder="0.50"
                  className={inputClass}
                />
              </div>

              {/* Account No 21 */}
              <div>
                <Label
                  htmlFor="accountNo21Rate"
                  className={labelClass}
                >
                  Account No. 21(%){" "}
                  <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="accountNo21Rate"
                  value={pfData.accountNo21Rate}
                  onChange={handleChange}
                  placeholder="0.50"
                  className={inputClass}
                />
              </div>

              {/* Minimum Charges */}
              <div>
                <Label
                  htmlFor="minimumChargesAccNo02"
                  className={labelClass}
                >
                  Minimum Charges For ACC.No.2{" "}
                  <span className="text-red-500">*</span>
                </Label>

                <Input
                  id="minimumChargesAccNo02"
                  value={pfData.minimumChargesAccNo02}
                  onChange={handleChange}
                  placeholder="500"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* =================================================
              RESTRICT OPTIONS
          ================================================= */}

          <div
            className="
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
              sm:gap-8
            "
          >

            <label className="flex cursor-pointer items-center gap-2">

              <input
                type="radio"
                name="restrictEmployerShareMode"
                checked={pfData.restrictEmployerShare}
                onChange={() =>
                  setPfData((prev) => ({
                    ...prev,
                    restrictEmployerShare: true,
                    restrictEmployerEmployeeWise: false,
                  }))
                }
                className="
                  h-4
                  w-4
                  shrink-0
                  accent-[#7C3AED]
                  focus:ring-[#7C3AED]
                "
              />

              <span className="text-sm text-gray-700">
                Restrict Employer Share
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-2">

              <input
                type="radio"
                name="restrictEmployerShareMode"
                checked={
                  pfData.restrictEmployerEmployeeWise
                }
                onChange={() =>
                  setPfData((prev) => ({
                    ...prev,
                    restrictEmployerShare: false,
                    restrictEmployerEmployeeWise: true,
                  }))
                }
                className="
                  h-4
                  w-4
                  shrink-0
                  accent-[#7C3AED]
                  focus:ring-[#7C3AED]
                "
              />

              <span className="text-sm text-gray-700">
                Restrict Employee Share
              </span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* =================================================
          FOOTER BUTTONS
      ================================================= */}

      <div
        className="
          flex
          flex-col-reverse
          gap-3
          pt-4
          sm:flex-row
          sm:justify-end
          sm:gap-4
        "
      >

        <Button
          variant="outline"
          type="button"
          className="
            w-full
            border-[#E4DFFB]
            sm:w-auto
          "
        >
          Load Default Value
        </Button>

        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            bg-[#7C3AED]
            text-white
            hover:bg-[#6D28D9]
            sm:w-auto
          "
        >
          <Bookmark className="h-4 w-4" />

          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
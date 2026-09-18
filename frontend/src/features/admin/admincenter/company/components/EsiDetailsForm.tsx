// import { useState, useEffect } from "react";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useEsiDetails } from "../hooks/useEsiDetails";
// import type { EsiConfiguration } from "../types/company.types";
// import { CalendarDays, Clock, Bookmark } from "lucide-react";

// const EMPTY_ESI: EsiConfiguration = {
//   effectiveFrom: "Feb/2026",
//   cutOffAmount: 0,
//   employeeRate: 0,
//   employerRate: 0,
//   minimumDailyWage: 0,
//   roundOff: "Higher Amount",
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

// export default function EsiDetailsForm() {
//   const { esi, isLoading, updateEsi, isSaving } = useEsiDetails();
//   const [esiData, setEsiData] = useState<EsiConfiguration>(EMPTY_ESI);

//   useEffect(() => {
//     if (esi) setEsiData(esi);
//   }, [esi]);

//   function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
//     const { id, value } = e.target;
//     setEsiData((prev) => ({ ...prev, [id]: value }));
//   }

//   async function handleSave() {
//     try {
//       await updateEsi(esiData).unwrap();
//     } catch (err) {
//       console.error("Failed to save ESI details", err);
//     }
//   }

//   if (isLoading) return <div className="text-sm text-slate-500 p-6">Loading ESI details…</div>;

//   return (
//     <div>
//       <Card className="rounded-2xl border border-gray-200 shadow-sm p-6">
//         {/* Effective From */}
//         <div className="grid grid-cols-3 items-center bg-violet-100 rounded-xl p-4 mb-8">
//           <div className="flex items-center gap-3">
//             <div className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center">
//               <CalendarDays className="w-5 h-5 text-violet-600" />
//             </div>
//             <Label htmlFor="effectiveFrom" className="font-medium">
//               Effective From
//             </Label>
//           </div>

//           <div className="flex justify-center">
//             <select
//               id="effectiveFrom"
//               value={esiData.effectiveFrom}
//               onChange={handleChange}
//               className="h-9 w-40 bg-white border rounded-md px-3 text-sm"
//             >
//               {MONTH_OPTIONS.map((m) => (
//                 <option key={m} value={m}>
//                   {m}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex justify-end">
//             <Clock className="w-5 h-5 text-gray-500" />
//           </div>
//         </div>

//         {/* First Row */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div>
//             <Label htmlFor="cutOffAmount">Cut Off(Amount)</Label>
//             <Input
//               id="cutOffAmount"
//               placeholder="21000"
//               className="mt-2 h-11"
//               value={esiData.cutOffAmount}
//               onChange={handleChange}
//             />
//           </div>
//           <div>
//             <Label htmlFor="employeeRate">Employee Rate(%)</Label>
//             <Input
//               id="employeeRate"
//               placeholder="0.75"
//               className="mt-2 h-11"
//               value={esiData.employeeRate}
//               onChange={handleChange}
//             />
//           </div>
//         </div>

//         {/* Second Row */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           <div>
//             <Label htmlFor="employerRate">Employer Rate(%)</Label>
//             <Input
//               id="employerRate"
//               placeholder="3.25"
//               className="mt-2 h-11"
//               value={esiData.employerRate}
//               onChange={handleChange}
//             />
//           </div>
//           <div>
//             <Label htmlFor="minimumDailyWage">Minimum Daily Wage (Amount)</Label>
//             <Input
//               id="minimumDailyWage"
//               placeholder="137"
//               className="mt-2 h-11"
//               value={esiData.minimumDailyWage}
//               onChange={handleChange}
//             />
//           </div>
//         </div>

//         {/* Round Off */}
//         <div className="inline-block">
//           <Label htmlFor="roundOff">Round Off</Label>
//           <select
//             id="roundOff"
//             value={esiData.roundOff}
//             onChange={handleChange}
//             className="mt-2 h-11 w-44 border rounded-md px-3"
//           >
//             <option value="Higher Amount">Higher Amount</option>
//             <option value="Lower Amount">Lower Amount</option>
//             <option value="Nearest Amount">Nearest Amount</option>
//           </select>
//         </div>
//       </Card>

//       {/* Buttons — outside the card, on the page background */}
//       <div className="flex justify-end gap-4 mt-6">
//         <button type="button" className="px-5 py-2 border rounded-lg bg-white hover:bg-gray-100">
//           Load Default Value
//         </button>
//         <button
//           type="button"
//           className="flex items-center gap-2 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
//           onClick={handleSave}
//           disabled={isSaving}
//         >
//           <Bookmark className="w-4 h-4" />
//           {isSaving ? "Saving" : "Save"}
//         </button>
//       </div>
//     </div>
//   );
// }











// import { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { StyledSelect } from "@/components/ui/select";
// import { useEsiDetails } from "../hooks/useEsiDetails";
// import type { EsiConfiguration } from "../types/company.types";
// import { CalendarDays, Clock, Bookmark } from "lucide-react";

// const EMPTY_ESI: EsiConfiguration = {
//   effectiveFrom: "Feb/2026",
//   cutOffAmount: 0,
//   employeeRate: 0,
//   employerRate: 0,
//   minimumDailyWage: 0,
//   roundOff: "Higher Amount",
// };

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
//   "Higher Amount",
//   "Lower Amount",
//   "Nearest Amount",
// ];

// export default function EsiDetailsForm() {
//   const { esi, isLoading, updateEsi, isSaving } = useEsiDetails();
//   const [esiData, setEsiData] = useState<EsiConfiguration>(EMPTY_ESI);

//   useEffect(() => {
//     if (esi) setEsiData(esi);
//   }, [esi]);

//   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const { id, value } = e.target;
//     setEsiData((prev) => ({ ...prev, [id]: value }));
//   }

//   async function handleSave() {
//     try {
//       await updateEsi(esiData).unwrap();
//     } catch (err) {
//       console.error("Failed to save ESI details", err);
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="p-4 text-sm text-slate-500 sm:p-6">
//         Loading ESI details…
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       <Card>
//         <CardContent className="space-y-6 p-4 sm:space-y-8 sm:p-6">
//           {/* Effective From — responsive */}
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
//                   value={esiData.effectiveFrom}
//                   onValueChange={(value) =>
//                     setEsiData((prev) => ({ ...prev, effectiveFrom: value }))
//                   }
//                   options={MONTH_OPTIONS}
//                   className="!h-9"
//                 />
//               </div>
//               <Clock className="h-5 w-5 shrink-0 text-gray-500" />
//             </div>
//           </div>

//           {/* Fields */}
//           <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
//             <div>
//               <Label htmlFor="cutOffAmount">Cut Off (Amount)</Label>
//               <Input
//                 id="cutOffAmount"
//                 placeholder="21000"
//                 className="mt-2 h-11"
//                 value={esiData.cutOffAmount}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <Label htmlFor="employeeRate">Employee Rate (%)</Label>
//               <Input
//                 id="employeeRate"
//                 placeholder="0.75"
//                 className="mt-2 h-11"
//                 value={esiData.employeeRate}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <Label htmlFor="employerRate">Employer Rate (%)</Label>
//               <Input
//                 id="employerRate"
//                 placeholder="3.25"
//                 className="mt-2 h-11"
//                 value={esiData.employerRate}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <Label htmlFor="minimumDailyWage">
//                 Minimum Daily Wage (Amount)
//               </Label>
//               <Input
//                 id="minimumDailyWage"
//                 placeholder="137"
//                 className="mt-2 h-11"
//                 value={esiData.minimumDailyWage}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           {/* Round Off */}
//           <div className="max-w-[220px]">
//             <Label>Round Off</Label>
//             <div className="mt-2">
//               <StyledSelect
//                 value={esiData.roundOff}
//                 onValueChange={(value) =>
//                   setEsiData((prev) => ({ ...prev, roundOff: value }))
//                 }
//                 options={ROUND_OFF_OPTIONS}
//               />
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
// import { StyledSelect } from "@/components/ui/select";
// import { useEsiDetails } from "../hooks/useEsiDetails";
// import type { EsiConfiguration } from "../types/company.types";
// import { CalendarDays, Clock, Bookmark } from "lucide-react";

// const EMPTY_ESI: EsiConfiguration = {
//   effectiveFrom: "Feb/2026",
//   cutOffAmount: 0,
//   employeeRate: 0,
//   employerRate: 0,
//   minimumDailyWage: 0,
//   roundOff: "Higher Amount",
// };

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
//   "Higher Amount",
//   "Lower Amount",
//   "Nearest Amount",
// ];

// /* =======================================================
//    SHARED STYLE CONSTANTS (Figma match)
// ======================================================= */

// const inputClass =
//   "mt-2 h-11 border-[#E4DFFB] rounded-lg focus-visible:border-[#7C3AED] focus-visible:ring-[#EDE9FE] focus-visible:ring-2";

// const labelClass = "text-sm font-medium text-gray-800";

// export default function EsiDetailsForm() {
//   const { esi, isLoading, updateEsi, isSaving } = useEsiDetails();
//   const [esiData, setEsiData] = useState<EsiConfiguration>(EMPTY_ESI);

//   useEffect(() => {
//     if (esi) setEsiData(esi);
//   }, [esi]);

//   function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
//     const { id, value } = e.target;
//     setEsiData((prev) => ({ ...prev, [id]: value }));
//   }

//   async function handleSave() {
//     try {
//       await updateEsi(esiData).unwrap();
//     } catch (err) {
//       console.error("Failed to save ESI details", err);
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="p-4 text-sm text-slate-500 sm:p-6">
//         Loading ESI details…
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
//                   value={esiData.effectiveFrom}
//                   onValueChange={(value) =>
//                     setEsiData((prev) => ({ ...prev, effectiveFrom: value }))
//                   }
//                   options={MONTH_OPTIONS}
//                   className="!h-11 !rounded-lg !border-[#E4DFFB] bg-white"
//                 />
//               </div>
//               <Clock className="h-5 w-5 shrink-0 text-gray-500" />
//             </div>
//           </div>

//           {/* Fields */}
//           <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:gap-y-6 md:grid-cols-2">
//             <div>
//               <Label htmlFor="cutOffAmount" className={labelClass}>
//                 Cut Off (Amount)
//               </Label>
//               <Input
//                 id="cutOffAmount"
//                 placeholder="21000"
//                 className={inputClass}
//                 value={esiData.cutOffAmount}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <Label htmlFor="employeeRate" className={labelClass}>
//                 Employee Rate (%)
//               </Label>
//               <Input
//                 id="employeeRate"
//                 placeholder="0.75"
//                 className={inputClass}
//                 value={esiData.employeeRate}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <Label htmlFor="employerRate" className={labelClass}>
//                 Employer Rate (%)
//               </Label>
//               <Input
//                 id="employerRate"
//                 placeholder="3.25"
//                 className={inputClass}
//                 value={esiData.employerRate}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <Label htmlFor="minimumDailyWage" className={labelClass}>
//                 Minimum Daily Wage (Amount)
//               </Label>
//               <Input
//                 id="minimumDailyWage"
//                 placeholder="137"
//                 className={inputClass}
//                 value={esiData.minimumDailyWage}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>

//           {/* Round Off */}
//           <div className="max-w-[220px]">
//             <Label className={labelClass}>Round Off</Label>
//             <div className="mt-2">
//               <StyledSelect
//                 value={esiData.roundOff}
//                 onValueChange={(value) =>
//                   setEsiData((prev) => ({ ...prev, roundOff: value }))
//                 }
//                 options={ROUND_OFF_OPTIONS}
//                 className="!h-11 !rounded-lg !border-[#E4DFFB]"
//               />
//             </div>
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










// import { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { StyledSelect } from "@/components/ui/select";
// import { useEsiDetails } from "../hooks/useEsiDetails";
// import type { EsiConfiguration } from "../types/company.types";
// import { CalendarDays, Clock, Bookmark } from "lucide-react";

// const EMPTY_ESI: EsiConfiguration = {
//   effectiveFrom: "Feb/2026",
//   cutOffAmount: 0,
//   employeeRate: 0,
//   employerRate: 0,
//   minimumDailyWage: 0,
//   roundOff: "Higher Amount",
// };

// /* =======================================================
//    MONTH OPTIONS
// ======================================================= */

// function generateMonthOptions(): string[] {
//   const months = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];

//   const now = new Date();
//   const options: string[] = [];

//   for (let i = -12; i <= 12; i++) {
//     const d = new Date(
//       now.getFullYear(),
//       now.getMonth() + i,
//       1
//     );

//     options.push(
//       `${months[d.getMonth()]}/${d.getFullYear()}`
//     );
//   }

//   return options;
// }

// const MONTH_OPTIONS = generateMonthOptions();

// const ROUND_OFF_OPTIONS = [
//   "Higher Amount",
//   "Lower Amount",
//   "Nearest Amount",
// ];

// /* =======================================================
//    SHARED STYLE CONSTANTS
//    Figma input style
// ======================================================= */

// const inputClass =
//   "mt-2 h-11 rounded-lg border border-[#4DD2FF] bg-white text-gray-900 focus-visible:border-[#4DD2FF] focus-visible:ring-[#4DD2FF]/20 focus-visible:ring-1";

// const labelClass =
//   "text-sm font-medium text-gray-800";

// /* =======================================================
//    COMPONENT
// ======================================================= */

// export default function EsiDetailsForm() {
//   const {
//     esi,
//     isLoading,
//     updateEsi,
//     isSaving,
//   } = useEsiDetails();

//   const [esiData, setEsiData] =
//     useState<EsiConfiguration>(EMPTY_ESI);

//   useEffect(() => {
//     if (esi) {
//       setEsiData(esi);
//     }
//   }, [esi]);

//   function handleChange(
//     e: React.ChangeEvent<HTMLInputElement>
//   ) {
//     const { id, value } = e.target;

//     setEsiData((prev) => ({
//       ...prev,
//       [id]: value,
//     }));
//   }

//   async function handleSave() {
//     try {
//       await updateEsi(esiData).unwrap();
//     } catch (err) {
//       console.error(
//         "Failed to save ESI details",
//         err
//       );
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="p-4 text-sm text-slate-500 sm:p-6">
//         Loading ESI details…
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       {/* =================================================
//           MAIN CARD
//       ================================================= */}

//       <Card className="rounded-2xl border border-[#E9D5FF] shadow-sm">
//         <CardContent className="space-y-6 p-4 sm:space-y-8 sm:p-6">

//           {/* =================================================
//               EFFECTIVE FROM
//           ================================================= */}

//           <div
//             className="
//               flex flex-col gap-3
//               rounded-xl
//               px-4 py-4
//               sm:flex-row
//               sm:items-center
//               sm:justify-between
//               sm:px-5
//             "
//             style={{
//               backgroundColor: "#EDE9FE",
//             }}
//           >
//             <div className="flex items-center gap-3">
//               <div
//                 className="
//                   flex
//                   h-10
//                   w-10
//                   shrink-0
//                   items-center
//                   justify-center
//                   rounded-lg
//                   border
//                   bg-white
//                 "
//                 style={{
//                   borderColor: "#E9D5FF",
//                 }}
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
//                   value={esiData.effectiveFrom}
//                   onValueChange={(value) =>
//                     setEsiData((prev) => ({
//                       ...prev,
//                       effectiveFrom: value,
//                     }))
//                   }
//                   options={MONTH_OPTIONS}
//                   className="
//                     !h-11
//                     !rounded-lg
//                     !border
//                     !border-[#4DD2FF]
//                     bg-white
//                     focus:!border-[#4DD2FF]
//                   "
//                 />
//               </div>

//               <Clock className="h-5 w-5 shrink-0 text-gray-500" />
//             </div>
//           </div>

//           {/* =================================================
//               INPUT FIELDS
//           ================================================= */}

//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-x-8
//               gap-y-5
//               sm:gap-y-6
//               md:grid-cols-2
//             "
//           >

//             {/* Cut Off Amount */}

//             <div>
//               <Label
//                 htmlFor="cutOffAmount"
//                 className={labelClass}
//               >
//                 Cut Off (Amount)
//               </Label>

//               <Input
//                 id="cutOffAmount"
//                 placeholder="21000"
//                 className={inputClass}
//                 value={esiData.cutOffAmount}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* Employee Rate */}

//             <div>
//               <Label
//                 htmlFor="employeeRate"
//                 className={labelClass}
//               >
//                 Employee Rate (%)
//               </Label>

//               <Input
//                 id="employeeRate"
//                 placeholder="0.75"
//                 className={inputClass}
//                 value={esiData.employeeRate}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* Employer Rate */}

//             <div>
//               <Label
//                 htmlFor="employerRate"
//                 className={labelClass}
//               >
//                 Employer Rate (%)
//               </Label>

//               <Input
//                 id="employerRate"
//                 placeholder="3.25"
//                 className={inputClass}
//                 value={esiData.employerRate}
//                 onChange={handleChange}
//               />
//             </div>

//             {/* Minimum Daily Wage */}

//             <div>
//               <Label
//                 htmlFor="minimumDailyWage"
//                 className={labelClass}
//               >
//                 Minimum Daily Wage (Amount)
//               </Label>

//               <Input
//                 id="minimumDailyWage"
//                 placeholder="137"
//                 className={inputClass}
//                 value={esiData.minimumDailyWage}
//                 onChange={handleChange}
//               />
//             </div>

//           </div>

//           {/* =================================================
//               ROUND OFF
//           ================================================= */}

//           <div className="max-w-[220px]">
//             <Label className={labelClass}>
//               Round Off
//             </Label>

//             <div className="mt-2">
//               <StyledSelect
//                 value={esiData.roundOff}
//                 onValueChange={(value) =>
//                   setEsiData((prev) => ({
//                     ...prev,
//                     roundOff: value,
//                   }))
//                 }
//                 options={ROUND_OFF_OPTIONS}
//                 className="
//                   !h-11
//                   !rounded-lg
//                   !border
//                   !border-[#4DD2FF]
//                   bg-white
//                   focus:!border-[#4DD2FF]
//                 "
//               />
//             </div>
//           </div>

//         </CardContent>
//       </Card>

//       {/* =================================================
//           FOOTER BUTTONS
//       ================================================= */}

//       <div
//         className="
//           flex
//           flex-col-reverse
//           gap-3
//           pt-4
//           sm:flex-row
//           sm:justify-end
//           sm:gap-4
//         "
//       >
//         <Button
//           variant="outline"
//           type="button"
//           className="
//             w-full
//             border
//             border-[#4DD2FF]
//             sm:w-auto
//           "
//         >
//           Load Default Value
//         </Button>

//         <Button
//           type="button"
//           onClick={handleSave}
//           disabled={isSaving}
//           className="
//             flex
//             w-full
//             items-center
//             justify-center
//             gap-2
//             bg-[#7C3AED]
//             text-white
//             hover:bg-[#6D28D9]
//             sm:w-auto
//           "
//         >
//           <Bookmark className="h-4 w-4" />

//           {isSaving
//             ? "Saving..."
//             : "Save"}
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
import { StyledSelect } from "@/components/ui/select";
import { useEsiDetails } from "../hooks/useEsiDetails";
import type { EsiConfiguration } from "../types/company.types";
import { CalendarDays, Clock, Bookmark } from "lucide-react";

const EMPTY_ESI: EsiConfiguration = {
  effectiveFrom: "Feb/2026",
  cutOffAmount: 0,
  employeeRate: 0,
  employerRate: 0,
  minimumDailyWage: 0,
  roundOff: "Higher Amount",
};

/* =======================================================
   MONTH OPTIONS
======================================================= */

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
    const d = new Date(
      now.getFullYear(),
      now.getMonth() + i,
      1
    );

    options.push(
      `${months[d.getMonth()]}/${d.getFullYear()}`
    );
  }

  return options;
}

const MONTH_OPTIONS = generateMonthOptions();

const ROUND_OFF_OPTIONS = [
  "Higher Amount",
  "Lower Amount",
  "Nearest Amount",
];

/* =======================================================
   SHARED STYLE CONSTANTS
   Normal border = #E4DFFB
   Focus border = #4DD2FF
======================================================= */

const inputClass =
  "mt-2 h-11 rounded-lg border border-[#E4DFFB] bg-white text-gray-900 focus-visible:border-[#4DD2FF] focus-visible:ring-[#4DD2FF]/20 focus-visible:ring-1";

const labelClass =
  "text-sm font-medium text-gray-800";

/* =======================================================
   COMPONENT
======================================================= */

export default function EsiDetailsForm() {
  const {
    esi,
    isLoading,
    updateEsi,
    isSaving,
  } = useEsiDetails();

  const [esiData, setEsiData] =
    useState<EsiConfiguration>(EMPTY_ESI);

  useEffect(() => {
    if (esi) {
      setEsiData(esi);
    }
  }, [esi]);

  /* =====================================================
     INPUT CHANGE
  ===================================================== */

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { id, value } = e.target;

    setEsiData((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  /* =====================================================
     SAVE
  ===================================================== */

  async function handleSave() {
    try {
      await updateEsi(esiData).unwrap();
    } catch (err) {
      console.error(
        "Failed to save ESI details",
        err
      );
    }
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-slate-500 sm:p-6">
        Loading ESI details…
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
                <CalendarDays className="h-5 w-5 text-[#7C3AED]" />
              </div>

              <Label className="text-base font-semibold text-gray-900">
                Effective From
              </Label>

            </div>

            <div className="flex items-center gap-3 sm:gap-4">

              <div className="w-full max-w-[180px] sm:w-40">

                <StyledSelect
                  value={esiData.effectiveFrom}
                  onValueChange={(value) =>
                    setEsiData((prev) => ({
                      ...prev,
                      effectiveFrom: value,
                    }))
                  }
                  options={MONTH_OPTIONS}
                  className="
                    !h-11
                    !rounded-lg
                    !border
                    !border-[#E4DFFB]
                    bg-white
                    focus:!border-[#4DD2FF]
                  "
                />

              </div>

              <Clock
                className="
                  h-5
                  w-5
                  shrink-0
                  text-gray-500
                "
              />

            </div>
          </div>

          {/* =================================================
              INPUT FIELDS
          ================================================= */}

          <div
            className="
              grid
              grid-cols-1
              gap-x-8
              gap-y-5
              sm:gap-y-6
              md:grid-cols-2
            "
          >

            {/* =================================================
                CUT OFF AMOUNT
            ================================================= */}

            <div>

              <Label
                htmlFor="cutOffAmount"
                className={labelClass}
              >
                Cut Off (Amount)
              </Label>

              <Input
                id="cutOffAmount"
                placeholder="21000"
                className={inputClass}
                value={esiData.cutOffAmount}
                onChange={handleChange}
              />

            </div>

            {/* =================================================
                EMPLOYEE RATE
            ================================================= */}

            <div>

              <Label
                htmlFor="employeeRate"
                className={labelClass}
              >
                Employee Rate (%)
              </Label>

              <Input
                id="employeeRate"
                placeholder="0.75"
                className={inputClass}
                value={esiData.employeeRate}
                onChange={handleChange}
              />

            </div>

            {/* =================================================
                EMPLOYER RATE
            ================================================= */}

            <div>

              <Label
                htmlFor="employerRate"
                className={labelClass}
              >
                Employer Rate (%)
              </Label>

              <Input
                id="employerRate"
                placeholder="3.25"
                className={inputClass}
                value={esiData.employerRate}
                onChange={handleChange}
              />

            </div>

            {/* =================================================
                MINIMUM DAILY WAGE
            ================================================= */}

            <div>

              <Label
                htmlFor="minimumDailyWage"
                className={labelClass}
              >
                Minimum Daily Wage (Amount)
              </Label>

              <Input
                id="minimumDailyWage"
                placeholder="137"
                className={inputClass}
                value={esiData.minimumDailyWage}
                onChange={handleChange}
              />

            </div>

          </div>

          {/* =================================================
              ROUND OFF
          ================================================= */}

          <div className="max-w-[220px]">

            <Label className={labelClass}>
              Round Off
            </Label>

            <div className="mt-2">

              <StyledSelect
                value={esiData.roundOff}
                onValueChange={(value) =>
                  setEsiData((prev) => ({
                    ...prev,
                    roundOff: value,
                  }))
                }
                options={ROUND_OFF_OPTIONS}
                className="
                  !h-11
                  !rounded-lg
                  !border
                  !border-[#E4DFFB]
                  bg-white
                  focus:!border-[#4DD2FF]
                "
              />

            </div>

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
            border
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

          {isSaving
            ? "Saving..."
            : "Save"}

        </Button>

      </div>

    </div>
  );
}
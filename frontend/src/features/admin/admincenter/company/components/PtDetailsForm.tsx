// import { useEffect, useState } from "react";

// import { CalendarDays, Clock3, Plus } from "lucide-react";
 
// import { Card, CardContent } from "@/components/ui/card";

// import { Button } from "@/components/ui/button";

// import { Input } from "@/components/ui/input";

// import { Label } from "@/components/ui/label";
 
// import { usePtDetails } from "../hooks/usePtDetails";
 
// type LocalSlab = {

//   fromSalary: string;

//   toSalary: string;

//   ptAmount: string;

// };
 
// export default function PtDetailsForm() {

//   const { ptSlabs, isLoading, updatePt, isSaving } = usePtDetails();
 
//   const [effectiveFrom, setEffectiveFrom] = useState("");

//   const [period, setPeriod] = useState("Monthly");
 
//   const [slabs, setSlabs] = useState<LocalSlab[]>([

//     {

//       fromSalary: "0",

//       toSalary: "15000",

//       ptAmount: "0",

//     },

//     {

//       fromSalary: "15001",

//       toSalary: "20000",

//       ptAmount: "150",

//     },

//     {

//       fromSalary: "20001",

//       toSalary: "999999999",

//       ptAmount: "200",

//     },

//   ]);
 
//   useEffect(() => {

//     if (ptSlabs && ptSlabs.length > 0) {

//       setEffectiveFrom(ptSlabs[0].effectiveFrom);

//       setPeriod(ptSlabs[0].period);
 
//       setSlabs(

//         ptSlabs.map((item) => ({

//           fromSalary: String(item.fromSalary),

//           toSalary: String(item.toSalary),

//           ptAmount: String(item.ptAmount),

//         }))

//       );

//     }

//   }, [ptSlabs]);
 
//   function handleSlabChange(

//     index: number,

//     field: keyof LocalSlab,

//     value: string

//   ) {

//     setSlabs((prev) =>

//       prev.map((row, i) =>

//         i === index

//           ? {

//               ...row,

//               [field]: value,

//             }

//           : row

//       )

//     );

//   }
 
//   function addRow() {

//     setSlabs((prev) => [

//       ...prev,

//       {

//         fromSalary: "",

//         toSalary: "",

//         ptAmount: "",

//       },

//     ]);

//   }
 
//   async function handleSave() {

//     const payload = {

//       slabs: slabs.map((item) => ({

//         effectiveFrom,

//         period,

//         fromSalary: Number(item.fromSalary),

//         toSalary: Number(item.toSalary),

//         ptAmount: Number(item.ptAmount),

//       })),

//     };
 
//     try {

//       await updatePt(payload).unwrap();

//     } catch (error) {

//       console.error("Failed to save PT Details", error);

//     }

//   }
 
//   if (isLoading) {

//     return (
// <div className="p-6 text-sm text-slate-500">

//         Loading PT Details...
// </div>

//     );

//   }
 
//   return (
// <Card className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
// <CardContent className="p-6 space-y-8">
 

 

 
// {/* Effective From */}
// <div className="rounded-2xl bg-violet-100 px-4 py-3">
// <div className="flex items-center gap-4">
// <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
// <CalendarDays className="h-5 w-5 text-violet-600" />
// </div>
 
//     <Label className="text-sm font-semibold">

//       Effective From
// </Label>
 
//     <select

//       value={effectiveFrom}

//       onChange={(e) => setEffectiveFrom(e.target.value)}

//       className="h-9 w-28 rounded-md border border-gray-300 bg-white px-2 text-sm"
// >
// <option value="Jan/2026">Jan/2026</option>
// <option value="Feb/2026">Feb/2026</option>
// <option value="Mar/2026">Mar/2026</option>
// <option value="Apr/2026">Apr/2026</option>
// <option value="May/2026">May/2026</option>
// <option value="Jun/2026">Jun/2026</option>
// <option value="Jul/2026">Jul/2026</option>
// <option value="Aug/2026">Aug/2026</option>
// <option value="Sep/2026">Sep/2026</option>
// <option value="Oct/2026">Oct/2026</option>
// <option value="Nov/2026">Nov/2026</option>
// <option value="Dec/2026">Dec/2026</option>
// </select>
 
//     <Clock3 className="h-5 w-5 text-gray-600" />
// </div>
// </div>
 
 
//         {/* Period */}
// <div className="space-y-2">
// <Label className="text-sm font-medium">

//             Period <span className="text-red-500">*</span>
// </Label>
 
//           <select

//             value={period}

//             onChange={(e) => setPeriod(e.target.value)}

//             className="h-11 w-72 rounded-xl border border-gray-300 bg-white px-3 outline-none focus:border-violet-500"
// >
// <option value="Monthly">Monthly</option>
// <option value="Quarterly">Quarterly</option>
// <option value="Half Yearly">Half Yearly</option>
// <option value="Yearly">Yearly</option>
// </select>
// </div>
 
//         {/* Slab Rates */}
// <div>
// <div className="mb-5 flex items-center gap-4">
// <h3 className="whitespace-nowrap text-base font-semibold text-black">

//               Slab Rates
// </h3>
 
//             <div className="h-px flex-1 bg-gray-300"></div>
// </div>
 
//           {/* Table Header */}
// <div className="grid grid-cols-4 gap-4 rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700">
// <div>From Salary (Amount)</div>
// <div>To Salary (Amount)</div>
// <div>PT Amount</div>
// <div className="text-center">Action</div>
// </div>
 
//           <div className="mt-4 space-y-4">
 

 
//             {slabs.map((slab, index) => (
// <div

//                 key={index}

//                 className="grid grid-cols-4 items-center gap-4"
// >

//                 {/* From Salary */}
// <Input

//                   value={slab.fromSalary}

//                   onChange={(e) =>

//                     handleSlabChange(

//                       index,

//                       "fromSalary",

//                       e.target.value

//                     )

//                   }

//                   placeholder="0"

//                   className="h-11 rounded-xl border-gray-300"

//                 />
 
//                 {/* To Salary */}
// <Input

//                   value={slab.toSalary}

//                   onChange={(e) =>

//                     handleSlabChange(

//                       index,

//                       "toSalary",

//                       e.target.value

//                     )

//                   }

//                   placeholder="0"

//                   className="h-11 rounded-xl border-gray-300"

//                 />
 
//                 {/* PT Amount */}
// <Input

//                   value={slab.ptAmount}

//                   onChange={(e) =>

//                     handleSlabChange(

//                       index,

//                       "ptAmount",

//                       e.target.value

//                     )

//                   }

//                   placeholder="0"

//                   className="h-11 rounded-xl border-gray-300"

//                 />
 
//                 {/* Action */}
// <div className="flex justify-center">

//                   {index === slabs.length - 1 && (
// <Button

//                       type="button"

//                       variant="outline"

//                       onClick={addRow}

//                       className="h-11 w-11 rounded-xl border border-violet-200 p-0 hover:bg-violet-50"
// >
// <Plus className="h-5 w-5 text-violet-600" />
// </Button>

//                   )}
// </div>
// </div>

//             ))}
// </div>
// </div>
 

 
//         {/* Bottom Buttons */}
// <div className="flex items-center justify-end gap-4 border-t border-gray-200 pt-6">
// <Button

//             type="button"

//             variant="outline"

//             className="h-11 rounded-xl border border-gray-300 px-6 font-medium text-gray-700 hover:bg-gray-100"
// >

//             Load Default Value
// </Button>
 
//           <Button

//             type="button"

//             onClick={handleSave}

//             disabled={isSaving}

//             className="h-11 rounded-xl bg-violet-600 px-8 font-medium text-white hover:bg-violet-700 disabled:opacity-50"
// >

//             {isSaving ? "Saving..." : "Save"}
// </Button>
// </div>
// </CardContent>
// </Card>

//   );

// }
 




// import { useEffect, useState } from "react";
// import { CalendarDays, Clock3, Plus } from "lucide-react";

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { StyledSelect } from "@/components/ui/select";
// import { usePtDetails } from "../hooks/usePtDetails";

// type LocalSlab = {
//   fromSalary: string;
//   toSalary: string;
//   ptAmount: string;
// };

// const MONTH_OPTIONS = [
//   "Jan/2026", "Feb/2026", "Mar/2026", "Apr/2026",
//   "May/2026", "Jun/2026", "Jul/2026", "Aug/2026",
//   "Sep/2026", "Oct/2026", "Nov/2026", "Dec/2026",
// ];

// const PERIOD_OPTIONS = ["Monthly", "Quarterly", "Half Yearly", "Yearly"];

// export default function PtDetailsForm() {
//   const { ptSlabs, isLoading, updatePt, isSaving } = usePtDetails();

//   const [effectiveFrom, setEffectiveFrom] = useState("Jan/2026");
//   const [period, setPeriod] = useState("Monthly");

//   const [slabs, setSlabs] = useState<LocalSlab[]>([
//     { fromSalary: "0", toSalary: "15000", ptAmount: "0" },
//     { fromSalary: "15001", toSalary: "20000", ptAmount: "150" },
//     { fromSalary: "20001", toSalary: "999999999", ptAmount: "200" },
//   ]);

//   useEffect(() => {
//     if (ptSlabs && ptSlabs.length > 0) {
//       setEffectiveFrom(ptSlabs[0].effectiveFrom);
//       setPeriod(ptSlabs[0].period);

//       setSlabs(
//         ptSlabs.map((item) => ({
//           fromSalary: String(item.fromSalary),
//           toSalary: String(item.toSalary),
//           ptAmount: String(item.ptAmount),
//         }))
//       );
//     }
//   }, [ptSlabs]);

//   function handleSlabChange(
//     index: number,
//     field: keyof LocalSlab,
//     value: string
//   ) {
//     setSlabs((prev) =>
//       prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
//     );
//   }

//   function addRow() {
//     setSlabs((prev) => [
//       ...prev,
//       { fromSalary: "", toSalary: "", ptAmount: "" },
//     ]);
//   }

//   async function handleSave() {
//     const payload = {
//       slabs: slabs.map((item) => ({
//         effectiveFrom,
//         period,
//         fromSalary: Number(item.fromSalary),
//         toSalary: Number(item.toSalary),
//         ptAmount: Number(item.ptAmount),
//       })),
//     };

//     try {
//       await updatePt(payload).unwrap();
//     } catch (error) {
//       console.error("Failed to save PT Details", error);
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="p-4 text-sm text-slate-500 sm:p-6">
//         Loading PT Details...
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       <Card className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
//         <CardContent className="space-y-6 p-4 sm:space-y-8 sm:p-6">
//           {/* Effective From — responsive */}
//           <div className="flex flex-col gap-3 rounded-2xl bg-violet-100 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
//                 <CalendarDays className="h-5 w-5 text-violet-600" />
//               </div>
//               <Label className="text-sm font-semibold">Effective From</Label>
//             </div>

//             <div className="flex items-center gap-3">
//               <div className="w-full max-w-[160px] sm:w-32">
//                 <StyledSelect
//                   value={effectiveFrom}
//                   onValueChange={setEffectiveFrom}
//                   options={MONTH_OPTIONS}
//                   className="!h-9"
//                 />
//               </div>
//               <Clock3 className="h-5 w-5 shrink-0 text-gray-600" />
//             </div>
//           </div>

//           {/* Period */}
//           <div className="space-y-2">
//             <Label className="text-sm font-medium">
//               Period <span className="text-red-500">*</span>
//             </Label>
//             <div className="w-full max-w-xs">
//               <StyledSelect
//                 value={period}
//                 onValueChange={setPeriod}
//                 options={PERIOD_OPTIONS}
//               />
//             </div>
//           </div>

//           {/* Slab Rates */}
//           <div>
//             <div className="mb-4 flex items-center gap-4 sm:mb-5">
//               <h3 className="whitespace-nowrap text-base font-semibold text-black">
//                 Slab Rates
//               </h3>
//               <div className="h-px flex-1 bg-gray-300" />
//             </div>

//             {/* Desktop Header */}
//             <div className="mb-3 hidden grid-cols-4 gap-3 rounded-xl bg-gray-100 px-3 py-3 text-sm font-semibold text-gray-700 sm:grid">
//               <div>From Salary</div>
//               <div>To Salary</div>
//               <div>PT Amount</div>
//               <div className="text-center">Action</div>
//             </div>

//             <div className="space-y-4">
//               {slabs.map((slab, index) => (
//                 <div
//                   key={index}
//                   className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-center sm:gap-3"
//                 >
//                   <div>
//                     <Label className="mb-1 block text-xs text-gray-500 sm:hidden">
//                       From Salary
//                     </Label>
//                     <Input
//                       value={slab.fromSalary}
//                       onChange={(e) =>
//                         handleSlabChange(index, "fromSalary", e.target.value)
//                       }
//                       placeholder="0"
//                       className="h-11 rounded-xl border-gray-300"
//                     />
//                   </div>

//                   <div>
//                     <Label className="mb-1 block text-xs text-gray-500 sm:hidden">
//                       To Salary
//                     </Label>
//                     <Input
//                       value={slab.toSalary}
//                       onChange={(e) =>
//                         handleSlabChange(index, "toSalary", e.target.value)
//                       }
//                       placeholder="0"
//                       className="h-11 rounded-xl border-gray-300"
//                     />
//                   </div>

//                   <div>
//                     <Label className="mb-1 block text-xs text-gray-500 sm:hidden">
//                       PT Amount
//                     </Label>
//                     <Input
//                       value={slab.ptAmount}
//                       onChange={(e) =>
//                         handleSlabChange(index, "ptAmount", e.target.value)
//                       }
//                       placeholder="0"
//                       className="h-11 rounded-xl border-gray-300"
//                     />
//                   </div>

//                   <div className="flex justify-start sm:justify-center">
//                     {index === slabs.length - 1 && (
//                       <Button
//                         type="button"
//                         variant="outline"
//                         onClick={addRow}
//                         className="h-11 w-11 rounded-xl border border-violet-200 p-0 hover:bg-violet-50"
//                       >
//                         <Plus className="h-5 w-5 text-violet-600" />
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Bottom Buttons */}
//           <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-end sm:gap-4 sm:pt-6">
//             <Button
//               type="button"
//               variant="outline"
//               className="h-11 w-full rounded-xl border border-gray-300 px-6 font-medium text-gray-700 hover:bg-gray-100 sm:w-auto"
//             >
//               Load Default Value
//             </Button>

//             <Button
//               type="button"
//               onClick={handleSave}
//               disabled={isSaving}
//               className="h-11 w-full rounded-xl bg-violet-600 px-8 font-medium text-white hover:bg-violet-700 disabled:opacity-50 sm:w-auto"
//             >
//               {isSaving ? "Saving..." : "Save"}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }





// import { useEffect, useState } from "react";
// import { CalendarDays, Clock3, Plus } from "lucide-react";

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { StyledSelect } from "@/components/ui/select";
// import { usePtDetails } from "../hooks/usePtDetails";

// type LocalSlab = {
//   fromSalary: string;
//   toSalary: string;
//   ptAmount: string;
// };

// const MONTH_OPTIONS = [
//   "Jan/2026", "Feb/2026", "Mar/2026", "Apr/2026",
//   "May/2026", "Jun/2026", "Jul/2026", "Aug/2026",
//   "Sep/2026", "Oct/2026", "Nov/2026", "Dec/2026",
// ];

// const PERIOD_OPTIONS = ["Monthly", "Quarterly", "Half Yearly", "Yearly"];

// /* =======================================================
//    SHARED STYLE CONSTANTS (Figma match)
// ======================================================= */

// const inputClass =
//   "h-11 rounded-lg border-[#E4DFFB] focus-visible:border-[#7C3AED] focus-visible:ring-[#EDE9FE] focus-visible:ring-2";

// const labelClass = "text-sm font-medium text-gray-800";

// export default function PtDetailsForm() {
//   const { ptSlabs, isLoading, updatePt, isSaving } = usePtDetails();

//   const [effectiveFrom, setEffectiveFrom] = useState("Jan/2026");
//   const [period, setPeriod] = useState("Monthly");

//   const [slabs, setSlabs] = useState<LocalSlab[]>([
//     { fromSalary: "0", toSalary: "15000", ptAmount: "0" },
//     { fromSalary: "15001", toSalary: "20000", ptAmount: "150" },
//     { fromSalary: "20001", toSalary: "999999999", ptAmount: "200" },
//   ]);

//   useEffect(() => {
//     if (ptSlabs && ptSlabs.length > 0) {
//       setEffectiveFrom(ptSlabs[0].effectiveFrom);
//       setPeriod(ptSlabs[0].period);

//       setSlabs(
//         ptSlabs.map((item) => ({
//           fromSalary: String(item.fromSalary),
//           toSalary: String(item.toSalary),
//           ptAmount: String(item.ptAmount),
//         }))
//       );
//     }
//   }, [ptSlabs]);

//   function handleSlabChange(
//     index: number,
//     field: keyof LocalSlab,
//     value: string
//   ) {
//     setSlabs((prev) =>
//       prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
//     );
//   }

//   function addRow() {
//     setSlabs((prev) => [
//       ...prev,
//       { fromSalary: "", toSalary: "", ptAmount: "" },
//     ]);
//   }

//   async function handleSave() {
//     const payload = {
//       slabs: slabs.map((item) => ({
//         effectiveFrom,
//         period,
//         fromSalary: Number(item.fromSalary),
//         toSalary: Number(item.toSalary),
//         ptAmount: Number(item.ptAmount),
//       })),
//     };

//     try {
//       await updatePt(payload).unwrap();
//     } catch (error) {
//       console.error("Failed to save PT Details", error);
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="p-4 text-sm text-slate-500 sm:p-6">
//         Loading PT Details...
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       <Card className="overflow-hidden rounded-2xl border border-[#E9D5FF] bg-white shadow-sm">
//         <CardContent className="space-y-6 p-4 sm:space-y-8 sm:p-6">
//           {/* Effective From */}
//           <div
//             className="flex flex-col gap-3 rounded-xl px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
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

//             <div className="flex items-center gap-3">
//               <div className="w-full max-w-[180px] sm:w-40">
//                 <StyledSelect
//                   value={effectiveFrom}
//                   onValueChange={setEffectiveFrom}
//                   options={MONTH_OPTIONS}
//                   className="!h-11 !rounded-lg !border-[#E4DFFB] bg-white"
//                 />
//               </div>
//               <Clock3 className="h-5 w-5 shrink-0 text-gray-500" />
//             </div>
//           </div>

//           {/* Period */}
//           <div className="space-y-2">
//             <Label className={labelClass}>
//               Period <span className="text-red-500">*</span>
//             </Label>
//             <div className="w-full max-w-xs">
//               <StyledSelect
//                 value={period}
//                 onValueChange={setPeriod}
//                 options={PERIOD_OPTIONS}
//                 className="!h-11 !rounded-lg !border-[#E4DFFB]"
//               />
//             </div>
//           </div>

//           {/* Slab Rates */}
//           <div>
//             <div className="mb-4 flex items-center gap-3 sm:mb-5">
//               <h3 className="whitespace-nowrap text-base font-semibold text-gray-900">
//                 Slab Rates
//               </h3>
//               <div className="h-px flex-1 bg-gray-200" />
//             </div>

//             {/* Desktop Header */}
//             <div
//               className="mb-3 hidden grid-cols-4 gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-700 sm:grid"
//               style={{ backgroundColor: "#F5F3FF" }}
//             >
//               <div>From Salary</div>
//               <div>To Salary</div>
//               <div>PT Amount</div>
//               <div className="text-center">Action</div>
//             </div>

//             <div className="space-y-4">
//               {slabs.map((slab, index) => (
//                 <div
//                   key={index}
//                   className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:items-center sm:gap-3"
//                 >
//                   <div>
//                     <Label className="mb-1 block text-xs text-gray-500 sm:hidden">
//                       From Salary
//                     </Label>
//                     <Input
//                       value={slab.fromSalary}
//                       onChange={(e) =>
//                         handleSlabChange(index, "fromSalary", e.target.value)
//                       }
//                       placeholder="0"
//                       className={inputClass}
//                     />
//                   </div>

//                   <div>
//                     <Label className="mb-1 block text-xs text-gray-500 sm:hidden">
//                       To Salary
//                     </Label>
//                     <Input
//                       value={slab.toSalary}
//                       onChange={(e) =>
//                         handleSlabChange(index, "toSalary", e.target.value)
//                       }
//                       placeholder="0"
//                       className={inputClass}
//                     />
//                   </div>

//                   <div>
//                     <Label className="mb-1 block text-xs text-gray-500 sm:hidden">
//                       PT Amount
//                     </Label>
//                     <Input
//                       value={slab.ptAmount}
//                       onChange={(e) =>
//                         handleSlabChange(index, "ptAmount", e.target.value)
//                       }
//                       placeholder="0"
//                       className={inputClass}
//                     />
//                   </div>

//                   <div className="flex justify-start sm:justify-center">
//                     {index === slabs.length - 1 && (
//                       <Button
//                         type="button"
//                         variant="outline"
//                         onClick={addRow}
//                         className="h-11 w-11 rounded-lg border p-0"
//                         style={{ borderColor: "#E9D5FF" }}
//                       >
//                         <Plus className="h-5 w-5 text-[#7C3AED]" />
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Bottom Buttons */}
//           <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-end sm:gap-4 sm:pt-6">
//             <Button
//               type="button"
//               variant="outline"
//               className="h-11 w-full rounded-lg border-[#E4DFFB] px-6 font-medium text-gray-700 sm:w-auto"
//             >
//               Load Default Value
//             </Button>

//             <Button
//               type="button"
//               onClick={handleSave}
//               disabled={isSaving}
//               className="h-11 w-full rounded-lg bg-[#7C3AED] px-8 font-medium text-white hover:bg-[#6D28D9] disabled:opacity-50 sm:w-auto"
//             >
//               {isSaving ? "Saving..." : "Save"}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }




import { useEffect, useState } from "react";
import { CalendarDays, Clock3, Plus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StyledSelect } from "@/components/ui/select";
import { usePtDetails } from "../hooks/usePtDetails";

type LocalSlab = {
  fromSalary: string;
  toSalary: string;
  ptAmount: string;
};

const MONTH_OPTIONS = [
  "Jan/2026",
  "Feb/2026",
  "Mar/2026",
  "Apr/2026",
  "May/2026",
  "Jun/2026",
  "Jul/2026",
  "Aug/2026",
  "Sep/2026",
  "Oct/2026",
  "Nov/2026",
  "Dec/2026",
];

const PERIOD_OPTIONS = [
  "Monthly",
  "Quarterly",
  "Half Yearly",
  "Yearly",
];

/* =======================================================
   FIGMA INPUT STYLES
======================================================= */

/*
  Normal:
  - White background
  - Thin light border

  On click/focus:
  - Border becomes #4DD2FF
  - Very subtle focus ring
  - No thick border
*/
const inputClass =
  "h-11 rounded-lg border border-[#E4DFFB] bg-white transition-colors duration-150 " +
  "focus-visible:border-[#4DD2FF] " +
  "focus-visible:ring-1 focus-visible:ring-[#4DD2FF]/20 " +
  "focus-visible:outline-none";

const labelClass = "text-sm font-medium text-gray-800";

export default function PtDetailsForm() {
  const {
    ptSlabs,
    isLoading,
    updatePt,
    isSaving,
  } = usePtDetails();

  const [effectiveFrom, setEffectiveFrom] =
    useState("Jan/2026");

  const [period, setPeriod] =
    useState("Monthly");

  const [slabs, setSlabs] = useState<LocalSlab[]>([
    {
      fromSalary: "0",
      toSalary: "15000",
      ptAmount: "0",
    },
    {
      fromSalary: "15001",
      toSalary: "20000",
      ptAmount: "150",
    },
    {
      fromSalary: "20001",
      toSalary: "999999999",
      ptAmount: "200",
    },
  ]);

  useEffect(() => {
    if (ptSlabs && ptSlabs.length > 0) {
      setEffectiveFrom(ptSlabs[0].effectiveFrom);
      setPeriod(ptSlabs[0].period);

      setSlabs(
        ptSlabs.map((item) => ({
          fromSalary: String(item.fromSalary),
          toSalary: String(item.toSalary),
          ptAmount: String(item.ptAmount),
        }))
      );
    }
  }, [ptSlabs]);

  function handleSlabChange(
    index: number,
    field: keyof LocalSlab,
    value: string
  ) {
    setSlabs((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );
  }

  function addRow() {
    setSlabs((prev) => [
      ...prev,
      {
        fromSalary: "",
        toSalary: "",
        ptAmount: "",
      },
    ]);
  }

  async function handleSave() {
    const payload = {
      slabs: slabs.map((item) => ({
        effectiveFrom,
        period,
        fromSalary: Number(item.fromSalary),
        toSalary: Number(item.toSalary),
        ptAmount: Number(item.ptAmount),
      })),
    };

    try {
      await updatePt(payload).unwrap();
    } catch (error) {
      console.error(
        "Failed to save PT Details",
        error
      );
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-slate-500 sm:p-6">
        Loading PT Details...
      </div>
    );
  }

  return (
    <div className="w-full">

      {/* =================================================
          MAIN CARD
      ================================================= */}

      <Card
        className="
          overflow-hidden
          rounded-2xl
          border
          border-[#E9D5FF]
          bg-white
          shadow-sm
        "
      >
        <CardContent
          className="
            space-y-6
            p-4
            sm:space-y-8
            sm:p-6
          "
        >

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
              sm:gap-4
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
                  className="
                    h-5
                    w-5
                    text-[#7C3AED]
                  "
                />
              </div>

              <Label
                className="
                  text-base
                  font-semibold
                  text-gray-900
                "
              >
                Effective From
              </Label>
            </div>

            <div className="flex items-center gap-3">

              <div
                className="
                  w-full
                  max-w-[180px]
                  sm:w-40
                "
              >
                <StyledSelect
                  value={effectiveFrom}
                  onValueChange={setEffectiveFrom}
                  options={MONTH_OPTIONS}
                  className="
                    !h-11
                    !rounded-lg
                    !border-[#E4DFFB]
                    bg-white
                  "
                />
              </div>

              <Clock3
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
              PERIOD
          ================================================= */}

          <div className="space-y-2">

            <Label className={labelClass}>
              Period{" "}
              <span className="text-red-500">
                *
              </span>
            </Label>

            <div className="w-full max-w-xs">

              <StyledSelect
                value={period}
                onValueChange={setPeriod}
                options={PERIOD_OPTIONS}
                className="
                  !h-11
                  !rounded-lg
                  !border-[#E4DFFB]
                  bg-white
                "
              />

            </div>
          </div>

          {/* =================================================
              SLAB RATES
          ================================================= */}

          <div>

            <div
              className="
                mb-4
                flex
                items-center
                gap-3
                sm:mb-5
              "
            >

              <h3
                className="
                  whitespace-nowrap
                  text-base
                  font-semibold
                  text-gray-900
                "
              >
                Slab Rates
              </h3>

              <div
                className="
                  h-px
                  flex-1
                  bg-gray-200
                "
              />
            </div>

            {/* =================================================
                DESKTOP HEADER
            ================================================= */}

            <div
              className="
                mb-3
                hidden
                grid-cols-4
                gap-3
                rounded-xl
                px-3
                py-3
                text-sm
                font-semibold
                text-gray-700
                sm:grid
              "
              style={{
                backgroundColor: "#F5F3FF",
              }}
            >

              <div>
                From Salary
              </div>

              <div>
                To Salary
              </div>

              <div>
                PT Amount
              </div>

              <div className="text-center">
                Action
              </div>

            </div>

            {/* =================================================
                SLAB ROWS
            ================================================= */}

            <div className="space-y-4">

              {slabs.map((slab, index) => (

                <div
                  key={index}
                  className="
                    grid
                    grid-cols-1
                    gap-3
                    sm:grid-cols-4
                    sm:items-center
                    sm:gap-3
                  "
                >

                  {/* FROM SALARY */}

                  <div>

                    <Label
                      className="
                        mb-1
                        block
                        text-xs
                        text-gray-500
                        sm:hidden
                      "
                    >
                      From Salary
                    </Label>

                    <Input
                      value={slab.fromSalary}
                      onChange={(e) =>
                        handleSlabChange(
                          index,
                          "fromSalary",
                          e.target.value
                        )
                      }
                      placeholder="0"
                      className={inputClass}
                    />

                  </div>

                  {/* TO SALARY */}

                  <div>

                    <Label
                      className="
                        mb-1
                        block
                        text-xs
                        text-gray-500
                        sm:hidden
                      "
                    >
                      To Salary
                    </Label>

                    <Input
                      value={slab.toSalary}
                      onChange={(e) =>
                        handleSlabChange(
                          index,
                          "toSalary",
                          e.target.value
                        )
                      }
                      placeholder="0"
                      className={inputClass}
                    />

                  </div>

                  {/* PT AMOUNT */}

                  <div>

                    <Label
                      className="
                        mb-1
                        block
                        text-xs
                        text-gray-500
                        sm:hidden
                      "
                    >
                      PT Amount
                    </Label>

                    <Input
                      value={slab.ptAmount}
                      onChange={(e) =>
                        handleSlabChange(
                          index,
                          "ptAmount",
                          e.target.value
                        )
                      }
                      placeholder="0"
                      className={inputClass}
                    />

                  </div>

                  {/* ACTION */}

                  <div
                    className="
                      flex
                      justify-start
                      sm:justify-center
                    "
                  >

                    {index ===
                      slabs.length - 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addRow}
                        className="
                          h-11
                          w-11
                          rounded-lg
                          border
                          p-0
                        "
                        style={{
                          borderColor:
                            "#E9D5FF",
                        }}
                      >
                        <Plus
                          className="
                            h-5
                            w-5
                            text-[#7C3AED]
                          "
                        />
                      </Button>
                    )}

                  </div>

                </div>

              ))}

            </div>
          </div>

          {/* =================================================
              BOTTOM BUTTONS
          ================================================= */}

          <div
            className="
              flex
              flex-col-reverse
              gap-3
              border-t
              border-gray-200
              pt-4
              sm:flex-row
              sm:items-center
              sm:justify-end
              sm:gap-4
              sm:pt-6
            "
          >

            <Button
              type="button"
              variant="outline"
              className="
                h-11
                w-full
                rounded-lg
                border-[#E4DFFB]
                px-6
                font-medium
                text-gray-700
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
                h-11
                w-full
                rounded-lg
                bg-[#7C3AED]
                px-8
                font-medium
                text-white
                hover:bg-[#6D28D9]
                disabled:opacity-50
                sm:w-auto
              "
            >
              {isSaving
                ? "Saving..."
                : "Save"}
            </Button>

          </div>

        </CardContent>
      </Card>
    </div>
  );
}
// import { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { usePtDetails } from "../hooks/usePtDetails";
// import { useToast, Toast } from "./common/Toast";
// import { CalendarDays, Clock3, Plus, Loader2 } from "lucide-react";
// import { MonthPicker } from "@/components/ui/monthpicker";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// type LocalSlab = { fromSalary: string; toSalary: string; ptAmount: string };

// export default function PtDetailsForm() {
//   const { ptSlabs, isLoading, updatePt, isSaving, refetch } = usePtDetails();
//   const [effectiveFrom, setEffectiveFrom] = useState("");
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

//   function handleSlabChange(index: number, field: keyof LocalSlab, value: string) {
//     setSlabs((prev) =>
//       prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
//     );
//   }

//   function addRow() {
//     setSlabs((prev) => [...prev, { fromSalary: "", toSalary: "", ptAmount: "" }]);
//   }

//   const { toast, showToast } = useToast();

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
//       await refetch();
//       showToast("PT details saved successfully");
//     } catch (error) {
//       console.error("Failed to save PT Details", error);
//       showToast("Failed to save PT details. Please try again.", "error");
//     }
//   }

//   if (isLoading) {
//     return <div className="p-4 sm:p-6 text-sm text-slate-500">Loading PT Details...</div>;
//   }

//   return (
//     <div className="w-full min-w-0 max-w-full">
//       <Toast toast={toast} />
//       <Card data-company-module-card className="w-full min-w-0 rounded-2xl border border-gray-200 bg-white shadow-sm">
//         <CardContent className="p-4 sm:p-6 space-y-6 sm:space-y-8">
//           <div className="rounded-2xl bg-violet-100 px-3 sm:px-4 py-3">
//             <div className="flex flex-wrap items-center gap-2 sm:gap-4">
//               <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-white shrink-0">
//                 <CalendarDays className="h-5 w-5 text-violet-600" />
//               </div>
//               <Label className="text-sm font-semibold whitespace-nowrap">Effective From</Label>
//               <div className="w-full max-w-[160px] sm:w-36">
//                 <MonthPicker
//                   value={effectiveFrom}
//                   onChange={(value) => setEffectiveFrom(value)}
//                   className="h-9"
//                 />
//               </div>
//               <Clock3 className="h-5 w-5 text-gray-600 hidden sm:block shrink-0" />
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label className="text-sm font-medium">
//               Period <span className="text-red-500">*</span>
//             </Label>
//             <div className="w-full sm:w-72 max-w-full">
//               <Select value={period} onValueChange={setPeriod}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select period" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Monthly">Monthly</SelectItem>
//                   <SelectItem value="Quarterly">Quarterly</SelectItem>
//                   <SelectItem value="Half Yearly">Half Yearly</SelectItem>
//                   <SelectItem value="Yearly">Yearly</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div>
//             <div className="mb-4 sm:mb-5 flex items-center gap-4">
//               <h3 className="whitespace-nowrap text-base font-semibold text-black">Slab Rates</h3>
//               <div className="h-px flex-1 bg-gray-300" />
//             </div>

//             <div className="overflow-x-auto -mx-1 sm:mx-0">
//               <div className="min-w-[480px] sm:min-w-0">
//                 <div className="grid grid-cols-4 gap-2 sm:gap-4 rounded-xl bg-gray-100 px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold text-gray-700">
//                   <div>From Salary</div>
//                   <div>To Salary</div>
//                   <div>PT Amount</div>
//                   <div className="text-center">Action</div>
//                 </div>

//                 <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
//                   {slabs.map((slab, index) => (
//                     <div key={index} className="grid grid-cols-4 items-center gap-2 sm:gap-4">
//                       <Input
//                         value={slab.fromSalary}
//                         onChange={(e) => handleSlabChange(index, "fromSalary", e.target.value)}
//                         placeholder="0"
//                         className="h-10 sm:h-11 rounded-xl border-gray-300 w-full text-sm"
//                       />
//                       <Input
//                         value={slab.toSalary}
//                         onChange={(e) => handleSlabChange(index, "toSalary", e.target.value)}
//                         placeholder="0"
//                         className="h-10 sm:h-11 rounded-xl border-gray-300 w-full text-sm"
//                       />
//                       <Input
//                         value={slab.ptAmount}
//                         onChange={(e) => handleSlabChange(index, "ptAmount", e.target.value)}
//                         placeholder="0"
//                         className="h-10 sm:h-11 rounded-xl border-gray-300 w-full text-sm"
//                       />
//                       <div className="flex justify-center">
//                         {index === slabs.length - 1 && (
//                           <Button
//                             type="button"
//                             variant="outline"
//                             onClick={addRow}
//                             className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl border border-violet-200 p-0 hover:bg-violet-50"
//                           >
//                             <Plus className="h-5 w-5 text-violet-600" />
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 border-t border-gray-200 pt-4 sm:pt-6">
//             <Button
//               type="button"
//               variant="outline"
//               className="h-10 sm:h-11 rounded-xl border border-gray-300 px-6 font-medium text-gray-700 hover:bg-gray-100 w-full sm:w-auto"
//             >
//               Load Default Value
//             </Button>
//             <Button
//               type="button"
//               onClick={handleSave}
//               disabled={isSaving}
//               className="h-10 sm:h-11 rounded-xl bg-violet-600 px-8 font-medium text-white hover:bg-violet-700 disabled:opacity-50 w-full sm:w-auto"
//             >
//               {isSaving && <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />}
//               {isSaving ? "Saving..." : "Save"}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }




















import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { usePtDetails } from "../hooks/usePtDetails";
import { useToast, Toast } from "./common/Toast";
import { CalendarDays, Clock3, Plus, Loader2 } from "lucide-react";
import { MonthPicker } from "@/components/ui/monthpicker";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type LocalSlab = { fromSalary: string; toSalary: string; ptAmount: string };

export default function PtDetailsForm() {
  const { ptSlabs, isLoading, updatePt, isSaving, refetch } = usePtDetails();
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [period, setPeriod] = useState("Monthly");
  const [slabs, setSlabs] = useState<LocalSlab[]>([
    { fromSalary: "0", toSalary: "15000", ptAmount: "0" },
    { fromSalary: "15001", toSalary: "20000", ptAmount: "150" },
    { fromSalary: "20001", toSalary: "999999999", ptAmount: "200" },
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

  function handleSlabChange(index: number, field: keyof LocalSlab, value: string) {
    setSlabs((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  }

  function addRow() {
    setSlabs((prev) => [...prev, { fromSalary: "", toSalary: "", ptAmount: "" }]);
  }

  const { toast, showToast } = useToast();

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
      await refetch();
      showToast("PT details saved successfully");
    } catch (error) {
      console.error("Failed to save PT Details", error);
      showToast("Failed to save PT details. Please try again.", "error");
    }
  }

  if (isLoading) {
    return <div className="p-4 sm:p-6 text-sm text-[#626262]">Loading PT Details...</div>;
  }

  return (
    <div className="w-full min-w-0 max-w-full">
      <Toast toast={toast} />
      <Card data-company-module-card className="w-full min-w-0 rounded-2xl border border-[#EDEDED] bg-white shadow-sm">
        <CardContent className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          <div className="rounded-2xl bg-[#ECE7FF] px-3 sm:px-4 py-3">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-white shrink-0">
                <CalendarDays className="h-5 w-5 text-[#7A5BED]" />
              </div>
              <Label className="text-sm font-semibold whitespace-nowrap">Effective From</Label>
              <div className="w-full max-w-[160px] sm:w-36">
                <MonthPicker
                  value={effectiveFrom}
                  onChange={(value) => setEffectiveFrom(value)}
                  className="h-9"
                />
              </div>
              <Clock3 className="h-5 w-5 text-[#2E2E2E] hidden sm:block shrink-0" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Period <span className="text-[#DD3232]">*</span>
            </Label>
            <div className="w-full sm:w-72 max-w-full">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Half Yearly">Half Yearly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <div className="mb-4 sm:mb-5 flex items-center gap-4">
              <h3 className="whitespace-nowrap text-base font-semibold text-black">Slab Rates</h3>
              <div className="h-px flex-1 bg-[#DDDDDD]" />
            </div>

            <div className="overflow-x-auto -mx-1 sm:mx-0">
              <div className="min-w-[480px] sm:min-w-0">
                <div className="grid grid-cols-4 gap-2 sm:gap-4 rounded-xl bg-[#DDDDDD] px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold text-[#2E2E2E]">
                  <div>From Salary</div>
                  <div>To Salary</div>
                  <div>PT Amount</div>
                  <div className="text-center">Action</div>
                </div>

                <div className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
                  {slabs.map((slab, index) => (
                    <div key={index} className="grid grid-cols-4 items-center gap-2 sm:gap-4">
                      <Input
                        value={slab.fromSalary}
                        onChange={(e) => handleSlabChange(index, "fromSalary", e.target.value)}
                        placeholder="0"
                        className="h-10 sm:h-11 rounded-xl border-[#DDDDDD] w-full text-sm"
                      />
                      <Input
                        value={slab.toSalary}
                        onChange={(e) => handleSlabChange(index, "toSalary", e.target.value)}
                        placeholder="0"
                        className="h-10 sm:h-11 rounded-xl border-[#DDDDDD] w-full text-sm"
                      />
                      <Input
                        value={slab.ptAmount}
                        onChange={(e) => handleSlabChange(index, "ptAmount", e.target.value)}
                        placeholder="0"
                        className="h-10 sm:h-11 rounded-xl border-[#DDDDDD] w-full text-sm"
                      />
                      <div className="flex justify-center">
                        {index === slabs.length - 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={addRow}
                            className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl border border-[#ECE7FF] p-0 hover:bg-[#F6F3FF]"
                          >
                            <Plus className="h-5 w-5 text-[#7A5BED]" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 border-t border-[#EDEDED] pt-4 sm:pt-6">
            <Button
              type="button"
              variant="outline"
              className="h-10 sm:h-11 rounded-xl border border-[#DDDDDD] px-6 font-medium text-[#2E2E2E] hover:bg-[#DDDDDD] w-full sm:w-auto"
            >
              Load Default Value
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="h-10 sm:h-11 rounded-xl bg-[#7A5BED] px-8 font-medium text-white hover:bg-[#5932E9] disabled:opacity-50 w-full sm:w-auto"
            >
              {isSaving && <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />}
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
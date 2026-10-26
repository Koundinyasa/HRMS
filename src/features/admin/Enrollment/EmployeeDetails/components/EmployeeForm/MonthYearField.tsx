// import  { useEffect, useRef, useState } from "react";
// import { ChevronDown } from "lucide-react";
 
// const MONTHS = [
//   "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//   "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
// ];
 
// interface MonthYearFieldProps {
//   label: string;
//   value: string; // "Mar/2026"
//   onChange: (value: string) => void;
//   error?: string;
// }
 
// export default function MonthYearField({ label, value, onChange, error }: MonthYearFieldProps) {
//   const [open, setOpen] = useState(false);
//   const wrapRef = useRef<HTMLDivElement>(null);
 
//   const [, yearStr] = value.split("/");
//   const [viewYear, setViewYear] = useState(Number(yearStr) || new Date().getFullYear());
 
//   useEffect(() => {
//     const onClickOutside = (e: MouseEvent) => {
//       if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", onClickOutside);
//     return () => document.removeEventListener("mousedown", onClickOutside);
//   }, []);
 
//   const pick = (month: string) => {
//     onChange(`${month}/${viewYear}`);
//     setOpen(false);
//   };
 
//   return (
//     <div ref={wrapRef} className="relative flex items-center gap-3">
//       <label className="text-[13px] font-medium text-gray-700 whitespace-nowrap">{label}</label>
//       <div className="relative w-[130px]">
//         <button
//           type="button"
//           onClick={() => setOpen((p) => !p)}
//           className={`w-full flex items-center justify-between border rounded px-2.5 py-1.5 text-[13px] bg-white ${
//             error ? "border-red-400" : "border-gray-300"
//           }`}
//         >
//           {value || "Select"}
//           <ChevronDown size={13} className="text-gray-400" />
//         </button>
 
//         {open && (
//           <div className="absolute z-20 mt-1 w-[190px] bg-white border border-gray-200 rounded-md shadow-lg p-2.5 right-0">
//             <div className="flex items-center justify-between mb-2">
//               <button
//                 type="button"
//                 onClick={() => setViewYear((y) => y - 1)}
//                 className="text-gray-500 hover:text-[#2196F3] text-[12px] px-1"
//               >
//                 &lsaquo;
//               </button>
//               <span className="text-[12px] font-medium text-gray-700">{viewYear}</span>
//               <button
//                 type="button"
//                 onClick={() => setViewYear((y) => y + 1)}
//                 className="text-gray-500 hover:text-[#2196F3] text-[12px] px-1"
//               >
//                 &rsaquo;
//               </button>
//             </div>
//             <div className="grid grid-cols-3 gap-1.5">
//               {MONTHS.map((m) => {
//                 const selected = value === `${m}/${viewYear}`;
//                 return (
//                   <button
//                     key={m}
//                     type="button"
//                     onClick={() => pick(m)}
//                     className={`text-[11px] py-1 rounded ${
//                       selected
//                         ? "bg-[#2196F3] text-white"
//                         : "text-gray-700 hover:bg-gray-100"
//                     }`}
//                   >
//                     {m}
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>
//       {error && <p className="absolute -bottom-4 left-0 text-[11px] text-red-500">{error}</p>}
//     </div>
//   );
// }
 















import  { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
 
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
 
interface MonthYearFieldProps {
  label: string;
  value: string; // "Mar/2026"
  onChange: (value: string) => void;
  error?: string;
}
 
export default function MonthYearField({ label, value, onChange, error }: MonthYearFieldProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
 
  const [, yearStr] = value.split("/");
  const [viewYear, setViewYear] = useState(Number(yearStr) || new Date().getFullYear());
 
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);
 
  const pick = (month: string) => {
    onChange(`${month}/${viewYear}`);
    setOpen(false);
  };
 
  return (
    <div ref={wrapRef} className="relative flex items-center gap-3">
      <label className="whitespace-nowrap text-[13px] font-medium text-[#626262]">{label}</label>
      <div className="relative w-[130px]">
        <button
          type="button"
          onClick={() => setOpen((p) => !p)}
            className={`flex w-full items-center justify-between rounded-[4px] border px-2.5 py-1.5 text-[13px] text-[#131313] bg-white ${
            error ? "border-[#DD3232]" : "border-[#E2E2E2]"
          }`}
        >
          {value || "Select"}
          <ChevronDown size={13} className="text-gray-400" />
        </button>
 
        {open && (
          <div className="absolute right-0 z-20 mt-1 w-[190px] rounded-[8px] border border-[#E2E2E2] bg-white p-2.5 shadow-[0_8px_24px_rgba(19,19,19,0.14)]">
            <div className="flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => setViewYear((y) => y - 1)}
                className="px-1 text-[12px] text-[#626262] hover:text-[#FF6200]"
              >
                &lsaquo;
              </button>
              <span className="text-[12px] font-medium text-[#131313]">{viewYear}</span>
              <button
                type="button"
                onClick={() => setViewYear((y) => y + 1)}
                className="text-gray-500 hover:text-[#F97316] text-[12px] px-1"
              >
                &rsaquo;
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {MONTHS.map((m) => {
                const selected = value === `${m}/${viewYear}`;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => pick(m)}
                    className={`text-[11px] py-1 rounded ${
                      selected
                        ? "bg-[#F97316] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {error && <p className="absolute -bottom-4 left-0 text-[11px] text-red-500">{error}</p>}
    </div>
  );
}
// import { useEffect, useRef, useState } from "react";
// import { useGetClassificationDataQuery } from "../api/dashboardApi";
// import { CLASSIFICATION_OPTIONS, type ClassificationId } from "../constants/dashboard.constants";

// export default function ClassificationWiseChart() {
//   const [classificationId, setClassificationId] =
//     useState<ClassificationId>(CLASSIFICATION_OPTIONS[0].id);
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const { data, isLoading, isFetching, isError } =
//     useGetClassificationDataQuery(classificationId);

//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const items = data?.data ?? [];
//   const maxValue = Math.max(1, ...items.map((i) => i.employeeCount));
//   const selectedLabel =
//     CLASSIFICATION_OPTIONS.find((o) => o.id === classificationId)?.label ??
//     CLASSIFICATION_OPTIONS[0].label;

//   return (
//     <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 w-full">
//       <div className="flex items-center justify-between border-b-2 border-red-300 pb-3 mb-4">
//         <h3 className="text-base font-semibold text-slate-800">
//           Classification Wise
//         </h3>

//         <div className="relative" ref={dropdownRef}>
//           <button
//             onClick={() => setOpen((o) => !o)}
//             className="flex items-center gap-2 text-xs font-medium text-slate-600 border border-slate-200 rounded-md px-3 py-1.5 hover:bg-slate-50"
//           >
//             {selectedLabel}
//             <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
//               <path
//                 d="M1 1L5 5L9 1"
//                 stroke="#94A3B8"
//                 strokeWidth="1.5"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             </svg>
//           </button>

//           {open && (
//             <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-100 rounded-lg shadow-lg z-10 py-1">
//               {CLASSIFICATION_OPTIONS.map((opt) => (
//                 <button
//                   key={opt.id}
//                   onClick={() => {
//                     setClassificationId(opt.id);
//                     setOpen(false);
//                   }}
//                   className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 ${
//                     opt.id === classificationId
//                       ? "text-blue-600 font-medium"
//                       : "text-slate-600"
//                   }`}
//                 >
//                   {opt.label}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {isLoading || isFetching ? (
//         <div className="flex items-center justify-center h-40 text-sm text-slate-400">
//           Loading...
//         </div>
//       ) : isError ? (
//         <div className="flex items-center justify-center h-40 text-sm text-red-400">
//           Could not load data.
//         </div>
//       ) : items.length === 0 ? (
//         <div className="flex items-center justify-center h-40 text-sm text-slate-400">
//           No data available.
//         </div>
//       ) : (
//         <div className="flex flex-col gap-4">
//           {items.map((item, i) => {
//             const widthPct =
//               item.employeeCount === 0
//                 ? 0
//                 : Math.max((item.employeeCount / maxValue) * 100, 4);

//             return (
//               <div key={`${item.label}-${i}`} className="flex items-center gap-3">
//                 <span className="w-36 shrink-0 text-[11px] font-medium text-slate-600 uppercase truncate text-right">
//                   {item.label}
//                 </span>
//                 <div
//                   className="flex-1 h-2 rounded-full"
//                   style={{ backgroundColor: item.colorHexLight }}
//                 >
//                   {widthPct > 0 && (
//                     <div
//                       className="h-2 rounded-full transition-all"
//                       style={{
//                         width: `${widthPct}%`,
//                         minWidth: "8px",
//                         backgroundColor: item.colorHex,
//                       }}
//                     />
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }



import { useEffect, useRef, useState } from "react";
import { useGetClassificationDataQuery } from "../api/dashboardApi";
import { CLASSIFICATION_OPTIONS, type ClassificationId } from "../constants/dashboard.constants";

export default function ClassificationWiseChart() {
  const [classificationId, setClassificationId] =
    useState<ClassificationId>(CLASSIFICATION_OPTIONS[0].id);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetching, isError } =
    useGetClassificationDataQuery(classificationId);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const items = data?.data ?? [];
  const maxValue = Math.max(1, ...items.map((i) => i.employeeCount));
  const selectedLabel =
    CLASSIFICATION_OPTIONS.find((o) => o.id === classificationId)?.label ??
    CLASSIFICATION_OPTIONS[0].label;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 w-full">
      <div className="flex items-center justify-between border-b-2 border-red-300 pb-3 mb-4">
        <h3 className="text-base font-semibold text-slate-800">
          Classification Wise
        </h3>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 text-xs font-medium text-slate-700 border border-blue-200 rounded-full px-3 py-1.5 hover:bg-blue-50/50"
          >
            {selectedLabel}
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path
                d="M1 1L5 5L9 1"
                stroke="#94A3B8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {open && (
            <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-100 rounded-lg shadow-lg z-10 py-1">
              {CLASSIFICATION_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setClassificationId(opt.id);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50 ${
                    opt.id === classificationId
                      ? "text-blue-600 font-medium"
                      : "text-slate-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isLoading || isFetching ? (
        <div className="flex items-center justify-center h-40 text-sm text-slate-400">
          Loading...
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center h-40 text-sm text-red-400">
          Could not load data.
        </div>
      ) : items.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-sm text-slate-400">
          No data available.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item, i) => {
            const widthPct =
              item.employeeCount === 0
                ? 0
                : Math.max((item.employeeCount / maxValue) * 100, 5);

            return (
              <div key={`${item.label}-${i}`} className="flex items-center gap-3">
                <span className="w-36 shrink-0 text-[11px] font-medium text-slate-600 truncate text-right">
                  {item.label}
                </span>
                <div className="flex-1 flex items-center">
                  {widthPct > 0 && (
                    <div
                      className="h-2.5 rounded-full transition-all"
                      style={{
                        width: `${widthPct}%`,
                        minWidth: "10px",
                        backgroundColor: item.colorHex,
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
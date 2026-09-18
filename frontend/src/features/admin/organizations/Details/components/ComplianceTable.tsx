// import { LayoutDashboard, CheckCircle2, IndianRupee, Search, Clock } from "lucide-react";

// const TABS = [
//   { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
//   { key: "compliance", label: "Compliance Overview", icon: CheckCircle2 },
//   { key: "salary", label: "Consolidated Salary", icon: IndianRupee },
// ];

// export default function DetailsTabBar({
//   active,
//   onChange,
// }: {
//   active: string;
//   onChange: (key: string) => void;
// }) {
//   return (
//     <div className="flex items-center justify-between gap-3 rounded-xl border border-blue-100 bg-[#EAF3FE] px-2 py-1.5">
//       <div className="flex items-center gap-1.5">
//         {TABS.map((t) => {
//           const Icon = t.icon;
//           const isActive = active === t.key;
//           return (
//             <button
//               key={t.key}
//               onClick={() => onChange(t.key)}
//               className={`
//                 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12.5px] font-medium
//                 ${isActive
//                   ? "border-blue-500 bg-white text-blue-600"
//                   : "border-transparent bg-white text-slate-700"}
//               `}
//             >
//               <Icon size={14} className={isActive ? "text-blue-600" : "text-slate-500"} />
//               {t.label}
//             </button>
//           );
//         })}
//       </div>

//       <div className="flex items-center gap-2">
//         <div className="relative">
//           <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
//           <input
//             placeholder="Search..."
//             className="h-7 w-40 rounded-full border border-slate-200 bg-white pl-7 pr-3 text-[12px] text-slate-600 outline-none placeholder:text-slate-400"
//           />
//         </div>
//         <Clock size={16} className="text-slate-600" />
//       </div>
//     </div>
//   );
// }










// import type { ComplianceRow } from "../types/details.types";

// const HEADERS = [
//   "Company Name",
//   "Employee Count",
//   "PF Ack. Number",
//   "PF Amount",
//   "ESI Ack. Number",
//   "ESI Amount",
//   "PT Ack. Number",
//   "PT Amount",
//   "LWF Ack. Number",
//   "LWF Amount",
//   "TDS",
// ];

// export default function ComplianceTable({
//   row,
// }: {
//   row: ComplianceRow;
// }) {
//   const cells = [
//     row.companyName,
//     row.employeeCount,
//     row.pfAck,
//     row.pfAmount,
//     row.esiAck,
//     row.esiAmount,
//     row.ptAck,
//     row.ptAmount,
//     row.lwfAck,
//     row.lwfAmount,
//     row.tds,
//   ];

//   return (
//     <div className="w-full overflow-x-auto">
//       <table
//         className="
//           w-full
//           min-w-[1200px]
//           border-collapse
//           table-auto
//         "
//       >
//         <thead>
//           <tr
//             className="
//               h-[36px]
//               bg-[#D8EDF9]
//             "
//           >
//             {HEADERS.map((header, index) => (
//               <th
//                 key={header}
//                 className={`
//                   whitespace-nowrap
//                   px-[13px]
//                   py-[9px]
//                   text-left
//                   text-[12px]
//                   font-semibold
//                   leading-none
//                   text-[#2383E2]
//                   ${
//                     index === 0
//                       ? "min-w-[255px]"
//                       : "min-w-[118px]"
//                   }
//                 `}
//               >
//                 {header}
//               </th>
//             ))}
//           </tr>
//         </thead>

//         <tbody>
//           <tr className="bg-white">
//             {cells.map((cell, index) => (
//               <td
//                 key={`${index}-${String(cell)}`}
//                 className={`
//                   px-[13px]
//                   py-[12px]
//                   align-middle
//                   text-[14px]
//                   font-medium
//                   leading-[20px]
//                   text-[#17365D]
//                   ${
//                     index === 0
//                       ? "whitespace-normal"
//                       : "whitespace-nowrap"
//                   }
//                 `}
//               >
//                 {cell}
//               </td>
//             ))}
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// }











// import type { ComplianceRow } from "../types/details.types";

// const HEADERS = [
//   "Company Name",
//   "Employee Count",
//   "PF Ack. Number",
//   "PF Amount",
//   "ESI Ack. Number",
//   "ESI Amount",
//   "PT Ack. Number",
//   "PT Amount",
//   "LWF Ack. Number",
//   "LWF Amount",
//   "TDS",
// ];

// export default function ComplianceTable({ row }: { row: ComplianceRow }) {
//   const cells = [
//     row.companyName,
//     row.employeeCount,
//     row.pfAck,
//     row.pfAmount,
//     row.esiAck,
//     row.esiAmount,
//     row.ptAck,
//     row.ptAmount,
//     row.lwfAck,
//     row.lwfAmount,
//     row.tds,
//   ];

//   return (
//     <div
//       className="
//         w-full overflow-x-auto border-t border-slate-100
//         [&::-webkit-scrollbar]:h-1.5
//         [&::-webkit-scrollbar-track]:bg-transparent
//         [&::-webkit-scrollbar-thumb]:rounded-full
//         [&::-webkit-scrollbar-thumb]:bg-slate-300
//       "
//     >
//       <table className="w-full border-collapse text-left">
//         <thead>
//           <tr className="bg-[#D6EAF8]">
//             {HEADERS.map((label) => (
//               <th
//                 key={label}
//                 className="whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold text-[#2790F3]"
//               >
//                 {label}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           <tr className="bg-white text-[12px] text-slate-700">
//             {cells.map((c, i) => (
//               <td
//                 key={i}
//                 className={`
//                   px-4 py-2.5 align-middle
//                   ${i === 0 ? "max-w-[200px] whitespace-normal font-medium text-slate-700" : "whitespace-nowrap"}
//                 `}
//               >
//                 {c}
//               </td>
//             ))}
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// }


import type { ComplianceRow } from "../types/details.types";

const HEADERS = [
  "Company Name",
  "Employee Count",
  "PF Ack. Number",
  "PF Amount",
  "ESI Ack. Number",
  "ESI Amount",
  "PT Ack. Number",
  "PT Amount",
  "LWF Ack. Number",
  "LWF Amount",
  "TDS",
];

export default function ComplianceTable({
  row,
}: {
  row: ComplianceRow;
}) {
  const cells = [
    row.companyName,
    row.employeeCount,
    row.pfAck,
    row.pfAmount,
    row.esiAck,
    row.esiAmount,
    row.ptAck,
    row.ptAmount,
    row.lwfAck,
    row.lwfAmount,
    row.tds,
  ];

  return (
    <div className="w-full overflow-x-auto px-3 pb-3">
      <table className="w-full min-w-[1100px] border-collapse border border-slate-300 text-left">
        <colgroup>
          <col className="w-[17%]" />
          <col className="w-[9%]" />
          <col className="w-[9%]" />
          <col className="w-[9%]" />
          <col className="w-[9%]" />
          <col className="w-[9%]" />
          <col className="w-[9%]" />
          <col className="w-[9%]" />
          <col className="w-[9%]" />
          <col className="w-[9%]" />
          <col className="w-[5%]" />
        </colgroup>

        <thead>
          <tr className="bg-[#D6EAF8]">
            {HEADERS.map((label) => (
              <th
                key={label}
                className="
                  border
                  border-slate-300
                  whitespace-nowrap
                  px-3
                  py-2
                  text-left
                  text-[11px]
                  font-semibold
                  text-[#2790F3]
                "
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr className="bg-white text-[12px] text-slate-700">
            {cells.map((cell, index) => (
              <td
                key={index}
                className={`
                  border
                  border-slate-300
                  px-3
                  py-3
                  align-middle
                  ${index === 0
                    ? "whitespace-normal font-medium text-slate-800"
                    : "whitespace-nowrap text-center"
                  }
                `}
              >
                {cell}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
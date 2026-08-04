// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import Loader from "@/components/ui/loader";

// import { useLeave } from "../hooks/useLeave";

// export default function LeaveHistory() {
//   const { leaveHistory, historyLoading } = useLeave();

//   const getStatusClass = (status: string) => {
//     switch (status.toLowerCase()) {
//       case "approved":
//         return "bg-green-100 text-green-700";

//       case "rejected":
//         return "bg-red-100 text-red-700";

//       case "pending":
//         return "bg-yellow-100 text-yellow-700";

//       case "withdrawn":
//         return "bg-orange-100 text-orange-700";

//       case "cancelled":
//         return "bg-gray-200 text-gray-700";

//       default:
//         return "bg-slate-100 text-slate-700";
//     }
//   };

//   if (historyLoading) {
//     return (
//       <div className="flex justify-center py-12">
//         <Loader />
//       </div>
//     );
//   }

//   const headers =
//     leaveHistory?.records[0]?.fields ?? [];

//   return (
//     <Card className="border shadow-md">

//       <CardHeader className="pb-3">

//         <CardTitle className="text-xl">
//           Leave History
//         </CardTitle>

//         <p className="text-sm text-slate-500">
//           View all your leave requests and their current status.
//         </p>

//       </CardHeader>

//       <CardContent>

//         {!leaveHistory?.records.length ? (
//           <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
//             <p className="text-sm text-slate-500">
//               No leave history available.
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto rounded-lg border">

//             <table className="min-w-full text-sm">

//               <thead
//                 className="text-white"
//                 style={{
//                   background: "var(--primary-color)",
//                 }}
//               >
//                 <tr>
//                   {headers.map((field) => (
//                     <th
//                       key={field.label}
//                       className="px-5 py-4 text-left font-semibold"
//                     >
//                       {field.label}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody>
//                 {leaveHistory.records.map((record, index) => (
//                   <tr
//                     key={index}
//                     className={`border-b transition hover:bg-slate-50 ${index % 2 === 0
//                         ? "bg-white"
//                         : "bg-slate-50/40"
//                       }`}
//                   >
//                     {record.fields.map((field) => (
//                       <td
//                         key={field.label}
//                         className={`px-5 py-4 ${field.label === "Status"
//                             ? "text-center"
//                             : ""
//                           }`}
//                       >
//                         {field.label === "Status" ? (
//                           <span
//                             className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
//                               String(field.value)
//                             )}`}
//                           >
//                             {field.value}
//                           </span>
//                         ) : field.label === "Leave Type" ? (
//                           <span
//                             className="
//                 rounded-full
//                 bg-blue-100
//                 px-3
//                 py-1
//                 text-xs
//                 font-semibold
//                 text-blue-700
//               "
//                           >
//                             {field.value}
//                           </span>
//                         ) : (
//                           field.value ?? "-"
//                         )}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>

//             </table>

//           </div>
//         )}

//       </CardContent>

//     </Card>
//   );
// }



import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import LeaveHistoryTable from "../components/LeaveHistoryTable";

export default function LeaveHistory() {
  return (
    <Card className="border shadow-md">

      <CardHeader className="pb-3">

        <CardTitle className="text-xl">
          Leave History
        </CardTitle>

        <p className="text-sm text-slate-500">
          View all your leave requests and their current status.
        </p>

      </CardHeader>

      <CardContent>
        <LeaveHistoryTable />
      </CardContent>

    </Card>
  );
}


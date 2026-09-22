
// import { Phone, Mail } from "lucide-react";
 
// export interface EmployeeSummary {
//   empId: string;
//   fullName: string;
//   designation: string;
//   branch: string;
//   dateOfJoining: string;
//   mobile: string;
//   email: string;
// }
 
// export default function EmployeeSummaryCard({ employee }: { employee: EmployeeSummary }) {
//   return (
//     <div className="text-center lg:text-left lg:border-r lg:border-gray-100 lg:pr-6">
//       <div className="w-full max-w-[200px] mx-auto lg:mx-0 aspect-square rounded-md overflow-hidden bg-gray-100 mb-3">
//         <div className="w-full h-full flex items-center justify-center text-gray-400 text-[12px]">
//           No photo
//         </div>
//       </div>
//       <div className="font-semibold text-gray-800 text-[14px]">{employee.fullName}</div>
//       <div className="my-1.5 flex justify-center lg:justify-start">
//         <span className="text-[11px] text-green-700 bg-green-50 border border-green-100 rounded px-2 py-0.5">
//           {employee.empId}
//         </span>
//       </div>
//       <div className="text-[12px] text-gray-500">
//         {employee.designation} | {employee.branch}
//       </div>
//       {employee.dateOfJoining && (
//         <div className="text-[11px] text-gray-400 mt-1">DOJ {employee.dateOfJoining}</div>
//       )}
//       <div className="mt-3 space-y-1.5 text-[12px] text-gray-600">
//         {employee.mobile && (
//           <div className="flex items-center justify-center lg:justify-start gap-1.5">
//             <Phone size={12} className="text-gray-400" />
//             {employee.mobile}
//           </div>
//         )}
//         {employee.email && (
//           <div className="flex items-center justify-center lg:justify-start gap-1.5">
//             <Mail size={12} className="text-gray-400" />
//             {employee.email}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
 
















import { Phone, Mail } from "lucide-react";
 
export interface EmployeeSummary {
  empId: string;
  fullName: string;
  designation: string;
  branch: string;
  dateOfJoining: string;
  mobile: string;
  email: string;
}
 
export default function EmployeeSummaryCard({ employee }: { employee: EmployeeSummary }) {
  return (
    <div className="text-center lg:border-r lg:border-[#E2E2E2] lg:pr-6 lg:text-left">
      <div className="mx-auto mb-3 aspect-square w-full max-w-[200px] overflow-hidden rounded-[8px] bg-[#F5F5F5] lg:mx-0">
        <div className="flex h-full w-full items-center justify-center text-[12px] text-[#626262]">
          No photo
        </div>
      </div>
      <div className="text-[14px] font-semibold text-[#131313]">{employee.fullName}</div>
      <div className="my-1.5 flex justify-center lg:justify-start">
        <span className="rounded border border-[#B8E8D0] bg-[#F5FFFA] px-2 py-0.5 text-[11px] text-[#03884A]">
          {employee.empId}
        </span>
      </div>
      <div className="text-[12px] text-[#626262]">
        {employee.designation} | {employee.branch}
      </div>
      {employee.dateOfJoining && (
        <div className="mt-1 text-[11px] text-[#626262]">DOJ {employee.dateOfJoining}</div>
      )}
      <div className="mt-3 space-y-1.5 text-[12px] text-gray-600">
        {employee.mobile && (
          <div className="flex items-center justify-center lg:justify-start gap-1.5">
            <Phone size={12} className="text-gray-400" />
            {employee.mobile}
          </div>
        )}
        {employee.email && (
          <div className="flex items-center justify-center lg:justify-start gap-1.5">
            <Mail size={12} className="text-gray-400" />
            {employee.email}
          </div>
        )}
      </div>
    </div>
  );
}
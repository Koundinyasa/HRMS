
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
    <div className="text-center lg:text-left lg:border-r lg:border-gray-100 lg:pr-6">
      <div className="w-full max-w-[200px] mx-auto lg:mx-0 aspect-square rounded-md overflow-hidden bg-gray-100 mb-3">
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-[12px]">
          No photo
        </div>
      </div>
      <div className="font-semibold text-gray-800 text-[14px]">{employee.fullName}</div>
      <div className="my-1.5 flex justify-center lg:justify-start">
        <span className="text-[11px] text-green-700 bg-green-50 border border-green-100 rounded px-2 py-0.5">
          {employee.empId}
        </span>
      </div>
      <div className="text-[12px] text-gray-500">
        {employee.designation} | {employee.branch}
      </div>
      {employee.dateOfJoining && (
        <div className="text-[11px] text-gray-400 mt-1">DOJ {employee.dateOfJoining}</div>
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
 
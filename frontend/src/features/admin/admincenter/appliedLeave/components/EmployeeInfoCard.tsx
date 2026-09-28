import { Mail, Building2, BriefcaseBusiness, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type {
  ReportingEmployee,
  EmployeeDetails,
  EmployeeInfoCardProps
} from "../types/appliedLeave.types";

export default function EmployeeInfoCard({
  employee,
  details,
  loading = false,
}: EmployeeInfoCardProps) {
  if (!employee) {
    return null;
  }

  if (loading) {
    return (
      <Card className="rounded-2xl border border-slate-300 shadow-sm">
        <CardContent className="p-5">
          <div className="h-6 w-56 animate-pulse rounded bg-slate-200" />

          <div className="mt-5 space-y-4">
            <div className="h-4 w-72 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-64 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-60 animate-pulse rounded bg-slate-200" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-slate-300 shadow-sm">
      <CardContent className="p-5">
        {/* Employee Name + ID */}
        <h2 className="text-base font-semibold text-[#16335f]">
          {employee.EmployeeName} ({employee.EmployeeID})
        </h2>

        <div className="mt-5 space-y-4">
          {/* Email */}
          <div className="flex items-start gap-3">
            <Mail
              size={17}
              strokeWidth={1.7}
              className="mt-0.5 shrink-0 text-slate-500"
            />

            <div className="min-w-0">
              <p className="text-xs text-slate-500">Email</p>
              <p className="break-all text-sm text-[#294a78]">
                {details?.Email || "-"}
              </p>
            </div>
          </div>

          {/* Branch */}
          <div className="flex items-start gap-3">
            <Building2
              size={17}
              strokeWidth={1.7}
              className="mt-0.5 shrink-0 text-slate-500"
            />

            <div>
              <p className="text-xs text-slate-500">Branch</p>
              <p className="text-sm text-[#294a78]">
                {details?.BranchName || "-"}
              </p>
            </div>
          </div>

          {/* Designation */}
          <div className="flex items-start gap-3">
            <BriefcaseBusiness
              size={17}
              strokeWidth={1.7}
              className="mt-0.5 shrink-0 text-slate-500"
            />

            <div>
              <p className="text-xs text-slate-500">Designation</p>
              <p className="text-sm text-[#294a78]">
                {details?.DesignationName || "-"}
              </p>
            </div>
          </div>

          {/* Policy Name */}
          <div className="flex items-start gap-3">
            <FileText
              size={17}
              strokeWidth={1.7}
              className="mt-0.5 shrink-0 text-slate-500"
            />

            <div>
              <p className="text-xs text-slate-500">Policy Name</p>
              <p className="text-sm text-[#294a78]">
                {details?.PolicyName || "-"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
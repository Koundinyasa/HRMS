import { Card, CardContent } from "@/components/ui/card";
 
import type {
  EmployeeDetails,
  EmployeeInfoCardProps,
} from "../types/leave.types";
 
const ROWS: { label: string; field: keyof EmployeeDetails }[] = [
  { label: "Mobile", field: "MobileNo" },
  { label: "Email", field: "Email" },
  { label: "Branch", field: "BranchName" },
  { label: "Desig", field: "DesignationName" },
  { label: "Policy Name", field: "PolicyName" },
];
 
export default function EmployeeInfoCard({
  employee,
  details,
  loading = false,
}: EmployeeInfoCardProps) {
  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm">
      <CardContent className="space-y-3 p-5">
 
        {!employee ? (
          <p className="text-sm text-slate-500">
            Select an employee to apply on their behalf.
          </p>
        ) : (
          <>
            <p className="text-base font-semibold text-slate-800">
              {employee.EmployeeName} ({employee.EmployeeID})
            </p>
 
            {loading ? (
              <p className="text-sm text-slate-500">Loading details...</p>
            ) : (
              ROWS.map(({ label, field }) => {
                const value = details?.[field];
 
                if (!value) return null;
 
                return (
                  <div
                    key={label}
                    className="flex flex-wrap items-baseline gap-2"
                  >
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {label}
                    </span>
 
                    <span className="text-sm text-slate-700">
                      {value}
                    </span>
                  </div>
                );
              })
            )}
          </>
        )}
 
      </CardContent>
    </Card>
  );
}
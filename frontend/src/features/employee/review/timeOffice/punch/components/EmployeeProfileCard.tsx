import type {
  EmployeeProfileCardProps,
} from "../types/punch.types";

export default function EmployeeProfileCard({
  profile,
}: EmployeeProfileCardProps) {
  if (!profile) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="text-sm text-gray-400">
          Select an employee to view details.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Employee */}
        <div>
          <p className="text-xs text-gray-400">
            Employee
          </p>

          <p className="mt-1 text-base font-semibold text-gray-800">
            {profile.employeeName ||
              "-"}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {profile.employeeId ||
              "-"}
          </p>
        </div>

        {/* Policy */}
        <div>
          <p className="text-xs text-gray-400">
            Policy
          </p>

          <p className="mt-1 text-sm font-medium text-gray-700">
            {profile.policyName ||
              "-"}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Double Punch:{" "}
            {profile.doublePunchPolicy ||
              "-"}
          </p>
        </div>

        {/* Shift */}
        <div>
          <p className="text-xs text-gray-400">
            Shift
          </p>

          <p className="mt-1 text-sm font-medium text-gray-700">
            {profile.shiftName ||
              "-"}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {profile.shiftTiming ||
              "-"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 border-t border-gray-100 pt-5 md:grid-cols-2">
        <div>
          <p className="text-xs text-gray-400">
            Reporting Authority
          </p>

          <p className="mt-1 text-sm font-medium text-gray-700">
            {profile.reportingAuthorityName ||
              "-"}
          </p>

          <p className="text-xs text-gray-500">
            {profile.reportingAuthorityCode ||
              "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400">
            Department / Designation
          </p>

          <p className="mt-1 text-sm font-medium text-gray-700">
            {profile.department ||
              "-"}
          </p>

          <p className="text-xs text-gray-500">
            {profile.designation ||
              "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
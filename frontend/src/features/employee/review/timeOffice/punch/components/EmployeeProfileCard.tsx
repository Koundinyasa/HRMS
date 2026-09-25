import type {
  EmployeeProfileCardProps,
} from "../types/punch.types";

export default function EmployeeProfileCard({
  profile,
}: EmployeeProfileCardProps) {
  if (!profile) {
    return (
      <div className="rounded-xl border border-black bg-white p-5 font-[Urbanist]">
        <p className="text-sm text-gray-400 font-[Urbanist]">
          Select an employee to view details.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-black bg-white p-5 font-[Urbanist]">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3 font-[Urbanist]">
        {/* Employee */}
        <div>
          <p className="text-xs text-gray-400 font-[Urbanist]">
            Employee
          </p>

          <p className="mt-1 text-base font-semibold text-gray-800 font-[Urbanist]">
            {profile.employeeName ||
              "-"}
          </p>

          <p className="mt-1 text-sm text-gray-500 font-[Urbanist]">
            {profile.employeeId ||
              "-"}
          </p>
        </div>

        {/* Policy */}
        <div>
          <p className="text-xs text-gray-400 font-[Urbanist]">
            Policy
          </p>

          <p className="mt-1 text-sm font-medium text-gray-700 font-[Urbanist]">
            {profile.policyName ||
              "-"}
          </p>

          <p className="mt-1 text-xs text-gray-500 font-[Urbanist]">
            Double Punch:{" "}
            {profile.doublePunchPolicy ||
              "-"}
          </p>
        </div>

        {/* Shift */}
        <div>
          <p className="text-xs text-gray-400 font-[Urbanist]">
            Shift
          </p>

          <p className="mt-1 text-sm font-medium text-gray-700 font-[Urbanist]">
            {profile.shiftName ||
              "-"}
          </p>

          <p className="mt-1 text-xs text-gray-500 font-[Urbanist]">
            {profile.shiftTiming ||
              "-"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 border-t border-black pt-5 md:grid-cols-2 font-[Urbanist]">
        <div>
          <p className="text-xs text-gray-400 font-[Urbanist]">
            Reporting Authority
          </p>

          <p className="mt-1 text-sm font-medium text-gray-700 font-[Urbanist]">
            {profile.reportingAuthorityName ||
              "-"}
          </p>

          <p className="text-xs text-gray-500 font-[Urbanist]">
            {profile.reportingAuthorityCode ||
              "-"}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-400 font-[Urbanist]">
            Department / Designation
          </p>

          <p className="mt-1 text-sm font-medium text-gray-700 font-[Urbanist]">
            {profile.department ||
              "-"}
          </p>

          <p className="text-xs text-gray-500 font-[Urbanist]">
            {profile.designation ||
              "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
import { Eye, Trash2 } from "lucide-react";

import { isEmployeeFull, type Employee } from "../api/employeeListApi";
import { ACTION_COLUMN_WIDTH, GRID_COLUMNS } from "../constants/employeeList.constants";
import { getStatus, initials } from "../utils/employeeList.utils";

const muted = "text-[12.5px] text-[#626262]";

function Tag({ children, tone = "orange" }: { children: string; tone?: "orange" | "red" | "green" | "gray" }) {
  const tones = {
    orange: "bg-[#FFF5EE] text-[#FF6200]",
    red: "bg-[#FEECEC] text-[#DD3232]",
    green: "bg-[#E7F8F1] text-[#0B8F63]",
    gray: "bg-[#F1F1F1] text-[#626262]",
  };
  return (
    <span className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] font-semibold leading-4 ${tones[tone]}`}>
      {children}
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const active = status.toLowerCase() === "active";
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold",
        active ? "bg-[#E7F8F1] text-[#0B8F63]" : "bg-[#FEECEC] text-[#DD3232]",
      ].join(" ")}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-[#10B981]" : "bg-[#DD3232]"}`} />
      {status}
    </span>
  );
}

interface EmployeeRowProps {
  employee: Employee;
  onOpen: (employeeId: number) => void;
  onDelete: (employee: Employee) => void;
}

/** One employee in the list. Click anywhere on the row to open the details. */
export default function EmployeeRow({ employee, onOpen, onDelete }: EmployeeRowProps) {
  const full = isEmployeeFull(employee) ? employee : null;
  const reportingTo = full?.ReportingManager ?? employee.ReportingAuthorityName;

  return (
    <div
      onClick={() => onOpen(employee.EmployeeID)}
      className="grid cursor-pointer items-center border-t border-[#EDEDED] py-3.5 transition-colors hover:bg-[#FFFAF6]"
      style={{ gridTemplateColumns: GRID_COLUMNS }}
    >
      {/* Name */}
      <div className="flex min-w-0 items-center gap-3 px-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF5EE] text-[14px] font-semibold text-[#FF6200]">
          {initials(employee.EmployeeName)}
        </div>
        <div className="min-w-0">
          <div className="truncate text-[14.5px] font-semibold text-[#131313]">{employee.EmployeeName}</div>
          <div className="mt-0.5 flex min-w-0 items-center gap-2">
            <Tag>{String(employee.EmployeeID)}</Tag>
            {full?.DesignationName && <span className={`truncate ${muted}`}>{full.DesignationName}</span>}
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="space-y-1 px-4">
        {employee.JoiningDate ? (
          <div className="flex items-center gap-2 text-[13.5px] text-[#131313]">
            <Tag>DOJ</Tag>
            {employee.JoiningDate}
          </div>
        ) : (
          <span className={muted}>—</span>
        )}
        {employee.ExitDate && (
          <div className="flex items-center gap-2 text-[13.5px] text-[#DD3232]">
            <Tag tone="red">DOL</Tag>
            {employee.ExitDate}
          </div>
        )}
      </div>

      {/* Contact */}
      <div className="min-w-0 space-y-1 px-4">
        <div className="truncate text-[13.5px] text-[#131313]">{full?.Email || "—"}</div>
        {full?.MobileNo && <div className={muted}>{full.MobileNo}</div>}
      </div>

      {/* Branch */}
      <div className="min-w-0 space-y-1 px-4">
        <div className="truncate text-[13.5px] text-[#131313]">{full?.BranchName || "—"}</div>
        {reportingTo && <div className={`truncate ${muted}`}>Reports to {reportingTo}</div>}
      </div>

      {/* Leave policy */}
      <div className="min-w-0 space-y-1 px-4">
        <div className="truncate text-[13.5px] text-[#131313]">{full?.LeavePolicyName || "—"}</div>
        {full?.AttendanceType && <div className={`truncate ${muted}`}>{full.AttendanceType}</div>}
      </div>

      {/* Status */}
      <div className="px-4">
        <StatusPill status={getStatus(employee)} />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-0.5" style={{ width: ACTION_COLUMN_WIDTH }}>
        <button
          type="button"
          aria-label={`View ${employee.EmployeeName}`}
          title="View details"
          onClick={(event) => {
            event.stopPropagation();
            onOpen(employee.EmployeeID);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#626262] transition-colors hover:bg-[#FFF5EE] hover:text-[#FF6200]"
        >
          <Eye size={17} strokeWidth={2} />
        </button>
        <button
          type="button"
          aria-label={`Remove ${employee.EmployeeName}`}
          title="Remove employee"
          onClick={(event) => {
            event.stopPropagation();
            onDelete(employee);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#8A8A8A] transition-colors hover:bg-[#FEECEC] hover:text-[#DD3232]"
        >
          <Trash2 size={17} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

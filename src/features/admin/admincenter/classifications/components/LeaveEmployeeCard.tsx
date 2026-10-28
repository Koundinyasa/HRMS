import type { LeaveEmployee } from "../types/leave.types";

interface Props {
  employees?: LeaveEmployee[];
  selected?: LeaveEmployee;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

function Row({ label, value, wide }: { label: string; value?: string; wide?: boolean }) {
  return (
    <div className="flex gap-2.5 items-start">
      <span
        className={`bg-slate-100 rounded text-slate-500 text-center px-2 py-0.5 shrink-0 ${
          wide ? "min-w-[90px]" : "min-w-[60px]"
        }`}
      >
        {label}
      </span>
      <span className="text-slate-800">{value}</span>
    </div>
  );
}

export default function LeaveEmployeeCard({ employees, selected, selectedId, onSelect }: Props) {
  return (
    <div className="bg-white rounded-md p-5 shadow-sm">
      <select
        value={selectedId ?? ""}
        onChange={(e) => onSelect(e.target.value || null)}
        className="w-full border border-slate-300 rounded-md px-3.5 py-3 text-sm font-semibold text-slate-800"
      >
        <option value="">Select Employee</option>
        {employees?.map((e) => (
          <option key={e.employeeId} value={e.employeeId}>
            {e.name} ({e.code})
          </option>
        ))}
      </select>

      {/* This picks who Apply files leave FOR — it does not change the panels below. */}
      <p className="mt-2 text-xs text-slate-500">Applies leave on this employee's behalf</p>

      {selected && (
        <div className="flex flex-col gap-2.5 text-sm mt-4">
          <Row label="Mobile" value={selected.mobile} />
          <Row label="Email" value={selected.email} />
          <Row label="Branch" value={selected.branch} />
          <Row label="Desig" value={selected.designation} />
          <Row label="Policy Name" value={selected.policyName} wide />
        </div>
      )}
    </div>
  );
}

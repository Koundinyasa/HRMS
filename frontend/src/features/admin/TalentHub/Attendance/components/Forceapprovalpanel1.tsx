import { Settings, Check } from 'lucide-react';

export interface ForceApprovalRecord {
  id: string;
}

interface ForceApprovalPanelProps {
  records?: ForceApprovalRecord[];
  onForceApprove?: () => void;
}

export function ForceApprovalPanel1({ records = [], onForceApprove }: ForceApprovalPanelProps) {
  const hasRecords = records.length > 0;

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5">
      <button
        type="button"
        onClick={onForceApprove}
        className="flex items-center gap-2 rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-50"
      >
        <Settings size={16} />
        Force Approval
      </button>

      {!hasRecords && (
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <Check size={32} className="text-emerald-600" strokeWidth={2.5} />
          </div>
          <p className="text-base font-semibold text-slate-900">All caught up!</p>
          <p className="text-sm text-slate-500">No records found for force approval.</p>
        </div>
      )}

      {hasRecords && (
        <ul className="mt-4 divide-y divide-slate-100">
          {records.map((record) => (
            <li key={record.id} className="py-3 text-sm text-slate-700">
              {record.id}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
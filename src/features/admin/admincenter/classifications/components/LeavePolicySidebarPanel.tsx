import { Plus, FileText, Copy } from "lucide-react";
import type { LeavePolicyGroup, LeavePolicyGroupCode } from "../types/leavePolicy.types";

const GROUP_ICON: Record<LeavePolicyGroupCode, typeof FileText> = {
  employee: FileText,
  intern: Copy,
};

export default function LeavePolicySidebarPanel({
  groups,
  selectedCode,
  onSelect,
  onAdd,
}: {
  groups: LeavePolicyGroup[];
  selectedCode: LeavePolicyGroupCode;
  onSelect: (code: LeavePolicyGroupCode) => void;
  onAdd: () => void;
}) {
  return (
    <div className="w-64 shrink-0 bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-gray-800 text-[15px]">Leave Policy</h2>
        <button
          type="button"
          onClick={onAdd}
          aria-label="Add leave policy"
          className="w-7 h-7 rounded-lg border border-violet-200 text-violet-600 flex items-center justify-center hover:bg-violet-50"
        >
          <Plus size={15} />
        </button>
      </div>

      <div className="space-y-1.5">
        {groups.map((g) => {
          const Icon = GROUP_ICON[g.code];
          const isSelected = g.code === selectedCode;
          return (
            <button
              type="button"
              key={g.code}
              onClick={() => onSelect(g.code)}
              className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-left transition-colors ${
                isSelected
                  ? "bg-violet-600 text-white"
                  : "text-gray-700 hover:bg-violet-50 border border-transparent"
              }`}
            >
              <Icon size={16} className={isSelected ? "text-white" : "text-violet-500"} />
              <span className="truncate">{g.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

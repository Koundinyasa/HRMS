import { Plus, LogOut, History } from "lucide-react";
import { LEAVE_POLICY_SETTING_TABS } from "../constants/leavePolicy.constants";
import type { LeavePolicySettingTabKey } from "../types/leavePolicy.types";

const TAB_ICON: Record<LeavePolicySettingTabKey, typeof LogOut> = {
  behavior: LogOut,
  "holiday-weekly-off": History,
};

export default function LeavePolicyDetailSidebar({
  groupName,
  leaveName,
  activeTab,
  onSelectTab,
  onAddGroup,
}: {
  groupName: string;
  leaveName: string;
  activeTab: LeavePolicySettingTabKey;
  onSelectTab: (tab: LeavePolicySettingTabKey) => void;
  onAddGroup: () => void;
}) {
  return (
    <div className="w-64 shrink-0 bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-semibold text-gray-800 text-[15px]">{groupName}</h2>
        <button
          type="button"
          onClick={onAddGroup}
          aria-label="Add leave policy"
          className="w-7 h-7 rounded-lg border border-violet-200 text-violet-600 flex items-center justify-center hover:bg-violet-50"
        >
          <Plus size={15} />
        </button>
      </div>
      <p className="text-sm text-gray-500 mb-3 px-0.5">{leaveName}</p>

      <div className="h-px bg-gray-100 mb-3" />

      <div className="space-y-1.5">
        {LEAVE_POLICY_SETTING_TABS.map((tab) => {
          const Icon = TAB_ICON[tab.key];
          const isSelected = tab.key === activeTab;
          return (
            <button
              type="button"
              key={tab.key}
              onClick={() => onSelectTab(tab.key)}
              className={`w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm font-medium text-left transition-colors ${
                isSelected ? "bg-violet-600 text-white" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span
                className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                  isSelected ? "bg-white/15" : "bg-gray-100"
                }`}
              >
                <Icon size={14} className={isSelected ? "text-white" : "text-gray-400"} />
              </span>
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

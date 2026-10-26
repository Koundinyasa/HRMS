import { CRAFT_REPORT_TABS } from "../constants/craftReport.constants";

interface CraftReportTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export default function CraftReportTabs({
  activeTab,
  onTabChange,
}: CraftReportTabsProps) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
      {CRAFT_REPORT_TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onTabChange(tab.value)}
          className={[
            "flex-1 rounded-full px-4 py-2 text-sm font-medium transition text-center",
            activeTab === tab.value
              ? "bg-[#FDF1E9] text-[#D97B3F] border border-[#F5D5C0]"
              : "bg-white text-slate-700 border border-transparent hover:bg-[#FDF1E9]/40",
          ].join(" ")}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
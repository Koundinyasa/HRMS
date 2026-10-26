import { CRAFT_REPORT_TABS } from "../constants/craftReport.constants";

interface CraftReportContentProps {
  activeTab: string;
}

export default function CraftReportContent({
  activeTab,
}: CraftReportContentProps) {
  const activeLabel =
    CRAFT_REPORT_TABS.find((tab) => tab.value === activeTab)?.label ?? "";

  return (
    <div className="min-h-[400px] bg-white p-4">
      <p className="text-sm font-medium text-slate-700">{activeLabel}</p>
      {/* Report-specific table/content for this tab goes here later */}
    </div>
  );
}
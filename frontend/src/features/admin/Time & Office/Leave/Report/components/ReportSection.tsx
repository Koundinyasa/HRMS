import { ChevronRight, FileText } from "lucide-react";

interface ReportSectionProps {
  title: string;
  reports: string[];
  onReportClick?: (report: string) => void;
}

export default function ReportSection({
  title,
  reports,
  onReportClick,
}: ReportSectionProps) {
  return (
    <section className="flex min-h-[318px] flex-col overflow-hidden rounded-[12px] border border-[#aeb4bb] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <h2 className="flex min-h-[46px] items-center gap-2 border-b border-[#dfe3e8] bg-[#f3f5f7] px-4 font-serif text-[18px] font-bold leading-6 text-[#9a5547]">
        <FileText size={17} strokeWidth={1.8} className="shrink-0 text-[#a45a4a]" />
        {title}
      </h2>
      <div className="flex-1 px-2 py-2">
        {reports.map((report) => (
          <button
            key={report}
            type="button"
            onClick={() => onReportClick?.(report)}
            className="flex min-h-[33px] w-full items-center justify-between rounded-none px-2 text-left font-serif text-[13px] font-normal leading-5 text-[#202124] transition-colors hover:bg-[#fff5f2] hover:text-[#9a5547] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#df8d7c]"
          >
            <span>{report}</span>
            <ChevronRight size={17} strokeWidth={1.8} className="ml-2 shrink-0 text-[#3f3f3f]" />
          </button>
        ))}
      </div>
    </section>
  );
}

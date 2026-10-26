import { ChevronRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function PFMonthlyReport() {
  return (
    <div className="h-[208px] overflow-hidden rounded-xl border border-[#bfc1c3] bg-white shadow-sm">

      <div className="flex h-11 items-center gap-2 border-b border-[#e0e2e4] bg-[#f7f9fa] px-4">
        <FileText
          size={16}
          strokeWidth={2}
          className="text-[#8b5e52]"
        />

        <span className="text-sm font-semibold text-[#8b5e52]">
          PF Monthly Report
        </span>
      </div>

      <div className="px-3 py-2">

        {/* MONTHLY REPORT */}
        <Link
          to="pf/monthly-report"
          className="flex h-7 items-center justify-between text-sm text-[#555555] transition-colors hover:text-[#8b5e52]"
        >
          <span>Monthly Report</span>

          <ChevronRight
            size={16}
            strokeWidth={2}
          />
        </Link>

        {/* SUPPLEMENTARY REPORT */}
        <Link
          to="pf/supplementary-report"
          className="flex h-7 items-center justify-between text-sm text-[#555555] transition-colors hover:text-[#8b5e52]"
        >
          <span>Supplementary Report</span>

          <ChevronRight
            size={16}
            strokeWidth={2}
          />
        </Link>

      </div>
    </div>
  );
}
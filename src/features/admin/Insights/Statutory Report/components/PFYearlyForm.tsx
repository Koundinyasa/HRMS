import { ChevronRight, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";

import { STATUTORY_REPORT_ROUTES } from "../constants/statutoryReport.constants";

export default function PFYearlyForm() {
  return (
    <div className="h-[208px] overflow-hidden rounded-xl border border-[#bfc1c3] bg-white shadow-sm">
      <div className="flex h-11 items-center gap-2 border-b border-[#e0e2e4] bg-[#f7f9fa] px-4">
        <ClipboardList
          size={16}
          strokeWidth={2}
          className="text-[#8b5e52]"
        />

        <span className="text-sm font-semibold text-[#8b5e52]">
          PF Yearly FORM
        </span>
      </div>

      <div className="px-3 py-2">
        <Link
          to={STATUTORY_REPORT_ROUTES.PF_YEARLY_FORM_6A}
          className="flex h-7 items-center justify-between text-sm text-[#555555] transition-colors hover:text-[#8b5e52]"
        >
          <span>PF Yearly FORM -6A</span>

          <ChevronRight
            size={16}
            strokeWidth={2}
          />
        </Link>

        <Link
          to={STATUTORY_REPORT_ROUTES.PF_YEARLY_EPF_FORM_3A}
          className="flex h-7 items-center justify-between text-sm text-[#555555] transition-colors hover:text-[#8b5e52]"
        >
          <span>Yearly EPF Form 3A</span>

          <ChevronRight
            size={16}
            strokeWidth={2}
          />
        </Link>
      </div>
    </div>
  );
}
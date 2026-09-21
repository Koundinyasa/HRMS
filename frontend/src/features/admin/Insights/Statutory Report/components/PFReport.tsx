import { ChevronRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";

import { STATUTORY_REPORT_ROUTES } from "../constants/statutoryReport.constants";

export default function PFReport() {
  return (
    <div className="w-full sm:w-[272px]">
      <div className="h-[236px] overflow-hidden rounded-xl border border-[#bfc1c3] bg-white shadow-sm">
        <div className="flex h-11 items-center gap-2 border-b border-[#e0e2e4] bg-[#f7f9fa] px-4">
          <FileText
            size={16}
            strokeWidth={2}
            className="text-[#8b5e52]"
          />

          <span className="text-sm font-semibold text-[#8b5e52]">
            PF Report
          </span>
        </div>

        <div className="px-3 py-2">
          <Link
            to={STATUTORY_REPORT_ROUTES.PF_NON_EMPLOYEE_DETAILS}
            className="flex h-7 items-center justify-between text-sm text-[#555555] transition-colors hover:text-[#8b5e52]"
          >
            <span>Non PF Employee Details</span>

            <ChevronRight
              size={16}
              strokeWidth={2}
            />
          </Link>

          <Link
            to={STATUTORY_REPORT_ROUTES.PF_REGISTRATION}
            className="flex h-7 items-center justify-between text-sm text-[#555555] transition-colors hover:text-[#8b5e52]"
          >
            <span>PF Member Registration</span>

            <ChevronRight
              size={16}
              strokeWidth={2}
            />
          </Link>

          <Link
            to={STATUTORY_REPORT_ROUTES.PF_EXIT_FILE}
            className="flex h-7 items-center justify-between text-sm text-[#555555] transition-colors hover:text-[#8b5e52]"
          >
            <span>PF Exit File</span>

            <ChevronRight
              size={16}
              strokeWidth={2}
            />
          </Link>

          <Link
            to={STATUTORY_REPORT_ROUTES.PF_KYC_FILE}
            className="flex h-7 items-center justify-between text-sm text-[#555555] transition-colors hover:text-[#8b5e52]"
          >
            <span>PF KYC File</span>

            <ChevronRight
              size={16}
              strokeWidth={2}
            />
          </Link>

          <Link
            to={STATUTORY_REPORT_ROUTES.PF_ACKNOWLEDGEMENT}
            className="flex h-7 items-center justify-between text-sm text-[#555555] transition-colors hover:text-[#8b5e52]"
          >
            <span>PF Acknowledgement</span>

            <ChevronRight
              size={16}
              strokeWidth={2}
            />
          </Link>

          <Link
            to={STATUTORY_REPORT_ROUTES.PF_ACKNOWLEDGEMENT_VIEW}
            className="flex h-7 items-center justify-between text-sm text-[#555555] transition-colors hover:text-[#8b5e52]"
          >
            <span>PF Acknowledgement View</span>

            <ChevronRight
              size={16}
              strokeWidth={2}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
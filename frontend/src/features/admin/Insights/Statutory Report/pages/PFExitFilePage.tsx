import { ChevronLeft, Plus, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

import StatutoryReportNavbar from "../components/StatutoryReportNavbar";

export default function PFExitFilePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#f3f6fb] p-2 sm:p-3">
      {/* COMMON STATUTORY REPORT NAVBAR */}
      <StatutoryReportNavbar />

      {/* PAGE HEADER */}
      <div className="mt-3 rounded-xl border border-[#dedad8] bg-white px-4 py-2 shadow-[0_1px_5px_rgba(0,0,0,0.06)]">
        <div className="flex min-h-[58px] items-center">
          <div className="flex items-center">
            <div className="flex h-[40px] items-center gap-2 rounded-lg border border-[#c89584] bg-white px-4">
              <FileText size={18} className="text-[#8c5a4d]" />

              <h1 className="text-[15px] font-semibold text-[#8c5a4d]">
                PF Exit File
              </h1>
            </div>
          </div>

          {/* BACK BUTTON */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="ml-auto flex h-10 items-center gap-2 rounded-lg bg-[#966b5c] px-5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#875f52]"
          >
            <ChevronLeft size={18} />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* PF BATCH SECTION */}
      <div className="mt-3 overflow-hidden rounded-xl border border-[#d8d8d8] bg-white shadow-[0_1px_5px_rgba(0,0,0,0.05)]">
        {/* PF BATCH HEADER */}
        <div className="flex h-[66px] items-center justify-between border-b border-[#dddddd] px-5">
          <h2 className="text-[18px] font-semibold text-[#18304f]">PF Batch</h2>

          {/* ADD BUTTON */}
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#c89584] bg-white text-[#8c5a4d] transition hover:bg-[#fff8f5]"
          >
            <Plus size={23} />
          </button>
        </div>

        {/* EMPTY PF BATCH CONTENT */}
        <div className="min-h-[520px] bg-white" />
      </div>
    </div>
  );
}

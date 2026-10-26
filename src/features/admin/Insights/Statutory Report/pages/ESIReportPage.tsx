import { useNavigate } from "react-router-dom";
import {
  Shield,
  Plus,
  Users,
  IndianRupee,
  FileText,
  ChevronRight,
} from "lucide-react";

export default function ESIReportPage() {
  const navigate = useNavigate();

  // =========================
  // TOP REPORT NAVIGATION
  // =========================

  const handlePFReport = () => {
    navigate("/insights/statutory-report/pf");
  };

  const handleESIReport = () => {
    navigate("/insights/statutory-report/esi");
  };

  const handleLWFReport = () => {
    navigate("/insights/statutory-report/lwf");
  };

  const handlePTReport = () => {
    navigate("/insights/statutory-report/pt");
  };

  // =========================
  // ESI REPORT NAVIGATION
  // =========================

  const handleESIMonthlyReport = () => {
    navigate("/insights/statutory-report/esi/monthly-report");
  };

  const handleESISupplementaryReport = () => {
    navigate("/insights/statutory-report/esi/supplementary-report");
  };

  const handleESIMonthlyReturn = () => {
    navigate("/insights/statutory-report/esi/monthly-return");
  };

  const handleESIReturnSupplementary = () => {
    navigate("/insights/statutory-report/esi/return-supplementary");
  };

  const handleESIAcknowledgement = () => {
    navigate("/insights/statutory-report/esi/acknowledgement");
  };

  const handleESIAcknowledgementView = () => {
    navigate("/insights/statutory-report/esi/acknowledgement-view");
  };

  return (
    <div className="min-h-screen w-full bg-[#f5f7fb] px-5 py-5">
      <div className="w-full bg-white px-5 py-5">

        {/* =====================================================
            TOP REPORT TABS
        ====================================================== */}

        <div className="mb-8 rounded-[16px] border-2 border-[#e5b9aa] bg-[#fffaf8] px-3 py-2">
          <div className="flex flex-wrap items-center gap-4">

            {/* PF REPORT */}
            <button
              type="button"
              onClick={handlePFReport}
              className="
                flex items-center gap-2
                rounded-xl
                border border-[#d9d9d9]
                bg-white
                px-5 py-2.5
                text-sm font-medium
                text-[#795548]
                shadow-sm
                transition
                hover:bg-gray-50
              "
            >
              <Shield size={17} strokeWidth={1.8} />
              <span>PF Report</span>
            </button>

            {/* ESI REPORT - ACTIVE */}
            <button
              type="button"
              onClick={handleESIReport}
              className="
                flex items-center gap-2
                rounded-xl
                border border-[#d9d9d9]
                bg-white
                px-5 py-2.5
                text-sm font-medium
                text-[#795548]
                shadow-sm
                transition
              "
            >
              <Plus size={18} strokeWidth={2} />
              <span>ESI Report</span>
            </button>

            {/* LWF REPORT */}
            <button
              type="button"
              onClick={handleLWFReport}
              className="
                flex items-center gap-2
                rounded-xl
                border border-[#d9d9d9]
                bg-white
                px-5 py-2.5
                text-sm font-medium
                text-[#795548]
                shadow-sm
                transition
                hover:bg-gray-50
              "
            >
              <Users size={17} strokeWidth={1.8} />
              <span>LWF Report</span>
            </button>

            {/* PT REPORT */}
            <button
              type="button"
              onClick={handlePTReport}
              className="
                flex items-center gap-2
                rounded-xl
                border border-[#d9d9d9]
                bg-white
                px-5 py-2.5
                text-sm font-medium
                text-[#795548]
                shadow-sm
                transition
                hover:bg-gray-50
              "
            >
              <IndianRupee size={17} strokeWidth={1.8} />
              <span>PT Report</span>
            </button>

          </div>
        </div>

        {/* =====================================================
            ESI REPORT CARDS
        ====================================================== */}

        <div
          className="
            grid
            grid-cols-1
            gap-7
            md:grid-cols-2
            xl:grid-cols-3
          "
        >

          {/* =================================================
              CARD 1 - ESI MONTHLY REPORT
          ================================================== */}

          <div
            className="
              overflow-hidden
              rounded-[15px]
              border
              border-[#c7c7c7]
              bg-white
              shadow-sm
            "
          >
            {/* CARD HEADER */}
            <div
              className="
                flex
                items-center
                gap-2
                border-b
                border-[#d8d8d8]
                bg-[#f4f6f8]
                px-4
                py-3
              "
            >
              <FileText
                size={17}
                strokeWidth={1.8}
                className="text-[#8c5b4b]"
              />

              <h2 className="text-[15px] font-medium text-[#795548]">
                ESI Monthly Report
              </h2>
            </div>

            {/* CARD BODY */}
            <div className="px-3 py-1">

              {/* MONTHLY REPORT */}
              <button
                type="button"
                onClick={handleESIMonthlyReport}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  px-0
                  py-3
                  text-left
                  text-[14px]
                  text-[#374151]
                  transition
                  hover:text-[#1683e8]
                "
              >
                <span>Monthly Report</span>

                <ChevronRight
                  size={18}
                  strokeWidth={1.8}
                  className="text-[#666]"
                />
              </button>

              {/* SUPPLEMENTARY REPORT */}
              <button
                type="button"
                onClick={handleESISupplementaryReport}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  px-0
                  py-3
                  text-left
                  text-[14px]
                  text-[#374151]
                  transition
                  hover:text-[#1683e8]
                "
              >
                <span>Supplementary Report</span>

                <ChevronRight
                  size={18}
                  strokeWidth={1.8}
                  className="text-[#666]"
                />
              </button>

            </div>
          </div>

          {/* =================================================
              CARD 2 - ESI MONTHLY RETURN
          ================================================== */}

          <div
            className="
              overflow-hidden
              rounded-[15px]
              border
              border-[#c7c7c7]
              bg-white
              shadow-sm
            "
          >
            {/* CARD HEADER */}
            <div
              className="
                flex
                items-center
                gap-2
                border-b
                border-[#d8d8d8]
                bg-[#f4f6f8]
                px-4
                py-3
              "
            >
              <FileText
                size={17}
                strokeWidth={1.8}
                className="text-[#8c5b4b]"
              />

              <h2 className="text-[15px] font-medium text-[#795548]">
                ESI Monthly Return
              </h2>
            </div>

            {/* CARD BODY */}
            <div className="px-3 py-1">

              {/* MONTHLY RETURN */}
              <button
                type="button"
                onClick={handleESIMonthlyReturn}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  px-0
                  py-3
                  text-left
                  text-[14px]
                  text-[#374151]
                  transition
                  hover:text-[#1683e8]
                "
              >
                <span>ESI Monthly Return Report</span>

                <ChevronRight
                  size={18}
                  strokeWidth={1.8}
                  className="text-[#666]"
                />
              </button>

              {/* RETURN SUPPLEMENTARY */}
              <button
                type="button"
                onClick={handleESIReturnSupplementary}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  px-0
                  py-3
                  text-left
                  text-[14px]
                  text-[#374151]
                  transition
                  hover:text-[#1683e8]
                "
              >
                <span>Return Supplementary Report</span>

                <ChevronRight
                  size={18}
                  strokeWidth={1.8}
                  className="text-[#666]"
                />
              </button>

            </div>
          </div>

          {/* =================================================
              CARD 3 - ESI REPORT
          ================================================== */}

          <div
            className="
              overflow-hidden
              rounded-[15px]
              border
              border-[#c7c7c7]
              bg-white
              shadow-sm
            "
          >
            {/* CARD HEADER */}
            <div
              className="
                flex
                items-center
                gap-2
                border-b
                border-[#d8d8d8]
                bg-[#f4f6f8]
                px-4
                py-3
              "
            >
              <FileText
                size={17}
                strokeWidth={1.8}
                className="text-[#8c5b4b]"
              />

              <h2 className="text-[15px] font-medium text-[#795548]">
                ESI Report
              </h2>
            </div>

            {/* CARD BODY */}
            <div className="px-3 py-1">

              {/* ACKNOWLEDGEMENT */}
              <button
                type="button"
                onClick={handleESIAcknowledgement}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  px-0
                  py-3
                  text-left
                  text-[14px]
                  text-[#374151]
                  transition
                  hover:text-[#1683e8]
                "
              >
                <span>ESI Acknowledgement</span>

                <ChevronRight
                  size={18}
                  strokeWidth={1.8}
                  className="text-[#666]"
                />
              </button>

              {/* ACKNOWLEDGEMENT VIEW */}
              <button
                type="button"
                onClick={handleESIAcknowledgementView}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  px-0
                  py-3
                  text-left
                  text-[14px]
                  text-[#374151]
                  transition
                  hover:text-[#1683e8]
                "
              >
                <span>ESI Acknowledgement View</span>

                <ChevronRight
                  size={18}
                  strokeWidth={1.8}
                  className="text-[#666]"
                />
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
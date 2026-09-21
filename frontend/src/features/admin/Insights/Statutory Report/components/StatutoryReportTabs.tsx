
// import { useNavigate } from "react-router-dom";
// import {
//   Shield,
//   Plus,
//   Users,
//   IndianRupee,
// } from "lucide-react";

// import { NavLink } from "react-router-dom";

// import PFMonthlyReport from "./PFMonthlyReport";
// import PFECRReport from "./PFECRReport";
// import PFMonthlyForm from "./PFMonthlyForm";
// import PFYearlyForm from "./PFYearlyForm";
// import PFReport from "./PFReport";

// export default function StatutoryReportTabs() {
//   return (
//     <div className="w-full">

//       {/* =====================================================
//           TOP TABS
//       ====================================================== */}

//       <div className="w-full rounded-xl border-2 border-[#d8b6ad] bg-[#fff7f4] px-3 py-2">
//         <div className="flex flex-wrap items-center gap-4">

//           {/* PF REPORT */}
//           <NavLink
//             end
//             to="."
//             className={({ isActive }) =>
//               `flex h-9 min-w-[130px] items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium shadow-sm transition ${
//                 isActive
//                   ? "border border-[#c99b8e] bg-white text-[#8b5e52]"
//                   : "border border-[#dddddd] bg-white text-[#555555]"
//               }`
//             }
//           >
//             <Shield
//               size={16}
//               strokeWidth={2}
//             />

//             <span>PF Report</span>
//           </NavLink>

//           {/* ESI REPORT */}
//           <NavLink
//             to="esi"
//             className={({ isActive }) =>
//               `flex h-9 min-w-[120px] items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium shadow-sm transition ${
//                 isActive
//                   ? "border border-[#c99b8e] bg-white text-[#8b5e52]"
//                   : "border border-[#dddddd] bg-white text-[#555555]"
//               }`
//             }
//           >
//             <Plus
//               size={16}
//               strokeWidth={2}
//             />

//             <span>ESI Report</span>
//           </NavLink>

//           {/* LWF REPORT */}
//           <NavLink
//             to="lwf"
//             className={({ isActive }) =>
//               `flex h-9 min-w-[120px] items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium shadow-sm transition ${
//                 isActive
//                   ? "border border-[#c99b8e] bg-white text-[#8b5e52]"
//                   : "border border-[#dddddd] bg-white text-[#555555]"
//               }`
//             }
//           >
//             <Users
//               size={16}
//               strokeWidth={2}
//             />

//             <span>LWF Report</span>
//           </NavLink>

//           {/* PT REPORT */}
//           <NavLink
//             to="pt"
//             className={({ isActive }) =>
//               `flex h-9 min-w-[120px] items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium shadow-sm transition ${
//                 isActive
//                   ? "border border-[#c99b8e] bg-white text-[#8b5e52]"
//                   : "border border-[#dddddd] bg-white text-[#555555]"
//               }`
//             }
//           >
//             <IndianRupee
//   size={16}
//   strokeWidth={2}
// />

//             <span>PT Report</span>
//           </NavLink>

//         </div>
//       </div>

//       {/* =====================================================
//           PF REPORT CONTENT
//       ====================================================== */}

//       <div className="mt-8 grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-4">
//         <PFMonthlyReport />

//         <PFECRReport />

//         <PFMonthlyForm />

//         <PFYearlyForm />
//       </div>

//       {/* =====================================================
//           PF REPORT
//       ====================================================== */}

//       <div className="mt-7">
//         <PFReport />
//       </div>

//     </div>
//   );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Shield,
  Plus,
  Users,
  IndianRupee,
  FileText,
  ChevronRight,
} from "lucide-react";

import { NavLink } from "react-router-dom";

import PFMonthlyReport from "./PFMonthlyReport";
import PFECRReport from "./PFECRReport";
import PFMonthlyForm from "./PFMonthlyForm";
import PFYearlyForm from "./PFYearlyForm";
import PFReport from "./PFReport";

/* =========================================================
   TYPES
========================================================= */

type ReportType = "pf" | "esi" | "lwf" | "pt";

/* =========================================================
   COMMON REPORT ROW
========================================================= */

interface ReportRowProps {
  label: string;
  onClick: () => void;
}

function ReportRow({
  label,
  onClick,
}: ReportRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex
        w-full
        items-center
        justify-between
        px-3
        py-[7px]
        text-left
        text-sm
        text-[#17375f]
        transition
        hover:bg-[#fafafa]
      "
    >
      <span>{label}</span>

      <ChevronRight
        size={17}
        strokeWidth={1.8}
        className="text-[#555555]"
      />
    </button>
  );
}

/* =========================================================
   REPORT CARD
========================================================= */

interface ReportCardProps {
  title: string;
  children: React.ReactNode;
}

function ReportCard({
  title,
  children,
}: ReportCardProps) {
  return (
    <div
      className="
        min-h-[148px]
        overflow-hidden
        rounded-[15px]
        border
        border-[#c9cdd2]
        bg-white
        shadow-[0_2px_4px_rgba(0,0,0,0.12)]
      "
    >
      {/* CARD HEADER */}

      <div
        className="
          flex
          h-[48px]
          items-center
          gap-2
          border-b
          border-[#d8dadd]
          bg-[#f7f8f9]
          px-4
        "
      >
        <FileText
          size={17}
          strokeWidth={1.8}
          className="text-[#925541]"
        />

        <span
          className="
            text-[15px]
            font-medium
            text-[#7b4534]
          "
        >
          {title}
        </span>
      </div>

      {/* CARD CONTENT */}

      <div className="py-2">
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   STATUTORY REPORT TABS
========================================================= */

export default function StatutoryReportTabs() {
  const navigate = useNavigate();

  const [activeReport, setActiveReport] =
    useState<ReportType>("pf");

  /* =======================================================
     HANDLE TOP TAB
  ======================================================= */

  const handleReportClick = (
    report: ReportType
  ) => {
    setActiveReport(report);

    /*
      The content is displayed immediately using
      activeReport.

      Navigation is also preserved so your URLs
      continue to work.
    */

    if (report === "pf") {
      navigate(".");
      return;
    }

    navigate(report);
  };

  /* =======================================================
     HANDLE CHILD REPORT
  ======================================================= */

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="w-full">

      {/* =====================================================
          TOP TABS
      ====================================================== */}

      <div
        className="
          w-full
          rounded-xl
          border-2
          border-[#d8b6ad]
          bg-[#fff7f4]
          px-3
          py-2
        "
      >
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-4
          "
        >

          {/* =================================================
              PF REPORT
          ================================================== */}

          <NavLink
            end
            to="."
            onClick={() =>
              setActiveReport("pf")
            }
            className={() =>
              `
                flex
                h-9
                min-w-[130px]
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                px-4
                text-sm
                font-medium
                shadow-sm
                transition
                ${
                  activeReport === "pf"
                    ? "border-[#c99b8e] bg-white text-[#8b5e52]"
                    : "border-[#dddddd] bg-white text-[#555555]"
                }
              `
            }
          >
            <Shield
              size={16}
              strokeWidth={2}
            />

            <span>
              PF Report
            </span>
          </NavLink>

          {/* =================================================
              ESI REPORT
          ================================================== */}

          <NavLink
            to="esi"
            onClick={() =>
              setActiveReport("esi")
            }
            className={() =>
              `
                flex
                h-9
                min-w-[120px]
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                px-4
                text-sm
                font-medium
                shadow-sm
                transition
                ${
                  activeReport === "esi"
                    ? "border-[#c99b8e] bg-white text-[#8b5e52]"
                    : "border-[#dddddd] bg-white text-[#555555]"
                }
              `
            }
          >
            <Plus
              size={16}
              strokeWidth={2}
            />

            <span>
              ESI Report
            </span>
          </NavLink>

          {/* =================================================
              LWF REPORT
          ================================================== */}

          <NavLink
            to="lwf"
            onClick={() =>
              setActiveReport("lwf")
            }
            className={() =>
              `
                flex
                h-9
                min-w-[120px]
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                px-4
                text-sm
                font-medium
                shadow-sm
                transition
                ${
                  activeReport === "lwf"
                    ? "border-[#c99b8e] bg-white text-[#8b5e52]"
                    : "border-[#dddddd] bg-white text-[#555555]"
                }
              `
            }
          >
            <Users
              size={16}
              strokeWidth={2}
            />

            <span>
              LWF Report
            </span>
          </NavLink>

          {/* =================================================
              PT REPORT
          ================================================== */}

          <NavLink
            to="pt"
            onClick={() =>
              setActiveReport("pt")
            }
            className={() =>
              `
                flex
                h-9
                min-w-[120px]
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                px-4
                text-sm
                font-medium
                shadow-sm
                transition
                ${
                  activeReport === "pt"
                    ? "border-[#c99b8e] bg-white text-[#8b5e52]"
                    : "border-[#dddddd] bg-white text-[#555555]"
                }
              `
            }
          >
            <IndianRupee
              size={16}
              strokeWidth={2}
            />

            <span>
              PT Report
            </span>
          </NavLink>
        </div>
      </div>

      {/* =====================================================
          PF REPORT CONTENT
      ====================================================== */}

      {activeReport === "pf" && (
        <>
          {/* PF FOUR CARDS */}

          <div
            className="
              mt-8
              grid
              grid-cols-1
              gap-7
              sm:grid-cols-2
              xl:grid-cols-4
            "
          >
            <PFMonthlyReport />

            <PFECRReport />

            <PFMonthlyForm />

            <PFYearlyForm />
          </div>

          {/* PF REPORT CARD */}

          <div className="mt-7">
            <PFReport />
          </div>
        </>
      )}

      {/* =====================================================
          ESI REPORT CONTENT
      ====================================================== */}

      {activeReport === "esi" && (
        <div
          className="
            mt-8
            grid
            grid-cols-1
            gap-7
            lg:grid-cols-3
          "
        >

          {/* =================================================
              ESI MONTHLY REPORT
          ================================================== */}

          <ReportCard
            title="ESI Monthly Report"
          >
            <ReportRow
              label="Monthly Report"
              onClick={() =>
                handleNavigate(
                  "esi/monthly-report"
                )
              }
            />

            <ReportRow
              label="Supplementary Report"
              onClick={() =>
                handleNavigate(
                  "esi/supplementary-report"
                )
              }
            />
          </ReportCard>

          {/* =================================================
              ESI MONTHLY RETURN
          ================================================== */}

          <ReportCard
            title="ESI Monthly Return"
          >
            <ReportRow
              label="ESI Monthly Return Report"
              onClick={() =>
                handleNavigate(
                  "esi/monthly-return"
                )
              }
            />

            <ReportRow
              label="Return Supplementary Report"
              onClick={() =>
                handleNavigate(
                  "esi/return-supplementary"
                )
              }
            />
          </ReportCard>

          {/* =================================================
              ESI REPORT
          ================================================== */}

          <ReportCard
            title="ESI Report"
          >
            <ReportRow
              label="ESI Acknowledgement"
              onClick={() =>
                handleNavigate(
                  "esi/acknowledgement"
                )
              }
            />

            <ReportRow
              label="ESI Acknowledgement View"
              onClick={() =>
                handleNavigate(
                  "esi/acknowledgement-view"
                )
              }
            />
          </ReportCard>
        </div>
      )}

      {/* =====================================================
          LWF REPORT CONTENT
      ====================================================== */}

      {activeReport === "lwf" && (
        <div
          className="
            mt-8
            grid
            grid-cols-1
            gap-7
            lg:grid-cols-3
          "
        >

          {/* LWF MONTHLY */}

          <ReportCard
            title="LWF Monthly Report"
          >
            <ReportRow
              label="Monthly Report"
              onClick={() =>
                handleNavigate(
                  "lwf/monthly-report"
                )
              }
            />
          </ReportCard>

          {/* LWF REPORT */}

          <ReportCard
            title="LWF Report"
          >
            <ReportRow
              label="LWF Acknowledgement"
              onClick={() =>
                handleNavigate(
                  "lwf/acknowledgement"
                )
              }
            />

            <ReportRow
              label="LWF Acknowledgement View"
              onClick={() =>
                handleNavigate(
                  "lwf/acknowledgement-view"
                )
              }
            />
          </ReportCard>
        </div>
      )}

      {/* =====================================================
          PT REPORT CONTENT
      ====================================================== */}

      {activeReport === "pt" && (
        <div
          className="
            mt-8
            grid
            grid-cols-1
            gap-7
            lg:grid-cols-3
          "
        >

          {/* PT MONTHLY REPORT */}

          <ReportCard
            title="PT Monthly Report"
          >
            <ReportRow
              label="Monthly Report"
              onClick={() =>
                handleNavigate(
                  "pt/monthly-report"
                )
              }
            />
          </ReportCard>

          {/* PT STATUTORY REPORT */}

          <ReportCard
            title="PT Statutory Report"
          >
            <ReportRow
              label="Monthly Statutory Report"
              onClick={() =>
                handleNavigate(
                  "pt/monthly-statutory-report"
                )
              }
            />

            <ReportRow
              label="Half Yearly Statutory Report"
              onClick={() =>
                handleNavigate(
                  "pt/half-yearly-statutory-report"
                )
              }
            />

            <ReportRow
              label="Yearly Statutory Report"
              onClick={() =>
                handleNavigate(
                  "pt/yearly-statutory-report"
                )
              }
            />
          </ReportCard>

          {/* PT REPORT */}

          <ReportCard
            title="PT Report"
          >
            <ReportRow
              label="PT Acknowledgement"
              onClick={() =>
                handleNavigate(
                  "pt/acknowledgement"
                )
              }
            />

            <ReportRow
              label="PT Acknowledgement View"
              onClick={() =>
                handleNavigate(
                  "pt/acknowledgement-view"
                )
              }
            />
          </ReportCard>
        </div>
      )}
    </div>
  );
}
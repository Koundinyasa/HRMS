// import { useState } from "react";
// import {
//   Bookmark,
//   ChevronLeft,
// } from "lucide-react";

// import { REPORT_TABS } from "../constants/generalReport.constants";

// export default function GeneralReportNavbar() {
//   const [activeTab, setActiveTab] =
//     useState("Report Writer");

//   return (
//     <div className="flex min-h-[72px] w-full items-center justify-between gap-4 border-b border-[#e5e7eb] bg-white px-5">

//       {/* TABS */}
//       <div className="flex h-[72px] min-w-0 flex-1 items-center gap-8 overflow-x-auto">

//         {REPORT_TABS.map((tab) => {
//           const isActive = activeTab === tab;

//           return (
//             <button
//               key={tab}
//               type="button"
//               onClick={() => setActiveTab(tab)}
//               className={`relative flex h-[72px] shrink-0 items-center whitespace-nowrap px-1 text-[16px] font-medium transition ${
//                 isActive
//                   ? "text-[#2196df]"
//                   : "text-[#5f6368]"
//               }`}
//             >
//               {tab}

//               {isActive && (
//                 <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#2196df]" />
//               )}
//             </button>
//           );
//         })}

//       </div>


//       {/* RIGHT BUTTONS */}
//       <div className="flex shrink-0 items-center gap-3">

//         <button
//           type="button"
//           className="flex h-[46px] items-center gap-2 rounded-lg bg-[#2196df] px-5 text-[16px] font-semibold text-white shadow-sm hover:bg-[#178bd0]"
//         >
//           <Bookmark size={19} />
//           Save
//         </button>


//         <button
//           type="button"
//           className="flex h-[46px] items-center gap-2 rounded-lg border border-[#c7c7c7] bg-white px-5 text-[16px] font-medium text-[#333] hover:bg-[#f7f7f7]"
//         >
//           <ChevronLeft size={20} />
//           Back
//         </button>

//       </div>

//     </div>
//   );
// }

import { useState } from "react";
import {
  Bookmark,
  ChevronLeft,
} from "lucide-react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { REPORT_TABS } from "../constants/generalReport.constants";

export default function GeneralReportNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] =
    useState("Report Writer");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);

    if (tab === "Report Writer") {
      navigate(
        "/koundinyasatech/admin/insights/general-report"
      );
      return;
    }

    if (tab === "Form Master") {
      navigate(
        "/koundinyasatech/admin/insights/general-report/form_master"
      );
      return;
    }

    if (tab === "Mail Merge") {
      navigate(
        "/koundinyasatech/admin/insights/general-report/mail_merge"
      );
      return;
    }

    if (tab === "Factory Act Forms") {
      navigate(
        "/koundinyasatech/admin/insights/general-report/factory_act_forms"
      );
      return;
    }
  };

  return (
    <div
      className="
        flex
        min-h-[72px]
        w-full
        items-center
        justify-between
        gap-4
        border-b
        border-[#e5e7eb]
        bg-white
        px-5
      "
    >

      {/* =====================================================
          TABS
      ===================================================== */}

      <div
        className="
          flex
          h-[72px]
          min-w-0
          flex-1
          items-center
          gap-8
          overflow-x-auto
        "
      >

        {REPORT_TABS.map((tab) => {

          const isActive =
            location.pathname.includes(
              "form_master"
            )
              ? tab === "Form Master"
              : location.pathname.includes(
                  "mail_merge"
                )
                ? tab === "Mail Merge"
                : location.pathname.includes(
                    "factory_act_forms"
                  )
                  ? tab ===
                    "Factory Act Forms"
                  : tab ===
                    "Report Writer";

          return (
            <button
              key={tab}
              type="button"
              onClick={() =>
                handleTabClick(tab)
              }
              className={`
                relative
                flex
                h-[72px]
                shrink-0
                items-center
                whitespace-nowrap
                px-1
                text-[16px]
                font-medium
                transition

                ${
                  isActive
                    ? "text-[#2196df]"
                    : "text-[#5f6368]"
                }
              `}
            >
              {tab}

              {isActive && (
                <span
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    h-[3px]
                    bg-[#2196df]
                  "
                />
              )}
            </button>
          );
        })}

      </div>


      {/* =====================================================
          RIGHT BUTTONS
      ===================================================== */}

      <div
        className="
          flex
          shrink-0
          items-center
          gap-3
        "
      >

        {/* SAVE */}

        <button
          type="button"
          className="
            flex
            h-[46px]
            items-center
            gap-2
            rounded-lg
            bg-[#2196df]
            px-5
            text-[16px]
            font-semibold
            text-white
            shadow-sm
            hover:bg-[#178bd0]
          "
        >
          <Bookmark size={19} />

          Save
        </button>


        {/* BACK */}

        <button
          type="button"
          className="
            flex
            h-[46px]
            items-center
            gap-2
            rounded-lg
            border
            border-[#c7c7c7]
            bg-white
            px-5
            text-[16px]
            font-medium
            text-[#333]
            hover:bg-[#f7f7f7]
          "
        >
          <ChevronLeft size={20} />

          Back
        </button>

      </div>

    </div>
  );
}
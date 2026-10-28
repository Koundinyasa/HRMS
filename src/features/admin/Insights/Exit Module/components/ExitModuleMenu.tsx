// // import { NavLink, useParams } from "react-router-dom";

// // /**
// //  * The vertical menu shown at .../insights/exit-module (before any specific
// //  * report is opened): Exit Module Report / Relieving Letter / Experience letter.
// //  */
// // export default function ExitModuleMenu() {
// //   const { domain } = useParams();
// //   const base = `/${domain}/admin/insights/exit-module`;

// //   const items = [
// //     { label: "Exit Module Report", path: `${base}/report` },
// //     { label: "Relieving Letter", path: `${base}/relieving-letter` },
// //     { label: "Experience letter", path: `${base}/experience-letter` },
// //   ];

// //   return (
// //     <div className="w-full max-w-sm overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
// //       {items.map((item, index) => (
// //         <NavLink
// //           key={item.path}
// //           to={item.path}
// //           className={({ isActive }) =>
// //             `block px-5 py-3 text-sm transition-colors ${
// //               index === 0
// //                 ? "bg-gray-100 font-semibold text-gray-900"
// //                 : "text-gray-700 hover:text-[#2F6FED]"
// //             } ${isActive ? "text-[#2F6FED]" : ""}`
// //           }
// //         >
// //           {item.label}
// //         </NavLink>
// //       ))}
// //     </div>
// //   );
// // }

// import { useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import {
//   ChevronRight,
//   FileText,
//   SquareArrowOutUpRight,
//   Filter,
// } from "lucide-react";

// import AuditLogModal from "./AuditLogModal";

// export default function ExitModuleMenu() {
//   const { domain } = useParams();

//   const [auditLogOpen, setAuditLogOpen] = useState(false);

//   const base = `/${domain}/admin/insights/exit-module`;

//   const reportItem = {
//     label: "Exit Module Report",
//     path: `${base}/report`,
//   };

//   const letterItems = [
//     {
//       label: "Relieving Letter",
//       description:
//         "Generate and access standard Relieving Letters for employees.",
//       path: `${base}/relieving-letter`,
//     },
//     {
//       label: "Experience Letter",
//       description:
//         "Retrieve work experience credentials and custom templates.",
//       path: `${base}/experience-letter`,
//     },
//   ];

//   return (
//     <>
//       <div className="w-full space-y-4">

//         {/* =========================================================
//             EXIT MODULE REPORT ROW
//            ========================================================= */}
//         <div
//           className="
//             flex
//             w-full
//             items-center
//             justify-between
//             rounded-[22px]
//             border
//             border-[#E9C9BC]
//             bg-[#FFF8F5]
//             px-6
//             py-4
//           "
//         >
//           {/* Exit Module Report Button */}
//           <Link
//             to={reportItem.path}
//             className="
//               inline-flex
//               items-center
//               gap-3
//               rounded-[15px]
//               border
//               border-[#CDB9B2]
//               bg-white
//               px-7
//               py-3
//               text-[18px]
//               font-semibold
//               text-[#814A3C]
//               shadow-sm
//               transition-colors
//               hover:bg-[#FFF8F5]
//             "
//           >
//             <SquareArrowOutUpRight
//               className="h-6 w-6"
//               strokeWidth={2}
//             />

//             {reportItem.label}
//           </Link>

//           {/* Filter / Audit Log Button */}
//           <button
//             type="button"
//             onClick={() => setAuditLogOpen(true)}
//             aria-label="Open Audit Log"
//             title="Audit Log"
//             className="
//               flex
//               h-10
//               w-10
//               shrink-0
//               items-center
//               justify-center
//               rounded-lg
//               text-[#814A3C]
//               transition-colors
//               hover:bg-[#FDEBE5]
//             "
//           >
//             <Filter
//               className="h-7 w-7"
//               strokeWidth={2.5}
//             />
//           </button>
//         </div>

//         {/* =========================================================
//             RELIEVING LETTER / EXPERIENCE LETTER
//            ========================================================= */}
//         <div className="space-y-3">
//           {letterItems.map((item) => (
//             <Link
//               key={item.path}
//               to={item.path}
//               className="
//                 flex
//                 w-full
//                 items-center
//                 gap-4
//                 rounded-xl
//                 border
//                 border-gray-200
//                 bg-white
//                 px-5
//                 py-4
//                 shadow-sm
//                 transition-colors
//                 hover:border-gray-300
//                 hover:shadow-md
//               "
//             >
//               {/* File Icon */}
//               <span
//                 className="
//                   flex
//                   h-9
//                   w-9
//                   shrink-0
//                   items-center
//                   justify-center
//                   rounded-lg
//                   border
//                   border-[#E9C9BC]
//                   bg-[#FEF3EF]
//                   text-[#8B4A3C]
//                 "
//               >
//                 <FileText
//                   className="h-4 w-4"
//                   strokeWidth={2}
//                 />
//               </span>

//               {/* Letter Details */}
//               <span className="min-w-0 flex-1">
//                 <span className="block text-sm font-semibold text-gray-900">
//                   {item.label}
//                 </span>

//                 <span className="mt-0.5 block truncate text-xs text-gray-500">
//                   {item.description}
//                 </span>
//               </span>

//               {/* Arrow */}
//               <ChevronRight
//                 className="h-4 w-4 shrink-0 text-gray-400"
//               />
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* =========================================================
//           AUDIT LOG MODAL
//          ========================================================= */}
//       <AuditLogModal
//         reportType="exit-report"
//         open={auditLogOpen}
//         onClose={() => setAuditLogOpen(false)}
//       />
//     </>
//   );
// }

import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ChevronRight,
  FileText,
  Filter,
  SquareArrowOutUpRight,
} from "lucide-react";

import AuditLogModal from "./AuditLogModal";

export default function ExitModuleMenu() {
  const { domain } = useParams();

  const [auditLogOpen, setAuditLogOpen] =
    useState(false);

  const base =
    `/${domain}/admin/insights/exit-module`;

  const reportItem = {
    label: "Exit Module Report",
    path: `${base}/report`,
  };

  const letterItems = [
    {
      label: "Relieving Letter",
      description:
        "Generate and access standard Relieving Letters for employees.",
      path: `${base}/relieving-letter`,
    },
    {
      label: "Experience Letter",
      description:
        "Retrieve work experience credentials and custom templates.",
      path: `${base}/experience-letter`,
    },
  ];

  return (
    <>
      <div className="w-full space-y-4">

        {/* =====================================================
            EXIT MODULE REPORT ROW
           ===================================================== */}
        <div
          className="
            flex
            w-full
            min-w-0     
            items-center
            justify-between
            rounded-[22px]
            border
            border-[#E9C9BC]
            bg-[#FFF8F5]
            px-6
            py-4
          "
        >
          {/* Report Button */}
          <Link
            to={reportItem.path}
            className="
              inline-flex
              items-center
              gap-3
              rounded-[15px]
              border
              border-[#CDB9B2]
              bg-white
              px-7
              py-3
              text-[18px]
              font-semibold
              text-[#814A3C]
              shadow-sm
              transition-colors
              hover:bg-[#FFF8F5]
            "
          >
            <SquareArrowOutUpRight
              className="h-6 w-6"
              strokeWidth={2}
            />

            {reportItem.label}
          </Link>

          {/* Filter Icon */}
          <button
            type="button"
            aria-label="Open Audit Log"
            title="Audit Log"
            onClick={() =>
              setAuditLogOpen(true)
            }
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-[#814A3C]
              transition-colors
              hover:bg-[#FDEBE5]
            "
          >
            <Filter
              className="h-7 w-7"
              strokeWidth={2.5}
            />
          </button>
        </div>

        {/* =====================================================
            LETTER CARDS
           ===================================================== */}
        <div className="space-y-3">
          {letterItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="
                flex
                w-full
                items-center
                gap-4
                rounded-xl
                border
                border-gray-200
                bg-white
                px-5
                py-4
                shadow-sm
                transition-colors
                hover:border-gray-300
                hover:shadow-md
              "
            >
              <span
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-[#E9C9BC]
                  bg-[#FEF3EF]
                  text-[#8B4A3C]
                "
              >
                <FileText
                  className="h-4 w-4"
                  strokeWidth={2}
                />
              </span>

              <span className="min-w-0 flex-1">
                <span
                  className="
                    block
                    text-sm
                    font-semibold
                    text-gray-900
                  "
                >
                  {item.label}
                </span>

                <span
                  className="
                    mt-0.5
                    block
                    truncate
                    text-xs
                    text-gray-500
                  "
                >
                  {item.description}
                </span>
              </span>

              <ChevronRight
                className="
                  h-4
                  w-4
                  shrink-0
                  text-gray-400
                "
              />
            </Link>
          ))}
        </div>
      </div>

      {/* =====================================================
          AUDIT LOG
         ===================================================== */}
      <AuditLogModal
        reportType="exit-report"
        open={auditLogOpen}
        onClose={() =>
          setAuditLogOpen(false)
        }
      />
    </>
  );
}
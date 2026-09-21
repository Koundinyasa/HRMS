// import { ChevronRight, FileText } from "lucide-react";
// import { Link } from "react-router-dom";

// import { STATUTORY_REPORT_ROUTES } from "../constants/statutoryReport.constants";

// export default function PFECRReport() {
//   return (
//     <div className="h-[208px] overflow-hidden rounded-xl border border-[#bfc1c3] bg-white shadow-sm">

//       {/* =====================================================
//           HEADER
//       ===================================================== */}

//       <div className="flex h-11 items-center gap-2 border-b border-[#e0e2e4] bg-[#f7f9fa] px-4">

//         <FileText
//           size={16}
//           strokeWidth={2}
//           className="text-[#8b5e52]"
//         />

//         <span className="text-sm font-semibold text-[#8b5e52]">
//           PF ECR Report
//         </span>

//       </div>


//       {/* =====================================================
//           CONTENT
//       ===================================================== */}

//       <div className="px-3 py-2">

//         {/* =================================================
//             SALARY
//         ================================================= */}

//         <Link
//           to="salary"
//           className="
//             flex
//             h-7
//             items-center
//             justify-between
//             text-sm
//             text-[#555555]
//             transition-colors
//             hover:text-[#8b5e52]
//           "
//         >
//           <span>Salary</span>

//           <ChevronRight
//             size={16}
//             strokeWidth={2}
//           />
//         </Link>


//         {/* =================================================
//             ARREAR
//         ================================================= */}

//         <Link
//           to={STATUTORY_REPORT_ROUTES.PF_ECR_ARREAR}
//           className="
//             flex
//             h-7
//             items-center
//             justify-between
//             text-sm
//             text-[#555555]
//             transition-colors
//             hover:text-[#8b5e52]
//           "
//         >
//           <span>Arrear</span>

//           <ChevronRight
//             size={16}
//             strokeWidth={2}
//           />
//         </Link>

//       </div>

//     </div>
//   );
// }


import { ChevronRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export default function PFECRReport() {
  return (
    <div className="h-[208px] overflow-hidden rounded-xl border border-[#bfc1c3] bg-white shadow-sm">
      <div className="flex h-11 items-center gap-2 border-b border-[#e0e2e4] bg-[#f7f9fa] px-4">
        <FileText
          size={16}
          strokeWidth={2}
          className="text-[#8b5e52]"
        />

        <span className="text-sm font-semibold text-[#8b5e52]">
          PF ECR Report
        </span>
      </div>

      <div className="px-3 py-2">
        {/* SALARY */}
        <Link
          to="salary"
          className="flex h-7 items-center justify-between text-sm text-[#555555] transition-colors hover:text-[#8b5e52]"
        >
          <span>Salary</span>

          <ChevronRight
            size={16}
            strokeWidth={2}
          />
        </Link>

        {/* ARREAR */}
        <Link
          to="arrear"
          className="flex h-7 items-center justify-between text-sm text-[#555555] transition-colors hover:text-[#8b5e52]"
        >
          <span>Arrear</span>

          <ChevronRight
            size={16}
            strokeWidth={2}
          />
        </Link>
      </div>
    </div>
  );
}
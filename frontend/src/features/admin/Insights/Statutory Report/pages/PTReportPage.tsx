// import { useNavigate } from "react-router-dom";
// import type { ReactNode } from "react";

// import {
//   FileText,
// } from "lucide-react";
// export default function PTReportPage() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen w-full bg-[#f3f6fb] px-3 py-3 sm:px-4 lg:px-5">

//       {/* =====================================================
//           TOP NAVIGATION TABS
//       ===================================================== */}

//       <div className="mb-3 rounded-md border border-[#e5e8ee] bg-white px-4">

//         <div className="flex min-h-[68px] items-center gap-8 overflow-x-auto">

//           {/* PF REPORT */}

//           <button
//             type="button"
//             onClick={() => navigate("../pf")}
//             className="flex h-[68px] shrink-0 items-center text-[18px] font-medium text-[#454b55]"
//           >
//             <span>PF Report</span>
//           </button>


//           {/* ESI REPORT */}

//           <button
//             type="button"
//             onClick={() => navigate("../esi")}
//             className="flex h-[68px] shrink-0 items-center text-[18px] font-medium text-[#454b55]"
//           >
//             <span>ESI Report</span>
//           </button>


//           {/* LWF REPORT */}

//           <button
//             type="button"
//             onClick={() => navigate("../lwf")}
//             className="flex h-[68px] shrink-0 items-center text-[18px] font-medium text-[#454b55]"
//           >
//             <span>LWF Report</span>
//           </button>


//           {/* PT REPORT - ACTIVE */}

//           <button
//             type="button"
//             className="relative flex h-[68px] shrink-0 items-center text-[18px] font-medium text-[#238ed1]"
//           >
//             <span>PT Report</span>

//             <span className="absolute bottom-[7px] left-0 right-0 h-[3px] rounded-full bg-[#238ed1]" />
//           </button>

//         </div>
//       </div>


//       {/* =====================================================
//           PT REPORT CARDS
//       ===================================================== */}

//       <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

//         {/* ===================================================
//             PT MONTHLY REPORT
//         =================================================== */}

//         <ReportCard title="PT Monthly Report">

//           <ReportItem
//             label="PT Monthly Report"
//             onClick={() => {
//               navigate("monthly-report");
//             }}
//           />

//         </ReportCard>


//         {/* ===================================================
//             PT MONTHLY STATUTORY REPORT
//         =================================================== */}

//         <ReportCard title="PT Monthly Statutory Report">

//           <ReportItem
//             label="PT Monthly Statutory Report"
//             onClick={() => {
//               navigate("monthly-statutory-report");
//             }}
//           />

//           <div className="px-5 pb-4 pt-2 text-[16px] leading-6 text-[#9b8d87]">
//             Monthly Statutory PT Reports are available for
//             Andhra Pradesh, Goa, Gujarat, Karnataka,
//             Maharashtra, Telangana
//           </div>

//         </ReportCard>


//         {/* ===================================================
//             PT HALF YEARLY STATUTORY REPORT
//         =================================================== */}

//         <ReportCard title="PT Half Yearly Statutory Report">

//           <ReportItem
//             label="PT Half Yearly Statutory Report"
//             onClick={() => {
//               navigate("half-yearly-statutory-report");
//             }}
//           />

//           <div className="px-5 pb-4 pt-2 text-[16px] leading-6 text-[#9b8d87]">
//             Half Yearly PT Statutory Reports are available
//             for Tamil Nadu and Kerala
//           </div>

//         </ReportCard>


//         {/* ===================================================
//             PT YEARLY STATUTORY REPORT
//         =================================================== */}

//         <ReportCard title="PT Yearly Statutory Report">

//           <ReportItem
//             label="PT Yearly Statutory Report"
//             onClick={() => {
//               navigate("yearly-statutory-report");
//             }}
//           />

//           <div className="px-5 pb-4 pt-2 text-[16px] leading-6 text-[#9b8d87]">
//             Yearly PT Statutory Reports are available for
//             Goa, Maharashtra, Karnataka, Madhya Pradesh,
//             West Bengal
//           </div>

//         </ReportCard>

//       </div>


//       {/* =====================================================
//           PT REPORT - BOTTOM CARD
//       ===================================================== */}

//       <div className="mt-5 w-full md:max-w-[440px]">

//         <div className="overflow-hidden rounded-md border border-[#e0e4ea] bg-white shadow-sm">

//           {/* CARD HEADER */}

//           <div className="flex h-[64px] items-center gap-3 border-b border-[#e0e4ea] bg-[#e9edf5] px-5">

//             <FileText
//               size={20}
//               strokeWidth={1.8}
//               className="text-[#2d78b8]"
//             />

//             <h2 className="text-[19px] font-semibold text-[#182338]">
//               PT Report
//             </h2>

//           </div>


//           {/* CARD ITEMS */}

//           <div className="bg-white">

//             <button
//               type="button"
//               onClick={() => navigate("acknowledgement")}
//               className="flex h-[55px] w-full items-center justify-between px-5 text-left text-[17px] text-[#4f5560] transition hover:bg-[#f7f9fc]"
//             >
//               <span>PT Acknowledgement</span>

//               <span className="text-[24px] font-light text-[#60646a]">
//                 ›
//               </span>
//             </button>


//             <button
//               type="button"
//               onClick={() => navigate("acknowledgement-view")}
//               className="flex h-[55px] w-full items-center justify-between px-5 text-left text-[17px] text-[#4f5560] transition hover:bg-[#f7f9fc]"
//             >
//               <span>PT Acknowledgement View</span>

//               <span className="text-[24px] font-light text-[#60646a]">
//                 ›
//               </span>
//             </button>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }


// /* ==========================================================
//    REPORT CARD
// ========================================================== */

// interface ReportCardProps {
//   title: string;
//   children: React.ReactNode;
// }

// function ReportCard({
//   title,
//   children,
// }: ReportCardProps) {
//   return (
//     <div className="min-h-[220px] overflow-hidden rounded-md border border-[#e0e4ea] bg-white shadow-sm">

//       {/* HEADER */}

//       <div className="flex min-h-[62px] items-center border-b border-[#e0e4ea] bg-[#e9edf5] px-5">

//         <h2 className="text-[19px] font-semibold text-[#182338]">
//           {title}
//         </h2>

//       </div>

//       {/* CONTENT */}

//       <div className="bg-white">
//         {children}
//       </div>

//     </div>
//   );
// }


// /* ==========================================================
//    REPORT ITEM
// ========================================================== */

// interface ReportItemProps {
//   label: string;
//   onClick?: () => void;
// }

// function ReportItem({
//   label,
//   onClick,
// }: ReportItemProps) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className="flex min-h-[59px] w-full items-center justify-between px-5 text-left text-[17px] text-[#4e5560] transition hover:bg-[#f7f9fc]"
//     >

//       <span>
//         {label}
//       </span>

//       <span className="text-[25px] font-light leading-none text-[#5e6268]">
//         ›
//       </span>

//     </button>
//   );
// }

import { useNavigate } from "react-router-dom";

import {
  FileText,
  Shield,
  Plus,
  UsersRound,
  IndianRupee,
  ChevronRight,
} from "lucide-react";

export default function PTReportPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#f4f7fb] px-4 py-5 sm:px-6">

      {/* =====================================================
          REPORT TABS
      ===================================================== */}

      <div
        className="
          flex
          min-h-[58px]
          w-full
          items-center
          gap-3
          rounded-xl
          border-2
          border-[#e6b8a8]
          bg-[#fffaf8]
          px-3
          py-2
          sm:px-4
        "
      >

        {/* PF REPORT */}

        <button
          type="button"
          onClick={() => navigate("../pf")}
          className="
            flex
            h-[38px]
            items-center
            gap-2
            rounded-xl
            border
            border-[#e2a894]
            bg-white
            px-4
            text-[14px]
            font-medium
            text-[#7c3f2d]
            shadow-sm
            transition
            hover:bg-[#fff5f1]
          "
        >
          <Shield
            size={17}
            strokeWidth={1.8}
          />

          <span>PF Report</span>
        </button>


        {/* ESI REPORT */}

        <button
          type="button"
          onClick={() => navigate("../esi")}
          className="
            flex
            h-[38px]
            items-center
            gap-2
            rounded-xl
            border
            border-[#dedede]
            bg-white
            px-4
            text-[14px]
            font-medium
            text-[#5a5a5a]
            shadow-sm
            transition
            hover:bg-[#fafafa]
          "
        >
          <Plus
            size={17}
            strokeWidth={1.8}
          />

          <span>ESI Report</span>
        </button>


        {/* LWF REPORT */}

        <button
          type="button"
          onClick={() => navigate("../lwf")}
          className="
            flex
            h-[38px]
            items-center
            gap-2
            rounded-xl
            border
            border-[#dedede]
            bg-white
            px-4
            text-[14px]
            font-medium
            text-[#5a5a5a]
            shadow-sm
            transition
            hover:bg-[#fafafa]
          "
        >
          <UsersRound
            size={17}
            strokeWidth={1.8}
          />

          <span>LWF Report</span>
        </button>


        {/* PT REPORT - ACTIVE */}

        <button
          type="button"
          className="
            flex
            h-[38px]
            items-center
            gap-2
            rounded-xl
            border
            border-[#e2a894]
            bg-white
            px-4
            text-[14px]
            font-medium
            text-[#7c3f2d]
            shadow-sm
          "
        >
          <IndianRupee
            size={17}
            strokeWidth={1.8}
          />

          <span>PT Report</span>
        </button>

      </div>


      {/* =====================================================
          PT REPORT CARDS
      ===================================================== */}

      <div
        className="
          mt-8
          grid
          grid-cols-1
          gap-7
          md:grid-cols-2
          xl:grid-cols-4
        "
      >

        {/* ===================================================
            PT MONTHLY REPORT
        =================================================== */}

        <div
          className="
            min-h-[208px]
            overflow-hidden
            rounded-2xl
            border
            border-[#c9cdd1]
            bg-white
            shadow-[0_2px_4px_rgba(0,0,0,0.12)]
          "
        >

          {/* CARD HEADER */}

          <div
            className="
              flex
              h-[45px]
              items-center
              gap-2
              border-b
              border-[#d9dcdf]
              bg-[#f3f5f6]
              px-4
            "
          >

            <FileText
              size={17}
              strokeWidth={1.7}
              className="text-[#a04e36]"
            />

            <h2
              className="
                text-[14px]
                font-semibold
                text-[#8b402b]
              "
            >
              PT Monthly Report
            </h2>

          </div>


          {/* CARD BODY */}

          <button
            type="button"
            onClick={() => navigate("monthly-report")}
            className="
              flex
              w-full
              items-center
              justify-between
              px-4
              py-4
              text-left
              text-[14px]
              text-[#31527a]
              transition
              hover:bg-[#fafafa]
            "
          >

            <span>
              PT Monthly Report
            </span>

            <ChevronRight
              size={18}
              strokeWidth={1.7}
              className="text-[#555]"
            />

          </button>

        </div>


        {/* ===================================================
            PT MONTHLY STATUTORY REPORT
        =================================================== */}

        <div
          className="
            min-h-[208px]
            overflow-hidden
            rounded-2xl
            border
            border-[#c9cdd1]
            bg-white
            shadow-[0_2px_4px_rgba(0,0,0,0.12)]
          "
        >

          {/* CARD HEADER */}

          <div
            className="
              flex
              min-h-[45px]
              items-center
              gap-2
              border-b
              border-[#d9dcdf]
              bg-[#f3f5f6]
              px-4
            "
          >

            <FileText
              size={17}
              strokeWidth={1.7}
              className="text-[#a04e36]"
            />

            <h2
              className="
                text-[14px]
                font-semibold
                text-[#8b402b]
              "
            >
              PT Monthly Statutory Report
            </h2>

          </div>


          {/* REPORT LINK */}

          <button
            type="button"
            onClick={() =>
              navigate("monthly-statutory-report")
            }
            className="
              flex
              w-full
              items-center
              justify-between
              px-4
              pt-4
              text-left
              text-[14px]
              text-[#31527a]
              transition
              hover:bg-[#fafafa]
            "
          >

            <span>
              PT Monthly Statutory Report
            </span>

            <ChevronRight
              size={18}
              strokeWidth={1.7}
              className="text-[#555]"
            />

          </button>


          {/* DESCRIPTION */}

          <p
            className="
              px-4
              pb-4
              pt-4
              text-[13px]
              leading-[21px]
              text-[#a06b5b]
            "
          >
            Monthly Statutory PT Reports are available
            for Andhra Pradesh, Goa, Gujarat, Karnataka,
            Maharashtra, Telangana
          </p>

        </div>


        {/* ===================================================
            PT HALF YEARLY STATUTORY REPORT
        =================================================== */}

        <div
          className="
            min-h-[208px]
            overflow-hidden
            rounded-2xl
            border
            border-[#c9cdd1]
            bg-white
            shadow-[0_2px_4px_rgba(0,0,0,0.12)]
          "
        >

          {/* CARD HEADER */}

          <div
            className="
              flex
              min-h-[45px]
              items-center
              gap-2
              border-b
              border-[#d9dcdf]
              bg-[#f3f5f6]
              px-4
            "
          >

            <FileText
              size={17}
              strokeWidth={1.7}
              className="text-[#a04e36]"
            />

            <h2
              className="
                text-[14px]
                font-semibold
                text-[#8b402b]
              "
            >
              PT Half Yearly Statutory Report
            </h2>

          </div>


          {/* REPORT LINK */}

          <button
            type="button"
            onClick={() =>
              navigate("half-yearly-statutory-report")
            }
            className="
              flex
              w-full
              items-center
              justify-between
              px-4
              pt-4
              text-left
              text-[14px]
              text-[#31527a]
              transition
              hover:bg-[#fafafa]
            "
          >

            <span>
              PT Half Yearly Statutory Report
            </span>

            <ChevronRight
              size={18}
              strokeWidth={1.7}
              className="text-[#555]"
            />

          </button>


          {/* DESCRIPTION */}

          <p
            className="
              px-4
              pb-4
              pt-4
              text-[13px]
              leading-[21px]
              text-[#a06b5b]
            "
          >
            Half Yearly PT Statutory Reports are
            available for Tamil Nadu and Kerala
          </p>

        </div>


        {/* ===================================================
            PT YEARLY STATUTORY REPORT
        =================================================== */}

        <div
          className="
            min-h-[208px]
            overflow-hidden
            rounded-2xl
            border
            border-[#c9cdd1]
            bg-white
            shadow-[0_2px_4px_rgba(0,0,0,0.12)]
          "
        >

          {/* CARD HEADER */}

          <div
            className="
              flex
              min-h-[45px]
              items-center
              gap-2
              border-b
              border-[#d9dcdf]
              bg-[#f3f5f6]
              px-4
            "
          >

            <FileText
              size={17}
              strokeWidth={1.7}
              className="text-[#a04e36]"
            />

            <h2
              className="
                text-[14px]
                font-semibold
                text-[#8b402b]
              "
            >
              PT Yearly Statutory Report
            </h2>

          </div>


          {/* REPORT LINK */}

          <button
            type="button"
            onClick={() =>
              navigate("yearly-statutory-report")
            }
            className="
              flex
              w-full
              items-center
              justify-between
              px-4
              pt-4
              text-left
              text-[14px]
              text-[#31527a]
              transition
              hover:bg-[#fafafa]
            "
          >

            <span>
              PT Yearly Statutory Report
            </span>

            <ChevronRight
              size={18}
              strokeWidth={1.7}
              className="text-[#555]"
            />

          </button>


          {/* DESCRIPTION */}

          <p
            className="
              px-4
              pb-4
              pt-4
              text-[13px]
              leading-[21px]
              text-[#a06b5b]
            "
          >
            Yearly PT Statutory Reports are available
            for Goa, Maharashtra, Karnataka, Madhya
            Pradesh, West Bengal
          </p>

        </div>

      </div>


      {/* =====================================================
          PT REPORT / ACKNOWLEDGEMENT
      ===================================================== */}

      <div className="mt-7">

        <div
          className="
            w-full
            max-w-[320px]
            overflow-hidden
            rounded-2xl
            border
            border-[#c9cdd1]
            bg-white
            shadow-[0_2px_4px_rgba(0,0,0,0.12)]
          "
        >

          {/* HEADER */}

          <div
            className="
              flex
              h-[45px]
              items-center
              gap-2
              border-b
              border-[#d9dcdf]
              bg-[#f3f5f6]
              px-4
            "
          >

            <FileText
              size={17}
              strokeWidth={1.7}
              className="text-[#a04e36]"
            />

            <h2
              className="
                text-[14px]
                font-semibold
                text-[#8b402b]
              "
            >
              PT Report
            </h2>

          </div>


          {/* PT ACKNOWLEDGEMENT */}

          <button
            type="button"
            onClick={() => navigate("acknowledgement")}
            className="
              flex
              w-full
              items-center
              justify-between
              border-b
              border-[#e3e3e3]
              px-4
              py-3
              text-left
              text-[14px]
              text-[#31527a]
              transition
              hover:bg-[#fafafa]
            "
          >

            <span>
              PT Acknowledgement
            </span>

            <ChevronRight
              size={18}
              strokeWidth={1.7}
              className="text-[#555]"
            />

          </button>


          {/* PT ACKNOWLEDGEMENT VIEW */}

          <button
            type="button"
            onClick={() => navigate("acknowledgement-view")}
            className="
              flex
              w-full
              items-center
              justify-between
              px-4
              py-3
              text-left
              text-[14px]
              text-[#31527a]
              transition
              hover:bg-[#fafafa]
            "
          >

            <span>
              PT Acknowledgement View
            </span>

            <ChevronRight
              size={18}
              strokeWidth={1.7}
              className="text-[#555]"
            />

          </button>

        </div>

      </div>

    </div>
  );
}
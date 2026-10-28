// import { useNavigate } from "react-router-dom";
// import {
//   Shield,
//   Plus,
//   Users,
//   IndianRupee,
//   FileText,
//   ChevronRight,
// } from "lucide-react";

// export default function LWFReportPage() {
//   const navigate = useNavigate();

//   // =========================
//   // TOP REPORT NAVIGATION
//   // =========================

//   const handlePFReport = () => {
//     navigate("/insights/statutory-report/pf");
//   };

//   const handleESIReport = () => {
//     navigate("/insights/statutory-report/esi");
//   };

//   const handleLWFReport = () => {
//     navigate("/insights/statutory-report/lwf");
//   };

//   const handlePTReport = () => {
//     navigate("/insights/statutory-report/pt");
//   };

//   // =========================
//   // LWF REPORT NAVIGATION
//   // =========================

//   const handleLWFMonthlyReport = () => {
//     navigate("/insights/statutory-report/lwf/monthly-report");
//   };

//   const handleLWFAcknowledgement = () => {
//     navigate("/insights/statutory-report/lwf/acknowledgement");
//   };

//   const handleLWFAcknowledgementView = () => {
//     navigate("/insights/statutory-report/lwf/acknowledgement-view");
//   };

//   return (
//     <div className="min-h-screen w-full bg-[#f5f7fb] px-5 py-5">
//       <div className="w-full bg-white px-5 py-5">

//         {/* =====================================================
//             TOP REPORT TABS
//         ====================================================== */}

//         <div className="mb-8 rounded-[16px] border-2 border-[#e5b9aa] bg-[#fffaf8] px-3 py-2">
//           <div className="flex flex-wrap items-center gap-4">

//             {/* PF REPORT */}
//             <button
//               type="button"
//               onClick={handlePFReport}
//               className="
//                 flex items-center gap-2
//                 rounded-xl
//                 border border-[#d9d9d9]
//                 bg-white
//                 px-5 py-2.5
//                 text-sm font-medium
//                 text-[#795548]
//                 shadow-sm
//                 transition
//                 hover:bg-gray-50
//               "
//             >
//               <Shield size={17} strokeWidth={1.8} />
//               <span>PF Report</span>
//             </button>

//             {/* ESI REPORT */}
//             <button
//               type="button"
//               onClick={handleESIReport}
//               className="
//                 flex items-center gap-2
//                 rounded-xl
//                 border border-[#d9d9d9]
//                 bg-white
//                 px-5 py-2.5
//                 text-sm font-medium
//                 text-[#795548]
//                 shadow-sm
//                 transition
//                 hover:bg-gray-50
//               "
//             >
//               <Plus size={18} strokeWidth={2} />
//               <span>ESI Report</span>
//             </button>

//             {/* LWF REPORT - ACTIVE */}
//             <button
//               type="button"
//               onClick={handleLWFReport}
//               className="
//                 flex items-center gap-2
//                 rounded-xl
//                 border border-[#1683e8]
//                 bg-white
//                 px-5 py-2.5
//                 text-sm font-medium
//                 text-[#1683e8]
//                 shadow-sm
//               "
//             >
//               <Users size={17} strokeWidth={1.8} />
//               <span>LWF Report</span>
//             </button>

//             {/* PT REPORT */}
//             <button
//               type="button"
//               onClick={handlePTReport}
//               className="
//                 flex items-center gap-2
//                 rounded-xl
//                 border border-[#d9d9d9]
//                 bg-white
//                 px-5 py-2.5
//                 text-sm font-medium
//                 text-[#795548]
//                 shadow-sm
//                 transition
//                 hover:bg-gray-50
//               "
//             >
//               <IndianRupee size={17} strokeWidth={1.8} />
//               <span>PT Report</span>
//             </button>

//           </div>
//         </div>

//         {/* =====================================================
//             LWF REPORT CARD
//         ====================================================== */}

//         <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">

//           {/* LWF REPORT */}
//           <div
//             className="
//               overflow-hidden
//               rounded-[15px]
//               border
//               border-[#c7c7c7]
//               bg-white
//               shadow-sm
//             "
//           >

//             {/* CARD HEADER */}
//             <div
//               className="
//                 flex
//                 items-center
//                 gap-2
//                 border-b
//                 border-[#d8d8d8]
//                 bg-[#f4f6f8]
//                 px-4
//                 py-3
//               "
//             >
//               <FileText
//                 size={17}
//                 strokeWidth={1.8}
//                 className="text-[#8c5b4b]"
//               />

//               <h2 className="text-[15px] font-medium text-[#795548]">
//                 LWF Report
//               </h2>
//             </div>

//             {/* CARD BODY */}
//             <div className="px-3 py-1">

//               {/* LWF MONTHLY REPORT */}
//               <button
//                 type="button"
//                 onClick={handleLWFMonthlyReport}
//                 className="
//                   flex
//                   w-full
//                   items-center
//                   justify-between
//                   px-0
//                   py-3
//                   text-left
//                   text-[14px]
//                   text-[#374151]
//                   transition
//                   hover:text-[#1683e8]
//                 "
//               >
//                 <span>LWF Monthly Report</span>

//                 <ChevronRight
//                   size={18}
//                   strokeWidth={1.8}
//                   className="text-[#666]"
//                 />
//               </button>

//               {/* LWF ACKNOWLEDGEMENT */}
//               <button
//                 type="button"
//                 onClick={handleLWFAcknowledgement}
//                 className="
//                   flex
//                   w-full
//                   items-center
//                   justify-between
//                   px-0
//                   py-3
//                   text-left
//                   text-[14px]
//                   text-[#374151]
//                   transition
//                   hover:text-[#1683e8]
//                 "
//               >
//                 <span>LWF Acknowledgement</span>

//                 <ChevronRight
//                   size={18}
//                   strokeWidth={1.8}
//                   className="text-[#666]"
//                 />
//               </button>

//               {/* LWF ACKNOWLEDGEMENT VIEW */}
//               <button
//                 type="button"
//                 onClick={handleLWFAcknowledgementView}
//                 className="
//                   flex
//                   w-full
//                   items-center
//                   justify-between
//                   px-0
//                   py-3
//                   text-left
//                   text-[14px]
//                   text-[#374151]
//                   transition
//                   hover:text-[#1683e8]
//                 "
//               >
//                 <span>LWF Acknowledgement View</span>

//                 <ChevronRight
//                   size={18}
//                   strokeWidth={1.8}
//                   className="text-[#666]"
//                 />
//               </button>

//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }

import { useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  UsersRound,
  IndianRupee,
  ChevronRight,
  Shield,
} from "lucide-react";

export default function LWFReportPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#f4f7fb] p-3 sm:p-4">

      {/* =====================================================
          REPORT TABS
      ===================================================== */}

      <div
        className="
          w-full
          rounded-xl
          border
          border-[#e0b9aa]
          bg-[#fffaf8]
          px-4
          shadow-[0_1px_4px_rgba(0,0,0,0.06)]
        "
      >
        <div
          className="
            flex
            min-h-[58px]
            items-center
            gap-3
            overflow-x-auto
          "
        >

          {/* PF REPORT */}

          <button
            type="button"
            className="
              flex
              h-[38px]
              shrink-0
              items-center
              gap-2
              rounded-xl
              border
              border-[#ded7d3]
              bg-white
              px-4
              text-[14px]
              font-medium
              text-[#6d3f32]
              shadow-sm
            "
          >
            <Shield size={16} />

            PF Report
          </button>


          {/* ESI REPORT */}

          <button
            type="button"
            className="
              flex
              h-[38px]
              shrink-0
              items-center
              gap-2
              rounded-xl
              border
              border-[#ded7d3]
              bg-white
              px-4
              text-[14px]
              font-medium
              text-[#6d3f32]
              shadow-sm
            "
          >
            <Plus size={17} />

            ESI Report
          </button>


          {/* LWF REPORT - ACTIVE */}

          <button
            type="button"
            className="
              flex
              h-[38px]
              shrink-0
              items-center
              gap-2
              rounded-xl
              border
              border-[#dca996]
              bg-white
              px-4
              text-[14px]
              font-semibold
              text-[#8b4d3b]
              shadow-sm
            "
          >
            <UsersRound size={17} />

            LWF Report
          </button>


          {/* PT REPORT */}

          <button
            type="button"
            className="
              flex
              h-[38px]
              shrink-0
              items-center
              gap-2
              rounded-xl
              border
              border-[#ded7d3]
              bg-white
              px-4
              text-[14px]
              font-medium
              text-[#6d3f32]
              shadow-sm
            "
          >
            <IndianRupee size={17} />

            PT Report
          </button>

        </div>
      </div>


      {/* =====================================================
          LWF REPORT CARD
      ===================================================== */}

      <div
        className="
          mt-7
          w-full
          max-w-[420px]
          overflow-hidden
          rounded-2xl
          border
          border-[#c9c9c9]
          bg-white
          shadow-[0_2px_5px_rgba(0,0,0,0.10)]
        "
      >

        {/* CARD HEADER */}

        <div
          className="
            flex
            h-[49px]
            items-center
            gap-2
            border-b
            border-[#d7d7d7]
            bg-[#f1f3f4]
            px-4
          "
        >
          <FileText
            size={17}
            strokeWidth={1.8}
            className="text-[#9a5b49]"
          />

          <span
            className="
              text-[15px]
              font-semibold
              text-[#7d4638]
            "
          >
            LWF Report
          </span>
        </div>


        {/* LWF MONTHLY REPORT */}

        <button
          type="button"
          onClick={() => navigate("monthly-report")}
          className="
            flex
            h-[45px]
            w-full
            items-center
            justify-between
            border-b
            border-[#e7e7e7]
            px-4
            text-left
            text-[14px]
            font-medium
            text-[#315b84]
            transition
            hover:bg-[#fff8f5]
          "
        >
          <span>
            LWF Monthly Report
          </span>

          <ChevronRight
            size={17}
            className="text-[#8b5a4c]"
          />
        </button>


        {/* LWF ACKNOWLEDGEMENT */}

        <button
          type="button"
          onClick={() => navigate("acknowledgement")}
          className="
            flex
            h-[45px]
            w-full
            items-center
            justify-between
            border-b
            border-[#e7e7e7]
            px-4
            text-left
            text-[14px]
            font-medium
            text-[#315b84]
            transition
            hover:bg-[#fff8f5]
          "
        >
          <span>
            LWF Acknowledgement
          </span>

          <ChevronRight
            size={17}
            className="text-[#8b5a4c]"
          />
        </button>


        {/* LWF ACKNOWLEDGEMENT VIEW */}

        <button
          type="button"
          onClick={() => navigate("acknowledgement-view")}
          className="
            flex
            h-[45px]
            w-full
            items-center
            justify-between
            px-4
            text-left
            text-[14px]
            font-medium
            text-[#315b84]
            transition
            hover:bg-[#fff8f5]
          "
        >
          <span>
            LWF Acknowledgement View
          </span>

          <ChevronRight
            size={17}
            className="text-[#8b5a4c]"
          />
        </button>

      </div>

    </div>
  );
}
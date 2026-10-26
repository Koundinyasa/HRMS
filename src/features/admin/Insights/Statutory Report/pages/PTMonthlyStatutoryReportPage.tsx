// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import {
//   ArrowLeft,
//   ChevronDown,
//   Filter,
//   MoreVertical,
//   Search,
//   X,
//   FileDown,
//   Save,
// } from "lucide-react";

// export default function PTMonthlyStatutoryReportPage() {
//   const navigate = useNavigate();

//   const [month, setMonth] = useState("Sep/2026");
//   const [ptState, setPtState] = useState("");
//   const [ptGroup, setPtGroup] = useState("");

//   /* ==========================================================
//      NAVIGATION
//   ========================================================== */

//   const handleBack = () => {
//     navigate("../pt");
//   };

//   const handlePFReport = () => {
//     navigate("../pf");
//   };

//   const handleESIReport = () => {
//     navigate("../esi");
//   };

//   const handleLWFReport = () => {
//     navigate("../lwf");
//   };

//   const handlePTReport = () => {
//     navigate("../pt");
//   };

//   return (
//     <div className="min-h-screen w-full bg-[#f4f7fb]">

//       {/* ======================================================
//           TOP REPORT TABS
//       ====================================================== */}

//       <div className="px-4 pt-4 sm:px-5">

//         <div
//           className="
//             flex
//             min-h-[58px]
//             w-full
//             items-center
//             gap-3
//             overflow-x-auto
//             rounded-xl
//             border-2
//             border-[#ddb6a8]
//             bg-[#fffaf8]
//             px-3
//             py-2
//           "
//         >

//           {/* PF REPORT */}

//           <button
//             type="button"
//             onClick={handlePFReport}
//             className="
//               flex
//               h-[38px]
//               shrink-0
//               items-center
//               gap-2
//               rounded-xl
//               border
//               border-[#ddb3a3]
//               bg-white
//               px-4
//               text-[14px]
//               font-medium
//               text-[#754536]
//               shadow-sm
//             "
//           >
//             <span className="text-[16px]">
//               ♧
//             </span>

//             <span>
//               PF Report
//             </span>
//           </button>


//           {/* ESI REPORT */}

//           <button
//             type="button"
//             onClick={handleESIReport}
//             className="
//               flex
//               h-[38px]
//               shrink-0
//               items-center
//               gap-2
//               rounded-xl
//               border
//               border-[#ded9d6]
//               bg-white
//               px-4
//               text-[14px]
//               font-medium
//               text-[#754536]
//               shadow-sm
//             "
//           >
//             <span className="text-[18px]">
//               +
//             </span>

//             <span>
//               ESI Report
//             </span>
//           </button>


//           {/* LWF REPORT */}

//           <button
//             type="button"
//             onClick={handleLWFReport}
//             className="
//               flex
//               h-[38px]
//               shrink-0
//               items-center
//               gap-2
//               rounded-xl
//               border
//               border-[#ded9d6]
//               bg-white
//               px-4
//               text-[14px]
//               font-medium
//               text-[#754536]
//               shadow-sm
//             "
//           >
//             <span className="text-[17px]">
//               ♧
//             </span>

//             <span>
//               LWF Report
//             </span>
//           </button>


//           {/* PT REPORT - ACTIVE */}

//           <button
//             type="button"
//             onClick={handlePTReport}
//             className="
//               flex
//               h-[38px]
//               shrink-0
//               items-center
//               gap-2
//               rounded-xl
//               border
//               border-[#d9a996]
//               bg-white
//               px-4
//               text-[14px]
//               font-medium
//               text-[#754536]
//               shadow-sm
//             "
//           >
//             <span className="text-[16px]">
//               ₹
//             </span>

//             <span>
//               PT Report
//             </span>
//           </button>


//           {/* RIGHT FILTER ICON */}

//           <div className="ml-auto flex shrink-0 items-center px-2">
//             <Filter
//               size={21}
//               strokeWidth={1.8}
//               className="text-[#8e8b89]"
//             />
//           </div>

//         </div>

//       </div>


//       {/* ======================================================
//           REPORT HEADER
//       ====================================================== */}

//       <div className="px-4 pt-3 sm:px-5">

//         <div
//           className="
//             flex
//             min-h-[62px]
//             w-full
//             flex-wrap
//             items-center
//             gap-2
//             rounded-xl
//             border
//             border-[#d9dde2]
//             bg-white
//             px-4
//             shadow-sm
//           "
//         >

//           {/* TITLE */}

//           <div className="mr-auto">

//             <div
//               className="
//                 border-b-[3px]
//                 border-[#168ed2]
//                 pb-[9px]
//                 pt-[5px]
//               "
//             >

//               <h1
//                 className="
//                   text-[17px]
//                   font-semibold
//                   text-[#168ed2]
//                 "
//               >
//                 PT Monthly Statutory Report
//               </h1>

//             </div>

//           </div>


//           {/* BACK */}

//           <button
//             type="button"
//             onClick={handleBack}
//             className="
//               flex
//               h-[42px]
//               items-center
//               gap-2
//               rounded-lg
//               border
//               border-[#d5d1ce]
//               bg-white
//               px-4
//               text-[14px]
//               font-medium
//               text-[#625d59]
//               shadow-sm
//             "
//           >

//             <ArrowLeft
//               size={19}
//               strokeWidth={1.8}
//             />

//             <span>
//               Back
//             </span>

//           </button>


//           {/* MONTH */}

//           <div className="relative w-[155px] shrink-0">

//             <select
//               value={month}
//               onChange={(event) =>
//                 setMonth(event.target.value)
//               }
//               className="
//                 h-[42px]
//                 w-full
//                 appearance-none
//                 rounded-lg
//                 border
//                 border-[#dedbd8]
//                 bg-[#f5f6f9]
//                 px-3
//                 pr-9
//                 text-[14px]
//                 text-[#514f4d]
//                 outline-none
//               "
//             >
//               <option value="Sep/2026">
//                 Sep/2026
//               </option>

//               <option value="Aug/2026">
//                 Aug/2026
//               </option>

//               <option value="Jul/2026">
//                 Jul/2026
//               </option>

//               <option value="Jun/2026">
//                 Jun/2026
//               </option>
//             </select>

//             <ChevronDown
//               size={15}
//               className="
//                 pointer-events-none
//                 absolute
//                 right-3
//                 top-1/2
//                 -translate-y-1/2
//                 text-[#77716d]
//               "
//             />

//           </div>


//           {/* PT STATE */}

//           <div className="relative w-[175px] shrink-0">

//             <select
//               value={ptState}
//               onChange={(event) =>
//                 setPtState(event.target.value)
//               }
//               className="
//                 h-[42px]
//                 w-full
//                 appearance-none
//                 rounded-lg
//                 border
//                 border-[#dedbd8]
//                 bg-[#f5f6f9]
//                 px-3
//                 pr-9
//                 text-[14px]
//                 text-[#514f4d]
//                 outline-none
//               "
//             >

//               <option value="">
//                 Select PT state
//               </option>

//               <option value="Andhra Pradesh">
//                 Andhra Pradesh
//               </option>

//               <option value="Goa">
//                 Goa
//               </option>

//               <option value="Gujarat">
//                 Gujarat
//               </option>

//               <option value="Karnataka">
//                 Karnataka
//               </option>

//               <option value="Maharashtra">
//                 Maharashtra
//               </option>

//               <option value="Telangana">
//                 Telangana
//               </option>

//             </select>

//             <ChevronDown
//               size={15}
//               className="
//                 pointer-events-none
//                 absolute
//                 right-3
//                 top-1/2
//                 -translate-y-1/2
//                 text-[#77716d]
//               "
//             />

//           </div>


//           {/* PT GROUP */}

//           <div className="relative w-[175px] shrink-0">

//             <select
//               value={ptGroup}
//               onChange={(event) =>
//                 setPtGroup(event.target.value)
//               }
//               className="
//                 h-[42px]
//                 w-full
//                 appearance-none
//                 rounded-lg
//                 border
//                 border-[#dedbd8]
//                 bg-[#f5f6f9]
//                 px-3
//                 pr-9
//                 text-[14px]
//                 text-[#514f4d]
//                 outline-none
//               "
//             >

//               <option value="">
//                 Select PT Group
//               </option>

//               <option value="Group 1">
//                 Group 1
//               </option>

//               <option value="Group 2">
//                 Group 2
//               </option>

//               <option value="Group 3">
//                 Group 3
//               </option>

//             </select>

//             <ChevronDown
//               size={15}
//               className="
//                 pointer-events-none
//                 absolute
//                 right-3
//                 top-1/2
//                 -translate-y-1/2
//                 text-[#77716d]
//               "
//             />

//           </div>


//           {/* PDF */}

//           <button
//             type="button"
//             title="PDF"
//             className="
//               flex
//               h-[42px]
//               w-[38px]
//               shrink-0
//               items-center
//               justify-center
//               text-[#d43f3f]
//             "
//           >
//             <FileDown
//               size={21}
//               strokeWidth={1.8}
//             />
//           </button>

//         </div>

//       </div>


//       {/* ======================================================
//           FILTER BAR
//       ====================================================== */}

//       <div className="px-4 pt-2 sm:px-5">

//         <div
//           className="
//             flex
//             min-h-[54px]
//             w-full
//             flex-wrap
//             items-center
//             gap-5
//             rounded-xl
//             border
//             border-[#d9dde2]
//             bg-white
//             px-4
//             shadow-sm
//           "
//         >

//           {/* SEARCH */}

//           <div
//             className="
//               flex
//               min-w-[180px]
//               flex-1
//               items-center
//               gap-2
//             "
//           >

//             <Search
//               size={20}
//               strokeWidth={1.8}
//               className="text-[#9a9a9a]"
//             />

//             <span
//               className="
//                 text-[14px]
//                 text-[#b4b1ae]
//               "
//             >
//               Start Typing...
//             </span>

//           </div>


//           {/* ADD FILTER */}

//           <button
//             type="button"
//             className="
//               flex
//               shrink-0
//               items-center
//               gap-2
//               text-[14px]
//               font-medium
//               text-[#625e5a]
//             "
//           >

//             <span className="text-[21px]">
//               +
//             </span>

//             <span>
//               Add Filter
//             </span>

//           </button>


//           {/* QUERY */}

//           <StaticFilter label="Query" />


//           {/* BRANCH */}

//           <StaticFilter label="Branch" />


//           {/* SALARY STRUCTURE */}

//           <StaticFilter label="Salary Structure" />


//           {/* LEAVE */}

//           <StaticFilter label="Leave" />


//           {/* ATTENDANCE */}

//           <StaticFilter label="Attendance" />


//           {/* DESIGNATION */}

//           <StaticFilter label="Designation" />


//           {/* EMP STATUS */}

//           <StaticFilter label="Emp Status" />


//           {/* MORE */}

//           <button
//             type="button"
//             className="
//               flex
//               h-[32px]
//               w-[25px]
//               shrink-0
//               items-center
//               justify-center
//               text-[#8d8884]
//             "
//           >
//             <MoreVertical size={19} />
//           </button>


//           {/* CLOSE */}

//           <button
//             type="button"
//             className="
//               flex
//               h-[32px]
//               w-[25px]
//               shrink-0
//               items-center
//               justify-center
//               text-[#d14b43]
//             "
//           >
//             <X size={20} />
//           </button>

//         </div>

//       </div>


//       {/* ======================================================
//           EMPTY REPORT ACTION BAR
//       ====================================================== */}

//       <div className="px-4 pt-2 sm:px-5">

//         <div
//           className="
//             flex
//             min-h-[72px]
//             w-full
//             items-center
//             justify-end
//             gap-3
//             rounded-xl
//             border
//             border-[#e0e3e7]
//             bg-white
//             px-4
//             shadow-sm
//           "
//         >

//           {/* AUTO FILL */}

//           <button
//             type="button"
//             className="
//               flex
//               h-[48px]
//               items-center
//               justify-center
//               rounded-lg
//               bg-[#2097df]
//               px-5
//               text-[15px]
//               font-semibold
//               text-white
//               shadow-sm
//             "
//           >
//             Auto-Fill
//           </button>


//           {/* SAVE */}

//           <button
//             type="button"
//             className="
//               flex
//               h-[48px]
//               items-center
//               gap-2
//               rounded-lg
//               bg-[#e3e5e8]
//               px-5
//               text-[15px]
//               font-medium
//               text-[#a4a7ab]
//             "
//           >

//             <Save size={17} />

//             <span>
//               Save
//             </span>

//           </button>

//         </div>

//       </div>


//       {/* ======================================================
//           EMPTY STATE
//       ====================================================== */}

//       <div
//         className="
//           flex
//           min-h-[470px]
//           w-full
//           items-center
//           justify-center
//           px-4
//           sm:px-5
//         "
//       >

//         <div
//           className="
//             flex
//             flex-col
//             items-center
//             justify-center
//             pb-16
//             text-center
//           "
//         >

//           {/* EMPTY ILLUSTRATION */}

//           <div
//             className="
//               relative
//               mb-4
//               flex
//               h-[175px]
//               w-[300px]
//               items-center
//               justify-center
//             "
//           >

//             {/* BACKGROUND CIRCLES */}

//             <div
//               className="
//                 absolute
//                 left-[40px]
//                 top-[30px]
//                 h-[35px]
//                 w-[35px]
//                 rounded-full
//                 border
//                 border-[#e4e8f0]
//               "
//             />

//             <div
//               className="
//                 absolute
//                 right-[45px]
//                 top-[55px]
//                 h-[28px]
//                 w-[28px]
//                 rounded-full
//                 border
//                 border-[#e4e8f0]
//               "
//             />

//             <div
//               className="
//                 absolute
//                 bottom-[20px]
//                 left-[70px]
//                 h-[25px]
//                 w-[25px]
//                 rounded-full
//                 border
//                 border-[#e4e8f0]
//               "
//             />

//             {/* SCREEN */}

//             <div
//               className="
//                 absolute
//                 left-1/2
//                 top-[35px]
//                 h-[105px]
//                 w-[145px]
//                 -translate-x-1/2
//                 rounded-md
//                 border
//                 border-[#dfe4ee]
//                 bg-white
//                 shadow-sm
//               "
//             >

//               <div
//                 className="
//                   h-[12px]
//                   rounded-t-md
//                   bg-[#b4b7ef]
//                 "
//               />

//               <div className="p-4">

//                 <div
//                   className="
//                     mx-auto
//                     mb-2
//                     flex
//                     h-[45px]
//                     w-[38px]
//                     items-center
//                     justify-center
//                     rounded-md
//                     bg-[#c7caf3]
//                   "
//                 >

//                   <div
//                     className="
//                       h-[23px]
//                       w-[19px]
//                       rounded-sm
//                       border-2
//                       border-[#7f83cf]
//                     "
//                   />

//                 </div>

//                 <div
//                   className="
//                     mx-auto
//                     h-[6px]
//                     w-[58px]
//                     rounded
//                     bg-[#dfe2ee]
//                   "
//                 />

//               </div>

//             </div>


//             {/* SIMPLE PERSON */}

//             <div
//               className="
//                 absolute
//                 bottom-[14px]
//                 right-[62px]
//               "
//             >

//               <div
//                 className="
//                   mx-auto
//                   h-[24px]
//                   w-[24px]
//                   rounded-full
//                   bg-[#e8b66e]
//                 "
//               />

//               <div
//                 className="
//                   mt-1
//                   h-[28px]
//                   w-[52px]
//                   rounded-t-[25px]
//                   bg-[#1e2f72]
//                 "
//               />

//             </div>

//           </div>


//           {/* EMPTY MESSAGE */}

//           <h2
//             className="
//               text-[17px]
//               font-medium
//               text-[#4c4d50]
//             "
//           >
//             Did Not Find Any PT Report
//           </h2>

//         </div>

//       </div>

//     </div>
//   );
// }


// /* ==========================================================
//    STATIC FILTER
// ========================================================== */

// interface StaticFilterProps {
//   label: string;
// }

// function StaticFilter({
//   label,
// }: StaticFilterProps) {
//   return (
//     <div
//       className="
//         flex
//         shrink-0
//         items-center
//         gap-1
//         text-[14px]
//         font-medium
//         text-[#625e5a]
//       "
//     >

//       <span>
//         {label}
//       </span>

//       <ChevronDown
//         size={14}
//         className="text-[#77716d]"
//       />

//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ChevronDown,
  Filter,
  MoreVertical,
  Search,
  X,
  FileDown,
  Save,
} from "lucide-react";

export default function PTMonthlyStatutoryReportPage() {
  const navigate = useNavigate();

  const [month, setMonth] = useState("Sep/2026");
  const [ptState, setPtState] = useState("");
  const [ptGroup, setPtGroup] = useState("");

  /* ==========================================================
     NAVIGATION
  ========================================================== */

  const handleBack = () => {
    navigate("../pt");
  };

  const handlePFReport = () => {
    navigate("../pf");
  };

  const handleESIReport = () => {
    navigate("../esi");
  };

  const handleLWFReport = () => {
    navigate("../lwf");
  };

  const handlePTReport = () => {
    navigate("../pt");
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f7fb]">

      {/* ======================================================
          TOP REPORT TABS
      ====================================================== */}

      <div className="px-4 pt-4 sm:px-5">

        <div
          className="
            flex
            min-h-[58px]
            w-full
            items-center
            gap-3
            overflow-x-auto
            rounded-xl
            border-2
            border-[#ddb6a8]
            bg-[#fffaf8]
            px-3
            py-2
          "
        >

          {/* PF REPORT */}

          <button
            type="button"
            onClick={handlePFReport}
            className="
              flex
              h-[38px]
              shrink-0
              items-center
              gap-2
              rounded-xl
              border
              border-[#ddb3a3]
              bg-white
              px-4
              text-[14px]
              font-medium
              text-[#754536]
              shadow-sm
            "
          >
            <span className="text-[16px]">
              ♧
            </span>

            <span>
              PF Report
            </span>
          </button>


          {/* ESI REPORT */}

          <button
            type="button"
            onClick={handleESIReport}
            className="
              flex
              h-[38px]
              shrink-0
              items-center
              gap-2
              rounded-xl
              border
              border-[#ded9d6]
              bg-white
              px-4
              text-[14px]
              font-medium
              text-[#754536]
              shadow-sm
            "
          >
            <span className="text-[18px]">
              +
            </span>

            <span>
              ESI Report
            </span>
          </button>


          {/* LWF REPORT */}

          <button
            type="button"
            onClick={handleLWFReport}
            className="
              flex
              h-[38px]
              shrink-0
              items-center
              gap-2
              rounded-xl
              border
              border-[#ded9d6]
              bg-white
              px-4
              text-[14px]
              font-medium
              text-[#754536]
              shadow-sm
            "
          >
            <span className="text-[17px]">
              ♧
            </span>

            <span>
              LWF Report
            </span>
          </button>


          {/* PT REPORT - ACTIVE */}

          <button
            type="button"
            onClick={handlePTReport}
            className="
              flex
              h-[38px]
              shrink-0
              items-center
              gap-2
              rounded-xl
              border
              border-[#c98f7c]
              bg-white
              px-4
              text-[14px]
              font-medium
              text-[#754536]
              shadow-sm
            "
          >
            <span className="text-[16px]">
              ₹
            </span>

            <span>
              PT Report
            </span>
          </button>


          {/* RIGHT FILTER ICON */}

          <div className="ml-auto flex shrink-0 items-center px-2">
            <Filter
              size={21}
              strokeWidth={1.8}
              className="text-[#8e8b89]"
            />
          </div>

        </div>

      </div>


      {/* ======================================================
          REPORT HEADER
      ====================================================== */}

      <div className="px-4 pt-3 sm:px-5">

        <div
          className="
            flex
            min-h-[62px]
            w-full
            flex-wrap
            items-center
            gap-2
            rounded-xl
            border
            border-[#d9dde2]
            bg-white
            px-4
            shadow-sm
          "
        >

          {/* TITLE */}

          <div className="mr-auto">

            <div
              className="
                border-b-[3px]
                border-[#9a5a46]
                pb-[9px]
                pt-[5px]
              "
            >

              <h1
                className="
                  text-[17px]
                  font-semibold
                  text-[#9a5a46]
                "
              >
                PT Monthly Statutory Report
              </h1>

            </div>

          </div>


          {/* BACK */}

          <button
            type="button"
            onClick={handleBack}
            className="
              flex
              h-[42px]
              items-center
              gap-2
              rounded-lg
              border
              border-[#d5d1ce]
              bg-white
              px-4
              text-[14px]
              font-medium
              text-[#625d59]
              shadow-sm
            "
          >

            <ArrowLeft
              size={19}
              strokeWidth={1.8}
            />

            <span>
              Back
            </span>

          </button>


          {/* MONTH */}

          <div className="relative w-[155px] shrink-0">

            <select
              value={month}
              onChange={(event) =>
                setMonth(event.target.value)
              }
              className="
                h-[42px]
                w-full
                appearance-none
                rounded-lg
                border
                border-[#dedbd8]
                bg-[#f5f6f9]
                px-3
                pr-9
                text-[14px]
                text-[#514f4d]
                outline-none
              "
            >
              <option value="Sep/2026">
                Sep/2026
              </option>

              <option value="Aug/2026">
                Aug/2026
              </option>

              <option value="Jul/2026">
                Jul/2026
              </option>

              <option value="Jun/2026">
                Jun/2026
              </option>
            </select>

            <ChevronDown
              size={15}
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-[#77716d]
              "
            />

          </div>


          {/* PT STATE */}

          <div className="relative w-[175px] shrink-0">

            <select
              value={ptState}
              onChange={(event) =>
                setPtState(event.target.value)
              }
              className="
                h-[42px]
                w-full
                appearance-none
                rounded-lg
                border
                border-[#dedbd8]
                bg-[#f5f6f9]
                px-3
                pr-9
                text-[14px]
                text-[#514f4d]
                outline-none
              "
            >

              <option value="">
                Select PT state
              </option>

              <option value="Andhra Pradesh">
                Andhra Pradesh
              </option>

              <option value="Goa">
                Goa
              </option>

              <option value="Gujarat">
                Gujarat
              </option>

              <option value="Karnataka">
                Karnataka
              </option>

              <option value="Maharashtra">
                Maharashtra
              </option>

              <option value="Telangana">
                Telangana
              </option>

            </select>

            <ChevronDown
              size={15}
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-[#77716d]
              "
            />

          </div>


          {/* PT GROUP */}

          <div className="relative w-[175px] shrink-0">

            <select
              value={ptGroup}
              onChange={(event) =>
                setPtGroup(event.target.value)
              }
              className="
                h-[42px]
                w-full
                appearance-none
                rounded-lg
                border
                border-[#dedbd8]
                bg-[#f5f6f9]
                px-3
                pr-9
                text-[14px]
                text-[#514f4d]
                outline-none
              "
            >

              <option value="">
                Select PT Group
              </option>

              <option value="Group 1">
                Group 1
              </option>

              <option value="Group 2">
                Group 2
              </option>

              <option value="Group 3">
                Group 3
              </option>

            </select>

            <ChevronDown
              size={15}
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-[#77716d]
              "
            />

          </div>


          {/* PDF */}

          <button
            type="button"
            title="PDF"
            className="
              flex
              h-[42px]
              w-[38px]
              shrink-0
              items-center
              justify-center
              text-[#d43f3f]
            "
          >
            <FileDown
              size={21}
              strokeWidth={1.8}
            />
          </button>

        </div>

      </div>


      {/* ======================================================
          FILTER BAR
      ====================================================== */}

      <div className="px-4 pt-2 sm:px-5">

        <div
          className="
            flex
            min-h-[54px]
            w-full
            flex-wrap
            items-center
            gap-5
            rounded-xl
            border
            border-[#d9dde2]
            bg-white
            px-4
            shadow-sm
          "
        >

          {/* SEARCH */}

          <div
            className="
              flex
              min-w-[180px]
              flex-1
              items-center
              gap-2
            "
          >

            <Search
              size={20}
              strokeWidth={1.8}
              className="text-[#9a9a9a]"
            />

            <span
              className="
                text-[14px]
                text-[#b4b1ae]
              "
            >
              Start Typing...
            </span>

          </div>


          {/* ADD FILTER */}

          <button
            type="button"
            className="
              flex
              shrink-0
              items-center
              gap-2
              text-[14px]
              font-medium
              text-[#625e5a]
            "
          >

            <span className="text-[21px]">
              +
            </span>

            <span>
              Add Filter
            </span>

          </button>


          {/* QUERY */}

          <StaticFilter label="Query" />


          {/* BRANCH */}

          <StaticFilter label="Branch" />


          {/* SALARY STRUCTURE */}

          <StaticFilter label="Salary Structure" />


          {/* LEAVE */}

          <StaticFilter label="Leave" />


          {/* ATTENDANCE */}

          <StaticFilter label="Attendance" />


          {/* DESIGNATION */}

          <StaticFilter label="Designation" />


          {/* EMP STATUS */}

          <StaticFilter label="Emp Status" />


          {/* MORE */}

          <button
            type="button"
            className="
              flex
              h-[32px]
              w-[25px]
              shrink-0
              items-center
              justify-center
              text-[#8d8884]
            "
          >
            <MoreVertical size={19} />
          </button>


          {/* CLOSE */}

          <button
            type="button"
            className="
              flex
              h-[32px]
              w-[25px]
              shrink-0
              items-center
              justify-center
              text-[#d14b43]
            "
          >
            <X size={20} />
          </button>

        </div>

      </div>


      {/* ======================================================
          EMPTY REPORT ACTION BAR
      ====================================================== */}

      <div className="px-4 pt-2 sm:px-5">

        <div
          className="
            flex
            min-h-[72px]
            w-full
            items-center
            justify-end
            gap-3
            rounded-xl
            border
            border-[#e0e3e7]
            bg-white
            px-4
            shadow-sm
          "
        >

          {/* AUTO FILL */}

          <button
            type="button"
            className="
              flex
              h-[48px]
              items-center
              justify-center
              rounded-lg
              bg-[#a45f49]
              px-5
              text-[15px]
              font-semibold
              text-white
              shadow-sm
            "
          >
            Auto-Fill
          </button>


          {/* SAVE */}

          <button
            type="button"
            className="
              flex
              h-[48px]
              items-center
              gap-2
              rounded-lg
              bg-[#e3e5e8]
              px-5
              text-[15px]
              font-medium
              text-[#a4a7ab]
            "
          >

            <Save size={17} />

            <span>
              Save
            </span>

          </button>

        </div>

      </div>


      {/* ======================================================
          EMPTY STATE
      ====================================================== */}

      <div
        className="
          flex
          min-h-[470px]
          w-full
          items-center
          justify-center
          px-4
          sm:px-5
        "
      >

        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            pb-16
            text-center
          "
        >

          {/* EMPTY ILLUSTRATION */}

          <div
            className="
              relative
              mb-4
              flex
              h-[175px]
              w-[300px]
              items-center
              justify-center
            "
          >

            {/* BACKGROUND CIRCLES */}

            <div
              className="
                absolute
                left-[40px]
                top-[30px]
                h-[35px]
                w-[35px]
                rounded-full
                border
                border-[#e4e8f0]
              "
            />

            <div
              className="
                absolute
                right-[45px]
                top-[55px]
                h-[28px]
                w-[28px]
                rounded-full
                border
                border-[#e4e8f0]
              "
            />

            <div
              className="
                absolute
                bottom-[20px]
                left-[70px]
                h-[25px]
                w-[25px]
                rounded-full
                border
                border-[#e4e8f0]
              "
            />

            {/* SCREEN */}

            <div
              className="
                absolute
                left-1/2
                top-[35px]
                h-[105px]
                w-[145px]
                -translate-x-1/2
                rounded-md
                border
                border-[#dfe4ee]
                bg-white
                shadow-sm
              "
            >

              <div
                className="
                  h-[12px]
                  rounded-t-md
                  bg-[#b4b7ef]
                "
              />

              <div className="p-4">

                <div
                  className="
                    mx-auto
                    mb-2
                    flex
                    h-[45px]
                    w-[38px]
                    items-center
                    justify-center
                    rounded-md
                    bg-[#c7caf3]
                  "
                >

                  <div
                    className="
                      h-[23px]
                      w-[19px]
                      rounded-sm
                      border-2
                      border-[#7f83cf]
                    "
                  />

                </div>

                <div
                  className="
                    mx-auto
                    h-[6px]
                    w-[58px]
                    rounded
                    bg-[#dfe2ee]
                  "
                />

              </div>

            </div>


            {/* SIMPLE PERSON */}

            <div
              className="
                absolute
                bottom-[14px]
                right-[62px]
              "
            >

              <div
                className="
                  mx-auto
                  h-[24px]
                  w-[24px]
                  rounded-full
                  bg-[#e8b66e]
                "
              />

              <div
                className="
                  mt-1
                  h-[28px]
                  w-[52px]
                  rounded-t-[25px]
                  bg-[#1e2f72]
                "
              />

            </div>

          </div>


          {/* EMPTY MESSAGE */}

          <h2
            className="
              text-[17px]
              font-medium
              text-[#4c4d50]
            "
          >
            Did Not Find Any PT Report
          </h2>

        </div>

      </div>

    </div>
  );
}


/* ==========================================================
   STATIC FILTER
========================================================== */

interface StaticFilterProps {
  label: string;
}

function StaticFilter({
  label,
}: StaticFilterProps) {
  return (
    <div
      className="
        flex
        shrink-0
        items-center
        gap-1
        text-[14px]
        font-medium
        text-[#625e5a]
      "
    >

      <span>
        {label}
      </span>

      <ChevronDown
        size={14}
        className="text-[#77716d]"
      />

    </div>
  );
}
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   ChevronDown,
//   Clock3,
//   FileDown,
//   FileSpreadsheet,
//   Filter,
//   MoreVertical,
//   Plus,
//   Search,
//   UsersRound,
//   Shield,
//   IndianRupee,
//   X,
// } from "lucide-react";

// export default function LWFMonthlyReportPage() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen w-full bg-[#f4f7fb] p-3 sm:p-4">

//       {/* =====================================================
//           TOP REPORT NAVIGATION
//       ===================================================== */}

//       <div
//         className="
//           w-full
//           rounded-xl
//           border
//           border-[#e0b9aa]
//           bg-[#fffaf8]
//           px-4
//           shadow-[0_1px_4px_rgba(0,0,0,0.06)]
//         "
//       >
//         <div
//           className="
//             flex
//             min-h-[58px]
//             items-center
//             gap-3
//             overflow-x-auto
//           "
//         >

//           {/* PF */}

//           <button
//             type="button"
//             className="
//               flex
//               h-[38px]
//               shrink-0
//               items-center
//               gap-2
//               rounded-xl
//               border
//               border-[#ded7d3]
//               bg-white
//               px-4
//               text-[14px]
//               font-medium
//               text-[#6d3f32]
//               shadow-sm
//             "
//           >
//             <Shield size={16} />

//             PF Report
//           </button>


//           {/* ESI */}

//           <button
//             type="button"
//             className="
//               flex
//               h-[38px]
//               shrink-0
//               items-center
//               gap-2
//               rounded-xl
//               border
//               border-[#ded7d3]
//               bg-white
//               px-4
//               text-[14px]
//               font-medium
//               text-[#6d3f32]
//               shadow-sm
//             "
//           >
//             <Plus size={17} />

//             ESI Report
//           </button>


//           {/* LWF ACTIVE */}

//           <button
//             type="button"
//             className="
//               flex
//               h-[38px]
//               shrink-0
//               items-center
//               gap-2
//               rounded-xl
//               border
//               border-[#dca996]
//               bg-white
//               px-4
//               text-[14px]
//               font-semibold
//               text-[#8b4d3b]
//               shadow-sm
//             "
//           >
//             <UsersRound size={17} />

//             LWF Report
//           </button>


//           {/* PT */}

//           <button
//             type="button"
//             className="
//               flex
//               h-[38px]
//               shrink-0
//               items-center
//               gap-2
//               rounded-xl
//               border
//               border-[#ded7d3]
//               bg-white
//               px-4
//               text-[14px]
//               font-medium
//               text-[#6d3f32]
//               shadow-sm
//             "
//           >
//             <IndianRupee size={17} />

//             PT Report
//           </button>


//           {/* RIGHT SIDE */}

//           <div className="ml-auto flex items-center gap-5">

//             <Filter
//               size={20}
//               strokeWidth={1.8}
//               className="text-[#8b5a4c]"
//             />

//             <Clock3
//               size={20}
//               strokeWidth={1.8}
//               className="text-[#8b5a4c]"
//             />

//           </div>

//         </div>
//       </div>


//       {/* =====================================================
//           REPORT HEADER
//       ===================================================== */}

//       <div
//         className="
//           mt-3
//           w-full
//           rounded-xl
//           border
//           border-[#ddd7d3]
//           bg-white
//           shadow-[0_1px_5px_rgba(0,0,0,0.07)]
//         "
//       >

//         <div
//           className="
//             flex
//             min-h-[67px]
//             flex-wrap
//             items-center
//             gap-3
//             px-4
//           "
//         >

//           {/* TITLE */}

//           <div className="shrink-0">

//             <h1
//               className="
//                 border-b-[3px]
//                 border-[#c89584]
//                 pb-2
//                 text-[17px]
//                 font-semibold
//                 text-[#8b4d3b]
//               "
//             >
//               LWF Monthly Report
//             </h1>

//           </div>


//           {/* HEADER CONTROLS */}

//           <div
//             className="
//               ml-auto
//               flex
//               flex-wrap
//               items-center
//               gap-3
//             "
//           >

//             {/* BACK */}

//             <button
//               type="button"
//               onClick={() => navigate("../lwf")}
//               className="
//                 flex
//                 h-[47px]
//                 items-center
//                 gap-2
//                 rounded-lg
//                 border
//                 border-[#d2ccc8]
//                 bg-white
//                 px-5
//                 text-[15px]
//                 font-medium
//                 text-[#555555]
//                 shadow-sm
//                 hover:bg-[#fff8f5]
//               "
//             >
//               <ArrowLeft size={18} />

//               Back
//             </button>


//             {/* MONTH */}

//             <button
//               type="button"
//               className="
//                 flex
//                 h-[47px]
//                 min-w-[175px]
//                 items-center
//                 justify-between
//                 rounded-lg
//                 border
//                 border-[#ddd7d3]
//                 bg-[#f3f5f9]
//                 px-4
//                 text-[14px]
//                 font-medium
//                 text-[#555555]
//               "
//             >
//               <span>Sep/2026</span>

//               <ChevronDown size={16} />
//             </button>


//             {/* LWF GROUP */}

//             <button
//               type="button"
//               className="
//                 flex
//                 h-[47px]
//                 min-w-[210px]
//                 items-center
//                 justify-between
//                 rounded-lg
//                 border
//                 border-[#ddd7d3]
//                 bg-white
//                 px-4
//                 text-[14px]
//                 font-medium
//                 text-[#555555]
//               "
//             >
//               <span>
//                 Select LWF Group
//               </span>

//               <ChevronDown size={16} />
//             </button>


//             {/* ADVANCE FILTER */}

//             <button
//               type="button"
//               className="
//                 flex
//                 h-[47px]
//                 items-center
//                 gap-2
//                 rounded-lg
//                 bg-[#8b5a4c]
//                 px-5
//                 text-[14px]
//                 font-semibold
//                 text-white
//                 shadow-sm
//               "
//             >
//               <Filter size={17} />

//               Advance Filter
//             </button>


//             {/* PDF */}

//             <button
//               type="button"
//               className="
//                 flex
//                 h-[42px]
//                 w-[40px]
//                 items-center
//                 justify-center
//               "
//             >
//               <FileDown
//                 size={20}
//                 className="text-[#c44747]"
//               />
//             </button>


//             {/* EXCEL */}

//             <button
//               type="button"
//               className="
//                 flex
//                 h-[42px]
//                 w-[40px]
//                 items-center
//                 justify-center
//               "
//             >
//               <FileSpreadsheet
//                 size={21}
//                 className="text-[#478b52]"
//               />
//             </button>


//             {/* CLOCK */}

//             <Clock3
//               size={21}
//               className="text-[#8b5a4c]"
//             />

//           </div>

//         </div>

//       </div>


//       {/* =====================================================
//           FILTER BAR
//       ===================================================== */}

//       <div
//         className="
//           mt-2
//           w-full
//           rounded-xl
//           border
//           border-[#ddd7d3]
//           bg-white
//           shadow-[0_1px_5px_rgba(0,0,0,0.07)]
//         "
//       >

//         <div
//           className="
//             flex
//             min-h-[55px]
//             items-center
//             gap-5
//             overflow-x-auto
//             px-4
//           "
//         >

//           {/* SEARCH */}

//           <div
//             className="
//               flex
//               min-w-[260px]
//               flex-1
//               items-center
//               gap-3
//             "
//           >

//             <Search
//               size={20}
//               className="text-[#8b5a4c]"
//             />

//             <span
//               className="
//                 text-[14px]
//                 text-[#aaa5a2]
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
//               whitespace-nowrap
//               text-[14px]
//               font-medium
//               text-[#555555]
//             "
//           >
//             <Plus size={18} />

//             Add Filter
//           </button>


//           <FilterOption label="Query" />

//           <FilterOption label="Branch" />

//           <FilterOption label="Salary Structure" />

//           <FilterOption label="Leave" />

//           <FilterOption label="Attendance" />

//           <FilterOption label="Designation" />

//           <FilterOption label="Emp Status" />


//           {/* MORE */}

//           <button
//             type="button"
//             className="
//               flex
//               h-8
//               w-8
//               shrink-0
//               items-center
//               justify-center
//               text-[#777777]
//             "
//           >
//             <MoreVertical size={19} />
//           </button>


//           {/* CLOSE */}

//           <button
//             type="button"
//             className="
//               flex
//               h-8
//               w-8
//               shrink-0
//               items-center
//               justify-center
//               text-[#b85d4d]
//             "
//           >
//             <X size={21} />
//           </button>

//         </div>

//       </div>


//       {/* =====================================================
//           EMPTY REPORT AREA
//       ===================================================== */}

//       <div
//         className="
//           min-h-[570px]
//           w-full
//           bg-[#f4f7fb]
//         "
//       />

//     </div>
//   );
// }


// /* ============================================================
//    FILTER OPTION
// ============================================================ */

// function FilterOption({
//   label,
// }: {
//   label: string;
// }) {
//   return (
//     <button
//       type="button"
//       className="
//         flex
//         shrink-0
//         items-center
//         gap-1.5
//         whitespace-nowrap
//         text-[14px]
//         font-medium
//         text-[#555555]
//       "
//     >
//       {label}

//       <ChevronDown
//         size={15}
//         strokeWidth={1.8}
//         className="text-[#777777]"
//       />
//     </button>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ChevronDown,
  Clock3,
  FileDown,
  FileSpreadsheet,
  Filter,
  MoreVertical,
  Plus,
  Search,
  UsersRound,
  Shield,
  IndianRupee,
  X,
  ListFilter,
} from "lucide-react";

export default function LWFMonthlyReportPage() {
  const navigate = useNavigate();

  /* =====================================================
     LWF GROUP DROPDOWN
  ===================================================== */

  const [lwfGroupOpen, setLwfGroupOpen] = useState(false);
  const [selectedLwfGroup, setSelectedLwfGroup] = useState(false);

  const lwfGroupRef = useRef<HTMLDivElement>(null);

  /* =====================================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ===================================================== */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        lwfGroupRef.current &&
        !lwfGroupRef.current.contains(event.target as Node)
      ) {
        setLwfGroupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =====================================================
     CLEAR LWF GROUP
  ===================================================== */

  const handleClearLwfGroup = () => {
    setSelectedLwfGroup(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f7fb] p-3 sm:p-4">

      {/* =====================================================
          TOP REPORT NAVIGATION
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


          {/* RIGHT SIDE ICONS */}

          <div className="ml-auto flex shrink-0 items-center gap-5">

            <Filter
              size={20}
              strokeWidth={1.8}
              className="text-[#8b5a4c]"
            />

            <Clock3
              size={20}
              strokeWidth={1.8}
              className="text-[#8b5a4c]"
            />

          </div>

        </div>
      </div>


      {/* =====================================================
          REPORT HEADER
      ===================================================== */}

      <div
        className="
          mt-3
          w-full
          rounded-xl
          border
          border-[#ddd7d3]
          bg-white
          shadow-[0_1px_5px_rgba(0,0,0,0.07)]
        "
      >

        <div
          className="
            flex
            min-h-[67px]
            flex-wrap
            items-center
            gap-3
            px-4
          "
        >

          {/* TITLE */}

          <div className="shrink-0">

            <h1
              className="
                border-b-[3px]
                border-[#c89584]
                pb-2
                text-[17px]
                font-semibold
                text-[#8b4d3b]
              "
            >
              LWF Monthly Report
            </h1>

          </div>


          {/* HEADER CONTROLS */}

          <div
            className="
              ml-auto
              flex
              flex-wrap
              items-center
              gap-3
            "
          >

            {/* BACK */}

            <button
              type="button"
              onClick={() => navigate("../lwf")}
              className="
                flex
                h-[47px]
                items-center
                gap-2
                rounded-lg
                border
                border-[#d2ccc8]
                bg-white
                px-5
                text-[15px]
                font-medium
                text-[#555555]
                shadow-sm
                hover:bg-[#fff8f5]
              "
            >
              <ArrowLeft size={18} />

              Back
            </button>


            {/* MONTH */}

            <button
              type="button"
              className="
                flex
                h-[47px]
                min-w-[175px]
                items-center
                justify-between
                rounded-lg
                border
                border-[#ddd7d3]
                bg-[#f3f5f9]
                px-4
                text-[14px]
                font-medium
                text-[#555555]
              "
            >
              <span>Sep/2026</span>

              <ChevronDown size={16} />
            </button>


            {/* =================================================
                LWF GROUP DROPDOWN
            ================================================= */}

            <div
              ref={lwfGroupRef}
              className="relative"
            >

              {/* SELECT LWF GROUP BUTTON */}

              <button
                type="button"
                onClick={() =>
                  setLwfGroupOpen((previous) => !previous)
                }
                className={`
                  flex
                  h-[47px]
                  min-w-[210px]
                  items-center
                  justify-between
                  rounded-lg
                  border
                  bg-white
                  px-4
                  text-[14px]
                  font-medium
                  shadow-sm
                  transition
                  ${
                    lwfGroupOpen
                      ? "border-[#008cff] ring-1 ring-[#008cff]"
                      : "border-[#ddd7d3]"
                  }
                `}
              >

                <span
                  className={
                    selectedLwfGroup
                      ? "text-[#333333]"
                      : "text-[#555555]"
                  }
                >
                  {selectedLwfGroup
                    ? "Default LWF"
                    : "Select LWF Group"}
                </span>

                <ChevronDown
                  size={16}
                  className={`
                    transition-transform
                    ${
                      lwfGroupOpen
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />

              </button>


              {/* =================================================
                  DROPDOWN PANEL
              ================================================= */}

              {lwfGroupOpen && (
                <div
                  className="
                    absolute
                    right-0
                    top-[53px]
                    z-50
                    w-[220px]
                    rounded-sm
                    bg-white
                    p-4
                    shadow-[0_4px_14px_rgba(0,0,0,0.16)]
                  "
                >

                  {/* DEFAULT LWF */}

                  <label
                    className="
                      flex
                      cursor-pointer
                      items-center
                      gap-4
                      px-2
                      py-2
                      text-[15px]
                      text-[#333333]
                    "
                  >

                    <input
                      type="checkbox"
                      checked={selectedLwfGroup}
                      onChange={(event) =>
                        setSelectedLwfGroup(
                          event.target.checked
                        )
                      }
                      className="
                        h-[19px]
                        w-[19px]
                        cursor-pointer
                        appearance-none
                        rounded-[3px]
                        border
                        border-[#777777]
                        checked:border-[#8b5a4c]
                        checked:bg-[#8b5a4c]
                      "
                    />

                    <span>
                      Default LWF
                    </span>

                  </label>


                  {/* CLEAR BUTTON */}

                  <button
                    type="button"
                    onClick={handleClearLwfGroup}
                    className="
                      mt-3
                      flex
                      h-[49px]
                      w-full
                      items-center
                      justify-center
                      gap-3
                      rounded-lg
                      border
                      border-[#cfcfcf]
                      bg-white
                      text-[15px]
                      font-medium
                      text-[#777777]
                      hover:bg-[#fafafa]
                    "
                  >

                    <ListFilter
                      size={18}
                      strokeWidth={1.8}
                    />

                    Clear

                  </button>

                </div>
              )}

            </div>


            {/* ADVANCE FILTER */}

            <button
              type="button"
              className="
                flex
                h-[47px]
                items-center
                gap-2
                rounded-lg
                bg-[#8b5a4c]
                px-5
                text-[14px]
                font-semibold
                text-white
                shadow-sm
              "
            >
              <Filter size={17} />

              Advance Filter
            </button>


            {/* PDF */}

            <button
              type="button"
              className="
                flex
                h-[42px]
                w-[40px]
                items-center
                justify-center
              "
            >
              <FileDown
                size={20}
                className="text-[#c44747]"
              />
            </button>


            {/* EXCEL */}

            <button
              type="button"
              className="
                flex
                h-[42px]
                w-[40px]
                items-center
                justify-center
              "
            >
              <FileSpreadsheet
                size={21}
                className="text-[#478b52]"
              />
            </button>


            {/* CLOCK */}

            <Clock3
              size={21}
              className="text-[#8b5a4c]"
            />

          </div>

        </div>

      </div>


      {/* =====================================================
          FILTER BAR
      ===================================================== */}

      <div
        className="
          mt-2
          w-full
          rounded-xl
          border
          border-[#ddd7d3]
          bg-white
          shadow-[0_1px_5px_rgba(0,0,0,0.07)]
        "
      >

        <div
          className="
            flex
            min-h-[55px]
            items-center
            gap-5
            overflow-x-auto
            px-4
          "
        >

          {/* SEARCH */}

          <div
            className="
              flex
              min-w-[260px]
              flex-1
              items-center
              gap-3
            "
          >

            <Search
              size={20}
              className="text-[#8b5a4c]"
            />

            <span
              className="
                text-[14px]
                text-[#aaa5a2]
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
              whitespace-nowrap
              text-[14px]
              font-medium
              text-[#555555]
            "
          >
            <Plus size={18} />

            Add Filter
          </button>


          {/* FILTER OPTIONS */}

          <FilterOption label="Query" />

          <FilterOption label="Branch" />

          <FilterOption label="Salary Structure" />

          <FilterOption label="Leave" />

          <FilterOption label="Attendance" />

          <FilterOption label="Designation" />

          <FilterOption label="Emp Status" />


          {/* MORE */}

          <button
            type="button"
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              text-[#777777]
            "
          >
            <MoreVertical size={19} />
          </button>


          {/* CLOSE */}

          <button
            type="button"
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              text-[#b85d4d]
            "
          >
            <X size={21} />
          </button>

        </div>

      </div>


      {/* =====================================================
          EMPTY REPORT AREA
      ===================================================== */}

      <div
        className="
          min-h-[570px]
          w-full
          bg-[#f4f7fb]
        "
      />

    </div>
  );
}


/* ============================================================
   FILTER OPTION
============================================================ */

function FilterOption({
  label,
}: {
  label: string;
}) {
  return (
    <button
      type="button"
      className="
        flex
        shrink-0
        items-center
        gap-1.5
        whitespace-nowrap
        text-[14px]
        font-medium
        text-[#555555]
      "
    >
      {label}

      <ChevronDown
        size={15}
        strokeWidth={1.8}
        className="text-[#777777]"
      />
    </button>
  );
}
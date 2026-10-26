// import {
//   useRef,
//   useState,
// } from "react";

// import {
//   ChevronRight,
//   Search,
// } from "lucide-react";

// import {
//   EMPLOYEE_FIELDS,
//   FIELD_TABS,
//   FIELDS_BY_TAB,
// } from "../constants/generalReport.constants";


// export default function FieldSelector() {

//   /* =====================================================
//      ACTIVE TAB
//   ===================================================== */

//   const [activeTab, setActiveTab] =
//     useState("Employee Details");


//   /* =====================================================
//      SEARCH
//   ===================================================== */

//   const [search, setSearch] =
//     useState("");


//   /* =====================================================
//      SELECTED FIELDS
//   ===================================================== */

//   const [selectedFields, setSelectedFields] =
//     useState<string[]>([
//       "Ref No.",
//       "Employee name",
//     ]);


//   /* =====================================================
//      TAB SCROLL REF
//   ===================================================== */

//   const tabsRef =
//     useRef<HTMLDivElement>(null);


//   /* =====================================================
//      SCROLL TAB ROW TO RIGHT
//   ===================================================== */

//   const scrollTabsRight = () => {

//     if (!tabsRef.current) {
//       return;
//     }

//     tabsRef.current.scrollBy({
//       left: 180,
//       behavior: "smooth",
//     });

//   };


//   /* =====================================================
//      CURRENT TAB FIELDS
//   ===================================================== */

//   const currentTabFields =
//     FIELDS_BY_TAB[activeTab] ??
//     EMPLOYEE_FIELDS;


//   /* =====================================================
//      SEARCH FILTER
//   ===================================================== */

//   const filteredFields =
//     currentTabFields.filter(
//       (field) =>
//         field
//           .toLowerCase()
//           .includes(
//             search.toLowerCase()
//           )
//     );


//   /* =====================================================
//      TOGGLE FIELD
//   ===================================================== */

//   const toggleField = (
//     field: string
//   ) => {

//     setSelectedFields(
//       (previous) => {

//         if (
//           previous.includes(field)
//         ) {

//           return previous.filter(
//             (item) =>
//               item !== field
//           );

//         }

//         return [
//           ...previous,
//           field,
//         ];

//       }
//     );

//   };


//   return (

//     <div
//       className="
//         w-full
//         min-w-0
//         max-w-full
//         overflow-x-hidden
//         px-3
//         pb-4
//         sm:px-5
//       "
//     >

//       {/* =====================================================
//           FIELD TAB NAVIGATION
//       ===================================================== */}

//       <div
//         className="
//           flex
//           h-[44px]
//           w-full
//           min-w-0
//           max-w-full
//           items-center
//           overflow-hidden
//           rounded-[8px]
//           border
//           border-[#e1e5e9]
//           bg-white
//         "
//       >

//         {/* =================================================
//             TAB LIST
//         ================================================= */}

//         <div
//           ref={tabsRef}
//           className="
//             field-tabs-scroll
//             flex
//             min-w-0
//             flex-1
//             items-center
//             overflow-x-auto
//             overflow-y-hidden
//           "
//           style={{
//             scrollbarWidth: "none",
//             msOverflowStyle: "none",
//           }}
//         >

//           {FIELD_TABS.map(
//             (tab) => {

//               const isActive =
//                 activeTab === tab;

//               return (

//                 <button
//                   key={tab}
//                   type="button"
//                   onClick={() => {

//                     setActiveTab(
//                       tab
//                     );

//                     setSearch("");

//                   }}
//                   className={`
//                     relative
//                     flex
//                     h-[43px]
//                     shrink-0
//                     items-center
//                     justify-center
//                     whitespace-nowrap
//                     px-3
//                     text-[11px]
//                     font-medium
//                     sm:px-4
//                     sm:text-[12px]
//                     font-medium
//                     outline-none
//                     transition-all

//                     ${
//                       isActive
//                         ? `
//                           border-b-[2px]
//                           border-[#a86655]
//                           bg-[#fffaf8]
//                           text-[#9b5f50]
//                         `
//                         : `
//                           border-b-[2px]
//                           border-transparent
//                           bg-white
//                           text-[#333333]
//                           hover:bg-[#fffaf8]
//                           hover:text-[#9b5f50]
//                         `
//                     }
//                   `}
//                 >

//                   {tab}

//                 </button>

//               );

//             }
//           )}

//         </div>


//         {/* =================================================
//             RIGHT ARROW
//         ================================================= */}

//         <button
//           type="button"
//           aria-label="Show more tabs"
//           onClick={
//             scrollTabsRight
//           }
//           className="
//             flex
//             h-[37px]
//             w-[35px]
//             shrink-0
//             items-center
//             justify-center
//             border-l
//             border-[#f0f1f2]
//             bg-white
//             text-[#555555]
//             hover:bg-[#fafafa]
//           "
//         >

//           <ChevronRight
//             size={17}
//             strokeWidth={2}
//           />

//         </button>

//       </div>


//       {/* =====================================================
//           SEARCH + SELECTED COLUMNS
//       ===================================================== */}

//       <div
//         className="
//           flex
//           w-full
//           min-w-0
//           flex-col
//           items-stretch
//           gap-2
//           px-3
//           py-3
//           sm:flex-row
//           sm:items-center
//           sm:justify-between
//           sm:px-4
//         "
//       >

//         {/* =================================================
//             SEARCH
//         ================================================= */}

//         <div
//           className="
//             relative
//             w-full
//             min-w-0
//             max-w-full
//             sm:w-[250px]
//             sm:shrink-0
//           "
//         >

//           <Search
//             size={15}
//             className="
//               pointer-events-none
//               absolute
//               left-3
//               top-1/2
//               -translate-y-1/2
//               text-[#89939d]
//             "
//           />

//           <input
//             type="text"
//             value={search}
//             onChange={(event) =>
//               setSearch(
//                 event.target.value
//               )
//             }
//             placeholder="Search..."
//             className="
//               h-[34px]
//               w-full
//               min-w-0
//               rounded-md
//               border
//               border-[#dfe3e8]
//               bg-white
//               pl-9
//               pr-3
//               text-[12px]
//               text-[#4f5965]
//               outline-none
//               placeholder:text-[#b5bdc6]
//               focus:border-[#9a5847]
//             "
//           />

//         </div>


//         {/* =================================================
//             SELECTED COLUMNS
//         ================================================= */}

//         <div
//           className="
//             flex
//             w-full
//             min-w-0
//             items-center
//             gap-2
//             text-[12px]
//             font-medium
//             text-[#333333]
//             sm:w-auto
//             sm:shrink-0
//           "
//         >

//           {/* Brown selected checkbox */}

//           <span
//             className="
//               flex
//               h-[18px]
//               w-[18px]
//               items-center
//               justify-center
//               rounded-[4px]
//               bg-[#8f5142]
//             "
//           >

//             <svg
//               width="12"
//               height="12"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="white"
//               strokeWidth="3"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >

//               <path
//                 d="M5 12l4 4L19 8"
//               />

//             </svg>

//           </span>


//           <span className="min-w-0 truncate">
//             Selected Columns :{" "}
//             {selectedFields.length}
//           </span>

//         </div>

//       </div>


//       {/* =====================================================
//           FIELD LIST

//           REDUCED HEIGHT
//           VERTICAL SCROLLBAR
//           NO HORIZONTAL SCROLLBAR
//       ===================================================== */}

//       <div
//         className="
//           report-fields-scroll
//           h-[250px]
//           min-h-0
//           w-full
//           min-w-0
//           max-w-full
//           overflow-x-hidden
//           overflow-y-auto
//           pr-1
//           sm:h-[255px]
//           lg:h-[215px]
//         "
//       >

//         <div
//           className="
//             grid
//             w-full
//             min-w-0
//             grid-cols-1
//             gap-x-3
//             px-3
//             sm:grid-cols-2
//             lg:grid-cols-3
//           "
//         >

//           {filteredFields.map(
//             (field) => {

//               const checked =
//                 selectedFields.includes(
//                   field
//                 );

//               return (

//                 <label
//                   key={field}
//                   className="
//                     flex
//                     min-h-[30px]
//                     w-full
//                     min-w-0
//                     cursor-pointer
//                     items-center
//                     gap-2
//                     text-[11px]
//                     text-[#4f5965]
//                   "
//                 >

//                   {/* =================================================
//                       CHECKBOX
//                   ================================================= */}

//                   <input
//                     type="checkbox"
//                     checked={checked}
//                     onChange={() =>
//                       toggleField(
//                         field
//                       )
//                     }
//                     className="
//                       h-[15px]
//                       w-[15px]
//                       shrink-0
//                       accent-[#8c4c3c]
//                     "
//                   />


//                   {/* =================================================
//                       FIELD NAME
//                   ================================================= */}

//                   <span
//                     className="
//                       min-w-0
//                       truncate
//                     "
//                   >

//                     {field}

//                   </span>

//                 </label>

//               );

//             }
//           )}


//           {/* =================================================
//               NO SEARCH RESULTS
//           ================================================= */}

//           {filteredFields.length === 0 && (

//             <div
//               className="
//                 col-span-full
//                 py-8
//                 text-center
//                 text-[12px]
//                 text-[#999999]
//               "
//             >

//               No fields found.

//             </div>

//           )}

//         </div>

//       </div>


//       {/* =====================================================
//           SCROLLBAR CSS
//       ===================================================== */}

//       <style>{`

//         /* ================================================
//            TAB ROW
//            HORIZONTAL SCROLLBAR HIDDEN
//         ================================================ */

//         .field-tabs-scroll {
//           scrollbar-width: none;
//           -ms-overflow-style: none;
//         }


//         .field-tabs-scroll::-webkit-scrollbar {
//           width: 0;
//           height: 0;
//           display: none;
//         }


//         /* ================================================
//            FIELD LIST
//            VERTICAL SCROLLBAR
//         ================================================ */

//         .report-fields-scroll {
//           scrollbar-width: thin;
//           scrollbar-color:
//             #a7a7a7
//             transparent;
//         }


//         .report-fields-scroll::-webkit-scrollbar {
//           width: 6px;
//           height: 0;
//         }


//         .report-fields-scroll::-webkit-scrollbar-track {
//           background: transparent;
//         }


//         .report-fields-scroll::-webkit-scrollbar-thumb {
//           background: #a7a7a7;
//           border-radius: 10px;
//         }


//         .report-fields-scroll::-webkit-scrollbar-thumb:hover {
//           background: #8f8f8f;
//         }


//         .report-fields-scroll::-webkit-scrollbar-corner {
//           background: transparent;
//         }


//         /* ================================================
//            HORIZONTAL SCROLLBAR COMPLETELY HIDDEN
//         ================================================ */

//         .report-fields-scroll::-webkit-scrollbar:horizontal {
//           display: none;
//           height: 0;
//         }

//       `}</style>

//     </div>

//   );

// }

import {
  useRef,
  useState,
} from "react";

import {
  ChevronRight,
  Search,
} from "lucide-react";

import {
  EMPLOYEE_FIELDS,
  FIELD_TABS,
  FIELDS_BY_TAB,
} from "../constants/generalReport.constants";


export default function FieldSelector() {

  /* =====================================================
     ACTIVE TAB
  ===================================================== */

  const [activeTab, setActiveTab] =
    useState("Employee Details");


  /* =====================================================
     SEARCH
  ===================================================== */

  const [search, setSearch] =
    useState("");


  /* =====================================================
     SELECTED FIELDS
  ===================================================== */

  const [selectedFields, setSelectedFields] =
    useState<string[]>([
      "Ref No.",
      "Employee name",
    ]);


  /* =====================================================
     TAB SCROLL REF
  ===================================================== */

  const tabsRef =
    useRef<HTMLDivElement>(null);


  /* =====================================================
     SCROLL TAB ROW TO RIGHT
  ===================================================== */

  const scrollTabsRight = () => {

    if (!tabsRef.current) {
      return;
    }

    tabsRef.current.scrollBy({
      left: 180,
      behavior: "smooth",
    });

  };


  /* =====================================================
     CURRENT TAB FIELDS
  ===================================================== */

  const currentTabFields =
    FIELDS_BY_TAB[activeTab] ??
    EMPLOYEE_FIELDS;


  /* =====================================================
     SEARCH FILTER
  ===================================================== */

  const filteredFields =
    currentTabFields.filter(
      (field) =>
        field
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );


  /* =====================================================
     TOGGLE FIELD
  ===================================================== */

  const toggleField = (
    field: string
  ) => {

    setSelectedFields(
      (previous) => {

        if (
          previous.includes(field)
        ) {

          return previous.filter(
            (item) =>
              item !== field
          );

        }

        return [
          ...previous,
          field,
        ];

      }
    );

  };


  return (

    <div
      className="
        w-full
        min-w-0
        max-w-full
        overflow-x-hidden
        px-3
        pb-4
        sm:px-5
      "
    >

      {/* =====================================================
          FIELD TAB NAVIGATION
      ===================================================== */}

      <div
        className="
          flex
          h-[44px]
          w-full
          min-w-0
          max-w-full
          items-center
          overflow-hidden
          rounded-[8px]
          border
          border-[#e1e5e9]
          bg-white
        "
      >

        {/* =================================================
            TAB LIST
        ================================================= */}

        <div
          ref={tabsRef}
          className="
            field-tabs-scroll
            flex
            min-w-0
            flex-1
            items-center
            overflow-x-auto
            overflow-y-hidden
          "
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >

          {FIELD_TABS.map(
            (tab) => {

              const isActive =
                activeTab === tab;

              return (

                <button
                  key={tab}
                  type="button"
                  onClick={() => {

                    setActiveTab(
                      tab
                    );

                    setSearch("");

                  }}
                  className={`
                    relative
                    flex
                    h-[43px]
                    shrink-0
                    items-center
                    justify-center
                    whitespace-nowrap
                    px-3
                    text-[11px]
                    font-medium
                    sm:px-4
                    sm:text-[12px]
                    font-medium
                    outline-none
                    transition-all

                    ${
                      isActive
                        ? `
                          border-b-[2px]
                          border-[#a86655]
                          bg-[#fffaf8]
                          text-[#9b5f50]
                        `
                        : `
                          border-b-[2px]
                          border-transparent
                          bg-white
                          text-[#333333]
                          hover:bg-[#fffaf8]
                          hover:text-[#9b5f50]
                        `
                    }
                  `}
                >

                  {tab}

                </button>

              );

            }
          )}

        </div>


        {/* =================================================
            RIGHT ARROW
        ================================================= */}

        <button
          type="button"
          aria-label="Show more tabs"
          onClick={
            scrollTabsRight
          }
          className="
            flex
            h-[37px]
            w-[35px]
            shrink-0
            items-center
            justify-center
            border-l
            border-[#f0f1f2]
            bg-white
            text-[#555555]
            hover:bg-[#fafafa]
          "
        >

          <ChevronRight
            size={17}
            strokeWidth={2}
          />

        </button>

      </div>


      {/* =====================================================
          SEARCH + SELECTED COLUMNS
      ===================================================== */}

      <div
        className="
          flex
          w-full
          min-w-0
          flex-col
          items-stretch
          gap-2
          px-3
          py-3
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-4
        "
      >

        {/* =================================================
            SEARCH
        ================================================= */}

        <div
          className="
            relative
            w-full
            min-w-0
            max-w-full
            sm:w-[250px]
            sm:shrink-0
          "
        >

          <Search
            size={15}
            className="
              pointer-events-none
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-[#89939d]
            "
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search..."
            className="
              h-[34px]
              w-full
              min-w-0
              rounded-md
              border
              border-[#dfe3e8]
              bg-white
              pl-9
              pr-3
              text-[12px]
              text-[#4f5965]
              outline-none
              placeholder:text-[#b5bdc6]
              focus:border-[#9a5847]
            "
          />

        </div>


        {/* =================================================
            SELECTED COLUMNS
        ================================================= */}

        <div
          className="
            flex
            w-full
            min-w-0
            items-center
            gap-2
            text-[12px]
            font-medium
            text-[#333333]
            sm:w-auto
            sm:shrink-0
          "
        >

          {/* Brown selected checkbox */}

          <span
            className="
              flex
              h-[18px]
              w-[18px]
              items-center
              justify-center
              rounded-[4px]
              bg-[#8f5142]
            "
          >

            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >

              <path
                d="M5 12l4 4L19 8"
              />

            </svg>

          </span>


          <span className="min-w-0 truncate">
            Selected Columns :{" "}
            {selectedFields.length}
          </span>

        </div>

      </div>


      {/* =====================================================
          FIELD LIST

          REDUCED HEIGHT
          VERTICAL SCROLLBAR
          NO HORIZONTAL SCROLLBAR
      ===================================================== */}

      <div
        className="
          report-fields-scroll
          h-[250px]
          min-h-0
          w-full
          min-w-0
          max-w-full
          overflow-x-hidden
          overflow-y-auto
          sm:h-[255px]
          lg:h-[215px]
        "
      >

        <div
          className="
            grid
            w-full
            min-w-0
            grid-cols-1
            gap-x-3
            px-3
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >

          {filteredFields.map(
            (field) => {

              const checked =
                selectedFields.includes(
                  field
                );

              return (

                <label
                  key={field}
                  className="
                    flex
                    min-h-[30px]
                    w-full
                    min-w-0
                    cursor-pointer
                    items-center
                    gap-2
                    text-[11px]
                    text-[#4f5965]
                  "
                >

                  {/* =================================================
                      CHECKBOX
                  ================================================= */}

                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      toggleField(
                        field
                      )
                    }
                    className="
                      h-[15px]
                      w-[15px]
                      shrink-0
                      accent-[#8c4c3c]
                    "
                  />


                  {/* =================================================
                      FIELD NAME
                  ================================================= */}

                  <span
                    className="
                      min-w-0
                      truncate
                    "
                  >

                    {field}

                  </span>

                </label>

              );

            }
          )}


          {/* =================================================
              NO SEARCH RESULTS
          ================================================= */}

          {filteredFields.length === 0 && (

            <div
              className="
                col-span-full
                py-8
                text-center
                text-[12px]
                text-[#999999]
              "
            >

              No fields found.

            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          SCROLLBAR CSS
      ===================================================== */}

      <style>{`

        /* ================================================
           TAB ROW
           HORIZONTAL SCROLLBAR HIDDEN
        ================================================ */

        .field-tabs-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }


        .field-tabs-scroll::-webkit-scrollbar {
          width: 0;
          height: 0;
          display: none;
        }


        /* ================================================
           FIELD LIST
           VERTICAL SCROLLBAR
        ================================================ */

        .report-fields-scroll {
          scrollbar-width: thin;
          scrollbar-color:
            #a7a7a7
            transparent;
        }


        .report-fields-scroll::-webkit-scrollbar {
          width: 6px;
          height: 0;
        }


        .report-fields-scroll::-webkit-scrollbar-track {
          background: transparent;
        }


        .report-fields-scroll::-webkit-scrollbar-thumb {
          background: #a7a7a7;
          border-radius: 10px;
        }


        .report-fields-scroll::-webkit-scrollbar-thumb:hover {
          background: #8f8f8f;
        }


        .report-fields-scroll::-webkit-scrollbar-corner {
          background: transparent;
        }


        /* ================================================
           HORIZONTAL SCROLLBAR COMPLETELY HIDDEN
        ================================================ */

        .report-fields-scroll::-webkit-scrollbar:horizontal {
          display: none;
          height: 0;
        }

      `}</style>

    </div>

  );

}
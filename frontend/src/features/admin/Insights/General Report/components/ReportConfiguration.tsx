// import {
//   useState,
// } from "react";

// import {
//   Plus,
//   X,
//   AlertTriangle,
//   Info,
//   Bookmark,
// } from "lucide-react";

// import FieldSelector from "./FieldSelector";

// const COLUMN_OPTIONS = [
//   "Select Column",
//   "Ref No",
//   "Empname",
//   "Month Name",
// ];

// export default function ReportConfiguration() {
//   const [groupBy, setGroupBy] =
//     useState([
//       "Select Column",
//       "Select Column",
//       "Select Column",
//     ]);

//   const [orderBy, setOrderBy] =
//     useState([
//       "Select Column",
//       "Select Column",
//       "Select Column",
//     ]);

//   /* =====================================================
//      ADD EXPRESSION STATE
//   ===================================================== */

//   const [expressionOpen, setExpressionOpen] =
//     useState(false);

//   const [formulaName, setFormulaName] =
//     useState("");

//   const [expression1, setExpression1] =
//     useState("");


//   /* =====================================================
//      GROUP BY UPDATE
//   ===================================================== */

//   const updateGroupBy = (
//     index: number,
//     value: string
//   ) => {
//     setGroupBy((previous) => {
//       const next = [...previous];

//       next[index] = value;

//       return next;
//     });
//   };


//   /* =====================================================
//      ORDER BY UPDATE
//   ===================================================== */

//   const updateOrderBy = (
//     index: number,
//     value: string
//   ) => {
//     setOrderBy((previous) => {
//       const next = [...previous];

//       next[index] = value;

//       return next;
//     });
//   };


//   /* =====================================================
//      CLOSE EXPRESSION
//   ===================================================== */

//   const closeExpression = () => {
//     setExpressionOpen(false);
//   };


//   /* =====================================================
//      SAVE EXPRESSION
     
//      Existing report functionality is not changed.
//   ===================================================== */

//   const saveExpression = () => {
//     setExpressionOpen(false);
//   };


//   return (
//     <>
//       <div className="w-full min-w-0 bg-white">

//         {/* =====================================================
//             SCROLLBAR STYLES
//         ===================================================== */}

//         <style>{`
//           /* ================================================
//              GROUP / ORDER SCROLLBAR
//           ================================================ */

//           .group-order-scroll {
//             overflow-y: auto;
//             overflow-x: hidden;

//             scrollbar-width: thin;
//             scrollbar-color: #a7a7a7 transparent;
//           }

//           .group-order-scroll::-webkit-scrollbar {
//             width: 6px;
//             height: 0;
//           }

//           .group-order-scroll::-webkit-scrollbar-track {
//             background: transparent;
//           }

//           .group-order-scroll::-webkit-scrollbar-thumb {
//             background: #a7a7a7;
//             border-radius: 10px;
//           }

//           .group-order-scroll::-webkit-scrollbar-corner {
//             background: transparent;
//           }

//           .group-order-scroll::-webkit-scrollbar:horizontal {
//             height: 0;
//           }


//           /* ================================================
//              REPORT CONFIGURATION SCROLLBAR
//           ================================================ */

//           .report-configuration-scroll {
//             overflow-y: auto;
//             overflow-x: hidden;

//             scrollbar-width: thin;
//             scrollbar-color: #a7a7a7 transparent;
//           }

//           .report-configuration-scroll::-webkit-scrollbar {
//             width: 6px;
//             height: 0;
//           }

//           .report-configuration-scroll::-webkit-scrollbar-track {
//             background: transparent;
//           }

//           .report-configuration-scroll::-webkit-scrollbar-thumb {
//             background: #a7a7a7;
//             border-radius: 10px;
//           }

//           .report-configuration-scroll::-webkit-scrollbar-corner {
//             background: transparent;
//           }

//           .report-configuration-scroll::-webkit-scrollbar:horizontal {
//             height: 0;
//           }
//         `}</style>


//         {/* =====================================================
//             ADD FIELDS HEADER
//         ===================================================== */}

//         {/* <div
//           className="
//             flex
//             items-center
//             justify-between
//             gap-3
//             px-5
//             pb-3
//             pt-1
//           "
//         > */}

//         <div
//   className="
//     mt-4
//     flex
//     flex-col
//     items-start
//     justify-between
//     gap-2
//     border-b
//     border-[#e5e7eb]
//     pb-3
//     sm:flex-row
//     sm:items-center
//   "
// >

//           <div
//             className="
//               flex
//               min-w-0
//               items-center
//               gap-2
//             "
//           >

//             <h2
//               className="
//                 shrink-0
//                 text-[13px]
//                 font-semibold
//                 text-[#555]
//               "
//             >
//               Add Fields and Prioritize
//             </h2>

//             <span
//               className="
//                 hidden
//                 text-[11px]
//                 text-[#999]
//                 sm:block
//               "
//             >
//               Select the table columns to display
//             </span>

//           </div>


//           {/* =================================================
//               ADD EXPRESSION
//           ================================================= */}

//           <button
//             type="button"
//             onClick={() =>
//               setExpressionOpen(true)
//             }
//             className="
//               flex
//               shrink-0
//               items-center
//               gap-1
//               text-[12px]
//               font-semibold
//               text-[#955847]
//               transition-colors
//               hover:text-[#7f493b]
//             "
//           >

//             <Plus size={15} />

//             Add Expression

//           </button>

//         </div>


//         {/* =====================================================
//             FIELD SELECTOR
//         ===================================================== */}

//         <FieldSelector />


//         {/* =====================================================
//             GROUP BY / ORDER BY

//             Existing vertical scrollbar retained.
//             Horizontal scrollbar remains removed.
//         ===================================================== */}

//         <div
//           className="
//             group-order-scroll
//             max-h-[100px]
//             overflow-y-auto
//             overflow-x-hidden
//             border-t
//             border-[#e4e8ec]
//             bg-white
//             px-5
//             pb-5
//             pt-3
//           "
//         >

//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-5
//               md:grid-cols-2
//             "
//           >

//             {/* =================================================
//                 GROUP BY
//             ================================================= */}

//             <div
//               className="
//                 min-w-0
//                 w-full
//               "
//             >

//               <h3
//                 className="
//                   mb-2
//                   text-[12px]
//                   font-semibold
//                   text-[#444]
//                 "
//               >
//                 Group By
//               </h3>


//               <select
//                 value={groupBy[0]}
//                 onChange={(event) =>
//                   updateGroupBy(
//                     0,
//                     event.target.value
//                   )
//                 }
//                 className="
//                   block
//                   h-[32px]
//                   w-full
//                   appearance-auto
//                   rounded-md
//                   border
//                   border-[#dfe3e8]
//                   bg-white
//                   px-3
//                   text-[11px]
//                   text-[#9aa4ae]
//                   outline-none
//                   focus:border-[#9a5847]
//                   focus:ring-0
//                 "
//               >

//                 {COLUMN_OPTIONS.map(
//                   (option) => (
//                     <option
//                       key={option}
//                       value={option}
//                     >
//                       {option}
//                     </option>
//                   )
//                 )}

//               </select>

//             </div>


//             {/* =================================================
//                 ORDER BY
//             ================================================= */}

//             <div
//               className="
//                 min-w-0
//                 w-full
//               "
//             >

//               <h3
//                 className="
//                   mb-2
//                   text-[12px]
//                   font-semibold
//                   text-[#444]
//                 "
//               >
//                 Order By
//               </h3>


//               <select
//                 value={orderBy[0]}
//                 onChange={(event) =>
//                   updateOrderBy(
//                     0,
//                     event.target.value
//                   )
//                 }
//                 className="
//                   block
//                   h-[32px]
//                   w-full
//                   appearance-auto
//                   rounded-md
//                   border
//                   border-[#dfe3e8]
//                   bg-white
//                   px-3
//                   text-[11px]
//                   text-[#9aa4ae]
//                   outline-none
//                   focus:border-[#9a5847]
//                   focus:ring-0
//                 "
//               >

//                 {COLUMN_OPTIONS.map(
//                   (option) => (
//                     <option
//                       key={option}
//                       value={option}
//                     >
//                       {option}
//                     </option>
//                   )
//                 )}

//               </select>

//             </div>

//           </div>

//         </div>

//       </div>


//       {/* =========================================================
//           ADD EXPRESSION / FORMULA LIST MODAL
//       ========================================================= */}

//       {expressionOpen && (

//         <div
//           className="
//             fixed
//             inset-0
//             z-[99999]
//             flex
//             items-center
//             justify-center
//             bg-black/45
//             px-4
//             py-6
//           "
//         >

//           {/* =====================================================
//               MODAL CONTAINER
//           ===================================================== */}

//           <div
//             className="
//               flex
//               max-h-[90vh]
//               w-full
//               max-w-[780px]
//               flex-col
//               overflow-hidden
//               rounded-[8px]
//               bg-white
//               shadow-[0_10px_40px_rgba(0,0,0,0.25)]
//             "
//           >

//             {/* =================================================
//                 MODAL HEADER
//             ================================================= */}

//             <div
//               className="
//                 flex
//                 h-[58px]
//                 shrink-0
//                 items-center
//                 border-b
//                 border-[#e5e7eb]
//                 px-5
//               "
//             >

//               <h2
//                 className="
//                   text-[20px]
//                   font-semibold
//                   text-[#202938]
//                 "
//               >
//                 formula list
//               </h2>

//             </div>


//             {/* =================================================
//                 MODAL BODY
//             ================================================= */}

//             <div
//               className="
//                 overflow-y-auto
//                 px-5
//                 py-5
//               "
//             >

//               {/* =============================================
//                   WARNING
//               ============================================= */}

//               <div
//                 className="
//                   mb-5
//                   flex
//                   items-start
//                   gap-3
//                   rounded-[7px]
//                   border
//                   border-[#eee5d4]
//                   bg-[#fffcf5]
//                   px-4
//                   py-4
//                 "
//               >

//                 <AlertTriangle
//                   size={22}
//                   className="
//                     mt-0.5
//                     shrink-0
//                     text-[#e5c15c]
//                   "
//                 />

//                 <p
//                   className="
//                     text-[14px]
//                     leading-5
//                     text-[#77705f]
//                   "
//                 >
//                   Please do not change the
//                   variable ex:{`{username}`},
//                   and Please do not use
//                   space between the lines.
//                 </p>

//               </div>


//               {/* =============================================
//                   FORMULA CONTENT
//               ============================================= */}

//               <div
//                 className="
//                   grid
//                   grid-cols-1
//                   gap-4
//                   md:grid-cols-[1fr_310px]
//                 "
//               >

//                 {/* =========================================
//                     LEFT SIDE
//                 ========================================= */}

//                 <div>

//                   {/* =======================================
//                       FORMULA NAME
//                   ======================================= */}

//                   <div className="mb-4">

//                     <label
//                       className="
//                         mb-2
//                         block
//                         text-[15px]
//                         font-medium
//                         text-[#30343b]
//                       "
//                     >
//                       Formula Name
//                       <span className="text-red-500">
//                         *
//                       </span>
//                     </label>

//                     <input
//                       type="text"
//                       value={formulaName}
//                       onChange={(event) =>
//                         setFormulaName(
//                           event.target.value
//                         )
//                       }
//                       className="
//                         h-[43px]
//                         w-full
//                         rounded-[5px]
//                         border
//                         border-[#dfe3e8]
//                         bg-[#f0f3f9]
//                         px-3
//                         text-[14px]
//                         text-[#444]
//                         outline-none
//                         focus:border-[#9b5b4a]
//                       "
//                     />

//                   </div>


//                   {/* =======================================
//                       EXPRESSION 1
//                   ======================================= */}

//                   <div>

//                     <label
//                       className="
//                         mb-2
//                         block
//                         text-[15px]
//                         font-medium
//                         text-[#30343b]
//                       "
//                     >
//                       Expression 1
//                     </label>

//                     <textarea
//                       value={expression1}
//                       onChange={(event) =>
//                         setExpression1(
//                           event.target.value
//                         )
//                       }
//                       className="
//                         h-[165px]
//                         w-full
//                         resize-none
//                         rounded-[5px]
//                         border
//                         border-[#dfe3e8]
//                         bg-[#f0f3f9]
//                         px-3
//                         py-3
//                         text-[14px]
//                         text-[#444]
//                         outline-none
//                         focus:border-[#9b5b4a]
//                       "
//                     />

//                   </div>

//                 </div>


//                 {/* =========================================
//                     INFORMATION PANEL
//                 ========================================= */}

//                 <div
//                   className="
//                     min-h-[250px]
//                     rounded-[6px]
//                     bg-[#eeeafa]
//                     p-5
//                   "
//                 >

//                   <Info
//                     size={24}
//                     className="
//                       text-[#8d79e8]
//                     "
//                   />

//                 </div>

//               </div>

//             </div>


//             {/* =================================================
//                 MODAL FOOTER
//             ================================================= */}

//             <div
//               className="
//                 flex
//                 shrink-0
//                 items-center
//                 justify-end
//                 gap-4
//                 border-t
//                 border-[#e5e7eb]
//                 bg-[#f8f9fb]
//                 px-5
//                 py-3
//               "
//             >

//               {/* =============================================
//                   CLOSE BUTTON
//               ============================================= */}

//               <button
//                 type="button"
//                 onClick={closeExpression}
//                 className="
//                   flex
//                   h-[43px]
//                   min-w-[120px]
//                   items-center
//                   justify-center
//                   gap-2
//                   rounded-[6px]
//                   border
//                   border-[#9b9b9b]
//                   bg-white
//                   px-4
//                   text-[14px]
//                   font-medium
//                   text-[#5b626b]
//                   transition-colors
//                   hover:bg-[#f5f5f5]
//                 "
//               >

//                 <X size={18} />

//                 Close

//               </button>


//               {/* =============================================
//                   SAVE BUTTON
//               ============================================= */}

//               <button
//                 type="button"
//                 onClick={saveExpression}
//                 className="
//                   flex
//                   h-[43px]
//                   min-w-[120px]
//                   items-center
//                   justify-center
//                   gap-2
//                   rounded-[6px]
//                   bg-[#2196d2]
//                   px-4
//                   text-[14px]
//                   font-semibold
//                   text-white
//                   transition-colors
//                   hover:bg-[#1687c1]
//                 "
//               >

//                 <Bookmark size={18} />

//                 Save

//               </button>

//             </div>

//           </div>

//         </div>

//       )}

//     </>
//   );
// }


import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Plus,
  X,
  AlertTriangle,
  Info,
  Bookmark,
  ChevronDown,
} from "lucide-react";

import FieldSelector from "./FieldSelector";

const COLUMN_OPTIONS = [
  "Select Column",
  "Ref No",
  "Empname",
  "Month Name",
];

export default function ReportConfiguration() {
  const [groupBy, setGroupBy] =
    useState([
      "Select Column",
      "Select Column",
      "Select Column",
    ]);

  const [orderBy, setOrderBy] =
    useState([
      "Select Column",
      "Select Column",
      "Select Column",
    ]);

  /* =====================================================
     ADD EXPRESSION STATE
  ===================================================== */

  const [expressionOpen, setExpressionOpen] =
    useState(false);

  /* =====================================================
     GROUP / ORDER DROPDOWN STATE

     Custom dropdowns are used instead of the native
     browser <select> popup so the menu stays inside the
     responsive mobile layout.
  ===================================================== */

  const [openDropdown, setOpenDropdown] =
    useState<"group" | "order" | null>(null);

  const groupDropdownRef =
    useRef<HTMLDivElement>(null);

  const orderDropdownRef =
    useRef<HTMLDivElement>(null);

  const [formulaName, setFormulaName] =
    useState("");

  const [expression1, setExpression1] =
    useState("");


  /* =====================================================
     GROUP BY UPDATE
  ===================================================== */

  const updateGroupBy = (
    index: number,
    value: string
  ) => {
    setGroupBy((previous) => {
      const next = [...previous];

      next[index] = value;

      return next;
    });
  };


  /* =====================================================
     ORDER BY UPDATE
  ===================================================== */

  const updateOrderBy = (
    index: number,
    value: string
  ) => {
    setOrderBy((previous) => {
      const next = [...previous];

      next[index] = value;

      return next;
    });
  };


  /* =====================================================
     CLOSE GROUP / ORDER DROPDOWN
  ===================================================== */

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        groupDropdownRef.current?.contains(target) ||
        orderDropdownRef.current?.contains(target)
      ) {
        return;
      }

      setOpenDropdown(null);
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);


  /* =====================================================
     CLOSE EXPRESSION
  ===================================================== */

  const closeExpression = () => {
    setExpressionOpen(false);
  };


  /* =====================================================
     SAVE EXPRESSION
     
     Existing report functionality is not changed.
  ===================================================== */

  const saveExpression = () => {
    setExpressionOpen(false);
  };


  return (
    <>
      <div className="w-full min-w-0 max-w-full overflow-visible bg-white">

        {/* =====================================================
            SCROLLBAR STYLES
        ===================================================== */}

        <style>{`
          /* ================================================
             GROUP / ORDER SCROLLBAR
          ================================================ */

          .group-order-scroll {
            overflow-y: auto;
            overflow-x: hidden;

            scrollbar-width: thin;
            scrollbar-color: #a7a7a7 transparent;
          }

          .group-order-scroll::-webkit-scrollbar {
            width: 6px;
            height: 0;
          }

          .group-order-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .group-order-scroll::-webkit-scrollbar-thumb {
            background: #a7a7a7;
            border-radius: 10px;
          }

          .group-order-scroll::-webkit-scrollbar-corner {
            background: transparent;
          }

          .group-order-scroll::-webkit-scrollbar:horizontal {
            height: 0;
          }


          /* ================================================
             REPORT CONFIGURATION SCROLLBAR
          ================================================ */

          .report-configuration-scroll {
            overflow-y: auto;
            overflow-x: hidden;

            scrollbar-width: thin;
            scrollbar-color: #a7a7a7 transparent;
          }

          .report-configuration-scroll::-webkit-scrollbar {
            width: 6px;
            height: 0;
          }

          .report-configuration-scroll::-webkit-scrollbar-track {
            background: transparent;
          }

          .report-configuration-scroll::-webkit-scrollbar-thumb {
            background: #a7a7a7;
            border-radius: 10px;
          }

          .report-configuration-scroll::-webkit-scrollbar-corner {
            background: transparent;
          }

          .report-configuration-scroll::-webkit-scrollbar:horizontal {
            height: 0;
          }
        `}</style>


        {/* =====================================================
            ADD FIELDS HEADER
        ===================================================== */}

        {/* <div
          className="
            flex
            items-center
            justify-between
            gap-3
            px-5
            pb-3
            pt-1
          "
        > */}

        <div
  className="
    mt-4
    flex
    w-full
    min-w-0
    max-w-full
    flex-col
    items-start
    justify-between
    gap-2
    border-b
    border-[#e5e7eb]
    pb-3
    sm:flex-row
    sm:items-center
  "
>

          <div
            className="
              flex
              min-w-0
              items-center
              gap-2
            "
          >

            <h2
              className="
                shrink-0
                text-[13px]
                font-semibold
                text-[#555]
              "
            >
              Add Fields and Prioritize
            </h2>

            <span
              className="
                hidden
                text-[11px]
                text-[#999]
                sm:block
              "
            >
              Select the table columns to display
            </span>

          </div>


          {/* =================================================
              ADD EXPRESSION
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              setExpressionOpen(true)
            }
            className="
              flex
              shrink-0
              items-center
              gap-1
              text-[12px]
              font-semibold
              text-[#955847]
              transition-colors
              hover:text-[#7f493b]
            "
          >

            <Plus size={15} />

            Add Expression

          </button>

        </div>


        {/* =====================================================
            FIELD SELECTOR
        ===================================================== */}

        <FieldSelector />


        {/* =====================================================
            GROUP BY / ORDER BY

            Responsive custom dropdowns.
            The dropdown menus remain inside the mobile
            field width instead of using the browser popup.
        ===================================================== */}

        <div
          className="
            relative
            z-30
            grid
            w-full
            min-w-0
            max-w-full
            grid-cols-1
            gap-3
            overflow-visible
            border-t
            border-[#e4e8ec]
            bg-white
            px-3
            py-3
            sm:grid-cols-2
            sm:px-4
          "
        >

          {/* =================================================
              GROUP BY
          ================================================= */}

          <div
            ref={groupDropdownRef}
            className="w-full min-w-0"
          >

            <h3
              className="
                mb-2
                text-[12px]
                font-semibold
                text-[#444]
              "
            >
              Group By
            </h3>

            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={openDropdown === "group"}
              onClick={() =>
                setOpenDropdown((current) =>
                  current === "group"
                    ? null
                    : "group",
                )
              }
              className="
                flex
                h-[40px]
                w-full
                min-w-0
                items-center
                justify-between
                gap-2
                rounded-md
                border
                border-[#b17869]
                bg-white
                px-3
                text-left
                text-[12px]
                text-[#9aa4ae]
                outline-none
                transition-colors
                focus:border-[#8f5142]
              "
            >
              <span className="min-w-0 flex-1 truncate">
                {groupBy[0]}
              </span>

              <ChevronDown
                size={15}
                className={`
                  shrink-0
                  text-[#6f777f]
                  transition-transform
                  ${
                    openDropdown === "group"
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {openDropdown === "group" && (
              <div
                role="listbox"
                className="
                  mt-1
                  block
                  w-full
                  min-w-0
                  max-w-full
                  max-h-[180px]
                  overflow-x-hidden
                  overflow-y-auto
                  rounded-md
                  border
                  border-[#b17869]
                  bg-white
                  shadow-[0_6px_16px_rgba(0,0,0,0.16)]
                "
              >
                {COLUMN_OPTIONS.map((option) => {
                  const selected =
                    groupBy[0] === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        updateGroupBy(0, option);
                        setOpenDropdown(null);
                      }}
                      className={`
                        flex
                        min-h-[36px]
                        w-full
                        min-w-0
                        items-center
                        px-3
                        text-left
                        text-[12px]
                        transition-colors
                        ${
                          selected
                            ? "bg-[#8f5142] text-white"
                            : "bg-white text-[#7f8b99] hover:bg-[#f8efec] hover:text-[#8f5142]"
                        }
                      `}
                    >
                      <span className="min-w-0 truncate">
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

          </div>


          {/* =================================================
              ORDER BY
          ================================================= */}

          <div
            ref={orderDropdownRef}
            className="w-full min-w-0"
          >

            <h3
              className="
                mb-2
                text-[12px]
                font-semibold
                text-[#444]
              "
            >
              Order By
            </h3>

            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={openDropdown === "order"}
              onClick={() =>
                setOpenDropdown((current) =>
                  current === "order"
                    ? null
                    : "order",
                )
              }
              className="
                flex
                h-[40px]
                w-full
                min-w-0
                items-center
                justify-between
                gap-2
                rounded-md
                border
                border-[#b17869]
                bg-white
                px-3
                text-left
                text-[12px]
                text-[#9aa4ae]
                outline-none
                transition-colors
                focus:border-[#8f5142]
              "
            >
              <span className="min-w-0 flex-1 truncate">
                {orderBy[0]}
              </span>

              <ChevronDown
                size={15}
                className={`
                  shrink-0
                  text-[#6f777f]
                  transition-transform
                  ${
                    openDropdown === "order"
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {openDropdown === "order" && (
              <div
                role="listbox"
                className="
                  mt-1
                  block
                  w-full
                  min-w-0
                  max-w-full
                  max-h-[180px]
                  overflow-x-hidden
                  overflow-y-auto
                  rounded-md
                  border
                  border-[#b17869]
                  bg-white
                  shadow-[0_6px_16px_rgba(0,0,0,0.16)]
                "
              >
                {COLUMN_OPTIONS.map((option) => {
                  const selected =
                    orderBy[0] === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        updateOrderBy(0, option);
                        setOpenDropdown(null);
                      }}
                      className={`
                        flex
                        min-h-[36px]
                        w-full
                        min-w-0
                        items-center
                        px-3
                        text-left
                        text-[12px]
                        transition-colors
                        ${
                          selected
                            ? "bg-[#8f5142] text-white"
                            : "bg-white text-[#7f8b99] hover:bg-[#f8efec] hover:text-[#8f5142]"
                        }
                      `}
                    >
                      <span className="min-w-0 truncate">
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>


      {/* =========================================================
          ADD EXPRESSION / FORMULA LIST MODAL
      ========================================================= */}

      {expressionOpen && (

        <div
          className="
            fixed
            inset-0
            z-[99999]
            flex
            items-center
            justify-center
            bg-black/45
            px-4
            py-6
          "
        >

          {/* =====================================================
              MODAL CONTAINER
          ===================================================== */}

          <div
            className="
              flex
              max-h-[90vh]
              w-full
              max-w-[780px]
              flex-col
              overflow-hidden
              rounded-[8px]
              bg-white
              shadow-[0_10px_40px_rgba(0,0,0,0.25)]
            "
          >

            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div
              className="
                flex
                h-[58px]
                shrink-0
                items-center
                border-b
                border-[#e5e7eb]
                px-5
              "
            >

              <h2
                className="
                  text-[20px]
                  font-semibold
                  text-[#202938]
                "
              >
                formula list
              </h2>

            </div>


            {/* =================================================
                MODAL BODY
            ================================================= */}

            <div
              className="
                overflow-y-auto
                px-5
                py-5
              "
            >

              {/* =============================================
                  WARNING
              ============================================= */}

              <div
                className="
                  mb-5
                  flex
                  items-start
                  gap-3
                  rounded-[7px]
                  border
                  border-[#eee5d4]
                  bg-[#fffcf5]
                  px-4
                  py-4
                "
              >

                <AlertTriangle
                  size={22}
                  className="
                    mt-0.5
                    shrink-0
                    text-[#e5c15c]
                  "
                />

                <p
                  className="
                    text-[14px]
                    leading-5
                    text-[#77705f]
                  "
                >
                  Please do not change the
                  variable ex:{`{username}`},
                  and Please do not use
                  space between the lines.
                </p>

              </div>


              {/* =============================================
                  FORMULA CONTENT
              ============================================= */}

              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  md:grid-cols-[1fr_310px]
                "
              >

                {/* =========================================
                    LEFT SIDE
                ========================================= */}

                <div>

                  {/* =======================================
                      FORMULA NAME
                  ======================================= */}

                  <div className="mb-4">

                    <label
                      className="
                        mb-2
                        block
                        text-[15px]
                        font-medium
                        text-[#30343b]
                      "
                    >
                      Formula Name
                      <span className="text-red-500">
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      value={formulaName}
                      onChange={(event) =>
                        setFormulaName(
                          event.target.value
                        )
                      }
                      className="
                        h-[43px]
                        w-full
                        rounded-[5px]
                        border
                        border-[#dfe3e8]
                        bg-[#f0f3f9]
                        px-3
                        text-[14px]
                        text-[#444]
                        outline-none
                        focus:border-[#9b5b4a]
                      "
                    />

                  </div>


                  {/* =======================================
                      EXPRESSION 1
                  ======================================= */}

                  <div>

                    <label
                      className="
                        mb-2
                        block
                        text-[15px]
                        font-medium
                        text-[#30343b]
                      "
                    >
                      Expression 1
                    </label>

                    <textarea
                      value={expression1}
                      onChange={(event) =>
                        setExpression1(
                          event.target.value
                        )
                      }
                      className="
                        h-[165px]
                        w-full
                        resize-none
                        rounded-[5px]
                        border
                        border-[#dfe3e8]
                        bg-[#f0f3f9]
                        px-3
                        py-3
                        text-[14px]
                        text-[#444]
                        outline-none
                        focus:border-[#9b5b4a]
                      "
                    />

                  </div>

                </div>


                {/* =========================================
                    INFORMATION PANEL
                ========================================= */}

                <div
                  className="
                    min-h-[250px]
                    rounded-[6px]
                    bg-[#eeeafa]
                    p-5
                  "
                >

                  <Info
                    size={24}
                    className="
                      text-[#8d79e8]
                    "
                  />

                </div>

              </div>

            </div>


            {/* =================================================
                MODAL FOOTER
            ================================================= */}

            <div
              className="
                flex
                shrink-0
                items-center
                justify-end
                gap-4
                border-t
                border-[#e5e7eb]
                bg-[#f8f9fb]
                px-5
                py-3
              "
            >

              {/* =============================================
                  CLOSE BUTTON
              ============================================= */}

              <button
                type="button"
                onClick={closeExpression}
                className="
                  flex
                  h-[43px]
                  min-w-[120px]
                  items-center
                  justify-center
                  gap-2
                  rounded-[6px]
                  border
                  border-[#9b9b9b]
                  bg-white
                  px-4
                  text-[14px]
                  font-medium
                  text-[#5b626b]
                  transition-colors
                  hover:bg-[#f5f5f5]
                "
              >

                <X size={18} />

                Close

              </button>


              {/* =============================================
                  SAVE BUTTON
              ============================================= */}

              <button
                type="button"
                onClick={saveExpression}
                className="
                  flex
                  h-[43px]
                  min-w-[120px]
                  items-center
                  justify-center
                  gap-2
                  rounded-[6px]
                  bg-[#2196d2]
                  px-4
                  text-[14px]
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-[#1687c1]
                "
              >

                <Bookmark size={18} />

                Save

              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}
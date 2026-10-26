// import { useState } from "react";
// import { ChevronDown } from "lucide-react";

// export default function ReportHeader() {
//   const [customQuery, setCustomQuery] =
//     useState(false);

//   const [reportName, setReportName] =
//     useState("Employee Audit Report_v2");

//   return (
//     <div className="w-full bg-white">

//       {/* REPORT NAME + CUSTOM QUERY */}
//       <div
//         className="
//           grid
//           grid-cols-1
//           gap-5
//           px-5
//           pb-3
//           pt-5
//           md:grid-cols-[minmax(0,1fr)_205px]
//         "
//       >

//         {/* REPORT NAME */}
//         <div>
//           <label
//             className="
//               mb-1
//               block
//               text-[12px]
//               font-semibold
//               text-[#414141]
//             "
//           >
//             Report Name
//           </label>

//           <input
//             type="text"
//             value={reportName}
//             onChange={(event) =>
//               setReportName(event.target.value)
//             }
//             className="
//               h-[35px]
//               w-full
//               rounded-[5px]
//               border
//               border-[#9b9b9b]
//               bg-white
//               px-3
//               text-[13px]
//               text-[#38424d]
//               outline-none
//               focus:border-[#9b5b4a]
//             "
//           />
//         </div>


//         {/* CUSTOM QUERY */}
//         <div
//           className="
//             flex
//             items-center
//             gap-2
//             pt-5
//           "
//         >
//           <button
//             type="button"
//             onClick={() =>
//               setCustomQuery(
//                 (previous) => !previous
//               )
//             }
//             className={`
//               relative
//               h-[19px]
//               w-[37px]
//               shrink-0
//               rounded-full
//               transition
//               ${
//                 customQuery
//                   ? "bg-[#8c4c3c]"
//                   : "bg-[#dce4ed]"
//               }
//             `}
//           >
//             <span
//               className={`
//                 absolute
//                 top-[2px]
//                 h-[15px]
//                 w-[15px]
//                 rounded-full
//                 bg-white
//                 shadow-sm
//                 transition-all
//                 ${
//                   customQuery
//                     ? "right-[2px]"
//                     : "left-[2px]"
//                 }
//               `}
//             />
//           </button>

//           <span
//             className="
//               whitespace-nowrap
//               text-[12px]
//               text-[#4c4c4c]
//             "
//           >
//             Custom Query{" "}
//             <span className="text-[#747474]">
//               (Write query)
//             </span>
//           </span>
//         </div>

//       </div>


//       {/* PIN REPORT */}
//       <div className="px-5 pb-4">

//         <label
//           className="
//             mb-2
//             block
//             text-[12px]
//             font-semibold
//             text-[#414141]
//           "
//         >
//           Pin Report to
//         </label>

//         <div className="relative">

//           <select
//             defaultValue="analytics"
//             className="
//               h-[35px]
//               w-full
//               appearance-none
//               rounded-[5px]
//               border
//               border-[#dfe3e8]
//               bg-white
//               px-3
//               pr-9
//               text-[13px]
//               text-[#59636e]
//               outline-none
//               focus:border-[#9b5b4a]
//             "
//           >
//             <option value="analytics">
//               General Report / Analytics
//             </option>

//             <option value="dashboard">
//               Dashboard
//             </option>

//             <option value="employee">
//               Employee Report
//             </option>

//             <option value="salary">
//               Salary
//             </option>
//           </select>

//           <ChevronDown
//             size={16}
//             className="
//               pointer-events-none
//               absolute
//               right-3
//               top-1/2
//               -translate-y-1/2
//               text-[#555]
//             "
//           />

//         </div>

//       </div>

//     </div>
//   );
// }


import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ReportHeader() {
  const [customQuery, setCustomQuery] =
    useState(false);

  const [reportName, setReportName] =
    useState("Employee Audit Report_v2");

  /* =====================================================
     PIN REPORT DROPDOWN
  ===================================================== */

  const [pinReportOpen, setPinReportOpen] =
    useState(false);

  const [pinReportTo, setPinReportTo] =
    useState("");

  const PIN_REPORT_OPTIONS = [
    "Select",
    "salary report",
    "employee report",
    "leave report",
  ];

  return (
    <div className="w-full bg-white">

      {/* =====================================================
          REPORT NAME + CUSTOM QUERY
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          px-5
          pb-3
          pt-5
          md:grid-cols-[minmax(0,1fr)_205px]
        "
      >

        {/* =================================================
            REPORT NAME
        ================================================= */}

        <div>

          <label
            className="
              mb-1
              block
              text-[12px]
              font-semibold
              text-[#414141]
            "
          >
            Report Name
          </label>

          <input
            type="text"
            value={reportName}
            onChange={(event) =>
              setReportName(
                event.target.value
              )
            }
            className="
              h-[35px]
              w-full
              rounded-[5px]
              border
              border-[#9b9b9b]
              bg-white
              px-3
              text-[13px]
              text-[#38424d]
              outline-none
              focus:border-[#9b5b4a]
            "
          />

        </div>


        {/* =================================================
            CUSTOM QUERY
        ================================================= */}

        <div
          className="
            flex
            items-center
            gap-2
            pt-5
          "
        >

          <button
            type="button"
            onClick={() =>
              setCustomQuery(
                (previous) => !previous
              )
            }
            className={`
              relative
              h-[19px]
              w-[37px]
              shrink-0
              rounded-full
              transition
              ${
                customQuery
                  ? "bg-[#8c4c3c]"
                  : "bg-[#dce4ed]"
              }
            `}
          >

            <span
              className={`
                absolute
                top-[2px]
                h-[15px]
                w-[15px]
                rounded-full
                bg-white
                shadow-sm
                transition-all
                ${
                  customQuery
                    ? "right-[2px]"
                    : "left-[2px]"
                }
              `}
            />

          </button>

          <span
            className="
              whitespace-nowrap
              text-[12px]
              text-[#4c4c4c]
            "
          >
            Custom Query{" "}
            <span className="text-[#747474]">
              (Write query)
            </span>
          </span>

        </div>

      </div>


      {/* =====================================================
          PIN REPORT TO
      ===================================================== */}

      <div className="px-5 pb-4">

        <label
          className="
            mb-2
            block
            text-[12px]
            font-semibold
            text-[#111827]
          "
        >
          Pin Report to
        </label>


        {/* =================================================
            CUSTOM DROPDOWN
        ================================================= */}

        <div className="relative w-full">


          {/* =================================================
              DROPDOWN BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              setPinReportOpen(
                (previous) => !previous
              )
            }
            className={`
              flex
              h-[46px]
              w-full
              items-center
              justify-between
              rounded-[6px]
              bg-white
              px-3
              text-left
              text-[14px]
              outline-none
              transition

              ${
                pinReportOpen
                  ? "border-2 border-[#9b5b4a]"
                  : "border border-[#dfe3e8]"
              }
            `}
          >

            {/* =========================================
                SELECTED VALUE
            ========================================= */}

            <span
              className={`
                truncate
                ${
                  pinReportTo
                    ? "text-[#9b5b4a]"
                    : "text-[#59636e]"
                }
              `}
            >
              {pinReportTo || "Select"}
            </span>


            {/* =========================================
                DROPDOWN ARROW
            ========================================= */}

            <ChevronDown
              size={16}
              className={`
                shrink-0
                transition-transform
                ${
                  pinReportOpen
                    ? "rotate-180 text-[#9b5b4a]"
                    : "text-[#777777]"
                }
              `}
            />

          </button>


          {/* =================================================
              DROPDOWN OPTIONS
          ================================================= */}

          {pinReportOpen && (

            <div
              className="
                absolute
                left-0
                top-[48px]
                z-[9999]
                w-full
                overflow-hidden
                rounded-[5px]
                border
                border-[#dfe3e8]
                bg-white
                shadow-[0_2px_6px_rgba(0,0,0,0.08)]
              "
            >

              {PIN_REPORT_OPTIONS.map(
                (option) => (

                  <button
                    key={option}
                    type="button"
                    onClick={() => {

                      if (
                        option === "Select"
                      ) {
                        setPinReportTo("");
                      } else {
                        setPinReportTo(
                          option
                        );
                      }

                      setPinReportOpen(
                        false
                      );
                    }}
                    className="
                      flex
                      min-h-[40px]
                      w-full
                      items-center
                      px-3
                      text-left
                      text-[14px]
                      font-normal
                      text-[#4f5965]
                      transition-colors
                      hover:bg-[#fffaf8]
                      hover:text-[#955847]
                    "
                  >

                    {option}

                  </button>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}
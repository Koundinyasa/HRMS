// // import { createPortal } from "react-dom";
// // import { X } from "lucide-react";

// // import type { OverviewDetailKey } from "../types/attendanceOverview.types";

// // import { overviewDetailConfig } from "../constants/regularization.constants";
// // import type { AttendanceDay } from "../types/regularization.types";

// // function StatusPill({ status }: { status: string }) {
// //   const parts = status.split("+");

// //   const colorFor = (value: string) =>
// //     value === "P"
// //       ? "text-emerald-600"
// //       : value === "AB"
// //       ? "text-red-600"
// //       : "text-slate-600";

// //   return (
// //     <span className="font-medium font-[Urbanist]">
// //       {parts.map((part, index) => (
// //         <span key={`${part}-${index}`} className={colorFor(part)}>
// //           {part}

// //           {index < parts.length - 1 && (
// //             <span className="text-slate-400 font-[Urbanist]">+</span>
// //           )}
// //         </span>
// //       ))}
// //     </span>
// //   );
// // }

// // export default function OverviewDetailsModal({
// //   detailKey,
// //   onClose,
// //   days,
// // }: {
// //   detailKey: OverviewDetailKey;
// //   onClose: () => void;
// //   days: AttendanceDay[];
// // }) {
// //   const config = overviewDetailConfig[detailKey];

// //   const filteredDays = days.filter((day) => {
// //     const status = String(day.status ?? "").toUpperCase();

// //     switch (detailKey) {
// //       case "present":
// //         return status.includes("P");

// //       case "absent":
// //         return status.includes("AB");

// //       case "earlyIn":
// //         return Boolean(day.checkIn);

// //       case "lateIn":
// //         return Boolean(day.checkIn);

// //       case "earlyOut":
// //         return Boolean(day.checkOut);

// //       case "overstay":
// //         return Boolean(day.overtime ?? day.overTime);

// //       default:
// //         return false;
// //     }
// //   });
// //   return createPortal(
// //     <div
// //       className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 font-[Urbanist]"
// //       role="dialog"
// //       aria-modal="true"
// //       aria-labelledby="overview-details-title"
// //     >
// //       <div className="max-h-[85vh] w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl font-[Urbanist]">
// //         <div className="flex items-center justify-between border-b border-black bg-slate-50 px-5 py-4 font-[Urbanist]">
// //           <h2
// //             id="overview-details-title"
// //             className="text-base font-bold text-slate-800 font-[Urbanist]"
// //           >
// //             {config.title}
// //           </h2>

// //           <button
// //             type="button"
// //             onClick={onClose}
// //             className="rounded-md p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 font-[Urbanist]"
// //             aria-label="Close"
// //           >
// //             <X className="h-4 w-4 font-[Urbanist]" />
// //           </button>
// //         </div>

// //         <div className="max-h-[55vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden font-[Urbanist]">
// //           <table className="w-full min-w-[360px] text-left text-sm font-[Urbanist]">
// //             <thead className="sticky top-0 z-10 bg-sky-100 font-[Urbanist]">
// //               <tr>
// //                 {config.columns.map((column) => (
// //                   <th
// //                     key={column}
// //                     className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-slate-700 font-[Urbanist]"
// //                   >
// //                     {column}
// //                   </th>
// //                 ))}
// //               </tr>
// //             </thead>

// //             <tbody className="divide-y divide-slate-100 font-[Urbanist]">
// //               {detailKey === "present" &&
// //                 presentDaysDetails.map((row) => (
// //                   <tr
// //                     key={`${row.slNo}-${row.date}`}
// //                     className="hover:bg-slate-50 font-[Urbanist]"
// //                   >
// //                     <td className="px-4 py-2.5 text-slate-600 font-[Urbanist]">{row.slNo}</td>
// //                     <td className="px-4 py-2.5 text-slate-600 font-[Urbanist]">{row.date}</td>
// //                     <td className="px-4 py-2.5 font-[Urbanist]">
// //                       <StatusPill status={row.status} />
// //                     </td>
// //                   </tr>
// //                 ))}

// //               {detailKey === "absent" &&
// //                 absentDaysDetails.map((row) => (
// //                   <tr
// //                     key={`${row.slNo}-${row.date}`}
// //                     className="hover:bg-slate-50 font-[Urbanist]"
// //                   >
// //                     <td className="px-4 py-2.5 text-slate-600 font-[Urbanist]">{row.slNo}</td>
// //                     <td className="px-4 py-2.5 text-slate-600 font-[Urbanist]">{row.date}</td>
// //                     <td className="px-4 py-2.5 font-[Urbanist]">
// //                       <StatusPill status={row.status} />
// //                     </td>
// //                     <td className="min-w-[190px] px-4 py-2.5 text-sky-700 font-[Urbanist]">
// //                       {row.remarks}
// //                     </td>
// //                   </tr>
// //                 ))}

// //               {detailKey !== "present" &&
// //                 detailKey !== "absent" &&
// //                 timeRows.map((row) => (
// //                   <tr
// //                     key={`${row.slNo}-${row.date}`}
// //                     className="hover:bg-slate-50 font-[Urbanist]"
// //                   >
// //                     <td className="px-4 py-2.5 text-slate-600 font-[Urbanist]">{row.slNo}</td>
// //                     <td className="px-4 py-2.5 text-slate-600 font-[Urbanist]">{row.date}</td>
// //                     <td className="px-4 py-2.5 text-sky-700 font-[Urbanist]">{row.time}</td>
// //                   </tr>
// //                 ))}
// //             </tbody>
// //           </table>
// //         </div>

// //         <div className="flex justify-end border-t border-black px-5 py-3 font-[Urbanist]">
// //           <button
// //             type="button"
// //             onClick={onClose}
// //             className="flex items-center gap-1.5 rounded-md border border-black px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 font-[Urbanist]"
// //           >
// //             <X className="h-3.5 w-3.5 font-[Urbanist]" />
// //             Cancel
// //           </button>
// //         </div>
// //       </div>
// //     </div>,
// //     document.body,
// //   );
// // }


// import { createPortal } from "react-dom";
// import { X } from "lucide-react";

// import type { OverviewDetailKey } from "../types/attendanceOverview.types";

// import { overviewDetailConfig } from "../constants/regularization.constants";
// import type { AttendanceDay } from "../types/regularization.types";

// function StatusPill({ status }: { status: string }) {
//   const parts = status.split("+");

//   const colorFor = (value: string) =>
//     value === "P"
//       ? "text-emerald-600"
//       : value === "AB"
//       ? "text-red-600"
//       : "text-slate-600";

//   return (
//     <span className="font-medium font-[Urbanist]">
//       {parts.map((part, index) => (
//         <span key={`${part}-${index}`} className={colorFor(part)}>
//           {part}

//           {index < parts.length - 1 && (
//             <span className="text-slate-400 font-[Urbanist]">+</span>
//           )}
//         </span>
//       ))}
//     </span>
//   );
// }

// export default function OverviewDetailsModal({
//   detailKey,
//   onClose,
//   days,
// }: {
//   detailKey: OverviewDetailKey;
//   onClose: () => void;
//   days: AttendanceDay[];
// }) {
//   const config = overviewDetailConfig[detailKey];

//   const filteredDays = days.filter((day) => {
//     const status = String(day.status ?? "").toUpperCase();

//     switch (detailKey) {
//       case "present":
//         return status.includes("P");

//       case "absent":
//         return status.includes("AB");

//       case "earlyIn":
//         return Boolean(day.checkIn);

//       case "lateIn":
//         return Boolean(day.checkIn);

//       case "earlyOut":
//         return Boolean(day.checkOut);

//       case "overstay":
//         return Boolean(day.overtime ?? day.overTime);

//       default:
//         return false;
//     }
//   });

//   // Rows for the "present" table (slNo, date, status).
//   const presentDaysDetails = filteredDays.map((day, index) => ({
//     slNo: index + 1,
//     date: day.date,
//     status: day.status,
//   }));

//   // Rows for the "absent" table (slNo, date, status, remarks).
//   // No dedicated remarks field exists on AttendanceDay yet, so this
//   // falls back to secondaryStatus (e.g. a half-day code) when present.
//   const absentDaysDetails = filteredDays.map((day, index) => ({
//     slNo: index + 1,
//     date: day.date,
//     status: day.status,
//     remarks: day.secondaryStatus ?? "",
//   }));

//   // Rows for the time-based tables (earlyIn / lateIn / earlyOut / overstay).
//   // Which field feeds "time" depends on which detail was opened.
//   const timeRows = filteredDays.map((day, index) => {
//     let time = "";

//     switch (detailKey) {
//       case "earlyIn":
//       case "lateIn":
//         time = day.checkIn ?? "";
//         break;

//       case "earlyOut":
//         time = day.checkOut ?? "";
//         break;

//       case "overstay":
//         time = day.overtime ?? day.overTime ?? "";
//         break;

//       default:
//         time = "";
//     }

//     return {
//       slNo: index + 1,
//       date: day.date,
//       time,
//     };
//   });

//   return createPortal(
//     <div
//       className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 font-[Urbanist]"
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="overview-details-title"
//     >
//       <div className="max-h-[85vh] w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl font-[Urbanist]">
//         <div className="flex items-center justify-between border-b border-black bg-slate-50 px-5 py-4 font-[Urbanist]">
//           <h2
//             id="overview-details-title"
//             className="text-base font-bold text-slate-800 font-[Urbanist]"
//           >
//             {config.title}
//           </h2>

//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-md p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 font-[Urbanist]"
//             aria-label="Close"
//           >
//             <X className="h-4 w-4 font-[Urbanist]" />
//           </button>
//         </div>

//         <div className="max-h-[55vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden font-[Urbanist]">
//           <table className="w-full min-w-[360px] text-left text-sm font-[Urbanist]">
//             <thead className="sticky top-0 z-10 bg-sky-100 font-[Urbanist]">
//               <tr>
//                 {config.columns.map((column) => (
//                   <th
//                     key={column}
//                     className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-slate-700 font-[Urbanist]"
//                   >
//                     {column}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-slate-100 font-[Urbanist]">
//               {detailKey === "present" &&
//                 presentDaysDetails.map((row) => (
//                   <tr
//                     key={`${row.slNo}-${row.date}`}
//                     className="hover:bg-slate-50 font-[Urbanist]"
//                   >
//                     <td className="px-4 py-2.5 text-slate-600 font-[Urbanist]">{row.slNo}</td>
//                     <td className="px-4 py-2.5 text-slate-600 font-[Urbanist]">{row.date}</td>
//                     <td className="px-4 py-2.5 font-[Urbanist]">
//                       <StatusPill status={row.status} />
//                     </td>
//                   </tr>
//                 ))}

//               {detailKey === "absent" &&
//                 absentDaysDetails.map((row) => (
//                   <tr
//                     key={`${row.slNo}-${row.date}`}
//                     className="hover:bg-slate-50 font-[Urbanist]"
//                   >
//                     <td className="px-4 py-2.5 text-slate-600 font-[Urbanist]">{row.slNo}</td>
//                     <td className="px-4 py-2.5 text-slate-600 font-[Urbanist]">{row.date}</td>
//                     <td className="px-4 py-2.5 font-[Urbanist]">
//                       <StatusPill status={row.status} />
//                     </td>
//                     <td className="min-w-[190px] px-4 py-2.5 text-sky-700 font-[Urbanist]">
//                       {row.remarks}
//                     </td>
//                   </tr>
//                 ))}

//               {detailKey !== "present" &&
//                 detailKey !== "absent" &&
//                 timeRows.map((row) => (
//                   <tr
//                     key={`${row.slNo}-${row.date}`}
//                     className="hover:bg-slate-50 font-[Urbanist]"
//                   >
//                     <td className="px-4 py-2.5 text-slate-600 font-[Urbanist]">{row.slNo}</td>
//                     <td className="px-4 py-2.5 text-slate-600 font-[Urbanist]">{row.date}</td>
//                     <td className="px-4 py-2.5 text-sky-700 font-[Urbanist]">{row.time}</td>
//                   </tr>
//                 ))}
//             </tbody>
//           </table>
//         </div>

//         <div className="flex justify-end border-t border-black px-5 py-3 font-[Urbanist]">
//           <button
//             type="button"
//             onClick={onClose}
//             className="flex items-center gap-1.5 rounded-md border border-black px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 font-[Urbanist]"
//           >
//             <X className="h-3.5 w-3.5 font-[Urbanist]" />
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>,
//     document.body,
//   );
// }


import { createPortal } from "react-dom";
import { X } from "lucide-react";

import type { OverviewDetailKey } from "../types/attendanceOverview.types";
import { overviewDetailConfig } from "../constants/regularization.constants";
import type { AttendanceDay } from "../types/regularization.types";

function StatusPill({
  status,
}: {
  status: string;
}) {
  const parts = status.split("+");

  const colorFor = (value: string) =>
    value === "P"
      ? "text-emerald-600"
      : value === "AB"
      ? "text-red-600"
      : "text-slate-600";

  return (
    <span className="font-medium font-[Urbanist]">
      {parts.map((part, index) => (
        <span
          key={`${part}-${index}`}
          className={colorFor(part)}
        >
          {part}

          {index < parts.length - 1 && (
            <span className="text-slate-400 font-[Urbanist]">
              +
            </span>
          )}
        </span>
      ))}
    </span>
  );
}

export default function OverviewDetailsModal({
  detailKey,
  onClose,
  days,
  selectedMonth,
  selectedYear,
}: {
  detailKey: OverviewDetailKey;
  onClose: () => void;
  days: AttendanceDay[];

  // Month is 1-based:
  // January = 1
  // February = 2
  // ...
  // September = 9
  selectedMonth: number;

  selectedYear: number;
}) {
  const config =
    overviewDetailConfig[detailKey];

  // ==========================================================
  // FORMAT FULL DATE
  // ==========================================================
  //
  // Backend:
  // "10/09/2026"
  //
  // Frontend day.date:
  // 10
  //
  // We convert:
  // 10 -> 10/09/2026
  //
  // ==========================================================

  const formatFullDate = (
    dayNumber: number,
  ): string => {
    if (
      !dayNumber ||
      !selectedMonth ||
      !selectedYear
    ) {
      return String(dayNumber ?? "");
    }

    return `${String(dayNumber).padStart(
      2,
      "0",
    )}/${String(selectedMonth).padStart(
      2,
      "0",
    )}/${selectedYear}`;
  };

  // ==========================================================
  // FILTER DAYS
  // ==========================================================

  const filteredDays =
    days.filter((day) => {
      const status = String(
        day.status ?? "",
      ).toUpperCase();

      switch (detailKey) {
        case "present":
          return status.includes("P");

        case "absent":
          return status.includes("AB");

        case "earlyIn":
          return Boolean(day.checkIn);

        case "lateIn":
          return Boolean(day.checkIn);

        case "earlyOut":
          return Boolean(day.checkOut);

        case "overstay":
          return Boolean(
            day.overtime ??
              day.overTime,
          );

        default:
          return false;
      }
    });

  // ==========================================================
  // PRESENT DAYS
  // ==========================================================

  const presentDaysDetails =
    filteredDays.map(
      (day, index) => ({
        slNo: index + 1,

        // BEFORE:
        // date: day.date
        //
        // AFTER:
        // 10/09/2026

        date: formatFullDate(
          day.date,
        ),

        status:
          String(
            day.status ?? "-",
          ),
      }),
    );

  // ==========================================================
  // ABSENT DAYS
  // ==========================================================

  const absentDaysDetails =
    filteredDays.map(
      (day, index) => ({
        slNo: index + 1,

        date: formatFullDate(
          day.date,
        ),

        status:
          String(
            day.status ?? "-",
          ),

        remarks:
          day.secondaryStatus ??
          "",
      }),
    );

  // ==========================================================
  // TIME BASED DETAILS
  // ==========================================================

  const timeRows =
    filteredDays.map(
      (day, index) => {
        let time = "";

        switch (detailKey) {
          case "earlyIn":
          case "lateIn":
            time =
              day.checkIn ??
              "";
            break;

          case "earlyOut":
            time =
              day.checkOut ??
              "";
            break;

          case "overstay":
            time =
              day.overtime ??
              day.overTime ??
              "";
            break;

          default:
            time = "";
        }

        return {
          slNo: index + 1,

          date: formatFullDate(
            day.date,
          ),

          time,
        };
      },
    );

  // ==========================================================
  // MODAL
  // ==========================================================

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4 font-[Urbanist]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="overview-details-title"
    >
      <div className="max-h-[85vh] w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl font-[Urbanist]">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex items-center justify-between border-b border-black bg-slate-50 px-5 py-4 font-[Urbanist]">
          <h2
            id="overview-details-title"
            className="text-base font-bold text-slate-800 font-[Urbanist]"
          >
            {config.title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 font-[Urbanist]"
            aria-label="Close"
          >
            <X className="h-4 w-4 font-[Urbanist]" />
          </button>
        </div>

        {/* ==================================================
            TABLE
        ================================================== */}

        <div className="max-h-[55vh] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden font-[Urbanist]">
          <table className="w-full min-w-[360px] text-left text-sm font-[Urbanist]">

            {/* ==================================================
                TABLE HEADER
            ================================================== */}

            <thead className="sticky top-0 z-10 bg-sky-100 font-[Urbanist]">
              <tr>
                {config.columns.map(
                  (column) => (
                    <th
                      key={column}
                      className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-slate-700 font-[Urbanist]"
                    >
                      {column}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            {/* ==================================================
                TABLE BODY
            ================================================== */}

            <tbody className="divide-y divide-slate-100 font-[Urbanist]">

              {/* ==================================================
                  PRESENT
              ================================================== */}

              {detailKey ===
                "present" &&
                presentDaysDetails.map(
                  (row) => (
                    <tr
                      key={`${row.slNo}-${row.date}`}
                      className="hover:bg-slate-50 font-[Urbanist]"
                    >
                      <td className="px-4 py-2.5 text-slate-600 font-[Urbanist]">
                        {row.slNo}
                      </td>

                      <td className="px-4 py-2.5 text-slate-600 font-[Urbanist]">
                        {row.date}
                      </td>

                      <td className="px-4 py-2.5 font-[Urbanist]">
                        <StatusPill
                          status={
                            row.status
                          }
                        />
                      </td>
                    </tr>
                  ),
                )}

              {/* ==================================================
                  ABSENT
              ================================================== */}

              {detailKey ===
                "absent" &&
                absentDaysDetails.map(
                  (row) => (
                    <tr
                      key={`${row.slNo}-${row.date}`}
                      className="hover:bg-slate-50 font-[Urbanist]"
                    >
                      <td className="px-4 py-2.5 text-slate-600 font-[Urbanist]">
                        {row.slNo}
                      </td>

                      <td className="px-4 py-2.5 text-slate-600 font-[Urbanist]">
                        {row.date}
                      </td>

                      <td className="px-4 py-2.5 font-[Urbanist]">
                        <StatusPill
                          status={
                            row.status
                          }
                        />
                      </td>

                      <td className="min-w-[190px] px-4 py-2.5 text-sky-700 font-[Urbanist]">
                        {
                          row.remarks
                        }
                      </td>
                    </tr>
                  ),
                )}

              {/* ==================================================
                  EARLY IN / LATE IN /
                  EARLY OUT / OVERSTAY
              ================================================== */}

              {detailKey !==
                "present" &&
                detailKey !==
                  "absent" &&
                timeRows.map(
                  (row) => (
                    <tr
                      key={`${row.slNo}-${row.date}`}
                      className="hover:bg-slate-50 font-[Urbanist]"
                    >
                      <td className="px-4 py-2.5 text-slate-600 font-[Urbanist]">
                        {row.slNo}
                      </td>

                      <td className="px-4 py-2.5 text-slate-600 font-[Urbanist]">
                        {row.date}
                      </td>

                      <td className="px-4 py-2.5 text-sky-700 font-[Urbanist]">
                        {row.time}
                      </td>
                    </tr>
                  ),
                )}

              {/* ==================================================
                  NO DATA
              ================================================== */}

              {filteredDays.length ===
                0 && (
                <tr>
                  <td
                    colSpan={
                      config.columns
                        .length
                    }
                    className="px-4 py-8 text-center text-sm text-slate-400 font-[Urbanist]"
                  >
                    No data found
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="flex justify-end border-t border-black px-5 py-3 font-[Urbanist]">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-md border border-black px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 font-[Urbanist]"
          >
            <X className="h-3.5 w-3.5 font-[Urbanist]" />
            Cancel
          </button>
        </div>

      </div>
    </div>,
    document.body,
  );
}
// import type {
//   AttendanceDay,
//   AttendanceOverviewData,
// } from "../types/regularization.types";

// import type {
//   OverviewStat,
// } from "../types/attendanceOverview.types";

// // ============================================================
// // BASIC VALIDATIONS
// // ============================================================

// export function isValidEmployeeId(
//   value: string,
// ): boolean {
//   return value.trim().length > 0;
// }

// export function isValidMonth(
//   value: number,
// ): boolean {
//   return (
//     Number.isInteger(value) &&
//     value >= 1 &&
//     value <= 12
//   );
// }

// export function isValidYear(
//   value: number,
// ): boolean {
//   return (
//     Number.isInteger(value) &&
//     value >= 2000 &&
//     value <= 2100
//   );
// }

// export function isValidDate(
//   value: number,
// ): boolean {
//   return (
//     Number.isInteger(value) &&
//     value >= 1 &&
//     value <= 31
//   );
// }

// // ============================================================
// // VALUE HELPERS
// // ============================================================

// export function readValue(
//   source: unknown,
//   keys: string[],
// ): unknown {
//   if (
//     !source ||
//     typeof source !== "object"
//   ) {
//     return undefined;
//   }

//   const record =
//     source as Record<string, unknown>;

//   for (const key of keys) {
//     const value = record[key];

//     if (
//       value !== undefined &&
//       value !== null &&
//       value !== ""
//     ) {
//       return value;
//     }
//   }

//   return undefined;
// }

// export function readString(
//   source: unknown,
//   keys: string[],
//   fallback = "",
// ): string {
//   const value = readValue(
//     source,
//     keys,
//   );

//   if (
//     value === undefined ||
//     value === null
//   ) {
//     return fallback;
//   }

//   return String(value);
// }

// export function readNumber(
//   source: unknown,
//   keys: string[],
//   fallback = 0,
// ): number {
//   const value = readValue(
//     source,
//     keys,
//   );

//   if (
//     value === undefined ||
//     value === null ||
//     value === ""
//   ) {
//     return fallback;
//   }

//   if (typeof value === "number") {
//     return Number.isFinite(value)
//       ? value
//       : fallback;
//   }

//   const parsed = Number(value);

//   return Number.isFinite(parsed)
//     ? parsed
//     : fallback;
// }

// // ============================================================
// // DATE HELPERS
// // ============================================================

// export function getDateNumber(
//   value: string,
// ): number {
//   if (!value) {
//     return 0;
//   }

//   const direct = Number(value);

//   if (
//     Number.isFinite(direct) &&
//     direct >= 1 &&
//     direct <= 31
//   ) {
//     return direct;
//   }

//   const datePart = value.match(
//     /(?:^|[-/])(\d{1,2})(?:[-/]|$)/,
//   );

//   if (datePart) {
//     const parsed = Number(
//       datePart[1],
//     );

//     if (
//       parsed >= 1 &&
//       parsed <= 31
//     ) {
//       return parsed;
//     }
//   }

//   const parsedDate =
//     new Date(value);

//   if (
//     !Number.isNaN(
//       parsedDate.getTime(),
//     )
//   ) {
//     return parsedDate.getDate();
//   }

//   return 0;
// }

// export function getDayName(
//   value: unknown,
//   dateNumber: number,
//   year: number,
//   monthIndex: number,
// ): string {
//   const supplied =
//     String(value ?? "").trim();

//   if (supplied) {
//     return supplied.length > 3
//       ? supplied.slice(0, 3)
//       : supplied;
//   }

//   if (dateNumber > 0) {
//     const date = new Date(
//       year,
//       monthIndex,
//       dateNumber,
//     );

//     return date.toLocaleDateString(
//       "en-US",
//       {
//         weekday: "short",
//       },
//     );
//   }

//   return "";
// }

// // ============================================================
// // ATTENDANCE NORMALIZATION
// // ============================================================

// type MetricRecord = {
//   MetricName?: unknown;
//   [key: string]: unknown;
// };

// /**
//  * Converts backend attendance response into
//  * AttendanceDay[] used by the UI.
//  *
//  * Supported backend format:
//  *
//  * [
//  *   {
//  *     MetricName: "Shift",
//  *     Day1: "FLEX",
//  *     Day2: "FLEX",
//  *     Day6: "WO"
//  *   },
//  *   {
//  *     MetricName: "Work Status",
//  *     Day1: "LV",
//  *     Day2: "AB",
//  *     Day6: "WO"
//  *   },
//  *   {
//  *     MetricName: "Check In",
//  *     Day1: null,
//  *     Day2: null
//  *   }
//  * ]
//  */
// export function normalizeAttendanceRows(
//   apiAttendance: unknown,
//   year: number,
//   month: number,
// ): AttendanceDay[] {
//   if (!Array.isArray(apiAttendance)) {
//     return [];
//   }

//   const daysInMonth =
//     new Date(
//       year,
//       month,
//       0,
//     ).getDate();

//   const rows =
//     apiAttendance.filter(
//       (item): item is MetricRecord =>
//         Boolean(
//           item &&
//             typeof item === "object" &&
//             !Array.isArray(item),
//         ),
//     );

//   if (rows.length === 0) {
//     return [];
//   }

//   // ==========================================================
//   // BACKEND METRIC FORMAT
//   // ==========================================================

//   const hasMetricFormat =
//     rows.some(
//       (row) =>
//         typeof row.MetricName ===
//           "string" &&
//         Object.keys(row).some(
//           (key) =>
//             /^Day\d+$/i.test(key),
//         ),
//     );

//   if (hasMetricFormat) {
//     const metricMap =
//       new Map<
//         string,
//         MetricRecord
//       >();

//     rows.forEach((row) => {
//       const metricName =
//         String(
//           row.MetricName ?? "",
//         )
//           .trim()
//           .toLowerCase();

//       if (metricName) {
//         metricMap.set(
//           metricName,
//           row,
//         );
//       }
//     });

//     const getMetricValue = (
//       metricName: string,
//       day: number,
//     ): string => {
//       const row =
//         metricMap.get(
//           metricName
//             .trim()
//             .toLowerCase(),
//         );

//       if (!row) {
//         return "";
//       }

//       const value =
//         row[`Day${day}`];

//       if (
//         value === undefined ||
//         value === null
//       ) {
//         return "";
//       }

//       return String(value).trim();
//     };

//     const result: AttendanceDay[] =
//       [];

//     for (
//       let dayNumber = 1;
//       dayNumber <= daysInMonth;
//       dayNumber++
//     ) {
//       const date =
//         new Date(
//           year,
//           month - 1,
//           dayNumber,
//         );

//       const dayName =
//         date.toLocaleDateString(
//           "en-US",
//           {
//             weekday: "short",
//           },
//         );

//       // Backend values
//       const shift =
//         getMetricValue(
//           "Shift",
//           dayNumber,
//         );

//       const workStatus =
//         getMetricValue(
//           "Work Status",
//           dayNumber,
//         );

//       const checkIn =
//         getMetricValue(
//           "Check In",
//           dayNumber,
//         );

//       const checkOut =
//         getMetricValue(
//           "Check Out",
//           dayNumber,
//         );

//       const overtime =
//         getMetricValue(
//           "Over Time",
//           dayNumber,
//         );

//       const grossWorkHours =
//         getMetricValue(
//           "Gross Work hours",
//           dayNumber,
//         );

//       const workHours =
//         getMetricValue(
//           "Work Hours",
//           dayNumber,
//         );

//       const breakHours =
//         getMetricValue(
//           "Break Hours",
//           dayNumber,
//         );

//       // ======================================================
//       // WEEK OFF / HOLIDAY
//       // ======================================================

//       const isWeekOff =
//         shift.toUpperCase() ===
//           "WO" ||
//         workStatus.toUpperCase() ===
//           "WO" ||
//         shift.toUpperCase() ===
//           "W" ||
//         workStatus.toUpperCase() ===
//           "W";

//       const isHoliday =
//         shift.toUpperCase() ===
//           "GH" ||
//         shift.toUpperCase() ===
//           "H" ||
//         workStatus.toUpperCase() ===
//           "GH" ||
//         workStatus.toUpperCase() ===
//           "H";

//       // ======================================================
//       // STATUS
//       // ======================================================

//       let status =
//         workStatus || "-";

//       if (isWeekOff) {
//         status = "WO";
//       } else if (isHoliday) {
//         status = "GH";
//       }

//       result.push({
//         date: dayNumber,

//         day: dayName,

//         shift: shift || "",

//         status:
//           status as AttendanceDay["status"],

//         checkIn:
//           checkIn || undefined,

//         checkOut:
//           checkOut || undefined,

//         overtime:
//           overtime || undefined,

//         overTime:
//           overtime || undefined,

//         grossWorkHours:
//           grossWorkHours ||
//           undefined,

//         workHours:
//           workHours || undefined,

//         breakHours:
//           breakHours || undefined,

//         isWeekOff,

//         isHoliday,
//       });
//     }

//     return result;
//   }

//   // ==========================================================
//   // EMPLOYEE OVERVIEW FORMAT
//   // ==========================================================
//   //
//   // {
//   //   EmployeeID: "294663",
//   //   FullName: "...",
//   //   "1 Sat": "W",
//   //   "2 Sun": "W",
//   //   "3 Mon": "-"
//   // }
//   // ==========================================================

//   const firstRow =
//     rows[0];

//   const dayKeys =
//     Object.keys(firstRow).filter(
//       (key) =>
//         /^\d{1,2}\s+[A-Za-z]{3,9}$/.test(
//           key.trim(),
//         ),
//     );

//   if (dayKeys.length > 0) {
//     return dayKeys
//       .map(
//         (
//           key,
//         ): AttendanceDay | null => {
//           const match =
//             key
//               .trim()
//               .match(
//                 /^(\d{1,2})\s+(.+)$/,
//               );

//           if (!match) {
//             return null;
//           }

//           const dateNumber =
//             Number(match[1]);

//           if (
//             dateNumber < 1 ||
//             dateNumber >
//               daysInMonth
//           ) {
//             return null;
//           }

//           const dayName =
//             match[2].slice(0, 3);

//           const value =
//             String(
//               firstRow[key] ?? "",
//             ).trim();

//           const upperValue =
//             value.toUpperCase();

//           const isWeekOff =
//             upperValue ===
//               "WO" ||
//             upperValue === "W";

//           const isHoliday =
//             upperValue ===
//               "GH" ||
//             upperValue === "H";

//           let status =
//             value || "-";

//           if (isWeekOff) {
//             status = "WO";
//           } else if (isHoliday) {
//             status = "GH";
//           }

//           return {
//             date: dateNumber,

//             day: dayName,

//             shift: "",

//             status:
//               status as AttendanceDay["status"],

//             isWeekOff,

//             isHoliday,
//           };
//         },
//       )
//       .filter(
//         (
//           item,
//         ): item is AttendanceDay =>
//           item !== null,
//       )
//       .sort(
//         (a, b) =>
//           a.date - b.date,
//       );
//   }

//   // ==========================================================
//   // NORMAL DAY-WISE FORMAT
//   // ==========================================================

//   return rows
//     .map(
//       (
//         item,
//       ): AttendanceDay | null => {
//         const rawDate =
//           readString(
//             item,
//             [
//               "date",
//               "Date",
//               "attendanceDate",
//               "AttendanceDate",
//               "attendance_date",
//               "workDate",
//               "WorkDate",
//             ],
//           );

//         const date =
//           getDateNumber(
//             rawDate,
//           );

//         if (!date) {
//           return null;
//         }

//         const shift =
//           readString(
//             item,
//             [
//               "shift",
//               "Shift",
//               "shiftName",
//               "ShiftName",
//               "shiftCode",
//               "ShiftCode",
//             ],
//           );

//         const status =
//           readString(
//             item,
//             [
//               "status",
//               "Status",
//               "workStatus",
//               "WorkStatus",
//               "work_status",
//               "attendanceStatus",
//               "AttendanceStatus",
//             ],
//           );

//         const secondaryStatus =
//           readString(
//             item,
//             [
//               "secondaryStatus",
//               "SecondaryStatus",
//               "secondary_status",
//               "leaveStatus",
//               "LeaveStatus",
//             ],
//           );

//         const isWeekOff =
//           status.toUpperCase() ===
//             "WO" ||
//           shift.toUpperCase() ===
//             "WO" ||
//           readString(
//             item,
//             [
//               "isWeekOff",
//               "IsWeekOff",
//               "is_week_off",
//             ],
//           ).toLowerCase() ===
//             "true";

//         const isHoliday =
//           status.toUpperCase() ===
//             "GH" ||
//           status.toUpperCase() ===
//             "H" ||
//           shift.toUpperCase() ===
//             "GH" ||
//           shift.toUpperCase() ===
//             "H" ||
//           readString(
//             item,
//             [
//               "isHoliday",
//               "IsHoliday",
//               "is_holiday",
//             ],
//           ).toLowerCase() ===
//             "true";

//         let finalStatus =
//           status || "-";

//         if (isWeekOff) {
//           finalStatus = "WO";
//         } else if (isHoliday) {
//           finalStatus = "GH";
//         }

//         return {
//           date,

//           day: getDayName(
//             readValue(item, [
//               "day",
//               "Day",
//               "dayName",
//               "DayName",
//               "weekday",
//               "Weekday",
//             ]),
//             date,
//             year,
//             month - 1,
//           ),

//           shift,

//           status:
//             finalStatus as AttendanceDay["status"],

//           secondaryStatus:
//             secondaryStatus ||
//             undefined,

//           checkIn:
//             readString(
//               item,
//               [
//                 "checkIn",
//                 "CheckIn",
//                 "check_in",
//                 "inTime",
//                 "InTime",
//                 "punchIn",
//                 "PunchIn",
//               ],
//             ) || undefined,

//           checkOut:
//             readString(
//               item,
//               [
//                 "checkOut",
//                 "CheckOut",
//                 "check_out",
//                 "outTime",
//                 "OutTime",
//                 "punchOut",
//                 "PunchOut",
//               ],
//             ) || undefined,

//           overtime:
//             readString(
//               item,
//               [
//                 "overtime",
//                 "Overtime",
//                 "overTime",
//                 "OverTime",
//                 "over_time",
//               ],
//             ) || undefined,

//           overTime:
//             readString(
//               item,
//               [
//                 "overTime",
//                 "OverTime",
//                 "overtime",
//                 "Overtime",
//               ],
//             ) || undefined,

//           grossWorkHours:
//             readString(
//               item,
//               [
//                 "grossWorkHours",
//                 "GrossWorkHours",
//                 "gross_work_hours",
//                 "grossHours",
//                 "GrossHours",
//               ],
//             ) || undefined,

//           workHours:
//             readString(
//               item,
//               [
//                 "workHours",
//                 "WorkHours",
//                 "work_hours",
//               ],
//             ) || undefined,

//           breakHours:
//             readString(
//               item,
//               [
//                 "breakHours",
//                 "BreakHours",
//                 "break_hours",
//               ],
//             ) || undefined,

//           isWeekOff,

//           isHoliday,
//         };
//       },
//     )
//     .filter(
//       (
//         item,
//       ): item is AttendanceDay =>
//         item !== null,
//     )
//     .sort(
//       (a, b) =>
//         a.date - b.date,
//     );
// }

// // ============================================================
// // OVERVIEW STATS
// // ============================================================

// export function getOverviewStats(
//   overview:
//     | AttendanceOverviewData
//     | null
//     | undefined,
//   records: AttendanceDay[] = [],
// ): OverviewStat[] {
//   // ==========================================================
//   // IMPORTANT
//   // No hardcoded attendance numbers.
//   //
//   // If backend provides totals, use them.
//   // Otherwise calculate from the actual records.
//   // ==========================================================

//   const totalDays =
//     readNumber(
//       overview,
//       [
//         "totalDays",
//         "TotalDays",
//         "totalWorkingDays",
//         "TotalWorkingDays",
//       ],
//       records.filter(
//         (item) =>
//           !item.isWeekOff &&
//           !item.isHoliday,
//       ).length,
//     );

//   const presentDays =
//     readNumber(
//       overview,
//       [
//         "presentDays",
//         "PresentDays",
//         "present_days",
//         "present",
//         "Present",
//       ],
//       records.filter(
//         (item) =>
//           String(
//             item.status ?? "",
//           ).toUpperCase() === "P",
//       ).length,
//     );

//   const absentDays =
//     readNumber(
//       overview,
//       [
//         "absentDays",
//         "AbsentDays",
//         "absent_days",
//         "absent",
//         "Absent",
//       ],
//       records.filter(
//         (item) =>
//           String(
//             item.status ?? "",
//           ).toUpperCase() === "AB",
//       ).length,
//     );

//   const earlyIn =
//     readNumber(
//       overview,
//       [
//         "earlyIn",
//         "EarlyIn",
//         "earlyInCount",
//         "EarlyInCount",
//         "early_in",
//       ],
//       0,
//     );

//   const lateIn =
//     readNumber(
//       overview,
//       [
//         "lateIn",
//         "LateIn",
//         "lateInCount",
//         "LateInCount",
//         "late_in",
//       ],
//       0,
//     );

//   const earlyOut =
//     readNumber(
//       overview,
//       [
//         "earlyOut",
//         "EarlyOut",
//         "earlyOutCount",
//         "EarlyOutCount",
//         "early_out",
//       ],
//       0,
//     );

//   const overstay =
//     readNumber(
//       overview,
//       [
//         "overstay",
//         "Overstay",
//         "overstayCount",
//         "OverstayCount",
//       ],
//       0,
//     );

//   const percentage = (
//     value: number,
//   ): number => {
//     if (
//       !Number.isFinite(
//         totalDays,
//       ) ||
//       totalDays <= 0
//     ) {
//       return 0;
//     }

//     return Math.min(
//       100,
//       Math.max(
//         0,
//         Math.round(
//           (value /
//             totalDays) *
//             100,
//         ),
//       ),
//     );
//   };

//   return [
//     {
//       label: "Present Days",
//       value: String(
//         presentDays,
//       ),
//       total: `${totalDays} Days`,
//       percent:
//         percentage(
//           presentDays,
//         ),
//       icon: null,
//       barColor:
//         "bg-emerald-500",
//       valueColor:
//         "text-emerald-600",
//     },

//     {
//       label: "Absent Days",
//       value: String(
//         absentDays,
//       ),
//       total: `${totalDays} Days`,
//       percent:
//         percentage(
//           absentDays,
//         ),
//       icon: null,
//       barColor:
//         "bg-red-500",
//       valueColor:
//         "text-red-600",
//     },

//     {
//       label: "Early In",
//       value: String(
//         earlyIn,
//       ),
//       total: `${totalDays} Days`,
//       percent:
//         percentage(
//           earlyIn,
//         ),
//       icon: null,
//       barColor:
//         "bg-emerald-500",
//       valueColor:
//         "text-emerald-600",
//     },

//     {
//       label: "Late In",
//       value: String(
//         lateIn,
//       ),
//       total: `${totalDays} Days`,
//       percent:
//         percentage(
//           lateIn,
//         ),
//       icon: null,
//       barColor:
//         "bg-red-500",
//       valueColor:
//         "text-red-600",
//     },

//     {
//       label: "Early Out",
//       value: String(
//         earlyOut,
//       ),
//       total: `${totalDays} Days`,
//       percent:
//         percentage(
//           earlyOut,
//         ),
//       icon: null,
//       barColor:
//         "bg-red-500",
//       valueColor:
//         "text-red-600",
//     },

//     {
//       label: "Overstay",
//       value: String(
//         overstay,
//       ),
//       total: `${totalDays} Days`,
//       percent:
//         percentage(
//           overstay,
//         ),
//       icon: null,
//       barColor:
//         "bg-blue-500",
//       valueColor:
//         "text-blue-600",
//     },
//   ];
// }



import type {
  AttendanceDay,
  AttendanceOverviewData,
} from "../types/regularization.types";

import type {
  OverviewStat,
} from "../types/attendanceOverview.types";

// ============================================================
// BASIC VALIDATIONS
// ============================================================

export function isValidEmployeeId(
  value: string,
): boolean {
  return value.trim().length > 0;
}

export function isValidMonth(
  value: number,
): boolean {
  return (
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 12
  );
}

export function isValidYear(
  value: number,
): boolean {
  return (
    Number.isInteger(value) &&
    value >= 2000 &&
    value <= 2100
  );
}

export function isValidDate(
  value: number,
): boolean {
  return (
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 31
  );
}

// ============================================================
// VALUE HELPERS
// ============================================================

export function readValue(
  source: unknown,
  keys: string[],
): unknown {
  if (
    !source ||
    typeof source !== "object"
  ) {
    return undefined;
  }

  const record =
    source as Record<string, unknown>;

  for (const key of keys) {
    const value = record[key];

    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      return value;
    }
  }

  return undefined;
}

export function readString(
  source: unknown,
  keys: string[],
  fallback = "",
): string {
  const value = readValue(
    source,
    keys,
  );

  if (
    value === undefined ||
    value === null
  ) {
    return fallback;
  }

  return String(value).trim();
}

export function readNumber(
  source: unknown,
  keys: string[],
  fallback = 0,
): number {
  const value = readValue(
    source,
    keys,
  );

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return fallback;
  }

  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : fallback;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : fallback;
}

// ============================================================
// DATE HELPERS
// ============================================================

export function getDateNumber(
  value: string,
): number {
  if (!value) {
    return 0;
  }

  const text =
    String(value).trim();

  // 1, 2, 9, 30
  if (/^\d{1,2}$/.test(text)) {
    const direct =
      Number(text);

    if (
      direct >= 1 &&
      direct <= 31
    ) {
      return direct;
    }
  }

  // YYYY-MM-DD
  const isoMatch =
    text.match(
      /^(\d{4})-(\d{1,2})-(\d{1,2})/,
    );

  if (isoMatch) {
    return Number(
      isoMatch[3],
    );
  }

  // DD/MM/YYYY
  // DD-MM-YYYY
  const dayFirstMatch =
    text.match(
      /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/,
    );

  if (dayFirstMatch) {
    return Number(
      dayFirstMatch[1],
    );
  }

  const parsedDate =
    new Date(text);

  if (
    !Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return parsedDate.getDate();
  }

  return 0;
}

export function getDayName(
  value: unknown,
  dateNumber: number,
  year: number,
  monthIndex: number,
): string {
  const supplied =
    String(value ?? "").trim();

  if (supplied) {
    return supplied.length > 3
      ? supplied.slice(0, 3)
      : supplied;
  }

  if (dateNumber > 0) {
    const date =
      new Date(
        year,
        monthIndex,
        dateNumber,
      );

    return date.toLocaleDateString(
      "en-US",
      {
        weekday: "short",
      },
    );
  }

  return "";
}

// ============================================================
// ATTENDANCE NORMALIZATION
// ============================================================

type MetricRecord = {
  MetricName?: unknown;
  [key: string]: unknown;
};

/**
 * Converts all supported backend attendance formats
 * into the monthly AttendanceDay[] used by the UI.
 *
 * IMPORTANT:
 *
 * The UI must ALWAYS receive every day of the selected month.
 *
 * Example September:
 *
 * 1 | 2 | 3 | 4 | 5 | ... | 30
 *
 * If backend returns two records for day 9,
 * they are merged into ONE day 9.
 */
export function normalizeAttendanceRows(
  apiAttendance: unknown,
  year: number,
  month: number,
): AttendanceDay[] {
  const daysInMonth =
    new Date(
      year,
      month,
      0,
    ).getDate();

  // ==========================================================
  // CREATE COMPLETE MONTH
  // ==========================================================

  const monthlyDays: AttendanceDay[] =
    [];

  for (
    let dayNumber = 1;
    dayNumber <= daysInMonth;
    dayNumber++
  ) {
    const date =
      new Date(
        year,
        month - 1,
        dayNumber,
      );

    monthlyDays.push({
      date: dayNumber,

      day:
        date.toLocaleDateString(
          "en-US",
          {
            weekday: "short",
          },
        ),

      shift: "",

      status: "-",

      checkIn:
        undefined,

      checkOut:
        undefined,

      overtime:
        undefined,

      overTime:
        undefined,

      grossWorkHours:
        undefined,

      workHours:
        undefined,

      breakHours:
        undefined,

      isWeekOff:
        false,

      isHoliday:
        false,
    });
  }

  // ==========================================================
  // INVALID / EMPTY API RESPONSE
  // ==========================================================

  let attendanceRows: unknown[] = [];

  if (Array.isArray(apiAttendance)) {
    attendanceRows = apiAttendance;
  } else if (apiAttendance && typeof apiAttendance === "object") {
    const response = apiAttendance as Record<string, unknown>;

    if (Array.isArray(response.data)) {
      attendanceRows = response.data;
    } else if (Array.isArray(response.result)) {
      attendanceRows = response.result;
    } else if (Array.isArray(response.recordset)) {
      attendanceRows = response.recordset;
    } else if (
      Array.isArray(response.recordsets) &&
      Array.isArray(response.recordsets[0])
    ) {
      attendanceRows = response.recordsets[0] as unknown[];
    }
  }

  const rows =
    attendanceRows.filter(
      (
        item,
      ): item is MetricRecord =>
        Boolean(
          item &&
            typeof item ===
              "object" &&
            !Array.isArray(item),
        ),
    );

  if (rows.length === 0) {
    return monthlyDays;
  }

  // ==========================================================
  // FORMAT 1
  //
  // METRIC FORMAT
  //
  // {
  //   MetricName: "Shift",
  //   Day1: "GS",
  //   Day2: "GS",
  //   Day3: "GS"
  // }
  // ==========================================================

  const hasMetricFormat =
    rows.some(
      (row) =>
        typeof row.MetricName ===
          "string" &&
        Object.keys(row).some(
          (key) =>
            /^Day\d+$/i.test(key),
        ),
    );

  if (hasMetricFormat) {
    const metricMap =
      new Map<
        string,
        MetricRecord
      >();

    rows.forEach(
      (row) => {
        const metricName =
          String(
            row.MetricName ??
              "",
          )
            .trim()
            .toLowerCase();

        if (metricName) {
          metricMap.set(
            metricName,
            row,
          );
        }
      },
    );

    const getMetricValue =
      (
        names: string[],
        day: number,
      ): string => {
        for (
          const name of names
        ) {
          const row =
            metricMap.get(
              name
                .trim()
                .toLowerCase(),
            );

          if (!row) {
            continue;
          }

          const value =
            row[
              `Day${day}`
            ];

          if (
            value !==
              undefined &&
            value !== null &&
            String(value).trim() !==
              ""
          ) {
            return String(
              value,
            ).trim();
          }
        }

        return "";
      };

    for (
      let dayNumber = 1;
      dayNumber <=
        daysInMonth;
      dayNumber++
    ) {
      const shift =
        getMetricValue(
          ["Shift"],
          dayNumber,
        );

      const workStatus =
        getMetricValue(
          [
            "Work Status",
            "WorkStatus",
            "Status",
          ],
          dayNumber,
        );

      const checkIn =
        getMetricValue(
          [
            "Check In",
            "CheckIn",
          ],
          dayNumber,
        );

      const checkOut =
        getMetricValue(
          [
            "Check Out",
            "CheckOut",
          ],
          dayNumber,
        );

      const overtime =
        getMetricValue(
          [
            "Over Time",
            "Overtime",
            "OverTime",
            "OT",
          ],
          dayNumber,
        );

      const grossWorkHours =
        getMetricValue(
          [
            "Gross Work hours",
            "Gross Work Hours",
            "GrossWorkHours",
            "GrossWorkhours",
          ],
          dayNumber,
        );

      const workHours =
        getMetricValue(
          [
            "Work Hours",
            "WorkHours",
          ],
          dayNumber,
        );

      const breakHours =
        getMetricValue(
          [
            "Break Hours",
            "BreakHours",
          ],
          dayNumber,
        );

      const upperShift =
        shift.toUpperCase();

      const upperStatus =
        workStatus.toUpperCase();

      const isWeekOff =
        upperShift === "WO" ||
        upperShift === "W" ||
        upperStatus === "WO" ||
        upperStatus === "W";

      const isHoliday =
        upperShift === "GH" ||
        upperShift === "H" ||
        upperStatus === "GH" ||
        upperStatus === "H";

      let finalStatus =
        workStatus || "-";

      if (isWeekOff) {
        finalStatus = "WO";
      } else if (isHoliday) {
        finalStatus = "GH";
      }

      monthlyDays[
        dayNumber - 1
      ] = {
        ...monthlyDays[
          dayNumber - 1
        ],

        shift,

        status:
          finalStatus as AttendanceDay["status"],

        checkIn:
          checkIn ||
          undefined,

        checkOut:
          checkOut ||
          undefined,

        overtime:
          overtime ||
          undefined,

        overTime:
          overtime ||
          undefined,

        grossWorkHours:
          grossWorkHours ||
          undefined,

        workHours:
          workHours ||
          undefined,

        breakHours:
          breakHours ||
          undefined,

        isWeekOff,

        isHoliday,
      };
    }

    return monthlyDays;
  }

  // ==========================================================
  // FORMAT 2
  //
  // EMPLOYEE OVERVIEW FORMAT
  //
  // {
  //   EmployeeID: "294623",
  //   FullName: "Tharun Nagarjunapu",
  //   "1 Sat": "WO",
  //   "2 Sun": "WO",
  //   "3 Mon": "P"
  // }
  // ==========================================================

  const firstRow =
    rows[0];

  const dayKeys =
    Object.keys(
      firstRow,
    ).filter(
      (key) =>
        /^\d{1,2}\s+[A-Za-z]{3,9}$/.test(
          key.trim(),
        ),
    );

  if (
    dayKeys.length > 0
  ) {
    for (
      const key of dayKeys
    ) {
      const match =
        key
          .trim()
          .match(
            /^(\d{1,2})\s+(.+)$/,
          );

      if (!match) {
        continue;
      }

      const dateNumber =
        Number(match[1]);

      if (
        dateNumber < 1 ||
        dateNumber >
          daysInMonth
      ) {
        continue;
      }

      const value =
        String(
          firstRow[key] ??
            "",
        ).trim();

      const upperValue =
        value.toUpperCase();

      const isWeekOff =
        upperValue === "WO" ||
        upperValue === "W";

      const isHoliday =
        upperValue === "GH" ||
        upperValue === "H";

      let status =
        value || "-";

      if (isWeekOff) {
        status = "WO";
      } else if (isHoliday) {
        status = "GH";
      }

      monthlyDays[
        dateNumber - 1
      ] = {
        ...monthlyDays[
          dateNumber - 1
        ],

        status:
          status as AttendanceDay["status"],

        shift:
          isWeekOff
            ? "WO"
            : isHoliday
            ? "GH"
            : "",

        isWeekOff,

        isHoliday,
      };
    }

    return monthlyDays;
  }

  // ==========================================================
  // FORMAT 3
  //
  // NORMAL DAY-WISE FORMAT
  //
  // THIS IS THE IMPORTANT FIX.
  //
  // If API returns:
  //
  // 09/09/2026
  // 09/09/2026
  //
  // both records are merged into ONE
  // September 9 column.
  // ==========================================================

  rows.forEach(
    (item) => {
      const rawDate =
        readString(
          item,
          [
            "date",
            "Date",
            "attendanceDate",
            "AttendanceDate",
            "attendance_date",
            "workDate",
            "WorkDate",
            "Attendance_Date",
          ],
        );

      const dateNumber =
        getDateNumber(
          rawDate,
        );

      if (
        dateNumber < 1 ||
        dateNumber >
          daysInMonth
      ) {
        return;
      }

      const index =
        dateNumber - 1;

      const existing =
        monthlyDays[index];

      // ------------------------------------------------------
      // SHIFT
      // ------------------------------------------------------

      const shift =
        readString(
          item,
          [
            "shift",
            "Shift",
            "shiftName",
            "ShiftName",
            "shiftCode",
            "ShiftCode",
          ],
        );

      // ------------------------------------------------------
      // STATUS
      // ------------------------------------------------------

      const status =
        readString(
          item,
          [
            "status",
            "Status",
            "workStatus",
            "WorkStatus",
            "work_status",
            "attendanceStatus",
            "AttendanceStatus",
          ],
        );

      const secondaryStatus =
        readString(
          item,
          [
            "secondaryStatus",
            "SecondaryStatus",
            "secondary_status",
            "leaveStatus",
            "LeaveStatus",
          ],
        );

      // ------------------------------------------------------
      // CHECK IN
      // ------------------------------------------------------

      const checkIn =
        readString(
          item,
          [
            "checkIn",
            "CheckIn",
            "check_in",
            "inTime",
            "InTime",
            "punchIn",
            "PunchIn",
          ],
        );

      // ------------------------------------------------------
      // CHECK OUT
      // ------------------------------------------------------

      const checkOut =
        readString(
          item,
          [
            "checkOut",
            "CheckOut",
            "check_out",
            "outTime",
            "OutTime",
            "punchOut",
            "PunchOut",
          ],
        );

      // ------------------------------------------------------
      // OVER TIME
      // ------------------------------------------------------

      const overtime =
        readString(
          item,
          [
            "overtime",
            "Overtime",
            "overTime",
            "OverTime",
            "over_time",
            "otHours",
            "OTHrs",
          ],
        );

      // ------------------------------------------------------
      // GROSS WORK HOURS
      // ------------------------------------------------------

      const grossWorkHours =
        readString(
          item,
          [
            "grossWorkHours",
            "GrossWorkHours",
            "gross_work_hours",
            "grossHours",
            "GrossHours",
            "Gross Work hours",
          ],
        );

      // ------------------------------------------------------
      // WORK HOURS
      // ------------------------------------------------------

      const workHours =
        readString(
          item,
          [
            "workHours",
            "WorkHours",
            "work_hours",
          ],
        );

      // ------------------------------------------------------
      // BREAK HOURS
      // ------------------------------------------------------

      const breakHours =
        readString(
          item,
          [
            "breakHours",
            "BreakHours",
            "break_hours",
          ],
        );

      // ------------------------------------------------------
      // WEEK OFF
      // ------------------------------------------------------

      const isWeekOff =
        status.toUpperCase() ===
          "WO" ||
        status.toUpperCase() ===
          "W" ||
        shift.toUpperCase() ===
          "WO" ||
        shift.toUpperCase() ===
          "W" ||
        readString(
          item,
          [
            "isWeekOff",
            "IsWeekOff",
            "is_week_off",
          ],
        ).toLowerCase() ===
          "true";

      // ------------------------------------------------------
      // HOLIDAY
      // ------------------------------------------------------

      const isHoliday =
        status.toUpperCase() ===
          "GH" ||
        status.toUpperCase() ===
          "H" ||
        shift.toUpperCase() ===
          "GH" ||
        shift.toUpperCase() ===
          "H" ||
        readString(
          item,
          [
            "isHoliday",
            "IsHoliday",
            "is_holiday",
          ],
        ).toLowerCase() ===
          "true";

      // ------------------------------------------------------
      // FINAL STATUS
      // ------------------------------------------------------

      let finalStatus =
        status || "-";

      if (isWeekOff) {
        finalStatus = "WO";
      } else if (isHoliday) {
        finalStatus = "GH";
      }

      // ------------------------------------------------------
      // MERGE INTO EXISTING DAY
      // ------------------------------------------------------

      monthlyDays[index] = {
        ...existing,

        shift:
          shift ||
          existing.shift,

        status:
          finalStatus !== "-"
            ? (finalStatus as AttendanceDay["status"])
            : existing.status,

        secondaryStatus:
          secondaryStatus ||
          existing.secondaryStatus,

        checkIn:
          checkIn ||
          existing.checkIn,

        checkOut:
          checkOut ||
          existing.checkOut,

        overtime:
          overtime ||
          existing.overtime,

        overTime:
          overtime ||
          existing.overTime,

        grossWorkHours:
          grossWorkHours ||
          existing.grossWorkHours,

        workHours:
          workHours ||
          existing.workHours,

        breakHours:
          breakHours ||
          existing.breakHours,

        isWeekOff:
          isWeekOff ||
          existing.isWeekOff,

        isHoliday:
          isHoliday ||
          existing.isHoliday,
      };
    },
  );

  // ==========================================================
  // RETURN COMPLETE MONTH
  // ==========================================================

  return monthlyDays;
}

// ============================================================
// OVERVIEW STATS
// ============================================================

export function getOverviewStats(
  overview:
    | AttendanceOverviewData
    | null
    | undefined,
  records: AttendanceDay[] = [],
): OverviewStat[] {
  const overviewSource: unknown = Array.isArray(overview)
    ? overview.reduce<Record<string, unknown>>((summary, item) => {
        if (!item || typeof item !== "object") {
          return summary;
        }

        const row = item as Record<string, unknown>;
        const classification = String(row.Classification ?? "")
          .toLowerCase()
          .replace(/[^a-z]/g, "");
        const keyByClassification: Record<string, string> = {
          totalhours: "totalHours",
          avghoursperday: "averageHoursPerDay",
          othours: "overtimeHours",
          presentdays: "presentDays",
          absentdays: "absentDays",
          earlyin: "earlyIn",
          latein: "lateIn",
          earlyout: "earlyOut",
          overstay: "overstay",
        };
        const key = keyByClassification[classification];
        const value = String(row.Value ?? "");
        const [amount, total] = value.split("/").map((part) => part.trim());

        if (key) {
          const numericAmount = Number(amount);
          summary[key] = Number.isFinite(numericAmount)
            ? numericAmount
            : amount;
        }

        const numericTotal = Number(total);
        if (Number.isFinite(numericTotal)) {
          summary.totalDays = numericTotal;
        }

        return summary;
      }, {})
    : overview;

  const totalDays =
    readNumber(
      overviewSource,
      [
        "totalDays",
        "TotalDays",
        "totalWorkingDays",
        "TotalWorkingDays",
      ],
      records.filter(
        (item) =>
          !item.isWeekOff &&
          !item.isHoliday,
      ).length,
    );

  const presentDays =
    readNumber(
      overviewSource,
      [
        "presentDays",
        "PresentDays",
        "present_days",
        "present",
        "Present",
      ],
      records.filter(
        (item) =>
          String(
            item.status ?? "",
          ).toUpperCase() ===
          "P",
      ).length,
    );

  const absentDays =
    readNumber(
      overviewSource,
      [
        "absentDays",
        "AbsentDays",
        "absent_days",
        "absent",
        "Absent",
      ],
      records.filter(
        (item) =>
          String(
            item.status ?? "",
          ).toUpperCase() ===
          "AB",
      ).length,
    );

  const earlyIn =
    readNumber(
      overviewSource,
      [
        "earlyIn",
        "EarlyIn",
        "earlyInCount",
        "EarlyInCount",
        "early_in",
      ],
      0,
    );

  const lateIn =
    readNumber(
      overviewSource,
      [
        "lateIn",
        "LateIn",
        "lateInCount",
        "LateInCount",
        "late_in",
      ],
      0,
    );

  const earlyOut =
    readNumber(
      overviewSource,
      [
        "earlyOut",
        "EarlyOut",
        "earlyOutCount",
        "EarlyOutCount",
        "early_out",
      ],
      0,
    );

  const overstay =
    readNumber(
      overviewSource,
      [
        "overstay",
        "Overstay",
        "overstayCount",
        "OverstayCount",
      ],
      0,
    );

  const percentage =
    (value: number): number => {
      if (
        !Number.isFinite(
          totalDays,
        ) ||
        totalDays <= 0
      ) {
        return 0;
      }

      return Math.min(
        100,
        Math.max(
          0,
          Math.round(
            (value /
              totalDays) *
              100,
          ),
        ),
      );
    };

  return [
    {
      label:
        "Present Days",
      value:
        String(presentDays),
      total:
        `${totalDays} Days`,
      percent:
        percentage(
          presentDays,
        ),
      icon: null,
      barColor:
        "bg-emerald-500",
      valueColor:
        "text-emerald-600",
    },

    {
      label:
        "Absent Days",
      value:
        String(absentDays),
      total:
        `${totalDays} Days`,
      percent:
        percentage(
          absentDays,
        ),
      icon: null,
      barColor:
        "bg-red-500",
      valueColor:
        "text-red-600",
    },

    {
      label:
        "Early In",
      value:
        String(earlyIn),
      total:
        `${totalDays} Days`,
      percent:
        percentage(
          earlyIn,
        ),
      icon: null,
      barColor:
        "bg-emerald-500",
      valueColor:
        "text-emerald-600",
    },

    {
      label:
        "Late In",
      value:
        String(lateIn),
      total:
        `${totalDays} Days`,
      percent:
        percentage(
          lateIn,
        ),
      icon: null,
      barColor:
        "bg-red-500",
      valueColor:
        "text-red-600",
    },

    {
      label:
        "Early Out",
      value:
        String(earlyOut),
      total:
        `${totalDays} Days`,
      percent:
        percentage(
          earlyOut,
        ),
      icon: null,
      barColor:
        "bg-red-500",
      valueColor:
        "text-red-600",
    },

    {
      label:
        "Overstay",
      value:
        String(overstay),
      total:
        `${totalDays} Days`,
      percent:
        percentage(
          overstay,
        ),
      icon: null,
      barColor:
        "bg-blue-500",
      valueColor:
        "text-blue-600",
    },
  ];
}
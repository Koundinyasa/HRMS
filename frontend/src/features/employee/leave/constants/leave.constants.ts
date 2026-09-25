

 
// export const MAX_REASON_LENGTH = 500;
 
 
// export const BACKDATE_ALLOWED_DAYS = 7;
 
 
// export const toIsoDate = (date: Date) => {
//   const year = date.getFullYear();
//   const month = `${date.getMonth() + 1}`.padStart(2, "0");
//   const day = `${date.getDate()}`.padStart(2, "0");
 
//   return `${year}-${month}-${day}`;
// };
 
// export const todayIso = () => toIsoDate(new Date());
 
 
// export const isWeekendIso = (iso: string) => {
//   if (!iso) return false;
 
//   const day = new Date(`${iso}T00:00:00`).getDay();
 
//   return day === 0 || day === 6;
// };
 
// export const minFromDateIso = () => {
//   const date = new Date();
//   date.setDate(date.getDate() - BACKDATE_ALLOWED_DAYS);
 
//   return toIsoDate(date);
// };
 
// export const maxApplyDateIso = () => {
//   const date = new Date();
//   date.setFullYear(date.getFullYear() + 1);
 
//   return toIsoDate(date);
// };
 
// export const MATERNITY_LEAVE_ID = "4";
// export const PATERNITY_LEAVE_ID = "5";
 
// export const MATERNITY_MAX_DAYS = 180;
// export const PATERNITY_MAX_DAYS = 15;
 
 
// export const currentYearStartIso = () => {
//   const year = new Date().getFullYear();
 
//   return `${year}-01-01`;
// };
 
// // Counts weekdays (Mon–Fri) between two ISO dates, inclusive.
// export const countWeekdays = (fromIso: string, toIso: string) => {
//   if (!fromIso || !toIso) return 0;
 
//   const start = new Date(`${fromIso}T00:00:00`);
//   const end = new Date(`${toIso}T00:00:00`);
 
//   if (end < start) return 0;
 
//   let count = 0;
//   const cursor = new Date(start);
 
//   while (cursor <= end) {
//     const day = cursor.getDay();
//     if (day !== 0 && day !== 6) count++;
//     cursor.setDate(cursor.getDate() + 1);
//   }
 
//   return count;
// };
 
// // 🔴 CHANGED: NEW HELPER -> counts all days in the range EXCEPT holidays
// // (Saturday / Sunday are NOT skipped here - weekend logic is unchanged)
// export const countDaysExcludingHolidays = (
//   fromIso: string,
//   toIso: string,
//   holidayIsos: Set<string>
// ) => {
//   if (!fromIso || !toIso) return 0;
 
//   const start = new Date(`${fromIso}T00:00:00`);
//   const end = new Date(`${toIso}T00:00:00`);
 
//   if (end < start) return 0;
 
//   let count = 0;
//   const cursor = new Date(start);
 
//   while (cursor <= end) {
//     if (!holidayIsos.has(toIsoDate(cursor))) count++;
//     cursor.setDate(cursor.getDate() + 1);
//   }
 
//   return count;
// };
 
// export const MAX_FILE_SIZE = 5 * 1024 * 1024;
 
// export const ALLOWED_FILE_TYPES = [
//   "application/pdf",
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   "image/png",
//   "image/jpeg",
// ];
 export const MAX_REASON_LENGTH = 500;
 
 
export const BACKDATE_ALLOWED_DAYS = 7;
 
 export const MIN_LEAVE_DATE_ISO = "2026-01-01";
export const toIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
 
  return `${year}-${month}-${day}`;
};
 
export const todayIso = () => toIsoDate(new Date());
 
 
export const isWeekendIso = (iso: string) => {
  if (!iso) return false;
 
  const day = new Date(`${iso}T00:00:00`).getDay();
 
  return day === 0 || day === 6;
};
 
export const minFromDateIso = () => {
  const date = new Date();
  date.setDate(date.getDate() - BACKDATE_ALLOWED_DAYS);
 
  return toIsoDate(date);
};
 
export const maxApplyDateIso = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 1);
 
  return toIsoDate(date);
};
 
export const MATERNITY_LEAVE_ID = "4";
export const PATERNITY_LEAVE_ID = "5";
 
export const MATERNITY_MAX_DAYS = 180;
export const PATERNITY_MAX_DAYS = 15;
 
 
export const currentYearStartIso = () => {
  const year = new Date().getFullYear();
 
  return `${year}-01-01`;
};
 
// Counts weekdays (Mon–Fri) between two ISO dates, inclusive.
export const countWeekdays = (fromIso: string, toIso: string) => {
  if (!fromIso || !toIso) return 0;
 
  const start = new Date(`${fromIso}T00:00:00`);
  const end = new Date(`${toIso}T00:00:00`);
 
  if (end < start) return 0;
 
  let count = 0;
  const cursor = new Date(start);
 
  while (cursor <= end) {
    const day = cursor.getDay();
    if (day !== 0 && day !== 6) count++;
    cursor.setDate(cursor.getDate() + 1);
  }
 
  return count;
};
 
export const MAX_FILE_SIZE = 5 * 1024 * 1024;
 
export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];
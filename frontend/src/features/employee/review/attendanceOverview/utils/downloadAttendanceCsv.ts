import type { AttendanceDay } from "../types/regularization.types";

/** Builds a CSV of the month's days and starts a browser download. Throws if the download cannot start. */
export function downloadAttendanceCsv(days: AttendanceDay[], fileName: string): void {
  const header =
    "Date,Day,Shift,Status,Check In,Check Out,Gross Work Hours,Work Hours,Break Hours";

  const rows = days.map(
    (day) =>
      [
        day.date,
        day.day,
        day.shift,
        day.status,
        day.checkIn ?? "",
        day.checkOut ?? "",
        day.grossWorkHours ?? "",
        day.workHours ?? "",
        day.breakHours ?? "",
      ].join(","),
  );

  const csv = [
    header,
    ...rows,
  ].join("\n");

  const blob =
    new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

  const url =
    URL.createObjectURL(
      blob,
    );

  const anchor =
    document.createElement(
      "a",
    );

  anchor.href = url;

  anchor.download = fileName;

  document.body.appendChild(
    anchor,
  );

  anchor.click();

  document.body.removeChild(
    anchor,
  );

  window.setTimeout(() => {
    URL.revokeObjectURL(
      url,
    );
  }, 5000);
}

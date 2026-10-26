import * as XLSX from "xlsx";

import { LEAVE_DAILY_EXPORT_FILE_NAME } from "../constants/leaveDaily.constants";
import type { LeaveDailyRow } from "../types/leaveDaily.types";

export function exportLeaveDailyExcel(rows: LeaveDailyRow[]) {
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Daily");
  XLSX.writeFile(workbook, `${LEAVE_DAILY_EXPORT_FILE_NAME}.xlsx`);
}

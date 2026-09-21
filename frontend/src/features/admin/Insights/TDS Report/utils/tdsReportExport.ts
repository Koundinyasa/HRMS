import * as XLSX from "xlsx";

export const prepareTDSReportData = (
  columns: string[],
  rows: Record<string, unknown>[],
) => {
  return rows.map((row) => {
    const formattedRow: Record<string, unknown> = {};

    columns.forEach((column) => {
      formattedRow[column] = row[column] ?? "";
    });

    return formattedRow;
  });
};

export const downloadTDSReportExcel = (
  reportName: string,
  columns: string[],
  rows: Record<string, unknown>[],
) => {
  const worksheet = rows.length
    ? XLSX.utils.json_to_sheet(prepareTDSReportData(columns, rows), {
        header: columns,
      })
    : XLSX.utils.aoa_to_sheet([
        columns,
        ["No data found", ...columns.slice(1).map(() => "")],
      ]);

  worksheet["!cols"] = columns.map((column) => ({
    wch: Math.max(column.length + 2, 15),
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "TDS Report");
  XLSX.writeFile(workbook, `${reportName.replace(/\s+/g, "_")}.xlsx`);
};
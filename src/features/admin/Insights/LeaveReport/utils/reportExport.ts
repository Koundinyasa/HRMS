// utils/reportExport.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

interface ExportColumn {
  key: string;
  label: string;
}

export function exportRowsToPdf(
  title: string,
  columns: ExportColumn[],
  rows: Record<string, unknown>[]
) {
  const doc = new jsPDF({ orientation: "landscape" });
  doc.setFontSize(14);
  doc.text(title, 14, 15);

  autoTable(doc, {
    startY: 22,
    head: [columns.map((c) => c.label)],
    body: rows.map((row) => columns.map((c) => String(row[c.key] ?? "-"))),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [154, 52, 18] },
  });

  doc.save(`${title.replace(/\s+/g, "_")}.pdf`);
}

export function exportRowsToExcel(
  title: string,
  columns: ExportColumn[],
  rows: Record<string, unknown>[]
) {
  const worksheetData = rows.map((row) => {
    const obj: Record<string, unknown> = {};
    columns.forEach((c) => {
      obj[c.label] = row[c.key] ?? "";
    });
    return obj;
  });

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  XLSX.writeFile(workbook, `${title.replace(/\s+/g, "_")}.xlsx`);
}
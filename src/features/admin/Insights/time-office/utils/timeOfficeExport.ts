import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export interface ExportColumn {
  header: string;
  key: string;
}

interface ExportOptions {
  title: string;
  columns: ExportColumn[];
  rows: object[];
  fromDate?: string;
  toDate?: string;
}

const valueFor = (value: unknown) =>
  value === null || value === undefined || value === "" ? "" : String(value);

const cellValue = (row: object, key: string) =>
  (row as Record<string, unknown>)[key];

const filename = ({ title, fromDate, toDate }: ExportOptions, extension: string) => {
  const date = fromDate && toDate ? `${fromDate}_${toDate}` : new Date().toISOString().slice(0, 10);
  return `${title.replace(/\s+/g, "_")}_${date}.${extension}`;
};

export function exportTimeOfficePdf(options: ExportOptions) {
  const { title, columns, rows, fromDate, toDate } = options;
  const doc = new jsPDF({ orientation: columns.length > 7 ? "landscape" : "portrait" });
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  if (fromDate && toDate) {
    doc.setFontSize(10);
    doc.text(`From Date: ${fromDate}`, 14, 22);
    doc.text(`To Date: ${toDate}`, 14, 28);
  }
  autoTable(doc, {
    head: [columns.map(({ header }) => header)],
    body: rows.map((row) => columns.map(({ key }) => valueFor(cellValue(row, key)))),
    startY: fromDate && toDate ? 34 : 22,
    styles: { fontSize: 7, cellPadding: 2 },
  });
  doc.save(filename(options, "pdf"));
}

export function exportTimeOfficeExcel(options: ExportOptions) {
  const { columns, rows } = options;
  const sheet = XLSX.utils.aoa_to_sheet([
    columns.map(({ header }) => header),
    ...rows.map((row) => columns.map(({ key }) => valueFor(cellValue(row, key)))),
  ]);
  sheet["!cols"] = columns.map(({ header }) => ({ wch: Math.max(header.length + 2, 15) }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Time Office");
  XLSX.writeFile(workbook, filename(options, "xlsx"));
}

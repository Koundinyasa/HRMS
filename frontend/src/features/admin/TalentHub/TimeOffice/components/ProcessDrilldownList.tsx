import { ChevronLeft, FileSpreadsheet } from "lucide-react";
import type { ProcessDrilldownRow } from "../types/timeoffice.types";

interface ProcessDrilldownListProps {
  title: string;
  color: string;
  rows: ProcessDrilldownRow[];
  isLoading: boolean;
  /** Omit when this table isn't reached via a tile drill-down (e.g. a standalone approval queue). */
  onBack?: () => void;
}

/** Column labels the backend hasn't confirmed yet -- humanised from whatever keys come back. */
const toLabel = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());

const toCsv = (columns: string[], rows: ProcessDrilldownRow[]) => {
  const header = columns.map(toLabel).join(",");
  const body = rows.map((row) => columns.map((col) => `"${row[col] ?? ""}"`).join(","));
  return [header, ...body].join("\n");
};

export default function ProcessDrilldownList({ title, color, rows, isLoading, onBack }: ProcessDrilldownListProps) {
  const columns = Object.keys(rows[0] ?? {});

  const handleExport = () => {
    const blob = new Blob([toCsv(columns, rows)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, "-")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col">
      <div className="flex items-center justify-between gap-2 px-4 py-3 flex-wrap">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 h-8 px-3 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <ChevronLeft size={15} /> Back
          </button>
        ) : (
          <span />
        )}

        <h2 className="text-sm font-semibold text-center" style={{ color }}>
          {title}
        </h2>

        <button
          type="button"
          onClick={handleExport}
          disabled={rows.length === 0}
          title="Export to CSV"
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-slate-200 text-emerald-600 hover:bg-slate-50 disabled:opacity-40"
        >
          <FileSpreadsheet size={16} />
        </button>
      </div>

      <div className="px-4 pb-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#EAF1FE]">
            <tr className="text-left">
              {columns.map((column) => (
                <th key={column} className="font-semibold text-slate-700 px-4 py-3 whitespace-nowrap">
                  {toLabel(column)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-t border-slate-100">
                {columns.map((column) => (
                  <td key={column} className="px-4 py-3 whitespace-nowrap text-slate-700">
                    {row[column] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
            {!isLoading && rows.length === 0 && (
              <tr>
                <td className="px-4 py-12 text-center text-slate-400">No data found</td>
              </tr>
            )}
            {isLoading && (
              <tr>
                <td className="px-4 py-12 text-center text-slate-400">Loading…</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

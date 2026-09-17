import type { SalaryParticularRow } from "../types/details.types";

const HEADERS = [
  "Particular",
  "Current Month",
  "Previous Month",
  "Difference",
  "% Inc/Dec",
  "FY YTD",
];

function fmt(n: number) {
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function ConsolidatedSalarySheet({
  rows,
}: {
  rows: SalaryParticularRow[];
}) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200">
      <div className="w-full overflow-x-auto">
        <table className="min-w-[900px] w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#D6EAF8]">
              {HEADERS.map((h) => (
                <th
                  key={h}
                  className="
                    whitespace-nowrap border border-slate-200 px-3 py-2
                    text-[11px] font-semibold text-slate-700
                  "
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.particular} className="bg-white text-[12px] text-slate-700">
                <td className="border border-slate-200 px-3 py-2 font-medium">
                  {r.particular}
                </td>
                <td className="border border-slate-200 px-3 py-2 whitespace-nowrap">
                  {fmt(r.currentMonth)}
                </td>
                <td className="border border-slate-200 px-3 py-2 whitespace-nowrap">
                  {fmt(r.previousMonth)}
                </td>
                <td className="border border-slate-200 px-3 py-2 whitespace-nowrap">
                  {fmt(r.difference)}
                </td>
                <td className="border border-slate-200 px-3 py-2 whitespace-nowrap font-medium text-[#2563EB]">
                  {fmt(r.pctIncDec)}%
                </td>
                <td className="border border-slate-200 px-3 py-2 whitespace-nowrap">
                  {fmt(r.pyYtd)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
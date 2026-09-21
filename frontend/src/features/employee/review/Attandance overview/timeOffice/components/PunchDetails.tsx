import { Calendar, FileSpreadsheet } from "lucide-react";
import noPunchesImage from "../../../../../../assets/images/ChatGPT Image Sep 19, 2026, 01_52_56 PM.png";
import type { PunchDetailsProps } from "../types/attendanceOverview.types";

export default function PunchDetails({
  selectedDate,
  selectedMonthNumber,
  selectedYear,
  activeDay,
  punchTab,
  punches,
  onPunchTabChange,
}: PunchDetailsProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          Punch Details
          <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
        </h3>

        <span className="flex items-center gap-1 text-xs font-medium text-sky-700">
          <Calendar className="h-3.5 w-3.5" />
          {String(selectedDate).padStart(2, "0")}/
          {String(selectedMonthNumber).padStart(2, "0")}/{selectedYear}
        </span>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => onPunchTabChange("processed")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            punchTab === "processed"
              ? "bg-sky-200 font-semibold text-sky-800"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Processed Punches
        </button>

        <button
          type="button"
          onClick={() => onPunchTabChange("raw")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            punchTab === "raw"
              ? "bg-sky-200 font-semibold text-sky-800"
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Raw Punches
        </button>
      </div>

      {punchTab === "raw" && activeDay?.checkIn ? (
        <ul className="divide-y divide-slate-100">
          {punches.map((punch, index) => (
            <li
              key={`${punch.time}-${index}`}
              className="flex items-center justify-between py-2 text-sm"
            >
              <span className="flex items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    punch.type === "In" ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />

                {punch.time}

                <span className="text-xs text-slate-400">({punch.type})</span>
              </span>

              <span className="text-xs text-slate-400">{punch.source}</span>
            </li>
          ))}
        </ul>
      ) : (
       <div className="flex flex-col items-center justify-center py-6 text-center">
  <img
    src={noPunchesImage}
    alt="No Punches"
    className="h-32 w-32 object-contain"
  />

  <div className="mt-4 w-full rounded-lg bg-slate-100 py-2.5 text-sm font-semibold text-slate-500">
    No Punches
  </div>
</div>
      )}
    </div>
  );
}

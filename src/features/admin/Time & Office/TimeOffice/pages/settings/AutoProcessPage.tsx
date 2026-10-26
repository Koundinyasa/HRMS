import { useState } from "react";
import { CalendarClock, Clock, Info, Timer, TimerReset } from "lucide-react";
import SettingsLayout from "./SettingsLayout";

const INTERVALS = [
  { key: "seconds", label: "Seconds", icon: Clock },
  { key: "minutes", label: "Minutes", icon: TimerReset },
  { key: "hours", label: "Hours", icon: Timer },
  { key: "daily", label: "Daily", icon: CalendarClock },
  { key: "monthly", label: "Monthly", icon: CalendarClock },
] as const;

export default function AutoProcessPage() {
  const [interval, setIntervalKey] = useState<(typeof INTERVALS)[number]["key"]>("seconds");
  const [seconds, setSeconds] = useState("5");

  return (
    <SettingsLayout>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-4 max-w-2xl">
        <p className="flex items-start gap-2 text-sm text-sky-700 bg-sky-50 border border-sky-100 rounded-lg px-3 py-2.5">
          <Info size={16} className="shrink-0 mt-0.5" />
          Configure automatic punch processing here. Once enabled, the system will process punches as per your schedule and policy settings, Ensure all required parameters (date range, source, policies) are set correctly before enabling auto processing.
        </p>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-slate-700">Select Interval</p>
          <div className="flex items-center gap-5 flex-wrap">
            {INTERVALS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setIntervalKey(key)}
                className={`flex items-center gap-1.5 text-sm font-medium ${interval === key ? "text-emerald-600" : "text-slate-500"}`}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
        </div>

        {interval === "seconds" && (
          <label className="flex flex-col gap-1.5 text-sm text-slate-700 max-w-xs">
            Enter Seconds
            <input
              className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-emerald-400"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value)}
            />
          </label>
        )}

        <div className="flex justify-end">
          <button type="button" className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium">Save</button>
        </div>
      </div>
    </SettingsLayout>
  );
}

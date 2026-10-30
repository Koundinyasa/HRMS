import { Clock } from "lucide-react";
import { formatMinutesSeconds, useSessionRemainingSeconds } from "../hooks/useSessionClock";
import { SESSION_WARNING_SECONDS } from "@/shared/constants/session";

/**
 * Time left until the session ends, shown in the header next to the
 * notification icon. Turns amber for the last 5 minutes and red for the last
 * minute. Shows nothing until the server has reported the time.
 */
export default function SessionCountdown() {
  const remaining = useSessionRemainingSeconds();
  if (remaining === null) return null;

  const tone =
    remaining <= 60
      ? "text-red-600 border-red-200 bg-red-50"
      : remaining <= SESSION_WARNING_SECONDS
        ? "text-amber-700 border-amber-200 bg-amber-50"
        : "text-slate-600 border-slate-200 bg-white/70";

  return (
    <div
      role="timer"
      aria-label="Session time remaining"
      title="Time left in this session. Sessions end automatically after a fixed time."
      className={`flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-xs font-semibold tabular-nums ${tone}`}
    >
      <Clock size={14} aria-hidden="true" />
      <span>{formatMinutesSeconds(remaining)}</span>
    </div>
  );
}

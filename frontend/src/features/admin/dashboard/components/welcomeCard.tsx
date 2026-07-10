import { useEffect, useState } from "react";
import { Sunrise, Sun, Sunset, Moon } from "lucide-react";

interface WelcomeCardProps {
  welcomeMessage: string;
}

function getTimeIcon(hour: number) {
  if (hour >= 5 && hour < 12) return Sunrise;
  if (hour >= 12 && hour < 17) return Sun;
  if (hour >= 17 && hour < 21) return Sunset;
  return Moon;
}

export default function WelcomeCard({ welcomeMessage }: WelcomeCardProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const Icon = getTimeIcon(now.getHours());

  const dateStr = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col items-center text-center gap-3">
      {/* Letter avatar instead of photo */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center font-semibold text-xl text-white"
        style={{ background: "var(--theme-primary, #2563EB)" }}
      >
        A
      </div>

      {/* Welcome banner */}
      <div
        className="w-full rounded-xl py-4 px-3 text-white"
        style={{ background: "var(--theme-gradient, linear-gradient(135deg,#1D4ED8,#3B82F6))" }}
      >
        <p className="text-sm font-semibold">Welcome back, Admin</p>
        <p className="text-xs text-white/80 mt-0.5">{dateStr}</p>
        <p className="text-xs text-white/70 mt-0.5 tabular-nums">{timeStr}</p>
      </div>

      {/* Time-of-day icon */}
      <div className="w-11 h-11 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
        <Icon size={20} className="text-amber-500" />
      </div>

      {/* Backend already includes the greeting — don't prepend our own */}
      <p className="text-xs text-slate-400">{welcomeMessage}</p>
    </div>
  );
}









import { useEffect, useState } from "react";

interface WelcomeCardProps {
  welcomeMessage: string;
  profilePhoto?: string | null;
  fullName?: string;
}

const BRAND_PURPLE = "#7B5CF4";

function getTimeEmoji(hour: number) {
  if (hour >= 5 && hour < 12) return "🌅";
  if (hour >= 12 && hour < 17) return "☀️";
  if (hour >= 17 && hour < 21) return "🌇";
  return "🌙";
}

export default function WelcomeCard({ welcomeMessage, profilePhoto, fullName }: WelcomeCardProps) {
  const [now, setNow] = useState(new Date());

  // Only drives the time-of-day emoji — no clock is displayed, so a slow interval is enough.
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const emoji = getTimeEmoji(now.getHours());
  const displayName = fullName?.trim() || "Admin";
  const initial = displayName[0]?.toUpperCase() ?? "A";

  const dateStr = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex h-full min-h-[338px] flex-col items-center rounded-2xl border border-slate-100 bg-white px-8 pb-8 pt-3.5 text-center shadow-[0_2px_6px_rgba(15,23,42,0.06),0_10px_28px_rgba(15,23,42,0.14)]">
      {/* Profile photo — overlaps the top of the banner */}
      <div className="relative z-10">
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt={displayName}
            className="h-[100px] w-[100px] rounded-full border-4 border-white object-cover"
          />
        ) : (
          <div
            className="flex h-[100px] w-[100px] items-center justify-center rounded-full border-4 border-white text-4xl font-semibold text-white"
            style={{ background: BRAND_PURPLE }}
          >
            {initial}
          </div>
        )}
      </div>

      {/* Welcome banner — solid purple */}
      <div
        className="-mt-10 flex min-h-[122px] w-full flex-col justify-center rounded-lg px-4 pb-5 pt-12 text-white"
        style={{ background: BRAND_PURPLE }}
      >
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[22px] font-bold leading-tight">
          Welcome back, {displayName}
        </p>
        <p className="mt-2.5 text-[13px] text-white/90">{dateStr}</p>
      </div>

      {/* Time-of-day icon tile */}
      <div className="mt-3 flex h-16 w-16 items-center justify-center rounded-xl bg-white text-[34px] shadow-[0_4px_14px_rgba(15,23,42,0.14)]">
        {emoji}
      </div>

      {/* Backend already includes the greeting — don't prepend our own */}
      <p className="mt-5 text-[15px] leading-snug text-slate-800">{welcomeMessage}</p>
    </div>
  );
}
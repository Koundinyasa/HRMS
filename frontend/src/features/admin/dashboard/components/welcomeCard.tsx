// import { useEffect, useState } from "react";
// import { Sunrise, Sun, Sunset, Moon } from "lucide-react";

// interface WelcomeCardProps {
//   welcomeMessage: string;
//   profilePhoto?: string | null;
//   fullName?: string;
// }

// function getTimeIcon(hour: number) {
//   if (hour >= 5 && hour < 12) return Sunrise;
//   if (hour >= 12 && hour < 17) return Sun;
//   if (hour >= 17 && hour < 21) return Sunset;
//   return Moon;
// }

// export default function WelcomeCard({ welcomeMessage,profilePhoto, fullName }: WelcomeCardProps) {
//   const [now, setNow] = useState(new Date());

//   useEffect(() => {
//     const interval = setInterval(() => setNow(new Date()), 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const Icon = getTimeIcon(now.getHours());
//   const initial = fullName?.trim()?.[0]?.toUpperCase() ?? "A";

//   const dateStr = now.toLocaleDateString("en-GB", {
//     weekday: "long",
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   });

//   const timeStr = now.toLocaleTimeString("en-IN", {
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: true,
//   });

//   return (
//     <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col items-center text-center gap-3">
//       {
//         profilePhoto ? (
//           <img
//             src={profilePhoto}
//             alt={fullName ?? "Admin"}
//             className="w-16 h-16 rounded-full object-cover border border-slate-100"
//           />
//         ):(
//           <div
//           className="w-16 h-16 rounded-full flex items-center justify-center font-semibold text-xl text-white"
//           style={{ background: "var(--theme-primary, #2563EB)" }}
//         >
//           {initial}
//         </div>
//         )}

//       {/* Welcome banner */}
//       <div
//         className="w-full rounded-xl py-4 px-3 text-white"
//         style={{ background: "var(--theme-gradient, linear-gradient(135deg,#1D4ED8,#3B82F6))" }}
//       >
//         <p className="text-base font-bold">Welcome back, Admin</p>
//         <p className="text-xs text-white/85 mt-0.5">{dateStr}</p>
//         <p className="text-xs text-white/70 mt-0.5 tabular-nums">{timeStr}</p>
//       </div>

//       {/* Time-of-day icon */}
//       <div className="w-11 h-11 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center">
//         <Icon size={20} className="text-amber-500" />
//       </div>
//       <p className="text-xs text-slate-400">{welcomeMessage}</p>
//     </div>
//   );
// }



import { useEffect, useState } from "react";

interface WelcomeCardProps {
  welcomeMessage: string;
  profilePhoto?: string | null;
  fullName?: string;
}

const BRAND_PURPLE = "#7C5CFC";

function getTimeEmoji(hour: number) {
  if (hour >= 5 && hour < 12) return "🌅";
  if (hour >= 12 && hour < 17) return "☀️";
  if (hour >= 17 && hour < 21) return "🌇";
  return "🌙";
}

export default function WelcomeCard({ welcomeMessage, profilePhoto, fullName }: WelcomeCardProps) {
  const [now, setNow] = useState(new Date());

  // Only drives the time-of-day emoji (sunrise/sun/sunset/moon) — no clock is
  // displayed, so a slow interval is enough.
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
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col items-center text-center">
      {/* Profile photo — overlaps the top edge of the banner */}
      <div className="relative z-10 -mb-8">
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt={displayName}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm"
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center font-semibold text-2xl text-white border-4 border-white shadow-sm"
            style={{ background: BRAND_PURPLE }}
          >
            {initial}
          </div>
        )}
      </div>

      {/* Welcome banner — solid purple */}
      <div
        className="w-full rounded-2xl pt-10 pb-5 px-4 text-white"
        style={{ background: BRAND_PURPLE }}
      >
        <p className="text-lg font-bold leading-snug break-words">
          Welcome back, Admin
        </p>
        <p className="text-sm text-white/85 mt-1">{dateStr}</p>
      </div>

      {/* Time-of-day emoji */}
      <div className="mt-3 w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center text-2xl leading-none">
        {emoji}
      </div>

      {/* Backend already includes the greeting — don't prepend our own */}
      <p className="text-sm text-slate-600 mt-3">{welcomeMessage}</p>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Check, UserRound } from "lucide-react";

interface EmployeeRedirectLoaderProps {
  /** How long the loader runs (ms). Keep in sync with the navigate delay. */
  duration?: number;
}

const STEPS = [
  "Employee profile created",
  "Syncing records & access",
  "Opening Employee Details",
];

/**
 * Full-screen transition loader shown between "Done" on the success popup
 * and the Employee Details page. Uses --theme-primary so it follows the app theme.
 */
export default function EmployeeRedirectLoader({ duration = 2400 }: EmployeeRedirectLoaderProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = window.setTimeout(() => setStep(1), duration * 0.3);
    const t2 = window.setTimeout(() => setStep(2), duration * 0.65);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [duration]);

  return (
    <div
      className="kts-rl-overlay fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(244,248,254,0.88)] backdrop-blur-md"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <style>{`
        @keyframes kts-rl-spin { to { transform: rotate(360deg); } }
        @keyframes kts-rl-spin-rev { to { transform: rotate(-360deg); } }
        @keyframes kts-rl-pulse { 0%,100% { transform: scale(1); opacity:.55 } 50% { transform: scale(1.18); opacity:0 } }
        @keyframes kts-rl-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
        @keyframes kts-rl-bar { from { transform: scaleX(0) } to { transform: scaleX(1) } }
        @keyframes kts-rl-in { from { opacity:0; transform: translateY(14px) scale(.97) } to { opacity:1; transform:none } }
        @keyframes kts-rl-step { from { opacity:0; transform: translateY(6px) } to { opacity:1; transform:none } }
        .kts-rl-card { animation: kts-rl-in .45s cubic-bezier(.2,.8,.2,1) both; }
        .kts-rl-ring { background: conic-gradient(from 0deg, transparent 0 55%, var(--theme-primary,#2563EB) 100%); -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px)); mask: radial-gradient(farthest-side, transparent calc(100% - 4px), #000 calc(100% - 3px)); animation: kts-rl-spin 1.2s linear infinite; }
        .kts-rl-ring2 { background: conic-gradient(from 90deg, transparent 0 65%, #00C2FF 100%); -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px)); mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px)); animation: kts-rl-spin-rev 1.9s linear infinite; }
        .kts-rl-pulse { animation: kts-rl-pulse 1.8s ease-out infinite; }
        .kts-rl-float { animation: kts-rl-float 2.2s ease-in-out infinite; }
        .kts-rl-bar { transform-origin: left; animation: kts-rl-bar var(--kts-rl-dur) cubic-bezier(.35,.1,.25,1) forwards; }
        .kts-rl-step { animation: kts-rl-step .35s ease both; }
        @media (prefers-reduced-motion: reduce) {
          .kts-rl-ring, .kts-rl-ring2, .kts-rl-pulse, .kts-rl-float { animation: none; }
        }
      `}</style>

      <div
        className="kts-rl-card mx-4 flex w-full max-w-[380px] flex-col items-center rounded-3xl border border-[#E2E8F0] bg-white px-8 pb-8 pt-9 text-center shadow-[0_24px_60px_-12px_rgba(37,99,235,0.28)]"
        style={{ ["--kts-rl-dur" as string]: `${duration}ms` }}
      >
        {/* Emblem */}
        <div className="relative mb-6 flex h-[104px] w-[104px] items-center justify-center">
          <span className="kts-rl-pulse absolute inset-0 rounded-full bg-[var(--theme-primary,#2563EB)]/20" aria-hidden />
          <span className="kts-rl-ring absolute inset-0 rounded-full" aria-hidden />
          <span className="kts-rl-ring2 absolute inset-[10px] rounded-full" aria-hidden />
          <span className="kts-rl-float relative flex h-[60px] w-[60px] items-center justify-center rounded-full bg-gradient-to-br from-[var(--theme-primary,#2563EB)] to-[#00C2FF] text-white shadow-lg">
            <UserRound size={28} strokeWidth={2.2} aria-hidden />
          </span>
        </div>

        <h2 className="m-0 text-lg font-bold tracking-tight text-[#1B2230]">Taking you to Employee Details</h2>
        <p className="mb-5 mt-1.5 text-sm text-[#5A6376]">Hang tight, we're getting everything ready.</p>

        {/* Steps */}
        <ul className="m-0 mb-6 flex w-full list-none flex-col gap-2.5 p-0 text-left">
          {STEPS.map((label, i) => {
            const done = i < step;
            const active = i === step;
            if (i > step) return null;
            return (
              <li key={label} className="kts-rl-step flex items-center gap-3 text-sm">
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                    done ? "bg-[var(--theme-primary,#2563EB)] text-white" : "border-2 border-[var(--theme-primary,#2563EB)]"
                  }`}
                  aria-hidden
                >
                  {done ? <Check size={12} strokeWidth={3} /> : <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--theme-primary,#2563EB)]" />}
                </span>
                <span className={active ? "font-semibold text-[#1B2230]" : "text-[#5A6376]"}>{label}</span>
              </li>
            );
          })}
        </ul>

        {/* Progress */}
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E2E8F0]">
          <div className="kts-rl-bar h-full w-full rounded-full bg-gradient-to-r from-[var(--theme-primary,#2563EB)] to-[#00C2FF]" />
        </div>
      </div>
    </div>
  );
}
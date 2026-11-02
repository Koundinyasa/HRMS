import { useEffect, useState } from "react";
import { useSessionRemainingSeconds } from "../hooks/useSessionClock";
import { SESSION_WARNING_SECONDS } from "@/shared/constants/session";

/**
 * Time left until the session ends, shown in the header next to the
 * notification icon as a small flip clock (minutes and seconds; an hours card
 * appears only if the limit is ever set above one hour). The cards turn amber
 * for the last 5 minutes and red for the last minute. Shows nothing until the
 * server has reported the time.
 */

const FLIP_MS = 520;

// Keyframes live here (not in the Tailwind config) so the flip works no
// matter how the project's CSS is set up. Reduced-motion users get no flap.
const FLIP_CSS =
  "@keyframes ktsFlipTop{from{transform:rotateX(0deg)}to{transform:rotateX(-90deg)}}" +
  "@keyframes ktsFlipBottom{from{transform:rotateX(90deg)}to{transform:rotateX(0deg)}}" +
  ".kts-flap-top{transform-origin:bottom;backface-visibility:hidden;animation:ktsFlipTop .26s ease-in both}" +
  ".kts-flap-bottom{transform-origin:top;backface-visibility:hidden;animation:ktsFlipBottom .26s ease-out .26s both}" +
  "@media (prefers-reduced-motion:reduce){.kts-flap-top,.kts-flap-bottom{display:none}}";

interface Tone {
  top: string;
  bottom: string;
  text: string;
  border: string;
  label: string;
}

const TONES: Record<"normal" | "warning" | "danger", Tone> = {
  normal: {
    top: "linear-gradient(#ffffff,#f1f3f5)",
    bottom: "linear-gradient(#eceff2,#f8f9fa)",
    text: "#475569",
    border: "#d5dae1",
    label: "#94a3b8",
  },
  warning: {
    top: "linear-gradient(#fffbeb,#fef3c7)",
    bottom: "linear-gradient(#fde9b0,#fffbeb)",
    text: "#b45309",
    border: "#f3d58a",
    label: "#b45309",
  },
  danger: {
    top: "linear-gradient(#fef2f2,#fee2e2)",
    bottom: "linear-gradient(#fdd0d0,#fef2f2)",
    text: "#dc2626",
    border: "#f5b5b5",
    label: "#dc2626",
  },
};

function Half({
  text,
  part,
  tone,
  className = "",
}: {
  text: string;
  part: "top" | "bottom";
  tone: Tone;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-x-0 overflow-hidden ${
        part === "top" ? "top-0 h-1/2 rounded-t-[5px]" : "bottom-0 h-1/2 rounded-b-[5px]"
      } ${className}`}
      style={{ background: part === "top" ? tone.top : tone.bottom }}
    >
      <span
        className={`absolute inset-x-0 flex h-8 items-center justify-center text-[16px] font-bold leading-none tabular-nums ${
          part === "top" ? "top-0" : "bottom-0"
        }`}
        style={{ color: tone.text }}
      >
        {text}
      </span>
    </div>
  );
}

/** One two-digit card; when the value changes the top half folds down. */
function FlipCard({ value, tone }: { value: string; tone: Tone }) {
  const [state, setState] = useState<{ current: string; previous: string | null }>({
    current: value,
    previous: null,
  });

  useEffect(() => {
    setState((s) => (s.current === value ? s : { current: value, previous: s.current }));
  }, [value]);

  useEffect(() => {
    if (state.previous === null) return;
    const timer = window.setTimeout(
      () => setState((s) => ({ ...s, previous: null })),
      FLIP_MS,
    );
    return () => window.clearTimeout(timer);
  }, [state.previous, state.current]);

  const { current, previous } = state;

  return (
    <div
      className="relative h-8 w-[27px] rounded-[6px] shadow-[0_1px_2px_rgba(15,23,42,0.18)]"
      style={{ perspective: "120px", border: `1px solid ${tone.border}` }}
    >
      {/* Resting faces: new number on top, old number below until the flip ends */}
      <Half text={current} part="top" tone={tone} />
      <Half text={previous ?? current} part="bottom" tone={tone} />
      {/* The flap: old top folds down, then the new bottom unfolds */}
      {previous !== null && (
        <>
          <Half key={`t-${current}`} text={previous} part="top" tone={tone} className="kts-flap-top" />
          <Half key={`b-${current}`} text={current} part="bottom" tone={tone} className="kts-flap-bottom" />
        </>
      )}
      {/* The hinge: small notches at both edges only. A line across the card
          cut through the digits and made them hard to read; the colour step
          between the two halves already shows the fold. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-1/2 h-px w-[4px] -translate-y-1/2 bg-black/25"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/2 h-px w-[4px] -translate-y-1/2 bg-black/25"
      />
    </div>
  );
}

function Colon({ color }: { color: string }) {
  return (
    <span aria-hidden="true" className="flex h-8 flex-col items-center justify-center gap-[5px]">
      <span className="h-[3px] w-[3px] rounded-full" style={{ background: color, opacity: 0.55 }} />
      <span className="h-[3px] w-[3px] rounded-full" style={{ background: color, opacity: 0.55 }} />
    </span>
  );
}

const two = (n: number) => String(n).padStart(2, "0");

export default function SessionCountdown() {
  const remaining = useSessionRemainingSeconds();
  if (remaining === null) return null;

  const tone =
    remaining <= 60
      ? TONES.danger
      : remaining <= SESSION_WARNING_SECONDS
        ? TONES.warning
        : TONES.normal;

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  const units: Array<{ key: string; value: string; label: string }> = [
    ...(hours > 0 ? [{ key: "h", value: two(hours), label: "hr" }] : []),
    { key: "m", value: two(minutes), label: "min" },
    { key: "s", value: two(seconds), label: "sec" },
  ];

  const spoken = `${hours > 0 ? `${hours} hours ` : ""}${minutes} minutes ${seconds} seconds`;

  return (
    <div
      role="timer"
      aria-label={`Session time remaining: ${spoken}`}
      title="Time left in this session. Sessions end automatically after a fixed time."
      className="flex shrink-0 items-start gap-[3px] rounded-lg border border-slate-200/80 bg-white/60 px-1.5 py-1"
    >
      <style>{FLIP_CSS}</style>
      {units.map((unit, i) => (
        <div key={unit.key} className="flex items-start gap-[3px]">
          {i > 0 && <Colon color={tone.text} />}
          <div className="flex flex-col items-center gap-[2px]">
            <FlipCard value={unit.value} tone={tone} />
            <span
              aria-hidden="true"
              className="text-[8px] font-medium uppercase leading-none tracking-wide"
              style={{ color: tone.label }}
            >
              {unit.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

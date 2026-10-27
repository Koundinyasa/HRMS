import type { ReactNode } from "react";
import { MapPin, RotateCw, X } from "lucide-react";
import {
  arcGeometry,
  pointInScene,
  pointOnArc,
  type ArcVariant,
  type SkyState,
} from "./skyTheme";

// Star positions as fractions (x across, y down the top part of the sky).
const STARS: Array<[number, number, number]> = [
  [0.13, 0.12, 1.2], [0.23, 0.42, 1], [0.43, 0.06, 1.3], [0.53, 0.55, 1],
  [0.72, 0.18, 1.2], [0.83, 0.5, 1], [0.07, 0.68, 1], [0.9, 0.1, 1.1],
  [0.33, 0.28, 1], [0.63, 0.04, 1],
];

// The dashed arc with the sun (or moon) riding on it, plus stars.
function SkyArc({ sky, variant }: { sky: SkyState; variant: ArcVariant }) {
  const g = arcGeometry(variant);
  const [, , vbW, vbH] = g.viewBox.split(" ").map(Number);
  const pos = pointOnArc(sky.t, variant);
  const r = sky.isDay ? 8 + 4 * (1 - Math.sin(Math.PI * sky.t)) : 8.5;
  return (
    <svg
      viewBox={g.viewBox}
      className="absolute left-0 top-0 w-full"
      style={{ height: "auto" }}
      aria-hidden="true"
    >
      {sky.stars > 0.02 &&
        STARS.map(([fx, fy, sr], i) => (
          <circle
            key={i}
            cx={fx * vbW}
            cy={fy * vbH * 0.6}
            r={sr}
            fill="#fff"
            opacity={sky.stars * 0.85}
          />
        ))}
      <path
        d={g.path}
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
        strokeDasharray="3 5"
      />
      <g opacity={sky.bodyOpacity}>
        <circle cx={pos.x} cy={pos.y} r={r * 2} fill={sky.bodyColor} opacity="0.28" />
        <circle cx={pos.x} cy={pos.y} r={r} fill={sky.bodyColor} />
      </g>
    </svg>
  );
}

interface SkyHeaderProps {
  sky: SkyState;
  // "tall" is the big header of the mode picker, "wide" the slim one used
  // on the punch screen and Recent Punches.
  variant: ArcVariant;
  title: string;
  left?: ReactNode;
  right?: ReactNode;
  onFlip: () => void;
  flipLabel: string;
  onClose: () => void;
}

export function SkyHeader({
  sky, variant, title, left, right, onFlip, flipLabel, onClose,
}: SkyHeaderProps) {
  const shadow = { textShadow: "0 1px 3px rgba(0,0,0,0.5)" };
  return (
    <div
      className="relative flex-shrink-0 overflow-hidden"
      style={{ height: variant === "tall" ? 190 : 92, background: sky.gradient }}
    >
      <SkyArc sky={sky} variant={variant} />
      {/* Soft dark fade so the text stays readable even on a bright midday sky */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: 72,
          background: `linear-gradient(transparent, rgba(6,10,30,${sky.shade}))`,
        }}
      />
      <span
        className="absolute left-4 top-3 text-[10.5px] font-medium tracking-wide text-white/85"
        style={shadow}
      >
        {title}
      </span>
      <div className="absolute right-3 top-2.5 flex items-center gap-3">
        <button
          type="button"
          onClick={onFlip}
          aria-label={flipLabel}
          className="text-white/80 transition-colors hover:text-white"
        >
          <RotateCw size={17} />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-white/80 transition-colors hover:text-white"
        >
          <X size={20} />
        </button>
      </div>
      <div
        className="absolute inset-x-4 bottom-2.5 flex items-end justify-between gap-3"
        style={shadow}
      >
        <div className="min-w-0">{left}</div>
        <div className="flex-shrink-0">{right}</div>
      </div>
    </div>
  );
}

// Sun/moon and stars for a scene card (a simpler sky than the header's).
function SceneSky({ sky }: { sky: SkyState }) {
  const p = pointInScene(sky.t);
  const r = sky.isDay ? 8 + 3 * (1 - Math.sin(Math.PI * sky.t)) : 7.5;
  return (
    <>
      {sky.stars > 0.02 &&
        STARS.slice(0, 7).map(([fx, fy, sr], i) => (
          <circle
            key={i}
            cx={fx * 120}
            cy={fy * 62}
            r={sr * 0.9}
            fill="#fff"
            opacity={sky.stars * 0.85}
          />
        ))}
      <g opacity={sky.bodyOpacity}>
        <circle cx={p.x} cy={p.y} r={r * 1.9} fill={sky.bodyColor} opacity="0.25" />
        <circle cx={p.x} cy={p.y} r={r} fill={sky.bodyColor} />
      </g>
    </>
  );
}

const sceneSvgProps = {
  viewBox: "0 0 120 140",
  preserveAspectRatio: "xMidYMax slice" as const,
  className: "absolute inset-0 h-full w-full",
  "aria-hidden": true as const,
};

export function HomeScene({ sky }: { sky: SkyState }) {
  const s = sky.scene;
  return (
    <svg {...sceneSvgProps}>
      <SceneSky sky={sky} />
      <rect x="0" y="112" width="120" height="30" fill={s.ground} />
      <polygon points="30,84 60,58 90,84" fill={s.roof} />
      <rect x="36" y="84" width="48" height="30" fill={s.wall} />
      <rect x="51" y="92" width="18" height="22" fill={s.window} />
      <circle cx="20" cy="98" r="11" fill={s.tree} />
      <rect x="19" y="104" width="3" height="10" fill={s.ground} />
    </svg>
  );
}

const OFFICE_WINDOWS: Array<[number, number]> = [
  [40, 58], [48, 58], [40, 70], [48, 82], [94, 68], [102, 80], [14, 84], [22, 96], [74, 92],
];

export function OfficeScene({ sky }: { sky: SkyState }) {
  const s = sky.scene;
  return (
    <svg {...sceneSvgProps}>
      <SceneSky sky={sky} />
      <rect x="8" y="70" width="22" height="70" fill={s.offA} />
      <rect x="34" y="50" width="26" height="90" fill={s.offB} />
      <rect x="64" y="78" width="20" height="62" fill={s.offA} />
      <rect x="88" y="60" width="24" height="80" fill={s.offB} />
      {OFFICE_WINDOWS.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="4" height="4" fill={s.window} />
      ))}
    </svg>
  );
}

// ─────────────────────── location readout ───────────────────────
//
// The card under the camera: a radar, the distance as a big number, a status
// pill, and a bar showing how much of the limit is used. It always shows the
// radar — with a reference to measure against it plots you; without one it
// just idles, so the screen keeps its shape.

export interface Readout {
  state: "measured" | "idle" | "loading" | "unavailable";
  tone: "ok" | "over" | "warn" | "neutral";
  big: string; //  "223", "25.0", or "—"
  unit: string; // "m", "km", or ""
  pill: string; // "Inside", "Outside +92 m", "No check" ...
  sub: string; //  one line of explanation
  distance?: number;
  limit?: number;
  bearing?: number; // degrees, 0 = north
}

const TONE: Record<Readout["tone"], string> = {
  ok: "#34d399",
  over: "#fb7185",
  warn: "#fbbf24",
  neutral: "#94a3b8",
};

// Keyframes live here (not in the Tailwind config) so the sweep works no
// matter how the project's CSS is set up; reduced-motion users get none.
const SWEEP_CSS =
  "@keyframes ktsSweep{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}" +
  "@media (prefers-reduced-motion: reduce){.kts-sweep{animation:none!important}}";

// The dashed circle is the limit, the small square is the reference (the
// office, or this morning's punch-in), the pulsing dot is you — at your real
// distance and direction (north is up).
function LocationRadar({ readout, size = 68 }: { readout: Readout; size?: number }) {
  const color = TONE[readout.tone];
  const c = size / 2;
  const R = c - 7; // the limit circle
  let x = c;
  let y = c;
  const measured =
    readout.state === "measured" &&
    readout.distance !== undefined &&
    !!readout.limit;
  if (measured) {
    // Far outside the limit, keep the dot on the canvas — pinned just past
    // the circle, still in the right direction.
    const ratio = Math.min(readout.distance! / readout.limit!, (c - 5) / R);
    const a = ((readout.bearing ?? 0) * Math.PI) / 180;
    x = c + R * ratio * Math.sin(a);
    y = c - R * ratio * Math.cos(a);
  }
  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <style>{SWEEP_CSS}</style>
      <div
        className="kts-sweep absolute rounded-full"
        style={{
          left: c - R,
          top: c - R,
          width: 2 * R,
          height: 2 * R,
          background: `conic-gradient(from 0deg, ${color}00 0deg, ${color}00 235deg, ${color}55 356deg, ${color}00 360deg)`,
          animation: "ktsSweep 4s linear infinite",
        }}
      />
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
        aria-hidden="true"
      >
        <circle cx={c} cy={c} r={R} fill={color} fillOpacity="0.07" stroke={color} strokeWidth="1.3" strokeDasharray="3 3" />
        <circle cx={c} cy={c} r={R / 2} fill="none" stroke="rgba(255,255,255,0.13)" />
        <line x1={c - R} y1={c} x2={c + R} y2={c} stroke="rgba(255,255,255,0.08)" />
        <line x1={c} y1={c - R} x2={c} y2={c + R} stroke="rgba(255,255,255,0.08)" />
        {measured && <line x1={c} y1={c} x2={x} y2={y} stroke="rgba(255,255,255,0.3)" />}
        {measured && <rect x={c - 3} y={c - 3} width="6" height="6" rx="1" fill="#fde68a" />}
        <circle cx={x} cy={y} r="3.6" fill={color} />
        <circle cx={x} cy={y} r="3.6" fill="none" stroke={color} strokeWidth="1.2">
          <animate attributeName="r" values="3.6;9" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0" dur="2s" repeatCount="indefinite" />
        </circle>
        <text x={c} y="6.5" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.5)">N</text>
      </svg>
    </div>
  );
}

export function LocationReadout({
  readout,
  coords,
}: {
  readout: Readout;
  coords: { latitude: number; longitude: number; accuracy: number };
}) {
  const color = TONE[readout.tone];
  const pct =
    readout.state === "measured" && readout.distance !== undefined && readout.limit
      ? Math.min(100, (readout.distance / readout.limit) * 100)
      : 0;
  return (
    <div
      className="mt-3 flex items-center gap-3 rounded-xl border px-3 py-2"
      style={{
        borderColor: `${color}55`,
        background: "linear-gradient(135deg,#131a2b,#0e1424)",
        boxShadow: `0 0 22px -10px ${color}`,
      }}
    >
      <LocationRadar readout={readout} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span
            className="flex items-baseline gap-0.5 font-light leading-none text-white"
            style={{ fontSize: 24 }}
          >
            {readout.big}
            <span className="text-[12px] text-slate-400">{readout.unit}</span>
          </span>
          <span
            className="whitespace-nowrap rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
            style={{ color, borderColor: `${color}66`, background: `${color}1f` }}
          >
            {readout.pill}
          </span>
        </div>
        <p
          className="mt-1 text-[11px] leading-[14px] text-slate-300"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {readout.sub}
        </p>
        {readout.state === "measured" && (
          <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
          </div>
        )}
        <p className="mt-1.5 flex items-center gap-1 font-mono text-[10px] leading-[13px] text-slate-500">
          <MapPin size={9} className="flex-shrink-0 text-emerald-300" />
          <span className="truncate">
            {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)} · ±{Math.round(coords.accuracy)} m
          </span>
        </p>
      </div>
    </div>
  );
}
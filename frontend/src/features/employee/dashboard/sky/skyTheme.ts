// skyTheme.ts — pure logic for the "sky arc" look of the attendance modal.
//
// Given the current time and a location, works out: where the sun (by day)
// or moon (by night) sits on the arc, what colours the sky and the two
// little scenes (home / office) should be, whether windows are lit, and the
// greeting. No React, no network — just maths, so it's easy to test.
//
// Sunrise and sunset come from the location (Almanac for Computers, 1990,
// the same method NOAA-style calculators use; accurate to a couple of
// minutes), so the sun really rises and sets when it does where the
// employee is.

// DEVELOPMENT AID — lets you preview any time of day by adding ?sky=17:45
// to the page URL (see useSkyTheme.ts). Set to false before deployment.
export const SKY_ALLOW_TIME_OVERRIDE = true;

const HOUR = 3600000;
const MINUTE = 60000;

// ───────────────────────── sunrise / sunset ─────────────────────────

const D2R = Math.PI / 180;
const sinD = (d: number) => Math.sin(d * D2R);
const cosD = (d: number) => Math.cos(d * D2R);
const tanD = (d: number) => Math.tan(d * D2R);
const asinD = (x: number) => Math.asin(x) / D2R;
const acosD = (x: number) => Math.acos(x) / D2R;
const atanD = (x: number) => Math.atan(x) / D2R;
const norm = (x: number, m: number) => ((x % m) + m) % m;

// One sunrise or sunset, as an absolute instant (ms since epoch), for the
// calendar day year-month-day. Returns null if the sun never rises/sets
// there on that day (polar regions).
export function sunEvent(
  year: number,
  month: number, // 1-12
  day: number,
  lat: number,
  lon: number,
  rising: boolean,
): number | null {
  const zenith = 90.833; // official: accounts for refraction + the sun's radius
  const n1 = Math.floor((275 * month) / 9);
  const n2 = Math.floor((month + 9) / 12);
  const n3 = 1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3);
  const dayOfYear = n1 - n2 * n3 + day - 30;

  const lngHour = lon / 15;
  const t = dayOfYear + ((rising ? 6 : 18) - lngHour) / 24;
  const meanAnomaly = 0.9856 * t - 3.289;
  const trueLong = norm(
    meanAnomaly + 1.916 * sinD(meanAnomaly) + 0.02 * sinD(2 * meanAnomaly) + 282.634,
    360,
  );

  let ra = norm(atanD(0.91764 * tanD(trueLong)), 360);
  ra += Math.floor(trueLong / 90) * 90 - Math.floor(ra / 90) * 90;
  ra /= 15;

  const sinDec = 0.39782 * sinD(trueLong);
  const cosDec = cosD(asinD(sinDec));
  const cosH = (cosD(zenith) - sinDec * sinD(lat)) / (cosDec * cosD(lat));
  if (cosH > 1 || cosH < -1) return null;

  const hourAngle = (rising ? 360 - acosD(cosH) : acosD(cosH)) / 15;
  const localMeanTime = hourAngle + ra - 0.06571 * t - 6.622;
  const utHours = norm(localMeanTime - lngHour, 24);

  const dayStart = Date.UTC(year, month - 1, day);
  let ms = dayStart + utHours * HOUR;

  // The maths gives a time of day, not a date. Keep the event within 12h of
  // that place's solar noon so it lands on the right side of midnight UTC.
  const solarNoon = dayStart + (12 - lngHour) * HOUR;
  while (ms - solarNoon > 12 * HOUR) ms -= 24 * HOUR;
  while (ms - solarNoon < -12 * HOUR) ms += 24 * HOUR;
  return ms;
}

function sunTimesForLocalDay(base: Date, dayOffset: number, lat: number, lon: number) {
  const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + dayOffset);
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return {
    sunrise: sunEvent(y, m, day, lat, lon, true),
    sunset: sunEvent(y, m, day, lat, lon, false),
  };
}

// ───────────────────────── palettes ─────────────────────────

interface Palette {
  sky: [string, string, string, string]; // top → horizon
  sun: string;
  stars: number; // 0..1
  lit: number; // 0..1, how lit the windows are
  shade: number; // 0..1, dark fade behind text so it stays readable
  roof: string;
  wall: string;
  ground: string;
  offA: string;
  offB: string;
  tree: string;
}

const NIGHT: Palette = {
  sky: ["#050816", "#0a1230", "#0f1a3d", "#1e2a5a"],
  sun: "#e2e8f0", stars: 1, lit: 1, shade: 0.25,
  roof: "#0e1533", wall: "#121a3d", ground: "#070b1c", offA: "#0a1029", offB: "#0e1533", tree: "#0f1836",
};
const DAWN: Palette = {
  sky: ["#1b1447", "#5b3a8c", "#e0708a", "#ffb36b"],
  sun: "#ffa552", stars: 0.35, lit: 0.75, shade: 0.3,
  roof: "#2a1f5a", wall: "#33266b", ground: "#1a1338", offA: "#150f34", offB: "#1b1445", tree: "#1f2e5a",
};
const MORNING: Palette = {
  sky: ["#3b82c4", "#5c9dd6", "#7fb6e6", "#ffe7b0"],
  sun: "#fde047", stars: 0, lit: 0, shade: 0.55,
  roof: "#7a3e2e", wall: "#e8d9b8", ground: "#2f5d3a", offA: "#4a6c95", offB: "#3a5a86", tree: "#2f7a44",
};
const MIDDAY: Palette = {
  sky: ["#1e6fd0", "#3d8fe5", "#56a5ef", "#b6dcfb"],
  sun: "#fff6b8", stars: 0, lit: 0, shade: 0.6,
  roof: "#7a3e2e", wall: "#e8d9b8", ground: "#2f5d3a", offA: "#4a6c95", offB: "#3a5a86", tree: "#2f7a44",
};
const AFTERNOON: Palette = {
  sky: ["#2b74c8", "#4c93de", "#78b0ea", "#ffd9a0"],
  sun: "#ffcf4a", stars: 0, lit: 0, shade: 0.55,
  roof: "#7a3e2e", wall: "#ecd7b0", ground: "#2f5d3a", offA: "#46608a", offB: "#385580", tree: "#2f7a44",
};
const GOLDEN: Palette = {
  sky: ["#2a2260", "#9b3f7a", "#f97316", "#fbbf24"],
  sun: "#ff7a2f", stars: 0.2, lit: 0.85, shade: 0.3,
  roof: "#2a1f5a", wall: "#33266b", ground: "#1a1338", offA: "#150f34", offB: "#1b1445", tree: "#1f2e5a",
};

const MOON = "#e2e8f0";
const GLASS = "#bcd4ee"; // window colour by day
const LIT = "#fde68a"; //   window colour when lit

const hexToRgb = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
function mixHex(a: string, b: string, k: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return `rgb(${Math.round(lerp(ar, br, k))},${Math.round(lerp(ag, bg, k))},${Math.round(lerp(ab, bb, k))})`;
}

// Blend two palettes. Colours come back as rgb() strings, numbers as numbers.
function blend(a: Palette, b: Palette, k: number) {
  return {
    sky: a.sky.map((c, i) => mixHex(c, b.sky[i], k)) as [string, string, string, string],
    sun: mixHex(a.sun, b.sun, k),
    stars: lerp(a.stars, b.stars, k),
    lit: lerp(a.lit, b.lit, k),
    shade: lerp(a.shade, b.shade, k),
    roof: mixHex(a.roof, b.roof, k),
    wall: mixHex(a.wall, b.wall, k),
    ground: mixHex(a.ground, b.ground, k),
    offA: mixHex(a.offA, b.offA, k),
    offB: mixHex(a.offB, b.offB, k),
    tree: mixHex(a.tree, b.tree, k),
  };
}

// ───────────────────────── the arc ─────────────────────────

export type ArcVariant = "tall" | "wide";

const ARC = {
  tall: { p0: [20, 100], p1: [150, -40], p2: [280, 100], viewBox: "0 0 300 110", path: "M20 100 Q150 -40 280 100" },
  wide: { p0: [20, 62], p1: [150, -10], p2: [280, 62], viewBox: "0 0 300 70", path: "M20 62 Q150 -10 280 62" },
} as const;

export function arcGeometry(v: ArcVariant) {
  return ARC[v];
}

// A point a fraction t (0 = left horizon, 1 = right horizon) along the arc.
export function pointOnArc(t: number, v: ArcVariant): { x: number; y: number } {
  const { p0, p1, p2 } = ARC[v];
  const u = 1 - t;
  return {
    x: u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
    y: u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
  };
}

// Where the sun/moon sits inside one of the small scene cards.
export function pointInScene(t: number): { x: number; y: number } {
  return { x: 10 + t * 100, y: 100 - 84 * Math.sin(Math.PI * t) };
}

// ───────────────────────── the result ─────────────────────────

export interface SkyState {
  isDay: boolean;
  t: number; // 0..1 along the arc (sun by day, moon by night)
  bodyOpacity: number; // fades in/out at the horizon
  bodyColor: string;
  gradient: string; // CSS background for the sky
  stars: number;
  shade: number;
  scene: {
    roof: string;
    wall: string;
    ground: string;
    offA: string;
    offB: string;
    tree: string;
    window: string;
  };
  greeting: string;
  timeText: string; // "10:17"
  dateText: string; // "10:17 AM · Mon 28 Sep"
  sunriseText: string; // "6:02 AM"
  sunsetText: string;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad2 = (n: number) => String(n).padStart(2, "0");

function clock12(d: Date): string {
  const h = d.getHours();
  return `${h % 12 === 0 ? 12 : h % 12}:${pad2(d.getMinutes())} ${h < 12 ? "AM" : "PM"}`;
}

function greetingFor(hour: number): string {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 22) return "Good evening";
  return "Good night";
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export function computeSky(now: Date, lat: number, lon: number): SkyState {
  const nowMs = now.getTime();
  const today = sunTimesForLocalDay(now, 0, lat, lon);

  // Polar day/night: no sunrise or sunset today. Fall back to plain 6-to-6
  // so the screen still works everywhere.
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const sunrise = today.sunrise ?? dayStart + 6 * HOUR;
  const sunset = today.sunset ?? dayStart + 18 * HOUR;

  const isDay = nowMs >= sunrise && nowMs <= sunset;
  let t: number;
  if (isDay) {
    t = (nowMs - sunrise) / (sunset - sunrise);
  } else if (nowMs < sunrise) {
    const prev = sunTimesForLocalDay(now, -1, lat, lon);
    const prevSunset = prev.sunset ?? dayStart - 6 * HOUR;
    t = (nowMs - prevSunset) / (sunrise - prevSunset);
  } else {
    const next = sunTimesForLocalDay(now, 1, lat, lon);
    const nextSunrise = next.sunrise ?? dayStart + 30 * HOUR;
    t = (nowMs - sunset) / (nextSunrise - sunset);
  }
  t = clamp01(t);

  // Sky colour follows the sun, not the clock: keyframes are placed
  // relative to today's sunrise/sunset, and colours blend between them.
  const noon = (sunrise + sunset) / 2;
  const frames: Array<{ at: number; pal: Palette }> = [
    { at: sunrise - 75 * MINUTE, pal: NIGHT },
    { at: sunrise, pal: DAWN },
    { at: sunrise + 150 * MINUTE, pal: MORNING },
    { at: noon, pal: MIDDAY },
    { at: sunset - 150 * MINUTE, pal: AFTERNOON },
    { at: sunset, pal: GOLDEN },
    { at: sunset + 75 * MINUTE, pal: NIGHT },
  ];

  let pal: ReturnType<typeof blend>;
  if (nowMs <= frames[0].at || nowMs >= frames[frames.length - 1].at) {
    pal = blend(NIGHT, NIGHT, 0);
  } else {
    let i = 0;
    while (i < frames.length - 2 && nowMs > frames[i + 1].at) i++;
    const a = frames[i];
    const b = frames[i + 1];
    pal = blend(a.pal, b.pal, clamp01((nowMs - a.at) / (b.at - a.at)));
  }

  const window = mixHex(GLASS, LIT, pal.lit);
  const [s0, s1, s2, s3] = pal.sky;
  const hour = now.getHours();

  return {
    isDay,
    t,
    bodyOpacity: clamp01(Math.min(t, 1 - t) / 0.05),
    bodyColor: isDay ? pal.sun : MOON,
    gradient: `linear-gradient(180deg, ${s0} 0%, ${s1} 38%, ${s2} 72%, ${s3} 118%)`,
    stars: pal.stars,
    shade: pal.shade,
    scene: {
      roof: pal.roof, wall: pal.wall, ground: pal.ground,
      offA: pal.offA, offB: pal.offB, tree: pal.tree, window,
    },
    greeting: greetingFor(hour),
    timeText: `${pad2(hour)}:${pad2(now.getMinutes())}`,
    dateText: `${clock12(now)} · ${DAYS[now.getDay()]} ${now.getDate()} ${MONTHS[now.getMonth()]}`,
    sunriseText: clock12(new Date(sunrise)),
    sunsetText: clock12(new Date(sunset)),
  };
}
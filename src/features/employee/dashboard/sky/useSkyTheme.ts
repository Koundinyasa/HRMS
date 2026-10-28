import { useEffect, useMemo, useState } from "react";
import { computeSky, SKY_ALLOW_TIME_OVERRIDE, type SkyState } from "./skyTheme";

// Where the sky is calculated for, in order of preference:
//   1. the live location the punch screen just captured,
//   2. the last location this browser captured (remembered, rounded to
//      ~1 km — plenty for sunrise/sunset, and not a precise trail),
//   3. this fallback (the company's home city), so the mode picker — which
//      opens BEFORE any location has been captured — still shows a sensible
//      sun the very first time.
const FALLBACK = { latitude: 17.44, longitude: 78.37 };
const STORAGE_KEY = "kts.sky.lastLocation";

type Coords = { latitude: number; longitude: number };

function readSavedLocation(): Coords | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw);
    if (typeof p?.latitude === "number" && typeof p?.longitude === "number") {
      return { latitude: p.latitude, longitude: p.longitude };
    }
  } catch {
    // storage blocked or corrupt — just use the fallback
  }
  return null;
}

// "Now", or — for previewing every look without waiting for evening — the
// time in ?sky=HH:MM on the page URL (only while SKY_ALLOW_TIME_OVERRIDE is on).
function currentTime(): Date {
  if (SKY_ALLOW_TIME_OVERRIDE) {
    try {
      const m = /^(\d{1,2}):(\d{2})$/.exec(
        new URLSearchParams(window.location.search).get("sky") ?? "",
      );
      if (m) {
        const d = new Date();
        d.setHours(Math.min(23, Number(m[1])), Math.min(59, Number(m[2])), 0, 0);
        return d;
      }
    } catch {
      // ignore — fall through to the real time
    }
  }
  return new Date();
}

export function useSkyTheme(location: Coords | null): SkyState {
  const [now, setNow] = useState(currentTime);
  const [saved] = useState(readSavedLocation);

  // The sun crawls, so twice a minute is plenty.
  useEffect(() => {
    const id = window.setInterval(() => setNow(currentTime()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const lat = location?.latitude;
  const lon = location?.longitude;
  useEffect(() => {
    if (lat === undefined || lon === undefined) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          latitude: Math.round(lat * 100) / 100,
          longitude: Math.round(lon * 100) / 100,
        }),
      );
    } catch {
      // storage blocked — nothing lost, we just won't remember it
    }
  }, [lat, lon]);

  const coords = location ?? saved ?? FALLBACK;
  return useMemo(
    () => computeSky(now, coords.latitude, coords.longitude),
    [now, coords.latitude, coords.longitude],
  );
}
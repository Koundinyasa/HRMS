export interface PunchEvent {
  direction: "In" | "Out";
  time: string;
}

/** Deterministic 2-4 alternating In/Out punches per employee, so every row in a punch list has something to show. */
export function punchesForEmployee(index: number): PunchEvent[] {
  const count = 2 + (index % 3);
  const startMinutes = 9 * 60 + ((index * 7) % 45);
  return Array.from({ length: count }, (_, i) => {
    const minutes = startMinutes + i * (90 + (index % 30));
    const h = String(Math.floor(minutes / 60) % 24).padStart(2, "0");
    const m = String(minutes % 60).padStart(2, "0");
    const s = String((index * 13 + i * 7) % 60).padStart(2, "0");
    return { direction: i % 2 === 0 ? "In" : "Out", time: `${h}:${m}:${s}` } as PunchEvent;
  });
}

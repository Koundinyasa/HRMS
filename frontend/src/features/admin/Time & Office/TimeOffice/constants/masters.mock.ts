import type { GeoLocationRow, ShiftMasterRow } from "../types/timeoffice.types";

/** Sample data so Masters renders without a backend — same convention as punch.mock.ts. */

export const SHIFT_MASTER_ROWS: ShiftMasterRow[] = [
  { shiftCode: "GS", shiftName: "General Shift", startTime: "10:00", endTime: "19:00" },
];

export const GEO_LOCATION_ROWS: GeoLocationRow[] = [
  { locationName: "Head Office", address: "Old Bombay Road, Hyderabad, 500032", radiusMeters: 100 },
];

export const SHIFT_PATTERNS = [
  {
    code: "GS",
    name: "GS",
    cycleLabel: "1- Day Cycle Scheduled",
    effectiveFrom: "01-03-2026",
    shifts: [{ name: "General Shift", code: "GS", timing: "10:00 - 19:00", type: "Regular", count: 1 }],
  },
];

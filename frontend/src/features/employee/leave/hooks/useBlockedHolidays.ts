import { useMemo } from "react";
import { useGetHolidayListQuery } from "../../dashboard/api/dashboardApi";
import type { Holiday } from "../../dashboard/types/dashboard.types";
 
// Converts "14-09-2026" or "2026-09-14T00:00:00" to "2026-09-14"
const toIso = (value: string) => {
  const raw = (value ?? "").slice(0, 10);
  if (/^\d{2}-\d{2}-\d{4}$/.test(raw)) {
    const [dd, mm, yyyy] = raw.split("-");
    return `${yyyy}-${mm}-${dd}`;
  }
  return raw;
};
 
export const useBlockedHolidays = () => {
  const { data } = useGetHolidayListQuery();
 
  // works for both { success, data: [...] } and a plain array
  const raw = data as Holiday[] | { data?: Holiday[] } | undefined;
  const list: Holiday[] = Array.isArray(raw) ? raw : raw?.data ?? [];
 
  // non-optional holidays only (optional ones like Eid stay selectable)
  const blockedHolidayIsos = useMemo(
    () => new Set(list.filter((h) => !h.IsOptional).map((h) => toIso(h.HolidayDate))),
    [list]
  );
 
  // 🔴🔴🔴 CHANGED (START): NEW -> iso date -> holiday name, used by the hover popup.
  // Includes ALL holidays (optional ones too) so every holiday date can show its name.
  const holidayInfo = useMemo(
    () =>
      new Map(
        list.map((h) => [
          toIso(h.HolidayDate),
          { name: h.HolidayName, isOptional: !!h.IsOptional },
        ])
      ),
    [list]
  );
  // 🔴🔴🔴 CHANGED (END)
 
  console.log("HOLIDAY BLOCKED DATES:", [...blockedHolidayIsos]);
 
  return { blockedHolidayIsos, holidayInfo }; // 🔴 CHANGED: also return holidayInfo
};
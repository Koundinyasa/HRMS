import { useMemo } from "react";
import { useGetHolidayListQuery } from "../../dashboard/api/dashboardApi";
import type { Holiday } from "../../dashboard/types/dashboard.types";
 

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
 

  const raw = data as Holiday[] | { data?: Holiday[] } | undefined;
  const list: Holiday[] = useMemo(
    () => (Array.isArray(raw) ? raw : raw?.data ?? []),
    [raw]
  );
 
  const blockedHolidayIsos = useMemo(
    () => new Set(list.filter((h) => !h.IsOptional).map((h) => toIso(h.HolidayDate))),
    [list]
  );
 
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
 
  return { blockedHolidayIsos, holidayInfo };
};
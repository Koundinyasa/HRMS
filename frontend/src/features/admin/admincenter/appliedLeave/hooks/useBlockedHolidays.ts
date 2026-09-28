import { useMemo } from "react";
import { useGetHolidayListQuery } from "@/features/employee/dashboard/api/dashboardApi";

interface Holiday {
  HolidayDate: string;
  HolidayName: string;
  IsOptional?: boolean;
}

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

  const raw = data as
    | Holiday[]
    | { data?: Holiday[] }
    | undefined;

  const list: Holiday[] = Array.isArray(raw)
    ? raw
    : raw?.data ?? [];

  // Non-optional holidays cannot be selected
  const blockedHolidayIsos = useMemo(
    () =>
      new Set(
        list
          .filter((holiday) => !holiday.IsOptional)
          .map((holiday) => toIso(holiday.HolidayDate)),
      ),
    [list],
  );

  // Used to display holiday name in hover popup
  const holidayInfo = useMemo(
    () =>
      new Map(
        list.map((holiday) => [
          toIso(holiday.HolidayDate),
          {
            name: holiday.HolidayName,
            isOptional: !!holiday.IsOptional,
          },
        ]),
      ),
    [list],
  );

  return {
    blockedHolidayIsos,
    holidayInfo,
  };
};
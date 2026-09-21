import { Clock3 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { MonthPicker } from "@/components/ui/monthpicker";

import type { LeaveCalendarHeaderProps } from "../types/leavecalendar.types";

const getMonthAbbreviation = (
  monthIndex: number,
  year: number,
): string =>
  new Date(year, monthIndex, 1).toLocaleDateString("en-US", {
    month: "short",
  });

const findMonthIndexByAbbreviation = (
  abbreviation: string,
  year: number,
): number | undefined => {
  for (let index = 0; index < 12; index += 1) {
    if (getMonthAbbreviation(index, year) === abbreviation) {
      return index;
    }
  }

  return undefined;
};

const LeaveCalendarHeader = ({
  selectedMonth,
  setSelectedMonth,
}: LeaveCalendarHeaderProps) => {
  const navigate = useNavigate();
  const { domain } = useParams();

  const currentYear = new Date().getFullYear();

  const value = `${getMonthAbbreviation(
    selectedMonth,
    currentYear,
  )}/${currentYear}`;

  const handleChange = (next: string) => {
    if (!next) return;

    const [monthAbbr, yearString] = next.split("/");

    const year = Number(yearString) || currentYear;

    const monthIndex = findMonthIndexByAbbreviation(
      monthAbbr,
      year,
    );

    if (monthIndex !== undefined) {
      setSelectedMonth(monthIndex);
    }
  };

  const handleHistory = () => {
    if (!domain) {
      console.error("Domain parameter is missing");
      return;
    }

    navigate(
      `/${domain}/employee/review/leave-calendar/history`,
    );
  };

  return (
    <div className="relative w-full border-b border-gray-200 px-3 py-3 sm:px-4">
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">

        {/* Leave Calendar Title */}
        <h2 className="w-fit shrink-0 border-b-2 border-blue-500 pb-1 text-xs font-semibold text-blue-600 sm:text-sm">
          Leave Calendar
        </h2>

        {/* Month Picker + History */}
        <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto sm:shrink-0">

          {/* Month Picker */}
          <div className="min-w-0 flex-1 sm:w-[140px] sm:flex-none">
            <MonthPicker
              value={value}
              onChange={handleChange}
            />
          </div>

          {/* History Button */}
          <button
            type="button"
            onClick={handleHistory}
            aria-label="Leave calendar history"
            title="History"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 shadow-sm transition hover:bg-gray-100 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100 active:bg-gray-200"
          >
            <Clock3 size={17} />
          </button>

        </div>
      </div>
    </div>
  );
};

export default LeaveCalendarHeader;
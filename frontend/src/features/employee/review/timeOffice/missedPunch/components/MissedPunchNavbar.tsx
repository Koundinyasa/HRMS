import {
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DateField from "@/features/admin/TalentHub/TimeOffice/components/DateField";

import {
  NavLink,
} from "react-router-dom";

import type {
  MissedPunchNavbarProps,
} from "../types/missedPunch.types";

export default function MissedPunchNavbar(
  {
    filters,
    onFromDateChange,
    onToDateChange,
    onRefresh,
  }: MissedPunchNavbarProps,
) {
  const getTabClass = (
    isActive: boolean,
  ) =>
    `whitespace-nowrap border-b-2 px-1 py-5 text-[15px] font-semibold ${
      isActive
        ? "border-[#1997e8] text-[#1997e8]"
        : "border-transparent text-[#68758a]"
    }`;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#e0e5ec] bg-white p-3 lg:flex-row lg:items-center lg:justify-between font-[Urbanist]">
      <div className="flex min-w-max items-center gap-8 overflow-x-auto px-1 font-[Urbanist]">

        {/* PUNCH */}

        <NavLink
          to="../Punch"
          className={({ isActive }) =>
            getTabClass(isActive)
          }
        >
          Punch
        </NavLink>

        {/* MISSED PUNCH */}

        <NavLink
          to="../MissedPunch"
          className={({ isActive }) =>
            getTabClass(isActive)
          }
        >
          Missed Punch
        </NavLink>

        {/* ATTENDANCE */}

        <NavLink
          to="../time-office/regularization/attendance"
          className={({ isActive }) =>
            getTabClass(isActive)
          }
        >
          Attendance
        </NavLink>

        {/* TA INSIGHTS */}

        <NavLink
          to="../TAInsights"
          className={({ isActive }) =>
            getTabClass(isActive)
          }
        >
          TA Insights
        </NavLink>

      </div>

      <div className="flex flex-wrap items-stretch gap-2 sm:items-center sm:gap-3 font-[Urbanist]">
        <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm font-medium text-[#1f2937] sm:flex-row sm:items-center sm:gap-2 font-[Urbanist]">
          From
          <DateField value={filters.fromDate} onChange={onFromDateChange} />
        </label>

        <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm font-medium text-[#1f2937] sm:flex-row sm:items-center sm:gap-2 font-[Urbanist]">
          To
          <DateField value={filters.toDate} onChange={onToDateChange} />
        </label>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Refresh"
          onClick={onRefresh}
          className="text-[#7f94b5] hover:bg-[#f3f6fa] font-[Urbanist]"
        >
          <RefreshCw size={20} />
        </Button>
      </div>
    </div>
  );
}
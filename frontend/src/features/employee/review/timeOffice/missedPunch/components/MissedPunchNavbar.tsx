import {
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import DateField from "@/features/admin/TalentHub/TimeOffice/components/DateField";

import TimeOfficeNavbar from "../../components/TimeOfficeNavbar";
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
  return (
    <TimeOfficeNavbar>
      <label className="flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-medium text-[#1f2937]">
        From
        <DateField
          value={filters.fromDate}
          onChange={onFromDateChange}
          className="w-[132px] shrink-0"
        />
      </label>

      <label className="flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-medium text-[#1f2937]">
        To
        <DateField
          value={filters.toDate}
          onChange={onToDateChange}
          className="w-[132px] shrink-0"
        />
      </label>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        title="Refresh"
        onClick={onRefresh}
        className="shrink-0 text-[#7f94b5] hover:bg-[#f3f6fa]"
      >
        <RefreshCw size={20} />
      </Button>
    </TimeOfficeNavbar>
  );
}
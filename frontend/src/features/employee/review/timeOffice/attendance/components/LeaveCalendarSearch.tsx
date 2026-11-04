import { Search } from "lucide-react";
import type { LeaveCalendarSearchProps } from "../types/leavecalendar.types";

const LeaveCalendarSearch = ({
  searchTerm,
  compact = false,
  setSearchTerm,
}: LeaveCalendarSearchProps) => {
  return (
    <div className="shrink-0 px-0 py-0 font-[Urbanist]">
      <div className={`relative font-[Urbanist] ${compact ? "w-[200px]" : "w-[250px]"}`}>
        <Search
          size={compact ? 14 : 16}
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-400 font-[Urbanist] ${
            compact ? "left-2" : "left-3"
          }`}
        />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Start Typing..."
          className={`w-full rounded-md border border-black outline-none transition focus:border-black focus:ring-2 focus:ring-blue-100 font-[Urbanist] ${
            compact
              ? "h-8 py-1 pl-8 pr-3 text-xs"
              : "h-8 py-1 pl-8 pr-3 text-xs"
          }`}
        />
      </div>
    </div>
  );
};

export default LeaveCalendarSearch;

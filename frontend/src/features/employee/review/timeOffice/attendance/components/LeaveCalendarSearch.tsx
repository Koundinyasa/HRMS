import { Search } from "lucide-react";
import type { LeaveCalendarSearchProps } from "../types/leavecalendar.types";

const LeaveCalendarSearch = ({
  searchTerm,
  setSearchTerm,
}: LeaveCalendarSearchProps) => {
  return (
    <div className="shrink-0 px-0 py-0 font-[Urbanist]">
      <div className="relative w-[250px] font-[Urbanist]">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-[Urbanist]"
        />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Start Typing..."
          className="h-8 w-full rounded-md border border-black py-1 pl-8 pr-3 text-xs outline-none transition focus:border-black focus:ring-2 focus:ring-blue-100 font-[Urbanist]"
        />
      </div>
    </div>
  );
};

export default LeaveCalendarSearch;

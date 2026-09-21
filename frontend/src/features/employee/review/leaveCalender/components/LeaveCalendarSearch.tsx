import { Search } from "lucide-react";
import type { LeaveCalendarSearchProps } from "../types/leavecalendar.types";

const LeaveCalendarSearch = ({
  searchTerm,
  setSearchTerm,
}: LeaveCalendarSearchProps) => {
  return (
    <div className="border-b border-gray-200 px-4 py-3">
      <div className="relative max-w-sm">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Start Typing..."
          className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>
    </div>
  );
};

export default LeaveCalendarSearch;

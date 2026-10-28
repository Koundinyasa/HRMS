import { useState } from "react";
import {
  Bookmark,
  ChevronDown,
  ClockFading,
  Filter,
  Trash2,
} from "lucide-react";
import noDataImage from "@/assets/images/no-data.png";
import AdjustmentFilters from "../components/AdjustmentFilters";
import AdjustmentTabs from "../components/AdjustmentTabs";

const LEAVE_OPTIONS = [
  { name: "Casual Leave", code: "CL", letter: "C" },
  { name: "Compensatory Off", code: "CO", letter: "C" },
  { name: "Loss of Pay", code: "LOP", letter: "L" },
  { name: "Medical Wellness Leave", code: "ML.", letter: "M" },
  { name: "Medical Wellness Leave.", code: "ML", letter: "M" },
  { name: "Restricted Holiday", code: "RH", letter: "R" },
  { name: "Sick Leave", code: "SL", letter: "S" },
];

const LeaveAdjustmentConfigurationPage = () => {
  const [selectedLeave, setSelectedLeave] = useState(0);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("2026-09");
  const [showFilters, setShowFilters] = useState(true);

  const filteredLeaves = LEAVE_OPTIONS.filter((leave) =>
    leave.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex w-full min-w-0 flex-col gap-3 font-[Urbanist]">
      {/* Top Header */}
      <div className="w-full overflow-x-auto rounded-[10px] border border-[#df8d7c] bg-[#fff7f5] px-5 pt-3 shadow-sm [scrollbar-color:#a45a4a_#f3e5e1] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#f3e5e1] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#a45a4a] xl:overflow-x-visible xl:[scrollbar-width:none] xl:[&::-webkit-scrollbar]:hidden">
        <div className="flex w-max min-w-full items-center gap-2">
          {/* Tabs */}
          <div className="shrink-0">
            <AdjustmentTabs />
          </div>

          {/* Right Actions */}
          <div className="flex shrink-0 items-center gap-2 whitespace-nowrap pb-3">
            <span className="text-[14px] font-medium text-slate-700">
              Month/Year
            </span>

            {/* Month */}
            <div className="relative">
              <select
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                className="h-10 w-[150px] appearance-none rounded-md border border-[#ead2cc] bg-white px-3 pr-9 text-[14px] font-medium text-slate-700 outline-none focus:border-[#9a5547]"
              >
                <option value="2026-09">Sep/2026</option>
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>

            {/* Delete */}
            <button
              type="button"
              disabled
              className="flex h-10 shrink-0 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-[13px] font-semibold text-slate-300"
            >
              <Trash2 size={16} strokeWidth={1.8} />
              DELETE
            </button>

            {/* Add New Record */}
            <button
              type="button"
              className="flex h-10 shrink-0 items-center gap-2 rounded-md bg-[#914f3f] px-4 text-[13px] font-semibold text-white transition hover:bg-[#7f4234]"
            >
              <Bookmark size={16} strokeWidth={1.8} />
              Add New Record
            </button>

            {/* Filter */}
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100"
              aria-label="Filter"
            >
              <Filter size={19} strokeWidth={1.8} />
            </button>

            {/* History */}
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100"
              aria-label="History"
            >
              <ClockFading size={20} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Configuration Area */}
      <div className="flex min-h-[650px] w-full min-w-0 flex-col gap-3 lg:flex-row">
        {/* Left Leave List */}
        <div className="w-full min-w-0 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:w-[25%] lg:min-w-[300px]">
          <div className="h-full overflow-y-auto">
            {filteredLeaves.map((leave) => {
              const originalIndex = LEAVE_OPTIONS.findIndex(
                (item) =>
                  item.name === leave.name &&
                  item.code === leave.code,
              );

              const isSelected = selectedLeave === originalIndex;

              return (
                <button
                  key={`${leave.code}-${leave.name}`}
                  type="button"
                  onClick={() => setSelectedLeave(originalIndex)}
                  className={`relative flex w-full items-center gap-4 border-b border-slate-200 px-3 py-3 text-left transition ${
                    isSelected
                      ? "bg-[#fff1ed]"
                      : "bg-white hover:bg-slate-50"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute right-0 top-0 h-full w-[4px] bg-[#9a5547]" />
                  )}

                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[17px] font-medium ${
                      isSelected
                        ? "bg-[#fff1ed] text-[#9a5547]"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {leave.letter}
                  </span>

                  <span className="min-w-0">
                    <span
                      className={`block truncate text-[16px] leading-[20px] ${
                        isSelected
                          ? "font-semibold text-[#9a5547]"
                          : "font-medium text-slate-700"
                      }`}
                    >
                      {leave.name}
                    </span>

                    <span className="mt-1 inline-block rounded-sm bg-slate-100 px-1.5 py-0.5 text-[12px] font-medium text-slate-600">
                      {leave.code}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Area */}
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          {showFilters && (
            <AdjustmentFilters
              searchValue={search}
              onSearchChange={setSearch}
              onAddFilter={() => {}}
              onClear={() => setSearch("")}
              onHideFilters={() => setShowFilters(false)}
            />
          )}

          {/* No Data */}
          <div className="flex min-h-[500px] flex-1 flex-col items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-6 text-center shadow-sm">
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="mb-2 text-[18px] font-semibold text-[#9a5547]">
                {LEAVE_OPTIONS[selectedLeave]?.name}
              </h2>
              <img
                src={noDataImage}
                alt="No data found"
                className="h-48 w-48 max-w-full object-contain sm:h-56 sm:w-56"
              />

              <p className="mt-3 text-[14px] font-medium text-[#C27A86]">
                No Data Found
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveAdjustmentConfigurationPage;    

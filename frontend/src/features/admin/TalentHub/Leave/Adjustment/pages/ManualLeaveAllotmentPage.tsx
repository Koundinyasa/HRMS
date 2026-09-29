// import { useNavigate } from "react-router-dom";
// import AdjustmentActions from "../components/AdjustmentActions";
// import AdjustmentFilters from "../components/AdjustmentFilters";
// import AdjustmentHeader from "../components/AdjustmentHeader";
// import AdjustmentTabs from "../components/AdjustmentTabs";

// const ManualLeaveAllotmentPage = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="flex w-full flex-col gap-4 font-[Urbanist]">
//       <AdjustmentHeader />

//       <AdjustmentTabs />

//       <div className="flex w-full gap-4">
//         {/* Left: Leave Policy */}
//         <div className="w-[25%] min-w-[280px] rounded-lg border border-slate-200 bg-white p-3">
//           <select
//             className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-[13px] font-medium text-slate-600 outline-none focus:border-[#9a5547]"
//             defaultValue=""
//           >
//             <option value="" disabled>
//               Select Leave Policy
//             </option>
//           </select>
//         </div>

//         {/* Right */}
//         <div className="flex min-w-0 flex-1 flex-col gap-3">
//           <AdjustmentFilters />

//           {/* No Data */}
//           <div className="flex min-h-[500px] flex-col items-center justify-center rounded-lg bg-white">
//             <img
//               src="/no-data.png"
//               alt="No data found"
//               className="h-52 w-52 object-contain"
//             />

//             <p className="mt-4 text-[16px] font-medium text-[#C27A86]">
//               No Data Found in - Manual leave allotment
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ManualLeaveAllotmentPage;

import { useState } from "react";
import {
  Bookmark,
  ChevronDown,
  ClockFading,
  Filter,
  Trash2,
} from "lucide-react";
import AdjustmentFilters from "../components/AdjustmentFilters";
import AdjustmentTabs from "../components/AdjustmentTabs";
import noDataImage from "@/assets/images/no-data.png";

const LEAVE_OPTIONS = [
  { name: "Casual Leave", code: "CL", letter: "C" },
  { name: "Compensatory Off", code: "CO", letter: "C" },
  { name: "Loss of Pay", code: "LOP", letter: "L" },
  { name: "Medical Wellness Leave", code: "ML.", letter: "M" },
  { name: "Medical Wellness Leave.", code: "ML", letter: "M" },
  { name: "Restricted Holiday", code: "RH", letter: "R" },
  { name: "Sick Leave", code: "SL", letter: "S" },
];

const ManualLeaveAllotmentPage = () => {
  const [selectedLeave, setSelectedLeave] = useState(0);
  const [search, setSearch] = useState("");
  const [month, setMonth] = useState("2026-09");
  const [showFilters, setShowFilters] = useState(true);

  const filteredLeaves = LEAVE_OPTIONS.filter((leave) =>
    leave.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex w-full min-w-0 flex-col gap-3 overflow-x-hidden font-[Urbanist]">
      {/* =====================================================
          TOP HEADER
         ===================================================== */}
      <div className="w-full overflow-x-auto rounded-[10px] border border-[#df8d7c] bg-[#fff7f5] px-5 pt-3 shadow-sm [scrollbar-color:#a45a4a_#f3e5e1] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#f3e5e1] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#a45a4a] xl:overflow-x-visible xl:[scrollbar-width:none] xl:[&::-webkit-scrollbar]:hidden">
        <div className="flex w-max min-w-full items-center gap-2">
          {/* Tabs */}
          <div className="shrink-0">
            <AdjustmentTabs />
          </div>

          {/* Right Actions */}
          <div className="flex shrink-0 items-center gap-2 whitespace-nowrap pb-3">
            <span className="text-[13px] font-medium text-slate-700">
              Month/Year
            </span>

            {/* Month */}
            <div className="relative">
              <select
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                className="h-9 w-[135px] appearance-none rounded-md border border-[#ead2cc] bg-white px-3 pr-8 text-[13px] font-medium text-slate-700 outline-none focus:border-[#9a5547]"
              >
                <option value="2026-09">Sep/2026</option>
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </div>

            {/* Delete */}
            <button
              type="button"
              disabled
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-[12px] font-semibold text-slate-300"
            >
              <Trash2 size={15} strokeWidth={1.8} />
              DELETE
            </button>

            {/* Add New Record */}
            <button
              type="button"
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-md bg-[#914f3f] px-3 text-[12px] font-semibold text-white transition hover:bg-[#7f4234]"
            >
              <Bookmark size={15} strokeWidth={1.8} />
              Add New Record
            </button>

            {/* Filter */}
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100"
              aria-label="Filter"
            >
              <Filter size={18} strokeWidth={1.8} />
            </button>

            {/* History */}
            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100"
              aria-label="History"
            >
              <ClockFading size={19} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN AREA
         ===================================================== */}
      <div className="flex min-h-[650px] w-full min-w-0 flex-col gap-3 overflow-visible lg:flex-row">
        {/* ===================================================
            LEFT LEAVE LIST
           =================================================== */}
        <div className="w-full min-w-0 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:w-[25%] lg:min-w-[280px]">
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
                  className={`relative flex w-full items-center gap-3 border-b border-slate-200 px-3 py-3 text-left transition ${
                    isSelected
                      ? "bg-[#fff1ed]"
                      : "bg-white hover:bg-slate-50"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute right-0 top-0 h-full w-[3px] bg-[#9a5547]" />
                  )}

                  {/* Letter */}
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[16px] font-medium ${
                      isSelected
                        ? "bg-[#fff1ed] text-[#9a5547]"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {leave.letter}
                  </span>

                  {/* Leave name */}
                  <span className="min-w-0">
                    <span
                      className={`block truncate text-[15px] leading-[20px] ${
                        isSelected
                          ? "font-semibold text-[#9a5547]"
                          : "font-medium text-slate-700"
                      }`}
                    >
                      {leave.name}
                    </span>

                    <span className="mt-1 inline-block rounded-sm bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
                      {leave.code}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================================================
            RIGHT AREA
           =================================================== */}
        <div className="flex min-w-0 flex-1 flex-col gap-3 overflow-visible">
          {/* Filter */}
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
          <div className="flex min-h-[500px] flex-1 flex-col items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white px-4 py-6 text-center shadow-sm">
            <div className="flex flex-col items-center justify-center">
              <h2 className="mb-2 text-[18px] font-semibold text-[#9a5547]">
                {LEAVE_OPTIONS[selectedLeave]?.name}
              </h2>
              <img
                src={noDataImage}
                alt="No data found"
                className="h-48 w-48 max-w-full object-contain"
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

export default ManualLeaveAllotmentPage;

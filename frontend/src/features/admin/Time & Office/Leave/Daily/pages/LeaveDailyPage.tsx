import {
  Bookmark,
  ChevronDown,
  ClockFading,
  FileSpreadsheet,
  MoreVertical,
  Plus,
  Search,
  Funnel,
  X,
} from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import * as XLSX from "xlsx";
import noDataImage from "@/assets/images/no-data.png";
import LeaveQueryFilter from "../../components/LeaveQueryFilter";

const LeaveDailyPage = () => {
  const [month, setMonth] = useState("Sep/2026");
  const [leavePolicy, setLeavePolicy] = useState("Employee Leave Policy");
  const [policyMenu, setPolicyMenu] = useState<{ top: number; left: number; width: number } | null>(null);
  const [search, setSearch] = useState("");
  const [showFilterBar, setShowFilterBar] = useState(true);
  const [dateRange, setDateRange] = useState(14);
  const days = Array.from({ length: 30 }, (_, index) => index + 1);
  const weekdays = ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"];
  const dayGridStyle = {
    width: "max(100%, 1180px)",
    gridTemplateColumns: "minmax(270px, 18%) 70px repeat(30, minmax(0, 1fr)) 90px 112px",
    columnGap: "4px",
  };
  const dayTableGridStyle = {
    ...dayGridStyle,
    gridTemplateColumns: "minmax(270px, 18%) 70px repeat(30, minmax(0, 1fr))",
  };
  const dayCellGridStyle = {
    width: "100%",
    gridTemplateColumns: "repeat(30, minmax(0, 1fr))",
    columnGap: "4px",
    rowGap: "6px",
    justifyItems: "center",
  };
  const exportDailyAttendance = () => {
    const worksheet = XLSX.utils.aoa_to_sheet([
      ["Daily Attendance", month],
      ["Date Range", `01-${String(dateRange).padStart(2, "0")}`],
      ["Field", ...days.map((day) => String(day).padStart(2, "0"))],
      ["Weekday", ...days.map((day) => weekdays[(day - 1) % weekdays.length])],
      ["Selected", ...days.map((day) => day <= dateRange ? "Yes" : "No")],
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Daily Attendance");
    XLSX.writeFile(workbook, `daily-attendance-${month.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.xlsx`);
  };
  const togglePolicyMenu = (button: HTMLButtonElement) => {
    if (policyMenu) {
      setPolicyMenu(null);
      return;
    }
    const rect = button.getBoundingClientRect();
    const width = Math.min(252, window.innerWidth - 24);
    const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12));
    const menuHeight = 100;
    const top = rect.bottom + menuHeight + 8 <= window.innerHeight
      ? rect.bottom + 4
      : Math.max(12, rect.top - menuHeight - 4);
    setPolicyMenu({ top, left, width });
  };
  return (
    <div className="flex w-full min-w-0 flex-col gap-3 bg-[#f6f8fb] font-[Urbanist] text-[#101828]">
      <div className="flex min-h-[78px] min-w-0 flex-nowrap items-center justify-between gap-3 overflow-x-auto rounded-[10px] border border-[#df8d7c] bg-[#fff7f5] px-3 py-3 shadow-[0_1px_3px_rgba(15,23,42,0.04)] [scrollbar-color:#c58b7f_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#c58b7f] xl:overflow-x-visible sm:px-5">
        <nav className="flex h-full shrink-0 items-center gap-3 sm:gap-12">
          <NavLink
            to="../apply-leave"
            className="inline-flex h-[46px] items-center rounded-[9px] border border-[#df8d7c] bg-white px-4 text-[20px] font-bold text-[#9a5547] shadow-sm"
          >
            Apply Leave
          </NavLink>
          <NavLink
            to="../import"
            className="text-[18px] font-semibold text-[#9a5547] hover:text-[#7f4234]"
          >
            Import
          </NavLink>
        </nav>

        <div className="flex shrink-0 flex-nowrap items-center gap-2">
          <button type="button" aria-label="Leave policy" aria-expanded={Boolean(policyMenu)} onClick={(event) => togglePolicyMenu(event.currentTarget)} className="flex h-11 w-[252px] shrink-0 items-center justify-between rounded-[6px] border-0 bg-[#eef1f7] px-3 text-sm font-medium text-[#303746] outline-none focus:ring-2 focus:ring-[#f8e4df] sm:px-4 sm:text-base">
            <span className="truncate">{leavePolicy}</span>
            <ChevronDown className="ml-2 shrink-0 text-[#707887]" size={16} />
          </button>
          <div className="relative">
            <select
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              className="h-11 w-full max-w-[188px] appearance-none rounded-[6px] border-0 bg-[#eef1f7] px-3 text-sm font-medium text-[#303746] outline-none focus:ring-2 focus:ring-[#f8e4df] sm:w-[188px] sm:px-4 sm:text-base"
            >
              <option>Sep/2026</option>
              <option>Oct/2026</option>
              <option>Nov/2026</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#707887]" size={16} />
          </div>
          <button type="button" disabled className="flex h-11 items-center gap-2 rounded-[6px] bg-[#e1e3e8] px-5 text-[16px] font-semibold text-[#a3a6ac]">
            <Bookmark size={17} /> Reprocess
          </button>
          <button type="button" aria-label="Export to Excel" title="Export to Excel" onClick={exportDailyAttendance} className="p-2 text-[#168b4c] hover:bg-[#eff8f2]"><FileSpreadsheet size={25} /></button>
          <button type="button" aria-label="Show filters" title="Show filters" onClick={() => setShowFilterBar(true)} className="p-2 text-[#7e91ad] hover:bg-[#f2f5f9]"><Funnel size={22} /></button>
          <button type="button" aria-label="History" className="p-2 text-[#7e91ad] hover:bg-[#f2f5f9]"><ClockFading size={23} /></button>
        </div>
      </div>

      <div className={`min-w-0 overflow-x-auto rounded-[7px] border border-[#e3e7ee] bg-white px-4 py-2 shadow-[0_2px_7px_rgba(16,24,40,0.04)] [scrollbar-color:#c58b7f_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#c58b7f] xl:overflow-x-visible ${showFilterBar ? "" : "hidden"}`}>
        <div className="flex min-h-[40px] w-max min-w-full flex-nowrap items-center gap-x-4 xl:w-full xl:flex-wrap">
        <div className="flex w-[220px] shrink-0 items-center gap-3 text-[#9aa6b9]">
          <Search size={22} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Start Typing..." className="w-full bg-transparent text-[16px] outline-none placeholder:text-[#d2d6df]" />
        </div>
        <button type="button" className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[16px] font-semibold text-[#5f6570]"><Plus size={20} /> Add Filter</button>
        <LeaveQueryFilter value={search} onChange={setSearch} />
        {[
          "Branch", "Salary Structure", "Leave", "Attendance", "Designation", "Emp Status",
        ].map((label) => (
          <button type="button" key={label} className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[15px] font-semibold text-[#626874] hover:text-[#168dcc]">
            {label}<ChevronDown size={15} />
          </button>
        ))}
        <button type="button" aria-label="More filters" className="shrink-0 text-[#8795ab]"><MoreVertical size={21} /></button>
        <button type="button" aria-label="Close filters" title="Close filters" onClick={() => { setSearch(""); setShowFilterBar(false); }} className="ml-auto shrink-0 text-[#e33c4b]"><X size={22} /></button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[7px] border border-[#e3e7ee] bg-white shadow-[0_2px_7px_rgba(16,24,40,0.04)]">
        <div className="overflow-x-auto [scrollbar-color:#a45a4a_#f3e5e1] [scrollbar-width:auto] [&::-webkit-scrollbar]:h-2.5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#f3e5e1] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#a45a4a]">
        <div className="grid items-center gap-3 border-b border-[#e3e7ee] px-5 py-3" style={dayGridStyle}>
          <span className="pr-3 text-right text-[16px] font-bold">Date Range</span>
          <div className="relative" style={{ gridColumn: "3 / span 30" }}>
            <div className="relative h-1 w-full">
              <input type="range" min="1" max="30" step="1" value={dateRange} onChange={(event) => setDateRange(Number(event.target.value))} className="absolute inset-0 z-10 h-1 w-full accent-[#9a5547]" aria-label="Date range" />
              <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 grid -translate-y-1/2" style={dayCellGridStyle}>
                {days.map((day) => <span key={day} className="flex justify-center"><span className="h-[3px] w-[3px] rounded-full bg-[#9a5547]" /></span>)}
              </div>
            </div>
            <div className="mt-2 grid text-center text-[14px] text-[#738096]" style={dayCellGridStyle}>{days.map((day) => <span key={day}>{String(day).padStart(2, "0")}</span>)}</div>
          </div>
          <div className="relative w-[90px]" style={{ gridColumn: 33 }}>
            <select defaultValue="P" aria-label="Attendance code" className="h-11 w-full appearance-none rounded-[6px] bg-[#eef1f7] px-3 pr-8 text-[16px] font-medium text-[#303746] outline-none focus:ring-2 focus:ring-[#f8e4df]">
              {["P", "LOP", "CL", "SL", "RH", "ML"].map((code) => <option key={code} value={code}>{code}</option>)}
            </select>
            <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#707887]" />
          </div>
          <button type="button" className="flex h-11 items-center gap-2 whitespace-nowrap rounded-[6px] bg-[#914f3f] px-4 text-[16px] font-semibold text-white shadow-[0_2px_5px_rgba(145,79,63,0.3)] hover:bg-[#7f4234]" style={{ gridColumn: 34 }}><Bookmark size={17} /> Apply</button>
        </div>

          <div className="grid items-stretch bg-[#fff1ed] text-[14px] font-semibold" style={dayTableGridStyle}>
          <div className="flex flex-col justify-between border-r border-[#f0d4cc] px-4 py-3">
            <label className="flex items-center gap-4"><input type="checkbox" className="h-[19px] w-[19px] accent-[#9a5547]" /> Dates</label>
            <label className="flex items-center gap-4"><input type="checkbox" className="h-[19px] w-[19px] accent-[#9a5547]" /> Emp Id / Name</label>
          </div>
          <div className="flex flex-col justify-around border-r border-[#f0d4cc] text-left text-[15px]">
            <span>Pay/<br />Present</span>
            <span>Days</span>
          </div>
          <div className="grid grid-rows-[43px_auto_auto] text-center text-[14px]" style={{ gridColumn: "3 / span 30" }}>
            <div className="grid items-center" style={dayCellGridStyle}>{days.map((day) => <label key={day} className="flex h-full w-full items-center justify-center"><input type="checkbox" checked={day <= dateRange} onChange={() => setDateRange(day)} className="h-[19px] w-[19px] accent-[#9a5547]" aria-label={`Select day ${day}`} /></label>)}</div>
            <div className="grid items-center" style={dayCellGridStyle}>{days.map((day) => <span key={day} className="flex h-full w-full items-center justify-center">{day}</span>)}</div>
            <div className="grid items-center" style={dayCellGridStyle}>{days.map((day) => <span key={day} className="flex h-full w-full items-center justify-center whitespace-nowrap text-[11px] leading-none tracking-[-0.04em]">{weekdays[(day - 1) % weekdays.length]}</span>)}</div>
          </div>
        </div>
        </div>

        <div className="flex min-h-[380px] flex-col items-center justify-center border-t border-[#e3e7ee] bg-white px-5 py-10 text-center">
          <img src={noDataImage} alt="No data available" className="h-auto w-[330px] max-w-full object-contain" />
          <p className="mt-6 font-[Urbanist] text-[18px] text-[#52617a]">
            Select at least one category to view records.
          </p>
        </div>
      </div>
      {policyMenu && createPortal(
        <>
          <button type="button" aria-label="Close leave policy menu" onClick={() => setPolicyMenu(null)} className="fixed inset-0 z-[1000] cursor-default" />
          <div role="listbox" aria-label="Leave policy options" className="fixed z-[1001] overflow-hidden rounded-md border border-[#d9dde5] bg-white py-1 shadow-[0_8px_24px_rgba(16,24,40,0.2)]" style={{ top: policyMenu.top, left: policyMenu.left, width: policyMenu.width }}>
            {["Employee Leave Policy", "Intern Leave Policy"].map((option) => (
              <button key={option} type="button" role="option" aria-selected={leavePolicy === option} onClick={() => { setLeavePolicy(option); setPolicyMenu(null); }} className="block w-full px-4 py-2 text-left text-sm font-medium text-[#303746] hover:bg-[#fff1ed]">
                {option}
              </button>
            ))}
          </div>
        </>,
        document.body,
      )}
    </div>
  );
};

export default LeaveDailyPage;

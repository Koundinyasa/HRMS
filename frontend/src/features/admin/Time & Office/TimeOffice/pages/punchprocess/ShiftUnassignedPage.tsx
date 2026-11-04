import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Bookmark, ClockFading, FileSpreadsheet, Filter, MoreVertical, Plus, Search, Trash2, X } from "lucide-react";
import DateField from "../../components/DateField";
import DropdownSelect from "../../../../components/DropdownSelect";
import ImportPanel from "../../components/ImportPanel";
import * as XLSX from "xlsx";

const SHIFT_UNASSIGNED_TABS = [
  { label: "Shift Pattern", path: "shift-pattern" },
  { label: "Temporary Shift", path: "temporary-shift" },
  { label: "Shift Roster", path: "shift-roster" },
  { label: "Weekly Off", path: "weekly-off" },
  { label: "Import", path: "import" },
] as const;

export default function ShiftUnassignedPage() {
  const { domain, tab = "shift-pattern" } = useParams();
  const basePath = `/${domain}/admin/time-office/timeoffice/shift-unassigned`;
  const activeTab: { label: string; path: string } = SHIFT_UNASSIGNED_TABS.find((item) => item.path === tab) ?? SHIFT_UNASSIGNED_TABS[0];
  const [patternFrom, setPatternFrom] = useState("");
  const [patternTo, setPatternTo] = useState("");
  const [monthYear, setMonthYear] = useState("2026-10");
  const [effectiveFromDoj, setEffectiveFromDoj] = useState(false);
  const [effectiveDate, setEffectiveDate] = useState("2026-10-14");
  const [selectedShift, setSelectedShift] = useState("");
  const [applyWeeklyOff, setApplyWeeklyOff] = useState(false);
  const [weeklyOffAction, setWeeklyOffAction] = useState<"assign" | "delete">("assign");
  const [search, setSearch] = useState("");
  const filterLabels = ["Query", "T&A Policy", "Pattern", "TA Supervisor", "Attendance", "Leave"];
  const monthYearOptions = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(2026, index, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    return {
      value,
      label: `${date.toLocaleString("en", { month: "short" })}/${date.getFullYear()}`,
    };
  });
  const downloadExcelTemplate = () => {
    const sheet = XLSX.utils.aoa_to_sheet([
      ["Employee Id", "Employee Name", "Current Shift Pattern", "New Shift Pattern", "Effective From DOJ", "Effective Date"],
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Shift Pattern");
    XLSX.writeFile(workbook, "Shift_Pattern_Template.xlsx");
  };
  const [rosterYear, rosterMonth] = monthYear.split("-").map(Number);
  const daysInMonth = new Date(rosterYear, rosterMonth, 0).getDate();
  const rosterDays = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const date = new Date(rosterYear, rosterMonth - 1, day);
    return {
      day,
      weekday: date.toLocaleString("en", { weekday: "short" }),
    };
  });
  const downloadRoster = () => {
    const sheet = XLSX.utils.aoa_to_sheet([
      ["Employee Id", "Employee Name", ...rosterDays.map(({ day }) => day)],
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Shift Roster");
    XLSX.writeFile(workbook, `Shift_Roster_${monthYear}.xlsx`);
  };
  const downloadWeeklyOffTemplate = () => {
    const sheet = XLSX.utils.aoa_to_sheet([
      ["Employee Id", "Employee Name", "Weekly Off Day", "Month/Year"],
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Weekly Off");
    XLSX.writeFile(workbook, `Weekly_Off_${monthYear}.xlsx`);
  };

  return (
    <div className="flex flex-col gap-4">
      <nav
        aria-label="Shift unassigned navigation"
        className="punch-horizontal-scroll w-full min-w-0 overflow-x-auto overscroll-x-contain [scrollbar-width:thin] sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden [touch-action:pan-x]"
      >
        <div className="flex w-max min-w-full flex-nowrap items-center justify-between gap-8 rounded-xl border border-slate-200 bg-white px-5 shadow-sm">
          <div className="flex w-max shrink-0 items-center gap-12">
            {SHIFT_UNASSIGNED_TABS.map((item) => (
              <NavLink
                key={item.path}
                to={`${basePath}/${item.path}`}
                className={({ isActive }) =>
                  `relative shrink-0 py-4 text-base font-semibold whitespace-nowrap transition-colors after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full ${
                    isActive ? "text-sky-500 after:bg-sky-500" : "text-slate-500 after:bg-transparent hover:text-slate-700"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-3 text-slate-400">
            {activeTab.path !== "shift-roster" && activeTab.path !== "weekly-off" && activeTab.path !== "import" && <DropdownSelect
                value={monthYear}
                onChange={setMonthYear}
                options={monthYearOptions}
                menuClassName="w-32"
                className="h-10 w-[190px] justify-between rounded-md border border-slate-200 bg-slate-100 px-3 text-sm font-medium text-slate-800 shadow-sm"
              />}
            {activeTab.path !== "shift-pattern" && activeTab.path !== "shift-roster" && activeTab.path !== "weekly-off" && activeTab.path !== "import" && (
              <button type="button" className="flex h-12 items-center gap-2 rounded-lg bg-sky-500 px-5 text-base font-semibold text-white hover:bg-sky-600">
                <Plus size={19} strokeWidth={2.5} /> Assign
              </button>
            )}
            <button type="button" aria-label="Filter"><Filter size={19} /></button>
            <button type="button" aria-label="History"><ClockFading size={21} /></button>
          </div>
        </div>
      </nav>

      {activeTab.path === "shift-pattern" ? (
        <>
          <section className="punch-horizontal-scroll flex w-full min-w-0 flex-nowrap items-center justify-between gap-3 overflow-x-auto overscroll-x-contain rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm [scrollbar-width:thin] sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden [touch-action:pan-x]">
            <label className="flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-semibold text-slate-800">
              Pattern From -
              <DropdownSelect
                value={patternFrom}
                onChange={setPatternFrom}
                options={[{ label: "Unassigned Pattern", value: "unassigned" }]}
                placeholder="Unassigned Pattern"
                portalMenu
                className="h-9 min-w-[145px] rounded-lg px-1 text-sm font-semibold text-sky-500"
              />
            </label>

            <div className="flex w-max shrink-0 items-center justify-end gap-x-3">
              <label className="flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-slate-800">
                Shift Pattern To -
                <DropdownSelect
                  value={patternTo}
                  onChange={setPatternTo}
                  options={[{ label: "Patterns", value: "patterns" }]}
                  placeholder="Patterns"
                  portalMenu
                  className="h-9 min-w-[95px] rounded-lg px-1 text-sm font-medium text-slate-600"
                />
              </label>
              <label className="flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-slate-800">
                Effective From DOJ
                <button
                  type="button"
                  role="switch"
                  aria-checked={effectiveFromDoj}
                  onClick={() => setEffectiveFromDoj((value) => !value)}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${effectiveFromDoj ? "bg-sky-500" : "bg-slate-300"}`}
                >
                  <span className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${effectiveFromDoj ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </label>
              <DateField label="Effective Date" value={effectiveDate} onChange={setEffectiveDate} className="flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-slate-800 [&>div]:w-[165px]" />
              <button type="button" className="flex h-10 shrink-0 items-center gap-2 rounded-lg bg-sky-500 px-3 text-sm font-semibold text-white hover:bg-sky-600">
                <Bookmark size={17} /> Update
              </button>
              <button type="button" aria-label="Download Excel template" title="Download Excel template" onClick={downloadExcelTemplate} className="shrink-0 text-emerald-600 hover:text-emerald-700"><FileSpreadsheet size={22} /></button>
            </div>
          </section>

          <section className="-mt-3 punch-horizontal-scroll flex w-full min-w-0 flex-nowrap items-center gap-2 overflow-x-auto overscroll-x-contain rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm [scrollbar-width:thin] sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden [touch-action:pan-x]">
            <div className="relative min-w-[180px] flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Start Typing..." className="h-8 w-full border-0 bg-transparent pl-8 pr-2 text-sm outline-none placeholder:text-slate-300 focus:ring-0" />
            </div>
            <button type="button" className="flex shrink-0 items-center gap-1 whitespace-nowrap px-2 text-sm font-medium text-slate-600"><Plus size={15} /> Add Filter</button>
            {filterLabels.map((label) => (
              <DropdownSelect key={label} value="" onChange={() => undefined} options={[{ label, value: "" }]} menuClassName="w-48" align={label === "Leave" ? "right" : "left"} portalMenu className="h-8 max-w-40 rounded-lg border border-slate-200 px-2 text-sm text-slate-600" />
            ))}
            <button type="button" aria-label="More filters" className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-500"><MoreVertical size={17} /></button>
            <button type="button" aria-label="Clear filters" onClick={() => setSearch("")} className="flex h-8 w-8 shrink-0 items-center justify-center text-red-500"><X size={19} /></button>
          </section>

          <section className="flex min-h-[240px] items-center justify-center rounded-xl border border-slate-200 bg-white p-6">
            <img src="/no-data.png" alt="No shift pattern data available" className="h-64 w-64 object-contain" />
          </section>
        </>
      ) : activeTab.path === "shift-roster" ? (
        <>
          <section className="punch-horizontal-scroll w-full min-w-0 overflow-x-auto overscroll-x-contain rounded-xl border border-slate-200 bg-white px-4 py-2 shadow-sm [scrollbar-width:thin] sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden [touch-action:pan-x]">
            <div className="flex w-max min-w-full flex-nowrap items-center justify-end gap-3">
            <DropdownSelect
              value={monthYear}
              onChange={setMonthYear}
              options={monthYearOptions}
              menuClassName="w-32"
              portalMenu
              className="h-10 w-[175px] justify-between rounded-md border border-slate-200 bg-slate-100 px-3 text-sm font-medium text-slate-800 shadow-sm"
            />
            <DropdownSelect
              value={selectedShift}
              onChange={setSelectedShift}
              options={[
                { label: "Select Shift", value: "" },
                { label: "General Shift", value: "general" },
                { label: "Morning Shift", value: "morning" },
                { label: "Night Shift", value: "night" },
              ]}
              placeholder="Select Shift"
              menuClassName="w-44"
              portalMenu
              className="h-10 w-[190px] justify-between rounded-md border border-slate-200 px-3 text-sm text-slate-700"
            />
            <div className="flex h-10 shrink-0 items-center gap-3 rounded-lg bg-slate-50 px-4 text-sm font-medium text-slate-700">
              Apply WO
              <button
                type="button"
                role="switch"
                aria-checked={applyWeeklyOff}
                onClick={() => setApplyWeeklyOff((current) => !current)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${applyWeeklyOff ? "bg-sky-500" : "bg-slate-400"}`}
              >
                <span className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${applyWeeklyOff ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
            <button type="button" disabled={!selectedShift} className="flex h-10 shrink-0 items-center gap-2 rounded-lg bg-slate-200 px-4 text-sm font-semibold text-slate-500 disabled:cursor-not-allowed">
              <Bookmark size={16} /> Update
            </button>
            <button type="button" aria-label="Delete selected assignments" disabled className="flex h-10 w-9 shrink-0 items-center justify-center text-slate-400 disabled:cursor-not-allowed">
              <Trash2 size={18} />
            </button>
            <button type="button" aria-label="Download shift roster" title="Download shift roster" onClick={downloadRoster} className="shrink-0 text-emerald-600 hover:text-emerald-700">
              <FileSpreadsheet size={22} />
            </button>
            </div>
          </section>

          <section className="-mt-2 punch-horizontal-scroll flex w-full min-w-0 flex-nowrap items-center gap-2 overflow-x-auto overscroll-x-contain rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm [scrollbar-width:thin] sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden [touch-action:pan-x]">
            <div className="relative min-w-[180px] flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Start Typing..." className="h-8 w-full border-0 bg-transparent pl-8 pr-2 text-sm outline-none placeholder:text-slate-300 focus:ring-0" />
            </div>
            <button type="button" className="flex shrink-0 items-center gap-1 whitespace-nowrap px-2 text-sm font-medium text-slate-600"><Plus size={15} /> Add Filter</button>
            {filterLabels.map((label) => (
              <DropdownSelect key={label} value="" onChange={() => undefined} options={[{ label, value: "" }]} menuClassName="w-48" align={label === "Leave" ? "right" : "left"} portalMenu className="h-8 max-w-40 rounded-lg border border-slate-200 px-2 text-sm text-slate-600" />
            ))}
            <button type="button" aria-label="More filters" className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-500"><MoreVertical size={17} /></button>
            <button type="button" aria-label="Clear filters" onClick={() => setSearch("")} className="flex h-8 w-8 shrink-0 items-center justify-center text-red-500"><X size={19} /></button>
          </section>

          <div className="punch-horizontal-scroll responsive-only-horizontal-scrollbar min-w-0 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm sm:overflow-x-hidden">
            <div className="shift-roster-grid-content" style={{ minWidth: `${170 + daysInMonth * 42}px` }}>
              <div className="grid h-[100px] border-b border-slate-200 bg-[#D5EAF7]" style={{ gridTemplateColumns: `minmax(170px, 1.4fr) repeat(${daysInMonth}, minmax(0, 1fr))` }}>
                <div className="flex flex-col justify-between px-3 py-3 text-sm font-medium text-slate-800">
                  <label className="flex items-center gap-3"><input type="checkbox" aria-label="Select all dates" className="h-4 w-4" /> Dates</label>
                  <label className="flex items-center gap-3"><input type="checkbox" aria-label="Select all employees" className="h-4 w-4" /> Emp Id / Name</label>
                </div>
                {rosterDays.map(({ day, weekday }) => (
                  <div key={day} className="flex min-w-0 flex-col items-center justify-between border-l border-white/70 py-3 text-[11px] text-slate-800">
                    <input type="checkbox" aria-label={`Select ${day} ${weekday}`} className="h-3.5 w-3.5 shrink-0" />
                    <span className="font-medium">{day}</span>
                    <span className="truncate">{weekday}</span>
                  </div>
                ))}
              </div>

              <div className="flex min-h-[300px] items-center justify-center bg-white p-6">
                <img src="/no-data.png" alt="No shift roster data available" className="h-64 w-64 object-contain" />
              </div>
            </div>
          </div>
        </>
      ) : activeTab.path === "weekly-off" ? (
        <>
          <section className="punch-horizontal-scroll w-full min-w-0 overflow-x-auto overscroll-x-contain rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm [scrollbar-width:thin] sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden [touch-action:pan-x]">
            <div className="flex w-max min-w-full flex-nowrap items-center justify-between gap-3">
            <div className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setWeeklyOffAction("assign")}
                className={`h-10 rounded-md px-4 text-base font-medium whitespace-nowrap transition-colors ${weeklyOffAction === "assign" ? "bg-sky-100 text-sky-500" : "text-slate-600 hover:text-slate-800"}`}
              >
                Assign Weekly Off
              </button>
              <button
                type="button"
                onClick={() => setWeeklyOffAction("delete")}
                className={`h-10 rounded-md px-4 text-base font-medium whitespace-nowrap transition-colors ${weeklyOffAction === "delete" ? "bg-sky-100 text-sky-500" : "text-slate-600 hover:text-slate-800"}`}
              >
                Delete Weekly Off
              </button>
            </div>
            <div className="flex w-max shrink-0 items-center gap-3">
              <DropdownSelect
                value={monthYear}
                onChange={setMonthYear}
                options={monthYearOptions}
                menuClassName="w-32"
                portalMenu
                className="h-10 w-[190px] justify-between rounded-md border border-slate-200 bg-slate-100 px-3 text-sm font-medium text-slate-800 shadow-sm"
              />
              <button type="button" className="flex h-10 shrink-0 items-center gap-2 rounded-lg bg-sky-500 px-5 text-sm font-semibold text-white hover:bg-sky-600">
                <Bookmark size={17} /> Bulk Update
              </button>
              {weeklyOffAction === "assign" && (
                <button type="button" aria-label="Download Weekly Off Excel template" title="Download Weekly Off Excel template" onClick={downloadWeeklyOffTemplate} className="shrink-0 text-emerald-600 hover:text-emerald-700">
                  <FileSpreadsheet size={22} />
                </button>
              )}
            </div>
            </div>
          </section>

          <section className="-mt-3 punch-horizontal-scroll flex w-full min-w-0 flex-nowrap items-center gap-2 overflow-x-auto overscroll-x-contain rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm [scrollbar-width:thin] sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden [touch-action:pan-x]">
            <div className="relative min-w-[180px] flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Start Typing..." className="h-8 w-full border-0 bg-transparent pl-8 pr-2 text-sm outline-none placeholder:text-slate-300 focus:ring-0" />
            </div>
            <button type="button" className="flex shrink-0 items-center gap-1 whitespace-nowrap px-2 text-sm font-medium text-slate-600"><Plus size={15} /> Add Filter</button>
            {filterLabels.map((label) => (
              <DropdownSelect key={label} value="" onChange={() => undefined} options={[{ label, value: "" }]} menuClassName="w-48" align={label === "Leave" ? "right" : "left"} portalMenu className="h-8 max-w-40 rounded-lg border border-slate-200 px-2 text-sm text-slate-600" />
            ))}
            <button type="button" aria-label="More filters" className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-500"><MoreVertical size={17} /></button>
            <button type="button" aria-label="Clear filters" onClick={() => setSearch("")} className="flex h-8 w-8 shrink-0 items-center justify-center text-red-500"><X size={19} /></button>
          </section>
          <section className="flex min-h-[300px] items-center justify-center rounded-xl border border-slate-200 bg-white p-6">
            <img src="/no-data.png" alt="No weekly off data available" className="h-64 w-64 object-contain" />
          </section>
        </>
      ) : activeTab.path === "temporary-shift" ? (
        <>
          <section className="-mt-2 punch-horizontal-scroll flex w-full min-w-0 flex-nowrap items-center gap-2 overflow-x-auto overscroll-x-contain rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm [scrollbar-width:thin] sm:[scrollbar-width:none] sm:[&::-webkit-scrollbar]:hidden [touch-action:pan-x]">
            <div className="relative min-w-[180px] flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Start Typing..." className="h-8 w-full border-0 bg-transparent pl-8 pr-2 text-sm outline-none placeholder:text-slate-300 focus:ring-0" />
            </div>
            <button type="button" className="flex shrink-0 items-center gap-1 whitespace-nowrap px-2 text-sm font-medium text-slate-600"><Plus size={15} /> Add Filter</button>
            {filterLabels.map((label) => (
              <DropdownSelect key={label} value="" onChange={() => undefined} options={[{ label, value: "" }]} menuClassName="w-48" align={label === "Leave" ? "right" : "left"} portalMenu className="h-8 max-w-40 rounded-lg border border-slate-200 px-2 text-sm text-slate-600" />
            ))}
            <button type="button" aria-label="More filters" className="flex h-8 w-8 shrink-0 items-center justify-center text-slate-500"><MoreVertical size={17} /></button>
            <button type="button" aria-label="Clear filters" onClick={() => setSearch("")} className="flex h-8 w-8 shrink-0 items-center justify-center text-red-500"><X size={19} /></button>
          </section>
          <section className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6">
            <img src="/no-data.png" alt="No temporary shift data available" className="h-64 w-64 object-contain" />
            <h2 className="mt-2 text-base font-semibold text-slate-700">Temporary Shift</h2>
          </section>
        </>
      ) : activeTab.path === "import" ? (
        <div className="-mt-2 flex flex-col gap-4">
          <ImportPanel
            title="Assign Shift Pattern"
            templateHeaders={["Employee Id", "Shift Pattern", "Effective Date"]}
            templateTypeOptions={["Assign Shift Pattern"]}
          />
        </div>
      ) : (
        <section className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6">
          <img src="/no-data.png" alt="No data available" className="h-48 w-48 object-contain" />
          <h2 className="mt-2 text-base font-semibold text-slate-700">{activeTab.label}</h2>
        </section>
      )}
    </div>
  );
}

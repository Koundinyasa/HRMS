import { NavLink, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Camera, FileSpreadsheet, History, MapPin, Search } from "lucide-react";
import DateField from "../../components/DateField";
import { PUNCH_PROCESS_TABS, TIME_OFFICE_SECTION_PATH } from "../../constants/timeoffice.constants";
import { ASSIGN_EMPLOYEE_ROWS } from "../../constants/assign.mock";
import { punchesForEmployee } from "../../constants/punchEvents.mock";

export default function PunchProcessPunchPage() {
  const { domain } = useParams();
  const [date, setDate] = useState("2026-06-12");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(ASSIGN_EMPLOYEE_ROWS[0]?.employeeId);
  const basePath = `/${domain}/admin/${TIME_OFFICE_SECTION_PATH}`;

  const employees = useMemo(
    () => ASSIGN_EMPLOYEE_ROWS.filter((e) => e.employeeName.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const selectedIndex = ASSIGN_EMPLOYEE_ROWS.findIndex((e) => e.employeeId === selected);
  const punches = selectedIndex >= 0 ? punchesForEmployee(selectedIndex) : [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mb-4">
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-500 rounded-xl px-3 py-2 w-max min-w-full sm:w-fit">
            {PUNCH_PROCESS_TABS.map((tab) => (
              <NavLink
                key={tab.path}
                to={`${basePath}/${tab.path}`}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg border bg-white text-sm font-medium whitespace-nowrap transition-colors ${
                    isActive ? "border-emerald-500 text-emerald-600" : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`
                }
              >
                {tab.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <DateField label="Date" value={date} onChange={setDate} />
          <button type="button" title="Export to Excel" className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-emerald-600 bg-white">
            <FileSpreadsheet size={16} />
          </button>
          <button type="button" className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 bg-white">
            <History size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex flex-col gap-2 max-h-[560px] overflow-y-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              className="w-full h-9 pl-8 pr-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-emerald-400"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {employees.map((emp) => (
            <button
              key={emp.employeeId}
              type="button"
              onClick={() => setSelected(emp.employeeId)}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-left ${
                selected === emp.employeeId ? "bg-emerald-50 border border-emerald-200" : "hover:bg-slate-50 border border-transparent"
              }`}
            >
              <span className="h-8 w-8 shrink-0 rounded-full bg-emerald-100 text-emerald-600 text-xs font-semibold flex items-center justify-center">
                {emp.employeeName[0]}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-slate-700 truncate">{emp.employeeName}</span>
                <span className="block text-xs text-slate-400">{emp.employeeId}</span>
              </span>
            </button>
          ))}
          {employees.length === 0 && <p className="text-sm text-slate-400 text-center py-6">No employees found</p>}
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#EAF1FE]">
              <tr className="text-left">
                <th className="font-semibold text-slate-700 px-4 py-3">In/Out</th>
                <th className="font-semibold text-slate-700 px-4 py-3">Time</th>
                <th className="font-semibold text-slate-700 px-4 py-3">Location</th>
                <th className="font-semibold text-slate-700 px-4 py-3">Selfie</th>
                <th className="font-semibold text-slate-700 px-4 py-3">Type</th>
                <th className="font-semibold text-slate-700 px-4 py-3">Source</th>
              </tr>
            </thead>
            <tbody>
              {punches.map((punch, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className={`px-4 py-3 font-semibold ${punch.direction === "In" ? "text-emerald-600" : "text-red-500"}`}>
                    {punch.direction.toUpperCase()}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{punch.time}</td>
                  <td className="px-4 py-3 text-slate-400"><MapPin size={15} /></td>
                  <td className="px-4 py-3 text-slate-400"><Camera size={15} /></td>
                  <td className="px-4 py-3 text-slate-700">{punch.direction}</td>
                  <td className="px-4 py-3 text-slate-500">DEVICE</td>
                </tr>
              ))}
              {punches.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">Select an employee to see punches</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

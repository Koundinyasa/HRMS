import { useMemo, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  Calendar,
  Camera,
  CheckCircle2,
  FileSpreadsheet,
  History,
  Inbox,
  List,
  MapPin,
  Search,
  TrendingUp,
  X,
  XCircle,
} from "lucide-react";
import DropdownSelect from "../../../../components/DropdownSelect";
import { PUNCH_PROCESS_TABS, TIME_OFFICE_SECTION_PATH, formatMinutes } from "../../constants/timeoffice.constants";
import { ASSIGN_EMPLOYEE_ROWS } from "../../constants/assign.mock";
import { punchesForEmployee } from "../../constants/punchEvents.mock";

const MONTH_OPTIONS = ["Jun/2026", "May/2026", "Apr/2026", "Mar/2026", "Feb/2026"];

type StatusCode = "P" | "GH" | "AB" | "WO" | "IN";

const STATUS_STYLES: Record<StatusCode, string> = {
  P: "text-slate-600",
  GH: "text-purple-600",
  AB: "text-red-500 font-semibold",
  WO: "text-sky-600",
  IN: "text-amber-600",
};

const STATUS_CYCLE: StatusCode[] = ["P", "GH", "P", "P", "AB", "WO", "WO", "P", "AB", "AB", "P", "P", "IN"];

function monthViewFor(index: number) {
  return Array.from({ length: 12 }, (_, day) => {
    const status = STATUS_CYCLE[(day + index) % STATUS_CYCLE.length];
    const hasPunch = status === "P" || status === "IN";
    const checkInMin = hasPunch ? 9 * 60 + ((index * 7 + day * 11) % 40) : null;
    const checkOutMin = hasPunch ? 18 * 60 + 30 + ((index * 5 + day * 9) % 45) : null;
    const workMin = hasPunch ? checkOutMin! - checkInMin! - 60 : 0;
    return {
      day,
      status,
      checkIn: checkInMin !== null ? formatMinutes(checkInMin) : "",
      checkOut: checkOutMin !== null ? formatMinutes(checkOutMin) : "",
      workHours: hasPunch ? formatMinutes(workMin) : "",
      breakHours: hasPunch ? "01:00" : "",
    };
  });
}

export default function PunchProcessAttendanceOverviewPage() {
  const { domain } = useParams();
  const basePath = `/${domain}/admin/${TIME_OFFICE_SECTION_PATH}`;

  const [month, setMonth] = useState(MONTH_OPTIONS[0]);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [punchTab, setPunchTab] = useState<"processed" | "raw">("processed");

  const matches = useMemo(
    () =>
      search
        ? ASSIGN_EMPLOYEE_ROWS.filter(
            (e) => e.employeeName.toLowerCase().includes(search.toLowerCase()) || e.employeeId.includes(search)
          ).slice(0, 8)
        : [],
    [search]
  );

  const selectedIndex = ASSIGN_EMPLOYEE_ROWS.findIndex((e) => e.employeeId === selectedId);
  const selected = selectedIndex >= 0 ? ASSIGN_EMPLOYEE_ROWS[selectedIndex] : null;
  const monthView = selectedIndex >= 0 ? monthViewFor(selectedIndex) : [];
  const punches = selectedIndex >= 0 ? punchesForEmployee(selectedIndex) : [];

  const presentDays = monthView.filter((d) => d.status === "P" || d.status === "IN").length;
  const absentDays = monthView.filter((d) => d.status === "AB").length;
  const earlyInDays = monthView.filter((d) => d.checkIn && d.checkIn < "09:15").length;

  const ROWS: { label: string; render: (d: ReturnType<typeof monthViewFor>[number]) => React.ReactNode }[] = [
    { label: "Work Status", render: (d) => <span className={`text-xs font-semibold ${STATUS_STYLES[d.status]}`}>{d.status}</span> },
    { label: "Check In", render: (d) => d.checkIn },
    { label: "Check Out", render: (d) => d.checkOut },
    { label: "Over Time", render: () => "" },
    { label: "Cross Work hours", render: (d) => d.workHours },
    { label: "Work Hours", render: (d) => d.workHours },
    { label: "Break Hours", render: (d) => d.breakHours },
  ];

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
          <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden">
            <button type="button" onClick={() => setView("list")} className={`h-9 w-9 flex items-center justify-center ${view === "list" ? "bg-emerald-600 text-white" : "bg-white text-slate-500"}`}>
              <List size={15} />
            </button>
            <button type="button" onClick={() => setView("calendar")} className={`h-9 w-9 flex items-center justify-center border-l border-slate-200 ${view === "calendar" ? "bg-emerald-600 text-white" : "bg-white text-slate-500"}`}>
              <Calendar size={15} />
            </button>
          </div>

          <DropdownSelect
            options={MONTH_OPTIONS.map((m) => ({ label: m, value: m }))}
            value={month}
            onChange={setMonth}
            menuClassName="w-32"
            className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm"
          />

          <div className="relative">
            {selected ? (
              <span className="h-9 flex items-center gap-1.5 rounded-lg border border-emerald-300 px-2.5 text-sm text-slate-700 min-w-[180px]">
                {selected.employeeId} {selected.employeeName}
                <button type="button" onClick={() => setSelectedId(null)} className="ml-auto text-slate-400 hover:text-red-500">
                  <X size={13} />
                </button>
              </span>
            ) : (
              <>
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                <input
                  className="h-9 w-[200px] pl-8 pr-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-emerald-400"
                  placeholder="Enter name or id for..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {matches.length > 0 && (
                  <div className="absolute z-20 top-full mt-1 w-[240px] bg-white rounded-lg border border-slate-100 shadow-lg py-1 max-h-64 overflow-y-auto">
                    {matches.map((m) => (
                      <button
                        key={m.employeeId}
                        type="button"
                        onClick={() => {
                          setSelectedId(m.employeeId);
                          setSearch("");
                        }}
                        className="w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        ({m.employeeId}) {m.employeeName}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <button type="button" title="Export to Excel" className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-emerald-600 bg-white">
            <FileSpreadsheet size={16} />
          </button>
          <button type="button" className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 bg-white">
            <History size={16} />
          </button>
        </div>
      </div>

      {!selected ? (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-4 min-h-[360px] text-slate-300">
          <Inbox size={72} strokeWidth={1} />
          <span className="h-10 px-6 flex items-center rounded-lg bg-slate-50 text-sm font-medium text-slate-500">Select Employee</span>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-slate-100 last:border-b-0">
                    <td className="px-4 py-3 font-medium text-slate-700 bg-[#EAF1FE] whitespace-nowrap sticky left-0">{row.label}</td>
                    {monthView.map((d) => (
                      <td key={d.day} className="px-3 py-3 text-center text-slate-700 whitespace-nowrap min-w-[60px]">{row.render(d)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">Monthly Overview</h3>
                <span className="text-xs font-medium text-emerald-600">{month}</span>
              </div>
              <div className="rounded-lg bg-emerald-600 text-white px-4 py-3 flex items-center justify-between text-center">
                <div>
                  <p className="text-base font-bold">{formatMinutes(presentDays * 9 * 60 + presentDays * 32)}</p>
                  <p className="text-[11px] opacity-80">Total Hours</p>
                </div>
                <div>
                  <p className="text-base font-bold">09 Hrs/day</p>
                  <p className="text-[11px] opacity-80">Avg Hours</p>
                </div>
                <div>
                  <p className="text-base font-bold">00:00</p>
                  <p className="text-[11px] opacity-80">OT Hours</p>
                </div>
              </div>
              <OverviewBar icon={<CheckCircle2 size={14} className="text-emerald-500" />} label="Present Days" value={presentDays} total={30} color="bg-emerald-500" />
              <OverviewBar icon={<XCircle size={14} className="text-red-500" />} label="Absent Days" value={absentDays} total={30} color="bg-red-500" />
              <OverviewBar icon={<TrendingUp size={14} className="text-sky-500" />} label="Early In" value={earlyInDays} total={30} color="bg-sky-500" />
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5"><MapPin size={14} className="text-red-500" /> Punch Details</h3>
                <span className="text-xs text-slate-400">01/{month.replace("/", "/")}</span>
              </div>
              <div className="flex items-center gap-4 border-b border-slate-100">
                <button type="button" onClick={() => setPunchTab("processed")} className={`text-xs font-medium pb-2 border-b-2 ${punchTab === "processed" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400"}`}>Processed Punches</button>
                <button type="button" onClick={() => setPunchTab("raw")} className={`text-xs font-medium pb-2 border-b-2 ${punchTab === "raw" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400"}`}>Raw Punches</button>
              </div>
              <div className="flex flex-col gap-2">
                {punches.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className={`h-1.5 w-1.5 rounded-full ${p.direction === "In" ? "bg-emerald-500" : "bg-red-500"}`} />
                    <span className={p.direction === "In" ? "text-emerald-600 font-medium" : "text-red-500 font-medium"}>{p.direction}</span>
                    <span className="text-slate-700">{p.time}</span>
                    <Camera size={13} className="text-slate-300 ml-auto" />
                    <MapPin size={13} className="text-slate-300" />
                    <span className="text-slate-400 text-xs">Device</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col items-center justify-center gap-2 min-h-[180px] text-slate-300">
              <h3 className="self-start text-sm font-semibold text-slate-800">Request status</h3>
              <Inbox size={48} strokeWidth={1} className="mt-auto" />
              <p className="text-sm text-slate-400 mb-auto">No Punch Requests Found</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function OverviewBar({ icon, label, value, total, color }: { icon: React.ReactNode; label: string; value: number; total: number; color: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-slate-600">{icon} {label}</span>
        <span className="font-medium text-slate-700">{value}/{total} Days</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / total) * 100}%` }} />
      </div>
    </div>
  );
}

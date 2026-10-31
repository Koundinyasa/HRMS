import { NavLink, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  Camera,
  FileSpreadsheet,
  History,
  MapPin,
  Search,
} from "lucide-react";

import DateField from "../../components/DateField";
import {
  PUNCH_PROCESS_TABS,
  TIME_OFFICE_SECTION_PATH,
} from "../../constants/timeoffice.constants";
import {
  useGetPpEmployeesByCompanyQuery,
  usePostPpEmployeeRawPunchesMutation,
} from "../../api/timeofficeApi";
import type { EmployeeRawPunch } from "../../types/timeoffice.types";

function getPunchValue(punch: EmployeeRawPunch, ...keys: string[]): string {
  for (const key of keys) {
    const actualKey = Object.keys(punch).find(
      (candidate) => candidate.toLowerCase() === key.toLowerCase(),
    );
    const value = actualKey ? punch[actualKey] : undefined;
    if (value !== null && value !== undefined && String(value).trim() !== "") {
      return String(value);
    }
  }
  return "";
}

export default function PunchProcessPunchPage() {
  const { domain } = useParams();

  const [date, setDate] = useState(() => {
    const today = new Date();
    return [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");
  });
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  const {
    data: companyEmployees = [],
    isLoading: isEmployeesLoading,
    isError: isEmployeesError,
    refetch: refetchEmployees,
  } = useGetPpEmployeesByCompanyQuery();
  const [
    fetchRawPunches,
    {
      data: rawPunches,
      isError,
      isLoading,
      originalArgs,
    },
  ] = usePostPpEmployeeRawPunchesMutation();

  const basePath = `/${domain}/admin/${TIME_OFFICE_SECTION_PATH}`;

  useEffect(() => {
    if (
      companyEmployees.length > 0 &&
      !companyEmployees.some((employee) => employee.employeeId === selected)
    ) {
      setSelected(companyEmployees[0].employeeId);
    }
  }, [companyEmployees, selected]);

  useEffect(() => {
    if (selected) {
      fetchRawPunches({ employeeId: selected, date });
    }
  }, [date, fetchRawPunches, selected]);

  const employees = useMemo(
    () => {
      const query = search.trim().toLowerCase();
      return query
        ? companyEmployees.filter((employee) =>
            employee.employeeName.toLowerCase().includes(query) ||
            employee.employeeId.toLowerCase().includes(query),
          )
        : companyEmployees;
    },
    [companyEmployees, search],
  );
  const hasCurrentRequest =
    originalArgs?.employeeId === selected && originalArgs?.date === date;
  const punches = hasCurrentRequest ? rawPunches ?? [] : [];

  return (
    <div className="min-h-screen w-full min-w-0 bg-[#F3F7FE] px-3 pb-3 pt-0 sm:px-5 sm:pb-5">
      {/* Punch process tabs and date actions */}
<div className="w-full min-w-0 rounded-xl border border-emerald-400 bg-emerald-50 shadow-sm">
  <header className="flex min-w-0 flex-wrap items-center gap-3 px-3 py-2">

    {/* Navigation tabs */}
    <nav
      aria-label="Punch process"
      className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto"
    >
      {PUNCH_PROCESS_TABS.map((tab) => (
        <NavLink
          key={tab.path}
          to={`${basePath}/${tab.path}`}
          className={({ isActive }) =>
            `shrink-0 whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "border-emerald-500 bg-white text-emerald-600"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>

    {/* Date picker and action buttons */}
    <div className="flex shrink-0 items-center gap-2">
      <DateField
        label="Date"
        value={date}
        onChange={setDate}
        className="flex h-9 w-[190px] shrink-0 items-center gap-2 whitespace-nowrap text-sm text-slate-700 [&>div]:w-[145px] [&_input]:h-9 [&_input]:rounded-lg [&_input]:border-slate-200 [&_input]:px-2 [&_input]:text-sm [&_input]:text-slate-700"
      />

      <button
        type="button"
        title="Export to Excel"
        aria-label="Export to Excel"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-emerald-600 hover:bg-emerald-50"
      >
        <FileSpreadsheet size={16} />
      </button>

      <button
        type="button"
        title="History"
        aria-label="History"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
      >
        <History size={16} />
      </button>
    </div>

  </header>
</div>

      {/* Employee list and punch content */}
      <main className="mt-4 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Employee sidebar */}
        <aside className="flex h-[420px] min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:h-[560px]">
          <div className="shrink-0 p-3">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                placeholder="Search..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-9 w-full rounded-lg border border-slate-200 pl-8 pr-3 text-sm outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
            {isEmployeesLoading && (
              <p className="py-6 text-center text-sm text-slate-400">
                Loading employees...
              </p>
            )}
            {isEmployeesError && (
              <p className="py-6 text-center text-sm text-red-600">
                Unable to load employees.
                <button
                  type="button"
                  onClick={() => refetchEmployees()}
                  className="ml-1 font-medium underline"
                >
                  Retry
                </button>
              </p>
            )}
            {employees.map((employee) => (
              <button
                key={employee.employeeId}
                type="button"
                onClick={() => setSelected(employee.employeeId)}
                className={`mb-2 flex w-full items-center gap-2 rounded-lg border px-2.5 py-2.5 text-left transition-colors ${
                  selected === employee.employeeId
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-transparent bg-white hover:bg-slate-50"
                }`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-medium text-emerald-600">
                  {employee.employeeName.charAt(0).toUpperCase()}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-700">
                    {employee.employeeName}
                  </span>

                  <span className="block text-xs text-slate-500">
                    {employee.employeeId}
                  </span>
                </span>
              </button>
            ))}

            {!isEmployeesLoading && !isEmployeesError && employees.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">
                No employees found
              </p>
            )}
          </div>
        </aside>

        <section className="min-h-[420px] min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm sm:min-h-[560px]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-[#EAF1FE]">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold text-slate-700">In/Out</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Time</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Location</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Selfie</th>
                  <th className="px-4 py-3 font-semibold text-slate-700">Source</th>
                </tr>
              </thead>
              <tbody>
                {(!selected || !hasCurrentRequest || isLoading) && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                      {selected ? "Loading punches..." : "Select an employee to see punches"}
                    </td>
                  </tr>
                )}
                {selected && hasCurrentRequest && !isLoading && isError && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-red-600">
                      Unable to load punches for this employee and date.
                      <button
                        type="button"
                        onClick={() => fetchRawPunches({ employeeId: selected, date })}
                        className="ml-2 font-medium underline"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                )}
                {selected && hasCurrentRequest && !isLoading && !isError && punches.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-slate-400">
                      No punches found for this employee and date.
                    </td>
                  </tr>
                )}
                {selected && hasCurrentRequest && !isLoading && !isError && punches.map((punch, index) => {
                  const rawPunchType = getPunchValue(punch, "PunchType", "Type");
                  const direction = getPunchValue(punch, "Direction", "PunchDirection") ||
                    (rawPunchType
                      ? Number(rawPunchType) === 60
                        ? "IN"
                        : Number.isNaN(Number(rawPunchType))
                          ? rawPunchType
                          : "OUT"
                      : "");
                  const selfieValue = getPunchValue(punch, "SelfieURL", "SelfieUrl", "Selfie");
                  const selfieUrl = /^https?:\/\//i.test(selfieValue) ? selfieValue : "";
                  const punchId = getPunchValue(punch, "PunchID", "PunchId", "ID");

                  return (
                    <tr
                      key={punchId || index}
                      className="border-t border-slate-100"
                    >
                      <td className={`px-4 py-3 font-semibold ${
                        direction.toUpperCase() === "IN"
                          ? "text-emerald-600"
                          : direction.toUpperCase() === "OUT"
                            ? "text-red-500"
                            : "text-slate-700"
                      }`}>
                        {direction || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {getPunchValue(
                          punch,
                          "PunchTimestamp",
                          "PunchTime",
                          "OriginalTime",
                          "CorrectedTime",
                          "Time",
                        ) || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          {getPunchValue(punch, "LocationAddress", "PunchLocation", "Location") || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {selfieUrl ? (
                          <a
                            href={selfieUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-700 hover:underline"
                          >
                            <Camera size={14} />
                            View
                          </a>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {getPunchValue(punch, "CaptureSource", "EntryType", "Device", "Source") || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

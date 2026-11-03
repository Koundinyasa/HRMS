import { NavLink, useParams } from "react-router-dom";
import ImportPanel from "../../components/ImportPanel";
import { PUNCH_PROCESS_TABS, TIME_OFFICE_SECTION_PATH } from "../../constants/timeoffice.constants";

export default function PunchProcessImportPage() {
  const { domain } = useParams();
  const basePath = `/${domain}/admin/${TIME_OFFICE_SECTION_PATH}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="punch-horizontal-scroll w-full min-w-0 overflow-x-auto overscroll-x-contain [touch-action:pan-x]">
          <div className="flex w-max min-w-full flex-nowrap items-center gap-2 rounded-xl border border-emerald-500 bg-emerald-50 px-3 py-2">
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

      <ImportPanel title="Manual Punches Upload" />
    </div>
  );
}

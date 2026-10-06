import { NavLink, useParams } from "react-router-dom";
import { History, SlidersHorizontal } from "lucide-react";
import ImportPanel from "../../components/ImportPanel";
import { PUNCH_PROCESS_TABS, TIME_OFFICE_SECTION_PATH } from "../../constants/timeoffice.constants";

export default function PunchProcessImportPage() {
  const { domain } = useParams();
  const basePath = `/${domain}/admin/${TIME_OFFICE_SECTION_PATH}`;

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
          <button type="button" className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 bg-white">
            <SlidersHorizontal size={16} />
          </button>
          <button type="button" className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 bg-white">
            <History size={16} />
          </button>
        </div>
      </div>

      <ImportPanel title="Manual Punches Upload" />
    </div>
  );
}

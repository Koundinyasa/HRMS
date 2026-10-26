import { NavLink, useParams } from "react-router-dom";
import { MASTERS_SECTION_PATH, MASTERS_TABS } from "../../constants/timeoffice.constants";

export default function MastersLayout({ children }: { children: React.ReactNode }) {
  const { domain } = useParams();
  const basePath = `/${domain}/admin/${MASTERS_SECTION_PATH}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mb-4">
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-500 rounded-xl px-3 py-2 w-max min-w-full sm:w-fit">
          {MASTERS_TABS.map((tab) => (
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
      {children}
    </div>
  );
}

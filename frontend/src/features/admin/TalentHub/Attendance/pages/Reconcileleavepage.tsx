import { NavLink, Outlet, useParams } from "react-router-dom";

const RECONCILE_LEAVE_TABS = [
  { label: "Missing Leave", path: "missingleave" },
  { label: "Penalty Leave Deduction", path: "penaltyleavededuction" },
  { label: "Leave/Punch Exist", path: "leavepunchexit" }, // matches attendance.constants.ts as given
];

export default function ReconcileLeavePage() {
  const { domain } = useParams();
  const basePath = `/${domain}/admin/talent-hub/attendance/integrations/reconcileleave`;

  return (
    <div>
      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 mb-4 w-fit">
        {RECONCILE_LEAVE_TABS.map((tab) => (
          <NavLink
            key={tab.path}
            to={`${basePath}/${tab.path}`}
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                isActive ? "bg-sky-100 text-sky-700" : "text-slate-500 hover:text-slate-700"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
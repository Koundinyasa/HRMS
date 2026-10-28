import { NavLink } from "react-router-dom";

const statutoryReportTabs = [
  {
    label: "PF Report",
    path: "/insights/statutory-report/pf",
  },
  {
    label: "ESI Report",
    path: "/insights/statutory-report/esi",
  },
  {
    label: "LWF Report",
    path: "/insights/statutory-report/lwf",
  },
  {
    label: "PT Report",
    path: "/insights/statutory-report/pt",
  },
];

export default function StatutoryReportNavbar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="flex w-full gap-2 overflow-x-auto px-2 sm:px-4">
        {statutoryReportTabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end
            className={({ isActive }) =>
              `relative shrink-0 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors sm:px-6 ${
                isActive
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:bg-gray-50 hover:text-blue-600"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

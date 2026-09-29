import { NavLink, useParams } from "react-router-dom";

const tabs = [
  { label: "Punch", path: "/Regularization/Punch" },
  { label: "Missed Punch", path: "/Regularization/MissedPunch" },
  { label: "Attendance", path: "/time-office/regularization/attendance" },
  { label: "TA Insights", path: "/Regularization/TAInsights" },
];

interface TimeOfficeTabsProps {
  className?: string;
  compact?: boolean;
}

export default function TimeOfficeTabs({
  className = "",
  compact = false,
}: TimeOfficeTabsProps) {
  const { domain } = useParams();
  const employeePath = domain ? `/${domain}/employee` : "/employee";

  return (
    <nav
      aria-label="Time office navigation"
      className={`punch-horizontal-scroll flex min-w-0 items-center overflow-x-auto ${
      compact ? "gap-4" : "gap-6"
      } ${className}`}
    >
      {tabs.map((tab) => (
        <NavLink
          key={tab.label}
          to={`${employeePath}${tab.path}`}
          className={({ isActive }) =>
            `shrink-0 whitespace-nowrap border-b-2 font-semibold ${
              compact
                ? "px-1 py-2 text-[13px]"
                : "px-1 py-4 text-[13px] sm:py-5 sm:text-[15px]"
            } ${
              isActive
                ? "border-[#1997e8] text-[#1997e8]"
                : "border-transparent text-[#68758a]"
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}

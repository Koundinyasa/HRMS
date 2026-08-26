import { NavLink } from "react-router-dom";

interface TabItem {
  label: string;
  path: string;
}

interface TabBarProps {
  basePath: string;
  tabs: TabItem[];
}

export default function TabBar({ basePath, tabs }: TabBarProps) {
  return (
    <div className="w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mb-4">
      <div className="flex items-center gap-15 bg-[#EDEBFB] rounded-xl px-4 py-2 w-max min-w-full sm:w-fit">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={`${basePath}/${tab.path}`}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isActive ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-white/60"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
import { NavLink } from "react-router-dom";
import type { SubNavItem } from "../types/reportUI.types";

interface TopTabsProps {
  items: SubNavItem[];
}

export default function TopTabs({ items }: TopTabsProps) {
  return (
    <div className="mb-4 overflow-x-auto rounded-md bg-white shadow-sm">
      <div className="flex min-w-max border-b border-gray-200">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `whitespace-nowrap px-5 py-4 text-sm font-medium ${
                isActive
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
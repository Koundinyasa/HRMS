import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    name: "Pre Enrollment",
    path: "/admin/enrollment/pre-enrollment/dashboard",
  },
];

const SubSidebar = () => {
  return (
    <aside className="min-h-screen w-26 shrink-0 border-r border-gray-200 bg-white shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-sm font-semibold text-indigo-600">
          Enrollment
        </h2>
      </div>

      <nav className="mt-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? "border-l-4 border-blue-600 bg-blue-100 text-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default SubSidebar;
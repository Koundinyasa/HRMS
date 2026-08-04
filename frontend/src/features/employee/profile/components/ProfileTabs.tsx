import { NavLink, useParams } from "react-router-dom";

import type { ProfileTabsProps } from "../types/profile.types";

export default function ProfileTabs({
  tabs,
}: ProfileTabsProps) {
  const { domain } = useParams();

  return (
    <div
      className="
        w-full
        flex
        border-b
        overflow-x-auto
      "
      style={{
        borderColor: "var(--primary-border)",
      }}
    >
      {tabs.map((tab) => {
        let route = "";

        switch (tab.menuName) {
          case "Personal Information":
            route = `/${domain}/employee/profile/personal`;
            break;

          case "Family Details":
            route = `/${domain}/employee/profile/family`;
            break;

          case "Education Details":
            route = `/${domain}/employee/profile/education`;
            break;

          case "Experience Details":
            route = `/${domain}/employee/profile/experience`;
            break;

          case "Bank Information":
            route = `/${domain}/employee/profile/bank`;
            break;

          case "Uploaded Documents":
            route = `/${domain}/employee/profile/documents`;
            break;

          default:
            route =
              tab.routeUrl?.replace(
                "/Employee",
                `/${domain}/employee`
              ) ?? "";
        }

        return (
          <NavLink
            key={tab.menuId}
            to={route}
            className={({ isActive }) =>
              `
                flex-1
                text-center
                py-4
                whitespace-nowrap
                font-medium
                border-b-2
                transition-all
                duration-300
                ${
                  isActive
                    ? ""
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }
              `
            }
            style={({ isActive }) =>
              isActive
                ? {
                    color: "var(--primary-color)",
                    borderColor: "var(--primary-color)",
                  }
                : {}
            }
          >
            {tab.menuName}
          </NavLink>
        );
      })}
    </div>
  );
}
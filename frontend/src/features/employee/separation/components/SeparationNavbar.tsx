import { NavLink, useParams } from "react-router-dom";
import { useDashboard } from "../../dashboard/hooks/useDashboard";
import type { MenuItem } from "../../dashboard/types/dashboard.types";
import { FileText, ClipboardList, LogOut, type LucideIcon } from "lucide-react";

const TAB_ICONS: Record<string, LucideIcon> = {
  "Resignation Request": FileText,
  "Status": ClipboardList,
  "Withdraw": LogOut,
};

export default function SeparationNavbar() {
  const { domain } = useParams();
  const { menuData } = useDashboard();

  const separationMenu = menuData?.data?.[0]?.children?.find(
    (item: MenuItem) => item.menuName === "Separation"
  );

  const tabs = separationMenu?.children ?? [];

  return (
    <nav
      aria-label="Separation navigation"
      className="w-full min-w-0 max-w-full overflow-hidden rounded-lg border border-orange-300 bg-orange-50/40 p-2.5"
      // style={{ borderColor: "var(--primary-border)" }}
    >
      <div className="flex w-full min-w-0 max-w-full items-center justify-between gap-3">
        {tabs.map((tab: MenuItem) => {
          const route =
            tab.routeUrl?.replace(
              "/Employee",
              `/${domain}/employee`
            ) ?? "";

            const Icon = TAB_ICONS[tab.menuName] ?? FileText;

          return (
            <NavLink
              key={tab.menuId}
              to={route}
              className={({ isActive }) =>
                [
                  "inline-flex items-center justify-center gap-2 shrink-0",
                  "h-11 rounded-lg border px-25",
                  "text-sm font-medium whitespace-nowrap",
                  "transition-colors",

                  isActive
                    ? "border-orange-400 bg-white text-orange-600"
                    : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700",
                ].join(" ")
              }
              // style={({ isActive }) =>
              //   isActive
              //     ? {
              //       color: "var(--primary-color)",
              //       borderColor: "var(--primary-color)",
              //     }
              //     : undefined
              // }
            >

              <Icon className="h-4 w-4 shrink-0" />
              <span
                className="
  block
  min-w-0
  max-w-full
  px-0.5
  text-center
  whitespace-normal
  break-words
"
                title={tab.menuName}
              >
                {tab.menuName}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

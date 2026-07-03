import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FileText,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import { useDashboard } from "../dashboard/hooks/useDashboard";

import type {
  MenuItem,
} from "../dashboard/types/dashboard.types";

export default function Sidebar() {
  const navigate = useNavigate();

  const { profileData } = useDashboard();

  const [expandedMenu, setExpandedMenu] =
    useState<number | null>(null);

  const menuItems =
    profileData?.data?.menus?.[0]?.children || [];

  const handleNavigation = (
    child: MenuItem
  ) => {
    if (child.routingUrl) {
      navigate(child.routingUrl);
    }
  };

  return (
    <aside
      className="
        w-64
        h-[calc(100vh-64px)]
        overflow-y-auto
      "
      style={{
        backgroundColor: "var(--primary-color)",
      }}
    >
      <nav className="py-4">
        {menuItems.map((item: MenuItem) => (
          <div key={item.menuId}>
            <button
              type="button"
              onClick={() =>
                setExpandedMenu(
                  expandedMenu === item.menuId
                    ? null
                    : item.menuId
                )
              }
              className="
                w-full
                flex
                items-center
                justify-between
                px-4
                py-3
                text-white
                hover:bg-white/10
                transition
              "
            >
              <div className="flex items-center gap-3">
                <FileText size={18} />

                <span>
                  {item.menuName}
                </span>
              </div>

              {expandedMenu === item.menuId ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {expandedMenu === item.menuId &&
              item.children?.map(
                (child: MenuItem) => (
                  <button
                    key={child.menuId}
                    type="button"
                    onClick={() =>
                      handleNavigation(child)
                    }
                    className="
                      w-full
                      text-left
                      pl-14
                      pr-4
                      py-2
                      text-white/90
                      hover:bg-white/10
                      transition
                    "
                  >
                    {child.menuName}
                  </button>
                )
              )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
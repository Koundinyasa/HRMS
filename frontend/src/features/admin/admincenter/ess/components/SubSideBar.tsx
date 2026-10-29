import {
  NavLink,
  useParams,
} from "react-router-dom";

import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

import { useSidebar } from "../../../components/SidebarContext";

const ESS_LINKS = [
  {
    label: "Circular",
    path: "circular",
    icon: "Megaphone",
  },
  {
    label: "Policy",
    path: "policy",
    icon: "FileText",
  },
  {
    label: "Notification",
    path: "notification",
    icon: "Bell",
  },
  {
    label: "Flash News",
    path: "flash-news",
    icon: "Zap",
  },
  {
    label: "Help Desk",
    path: "help-desk",
    icon: "Headphones",
  },
  {
    label: "Poll",
    path: "poll",
    icon: "BarChart3",
  },
  {
    label: "Feeds",
    path: "feeds",
    icon: "Rss",
  },
  {
    label: "Memories",
    path: "memories",
    icon: "Image",
  },
  {
    label: "Wall Of Fame",
    path: "wall-of-fame",
    icon: "Award",
  },
];

export default function SubSideBar() {
  const { domain } = useParams();

  const {
    subSidebarOpen,
    closeSidebar,
  } = useSidebar();

  // ESS dropdown state
  const [essOpen, setEssOpen] = useState(false);

  if (!subSidebarOpen) {
    return null;
  }

  return (
    <aside
      className="
        shrink-0
        w-[180px]
        min-w-[180px]
        h-[calc(100vh-64px)]
        overflow-y-auto
        border-r
        border-black
        bg-[#F7F3FF]
       font-[Urbanist]"
    >
      {/* =====================================================
          COMPANY
      ===================================================== */}

      <div className="px-4 pt-4 pb-2 font-[Urbanist]">
        <div className="flex items-center justify-between font-[Urbanist]">
          <span className="text-sm font-medium text-slate-800">
            Koundinyasa Tech
          </span>
        </div>
      </div>

      {/* =====================================================
          ADMIN CENTER ITEMS
      ===================================================== */}

      <div className="px-4 font-[Urbanist]">
        <div className="py-2 text-sm text-slate-800 font-[Urbanist]">
          Company
        </div>

        <div className="py-2 text-sm text-slate-800 font-[Urbanist]">
          Settings
        </div>

        <div className="py-2 text-sm text-slate-800 font-[Urbanist]">
          Classifications
        </div>

        <div className="py-2 text-sm text-slate-800 font-[Urbanist]">
          User Management
        </div>

        <div className="py-2 text-sm text-slate-800 font-[Urbanist]">
          Workflows
        </div>
      </div>

      {/* =====================================================
          ESS DROPDOWN
      ===================================================== */}

      <div className="mt-2 font-[Urbanist]">
        <button
          type="button"
          onClick={() => setEssOpen((prev) => !prev)}
          className="
            flex
            items-center
            justify-between
            w-full
            px-4
            py-2
            text-sm
            font-medium
            text-slate-800
            hover:bg-white/70
          "
        >
          <span>ESS</span>

          <span
            className={`
              text-xs
              transition-transform
              duration-200
              ${essOpen ? "rotate-180" : ""}
            `}
          >
            ˅
          </span>
        </button>

        {/* =====================================================
            ESS ITEMS
            ONLY SHOW WHEN ESS IS OPEN
        ===================================================== */}

        {essOpen && (
          <nav className="flex flex-col font-[Urbanist]">
            {ESS_LINKS.map((item) => {
              const Icon = (
                Icons[
                  item.icon as keyof typeof Icons
                ] ?? Icons.Circle
              ) as LucideIcon;

              return (
                <NavLink
                  key={item.path}
                  to={`/${domain}/admin/ess/${item.path}`}
                  onClick={() => {
                    // Navigate first through NavLink,
                    // then close the sidebar.
                    closeSidebar();
                  }}
                  className={({ isActive }) =>
                    `
                      flex
                      items-center
                      gap-2
                      w-full
                      px-4
                      py-2.5
                      text-sm
                      transition-colors

                      ${
                        isActive
                          ? "bg-[#7C3AED] text-white"
                          : "text-slate-700 hover:bg-white/70"
                      }
                    `
                  }
                >
                  <Icon
                    size={15}
                    className="shrink-0 font-[Urbanist]"
                  />

                  <span className="truncate font-[Urbanist]">
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        )}
      </div>
    </aside>
  );
}
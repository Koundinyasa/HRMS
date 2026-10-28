import { useState } from "react";
import {
  NavLink,
  useLocation,
  useParams,
} from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";

import type { SubNavItem } from "./sidebar.types";
import { useSidebar } from "./SidebarContext";

interface SubSidebarProps {
  sectionPath: string;
  items: SubNavItem[];
}

export default function SubSidebar({
  sectionPath,
  items,
}: SubSidebarProps) {
  const { domain } = useParams();
  const location = useLocation();

  const basePath = `/${domain}/admin/${sectionPath}`;

  const {
    subSidebarOpen,
    closeSubSidebar,
  } = useSidebar();

  const [openKeys, setOpenKeys] = useState<Set<string>>(
    () =>
      new Set(
        items
          .filter((item) =>
            item.children?.some((child) =>
              location.pathname.includes(child.path)
            )
          )
          .map((item) => item.path)
      )
  );

  const toggle = (key: string) => {
    setOpenKeys((previous) => {
      const next = new Set(previous);

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  };

  return (
    <>
      {/* Desktop and tablet */}
      <aside
        className={`hidden md:flex h-full min-h-0 shrink-0 flex-col overflow-hidden pt-4 px-3 ${
          sectionPath === "talent-hub"
            ? "w-[280px] lg:w-[300px] bg-white"
            : "w-[220px] lg:w-[240px] bg-[#EDEBFB]"
        }`}
      >
        {sectionPath === "talent-hub" && (
          <p className="mb-3 shrink-0 px-2 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
            Recruitment
          </p>
        )}
        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent">
          {items.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              basePath={basePath}
              isOpen={openKeys.has(item.path)}
              onToggle={toggle}
              recruitmentStyle={sectionPath === "talent-hub"}
            />
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {subSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={closeSubSidebar}
        />
      )}

      {/* Mobile sub-sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex flex-col
          w-[260px]
          ${sectionPath === "talent-hub" ? "bg-white" : "bg-[#EDEBFB]"}
          pt-4 px-3
          shadow-xl
          transition-transform duration-300 ease-in-out
          md:hidden
          ${
            subSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="mb-4 flex shrink-0 items-center justify-between px-2">
          <span className="text-sm font-semibold text-slate-700 capitalize">
            {sectionPath === "talent-hub"
              ? "Recruitment"
              : sectionPath.replace("-", " ")}
          </span>

          <button
            type="button"
            onClick={closeSubSidebar}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-white/60"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain pr-1 [scrollbar-color:#cbd5e1_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent">
          {items.map((item) =>
            item.children?.length ? (
              <div key={item.path}>
                <button
                  type="button"
                  onClick={() => toggle(item.path)}
                  className={`
                    w-full flex items-center justify-between
                    rounded-lg px-3 py-2.5
                    text-sm font-semibold
                    transition-colors
                    ${
                      openKeys.has(item.path)
                        ? "bg-indigo-600 text-white"
                        : "text-slate-700 hover:bg-white/60"
                    }
                  `}
                >
                  <span>{item.label}</span>

                  {openKeys.has(item.path) ? (
                    <ChevronDown size={15} />
                  ) : (
                    <ChevronRight size={15} />
                  )}
                </button>

                {openKeys.has(item.path) && (
                  <div className="mt-1 flex flex-col gap-0.5">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={`${basePath}/${item.path}/${child.path}`}
                        onClick={closeSubSidebar}
                        className={({ isActive }) =>
                          `
                            flex items-center gap-2
                            pl-6 pr-2 py-2
                            text-sm rounded-lg
                            transition-colors
                            ${
                              isActive
                                ? "text-indigo-600 font-semibold"
                                : "text-slate-500 hover:bg-white/50"
                            }
                          `
                        }
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.path}
                to={`${basePath}/${item.path}`}
                end
                onClick={closeSubSidebar}
                className={({ isActive }) =>
                  sectionPath === "talent-hub"
                    ? `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                        isActive
                          ? "bg-[#fff4dc] font-semibold text-[#8a5a0a]"
                          : "text-slate-600 hover:bg-slate-50"
                      }`
                    : `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-indigo-600 text-white"
                          : "text-slate-700 hover:bg-white/60"
                      }`
                }
              >
                {sectionPath === "talent-hub" && (
                  <SubNavPrefix item={item} />
                )}
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span className="rounded-full bg-[#fff0d6] px-2 py-0.5 text-xs font-semibold text-[#b86a00]">
                    {item.badgeCount}
                  </span>
                )}
              </NavLink>
            )
          )}
        </nav>
      </aside>
    </>
  );
}

function NavItem({
  item,
  basePath,
  isOpen,
  onToggle,
  recruitmentStyle = false,
}: {
  item: SubNavItem;
  basePath: string;
  isOpen: boolean;
  onToggle: (key: string) => void;
  recruitmentStyle?: boolean;
}) {
  if (!item.children?.length) {
    return (
      <NavLink
        to={`${basePath}/${item.path}`}
        end
        className={({ isActive }) =>
          recruitmentStyle
            ? `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-[#fff4dc] font-semibold text-[#8a5a0a]"
                  : "text-slate-600 hover:bg-slate-50"
              }`
            : `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "text-indigo-600"
                  : "text-slate-700 hover:bg-white/60"
              }`
        }
      >
        {recruitmentStyle && <SubNavPrefix item={item} />}
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
        {recruitmentStyle &&
          item.badgeCount !== undefined &&
          item.badgeCount > 0 && (
            <span className="rounded-full bg-[#fff0d6] px-2 py-0.5 text-xs font-semibold text-[#b86a00]">
              {item.badgeCount}
            </span>
          )}
      </NavLink>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => onToggle(item.path)}
        className={`
          w-full flex items-center justify-between
          rounded-lg px-3 py-2
          text-sm font-semibold
          transition-colors
          ${
            isOpen
              ? "bg-indigo-600 text-white"
              : "text-slate-700 hover:bg-white/60"
          }
        `}
      >
        <span className="truncate">{item.label}</span>

        {isOpen ? (
          <ChevronDown size={15} />
        ) : (
          <ChevronRight size={15} />
        )}
      </button>

      {isOpen && (
        <div className="mt-1 flex flex-col gap-0.5">
          {item.children.map((child) => (
            <NavLink
              key={child.path}
              to={`${basePath}/${item.path}/${child.path}`}
              className={({ isActive }) =>
                `
                  flex items-center gap-2
                  pl-6 pr-2 py-1.5
                  text-sm rounded-lg
                  transition-colors
                  ${
                    isActive
                      ? "text-indigo-600 font-semibold"
                      : "text-slate-500 hover:bg-white/50"
                  }
                `
              }
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
              <span className="truncate">{child.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

function SubNavPrefix({ item }: { item: SubNavItem }) {
  const Icon = item.icon;
  if (Icon) {
    return (
      <Icon
        size={16}
        className="shrink-0"
        aria-hidden="true"
      />
    );
  }

  return (
    <span className="w-6 shrink-0 text-xs text-slate-500">
      {item.number}
    </span>
  );
}
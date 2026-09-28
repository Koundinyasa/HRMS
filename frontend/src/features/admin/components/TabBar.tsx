 
import { useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
 
interface TabItem {
  label: string;
  path: string;
  icon?: string;
}
 
interface TabBarProps {
  basePath: string;
  tabs: TabItem[];
}
 
export default function TabBar({ basePath, tabs }: TabBarProps) {
  const location = useLocation();
  const tabRefs = useRef<Array<HTMLAnchorElement | null>>([]);
 
  useEffect(() => {
    const activeIndex = tabs.findIndex((tab) =>
      location.pathname.startsWith(`${basePath}/${tab.path}`)
    );
    const activeEl = tabRefs.current[activeIndex];
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: "auto",
        inline: "center",
        block: "nearest",
      });
    }
  }, [location.pathname, basePath, tabs]);
 
  return (
    // min-w-0 is the fix: without it, a flex/grid ancestor (e.g. the app
    // shell's sidebar + content row) refuses to let this shrink below its
    // content width, so the tab bar never gets to scroll internally — it
    // just gets clipped by an ancestor's overflow-x-hidden instead.
    <div className="relative mb-4 w-full min-w-0 max-w-full">
      <div
        className="flex w-full min-w-0 max-w-full snap-x snap-proximity items-stretch gap-1.5 overflow-x-auto rounded-[20px] border border-[#9B6AEF] bg-[#F0EBFF] p-1 [-webkit-overflow-scrolling:touch] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-2 sm:rounded-[30px] sm:p-2"
      >
        {tabs.map((tab, index) => {
          const Icon = tab.icon
            ? ((Icons[tab.icon as keyof typeof Icons] ?? Icons.Circle) as LucideIcon)
            : null;
 
          return (
            <NavLink
              key={tab.path}
              ref={(el) => (tabRefs.current[index] = el)}
              to={`${basePath}/${tab.path}`}
              className={({ isActive }) =>
                `flex shrink-0 snap-start items-center justify-center gap-1 rounded-[14px] border px-2.5 py-1.5 text-[12px] font-medium transition-all duration-200 sm:flex-[1_0_auto] sm:gap-2 sm:rounded-[18px] sm:px-3 sm:py-2.5 sm:text-sm ${
                  isActive
                    ? "border-[#8A5CF6] bg-white text-[#5B2DC8] shadow-[0_0_0_1px_rgba(122,90,248,0.05)]"
                    : "border-[#E4D8FF] bg-transparent text-[#1f2937]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {Icon && (
                    <span
                      className={`hidden h-7 w-7 shrink-0 items-center justify-center rounded-full border sm:flex sm:h-8 sm:w-8 ${
                        isActive
                          ? "border-[#DCCBFF] bg-[#F7F3FF] text-[#6D28D9]"
                          : "border-[#CFC2FF] bg-white text-[#6B7280]"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.2} />
                    </span>
                  )}
                  <span className="whitespace-nowrap text-[12px] leading-none sm:text-[15px]">
                    {tab.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
 
      {/* Edge fades: signal there's more to scroll instead of an abrupt cut */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-4 rounded-l-[20px] bg-gradient-to-r from-[#F4F6FA] to-transparent sm:hidden" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-4 rounded-r-[20px] bg-gradient-to-l from-[#F4F6FA] to-transparent sm:hidden" />
    </div>
  );
}
 
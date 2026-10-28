import { NavLink } from "react-router-dom";
import { Filter, Clock } from "lucide-react";

interface TabItem {
  label: string;
  path: string;
}

interface BulkUpdateTabsProps {
  basePath: string;
  tabs: TabItem[];
}

export default function BulkUpdateTabs({
  basePath,
  tabs,
}: BulkUpdateTabsProps) {
  return (
    <div className="border-b border-[#edf0f3] bg-white">
      {/* <div className="flex h-[64px] items-center justify-between px-4"> */}
      <div className="flex h-[56px] items-center justify-between gap-2 px-2 sm:h-[64px] sm:gap-4 sm:px-4">
        {/* <div className="flex h-full items-center gap-8 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"> */}
      <div className="flex h-full min-w-0 items-center gap-5 overflow-x-auto whitespace-nowrap [scrollbar-width:none] sm:gap-8 [&::-webkit-scrollbar]:hidden">    
          {tabs.map((tab) => (
            <NavLink
              key={tab.path}
              to={`${basePath}/${tab.path}`}
              className={({ isActive }) =>
                `relative flex h-full items-center px-1 text-[15px] font-medium transition ${
                  isActive
                    ? "text-[#168ce0]"
                    : "text-[#667085] hover:text-[#344054]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {tab.label}

                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#168ce0]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* <div className="flex shrink-0 items-center gap-5 text-[#98a2b3]">
          <button
            type="button"
            title="Filter"
            className="hover:text-[#475467]"
          >
            <Filter size={18} />
          </button>

          <button
            type="button"
            title="History"
            className="hover:text-[#475467]"
          >
            <Clock size={18} />
          </button>
        </div> */}
        <div className="flex shrink-0 items-center gap-3 text-[#98a2b3] sm:gap-5">
          <button type="button" title="Filter" className="hover:text-[#475467]">
          <Filter size={17} className="sm:hidden" />
         <Filter size={18} className="hidden sm:block" />
   </button>
   <button type="button" title="History" className="hover:text-[#475467]">
     <Clock size={17} className="sm:hidden" />
     <Clock size={18} className="hidden sm:block" />
   </button>
 </div>
      </div>
    </div>
  );
}
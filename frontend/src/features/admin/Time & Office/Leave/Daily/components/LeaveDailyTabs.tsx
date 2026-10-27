import { NavLink } from "react-router-dom";

const LeaveDailyTabs = () => {
  return (
    <div className="flex items-center gap-6 border-b border-slate-200 font-[Urbanist]">
      <NavLink
        to="../apply-leave"
        className={({ isActive }) =>
          `relative pb-3 text-[14px] font-medium leading-[18px] transition ${
            isActive
              ? "font-semibold text-[#2563EB]"
              : "text-slate-500 hover:text-slate-700"
          }`
        }
      >
        {({ isActive }) => (
          <>
            Apply Leave
            {isActive && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#2563EB]" />
            )}
          </>
        )}
      </NavLink>

      <NavLink
        to="../import"
        className={({ isActive }) =>
          `relative pb-3 text-[14px] font-medium leading-[18px] transition ${
            isActive
              ? "font-semibold text-[#2563EB]"
              : "text-slate-500 hover:text-slate-700"
          }`
        }
      >
        {({ isActive }) => (
          <>
            Import
            {isActive && (
              <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#2563EB]" />
            )}
          </>
        )}
      </NavLink>
    </div>
  );
};

export default LeaveDailyTabs;
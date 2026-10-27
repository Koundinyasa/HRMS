// import { NavLink } from "react-router-dom";

// const LeaveDailyTabs = () => {
//   return (
//     <div className="flex items-center gap-6 border-b border-slate-200 font-[Urbanist]">
//       <NavLink
//         to="../apply-leave"
//         className={({ isActive }) =>
//           `relative pb-3 text-[14px] font-medium leading-[18px] transition ${
//             isActive
//               ? "font-semibold text-[#2563EB]"
//               : "text-slate-500 hover:text-slate-700"
//           }`
//         }
//       >
//         {({ isActive }) => (
//           <>
//             Apply Leave
//             {isActive && (
//               <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#2563EB]" />
//             )}
//           </>
//         )}
//       </NavLink>

//       <NavLink
//         to="../import"
//         className={({ isActive }) =>
//           `relative pb-3 text-[14px] font-medium leading-[18px] transition ${
//             isActive
//               ? "font-semibold text-[#2563EB]"
//               : "text-slate-500 hover:text-slate-700"
//           }`
//         }
//       >
//         {({ isActive }) => (
//           <>
//             Import
//             {isActive && (
//               <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-[#2563EB]" />
//             )}
//           </>
//         )}
//       </NavLink>
//     </div>
//   );
// };

// export default LeaveDailyTabs;

















import { NavLink } from "react-router-dom";

/**
 * Shared "Apply Leave | Import" tabs.
 * Used by BOTH LeaveDailyPage and LeaveDailyImportPage so the tabs look
 * exactly the same and never jump when switching.
 *
 * Both links point straight at the real routes (../apply-leave, ../import)
 * so there is no redirect and no blank-page flash.
 */
const TABS = [
  { label: "Apply Leave", to: "../apply-leave" },
  { label: "Import", to: "../import" },
];

const baseTab =
  "inline-flex h-10 items-center rounded-lg px-4 text-[15px] transition sm:px-5 sm:text-base";
const activeTab =
  "bg-[#914f3f] font-bold text-white shadow-[0_2px_6px_rgba(145,79,63,0.35)]";
const inactiveTab = "font-semibold text-[#914f3f] hover:bg-[#fff1ed]";

const LeaveDailyTabs = () => (
  <nav
    aria-label="Leave daily sections"
    className="flex shrink-0 items-center gap-1 rounded-xl bg-white/80 p-1 ring-1 ring-[#f0cbc1]"
  >
    {TABS.map((tab) => (
      <NavLink
        key={tab.to}
        to={tab.to}
        className={({ isActive }) => `${baseTab} ${isActive ? activeTab : inactiveTab}`}
      >
        {tab.label}
      </NavLink>
    ))}
  </nav>
);

export default LeaveDailyTabs;
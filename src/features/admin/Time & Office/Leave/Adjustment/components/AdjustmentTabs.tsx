// import { NavLink } from "react-router-dom";

// const AdjustmentTabs = () => {
//   return (
//     <div className="flex items-center gap-12 border-b border-slate-200 font-[Urbanist]">
//       <NavLink
//         to="../configuration"
//         className={({ isActive }) =>
//           `relative pb-3 text-[16px] font-medium leading-[20px] transition ${
//             isActive
//               ? "font-semibold text-[#9a5547]"
//               : "text-slate-600 hover:text-slate-800"
//           }`
//         }
//       >
//         {({ isActive }) => (
//           <>
//             Leave Adjustment Configuration
//             {isActive && (
//               <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#9a5547]" />
//             )}
//           </>
//         )}
//       </NavLink>

//       <NavLink
//         to="../manual-leave-allotment"
//         className={({ isActive }) =>
//           `relative pb-3 text-[16px] font-medium leading-[20px] transition ${
//             isActive
//               ? "font-semibold text-[#9a5547]"
//               : "text-slate-600 hover:text-slate-800"
//           }`
//         }
//       >
//         {({ isActive }) => (
//           <>
//             Manual Leave Allotment
//             {isActive && (
//               <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#9a5547]" />
//             )}
//           </>
//         )}
//       </NavLink>

//       <NavLink
//         to="../import"
//         className={({ isActive }) =>
//           `relative pb-3 text-[16px] font-medium leading-[20px] transition ${
//             isActive
//               ? "font-semibold text-[#9a5547]"
//               : "text-slate-600 hover:text-slate-800"
//           }`
//         }
//       >
//         {({ isActive }) => (
//           <>
//             Import
//             {isActive && (
//               <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#9a5547]" />
//             )}
//           </>
//         )}
//       </NavLink>
//     </div>
//   );
// };

// export default AdjustmentTabs;

import { NavLink } from "react-router-dom";

const AdjustmentTabs = () => {
  return (
    <div className="flex shrink-0 items-center gap-3 whitespace-nowrap font-[Urbanist]">
      <NavLink
        to="../configuration"
        className={({ isActive }) =>
          `relative inline-flex shrink-0 items-center whitespace-nowrap rounded-[9px] border px-3 py-2 text-[16px] leading-[24px] transition ${
            isActive
              ? "border-[#df8d7c] bg-white font-bold text-[#9a5547] shadow-sm"
              : "border-[#df8d7c] bg-white font-medium text-[#9a5547] hover:bg-[#fff8f6]"
          }`
        }
      >
        Leave Adjustment Configuration
      </NavLink>

      <NavLink
        to="../manual-leave-allotment"
        className={({ isActive }) =>
          `relative inline-flex shrink-0 items-center whitespace-nowrap rounded-[9px] border px-3 py-2 text-[16px] leading-[24px] transition ${
            isActive
              ? "border-[#df8d7c] bg-white font-bold text-[#9a5547] shadow-sm"
              : "border-[#df8d7c] bg-white font-medium text-[#9a5547] hover:bg-[#fff8f6]"
          }`
        }
      >
        Manual Leave Allotment
      </NavLink>

      <NavLink
        to="../import"
        className={({ isActive }) =>
          `relative inline-flex shrink-0 items-center whitespace-nowrap rounded-[9px] border px-3 py-2 text-[16px] leading-[24px] transition ${
            isActive
              ? "border-[#df8d7c] bg-white font-bold text-[#9a5547] shadow-sm"
              : "border-[#df8d7c] bg-white font-medium text-[#9a5547] hover:bg-[#fff8f6]"
          }`
        }
      >
        Import
      </NavLink>
    </div>
  );
};

export default AdjustmentTabs;

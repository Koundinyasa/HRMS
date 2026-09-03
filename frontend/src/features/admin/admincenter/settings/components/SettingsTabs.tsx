// import { NavLink } from "react-router-dom";

// const tabs = [
//   { label: "Payroll", path: "payroll" },
//   { label: "Reminder", path: "reminder" },
//   { label: "Email", path: "email" },
//   { label: "Tenant", path: "tenant" },
// ];

// export default function SettingsTabs() {
//   return (
//     <div className="mb-6 rounded-2xl bg-violet-100 p-3">
//       <div className="flex items-center gap-6">
//         {tabs.map((tab) => (
//           <NavLink
//             key={tab.label}
//             to={tab.path}
//             className={({ isActive }) =>
//               `rounded-xl px-8 py-3 text-sm font-medium transition-all ${
//                 isActive
//                   ? "bg-violet-600 text-white shadow-sm"
//                   : "text-gray-700 hover:bg-violet-200"
//               }`
//             }
//           >
//             {tab.label}
//           </NavLink>
//         ))}
//       </div>
//     </div>
//   );
// }




// import { NavLink } from "react-router-dom";

// const tabs = [
//   { label: "Payroll", path: "payroll" },
//   { label: "Reminder", path: "reminder" },
//   { label: "Email", path: "email" },
//   { label: "Tenant", path: "tenant" },
// ];

// export default function SettingsTabs() {
//   return (
//     <div className="mb-6 rounded-2xl bg-violet-100 p-2 sm:p-3">
//       <div className="flex items-center gap-2 overflow-x-auto sm:gap-4 md:gap-6">
//         {tabs.map((tab) => (
//           <NavLink
//             key={tab.label}
//             to={tab.path}
//             className={({ isActive }) =>
//               `shrink-0 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all sm:px-6 sm:py-3 md:px-8 ${
//                 isActive
//                   ? "bg-violet-600 text-white shadow-sm"
//                   : "text-gray-700 hover:bg-violet-200"
//               }`
//             }
//           >
//             {tab.label}
//           </NavLink>
//         ))}
//       </div>
//     </div>
//   );
// }





















import { NavLink } from "react-router-dom";

const tabs = [
  { label: "Payroll", path: "payroll" },
  { label: "Reminder", path: "reminder" },
  { label: "Email", path: "email" },
  { label: "Tenant", path: "tenant" },
];

export default function SettingsTabs() {
  return (
    <div className="mb-6 rounded-2xl bg-violet-100 p-2 sm:p-3">
      <div className="flex items-center gap-2 overflow-x-auto sm:gap-4 md:gap-6">
        {tabs.map((tab) => (
          <NavLink
            key={tab.label}
            to={tab.path}
            className={({ isActive }) =>
              `shrink-0 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all sm:px-6 sm:py-3 md:px-8 ${
                isActive
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-violet-200"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
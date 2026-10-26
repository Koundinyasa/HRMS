// import {
//   FileText,
//   BookOpen,
//   CalendarDays,
//   WalletCards,
//   FileUp,
// } from "lucide-react";

// export type LeaveSettingsTab =
//   | "policy"
//   | "definitions"
//   | "allot-avail"
//   | "opening-balance"
//   | "import";

// interface LeaveSettingsTabsProps {
//   activeTab: LeaveSettingsTab;
//   onTabChange: (tab: LeaveSettingsTab) => void;
// }

// const tabs: {
//   key: LeaveSettingsTab;
//   label: string;
//   icon: typeof FileText;
// }[] = [
//   {
//     key: "policy",
//     label: "Policy",
//     icon: FileText,
//   },
//   {
//     key: "definitions",
//     label: "Definitions",
//     icon: BookOpen,
//   },
//   {
//     key: "allot-avail",
//     label: "Allot/Avail Date",
//     icon: CalendarDays,
//   },
//   {
//     key: "opening-balance",
//     label: "Opening Balance",
//     icon: WalletCards,
//   },
//   {
//     key: "import",
//     label: "Import",
//     icon: FileUp,
//   },
// ];

// export default function LeaveSettingsTabs({
//   activeTab,
//   onTabChange,
// }: LeaveSettingsTabsProps) {
//   return (
//     <div className="w-full rounded-[10px] border border-[#009B57] bg-[#F8FFFB] px-4 py-2">
//       <div className="flex items-center gap-2 overflow-x-auto">
//         {tabs.map((tab) => {
//           const Icon = tab.icon;
//           const isActive = activeTab === tab.key;

//           return (
//             <button
//               key={tab.key}
//               type="button"
//               onClick={() => onTabChange(tab.key)}
//               className={[
//                 "flex h-[38px] shrink-0 items-center gap-2 rounded-[7px]",
//                 "border px-4 transition-all duration-150",
//                 "font-[Urbanist] text-[14px]",
//                 isActive
//                   ? "border-[#009B57] bg-white font-medium text-[#009B57] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
//                   : "border-transparent bg-transparent text-[#4B5563] hover:border-[#CDE8DB] hover:bg-white hover:text-[#009B57]",
//               ].join(" ")}
//             >
//               <Icon
//                 size={16}
//                 strokeWidth={1.8}
//                 className="shrink-0"
//               />

//               <span>{tab.label}</span>
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


import {
  BookOpen,
  CalendarDays,
  FileText,
  FileUp,
  WalletCards,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

interface LeaveSettingsTabsProps {
  basePath: string;
  actions?: ReactNode;
}

const tabs = [
  {
    label: "Policy",
    path: "policy",
    icon: FileText,
  },
  {
    label: "Definitions",
    path: "definitions",
    icon: BookOpen,
  },
  {
    label: "Allot/Avail Date",
    path: "allot-avail-date",
    icon: CalendarDays,
  },
  {
    label: "Opening Balance",
    path: "opening-balance",
    icon: WalletCards,
  },
  {
    label: "Import",
    path: "import",
    icon: FileUp,
  },
];

export default function LeaveSettingsTabs({
  basePath,
  actions,
}: LeaveSettingsTabsProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className="
        flex
        min-h-[74px]
        w-full
        items-center
        gap-5
        rounded-[9px]
        border
        border-[#DDE3EA]
        bg-white
        px-5
        shadow-[0_1px_5px_rgba(15,23,42,0.06)]
      "
    >
      <div className="flex items-center gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const targetPath = `${basePath}/${tab.path}`;
          const isActive = location.pathname === targetPath;

          return (
            <button
              key={tab.path}
              type="button"
              onClick={() => navigate(targetPath)}
              className={`
                flex
                h-[46px]
                items-center
                gap-2
                rounded-[7px]
                border
                px-6
                font-[Urbanist]
                text-[14px]
                font-medium
                transition-all
                ${isActive
                  ? "border-[#00A86B] text-[#00A86B]"
                  : "border-[#D4DAE2] text-[#172033] hover:border-[#00A86B] hover:text-[#00A86B]"}
              `}
            >
              <Icon size={17} strokeWidth={1.7} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {actions && <div className="ml-auto flex shrink-0 items-center">{actions}</div>}
    </div>
  );
}
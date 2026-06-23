import {
  FileText,
  Clock,
  Ticket,
  User,
} from "lucide-react";

import { useAppSelector } from "../../../../hooks/useAppSelector";

const quickLinks = [
  {
    title: "Apply Leave",
    icon: FileText,
  },
  {
    title: "Attendance",
    icon: Clock,
  },
  {
    title: "Raise Ticket",
    icon: Ticket,
  },
  {
    title: "My Profile",
    icon: User,
  },
];

export default function QuickAccessCard() {
  const themeColor = useAppSelector(
    (state) => state.theme.primaryColor
  );

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        p-5
        min-h-[220px]
        shadow-sm
      "
      style={{
        backgroundColor: `${themeColor}15`,
      }}
    >
      {/* Header */}

      <h3
        className="font-medium mb-5"
        style={{
          color: themeColor,
        }}
      >
        Quick Access
      </h3>

      {/* Links */}

      <div className="grid grid-cols-2 gap-4">
        {quickLinks.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              className="
                flex
                flex-col
                items-center
                justify-center
                gap-2
                h-24
                rounded-xl
                border
                border-slate-200
                transition
                hover:scale-105
              "
              style={{
                backgroundColor: "white",
              }}
            >
              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  flex
                  items-center
                  justify-center
                "
                style={{
                  backgroundColor: `${themeColor}25`,
                }}
              >
                <Icon
                  size={18}
                  style={{
                    color: themeColor,
                  }}
                />
              </div>

              <span className="text-xs text-slate-700">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
import {
  CheckCheck,
  MessageSquareMore,
  ReceiptText,
  BarChart3,
  CalendarDays,
} from "lucide-react";

import { useAppSelector } from "../../../../hooks/useAppSelector";

export default function QuickAccessCard() {
  const themeColor = useAppSelector(
    (state) => state.theme.primaryColor
  );

  const quickLinks = [
    {
      title: "My Approvals",
      subtitle: "2 pending",
      icon: CheckCheck,
    },
    {
      title: "My Requests",
      subtitle: "1 pending",
      icon: MessageSquareMore,
    },
    {
      title: "Payslip Report",
      subtitle: "View Payslip",
      icon: ReceiptText,
    },
    {
      title: "STI Reports",
      subtitle: "Performance & Statistics",
      icon: BarChart3,
    },
    {
      title: "Holiday List",
      subtitle: "View List",
      icon: CalendarDays,
    },
  ];

  return (
    <div
      className="
        bg-white
        rounded-3xl
        p-6
        shadow-sm
        border
        border-slate-100
        h-full
      "
    >
      {/* Header */}

      <h3 className="text-2xl font-medium text-slate-800">
        Quick Access
      </h3>

      <div
        className="h-[2px] mt-4 mb-6"
        style={{
          backgroundColor: `${themeColor}70`,
        }}
      />

      {/* Items */}

      <div className="space-y-5">
        {quickLinks.map(
          (
            item,
            index
          ) => {
            const Icon =
              item.icon;

            return (
              <div
                key={index}
                className="
                  rounded-2xl
                  p-4
                  flex
                  items-center
                  gap-4
                "
                style={{
                  background: `linear-gradient(
                    90deg,
                    ${themeColor}15,
                    #DFF8FF
                  )`,
                }}
              >
                <div
                  className="
                    w-14
                    h-14
                    rounded-xl
                    flex
                    items-center
                    justify-center
                  "
                  style={{
                    backgroundColor:
                      `${themeColor}15`,
                  }}
                >
                  <Icon
                    size={30}
                    color={
                      themeColor
                    }
                  />
                </div>

                <div>
                  <h4
                    className="
                      text-lg
                      font-medium
                      text-slate-800
                    "
                  >
                    {item.title}
                  </h4>

                  <p
                    className="
                      text-slate-500
                      mt-1
                    "
                  >
                    {
                      item.subtitle
                    }
                  </p>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
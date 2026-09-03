import {
  CheckCheck,
  MessageSquareMore,
  ReceiptText,
  BarChart3,
  CalendarDays,
} from "lucide-react";

export default function QuickAccessCard() {
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
  rounded-2xl
  p-3
  sm:p-4
  lg:p-5
  shadow-sm
  border
  h-auto
"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--primary-border)",
      }}
    >
      {/* Header */}

      <h3
        className="text-base sm:text-lg font-medium"
        style={{
          color: "var(--primary-color)",
        }}
      >
        Quick Access
      </h3>

      {/* Divider */}

      <div
        className="h-[2px] mt-3 mb-4 sm:mb-5"
        style={{
          backgroundColor: "var(--primary-border)",
        }}
      />

      {/* Items */}

     <div className="space-y-3 sm:space-y-4">
        {quickLinks.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="
  rounded-xl
  p-3
  flex
  items-center
  gap-3
  sm:gap-4
  hover:shadow-sm
  transition
  cursor-pointer
"
              style={{
                background:
                  "linear-gradient(90deg,var(--primary-light),var(--card-bg))",
              }}
            >
              {/* Icon */}

              <div
                className="
                 w-10
h-10
sm:w-12
sm:h-12
                  rounded-xl
                  flex
                  items-center
                  justify-center
                "
                style={{
                  backgroundColor: "var(--primary-light)",
                }}
              >
                <Icon
  size={20}
  className="sm:w-[22px] sm:h-[22px]"
                  color="var(--primary-color)"
                />
              </div>

              {/* Text */}

              <div>
                <h4 className="text-sm sm:text-base font-medium text-slate-800">
                  {item.title}
                </h4>

                <p className="text-xs sm:text-sm text-slate-500">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
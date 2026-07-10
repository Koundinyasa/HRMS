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
        p-5
        shadow-sm
        border
        h-full
      "
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--primary-border)",
      }}
    >
      {/* Header */}

      <h3
        className="text-lg font-medium"
        style={{
          color: "var(--primary-color)",
        }}
      >
        Quick Access
      </h3>

      {/* Divider */}

      <div
        className="h-[2px] mt-3 mb-5"
        style={{
          backgroundColor: "var(--primary-border)",
        }}
      />

      {/* Items */}

      <div className="space-y-4">
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
                gap-4
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
                  w-12
                  h-12
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
                  size={22}
                  color="var(--primary-color)"
                />
              </div>

              {/* Text */}

              <div>
                <h4 className="font-medium text-slate-800">
                  {item.title}
                </h4>

                <p className="text-sm text-slate-500">
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
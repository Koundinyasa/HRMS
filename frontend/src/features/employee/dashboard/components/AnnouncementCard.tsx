import {
  UserPlus,
  CircleCheck,
  AlertCircle,
  Vote,
  PartyPopper,
} from "lucide-react";

export default function AnnouncementCard() {
  const announcements = [
    {
      title: "Welcome a new member, Alya...",
      time: "8:15 AM",
      icon: UserPlus,
      bg: "#F3F4F6",
      color: "#6B7280",
    },
    {
      title: "Leave Approved",
      time: "2 hours ago",
      icon: CircleCheck,
      bg: "#ECFDF5",
      color: "#22C55E",
    },
    {
      title: "You have not fulfilled your mission...",
      time: "8 hours ago",
      icon: AlertCircle,
      bg: "#FFF7ED",
      color: "#F97316",
    },
    {
      title: "Cast your vote in the poll. This...",
      time: "8 hours ago",
      icon: Vote,
      bg: "#EEF2FF",
      color: "#4F46E5",
    },
    {
      title: "Let's celebrate the upcoming...",
      time: "15 hours ago",
      icon: PartyPopper,
      bg: "#FAF5FF",
      color: "#A855F7",
    },
    {
      title: "Welcome a new member, Alva...",
      time: "15 hours ago",
      icon: UserPlus,
      bg: "#F3F4F6",
      color: "#6B7280",
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

      <div className="flex items-center justify-between">
        <h3
          className="text-lg font-medium"
          style={{
            color: "var(--primary-color)",
          }}
        >
          Announcements
        </h3>

        <button
          className="text-sm font-medium"
          style={{
            color: "var(--primary-color)",
          }}
        >
          View All
        </button>
      </div>

      {/* Divider */}

      <div
        className="h-[2px] mt-3 mb-4"
        style={{
          backgroundColor: "var(--primary-border)",
        }}
      />

      {/* Announcement List */}

      <div>
        {announcements.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="
                flex
                items-start
                gap-4
                py-4
                border-b
                last:border-b-0
              "
              style={{
                borderColor: "var(--primary-border)",
              }}
            >
              {/* Icon */}

              <div
                className="
                  w-10
                  h-10
                  rounded-full
                  flex
                  items-center
                  justify-center
                  shrink-0
                "
                style={{
                  backgroundColor: item.bg,
                }}
              >
                <Icon
                  size={18}
                  color={item.color}
                />
              </div>

              {/* Content */}

              <div>
                <p className="text-sm text-slate-700">
                  {item.title}
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  {item.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
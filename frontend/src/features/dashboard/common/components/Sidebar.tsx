import {
  FileText,
  User,
  Settings,
  BarChart3,
  ClipboardList,
  ChevronDown,
} from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    {
      name: "Request",
      icon: FileText,
    },
    {
      name: "Profile",
      icon: User,
    },
    {
      name: "MISC",
      icon: Settings,
    },
    {
      name: "Report",
      icon: BarChart3,
    },
    {
      name: "Review",
      icon: ClipboardList,
    },
  ];

  return (
    <aside
      className="
        w-[170px]
        border-r
        border-slate-200
        min-h-[calc(100vh-56px)]
        shrink-0
      "
      style={{
        backgroundColor: "var(--theme-light)",
      }}
    >
      <nav className="py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className="
                w-full
                flex
                items-center
                justify-between
                px-4
                py-4
                text-sm
                text-slate-700
                hover:bg-white
                transition-colors
              "
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={16}
                  style={{
                    color: "var(--theme-color)",
                  }}
                />

                <span>{item.name}</span>
              </div>

              <ChevronDown
                size={14}
                className="text-slate-500"
              />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
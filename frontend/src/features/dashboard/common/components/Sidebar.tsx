import {
  FileText,
  ChevronDown,
} from "lucide-react";
import { useGetProfileQuery } from "../../employee/api/employeeApi";

export default function Sidebar() {
  const { data: profileData } =
  useGetProfileQuery();

  const menuItems =
  profileData?.data?.menus?.[0]
    ?.children || [];

  return (
    <aside
      className="
        w-[140px]
        min-h-[calc(100vh-64px)]
        shrink-0
        border-r
      "
      style={{
        background:
          "linear-gradient(180deg, #1E88F5 0%, #1976D2 100%)",
        borderRight: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      <nav className="pt-4">
        {menuItems.map((item: any) => {
          const Icon = FileText;

          return (
            <button
              key={item.menuName}
              className="
                w-full
                flex
                items-center
                justify-between
                px-3
                py-4
                text-white
                hover:bg-white/10
                transition-all
                duration-200
              "
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={16}
                  className="text-white"
                />

                <span
                  className="
                    text-sm
                    font-medium
                  "
                >
                  {item.menuName}
                </span>
              </div>

              <ChevronDown
                size={14}
                className="text-white/80"
              />
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
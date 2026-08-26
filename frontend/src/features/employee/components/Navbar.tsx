import Header from "./Header";
import ThemePreset from "./ThemePreset";
import NotificationCard from "./NotificationCard";
import ProfileMenu from "./ProfileMenu";
import type { NavbarProps } from "../dashboard/types/dashboard.types";
 
export default function Navbar({
  isSidebarOpen,
  setIsSidebarOpen,
}: NavbarProps) {
  return (
    <header
      className="
        h-16
        min-h-16
        w-full
        shrink-0
        border-b
        flex
        items-center
        gap-2
        px-2
        sm:px-4
        lg:px-6
        overflow-visible
        relative
        z-[60]
      "
      style={{
        backgroundColor: "var(--primary-color)",
      }}
    >
      {/* Left side */}
      <div className="flex-1 min-w-0">
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
 
      {/* Right side */}
      <div
        className="
          flex
          items-center
          gap-1
          sm:gap-2
          lg:gap-5
          shrink-0
        "
      >
        <ThemePreset />
 
        <NotificationCard />
 
        <ProfileMenu />
      </div>
    </header>
  );
}
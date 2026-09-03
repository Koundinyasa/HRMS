
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
        relative
        z-[60]
        flex
        h-16
        min-h-16
        w-full
        shrink-0
        items-center
        gap-2
        overflow-visible
        border-b-2
        border-[#B8E0F5]
        px-2
        sm:px-4
        lg:px-6
      "
      // style={{
      //   backgroundColor: "var(--primary-color)",
      // }}

      style={{ backgroundColor: "#E8F6FF" }}
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
        className="flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-3"
      >
        {/* <ThemePreset /> */}
 
        <NotificationCard />
 
        <ProfileMenu />
      </div>
    </header>
  );
}
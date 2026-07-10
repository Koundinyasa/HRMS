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
        border-b
        flex
        items-center
        justify-between
        px-6
      "
      style={{
        backgroundColor: "var(--primary-color)",
      }}
    >
      <Header
  isSidebarOpen={isSidebarOpen}
  setIsSidebarOpen={setIsSidebarOpen}
/>
 
      <div
        className="
          flex
          items-center
          gap-5
        "
      >
        <ThemePreset />
 
        <NotificationCard />
 
        <ProfileMenu />
      </div>
    </header>
  );
}
 
import Header from "./Header";
import ThemePreset from "./ThemePreset";
import NotificationCard from "./NotificationCard";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
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
      <Header />

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
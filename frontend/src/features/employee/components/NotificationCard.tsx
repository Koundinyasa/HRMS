import { Bell } from "lucide-react";

export default function NotificationCard() {
  return (
    <button
      type="button"
      className="
        p-2
        rounded-full
        hover:bg-white/10
        transition
      "
    >
      <Bell
        size={18}
        color="white"
      />
    </button>
  );
}
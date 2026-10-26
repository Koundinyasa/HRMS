

import { Bell } from "lucide-react";

export default function NotificationCard() {
  return (
    <button
      type="button"
      className="
        flex
        h-9
        w-9
        shrink-0
        items-center
        justify-center
        rounded-full
        transition
        hover:bg-[#B8E0F5]/70
        sm:h-10
        sm:w-10
      "
    >
      <Bell
        size={18}
        strokeWidth={2}
        color="#1E3A5F"
      />
    </button>
  );
}
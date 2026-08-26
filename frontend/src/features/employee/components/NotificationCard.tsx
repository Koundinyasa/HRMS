import { Bell } from "lucide-react";
 
export default function NotificationCard() {
  return (
    <button
      type="button"
      className="
        w-9
        h-9
        flex
        items-center
        justify-center
        rounded-full
        hover:bg-white/10
        transition
        shrink-0
      "
    >
      <Bell
        size={18}
        color="white"
      />
    </button>
  );
}
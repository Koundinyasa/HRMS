import { DollarSign, Sun, Plus, Star, Heart } from "lucide-react";
import { LEAVE_ICON_STYLES } from "../constants/leavePolicy.constants";
import type { LeaveIconKey } from "../types/leavePolicy.types";

const ICONS: Record<LeaveIconKey, typeof DollarSign> = {
  lop: DollarSign,
  cl: Sun,
  sl: Plus,
  rh: Star,
  ml: Heart,
};

export default function LeaveIconBadge({ icon, size = 16 }: { icon: LeaveIconKey; size?: number }) {
  const Icon = ICONS[icon];
  const style = LEAVE_ICON_STYLES[icon];

  return (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${style.bg} ${style.text}`}
    >
      <Icon size={size} strokeWidth={2.25} />
    </span>
  );
}

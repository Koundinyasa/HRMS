import {
  BarChart3,
  Bell,
  Building2,
  Circle,
  CircleCheckBig,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Diamond,
  FileText,
  FileUser,
  Info,
  LayoutGrid,
  Mail,
  Sun,
  UserMinus,
  UserPlus,
  UserSearch,
  UserX,
  Users,
  Users2,
  UsersRound,
  Wallet,
  type LucideIcon,
} from "lucide-react";

// Icons that screens pick by name (icon: "Users" in the sidebar links, tab lists,
// dashboard cards). Importing the whole lucide-react library for this lookup added
// about 600 kB to the first page load, so only the icons listed here are bundled.
//
// To use a new icon by name: import it above and add it to ICONS.
const ICONS = {
  BarChart3,
  Bell,
  Building2,
  Circle,
  CircleCheckBig,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  Diamond,
  FileText,
  FileUser,
  Info,
  LayoutGrid,
  Mail,
  Sun,
  UserMinus,
  UserPlus,
  UserSearch,
  UserX,
  Users,
  Users2,
  UsersRound,
  Wallet,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

/** The icon for `name`; unknown or missing names give the Circle icon. */
export function getIcon(name?: string): LucideIcon {
  if (name && Object.prototype.hasOwnProperty.call(ICONS, name)) {
    return ICONS[name as IconName];
  }
  if (import.meta.env.DEV && name) {
    console.warn(
      `Icon "${name}" is not registered in shared/icons/lucideByName.ts, showing Circle instead.`,
    );
  }
  return Circle;
}

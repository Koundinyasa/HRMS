export const PROFILE_TITLE = "My Profile";

export const PROFILE_BASE_ROUTE =
  "/employee/profile";

  import {
  User,
  Users,
  MapPin,
  GraduationCap,
  Briefcase,
  Landmark,
  FileText,
  type LucideIcon,
} from "lucide-react";

export const PROFILE_ICONS: Record<string, LucideIcon> = {
  user: User,
  users: Users,
  "map-pin": MapPin,
  "graduation-cap": GraduationCap,
  briefcase: Briefcase,
  bank: Landmark,
  "file-text": FileText,
};

export const HIDDEN_FIELDS = [
  "ID",
  "Deleted",
  "Employee ID",
];
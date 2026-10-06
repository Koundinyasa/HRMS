import type { LucideIcon } from "lucide-react";

export interface SubNavItem {
  label: string;
  path: string;          
  children?: SubNavItem[];
  number?: string;
  icon?: LucideIcon;
  badgeCount?: number;
}
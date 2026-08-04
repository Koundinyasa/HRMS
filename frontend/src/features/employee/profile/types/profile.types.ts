import type { ReactNode } from "react";
import type { MenuItem } from "../../dashboard/types/dashboard.types";

export interface ProfileField {
  label: string;
  value: string | number | boolean | null;
}

export interface ProfileRecord {
  heading?: string;
  fields: ProfileField[];
}

export interface ProfileSection {
  title: string;
  icon: string;
  fields?: ProfileField[];
  records?: ProfileRecord[];
}

export interface ProfileInfoResponse {
  sections: ProfileSection[];
}

export interface ProfileTabsProps {
  tabs: MenuItem[];
}

export interface ProfileSectionProps {
  section: ProfileSection;
}

export interface SectionCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}
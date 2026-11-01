export interface SubNavItem {
  label: string;
  path: string;          
  /** Address below the section (for example "leave/forceleaveapproval"), used instead of the parent's path when a child lives elsewhere. */
  href?: string;
  children?: SubNavItem[];
}
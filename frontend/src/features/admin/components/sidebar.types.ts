export interface SubNavItem {
  label: string;
  path: string;          
  children?: SubNavItem[];
}
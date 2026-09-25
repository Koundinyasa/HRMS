import type { ReactNode } from "react";

export interface SubNavItem {
  label: string;
  path: string;
}

export interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  width?: string;
  filterable?: boolean;
  render?: (row: T) => ReactNode;
}

export interface ToolbarFilter {
  key: string;
  label: string;
  options: {
    label: string;
    value: string;
  }[];
  selected?: string[];
  onChange?: (values: string[]) => void;
}

export interface CardGroupItem {
  label: string;
  path: string;
}

export interface CardGroup {
  title: string;
  items: CardGroupItem[];
}
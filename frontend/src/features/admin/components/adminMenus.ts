import { useMemo } from "react";

import { useGetDashboardSummaryQuery } from "../dashboard/api/dashboardApi";
import { SIDEBAR_LINKS } from "../dashboard/constants/dashboard.constants";
import type { MenuInfo } from "../dashboard/types/dashboard.types";
import type { SubNavItem } from "./sidebar.types";

/**
 * The admin sidebar is built from the database.
 *
 * The backend sends the signed-in user's menus with the landing page data
 * (Usp_AdminDashboard: Mst_Menu + RoleMenuPermission, CanView = 1). Each menu
 * has a routeUrl such as "/admin/time-office/leave/daily", the same path the
 * screens use after the company domain.
 *
 *  - First level: a menu whose routeUrl is exactly "/admin/<section>".
 *  - Second level: its children, and one more level below them.
 *
 * Names, order and nesting come from the database. Only the icon of each
 * section comes from SIDEBAR_LINKS (the database has no icon for these menus).
 */

export interface AdminSection {
  label: string;
  /** Path segment after /admin/, for example "time-office". */
  path: string;
  icon: string;
  items: SubNavItem[];
}

const trimRoute = (route: string) => route.trim().replace(/\/+$/, "");

const byOrder = (a: MenuInfo, b: MenuInfo) =>
  a.displayOrder - b.displayOrder || a.menuId - b.menuId;

/** "/admin/time-office" gives "time-office"; any other route gives null. */
function sectionSegment(route: string): string | null {
  const match = /^\/admin\/([^/]+)$/i.exec(trimRoute(route));
  return match ? match[1] : null;
}

/** The part of `route` below `parentRoute`, or null when it is not below it. */
function below(route: string, parentRoute: string): string | null {
  const child = trimRoute(route);
  const parent = trimRoute(parentRoute);
  const isBelow =
    child.length > parent.length + 1 &&
    child.toLowerCase().startsWith(`${parent.toLowerCase()}/`);
  return isBelow ? child.slice(parent.length + 1) : null;
}

export function buildAdminSections(menus: readonly MenuInfo[]): AdminSection[] {
  const childrenOf = (id: number) =>
    menus.filter((menu) => menu.parentId === id).sort(byOrder);

  const sections: AdminSection[] = [];

  for (const menu of [...menus].sort(byOrder)) {
    const path = sectionSegment(menu.routeUrl ?? "");
    if (!path) continue;

    const items: SubNavItem[] = [];

    for (const child of childrenOf(menu.menuId)) {
      const itemPath = below(child.routeUrl ?? "", menu.routeUrl);
      if (!itemPath) continue;

      const children: SubNavItem[] = [];
      for (const grandChild of childrenOf(child.menuId)) {
        const childPath = below(grandChild.routeUrl ?? "", child.routeUrl);
        if (childPath) children.push({ label: grandChild.menuName, path: childPath });
      }

      items.push(
        children.length > 0
          ? { label: child.menuName, path: itemPath, children }
          : { label: child.menuName, path: itemPath },
      );
    }

    sections.push({
      label: menu.menuName,
      path,
      icon: SIDEBAR_LINKS.find((link) => link.path === path.toLowerCase())?.icon ?? "Circle",
      items,
    });
  }

  return sections;
}

/** The signed-in user's sidebar sections. Empty until the data has loaded. */
export function useAdminMenus() {
  const { data, isLoading } = useGetDashboardSummaryQuery();

  const sections = useMemo(() => buildAdminSections(data?.menus ?? []), [data]);

  return { sections, isLoading };
}

import type { ReactNode } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import { useGetDashboardSummaryQuery } from "../dashboard/api/dashboardApi";
import type { MenuInfo } from "../dashboard/types/dashboard.types";

/**
 * Keeps a signed-in admin on the pages their database menus allow.
 *
 * The sidebar already lists only the user's menus, but a page can still be
 * opened by typing its address. The backend refuses the data for pages that
 * are not enabled; this guard also stops the page itself from showing.
 *
 * A page is allowed when its path (after the company domain) is
 *  - the landing page (/admin or /admin/dashboard), or
 *  - exactly the route of one of the user's menus, or
 *  - below the route of a menu that is a screen (its own tabs and sub-pages
 *    share its path). A menu is a screen when none of its child menus sit
 *    below its own path: "Leave Daily" can list child menus that live
 *    elsewhere and still own its tabs.
 * A menu that groups other menus below its path (for example
 * "Time & Office") allows its own path but not everything below it.
 *
 * It does nothing while the menus are loading or when the user has no menus
 * or the menus could not be loaded: the backend gate decides in those cases.
 */

const clean = (route: string) => route.trim().replace(/\/+$/, "").toLowerCase();

export function isAdminPathAllowed(path: string, menus: readonly MenuInfo[]): boolean {
  const current = clean(path);

  if (current === "/admin" || current === "/admin/dashboard") return true;

  return menus.some((menu) => {
    const route = clean(menu.routeUrl ?? "");
    if (!route) return false;
    if (current === route) return true;
    const groupsPagesBelowItself = menus.some(
      (child) =>
        child.parentId === menu.menuId &&
        clean(child.routeUrl ?? "").startsWith(`${route}/`),
    );
    return !groupsPagesBelowItself && current.startsWith(`${route}/`);
  });
}

export default function AdminRouteGuard({ children }: { children: ReactNode }) {
  const { domain } = useParams();
  const { pathname } = useLocation();
  const { data, isLoading } = useGetDashboardSummaryQuery();

  if (isLoading) return null;

  const menus = data?.menus ?? [];
  if (menus.length === 0) return <>{children}</>;

  const base = domain ? `/${domain}` : "";
  const path = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;

  if (isAdminPathAllowed(path, menus)) return <>{children}</>;

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h2 className="text-base font-semibold text-slate-800">This page is not available</h2>
      <p className="mt-2 text-sm text-slate-500">
        It is not part of the menus enabled for your account.
      </p>
      <Link
        to={`${base}/admin/dashboard`}
        className="mt-5 inline-block text-sm font-medium text-blue-600 hover:underline"
      >
        Back to dashboard
      </Link>
    </div>
  );
}

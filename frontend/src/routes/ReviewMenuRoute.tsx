import { Outlet } from "react-router-dom";

import { useGetMenusQuery } from "@/features/employee/dashboard/api/dashboardApi";
import PageNotAvailable from "./PageNotAvailable";

/**
 * Opens the reporting-manager screens (Review, Regularization, Attendance
 * Overview, Leave Calendar, Apply Leave for Employee) only for users whose
 * menus include the Review menu. The sidebar already hides them from other
 * employees; this also stops a typed address from opening the page.
 *
 * The backend still decides what data comes back. If the menus cannot be
 * loaded the page is not opened.
 */

interface MenuNode {
  routeUrl?: string | null;
  children?: MenuNode[] | null;
}

const hasReviewMenu = (nodes: readonly MenuNode[] | undefined): boolean =>
  (nodes ?? []).some(
    (node) =>
      (node.routeUrl ?? "").trim().replace(/\/+$/, "").toLowerCase() === "/employee/review" ||
      hasReviewMenu(node.children ?? undefined),
  );

export default function ReviewMenuRoute() {
  const { data, isLoading } = useGetMenusQuery();

  if (isLoading) return null;

  return hasReviewMenu(data?.data) ? <Outlet /> : <PageNotAvailable />;
}

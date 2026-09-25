import { Outlet, useLocation } from "react-router-dom";

import Breadcrumb from "../components/Breadcrumb";
import { INSIGHTS_SUB_NAV } from "../constants/reports.constants";

export default function InsightsPage() {
  const location = useLocation();

  const activeSegment =
    location.pathname.split("/").filter(Boolean).pop() ?? "";

  const activeLabel =
    INSIGHTS_SUB_NAV.find(
      (item) => item.path === activeSegment
    )?.label ?? "Employee Report";

  return (
    <div className="min-h-full bg-gray-50 p-4">
      <Breadcrumb section="Insights" page={activeLabel} />

      <div className="mt-4">
        <Outlet />
      </div>
    </div>
  );
}
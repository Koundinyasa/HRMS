import { Outlet, useParams } from "react-router-dom";
import TabBar from "@/features/admin/components/TabBar";
import { Settings_Details_Tab } from "../constants/settings.constants";

export default function LeaveSettingsPage() {
  const { domain } = useParams();
  const basePath = `/${domain}/admin/talent-hub/leave/settings`;

  return (
    <div className="w-full min-w-0 space-y-3">
      <TabBar basePath={basePath} tabs={Settings_Details_Tab} />
      <Outlet />
    </div>
  );
}

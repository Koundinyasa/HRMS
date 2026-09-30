import { Outlet, useParams } from "react-router-dom";
import TabBar from "@/features/admin/components/TabBar";
import { Integrations_Details_Tab } from "../constants/attendance.constants";

export default function AttendanceIntegrationsPage() {
  const { domain } = useParams();
  const basePath = `/${domain}/admin/time-office/attendance/integration`;

  return (
    <div>
      <TabBar basePath={basePath} tabs={Integrations_Details_Tab} />
      <Outlet />
    </div>
  );
}
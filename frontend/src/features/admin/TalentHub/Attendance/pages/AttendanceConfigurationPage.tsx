import { Outlet, useParams } from "react-router-dom";
import TabBar from "@/features/admin/components/TabBar";
import { Configurations_Details_Tab } from "../constants/attendance.constants";

export default function AttendanceConfigurationPage() {
  const { domain } = useParams();
  const basePath = `/${domain}/admin/talent-hub/attendance/configuration`;

  return (
    <div>
      <TabBar basePath={basePath} tabs={Configurations_Details_Tab} />
      <Outlet />
    </div>
  );
}
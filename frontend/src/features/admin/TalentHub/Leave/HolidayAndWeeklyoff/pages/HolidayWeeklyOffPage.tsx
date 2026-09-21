import { Outlet, useParams } from "react-router-dom";
import TabBar from "@/features/admin/components/TabBar";
import { Holiday_WeeklyOff_Details_Tab } from "../constants/holidayweeklyoff.constants";

export default function HolidayWeeklyOffPage() {
  const { domain } = useParams();
  const basePath = `/${domain}/admin/talent-hub/leave/holidayandweekOff`;

  return (
    <div>
      <TabBar basePath={basePath} tabs={Holiday_WeeklyOff_Details_Tab} />
      <Outlet />
    </div>
  );
}
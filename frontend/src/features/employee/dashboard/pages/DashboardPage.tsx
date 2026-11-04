

 
import GreetingCard from "../components/GreetingCard";
import AttendanceCard from "../components/AttendanceCard";
import StatsLeaveCard from "../components/StatsLeaveCard";
import CalendarCard from "../components/CalendarCard";
import QuickAccessCard from "../components/QuickAccessCard";
import AnnouncementCard from "../components/AnnouncementCard";
import BirthdayCard from "../components/BirthdayCard";
import TeamAttendanceCard from "../components/TeamAttendanceCard";
import TaskCard from "../components/TaskCard";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { hidePageLoader } from "../../employeeSlice";
 
export default function DashboardPage() {
  const dispatch = useAppDispatch();
 
  useEffect(() => {
    dispatch(hidePageLoader());
  }, [dispatch]);
 
  return (
    <div className="dashboard-shell w-full min-w-0 space-y-6">
      <GreetingCard />
 
      {/* Row 1 */}
      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        <div className="col-span-12 xl:col-span-3 min-w-0">
          <AttendanceCard />
        </div>
        <div className="col-span-12 xl:col-span-6 min-w-0">
          <StatsLeaveCard />
        </div>
        <div className="col-span-12 xl:col-span-3 min-w-0">
          <CalendarCard />
        </div>
      </div>
 
      {/* =========================================================
          ⬇️ CHANGED — items-stretch + h-full on columns so all
          three cards share the same bottom edge
          ========================================================= */}
      <div className="grid grid-cols-12 gap-4 sm:gap-6 items-stretch">
        <div className="col-span-12 xl:col-span-3 min-w-0 h-full">
          <QuickAccessCard />
        </div>
 
        <div className="col-span-12 xl:col-span-6 min-w-0 h-full">
          <AnnouncementCard />
        </div>
 
        <div className="col-span-12 xl:col-span-3 min-w-0 h-full">
          <BirthdayCard />
        </div>
      </div>
      {/* =========================================================
          ⬆️ END CHANGED
          ========================================================= */}
 
      {/* Third Row */}
      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        <div className="col-span-12 xl:col-span-7 min-w-0">
          <TeamAttendanceCard />
        </div>
        <div className="col-span-12 xl:col-span-5 min-w-0">
          <TaskCard />
        </div>
      </div>
    </div>
  );
}
 
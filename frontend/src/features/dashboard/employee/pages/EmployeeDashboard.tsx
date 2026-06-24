import Header from "../../common/components/Header";
import Sidebar from "../../common/components/Sidebar";
import GreetingCard from "../../common/components/GreetingCard";

import AttendanceCard from "../components/AttendanceCard";
import StatsLeaveCard from "../components/StatsLeaveCard";
import QuickAccessCard from "../components/QuickAccessCard";
import AnnouncementCard from "../components/AnnouncementCard";
import BirthdayCard from "../components/BirthdayCard";
import TeamAttendanceCard from "../components/TeamAttendanceCard";
import TaskCard from "../components/TaskCard";

import CalendarCard from "../../common/components/CalendarCard";

import { useAppSelector } from "../../../../hooks/useAppSelector";

export default function EmployeeDashboard() {
  const themeColor = useAppSelector(
    (state) => state.theme.primaryColor
  );

  return (
    <div
      className="min-h-screen"
      style={
        {
          "--theme-color": themeColor,
          "--theme-light": `${themeColor}15`,
        } as React.CSSProperties
      }
    >
      <Header />

      <div className="flex">
        <Sidebar />

        <main
          className="flex-1 p-4"
          style={{
            backgroundColor: "var(--theme-light)",
          }}
        >
          {/* Greeting Card */}

          <GreetingCard />

          {/* Row 1 */}

          <div className="grid grid-cols-12 gap-4 mt-4">
            {/* Attendance */}

            <div className="col-span-3">
              <AttendanceCard />
            </div>

            {/* Stats + Leaves */}

            <div className="col-span-6">
              <StatsLeaveCard />
            </div>

            {/* Calendar */}

            <div className="col-span-3">
              <CalendarCard />
            </div>
          </div>

          {/* Row 2 */}

          <div className="grid grid-cols-12 gap-4 mt-4">
            <div className="col-span-3">
              <QuickAccessCard />
            </div>

            <div className="col-span-6">
              <AnnouncementCard />
            </div>

            <div className="col-span-3">
              <BirthdayCard />
            </div>
          </div>

          {/* Row 3 */}

          <div className="grid grid-cols-12 gap-4 mt-4">
            <div className="col-span-7">
              <TeamAttendanceCard />
            </div>

            <div className="col-span-5">
              <TaskCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
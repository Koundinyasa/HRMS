import GreetingCard from "../components/GreetingCard";
import AttendanceCard from "../components/AttendanceCard";
import StatsLeaveCard from "../components/StatsLeaveCard";
import CalendarCard from "../components/CalendarCard";
import QuickAccessCard from "../components/QuickAccessCard";
import AnnouncementCard from "../components/AnnouncementCard";
import BirthdayCard from "../components/BirthdayCard";
import TeamAttendanceCard from "../components/TeamAttendanceCard";
import TaskCard from "../components/TaskCard";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Greeting */}

            <GreetingCard />

            {/* Row 1 */}

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 xl:col-span-3">
                    <AttendanceCard />
                </div>

                <div className="col-span-12 xl:col-span-6">
                    <StatsLeaveCard />
                </div>

                <div className="col-span-12 xl:col-span-3">
                    <CalendarCard />
                </div>
            </div>

            {/* Row 2 */}

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 xl:col-span-3">
                    <QuickAccessCard />
                </div>

                <div className="col-span-12 xl:col-span-6">
                    <AnnouncementCard />
                </div>

                <div className="col-span-12 xl:col-span-3">
                    <BirthdayCard />
                </div>
            </div>

            {/* Third Row */}
            <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-7">
                    <TeamAttendanceCard />
                </div>

                <div className="col-span-5">
                    <TaskCard />
                </div>
            </div>
        </div>
    );
}
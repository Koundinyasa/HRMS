import Header from "../../common/components/Header";
import Sidebar from "../../common/components/Sidebar";
import GreetingCard from "../../common/components/GreetingCard";
import LeaveCard from "../components/LeaveCard";
import PunchCard from "../components/PunchCard";
import NotificationCard from "../../common/components/NotificationCard";
import CalendarCard from "../../common/components/CalendarCard";
import WhoIsOffCard from "../components/WhoIsOffCard";
import QuickAccessCard from "../components/QuickAccessCard";
import BirthdayCard from "../components/BirthdayCard";

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
          className="flex-1 p-6"
          style={{
            backgroundColor:
              "var(--theme-light)",
          }}
        >
          <GreetingCard />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-5">
            <LeaveCard />
            <PunchCard />
            <NotificationCard />
            <CalendarCard />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5">
            <WhoIsOffCard />
            <QuickAccessCard />
            <BirthdayCard />
          </div>
        </main>
      </div>
    </div>
  );
}
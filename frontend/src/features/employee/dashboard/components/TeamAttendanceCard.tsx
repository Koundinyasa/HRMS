import { ChevronsUpDown } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
 
export default function TeamAttendanceCard() {
  const { profileData } = useDashboard();
 
  const employeeNames =
    profileData?.data?.upcomingEvents ?? [];
 
  const staticData = [
    {
      role: "UI Designer",
      today: "11:56 AM",
      day25: "12:45 AM",
      day24: "10:44 AM",
      day23: "Weekend",
      color: "#DDE2FF",
      textColor: "#4F46E5",
    },
    {
      role: "Developer",
      today: "wfh",
      day25: "10:53 AM",
      day24: "on leave",
      day23: "Weekend",
      color: "#FFE2F0",
      textColor: "#DB2777",
    },
    {
      role: "Developer",
      today: "wfh",
      day25: "10:21 AM",
      day24: "wfh",
      day23: "Weekend",
      color: "#DDFCE7",
      textColor: "#166534",
    },
    {
      role: "Developer",
      today: "office",
      day25: "10:45 AM",
      day24: "10:30 AM",
      day23: "Weekend",
      color: "#FEF3C7",
      textColor: "#B45309",
    },
  ];
 
  const teamData = staticData.map(
    (item, index) => ({
      initials:
        employeeNames[index]?.FullName
          ?.split(" ")
          .map((word) => word[0])
          .join("")
          .substring(0, 2)
          .toUpperCase() ?? "--",
 
      name:
        employeeNames[index]?.FullName ??
        "No Employee",
 
      ...item,
    })
  );
 
  return (
    <div
      className="
        rounded-2xl
        p-6
        shadow-sm
        border
      "
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--primary-border)",
      }}
    >
      {/* Header */}
 
      <div className="flex items-center justify-between">
        <h3
          className="text-xl font-semibold"
          style={{
            color: "var(--primary-color)",
          }}
        >
          Team
        </h3>
 
        <div className="flex items-center gap-5 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span>In Office</span>
          </div>
 
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Work From Home</span>
          </div>
 
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span>Absent</span>
          </div>
        </div>
      </div>
 
      {/* Divider */}
 
      <div
        className="h-[2px] mt-4 mb-4"
        style={{
          backgroundColor: "var(--primary-border)",
        }}
      />
 
      {/* Table Header */}
 
      <div
        className="grid grid-cols-[2.4fr_1fr_1fr_1fr_1fr]"
        style={{
          color: "var(--primary-color)",
        }}
      >
        <div>Members</div>
 
        <div className="flex items-center gap-1">
          Today
          <ChevronsUpDown
            size={14}
            color="var(--primary-color)"
          />
        </div>
 
        <div className="flex items-center gap-1">
          25/9
          <ChevronsUpDown
            size={14}
            color="var(--primary-color)"
          />
        </div>
 
        <div className="flex items-center gap-1">
          24/9
          <ChevronsUpDown
            size={14}
            color="var(--primary-color)"
          />
        </div>
 
        <div className="flex items-center gap-1">
          23/9
          <ChevronsUpDown
            size={14}
            color="var(--primary-color)"
          />
        </div>
      </div>
 
      {/* Rows */}
 
      {teamData.map((member, index) => (
        <div
          key={index}
          className="
  grid
  grid-cols-[2.4fr_1fr_1fr_1fr_1fr]
  items-center
  py-5
  border-t
"
          style={{
            borderColor: "var(--primary-border)",
          }}
        >
          {/* Member */}
 
          <div className="flex items-center gap-4 pl-2">
            <div
              className="
    w-12
    h-12
    min-w-[48px]
    min-h-[48px]
    shrink-0
    rounded-full
    flex
    items-center
    justify-center
    font-semibold
  "
              style={{
                backgroundColor: member.color,
                color: member.textColor,
              }}
            >
              {member.initials}
            </div>
 
            <div className="min-w-0 flex-1">
              <h4
                className="
    font-medium
    text-slate-800
    leading-6
    break-words
  "
              >
                {member.name}
              </h4>
 
              <p className="text-sm text-slate-500 mt-0.5">
                {member.role}
              </p>
            </div>
          </div>
 
          {/* Today */}
 
          <div>
            {member.today === "office" ? (
              <span className="w-3 h-3 rounded-full bg-green-500 block" />
            ) : member.today === "wfh" ? (
              <span className="w-3 h-3 rounded-full bg-blue-500 block" />
            ) : (
              <span className="text-sm text-slate-700">
                {member.today}
              </span>
            )}
          </div>
 
          {/* 25/9 */}
 
          <div>
            {member.day25}
          </div>
 
          {/* 24/9 */}
 
          <div>
            {member.day24 === "on leave" ? (
              <span className="text-orange-500 text-sm">
                On Leave
              </span>
            ) : member.day24 === "wfh" ? (
              <span className="w-3 h-3 rounded-full bg-blue-500 block" />
            ) : (
              <span className="text-sm text-slate-700">
                {member.day24}
              </span>
            )}
          </div>
 
          {/* 23/9 */}
 
          <div>
            {member.day23}
          </div>
        </div>
      ))}
    </div>
  );
}
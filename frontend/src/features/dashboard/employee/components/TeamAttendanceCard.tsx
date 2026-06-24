import { ChevronsUpDown } from "lucide-react";
import { useAppSelector } from "../../../../hooks/useAppSelector";

export default function TeamCard() {
  const themeColor = useAppSelector(
    (state) => state.theme.primaryColor
  );

  const teamData = [
    {
      initials: "AD",
      name: "Alena Douse",
      role: "UI Designer – UXD",
      today: "11:56 AM",
      day25: "12:45 AM",
      day24: "10:44 AM",
      day23: "weekend",
      color: "#DDE2FF",
      textColor: "#4F46E5",
    },
    {
      initials: "MV",
      name: "Miracle Vetrovs",
      role: "Developer",
      today: "wfh",
      day25: "10:53 AM",
      day24: "on leave",
      day23: "weekend",
      color: "#FFE2F0",
      textColor: "#DB2777",
    },
    {
      initials: "AA",
      name: "Avery Arwood",
      role: "Developer",
      today: "wfh",
      day25: "10:21 AM",
      day24: "wfh",
      day23: "weekend",
      color: "#DDFCE7",
      textColor: "#166534",
    },
    {
      initials: "JS",
      name: "Jake Stinson",
      role: "Developer",
      today: "office",
      day25: "10:45 AM",
      day24: "10:30 AM",
      day23: "weekend",
      color: "#FEF3C7",
      textColor: "#B45309",
    },
  ];

  return (
    <div
      className="
        bg-white
        rounded-3xl
        p-6
        shadow-sm
        border
        border-slate-100 
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-slate-800">
          Team
        </h3>

        <div className="flex items-center gap-5 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span>In office</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Work from home</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            <span>Absent</span>
          </div>
        </div>
      </div>

      <div
        className="h-[2px] mt-4 mb-4"
        style={{
          backgroundColor: `${themeColor}70`,
        }}
      />

      {/* Table Header */}

      <div
        className="
          grid
          grid-cols-5
          px-2
          pb-3
          text-slate-500
          text-sm
        "
      >
        <div>Members</div>

        <div className="flex items-center gap-1">
          Today
          <ChevronsUpDown size={14} />
        </div>

        <div className="flex items-center gap-1">
          25/9
          <ChevronsUpDown size={14} />
        </div>

        <div className="flex items-center gap-1">
          24/9
          <ChevronsUpDown size={14} />
        </div>

        <div className="flex items-center gap-1">
          23/9
          <ChevronsUpDown size={14} />
        </div>
      </div>

      {/* Rows */}

      {teamData.map((member, index) => (
        <div
          key={index}
          className="
            grid
            grid-cols-5
            items-center
            py-5
            border-t
            border-slate-100
          "
        >
          {/* Member */}

          <div className="flex items-center gap-4">
            <div
              className="
                w-12
                h-12
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

            <div>
              <h4 className="font-medium text-slate-800">
                {member.name}
              </h4>

              <p className="text-slate-500 text-sm">
                {member.role}
              </p>
            </div>
          </div>

          {/* Today */}

          <div>
            {member.today === "office" ? (
              <span className="w-3 h-3 bg-green-500 rounded-full block" />
            ) : member.today === "wfh" ? (
              <span className="w-3 h-3 bg-blue-500 rounded-full block" />
            ) : (
              member.today
            )}
          </div>

          {/* 25/9 */}

          <div>{member.day25}</div>

          {/* 24/9 */}

          <div>
            {member.day24 === "on leave" ? (
              <span className="text-orange-500">
                on leave
              </span>
            ) : member.day24 === "wfh" ? (
              <span className="w-3 h-3 bg-blue-500 rounded-full block" />
            ) : (
              member.day24
            )}
          </div>

          {/* 23/9 */}

          <div className="text-slate-500">
            {member.day23}
          </div>
        </div>
      ))}
    </div>
  );
}
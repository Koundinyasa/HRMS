import {
  Circle,
  Diamond,
} from "lucide-react";
export default function TaskCard() {
  const tasks = [
    {
      title: "Task 1 Project 1",
      time: "8:15 AM",
      status: "completed",
    },
    {
      title: "Task 1 Project 2",
      time: "2 hours ago",
      status: "pending",
    },
    {
      title: "Task 1 Project 3",
      time: "8 hours ago",
      status: "action",
    },
    {
      title: "Task 1 Project 4",
      time: "8 hours ago",
      status: "completed",
    },
  ];
  const getStatusColor = (
    status: string
  ) => {
    switch (status) {
      case "completed":
        return "#22C55E";

      case "pending":
        return "#EAB308";

      case "action":
        return "#EF4444";

      default:
        return "#22C55E";
    }
  };
  return (
    <div
      className="
  rounded-2xl
  p-4 sm:p-5 lg:p-6
  shadow-sm
  border
  w-full
  min-w-0
  overflow-hidden
"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--primary-border)",
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3
          className="text-xl font-semibold"
          style={{
            color: "var(--primary-color)",
          }}
        >
          Tasks
        </h3>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />

            <span>Completed</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500" />

            <span>Pending</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />

            <span>Action Needed</span>
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

      {/* Tasks */}

      {tasks.map((task, index) => (
        <div
          key={index}
          className="
  flex
  flex-col
  sm:flex-row
  sm:items-center
  sm:justify-between
  gap-3
  py-4 sm:py-5
  border-b
  last:border-b-0
"
          style={{
            borderColor: "var(--primary-border)",
          }}
        >
          {/* Left */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div
              className="
  w-9
  h-9
  sm:w-10
  sm:h-10
  min-w-[36px]
  sm:min-w-[40px]
  rounded-full
                flex
                items-center
                justify-center
              "
              style={{
                backgroundColor:
                  "var(--primary-light)",
              }}
            >
              <Diamond
                size={16}
                color="var(--primary-color)"
              />
            </div>
            <div className="min-w-0">
              <h4 className="font-medium text-sm sm:text-base text-slate-800 break-words">
                {task.title}
              </h4>
              <p className="text-sm text-slate-400 mt-1">
                {task.time}
              </p>
            </div>
          </div>

          {/* Right */}

          <div className="flex items-center gap-3 sm:gap-4 self-end sm:self-auto shrink-0">
            <Circle
              size={10}
              fill={getStatusColor(
                task.status
              )}
              color={getStatusColor(
                task.status
              )}
            />
            <button
              className="text-xs sm:text-sm font-medium whitespace-nowrap"
              style={{
                color: "var(--primary-color)",
              }}
            >
              View Details
            </button>
          </div>
        </div>
      ))}

    </div>
  );
}
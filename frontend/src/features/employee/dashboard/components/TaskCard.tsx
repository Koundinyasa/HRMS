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
          Tasks
        </h3>

        <div className="flex items-center gap-4 text-sm">
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
            items-center
            justify-between
            py-5
            border-b
            last:border-b-0
          "
          style={{
            borderColor: "var(--primary-border)",
          }}
        >
          {/* Left */}

          <div className="flex items-center gap-4">
            <div
              className="
                w-10
                h-10
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

            <div>
              <h4 className="font-medium text-slate-800">
                {task.title}
              </h4>

              <p className="text-sm text-slate-400 mt-1">
                {task.time}
              </p>
            </div>
          </div>

          {/* Right */}

          <div className="flex items-center gap-4">
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
              className="text-sm font-medium"
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
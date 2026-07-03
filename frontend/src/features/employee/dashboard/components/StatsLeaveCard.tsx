import {
  Clock3,
  ArrowUpRight,
  CircleCheck,
  ArrowDownLeft,
} from "lucide-react";

export default function StatsLeaveCard() {
  return (
    <div className="flex flex-col gap-4">
      {/* Top Stats */}

      <div className="grid grid-cols-4 gap-4">

        {/* Average Hours */}

        <div
          className="rounded-2xl p-4 border shadow-sm"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--primary-border)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: "var(--primary-light)",
            }}
          >
            <Clock3
              size={18}
              color="var(--primary-color)"
            />
          </div>

          <p className="text-sm text-slate-500 mt-3">
            Average hours
          </p>

          <h3 className="text-3xl font-semibold mt-1 text-slate-800">
            8 Hours
          </h3>
        </div>

        {/* Average Check In */}

        <div
          className="rounded-2xl p-4 border shadow-sm"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--primary-border)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: "#ECFDF5",
            }}
          >
            <ArrowUpRight
              size={18}
              color="#22C55E"
            />
          </div>

          <p className="text-sm text-slate-500 mt-3">
            Average check-in
          </p>

          <h3 className="text-3xl font-semibold mt-1 text-slate-800">
            10:33 AM
          </h3>
        </div>

        {/* On Time Arrival */}

        <div
          className="rounded-2xl p-4 border shadow-sm"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--primary-border)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: "#ECFDF5",
            }}
          >
            <CircleCheck
              size={18}
              color="#10B981"
            />
          </div>

          <p className="text-sm text-slate-500 mt-3">
            On-time arrival
          </p>

          <h3
            className="text-3xl font-semibold mt-1"
            style={{
              color: "#22C55E",
            }}
          >
            98.56%
          </h3>
        </div>

        {/* Average Check Out */}

        <div
          className="rounded-2xl p-4 border shadow-sm"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--primary-border)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: "#FFF7ED",
            }}
          >
            <ArrowDownLeft
              size={18}
              color="#F97316"
            />
          </div>

          <p className="text-sm text-slate-500 mt-3">
            Average check-out
          </p>

          <h3 className="text-3xl font-semibold mt-1 text-slate-800">
            19:12 PM
          </h3>
        </div>
      </div>

      {/* My Leaves */}

            {/* My Leaves */}

      <div
        className="rounded-2xl border shadow-sm p-6"
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--primary-border)",
        }}
      >
        <div className="flex items-center justify-between">
          <h3
            className="text-2xl font-medium"
            style={{
              color: "var(--primary-color)",
            }}
          >
            My Leaves
          </h3>

          <button
            className="
              px-3
              py-1
              rounded-lg
              text-sm
              font-medium
              text-white
            "
            style={{
              background: "var(--primary-gradient)",
            }}
          >
            Apply Leave +
          </button>
        </div>

        {/* Divider */}

        <div
          className="h-[2px] mt-4"
          style={{
            backgroundColor: "var(--primary-border)",
          }}
        />

        {/* Restricted Holiday */}

        <div
          className="
            mt-8
            rounded-xl
            px-5
            py-4
            flex
            items-center
            justify-between
          "
          style={{
            background:
              "linear-gradient(90deg,var(--primary-light),var(--card-bg))",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-300" />

            <span className="text-xl text-slate-700">
              Restricted Holiday
            </span>
          </div>

          <span className="text-2xl font-medium text-slate-800">
            2
          </span>
        </div>

        {/* Upcoming Holiday */}

        <div
          className="
            mt-4
            rounded-xl
            px-5
            py-4
            flex
            items-center
            justify-between
          "
          style={{
            background:
              "linear-gradient(90deg,var(--primary-light),var(--card-bg))",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400" />

            <span className="text-xl text-slate-700">
              Upcoming Holiday
            </span>
          </div>

          <span className="text-2xl font-medium text-slate-800">
            1
          </span>
        </div>
      </div>
    </div>
  );
}
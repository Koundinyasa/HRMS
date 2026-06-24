import {
  Clock3,
  ArrowUpRight,
  CircleCheck,
  ArrowDownLeft,
} from "lucide-react";

import { useAppSelector } from "../../../../hooks/useAppSelector";

export default function StatsLeaveCard() {
  const themeColor = useAppSelector(
    (state) => state.theme.primaryColor
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Top Stats */}

      <div className="grid grid-cols-4 gap-4">
        {/* Average Hours */}

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: "#EFF6FF",
            }}
          >
            <Clock3
              size={18}
              color="#2563EB"
            />
          </div>

          <p className="text-sm text-slate-500 mt-3">
            Average hours
          </p>

          <h3 className="text-3xl font-semibold mt-1">
            8 Hours
          </h3>
        </div>

        {/* Check In */}

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
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

          <h3 className="text-3xl font-semibold mt-1">
            10:33 AM
          </h3>
        </div>

        {/* On Time */}

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
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

        {/* Check Out */}

        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
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

          <h3 className="text-3xl font-semibold mt-1">
            19:12 PM
          </h3>
        </div>
      </div>

      {/* Leave Card */}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-medium text-slate-800">
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
              backgroundColor: themeColor,
            }}
          >
            Apply Leave +
          </button>
        </div>

        <div
          className="h-[2px] mt-4"
          style={{
            backgroundColor: `${themeColor}60`,
          }}
        />

        {/* Leave Item 1 */}

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
            background: `linear-gradient(
              90deg,
              ${themeColor}15,
              #DFF8FF
            )`,
          }}
        >
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-red-300" />

            <span className="text-xl text-slate-700">
              Restricted Holiday
            </span>
          </div>

          <span className="text-2xl font-medium">
            2
          </span>
        </div>

        {/* Leave Item 2 */}

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
            background: `linear-gradient(
              90deg,
              ${themeColor}15,
              #DFF8FF
            )`,
          }}
        >
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-400" />

            <span className="text-xl text-slate-700">
              Upcoming Holiday
            </span>
          </div>

          <span className="text-2xl font-medium">
            1
          </span>
        </div>
      </div>
    </div>
  );
}
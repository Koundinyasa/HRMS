import { Clock } from "lucide-react";

export default function AttendanceCard() {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        p-5
        shadow-sm
        border
        border-slate-100
        h-full
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-800">
          Today
        </h3>

        <span
          className="
            px-4
            py-1
            rounded-full
            text-xs
            font-medium
            bg-red-500
            text-white
          "
        >
          Absent
        </span>
      </div>

      {/* Divider */}

      <div className="h-[2px] bg-cyan-200 mt-3" />

      {/* Content */}

      <div className="mt-7 flex items-center justify-between">
        <div className="max-w-[150px]">
          <p
            className="
              text-slate-700
              text-[15px]
              leading-8
            "
          >
            You have not marked
            yourself as present today!
          </p>
        </div>

        {/* Circle */}

        <div className="relative">
          <div
            className="
              w-24
              h-24
              rounded-full
              border-[10px]
              border-orange-400
              border-l-slate-200
              border-b-slate-200
              flex
              items-center
              justify-center
            "
          >
            <div className="text-center">
              <h4 className="text-2xl font-bold text-slate-800">
                67%
              </h4>

              <p className="text-xs text-slate-500">
                in office
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Time */}

      <div className="flex items-center justify-center gap-2 mt-6">
        <Clock
          size={14}
          className="text-orange-500"
        />

        <span
          className="
            text-sm
            text-orange-500
            font-medium
          "
        >
          Time left - 56m 44s
        </span>
      </div>

      {/* Buttons */}

      <div className="mt-6 space-y-3">
        <button
          className="
            w-full
            h-10
            rounded-lg
            text-white
            text-sm
            font-medium
            bg-blue-600
            hover:bg-blue-700
          "
        >
          Punch In
        </button>

        <button
          className="
            w-full
            h-10
            rounded-lg
            text-white
            text-sm
            font-medium
            bg-slate-300
            cursor-not-allowed
          "
        >
          Check Out
        </button>
      </div>
    </div>
  );
}
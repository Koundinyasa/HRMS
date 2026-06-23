import { CalendarX } from "lucide-react";
import { useAppSelector } from "../../../../hooks/useAppSelector";

export default function WhoIsOffCard() {
  const themeColor = useAppSelector(
    (state) => state.theme.primaryColor
  );

  return (
    <div
      className="
        rounded-2xl
        border
        border-slate-200
        p-5
        min-h-[220px]
        shadow-sm
      "
      style={{
        backgroundColor: `${themeColor}15`,
      }}
    >
      {/* Header */}

      <div className="flex items-center justify-between">
        <h3
          className="font-medium"
          style={{
            color: themeColor,
          }}
        >
          Who's Off
        </h3>

        <span className="text-xs text-slate-500">
          Today
        </span>
      </div>

      {/* Content */}

      <div className="flex flex-col items-center justify-center h-[150px]">
        <div
          className="
            w-14
            h-14
            rounded-full
            flex
            items-center
            justify-center
          "
          style={{
            backgroundColor: `${themeColor}25`,
          }}
        >
          <CalendarX
            size={24}
            style={{
              color: themeColor,
            }}
          />
        </div>

        <p className="text-slate-700 font-medium mt-4">
          No One Is Off Today
        </p>

        <p className="text-xs text-slate-500 mt-2 text-center">
          All employees are available today.
        </p>
      </div>
    </div>
  );
}
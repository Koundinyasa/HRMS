import { Button } from "../../../../components/ui/button";
import { Clock } from "lucide-react";
import { useAppSelector } from "../../../../hooks/useAppSelector";

export default function PunchCard() {
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
        min-h-[210px]
        shadow-sm
      "
      style={{
        backgroundColor: `${themeColor}15`,
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-700">
          Punches
        </h3>

        <Button
          size="sm"
          className="
            h-8
            text-xs
            rounded-md
            text-white
          "
          style={{
            backgroundColor: themeColor,
          }}
        >
          Check Out
        </Button>
      </div>

      <div
        className="
          mt-5
          bg-slate-200
          rounded-md
          h-8
          flex
          items-center
          justify-center
          text-xs
          text-slate-700
        "
      >
        04:12:56
      </div>

      <div className="flex items-center justify-center gap-2 mt-5">
        <span className="w-2 h-2 bg-green-500 rounded-full" />

        <Clock
          size={14}
          className="text-slate-500"
        />

        <span className="text-sm text-slate-600">
          09 : 59 : 40
        </span>
      </div>

      <div
        className="
          mt-5
          h-9
          rounded-lg
          flex
          items-center
          justify-center
          text-xs
        "
        style={{
          backgroundColor: `${themeColor}25`,
          color: themeColor,
        }}
      >
        Late In : --:--
      </div>

      <div
        className="
          mt-3
          h-9
          rounded-lg
          flex
          items-center
          justify-center
          text-xs
        "
        style={{
          backgroundColor: `${themeColor}25`,
          color: themeColor,
        }}
      >
        Early Out : --:--
      </div>
    </div>
  );
}
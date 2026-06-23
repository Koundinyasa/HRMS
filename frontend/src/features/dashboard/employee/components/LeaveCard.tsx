import { Button } from "../../../../components/ui/button";
import { useAppSelector } from "../../../../hooks/useAppSelector";

export default function LeaveCard() {
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
          My Leaves
        </h3>

        <Button
          variant="ghost"
          className="
            text-xs
            h-auto
            p-0
            hover:bg-transparent
          "
          style={{
            color: themeColor,
          }}
        >
          Apply Leave +
        </Button>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: themeColor,
              }}
            />

            <span className="text-slate-600">
              Restricted Holiday
            </span>
          </div>

          <span className="font-medium">
            2
          </span>
        </div>

        <div
          className="
            mt-3
            h-[3px]
            bg-slate-200
            rounded-full
            overflow-hidden
          "
        >
          <div
            className="h-full w-[75%]"
            style={{
              backgroundColor: themeColor,
            }}
          />
        </div>
      </div>
    </div>
  );
}
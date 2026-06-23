import { Gift } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { useAppSelector } from "../../../../hooks/useAppSelector";

export default function BirthdayCard() {
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
          Birthdays
        </h3>

        <span className="text-xs text-slate-500">
          This Month
        </span>
      </div>

      {/* Birthday Employee */}

      <div className="mt-6 flex items-center gap-3">
        <div
          className="
            w-12
            h-12
            rounded-full
            flex
            items-center
            justify-center
            text-white
            font-semibold
          "
          style={{
            backgroundColor: themeColor,
          }}
        >
          SA
        </div>

        <div>
          <p className="font-medium text-slate-800">
            Sathwika Achugatla
          </p>

          <p className="text-xs text-slate-500">
            24 June
          </p>
        </div>
      </div>

      {/* Birthday Message */}

      <div
        className="
          mt-5
          rounded-xl
          p-3
          text-sm
        "
        style={{
          backgroundColor: `${themeColor}25`,
          color: themeColor,
        }}
      >
        🎉 Wish your colleague a happy birthday and make their day special.
      </div>

      {/* Button */}

      <Button
        className="
          w-full
          mt-5
          text-white
        "
        style={{
          backgroundColor: themeColor,
        }}
      >
        <Gift size={16} />
        <span className="ml-2">
          Send Wishes
        </span>
      </Button>
    </div>
  );
}
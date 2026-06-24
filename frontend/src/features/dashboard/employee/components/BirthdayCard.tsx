import birthdayImage from "../../../../assets/birthday.png";
import { useAppSelector } from "../../../../hooks/useAppSelector";

export default function BirthdayCard() {
  const themeColor = useAppSelector(
    (state) => state.theme.primaryColor
  );

  return (
    <div
      className="
        bg-white
        rounded-3xl
        p-6
        shadow-sm
        border
        border-slate-100
        h-full
      "
    >
      {/* Header */}

      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-medium text-slate-800">
          Birthdays
        </h3>

        <button
          className="text-sm font-medium"
          style={{
            color: themeColor,
          }}
        >
          View All
        </button>
      </div>

      <div
        className="h-[2px] mt-4"
        style={{
          backgroundColor: `${themeColor}70`,
        }}
      />

      {/* Content */}

      <div className="flex flex-col items-center pt-8">
        <h4
          className="
            text-[18px]
            font-medium
            text-slate-700
            text-center
          "
        >
          User Lorem Ipsum Birthday
        </h4>

        <p
          className="
            text-slate-600
            text-lg
            mt-12
          "
        >
          ● 23 June Birthday
        </p>

        <button
          className="
            mt-8
            w-[220px]
            h-11
            rounded-lg
            text-white
            font-medium
          "
          style={{
            background: `linear-gradient(
              90deg,
              ${themeColor},
              #00C2FF
            )`,
          }}
        >
          Wish
        </button>

        <div className="mt-10 flex justify-center">
          <img
            src={birthdayImage}
            alt="Birthday"
            className="
              w-[260px]
              object-contain
            "
          />
        </div>
      </div>
    </div>
  );
}
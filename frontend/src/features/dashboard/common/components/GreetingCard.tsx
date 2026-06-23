import {
  Briefcase,
  Building2,
  IdCard,
} from "lucide-react";

import { useAppSelector } from "../../../../hooks/useAppSelector";

export default function GreetingCard() {
  const themeColor = useAppSelector(
    (state) => state.theme.primaryColor
  );

  const currentDate = new Date();

  const hour = currentDate.getHours();

  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 17
      ? "Good Afternoon"
      : "Good Evening";

  const formattedDate =
    currentDate.toLocaleDateString(
      "en-IN",
      {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );

  return (
    <div
      className="
        rounded-3xl
        p-8
        min-h-[180px]
        relative
        overflow-hidden
      "
      style={{
        background: `linear-gradient(
          90deg,
          ${themeColor}20,
          ${themeColor}10
        )`,
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="
            w-14
            h-14
            rounded-xl
            bg-white
            shadow
            flex
            items-center
            justify-center
          "
        >
          {hour < 12
            ? "🌤️"
            : hour < 17
            ? "☀️"
            : "🌙"}
        </div>

        <div>
          <p
            className="text-sm"
            style={{
              color: themeColor,
            }}
          >
            {greeting}, Have a productive day!
          </p>

          <h2 className="text-3xl font-semibold mt-2">
            Hi Sathwika Achugatla
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            {formattedDate}
          </p>

          <div className="space-y-3 mt-5">
            <div className="flex items-center gap-3">
              <IdCard
                size={16}
                style={{
                  color: themeColor,
                }}
              />

              <span>
                Employee ID : EMP001
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Briefcase
                size={16}
                style={{
                  color: themeColor,
                }}
              />

              <span>
                Designation :
                Software Engineer
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Building2
                size={16}
                style={{
                  color: themeColor,
                }}
              />

              <span>
                Department :
                Development
              </span>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}
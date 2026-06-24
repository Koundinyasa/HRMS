import {
  Briefcase,
  Building2,
  IdCard,
} from "lucide-react";

import { useAppSelector } from "../../../../hooks/useAppSelector";
import { useGetProfileQuery } from "../../employee/api/employeeApi";

export default function GreetingCard() {
  const themeColor = useAppSelector(
    (state) => state.theme.primaryColor
  );

  const { data: profileData } =
    useGetProfileQuery();

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
        relative
        overflow-hidden
        rounded-3xl
        px-8
        py-6
        min-h-[130px]
      "
      style={{
        background: `linear-gradient(
          90deg,
          ${themeColor}15,
          #DFF8FF
        )`,
      }}
    >
      {/* Oval Shape */}

      <div
        className="
          absolute
          right-10
          top-1/2
          -translate-y-1/2
          w-44
          h-44
          rounded-full
        "
        style={{
          backgroundColor: `${themeColor}10`,
        }}
      />

      {/* Dotted Pattern */}

      <div
        className="
          absolute
          top-5
          right-6
          grid
          grid-cols-5
          gap-1
        "
      >
        {Array.from({ length: 25 }).map(
          (_, index) => (
            <div
              key={index}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor:
                  themeColor,
              }}
            />
          )
        )}
      </div>

      <div className="relative z-10 flex items-center">
        {/* LEFT SECTION */}

        <div className="flex items-center gap-5">
          <div
            className="
              w-14
              h-14
              bg-white
              rounded-2xl
              shadow-md
              flex
              items-center
              justify-center
              text-2xl
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
              className="
                text-sm
                font-medium
              "
              style={{
                color: themeColor,
              }}
            >
              {profileData?.data?.WelcomeMessage}
            </p>

            <h2
              className="
                text-[22px]
                font-semibold
                text-slate-900
                mt-2
              "
            >
              Hi {profileData?.data?.FullName}
            </h2>

            <p
              className="
                text-sm
                text-slate-500
                mt-2
              "
            >
              {formattedDate}
            </p>
          </div>
        </div>

        {/* EMPLOYEE DETAILS */}

        <div className="flex flex-col gap-4 ml-40">
          <div className="flex items-center gap-3">
            <div
              className="
                w-7
                h-7
                rounded-md
                flex
                items-center
                justify-center
              "
              style={{
                backgroundColor:
                  `${themeColor}15`,
              }}
            >
              <IdCard
                size={14}
                color={themeColor}
              />
            </div>

            <span className="text-sm text-slate-700">
              Employee ID : {profileData?.data?.EmployeeID}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="
                w-7
                h-7
                rounded-md
                flex
                items-center
                justify-center
              "
              style={{
                backgroundColor:
                  `${themeColor}15`,
              }}
            >
              <Briefcase
                size={14}
                color={themeColor}
              />
            </div>

            <span className="text-sm text-slate-700">
              Designation :
              {profileData?.data?.Designation}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="
                w-7
                h-7
                rounded-md
                flex
                items-center
                justify-center
              "
              style={{
                backgroundColor:
                  `${themeColor}15`,
              }}
            >
              <Building2
                size={14}
                color={themeColor}
              />
            </div>

            <span className="text-sm text-slate-700">
              Department :
              {profileData?.data?.Department}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
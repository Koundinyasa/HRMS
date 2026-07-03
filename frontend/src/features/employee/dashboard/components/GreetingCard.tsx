import {
  Briefcase,
  Building2,
  IdCard,
} from "lucide-react";

import { useDashboard } from "../hooks/useDashboard";

export default function GreetingCard() {
  const { profileData } = useDashboard();

  const profile = profileData?.data;

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
        background:
          "linear-gradient(90deg,var(--primary-light),#DFF8FF)",
      }}
    >
      {/* Large Background Circle */}

      <div
        className="
          absolute
          top-1/2
          right-6
          animate-circle1
        "
      >
        <div
          className="w-48 h-48 rounded-full"
          style={{
            backgroundColor:
              "var(--primary-light)",
          }}
        />
      </div>

      {/* Medium Background Circle */}

      <div
        className="
          absolute
          top-20
          right-32
          animate-circle2
        "
      >
        <div
          className="w-24 h-24 rounded-full opacity-70"
          style={{
            backgroundColor:
              "var(--primary-light)",
          }}
        />
      </div>

      {/* Small Background Circle */}

      <div
        className="
          absolute
          bottom-8
          right-52
          animate-circle3
        "
      >
        <div
          className="w-16 h-16 rounded-full opacity-90"
          style={{
            backgroundColor:
              "var(--primary-light)",
          }}
        />
      </div>

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
        {Array.from({
          length: 25,
        }).map((_, index) => (
          <div
            key={index}
            className="
              w-1.5
              h-1.5
              rounded-full
            "
            style={{
              backgroundColor:
                "var(--primary-color)",
            }}
          />
        ))}
      </div>

      <div
        className="
          relative
          z-10
          flex
          items-center
        "
      >


        <div
          className="
            flex
            items-center
            gap-5
          "
        >
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
                color: "var(--primary-color)",
              }}
            >
              {greeting},{" "}
              Have a productive day.
            </p>

            <h2
              className="
                text-[22px]
                font-semibold
                text-slate-900
                mt-2
              "
            >
              Hi {profile?.FullName}
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

        {/* Employee Details */}

        <div
          className="
            flex
            flex-col
            gap-4
            ml-40
          "
        >
          {/* Employee ID */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >
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
                  "var(--primary-light)",
              }}
            >
              <IdCard
                size={14}
                color="var(--primary-color)"
              />
            </div>

            <span
              className="
                text-sm
                text-slate-700
              "
            >
              Employee ID : {profile?.Code}
            </span>
          </div>

          {/* Designation */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >
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
                  "var(--primary-light)",
              }}
            >
              <Briefcase
                size={14}
                color="var(--primary-color)"
              />
            </div>

            <span
              className="
                text-sm
                text-slate-700
              "
            >
              Designation : {profile?.Designation}
            </span>
          </div>

          {/* Department */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >
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
                  "var(--primary-light)",
              }}
            >
              <Building2
                size={14}
                color="var(--primary-color)"
              />
            </div>

            <span
              className="
                text-sm
                text-slate-700
              "
            >
              Department : {profile?.Department}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Bubble Animations */}

      <div
        className="
          absolute
          top-8
          left-1/4
          w-6
          h-6
          rounded-full
          bg-white/20
          animate-bubble1
        "
      />

      <div
        className="
          absolute
          bottom-10
          left-1/2
          w-10
          h-10
          rounded-full
          bg-white/15
          animate-bubble2
        "
      />

      <div
        className="
          absolute
          top-12
          right-32
          w-5
          h-5
          rounded-full
          bg-white/20
          animate-bubble3
        "
      />

      <div
        className="
          absolute
          bottom-16
          right-20
          w-8
          h-8
          rounded-full
          bg-white/10
          animate-bubble1
        "
      />

      <div
        className="
          absolute
          top-24
          left-3/4
          w-4
          h-4
          rounded-full
          bg-white/25
          animate-bubble2
        "
      />
    </div>
  );
}
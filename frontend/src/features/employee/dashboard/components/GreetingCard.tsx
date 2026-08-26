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
  w-full
  min-w-0
  overflow-hidden
  rounded-3xl
  px-4 sm:px-6 lg:px-8
  py-5 sm:py-6
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
    right-[-40px] sm:right-2 lg:right-6
    animate-circle1
    pointer-events-none
  "
      >
        <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full"
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
          top-16 sm:top-20
          right-8 sm:right-20 lg:right-32
          animate-circle2
          pointer-events-none
        "
      >
        <div
          className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full opacity-70"
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
          bottom-6 sm:bottom-8
          right-12 sm:right-28 lg:right-52
          animate-circle3
        "
      >
        <div
          className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full opacity-90"
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
          top-4 sm:top-5
          right-3 sm:right-6 lg:right-6
          pointer-events-none
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
flex-col
lg:flex-row
lg:items-center
gap-4 sm:gap-5 lg:gap-10
min-w-0
  "
      >
 
 
        <div
          className="
    flex
items-center
gap-3 sm:gap-5
min-w-0
w-full
lg:w-auto
  "
        >
          <div
            className="
             w-12 h-12 sm:w-14 sm:h-14
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
 
         <div className="min-w-0">
            <p
              className="
                text-xs sm:text-sm
                font-medium
                pr-8 sm:pr-10 lg:pr-0  "
              style={{
                color: "var(--primary-color)",
              }}
            >
              {greeting},{" "}
              Have a productive day.
            </p>
 
           <h2
  className="
    text-lg sm:text-[22px]
    font-semibold
    text-slate-900
    mt-1 sm:mt-2
    break-words
    leading-tight
  "
>
              Hi {profile?.profile.FullName}
            </h2>
 
            <p
              className="
                text-xs sm:text-sm
text-slate-500
mt-1 sm:mt-2
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
    gap-3 sm:gap-4
    ml-0
    lg:ml-10
    xl:ml-16
    min-w-0
    w-full
    lg:w-auto
  "
>
          {/* Employee ID */}
 
          <div
            className="
              flex
              items-center
              gap-3
              min-w-0
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
    text-xs sm:text-sm
    text-slate-700
    break-words
    min-w-0
  "
>
              Employee ID : {profile?.profile.EmployeeID}
            </span>
          </div>
 
          {/* Designation */}
 
          <div
            className="
              flex
              items-center
              gap-3
              min-w-0
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
    text-xs sm:text-sm
    text-slate-700
    break-words
    min-w-0
  "
>
              Designation : {profile?.profile.Designation}
            </span>
          </div>
 
          {/* Department */}
 
          <div
            className="
              flex
              items-center
              gap-3
              min-w-0
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
    text-xs sm:text-sm
    text-slate-700
    break-words
    min-w-0
  "
>
              Department : {profile?.profile.Department}
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
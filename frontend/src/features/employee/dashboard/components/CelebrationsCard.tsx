import { useEffect, useMemo, useState } from "react";
import birthdayImage from "../../../../assets/images/birthday.png";
import anniversaryImage from "../../../../assets/images/anniversary.png";
import { CalendarDays, Cake, Award, Clock3, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboard } from "../hooks/useDashboard";
export default function CelebrationsCard() {
  const { profileData } = useDashboard();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openWishModal, setOpenWishModal] = useState(false);
  const [openAllCelebrations, setOpenAllCelebrations,] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const celebrations = profileData?.data?.upcomingEvents ?? [];
  const celebration = celebrations[currentIndex];
 
  // Auto Change Celebration
 
  useEffect(() => {
    if (celebrations.length <= 1) return;
 
    const interval = setInterval(() => {
      setCurrentIndex(
        (prev) =>
          (prev + 1) %
          celebrations.length
      );
    }, 3000);
 
    return () =>
      clearInterval(interval);
  }, [celebrations]);
 
  // Days Remaining
 
  const getDaysRemaining = (
    date: string
  ) => {
    const today = new Date();
 
    today.setHours(0, 0, 0, 0);
 
    const eventDate = new Date(date);
 
    eventDate.setHours(0, 0, 0, 0);
 
    const diff = Math.ceil(
      (eventDate.getTime() -
        today.getTime()) /
      (1000 * 60 * 60 * 24)
    );
 
    if (diff === 0)
      return "Today";
 
    if (diff === 1)
      return "Tomorrow";
 
    if (diff > 1)
      return `In ${diff} Days`;
 
    return "Completed";
  };
 
  // Greeting
 
  const greeting = useMemo(() => {
    if (
      celebration?.EventName ===
      "Birthday"
    ) {
      return "Let's celebrate their special day! 🎉";
    }
 
    return "Congratulations on another successful milestone! 👏";
  }, [celebration]);
 
  // Default Wish Message
 
  const defaultWish = useMemo(() => {
    if (
      selectedEvent?.EventName ===
      "Birthday"
    ) {
      return "Wishing you a wonderful birthday filled with happiness, success and good health. Have an amazing year ahead!";
    }
 
    return "Congratulations on your Work Anniversary! Thank you for your dedication and commitment. Wishing you continued success and many more milestones ahead!";
  }, [selectedEvent]);
 
  return (
    <div
     className="rounded-2xl border shadow-sm h-full flex flex-col p-4 sm:p-5 min-w-0 overflow-hidden"
      style={{
        backgroundColor:
          "var(--card-bg)",
        borderColor:
          "var(--primary-border)",
      }}
    >
      {/* Header */}
 
      <div className="flex items-start sm:items-center justify-between gap-3 min-w-0">
 
        <div>
 
          <h3
            className="text-lg font-semibold"
            style={{
              color:
                "var(--primary-color)",
            }}
          >
            Celebrations
          </h3>
 
          <p className="text-xs text-slate-500 mt-1">
            Birthdays & Work Anniversaries
          </p>
 
        </div>
 
        <Button
          variant="ghost"
          onClick={() =>
            setOpenAllCelebrations(true)
          }
          className="font-medium text-xs sm:text-sm px-2 sm:px-3 shrink-0"
          style={{
            color:
              "var(--primary-color)",
          }}
        >
          View All
        </Button>
 
      </div>
 
      {/* Divider */}
 
      <div
        className="-mx-5 h-[2px] mt-3"
        style={{
          backgroundColor: "var(--primary-border)",
        }}
      />
 
      {/* Counter */}
 
      <div className="flex justify-end mt-5">
 
        <div
          className=" px-3 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor:
              "var(--primary-light)",
            color:
              "var(--primary-color)",
          }}
        >
          {celebrations.length} Upcoming
        </div>
 
      </div>
      {/* Celebration Content */}
 
      <div
        key={currentIndex}
        className="flex flex-col items-center justify-center flex-1 text-center animate-in fade-in duration-500">
        {/* Celebration Image */}
 
        <img
          src={
            celebration?.EventName === "Birthday"
              ? birthdayImage
              : anniversaryImage
          }
          alt={celebration?.EventName}
          className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 max-w-full object-contain mt-2 transition-all duration-500"
        />
 
        {/* Event Badge */}
 
        <div
          className=" flex items-center gap-2 rounded-full px-4 py-1 mt-3"
          style={{
            backgroundColor:
              celebration?.EventName === "Birthday"
                ? "#FEF3C7"
                : "#DBEAFE",
          }}
        >
          {celebration?.EventName === "Birthday" ? (
            <Cake
              size={16}
              color="#D97706"
            />
          ) : (
            <Award
              size={16}
              color="#2563EB"
            />
          )}
 
          <span className="text-sm font-medium">
            {celebration?.EventName}
          </span>
        </div>
 
        {/* Employee Name */}
 
        <h2 className="text-lg sm:text-xl font-semibold mt-4 sm:mt-5 text-slate-800 break-words max-w-full px-2">
          {celebration?.FullName ??
            "No Upcoming Celebrations"}
        </h2>
 
        {/* Greeting */}
 
        <p className="text-xs sm:text-sm text-slate-500 mt-3 px-2 sm:px-6 leading-5 sm:leading-6 max-w-full">
          {celebration
            ? greeting
            : "No upcoming birthdays or work anniversaries."}
        </p>
 
        {/* Event Date */}
 
        {celebration && (
          <div className=" flex items-center gap-2 mt-5 text-sm text-slate-600">
            <CalendarDays size={16} />
 
            {new Date(
              celebration.EventDate
            ).toLocaleDateString(
              "en-IN",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </div>
        )}
 
        {/* Countdown */}
 
        {celebration && (
          <div className=" flex items-center gap-2 mt-2 text-xs font-medium text-orange-500">
            <Clock3 size={14} />
 
            {getDaysRemaining(
              celebration.EventDate
            )}
          </div>
        )}
 
        {/* Wish Button */}
 
        {celebration && (
          <Button
            type="button"
            onClick={() => {
              setSelectedEvent(
                celebration
              );
 
              setOpenWishModal(true);
            }}
            className=" mt-8 w-full h-11 text-white rounded-xl"
            style={{
              background:
                "var(--primary-gradient)",
            }}
          >
            {celebration.EventName ===
              "Birthday"
              ? "Send Birthday Wishes"
              : "Send Congratulations"}
          </Button>
        )}
      </div>
 
      {/* Wish Dialog */}
 
      {openWishModal &&
        selectedEvent && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="w-full max-w-[430px] max-h-[90vh] rounded-2xl bg-white shadow-2xl overflow-y-auto">
              {/* Header */}
 
              <div
                className="
                  px-6
                  py-4
                  border-b
                "
                style={{
                  borderColor:
                    "var(--primary-border)",
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
 
                  <div
                    className="
                      w-12
                      h-12
                      rounded-full
                      flex
                      items-center
                      justify-center
                    "
                    style={{
                      backgroundColor:
                        selectedEvent.EventName ===
                          "Birthday"
                          ? "#FEF3C7"
                          : "#DBEAFE",
                    }}
                  >
                    {selectedEvent.EventName ===
                      "Birthday" ? (
                      <Cake
                        size={24}
                        color="#D97706"
                      />
                    ) : (
                      <Award
                        size={24}
                        color="#2563EB"
                      />
                    )}
                  </div>
 
                  <div>
 
                    <h2
                      className="text-base sm:text-xl font-semibold break-words"
                      style={{
                        color:
                          "var(--primary-color)",
                      }}
                    >
                      {selectedEvent.EventName ===
                        "Birthday"
                        ? "Send Birthday Wishes"
                        : "Send Congratulations"}
                    </h2>
 
                    <p className="text-sm text-slate-500">
                      {selectedEvent.FullName}
                    </p>
 
                  </div>
 
                </div>
              </div>
 
              {/* Body */}
 
              <div className="p-5">
 
                <textarea
                  rows={5}
                  defaultValue={
                    defaultWish
                  }
                  className="
  w-full
  min-w-0
  rounded-xl
  border
  p-3 sm:p-4
  resize-none
  outline-none
"
                  style={{
                    borderColor:
                      "var(--primary-border)",
                  }}
                />
 
                <div className="mt-4 text-sm text-slate-500">
 
                  Event Date :
 
                  {" "}
 
                  {new Date(
                    selectedEvent.EventDate
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }
                  )}
 
                </div>
 
              </div>
              {/* Footer */}
 
              <div
                className="
  flex
  flex-col-reverse
  sm:flex-row
  sm:justify-end
  gap-2 sm:gap-3
  p-4 sm:p-5
  border-t
"
                style={{
                  borderColor:
                    "var(--primary-border)",
                }}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setOpenWishModal(false)
                  }
                  className="w-full sm:w-auto"
                >
                  Close
                </Button>
 
                <Button
                  type="button"
                  onClick={() => {
                    alert(
                      `${selectedEvent.EventName ===
                        "Birthday"
                        ? "Birthday Wishes"
                        : "Congratulations"
                      } sent successfully!`
                    );
 
                    setOpenWishModal(false);
                  }}
                  style={{
                    background:
                      "var(--primary-gradient)",
                  }}
                  className="text-white w-full sm:w-auto"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}
 
      {/* ============================= */}
      {/* View All Celebrations Dialog */}
      {/* ============================= */}
 
      {openAllCelebrations && (
        <div
          className="
  fixed
  inset-0
  bg-black/40
  flex
  items-center
  justify-center
  z-50
  p-3 sm:p-4
  overflow-y-auto
"
        >
          <div
           className="
  w-[calc(100%-2rem)]
  sm:w-full
  max-w-[650px]
  max-h-[90vh]
  bg-white
  rounded-2xl
  shadow-2xl
  overflow-hidden
"
          >
            {/* Header */}
 
            <div
              className="
  flex
  items-center
  justify-between
  gap-3
  px-4 sm:px-6
  py-4
  border-b
"
              style={{
                borderColor:
                  "var(--primary-border)",
              }}
            >
              <div>
                <h2
                  className="text-lg sm:text-2xl font-semibold"
                  style={{
                    color:
                      "var(--primary-color)",
                  }}
                >
                  All Celebrations
                </h2>
 
                <p className="text-sm text-slate-500">
                  Birthdays & Work Anniversaries
                </p>
              </div>
 
              <div
                className="
  px-3 sm:px-4
  py-1.5 sm:py-2
  rounded-full
  text-xs sm:text-sm
  font-medium
  shrink-0
"
                style={{
                  backgroundColor:
                    "var(--primary-light)",
                  color:
                    "var(--primary-color)",
                }}
              >
                {celebrations.length} Events
              </div>
            </div>
 
            {/* Body */}
 
           <div className="max-h-[60vh] overflow-y-auto">
 
              {celebrations.length > 0 ? (
 
                celebrations.map(
                  (
                    item,
                    index
                  ) => (
 
                    <div
                      key={index}
                      className="
  flex
  flex-col
  sm:flex-row
  sm:items-center
  sm:justify-between
  gap-4
  px-4 sm:px-6
  py-4 sm:py-5
  border-b
  hover:bg-slate-50
  transition
"
                      style={{
                        borderColor:
                          "var(--primary-border)",
                      }}
                    >
 
                      {/* Left */}
 
                     
 
                        <div
                          className="
                           w-11 h-11 sm:w-14 sm:h-14
rounded-full
shrink-0
                            flex
                            items-center
                            justify-center
                          "
                          style={{
                            backgroundColor:
                              item.EventName ===
                                "Birthday"
                                ? "#FEF3C7"
                                : "#DBEAFE",
                          }}
                        >
                          {item.EventName ===
                            "Birthday" ? (
                            <Cake
                              size={28}
                              color="#D97706"
                            />
                          ) : (
                            <Award
                              size={22}
className="sm:w-7 sm:h-7"
                              color="#2563EB"
                            />
                          )}
                        </div>
 
                        <div className="min-w-0">
 
                          <h3 className="font-semibold text-slate-800 break-words">
                            {item.FullName}
                          </h3>
 
                          <div className="flex flex-wrap items-center gap-2 mt-2">
 
                            <span
                              className="
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-medium
                              "
                              style={{
                                backgroundColor:
                                  item.EventName ===
                                    "Birthday"
                                    ? "#FEF3C7"
                                    : "#DBEAFE",
                              }}
                            >
                              {item.EventName}
                            </span>
 
                            <span className="text-sm text-slate-500">
                              {new Date(
                                item.EventDate
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </span>
 
                          </div>
 
                          <p className="text-xs text-orange-500 mt-2">
                            {getDaysRemaining(
                              item.EventDate
                            )}
                          </p>
 
                       
 
                      </div>
 
                      {/* Right */}
 
                      <Button
  onClick={() => {
    setSelectedEvent(item);
    setOpenAllCelebrations(false);
    setOpenWishModal(true);
  }}
  style={{
    background:
      "var(--primary-gradient)",
  }}
  className="w-full sm:w-auto shrink-0 text-white"
>
  {item.EventName === "Birthday"
    ? "Wish"
    : "Congratulate"}
</Button>
 
                    </div>
 
                  )
                )
 
              ) : (
                <div
                  className="
                    py-20
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                  "
                >
                  <CalendarDays
                    size={60}
                    className="text-slate-300"
                  />
 
                  <h3 className="mt-5 text-xl font-semibold text-slate-700">
                    No Celebrations
                  </h3>
 
                  <p className="mt-2 text-slate-500">
                    There are no upcoming birthdays or
                    work anniversaries.
                  </p>
                </div>
              )}
 
            </div>
 
            {/* Footer */}
 
            <div
              className="
  flex
  justify-end
  p-4 sm:p-5
  border-t
"
              style={{
                borderColor:
                  "var(--primary-border)",
              }}
            >
              <Button
                variant="outline"
                onClick={() =>
                  setOpenAllCelebrations(false)
                }
                className="w-full sm:w-auto"
              >
                Close
              </Button>
            </div>
 
          </div>
        </div>
      )}
 
    </div>
  );
}
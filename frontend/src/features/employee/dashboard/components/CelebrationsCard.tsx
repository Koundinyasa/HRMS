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
      className="rounded-2xl border shadow-sm h-full flex flex-col p-5"
      style={{
        backgroundColor:
          "var(--card-bg)",
        borderColor:
          "var(--primary-border)",
      }}
    >
      {/* Header */}
 
      <div className="flex items-center justify-between">
 
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
          className="font-medium"
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
          className=" w-40 h-40 object-contain mt-2 transition-all duration-500"
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
 
        <h2 className=" text-xl font-semibold mt-5 text-slate-800">
          {celebration?.FullName ??
            "No Upcoming Celebrations"}
        </h2>
 
        {/* Greeting */}
 
        <p className=" text-sm text-slate-500 mt-3 px-6 leading-6">
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
          <div className=" fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className=" w-[430px] rounded-2xl bg-white shadow-2xl overflow-hidden">
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
                <div className="flex items-center gap-3">
 
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
                      className="text-xl font-semibold"
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
                    rounded-xl
                    border
                    p-4
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
                  justify-end
                  gap-3
                  p-5
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
                  className="text-white"
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
          "
        >
          <div
            className="
              w-[650px]
              max-h-[650px]
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
                px-6
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
                  className="text-2xl font-semibold"
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
                  px-4
                  py-2
                  rounded-full
                  text-sm
                  font-medium
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
 
            <div className="max-h-[470px] overflow-y-auto">
 
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
                        items-center
                        justify-between
                        px-6
                        py-5
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
 
                      <div className="flex items-center gap-4">
 
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
                              size={28}
                              color="#2563EB"
                            />
                          )}
                        </div>
 
                        <div>
 
                          <h3 className="font-semibold text-slate-800">
                            {item.FullName}
                          </h3>
 
                          <div className="flex gap-2 mt-2">
 
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
 
                      </div>
 
                      {/* Right */}
 
                      <Button
                        onClick={() => {
                          setSelectedEvent(
                            item
                          );
 
                          setOpenAllCelebrations(
                            false
                          );
 
                          setOpenWishModal(
                            true
                          );
                        }}
                        style={{
                          background:
                            "var(--primary-gradient)",
                        }}
                        className="text-white"
                      >
                        {item.EventName ===
                          "Birthday"
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
                p-5
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
 
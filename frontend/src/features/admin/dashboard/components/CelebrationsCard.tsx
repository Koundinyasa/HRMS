import { useEffect, useState } from "react";
import type { UpcomingEvent } from "../types/dashboard.types";
import birthdayImage from "@/assets/images/birthday.png"; // ⚠️ adjust path to your actual asset location

interface CelebrationsCardProps {
  events: UpcomingEvent[];
}

const BRAND_PURPLE = "#7C5CFC";

function formatEventDate(dateStr: string, withYear = false) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    ...(withYear ? { year: "numeric" } : {}),
  });
}

export default function CelebrationsCard({ events }: CelebrationsCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openWishModal, setOpenWishModal] = useState(false);
  const [openAllModal, setOpenAllModal] = useState(false);
  const [selected, setSelected] = useState<UpcomingEvent | null>(null);

  const celebration = events[currentIndex];

  useEffect(() => {
    if (events.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [events]);

  // Keep index in range if the events array shrinks (e.g. refetch)
  useEffect(() => {
    if (currentIndex >= events.length) setCurrentIndex(0);
  }, [events, currentIndex]);

  return (
    <>
      {/* Celebration Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-red-300 pb-3 mb-3">
          <h3 className="text-base font-semibold text-slate-800">Birthdays</h3>
          <button
            type="button"
            onClick={() => setOpenAllModal(true)}
            className="text-xs font-medium text-blue-600 border border-slate-200 rounded-md px-2.5 py-1 hover:bg-slate-50"
          >
            View All
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center pt-2">
          <h4 className="text-sm font-medium text-slate-700 text-center">
            {celebration ? `${celebration.fullName} ${celebration.eventName}` : "No Celebrations"}
          </h4>

          <p className="text-slate-500 text-xs mt-2 flex items-center gap-1.5">
            {celebration ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                {formatEventDate(celebration.eventDate)} {celebration.eventName}
              </>
            ) : (
              "No upcoming celebrations"
            )}
          </p>

          {/* Wish Button */}
          <button
            type="button"
            disabled={!celebration}
            onClick={() => {
              setSelected(celebration);
              setOpenWishModal(true);
            }}
            className="mt-3 px-8 py-1.5 rounded-full text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: BRAND_PURPLE }}
          >
            Wish
          </button>

          {/* Image */}
          <div className="mt-3 flex justify-center">
            <img src={birthdayImage} alt="Celebration" className="w-28 object-contain" />
          </div>
        </div>
      </div>
      {/* Wish Modal */}
      {openWishModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-[390px] bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100">
              <h2 className="text-xl font-semibold" style={{ color: BRAND_PURPLE }}>
                Send Wishes
              </h2>
            </div>

            <div className="p-4">
              <h3 className="text-base font-medium mb-3 text-slate-800">
                Dear {selected?.fullName}
              </h3>
              <textarea
                rows={4}
                defaultValue={
                  selected?.eventName === "Birthday"
                    ? "Wishing you a wonderful birthday filled with happiness and success!"
                    : "Congratulations on your work anniversary! Wishing you continued success and many more milestones ahead."
                }
                className="w-full rounded-lg border border-slate-200 p-3 resize-none outline-none text-sm text-slate-700"
              />
            </div>

            <div className="flex justify-center gap-3 p-4 border-t border-slate-100">
              <button
                type="button"
                className="px-6 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
                style={{ background: BRAND_PURPLE }}
              >
                Send
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpenWishModal(false);
                  setSelected(null);
                }}
                className="px-6 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View All Modal */}
      {openAllModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-[500px] max-h-[520px] bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: BRAND_PURPLE }}>
                All Celebrations
              </h2>
              <button
                type="button"
                onClick={() => setOpenAllModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl leading-none"
              >
                ✕
              </button>
            </div>
            <div className="max-h-[380px] overflow-y-auto">
              {events.length > 0 ? (
                events.map((item, index) => (
  <div
    key={`${item.code}-${index}`}
    className="items-center gap-3 px-5 py-4 border-b border-slate-50"
    style={{
      display: "grid",
      gridTemplateColumns: "40px minmax(0, 1fr) 96px",
    }}
  >
    {/* Fixed-size icon wrapper — same for every row */}
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-50"
      style={{ gridColumn: 1, gridRow: 1 }}
    >
      {item.eventName === "Birthday" ? (
        <span className="text-lg">🎂</span>
      ) : (
        <span className="text-lg">🏅</span>
      )}
    </div>

    {/* Text always starts right after the fixed-width icon */}
    <div
      className="min-w-0 w-full text-left"
      style={{ gridColumn: 2, gridRow: 1 }}
    >
      <h4 className="font-medium text-slate-800 text-sm">{item.fullName}</h4>
      <p className="text-xs text-slate-500 mt-0.5">{item.eventName}</p>
      <p className="text-xs text-slate-400 mt-0.5">
        {formatEventDate(item.eventDate, true)}
      </p>
    </div>

    <button
      type="button"
      onClick={() => {
        setSelected(item);
        setOpenAllModal(false);
        setOpenWishModal(true);
      }}
      className="px-4 py-2 rounded-lg text-white text-xs font-medium hover:opacity-90"
      style={{
        background: BRAND_PURPLE,
        gridColumn: 3,
        gridRow: 1,
      }}
    >
      Wish
    </button>
  </div>
))
              ) : (
                <div className="py-12 text-center text-slate-400 text-sm">
                  No celebrations available
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 p-4 flex justify-end">
              <button
                type="button"
                onClick={() => setOpenAllModal(false)}
                className="px-6 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
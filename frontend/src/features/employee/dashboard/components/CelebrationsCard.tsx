import birthdayImage from "../../../../assets/images/birthday.png";
import { useEffect, useState } from "react";
 
import { useDashboard } from "../hooks/useDashboard";
 
export default function CelebrationsCard() {
  const { profileData } = useDashboard();
 
  const [currentBirthdayIndex, setCurrentBirthdayIndex] =
    useState(0);
 
  const [openWishModal, setOpenWishModal] =
    useState(false);
 
  const [openAllBirthdays, setOpenAllBirthdays] =
    useState(false);
 
  const [selectedBirthday, setSelectedBirthday] =
    useState<any>(null);
 
  const celebrations =
    profileData?.data.upcomingEvents ?? [];
 
  const celebration =
    celebrations[currentBirthdayIndex];
 
  useEffect(() => {
    if (celebrations.length <= 1) return;
 
    const interval = setInterval(() => {
      setCurrentBirthdayIndex(
        (prev) =>
          (prev + 1) % celebrations.length
      );
    }, 3000);
 
    return () => clearInterval(interval);
  }, [celebrations]);
 
  return (
    <>
      {/* Celebration Card */}
 
      <div
        className="
          rounded-2xl
          p-5
          shadow-sm
          border
          h-full
        "
        style={{
          backgroundColor: "var(--card-bg)",
          borderColor: "var(--primary-border)",
        }}
      >
        {/* Header */}
 
        <div className="flex items-center justify-between">
          <h3
            className="text-lg font-medium"
            style={{
              color: "var(--primary-color)",
            }}
          >
            Celebrations
          </h3>
 
          <button
            type="button"
            onClick={() =>
              setOpenAllBirthdays(true)
            }
            className="text-sm font-medium"
            style={{
              color: "var(--primary-color)",
            }}
          >
            View All
          </button>
        </div>
 
        {/* Divider */}
 
        <div
          className="h-[2px] mt-3"
          style={{
            backgroundColor:
              "var(--primary-border)",
          }}
        />
 
        {/* Content */}
 
        <div className="flex flex-col items-center pt-8">
          <h4
            className="
              text-base
              font-medium
              text-slate-700
              text-center
            "
          >
            {celebration?.FullName ??
              "No Celebrations"}
          </h4>
 
          <p
            className="
              text-slate-600
              text-sm
              mt-10
            "
          >
            {celebration
              ? `${celebration.EventName === "Birthday"
                ? "🎂"
                : "🎉"
              } ${new Date(
                celebration.EventDate
              ).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
              })} • ${celebration.EventName}`
              : "No Celebrations"}
          </p>
 
          {/* Wish Button */}
 
          <button
            type="button"
            onClick={() => {
              setSelectedBirthday(
                celebration
              );
 
              setOpenWishModal(true);
            }}
            className="
              mt-6
              w-full
              h-10
              rounded-lg
              text-white
              font-medium
              transition
            "
            style={{
              background:
                "var(--primary-gradient)",
            }}
          >
            Wish
          </button>
 
          {/* Image */}
 
          <div className="mt-8 flex justify-center">
            <img
              src={birthdayImage}
              alt="Birthday"
              className="
                w-52
                object-contain
              "
            />
          </div>
        </div>
      </div>
 
      {/* Send Wishes Modal */}
 
      {openWishModal && (
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
              w-[390px]
              bg-white
              rounded-xl
              shadow-xl
              overflow-hidden
            "
          >
            {/* Header */}
 
            <div
              className="px-5 py-3 border-b"
              style={{
                borderColor: "var(--primary-border)",
              }}
            >
              <h2
                className="text-2xl font-semibold"
                style={{
                  color: "var(--primary-color)",
                }}
              >
                Send Wishes
              </h2>
            </div>
 
            {/* Body */}
 
            <div className="p-4">
              <h3 className="text-lg font-medium mb-3">
                Dear {selectedBirthday?.FullName}
              </h3>
 
              <textarea
                rows={4}
                defaultValue={
                  selectedBirthday?.EventName === "Birthday"
                    ? "Wishing you a wonderful birthday filled with happiness and success!"
                    : "Congratulations on your work anniversary! Wishing you continued success and many more milestones ahead."
                }
                className="
                  w-full
                  rounded-lg
                  border
                  p-3
                  resize-none
                  outline-none
                "
                style={{
                  borderColor: "var(--primary-border)",
                }}
              />
            </div>
 
            {/* Footer */}
 
            <div
              className="
                flex
                justify-center
                gap-3
                p-4
                border-t
              "
              style={{
                borderColor: "var(--primary-border)",
              }}
            >
              <button
                type="button"
                className="
                  px-6
                  py-2
                  rounded-lg
                  text-white
                  font-medium
                "
                style={{
                  background: "var(--primary-gradient)",
                }}
              >
                Send
              </button>
 
              <button
                type="button"
                onClick={() => {
                  setOpenWishModal(false);
                  setSelectedBirthday(null);
                }}
                className="
                  px-6
                  py-2
                  rounded-lg
                  border
                  text-slate-600
                  font-medium
                "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
 
      {/* View All Birthdays Modal */}
 
      {openAllBirthdays && (
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
              w-[500px]
              max-h-[520px]
              bg-white
              rounded-xl
              shadow-xl
              overflow-hidden
            "
          >
            {/* Header */}
 
            <div
              className="px-5 py-3 border-b"
              style={{
                borderColor: "var(--primary-border)",
              }}
            >
              <div className="flex items-center justify-between">
                <h2
                  className="text-xl font-semibold"
                  style={{
                    color: "var(--primary-color)",
                  }}
                >
                  All Celebrations
                </h2>
 
                <button
                  type="button"
                  onClick={() =>
                    setOpenAllBirthdays(false)
                  }
                  className="text-slate-500 hover:text-slate-700 text-xl"
                >
                  ✕
                </button>
              </div>
            </div>
 
            {/* Birthday List */}
 
            <div className="max-h-[380px] overflow-y-auto">
 
              {celebrations.length > 0 ? (
                celebrations.map((item, index) => (
                  <div
                    key={index}
                    className="
                      flex
                      items-center
                      justify-between
                      px-5
                      py-4
                      border-b
                    "
                    style={{
                      borderColor:
                        "var(--primary-border)",
                    }}
                  >
                    <div>
                      <h4 className="font-medium text-slate-800">
                        {item.FullName}
                      </h4>
 
                      <p className="text-sm text-slate-500">
                        {item.EventName}
                      </p>
 
                      <p className="text-xs text-slate-400">
                        {new Date(item.EventDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
 
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBirthday(item);
                        setOpenAllBirthdays(false);
                        setOpenWishModal(true);
                      }}
                      className="
                        px-4
                        py-2
                        rounded-lg
                        text-white
                        text-sm
                        font-medium
                      "
                      style={{
                        background:
                          "var(--primary-gradient)",
                      }}
                    >
                      Wish
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center text-slate-500">
                  No Celebrations Available
                </div>
              )}
 
            </div>
 
            {/* Footer */}
 
            <div
              className="border-t p-4 flex justify-end"
              style={{
                borderColor: "var(--primary-border)",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  setOpenAllBirthdays(false)
                }
                className="
                  px-6
                  py-2
                  rounded-lg
                  border
                  font-medium
                "
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
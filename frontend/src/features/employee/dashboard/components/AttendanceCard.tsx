import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

import {
  OFFICE_START,
  OFFICE_END,
} from "../constants/dashboard.constants";

export default function AttendanceCard() {
  const [timeLeft, setTimeLeft] = useState("");
  const [officePercentage, setOfficePercentage] = useState(0);

  const [attendanceStatus, setAttendanceStatus] =
    useState<
      "upcoming" | "present" | "absent" | "completed"
    >("upcoming");

  const [punchedIn, setPunchedIn] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

      const start = new Date();
      start.setHours(OFFICE_START, 0, 0, 0);

      const end = new Date();
      end.setHours(OFFICE_END, 0, 0, 0);

      if (now < start) {
        setAttendanceStatus("upcoming");
        setOfficePercentage(0);

        const diff = end.getTime() - start.getTime();

        setTimeLeft(
          `${Math.floor(diff / (1000 * 60 * 60))}h 0m 0s`
        );

        return;
      }

      if (now >= end) {
        setAttendanceStatus("completed");
        setOfficePercentage(100);
        setTimeLeft("0h 0m 0s");

        return;
      }

      // Demo logic


      setAttendanceStatus(
        punchedIn ? "present" : "absent"
      );

      const total = end.getTime() - start.getTime();
      const remaining = end.getTime() - now.getTime();
      const completed = total - remaining;

      setOfficePercentage(
        Math.floor((completed / total) * 100)
      );

      const hrs = Math.floor(
        remaining / (1000 * 60 * 60)
      );

      const mins = Math.floor(
        (remaining % (1000 * 60 * 60)) /
        (1000 * 60)
      );

      const secs = Math.floor(
        (remaining % (1000 * 60)) / 1000
      );

      setTimeLeft(
        `${hrs}h ${mins}m ${secs}s`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [punchedIn]);

  const handlePunchIn = () => {
    setPunchedIn(true);
    setAttendanceStatus("present");
  };

  const handleCheckOut = () => {
    setAttendanceStatus("completed");
  };

  return (
    <div
      className="
    rounded-2xl
    p-5
    shadow-sm
    border
    h-full
    flex
    flex-col
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
          Today
        </h3>

        <span
          className={`
    px-4
    py-1
    rounded-full
    text-xs
    font-medium
    text-white
    ${attendanceStatus === "present"
              ? "bg-green-500"
              : attendanceStatus === "completed"
                ? "bg-green-600"
                : attendanceStatus === "upcoming"
                  ? "bg-gray-500"
                  : "bg-red-500"
            }
  `}
        >
          {attendanceStatus === "present"
            ? "Present"
            : attendanceStatus === "completed"
              ? "Completed"
              : attendanceStatus === "upcoming"
                ? "Upcoming"
                : "Absent"}
        </span>
      </div>

      {/* Divider */}

      <div
        className="h-[2px] mt-3"
        style={{
          backgroundColor: "var(--primary-border)",
        }}
      />

      {/* Content */}

      <div className="mt-7 flex items-center justify-between">
        <div className="max-w-[150px]">
          <p
            className="
    text-slate-700
    text-[15px]
    leading-8
  "
          >
            {
              attendanceStatus === "upcoming"
                ? "Office hours have not started yet."
                : attendanceStatus === "present"
                  ? "You are currently checked in."
                  : attendanceStatus === "completed"
                    ? "You have successfully completed today's work."
                    : "You haven't checked in today."
            }
          </p>
        </div>

        {/* Progress Circle */}

        <div className="relative">
          <div
            className="
              w-24
              h-24
              rounded-full
              flex
              items-center
              justify-center
            "
            style={{
              background:
                attendanceStatus === "absent"
                  ? "#E2E8F0"
                  : `conic-gradient(
        #fb923c ${officePercentage * 3.6}deg,
        #e2e8f0 ${officePercentage * 3.6}deg
      )`,
            }}
          >
            <div
              className="
    w-[76px]
    h-[76px]
    rounded-full
    flex
    flex-col
    items-center
    justify-center
  "
              style={{
                backgroundColor: "var(--card-bg)",
              }}
            >
              <h4 className="text-2xl font-bold text-slate-800">
                {attendanceStatus === "absent"
                  ? 0
                  : officePercentage}%
              </h4>

              <p className="text-xs text-slate-500">
                {
                  attendanceStatus === "upcoming"
                    ? "Upcoming"
                    : attendanceStatus === "absent"
                      ? "Absent"
                      : attendanceStatus === "completed"
                        ? "Completed"
                        : "In Office"
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        {/* Timer */}

        <div className="flex items-center justify-center gap-2 mb-6">
          <Clock
            size={14}
            className={
              attendanceStatus === "completed"
                ? "text-green-600"
                : "text-orange-500"
            }
          />

          <span
            className={
              attendanceStatus === "completed"
                ? "text-green-600"
                : "text-orange-500"
            }
          >
            Time left - {timeLeft}
          </span>
        </div>

        {/* Buttons */}

        <div className="space-y-3">
          <button
            onClick={handlePunchIn}
            disabled={
              attendanceStatus === "present" ||
              attendanceStatus === "completed"
            }
            className={`
      w-full
      h-10
      rounded-lg
      text-sm
      font-medium
      text-white
      transition
      ${attendanceStatus === "present" ||
                attendanceStatus === "completed"
                ? "bg-slate-300 cursor-not-allowed"
                : ""
              }
    `}
            style={
              attendanceStatus === "present" ||
                attendanceStatus === "completed"
                ? {}
                : {
                  background:
                    "var(--primary-gradient)",
                }
            }
          >
            {attendanceStatus === "present"
              ? "Punched In"
              : attendanceStatus === "completed"
                ? "Completed"
                : "Punch In"}
          </button>

          <button
            onClick={handleCheckOut}
            disabled={
              attendanceStatus !== "present"
            }
            className={`
      w-full
      h-10
      rounded-lg
      text-sm
      font-medium
      transition
      ${attendanceStatus === "present"
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-slate-300 text-white cursor-not-allowed"
              }
    `}
          >
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
}
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";

import {
  OFFICE_START,
  OFFICE_END,
} from "../constants/dashboard.constants";

export default function AttendanceCard() {
  const [timeLeft, setTimeLeft] = useState("");
  const [officePercentage, setOfficePercentage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();

      const start = new Date();
      start.setHours(OFFICE_START, 0, 0, 0);

      const end = new Date();
      end.setHours(OFFICE_END, 0, 0, 0);

      if (now < start) {
        const diff = end.getTime() - start.getTime();

        setTimeLeft(
          `${Math.floor(diff / (1000 * 60 * 60))}h 0m 0s`
        );

        setOfficePercentage(0);
        return;
      }

      if (now >= end) {
        setTimeLeft("0h 0m 0s");
        setOfficePercentage(100);
        return;
      }

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
  }, []);

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
          className="
            px-4
            py-1
            rounded-full
            text-xs
            font-medium
            bg-red-500
            text-white
          "
        >
          Absent
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
            You have not marked yourself as
            present today!
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
              background: `conic-gradient(
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
                {officePercentage}%
              </h4>

              <p className="text-xs text-slate-500">
                in office
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
            className="text-orange-500"
          />

          <span
            className="
              text-sm
              font-medium
              text-orange-500
            "
          >
            Time left - {timeLeft}
          </span>
        </div>

        {/* Buttons */}

        <div className="space-y-3">
          <button
            className="
              w-full
              h-10
              rounded-lg
              text-white
              text-sm
              font-medium
              transition
            "
            style={{
              background: "var(--primary-gradient)",
            }}
          >
            Punch In
          </button>

          <button
            className="
              w-full
              h-10
              rounded-lg
              bg-slate-300
              text-white
              text-sm
              font-medium
              cursor-not-allowed
            "
          >
            Check Out
          </button>
        </div>
      </div>
    </div>
  );
}
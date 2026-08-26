import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserCog } from "lucide-react";
 
import FacePunchModal from "./FacePunchModal";
import FaceEnrollmentModal from "./FaceEnrollmentModal";
import { useGetFaceStatusQuery } from "../api/attendanceApi";
import { useGetProfileQuery } from "../api/dashboardApi";
 
// Formats a total number of seconds as HH:MM:SS, matching the reference
// design's elapsed-timer style.
function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
 
// "31" -> "00:31", matching the reference design's "Early IN : 00:31" style.
function formatMinutesAsClock(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}`;
}
 
// ISO timestamp -> "6:02 PM", for displaying the actual check-in/out clock time.
function formatClockTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
 
export default function AttendanceCard() {
  // Just two states. No "upcoming"/"completed"/shift-time concept —
  // RawPunches doesn't care about shift windows, so neither do we here.
  // Starts as false only as a placeholder until the real value arrives
  // from the backend below — it does NOT mean "assumed punched out".
  const [punchedIn, setPunchedIn] = useState(false);
 
  // FIX — this is what makes punch state survive a refresh/login. Without
  // this fetch, punchedIn always started at false on every mount, which is
  // why logging out and back in mid-shift incorrectly showed "Punch In"
  // again even though RawPunches still had an open IN for today.
  const { data: faceStatus } = useGetFaceStatusQuery();
 
  useEffect(() => {
    if (faceStatus) {
      setPunchedIn(faceStatus.punchedIn);
    }
  }, [faceStatus]);
 
  // CHANGED — live elapsed timer + early/late IN-OUT now reads from the
  // dashboard's shared profile query instead of our own attendance
  // endpoint. The DB team merged this same data directly into
  // USP_GetUserInfo, so fetching it separately would just be duplicating
  // a query that's already made elsewhere on this same page.
  //
  // Deliberately NOT polling this shared query — it's consumed by many
  // other dashboard cards (profile info, greeting, stats), and adding an
  // interval here would force the whole dashboard to refetch on our
  // schedule, not just this card. Instead: refetch() is called explicitly
  // right after a successful punch (see handlePunchSuccess below), and
  // the second-by-second ticking below is purely client-side in between.
  const { data: profile, refetch: refetchProfile } = useGetProfileQuery();
  const attendanceSummary = profile?.data?.attendanceSummary;
 
  // Client-side ticking clock. Only drives the display; the actual source
  // of truth (TotalCompletedMinutesToday, CurrentSessionStartTime) still
  // comes from the server via attendanceSummary above.
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
 
  const elapsedSeconds = (() => {
    if (!attendanceSummary) return 0;
    const completedSeconds = attendanceSummary.TotalCompletedMinutesToday * 60;
    if (!attendanceSummary.CurrentSessionStartTime) return completedSeconds;
    const openSessionSeconds =
      (now.getTime() - new Date(attendanceSummary.CurrentSessionStartTime).getTime()) / 1000;
    return completedSeconds + Math.max(0, openSessionSeconds);
  })();
 
  // NEW — which of the two popups (if any) is currently open. "enroll" is
  // only ever reached FROM the punch modal's "Register Now" button —
  // there's no other way in, matching the reactive-only decision.
  const [modalMode, setModalMode] = useState<"punch" | "enroll" | null>(null);
 
  // Wrapped in useCallback so FacePunchModal's effect (which depends on
  // this function's identity) doesn't re-fire on unrelated re-renders.
  const handlePunchSuccess = useCallback(
    (action: "IN" | "OUT") => {
      setPunchedIn(action === "IN");
      // The shared profile data (elapsed time, early/late) is now stale
      // the instant a punch happens — refetch immediately rather than
      // waiting for whatever normally triggers a profile refresh.
      refetchProfile();
    },
    [refetchProfile]
  );
 
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
    ${punchedIn ? "bg-green-500" : "bg-slate-400"}
  `}
        >
          {punchedIn ? "Present" : "Not Checked In"}
        </span>
      </div>
 
      {/* Divider */}
 
      <div
        className="h-[2px] mt-3"
        style={{
          backgroundColor: "var(--primary-border)",
        }}
      />
 
      <div className="mt-7">
        <p
          className="
    text-slate-700
    text-[15px]
    leading-8
  "
        >
          {punchedIn
            ? "You are currently checked in."
            : "You are currently checked out. Punch in whenever you're ready."}
        </p>
      </div>
 
      {/* Live elapsed timer + early/late summary. Shows once we have real
          data from the shared profile query — no placeholder flash of
          00:00:00 before the first fetch resolves. */}
      {attendanceSummary && (
        <div className="mt-5 space-y-3">
          {attendanceSummary.CheckInTime && (
            <p className="text-center text-[15px] text-slate-600">
              Checked in <b className="text-slate-800 text-[16px] font-semibold">{formatClockTime(attendanceSummary.CheckInTime)}</b>
            </p>
          )}
 
          <div className="rounded-xl bg-slate-50 border border-slate-200 py-3 text-center">
            <p className="text-2xl font-semibold tracking-wide text-slate-800 font-mono">
              {formatDuration(elapsedSeconds)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Total worked today</p>
          </div>
 
          {attendanceSummary.CheckOutTime && (
            <p className="text-center text-[15px] text-slate-600">
              Checked out <b className="text-slate-800 text-[16px] font-semibold">{formatClockTime(attendanceSummary.CheckOutTime)}</b>
            </p>
          )}
 
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-blue-50 px-3 py-2 text-center">
              <p className="text-[11px] text-blue-700 font-medium">
                {attendanceSummary.LateOrEarlyInStatus
                  ? attendanceSummary.LateOrEarlyInStatus === "OnTime"
                    ? "On time"
                    : `${attendanceSummary.LateOrEarlyInStatus} IN (h:m)`
                  : "Early IN (h:m)"}
              </p>
              <p className="text-sm font-semibold text-blue-900 mt-0.5">
                {attendanceSummary.LateOrEarlyInStatus && attendanceSummary.LateOrEarlyInStatus !== "OnTime"
                  ? formatMinutesAsClock(attendanceSummary.LateOrEarlyInMinutes ?? 0)
                  : attendanceSummary.LateOrEarlyInStatus === "OnTime"
                    ? "00:00"
                    : "--:--"}
              </p>
            </div>
 
            <div className="rounded-lg bg-orange-50 px-3 py-2 text-center">
              <p className="text-[11px] text-orange-700 font-medium">
                {attendanceSummary.LateOrEarlyOutStatus
                  ? attendanceSummary.LateOrEarlyOutStatus === "OnTime"
                    ? "On time"
                    : `${attendanceSummary.LateOrEarlyOutStatus} Out (h:m)`
                  : "Early Out (h:m)"}
              </p>
              <p className="text-sm font-semibold text-orange-900 mt-0.5">
                {attendanceSummary.LateOrEarlyOutStatus && attendanceSummary.LateOrEarlyOutStatus !== "OnTime"
                  ? formatMinutesAsClock(attendanceSummary.LateOrEarlyOutMinutes ?? 0)
                  : attendanceSummary.LateOrEarlyOutStatus === "OnTime"
                    ? "00:00"
                    : "--:--"}
              </p>
            </div>
          </div>
        </div>
      )}
 
      <div className="mt-auto pt-8">
        {/* Buttons */}
 
        <div className="space-y-3">
          <button
            onClick={() => setModalMode("punch")}
            disabled={punchedIn}
            className={`
      w-full
      h-10
      rounded-lg
      text-sm
      font-medium
      text-white
      transition
      ${punchedIn ? "bg-slate-300 cursor-not-allowed" : ""}
    `}
            style={
              punchedIn
                ? {}
                : {
                  background: "var(--primary-gradient)",
                }
            }
          >
            {punchedIn ? "Punched In" : "Punch In"}
          </button>
 
          <button
            onClick={() => setModalMode("punch")}
            disabled={!punchedIn}
            className={`
      w-full
      h-10
      rounded-lg
      text-sm
      font-medium
      transition
      ${punchedIn
                ? "bg-orange-500 text-white hover:bg-orange-600"
                : "bg-slate-300 text-white cursor-not-allowed"
              }
    `}
          >
            Check Out
          </button>
        </div>
 
        {/* FIX — was 11px light-gray text, blended into the white
            background and easy to miss entirely. Now a proper visible
            secondary action: bigger, blue (matches the app's link
            color), with an icon and a light background so it reads as
            clickable, not as a caption. */}
        <Link
          to="../attendance/face-registration"
          className="mt-3 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
        >
          <UserCog size={15} />
          Manage face registration
        </Link>
      </div>
 
      {modalMode === "punch" && (
        <FacePunchModal
          onClose={() => setModalMode(null)}
          onPunchSuccess={handlePunchSuccess}
          onNeedsEnrollment={() => setModalMode("enroll")}
        />
      )}
 
      {modalMode === "enroll" && (
        <FaceEnrollmentModal onClose={() => setModalMode(null)} />
      )}
    </div>
  );
}
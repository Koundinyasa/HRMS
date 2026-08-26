 import { useState } from "react";
import { Check, X as XIcon } from "lucide-react";
import { useGetRegistrationStatusQuery } from "../api/attendanceApi";
import FaceEnrollmentModal from "../components/FaceEnrollmentModal";
 
const ANGLE_LABELS: Record<string, string> = {
  front: "Front",
  right: "Right",
  left: "Left",
  up: "Up",
  down: "Down",
};
 
export default function FaceRegistrationPage() {
  const { data, isLoading, refetch } = useGetRegistrationStatusQuery();
  const [showEnrollModal, setShowEnrollModal] = useState(false);
 
  const handleEnrollClose = () => {
    setShowEnrollModal(false);
    // Registration just changed (or the attempt finished) — refetch so
    // this page reflects the real current state instead of stale data.
    refetch();
  };
 
  return (
    <div className="max-w-xl mx-auto p-6">
      <div
        className="rounded-2xl border p-6"
        style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--primary-border)" }}
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-medium" style={{ color: "var(--primary-color)" }}>
            Face Registration
          </h2>
          {data?.registered && (
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
 
        {isLoading ? (
          <p className="text-sm text-slate-400 mt-4">Loading...</p>
        ) : !data?.registered ? (
          <>
            <p className="text-sm text-slate-500 mt-2 mb-5">
              You haven't registered your face yet.
            </p>
            <button
              type="button"
              onClick={() => setShowEnrollModal(true)}
              className="w-full h-11 rounded-lg text-sm font-medium text-white"
              style={{ background: "var(--primary-gradient)" }}
            >
              Register Now
            </button>
          </>
        ) : (
          <>
            <p className="text-xs text-slate-400 mb-5">
              {data.totalActiveTemplates} of 5 angles registered
            </p>
 
            {/* Angle grid — only meaningful once AngleLabel is actually
                populated on real rows (see ANGLE_LABEL_COLUMN_READY in
                attendance.service.ts). Rows enrolled before that column
                existed show every angle as "unknown", which is honest —
                we genuinely can't say which specific angle they were. */}
            <div className="grid grid-cols-5 gap-2 mb-5">
              {Object.entries(ANGLE_LABELS).map(([key, label]) => {
                const isRegistered = data.registeredAngles.includes(key);
                return (
                  <div
                    key={key}
                    className={`aspect-square rounded-lg border flex flex-col items-center justify-center gap-1 text-[10px] font-semibold ${
                      isRegistered
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-dashed border-slate-300 text-slate-300"
                    }`}
                  >
                    {isRegistered ? <Check size={14} /> : <XIcon size={14} />}
                    <span>{label}</span>
                  </div>
                );
              })}
            </div>
 
            <div className="border-t pt-3 space-y-2" style={{ borderColor: "var(--primary-border)" }}>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Last updated</span>
                <b className="text-slate-700">
                  {data.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString() : "—"}
                </b>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Templates on file</span>
                <b className="text-slate-700">{data.totalActiveTemplates}</b>
              </div>
            </div>
 
            <button
              type="button"
              onClick={() => setShowEnrollModal(true)}
              className="mt-5 w-full h-11 rounded-lg text-sm font-medium text-white"
              style={{ background: "var(--primary-gradient)" }}
            >
              Re-register all angles
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-2">
              Re-registering replaces your entire gallery with a fresh set of 5 captures.
            </p>
          </>
        )}
      </div>
 
      {showEnrollModal && <FaceEnrollmentModal onClose={handleEnrollClose} />}
    </div>
  );
}
 
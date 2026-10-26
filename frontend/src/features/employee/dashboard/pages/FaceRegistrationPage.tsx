import { useState } from "react";
import { ArrowLeft, Check, X as XIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetRegistrationStatusQuery } from "../api/attendanceApi";
import { useGetProfileQuery } from "../api/dashboardApi";
import { useFacePhoto } from "../hooks/useFacePhoto";
import FaceEnrollmentModal from "../components/FaceEnrollmentModal";
 
const ANGLE_LABELS: Record<string, string> = {
  front: "Front",
  right: "Right",
  left: "Left",
  up: "Up",
  down: "Down",
};

// "Preetham K" -> "PK"; used when there is no photo to show.
function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}
 
export default function FaceRegistrationPage() {
  const { data, isLoading, refetch } = useGetRegistrationStatusQuery();
  const { data: profile } = useGetProfileQuery();
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const navigate = useNavigate();
  const { domain } = useParams();

  const fullName = profile?.data?.profile?.FullName ?? "";
  const hasPhoto = !!data?.registered && !!data?.hasPhoto;
  const { photoUrl, isLoading: isPhotoLoading } = useFacePhoto(hasPhoto, data?.lastUpdated);
  const lastUpdatedLabel = data?.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString() : "—";
 
  const handleEnrollClose = () => {
    setShowEnrollModal(false);
    refetch();
  };
 
  return (
    <div className="max-w-[704px] mx-auto p-6">
      <button
        type="button"
        onClick={() => navigate(`/${domain}/employee/dashboard`)}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={16} />
        Back 
      </button>
      <div
        className="rounded-2xl border overflow-hidden shadow-sm"
        style={{ backgroundColor: "var(--card-bg)", borderColor: "var(--primary-border)" }}
      >
        {isLoading ? (
          <p className="p-6 text-sm text-slate-400">Loading...</p>
        ) : !data?.registered ? (
          <div className="p-6">
            <h2 className="text-lg font-medium" style={{ color: "var(--primary-color)" }}>
              Face Registration
            </h2>
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
          </div>
        ) : (
          <div className="flex flex-col md:flex-row">
            {/* Left: the employee's profile photo */}
            <div className="md:w-56 shrink-0 bg-blue-50 border-b md:border-b-0 md:border-r border-blue-100 p-6 flex flex-col items-center gap-3.5">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt="Your profile photo"
                  className="w-[168px] h-[200px] rounded-2xl object-cover border-4 border-white shadow-lg"
                />
              ) : isPhotoLoading ? (
                <div className="w-[168px] h-[200px] rounded-2xl bg-blue-100 animate-pulse" aria-label="Loading your photo" />
              ) : (
                <div
                  className="w-[168px] h-[200px] rounded-2xl border-2 border-dashed border-blue-300 bg-white/60 flex items-center justify-center text-4xl font-medium text-blue-700"
                  role="img"
                  aria-label="No profile photo yet"
                >
                  {getInitials(fullName)}
                </div>
              )}
              <div className="text-center">
                {fullName && <div className="text-[15px] font-semibold text-slate-900">{fullName}</div>}
                <div className="text-xs text-slate-500 mt-0.5">
                  {photoUrl ? `Photo taken ${lastUpdatedLabel}` : "No profile photo yet"}
                </div>
                {!hasPhoto && (
                  <div className="text-[11px] text-amber-700 mt-2">
                    Re-register to add your photo.
                  </div>
                )}
              </div>
            </div>

            {/* Right: registration status */}
            <div className="flex-grow p-7 flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium" style={{ color: "var(--primary-color)" }}>
                  Face Registration
                </h2>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {data.totalActiveTemplates} of 5 angles registered
              </p>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(ANGLE_LABELS).map(([key, label]) => {
                  const isRegistered = data.registeredAngles.includes(key);
                  return (
                    <div
                      key={key}
                      className={`h-[60px] rounded-[10px] border flex flex-col items-center justify-center gap-1 text-[11px] font-semibold ${
                        isRegistered
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-dashed border-slate-300 text-slate-400"
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
                  <b className="text-slate-700">{lastUpdatedLabel}</b>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Templates on file</span>
                  <b className="text-slate-700">{data.totalActiveTemplates}</b>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowEnrollModal(true)}
                className="w-full h-11 rounded-[10px] text-sm font-medium text-white"
                style={{ background: "var(--primary-gradient)" }}
              >
                {hasPhoto ? "Re-register all angles" : "Re-register and add photo"}
              </button>
              <p className="text-[11px] text-slate-500 text-center">
                Re-registering replaces your entire gallery and profile photo with a fresh set of captures.
              </p>
            </div>
          </div>
        )}
      </div>
 
      {showEnrollModal && <FaceEnrollmentModal onClose={handleEnrollClose} />}
    </div>
  );
}
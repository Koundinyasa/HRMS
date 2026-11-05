
import { useState } from "react";
import { ArrowLeft, Check, Clock, ShieldAlert, X as XIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetRegistrationStatusQuery,
  useGetReRegistrationStatusQuery,
  useRequestReRegistrationMutation,
} from "../api/attendanceApi";
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

// Reads the backend's message out of an RTK Query error.
function getErrorMessage(error: unknown, fallback: string): string {
  const data = (error as { data?: { message?: unknown } })?.data;
  const message = data?.message;
  if (typeof message === "string" && message.trim()) return message;
  if (Array.isArray(message) && typeof message[0] === "string") return message[0];
  return fallback;
}

const formatDate = (value: string | null | undefined) =>
  value ? new Date(value).toLocaleDateString() : "—";

export default function FaceRegistrationPage() {
  const { data, isLoading, refetch } = useGetRegistrationStatusQuery();
  const { data: profile } = useGetProfileQuery();
  const {
    data: approval,
    isLoading: isApprovalLoading,
    refetch: refetchApproval,
  } = useGetReRegistrationStatusQuery();
  const [requestReRegistration, { isLoading: isSendingRequest }] =
    useRequestReRegistrationMutation();

  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [reason, setReason] = useState("");
  const [requestError, setRequestError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const { domain } = useParams();

  const fullName = profile?.data?.profile?.FullName ?? "";
  const hasPhoto = !!data?.registered && !!data?.hasPhoto;
  const { photoUrl, isLoading: isPhotoLoading } = useFacePhoto(hasPhoto, data?.lastUpdated);
  const lastUpdatedLabel = formatDate(data?.lastUpdated);

  const approvalStatus = approval?.status ?? "none";
  const isPending = approvalStatus === "pending";
  const isApproved = approvalStatus === "approved";
  const isRejected = approvalStatus === "rejected";

  const handleEnrollClose = () => {
    setShowEnrollModal(false);
    refetch();
    // A successful re-registration spends the approval on the server.
    refetchApproval();
  };

  const openApprovalModal = () => {
    setReason("");
    setRequestError("");
    setShowApprovalModal(true);
  };

  const handleReRegisterClick = () => {
    if (isApproved) {
      // RM already approved: go straight to the camera.
      setShowEnrollModal(true);
      return;
    }
    openApprovalModal();
  };

  const handleSendRequest = async () => {
    try {
      setRequestError("");
      const response = await requestReRegistration({
        reason: reason.trim() || undefined,
      }).unwrap();
      setSuccessMessage(response.message);
      setShowApprovalModal(false);
    } catch (error) {
      setRequestError(
        getErrorMessage(error, "Could not send the request. Please try again."),
      );
    }
  };

  const buttonLabel = isPending
    ? "Approval pending with your Reporting Manager"
    : isApproved
      ? "Approved — Re-register now"
      : hasPhoto
        ? "Re-register all angles"
        : "Re-register and add photo";

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
          // First-time registration: no approval needed.
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
                <div
                  className="w-[168px] h-[200px] rounded-2xl bg-blue-100 animate-pulse"
                  aria-label="Loading your photo"
                />
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
                  <div className="text-[11px] text-amber-700 mt-2">Re-register to add your photo.</div>
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

              {/* Approval state banners */}
              {isPending && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  <Clock size={14} className="mt-0.5 shrink-0" />
                  <span>
                    {successMessage || "Your re-registration request is waiting for your Reporting Manager's approval."}{" "}
                    Sent on {formatDate(approval?.requestedAt)}.
                  </span>
                </div>
              )}
              {isApproved && (
                <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800">
                  <Check size={14} className="mt-0.5 shrink-0" />
                  <span>
                    Your Reporting Manager approved your request. Re-register before{" "}
                    {formatDate(approval?.expiresAt)}.
                  </span>
                </div>
              )}
              {isRejected && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                  <XIcon size={14} className="mt-0.5 shrink-0" />
                  <span>
                    Your last request was rejected
                    {approval?.rejectionReason ? `: "${approval.rejectionReason}"` : "."} You can send a new request.
                  </span>
                </div>
              )}

              <button
                type="button"
                onClick={handleReRegisterClick}
                disabled={isPending || isApprovalLoading}
                className="w-full h-11 rounded-[10px] text-sm font-medium text-white
                           hover:opacity-90 transition-opacity
                           disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: "var(--primary-gradient)" }}
              >
                {buttonLabel}
              </button>
              <p className="text-[11px] text-slate-500 text-center">
                Re-registering replaces your entire gallery and profile photo with a fresh set of captures.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* RM approval pop-up */}
      {showApprovalModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => !isSendingRequest && setShowApprovalModal(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                  <ShieldAlert size={18} />
                </span>
                <h3 className="text-base font-semibold text-slate-900">Approval required</h3>
              </div>
              <button
                type="button"
                aria-label="Close"
                disabled={isSendingRequest}
                onClick={() => setShowApprovalModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XIcon size={18} />
              </button>
            </div>

            <p className="mt-4 text-sm text-slate-600">
              You can't re-register your face on your own. This needs approval from your
              Reporting Manager. Do you want to send a request to your RM?
            </p>

            <label htmlFor="reregister-reason" className="mt-4 block text-xs font-medium text-slate-600">
              Reason (optional)
            </label>
            <textarea
              id="reregister-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="e.g. Face not recognised after a change in appearance"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            {requestError && <p className="mt-2 text-xs text-red-600">{requestError}</p>}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={isSendingRequest}
                onClick={() => setShowApprovalModal(false)}
                className="h-10 rounded-lg border border-slate-200 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                No, close
              </button>
              <button
                type="button"
                disabled={isSendingRequest}
                onClick={handleSendRequest}
                className="h-10 rounded-lg px-4 text-sm font-medium text-white disabled:opacity-60"
                style={{ background: "var(--primary-gradient)" }}
              >
                {isSendingRequest ? "Sending..." : "Send RM request"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* First-time registration, or re-registration after RM approval */}
      {showEnrollModal && <FaceEnrollmentModal onClose={handleEnrollClose} />}
    </div>
  );
}

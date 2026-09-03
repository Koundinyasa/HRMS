import { useEffect, useState } from "react";
import { Camera, CameraOff, UserPlus, X, Check, RotateCw, MapPin } from "lucide-react";
import { useAttendance } from "../hooks/useAttendance";
import {
  useLazyGetFaceStatusQuery,
  useLazyGetRecentPunchesQuery,
} from "../api/attendanceApi";
 
interface FacePunchModalProps {
  onClose: () => void;
  onPunchSuccess: (action: "IN" | "OUT") => void;
  onNeedsEnrollment: () => void;
}
 
// Fixed height for both faces of the flip card. A 3D flip can't animate
// height per-face the way the old dot-slider did (that caused a real bug
// earlier — the container was sized to whichever slide was tallest,
// leaving a gap under shorter content). Rather than repeat that class of
// bug, both faces share one fixed height; the Recent Punches list scrolls
// internally if it overflows instead of resizing the card around it.
// aspect-square scales the camera box to the card's full width — roughly
// 340-350px tall at this card width. CARD_HEIGHT is sized generously
// around that (header + button row + camera box + footer) so it fits
// with real breathing room, not scrolling.
const CARD_HEIGHT = 640;
 
export default function FacePunchModal({ onClose, onPunchSuccess, onNeedsEnrollment }: FacePunchModalProps) {
  const {
    videoRef,
    canvasRef,
    isCameraOpen,
    cameraError,
    resultMessage,
    lastAction,
    lastPunchDetails,
    isSubmitting,
    isCapturingSequence,
    captureProgress,
    locationStatus,
    openCamera,
    captureAndSubmit,
    cancelCamera,
  } = useAttendance();
 
  const [triggerFaceStatus, { data: faceStatus, isLoading: isCheckingStatus }] = useLazyGetFaceStatusQuery();
 
  // NEW — replaces activeSlide (0|1) from the old dot-slider. Both faces
  // stay mounted at all times (same property the old slider relied on) —
  // flipping to the back never interrupts an in-progress camera capture
  // on the front.
  const [flipped, setFlipped] = useState(false);
 
  const [triggerRecentPunches, { data: recentData, isLoading: isLoadingRecent }] = useLazyGetRecentPunchesQuery();
 
  useEffect(() => {
    triggerFaceStatus();
  }, [triggerFaceStatus]);
 
  useEffect(() => {
    if (!lastAction) return;
    onPunchSuccess(lastAction);
  }, [lastAction, onPunchSuccess]);
 
  const handleClose = () => {
    if (isCameraOpen) cancelCamera();
    onClose();
  };
 
  const busy = isCapturingSequence || isSubmitting;
  const punchSucceeded = Boolean(lastAction);
 
  const toggleFlip = () => {
    const goingToBack = !flipped;
    setFlipped(goingToBack);
    if (goingToBack && !recentData) {
      triggerRecentPunches();
    }
  };
 
  // The camera placeholder area is ALSO a flip trigger, but only while
  // nothing is actually happening (camera off, not mid-capture) — so an
  // accidental tap can never interrupt a live capture or hide the "please
  // blink" prompt partway through. The header icon button below is always
  // available regardless of state, as the one guaranteed-safe control.
  const backgroundTapEnabled = !isCameraOpen && !busy;
 
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4">
      {isCheckingStatus ? (
        <div className="w-full max-w-sm rounded-2xl bg-[#0f1420] border border-[#1f2a3d] shadow-2xl p-8">
          <p className="text-slate-400 text-sm text-center">Checking your registration status...</p>
        </div>
      ) : faceStatus && !faceStatus.registered ? (
        // ── Not registered — no flip card at all, nothing to show on a
        // back face yet since the employee has never punched. ──
        <div className="w-full max-w-sm rounded-2xl bg-[#0f1420] border border-[#1f2a3d] shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2a3d]">
            <h3 className="text-white text-base font-medium">Attendance</h3>
            <button type="button" onClick={handleClose} aria-label="Close" className="text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-5 flex flex-col items-center gap-3 py-6 text-center">
            <UserPlus size={36} className="text-blue-400" />
            <p className="text-white text-sm font-medium">You haven't registered your face yet.</p>
            <p className="text-slate-400 text-xs">Register your face once to start using it for punch in/out.</p>
            <button
              type="button"
              onClick={onNeedsEnrollment}
              className="mt-2 w-full h-11 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500"
            >
              Register Now
            </button>
          </div>
        </div>
      ) : (
        // ── Registered — the flip card, always here from this point on ──
        <div className="w-full max-w-sm" style={{ perspective: "1200px" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: CARD_HEIGHT,
              transformStyle: "preserve-3d",
              transition: "transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* FRONT FACE — camera flow, or post-punch details */}
            <div
              style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden" }}
              className="rounded-2xl bg-[#0f1420] border border-[#1f2a3d] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2a3d]">
                <h3 className="text-white text-base font-medium">Attendance</h3>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleFlip}
                    aria-label="View recent punches"
                    className="text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    <RotateCw size={17} />
                  </button>
                  <button type="button" onClick={handleClose} aria-label="Close" className="text-slate-400 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>
 
              <div className="p-5 flex-1 overflow-y-auto">
                {punchSucceeded ? (
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/25 p-4">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-400 text-emerald-950 flex items-center justify-center flex-shrink-0">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <b className="text-white text-[13.5px]">
                        {lastAction === "OUT" ? "Checked OUT" : "Checked IN"}
                        {lastPunchDetails?.time &&
                          ` — ${new Date(lastPunchDetails.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
                      </b>
                    </div>
                    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[11.5px] font-mono border-t border-emerald-500/15 pt-2.5">
                      <dt className="text-slate-400 uppercase tracking-wide">Mode</dt>
                      <dd className="text-right text-white">{lastPunchDetails?.mode ?? "Face Recognition"}</dd>
                      <dt className="text-slate-400 uppercase tracking-wide">Device</dt>
                      <dd className="text-right text-white">{lastPunchDetails?.device ?? "Unknown device"}</dd>
                      {lastPunchDetails?.latitude !== undefined && lastPunchDetails?.longitude !== undefined && (
                        <>
                          <dt className="text-slate-400 uppercase tracking-wide">Coordinates</dt>
                          <dd className="text-right text-white">
                            {lastPunchDetails.latitude.toFixed(4)}, {lastPunchDetails.longitude.toFixed(4)}
                          </dd>
                        </>
                      )}
                      <dt className="text-slate-400 uppercase tracking-wide">Location</dt>
                      <dd className="text-right text-amber-400">See Recent Punches shortly</dd>
                    </dl>
                    <button
                      type="button"
                      onClick={toggleFlip}
                      className="mt-4 w-full h-9 rounded-lg text-xs font-medium text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <RotateCw size={13} />
                      View recent punches
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2 mb-4">
                      <button
                        type="button"
                        onClick={openCamera}
                        disabled={isCameraOpen || busy}
                        className="flex-1 h-9 rounded-lg text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Camera size={14} />
                        Open Lens Connection
                      </button>
                      <button
                        type="button"
                        onClick={cancelCamera}
                        disabled={!isCameraOpen || busy}
                        className="flex-1 h-9 rounded-lg text-xs font-medium text-rose-300 bg-[#3f2530] hover:bg-[#4a2c3a] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <CameraOff size={14} />
                        Kill Lens Feed
                      </button>
                    </div>
 
                    <div
                      onClick={backgroundTapEnabled ? toggleFlip : undefined}
                      className={`relative w-full aspect-square rounded-xl overflow-hidden bg-black border border-[#1f2a3d] flex items-center justify-center ${
                        backgroundTapEnabled ? "cursor-pointer" : ""
                      }`}
                    >
                      {isCameraOpen ? (
                        <>
                          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                          {isCapturingSequence && (
                            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3 px-6">
                              <p className="text-white text-sm font-medium text-center">
                                Please look at the camera and blink naturally...
                              </p>
                              <div className="w-full max-w-[200px] h-1.5 rounded-full bg-white/20 overflow-hidden">
                                <div className="h-full bg-blue-500 transition-all duration-100" style={{ width: `${captureProgress}%` }} />
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2 px-6">
                          <p className="text-slate-500 text-sm text-center">
                            Camera feed is off. Tap "Open Lens Connection" to begin.
                          </p>
                          {backgroundTapEnabled && (
                            <p className="text-emerald-400/70 text-[11px] flex items-center gap-1">
                              <RotateCw size={11} />
                              Tap here to view recent punches
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
 
                    {/* NEW — honest feedback on whether geolocation actually
                        worked for this attempt. Stays hidden while idle
                        (before any submit) so it doesn't imply a status
                        before there's a real one to report. */}
                    {locationStatus !== "idle" && (
                      <div
                        className={`mt-3 flex items-center justify-center gap-1.5 text-[11px] ${
                          locationStatus === "captured" ? "text-emerald-400/80" : "text-amber-400/80"
                        }`}
                      >
                        <MapPin size={12} />
                        {locationStatus === "captured" ? "Location captured" : "Location unavailable — punch still recorded"}
                      </div>
                    )}
 
                    {cameraError && <p className="mt-3 text-sm text-rose-400 text-center">{cameraError}</p>}
                    {resultMessage && (
                      <p className="mt-3 text-sm text-center text-rose-400">
                        {resultMessage}
                      </p>
                    )}
                  </>
                )}
              </div>
 
              {!punchSucceeded && (
                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={captureAndSubmit}
                    disabled={!isCameraOpen || busy}
                    className="w-full h-11 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {isCapturingSequence ? "Checking..." : isSubmitting ? "Verifying..." : "Verify & Record Attendance"}
                  </button>
                </div>
              )}
            </div>
 
            {/* BACK FACE — recent punches history */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
              className="rounded-2xl bg-[#0f1420] border border-[#1f2a3d] shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2a3d]">
                <h3 className="text-white text-base font-medium">Recent Punches</h3>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleFlip}
                    aria-label="Back to punch screen"
                    className="text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    <RotateCw size={17} />
                  </button>
                  <button type="button" onClick={handleClose} aria-label="Close" className="text-slate-400 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>
              </div>
 
              <div className="flex-1 overflow-y-auto">
                {isLoadingRecent ? (
                  <p className="text-slate-400 text-xs text-center py-10">Loading...</p>
                ) : !recentData || recentData.punches.length === 0 ? (
                  <p className="text-slate-400 text-xs text-center py-10">No punches yet.</p>
                ) : (
                  recentData.punches.map((p, i) => (
                    <div
                      key={i}
                      className={`flex gap-2.5 px-5 py-3 ${i > 0 ? "border-t border-[#1f2a3d]" : ""}`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          p.action === "IN" ? "bg-emerald-400" : "bg-amber-400"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <span className="text-[13px] font-semibold text-white">
                            {p.action === "IN" ? "Checked IN" : "Checked OUT"}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {new Date(p.time).toLocaleString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          {p.location ?? <span className="text-amber-400">Location pending…</span>}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
 
              <div className="p-5 pt-3">
                <button
                  type="button"
                  onClick={toggleFlip}
                  className="w-full h-11 rounded-lg text-sm font-medium text-slate-300 bg-[#1b2333] hover:bg-[#232d40] flex items-center justify-center gap-2 transition-colors"
                >
                  <RotateCw size={15} />
                  Back to punch screen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 
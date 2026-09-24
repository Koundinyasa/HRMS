import { useEffect, useState } from "react";
import {
  Camera,
  CameraOff,
  UserPlus,
  X,
  Check,
  RotateCw,
  MapPin,
  Home,
  Building2,
  ChevronRight,
  Pencil,
} from "lucide-react";
import { useAttendance, type PunchMode } from "../hooks/useAttendance";
import {
  useLazyGetFaceStatusQuery,
  useLazyGetRecentPunchesQuery,
} from "../api/attendanceApi";

interface FacePunchModalProps {
  onClose: () => void;
  onPunchSuccess: (action: "IN" | "OUT") => void;
  onNeedsEnrollment: () => void;
}

// Sized to fit the front face with real breathing room, not scrolling —
// bumped from the original 640 after adding the mode-indicator accent
// strip below, which added roughly 30px of real content height (a
// bordered, padded strip replacing what used to be a single line of
// plain text) that the original value didn't have slack for.
const CARD_HEIGHT = 680;

// Display label for every mode — kept as one map so REMOTE/CLIENT_SITE
// (not yet clickable in the selector below) still display correctly
// anywhere a label is needed, rather than a ternary handling only 2 of
// the 4 real values.
const PUNCH_MODE_LABEL: Record<PunchMode, string> = {
  OFFICE: "Office",
  WFH: "Work from home",
  REMOTE: "Remote",
  CLIENT_SITE: "Client Site",
};

// Per-mode accent colors for the active-mode strip (indicator Option 2)
// and the selector cards' hover-left-border (selector Option A). Inline
// rgba values, not Tailwind classes — these exact tints aren't in the
// project's Tailwind palette, same reasoning as the flip-card's own
// inline transform styles above.
const PUNCH_MODE_ACCENT: Record<
  PunchMode,
  { bg: string; border: string; icon: string; text: string; hoverBorder: string }
> = {
  WFH: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)", icon: "#34d399", text: "#a7f3d0", hoverBorder: "#10b981" },
  OFFICE: { bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.25)", icon: "#60a5fa", text: "#bfdbfe", hoverBorder: "#3b82f6" },
  REMOTE: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", icon: "#fbbf24", text: "#fde68a", hoverBorder: "#f59e0b" },
  CLIENT_SITE: { bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.25)", icon: "#c084fc", text: "#e9d5ff", hoverBorder: "#a855f7" },
};

export default function FacePunchModal({
  onClose,
  onPunchSuccess,
  onNeedsEnrollment,
}: FacePunchModalProps) {
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

  const [triggerFaceStatus, { data: faceStatus, isLoading: isCheckingStatus }] =
    useLazyGetFaceStatusQuery();

  const [flipped, setFlipped] = useState(false);

  // Gates the whole front face — camera flow and footer CTA don't render
  // until a mode is picked. Reset to null happens naturally on remount
  // (modal unmounts on close), so every fresh punch asks again — both
  // punch-in AND punch-out. WFH's 300m self-check (vs. that same
  // session's punch-in location) and Office's existing geofence check
  // are both flag-only, never blocking.
  const [punchMode, setPunchMode] = useState<PunchMode | null>(null);

  const [
    triggerRecentPunches,
    { data: recentData, isLoading: isLoadingRecent },
  ] = useLazyGetRecentPunchesQuery();

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

  // Lets them back out of the camera screen to change their mode
  // selection, without closing the whole modal. Disabled while busy so
  // it can never interrupt a live capture.
  const handleChangeMode = () => {
    if (busy) return;
    if (isCameraOpen) cancelCamera();
    setPunchMode(null);
  };

  const handleSubmit = () => {
    if (!punchMode) return;
    captureAndSubmit(punchMode);
  };

  const backgroundTapEnabled = !isCameraOpen && !busy;
  const modeAccent = punchMode ? PUNCH_MODE_ACCENT[punchMode] : null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4">
      {isCheckingStatus ? (
        <div className="w-full max-w-sm rounded-2xl bg-[#0f1420] border border-[#1f2a3d] shadow-2xl p-8">
          <p className="text-slate-400 text-sm text-center">
            Checking your registration status...
          </p>
        </div>
      ) : faceStatus && !faceStatus.registered ? (
        // ── Not registered — no flip card at all, nothing to show on a
        // back face yet since the employee has never punched. ──
        <div className="w-full max-w-sm rounded-2xl bg-[#0f1420] border border-[#1f2a3d] shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2a3d]">
            <h3 className="text-white text-base font-medium">Attendance</h3>
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-5 flex flex-col items-center gap-3 py-6 text-center">
            <UserPlus size={36} className="text-blue-400" />
            <p className="text-white text-sm font-medium">
              You haven't registered your face yet.
            </p>
            <p className="text-slate-400 text-xs">
              Register your face once to start using it for punch in/out.
            </p>
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
            {/* FRONT FACE — mode select, then camera flow, or post-punch details */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
              }}
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
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* SELECTOR — Option A: refined cards, colored hover-left-
                  border matching each mode's own accent. Gates everything
                  below it. Only WFH/OFFICE are clickable right now —
                  REMOTE/CLIENT_SITE are built below, wrapped in a comment
                  block, ready to turn on by deleting the two markers. */}
              {!punchSucceeded && !punchMode ? (
                <div className="p-5 flex-1 flex flex-col items-center justify-center">
                  <p className="text-white text-base font-medium mb-1.5">
                    Where are you punching in from?
                  </p>
                  <p className="text-slate-500 text-xs mb-8">
                    We'll check your location differently depending on which one you pick.
                  </p>
                  <div className="w-full flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={() => setPunchMode("WFH")}
                      style={{ borderLeftColor: "transparent" }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderLeftColor = PUNCH_MODE_ACCENT.WFH.hoverBorder)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderLeftColor = "transparent")}
                      className="group flex items-center gap-4 px-5 py-5 rounded-xl border border-[#1f2a3d] border-l-[3px] bg-[#131a2b] hover:bg-[#161e33] text-left transition-colors"
                    >
                      <span className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <Home size={22} className="text-emerald-400" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[15px] font-medium text-slate-100">
                          Work from home
                        </span>
                        <span className="block text-[12px] text-slate-500 mt-0.5">
                          Checked against where you punch out from
                        </span>
                      </span>
                      <ChevronRight
                        size={18}
                        className="text-slate-600 group-hover:text-slate-400 flex-shrink-0 transition-colors"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPunchMode("OFFICE")}
                      style={{ borderLeftColor: "transparent" }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderLeftColor = PUNCH_MODE_ACCENT.OFFICE.hoverBorder)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderLeftColor = "transparent")}
                      className="group flex items-center gap-4 px-5 py-5 rounded-xl border border-[#1f2a3d] border-l-[3px] bg-[#131a2b] hover:bg-[#161e33] text-left transition-colors"
                    >
                      <span className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <Building2 size={22} className="text-blue-400" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[15px] font-medium text-slate-100">
                          Office
                        </span>
                        <span className="block text-[12px] text-slate-500 mt-0.5">
                          Checked against the office location
                        </span>
                      </span>
                      <ChevronRight
                        size={18}
                        className="text-slate-600 group-hover:text-slate-400 flex-shrink-0 transition-colors"
                      />
                    </button>

                    {/* NOT YET ENABLED — Remote and Client Site. To turn
                        them on: delete the opening comment-start marker
                        directly below this note, and the matching
                        comment-end marker right after the Client Site
                        button below. Kept in place, not deleted, so
                        nothing needs rebuilding later. */}
                    {/*
                    <button
                      type="button"
                      onClick={() => setPunchMode("REMOTE")}
                      className="group flex items-center gap-4 px-5 py-5 rounded-xl border border-[#1f2a3d] bg-[#131a2b] hover:border-amber-500/50 hover:bg-[#161e33] text-left transition-colors"
                    >
                      <span className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                        <MapPin size={22} className="text-amber-400" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[15px] font-medium text-slate-100">
                          Remote
                        </span>
                        <span className="block text-[12px] text-slate-500 mt-0.5">
                          Working from somewhere other than home or the office
                        </span>
                      </span>
                      <ChevronRight
                        size={18}
                        className="text-slate-600 group-hover:text-slate-400 flex-shrink-0 transition-colors"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPunchMode("CLIENT_SITE")}
                      className="group flex items-center gap-4 px-5 py-5 rounded-xl border border-[#1f2a3d] bg-[#131a2b] hover:border-purple-500/50 hover:bg-[#161e33] text-left transition-colors"
                    >
                      <span className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <Building2 size={22} className="text-purple-400" />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[15px] font-medium text-slate-100">
                          Client Site
                        </span>
                        <span className="block text-[12px] text-slate-500 mt-0.5">
                          At a client's office or location
                        </span>
                      </span>
                      <ChevronRight
                        size={18}
                        className="text-slate-600 group-hover:text-slate-400 flex-shrink-0 transition-colors"
                      />
                    </button>
                    */}
                  </div>
                </div>
              ) : (
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
                            ` — ${new Date(
                              lastPunchDetails.time,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`}
                        </b>
                      </div>
                      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[11.5px] font-mono border-t border-emerald-500/15 pt-2.5">
                        <dt className="text-slate-400 uppercase tracking-wide">
                          Mode
                        </dt>
                        <dd className="text-right text-white">
                          {lastPunchDetails?.mode ?? "Face Recognition"}
                        </dd>
                        <dt className="text-slate-400 uppercase tracking-wide">
                          Punching from
                        </dt>
                        <dd className="text-right text-white">
                          {punchMode ? PUNCH_MODE_LABEL[punchMode] : "—"}
                        </dd>
                        <dt className="text-slate-400 uppercase tracking-wide">
                          Device
                        </dt>
                        <dd className="text-right text-white">
                          {lastPunchDetails?.device ?? "Unknown device"}
                        </dd>
                        {lastPunchDetails?.latitude !== undefined &&
                          lastPunchDetails?.longitude !== undefined && (
                            <>
                              <dt className="text-slate-400 uppercase tracking-wide">
                                Coordinates
                              </dt>
                              <dd className="text-right text-white">
                                {lastPunchDetails.latitude.toFixed(4)},{" "}
                                {lastPunchDetails.longitude.toFixed(4)}
                              </dd>
                            </>
                          )}
                        <dt className="text-slate-400 uppercase tracking-wide">
                          Location
                        </dt>
                        <dd className="text-right text-amber-400">
                          See Recent Punches shortly
                        </dd>
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
                      {/* INDICATOR — Option 2: full-width accent strip,
                          colored per mode, stays visible even once the
                          camera's open. Replaces the old plain "← change"
                          text link. */}
                      {modeAccent && (
                        <button
                          type="button"
                          onClick={handleChangeMode}
                          disabled={busy}
                          style={{
                            background: modeAccent.bg,
                            borderColor: modeAccent.border,
                          }}
                          className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg border mb-3 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                        >
                          {punchMode === "OFFICE" ? (
                            <Building2 size={14} style={{ color: modeAccent.icon }} />
                          ) : (
                            <Home size={14} style={{ color: modeAccent.icon }} />
                          )}
                          <span
                            className="text-[12px] flex-1 text-left"
                            style={{ color: modeAccent.text }}
                          >
                            Punching in as {punchMode ? PUNCH_MODE_LABEL[punchMode] : ""}
                          </span>
                          <span
                            className="text-[10.5px] flex items-center gap-1"
                            style={{ color: modeAccent.icon }}
                          >
                            <Pencil size={10} />
                            Change
                          </span>
                        </button>
                      )}

                      <div className="flex gap-2 mb-4">
                        <button
                          type="button"
                          onClick={openCamera}
                          disabled={
                            isCameraOpen || busy || locationStatus === "checking"
                          }
                          className="flex-1 h-9 rounded-lg text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Camera size={14} />
                          {locationStatus === "checking"
                            ? "Checking location..."
                            : "Open Lens Connection"}
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
                            <video
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              className="w-full h-full object-cover"
                            />
                            {isCapturingSequence && (
                              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-3 px-6">
                                <p className="text-white text-sm font-medium text-center">
                                  Please look at the camera and blink naturally...
                                </p>
                                <div className="w-full max-w-[200px] h-1.5 rounded-full bg-white/20 overflow-hidden">
                                  <div
                                    className="h-full bg-blue-500 transition-all duration-100"
                                    style={{ width: `${captureProgress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="flex flex-col items-center gap-2 px-6">
                            <p className="text-slate-500 text-sm text-center">
                              Camera feed is off. Tap "Open Lens Connection" to
                              begin.
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

                      {locationStatus !== "idle" && (
                        <div
                          className={`mt-3 flex items-center justify-center gap-1.5 text-[11px] ${
                            locationStatus === "captured"
                              ? "text-emerald-400/80"
                              : locationStatus === "checking"
                              ? "text-slate-400"
                              : "text-rose-400/80"
                          }`}
                        >
                          <MapPin size={12} />
                          {locationStatus === "captured"
                            ? "Location captured"
                            : locationStatus === "checking"
                            ? "Checking location..."
                            : "Location unavailable — required to punch in or out"}
                        </div>
                      )}

                      {cameraError && (
                        <p className="mt-3 text-sm text-rose-400 text-center">
                          {cameraError}
                        </p>
                      )}
                      {resultMessage && (
                        <p className="mt-3 text-sm text-center text-rose-400">
                          {resultMessage}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              {!punchSucceeded && punchMode && (
                <div className="p-5 pt-0">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isCameraOpen || busy}
                    className="w-full h-11 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    {isCapturingSequence
                      ? "Checking..."
                      : isSubmitting
                      ? "Verifying..."
                      : "Verify & Record Attendance"}
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
                <h3 className="text-white text-base font-medium">
                  Recent Punches
                </h3>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleFlip}
                    aria-label="Back to punch screen"
                    className="text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    <RotateCw size={17} />
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {isLoadingRecent ? (
                  <p className="text-slate-400 text-xs text-center py-10">
                    Loading...
                  </p>
                ) : !recentData || recentData.punches.length === 0 ? (
                  <p className="text-slate-400 text-xs text-center py-10">
                    No punches yet.
                  </p>
                ) : (
                  recentData.punches.map((p, i) => (
                    <div
                      key={i}
                      className={`flex gap-2.5 px-5 py-3 ${
                        i > 0 ? "border-t border-[#1f2a3d]" : ""
                      }`}
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
                          {p.location ?? (
                            <span className="text-amber-400">
                              Location pending…
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                          {p.mode}
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
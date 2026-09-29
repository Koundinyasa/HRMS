import { useEffect, useRef, useState } from "react";
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
  Pencil,
  Sunrise,
  Sunset,
} from "lucide-react";
import { useAttendance, type PunchMode } from "../hooks/useAttendance";
import {
  useLazyGetFaceStatusQuery,
  useLazyGetRecentPunchesQuery,
} from "../api/attendanceApi";
import {
  useLazyGetLocationCheckQuery,
  type LocationCheckResponse,
} from "../api/locationCheckApi";
import { useSkyTheme } from "../sky/useSkyTheme";
import {
  HomeScene,
  LocationReadout,
  OfficeScene,
  SkyHeader,
  type Readout,
} from "../sky/SkyParts";

interface FacePunchModalProps {
  onClose: () => void;
  onPunchSuccess: (action: "IN" | "OUT") => void;
  onNeedsEnrollment: () => void;
}

// The front face is a fixed height so the 3D flip has two equal faces. The
// punch screen is laid out to fit a rejection message of up to about four
// lines under the camera without scrolling.
const CARD_HEIGHT = 680;

// The location card under the camera (radar, distance, coordinates) is a
// permanent part of the punch screen. What employees must NOT see is that a
// WFH punch-out is compared with that day's first punch-in — so in WFH mode
// the card only ever says "location captured", and the server doesn't send
// the comparison at all (see EXPOSE_WFH_COMPARISON in attendance.service.ts,
// which you switch on only while testing the 300m check yourself).

const fmtMeters = (m: number) =>
  m >= 10000 ? `${(m / 1000).toFixed(1)} km` : `${m} m`;

// Splits a distance for the big number: 223 → "223" "m", 25000 → "25.0" "km".
const splitMeters = (m: number) =>
  m >= 10000
    ? { big: (m / 1000).toFixed(1), unit: "km" }
    : { big: String(m), unit: "m" };

// Turns the server's answer into what the readout card shows, depending on
// the mode. Office is the strict rule (blocking), so outside is red. WFH shows
// a plain "location captured" unless the server chose to send the comparison
// (it doesn't, except while you're testing) — and even then it never explains
// why there is nothing to compare.
function readoutFor(
  mode: PunchMode,
  check: LocationCheckResponse | undefined,
  loading: boolean,
  failed: boolean,
): Readout {
  // A plain "location captured" card — says nothing about any comparison.
  const captured = (): Readout => ({
    state: "idle",
    tone: "ok",
    big: mode === "WFH" ? "Home" : "✓",
    unit: "",
    pill: "Captured",
    sub:
      mode === "WFH"
        ? "Working from home · location saved"
        : "Location captured",
  });

  if (mode === "OFFICE") {
    if (loading) {
      return {
        state: "loading",
        tone: "neutral",
        big: "…",
        unit: "",
        pill: "Checking",
        sub: "Checking distance…",
      };
    }
    if (failed || !check) {
      return {
        state: "unavailable",
        tone: "neutral",
        big: "—",
        unit: "",
        pill: "Unavailable",
        sub: "Distance check unavailable",
      };
    }
    if (!check.office) {
      return {
        state: "idle",
        tone: "neutral",
        big: "—",
        unit: "",
        pill: "No check",
        sub: "No office location found for your company",
      };
    }
    const { distanceMeters: d, radiusMeters: r, bearingDegrees } = check.office;
    const inside = d <= r;
    return {
      state: "measured",
      tone: inside ? "ok" : "over",
      ...splitMeters(d),
      pill: inside ? "Inside" : `Outside +${fmtMeters(d - r)}`,
      sub: `from the office · limit ${fmtMeters(r)}`,
      distance: d,
      limit: r,
      bearing: bearingDegrees ?? 0,
    };
  }

  if (mode === "WFH") {
    const w = check?.wfh;
    // While loading, on failure, or with nothing to compare: just "captured".
    if (loading || failed || !w || w.status !== "compared") return captured();
    const { distanceMeters: d, thresholdMeters: t, bearingDegrees } = w;
    const within = d <= t;
    return {
      state: "measured",
      tone: within ? "ok" : "warn",
      ...splitMeters(d),
      pill: within ? "Within" : `Over +${fmtMeters(d - t)}`,
      sub: `from morning punch-in · limit ${fmtMeters(t)}`,
      distance: d,
      limit: t,
      bearing: bearingDegrees ?? 0,
    };
  }

  return captured();
}

// Display label for every mode — kept as one map so REMOTE/CLIENT_SITE
// (not yet clickable in the picker below) still display correctly anywhere
// a label is needed.
const PUNCH_MODE_LABEL: Record<PunchMode, string> = {
  OFFICE: "Office",
  WFH: "Work from home",
  REMOTE: "Remote",
  CLIENT_SITE: "Client Site",
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
    currentLocation,
    openCamera,
    captureAndSubmit,
    cancelCamera,
  } = useAttendance();

  const [triggerFaceStatus, { data: faceStatus, isLoading: isCheckingStatus }] =
    useLazyGetFaceStatusQuery();

  const [flipped, setFlipped] = useState(false);

  // The sky: sun/moon position, colours and scenes, worked out from the
  // time and the employee's location (see sky/skyTheme.ts).
  const sky = useSkyTheme(currentLocation);

  // The punch screen's scrollbar is hidden (see the content area below), so
  // if a long error message ever lands below the visible area, scroll just
  // enough to show it rather than leaving it cut off with no bar to hint
  // that there's more.
  const messageRef = useRef<HTMLDivElement>(null);

  // Development aid: distance from the required location, fetched each
  // time a fresh location fix comes in.
  const [
    triggerLocationCheck,
    {
      data: locationCheck,
      isFetching: isCheckingDistance,
      isError: locationCheckFailed,
    },
  ] = useLazyGetLocationCheckQuery();

  // Gates the whole front face — camera flow and footer CTA don't render
  // until a mode is picked. Reset to null happens naturally on remount
  // (modal unmounts on close), so every fresh punch asks again — both
  // punch-in AND punch-out. WFH's 300m check (against today's first
  // punch-in) and Office's geofence are handled on the server.
  const [punchMode, setPunchMode] = useState<PunchMode | null>(null);

  // Ask the server how far this fresh location fix is from where it needs
  // to be. (The server only includes the WFH comparison while it's being
  // tested — see EXPOSE_WFH_COMPARISON — so asking is harmless in any mode.)
  useEffect(() => {
    if (!currentLocation) return;
    triggerLocationCheck({
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    });
  }, [currentLocation, triggerLocationCheck]);

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

  useEffect(() => {
    if (!cameraError && !resultMessage) return;
    messageRef.current?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [cameraError, resultMessage]);

  const busy = isCapturingSequence || isSubmitting;
  const punchSucceeded = Boolean(lastAction);
  const selecting = !punchSucceeded && !punchMode;

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

  // Whether the location card should show under the camera (see the slot
  // below the camera box).
  const showReadout =
    !!punchMode &&
    locationStatus === "captured" &&
    !!currentLocation &&
    locationCheck?.enabled !== false;
  const readout: Readout | null =
    showReadout && punchMode
      ? readoutFor(
          punchMode,
          locationCheck,
          isCheckingDistance,
          locationCheckFailed,
        )
      : null;

  const ModeIcon =
    punchMode === "OFFICE" || punchMode === "CLIENT_SITE"
      ? Building2
      : punchMode === "REMOTE"
      ? MapPin
      : Home;

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
            {/* FRONT FACE — mode picker, then the camera flow, or the result */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backfaceVisibility: "hidden",
              }}
              className="rounded-2xl bg-[#0f1420] border border-[#1f2a3d] shadow-2xl overflow-hidden flex flex-col"
            >
              <SkyHeader
                sky={sky}
                variant={selecting ? "tall" : "wide"}
                title="Attendance"
                onFlip={toggleFlip}
                flipLabel="View recent punches"
                onClose={handleClose}
                left={
                  selecting ? (
                    <div className="leading-tight">
                      <div className="text-[17px] font-medium text-white">
                        {sky.greeting}
                      </div>
                      <div className="text-[11px] text-amber-100">
                        {sky.dateText}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/25"
                        style={{ background: sky.gradient }}
                      >
                        <ModeIcon size={18} className="text-white" />
                      </span>
                      <span className="leading-tight">
                        <span className="block text-[14px] font-medium text-white">
                          {punchMode ? PUNCH_MODE_LABEL[punchMode] : ""}
                        </span>
                        {!punchSucceeded && (
                          <button
                            type="button"
                            onClick={handleChangeMode}
                            disabled={busy}
                            className="flex items-center gap-1 text-[10.5px] text-amber-100 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Pencil size={10} />
                            {faceStatus?.punchedIn
                              ? "Punching out"
                              : "Punching in"}{" "}
                            · Change
                          </button>
                        )}
                      </span>
                    </div>
                  )
                }
                right={
                  selecting ? null : (
                    <span className="text-[22px] font-light leading-none text-white">
                      {sky.timeText}
                    </span>
                  )
                }
              />

              {selecting ? (
                // ── MODE PICKER — two little scenes that follow the sky.
                // Only WFH/OFFICE are clickable right now.
                <div className="flex flex-1 flex-col justify-center gap-3 px-4 pb-4 pt-3">
                  <p className="text-center text-[12px] text-slate-300">
                    Where are you punching in from?
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPunchMode("WFH")}
                      className="relative h-[240px] overflow-hidden rounded-2xl border border-white/10 text-left transition duration-200 hover:-translate-y-0.5 hover:border-white/35"
                      style={{ background: sky.gradient }}
                    >
                      <HomeScene sky={sky} />
                      <span
                        className="absolute inset-x-0 bottom-0 px-3 pb-2.5 pt-9"
                        style={{
                          background:
                            "linear-gradient(transparent, rgba(0,0,0,0.74))",
                        }}
                      >
                        <span className="block text-[14px] font-medium text-white">
                          Work from home
                        </span>
                        <span className="block text-[10px] leading-snug text-slate-200">
                          Compared with your morning punch-in
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPunchMode("OFFICE")}
                      className="relative h-[240px] overflow-hidden rounded-2xl border border-white/10 text-left transition duration-200 hover:-translate-y-0.5 hover:border-white/35"
                      style={{ background: sky.gradient }}
                    >
                      <OfficeScene sky={sky} />
                      <span
                        className="absolute inset-x-0 bottom-0 px-3 pb-2.5 pt-9"
                        style={{
                          background:
                            "linear-gradient(transparent, rgba(0,0,0,0.74))",
                        }}
                      >
                        <span className="block text-[14px] font-medium text-white">
                          Office
                        </span>
                        <span className="block text-[10px] leading-snug text-slate-200">
                          Checked against the office location
                        </span>
                      </span>
                    </button>
                  </div>

                  {/* NOT YET ENABLED — Remote and Client Site (older row
                      style; they'd sit under the two scenes). To turn them
                      on: delete the opening comment-start marker directly
                      below this note, and the matching comment-end marker
                      right after the Client Site button below. Kept in
                      place so nothing needs rebuilding later. */}
                  {/*
                  <button
                    type="button"
                    onClick={() => setPunchMode("REMOTE")}
                    className="flex items-center gap-4 px-5 py-4 rounded-xl border border-[#1f2a3d] bg-[#131a2b] hover:border-amber-500/50 hover:bg-[#161e33] text-left transition-colors"
                  >
                    <span className="w-11 h-11 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-amber-400" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[15px] font-medium text-slate-100">Remote</span>
                      <span className="block text-[12px] text-slate-500 mt-0.5">
                        Working from somewhere other than home or the office
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPunchMode("CLIENT_SITE")}
                    className="flex items-center gap-4 px-5 py-4 rounded-xl border border-[#1f2a3d] bg-[#131a2b] hover:border-purple-500/50 hover:bg-[#161e33] text-left transition-colors"
                  >
                    <span className="w-11 h-11 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                      <Building2 size={20} className="text-purple-400" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[15px] font-medium text-slate-100">Client Site</span>
                      <span className="block text-[12px] text-slate-500 mt-0.5">
                        At a client's office or location
                      </span>
                    </span>
                  </button>
                  */}

                  <div className="flex items-center justify-center gap-4 pt-1 text-[10.5px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Sunrise size={13} className="text-amber-300" />
                      {sky.sunriseText}
                    </span>
                    <span className="flex items-center gap-1">
                      <Sunset size={13} className="text-orange-300" />
                      {sky.sunsetText}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className="flex-1 overflow-y-auto px-5 pb-2 pt-4"
                  style={{ scrollbarWidth: "none" }}
                >
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
                      <div className="flex gap-2 mb-3">
                        <button
                          type="button"
                          onClick={openCamera}
                          disabled={
                            isCameraOpen ||
                            busy ||
                            locationStatus === "checking"
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
                                  Please look at the camera and blink
                                  naturally...
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

                      {/* The plain "Location captured" line: only while the
                          readout above isn't showing (it already carries the
                          pin and the coordinates). Also covers 'checking' and
                          'unavailable'. */}
                      {locationStatus !== "idle" && !showReadout && (
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

                      {/* One slot under the camera, two uses. Normally it holds
                          the location readout (radar, distance, coordinates)
                          on a solid card, so it's always clearly legible. When
                          an error message appears it takes the slot instead,
                          then the readout comes back once the message clears.
                          Nothing is drawn over the camera picture. */}
                      <div ref={messageRef}>
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
                        {!cameraError &&
                          !resultMessage &&
                          readout &&
                          currentLocation && (
                            <LocationReadout
                              readout={readout}
                              coords={currentLocation}
                            />
                          )}
                      </div>
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
              <SkyHeader
                sky={sky}
                variant="wide"
                title="Attendance"
                onFlip={toggleFlip}
                flipLabel="Back to punch screen"
                onClose={handleClose}
                left={
                  <div className="leading-tight">
                    <div className="text-[16px] font-medium text-white">
                      Recent Punches
                    </div>
                    <div className="text-[10.5px] text-amber-100">
                      Your last 10 punches
                    </div>
                  </div>
                }
                right={
                  <span className="text-[22px] font-light leading-none text-white">
                    {sky.timeText}
                  </span>
                }
              />

              <div
                className="flex-1 overflow-y-auto"
                style={{ scrollbarWidth: "none" }}
              >
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

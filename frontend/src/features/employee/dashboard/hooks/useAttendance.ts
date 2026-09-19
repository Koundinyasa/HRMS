import { useCallback, useEffect, useRef, useState } from "react";
import { usePunchAttendanceMutation } from "../api/attendanceApi";

const CAPTURE_DURATION_MS = 2400;
const CAPTURE_INTERVAL_MS = 120; // ~20 frames — frequent enough to reliably
                                  // catch a blink, which typically lasts 200-400ms
const LOCATION_TIMEOUT_MS = 10000; // raised further — enableHighAccuracy below makes
                                    // the browser try harder for a precise fix, which
                                    // takes noticeably longer than the cheap Wi-Fi
                                    // estimate we were using before.

// Resolves to coordinates on success, or null on denial / timeout / any
// error / unsupported browser. This function itself never throws — it
// always resolves, one way or the other. UPDATED: location used to be
// pure enrichment (never blocked a punch); it's now mandatory, but that
// blocking decision is made by the CALLER (openCamera, below), not here
// — this function's job stays simple: try, and report what happened.
function getCurrentLocation(): Promise<{ latitude: number; longitude: number; accuracy: number } | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          // NEW — radius in meters the browser itself is only confident to.
          // Was being silently discarded before. A large value (e.g. tens
          // of kilometers) means the browser fell back to a coarse
          // IP-based guess instead of a real GPS/Wi-Fi fix — coordinates
          // can look completely normal and still be many km off in that
          // case, with nothing else in the payload able to tell the
          // difference. See ACCURACY_THRESHOLD_METERS in attendance.service.ts.
          accuracy: position.coords.accuracy,
        });
      },
      () => resolve(null), // denied, unavailable, or any other error
      {
        enableHighAccuracy: true, // ask the device/browser for its best available
                                   // fix (GPS if present) instead of the fast,
                                   // looser Wi-Fi-based estimate
        timeout: LOCATION_TIMEOUT_MS,
        maximumAge: 0, // always get a fresh fix — no reusing an old cached one
      }
    );
  });
}

export function useAttendance() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isCapturingRef = useRef(false);

  // NEW — caches the location fetched in openCamera() below, so
  // captureAndSubmit() doesn't need to ask the browser for it a second
  // time. Also means there's a single moment (camera open) where location
  // is resolved, rather than two separate asks that could theoretically
  // disagree.
  const locationRef = useRef<{ latitude: number; longitude: number; accuracy: number } | null>(null);

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<"IN" | "OUT" | null>(null);

  // The rest of a successful punch response (mode/device/coords/time)
  // beyond just the action, for the post-punch details slide in
  // FacePunchModal. Kept separate from lastAction so consumers that only
  // care about the action don't need to change.
  const [lastPunchDetails, setLastPunchDetails] = useState<{
    time?: string;
    mode?: string;
    device?: string;
    latitude?: number;
    longitude?: number;
  } | null>(null);

  // Liveness capture state, drives the "please blink" prompt + progress bar
  const [isCapturingSequence, setIsCapturingSequence] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);

  // NEW — 'checking' added: location is now mandatory (the backend
  // rejects any punch without coordinates), so this needs a distinct
  // in-progress state shown WHILE openCamera is waiting on the GPS fix,
  // before the camera itself even opens.
  const [locationStatus, setLocationStatus] = useState<"idle" | "checking" | "captured" | "unavailable">("idle");

  const [punchAttendance, { isLoading: isSubmitting }] = usePunchAttendanceMutation();

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    // Stopping the tracks alone isn't always enough. As long as the
    // <video> element still has this (now-dead) stream assigned to
    // srcObject, some browsers keep the camera's recording light on.
    // Explicitly clearing it here is what actually releases the device.
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraOpen(false);
    setIsCapturingSequence(false);
    setCaptureProgress(0);
  }, []);

  // FIX — location is now checked HERE, before the camera even opens,
  // instead of only being discovered as a failure at final submit time
  // (after the employee already went through the whole capture flow).
  // If location isn't available, the camera never opens at all — same
  // spirit as the existing camera-permission failure below, just checked
  // first since it's now the harder requirement of the two.
  // FIX — location and camera permission requests are now kicked off
  // TOGETHER, in the same synchronous tick as the click that triggered
  // this handler, instead of one fully finishing before the other starts.
  //
  // Why this mattered: browsers track a short-lived "the user just
  // genuinely interacted with this page" window (transient activation)
  // tied to the click. Waiting on ONE native permission dialog (location)
  // to fully resolve before even calling getUserMedia() can burn through
  // that window — so on a FIRST-EVER grant, the browser can silently
  // block the second prompt (camera), since by the time it tries to show
  // up it's no longer confident this is still tied to a real user action.
  // Confirmed in real testing: worked fine after a refresh (location
  // already granted, resolves near-instantly, activation window stays
  // intact for the camera prompt) but failed on the very first grant.
  //
  // Firing both requests immediately, before either is awaited, means
  // both permission dialogs originate from the SAME click's activation,
  // even though the code below still awaits their results separately.
  const openCamera = useCallback(async () => {
    setResultMessage(null);
    setCameraError(null);
    setLocationStatus("checking");

    const locationPromise = getCurrentLocation();
    const cameraPromise = navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
    });

    const location = await locationPromise;
    if (!location) {
      setLocationStatus("unavailable");
      setCameraError(
        "Location is required to punch in or out. Please enable location access in your browser and try again."
      );
      // Location failed, but the camera request may have already
      // succeeded (or is still pending) since both fired together — make
      // sure that stream doesn't leak, since we're bailing out here
      // without ever opening the camera.
      cameraPromise
        .then((stream) => stream.getTracks().forEach((t) => t.stop()))
        .catch(() => {});
      return;
    }
    locationRef.current = location;
    setLocationStatus("captured");

    try {
      const stream = await cameraPromise;
      streamRef.current = stream;
      setIsCameraOpen(true);
    } catch {
      setCameraError(
        "Couldn't access the camera. Please allow camera access in your browser and try again."
      );
    }
  }, []);

  useEffect(() => {
    if (isCameraOpen && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isCameraOpen]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    if (!resultMessage) return;
    const timer = setTimeout(() => setResultMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [resultMessage]);

  const grabFrame = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return resolve(null);

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(null);

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.85);
    });
  }, []);

  // Captures a short burst of frames over CAPTURE_DURATION_MS, then sends
  // the whole sequence to the backend at once for blink-based liveness
  // checking + face matching.
  const captureAndSubmit = useCallback(async () => {
    if (isCapturingRef.current) return;
    isCapturingRef.current = true;
    setIsCapturingSequence(true);
    setCaptureProgress(0);
    setResultMessage(null);

    const frames: Blob[] = [];
    const frameCount = Math.floor(CAPTURE_DURATION_MS / CAPTURE_INTERVAL_MS);

    for (let i = 0; i < frameCount; i++) {
      const frame = await grabFrame();
      if (frame) frames.push(frame);
      setCaptureProgress(Math.round(((i + 1) / frameCount) * 100));
      await new Promise((r) => setTimeout(r, CAPTURE_INTERVAL_MS));
    }

    setIsCapturingSequence(false);

    if (frames.length === 0) {
      setResultMessage("Couldn't capture the camera feed. Please try again.");
      isCapturingRef.current = false;
      stopCamera();
      return;
    }

    const formData = new FormData();
    frames.forEach((frame, i) => {
      formData.append("frames", frame, `frame_${i}.jpg`);
    });

    // FIX — location is no longer re-fetched here. openCamera() already
    // required and cached it before the camera could even open, so by
    // the time this runs it's guaranteed to be present. The defensive
    // null check stays only for the theoretical case of permission being
    // revoked mid-flow between opening the camera and submitting — if
    // that happens, we fail here rather than silently submitting without
    // coordinates and letting the backend reject it after the fact.
    const location = locationRef.current;
    if (!location) {
      setResultMessage("Location access was lost. Please try again.");
      isCapturingRef.current = false;
      stopCamera();
      return;
    }
    formData.append("latitude", String(location.latitude));
    formData.append("longitude", String(location.longitude));
    formData.append("accuracy", String(location.accuracy));

    try {
      const response = await punchAttendance(formData).unwrap();
      setResultMessage(response.message);
      if (response.success) {
        setLastAction(response.action ?? null);
        setLastPunchDetails({
          time: response.time,
          mode: response.mode,
          device: response.device,
          latitude: response.latitude,
          longitude: response.longitude,
        });
      } else {
        setLastAction(null);
        setLastPunchDetails(null);
      }
    } catch {
      setResultMessage("Something went wrong. Please try again.");
    } finally {
      stopCamera();
      isCapturingRef.current = false;
    }
  }, [grabFrame, punchAttendance, stopCamera]);

  return {
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
    cancelCamera: stopCamera,
  };
}
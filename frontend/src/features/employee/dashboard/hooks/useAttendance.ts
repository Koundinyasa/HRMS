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
// error / unsupported browser. Never rejects — location is an enrichment,
// not a requirement, so nothing here should ever block a punch.
function getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
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
 
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<"IN" | "OUT" | null>(null);
 
  // NEW — the rest of a successful punch response (mode/device/coords/time)
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
 
  // NEW — liveness capture state, drives the "please blink" prompt + progress bar
  const [isCapturingSequence, setIsCapturingSequence] = useState(false);
  const [captureProgress, setCaptureProgress] = useState(0);
 
  // NEW — surfaces whether geolocation actually succeeded for THIS punch,
  // instead of happening silently. 'idle' before any attempt this
  // session, 'captured'/'unavailable' once captureAndSubmit has run.
  const [locationStatus, setLocationStatus] = useState<"idle" | "captured" | "unavailable">("idle");
 
  const [punchAttendance, { isLoading: isSubmitting }] = usePunchAttendanceMutation();
 
  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
 
    // FIX — stopping the tracks alone isn't always enough. As long as the
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
 
  const openCamera = useCallback(async () => {
    setResultMessage(null);
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
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
 
  // Replaces the old single-shot captureAndSubmit. Captures a short burst
  // of frames over CAPTURE_DURATION_MS, then sends the whole sequence to
  // the backend at once for blink-based liveness checking + face matching.
  const captureAndSubmit = useCallback(async () => {
    if (isCapturingRef.current) return;
    isCapturingRef.current = true;
    setIsCapturingSequence(true);
    setCaptureProgress(0);
    setResultMessage(null);
    setLocationStatus("idle");
 
    // Fired in parallel with the frame capture below, not awaited yet —
    // the browser's permission prompt (first time) or the GPS fix itself
    // overlaps with the ~2.4s capture window instead of adding extra delay.
    const locationPromise = getCurrentLocation();
 
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
 
    // By now this has almost certainly already resolved, since it started
    // before the capture loop above. If the employee denied location, or
    // it timed out, this is just null — the fields are simply omitted and
    // the backend treats it exactly like it does today (GeoFenceID stays
    // NULL, punch still succeeds).
    const location = await locationPromise;
    if (location) {
      formData.append("latitude", String(location.latitude));
      formData.append("longitude", String(location.longitude));
      setLocationStatus("captured");
    } else {
      setLocationStatus("unavailable");
    }
 
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
 
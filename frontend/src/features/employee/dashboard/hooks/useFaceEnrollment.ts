import { useCallback, useEffect, useRef, useState } from "react";
import { useEnrollFaceMutation, useCheckEnrollmentFrameMutation } from "../api/attendanceApi";
 
export interface EnrollmentStep {
  key: string;
  label: string;
  instruction: string;
}
 
export const ENROLLMENT_STEPS: EnrollmentStep[] = [
  { key: "front", label: "Look straight ahead", instruction: "Keep your face centered and look directly at the camera" },
  { key: "right", label: "Slightly turn your head right", instruction: "Just a small turn — keep most of your face visible to the camera" },
  { key: "left", label: "Slightly turn your head left", instruction: "Just a small turn — keep most of your face visible to the camera" },
  { key: "up", label: "Slightly tilt your head up", instruction: "Just a small tilt — don't look all the way up" },
  { key: "down", label: "Slightly tilt your head down", instruction: "Just a small tilt — don't look all the way down" },
];
 
// How long the pass/fail chip stays visible before auto-advancing to the
// next step. Long enough to actually read, short enough not to feel slow
// across 5 steps.
const FEEDBACK_DISPLAY_MS = 1300;
 
export interface StepFeedback {
  passed: boolean;
  message: string;
}
 
export function useFaceEnrollment() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
 
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [capturedFrames, setCapturedFrames] = useState<Blob[]>([]);
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
 
  // NEW — live per-step feedback. null = no capture attempted yet for the
  // current step; otherwise the result of the quality check for the photo
  // just taken. isCheckingFrame drives a brief "Checking..." state between
  // capture and the feedback appearing.
  const [stepFeedback, setStepFeedback] = useState<StepFeedback | null>(null);
  const [isCheckingFrame, setIsCheckingFrame] = useState(false);
 
  const [enrollFace, { isLoading: isSubmitting }] = useEnrollFaceMutation();
  const [checkFrame] = useCheckEnrollmentFrameMutation();
 
  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
 
    // Same fix as the punch flow's camera — clearing srcObject explicitly
    // is what actually releases the device on some browsers, not just
    // stopping the tracks.
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
 
    setIsCameraOpen(false);
  }, []);
 
  const openCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      streamRef.current = stream;
      setIsCameraOpen(true);
    } catch {
      setCameraError("Couldn't access the camera. Please allow camera access in your browser and try again.");
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
 
  const reset = useCallback(() => {
    setCurrentStepIndex(0);
    setCapturedFrames([]);
    setResultMessage(null);
    setIsSuccess(false);
    setCameraError(null);
    setStepFeedback(null);
    setIsCheckingFrame(false);
  }, []);
 
  // Captures one photo for the CURRENT step, runs it through the
  // lightweight live quality check, shows the result briefly, THEN
  // either advances to the next step or — if this was the last one —
  // submits all 5 to the real enrollFace endpoint. The live check is
  // purely informational: a "failed" result still advances after the
  // feedback window, since the real save at the end re-validates
  // everything anyway and requires only 2 of 5 to actually pass.
  const captureCurrentStep = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
 
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
 
    canvas.toBlob(
      async (blob) => {
        if (!blob) return;
 
        const updatedFrames = [...capturedFrames, blob];
        setCapturedFrames(updatedFrames);
        setStepFeedback(null);
        setIsCheckingFrame(true);
 
        // Live feedback — fire-and-await here (not fire-and-forget) since
        // we deliberately want the employee to see the result before
        // moving on. Failure of the check call itself fails open
        // (checkEnrollmentFrame on the backend returns passed: true if
        // Python is unreachable) — never blocks progress.
        try {
          const checkFormData = new FormData();
          checkFormData.append("frame", blob, `${ENROLLMENT_STEPS[currentStepIndex].key}.jpg`);
          const result = await checkFrame(checkFormData).unwrap();
          setStepFeedback({ passed: result.passed, message: result.message });
        } catch {
          setStepFeedback(null); // fail silent — don't show a false negative from a network blip
        } finally {
          setIsCheckingFrame(false);
        }
 
        await new Promise((r) => setTimeout(r, FEEDBACK_DISPLAY_MS));
 
        const isLastStep = currentStepIndex === ENROLLMENT_STEPS.length - 1;
 
        if (!isLastStep) {
          setStepFeedback(null);
          setCurrentStepIndex((i) => i + 1);
          return;
        }
 
        // Last step just captured — submit everything now, same as before.
        stopCamera();
        const formData = new FormData();
        updatedFrames.forEach((frame, i) => {
          formData.append("frames", frame, `${ENROLLMENT_STEPS[i].key}.jpg`);
        });
 
        try {
          const response = await enrollFace(formData).unwrap();
          setResultMessage(response.message);
          setIsSuccess(response.success);
        } catch {
          setResultMessage("Something went wrong. Please try again.");
          setIsSuccess(false);
        }
      },
      "image/jpeg",
      0.85
    );
  }, [capturedFrames, currentStepIndex, enrollFace, checkFrame, stopCamera]);
 
  return {
    videoRef,
    canvasRef,
    isCameraOpen,
    cameraError,
    currentStepIndex,
    currentStep: ENROLLMENT_STEPS[currentStepIndex],
    totalSteps: ENROLLMENT_STEPS.length,
    resultMessage,
    isSuccess,
    isSubmitting,
    stepFeedback,
    isCheckingFrame,
    openCamera,
    captureCurrentStep,
    cancelCamera: stopCamera,
    reset,
  };
}
 
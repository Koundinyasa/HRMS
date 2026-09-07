import { useEffect } from "react";
import { Camera, CheckCircle2, X, Check, AlertTriangle, Loader2 } from "lucide-react";
import { useFaceEnrollment, ENROLLMENT_STEPS } from "../hooks/useFaceEnrollment";
 
interface FaceEnrollmentModalProps {
  onClose: () => void;
}
 
export default function FaceEnrollmentModal({ onClose }: FaceEnrollmentModalProps) {
  const {
    videoRef,
    canvasRef,
    isCameraOpen,
    cameraError,
    currentStepIndex,
    currentStep,
    totalSteps,
    resultMessage,
    isSuccess,
    isSubmitting,
    stepFeedback,
    isCheckingFrame,
    openCamera,
    captureCurrentStep,
    cancelCamera,
  } = useFaceEnrollment();
 
  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [isSuccess, onClose]);
 
  const handleClose = () => {
    if (isCameraOpen) cancelCamera();
    onClose();
  };
 
  const isDone = resultMessage !== null;
 
  // Capture button is disabled while checking the just-taken photo and
  // during the brief feedback display window — prevents double-capturing
  // before the employee has even seen the result of the last one.
  const isBusyWithStep = isCheckingFrame || stepFeedback !== null;
 
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#0f1420] border border-[#1f2a3d] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2a3d]">
          <h3 className="text-white text-base font-medium">Register Your Face</h3>
          <button type="button" onClick={handleClose} aria-label="Close" className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
 
        <div className="p-5">
          {isDone ? (
            // ── Final result screen ──────────────────────────────────
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              {isSuccess && <CheckCircle2 size={40} className="text-emerald-400" />}
              <p className={`text-sm ${isSuccess ? "text-emerald-400" : "text-rose-400"}`}>
                {resultMessage}
              </p>
              {!isSuccess && (
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-2 h-9 px-4 rounded-lg text-xs font-medium text-white bg-blue-600 hover:bg-blue-500"
                >
                  Try Again
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Step progress dots */}
              <div className="flex items-center justify-center gap-1.5 mb-4">
                {ENROLLMENT_STEPS.map((step, i) => (
                  <div
                    key={step.key}
                    className={`h-1.5 rounded-full transition-all ${
                      i < currentStepIndex
                        ? "w-6 bg-emerald-500"
                        : i === currentStepIndex
                        ? "w-6 bg-blue-500"
                        : "w-1.5 bg-white/20"
                    }`}
                  />
                ))}
              </div>
 
              <p className="text-center text-xs text-slate-400 mb-1">
                Step {currentStepIndex + 1} of {totalSteps}
              </p>
              <p className="text-center text-white text-sm font-medium mb-4">
                {currentStep.label}
              </p>
 
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-black border border-[#1f2a3d] flex items-center justify-center">
                {isCameraOpen ? (
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                ) : (
                  <p className="text-slate-500 text-sm text-center px-6">
                    Tap "Start Camera" to begin registering your face.
                  </p>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
 
              {/* NEW — live per-step feedback, appears right after a
                  capture, before auto-advancing to the next angle.
                  Purely informational: even a "failed" result still
                  advances after the display window — the real save at
                  the end re-validates everything and only needs 2 of 5
                  to actually pass. */}
              {isCheckingFrame && (
                <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <Loader2 size={13} className="animate-spin" />
                  Checking...
                </div>
              )}
              {stepFeedback && (
                <div
                  className={`mt-3 flex items-center justify-center gap-1.5 text-xs font-medium py-2 px-3 rounded-lg ${
                    stepFeedback.passed
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                  }`}
                >
                  {stepFeedback.passed ? <Check size={13} /> : <AlertTriangle size={13} />}
                  {stepFeedback.message}
                </div>
              )}
 
              {!isCameraOpen && !stepFeedback && !isCheckingFrame && (
                <p className="mt-3 text-xs text-slate-400 text-center">{currentStep.instruction}</p>
              )}
 
              {cameraError && <p className="mt-3 text-sm text-rose-400 text-center">{cameraError}</p>}
 
              {!isCameraOpen ? (
                <button
                  type="button"
                  onClick={openCamera}
                  className="mt-4 w-full h-11 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2"
                >
                  <Camera size={16} />
                  Start Camera
                </button>
              ) : (
                <button
                  type="button"
                  onClick={captureCurrentStep}
                  disabled={isSubmitting || isBusyWithStep}
                  className="mt-4 w-full h-11 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? "Registering..."
                    : isBusyWithStep
                    ? "..."
                    : currentStepIndex === totalSteps - 1
                    ? "Capture & Finish"
                    : "Capture"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
 

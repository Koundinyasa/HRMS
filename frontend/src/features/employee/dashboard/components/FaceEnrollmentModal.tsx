import { useEffect } from "react";
import { Camera, CheckCircle2, X, Check, AlertTriangle, Loader2 } from "lucide-react";
import { useFaceEnrollment, ENROLLMENT_STEPS } from "../hooks/useFaceEnrollment";
 
interface FaceEnrollmentModalProps {
  onClose: () => void;
}
 
// Reference pose illustrations. Deliberately NOT a rotated copy of the
// same shape per angle -- each one is drawn distinctly, showing the actual
// real difference for that pose (a genuine 3/4 profile for left/right,
// real chin-up/chin-down for up/down), so the DEGREE of turn/tilt reads
// clearly, not just the general direction.
//
// HONEST LIMITATION -- these are illustrations, not real photographs. No
// amount of refining these paths makes them photorealistic; that's a
// medium limitation, not something more polish fixes. Genuine photo
// references would need real captured/licensed photos, which don't exist
// for this project yet.
const SKIN = "#e8b894";
const SKIN_SHADE = "#c9946a";
const HAIR = "#2b2320";
const FEATURE = "#3a2b20";
 
const REFERENCE_SVG: Record<string, string> = {
  front: `
    <ellipse cx="50" cy="58" rx="26" ry="30" fill="${SKIN}"/>
    <ellipse cx="22" cy="55" rx="4" ry="7" fill="${SKIN}"/>
    <ellipse cx="78" cy="55" rx="4" ry="7" fill="${SKIN}"/>
    <path d="M24 40 Q50 20 76 40 L76 48 Q50 28 24 48 Z" fill="${HAIR}"/>
    <ellipse cx="40" cy="54" rx="3" ry="2.3" fill="${FEATURE}"/>
    <ellipse cx="60" cy="54" rx="3" ry="2.3" fill="${FEATURE}"/>
    <path d="M35 47 Q40 44 45 47" stroke="${FEATURE}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M55 47 Q60 44 65 47" stroke="${FEATURE}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M50 56 L48 65 Q50 67 52 65" stroke="${SKIN_SHADE}" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M41 74 Q50 79 59 74" stroke="#a8623f" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  `,
  right: `
    <path d="M32 58 Q30 30 55 26 Q78 30 76 58 Q76 78 55 84 Q34 78 32 58 Z" fill="${SKIN}"/>
    <ellipse cx="30" cy="56" rx="4.5" ry="7.5" fill="${SKIN}"/>
    <path d="M32 38 Q55 20 76 38 L75 46 Q55 30 33 46 Z" fill="${HAIR}"/>
    <path d="M40 55 Q44 52 48 55" stroke="${FEATURE}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <ellipse cx="44" cy="57" rx="2.6" ry="2.1" fill="${FEATURE}"/>
    <path d="M56 50 Q62 56 58 63" stroke="${SKIN_SHADE}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M44 73 Q52 77 60 72" stroke="#a8623f" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  `,
  left: `
    <path d="M68 58 Q70 30 45 26 Q22 30 24 58 Q24 78 45 84 Q66 78 68 58 Z" fill="${SKIN}"/>
    <ellipse cx="70" cy="56" rx="4.5" ry="7.5" fill="${SKIN}"/>
    <path d="M68 38 Q45 20 24 38 L25 46 Q45 30 67 46 Z" fill="${HAIR}"/>
    <path d="M60 55 Q56 52 52 55" stroke="${FEATURE}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <ellipse cx="56" cy="57" rx="2.6" ry="2.1" fill="${FEATURE}"/>
    <path d="M44 50 Q38 56 42 63" stroke="${SKIN_SHADE}" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M56 73 Q48 77 40 72" stroke="#a8623f" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  `,
  up: `
    <ellipse cx="50" cy="66" rx="25" ry="26" fill="${SKIN}"/>
    <rect x="40" y="86" width="20" height="12" fill="${SKIN}"/>
    <path d="M27 54 Q50 42 73 54 L73 60 Q50 50 27 60 Z" fill="${HAIR}"/>
    <ellipse cx="41" cy="62" rx="2.8" ry="2" fill="${FEATURE}"/>
    <ellipse cx="59" cy="62" rx="2.8" ry="2" fill="${FEATURE}"/>
    <path d="M36 56 Q41 54 46 56" stroke="${FEATURE}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M54 56 Q59 54 64 56" stroke="${FEATURE}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="46" cy="70" rx="2" ry="1.4" fill="${SKIN_SHADE}"/>
    <ellipse cx="54" cy="70" rx="2" ry="1.4" fill="${SKIN_SHADE}"/>
    <path d="M42 82 Q50 86 58 82" stroke="#a8623f" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  `,
  down: `
    <ellipse cx="50" cy="50" rx="25" ry="27" fill="${SKIN}"/>
    <path d="M24 38 Q50 16 76 38 L76 50 Q50 32 24 50 Z" fill="${HAIR}"/>
    <path d="M38 52 Q41 55 44 52" stroke="${FEATURE}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M56 52 Q59 55 62 52" stroke="${FEATURE}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M35 46 Q40 44 45 47" stroke="${FEATURE}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M55 47 Q60 44 65 46" stroke="${FEATURE}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M50 55 L48 62 Q50 64 52 62" stroke="${SKIN_SHADE}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <path d="M42 68 Q50 71 58 68" stroke="#a8623f" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  `,
};
 
const REFERENCE_CAPTION: Record<string, string> = {
  front: "Face forward, chin level, both ears visible",
  right: "Turn just enough to show your left cheek and ear",
  left: "Turn just enough to show your right cheek and ear",
  up: "Raise your chin a little, don't look all the way up",
  down: "Lower your chin a little, don't look all the way down",
};
 
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
  const isBusyWithStep = isCheckingFrame || stepFeedback !== null;
 
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-[480px] rounded-2xl bg-[#0f1420] border border-[#1f2a3d] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1f2a3d]">
          <h3 className="text-white text-base font-medium">Register Your Face</h3>
          <button type="button" onClick={handleClose} aria-label="Close" className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
 
        <div className="p-5">
          {isDone ? (
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
 
              <div className="flex gap-3.5">
                <div className="flex-[1.15] relative aspect-[4/5] rounded-xl overflow-hidden bg-black border border-[#1f2a3d] flex items-center justify-center">
                  {isCameraOpen ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  ) : (
                    <p className="text-slate-500 text-xs text-center px-4">
                      Tap "Start Camera" to begin registering your face.
                    </p>
                  )}
                </div>
 
                <div className="flex-1 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 flex flex-col items-center justify-center px-2 py-3">
                  <span className="text-[9.5px] font-semibold uppercase tracking-wider text-emerald-400 mb-1.5">
                    Example
                  </span>
                  <svg
                    viewBox="0 0 100 100"
                    className="w-[76px] h-[76px]"
                    dangerouslySetInnerHTML={{ __html: REFERENCE_SVG[currentStep.key] }}
                  />
                  <p className="text-[10px] text-slate-400 text-center leading-snug mt-2">
                    {REFERENCE_CAPTION[currentStep.key]}
                  </p>
                </div>
              </div>
 
              <canvas ref={canvasRef} className="hidden" />
 
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
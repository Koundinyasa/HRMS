import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { formatMinutesSeconds, useSessionRemainingSeconds } from "../hooks/useSessionClock";
import { SESSION_WARNING_SECONDS } from "@/shared/constants/session";

/**
 * Warns the user when the session has 5 minutes left (25 minutes into a
 * 30-minute session). It cannot be extended, so the message says to save work.
 * Shown once per session; closing it hides it until the next sign-in.
 */
export default function SessionExpiryWarning() {
  const remaining = useSessionRemainingSeconds();
  const [dismissed, setDismissed] = useState(false);

  // A new session starts with plenty of time left: show the warning again then.
  useEffect(() => {
    if (remaining !== null && remaining > SESSION_WARNING_SECONDS) setDismissed(false);
  }, [remaining]);

  if (remaining === null || remaining <= 0 || remaining > SESSION_WARNING_SECONDS || dismissed) {
    return null;
  }

  return (
    <div
      role="alert"
      className="fixed left-1/2 top-4 z-[1000] w-[min(92vw,26rem)] -translate-x-1/2 rounded-lg border border-amber-300 bg-amber-50 p-3 shadow-lg"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 shrink-0 text-amber-600" size={20} aria-hidden="true" />
        <div className="min-w-0 flex-1 text-sm text-amber-900">
          <p className="font-semibold">
            Your session ends in {formatMinutesSeconds(remaining)}
          </p>
          <p className="mt-0.5">
            For security, you will be signed out automatically. Please save your work; you
            can sign in again straight away.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Close warning"
          className="shrink-0 rounded p-1 text-amber-700 hover:bg-amber-100"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

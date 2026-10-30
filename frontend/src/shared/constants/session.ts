/**
 * How long a signed-in user may stay idle (no mouse, key or touch activity)
 * before the app signs them out. Set VITE_IDLE_TIMEOUT_MINUTES in
 * frontend/.env to change it; the default is 5 minutes.
 */
const DEFAULT_IDLE_MINUTES = 5;

function readIdleMinutes(): number {
  const raw = Number(import.meta.env.VITE_IDLE_TIMEOUT_MINUTES);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_IDLE_MINUTES;
}

export const IDLE_TIMEOUT_MS: number = readIdleMinutes() * 60 * 1000;

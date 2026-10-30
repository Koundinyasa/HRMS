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

/**
 * How often the tab in use tells the server the login is still open. This is
 * also how fast a tab notices that its login was ended (for example the same
 * account signed in on another device). Set VITE_HEARTBEAT_SECONDS to change
 * it; the default is 5 seconds, allowed range 2 to 60.
 */
const DEFAULT_HEARTBEAT_SECONDS = 5;

function readHeartbeatSeconds(): number {
  const raw = Number(import.meta.env.VITE_HEARTBEAT_SECONDS);
  if (!Number.isFinite(raw) || raw <= 0) return DEFAULT_HEARTBEAT_SECONDS;
  return Math.min(60, Math.max(2, raw));
}

export const HEARTBEAT_MS: number = readHeartbeatSeconds() * 1000;

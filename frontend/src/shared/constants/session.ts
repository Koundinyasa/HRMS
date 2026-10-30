/**
 * How long a signed-in user may stay idle (no mouse, click, key, scroll or
 * touch activity) before the app signs them out. Set VITE_IDLE_TIMEOUT_MINUTES
 * in frontend/.env to change it; the default is 5 minutes. Keep it equal to
 * SESSION_IDLE_MINUTES in backend/.env, which is the server's own limit.
 * This is separate from the session's 30-minute limit, which activity never
 * extends.
 */
const DEFAULT_IDLE_MINUTES = 5;

function readIdleMinutes(): number {
  const raw = Number(import.meta.env.VITE_IDLE_TIMEOUT_MINUTES);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_IDLE_MINUTES;
}

export const IDLE_TIMEOUT_MS: number = readIdleMinutes() * 60 * 1000;

/**
 * Show the "session ends soon" warning when this many seconds are left. With
 * the server's 30-minute limit that is 25 minutes after sign-in.
 */
export const SESSION_WARNING_SECONDS = 5 * 60;

/**
 * Renew the login (quietly, and only for a user who is active) when the idle
 * window has this much time left: a third of the idle timeout, at most 90
 * seconds. With a 5-minute window the renewal happens about 3.5 minutes after
 * the last one.
 */
export const RENEW_BEFORE_IDLE_MS: number = Math.min(90 * 1000, IDLE_TIMEOUT_MS / 3);

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

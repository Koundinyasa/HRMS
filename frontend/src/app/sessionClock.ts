/**
 * How much time the current login has left, as the server last reported it.
 *
 * The server sends DURATIONS (seconds left), never clock times, so a wrong
 * clock on this computer cannot shorten or lengthen the session. Each report
 * is turned into a point in this browser's own time (now + seconds left) and
 * everything else (the header countdown, the warning, the automatic sign-out,
 * the silent refresh) counts down from those two points.
 *
 *   expiresAt      the hard limit (30 minutes after sign-in). Never moves.
 *   idleExpiresAt  when the login ends unless the user is active and the app
 *                  renews it. Moves forward on every renewal.
 *
 * Reports come from: sign-in, GET /auth/me (page reload), every refresh and
 * every heartbeat. Nothing here is a secret.
 */
export interface SessionTimingDto {
  /** Seconds until the absolute limit. */
  expiresInSeconds: number;
  /** Seconds until the idle window ends unless the login is renewed. */
  idleExpiresInSeconds: number;
}

export interface SessionTimingSnapshot {
  expiresAt: number | null;
  idleExpiresAt: number | null;
}

// Rounding in the reports moves a point by a second or so; ignore that so the
// countdown never steps backwards.
const JITTER_MS = 2000;

let snapshot: SessionTimingSnapshot = { expiresAt: null, idleExpiresAt: null };
const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((fn) => fn());
}

function valid(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

export function setSessionTiming(
  timing: Partial<SessionTimingDto> | null | undefined,
  now: number = Date.now(),
): void {
  if (!timing || !valid(timing.expiresInSeconds) || !valid(timing.idleExpiresInSeconds)) return;

  const settle = (old: number | null, next: number) =>
    old !== null && Math.abs(old - next) < JITTER_MS ? old : next;

  const expiresAt = settle(snapshot.expiresAt, now + timing.expiresInSeconds * 1000);
  const idleExpiresAt = settle(snapshot.idleExpiresAt, now + timing.idleExpiresInSeconds * 1000);
  if (expiresAt === snapshot.expiresAt && idleExpiresAt === snapshot.idleExpiresAt) return;

  snapshot = { expiresAt, idleExpiresAt };
  emit();
}

export function clearSessionTiming(): void {
  if (snapshot.expiresAt === null && snapshot.idleExpiresAt === null) return;
  snapshot = { expiresAt: null, idleExpiresAt: null };
  emit();
}

/** The same object until something changes (needed by useSyncExternalStore). */
export function getSessionTiming(): SessionTimingSnapshot {
  return snapshot;
}

export function subscribeSessionTiming(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

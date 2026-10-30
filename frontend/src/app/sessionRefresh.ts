import { API_BASE_URL } from './apiConfig';
import { setSessionTiming } from './sessionClock';

/**
 * Asks the server for a fresh access cookie using the refresh cookie.
 *
 *   ok          new cookies were issued
 *   expired     the server says the session is over (log the user out)
 *   unavailable we could not find out (network down, server error, too many
 *               tries); keep the user logged in and let them try again
 *
 * Several requests can fail with 401 at the same moment. They all share ONE
 * refresh call, because every refresh replaces the refresh cookie and a second
 * parallel call would look like a stolen token.
 */
export type RefreshOutcome = 'ok' | 'expired' | 'unavailable';

const RACE_RETRIES = 2;
const RACE_DELAY_MS = 400;

let inFlight: Promise<RefreshOutcome> | null = null;
let lastRefreshOkAt = 0;
// Why the last refresh was refused (SESSION_REPLACED, SESSION_ENDED, ...).
let lastEndCode: string | undefined;

/** The `code` field of a JSON error response, if it has one. */
export async function codeFromResponse(res: Response): Promise<string | undefined> {
  try {
    const body = await res.clone().json();
    return typeof body?.code === 'string' ? body.code : undefined;
  } catch {
    return undefined;
  }
}

/** Why the session ended, as reported by the last refused refresh. */
export function getLastSessionEndCode(): string | undefined {
  return lastEndCode;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function callRefresh(): Promise<RefreshOutcome> {
  lastEndCode = undefined;
  for (let attempt = 0; attempt <= RACE_RETRIES; attempt++) {
    let res: Response;
    try {
      res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch {
      return 'unavailable';
    }

    if (res.ok) {
      lastRefreshOkAt = Date.now();
      // The answer says how long the renewed login lasts; the countdown and
      // the idle window follow it.
      try {
        const body = await res.clone().json();
        setSessionTiming(body?.session);
      } catch {
        /* no body: the next heartbeat reports the time */
      }
      return 'ok';
    }
    if (res.status === 401) {
      lastEndCode = await codeFromResponse(res);
      return 'expired';
    }

    // 409: another tab refreshed at the same moment. Its new cookie is already
    // in the browser, so wait a moment and try again with it.
    if (res.status === 409) {
      await sleep(RACE_DELAY_MS * (attempt + 1));
      continue;
    }
    return 'unavailable';
  }
  return 'unavailable';
}

export function refreshSession(): Promise<RefreshOutcome> {
  if (!inFlight) {
    inFlight = callRefresh().finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}

/** When the last successful refresh finished (ms since epoch, 0 if none yet). */
export function getLastRefreshAt(): number {
  return lastRefreshOkAt;
}

// Under /auth/ a 401 normally means "wrong credentials / wrong code", not
// "your login ran out", so those calls must not trigger a refresh. These
// are the exceptions: they need a logged-in user.
const REFRESHABLE_AUTH_PATHS = [
  '/auth/me',
  '/auth/heartbeat',
  '/auth/change-password',
  '/auth/reset-password',
];

/** Should a 401 on this path be answered with a refresh and one retry? */
export function isRefreshablePath(url: string): boolean {
  let path = url.split('?')[0];
  if (/^https?:\/\//i.test(path)) {
    try {
      path = new URL(path).pathname;
    } catch {
      return true;
    }
  }
  if (path.startsWith('/api/')) path = path.slice(4);
  return !path.startsWith('/auth/') || REFRESHABLE_AUTH_PATHS.includes(path);
}

// Callers outside Redux (plain fetch, axios) cannot dispatch, so the store
// registers one function here that marks the user as logged out.
// `code` says why, when the server told us (see authErrorCodes.ts).
let sessionExpiredHandler: ((code?: string) => void) | null = null;

export function setSessionExpiredHandler(handler: (code?: string) => void): void {
  sessionExpiredHandler = handler;
}

export function notifySessionExpired(code?: string): void {
  sessionExpiredHandler?.(code);
}

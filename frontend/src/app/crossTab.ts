/**
 * Tells the other tabs of this browser that the user was signed out, so they
 * go to the login page too instead of waiting for their next request.
 * (Tabs share the login cookies, so one sign-out ends the login everywhere.)
 *
 * Two routes carry the message, so it still arrives if one is unavailable:
 *  - a BroadcastChannel (instant), and
 *  - a localStorage write, which other tabs see as a `storage` event. (Some
 *    browsers and privacy modes block one of the two.)
 * A tab that hears it twice does nothing the second time.
 */
const CHANNEL_NAME = 'hrms-auth';
const STORAGE_KEY = 'hrms_signed_out';
// A message older than this is a leftover from a previous visit, not news.
const STORAGE_MESSAGE_MAX_AGE_MS = 15000;

let channel: BroadcastChannel | null | undefined;

function getChannel(): BroadcastChannel | null {
  if (channel !== undefined) return channel;
  try {
    channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel(CHANNEL_NAME);
  } catch {
    channel = null;
  }
  return channel;
}

/** Call after this tab signed out or learned the login is over. */
export function broadcastSignedOut(code?: string): void {
  try {
    getChannel()?.postMessage({ type: 'signed-out', code });
  } catch {
    /* the storage route or the next request will tell the other tabs */
  }
  try {
    // The value changes every time, because a storage event only fires when it does.
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ code: code ?? null, ts: Date.now(), n: Math.random() }),
    );
  } catch {
    /* storage blocked */
  }
}

/** Runs the handler when ANOTHER tab signs out. Returns a function that stops listening. */
export function onSignedOutElsewhere(handler: (code?: string) => void): () => void {
  const stops: Array<() => void> = [];

  const ch = getChannel();
  if (ch) {
    const listener = (event: MessageEvent) => {
      if (event.data?.type === 'signed-out') {
        handler(typeof event.data.code === 'string' ? event.data.code : undefined);
      }
    };
    ch.addEventListener('message', listener);
    stops.push(() => ch.removeEventListener('message', listener));
  }

  if (typeof window !== 'undefined') {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      try {
        const message = JSON.parse(event.newValue);
        if (Date.now() - Number(message?.ts) > STORAGE_MESSAGE_MAX_AGE_MS) return;
        handler(typeof message?.code === 'string' ? message.code : undefined);
      } catch {
        /* not our message */
      }
    };
    window.addEventListener('storage', onStorage);
    stops.push(() => window.removeEventListener('storage', onStorage));
  }

  return () => stops.forEach((stop) => stop());
}

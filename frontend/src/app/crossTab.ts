/**
 * Tells the other tabs of this browser that the user was signed out, so they
 * go to the login page too instead of waiting for their next request.
 * (Tabs share the login cookies, so one sign-out ends the login everywhere.)
 */
const CHANNEL_NAME = 'hrms-auth';

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
    /* other tabs will find out on their next request */
  }
}

/** Runs the handler when ANOTHER tab signs out. Returns a function that stops listening. */
export function onSignedOutElsewhere(handler: (code?: string) => void): () => void {
  const ch = getChannel();
  if (!ch) return () => undefined;
  const listener = (event: MessageEvent) => {
    if (event.data?.type === 'signed-out') {
      handler(typeof event.data.code === 'string' ? event.data.code : undefined);
    }
  };
  ch.addEventListener('message', listener);
  return () => ch.removeEventListener('message', listener);
}

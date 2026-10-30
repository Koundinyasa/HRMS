/**
 * "Did the user do anything?" for the whole browser.
 *
 * Mouse, click, key, scroll and touch all count. The time of the last action
 * is kept in memory and, so that several tabs of one browser agree, also in
 * localStorage (a timestamp only, not a secret). Sign-out for inactivity and
 * the decision to renew the login both read it.
 */
const LAST_ACTIVITY_KEY = 'hrms_last_activity';

// scroll does not bubble, so listen in the capture phase to also see scrolling
// inside inner panels.
const ACTIVITY_EVENTS = [
  'mousemove',
  'mousedown',
  'click',
  'keydown',
  'scroll',
  'wheel',
  'touchstart',
  'touchmove',
  'pointerdown',
] as const;

// The browser fires mousemove very often; write to storage at most this often.
const WRITE_EVERY_MS = 2000;

let lastActivity = Date.now();
let lastWrite = 0;

function readStored(): number {
  try {
    return Number(localStorage.getItem(LAST_ACTIVITY_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeStored(now: number): void {
  try {
    localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
  } catch {
    /* storage can be blocked; this tab still works on its own */
  }
}

/** Record that the user did something (default: just now). */
export function markActivity(now: number = Date.now()): void {
  lastActivity = now;
  if (now - lastWrite >= WRITE_EVERY_MS) {
    lastWrite = now;
    writeStored(now);
  }
}

/** The time of the user's last action in any tab of this browser (ms since epoch). */
export function getLastActivity(): number {
  return Math.max(lastActivity, readStored());
}

/** Start listening for user actions. Returns a function that stops. */
export function startActivityTracking(): () => void {
  const onActivity = () => markActivity();
  const options: AddEventListenerOptions = { capture: true, passive: true };
  ACTIVITY_EVENTS.forEach((type) => window.addEventListener(type, onActivity, options));
  return () => {
    ACTIVITY_EVENTS.forEach((type) => window.removeEventListener(type, onActivity, options));
  };
}

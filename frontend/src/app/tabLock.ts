/**
 * One tab at a time.
 *
 * The first tab to open the signed-in app owns a lock; a second tab shows
 * "open in another tab" with a button to take over. The lock is a small record
 * in localStorage ({ id, ts }) that the owner refreshes every few seconds. A
 * record that has not been refreshed for STALE_MS belongs to a tab that has
 * gone (crashed or killed) and can be taken freely.
 *
 * The record holds a random tab id and a timestamp only, no user data.
 */
/**
 * 'blocked'  : another tab already owns the app when this tab opens.
 * 'replaced' : this tab owned the app and another tab took it over. The app
 *              signs this tab out and shows the login page.
 */
export type TabLockStatus = 'checking' | 'active' | 'blocked' | 'replaced';

export const TAB_LOCK_KEY = 'hrms_active_tab';
export const BEAT_MS = 4000;
export const STALE_MS = 12000;
const CHANNEL_NAME = 'hrms-tab-lock';

interface LockRecord {
  id: string;
  ts: number;
}

export interface TabLockChannel {
  postMessage(message: unknown): void;
  onMessage(listener: (message: any) => void): void;
  close(): void;
}

/** Everything the lock needs from the browser, so it can be tested without one. */
export interface TabLockDeps {
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null;
  channel: TabLockChannel | null;
  now: () => number;
  setInterval: (fn: () => void, ms: number) => unknown;
  clearInterval: (handle: unknown) => void;
  /** Subscribe to a window event; returns the unsubscribe function. */
  onWindow: (type: 'storage' | 'pagehide', fn: (event: any) => void) => () => void;
  newId: () => string;
}

export function browserDeps(): TabLockDeps {
  let storage: TabLockDeps['storage'] = null;
  try {
    storage = window.localStorage;
  } catch {
    storage = null;
  }

  let channel: TabLockChannel | null = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const bc = new BroadcastChannel(CHANNEL_NAME);
      channel = {
        postMessage: (m) => bc.postMessage(m),
        onMessage: (fn) => bc.addEventListener('message', (e) => fn(e.data)),
        close: () => bc.close(),
      };
    }
  } catch {
    channel = null;
  }

  return {
    storage,
    channel,
    now: () => Date.now(),
    setInterval: (fn, ms) => window.setInterval(fn, ms),
    clearInterval: (h) => window.clearInterval(h as number),
    onWindow: (type, fn) => {
      window.addEventListener(type, fn);
      return () => window.removeEventListener(type, fn);
    },
    newId: () =>
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  };
}

export interface TabLock {
  start(): void;
  /** Take the lock from the tab that has it; that tab becomes blocked. */
  takeOver(): void;
  stop(): void;
}

export function createTabLock(
  onChange: (status: TabLockStatus) => void,
  deps: TabLockDeps = browserDeps(),
): TabLock {
  const id = deps.newId();
  let status: TabLockStatus = 'checking';
  let timer: unknown;
  const unsubscribers: Array<() => void> = [];

  const setStatus = (next: TabLockStatus) => {
    if (next === status) return;
    status = next;
    onChange(next);
  };

  const parse = (raw: string | null): LockRecord | null => {
    if (!raw) return null;
    try {
      const value = JSON.parse(raw);
      return typeof value?.id === 'string' && typeof value?.ts === 'number' ? value : null;
    } catch {
      return null;
    }
  };

  const read = (): LockRecord | null => {
    try {
      return parse(deps.storage?.getItem(TAB_LOCK_KEY) ?? null);
    } catch {
      return null;
    }
  };

  /** false when the browser refuses to store anything. */
  const write = (): boolean => {
    try {
      deps.storage?.setItem(TAB_LOCK_KEY, JSON.stringify({ id, ts: deps.now() }));
      return true;
    } catch {
      return false;
    }
  };

  const release = () => {
    try {
      if (status === 'active' && read()?.id === id) deps.storage?.removeItem(TAB_LOCK_KEY);
    } catch {
      /* nothing to release */
    }
  };

  const claim = () => {
    if (!deps.storage || !write()) {
      // No storage (private mode, blocked): the rule cannot be enforced, so
      // never lock the user out because of it.
      setStatus('active');
      return;
    }
    setStatus(read()?.id === id ? 'active' : 'blocked');
  };

  return {
    start() {
      const current = read();
      const free = !current || current.id === id || deps.now() - current.ts > STALE_MS;
      if (free) claim();
      else setStatus('blocked');

      // The owner refreshes its record; a lost lock (someone took over while
      // the message was missed) means this tab was replaced.
      timer = deps.setInterval(() => {
        if (status !== 'active' || !deps.storage) return;
        const cur = read();
        if (cur && cur.id !== id) setStatus('replaced');
        else write();
      }, BEAT_MS);

      // Another tab wrote the record: if it is not us, we lost the lock.
      unsubscribers.push(
        deps.onWindow('storage', (event) => {
          if (event?.key !== TAB_LOCK_KEY || status !== 'active') return;
          const other = parse(event.newValue ?? null);
          if (other && other.id !== id) setStatus('replaced');
        }),
      );
      unsubscribers.push(deps.onWindow('pagehide', release));

      deps.channel?.onMessage((message) => {
        if (message?.type === 'takeover' && message.id !== id && status === 'active') {
          setStatus('replaced');
        }
      });
    },

    takeOver() {
      write();
      setStatus('active');
      deps.channel?.postMessage({ type: 'takeover', id });
    },

    stop() {
      if (timer !== undefined) deps.clearInterval(timer);
      release();
      unsubscribers.splice(0).forEach((fn) => fn());
      deps.channel?.close();
    },
  };
}

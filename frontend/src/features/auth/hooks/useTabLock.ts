import { useCallback, useEffect, useRef, useState } from 'react';
import { createTabLock } from '@/app/tabLock';
import type { TabLock, TabLockStatus } from '@/app/tabLock';

/**
 * Only one tab may use the signed-in app. `status` is 'checking' for an
 * instant, then 'active' (this tab owns the app) or 'blocked' (another tab
 * does; show the "open in another tab" screen and call takeOver to switch).
 */
export function useTabLock(enabled: boolean): { status: TabLockStatus; takeOver: () => void } {
  const [status, setStatus] = useState<TabLockStatus>('checking');
  const lockRef = useRef<TabLock | null>(null);

  useEffect(() => {
    if (!enabled) {
      setStatus('checking');
      return;
    }
    const lock = createTabLock(setStatus);
    lockRef.current = lock;
    lock.start();
    return () => {
      lock.stop();
      lockRef.current = null;
    };
  }, [enabled]);

  const takeOver = useCallback(() => lockRef.current?.takeOver(), []);

  return { status, takeOver };
}

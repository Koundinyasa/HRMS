import { API_BASE_URL } from './apiConfig';
import {
  getLastRefreshAt,
  isRefreshablePath,
  notifySessionExpired,
  refreshSession,
} from './sessionRefresh';

/**
 * Turns a path into a full address on the backend.
 *   "/reports/x"      -> <API_BASE_URL>/reports/x
 *   "/api/reports/x"  -> <API_BASE_URL>/reports/x   (older code wrote "/api/...")
 *   "https://..."     -> unchanged
 */
export function apiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  let p = path.startsWith('/') ? path : `/${path}`;
  if (p === '/api') p = '';
  else if (p.startsWith('/api/')) p = p.slice(4);
  return `${API_BASE_URL}${p}`;
}

/**
 * fetch() for the backend. Use this instead of a bare fetch():
 *  - always sends the login cookies,
 *  - on 401 refreshes the session once and repeats the request once,
 *  - if the session is really over, marks the user as logged out.
 * The response is returned exactly like fetch() returns it, so callers keep
 * their own `res.ok` / `res.json()` handling.
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return fetchWithSession(apiUrl(path), init);
}

/**
 * Same as apiFetch, but the address is used exactly as given. For files served
 * outside the /api prefix (for example "/documents/..."), which apiFetch would
 * rewrite onto the API address.
 */
export async function fetchWithSession(url: string, init: RequestInit = {}): Promise<Response> {
  const send = () => fetch(url, { credentials: 'include', ...init });

  const startedAt = Date.now();
  let res = await send();

  if (res.status !== 401 || !isRefreshablePath(url)) return res;

  // Another request may already have refreshed after this one started.
  if (getLastRefreshAt() < startedAt) {
    const outcome = await refreshSession();
    if (outcome === 'expired') {
      notifySessionExpired();
      return res;
    }
    if (outcome === 'unavailable') return res;
  }

  res = await send();
  if (res.status === 401) notifySessionExpired();
  return res;
}

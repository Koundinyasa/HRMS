import { fetchWithSession } from './apiFetch';

/**
 * Helpers for files that are protected by the login (for example everything
 * under /documents and the chatbot exports).
 *
 * A plain <a href>, <iframe src> or window.open() sends the cookies but cannot
 * refresh an expired 15-minute access token. These helpers load the file with
 * fetchWithSession (which refreshes the session once and retries), then hand
 * the browser a local blob address, so the file always opens.
 */

/** Full URLs stay as they are; other paths get exactly one leading slash. */
export function resolveFileUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return path.startsWith('/') ? path : `/${path}`;
}

function failureMessage(status: number): string {
  if (status === 404) return 'File not found on the server.';
  if (status === 401) return 'Your session has ended. Please sign in again.';
  if (status === 403) return 'You are not allowed to open this file.';
  return 'Could not load the file.';
}

/** Loads a protected file. Throws an Error with a readable message on failure. */
export async function fetchFileBlob(url: string): Promise<Blob> {
  const res = await fetchWithSession(url, { method: 'GET' });
  if (!res.ok) throw new Error(failureMessage(res.status));

  // The dev server answers unknown paths with the app's own HTML page.
  const type = (res.headers.get('Content-Type') || '').toLowerCase();
  if (type.includes('text/html')) throw new Error('Could not load the file.');

  const blob = await res.blob();
  if (!blob.size) throw new Error('The file is empty.');
  return blob;
}

/** Loads a protected file and returns a blob address you can use as src/href. */
export async function fetchFileObjectUrl(url: string): Promise<string> {
  return URL.createObjectURL(await fetchFileBlob(url));
}

/** Saves a blob to disk under the given name. */
export function saveBlob(blob: Blob, fileName: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = fileName;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

/** Loads a protected file and saves it to disk. */
export async function downloadProtectedFile(url: string, fileName: string): Promise<void> {
  saveBlob(await fetchFileBlob(url), fileName);
}

/**
 * Opens a protected file in a new tab. The tab is opened first (pop-up
 * blockers only allow that straight after a click) and filled once the file
 * has loaded (the blob address is released when this page is closed). Returns false if the browser blocked the tab.
 */
export async function openProtectedFileInTab(url: string): Promise<boolean> {
  const tab = window.open('', '_blank');
  if (!tab) return false;
  try {
    const objectUrl = await fetchFileObjectUrl(url);
    tab.location.href = objectUrl;
    tab.opener = null;
    return true;
  } catch (err) {
    tab.close();
    throw err;
  }
}

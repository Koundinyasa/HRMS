import { Component, type ErrorInfo, type ReactNode } from "react";

// After a new release the page files get new names. A browser tab that was opened
// before the release can then fail to download a page it has not opened yet. When
// that happens the tab is reloaded once, which fetches the new version. If the
// reload does not help, a message with a Reload button is shown instead of a blank
// screen.

const RELOAD_FLAG = "chunk-reload-at";
const RELOAD_WINDOW_MS = 30_000;

const CHUNK_ERROR =
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|Loading chunk [\w-]+ failed|Unable to preload CSS/i;

export function isChunkLoadError(error: unknown): boolean {
  const message =
    error instanceof Error ? `${error.name} ${error.message}` : String(error ?? "");
  return CHUNK_ERROR.test(message);
}

// Returns true when a reload was started (at most once per 30 seconds).
export function reloadOnceForNewVersion(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_FLAG) ?? 0);
    if (Date.now() - last < RELOAD_WINDOW_MS) return false;
    sessionStorage.setItem(RELOAD_FLAG, String(Date.now()));
  } catch {
    return false;
  }
  window.location.reload();
  return true;
}

type Props = { children: ReactNode };
type State = { failed: boolean; chunkError: boolean };

export default class ChunkErrorBoundary extends Component<Props, State> {
  state: State = { failed: false, chunkError: false };

  static getDerivedStateFromError(error: unknown): State {
    return { failed: true, chunkError: isChunkLoadError(error) };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    if (isChunkLoadError(error) && reloadOnceForNewVersion()) return;
    console.error("Page failed to render:", error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;

    return (
      <div
        role="alert"
        className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center"
      >
        <p className="text-base font-medium text-slate-800">
          {this.state.chunkError
            ? "A new version of the app is available."
            : "Something went wrong while showing this page."}
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Reload
        </button>
      </div>
    );
  }
}

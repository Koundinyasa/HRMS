/** Shown while a page's code is being downloaded (route-level lazy loading). */
export default function PageLoader() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[40vh] w-full items-center justify-center text-sm text-slate-500"
    >
      Loading...
    </div>
  );
}

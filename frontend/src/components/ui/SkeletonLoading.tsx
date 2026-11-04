type SkeletonVariant = "dashboard" | "form" | "calendar" | "report" | "table";

function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />;
}

function getPageDetails(pathname: string): {
  title: string;
  variant: SkeletonVariant;
} {
  const segments = pathname
    .split("/")
    .filter(Boolean);
  const pageName = segments.at(-1) ?? "page";
  const title = pageName
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ");
  const normalizedPath = pathname.toLowerCase();

  if (normalizedPath.endsWith("/dashboard")) {
    return { title, variant: "dashboard" };
  }
  if (normalizedPath.includes("calendar")) {
    return { title, variant: "calendar" };
  }
  if (/report|insight|analytics/.test(normalizedPath)) {
    return { title, variant: "report" };
  }
  if (/profile|apply|edit|create|settings|reset|form/.test(normalizedPath)) {
    return { title, variant: "form" };
  }

  return { title, variant: "table" };
}

function PageHeader() {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <SkeletonBlock className="h-7 w-48" />
        <SkeletonBlock className="h-4 w-64 max-w-full" />
      </div>
      <SkeletonBlock className="h-10 w-32" />
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <SkeletonBlock className="h-6 w-40" />
        <div className="flex gap-3">
          <SkeletonBlock className="h-10 w-full sm:w-48" />
          <SkeletonBlock className="hidden h-10 w-28 sm:block" />
        </div>
      </div>
      <div className="space-y-4 p-4">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="flex items-center gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
          >
            <SkeletonBlock className="h-9 w-9 shrink-0 rounded-full" />
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-4 w-1/3" />
              <SkeletonBlock className="h-3 w-2/3" />
            </div>
            <SkeletonBlock className="hidden h-8 w-24 sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <SkeletonBlock className="h-6 w-44" />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="space-y-2">
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-11 w-full rounded-md" />
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <SkeletonBlock className="h-10 w-24" />
        <SkeletonBlock className="h-10 w-32" />
      </div>
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <SkeletonBlock className="h-6 w-36" />
        <div className="flex gap-2">
          <SkeletonBlock className="h-9 w-9" />
          <SkeletonBlock className="h-9 w-24" />
          <SkeletonBlock className="h-9 w-9" />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }, (_, index) => (
          <SkeletonBlock
            key={index}
            className="h-12 rounded-md sm:h-20"
          />
        ))}
      </div>
    </div>
  );
}

function ReportSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="space-y-3 rounded-xl border border-slate-200 bg-white p-5"
          >
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-8 w-36" />
          </div>
        ))}
      </div>
      <div className="h-64 rounded-xl border border-slate-200 bg-white p-5">
        <SkeletonBlock className="mb-5 h-5 w-40" />
        <SkeletonBlock className="h-[calc(100%-2rem)] w-full rounded-md" />
      </div>
      <TableSkeleton />
    </>
  );
}

function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="space-y-4 rounded-xl border border-slate-200 bg-white p-5"
          >
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="h-8 w-36" />
            <SkeletonBlock className="h-3 w-full" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <div
            key={index}
            className="h-64 rounded-xl border border-slate-200 bg-white p-5"
          >
            <SkeletonBlock className="mb-5 h-5 w-40" />
            <SkeletonBlock className="h-[calc(100%-2rem)] w-full rounded-md" />
          </div>
        ))}
      </div>
      <TableSkeleton />
    </>
  );
}

export default function SkeletonLoading({
  pathname,
}: {
  pathname: string;
}) {
  const { title, variant } = getPageDetails(pathname);

  return (
    <div
      role="status"
      aria-label={`Loading ${title} page`}
      aria-live="polite"
      aria-busy="true"
      className="w-full space-y-5"
    >
      <PageHeader />
      {variant === "dashboard" && <DashboardSkeleton />}
      {variant === "form" && <FormSkeleton />}
      {variant === "calendar" && <CalendarSkeleton />}
      {variant === "report" && <ReportSkeleton />}
      {variant === "table" && <TableSkeleton />}
    </div>
  );
}

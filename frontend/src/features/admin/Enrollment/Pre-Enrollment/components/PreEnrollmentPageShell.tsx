import type { ReactNode } from "react";

interface PreEnrollmentPageShellProps {
  children: ReactNode;
  actions?: ReactNode;
}

export default function PreEnrollmentPageShell({
  children,
  actions,
}: PreEnrollmentPageShellProps) {
  return (
    <div className="w-full min-w-0 bg-slate-50">
      {/* Optional Actions */}
      
      {actions && (
        <div className="mb-2 w-full min-w-0 overflow-x-auto border border-slate-200 bg-white px-3 py-2 sm:px-4">
          <div className="flex min-w-max items-center gap-2">
            {actions}
          </div>
        </div>
      )}

      {/* Page Content */}
      <main className="w-full min-w-0">
        {children}
      </main>
    </div>
  );
}
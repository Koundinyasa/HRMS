import type { ReactNode } from "react";

interface PayrollHeaderProps {
  pageTitle: string;
  subtitle?: string;
  breadcrumb?: string[];
  icon?: ReactNode;
}

export function PayrollHeader({ pageTitle, subtitle, breadcrumb, icon }: PayrollHeaderProps) {
  return (
    <div className="relative w-full min-w-0 overflow-hidden border-b border-[#e6e8f2] bg-gradient-to-br from-white via-[#f4f5ff] to-[#e6e9ff] px-4 pb-6 pt-5 sm:px-8 sm:pt-6">
      {/* soft decorative glow */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#3b49d6]/10 blur-3xl" />

      <div className="relative">
        {breadcrumb && (
          <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-xs font-medium">
            {breadcrumb.map((item, index) => (
              <span key={item} className="flex items-center gap-1.5">
                {index > 0 && <span className="text-[#9aa1b5]">›</span>}
                <span
                  className={
                    index === breadcrumb.length - 1
                      ? "rounded-full bg-[#3b49d6] px-2.5 py-0.5 text-white"
                      : "rounded-full bg-white/80 px-2.5 py-0.5 text-[#3b49d6] ring-1 ring-[#d9dcf8]"
                  }
                >
                  {item}
                </span>
              </span>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-4">
          {icon && (
            <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4654e8] to-[#2f3cbd] text-white shadow-[0_10px_20px_-10px_rgba(59,73,214,0.9)] sm:flex">
              {icon}
            </span>
          )}
          <div className="min-w-0">
            <p className="mb-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#3b49d6]/80">
              Payroll
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-[#1b2033] sm:text-[28px]">
              {pageTitle}
            </h1>
            {subtitle && <p className="mt-1 text-sm text-[#667085]">{subtitle}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

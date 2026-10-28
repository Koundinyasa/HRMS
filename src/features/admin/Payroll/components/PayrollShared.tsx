import type { ReactNode } from "react";
import { FileSpreadsheet } from "lucide-react";

// ======================================================
// DESIGN TOKENS
// ======================================================

export type Tone = "indigo" | "green" | "amber" | "slate";

const TONE_TILE: Record<Tone, string> = {
  indigo: "bg-[#eef0ff] text-[#3b49d6]",
  green: "bg-[#e3f6e8] text-[#16883a]",
  amber: "bg-[#fff3dc] text-[#c2710c]",
  slate: "bg-[#eef0f5] text-[#475467]",
};

const CARD_SHADOW =
  "shadow-[0_1px_2px_rgba(16,24,40,0.04),0_10px_28px_-14px_rgba(59,73,214,0.18)]";

// Every table inside a SectionCard gets this skin, so the screens don't have to style
// their own tables: soft header, row dividers only, hover row, rounded outer border.
const TABLE_SKIN = [
  "[&_.overflow-x-auto]:rounded-xl [&_.overflow-x-auto]:border [&_.overflow-x-auto]:border-[#e8eaf3]",
  "[&_th]:border-x-0 [&_th]:border-t-0 [&_th]:bg-[#f4f5fb] [&_th]:text-[11px] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-[#667085]",
  "[&_td]:border-x-0 [&_tr:last-child_td]:border-b-0",
  "[&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-[#f8f9ff]",
  "[&_tfoot_td]:border-t [&_tfoot_td]:border-t-[#e3e6f0] [&_tfoot_td]:bg-[#f9faff]",
].join(" ");

// ======================================================
// FORM PIECES
// ======================================================

export function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5 text-[13px] font-semibold text-[#344054]">
      <span>{label}</span>
      {children}
    </label>
  );
}

export const inputClass =
  "h-10 w-full rounded-xl border border-[#d8dbe8] bg-white px-3 text-sm shadow-[0_1px_2px_rgba(16,24,40,0.04)] outline-none transition hover:border-[#b9bfe6] focus:border-[#3b49d6] focus:ring-4 focus:ring-[#3b49d6]/10";

// ======================================================
// CARDS
// ======================================================

export function SectionCard({
  title,
  subtitle,
  icon,
  tone = "indigo",
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  tone?: Tone;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border border-[#e6e8f2] bg-white p-5 sm:p-6 ${CARD_SHADOW} ${TABLE_SKIN}`}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon ? (
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${TONE_TILE[tone]}`}
            >
              {icon}
            </span>
          ) : (
            <span className="h-5 w-1 rounded-full bg-gradient-to-b from-[#4654e8] to-[#8a94ff]" />
          )}
          <div>
            <h2 className="text-base font-bold tracking-tight">{title}</h2>
            {subtitle && <p className="text-xs text-[#6b7280]">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "indigo",
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: ReactNode;
  tone?: Tone;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[#e6e8f2] bg-white p-4 ${CARD_SHADOW}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#6b7280]">{label}</p>
          <p className="mt-1.5 truncate text-xl font-bold tracking-tight">
            {value}
            {hint && <span className="ml-1 text-xs font-medium text-[#6b7280]">{hint}</span>}
          </p>
        </div>
        {icon && (
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${TONE_TILE[tone]}`}
          >
            {icon}
          </span>
        )}
      </div>
      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#3b49d6]/70 via-[#8a94ff]/40 to-transparent" />
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[#d3d7ea] bg-white/70 px-6 text-center">
      <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef0ff] text-[#3b49d6]">
        <FileSpreadsheet className="h-7 w-7" />
      </span>
      <p className="max-w-md text-sm text-[#6b7280]">{message}</p>
    </div>
  );
}

// ======================================================
// BUTTONS, BADGES, NOTES
// ======================================================

export const primaryBtn =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-b from-[#4654e8] to-[#3441c8] px-6 text-sm font-semibold text-white shadow-[0_8px_16px_-8px_rgba(59,73,214,0.8)] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3b49d6]/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none";
export const outlineBtn =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#c3c8f4] bg-white px-6 text-sm font-semibold text-[#3b49d6] transition hover:border-[#3b49d6] hover:bg-[#f4f5ff] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3b49d6]/15 active:scale-[0.98]";
export const neutralBtn =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-[#d8dbe8] bg-white px-6 text-sm font-medium text-[#344054] transition hover:bg-[#f6f7fb] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3b49d6]/10 active:scale-[0.98]";
export const smallOutlineBtn =
  "inline-flex h-8 items-center justify-center rounded-lg border border-[#c3c8f4] bg-white px-3 text-xs font-semibold text-[#3b49d6] transition hover:border-[#3b49d6] hover:bg-[#f4f5ff]";

export const tableCell = "border border-[#eceef5] px-4 py-3";

export function ErrorNote({ message }: { message: string }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700"
    >
      {message}
    </p>
  );
}

const BADGE_TONES = {
  green: "bg-[#e6f6ea] text-[#1c8a3c]",
  gray: "bg-[#eef0f5] text-[#4b5563]",
  blue: "bg-[#e8ebff] text-[#3b49d6]",
  amber: "bg-amber-50 text-amber-700",
};

export function StatusBadge({
  tone,
  children,
}: {
  tone: keyof typeof BADGE_TONES;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE_TONES[tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {children}
    </span>
  );
}








import { Outlet, useParams } from "react-router-dom";
import TabBar from "@/features/admin/components/TabBar";
import { SETTINGS_TABS } from "../constants/settingsconstants";

/**
 * Single source of truth for how EVERY Settings module looks
 * (Payroll, Reminder, Email, Tenant) so they match the Company page.
 *
 * Pure Tailwind: the rules below are Tailwind arbitrary variants applied on the
 * wrapper (e.g. `[&_h2]:!text-[16px]` = "every h2 inside"). The `!` makes them win
 * over per-module classes and inline styles. No <style> tag, no CSS string.
 */

// The tiny selectors reused below, written out in full so Tailwind can see each class:
//   FIELD = text inputs (not checkbox / radio / file), textareas and role=combobox triggers
//   CARD  = top-level white rounded cards (not nested ones, not dashed upload boxes)
const THEME_CLASSES = [
  // ---------- Font: everything except icons and the rich-text editors (Email / Reminder) ----------
  "!font-['Urbanist',_sans-serif]",
  "[&_*:not(svg):not(svg_*):not(.ProseMirror):not(.ProseMirror_*):not(.rich-editor):not(.rich-editor_*)]:!font-['Urbanist',_sans-serif]",

  // ---------- Cards ----------
  '[&_.rounded-2xl.bg-white:not(.rounded-2xl.bg-white_.rounded-2xl.bg-white):not([class*="border-dashed"])]:!bg-transparent',
  '[&_.rounded-2xl.bg-white:not(.rounded-2xl.bg-white_.rounded-2xl.bg-white):not([class*="border-dashed"])]:!border-solid',
  '[&_.rounded-2xl.bg-white:not(.rounded-2xl.bg-white_.rounded-2xl.bg-white):not([class*="border-dashed"])]:!border-[1.5px]',
  '[&_.rounded-2xl.bg-white:not(.rounded-2xl.bg-white_.rounded-2xl.bg-white):not([class*="border-dashed"])]:!border-[#1F1F2E]',
  '[&_.rounded-2xl.bg-white:not(.rounded-2xl.bg-white_.rounded-2xl.bg-white):not([class*="border-dashed"])]:!rounded-[24px]',
  '[&_.rounded-2xl.bg-white:not(.rounded-2xl.bg-white_.rounded-2xl.bg-white):not([class*="border-dashed"])]:!shadow-none',

  // ---------- Card titles: purple, 16px, semibold ----------
  "[&_h2]:!text-[#5932E9]",
  "[&_h2]:!text-[16px]",
  "[&_h2]:!font-semibold",
  "[&_h2]:!leading-6",

  // ---------- Labels ----------
  "[&_:is(label,[data-slot=label])]:!text-[#131313]",
  "[&_:is(label,[data-slot=label])]:!text-[14px]",
  "[&_:is(label,[data-slot=label])]:!font-medium",

  // ---------- Inputs / textareas / select triggers ----------
  "[&_:is(input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea,[role=combobox])]:!min-h-[44px]",
  "[&_:is(input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea,[role=combobox])]:!max-w-full",
  "[&_:is(input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea,[role=combobox])]:!bg-[#F9F7FF]",
  "[&_:is(input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea,[role=combobox])]:!border",
  "[&_:is(input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea,[role=combobox])]:!border-solid",
  "[&_:is(input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea,[role=combobox])]:!border-[#2E2E2E]",
  "[&_:is(input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea,[role=combobox])]:!rounded-[12px]",
  "[&_:is(input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea,[role=combobox])]:!text-[#131313]",
  "[&_:is(input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea,[role=combobox])]:!text-[14px]",
  "[&_:is(input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea,[role=combobox])]:!font-medium",
  "[&_:is(input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea,[role=combobox])]:!shadow-none",

  // iOS Safari zooms the page when a focused field is under 16px
  "max-sm:[&_:is(input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea)]:!text-[16px]",

  // Placeholder
  "[&_:is(input,textarea)::placeholder]:!text-[#9A9A9A]",
  "[&_:is(input,textarea)::placeholder]:!font-normal",

  // Focus
  "[&_:is(input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea,[role=combobox]):focus]:!border-[#5932E9]",
  "[&_:is(input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea,[role=combobox]):focus]:!outline-none",
  "[&_:is(input:not([type=checkbox]):not([type=radio]):not([type=file]),textarea,[role=combobox]):focus]:!shadow-[0_0_0_1px_#ECE7FF]",

  // Select trigger: long values are cut with "..." instead of pushing the layout
  "[&_[role=combobox]]:min-w-0",
  "[&_[role=combobox]>span:first-child]:min-w-0",
  "[&_[role=combobox]>span:first-child]:overflow-hidden",
  "[&_[role=combobox]>span:first-child]:text-ellipsis",
  "[&_[role=combobox]>span:first-child]:whitespace-nowrap",
].join(" ");

export default function SettingsPage() {
  const { domain } = useParams();
  const basePath = `/${domain}/admin/admin-center/settings`;

  return (
    <div
      className={`settings-theme w-full max-w-full overflow-x-hidden bg-[#F6F3FF] px-2 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-4 md:px-6 ${THEME_CLASSES}`}
    >
      {/* Urbanist font file (a stylesheet link, not component CSS) */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700&display=swap"
      />

      <TabBar basePath={basePath} tabs={SETTINGS_TABS} />

      <div className="w-full min-w-0 max-w-full">
        <Outlet />
      </div>
    </div>
  );
}
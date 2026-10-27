




import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  Plus,
  Wand2,
  Gift,
  Award,
  CheckCircle2,
  Briefcase,
  FileText,
  Sun,
  UserCheck,
  RefreshCw,
  XCircle,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  Link,
  Code,
  Undo,
  Redo,
  ChevronDown,
  Bell,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import { useReminderSettings, pick } from "./hooks/useReminderSettings";
import { useGetRemindersQuery } from "./api/settingsapi";
import { REMINDER_CATALOG } from "./types/settingstypes";
import AddReminderModal, { type AddReminderResult } from "./components/AddReminderModal";

const ICONS: Record<string, React.ElementType> = {
  birthday: Gift,
  workAnniversary: Award,
  confirmationDate: CheckCircle2,
  lastWorkingDay: Briefcase,
  probationCompletion: FileText,
  retirement: Sun,
  interviewReminder: UserCheck,
  subscriptionReminder: RefreshCw,
  passportExpiry: XCircle,
  custom: Bell,
};


// ---------------------------------------------------------------------------
// Sidebar helpers - build the reminder list from the backend response
// ---------------------------------------------------------------------------
type SidebarItem = { id: number; label: string; type: string; code: string; sort: number };

/** Names the backend may use for the human readable reminder name (best first). */
const NAME_KEYS = [
  "DisplayName",
  "ReminderName",
  "ReminderTypeName",
  "TypeName",
  "Title",
  "Label",
  "Name",
];
/** Weaker sources, only used when nothing better exists. */
const WEAK_NAME_KEYS = ["TemplateName", "ShortLabel", "Code"];

/** "Reminder", "Reminder 3" style placeholders are not real names. */
const isGenericLabel = (v: string) => !v.trim() || /^reminder\s*\d*$/i.test(v.trim());

/** work_from_home_expiry / workFromHomeExpiry -> Work From Home Expiry */
const humanize = (v: string) =>
  v
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());

function firstName(row: any, keys: string[]): string {
  for (const k of keys) {
    const v = pick(row, [k]);
    if (v === undefined || v === null) continue;
    const text = String(v).trim();
    if (text && !isGenericLabel(text)) return text;
  }
  return "";
}

/** Guess an icon type for reminders that are not part of the built-in catalog. */
function inferType(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("birth")) return "birthday";
  if (t.includes("anniversar")) return "workAnniversary";
  if (t.includes("confirm")) return "confirmationDate";
  if (t.includes("last working") || t.includes("lwd") || t.includes("last_working")) return "lastWorkingDay";
  if (t.includes("probation")) return "probationCompletion";
  if (t.includes("retire")) return "retirement";
  if (t.includes("interview")) return "interviewReminder";
  if (t.includes("subscription")) return "subscriptionReminder";
  if (t.includes("passport")) return "passportExpiry";
  return "custom";
}

// Names of reminders created on this screen, remembered in the browser. Used only when the
// backend list has no name column, so a new reminder never shows up as "Reminder 19".
const NAMES_KEY = "people360.reminderNames";
function loadSavedNames(): Record<number, { label: string; code: string }> {
  try {
    return JSON.parse(localStorage.getItem(NAMES_KEY) || "{}") || {};
  } catch {
    return {};
  }
}
function persistSavedNames(map: Record<number, { label: string; code: string }>) {
  try {
    localStorage.setItem(NAMES_KEY, JSON.stringify(map));
  } catch {
    /* storage unavailable - ignore */
  }
}

/** GET may return an array, or { data | result | recordset | reminders: [...] }. */
function toRows(raw: any): any[] {
  if (Array.isArray(raw)) return raw;
  for (const key of ["data", "result", "recordset", "reminders", "items"]) {
    if (Array.isArray(raw?.[key])) return raw[key];
  }
  return [];
}

/** Pull the new ReminderTypeID out of the POST response (never trust a bare number). */
function extractId(res: any): number | null {
  const candidates = [res, res?.data, res?.result, res?.recordset?.[0], Array.isArray(res) ? res[0] : null];
  for (const c of candidates) {
    if (!c || typeof c !== "object") continue;
    const id = Number(pick(c, ["ReminderTypeID", "reminderTypeId", "TypeID", "id", "insertId", "newId"]));
    if (Number.isFinite(id) && id > 0) return id;
  }
  return null;
}

const CHECK_CLASS =
  "border-[#C4C4C4] data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600 data-[state=checked]:text-white";


const SELECT_ITEM_HEIGHT = 36;
const SELECT_VISIBLE_ROWS = 8; // show more rows; scroll if longer

const FONT_OPTIONS = ["Arial", "Times New Roman", "Courier New", "Georgia", "Verdana"];
const SIZE_OPTIONS = ["Size 1", "Size 2", "Size 3", "Size 4", "Size 5", "Size 6", "Size 7"];
const STYLE_OPTIONS = ["Normal", "Heading 1", "Heading 2", "Heading 3", "Monospace"];

const SIZE_VALUE: Record<string, string> = {
  "Size 1": "1",
  "Size 2": "2",
  "Size 3": "3",
  "Size 4": "4",
  "Size 5": "5",
  "Size 6": "6",
  "Size 7": "7",
};
const STYLE_VALUE: Record<string, string> = {
  Normal: "p",
  "Heading 1": "h1",
  "Heading 2": "h2",
  "Heading 3": "h3",
  Monospace: "pre",
};

/** Same responsive dropdown pattern as PayrollSettings (portal + module colors) */
function ToolbarSelect({
  value,
  options,
  onChange,
  minWidth = "6.5rem",
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  minWidth?: string;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [pos, setPos] = useState<{
    left: number;
    width: number;
    top?: number;
    bottom?: number;
    maxHeight: number;
  } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const place = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const rows = Math.min(options.length, SELECT_VISIBLE_ROWS);
    const wanted = SELECT_ITEM_HEIGHT * rows + 12;
    const spaceBelow = vh - rect.bottom - 12;
    const spaceAbove = rect.top - 12;
    // Always open DOWNWARD by default. Only flip up when there is clearly not enough
    // room below (less than ~4 rows) AND there is more room above. If the list is
    // taller than the room below, it scrolls inside the dropdown instead of flipping.
    const minUseful = SELECT_ITEM_HEIGHT * Math.min(options.length, 4) + 12;
    const openUp = spaceBelow < minUseful && spaceAbove > spaceBelow;
    const width = Math.min(Math.max(rect.width, 140), vw - 16);
    const left = Math.max(8, Math.min(rect.left, vw - width - 8));
    const room = openUp ? spaceAbove : spaceBelow;
    const maxHeight = Math.max(80, Math.min(wanted, room));
    setPos({
      left,
      width,
      maxHeight,
      ...(openUp
        ? { bottom: vh - rect.top + 4 }
        : { top: rect.bottom + 4 }),
    });
  }, [options.length]);

  const openList = () => {
    const idx = options.indexOf(value);
    setActiveIndex(idx >= 0 ? idx : 0);
    place();
    setOpen(true);
  };

  const choose = (option: string) => {
    onChange(option);
    setOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onResize = () => place();
    const onScroll = (e: Event) => {
      if (listRef.current?.contains(e.target as Node)) return;
      setOpen(false);
    };
    const onDown = (e: MouseEvent | TouchEvent) => {
      const n = e.target as Node;
      if (listRef.current?.contains(n) || triggerRef.current?.contains(n)) return;
      setOpen(false);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
    };
  }, [open, place]);

  useEffect(() => {
    if (!open || !pos || !listRef.current) return;
    const top = activeIndex * SELECT_ITEM_HEIGHT;
    const box = listRef.current;
    if (top < box.scrollTop) box.scrollTop = top;
    else if (top + SELECT_ITEM_HEIGHT > box.scrollTop + box.clientHeight - 8) {
      box.scrollTop = top + SELECT_ITEM_HEIGHT - box.clientHeight + 8;
    }
  }, [open, pos, activeIndex]);

  return (
    <div className="relative" style={{ minWidth }}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openList())}
        className={`flex h-8 w-full cursor-pointer items-center justify-between gap-1 rounded-lg border bg-[#F9F7FF] px-2 text-left text-xs font-medium text-[#131313] outline-none transition-colors ${
          open
            ? "border-[#5932E9] ring-1 ring-[#ECE7FF]"
            : "border-[#E8E4FF] hover:border-[#5932E9]/50"
        }`}
      >
        <span className="min-w-0 flex-1 truncate">{value}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-[#626262] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open &&
        pos &&
        createPortal(
          <div
            ref={listRef}
            role="listbox"
            style={{
              position: "fixed",
              left: pos.left,
              width: pos.width,
              top: pos.top,
              bottom: pos.bottom,
              maxHeight: pos.maxHeight,
              zIndex: 2147483000,
              boxSizing: "border-box",
              overflowY: "auto",
              overflowX: "hidden",
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "thin",
              scrollbarColor: "#5932E9 #F3F0FF",
              padding: 4,
              background: "#FFFFFF",
              border: "1px solid #DCD3FF",
              borderRadius: 12,
              boxShadow: "0 12px 28px rgba(89, 50, 233, 0.18)",
              fontFamily: "'Urbanist', sans-serif",
            }}
          >
            {options.map((option, index) => {
              const selected = option === value;
              const active = index === activeIndex;
              return (
                <div
                  key={option}
                  role="option"
                  aria-selected={selected}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(option)}
                  style={{
                    height: SELECT_ITEM_HEIGHT,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "0 10px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: selected ? 600 : 500,
                    color: selected || active ? "#5932E9" : "#131313",
                    background:
                      selected ? "#ECE7FF" : active ? "#F5F2FF" : "transparent",
                  }}
                >
                  {selected ? (
                    <span style={{ width: 14, textAlign: "center" }}>✓</span>
                  ) : (
                    <span style={{ width: 14 }} />
                  )}
                  <span className="truncate">{option}</span>
                </div>
              );
            })}
          </div>,
          document.body,
        )}
    </div>
  );
}

export default function ReminderSettings() {
  const [selectedId, setSelectedId] = useState<number>(REMINDER_CATALOG[0].id);
  const [addOpen, setAddOpen] = useState(false);
  // Reminders just created in the modal - shown immediately, replaced by backend rows once they arrive
  const [localItems, setLocalItems] = useState<SidebarItem[]>([]);
  // Used when the POST response has no id: select the new reminder once the refreshed list has it
  const [savedNames, setSavedNames] = useState<Record<number, { label: string; code: string }>>(loadSavedNames);
  const [pendingMatch, setPendingMatch] = useState<{ code: string; name: string } | null>(null);

  // Sidebar = backend list (GET admin/setting/reminder) + catalog fallback for names/icons
  const { data: remindersList, refetch: refetchReminders } = useGetRemindersQuery();

  const sidebarItems = useMemo<SidebarItem[]>(() => {
    const byId = new Map<number, SidebarItem>();

    // Baseline: built-in catalog so the six seeded types never disappear
    for (const c of REMINDER_CATALOG) {
      byId.set(c.id, { id: c.id, label: c.label, type: c.type, code: c.type, sort: c.id });
    }

    // Backend rows win: real names, codes, sort order and any newly added type
    for (const r of toRows(remindersList)) {
      const id = Number(pick(r, ["ReminderTypeID", "reminderTypeId", "TypeID", "typeId", "id"]));
      if (!Number.isFinite(id) || id <= 0) continue;

      const existing = byId.get(id);
      const code = String(pick(r, ["Code"]) ?? existing?.code ?? savedNames[id]?.code ?? "").trim();
      const remembered = savedNames[id];
      const subjectText = String(pick(r, ["Subject", "EmailSubject"]) ?? "").trim();
      const label =
        firstName(r, NAME_KEYS) ||
        existing?.label ||
        remembered?.label ||
        humanize(firstName(r, WEAK_NAME_KEYS)) ||
        (subjectText && subjectText.length <= 40 ? subjectText : "") ||
        `Reminder ${id}`;
      const sortRaw = Number(pick(r, ["SortOrder", "sortOrder", "DisplayOrder"]));

      byId.set(id, {
        id,
        label,
        code,
        type: existing?.type ?? inferType(`${code} ${label}`),
        sort: Number.isFinite(sortRaw) ? sortRaw : (existing?.sort ?? id),
      });
    }

    // Just-added reminders that the list has not returned yet
    for (const l of localItems) {
      if (!byId.has(l.id)) byId.set(l.id, l);
    }

    return Array.from(byId.values()).sort((a, b) => a.sort - b.sort || a.id - b.id);
  }, [remindersList, localItems, savedNames]);

  // Dev aid: shows exactly which fields the backend list returns
  useEffect(() => {
    const rows = toRows(remindersList);
    if (import.meta.env?.DEV && rows.length) {
      console.debug("[Reminders] list row sample:", rows[0]);
    }
  }, [remindersList]);

  // Keep the selected reminder visible: on mobile the list scrolls sideways, on desktop it scrolls
  // vertically, so a newly added reminder at the end could be off screen.
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(`[data-reminder-id="${selectedId}"]`);
    el?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [selectedId, sidebarItems.length]);

  // Select the new reminder once it shows up in the refreshed list (POST returned no id)
  useEffect(() => {
    if (!pendingMatch) return;
    const code = pendingMatch.code.toLowerCase();
    const name = pendingMatch.name.toLowerCase();
    const hit = sidebarItems.find(
      (i) => (i.code && i.code.toLowerCase() === code) || i.label.toLowerCase() === name,
    );
    if (hit) {
      setSelectedId(hit.id);
      setPendingMatch(null);
    }
  }, [pendingMatch, sidebarItems]);

  /** Reload the list from the server and report whether this reminder is in it. */
  const checkReminderExists = useCallback(
    async (code: string, name: string) => {
      const res: any = await refetchReminders();
      const c = code.toLowerCase();
      const n = name.toLowerCase();
      return toRows(res?.data).some((r) => {
        const rc = String(pick(r, ["Code"]) ?? "").toLowerCase();
        const rn = firstName(r, NAME_KEYS).toLowerCase();
        return (rc && rc === c) || (rn && rn === n);
      });
    },
    [refetchReminders],
  );

  const handleReminderAdded = useCallback(
    ({ response, input }: AddReminderResult) => {
      const id = extractId(response);
      if (id) {
        setSavedNames((prev) => {
          const next = { ...prev, [id]: { label: input.displayName, code: input.code } };
          persistSavedNames(next);
          return next;
        });
        setLocalItems((prev) => [
          ...prev.filter((i) => i.id !== id),
          {
            id,
            label: input.displayName,
            code: input.code,
            type: inferType(`${input.code} ${input.displayName}`),
            sort: input.sortOrder || id,
          },
        ]);
        setSelectedId(id);
      } else {
        setPendingMatch({ code: input.code, name: input.displayName });
      }
      void refetchReminders();
    },
    [refetchReminders],
  );

  const [fontLabel, setFontLabel] = useState("Arial");
  const [sizeLabel, setSizeLabel] = useState("Size 3");
  const [styleLabel, setStyleLabel] = useState("Normal");
  const editorRef = useRef<HTMLDivElement>(null);
  // Prevent writing editor HTML more than once per loaded body for this id
  const lastSyncedKey = useRef<string>("");

  const {
    formData,
    setFormData,
    isSaving,
    loadError,
    loadErrorMessage,
    message,
    toggleOption,
    handleSave,
    handleCancel,
  } = useReminderSettings(selectedId);

  // Sync editor when sidebar selection changes or API body for that id arrives.
  // Never on each keystroke (editor is uncontrolled while typing).
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (document.activeElement === el) return;
    const key = `${selectedId}|${formData.body ?? ""}`;
    if (lastSyncedKey.current === key) return;
    el.innerHTML = formData.body || "";
    lastSyncedKey.current = key;
  }, [selectedId, formData.body]);


  const syncBody = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    const html = el.innerHTML;
    setFormData((prev) => (prev.body === html ? prev : { ...prev, body: html }));
  }, [setFormData]);

  /** Ensure selection is inside the editor; select all text if nothing selected */
  const ensureEditorSelection = useCallback(() => {
    const el = editorRef.current;
    if (!el) return null;
    el.focus();
    const sel = window.getSelection();
    if (!sel) return null;
    // If selection is outside editor or collapsed with no range, select all editor text
    const inside =
      sel.rangeCount > 0 && el.contains(sel.anchorNode) && el.contains(sel.focusNode);
    if (!inside || sel.isCollapsed) {
      const range = document.createRange();
      range.selectNodeContents(el);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    return sel;
  }, []);

  const executeCommand = useCallback(
    (command: string, value?: string) => {
      const el = editorRef.current;
      if (!el) return;
      el.focus();
      ensureEditorSelection();

      if (command === "formatBlock" && value) {
        const tag = value.replace(/^<|>$/g, "").toLowerCase();
        if (!document.execCommand("formatBlock", false, tag)) {
          document.execCommand("formatBlock", false, `<${tag}>`);
        }
      } else if (command === "fontName" && value) {
        // Native fontName is flaky — wrap selection in span with font-family
        try {
          document.execCommand("styleWithCSS", false, "false");
        } catch { /* ignore */ }
        const ok = document.execCommand("fontName", false, value);
        if (!ok) {
          const sel = window.getSelection();
          if (sel && sel.rangeCount && !sel.isCollapsed) {
            const range = sel.getRangeAt(0);
            const span = document.createElement("span");
            span.style.fontFamily = value;
            try {
              range.surroundContents(span);
            } catch {
              span.appendChild(range.extractContents());
              range.insertNode(span);
            }
          }
        }
      } else if (command === "fontSize" && value) {
        // Map Size 1–7 → real px (execCommand fontSize alone often looks unchanged)
        const pxMap: Record<string, string> = {
          "1": "10px",
          "2": "13px",
          "3": "16px",
          "4": "18px",
          "5": "24px",
          "6": "32px",
          "7": "48px",
        };
        const px = pxMap[value] || "16px";
        try {
          document.execCommand("styleWithCSS", false, "false");
        } catch { /* ignore */ }
        document.execCommand("fontSize", false, value);
        // Replace <font size="N"> with span style (cleaner + visible)
        el.querySelectorAll("font[size]").forEach((node) => {
          const font = node as HTMLFontElement;
          const span = document.createElement("span");
          span.style.fontSize = pxMap[font.size] || px;
          if (font.face) span.style.fontFamily = font.face;
          span.innerHTML = font.innerHTML;
          font.replaceWith(span);
        });
        // Also wrap current selection if still no size applied
        const sel = window.getSelection();
        if (sel && sel.rangeCount && !sel.isCollapsed) {
          const anchor = sel.anchorNode?.parentElement;
          if (anchor && el.contains(anchor) && !anchor.style?.fontSize) {
            try {
              const range = sel.getRangeAt(0);
              const span = document.createElement("span");
              span.style.fontSize = px;
              span.appendChild(range.extractContents());
              range.insertNode(span);
            } catch { /* ignore */ }
          }
        }
      } else {
        document.execCommand(command, false, value);
      }
      syncBody();
    },
    [ensureEditorSelection, syncBody],
  );


  // handleSave uses formData from closure — provide wrapper that sets body first in hook

  const tb = "rounded p-2 hover:bg-[#DDDDDD] sm:p-1.5";

  return (
    <div className="w-full max-w-full min-w-0">
      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        <Card
          style={{ border: "1px solid #131313" }}
          className="col-span-12 min-w-0 rounded-2xl bg-white p-4 shadow-md md:col-span-4 lg:col-span-3"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-['Urbanist',_sans-serif] text-[16px] font-semibold leading-6 text-[#131313]">
              Reminders
            </h2>
            <Button
              type="button"
              size="icon"
              onClick={() => setAddOpen(true)}
              className="h-7 w-7 rounded-lg border border-[#ECE7FF] bg-[#ECE7FF] text-[#5932E9] shadow-none hover:bg-[#ECE7FF]"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 md:mx-0 md:block md:max-h-[calc(100dvh-16rem)] md:space-y-1 md:overflow-y-auto md:px-0">
            {sidebarItems.map((item) => {
              const Icon = ICONS[item.type] ?? Bell;
              const isSelected = selectedId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  data-reminder-id={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition-colors md:w-full ${
                    isSelected
                      ? "bg-[#ECE7FF] font-semibold text-[#5932E9]"
                      : "text-[#2E2E2E] hover:bg-[#F5F5F5]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <Card
          style={{ border: "1px solid #131313" }}
          className="col-span-12 space-y-4 rounded-2xl bg-white p-3 shadow-md sm:space-y-6 sm:p-6 md:col-span-8 lg:col-span-9"
        >
          {message && (
            <div
              role="status"
              className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                message.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {message.text}
            </div>
          )}

          {loadError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loadErrorMessage}
            </div>
          )}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-[#2E2E2E]">Reminder Before</span>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={String(formData.daysBefore ?? 0)}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  setFormData((prev) => ({
                    ...prev,
                    daysBefore: digits === "" ? 0 : Number(digits),
                  }));
                }}
                className="h-9 w-20 rounded-md border-[#EDEDED] text-center"
              />
              <span className="text-sm text-[#626262]">Days</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-[#2E2E2E]">Applicability -</span>
              {(
                [
                  { key: "ess" as const, label: "ESS" },
                  { key: "hrms" as const, label: "HRMS" },
                  { key: "sendMail" as const, label: "Send Mail" },
                  { key: "active" as const, label: "Is Active" },
                ] as const
              ).map(({ key, label }) => (
                <label key={key} className="flex cursor-pointer items-center gap-1.5 text-sm">
                  <Checkbox
                    checked={!!formData.applicability[key]}
                    onCheckedChange={() => toggleOption(key)}
                    className={CHECK_CLASS}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#5932E9]">
              Email Subject
            </label>
            <Input
              value={formData.subject}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, subject: e.target.value }))
              }
              className="border-[#EDEDED]"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-[#5932E9]">Email Body</label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 border-[#ECE7FF] bg-[#ECE7FF] text-[#5932E9]"
                onClick={() => console.log("Generate")}
              >
                <Wand2 className="mr-1 h-3.5 w-3.5" />
                Generate
              </Button>
            </div>

            <div className="overflow-hidden rounded-xl border border-[#EDEDED]">
              {/* Toolbar — all commands focus editor then execCommand */}
              <div className="flex flex-wrap items-center gap-0.5 border-b border-[#EDEDED] bg-[#FAFAFA] px-2 py-1">
                <ToolbarSelect
                  value={fontLabel}
                  options={FONT_OPTIONS}
                  minWidth="6.5rem"
                  onChange={(v) => {
                    setFontLabel(v);
                    executeCommand("fontName", v);
                  }}
                />
                <ToolbarSelect
                  value={sizeLabel}
                  options={SIZE_OPTIONS}
                  minWidth="5.5rem"
                  onChange={(v) => {
                    setSizeLabel(v);
                    executeCommand("fontSize", SIZE_VALUE[v] || "3");
                  }}
                />
                <ToolbarSelect
                  value={styleLabel}
                  options={STYLE_OPTIONS}
                  minWidth="6.5rem"
                  onChange={(v) => {
                    setStyleLabel(v);
                    executeCommand("formatBlock", STYLE_VALUE[v] || "p");
                  }}
                />
                <div className="mx-0.5 hidden h-4 w-px bg-[#DDDDDD] sm:block" />
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCommand("bold")} className={tb} title="Bold">
                  <Bold className="h-3.5 w-3.5" />
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCommand("italic")} className={tb} title="Italic">
                  <Italic className="h-3.5 w-3.5" />
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCommand("underline")} className={tb} title="Underline">
                  <Underline className="h-3.5 w-3.5" />
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCommand("strikeThrough")} className={tb} title="Strike">
                  <Strikethrough className="h-3.5 w-3.5" />
                </button>
                <div className="mx-0.5 hidden h-4 w-px bg-[#DDDDDD] sm:block" />
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCommand("insertUnorderedList")} className={tb}>
                  <List className="h-3.5 w-3.5" />
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCommand("insertOrderedList")} className={tb}>
                  <ListOrdered className="h-3.5 w-3.5" />
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCommand("justifyLeft")} className={tb}>
                  <AlignLeft className="h-3.5 w-3.5" />
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCommand("justifyCenter")} className={tb}>
                  <AlignCenter className="h-3.5 w-3.5" />
                </button>
                <div className="mx-0.5 hidden h-4 w-px bg-[#DDDDDD] sm:block" />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    const url = window.prompt("Link URL");
                    if (url) executeCommand("createLink", url);
                  }}
                  className={tb}
                  title="Link"
                >
                  <Link className="h-3.5 w-3.5" />
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCommand("removeFormat")} className={tb} title="Clear format">
                  <Code className="h-3.5 w-3.5" />
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCommand("undo")} className={tb}>
                  <Undo className="h-3.5 w-3.5" />
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => executeCommand("redo")} className={tb}>
                  <Redo className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Uncontrolled while typing — no React re-render of HTML each key */}
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="min-h-[180px] break-words p-3 text-sm leading-relaxed text-[#2E2E2E] outline-none sm:min-h-[240px] sm:p-4"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                const body = editorRef.current?.innerHTML ?? "";
                void handleSave(body);
              }}
              disabled={isSaving}
              className="w-full bg-[#5932E9] text-white hover:bg-[#4726BA] sm:w-auto"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </Card>
      </div>

      <AddReminderModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSuccess={handleReminderAdded}
        existing={sidebarItems.map((i) => ({ code: i.code, label: i.label }))}
        checkExists={checkReminderExists}
      />
    </div>
  );
}
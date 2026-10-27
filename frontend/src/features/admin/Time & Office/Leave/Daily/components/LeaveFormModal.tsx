import { Check, CheckCircle2, ChevronDown, Save, X } from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  getBulkLeaveFailures,
  getLeaveDailyErrorMessage,
  useBulkLeaveRequestMutation,
  type BulkLeaveRequestBody,
} from "../api";
import { useEmployeeLeaveTypes } from "../hooks/useLeaveDaily";
import { addToReprocessQueue } from "../utils/leaveDailyReprocessQueue";

export interface LeaveFormTarget {
  employeeId: string;
  employeeName: string;
  /** Day of month, 1-31 */
  day: number;
  /** Code currently shown in the grid cell: P, W, V, CL ... */
  code: string;
  year: number;
  /** 1 - 12 */
  month: number;
}

interface LeaveFormModalProps {
  target: LeaveFormTarget | null;
  onClose: () => void;
  /** Called after a successful save */
  onSaved?: () => void;
}

/** One entry of the First Half / Second Half dropdown (built from the backend, see below) */
interface HalfOption {
  /** Short code: "P" or a leave code like "CL" */
  value: string;
  /** Text shown in the list, e.g. "CL (Half)" */
  label: string;
  /** Full name under the label, e.g. "Casual Leave" */
  hint: string;
  /** Chip colours */
  chip: string;
  kind: "present" | "leave";
  /** Present status id (kind = present) or LeaveTypeId (kind = leave) */
  id: number;
}

/** Chip colours by code - styling only; the options themselves come from the backend */
const CHIP_BY_CODE: Record<string, string> = {
  P: "bg-[#e7f6ee] text-[#16794a]",
  LOP: "bg-[#fde8e8] text-[#c0392b]",
  CL: "bg-[#f8dcd8] text-[#914f3f]",
  SL: "bg-[#fdf0d5] text-[#a86b00]",
  RH: "bg-[#e3eefc] text-[#2f6db5]",
  ML: "bg-[#efe7fb] text-[#7046b5]",
};
/** Other codes get one of these (same code -> same colour) */
const CHIP_PALETTE = [
  "bg-[#e0f4f4] text-[#0f7b7b]",
  "bg-[#fbe6f1] text-[#b0377a]",
  "bg-[#e9efdc] text-[#5b7a1f]",
  "bg-[#e6e9f8] text-[#3f4fb0]",
  "bg-[#fdebdd] text-[#b4581a]",
];
const chipFor = (code: string) => {
  if (CHIP_BY_CODE[code]) return CHIP_BY_CODE[code];
  let hash = 0;
  for (const char of code) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return CHIP_PALETTE[hash % CHIP_PALETTE.length];
};

/**
 * The two halves of a day. Sent as text (sessionFrom / sessionTo) and as the number the
 * backend uses for half days: halfDayType 1 = First Half, 2 = Second Half.
 */
const HALF_SESSION = {
  first: { label: "First Half", type: 1 },
  second: { label: "Second Half", type: 2 },
} as const;
type HalfSession = (typeof HALF_SESSION)[keyof typeof HALF_SESSION];

const DAY_TYPE_BY_CODE: Record<string, string> = {
  W: "Weekly Off",
  WO: "Weekly Off",
  H: "Holiday",
  V: "Leave",
};

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const pad = (value: number) => String(value).padStart(2, "0");

/* ======================= Custom dropdown ======================= */

const CodeChip = ({ option }: { option: HalfOption }) => (
  <span
    className={`grid h-6 min-w-[34px] shrink-0 place-items-center rounded-full px-1.5 text-[10.5px] font-bold leading-none ${option.chip}`}
  >
    {option.value}
  </span>
);

interface HalfSelectProps {
  value: string;
  options: HalfOption[];
  onChange: (value: string) => void;
  ariaLabel: string;
}

/**
 * Nice dropdown for First Half / Second Half.
 * The menu is rendered in a portal (position: fixed) so the modal's
 * overflow-hidden never cuts it off.
 */
const HalfSelect = ({ value, options, onChange, ariaLabel }: HalfSelectProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; width: number; up: boolean }>({
    top: 0,
    left: 0,
    width: 0,
    up: false,
  });

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const selected = options[selectedIndex];

  const MENU_WIDTH = 210;
  const MENU_HEIGHT = options.length * 44 + 12;

  // Place the menu under the button (or above it if there is no room below)
  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;
    const place = () => {
      const rect = buttonRef.current!.getBoundingClientRect();
      const up = rect.bottom + 6 + MENU_HEIGHT > window.innerHeight && rect.top > MENU_HEIGHT;
      const width = Math.max(rect.width, MENU_WIDTH);
      setMenuPos({
        top: up ? rect.top - 6 : rect.bottom + 6,
        left: Math.min(rect.left, window.innerWidth - width - 8),
        width,
        up,
      });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, MENU_HEIGHT]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const targetNode = event.target as Node;
      if (buttonRef.current?.contains(targetNode)) return;
      if ((targetNode as HTMLElement).closest?.("[data-half-select-menu]")) return;
      setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const openMenu = () => {
    setActiveIndex(selectedIndex);
    setOpen(true);
  };

  const choose = (option: HalfOption) => {
    onChange(option.value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === "Escape" && open) {
      // close only the dropdown, not the whole modal
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      return;
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) return openMenu();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((index) => (index + step + options.length) % options.length);
      return;
    }
    if ((event.key === "Enter" || event.key === " ") && open) {
      event.preventDefault();
      choose(options[activeIndex]);
    }
    if (event.key === "Tab" && open) setOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        className={`flex h-10 w-full items-center gap-2 rounded-lg border bg-white pl-1.5 pr-2 text-left text-[13px] font-semibold text-[#303746] outline-none transition ${
          open
            ? "border-[#914f3f] ring-2 ring-[#f6dcd5]"
            : "border-slate-200 hover:border-[#df8d7c] focus-visible:border-[#914f3f] focus-visible:ring-2 focus-visible:ring-[#f6dcd5]"
        }`}
      >
        <CodeChip option={selected} />
        <span className="min-w-0 flex-1 whitespace-nowrap text-[12px] font-medium text-[#5f6d85]">
          {selected.value === "P" ? "Present" : "Half"}
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-[#914f3f] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open &&
        createPortal(
          <ul
            data-half-select-menu
            role="listbox"
            aria-label={ariaLabel}
            onKeyDown={onKeyDown}
            className="fixed z-[2100] overflow-hidden rounded-xl border border-[#f0d4cc] bg-white p-1.5 font-[Urbanist] shadow-[0_14px_36px_rgba(16,24,40,0.18)]"
            style={{
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
              transform: menuPos.up ? "translateY(-100%)" : undefined,
            }}
          >
            {options.map((option, index) => {
              const isSelected = option.value === selected.value;
              const isActive = index === activeIndex;
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => event.preventDefault()} // keep focus on the button
                  onClick={() => choose(option)}
                  className={`flex h-11 cursor-pointer items-center gap-2.5 rounded-lg px-2 transition ${
                    isSelected ? "bg-[#fff1ed]" : isActive ? "bg-[#fbf6f4]" : ""
                  }`}
                >
                  <CodeChip option={option} />
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[13px] leading-tight ${
                        isSelected ? "font-bold text-[#914f3f]" : "font-semibold text-[#303746]"
                      }`}
                    >
                      {option.label}
                    </span>
                    <span className="block text-[11px] leading-tight text-[#8a94a6]">
                      {option.hint}
                    </span>
                  </span>
                  {isSelected && <Check size={16} strokeWidth={2.5} className="shrink-0 text-[#914f3f]" />}
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </>
  );
};

const LeaveFormModal = ({ target, onClose, onSaved }: LeaveFormModalProps) => {
  const [firstHalf, setFirstHalf] = useState("P");
  const [secondHalf, setSecondHalf] = useState("P");
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState<string | null>(null);
  // Popup = one employee, one day -> POST .../bulk-leave-request (JSON { summary })
  const [bulkLeaveRequest] = useBulkLeaveRequestMutation();
  // Present (company-dropdown-data) + the leave types of THIS employee (leave-master-data)
  const {
    leaveTypes,
    presentStatusId,
    presentName,
    loading: typesLoading,
    failed: leaveTypesFailed,
    empty: leaveTypesEmpty,
  } = useEmployeeLeaveTypes(target ? String(target.employeeId).trim() : null);

  /** Present first, then every leave type from the backend (id = LeaveTypeId) */
  const halfOptions = useMemo<HalfOption[]>(
    () => [
      {
        value: "P",
        label: "P",
        hint: presentName,
        chip: chipFor("P"),
        kind: "present",
        id: presentStatusId ?? 0,
      },
      ...leaveTypes
        .filter((type) => type.code !== "P")
        .map<HalfOption>((type) => ({
          value: type.code,
          label: `${type.code} (Half)`,
          hint: type.name,
          chip: chipFor(type.code),
          kind: "leave",
          id: type.id,
        })),
    ],
    [leaveTypes, presentName, presentStatusId],
  );
  const [saving, setSaving] = useState(false);
  /**
   * Parts already saved after a "Partly saved" error (e.g. "P|First Half").
   * Clicking Save again sends only the parts that are not saved yet.
   */
  const [savedParts, setSavedParts] = useState<Set<string>>(new Set());
  /** Set after a successful save: the popup then shows the success message */
  const [done, setDone] = useState<{
    title: string;
    detail: string;
    note: string;
  } | null>(null);

  useEffect(() => {
    if (!target) return;
    setFirstHalf("P");
    setSecondHalf("P");
    setRemarks("");
    setError(null);
    setSavedParts(new Set());
    setDone(null);
  }, [target]);

  // The success message stays on screen until the user closes it (OK button, X, Esc, or click outside).

  useEffect(() => {
    if (!target) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [target, onClose]);

  if (!target) return null;

  const displayDate = `${pad(target.day)}/${MONTH_LABELS[target.month - 1]}/${target.year}`;
  const isoDate = `${target.year}-${pad(target.month)}-${pad(target.day)}`;
  const dayType = DAY_TYPE_BY_CODE[target.code.toUpperCase()] ?? "Working";

  /**
   * Builds the request(s) for this one employee + one day:
   *   P  + P   -> attendance marking, full day   (isAttendanceMarking: true, leaveTypeId = Present id)
   *   CL + CL  -> leave, full day
   *   P  + CL  -> marking "First Half"  +  leave "Second Half"   (2 requests)
   *   CL + SL  -> leave "First Half"    +  leave "Second Half"   (2 requests)
   */
  /** Unique key for one part, e.g. "CL|Second Half" or "P|Full" */
  const partKey = (body: BulkLeaveRequestBody) =>
    `${body.isAttendanceMarking ? "P" : body.leaveTypeId}|${body.sessionFrom ?? "Full"}`;

  const buildRequests = (): BulkLeaveRequestBody[] | string => {
    const fh = firstHalf.toUpperCase();
    const sh = secondHalf.toUpperCase();
    const employeeList = [String(target.employeeId).trim()];
    const reason = remarks.trim() || undefined;

    const presentPart = (session?: HalfSession): BulkLeaveRequestBody | string => {
      if (presentStatusId === null) {
        return typesLoading
          ? "Attendance statuses are still loading - please try again in a moment."
          : 'Present status (code "P") was not sent by the server, so Present cannot be saved.';
      }
      return {
        employeeList,
        leaveTypeId: presentStatusId,
        fromDate: isoDate,
        toDate: isoDate,
        isHalfDay: Boolean(session),
        ...(session ? { sessionFrom: session.label, halfDayType: session.type } : {}),
        isAttendanceMarking: true,
        reason,
      };
    };

    const leavePart = (code: string, session?: HalfSession): BulkLeaveRequestBody | string => {
      // LeaveTypeId comes from the backend list the dropdown was built from
      const leaveTypeId = halfOptions.find(
        (option) => option.kind === "leave" && option.value === code,
      )?.id;
      if (!leaveTypeId) return `Unknown leave type "${code}".`;
      return {
        employeeList,
        leaveTypeId,
        fromDate: isoDate,
        toDate: isoDate,
        isHalfDay: Boolean(session),
        // half-day LEAVE: backend needs both sessionFrom and sessionTo (same half, single day)
        ...(session
          ? { sessionFrom: session.label, sessionTo: session.label, halfDayType: session.type }
          : {}),
        reason,
        isHRForceApply: true,
      };
    };

    const part = (code: string, session?: HalfSession) =>
      code === "P" ? presentPart(session) : leavePart(code, session);

    const parts =
      fh === sh
        ? [part(fh)] // full day
        : [part(fh, HALF_SESSION.first), part(sh, HALF_SESSION.second)];

    const problem = parts.find((item): item is string => typeof item === "string");
    return problem ?? (parts as BulkLeaveRequestBody[]);
  };

  const handleSave = async () => {
    setError(null);
    const requests = buildRequests();
    if (typeof requests === "string") {
      setError(requests);
      return;
    }

    const employeeId = String(target.employeeId).trim();
    // Always the date the user picked - NOT the UTC dates in the response (they shift a day)
    const reprocessItems = [{ employeeId, date: isoDate }];

    setSaving(true);
    let savedAny = savedParts.size > 0; // earlier attempt already saved something
    let failMessage: string | null = null;
    const nowSaved = new Set(savedParts);

    try {
      for (const body of requests) {
        const key = partKey(body);
        if (nowSaved.has(key)) continue; // already saved on a previous click
        const { summary } = await bulkLeaveRequest(body).unwrap();
        // The SP can return HTTP 200 but still reject it in the summary row
        const { failedCount, firstMessage } = getBulkLeaveFailures(summary);
        if (failedCount > 0) {
          failMessage = firstMessage ?? "Could not be saved. Please check and try again.";
          break;
        }
        nowSaved.add(key);
        savedAny = true;
      }
    } catch (err) {
      failMessage = getLeaveDailyErrorMessage(err);
    }
    setSavedParts(nowSaved);

    // Remember this employee/date for the Reprocess button.
    // POST /reprocess is NOT called here - it only runs when the user clicks Reprocess.
    if (savedAny) addToReprocessQueue(reprocessItems);

    setSaving(false);

    if (failMessage) {
      // e.g. first half saved but second half rejected
      setError(
        savedAny
          ? `Partly saved (the other half is saved): ${failMessage}`
          : failMessage,
      );
      return;
    }

    // Show the success message inside this popup (can't be missed)
    const marked = requests.filter((request) => request.isAttendanceMarking).length;
    const title =
      marked === requests.length
        ? "Attendance marked successfully"
        : marked === 0
          ? "Leave saved successfully"
          : "Attendance and leave saved successfully";
    const fh = firstHalf.toUpperCase();
    const sh = secondHalf.toUpperCase();
    setDone({
      title,
      detail: `${target.employeeName} · ${displayDate}`,
      note: fh === sh ? `Day: ${fh}` : `First Half: ${fh}  ·  Second Half: ${sh}`,
    });
    onSaved?.();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 px-4 font-[Urbanist]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Leave form for ${target.employeeName}`}
        className="relative w-full max-w-[600px] overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(15,23,42,0.25)]"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
          <h2 className="text-[14px] font-bold uppercase tracking-wide text-[#182237]">
            Leave form for ({target.employeeName})
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            <X size={18} />
          </button>
        </div>

        {done ? (
          <div role="status" aria-live="polite" className="flex flex-col items-center px-6 py-9 text-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-[#e7f6ee] text-[#16794a]">
              <CheckCircle2 size={36} strokeWidth={2} />
            </span>
            <h3 className="mt-4 text-[18px] font-bold text-[#182237]">{done.title}</h3>
            <p className="mt-1.5 text-[14px] font-semibold text-[#303746]">{done.detail}</p>
            <p className="mt-0.5 text-[13px] text-[#5f6d85]">{done.note}</p>
            <p className="mt-3 rounded-full bg-[#fff1ed] px-3 py-1 text-[12px] font-semibold text-[#914f3f]">
              Click the Reprocess button to update the table
            </p>
          </div>
        ) : (
        <div className="px-0 py-4">
          <div className="grid grid-cols-[0.95fr_1.35fr_1.35fr_0.85fr] gap-2 border-b border-slate-100 bg-[#fff7f5] px-4 py-2 text-[12px] font-bold text-[#914f3f]">
            <span>Date</span>
            <span>First Half</span>
            <span>Second Half</span>
            <span>Day Type</span>
          </div>
          <div className="grid grid-cols-[0.95fr_1.35fr_1.35fr_0.85fr] items-center gap-2 px-4 py-3 text-[13px] font-medium text-[#303746]">
            <span>{displayDate}</span>
            <HalfSelect value={firstHalf} options={halfOptions} onChange={setFirstHalf} ariaLabel="First half" />
            <HalfSelect value={secondHalf} options={halfOptions} onChange={setSecondHalf} ariaLabel="Second half" />
            <span>{dayType}</span>
          </div>

          <label className="mt-1 block px-4 text-[13px] font-bold text-[#303746]">
            Remarks
            <textarea
              value={remarks}
              onChange={(event) => setRemarks(event.target.value)}
              maxLength={500} // backend: Reason is NVarChar(500)
              rows={3}
              className="mt-1.5 block w-full resize-none rounded-md border border-transparent bg-[#fff7f5] px-3 py-2 text-[13px] font-normal outline-none focus:border-[#914f3f]"
            />
          </label>

          {presentStatusId === null && !typesLoading && (
            <p className="mt-3 px-4 text-[12.5px] font-medium text-[#8a5a00]">
              Present status could not be loaded from the server, so Present cannot be saved.
            </p>
          )}
          {leaveTypesFailed && !typesLoading && (
            <p className="mt-3 px-4 text-[12.5px] font-medium text-[#8a5a00]">
              This employee&apos;s leave types could not be loaded, so all company leave types are
              shown. The server will check which ones are allowed.
            </p>
          )}
          {leaveTypesEmpty && (
            <p className="mt-3 px-4 text-[12.5px] font-medium text-[#8a5a00]">
              No leave types are available for this employee, so only Present can be saved.
            </p>
          )}
          {!leaveTypesFailed && !leaveTypesEmpty && leaveTypes.length === 0 && !typesLoading && (
            <p className="mt-3 px-4 text-[12.5px] font-medium text-[#8a5a00]">
              Leave types could not be loaded from the server, so only Present can be saved.
            </p>
          )}
          {error && (
            <p className="mt-3 px-4 text-[12.5px] font-medium text-red-600">{error}</p>
          )}
        </div>
        )}

        {done ? (
          <div className="flex justify-end gap-3 bg-slate-50 px-5 py-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-[#914f3f] px-8 text-[13px] font-semibold text-white hover:bg-[#7f4234]"
            >
              <Check size={15} /> OK
            </button>
          </div>
        ) : (
        <div className="flex justify-end gap-3 bg-slate-50 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-300 bg-white px-5 text-[13px] font-semibold text-[#303746] hover:bg-slate-100 disabled:opacity-60"
          >
            <X size={15} /> Close
          </button>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[#914f3f] px-6 text-[13px] font-semibold text-white hover:bg-[#7f4234] disabled:opacity-60"
          >
            <Save size={15} /> {saving ? "Saving…" : "Save"}
          </button>
        </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default LeaveFormModal;
import { useSyncExternalStore } from "react";

/**
 * Reprocess queue (frontend side)
 * --------------------------------
 * Every time leave is applied (bulk Apply or the single Leave Form popup),
 * the employee/date pairs that were sent are saved here.
 *
 * The Reprocess button sends this list to:
 *   POST /admin/ta/leave/daily/reprocess   { items: [{ employeeId, date }] }
 *
 * The list is kept in localStorage, so it survives a page refresh.
 * Items that the backend accepts (success: true) are removed;
 * failed items stay so the user can try again.
 */

export interface ReprocessQueueItem {
  /** EmployeeID, max 25 chars (same as dbo.UT_EmployeeList) */
  employeeId: string;
  /** YYYY-MM-DD */
  date: string;
}

const STORAGE_KEY = "leaveDaily.reprocessQueue";
const CHANGE_EVENT = "leave-daily-reprocess-queue-change";
const EMPTY: ReprocessQueueItem[] = [];

const itemKey = (item: ReprocessQueueItem) => `${item.employeeId}|${item.date}`;

const isValidItem = (value: unknown): value is ReprocessQueueItem => {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.employeeId === "string" &&
    row.employeeId.trim() !== "" &&
    typeof row.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(row.date)
  );
};

/* ---------- read / write (safe: storage can be blocked or full) ---------- */

let cachedRaw: string | null = null;
let cachedItems: ReprocessQueueItem[] = EMPTY;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Current queue. Returns the same array instance until the data changes. */
export function getReprocessQueue(): ReprocessQueueItem[] {
  const raw = readRaw();
  if (raw === cachedRaw) return cachedItems;

  cachedRaw = raw;
  if (!raw) {
    cachedItems = EMPTY;
    return cachedItems;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    cachedItems = Array.isArray(parsed) ? parsed.filter(isValidItem) : EMPTY;
  } catch {
    cachedItems = EMPTY;
  }
  return cachedItems;
}

function writeQueue(items: ReprocessQueueItem[]) {
  try {
    if (items.length === 0) window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage blocked / full - nothing else we can do
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/* ---------- public helpers ---------- */

/** Add employee/date pairs (duplicates are ignored, order is kept) */
export function addToReprocessQueue(items: ReprocessQueueItem[]) {
  const current = getReprocessQueue();
  const seen = new Set(current.map(itemKey));
  const next = [...current];

  for (const raw of items) {
    const item = { employeeId: String(raw.employeeId).trim(), date: raw.date };
    if (!isValidItem(item)) continue;
    const key = itemKey(item);
    if (seen.has(key)) continue;
    seen.add(key);
    next.push(item);
  }

  if (next.length !== current.length) writeQueue(next);
}

/** Remove the given pairs (e.g. the ones the backend accepted) */
export function removeFromReprocessQueue(items: ReprocessQueueItem[]) {
  const remove = new Set(items.map(itemKey));
  const current = getReprocessQueue();
  const next = current.filter((item) => !remove.has(itemKey(item)));
  if (next.length !== current.length) writeQueue(next);
}

export function clearReprocessQueue() {
  writeQueue([]);
}

/** Every employee × every date -> list of pairs */
export function buildReprocessItems(
  employeeIds: string[],
  dates: string[],
): ReprocessQueueItem[] {
  const items: ReprocessQueueItem[] = [];
  for (const employeeId of employeeIds) {
    for (const date of dates) items.push({ employeeId, date });
  }
  return items;
}

/* ---------- React hook: re-renders when the queue changes ---------- */

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onChange();
  };
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onStorage); // other browser tabs
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

export function useReprocessQueue(): ReprocessQueueItem[] {
  return useSyncExternalStore(subscribe, getReprocessQueue, () => EMPTY);
}
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronDown, X, Check } from "lucide-react";

export interface AuditLogEntry {
  id: string;
  recordDetails: string;
  recordChanges: string;
  actionTime: string;
  user: string;
  employeeName: string;
}

interface AuditLogModalProps {
  open: boolean;
  onClose: () => void;
  entries: AuditLogEntry[];
  onExport?: () => void;
}

/* ---------- filter dropdown ---------- */

interface FilterDropdownProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  selected,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const toggle = (opt: string) =>
    onChange(
      selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt]
    );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex h-[26px] items-center gap-1 px-1.5 text-[12.5px] transition-colors ${
          selected.length
            ? "font-semibold text-[#2D8CF0]"
            : "text-[#5B6B80] hover:text-[#1F2A37]"
        }`}
      >
        {label}
        {selected.length > 1 && ` (+${selected.length - 1})`}
        <ChevronDown size={13} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-10 mt-2 max-h-[240px] w-[210px] overflow-y-auto rounded-lg border border-[#E6EBF2] bg-white py-1.5 shadow-[0_8px_24px_rgba(16,24,40,0.12)]">
          {options.length === 0 && (
            <div className="px-3.5 py-2 text-[12.5px] text-[#8494AB]">
              Nothing to filter yet.
            </div>
          )}

          {options.map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => toggle(opt)}
              className="flex w-full items-center gap-2.5 px-3.5 py-[9px] text-left text-[12.5px] font-medium text-[#33415C] hover:bg-[#F5F8FC]"
            >
              <span
                className={`flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[3px] ${
                  selected.includes(opt)
                    ? "bg-[#2D8CF0]"
                    : "border border-[#C6D0DD] bg-white"
                }`}
              >
                {selected.includes(opt) && (
                  <Check size={11} strokeWidth={3.5} className="text-white" />
                )}
              </span>
              <span className="truncate">{opt}</span>
            </button>
          ))}

          {selected.length > 0 && (
            <div className="mt-1 border-t border-[#EEF2F7] pt-1">
              <button
                type="button"
                onClick={() => {
                  onChange([]);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-center gap-1.5 py-1.5 text-[12.5px] font-medium text-[#F04438] hover:bg-[#FEF3F2]"
              >
                <X size={13} strokeWidth={2.5} />
                Clear
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ---------- modal ---------- */

const GRID =
  "grid grid-cols-[minmax(240px,2fr)_minmax(150px,1.2fr)_minmax(160px,1.3fr)_minmax(110px,1fr)_minmax(170px,1.4fr)]";

const AuditLogModal: React.FC<AuditLogModalProps> = ({
  open,
  onClose,
  entries,
  onExport,
}) => {
  const [query, setQuery] = useState("");
  const [userFilter, setUserFilter] = useState<string[]>([]);
  const [employeeFilter, setEmployeeFilter] = useState<string[]>([]);
  const [actionFilter, setActionFilter] = useState<string[]>([]);

  const users = useMemo(
    () => Array.from(new Set(entries.map((e) => e.user))).filter(Boolean),
    [entries]
  );
  const employees = useMemo(
    () => Array.from(new Set(entries.map((e) => e.employeeName))).filter(Boolean),
    [entries]
  );
  /* First word of the record detail is the action: "Unblocked", "Blocked", … */
  const actions = useMemo(
    () =>
      Array.from(
        new Set(entries.map((e) => e.recordDetails.split(" ")[0]))
      ).filter(Boolean),
    [entries]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const has = (list: string[], val: string) =>
      list.length === 0 || list.includes(val);

    return entries.filter(
      (e) =>
        (!q ||
          `${e.recordDetails} ${e.user} ${e.employeeName}`
            .toLowerCase()
            .includes(q)) &&
        has(userFilter, e.user) &&
        has(employeeFilter, e.employeeName) &&
        has(actionFilter, e.recordDetails.split(" ")[0])
    );
  }, [entries, query, userFilter, employeeFilter, actionFilter]);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1F2A37]/45 px-6 py-8"
      onMouseDown={onClose}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="flex h-[85vh] w-full max-w-[1100px] flex-col overflow-hidden rounded-[10px] bg-white shadow-[0_24px_60px_rgba(16,24,40,0.28)]"
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-[#EEF0F3] px-5 py-3.5">
          <h2 className="text-[15px] font-semibold text-[#2B3A55]">Audit Log</h2>
          <button
            type="button"
            onClick={onExport}
            title="Export to Excel"
            className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] bg-[#22A45D] text-[9px] font-bold tracking-tight text-white shadow-[0_1px_3px_rgba(34,164,93,0.4)] transition-colors hover:bg-[#1B8B4E]"
          >
            XLS
          </button>
        </div>

        {/* Search + filters */}
        <div className="flex flex-shrink-0 items-center gap-3 border-b border-[#EEF0F3] px-5 py-2.5">
          <div className="relative w-[260px]">
            <Search
              size={14}
              className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[#9FB3CC]"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Start Typing..."
              className="h-[26px] w-full border-none bg-transparent pl-[22px] text-[12.5px] text-[#33415C] placeholder:text-[#9FB3CC] focus:outline-none"
            />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <FilterDropdown
              label="User"
              options={users}
              selected={userFilter}
              onChange={setUserFilter}
            />
            <FilterDropdown
              label="Employee"
              options={employees}
              selected={employeeFilter}
              onChange={setEmployeeFilter}
            />
            <FilterDropdown
              label="Action"
              options={actions}
              selected={actionFilter}
              onChange={setActionFilter}
            />
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          <div
            className={`${GRID} sticky top-0 z-10 items-center border-b border-[#DDE9F8] bg-[#EAF2FD] py-2.5 text-[12.5px] font-semibold text-[#2B3A55]`}
          >
            <div className="px-5">Record Details</div>
            <div className="px-5">Record Changes</div>
            <div className="px-5">Action Time</div>
            <div className="px-5">User</div>
            <div className="px-5">Employee Name</div>
          </div>

          {filtered.length === 0 ? (
            <div className="px-5 py-12 text-center text-[13px] text-[#8494AB]">
              No audit records match these filters.
            </div>
          ) : (
            filtered.map((entry, i) => (
              <div
                key={entry.id}
                className={`${GRID} items-center border-b border-[#F1F3F6] py-3 text-[13px] text-[#33415C] ${
                  i === 0 ? "bg-[#F3F8FE]" : ""
                }`}
              >
                <div className="px-5">{entry.recordDetails}</div>
                <div className="px-5 text-[#98A2B3]">
                  {entry.recordChanges || "—"}
                </div>
                <div className="px-5">{entry.actionTime}</div>
                <div className="px-5">{entry.user}</div>
                <div className="px-5">{entry.employeeName}</div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 items-center justify-end border-t border-[#EEF0F3] px-5 py-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[30px] items-center gap-1.5 rounded-[6px] border border-[#E0E3E8] px-4 text-[12.5px] font-medium text-[#5A6472] transition-colors hover:bg-[#F7F8FA]"
          >
            <X size={13} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogModal;
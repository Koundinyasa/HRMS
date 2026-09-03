import React, { useState, useRef, useEffect } from "react";
import { Search, Save, Plus, X } from "lucide-react";

/* Swap this for your own asset if you host one locally */
const EMPTY_STATE_ILLUSTRATION =
  "https://cdni.iconscout.com/illustration/premium/thumb/no-data-found-4470957-3728636.png";

const fieldOptions = [
  "Employee Name",
  "Ref No",
  "Branch",
  "Salary Structure",
  "Leave",
  "Attendance",
  "Designation",
  "Cost Center",
  "Department",
  "Team",
  "Banks",
  "DOJ",
  "Gender",
  "Authority",
  "State",
  "Marital Status",
  "Pan Status",
  "Emp Status",
];

interface FilterRow {
  id: number;
  field: string;
  value: string;
}

let rowIdCounter = 1;

/* ============================================================
   FIELD SELECT — custom panel so it can be styled like the design
   ============================================================ */

interface FieldSelectProps {
  value: string;
  onChange: (next: string) => void;
  onOpenChange: (open: boolean) => void;
}

const FieldSelect: React.FC<FieldSelectProps> = ({
  value,
  onChange,
  onOpenChange,
}) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const setOpenState = (next: boolean) => {
    setOpen(next);
    onOpenChange(next);
  };

  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpenState(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenState(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpenState(!open)}
        className={`flex h-[32px] w-[168px] items-center justify-between rounded-[4px] border bg-white pl-3 pr-2.5 text-left text-[13px] transition-colors ${
          open
            ? "border-[#F0B429] text-[#3C4858] shadow-[0_0_0_2px_rgba(240,180,41,0.15)]"
            : "border-[#DCE0E6] text-[#5A6472] hover:border-[#C3CAD4]"
        }`}
      >
        <span className={value ? "text-[#3C4858]" : "text-[#5A6472]"}>
          {value || "Select"}
        </span>
        <span className="text-[7px] leading-none text-[#98A2B3]">▼</span>
      </button>

      {open && (
        <div className="group-select-panel absolute left-0 top-[calc(100%+4px)] z-50 max-h-[300px] w-[168px] overflow-y-auto rounded-[3px] border border-[#E4E7EC] bg-white py-1 shadow-[0_4px_16px_rgba(16,24,40,0.18)]">
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpenState(false);
            }}
            className={`block w-full px-3 py-[5px] text-left text-[12.5px] text-[#3C4858] hover:bg-[#E8EEF7] ${
              value === "" ? "bg-[#F0F1F3]" : ""
            }`}
          >
            Select
          </button>

          {fieldOptions.map((opt) => (
            <button
              type="button"
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpenState(false);
              }}
              className={`block w-full px-3 py-[5px] text-left text-[12.5px] text-[#3C4858] hover:bg-[#E8EEF7] ${
                value === opt ? "bg-[#F0F1F3]" : ""
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ============================================================
   PAGE
   ============================================================ */

const EmployeeGroupPage: React.FC = () => {
  const [rows, setRows] = useState<FilterRow[]>([
    { id: rowIdCounter, field: "", value: "" },
  ]);
  const [activeRowId, setActiveRowId] = useState<number | null>(null);

  const addRow = () => {
    rowIdCounter += 1;
    setRows((prev) => [...prev, { id: rowIdCounter, field: "", value: "" }]);
  };

  const removeRow = (id: number) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
    if (activeRowId === id) setActiveRowId(null);
  };

  const updateRow = (id: number, patch: Partial<FilterRow>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const canSave = rows.some((r) => r.field && r.value.trim());

  const handleSaveGroup = () => {
    if (!canSave) return;
    console.log("Saving group with rows:", rows);
  };

  return (
    <div className="relative pb-16">
      {/* Thin scrollbar for the dropdown panel */}
      <style>{`
        .group-select-panel::-webkit-scrollbar { width: 8px; }
        .group-select-panel::-webkit-scrollbar-track { background: #F4F5F7; }
        .group-select-panel::-webkit-scrollbar-thumb { background: #C9CFD8; border-radius: 4px; }
        .group-select-panel::-webkit-scrollbar-thumb:hover { background: #AEB6C2; }
      `}</style>

      {/* ---------- FILTER TOOLBAR ---------- */}
      <div className="mt-2 rounded-[10px] bg-white px-4 py-2.5 shadow-[0_1px_3px_rgba(16,24,40,0.08)]">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            {rows.map((row, i) => {
              const active = activeRowId === row.id;
              return (
                <div key={row.id} className="flex items-center gap-2">
                  <FieldSelect
                    value={row.field}
                    onChange={(field) => updateRow(row.id, { field })}
                    onOpenChange={(open) => setActiveRowId(open ? row.id : null)}
                  />

                  <div className="relative">
                    <Search
                      size={13}
                      className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#98A2B3]"
                    />
                    <input
                      type="text"
                      value={row.value}
                      onChange={(e) => updateRow(row.id, { value: e.target.value })}
                      onFocus={() => setActiveRowId(row.id)}
                      onBlur={() => setActiveRowId(null)}
                      placeholder="start typing..."
                      className={`h-[32px] w-[168px] rounded-[4px] border pl-[30px] pr-3 text-[13px] text-[#3C4858] placeholder:text-[#98A2B3] focus:outline-none ${
                        active
                          ? "border-[#F0B429] shadow-[0_0_0_2px_rgba(240,180,41,0.15)]"
                          : "border-[#DCE0E6] hover:border-[#C3CAD4]"
                      }`}
                    />
                  </div>

                  {i === rows.length - 1 ? (
                    <button
                      type="button"
                      onClick={addRow}
                      title="Add filter row"
                      className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded text-[#2D8CF0] transition-colors hover:bg-[#E8F2FE]"
                    >
                      <Plus size={17} strokeWidth={2.2} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      title="Remove filter row"
                      className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded text-[#98A2B3] transition-colors hover:bg-[#FEF3F2] hover:text-[#F04438]"
                    >
                      <X size={16} strokeWidth={2.2} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleSaveGroup}
            disabled={!canSave}
            className={`flex h-[32px] shrink-0 items-center gap-1.5 rounded-[4px] border px-3.5 text-[13px] font-medium transition-colors ${
              canSave
                ? "border-[#DCE0E6] bg-white text-[#3C4858] hover:border-[#C3CAD4] hover:bg-[#F7F9FC]"
                : "cursor-not-allowed border-[#E4E7EC] bg-white text-[#A6AEBB]"
            }`}
          >
            <Save size={14} />
            Save Group
          </button>
        </div>
      </div>

      {/* ---------- EMPTY STATE ---------- */}
      <div className="mt-2 flex flex-col items-center justify-center rounded-[10px] bg-white px-4 pb-20 pt-20 shadow-[0_1px_3px_rgba(16,24,40,0.08)]">
        <img
          src={EMPTY_STATE_ILLUSTRATION}
          alt=""
          className="mb-5 h-[210px] w-auto object-contain"
        />
        <p className="text-[14px] font-medium tracking-[0.01em] text-[#EF4444]">
          No Data Found in - Employee group
        </p>
      </div>

      {/* ---------- FLOATING CHAT ---------- */}
      <div className="fixed bottom-5 right-6 z-40 flex flex-col items-center gap-1">
        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3B82F6] text-white shadow-[0_4px_12px_rgba(59,130,246,0.35)] transition-transform hover:scale-105 hover:bg-[#2563EB] active:scale-95"
        >
          <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
            <path d="M12 2a2 2 0 012 2v1h1a3 3 0 013 3v2h1a2 2 0 012 2v6a2 2 0 01-2 2h-1v2a3 3 0 01-3 3H9a3 3 0 01-3-3v-2H5a2 2 0 01-2-2v-6a2 2 0 012-2h1V7a3 3 0 013-3h1V4a2 2 0 012-2zm0 6a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-4 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm8 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
          </svg>
        </button>
        <span className="rounded bg-white px-2 py-0.5 text-[11px] font-medium text-[#5A6472] shadow-sm border border-[#EEF0F3]">
          Let's Chat
        </span>
      </div>
    </div>
  );
};

export default EmployeeGroupPage;
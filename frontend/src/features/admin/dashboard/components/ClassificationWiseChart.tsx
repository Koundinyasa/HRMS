




import { useEffect, useRef, useState } from "react";
import { useGetClassificationDataQuery } from "../api/dashboardApi";
import { CLASSIFICATION_OPTIONS, type ClassificationId } from "../constants/dashboard.constants";

export default function ClassificationWiseChart() {
  const [classificationId, setClassificationId] =
    useState<ClassificationId>(CLASSIFICATION_OPTIONS[0].id);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetching, isError } =
    useGetClassificationDataQuery(classificationId);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const items = data?.data ?? [];
  const maxValue = Math.max(1, ...items.map((i) => i.employeeCount));
  const selectedLabel =
    CLASSIFICATION_OPTIONS.find((o) => o.id === classificationId)?.label ??
    CLASSIFICATION_OPTIONS[0].label;

  return (
    <div className="flex h-full w-full min-w-0 flex-col rounded-2xl border border-slate-100 bg-white px-3 pb-5 pt-5 shadow-[0_2px_6px_rgba(15,23,42,0.06),0_10px_28px_rgba(15,23,42,0.14)]">
      <div className="mb-5 flex items-center justify-between border-b border-[#F08A8A] pb-1.5">
        <h3 className="text-[15px] font-medium text-slate-900">
          Classification Wise
        </h3>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-md border border-[#7FA9F5] px-2.5 py-1.5 text-[10px] text-slate-800 hover:bg-blue-50/50"
          >
            {selectedLabel}
            <svg width="8" height="5" viewBox="0 0 10 6" fill="none">
              <path
                d="M1 1L5 5L9 1"
                stroke="#334155"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {open && (
            <div className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-slate-100 bg-white py-1 shadow-lg">
              {CLASSIFICATION_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setClassificationId(opt.id);
                    setOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 text-left text-xs hover:bg-slate-50 ${
                    opt.id === classificationId
                      ? "font-medium text-blue-600"
                      : "text-slate-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {isLoading || isFetching ? (
        <div className="flex h-40 items-center justify-center text-sm text-slate-400">
          Loading...
        </div>
      ) : isError ? (
        <div className="flex h-40 items-center justify-center text-sm text-red-400">
          Could not load data.
        </div>
      ) : items.length === 0 ? (
        <div className="flex h-40 items-center justify-center text-sm text-slate-400">
          No data available.
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-[14px] overflow-y-auto pr-1">
          {items.map((item, i) => {
            const widthPct =
              item.employeeCount === 0
                ? 0
                : Math.max((item.employeeCount / maxValue) * 100, 5);

            return (
              <div key={`${item.label}-${i}`} className="flex min-h-[18px] items-center gap-3">
                <span
                  title={item.label}
                  className="w-[140px] shrink-0 truncate text-right text-[11px] font-semibold text-slate-800"
                >
                  {item.label}
                </span>
                <div className="flex flex-1 items-center">
                  {widthPct > 0 && (
                    <div
                      className="h-[16px] rounded-full transition-all"
                      style={{
                        width: `${widthPct}%`,
                        minWidth: "10px",
                        backgroundColor: item.colorHex,
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
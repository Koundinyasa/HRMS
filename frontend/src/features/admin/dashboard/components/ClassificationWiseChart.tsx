import { useEffect, useRef, useState } from "react";
import {
  useGetClassificationDataQuery,
  useGetClassificationDropdownQuery,
} from "../api/dashboardApi";
 
export default function ClassificationWiseChart() {
  const [classificationId, setClassificationId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
 
  const {
    data: classificationOptions = [],
    isLoading: isDropdownLoading,
  } = useGetClassificationDropdownQuery();
 
  useEffect(() => {
    if (classificationOptions.length > 0 && classificationId === null) {
      setClassificationId(classificationOptions[0].classificationId);
    }
  }, [classificationOptions, classificationId]);
 
  const { data, isLoading, isFetching, isError } = useGetClassificationDataQuery(
    classificationId!,
    { skip: classificationId === null }
  );
 
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  const items = data?.data ?? [];
  const maxValue = Math.max(1, ...items.map((i) => i.employeeCount));
 
  const selectedLabel =
    classificationOptions.find(
      (o) => o.classificationId === classificationId
    )?.classificationName ?? "Select";
 
  return (
    <div className="flex h-full w-full min-w-0 flex-col rounded-2xl border border-slate-100 bg-white px-4 pb-5 pt-5 shadow-[0_2px_6px_rgba(15,23,42,0.06),0_10px_28px_rgba(15,23,42,0.14)]">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between border-b border-[#F08A8A] pb-2">
        <h3 className="text-[15px] font-medium text-slate-900">
          Classification Wise
        </h3>
 
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            disabled={isDropdownLoading}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-[11px] font-medium text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/50 disabled:opacity-50"
          >
            {isDropdownLoading ? "Loading..." : selectedLabel}
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
              <path
                d="M1 1L5 5L9 1"
                stroke="#64748B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
 
          {open && (
            <div className="absolute right-0 z-20 mt-1.5 w-52 rounded-xl border border-slate-100 bg-white py-1.5 shadow-xl">
              {/* All items visible at once - NO scroll */}
              {classificationOptions.map((opt) => (
                <button
                  key={opt.classificationId}
                  onClick={() => {
                    setClassificationId(opt.classificationId);
                    setOpen(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left text-[12px] transition hover:bg-slate-50 ${
                    opt.classificationId === classificationId
                      ? "bg-blue-50 font-semibold text-blue-600"
                      : "text-slate-600"
                  }`}
                >
                  {opt.classificationName}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
 
      {/* Content */}
      {isLoading || isFetching || classificationId === null ? (
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
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pr-1 pt-1">
          {items.map((item, i) => {
            const widthPct =
              item.employeeCount === 0
                ? 0
                : Math.max((item.employeeCount / maxValue) * 100, 8);
 
            const isHovered = hoveredIndex === i;
 
            return (
              <div
                key={`${item.label}-${i}`}
                className="group flex items-center gap-3"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span
                  title={item.label}
                  className="w-[130px] shrink-0 truncate text-right text-[12px] font-medium text-slate-700 transition group-hover:text-slate-900"
                >
                  {item.label}
                </span>
 
                <div className="flex flex-1 items-center gap-3">
                  <div className="relative h-[14px] flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${widthPct}%`,
                        background: `linear-gradient(90deg, ${item.colorHex}cc, ${item.colorHex})`,
                        boxShadow: isHovered
                          ? `0 2px 10px ${item.colorHex}66`
                          : "none",
                        transform: isHovered ? "scaleY(1.25)" : "scaleY(1)",
                      }}
                    />
                  </div>
 
                  <span
                    className={`min-w-[32px] text-right text-[16px] font-bold tabular-nums transition-all duration-300 ${
                      isHovered
                        ? "scale-125 opacity-100"
                        : "scale-75 opacity-0"
                    }`}
                    style={{ color: item.colorHex }}
                  >
                    {item.employeeCount}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
 
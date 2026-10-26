import { useEffect, useRef } from "react";
import { Search, X, Save } from "lucide-react";

import CraftReportCategoryDropdown from "./CraftReportCategoryDropdown";
import StoreTemplateEmptyState from "./StoreTemplateEmptyState";
import { CRAFT_REPORT_CATEGORY_OPTIONS } from "../constants/craftReport.constants";
import { useStoreTemplateFilter } from "../hooks/useStoreTemplateFilter";

interface StoreTemplateModalProps {
  onClose: () => void;
  onSave: (categories: string[]) => void;
}

export default function StoreTemplateModal({
  onClose,
  onSave,
}: StoreTemplateModalProps) {
  const {
    search,
    setSearch,
    selectedCategories,
    isCategoryOpen,
    toggleCategoryDropdown,
    closeCategoryDropdown,
    handleCategoryChange,
    handleCategoryClear,
  } = useStoreTemplateFilter();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeCategoryDropdown();
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [closeCategoryDropdown]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-semibold text-[#814A3C]">
            Store Template List
          </h2>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500">
              Group/Category
            </span>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={toggleCategoryDropdown}
                className="flex h-9 w-40 items-center justify-between rounded-md border border-slate-300 px-3 text-xs text-slate-600"
              >
                <span>
                  {selectedCategories.length > 0
                    ? `${selectedCategories.length} selected`
                    : ""}
                </span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>

              {isCategoryOpen && (
                <CraftReportCategoryDropdown
                  options={CRAFT_REPORT_CATEGORY_OPTIONS}
                  selected={selectedCategories}
                  onChange={handleCategoryChange}
                  onClear={handleCategoryClear}
                />
              )}
            </div>

            {/* Second dropdown from your screenshot — wire this to real options once you tell me what it filters */}
            <button
              type="button"
              className="flex h-9 w-24 items-center justify-between rounded-md border border-slate-300 px-3 text-xs text-slate-400"
            >
              <span />
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="border-b border-slate-100 px-5 py-3">
          <div className="relative w-72">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ..."
              className="h-9 w-full rounded-md border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs text-slate-700 outline-none focus:border-blue-400"
            />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <StoreTemplateEmptyState />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-4 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            <X size={14} />
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(selectedCategories)}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#814A3C] px-4 text-xs font-medium text-white hover:bg-[#6c3d31]"
          >
            <Save size={14} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
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
    <div className="font-[Urbanist] fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 flex-wrap min-w-0">
      <div className="font-[Urbanist] flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-xl min-w-0 max-w-full">
        {/* Header */}
        <div className="font-[Urbanist] flex items-center justify-between border-b border-black px-5 py-4 flex-wrap min-w-0">
          <h2 className="font-[Urbanist] text-base font-semibold text-[#814A3C]">
            Store Template List
          </h2>

          <div className="font-[Urbanist] flex items-center gap-3 flex-wrap min-w-0">
            <span className="font-[Urbanist] text-xs font-medium text-slate-500">
              Group/Category
            </span>

            <div className="font-[Urbanist] relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={toggleCategoryDropdown}
                className="font-[Urbanist] flex h-9 w-full sm:w-40 items-center justify-between rounded-md border border-black px-3 text-xs text-slate-600 flex-wrap min-w-0 max-w-full"
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
              className="font-[Urbanist] flex h-9 w-full sm:w-24 items-center justify-between rounded-md border border-black px-3 text-xs text-slate-400 flex-wrap min-w-0 max-w-full"
            >
              <span />
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="font-[Urbanist] border-b border-black px-5 py-3">
          <div className="font-[Urbanist] relative w-full sm:w-72">
            <Search
              size={14}
              className="font-[Urbanist] absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ..."
              className="font-[Urbanist] h-9 w-full rounded-md border border-black bg-slate-50 pl-8 pr-3 text-xs text-slate-700 outline-none focus:border-blue-400"
            />
          </div>
        </div>

        {/* Body */}
        <div className="font-[Urbanist] flex-1 overflow-y-auto min-w-0">
          <StoreTemplateEmptyState />
        </div>

        {/* Footer */}
        <div className="font-[Urbanist] flex items-center justify-end gap-2 border-t border-black px-5 py-3 flex-wrap min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="font-[Urbanist] inline-flex h-9 items-center gap-1.5 rounded-md border border-black bg-white px-4 text-xs font-medium text-slate-600 hover:bg-slate-50 flex-wrap min-w-0"
          >
            <X size={14} />
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSave(selectedCategories)}
            className="font-[Urbanist] inline-flex h-9 items-center gap-1.5 rounded-md bg-[#814A3C] px-4 text-xs font-medium text-white hover:bg-[#6c3d31] flex-wrap min-w-0"
          >
            <Save size={14} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
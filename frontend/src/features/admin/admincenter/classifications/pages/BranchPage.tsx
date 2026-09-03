import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import {
  Plus,
  Search,
  History,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
} from "lucide-react";

import ClassificationNavbar from "../components/ClassificationNavbar";
import BranchList, { type BranchSortKey } from "../components/BranchList";
import TableViewToolbar from "../components/TableViewToolbar";
import { useBranch } from "../hooks/useBranch";
import type { Branch } from "../types/classificationTypes";

const STATES = [
  "Telangana",
  "Andhra Pradesh",
  "Karnataka",
  "Tamil Nadu",
  "Maharashtra",
  "Delhi",
];

const ROW_OPTIONS = [5, 10, 20, 50];

/* =========================================================
   CUSTOM ROWS PER PAGE DROPDOWN
   ========================================================= */

function RowsPerPageDropdown({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSelect = (option: number) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative shrink-0 z-[9999]">
      {/* Selected value */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          h-8
          w-[52px]
          rounded-md
          border
          border-gray-200
          bg-white
          px-2
          text-xs
          text-gray-700
          flex
          items-center
          justify-between
          gap-1
          outline-none
          cursor-pointer
          hover:border-gray-300
          focus:border-violet-500
          focus:ring-1
          focus:ring-violet-100
        "
      >
        <span>{value}</span>

        <ChevronDown
          size={12}
          className={`
            shrink-0
            text-gray-500
            transition-transform
            duration-150
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Dropdown opens DOWN */}
      {open && (
        <div
          className="
            absolute
            left-0
            top-full
            mt-1
            z-[99999]
            w-[52px]
            rounded-md
            border
            border-gray-200
            bg-white
            shadow-lg
            overflow-hidden
          "
        >
          {ROW_OPTIONS.map((option) => {
            const selected = option === value;

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className={`
                  flex
                  items-center
                  justify-between
                  w-full
                  h-7
                  px-2
                  text-xs
                  whitespace-nowrap
                  cursor-pointer
                  ${
                    selected
                      ? "bg-violet-50 text-violet-700"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                <span>{option}</span>

                {selected && <Check size={11} className="text-violet-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   BRANCH PAGE
   ========================================================= */

export default function BranchPage() {
  const {
    branches,
    isLoading,

    isFormOpen,
    openAdd,
    openEdit,
    closeForm,

    form,
    setField,
    setActive,
    submit,
    isSaving,

    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    isDeleting,
  } = useBranch();

  const [search, setSearch] = useState("");

  const [sortKey, setSortKey] = useState<BranchSortKey | null>(null);

  const [sortAsc, setSortAsc] = useState(true);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [page, setPage] = useState(1);

  /* =========================================================
     FILTER + SORT
     ========================================================= */

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    const base = q
      ? branches.filter(
          (b) =>
            b.BranchName.toLowerCase().includes(q) ||
            b.Address.toLowerCase().includes(q) ||
            b.State.toLowerCase().includes(q),
        )
      : branches;

    if (!sortKey) {
      return base;
    }

    const sorted = [...base].sort((a: Branch, b: Branch) => {
      const av = a[sortKey];
      const bv = b[sortKey];

      if (av === bv) {
        return 0;
      }

      return av > bv ? 1 : -1;
    });

    return sortAsc ? sorted : sorted.reverse();
  }, [branches, search, sortKey, sortAsc]);

  /* =========================================================
     PAGINATION
     ========================================================= */

  const totalCount = filtered.length;

  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage));

  const currentPage = Math.min(page, totalPages);

  const pageRows = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const rangeStart = totalCount === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;

  const rangeEnd = Math.min(currentPage * rowsPerPage, totalCount);

  /* =========================================================
     SORT HANDLER
     ========================================================= */

  const handleSort = (key: BranchSortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  /* =========================================================
     PAGE HANDLER
     ========================================================= */

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }

    setPage(nextPage);
  };

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <div className="w-full">
      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <ClassificationNavbar
        rightSlot={
          <>
            <div className="relative w-full sm:w-auto">
              <Search
                size={15}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search..."
                className="
                  h-9
                  w-full
                  sm:w-48
                  rounded-lg
                  border
                  border-gray-200
                  bg-white
                  pl-9
                  pr-3
                  text-sm
                  outline-none
                  focus-visible:ring-2
                  focus-visible:ring-violet-500
                "
              />
            </div>

            <button
              type="button"
              onClick={openAdd}
              className="
                flex
                items-center
                gap-1.5
                bg-violet-600
                hover:bg-violet-700
                text-white
                px-4
                py-2
                rounded-lg
                text-sm
                font-medium
                whitespace-nowrap
              "
            >
              <Plus size={16} />
              Add New
            </button>

            <button
              type="button"
              aria-label="History"
              className="
                w-9
                h-9
                rounded-full
                border
                flex
                items-center
                justify-center
                text-gray-400
                hover:text-gray-600
                shrink-0
              "
            >
              <History size={16} />
            </button>
          </>
        }
      />

      {/* =====================================================
          BREADCRUMB
      ===================================================== */}

      <p className="px-4 sm:px-6 mt-4 text-xs text-gray-400">
        Classifications / Branch
      </p>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="mt-4 px-4 sm:px-6 pb-8">
        <div
          className="
            bg-white
            rounded-2xl
            shadow-sm
            overflow-visible
          "
        >
          {/* =================================================
              ADD / EDIT FORM
          ================================================= */}

          {isFormOpen && (
            <div
              className="
                mx-4
                mb-4
                rounded-xl
                border
                p-6
                space-y-4
                bg-muted/30
              "
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="branch-name">Branch Name</Label>

                  <Input
                    id="branch-name"
                    value={form.branchName}
                    onChange={(e) => setField("branchName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="branch-state">State</Label>

                  <select
                    id="branch-state"
                    value={form.state}
                    onChange={(e) => setField("state", e.target.value)}
                    className="
                      h-9
                      w-full
                      rounded-lg
                      border
                      border-input
                      bg-transparent
                      px-3
                      text-sm
                      outline-none
                      focus-visible:ring-2
                      focus-visible:ring-violet-500
                    "
                  >
                    <option value="">Select state</option>

                    {STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch-address">Address</Label>

                <Input
                  id="branch-address"
                  value={form.address}
                  onChange={(e) => setField("address", e.target.value)}
                />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive === 1}
                  onChange={(e) => setActive(e.target.checked ? 1 : 0)}
                />
                Active
              </label>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={closeForm}>
                  Cancel
                </Button>

                <Button
                  onClick={submit}
                  disabled={isSaving}
                  className="
                    bg-violet-600
                    hover:bg-violet-700
                    text-white
                  "
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          )}

          {/* =================================================
              DELETE CONFIRMATION
          ================================================= */}

          {deleteTarget && (
            <div
              className="
                mx-4
                mb-4
                rounded-xl
                border
                border-red-200
                bg-red-50
                p-4
                flex
                flex-col
                sm:flex-row
                sm:items-center
                justify-between
                gap-3
              "
            >
              <p className="text-sm text-red-700">
                Delete <strong>{deleteTarget.BranchName}</strong>? This cannot
                be undone.
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteTarget(null)}
                >
                  Cancel
                </Button>

                <Button
                  size="sm"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="
                    bg-red-600
                    hover:bg-red-700
                    text-white
                  "
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          )}

          {/* =================================================
              TABLE
          ================================================= */}

          {isLoading ? (
            <p
              className="
                text-sm
                text-muted-foreground
                py-8
                text-center
              "
            >
              Loading branches...
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <BranchList
                  branches={pageRows}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                  sortKey={sortKey}
                  onSort={handleSort}
                />
              </div>

              {/* Existing toolbar */}
              <TableViewToolbar />

              {/* =================================================
                  PAGINATION FOOTER
              ================================================= */}

              <div
                className="
                  relative
                  z-50
                  border-t
                  border-gray-100
                  bg-white
                  px-4
                  sm:px-6
                  py-3
                  overflow-visible
                "
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    w-full
                    min-w-0
                  "
                >
                  {/* =================================================
                      LEFT SIDE
                      Rows per page + Range
                  ================================================= */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      min-w-0
                    "
                  >
                    {/* Rows per page */}
                    <div
                      className="
                        flex
                        items-center
                        gap-1.5
                        shrink-0
                      "
                    >
                      <span
                        className="
                          text-xs
                          text-gray-600
                          whitespace-nowrap
                        "
                      >
                        Rows per page
                      </span>

                      <RowsPerPageDropdown
                        value={rowsPerPage}
                        onChange={(value) => {
                          setRowsPerPage(value);
                          setPage(1);
                        }}
                      />
                    </div>

                    {/* Range */}
                    <div
                      className="
                        text-xs
                        text-gray-600
                        whitespace-nowrap
                        shrink-0
                      "
                    >
                      {rangeStart} to {rangeEnd} of {totalCount}
                    </div>
                  </div>

                  {/* =================================================
                      RIGHT SIDE
                      PAGINATION BUTTONS
                  ================================================= */}

                  <div
                    className="
                      flex
                      items-center
                      gap-1
                      shrink-0
                      ml-3
                    "
                  >
                    {/* Previous */}
                    <button
                      type="button"
                      aria-label="Previous page"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="
                        h-8
                        w-8
                        rounded-full
                        border
                        border-gray-200
                        bg-white
                        flex
                        items-center
                        justify-center
                        text-gray-500
                        hover:bg-gray-50
                        hover:text-gray-700
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                      "
                    >
                      <ChevronLeft size={14} />
                    </button>

                    {/* Current page */}
                    <button
                      type="button"
                      aria-current="page"
                      className="
                        h-8
                        w-8
                        rounded-full
                        bg-violet-100
                        text-violet-700
                        text-xs
                        font-medium
                        flex
                        items-center
                        justify-center
                      "
                    >
                      {currentPage}
                    </button>

                    {/* Next */}
                    <button
                      type="button"
                      aria-label="Next page"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="
                        h-8
                        w-8
                        rounded-full
                        border
                        border-gray-200
                        bg-white
                        flex
                        items-center
                        justify-center
                        text-gray-500
                        hover:bg-gray-50
                        hover:text-gray-700
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                      "
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

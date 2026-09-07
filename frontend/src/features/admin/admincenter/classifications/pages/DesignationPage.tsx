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
import DesignationList from "../components/DesignationList";
import { useDesignation } from "../hooks/useDesignation";

const ROW_OPTIONS = [5, 10, 20, 50];

/* =========================================================
   ROWS PER PAGE DROPDOWN
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
    <div ref={dropdownRef} className="relative z-[9999] shrink-0">
      {/* Selected value */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          h-7
          w-[42px]
          rounded-md
          border
          border-gray-200
          bg-white
          px-1.5
          text-[11px]
          text-gray-700
          flex
          items-center
          justify-between
          outline-none
          cursor-pointer
          hover:border-gray-300
          focus:border-violet-500
          focus:ring-1
          focus:ring-violet-200
        "
      >
        <span>{value}</span>

        <ChevronDown
          size={11}
          className={`
            shrink-0
            text-gray-500
            transition-transform
            duration-150
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Dropdown opens downward */}
      {open && (
        <div
          className="
            absolute
            left-0
            top-full
            mt-1
            z-[99999]
            w-[54px]
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
                  h-7
                  w-full
                  px-2
                  flex
                  items-center
                  justify-between
                  text-[11px]
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

                {selected && <Check size={9} className="text-violet-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   DESIGNATION PAGE
   ========================================================= */

export default function DesignationPage() {
  const {
    designations,
    total,
    page,
    pageSize,
    setPageSize,
    isLoading,
    setPage,

    isFormOpen,
    openAdd,
    openEdit,
    closeForm,

    form,
    setDesignationName,
    submit,
    isSaving,

    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    isDeleting,
  } = useDesignation();

  const [search, setSearch] = useState("");

  /* =========================================================
     SEARCH
     ========================================================= */

  const visibleDesignations = useMemo(() => {
    const q = search.trim().toLowerCase();

    return q
      ? designations.filter((d) => d.DesignationName.toLowerCase().includes(q))
      : designations;
  }, [designations, search]);

  /* =========================================================
     PAGINATION
     ========================================================= */

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const currentPage = Math.min(page, totalPages);

  const rangeStart = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const rangeEnd = Math.min(currentPage * pageSize, total);

  const handlePageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }

    setPage(nextPage);
  };

  return (
    <div className="w-full min-w-0">
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
                onChange={(e) => setSearch(e.target.value)}
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
          CONTENT
          ===================================================== */}

      <div className="mt-4 px-4 sm:px-6 pb-8">
        <div
          className="
            w-full
            min-w-0
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
                mt-4
                mb-2
                rounded-xl
                border
                p-6
                space-y-4
                bg-muted/30
              "
            >
              <div className="space-y-2">
                <Label htmlFor="designation-name">Designation Name</Label>

                <Input
                  id="designation-name"
                  value={form.designationName}
                  onChange={(e) => setDesignationName(e.target.value)}
                  placeholder="e.g. HR Executive"
                />
              </div>

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
              DELETE
              ================================================= */}

          {deleteTarget && (
            <div
              className="
                mx-4
                mt-4
                mb-2
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
                Delete <strong>{deleteTarget.DesignationName}</strong>?
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
              Loading designations...
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <DesignationList
                  designations={visibleDesignations}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                />
              </div>

              {/* =================================================
                  PAGINATION FOOTER
                  ================================================= */}

              <div
                className="
                  relative
                  z-50
                  w-full
                  border-t
                  border-gray-100
                  bg-white
                  overflow-visible
                  px-4
                  sm:px-5
                  py-2.5
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
                      ROWS PER PAGE + RANGE
                      ================================================= */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      shrink-0
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
                          text-[11px]
                          sm:text-xs
                          text-gray-600
                          whitespace-nowrap
                        "
                      >
                        Rows per page
                      </span>

                      <RowsPerPageDropdown
                        value={pageSize}
                        onChange={(value) => {
                          setPageSize(value);
                          setPage(1);
                        }}
                      />
                    </div>

                    {/* Range */}

                    <span
                      className="
                        text-[11px]
                        sm:text-xs
                        text-gray-600
                        whitespace-nowrap
                      "
                    >
                      {rangeStart} to {rangeEnd} of {total}
                    </span>
                  </div>

                  {/* =================================================
                      RIGHT SIDE
                      PAGINATION
                      ================================================= */}

                  <div
                    className="
                      flex
                      items-center
                      gap-1
                      shrink-0
                      ml-auto
                    "
                  >
                    {/* Previous */}

                    <button
                      type="button"
                      aria-label="Previous page"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="
                        h-7
                        w-7
                        rounded-full
                        border
                        border-gray-200
                        bg-white
                        flex
                        items-center
                        justify-center
                        text-gray-400
                        hover:bg-gray-50
                        hover:text-gray-700
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                        shrink-0
                      "
                    >
                      <ChevronLeft size={12} />
                    </button>

                    {/* Current page */}

                    <span
                      className="
                        h-7
                        w-7
                        rounded-full
                        bg-violet-100
                        text-violet-700
                        text-[11px]
                        font-medium
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >
                      {currentPage}
                    </span>

                    {/* Next */}

                    <button
                      type="button"
                      aria-label="Next page"
                      disabled={currentPage >= totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="
                        h-7
                        w-7
                        rounded-full
                        border
                        border-gray-200
                        bg-white
                        flex
                        items-center
                        justify-center
                        text-gray-400
                        hover:bg-gray-50
                        hover:text-gray-700
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                        shrink-0
                      "
                    >
                      <ChevronRight size={12} />
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

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  Plus,
  History,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import ClassificationNavbar from "../components/ClassificationNavbar";
import AttendanceConfigTable from "../components/AttendanceConfigTable";
import {
  AttendanceConfigModal,
  AttendanceConfigDeleteModal,
} from "../components/AttendanceConfigModal";
import { useAttendanceConfig } from "../hooks/useAttendanceConfig";

export default function AttendancePage() {
  const {
    search,
    setSearch,
    rowsPerPage,
    setRowsPerPage,
    page,
    totalPages,
    rangeStart,
    rangeEnd,
    totalCount,
    pageRows,
    setPage,
    toggleActive,
    editingConfig,
    setEditingConfig,
    isAdding,
    openAdd,
    openEdit,
    closeEdit,
    saveEdit,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
  } = useAttendanceConfig();

  const [rowsDropdownOpen, setRowsDropdownOpen] = useState(false);

  const rowsButtonRef = useRef<HTMLButtonElement>(null);

  const rowsOptions = [10, 25, 50, 100];

  /*
   * Position of the custom dropdown.
   * Fixed positioning keeps it above overflow containers.
   */
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
  });

  const updateDropdownPosition = () => {
    if (!rowsButtonRef.current) return;

    const rect = rowsButtonRef.current.getBoundingClientRect();

    setDropdownPosition({
      top: rect.bottom + 4,
      left: rect.left,
    });
  };

  /*
   * Update dropdown position whenever it opens.
   */
  useEffect(() => {
    if (!rowsDropdownOpen) return;

    updateDropdownPosition();

    const handleResize = () => {
      updateDropdownPosition();
    };

    const handleScroll = () => {
      updateDropdownPosition();
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [rowsDropdownOpen]);

  /*
   * Close dropdown when clicking outside.
   */
  useEffect(() => {
    if (!rowsDropdownOpen) return;

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (rowsButtonRef.current && !rowsButtonRef.current.contains(target)) {
        const dropdown = document.getElementById("attendance-rows-dropdown");

        if (!dropdown || !dropdown.contains(target)) {
          setRowsDropdownOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [rowsDropdownOpen]);

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setPage(1);
    setRowsDropdownOpen(false);
  };

  const handleRowsButtonClick = () => {
    if (!rowsDropdownOpen) {
      updateDropdownPosition();
    }

    setRowsDropdownOpen((previous) => !previous);
  };

  const goPrevious = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className="w-full min-w-0 overflow-x-hidden box-border">
      {/* ================= NAVBAR ================= */}
      <ClassificationNavbar />

      {/* ================= BREADCRUMB ================= */}
      <p className="px-3 sm:px-6 mt-3 sm:mt-4 text-xs text-gray-400 truncate">
        Attendance / Configurations / Configuration
      </p>

      {/* ================= MAIN ================= */}
      <div className="mt-3 sm:mt-4 px-3 sm:px-6 pb-6 sm:pb-8">
        <div
          className="
            w-full
            min-w-0
            bg-white
            rounded-xl
            sm:rounded-2xl
            shadow-sm
            border
            border-gray-100
            overflow-hidden
          "
        >
          {/* ================= HEADER ================= */}
          <div className="flex items-center justify-between flex-wrap gap-3 p-3 sm:p-4">
            <span
              className="
                px-4
                sm:px-5
                py-2
                sm:py-2.5
                rounded-lg
                text-xs
                sm:text-sm
                font-medium
                bg-violet-600
                text-white
                whitespace-nowrap
              "
            >
              Configuration
            </span>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              {/* Search */}
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
                    sm:w-56
                    rounded-lg
                    border
                    border-gray-200
                    bg-[#F5F3FF]
                    pl-9
                    pr-3
                    text-xs
                    sm:text-sm
                    outline-none
                    focus-visible:ring-2
                    focus-visible:ring-violet-500
                  "
                />
              </div>

              {/* Add Attendance */}
              <button
                type="button"
                onClick={openAdd}
                className="
                  flex
                  items-center
                  justify-center
                  gap-1.5
                  bg-violet-600
                  hover:bg-violet-700
                  text-white
                  px-3
                  sm:px-4
                  py-2
                  sm:py-2.5
                  rounded-lg
                  text-xs
                  sm:text-sm
                  font-medium
                  whitespace-nowrap
                  transition-colors
                "
              >
                <Plus size={16} />
                Add Attendance
              </button>

              {/* History */}
              <button
                type="button"
                aria-label="History"
                className="
                  w-9
                  h-9
                  shrink-0
                  rounded-full
                  border
                  border-gray-200
                  flex
                  items-center
                  justify-center
                  text-gray-400
                  hover:text-gray-600
                  hover:bg-gray-50
                "
              >
                <History size={16} />
              </button>
            </div>
          </div>

          {/* ================= TABLE ================= */}
          <div className="w-full min-w-0 overflow-x-auto">
            <AttendanceConfigTable
              rows={pageRows}
              onToggleActive={toggleActive}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          </div>

          {/* ================= PAGINATION ================= */}
          <div
            className="
              w-full
              h-[52px]
              min-h-[52px]
              border-t
              border-gray-100
              bg-white
              flex
              items-center
              overflow-visible
            "
          >
            <div
              className="
                w-full
                h-full
                flex
                items-center
                justify-between
                px-4
                sm:px-5
                overflow-visible
              "
            >
              {/* =================================================
                  LEFT GROUP
                  Rows per page + Range
                  ================================================= */}
              <div
                className="
                  flex
                  items-center
                  gap-3
                  shrink-0
                  min-w-0
                "
              >
                {/* ================= ROWS PER PAGE ================= */}
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
                      text-[10px]
                      sm:text-[11px]
                      text-gray-500
                      whitespace-nowrap
                    "
                  >
                    Rows per page
                  </span>

                  {/* Custom dropdown button */}
                  <button
                    ref={rowsButtonRef}
                    type="button"
                    onClick={handleRowsButtonClick}
                    aria-haspopup="listbox"
                    aria-expanded={rowsDropdownOpen}
                    className="
                      h-7
                      w-[58px]
                      min-w-[58px]
                      rounded-md
                      border
                      border-gray-200
                      bg-white
                      px-2
                      flex
                      items-center
                      justify-between
                      gap-1
                      text-[11px]
                      text-gray-700
                      outline-none
                      cursor-pointer
                      hover:border-gray-300
                      focus:border-violet-400
                      focus:ring-1
                      focus:ring-violet-400
                    "
                  >
                    <span>{rowsPerPage}</span>

                    <ChevronDown
                      size={11}
                      className={`
                        shrink-0
                        text-gray-500
                        transition-transform
                        duration-150
                        ${rowsDropdownOpen ? "rotate-180" : ""}
                      `}
                    />
                  </button>
                </div>

                {/* ================= RANGE ================= */}
                <span
                  className="
                    text-[10px]
                    sm:text-[11px]
                    text-gray-500
                    whitespace-nowrap
                    shrink-0
                  "
                >
                  {rangeStart} to {rangeEnd} of {totalCount}
                </span>
              </div>

              {/* =================================================
                  RIGHT GROUP
                  Pagination buttons
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
                  onClick={goPrevious}
                  disabled={page <= 1}
                  aria-label="Previous page"
                  className="
                    w-9
                    h-9
                    rounded-full
                    border
                    border-gray-200
                    bg-white
                    flex
                    items-center
                    justify-center
                    text-gray-400
                    cursor-pointer
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    hover:bg-gray-50
                  "
                >
                  <ChevronLeft size={14} />
                </button>

                {/* Current page */}
                <button
                  type="button"
                  aria-current="page"
                  className="
                    w-9
                    h-9
                    rounded-full
                    bg-violet-100
                    text-violet-700
                    flex
                    items-center
                    justify-center
                    text-[11px]
                    font-medium
                    shrink-0
                  "
                >
                  {page}
                </button>

                {/* Next */}
                <button
                  type="button"
                  onClick={goNext}
                  disabled={page >= totalPages}
                  aria-label="Next page"
                  className="
                    w-9
                    h-9
                    rounded-full
                    border
                    border-gray-200
                    bg-white
                    flex
                    items-center
                    justify-center
                    text-gray-400
                    cursor-pointer
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                    hover:bg-gray-50
                  "
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          CUSTOM ROWS-PER-PAGE DROPDOWN
          Rendered into BODY so overflow-hidden cannot clip it.
          ========================================================= */}

      {rowsDropdownOpen &&
        createPortal(
          <div
            id="attendance-rows-dropdown"
            role="listbox"
            style={{
              position: "fixed",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              zIndex: 99999,
            }}
            className="
              w-[58px]
              overflow-hidden
              rounded-md
              border
              border-gray-200
              bg-white
              shadow-lg
            "
          >
            {rowsOptions.map((option) => (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={rowsPerPage === option}
                onClick={() => handleRowsPerPageChange(option)}
                className={`
                  flex
                  w-full
                  h-7
                  items-center
                  justify-center
                  text-[11px]
                  cursor-pointer
                  transition-colors
                  ${
                    rowsPerPage === option
                      ? "bg-violet-100 text-violet-700 font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }
                `}
              >
                {option}
              </button>
            ))}
          </div>,
          document.body,
        )}

      {/* ================= ADD / EDIT MODAL ================= */}
      {editingConfig && (
        <AttendanceConfigModal
          config={editingConfig}
          isAdding={isAdding}
          onChange={setEditingConfig}
          onClose={closeEdit}
          onSave={saveEdit}
        />
      )}

      {/* ================= DELETE MODAL ================= */}
      {deleteTarget && (
        <AttendanceConfigDeleteModal
          config={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

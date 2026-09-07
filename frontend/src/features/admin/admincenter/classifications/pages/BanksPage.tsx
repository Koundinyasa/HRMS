import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
import BankList, { type BankSortKey } from "../components/BankList";
import { useBanks } from "../hooks/useBanks";
import type { Bank } from "../types/classificationTypes";

const ROW_OPTIONS = [5, 10, 20, 50];

/* =========================================================
   COMPACT ROWS PER PAGE DROPDOWN
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
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          h-9
          w-[56px]
          rounded-lg
          border
          border-gray-200
          bg-white
          px-2.5
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
          focus:ring-violet-200
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

      {open && (
        <div
          className="
            absolute
            left-0
            top-full
            mt-1
            z-[99999]
            w-[56px]
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

                {selected && <Check size={10} className="text-violet-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   BANKS PAGE
   ========================================================= */

export default function BanksPage() {
  const navigate = useNavigate();
  const { domain } = useParams();

  const {
    banks,
    isLoading,
    usingFallback,

    isFormOpen,
    openAdd,
    openEdit,
    closeForm,

    form,
    setField,
    submit,
    isSaving,

    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    isDeleting,
  } = useBanks();

  /* =========================================================
     STATE
     ========================================================= */

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<BankSortKey | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  /* =========================================================
     FIELD MAPPING
     ========================================================= */

  const openFieldMapping = (bank: Bank) =>
    navigate(
      `/${domain}/admin/admin-center/classifications/banks/${bank.Id}/field-mapping`,
    );

  /* =========================================================
     FILTER + SORT
     ========================================================= */

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    const base = q
      ? banks.filter(
          (b) =>
            b.BankName.toLowerCase().includes(q) ||
            b.AcType.toLowerCase().includes(q) ||
            b.IfscCode.toLowerCase().includes(q),
        )
      : banks;

    if (!sortKey) {
      return base;
    }

    const sorted = [...base].sort((a: Bank, b: Bank) => {
      const av = a[sortKey];
      const bv = b[sortKey];

      if (av === bv) {
        return 0;
      }

      return av > bv ? 1 : -1;
    });

    return sortAsc ? sorted : sorted.reverse();
  }, [banks, search, sortKey, sortAsc]);

  /* =========================================================
     PAGINATION CALCULATIONS
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
     SORT
     ========================================================= */

  const handleSort = (key: BankSortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  /* =========================================================
     PAGE CHANGE
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
    <div className="w-full min-h-screen overflow-x-hidden box-border">
      {/* =====================================================
          NAVBAR
          ===================================================== */}

      <ClassificationNavbar
        rightSlot={
          <div
            className="
              flex
              flex-wrap
              xs:flex-nowrap
              items-center
              gap-2
              sm:gap-3
              w-full
              sm:w-auto
              justify-end
            "
          >
            <div
              className="
                relative
                w-full
                xs:w-auto
                flex-1
                sm:flex-none
              "
            >
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
                  xs:w-44
                  sm:w-48
                  lg:w-56
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
                  transition-all
                "
              />
            </div>

            <button
              type="button"
              onClick={openAdd}
              className="
                flex-1
                xs:flex-initial
                flex
                items-center
                justify-center
                gap-1.5
                bg-violet-600
                hover:bg-violet-700
                text-white
                px-3.5
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
              Add New
            </button>

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
                transition-colors
              "
            >
              <History size={16} />
            </button>
          </div>
        }
      />

      {/* =====================================================
          BREADCRUMB
          ===================================================== */}

      <p
        className="
          px-3
          sm:px-6
          mt-3
          sm:mt-4
          text-xs
          text-gray-400
          truncate
        "
      >
        Classifications / Bank
      </p>

      {/* =====================================================
          FALLBACK MESSAGE
          ===================================================== */}

      {usingFallback && (
        <div
          className="
            mx-3
            sm:mx-6
            mt-3
            rounded-lg
            border
            border-amber-200
            bg-amber-50
            px-3.5
            sm:px-4
            py-2
            text-xs
            text-amber-700
            leading-relaxed
          "
        >
          Showing preview data — the banks API isn't live on the backend yet, so
          this list isn't connected to real data and edits won't be saved.
        </div>
      )}

      {/* =====================================================
          MAIN CARD
          ===================================================== */}

      <div
        className="
          mt-3
          sm:mt-4
          px-3
          sm:px-6
          pb-6
          sm:pb-8
        "
      >
        <div
          className="
            bg-white
            rounded-xl
            sm:rounded-2xl
            shadow-sm
            border
            border-gray-100
            overflow-visible
            w-full
          "
        >
          {/* =================================================
              ADD / EDIT FORM
              ================================================= */}

          {isFormOpen && (
            <div
              className="
                mx-3
                sm:mx-4
                mt-3
                sm:mt-4
                mb-3
                sm:mb-4
                rounded-xl
                border
                border-gray-200
                p-4
                sm:p-6
                space-y-4
                bg-muted/30
              "
            >
              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  md:grid-cols-3
                  gap-3
                  sm:gap-4
                "
              >
                <div className="space-y-1.5">
                  <Label htmlFor="bank-name" className="text-xs sm:text-sm">
                    Bank Name
                  </Label>

                  <Input
                    id="bank-name"
                    value={form.bankName}
                    onChange={(e) => setField("bankName", e.target.value)}
                    className="
                      h-9
                      text-xs
                      sm:text-sm
                    "
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bank-actype" className="text-xs sm:text-sm">
                    Account Type
                  </Label>

                  <Input
                    id="bank-actype"
                    value={form.acType}
                    onChange={(e) => setField("acType", e.target.value)}
                    placeholder="e.g. Salary Account"
                    className="
                      h-9
                      text-xs
                      sm:text-sm
                    "
                  />
                </div>

                <div
                  className="
                    space-y-1.5
                    sm:col-span-2
                    md:col-span-1
                  "
                >
                  <Label htmlFor="bank-ifsc" className="text-xs sm:text-sm">
                    IFSC Code
                  </Label>

                  <Input
                    id="bank-ifsc"
                    value={form.ifscCode}
                    onChange={(e) =>
                      setField("ifscCode", e.target.value.toUpperCase())
                    }
                    placeholder="e.g. IBKL0000002"
                    className="
                      h-9
                      text-xs
                      sm:text-sm
                    "
                  />
                </div>
              </div>

              <div
                className="
                  flex
                  justify-end
                  gap-2
                  sm:gap-3
                "
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={closeForm}
                  className="
                    text-xs
                    sm:text-sm
                    h-8
                    sm:h-9
                  "
                >
                  Cancel
                </Button>

                <Button
                  size="sm"
                  onClick={submit}
                  disabled={isSaving}
                  className="
                    bg-violet-600
                    hover:bg-violet-700
                    text-white
                    text-xs
                    sm:text-sm
                    h-8
                    sm:h-9
                  "
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          )}

          {/* =================================================
              DELETE MESSAGE
              ================================================= */}

          {deleteTarget && (
            <div
              className="
                mx-3
                sm:mx-4
                my-3
                sm:my-4
                rounded-xl
                border
                border-red-200
                bg-red-50
                p-3.5
                sm:p-4
                flex
                flex-col
                sm:flex-row
                sm:items-center
                justify-between
                gap-3
              "
            >
              <p
                className="
                  text-xs
                  sm:text-sm
                  text-red-700
                "
              >
                Delete <strong>{deleteTarget.BankName}</strong>? This cannot be
                undone.
              </p>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  self-end
                  sm:self-auto
                "
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteTarget(null)}
                  className="text-xs h-8"
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
                    text-xs
                    h-8
                  "
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          )}

          {/* =================================================
              LOADING
              ================================================= */}

          {isLoading ? (
            <p
              className="
                text-xs
                sm:text-sm
                text-muted-foreground
                py-8
                text-center
              "
            >
              Loading banks...
            </p>
          ) : (
            <>
              {/* =================================================
                  BANK TABLE
                  ================================================= */}

              <div
                className="
                  w-full
                  overflow-x-auto
                  [-webkit-overflow-scrolling:touch]
                "
              >
                <BankList
                  banks={pageRows}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                  onConfigure={openFieldMapping}
                  sortKey={sortKey}
                  onSort={handleSort}
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
                  px-5
                  sm:px-6
                  py-3
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
                  {/* =============================================
                      LEFT SIDE
                      ROWS PER PAGE + RANGE
                      ============================================= */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      shrink-0
                      min-w-0
                    "
                  >
                    {/* ROWS PER PAGE */}

                    <div
                      className="
                        flex
                        items-center
                        gap-2
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
                        onChange={(n) => {
                          setRowsPerPage(n);
                          setPage(1);
                        }}
                      />
                    </div>

                    {/* RANGE */}

                    <span
                      className="
                        text-xs
                        text-gray-600
                        whitespace-nowrap
                      "
                    >
                      {rangeStart} to {rangeEnd} of {totalCount}
                    </span>
                  </div>

                  {/* =============================================
                      RIGHT SIDE
                      PAGINATION BUTTONS
                      ============================================= */}

                  <div
                    className="
                      flex
                      items-center
                      gap-1
                      shrink-0
                    "
                  >
                    {/* PREVIOUS */}

                    <button
                      type="button"
                      aria-label="Previous page"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="
                        h-9
                        w-9
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
                      <ChevronLeft size={14} />
                    </button>

                    {/* CURRENT PAGE */}

                    <span
                      className="
                        h-9
                        w-9
                        rounded-full
                        bg-violet-100
                        text-violet-700
                        text-xs
                        font-medium
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >
                      {currentPage}
                    </span>

                    {/* NEXT */}

                    <button
                      type="button"
                      aria-label="Next page"
                      disabled={currentPage >= totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="
                        h-9
                        w-9
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

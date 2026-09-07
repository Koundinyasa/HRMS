import React, { useState, useMemo } from "react";
import { Search, Ban, Clock, ChevronDown } from "lucide-react";

import AuditLogModal, { type AuditLogEntry } from "./AuditLogModal";
import EnrollmentToolbarPortal from "../components/EnrollmentToolbarPortal";

export interface BlockedUserRow {
  employeeId: string;
  employeeName: string;
  status: "Blocked" | "Active";
}

const sampleRows: BlockedUserRow[] = [
  { employeeId: "294633", employeeName: "Sai Teja Resham", status: "Blocked" },
  { employeeId: "1", employeeName: "RAJESH UBBAPALLY", status: "Active" },
  { employeeId: "264631", employeeName: "Anusha Mavellapalli", status: "Active" },
  { employeeId: "284512", employeeName: "Varalaxmi Gumudala", status: "Active" },
  { employeeId: "284513", employeeName: "Nikhitha Narala", status: "Active" },
  { employeeId: "284514", employeeName: "Sreya Chaluvadi", status: "Active" },
];

const sampleAuditEntries: AuditLogEntry[] = [
  {
    id: "1",
    recordDetails: "Unblocked user Rohith Kumar Karkonda",
    recordChanges: "",
    actionTime: "10/Apr/2026, 02:08 PM",
    user: "Support",
    employeeName: "Rohith Kumar Karkonda",
  },
];

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

/* Header + rows share this grid so the columns line up exactly */
const GRID = "grid grid-cols-[minmax(160px,1.1fr)_minmax(220px,2fr)_minmax(160px,1.2fr)_90px]";

const ResetBlockedUserPage: React.FC = () => {
  const [rows] = useState<BlockedUserRow[]>(sampleRows);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [auditOpen, setAuditOpen] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      rows.filter((r) =>
        `${r.employeeId} ${r.employeeName}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [rows, query]
  );

  const totalCount = 87; // wire to your API total
  const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage));

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleUnblock = () => {
    console.log("Unblocking:", Array.from(selected));
    setSelected(new Set());
  };

  const pageNumbers = useMemo(() => {
    const nums: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i <= 5 || i === totalPages || Math.abs(i - page) <= 1) {
        nums.push(i);
      } else if (nums[nums.length - 1] !== "…") {
        nums.push("…");
      }
    }
    return nums;
  }, [totalPages, page]);

  return (
    <div className="relative">
      {/* Search / Unblock / audit sit on the tab row */}
      <EnrollmentToolbarPortal>
        <div className="relative">
          <Search
            size={13}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#9FB3CC]"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="h-[28px] w-[190px] rounded-[5px] border border-[#E4E7EC] bg-white pl-[28px] pr-3 text-[12.5px] text-[#33415C] placeholder:text-[#9FB3CC] focus:border-[#2D8CF0] focus:outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleUnblock}
          disabled={selected.size === 0}
          className={`flex h-[28px] items-center gap-1.5 rounded-[5px] border px-3 text-[12.5px] font-medium transition-colors ${
            selected.size === 0
              ? "cursor-not-allowed border-[#E4E7EC] text-[#A6AEBB]"
              : "border-[#DCE0E6] text-[#33415C] hover:bg-[#F5F8FC]"
          }`}
        >
          <Ban size={13} />
          Unblock
        </button>

        <button
          type="button"
          onClick={() => setAuditOpen(true)}
          title="View audit log"
          className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] text-[#9FB3CC] transition-colors hover:text-[#2D8CF0]"
        >
          <Clock size={16} strokeWidth={1.9} />
        </button>
      </EnrollmentToolbarPortal>

      <div className="mt-2 overflow-hidden rounded-[10px] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.08)]">
        {/* ---------- HEADER ---------- */}
        <div
          className={`${GRID} items-center border-b border-[#DDE9F8] bg-[#EAF2FD] py-2.5 text-[12.5px] font-semibold text-[#2B3A55]`}
        >
          <div className="px-6">Employee ID</div>
          <div className="px-6">Employee Name</div>
          <div className="px-6">Status</div>
          <div className="px-6 text-right">Action</div>
        </div>

        {/* ---------- ROWS ---------- */}
        {filtered.length === 0 ? (
          <div className="px-6 py-16 text-center text-[13px] text-[#8494AB]">
            No employees match that search.
          </div>
        ) : (
          filtered.map((row) => (
            <div
              key={row.employeeId}
              className={`${GRID} items-center border-b border-[#F1F3F6] py-[13px] text-[13px] text-[#33415C] transition-colors hover:bg-[#FAFBFD]`}
            >
              <div className="px-6">{row.employeeId}</div>

              <div className="px-6">
                <button
                  type="button"
                  className="text-[#2D8CF0] hover:underline"
                >
                  {row.employeeName}
                </button>
              </div>

              <div className="px-6">
                {row.status === "Blocked" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F4F5F7] px-2 py-[3px] text-[11px] font-medium text-[#5A6472]">
                    <Ban size={11} className="text-[#F04438]" />
                    Blocked
                  </span>
                )}
              </div>

              <div className="flex justify-end px-6">
                <input
                  type="checkbox"
                  checked={selected.has(row.employeeId)}
                  onChange={() => toggleRow(row.employeeId)}
                  className="h-[14px] w-[14px] cursor-pointer rounded-[3px] accent-[#2D8CF0]"
                />
              </div>
            </div>
          ))
        )}

        {/* ---------- PAGINATION ---------- */}
        <div className="flex items-center justify-end gap-4 px-6 py-2.5 text-[12px] text-[#5B6B80]">
          <div className="flex items-center gap-1.5">
            <span>Rows per page:</span>
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="h-[24px] cursor-pointer appearance-none border-none bg-transparent pl-1 pr-5 text-[12px] text-[#33415C] focus:outline-none"
              >
                {ROWS_PER_PAGE_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#5B6B80]"
              />
            </div>
          </div>

          <span>
            {(page - 1) * rowsPerPage + 1} to{" "}
            {Math.min(page * rowsPerPage, totalCount)} of {totalCount}
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-1 text-[#8494AB] disabled:opacity-30"
            >
              ‹
            </button>

            {pageNumbers.map((n, i) =>
              n === "…" ? (
                <span key={`e${i}`} className="px-1 text-[#C0CCDC]">
                  …
                </span>
              ) : (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n as number)}
                  className={`flex h-[22px] w-[22px] items-center justify-center rounded-full text-[12px] transition-colors ${
                    n === page
                      ? "bg-[#2D8CF0] font-semibold text-white"
                      : "text-[#5B6B80] hover:bg-[#EEF3F9]"
                  }`}
                >
                  {n}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-1 text-[#8494AB] disabled:opacity-30"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <AuditLogModal
        open={auditOpen}
        onClose={() => setAuditOpen(false)}
        entries={sampleAuditEntries}
        onExport={() => console.log("export audit log")}
      />
    </div>
  );
};

export default ResetBlockedUserPage;
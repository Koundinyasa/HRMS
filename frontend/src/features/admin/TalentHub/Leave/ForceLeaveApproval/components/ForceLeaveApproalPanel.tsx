import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  Check,
  ChevronDown,
  ClockFading,
  FileSpreadsheet,
  Filter,
  MoreVertical,
  Search,
  X as XIcon,
} from "lucide-react";
import * as XLSX from "xlsx";

import EmptyState from "./EmptyState";
import ForceLeaveApprovalTabs from "./ForceLeaveApprovalTabs";
import ForceLeaveApprovalTable from "./ForceLeaveApprovalTable";
import LeaveQueryFilter from "../../components/LeaveQueryFilter";

import type { FilterValues } from "@/features/admin/components/FilterBar";

import {
  useGetForceLeaveApprovalsQuery,
  useApproveLeavesMutation,
  useRejectLeavesMutation,
  type LeaveApprovalViewType,
  type LeaveApprovalMonthType,
} from "../api/forceleaveapprovalApi";

/* ============================================================
   TYPES
   ============================================================ */

/* ============================================================
   COMPONENT
   ============================================================ */

export default function ForceLeaveApprovalPanel() {
  /* ============================================================
     MAIN TABS
     ============================================================ */

  const [viewType, setViewType] =
    useState<LeaveApprovalViewType>("applied");

  /* ============================================================
     MONTH TABS
     ============================================================ */

  const [monthType, setMonthType] =
    useState<LeaveApprovalMonthType>("current");

  /* ============================================================
     FILTERS
     ============================================================ */

  const [filters, setFilters] =
    useState<FilterValues>({});

  /* ============================================================
     SEARCH
     ============================================================ */

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  /* ============================================================
     MORE MENU
     ============================================================ */

  const [showMoreMenu, setShowMoreMenu] =
    useState(false);
  const [moreMenuPosition, setMoreMenuPosition] = useState<{ top: number; left: number } | null>(null);

  /* ============================================================
     SELECTION
     ============================================================ */

  const [selectedIds, setSelectedIds] =
    useState<Set<number>>(new Set());

  /* ============================================================
     API
     ============================================================ */

  const {
    data: rows,
    isFetching,
  } = useGetForceLeaveApprovalsQuery({
    viewType,
    monthType,

    search:
      search.trim() || undefined,

    branch:
      filters.branch as
        | string[]
        | undefined,

    salaryStructure:
      filters.salaryStructure as
        | string[]
        | undefined,

    leave:
      filters.leave as
        | string[]
        | undefined,

    attendance:
      filters.attendance as
        | string[]
        | undefined,

    designation:
      filters.designation as
        | string[]
        | undefined,

    empStatus:
      filters.empStatus as
        | string[]
        | undefined,
  });

  /* ============================================================
     APPROVE MUTATION
     ============================================================ */

  const [
    approveLeaves,
    {
      isLoading: isApproving,
    },
  ] = useApproveLeavesMutation();

  /* ============================================================
     REJECT MUTATION
     ============================================================ */

  const [
    rejectLeaves,
    {
      isLoading: isRejecting,
    },
  ] = useRejectLeavesMutation();

  /* ============================================================
     CLEAR FILTERS
     ============================================================ */

  const clearAllFilters = () => {
    setSearch("");
    setFilters({});
    setShowMoreMenu(false);
    setMoreMenuPosition(null);
    setSelectedIds(new Set());
  };

  /* ============================================================
     VIEW CHANGE
     ============================================================ */

  const switchView = (
    value: LeaveApprovalViewType,
  ) => {
    setViewType(value);
    setSelectedIds(new Set());
  };

  /* ============================================================
     MONTH CHANGE
     ============================================================ */

  const switchMonth = (
    value: LeaveApprovalMonthType,
  ) => {
    setMonthType(value);
    setSelectedIds(new Set());
  };

  /* ============================================================
     SEARCH CHANGE
     ============================================================ */

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value);
    setSelectedIds(new Set());
  };

  /* ============================================================
     SELECTION
     ============================================================ */

  const handleSelectionChange = (
    ids: number[],
  ) => {
    setSelectedIds(new Set(ids));
  };

  const hasSelection =
    selectedIds.size > 0;

  /* ============================================================
     APPROVE
     ============================================================ */

  const handleApprove = async () => {
    if (!hasSelection) {
      return;
    }

    try {
      await approveLeaves({
        leaveApplicationIds:
          Array.from(selectedIds),
      }).unwrap();

      setSelectedIds(new Set());
    } catch (error) {
      console.error(
        "Failed to approve leave applications:",
        error,
      );
    }
  };

  /* ============================================================
     REJECT
     ============================================================ */

  const handleReject = async () => {
    if (!hasSelection) {
      return;
    }

    try {
      await rejectLeaves({
        leaveApplicationIds:
          Array.from(selectedIds),
      }).unwrap();

      setSelectedIds(new Set());
    } catch (error) {
      console.error(
        "Failed to reject leave applications:",
        error,
      );
    }
  };

  /* ============================================================
     EXCEL EXPORT
     ============================================================ */

  const handleExcelDownload = () => {
    const headers = [
      "Approver Name",
      "Employee Id",
      "Employee Name",
      "Leave Name",
      "Date",
      "Days",
    ];
    const exportRows = (rows ?? []).map((row) => [
      row.approverName,
      row.employeeId,
      row.employeeName,
      row.leaveName,
      row.date,
      row.days,
    ]);
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...exportRows]);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Leave Approval",
    );

    XLSX.writeFile(
      workbook,
      `leave-approval-${viewType}-${monthType}.xlsx`,
    );
  };

  /* ============================================================
     EMPTY MESSAGE
     ============================================================ */

  const emptyMessage =
    useMemo(
      () =>
        viewType === "applied"
          ? "No Data Found in - Leave approval"
          : "No Data Found in - Leave Cancellation",
      [viewType],
    );

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <div className="w-full bg-[#F4F6FA] font-[Urbanist]">

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="min-w-0 overflow-x-auto rounded-[10px] border border-[#df8d7c] bg-[#fff7f5] px-3 py-3 shadow-[0_1px_3px_rgba(15,23,42,0.04)] [scrollbar-color:#c58b7f_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#c58b7f] xl:overflow-x-visible sm:px-5">
        <div className="flex min-h-[48px] w-max min-w-full flex-nowrap items-center justify-between gap-3 xl:w-full">

          {/* TITLE */}

          <h3 className="inline-flex min-h-[46px] w-fit max-w-full items-center rounded-[9px] border border-[#df8d7c] bg-white px-4 py-2 text-lg font-bold leading-7 text-[#9a5547] shadow-sm sm:text-[22px]">
            Leave Approval
          </h3>

          {/* ACTIONS */}

          <div className="flex shrink-0 flex-nowrap items-center gap-1">

            {/* APPROVE */}

            <button
              type="button"
              onClick={handleApprove}
              disabled={
                !hasSelection ||
                isApproving
              }
              className={`h-12 rounded-l-lg px-5 text-[15px] font-medium ${
                hasSelection
                  ? "bg-[#914f3f] text-white hover:bg-[#7f4234]"
                  : "cursor-not-allowed bg-[#E5E5E5] text-[#AAAAAA]"
              }`}
            >
              <span className="flex items-center gap-2">
                <Check size={15} />

                {isApproving
                  ? "Approving..."
                  : "Approve"}
              </span>
            </button>

            {/* REJECT */}

            <button
              type="button"
              onClick={handleReject}
              disabled={
                !hasSelection ||
                isRejecting
              }
              className={`h-12 border-l border-white/50 px-5 text-[15px] font-medium ${
                hasSelection
                  ? "bg-[#EF4444] text-white hover:bg-[#DC2626]"
                  : "cursor-not-allowed bg-[#E5E5E5] text-[#AAAAAA]"
              }`}
            >
              <span className="flex items-center gap-2">
                <XIcon size={15} />

                {isRejecting
                  ? "Rejecting..."
                  : "Reject"}
              </span>
            </button>

            {/* EXCEL */}

            <button
              type="button"
              onClick={
                handleExcelDownload
              }
              title="Download Excel"
              className="ml-4 flex h-10 w-10 items-center justify-center text-[#378B35] transition hover:scale-105"
            >
              <FileSpreadsheet
                size={23}
                strokeWidth={2}
              />
            </button>

            {/* FILTER */}

            <button
              type="button"
              title="Filter"
              onClick={() => setShowFilters(true)}
              className="ml-3 flex h-10 w-10 items-center justify-center text-[#a45a4a] transition hover:text-[#914f3f]"
            >
              <Filter
                size={22}
                strokeWidth={2}
              />
            </button>

            {/* HISTORY */}

            <button
              type="button"
              title="History"
              className="ml-2 flex h-10 w-10 items-center justify-center text-[#a45a4a] transition hover:text-[#914f3f]"
            >
              <ClockFading
                size={22}
                strokeWidth={2}
              />
            </button>

          </div>
        </div>
      </div>

      {/* ======================================================
          APPLIED LEAVE / LEAVE CANCELLATION
          ====================================================== */}

      <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <ForceLeaveApprovalTabs
          activeTab={viewType}
          onTabChange={switchView}
        />
      </div>

      {/* ======================================================
          CURRENT / NON-CURRENT MONTH
          ====================================================== */}

      <div className="flex flex-wrap items-center gap-2 py-4 sm:py-5">

        {/* CURRENT MONTH */}

        <button
          type="button"
          onClick={() =>
            switchMonth("current")
          }
          className={`rounded-full px-4 py-2 text-[15px] font-medium transition ${
            monthType === "current"
              ? "bg-[#914f3f] text-white"
              : "bg-[#E1E3E7] text-[#172033] hover:bg-[#f8e4df] hover:text-[#9a5547]"
          }`}
        >
          Current Month Details
        </button>

        {/* NON-CURRENT MONTH */}

        <button
          type="button"
          onClick={() =>
            switchMonth(
              "non-current",
            )
          }
          className={`rounded-full px-4 py-2 text-[15px] font-medium transition ${
            monthType === "non-current"
              ? "bg-[#914f3f] text-white"
              : "bg-[#E1E3E7] text-[#172033] hover:bg-[#f8e4df] hover:text-[#9a5547]"
          }`}
        >
          Non-Current Month Details
        </button>

      </div>

      {/* ======================================================
          FILTER BAR
          ====================================================== */}

      <div className={`relative min-w-0 overflow-x-auto rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm [scrollbar-color:#c58b7f_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#c58b7f] xl:overflow-x-visible ${showFilters ? "" : "hidden"}`}>

        <div className="min-w-0 font-[Urbanist]">
        <div className="flex min-h-[46px] w-max min-w-full flex-nowrap items-center gap-4 xl:w-full xl:flex-wrap">

          {/* ==================================================
              SEARCH
              ================================================== */}

          <div className="flex w-[220px] shrink-0 items-center">

            <Search
              size={21}
              strokeWidth={1.8}
              className="mr-2.5 shrink-0 text-[#8FA0C2]"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                handleSearchChange(
                  event.target.value,
                )
              }
              placeholder="Start Typing..."
              className="
                w-full
                border-0
                bg-transparent
                text-[15px]
                font-medium
                text-[#27364F]
                outline-none
                placeholder:text-[#C8CFDA]
              "
            />

          </div>

          {/* ==================================================
              ADD FILTER
              ================================================== */}

          <button
            type="button"
            className="
              flex
              shrink-0
              items-center
              gap-1.5
              whitespace-nowrap
              text-[15px]
              font-medium
              text-[#27364F]
            "
          >
            <span className="text-[23px] font-light leading-none">
              +
            </span>

            Add Filter
          </button>

          {/* ==================================================
              QUERY
              ================================================== */}

          <LeaveQueryFilter value={search} onChange={handleSearchChange} />

          {/* ==================================================
              BRANCH
              ================================================== */}

          <button
            type="button"
            className="
              flex
              shrink-0
              items-center
              gap-1.5
              whitespace-nowrap
              text-[15px]
              font-medium
              text-[#27364F]
            "
          >
            Branch

            <ChevronDown
              size={16}
              strokeWidth={2}
            />
          </button>

          {/* ==================================================
              SALARY STRUCTURE
              ================================================== */}

          <button
            type="button"
            className="
              flex
              shrink-0
              items-center
              gap-1.5
              whitespace-nowrap
              text-[15px]
              font-medium
              text-[#27364F]
            "
          >
            Salary Structure

            <ChevronDown
              size={16}
              strokeWidth={2}
            />
          </button>

          {/* ==================================================
              LEAVE
              ================================================== */}

          <button
            type="button"
            className="
              flex
              shrink-0
              items-center
              gap-1.5
              whitespace-nowrap
              text-[15px]
              font-medium
              text-[#27364F]
            "
          >
            Leave

            <ChevronDown
              size={16}
              strokeWidth={2}
            />
          </button>

          {/* ==================================================
              ATTENDANCE
              ================================================== */}

          <button
            type="button"
            className="
              flex
              shrink-0
              items-center
              gap-1.5
              whitespace-nowrap
              text-[15px]
              font-medium
              text-[#27364F]
            "
          >
            Attendance

            <ChevronDown
              size={16}
              strokeWidth={2}
            />
          </button>

          {/* ==================================================
              DESIGNATION
              ================================================== */}

          <button
            type="button"
            className="
              flex
              shrink-0
              items-center
              gap-1.5
              whitespace-nowrap
              text-[15px]
              font-medium
              text-[#27364F]
            "
          >
            Designation

            <ChevronDown
              size={16}
              strokeWidth={2}
            />
          </button>

          {/* ==================================================
              EMP STATUS
              ================================================== */}

          <button
            type="button"
            className="
              flex
              shrink-0
              items-center
              gap-1.5
              whitespace-nowrap
              text-[15px]
              font-medium
              text-[#27364F]
            "
          >
            Emp Status

            <ChevronDown
              size={16}
              strokeWidth={2}
            />
          </button>

          {/* ==================================================
              MORE
              ================================================== */}

          <div className="relative shrink-0">

            <button
              type="button"
              aria-label="More"
              onClick={(event) => {
                if (showMoreMenu) {
                  setShowMoreMenu(false);
                  setMoreMenuPosition(null);
                  return;
                }
                const rect = event.currentTarget.getBoundingClientRect();
                setMoreMenuPosition({
                  top: Math.min(rect.bottom + 8, Math.max(8, window.innerHeight - 100)),
                  left: Math.max(8, Math.min(rect.right - 168, window.innerWidth - 168)),
                });
                setShowMoreMenu(true);
              }}
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                text-[#91A1C4]
              "
            >
              <MoreVertical
                size={20}
              />
            </button>

            {showMoreMenu && moreMenuPosition && createPortal(
              <div style={{ top: moreMenuPosition.top, left: moreMenuPosition.left }} className="fixed z-[100] w-[160px] rounded-lg border border-slate-200 bg-white p-2 shadow-lg">

                <span className="block px-3 py-2 text-[13px] text-slate-400">
                  More filters
                </span>

              </div>,
              document.body,
            )}

          </div>

          {/* ==================================================
              CLEAR
              ================================================== */}

          <button
            type="button"
            aria-label="Close filters"
            title="Close filters"
            onClick={() => {
              clearAllFilters();
              setShowFilters(false);
            }}
            className="
              flex
              h-8
              w-8
              shrink-0
              cursor-pointer
              items-center
              justify-center
              text-red-500
              transition
              hover:text-red-600
            "
          >
            <XIcon size={21} />
          </button>

        </div>

        </div>
      </div>

      {/* ======================================================
          TABLE / EMPTY STATE
          ====================================================== */}

      <div className="mt-4 min-w-0 rounded-xl border border-slate-200 bg-white px-2 py-3 shadow-sm sm:px-4 sm:py-4">

        {isFetching ? (

          <div className="flex min-h-[300px] items-center justify-center">

            <span className="text-[14px] text-slate-400">
              Loading...
            </span>

          </div>

        ) : (

          <>
            <ForceLeaveApprovalTable
              rows={rows ?? []}
              selectedIds={Array.from(
                selectedIds,
              )}
              onSelectionChange={
                handleSelectionChange
              }
              loading={false}
            />

            {(!rows ||
              rows.length === 0) && (
              <div className="pt-5">

                <EmptyState
                  message={
                    emptyMessage
                  }
                />

              </div>
            )}
          </>
        )}

      </div>

    </div>
  );
}

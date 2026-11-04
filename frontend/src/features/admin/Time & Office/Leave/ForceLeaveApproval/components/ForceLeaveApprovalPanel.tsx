import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { type FilterOption } from "@/features/admin/components/FilterDropdown";
import EmptyState from "./EmptyState";
import ForceLeaveApprovalTabs from "./ForceLeaveApprovalTabs";
import ForceLeaveApprovalTable from "./ForceLeaveApprovalTable";
import ForceLeaveApprovalRejectDialog from "./ForceLeaveApprovalRejectDialog";
import ForceLeaveApprovalPaginationControls, { useForceLeaveApprovalPagination } from "./ForceLeaveApprovalPaginationControls";
import ForceLeaveApprovalHeader from "./ForceLeaveApprovalHeader";
import ForceLeaveApprovalFilterBar from "./ForceLeaveApprovalFilterBar";
import type { FilterValues } from "@/features/admin/components/FilterBar";
import type { LeaveApprovalMonthType, LeaveApprovalRow, LeaveApprovalViewType } from "../types/forceapproval.types";
import { getSelectedIds, getSingleSelectedId } from "../validations/forceLeaveApproval.validations";
import {
  useApproveForceLeaveApprovals,
  useForceLeaveApprovalDropdowns,
  useForceLeaveApprovals,
} from "../hooks/useForceLeaveApprovalApi";

const toFilterOptions = (
  records: Record<string, unknown>[],
  valueKeys: string[],
  labelKeys: string[],
): FilterOption[] => records.flatMap((record) => {
  const entries = Object.entries(record);
  const findValue = (keys: string[]) => {
    for (const key of keys) {
      const normalizedKey = key.replace(/[^a-z0-9]/gi, "").toLowerCase();
      const entry = entries.find(([field]) => field.replace(/[^a-z0-9]/gi, "").toLowerCase() === normalizedKey);
      if (entry?.[1] !== undefined && entry[1] !== null && String(entry[1]).trim()) return String(entry[1]);
    }
    return undefined;
  };
  const label = findValue(labelKeys);
  const value = findValue(valueKeys) ?? label;
  return value && label ? [{ value, label }] : [];
});

const toLeaveFilterOptions = (
  leaveTypes: Record<string, unknown>[],
  leaveTypeCodes: Record<string, unknown>[],
): FilterOption[] => {
  const read = (record: Record<string, unknown>, keys: string[]) => {
    const entries = Object.entries(record);
    for (const key of keys) {
      const normalizedKey = key.replace(/[^a-z0-9]/gi, "").toLowerCase();
      const match = entries.find(([field]) => field.replace(/[^a-z0-9]/gi, "").toLowerCase() === normalizedKey);
      if (match?.[1] !== undefined && match[1] !== null && String(match[1]).trim()) return String(match[1]).trim();
    }
    return undefined;
  };

  return leaveTypes.flatMap((leaveType, index) => {
    const id = read(leaveType, ["leaveTypeId", "leaveId", "id", "value"]);
    const name = read(leaveType, ["leaveTypeName", "leaveName", "name", "label"]);
    const matchingById = leaveTypeCodes.find((code) => {
      const codeId = read(code, ["leaveTypeId", "leaveId", "id", "value"]);
      return id && codeId ? id === codeId : false;
    });
    const indexedCode = leaveTypeCodes[index];
    const indexedCodeId = indexedCode && read(indexedCode, ["leaveTypeId", "leaveId", "id", "value"]);
    const matchingCode = matchingById ?? (indexedCodeId ? undefined : indexedCode);
    const code = matchingCode && read(matchingCode, [
      "leaveTypeCode", "leaveCode", "code", "abbreviation", "shortName", "name", "label",
    ]);
    const value = id ?? (matchingCode && read(matchingCode, ["leaveTypeId", "leaveId", "id", "value"]));
    const label = code ?? name;
    return value && label ? [{ value, label, aliases: name && code ? [name] : undefined }] : [];
  });
};

const normalizeFilterValue = (value: string) => value.trim().toLocaleLowerCase();

const getLeaveMatchKeys = (value: string) => {
  const normalized = normalizeFilterValue(value);
  const keys = new Set([normalized]);
  const parenthesizedCode = normalized.match(/\(([a-z0-9_-]+)\)\s*$/i);
  const leaveName = normalized.replace(/\s*\([^)]+\)\s*$/, "").trim();
  if (parenthesizedCode?.[1]) keys.add(parenthesizedCode[1].toLowerCase());
  if (leaveName && leaveName !== normalized) keys.add(leaveName);
  return [...keys];
};

const filterLeaveApprovalRows = ({
  rows,
  viewType,
  monthType,
  search,
  filters,
  filterOptions,
}: {
  rows: LeaveApprovalRow[];
  viewType: LeaveApprovalViewType;
  monthType: LeaveApprovalMonthType;
  search: string;
  filters: FilterValues;
  filterOptions: Record<string, FilterOption[]>;
}): LeaveApprovalRow[] => {
  if (viewType === "cancellation") return [];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const searchTerm = search.trim().toLocaleLowerCase();
  const serverFilteredKeys = new Set<keyof FilterValues>(
    (["branch", "salaryStructure", "leave", "attendance", "designation", "empStatus"] as const)
      .filter((key) => key === "branch"
        ? getSelectedIds(filters.branch, filterOptions.branch).length > 0
        : getSingleSelectedId(filters[key], filterOptions[key]) !== undefined),
  );

  return rows.filter((row) => {
    const matchesSearch = !searchTerm ||
      row.employeeName.toLocaleLowerCase().includes(searchTerm) ||
      row.employeeId.toLocaleLowerCase().includes(searchTerm);
    if (!matchesSearch) return false;

    const matchesFilter = (key: keyof FilterValues, ...rowValues: (string | undefined)[]) => {
      const selected = (filters[key] as string[] | undefined) ?? [];
      if (!selected.length) return true;
      if (key === "branch" && serverFilteredKeys.has(key)) return true;
      if (serverFilteredKeys.has(key) && rowValues.every((value) => !value?.trim())) return true;
      const selectedLabels = filterOptions[key]
        .filter((option) => selected.includes(option.value))
        .flatMap((option) => [option.label, ...(option.aliases ?? [])])
        .flatMap((label) => key === "leave" ? getLeaveMatchKeys(label) : [normalizeFilterValue(label)]);
      const selectedKeys = new Set([...selected.map(normalizeFilterValue), ...selectedLabels]);
      return rowValues.some((value) => {
        if (!value) return false;
        const rowKeys = key === "leave" ? getLeaveMatchKeys(value) : [normalizeFilterValue(value)];
        return rowKeys.some((rowKey) => selectedKeys.has(rowKey));
      });
    };

    const matchesDropdowns =
      matchesFilter("branch", row.branchId, row.branchName) &&
      matchesFilter("salaryStructure", row.salaryStructureId, row.salaryStructureName) &&
      matchesFilter("leave", row.leaveTypeId, row.leaveName, row.leaveCode, ...row.leaveFilterValues) &&
      matchesFilter("attendance", row.attendanceStatusId, row.attendanceStatus) &&
      matchesFilter("designation", row.designationId, row.designationName) &&
      matchesFilter("empStatus", row.employeeStatusId, row.employeeStatus);
    if (!matchesDropdowns) return false;

    const dateText = row.date || row.fromDate;
    const iso = dateText.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    const dmy = dateText.match(/^(\d{1,2})[/-]([A-Za-z]{3}|\d{1,2})[/-](\d{4})$/);
    let year: number;
    let month: number;
    if (iso) {
      year = Number(iso[1]);
      month = Number(iso[2]) - 1;
    } else if (dmy) {
      year = Number(dmy[3]);
      month = /^\d+$/.test(dmy[2]) ? Number(dmy[2]) - 1 : new Date(`${dmy[2]} 1, ${dmy[3]}`).getMonth();
    } else {
      return monthType === "non-current";
    }
    const isCurrentMonth = month === currentMonth && year === currentYear;
    return monthType === "current" ? isCurrentMonth : !isCurrentMonth;
  });
};

export default function ForceLeaveApprovalPanel() {
  const approverId = useAppSelector((state) => state.auth.employeeId);
  const { data: dropdownData } = useForceLeaveApprovalDropdowns();
  const [viewType, setViewType] =
    useState<LeaveApprovalViewType>("applied");
  const [monthType, setMonthType] =
    useState<LeaveApprovalMonthType>("current");
  const [filters, setFilters] =
    useState<FilterValues>({});
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedIds, setSelectedIds] =
    useState<Set<number>>(new Set());
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const filterOptions = useMemo<Record<string, FilterOption[]>>(() => ({
    branch: toFilterOptions(dropdownData?.branches ?? [], ["branchId", "id", "value"], ["branchName", "name", "label"]),
    salaryStructure: toFilterOptions(dropdownData?.salaryStructures ?? [], ["salaryStructureId", "structureId", "id", "value", "salaryStructure", "structureName"], ["salaryStructureName", "salaryStructure", "structureName", "salaryStructureDesc", "description", "name", "label"]),
    leave: toLeaveFilterOptions(dropdownData?.leaveTypes ?? [], dropdownData?.leaveTypeCodes ?? []),
    attendance: toFilterOptions(dropdownData?.attendanceStatuses ?? [], ["attendanceStatusId", "statusId", "attendanceId", "id", "value", "attendanceStatus", "status", "code"], ["attendanceStatus", "attendanceStatusName", "statusName", "status", "attendanceName", "description", "name", "label", "code"]),
    designation: toFilterOptions(dropdownData?.designations ?? [], ["designationId", "id", "value", "designationName", "name"], ["designationName", "designation", "name", "description", "label"]),
    empStatus: toFilterOptions(dropdownData?.employeeStatuses ?? [], ["employeeStatusId", "employeeStatusID", "statusId", "id", "value", "employeeStatus", "status"], ["employeeStatus", "employeeStatusName", "statusName", "status", "description", "name", "label"]),
  }), [dropdownData]);

  const {
    data: rows,
    isFetching,
    isError: isLoadError,
    refetch,
  } = useForceLeaveApprovals({
    viewType,
    monthType,
    approverId: approverId ?? undefined,
    branchId: getSelectedIds(filters.branch, filterOptions.branch).length === 1
      ? getSelectedIds(filters.branch, filterOptions.branch)[0]
      : undefined,
    branchIds: getSelectedIds(filters.branch, filterOptions.branch).length > 1
      ? getSelectedIds(filters.branch, filterOptions.branch)
      : undefined,
    structureId: getSingleSelectedId(filters.salaryStructure, filterOptions.salaryStructure),
    leaveTypeId: getSingleSelectedId(filters.leave, filterOptions.leave),
    attendanceStatusId: getSingleSelectedId(filters.attendance, filterOptions.attendance),
    designationId: getSingleSelectedId(filters.designation, filterOptions.designation),
    employmentStatusId: getSingleSelectedId(filters.empStatus, filterOptions.empStatus),
  });

  const updateFilter = (key: keyof FilterValues, value: string[]) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
    setSelectedIds(new Set());
  };

  const visibleRows = useMemo(() => filterLeaveApprovalRows({
    rows: rows ?? [],
    viewType,
    monthType,
    search,
    filters,
    filterOptions,
  }), [rows, monthType, search, filters, filterOptions, viewType]);

  const {
    setPage,
    pageSize,
    setPageSize,
    currentPage,
    totalPages,
    paginatedRows,
  } = useForceLeaveApprovalPagination(visibleRows);

  const [
    approveLeaves,
    {
      isLoading: isApproving,
    },
  ] = useApproveForceLeaveApprovals();
  const clearAllFilters = () => {
    setSearch("");
    setFilters({});
    setPage(1);
    setSelectedIds(new Set());
  };
  const switchView = (
    value: LeaveApprovalViewType,
  ) => {
    setViewType(value);
    setPage(1);
    setSelectedIds(new Set());
  };
  const switchMonth = (
    value: LeaveApprovalMonthType,
  ) => {
    setMonthType(value);
    setPage(1);
    setSelectedIds(new Set());
  };
  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value);
    setPage(1);
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
  const selectedRows = visibleRows.filter((row) =>
    selectedIds.has(row.id),
  );

  /* ============================================================
     APPROVE
     ============================================================ */

  const handleApprove = async () => {
    if (!hasSelection) {
      return;
    }

    try {
      const result = await approveLeaves({
        approvalIds: Array.from(selectedIds),
      }).unwrap();

      // The message from the stored procedure (first row) wins over the generic one
      const responseMessage =
        (result.data?.[0] as { Message?: string } | undefined)?.Message ||
        result.message;

      if (result.success === false) {
        toast.error(responseMessage || "Failed to approve leave.");
        return;
      }

      if (result.failed > 0) {
        toast.warning(
          `${result.succeeded} approved, ${result.failed} could not be approved.`,
        );
      } else {
        toast.success(responseMessage || "Leave approved successfully.");
      }

      setSelectedIds(new Set());
    } catch (error) {
      console.error(
        "Failed to approve leave applications:",
        error,
      );
      const serverMessage = (error as { data?: { message?: string | string[] } })
        ?.data?.message;
      toast.error(
        (Array.isArray(serverMessage) ? serverMessage[0] : serverMessage) ||
          "Unable to approve the selected leave. Please try again.",
      );
    }
  };
  const openRejectDialog = () => {
    setShowRejectDialog(true);
  };

  const handleExcelDownload = () => {
    const headers = [
      "Approver Name",
      "Employee Id",
      "Employee Name",
      "Leave Type",
      "Applied Date",
      "From Date",
      "To Date",
      "No. of Days",
    ];
    const exportRows = visibleRows.map((row) => [
      row.approverName,
      row.employeeId,
      row.employeeName,
      row.leaveName,
      row.date,
      row.fromDate,
      row.toDate,
      row.noofdaysDisplay,
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

  const emptyMessage =
    useMemo(
      () =>
        viewType === "applied"
          ? "No Data Found in - Leave approval"
          : "No Data Found in - Leave Cancellation",
      [viewType],
    );

  return (
    <div className="w-full bg-[#F4F6FA] font-[Urbanist]">

      <ForceLeaveApprovalHeader
        hasSelection={hasSelection}
        isApproving={isApproving}
        isRejecting={isRejecting}
        onApprove={() => void handleApprove()}
        onReject={openRejectDialog}
        onExport={handleExcelDownload}
      />

      <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <ForceLeaveApprovalTabs
          activeTab={viewType}
          onTabChange={switchView}
        />
      </div>

      <div className="grid w-full grid-cols-2 items-center gap-2 py-4 sm:flex sm:flex-wrap sm:gap-2 sm:py-5">
        <Button variant="ghost"
          type="button"
          onClick={() =>
            switchMonth("current")
          }
          className={`min-w-0 rounded-full px-2 py-2 text-center text-xs font-medium transition sm:px-4 sm:text-[15px] ${
            monthType === "current"
              ? "bg-[#914f3f] text-white"
              : "bg-[#E1E3E7] text-[#172033] hover:bg-[#f8e4df] hover:text-[#9a5547]"
          }`}
        >
          Current Month Details
        </Button>

        {/* <Button variant="ghost"
          type="button"
          onClick={() =>
            switchMonth(
              "non-current",
            )
          }
          className={`min-w-0 rounded-full px-2 py-2 text-center text-xs font-medium transition sm:px-4 sm:text-[15px] ${
            monthType === "non-current"
              ? "bg-[#914f3f] text-white"
              : "bg-[#E1E3E7] text-[#172033] hover:bg-[#f8e4df] hover:text-[#9a5547]"
          }`}
        >
          Non-Current Month Details
        </Button> */}

      </div>
      <ForceLeaveApprovalFilterBar
        show={showFilters}
        searchValue={search}
        filters={filters}
        options={filterOptions}
        onSearchChange={handleSearchChange}
        onFilterChange={updateFilter}
        onClear={clearAllFilters}
        onClose={() => setShowFilters(false)}
      />
      <div className="mt-4 min-w-0 rounded-xl border border-slate-200 bg-white px-2 py-3 shadow-sm sm:px-4 sm:py-4">
        {isLoadError ? (
          <div
            role="alert"
            className="flex min-h-[180px] flex-col items-center justify-center gap-3 text-center text-sm text-red-600"
          >
            <span>Unable to load leave approvals from the server.</span>
            <Button variant="ghost"
              type="button"
              onClick={() => void refetch()}
              className="rounded-md border border-red-300 px-3 py-1.5 font-medium hover:bg-red-50"
            >
              Retry
            </Button>
          </div>
        ) : isFetching ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <span className="text-[14px] text-slate-400">
              Loading...
            </span>
          </div>
        ) : (
          <>
            <ForceLeaveApprovalTable
              rows={paginatedRows}
              selectedIds={Array.from(
                selectedIds,
              )}
              onSelectionChange={
                handleSelectionChange
              }
              loading={false}
            />
            {visibleRows.length === 0 && (
              <div className="pt-5">
                <EmptyState
                  message={
                    emptyMessage
                  }
                />
              </div>
            )}
            {visibleRows.length > 0 && (
              <ForceLeaveApprovalPaginationControls
                itemCount={visibleRows.length}
                currentPage={currentPage}
                pageSize={pageSize}
                totalPages={totalPages}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
              />
            )}
          </>
        )}
      </div>
      {showRejectDialog && (
        <ForceLeaveApprovalRejectDialog
          rows={selectedRows}
          onClose={() => setShowRejectDialog(false)}
          onRejected={() => setSelectedIds(new Set())}
          onSubmittingChange={setIsRejecting}
        />
      )}
    </div>
  );
}

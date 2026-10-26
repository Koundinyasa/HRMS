import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { ForceLeaveApprovalTableProps } from "../types/forceapproval.types";

const ForceLeaveApprovalTable = ({
  rows,
  selectedIds = [],
  onSelectionChange,
  loading = false,
}: ForceLeaveApprovalTableProps) => {
  const [employeeNameSort, setEmployeeNameSort] = useState<"asc" | "desc" | null>(null);
  const displayedRows = employeeNameSort
    ? [...rows].sort((a, b) => {
        const order = a.employeeName.localeCompare(b.employeeName, undefined, { sensitivity: "base" });
        return employeeNameSort === "asc" ? order : -order;
      })
    : rows;
  const allSelected =
    rows.length > 0 &&
    rows.every((row) => selectedIds.includes(row.id));
  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange?.([]);
      return;
    }
    onSelectionChange?.(rows.map((row) => row.id));
  };
  const handleSelectRow = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange?.(
        selectedIds.filter((selectedId) => selectedId !== id),
      );
    } else {
      onSelectionChange?.([...selectedIds, id]);
    }
  };
  return (
    <div className="w-full overflow-x-auto font-[Urbanist] [scrollbar-color:#c58b7f_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#c58b7f]">
      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <span className="text-[14px] text-slate-400">
            Loading...
          </span>
        </div>
      ) : (
        <>
          {/* Table Header */}
          <div
            className="min-w-[980px]
              grid
              grid-cols-[1.2fr_0.75fr_1.3fr_1.5fr_0.9fr_0.9fr_0.9fr_0.7fr_50px]
              items-center
              rounded-md
              bg-[#fff1ed]
              px-4
              py-3
            "
          >
            <span className="text-[13px] font-semibold text-[#9a5547]">
              Approver Name
            </span>
            <span className="text-[13px] font-semibold text-[#9a5547]">
              Employee Id
            </span>
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="truncate text-[13px] font-semibold text-[#9a5547]">Employee Name</span>
              <Button variant="ghost"
                type="button"
                onClick={() => setEmployeeNameSort((current) => current === "asc" ? "desc" : "asc")}
                title={employeeNameSort === "asc" ? "Sort employee names Z to A" : "Sort employee names A to Z"}
                aria-label={employeeNameSort === "asc" ? "Sort employee names Z to A" : "Sort employee names A to Z"}
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${employeeNameSort ? "border-[#9a5547] bg-[#9a5547] hover:bg-[#874739]" : "border-[#f2d2ca] bg-white hover:bg-[#fff7f5]"} ${employeeNameSort ? "text-[#9a5547]" : "text-slate-400"}`}
              >
                <span aria-hidden="true" className={`whitespace-nowrap text-[17px] font-bold leading-none ${employeeNameSort ? "text-white" : "text-[#9a5547]"}`}>
                  {employeeNameSort === "asc" ? "↑" : employeeNameSort === "desc" ? "↓" : "↑↓"}
                </span>
              </Button>
            </div>
            <span className="text-[13px] font-semibold text-[#9a5547]">
              Leave Type
            </span>
            <span className="text-[13px] font-semibold text-[#9a5547]">
              Applied Date
            </span>
            <span className="text-[13px] font-semibold text-[#9a5547]">
              From Date
            </span>
            <span className="text-[13px] font-semibold text-[#9a5547]">
              To Date
            </span>
            <span className="text-[13px] font-semibold text-[#9a5547]">
              No. of Days
            </span>
            {/* Select All */}
            <div className="flex justify-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                disabled={rows.length === 0}
                className="h-[19px] w-[19px] cursor-pointer appearance-auto rounded border-2 border-[#9a5547] bg-white opacity-100 accent-[#9a5547] disabled:cursor-not-allowed disabled:opacity-100"
                aria-label="Select all leave approvals"
              />
            </div>
          </div>
          {/* Table Rows */}
          {displayedRows.length > 0 && (
            <div className="mt-2">
              {displayedRows.map((row) => {
                const selected = selectedIds.includes(row.id);

                return (
                  <div
                    key={row.id}
                    className={`
                      grid min-w-[980px]
                      grid-cols-[1.2fr_0.75fr_1.3fr_1.5fr_0.9fr_0.9fr_0.9fr_0.7fr_50px]
                      items-center
                      border-b
                      border-slate-100
                      px-4
                      py-4
                      transition-colors
                      ${
                        selected
                          ? "bg-[#fff7f5]"
                          : "bg-white"
                      }
                    `}
                  >
                    {/* Approver Name */}
                    <span
                      className="
                        truncate
                        pr-3
                        text-[13px]
                        font-medium
                        text-black
                      "
                      title={row.approverName}
                    >
                      {row.approverName}
                    </span>
                    {/* Employee ID */}
                    <span
                      className="
                        truncate
                        pr-3
                        text-[13px]
                        text-black
                      "
                      title={row.employeeId}
                    >
                      {row.employeeId}
                    </span>
                    {/* Employee Name */}
                    <span
                      className="
                        truncate
                        pr-3
                        text-[13px]
                        text-black
                      "
                      title={row.employeeName}
                    >
                      {row.employeeName}
                    </span>
                    {/* Leave Type */}
                    <span
                      className="
                        truncate
                        pr-3
                        text-[13px]
                        text-black
                      "
                      title={row.leaveName}
                    >
                      {row.leaveName}
                    </span>
                    {/* Date */}
                    <span
                      className="
                        truncate
                        pr-3
                        text-[13px]
                        text-black
                      "
                      title={row.date}
                    >
                      {row.date}
                    </span>
                    {/* Leave date range */}
                    <span className="truncate pr-3 text-[13px] text-black" title={row.fromDate}>
                      {row.fromDate || "-"}
                    </span>
                    <span className="truncate pr-3 text-[13px] text-black" title={row.toDate}>
                      {row.toDate || "-"}
                    </span>
                    {/* Days */}
                    <span
                      className="
                        truncate
                        pr-3
                        text-[13px]
                        text-black
                      "
                      title={row.noofdaysDisplay}
                    >
                      {row.noofdaysDisplay}
                    </span>
                    {/* Row Checkbox */}
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => handleSelectRow(row.id)}
                        className="h-[17px] w-[17px] accent-[#269BD7]"
                        aria-label={`Select ${row.employeeName}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default ForceLeaveApprovalTable;

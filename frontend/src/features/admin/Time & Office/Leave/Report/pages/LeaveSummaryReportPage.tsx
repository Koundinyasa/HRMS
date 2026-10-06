import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReportHeader from "../components/ReportHeader";
import ReportFilters from "../components/ReportFilters";
import ReportPagination from "../components/ReportPagination";
import noDataImage from "@/assets/images/no-data.png";

interface Row extends Record<string, unknown> {
  id?: string | number;
  employeeId?: string;
  employeeName?: string;
}

export default function LeaveSummaryReportPage() {
  const navigate = useNavigate();
  const [fromMonth, setFromMonth] = useState("Aug/2026");
  const [toMonth, setToMonth] = useState("Sep/2026");
  const [groupBy, setGroupBy] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [page, setPage] = useState(1);

  // No mock data. The existing backend endpoint/response contract should be connected here.
  const rows: Row[] = [];

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(row =>
      String(row.employeeId ?? "").toLowerCase().includes(q) ||
      String(row.employeeName ?? "").toLowerCase().includes(q)
    );
  }, [rows, search]);

  const lopColumns = [
    { key: "opening", label: "Op.Bal." },
    { key: "allotted", label: "Allotted" },
    { key: "availed", label: "Availed" },
    { key: "encashed", label: "Encashed" },
    { key: "adjusted", label: "Adjusted" },
    { key: "lapsed", label: "Lapsed" },
    { key: "closing", label: "Cl.Bal." },
  ];
  const clColumns = [
    { key: "opening", label: "Op.Bal." },
    { key: "allotted", label: "Allotted" },
    { key: "availed", label: "Availed" },
    { key: "encashed", label: "Encashed" },
    { key: "adjusted", label: "Adjusted" },
    { key: "lapsed", label: "Lapsed" },
    { key: "closing", label: "Cl.Bal." },
  ];
  const leaveGroups = [
    { key: "lop", title: "Loss of Pay (LOP)", columns: lopColumns },
    { key: "cl", title: "Casual Leave (CL)", columns: clColumns },
  ];
  const visibleLeaveGroups = groupBy
    ? leaveGroups.filter((group) => group.title === groupBy)
    : leaveGroups;
  const metricCount = visibleLeaveGroups.reduce((count, group) => count + group.columns.length, 0);
  const metricColumnWidth = `${84 / metricCount}%`;

  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  return (
    <div className="min-h-screen w-full bg-[#F5F6F8] p-3 font-[Urbanist]">
      <ReportHeader
        title="Leave Summary Report"
        fromMonth={fromMonth}
        toMonth={toMonth}
        onFromMonthChange={setFromMonth}
        onToMonthChange={setToMonth}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        groupByOptions={leaveGroups.map((group) => group.title)}
        groupByPlaceholder="Select Leave"
        onBack={() => navigate(-1)}
        onShowFilters={() => setShowFilters(true)}
        onRefresh={() => setPage(1)}
        showSubHeader
        showFilterButton
        showPdfExport
        showExcelExport
        showRefresh
      />

      <ReportFilters
        showFilters={showFilters}
        onHideFilters={() => setShowFilters(false)}
        search={search}
        onSearchChange={setSearch}
        onSearch={() => setPage(1)}
        onAddFilter={() => {}}
        filterOptions={[
          { key: "query", label: "Query", options: ["Employee Name", "Employee ID"] },
          { key: "branch", label: "Branch", options: ["All"] },
          { key: "salaryStructure", label: "Salary Structure", options: ["All"] },
          { key: "leave", label: "Leave", options: ["All"] },
          { key: "attendance", label: "Attendance", options: ["All"] },
          { key: "designation", label: "Designation", options: ["All"] },
          { key: "empStatus", label: "Emp Status", options: ["All", "Active", "Inactive"] },
        ]}
        selectedFilters={selectedFilters}
        onFiltersChange={setSelectedFilters}
      />

      <div className="mt-2 overflow-x-auto rounded-[9px] border border-[#d5d9df] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <table data-report-export className="w-full min-w-[900px] table-fixed border-collapse font-[Urbanist] text-[#111827]">
          <colgroup>
            <col style={{ width: "3%" }} />
            <col style={{ width: "4%" }} />
            <col style={{ width: "9%" }} />
            {visibleLeaveGroups.flatMap((group) =>
              group.columns.map((column) => <col key={`${group.key}-${column.key}`} style={{ width: metricColumnWidth }} />),
            )}
          </colgroup>
          <thead>
            <tr className="h-[48px] bg-[#fff5f2] text-[11px] font-semibold text-[#9a5547]">
              <th rowSpan={2} className="border-b border-r border-[#f0d5ce] px-1 text-center">Sl. No.</th>
              <th rowSpan={2} className="border-b border-r border-[#f0d5ce] px-1 text-center">Emp. ID</th>
              <th rowSpan={2} className="border-b border-r border-[#f0d5ce] px-1 text-center">Employee Name</th>
              {visibleLeaveGroups.map((group) => (
                <th key={group.key} colSpan={group.columns.length} className="border-b border-[#f0d5ce] px-1 text-center text-[13px]">
                  {group.title}
                </th>
              ))}
            </tr>
            <tr className="h-[48px] bg-[#fff5f2] text-[9px] font-semibold text-[#9a5547]">
              {visibleLeaveGroups.flatMap((group) =>
                group.columns.map((column) => (
                  <th key={`${group.key}-${column.key}`} className="border-b border-r border-[#f0d5ce] px-0.5 text-center">
                    {column.label}
                  </th>
                )),
              )}
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={3 + metricCount} className="py-3 text-center font-[Urbanist] text-[13px] text-[#667085]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <img src={noDataImage} alt="No data" className="h-[130px] max-w-full object-contain" />
                    <span>No Data Found - Report</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredRows.map((row, index) => (
                <tr key={String(row.id ?? index)} className="border-b border-[#eef0f2] text-[11px] hover:bg-[#fffaf8]">
                  <td className="px-1 py-2 text-center">{index + 1}</td>
                  <td className="px-1 py-2 text-center">{String(row.employeeId ?? "")}</td>
                  <td className="truncate px-1 py-2">{String(row.employeeName ?? "")}</td>
                  {visibleLeaveGroups.flatMap((group) =>
                    group.columns.map((column) => (
                      <td key={`${group.key}-${column.key}`} className="truncate px-0.5 py-2 text-center">
                        {String(row[`${group.key}_${column.key}`] ?? "")}
                      </td>
                    )),
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ReportPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

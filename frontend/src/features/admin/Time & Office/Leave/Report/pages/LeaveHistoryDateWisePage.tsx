import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReportHeader from "../components/ReportHeader";
import ReportFilters from "../components/ReportFilters";
import ReportTable, { type ReportTableColumn } from "../components/ReportTable";
import ReportPagination from "../components/ReportPagination";

interface Row extends Record<string, unknown> {
  id?: string | number;
  employeeId?: string;
  employeeName?: string;
}

export default function LeaveHistoryDateWisePage() {
  const navigate = useNavigate();
  const [fromMonth, setFromMonth] = useState("2026-09-01");
  const [toMonth, setToMonth] = useState("2026-09-30");
  const [groupBy, setGroupBy] = useState("Leave Policy");
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

  const columns: ReportTableColumn<Row>[] = [
    { key: "c0", label: "Sl. No.", align: "center", filterable: true },
    { key: "c1", label: "Employee ID", align: "left", filterable: true },
    { key: "c2", label: "Employee Name", align: "left", filterable: true },
    { key: "c3", label: "Branch", align: "left", filterable: true },
    { key: "c4", label: "Department", align: "left", filterable: true },
    { key: "c5", label: "Designation", align: "left", filterable: true },
    { key: "c6", label: "Type", align: "center", filterable: true },
    { key: "c7", label: "Date", align: "center", filterable: true },
    { key: "c8", label: "Q1", align: "center", filterable: true },
    { key: "c9", label: "Q2", align: "center", filterable: true },
    { key: "c10", label: "Q3", align: "center", filterable: true },
    { key: "c11", label: "Q4", align: "center", filterable: true },
    { key: "c12", label: "FH", align: "center", filterable: true },
    { key: "c13", label: "SH", align: "center", filterable: true },
    { key: "c14", label: "Total Days", align: "center", filterable: true },
    { key: "c15", label: "Applied Date", align: "center", filterable: true },
  ];

  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  return (
    <div className="min-h-screen w-full bg-[#F5F6F8] p-3 font-[Urbanist]">
      <ReportHeader
        title="Leave History Report(Date Wise)"
        fromMonth={fromMonth}
        toMonth={toMonth}
        dateRange
        onFromMonthChange={setFromMonth}
        onToMonthChange={setToMonth}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        groupByOptions={["Leave Policy"]}
        showGroupBy={false}
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

      <div className="mt-2">
        <ReportTable columns={columns} rows={filteredRows} loading={false} emptyMessage="No Data Found - Report" headerVariant="orange" />
      </div>

      <ReportPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

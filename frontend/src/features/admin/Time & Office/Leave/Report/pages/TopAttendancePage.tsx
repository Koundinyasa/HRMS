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

export default function TopAttendancePage() {
  const navigate = useNavigate();
  const [fromMonth, setFromMonth] = useState("Aug/2026");
  const [toMonth, setToMonth] = useState("Sep/2026");
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
    { key: "c0", label: "Sl. No.", align: "left" },
    { key: "c1", label: "Employee ID.", align: "left" },
    { key: "c2", label: "Employee Name", align: "left" },
    { key: "c3", label: "Attendance(%)", align: "center" },
  ];

  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  return (
    <div className="min-h-screen w-full bg-[#F5F6F8] p-3 font-[Urbanist]">
      <ReportHeader
        title="Top Attendance"
        fromMonth={fromMonth}
        toMonth={toMonth}
        onFromMonthChange={setFromMonth}
        onToMonthChange={setToMonth}
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
        <ReportTable columns={columns} rows={filteredRows} loading={false} emptyMessage="No Data Found - Report" />
      </div>

      <ReportPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

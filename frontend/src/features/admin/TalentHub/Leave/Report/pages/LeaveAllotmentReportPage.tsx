import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import ReportHeader from "../components/ReportHeader";
import ReportFilters from "../components/ReportFilters";
import ReportTable, { type ReportTableColumn } from "../components/ReportTable";
import ReportPagination from "../components/ReportPagination";
import { attendanceApi } from "../../api/leaveApi";

interface Row extends Record<string, unknown> {
  id?: string | number;
  employeeId?: string;
  employeeName?: string;
}

const readField = (row: Record<string, unknown>, ...names: string[]) => {
  const normalizedNames = new Set(
    names.map((name) => name.toLowerCase().replace(/[^a-z0-9]/g, "")),
  );
  const match = Object.entries(row).find(([key]) =>
    normalizedNames.has(key.toLowerCase().replace(/[^a-z0-9]/g, "")),
  );
  return match?.[1];
};

export default function LeaveAllotmentReportPage() {
  const navigate = useNavigate();
  const [fromMonth, setFromMonth] = useState("Aug/2026");
  const [toMonth, setToMonth] = useState("Sep/2026");
  const [groupBy, setGroupBy] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
  const [page, setPage] = useState(1);

  const reportQuery = attendanceApi.endpoints.getLeaveAllotmentReport.useQuery({
    FromMonth: fromMonth,
    ToMonth: toMonth,
  });
  const rows: Row[] = (reportQuery.data?.data ?? []).map((item, index) => {
    const employeeId = readField(item, "EmployeeId", "EmployeeCode", "EmpCode", "EmpId");
    const employeeName = readField(item, "EmployeeName", "Name");

    return {
      ...item,
      employeeId: employeeId == null ? "" : String(employeeId),
      employeeName: employeeName == null ? "" : String(employeeName),
      c0: readField(item, "SlNo", "SerialNo", "SNo") ?? index + 1,
      c1: employeeId ?? "",
      c2: employeeName ?? "",
      c3: readField(item, "CL", "CasualLeave", "CasualLeaveAllotted") ?? "",
      c4: readField(item, "SL", "SickLeave", "SickLeaveAllotted") ?? "",
      c5: readField(item, "ML", "MedicalLeave", "MedicalLeaveAllotted") ?? "",
    };
  });
  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter(
      (row) =>
        String(row.employeeId ?? "").toLowerCase().includes(query) ||
        String(row.employeeName ?? "").toLowerCase().includes(query),
    );
  }, [rows, search]);

  const columns: ReportTableColumn<Row>[] = [
    { key: "c0", label: "Sl. No." },
    { key: "c1", label: "Employee ID" },
    { key: "c2", label: "Employee Name" },
    { key: "c3", label: "CL", align: "center" },
    { key: "c4", label: "SL", align: "center" },
    { key: "c5", label: "ML", align: "center" },
  ];
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / 20));

  const exportExcel = () => {
    const sheetRows = [
      columns.map((column) => column.label),
      ...filteredRows.map((row) =>
        columns.map((column) => String(row[column.key] ?? "")),
      ),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(sheetRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leave Allotment");
    XLSX.writeFile(workbook, "leave-allotment-report.xlsx");
  };

  const exportPdf = () => {
    const document = new jsPDF({ orientation: "landscape" });
    document.setFontSize(14);
    document.text("Leave Allotment Report", 14, 15);
    autoTable(document, {
      startY: 21,
      head: [columns.map((column) => column.label)],
      body: filteredRows.map((row) =>
        columns.map((column) => String(row[column.key] ?? "")),
      ),
      headStyles: { fillColor: [255, 245, 242], textColor: [154, 85, 71] },
      styles: { fontSize: 9 },
    });
    document.save("leave-allotment-report.pdf");
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F6F8] p-3 font-serif">
      <ReportHeader
        title="Leave Allotment Report"
        fromMonth={fromMonth}
        toMonth={toMonth}
        onFromMonthChange={setFromMonth}
        onToMonthChange={setToMonth}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        groupByOptions={["Employee Leave Policy", "Intern Leave Policy"]}
        groupByMultiSelect
        groupByPlaceholder="Group by Leave Policy"
        onBack={() => navigate(-1)}
        onShowFilters={() => setShowFilters(true)}
        onPdfExport={exportPdf}
        onExcelExport={exportExcel}
        onRefresh={() => {
          setPage(1);
          void reportQuery.refetch();
        }}
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
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
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
        <ReportTable
          columns={columns}
          rows={filteredRows}
          loading={reportQuery.isLoading || reportQuery.isFetching}
          emptyMessage={reportQuery.isError ? "Failed to load report data." : "No Data Found - Report"}
        />
      </div>
      <ReportPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

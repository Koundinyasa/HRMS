






// EmployeeIdCard.tsx
import { useState } from "react";
import ReportHeader from "../components/ReportHeader";
import ReportFilters from "../components/ReportFilters";
import EmptyState from "../components/common/EmptyState";
import { useReportFilters } from "../hooks/useReportFilters";
import { useEmployeeReportData } from "../hooks/useEmployeeReportData";

export default function EmployeeIdCard() {
  const { filters, setFilters, clearAll } = useReportFilters();
  const [searchDraft, setSearchDraft] = useState("");

  const { rows, loading, handleExport } = useEmployeeReportData({
    reportType: "employee-id-card",
    filters,
    exportTitle: "Employee ID Card",
  });

  const employee = rows[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchDraft });
  };

  return (
    <div className="space-y-3">
      <ReportHeader
        title="Employee ID Card"
        onExportPdf={() => handleExport("pdf")}
        onExportExcel={() => handleExport("excel")}
      />

      <ReportFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearAll={clearAll}
      />

      <form
        onSubmit={handleSearch}
        className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 sm:px-6 py-3 flex items-center gap-3"
      >
        <input
          type="search"
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          placeholder="Search by Employee ID or Name"
          className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:border-orange-400"
        />
        <button
          type="submit"
          className="px-4 py-1.5 text-sm font-medium text-white bg-orange-800 rounded-md hover:bg-orange-900 transition-colors"
        >
          Search
        </button>
      </form>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="text-center text-gray-400 py-10">Loading...</div>
        ) : !employee ? (
          <EmptyState message="Search for an employee to view their ID card" />
        ) : (
          <div className="max-w-sm mx-auto border border-gray-200 rounded-lg overflow-hidden shadow">
            <div className="bg-orange-800 text-white text-center py-3 font-semibold text-sm">
              Employee ID Card
            </div>
            <div className="p-4 space-y-1 text-sm text-gray-700">
              <p><span className="font-medium">Employee ID:</span> {String(employee.employeeId ?? "-")}</p>
              <p><span className="font-medium">Name:</span> {String(employee.employeeName ?? "-")}</p>
              {Object.entries(employee)
                .filter(([key]) => !["slNo", "employeeId", "employeeName"].includes(key))
                .map(([key, value]) => (
                  <p key={key}>
                    <span className="font-medium capitalize">{key}:</span> {String(value ?? "-")}
                  </p>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
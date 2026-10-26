import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TimeOfficeReportHeader from "../components/TimeOfficeReportHeader";
import TimeOfficeFilters from "../components/TimeOfficeFilters";
import TimeOfficeTable from "../components/TimeOfficeTable";
import TimeOfficePagination from "../components/TimeOfficePagination";
import { getEmployeeTADetails } from "../api/timeOffice.api";
import { useTimeOfficeFilters } from "../hooks/useTimeOfficeFilters";
import { validateDateRange } from "../validations/timeOffice.validation";

const getTodayDate = (): string => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const COLUMNS = [
  "Sl.No.",
  "Employee ID",
  "Employee Name",
  "Date",
  "Reporting Authority",
  "Shift Worked",
  "Pattern",
  "Policy",
];

const getValue = (row: Record<string, unknown>, ...keys: string[]) => {
  const matchingKey = keys.find((key) => row[key] !== undefined);
  return matchingKey ? row[matchingKey] : "";
};

const normalizeRows = (payload: unknown): Record<string, unknown>[] => {
  const response = payload as { data?: unknown; result?: unknown; items?: unknown };
  const data = Array.isArray(payload)
    ? payload
    : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.result)
        ? response.result
        : Array.isArray(response?.items)
          ? response.items
          : [];

  return data.filter(
    (row): row is Record<string, unknown> =>
      typeof row === "object" && row !== null
  ).map((row, index) => ({
    "Sl.No.": index + 1,
    "Employee ID": getValue(row, "Employee ID", "employeeId", "employeeID", "Emp ID"),
    "Employee Name": getValue(row, "Employee Name", "employeeName", "Emp Name"),
    Date: getValue(row, "Date", "date", "attendanceDate"),
    "Reporting Authority": getValue(row, "Reporting Authority", "reportingAuthority", "reportingManager"),
    "Shift Worked": getValue(row, "Shift Worked", "shiftWorked", "shift"),
    Pattern: getValue(row, "Pattern", "pattern"),
    Policy: getValue(row, "Policy", "policy"),
  }));
};

export default function EmployeeTADetailsPage() {
  const navigate = useNavigate();
  const today = getTodayDate();

  const { filters, updateFilter, resetFilters } =
    useTimeOfficeFilters();

  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = async () => {
    const validation = validateDateRange(
      filters.fromDate || today,
      filters.toDate || today
    );

    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getEmployeeTADetails({
        fromDate: filters.fromDate || today,
        toDate: filters.toDate || today,
        employeeId: filters.employeeId,
        employeeName: filters.employeeName,
      });

      setRows(normalizeRows(response));
      setCurrentPage(1);
    } catch (requestError) {
      setRows([]);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load Employee TA Details."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    resetFilters();
    setRows([]);
    setError(null);
    setCurrentPage(1);
  };

  return (
    <div className="relative z-0 min-h-screen bg-[#f5f6fa] p-4">

      {/* Report Header */}
      <TimeOfficeReportHeader
        title="Employee TA Details"
        fromDate={filters.fromDate || today}
        toDate={filters.toDate || today}
        onFromDateChange={(value) => updateFilter("fromDate", value)}
        onToDateChange={(value) => updateFilter("toDate", value)}
        onBack={() => navigate(-1)}
        showRefresh
      />

      {/* Filters */}
      <TimeOfficeFilters
        fromDate={filters.fromDate || today}
        toDate={filters.toDate || today}
        employeeId={filters.employeeId}
        employeeName={filters.employeeName}
        onFromDateChange={(value) =>
          updateFilter("fromDate", value)
        }
        onToDateChange={(value) =>
          updateFilter("toDate", value)
        }
        onEmployeeIdChange={(value) =>
          updateFilter("employeeId", value)
        }
        onEmployeeNameChange={(value) =>
          updateFilter("employeeName", value)
        }
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {error && (
        <div className="mb-3 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Employee TA Details Table */}
      <TimeOfficeTable
        columns={COLUMNS}
        rows={rows}
        loading={loading}
        emptyMessage="No employee TA details found."
      />

      {/* Pagination */}
      <TimeOfficePagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import TimeOfficeReportHeader from "../components/TimeOfficeReportHeader";
import TimeOfficeFilters from "../components/TimeOfficeFilters";
import TimeOfficeTable from "../components/TimeOfficeTable";
import TimeOfficePagination from "../components/TimeOfficePagination";

import { useTimeOfficeFilters } from "../hooks/useTimeOfficeFilters";
import { validateDateRange } from "../validations/timeOffice.validation";

const getTodayDate = (): string => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const COLUMNS = ["Shift Name"];

const SHIFT_DETAILS: Record<string, unknown>[] = [];

export default function DayWiseEmployeeShiftPage() {
  const navigate = useNavigate();

  const today = getTodayDate();

  const { filters, updateFilter, resetFilters } =
    useTimeOfficeFilters();

  const [rows] = useState<Record<string, unknown>[]>([]);

  const [loading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [showDetails, setShowDetails] = useState(false);

  const handleSearch = () => {
    const validation = validateDateRange(
      filters.fromDate || today,
      filters.toDate || today
    );

    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    setCurrentPage(1);
    setShowDetails(false);
  };

  const handleReset = () => {
    resetFilters();
    setCurrentPage(1);
    setShowDetails(false);
  };

  const handleView = () => {
    setShowDetails((previous) => !previous);
  };

  return (
    <div className="relative z-0 min-h-screen bg-[#f3f6fa] p-2">
      {/* Report Header */}
      <TimeOfficeReportHeader
        title="Day-Wise Employee Shift"
        fromDate={filters.fromDate || today}
        toDate={filters.toDate || today}
        onFromDateChange={(value) =>
          updateFilter("fromDate", value)
        }
        onToDateChange={(value) =>
          updateFilter("toDate", value)
        }
        onBack={() => navigate(-1)}
        showTimeOfficeBanner
        showBannerHistory
      />

      {/* Search / Filter toolbar */}
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
        showDayWiseDropdownOptions
      />

      {/* Main Shift Table */}
      <TimeOfficeTable
        columns={COLUMNS}
        rows={rows}
        loading={loading}
        emptyMessage="No employee shift records found."
        onView={handleView}
      />

      {/* Expanded Details */}
      {showDetails && (
        <div className="mt-3 overflow-hidden rounded-md border border-[#e1e5ea] bg-white">
          <div className="w-full overflow-hidden">
            <table className="w-full table-fixed border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#d5eaf5]">
                  <th className="px-5 py-3 text-center text-[14px] font-semibold text-[#7f4b3d]">
                    Shift Date
                  </th>

                  <th className="px-5 py-3 text-center text-[14px] font-semibold text-[#7f4b3d]">
                    Assigned Employees
                  </th>

                  <th className="px-5 py-3 text-center text-[14px] font-semibold text-[#7f4b3d]">
                    Temp. Shift In
                  </th>

                  <th className="px-5 py-3 text-center text-[14px] font-semibold text-[#7f4b3d]">
                    Temp. Shift Out
                  </th>

                  <th className="px-5 py-3 text-center text-[14px] font-semibold text-[#7f4b3d]">
                    Reported Employees
                  </th>

                  <th className="px-5 py-3 text-center text-[14px] font-semibold text-[#7f4b3d]">
                    Not Reported Employees
                  </th>

                  <th className="px-5 py-3 text-center text-[14px] font-semibold text-[#7f4b3d]">
                    Total Assigned Shift Count
                  </th>
                </tr>
              </thead>

              <tbody>
                {SHIFT_DETAILS.map((detail, index) => (
                  <tr key={index}>
                    <td className="bg-white px-5 py-4 text-center text-[14px] text-[#17283a]">
                      {detail["Shift Date"]}
                    </td>

                    <td className="bg-white px-5 py-4 text-center">
                      <span className="inline-flex h-10 min-w-14 items-center justify-center rounded-full border border-[#c9ced4] px-4 text-[14px] font-medium text-[#17283a]">
                        {detail["Assigned Employees"]}
                      </span>
                    </td>

                    <td className="bg-white px-5 py-4 text-center">
                      <span className="inline-flex h-10 min-w-14 items-center justify-center rounded-full border border-[#c9ced4] px-4 text-[14px] font-medium text-[#17283a]">
                        {detail["Temp. Shift In"]}
                      </span>
                    </td>

                    <td className="bg-white px-5 py-4 text-center">
                      <span className="inline-flex h-10 min-w-14 items-center justify-center rounded-full border border-[#c9ced4] px-4 text-[14px] font-medium text-[#17283a]">
                        {detail["Temp. Shift Out"]}
                      </span>
                    </td>

                    <td className="bg-white px-5 py-4 text-center">
                      <span className="inline-flex h-10 min-w-14 items-center justify-center rounded-full border border-[#c9ced4] px-4 text-[14px] font-medium text-[#17283a]">
                        {detail["Reported Employees"]}
                      </span>
                    </td>

                    <td className="bg-white px-5 py-4 text-center">
                      <span className="inline-flex h-10 min-w-14 items-center justify-center rounded-full border border-[#c9ced4] px-4 text-[14px] font-medium text-[#17283a]">
                        {detail["Not Reported Employees"]}
                      </span>
                    </td>

                    <td className="bg-white px-5 py-4 text-center text-[14px] font-medium text-[#17283a]">
                      {detail["Total Assigned Shift Count"]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <TimeOfficePagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

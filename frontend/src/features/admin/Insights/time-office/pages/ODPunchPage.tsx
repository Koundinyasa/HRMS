import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, X } from "lucide-react";

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

export default function ODPunchPage() {
  const navigate = useNavigate();
  const today = getTodayDate();

  const { filters, updateFilter, resetFilters } =
    useTimeOfficeFilters();

  const [rows] = useState<Record<string, unknown>[]>([]);
  const [loading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [showAdvanceFilter, setShowAdvanceFilter] =
    useState(false);

  const [reportType, setReportType] = useState("");
  const [group, setGroup] = useState("");
  const [orderBy, setOrderBy] = useState("");

  const handleSearch = () => {
    const validation = validateDateRange(
      filters.fromDate || today,
      filters.toDate || today
    );

    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    // Connect the OD Punch API here:
    // TIME_OFFICE_ENDPOINTS.punch.odPunch
    //
    // Keep the request/response mapping aligned with the
    // confirmed backend response structure.
  };

  const handleReset = () => {
    resetFilters();
    setCurrentPage(1);

    setReportType("");
    setGroup("");
    setOrderBy("");
  };

  const handleAdvanceClear = () => {
    setReportType("");
    setGroup("");
    setOrderBy("");
  };

  const handleAdvanceApply = () => {
    setShowAdvanceFilter(false);

    // Apply reportType, group and orderBy to the OD Punch
    // API request when the backend request structure is confirmed.
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowAdvanceFilter(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative z-0 min-h-screen bg-[#f5f6fa] p-4">
      {/* =====================================================
          TIME OFFICE / OD PUNCH HEADER
          ===================================================== */}

      <TimeOfficeReportHeader
        title="OD Punch"
        fromDate={filters.fromDate || today}
        toDate={filters.toDate || today}
        onFromDateChange={(value) =>
          updateFilter("fromDate", value)
        }
        onToDateChange={(value) =>
          updateFilter("toDate", value)
        }
        onBack={() => navigate(-1)}
        showTimeOfficeBanner={true}
        showBannerHistory={true}
        showDateRange={true}
        showAdvanceFilter={true}
        onAdvanceFilter={() =>
          setShowAdvanceFilter(true)
        }
        showPdfExport={true}
        showExcelExport={true}
        showRefresh={false}
      />

      {/* =====================================================
          NORMAL FILTER BAR
          ===================================================== */}

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

      {/* =====================================================
          TABLE
          ===================================================== */}

      <TimeOfficeTable
        columns={[]}
        rows={rows}
        loading={loading}
        emptyMessage="No OD punch records found."
      />

      {/* =====================================================
          PAGINATION
          ===================================================== */}

      <TimeOfficePagination
        currentPage={currentPage}
        totalPages={1}
        onPageChange={setCurrentPage}
      />

      {/* =====================================================
          ADVANCE FILTER PANEL
          ===================================================== */}

      {showAdvanceFilter && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close advance filter"
            onClick={() =>
              setShowAdvanceFilter(false)
            }
            className="
              absolute
              inset-0
              h-full
              w-full
              cursor-default
              bg-black/30
            "
          />

          {/* Right panel */}
          <aside
            className="
              absolute
              right-0
              top-0
              flex
              h-full
              w-[375px]
              flex-col
              bg-white
              shadow-[-6px_0_20px_rgba(15,23,42,0.18)]
            "
          >
            {/* Panel header */}
            <div
              className="
                flex
                h-[58px]
                shrink-0
                items-center
                justify-between
                border-b
                border-[#dfe3e8]
                bg-[#f3f5f7]
                px-5
              "
            >
              <h2
                className="
                  font-[Urbanist]
                  text-[20px]
                  font-bold
                  leading-6
                  text-[#202124]
                "
              >
                Advance Filter
              </h2>

              <button
                type="button"
                title="Close"
                onClick={() =>
                  setShowAdvanceFilter(false)
                }
                className="
                  flex
                  h-[32px]
                  w-[32px]
                  items-center
                  justify-center
                  rounded-md
                  text-[#5f6673]
                  transition-colors
                  hover:bg-[#e8ebef]
                "
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            {/* Panel content */}
            <div className="flex-1 overflow-y-auto">
              {/* Report type */}
              <div className="border-b border-[#e1e5ea]">
                <div
                  className="
                    flex
                    h-[48px]
                    items-center
                    px-5
                    font-[Urbanist]
                    text-[16px]
                    font-semibold
                    text-[#202124]
                  "
                >
                  Report type
                </div>

                <div
                  className="
                    flex
                    min-h-[58px]
                    items-center
                    px-5
                    font-[Urbanist]
                    text-[14px]
                    text-[#333843]
                  "
                >
                  No report type available
                </div>
              </div>

              {/* Group */}
              <div className="border-b border-[#e1e5ea]">
                <div
                  className="
                    flex
                    h-[48px]
                    items-center
                    px-5
                    font-[Urbanist]
                    text-[16px]
                    font-semibold
                    text-[#202124]
                  "
                >
                  Group
                </div>

                <div
                  className="
                    flex
                    min-h-[58px]
                    items-center
                    px-5
                    font-[Urbanist]
                    text-[14px]
                    text-[#333843]
                  "
                >
                  No Specific groups
                </div>
              </div>

              {/* Order By */}
              <div className="border-b border-[#e1e5ea]">
                <div
                  className="
                    flex
                    h-[48px]
                    items-center
                    px-5
                    font-[Urbanist]
                    text-[16px]
                    font-semibold
                    text-[#202124]
                  "
                >
                  Order By
                </div>

                <div
                  className="
                    flex
                    min-h-[58px]
                    items-center
                    px-5
                    font-[Urbanist]
                    text-[14px]
                    text-[#333843]
                  "
                >
                  No order by available
                </div>
              </div>
            </div>

            {/* Panel footer */}
            <div
              className="
                flex
                shrink-0
                items-center
                justify-end
                gap-4
                border-t
                border-[#e1e5ea]
                bg-white
                px-5
                py-4
              "
            >
              <button
                type="button"
                onClick={handleAdvanceClear}
                className="
                  flex
                  h-[44px]
                  items-center
                  gap-2
                  rounded-[8px]
                  border
                  border-[#c9ced6]
                  bg-white
                  px-5
                  font-[Urbanist]
                  text-[14px]
                  font-semibold
                  text-[#626b78]
                  transition-colors
                  hover:bg-[#f5f6f8]
                "
              >
                <Filter size={16} strokeWidth={1.8} />
                <span>Clear</span>
              </button>

              <button
                type="button"
                onClick={handleAdvanceApply}
                className="
                  flex
                  h-[44px]
                  items-center
                  rounded-[8px]
                  bg-[#2299e8]
                  px-6
                  font-[Urbanist]
                  text-[14px]
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-[#1687d4]
                "
              >
                Apply
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

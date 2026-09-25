import { useMemo, useState } from "react";

import LeaveCalendarHeader from "../components/LeaveCalendarHeader";
import LeaveCalendarSearch from "../components/LeaveCalendarSearch";
import LeaveCalendarTable from "../components/LeaveCalendarTable";
import LeaveCalendarFooter from "../components/LeaveCalendarFooter";
import { useMonthlyLeaveCalendar } from "../hooks/useMonthlyLeaveCalendar";

import {
  buildLeaveCalendarDays,
  getCalendarDayKeys,
  LEAVE_CALENDAR_CONSTANTS,
} from "../constants/leaveCalendar.constants";
const LeaveCalendar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    LEAVE_CALENDAR_CONSTANTS.DEFAULT_ROWS_PER_PAGE,
  );

  const companyId = 1; 
  const selectedYear = new Date().getFullYear();

  // API expects month from 1 to 12
  const apiMonth = selectedMonth + 1;

  const {
    data: monthlyLeaveCalendar = [],
    isLoading,
    isError,
    error,
  } = useMonthlyLeaveCalendar({
    companyId,
    year: selectedYear,
    month: apiMonth,
  });

  const days = useMemo(
    () => buildLeaveCalendarDays(selectedYear, selectedMonth),
    [selectedYear, selectedMonth],
  );

  const searchValue = searchTerm.toLowerCase().trim();

  const filteredEmployees = useMemo(
    () =>
      monthlyLeaveCalendar.filter((employee) => {
        const name = String(employee.FullName ?? "").toLowerCase();
        const id = String(employee.EmployeeID ?? "").toLowerCase();

        return name.includes(searchValue) || id.includes(searchValue);
      }),
    [monthlyLeaveCalendar, searchValue],
  );

  const totalItems = filteredEmployees.length;
  const pageCount = Math.max(1, Math.ceil(totalItems / rowsPerPage));
  const safePage = Math.min(currentPage, pageCount);

  const paginatedEmployees = filteredEmployees.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage,
  );
  const legendCodes = useMemo(() => {
    const codes = new Set<string>();

    filteredEmployees.forEach((employee) => {
      getCalendarDayKeys(employee).forEach((key) => {
        const value = String(employee[key] ?? "").trim().toUpperCase();
        if (value) codes.add(value);
      });
    });
    return Array.from(codes).sort();
  }, [filteredEmployees]);

  const handleRowsPerPageChange = (value: number) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };
  return (
    <div className="h-full min-h-0 w-full overflow-hidden bg-gray-50 p-2 sm:p-3 md:p-4 font-[Urbanist]">
      <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-lg bg-white p-3 shadow-sm sm:p-4 font-[Urbanist]">
        {/* Header */}
        <div className="shrink-0 font-[Urbanist]">
          <LeaveCalendarHeader
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
          />
        </div>
        {/* Search */}
        <div className="shrink-0 font-[Urbanist]">
          <LeaveCalendarSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        {/* Loading */}
        {isLoading && (
          <div className="shrink-0 py-6 text-center text-gray-500 font-[Urbanist]">
            Loading monthly leave calendar...
          </div>
        )}
        {/* Error */}
        {isError && (
          <div className="shrink-0 py-6 text-center text-red-500 font-[Urbanist]">
            <p>Failed to load monthly leave calendar.</p>
            <pre className="mt-2 max-h-40 overflow-auto text-left text-xs font-[Urbanist]">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}
        {/* Calendar table area */}
        {!isLoading && !isError && (
          <div className="min-h-0 flex-1 overflow-hidden font-[Urbanist]">
            <LeaveCalendarTable employees={paginatedEmployees} days={days} />
          </div>
        )}
        {/* Footer */}
        <div className="shrink-0 font-[Urbanist]">
          <LeaveCalendarFooter
            totalItems={totalItems}
            currentPage={safePage}
            rowsPerPage={rowsPerPage}
            legendCodes={legendCodes}
            onRowsPerPageChange={handleRowsPerPageChange}
            onPrevPage={() => setCurrentPage((page) => Math.max(1, page - 1))}
            onNextPage={() =>
              setCurrentPage((page) => Math.min(pageCount, page + 1))
            }
          />
        </div>
      </div>
    </div>
  );
};
export default LeaveCalendar;

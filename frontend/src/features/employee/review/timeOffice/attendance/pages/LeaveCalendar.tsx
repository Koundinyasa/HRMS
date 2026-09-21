// import { useMemo, useState } from "react";

// import LeaveCalendarHeader from "../components/LeaveCalendarHeader";
// import LeaveCalendarSearch from "../components/LeaveCalendarSearch";
// import LeaveCalendarTable from "../components/LeaveCalendarTable";
// import LeaveCalendarFooter from "../components/LeaveCalendarFooter";
// import { useMonthlyLeaveCalendar } from "../hooks/useMonthlyLeaveCalendar";

// import {
//   buildLeaveCalendarDays,
//   getCalendarDayKeys,
//   LEAVE_CALENDAR_CONSTANTS,
// } from "../constants/leaveCalendar.constants";
// const LeaveCalendar = () => {
//   const [searchTerm, setSearchTerm] = useState("");

//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState<number>(
//     LEAVE_CALENDAR_CONSTANTS.DEFAULT_ROWS_PER_PAGE,
//   );

//   const companyId = 1; 
//   const selectedYear = new Date().getFullYear();

//   // API expects month from 1 to 12
//   const apiMonth = selectedMonth + 1;

//   const {
//     data: monthlyLeaveCalendar = [],
//     isLoading,
//     isError,
//     error,
//   } = useMonthlyLeaveCalendar({
//     companyId,
//     year: selectedYear,
//     month: apiMonth,
//   });

//   const days = useMemo(
//     () => buildLeaveCalendarDays(selectedYear, selectedMonth),
//     [selectedYear, selectedMonth],
//   );

//   const searchValue = searchTerm.toLowerCase().trim();

//   const filteredEmployees = useMemo(
//     () =>
//       monthlyLeaveCalendar.filter((employee) => {
//         const name = String(employee.FullName ?? "").toLowerCase();
//         const id = String(employee.EmployeeID ?? "").toLowerCase();

//         return name.includes(searchValue) || id.includes(searchValue);
//       }),
//     [monthlyLeaveCalendar, searchValue],
//   );

//   const totalItems = filteredEmployees.length;
//   const pageCount = Math.max(1, Math.ceil(totalItems / rowsPerPage));
//   const safePage = Math.min(currentPage, pageCount);

//   const paginatedEmployees = filteredEmployees.slice(
//     (safePage - 1) * rowsPerPage,
//     safePage * rowsPerPage,
//   );
//   const legendCodes = useMemo(() => {
//     const codes = new Set<string>();

//     filteredEmployees.forEach((employee) => {
//       getCalendarDayKeys(employee).forEach((key) => {
//         const value = String(employee[key] ?? "").trim().toUpperCase();
//         if (value) codes.add(value);
//       });
//     });
//     return Array.from(codes).sort();
//   }, [filteredEmployees]);

//   const handleRowsPerPageChange = (value: number) => {
//     setRowsPerPage(value);
//     setCurrentPage(1);
//   };
//   return (
//     <div className="h-full min-h-0 w-full overflow-hidden bg-gray-50 p-2 sm:p-3 md:p-4">
//       <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-lg bg-white p-3 shadow-sm sm:p-4">
//         {/* Header */}
//         <div className="shrink-0">
//           <LeaveCalendarHeader
//             selectedMonth={selectedMonth}
//             setSelectedMonth={setSelectedMonth}
//           />
//         </div>
//         {/* Search */}
//         <div className="shrink-0">
//           <LeaveCalendarSearch
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//           />
//         </div>
//         {/* Loading */}
//         {isLoading && (
//           <div className="shrink-0 py-6 text-center text-gray-500">
//             Loading monthly leave calendar...
//           </div>
//         )}
//         {/* Error */}
//         {isError && (
//           <div className="shrink-0 py-6 text-center text-red-500">
//             <p>Failed to load monthly leave calendar.</p>
//             <pre className="mt-2 max-h-40 overflow-auto text-left text-xs">
//               {JSON.stringify(error, null, 2)}
//             </pre>
//           </div>
//         )}
//         {/* Calendar table area */}
//         {!isLoading && !isError && (
//           <div className="min-h-0 flex-1 overflow-hidden">
//             <LeaveCalendarTable employees={paginatedEmployees} days={days} />
//           </div>
//         )}
//         {/* Footer */}
//         <div className="shrink-0">
//           <LeaveCalendarFooter
//             totalItems={totalItems}
//             currentPage={safePage}
//             rowsPerPage={rowsPerPage}
//             legendCodes={legendCodes}
//             onRowsPerPageChange={handleRowsPerPageChange}
//             onPrevPage={() => setCurrentPage((page) => Math.max(1, page - 1))}
//             onNextPage={() =>
//               setCurrentPage((page) => Math.min(pageCount, page + 1))
//             }
//           />
//         </div>
//       </div>
//     </div>
//   );
// };
// export default LeaveCalendar;


import { useEffect, useMemo, useState } from "react";
import { NavLink, useParams } from "react-router-dom";

import LeaveCalendarHeader from "../components/LeaveCalendarHeader";
import LeaveCalendarSearch from "../components/LeaveCalendarSearch";
import LeaveCalendarTable from "../components/LeaveCalendarTable";
import LeaveCalendarFooter from "../components/LeaveCalendarFooter";

import DailyLogModal, {
  type PunchLogEntry,
} from "../components/DailyLogModal";

import type {
  LeaveCalendarEmployee,
  LeaveCalendarDay,
} from "../types/leavecalendar.types";

import { useMonthlyLeaveCalendar } from "../hooks/useMonthlyLeaveCalendar";

import {
  buildLeaveCalendarDays,
  getCalendarDayKeys,
  LEAVE_CALENDAR_CONSTANTS,
} from "../constants/leaveCalendar.constants";
import { useLazyGetEmployeeDailyRawPunchesQuery } from "../../../Attandance overview/timeOffice/api/regularizationApi";

// =========================================================
// RAW PUNCH API
// =========================================================

const LeaveCalendar = () => {
  const { domain } = useParams();

  // =========================================================
  // BASIC STATE
  // =========================================================

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth(),
  );

  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] =
    useState<number>(
      LEAVE_CALENDAR_CONSTANTS.DEFAULT_ROWS_PER_PAGE,
    );

  // =========================================================
  // DAILY LOG MODAL STATE
  // =========================================================

  const [dailyLogOpen, setDailyLogOpen] =
    useState(false);

  const [selectedEmployee, setSelectedEmployee] =
    useState<{
      employeeName: string;
      employeeId: string;
      date: string;
      apiDate: string;
      status: string;
      punches: PunchLogEntry[];
    } | null>(null);

  const [punchesLoading, setPunchesLoading] =
    useState(false);

  // =========================================================
  // MONTHLY LEAVE CALENDAR API
  // =========================================================

  const companyId = 1;

  const selectedYear =
    new Date().getFullYear();

  // API expects month 1 - 12
  const apiMonth =
    selectedMonth + 1;

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

  // =========================================================
  // RAW PUNCH API
  // =========================================================

  const [
    getEmployeeRawPunches,
  ] =
    useLazyGetEmployeeDailyRawPunchesQuery();

  // =========================================================
  // DEBUG - PAGE LOAD
  // =========================================================

  useEffect(() => {
    console.log(
      "========================================",
    );

    console.log(
      "LEAVE CALENDAR PAGE LOADED",
    );

    console.log(
      "Year:",
      selectedYear,
    );

    console.log(
      "Month:",
      apiMonth,
    );

    console.log(
      "Employees received:",
      monthlyLeaveCalendar.length,
    );

    console.log(
      "========================================",
    );
  }, [
    selectedYear,
    apiMonth,
    monthlyLeaveCalendar.length,
  ]);

  // =========================================================
  // DEBUG - DAILY LOG
  // =========================================================

  useEffect(() => {
    console.log(
      "DAILY LOG OPEN:",
      dailyLogOpen,
    );

    console.log(
      "SELECTED EMPLOYEE:",
      selectedEmployee,
    );
  }, [
    dailyLogOpen,
    selectedEmployee,
  ]);

  // =========================================================
  // CALENDAR DAYS
  // =========================================================

  const days = useMemo(
    () =>
      buildLeaveCalendarDays(
        selectedYear,
        selectedMonth,
      ),
    [
      selectedYear,
      selectedMonth,
    ],
  );

  // =========================================================
  // SEARCH
  // =========================================================

  const searchValue =
    searchTerm
      .toLowerCase()
      .trim();

  const filteredEmployees =
    useMemo(
      () =>
        monthlyLeaveCalendar.filter(
          (employee) => {
            const name =
              String(
                employee.FullName ??
                  "",
              ).toLowerCase();

            const id =
              String(
                employee.EmployeeID ??
                  "",
              ).toLowerCase();

            return (
              name.includes(
                searchValue,
              ) ||
              id.includes(
                searchValue,
              )
            );
          },
        ),
      [
        monthlyLeaveCalendar,
        searchValue,
      ],
    );

  // =========================================================
  // RESET PAGE WHEN SEARCH CHANGES
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalItems =
    filteredEmployees.length;

  const pageCount =
    Math.max(
      1,
      Math.ceil(
        totalItems /
          rowsPerPage,
      ),
    );

  const safePage =
    Math.min(
      currentPage,
      pageCount,
    );

  const paginatedEmployees =
    filteredEmployees.slice(
      (safePage - 1) *
        rowsPerPage,
      safePage *
        rowsPerPage,
    );

  // =========================================================
  // LEGEND
  // =========================================================

  const legendCodes =
    useMemo(() => {
      const codes =
        new Set<string>();

      filteredEmployees.forEach(
        (employee) => {
          getCalendarDayKeys(
            employee,
          ).forEach((key) => {
            const value =
              String(
                employee[key] ??
                  "",
              )
                .trim()
                .toUpperCase();

            if (value) {
              codes.add(value);
            }
          });
        },
      );

      return Array.from(
        codes,
      ).sort();
    }, [filteredEmployees]);

  // =========================================================
  // ROWS PER PAGE
  // =========================================================

  const handleRowsPerPageChange =
    (value: number) => {
      console.log(
        "ROWS PER PAGE:",
        value,
      );

      setRowsPerPage(value);
      setCurrentPage(1);
    };

  // =========================================================
  // ATTENDANCE BADGE CLICK
  // =========================================================

  const handleAttendanceClick =
    async (
      employee: LeaveCalendarEmployee,
      day: LeaveCalendarDay,
      status: string,
    ) => {
      console.log("");
      console.log(
        "==========================================",
      );

      console.log(
        "ATTENDANCE BADGE CLICKED",
      );

      console.log(
        "Employee:",
        employee.FullName,
      );

      console.log(
        "Employee ID:",
        employee.EmployeeID,
      );

      console.log(
        "Day:",
        day,
      );

      console.log(
        "Status:",
        status,
      );

      const employeeName =
        String(
          employee.FullName ??
            "",
        ).trim() || "-";

      const employeeId =
        String(
          employee.EmployeeID ??
            "",
        ).trim() || "-";

      // Display date
      const selectedDate =
        `${day.date} ${day.weekday}`;

      // =====================================================
      // API DATE
      // Example:
      // 2026-09-10
      // =====================================================

      const apiDate =
        `${selectedYear}-${String(
          apiMonth,
        ).padStart(
          2,
          "0",
        )}-${String(
          day.date,
        ).padStart(
          2,
          "0",
        )}`;

      const selectedStatus =
        String(
          status ?? "",
        ).trim() ||
        "No Record";

      console.log(
        "Employee ID for API:",
        employeeId,
      );

      console.log(
        "Date for API:",
        apiDate,
      );

      console.log(
        "==========================================",
      );

      // =====================================================
      // OPEN MODAL
      // =====================================================

      setSelectedEmployee({
        employeeName,
        employeeId,
        date: selectedDate,
        apiDate,
        status: selectedStatus,
        punches: [],
      });

      setDailyLogOpen(true);

      // =====================================================
      // LOADING
      // =====================================================

      setPunchesLoading(true);

      try {
        console.log(
          "CALLING RAW PUNCH API",
        );

        console.log(
          "REQUEST BODY:",
          {
            employeeId,
            date: apiDate,
          },
        );

        // ===================================================
        // API CALL
        // ===================================================

        const response =
          await getEmployeeRawPunches(
            {
              employeeId,
              date: apiDate,
            },
          ).unwrap();

        console.log(
          "==========================================",
        );

        console.log(
          "RAW PUNCH API RESPONSE:",
        );

        console.log(
          response,
        );

        console.log(
          "==========================================",
        );

        // ===================================================
        // MAP API RESPONSE
        //
        // Backend:
        //
        // PunchType     -> type
        // OriginalTime  -> time
        // EntryType     -> source
        //
        // ===================================================

        const punches: PunchLogEntry[] =
          response.map(
            (punch) => ({
              type:
                String(
                  punch.type ??
                    "",
                ).toUpperCase() ===
                "OUT"
                  ? "Out"
                  : "In",

              time:
                punch.time ||
                "-",

              entryType:
                punch.source ||
                "-",

              location:
                undefined,

              hasSelfie:
                false,
            }),
          );

        console.log(
          "MAPPED PUNCH DATA:",
        );

        console.log(
          punches,
        );

        // ===================================================
        // UPDATE MODAL
        // ===================================================

        setSelectedEmployee(
          (current) => {
            if (
              !current ||
              current.employeeId !==
                employeeId ||
              current.apiDate !==
                apiDate
            ) {
              return current;
            }

            return {
              ...current,
              punches,
            };
          },
        );
      } catch (apiError) {
        console.error(
          "==========================================",
        );

        console.error(
          "RAW PUNCH API ERROR:",
        );

        console.error(
          apiError,
        );

        console.error(
          "==========================================",
        );

        setSelectedEmployee(
          (current) => {
            if (!current) {
              return current;
            }

            return {
              ...current,
              punches: [],
            };
          },
        );
      } finally {
        setPunchesLoading(
          false,
        );
      }
    };

  // =========================================================
  // CLOSE DAILY LOG
  // =========================================================

  const handleCloseDailyLog =
    () => {
      console.log(
        "CLOSING DAILY LOG",
      );

      setDailyLogOpen(false);

      setSelectedEmployee(
        null,
      );

      setPunchesLoading(
        false,
      );
    };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="h-full min-h-0 w-full overflow-hidden bg-gray-50 p-2 sm:p-3 md:p-4">
      <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-lg bg-white p-3 shadow-sm sm:p-4">
        <nav
          aria-label="Time office navigation"
          className="mb-3 flex min-w-0 shrink-0 items-center gap-8 overflow-x-auto rounded-xl border border-[#e0e5ec] bg-white px-4"
        >
          <NavLink
            to={`/${domain}/employee/Regularization/Punch`}
            className={({ isActive }) =>
              `whitespace-nowrap border-b-2 px-1 py-4 text-[15px] font-semibold ${
                isActive
                  ? "border-[#1997e8] text-[#1997e8]"
                  : "border-transparent text-[#68758a]"
              }`
            }
          >
            Punch
          </NavLink>
          <NavLink
            to={`/${domain}/employee/Regularization/MissedPunch`}
            className={({ isActive }) =>
              `whitespace-nowrap border-b-2 px-1 py-4 text-[15px] font-semibold ${
                isActive
                  ? "border-[#1997e8] text-[#1997e8]"
                  : "border-transparent text-[#68758a]"
              }`
            }
          >
            Missed Punch
          </NavLink>
          <NavLink
            to={`/${domain}/employee/time-office/regularization/attendance`}
            className={({ isActive }) =>
              `whitespace-nowrap border-b-2 px-1 py-4 text-[15px] font-semibold ${
                isActive
                  ? "border-[#1997e8] text-[#1997e8]"
                  : "border-transparent text-[#68758a]"
              }`
            }
          >
            Attendance
          </NavLink>
          <NavLink
            to={`/${domain}/employee/Regularization/TAInsights`}
            className={({ isActive }) =>
              `whitespace-nowrap border-b-2 px-1 py-4 text-[15px] font-semibold ${
                isActive
                  ? "border-[#1997e8] text-[#1997e8]"
                  : "border-transparent text-[#68758a]"
              }`
            }
          >
            TA Insights
          </NavLink>
        </nav>

        {/* HEADER */}

        <div className="shrink-0">
          <LeaveCalendarHeader
            selectedMonth={
              selectedMonth
            }
            setSelectedMonth={
              setSelectedMonth
            }
          />
        </div>

        {/* SEARCH */}

        <div className="shrink-0">
          <LeaveCalendarSearch
            searchTerm={
              searchTerm
            }
            setSearchTerm={
              setSearchTerm
            }
          />
        </div>

        {/* LOADING */}

        {isLoading && (
          <div className="shrink-0 py-6 text-center text-gray-500">
            Loading monthly leave calendar...
          </div>
        )}

        {/* ERROR */}

        {isError && (
          <div className="shrink-0 py-6 text-center text-red-500">
            <p>
              Failed to load monthly leave calendar.
            </p>

            <pre className="mt-2 max-h-40 overflow-auto text-left text-xs">
              {JSON.stringify(
                error,
                null,
                2,
              )}
            </pre>
          </div>
        )}

        {/* TABLE */}

        {!isLoading &&
          !isError && (
            <div className="min-h-0 flex-1 overflow-hidden">
              <LeaveCalendarTable
                employees={
                  paginatedEmployees
                }
                days={days}
                onAttendanceClick={
                  handleAttendanceClick
                }
              />
            </div>
          )}

        {/* FOOTER */}

        <div className="shrink-0">
          <LeaveCalendarFooter
            totalItems={
              totalItems
            }
            currentPage={
              safePage
            }
            rowsPerPage={
              rowsPerPage
            }
            legendCodes={
              legendCodes
            }
            onRowsPerPageChange={
              handleRowsPerPageChange
            }
            onPrevPage={() =>
              setCurrentPage(
                (page) =>
                  Math.max(
                    1,
                    page - 1,
                  ),
              )
            }
            onNextPage={() =>
              setCurrentPage(
                (page) =>
                  Math.min(
                    pageCount,
                    page + 1,
                  ),
              )
            }
          />
        </div>
      </div>

      {/* =====================================================
          DAILY LOG MODAL
      ===================================================== */}

      <DailyLogModal
        open={
          dailyLogOpen
        }
        onClose={
          handleCloseDailyLog
        }
        employeeName={
          selectedEmployee?.employeeName ??
          "-"
        }
        employeeId={
          selectedEmployee?.employeeId ??
          "-"
        }
        date={
          selectedEmployee?.date ??
          "-"
        }
        status={
          selectedEmployee?.status ??
          "-"
        }
        punches={
          selectedEmployee?.punches ??
          []
        }
        punchesLoading={
          punchesLoading
        }
      />
    </div>
  );
};

export default LeaveCalendar;
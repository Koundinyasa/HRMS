// // // // // // import {
// // // // // //   useEffect,
// // // // // //   useState,
// // // // // // } from "react";

// // // // // // import {
// // // // // //   NavLink,
// // // // // //   useLocation,
// // // // // //   useNavigate,
// // // // // // } from "react-router-dom";

// // // // // // import {
// // // // // //   CalendarDays,
// // // // // //   RefreshCw,
// // // // // //   ChevronDown,
// // // // // // } from "lucide-react";

// // // // // // import EmployeeProfileCard from "../components/EmployeeProfileCard";
// // // // // // import AttendanceSummaryTable from "../components/AttendanceSummaryTable";
// // // // // // import PunchRecordCard from "../components/PunchRecordCard";

// // // // // // import {
// // // // // //   useReportingEmployees,
// // // // // // } from "../hooks/useReportingEmployees";

// // // // // // import {
// // // // // //   usePunchDashboard,
// // // // // // } from "../hooks/usePunchDashboard";

// // // // // // import {
// // // // // //   usePunchEditor,
// // // // // // } from "../hooks/usePunchEditor";

// // // // // // import type {
// // // // // //   PunchPageProps,
// // // // // //   PunchNavigationState,
// // // // // //   ViewType,
// // // // // // } from "../types/punch.types";


// // // // // // /* =========================================================
// // // // // //    TODAY
// // // // // // ========================================================= */

// // // // // // function getToday(): string {
// // // // // //   return new Date()
// // // // // //     .toISOString()
// // // // // //     .slice(0, 10);
// // // // // // }


// // // // // // /* =========================================================
// // // // // //    PUNCH PAGE
// // // // // // ========================================================= */

// // // // // // export default function PunchPage({
// // // // // //   employeeId: propEmployeeId,
// // // // // // }: PunchPageProps) {

// // // // // //   const navigate = useNavigate();

// // // // // //   const location = useLocation();


// // // // // //   /* =======================================================
// // // // // //      NAVIGATION STATE
// // // // // //   ======================================================= */

// // // // // //   const navigationState =
// // // // // //     location.state as
// // // // // //       | PunchNavigationState
// // // // // //       | null;


// // // // // //   /* =======================================================
// // // // // //      DATE
// // // // // //   ======================================================= */

// // // // // //   const today = getToday();

// // // // // //   const [selectedDate, setSelectedDate] =
// // // // // //     useState<string>(
// // // // // //       navigationState?.selectedDate ||
// // // // // //         today,
// // // // // //     );


// // // // // //   /* =======================================================
// // // // // //      EMPLOYEE
// // // // // //   ======================================================= */

// // // // // //   const [selectedEmployeeId, setSelectedEmployeeId] =
// // // // // //     useState<string>(
// // // // // //       navigationState?.employeeId ||
// // // // // //         propEmployeeId ||
// // // // // //         localStorage.getItem(
// // // // // //           "employeeId",
// // // // // //         ) ||
// // // // // //         localStorage.getItem(
// // // // // //           "EmployeeID",
// // // // // //         ) ||
// // // // // //         "",
// // // // // //     );


// // // // // //   /* =======================================================
// // // // // //      VIEW TYPE
// // // // // //   ======================================================= */

// // // // // //   const viewType: ViewType =
// // // // // //     "SingleDate";


// // // // // //   /* =======================================================
// // // // // //      REPORTING EMPLOYEES
// // // // // //   ======================================================= */

// // // // // //   const {
// // // // // //     employees,
// // // // // //     isLoading: employeesLoading,
// // // // // //     error: employeesError,
// // // // // //     refetch: refetchEmployees,
// // // // // //   } = useReportingEmployees();


// // // // // //   /* =======================================================
// // // // // //      SELECT FIRST EMPLOYEE
// // // // // //   ======================================================= */

// // // // // //   useEffect(() => {

// // // // // //     if (
// // // // // //       !selectedEmployeeId &&
// // // // // //       employees.length > 0
// // // // // //     ) {
// // // // // //       setSelectedEmployeeId(
// // // // // //         employees[0].employeeId,
// // // // // //       );
// // // // // //     }

// // // // // //   }, [
// // // // // //     employees,
// // // // // //     selectedEmployeeId,
// // // // // //   ]);


// // // // // //   /* =======================================================
// // // // // //      SAVE EMPLOYEE TO LOCAL STORAGE
// // // // // //   ======================================================= */

// // // // // //   useEffect(() => {

// // // // // //     if (selectedEmployeeId) {

// // // // // //       localStorage.setItem(
// // // // // //         "employeeId",
// // // // // //         selectedEmployeeId,
// // // // // //       );

// // // // // //     }

// // // // // //   }, [
// // // // // //     selectedEmployeeId,
// // // // // //   ]);


// // // // // //   /* =======================================================
// // // // // //      PUNCH DASHBOARD
// // // // // //   ======================================================= */

// // // // // //   const {
// // // // // //     data,
// // // // // //     isLoading,
// // // // // //     error,
// // // // // //     refetch,
// // // // // //   } = usePunchDashboard({
// // // // // //     employeeId:
// // // // // //       selectedEmployeeId,

// // // // // //     selectedDate,

// // // // // //     viewType,
// // // // // //   });


// // // // // //   /* =======================================================
// // // // // //      PUNCH EDITOR
// // // // // //   ======================================================= */

// // // // // //   const {
// // // // // //     edits,
// // // // // //     savingId,
// // // // // //     saveError,
// // // // // //     updateField,
// // // // // //     saveRecord,
// // // // // //   } = usePunchEditor(
// // // // // //     data?.punchRecords ?? [],
// // // // // //   );


// // // // // //   /* =======================================================
// // // // // //      DATA
// // // // // //   ======================================================= */

// // // // // //   const profile =
// // // // // //     data?.employeeProfile?.[0] ??
// // // // // //     null;

// // // // // //   const attendanceSummary =
// // // // // //     data?.attendanceSummary ?? [];

// // // // // //   const punchRecords =
// // // // // //     data?.punchRecords ?? [];


// // // // // //   /* =======================================================
// // // // // //      EMPLOYEE CHANGE
// // // // // //   ======================================================= */

// // // // // //   const handleEmployeeChange = (
// // // // // //     value: string,
// // // // // //   ) => {

// // // // // //     setSelectedEmployeeId(value);

// // // // // //     navigate(
// // // // // //       {
// // // // // //         pathname:
// // // // // //           location.pathname,

// // // // // //         search:
// // // // // //           `?employeeId=${encodeURIComponent(
// // // // // //             value,
// // // // // //           )}&date=${encodeURIComponent(
// // // // // //             selectedDate,
// // // // // //           )}`,
// // // // // //       },
// // // // // //       {
// // // // // //         replace: true,
// // // // // //       },
// // // // // //     );
// // // // // //   };


// // // // // //   /* =======================================================
// // // // // //      DATE CHANGE
// // // // // //   ======================================================= */

// // // // // //   const handleDateChange = (
// // // // // //     value: string,
// // // // // //   ) => {

// // // // // //     setSelectedDate(value);

// // // // // //   };


// // // // // //   /* =======================================================
// // // // // //      SAVE PUNCH
// // // // // //   ======================================================= */

// // // // // //   const handleSave = async (
// // // // // //     punchId: string | number,
// // // // // //   ) => {

// // // // // //     await saveRecord(
// // // // // //       punchId,
// // // // // //     );

// // // // // //   };


// // // // // //   /* =======================================================
// // // // // //      RENDER
// // // // // //   ======================================================= */

// // // // // //   return (
// // // // // //     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 font-[Urbanist]">

// // // // // //       {/* ===================================================
// // // // // //           TIME OFFICE NAVIGATION
// // // // // //       =================================================== */}

// // // // // //       <div className="mb-4 overflow-x-auto rounded-xl border border-black bg-white font-[Urbanist]">

// // // // // //         <div className="flex min-w-max font-[Urbanist]">

// // // // // //           {/* PUNCH */}

// // // // // //           <NavLink
// // // // // //             to="../Punch"
// // // // // //             className={({ isActive }) =>
// // // // // //               `px-6 py-4 text-sm font-medium ${
// // // // // //                 isActive
// // // // // //                   ? "border-b-2 border-blue-600 text-blue-600"
// // // // // //                   : "text-gray-500"
// // // // // //               }`
// // // // // //             }
// // // // // //           >
// // // // // //             Punch
// // // // // //           </NavLink>


// // // // // //           {/* MISSED PUNCH */}

// // // // // //           <NavLink
// // // // // //             to="../MissedPunch"
// // // // // //             className={({ isActive }) =>
// // // // // //               `px-6 py-4 text-sm font-medium ${
// // // // // //                 isActive
// // // // // //                   ? "border-b-2 border-blue-600 text-blue-600"
// // // // // //                   : "text-gray-500"
// // // // // //               }`
// // // // // //             }
// // // // // //           >
// // // // // //             Missed Punch
// // // // // //           </NavLink>


// // // // // //           {/* ATTENDANCE */}

// // // // // //           <span className="px-6 py-4 text-sm font-medium text-gray-300 font-[Urbanist]">
// // // // // //             Attendance
// // // // // //           </span>


// // // // // //           {/* TA INSIGHTS */}

// // // // // //           <span className="px-6 py-4 text-sm font-medium text-gray-300 font-[Urbanist]">
// // // // // //             TA Insights
// // // // // //           </span>

// // // // // //         </div>

// // // // // //       </div>


// // // // // //       {/* ===================================================
// // // // // //           FILTERS
// // // // // //       =================================================== */}

// // // // // //       <div className="mb-4 rounded-xl border border-black bg-white p-4 font-[Urbanist]">

// // // // // //         <div className="grid grid-cols-1 gap-4 md:grid-cols-2 font-[Urbanist]">


// // // // // //           {/* =================================================
// // // // // //               DATE
// // // // // //           ================================================= */}

// // // // // //           <div>

// // // // // //             <label className="mb-1 block text-xs font-medium text-gray-500 font-[Urbanist]">
// // // // // //               Date
// // // // // //             </label>

// // // // // //             <div className="relative font-[Urbanist]">

// // // // // //               <CalendarDays
// // // // // //                 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 font-[Urbanist]"
// // // // // //               />

// // // // // //               <input
// // // // // //                 type="date"
// // // // // //                 value={selectedDate}
// // // // // //                 onChange={(event) =>
// // // // // //                   handleDateChange(
// // // // // //                     event.target.value,
// // // // // //                   )
// // // // // //                 }
// // // // // //                 className="w-full rounded-md border border-black py-2 pl-9 pr-3 text-sm outline-none focus:border-black font-[Urbanist]"
// // // // // //               />

// // // // // //             </div>

// // // // // //           </div>


// // // // // //           {/* =================================================
// // // // // //               EMPLOYEE
// // // // // //           ================================================= */}

// // // // // //           <div>

// // // // // //             <label className="mb-1 block text-xs font-medium text-gray-500 font-[Urbanist]">
// // // // // //               Employee
// // // // // //             </label>

// // // // // //             <div className="relative font-[Urbanist]">

// // // // // //               <select
// // // // // //                 value={
// // // // // //                   selectedEmployeeId
// // // // // //                 }
// // // // // //                 onChange={(event) =>
// // // // // //                   handleEmployeeChange(
// // // // // //                     event.target.value,
// // // // // //                   )
// // // // // //                 }
// // // // // //                 disabled={
// // // // // //                   employeesLoading
// // // // // //                 }
// // // // // //                 className="w-full appearance-none rounded-md border border-black bg-white px-3 py-2 pr-9 text-sm outline-none focus:border-black font-[Urbanist]"
// // // // // //               >

// // // // // //                 <option value="">
// // // // // //                   {employeesLoading
// // // // // //                     ? "Loading employees..."
// // // // // //                     : "Select Employee"}
// // // // // //                 </option>


// // // // // //                 {employees.map(
// // // // // //                   (employee) => (

// // // // // //                     <option
// // // // // //                       key={
// // // // // //                         employee.employeeId
// // // // // //                       }
// // // // // //                       value={
// // // // // //                         employee.employeeId
// // // // // //                       }
// // // // // //                     >
// // // // // //                       {
// // // // // //                         employee.employeeId
// // // // // //                       }{" "}
// // // // // //                       -{" "}
// // // // // //                       {
// // // // // //                         employee.employeeName
// // // // // //                       }
// // // // // //                     </option>

// // // // // //                   ),
// // // // // //                 )}

// // // // // //               </select>


// // // // // //               <ChevronDown
// // // // // //                 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 font-[Urbanist]"
// // // // // //               />

// // // // // //             </div>

// // // // // //           </div>

// // // // // //         </div>


// // // // // //         {/* =================================================
// // // // // //             BUTTONS
// // // // // //         ================================================= */}

// // // // // //         <div className="mt-4 flex justify-end gap-2 font-[Urbanist]">


// // // // // //           {/* REFRESH */}

// // // // // //           <button
// // // // // //             type="button"
// // // // // //             onClick={() => {

// // // // // //               void refetch();

// // // // // //               void refetchEmployees();

// // // // // //             }}
// // // // // //             disabled={
// // // // // //               isLoading ||
// // // // // //               employeesLoading
// // // // // //             }
// // // // // //             className="flex items-center gap-2 rounded-md border border-black bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 font-[Urbanist]"
// // // // // //           >

// // // // // //             <RefreshCw
// // // // // //               className={`h-4 w-4 ${
// // // // // //                 isLoading ||
// // // // // //                 employeesLoading
// // // // // //                   ? "animate-spin"
// // // // // //                   : ""
// // // // // //               }`}
// // // // // //             />

// // // // // //             Refresh

// // // // // //           </button>


// // // // // //           {/* UPDATE */}

// // // // // //           <button
// // // // // //             type="button"
// // // // // //             onClick={() => {
// // // // // //               void refetch();
// // // // // //             }}
// // // // // //             className="rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 font-[Urbanist]"
// // // // // //           >
// // // // // //             Update
// // // // // //           </button>

// // // // // //         </div>

// // // // // //       </div>


// // // // // //       {/* ===================================================
// // // // // //           EMPLOYEE API ERROR
// // // // // //       =================================================== */}

// // // // // //       {employeesError && (

// // // // // //         <div className="mb-4 rounded-lg border border-black bg-red-50 p-3 text-sm text-red-600 font-[Urbanist]">

// // // // // //           {employeesError}

// // // // // //         </div>

// // // // // //       )}


// // // // // //       {/* ===================================================
// // // // // //           DASHBOARD API ERROR
// // // // // //       =================================================== */}

// // // // // //       {error && (

// // // // // //         <div className="mb-4 rounded-lg border border-black bg-red-50 p-3 text-sm text-red-600 font-[Urbanist]">

// // // // // //           {error}

// // // // // //         </div>

// // // // // //       )}


// // // // // //       {/* ===================================================
// // // // // //           SAVE ERROR
// // // // // //       =================================================== */}

// // // // // //       {saveError && (

// // // // // //         <div className="mb-4 rounded-lg border border-black bg-red-50 p-3 text-sm text-red-600 font-[Urbanist]">

// // // // // //           {saveError}

// // // // // //         </div>

// // // // // //       )}


// // // // // //       {/* ===================================================
// // // // // //           EMPLOYEE PROFILE
// // // // // //       =================================================== */}

// // // // // //       <div className="mb-4 font-[Urbanist]">

// // // // // //         <EmployeeProfileCard
// // // // // //           profile={profile}
// // // // // //         />

// // // // // //       </div>


// // // // // //       {/* ===================================================
// // // // // //           ATTENDANCE + PUNCH
// // // // // //       =================================================== */}

// // // // // //       <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 font-[Urbanist]">


// // // // // //         {/* =================================================
// // // // // //             ATTENDANCE SUMMARY
// // // // // //         ================================================= */}

// // // // // //         <AttendanceSummaryTable
// // // // // //           rows={
// // // // // //             attendanceSummary
// // // // // //           }
// // // // // //           isLoading={
// // // // // //             isLoading
// // // // // //           }
// // // // // //         />


// // // // // //         {/* =================================================
// // // // // //             PUNCH RECORDS
// // // // // //         ================================================= */}

// // // // // //         <div>

// // // // // //           <div className="mb-3 font-[Urbanist]">

// // // // // //             <h2 className="text-base font-semibold text-gray-800 font-[Urbanist]">
// // // // // //               Punch Records
// // // // // //             </h2>

// // // // // //             <p className="text-xs text-gray-400 font-[Urbanist]">
// // // // // //               Punch details for selected employee
// // // // // //             </p>

// // // // // //           </div>


// // // // // //           {/* LOADING */}

// // // // // //           {isLoading && (

// // // // // //             <div className="rounded-xl border border-black bg-white p-8 text-center text-sm text-gray-400 font-[Urbanist]">

// // // // // //               Loading punch records...

// // // // // //             </div>

// // // // // //           )}


// // // // // //           {/* EMPTY */}

// // // // // //           {!isLoading &&
// // // // // //             punchRecords.length === 0 && (

// // // // // //               <div className="rounded-xl border border-black bg-white p-8 text-center text-sm text-gray-400 font-[Urbanist]">

// // // // // //                 No punch records found.

// // // // // //               </div>

// // // // // //             )}


// // // // // //           {/* RECORDS */}

// // // // // //           <div className="grid grid-cols-1 gap-4 font-[Urbanist]">

// // // // // //             {punchRecords.map(
// // // // // //               (record) => {

// // // // // //                 const edit =
// // // // // //                   edits[
// // // // // //                     String(
// // // // // //                       record.punchId,
// // // // // //                     )
// // // // // //                   ];


// // // // // //                 return (

// // // // // //                   <PunchRecordCard
// // // // // //                     key={
// // // // // //                       record.punchId
// // // // // //                     }

// // // // // //                     record={
// // // // // //                       record
// // // // // //                     }

// // // // // //                     correctedTime={
// // // // // //                       edit?.correctedTime ??
// // // // // //                       record.correctedTime ??
// // // // // //                       record.originalTime ??
// // // // // //                       ""
// // // // // //                     }

// // // // // //                     remarks={
// // // // // //                       edit?.remarks ??
// // // // // //                       record.remarks ??
// // // // // //                       ""
// // // // // //                     }

// // // // // //                     isSaving={
// // // // // //                       savingId ===
// // // // // //                       record.punchId
// // // // // //                     }

// // // // // //                     onCorrectedTimeChange={(
// // // // // //                       value,
// // // // // //                     ) =>
// // // // // //                       updateField(
// // // // // //                         record.punchId,
// // // // // //                         "correctedTime",
// // // // // //                         value,
// // // // // //                       )
// // // // // //                     }

// // // // // //                     onRemarksChange={(
// // // // // //                       value,
// // // // // //                     ) =>
// // // // // //                       updateField(
// // // // // //                         record.punchId,
// // // // // //                         "remarks",
// // // // // //                         value,
// // // // // //                       )
// // // // // //                     }

// // // // // //                     onSave={() =>
// // // // // //                       handleSave(
// // // // // //                         record.punchId,
// // // // // //                       )
// // // // // //                     }
// // // // // //                   />

// // // // // //                 );

// // // // // //               },
// // // // // //             )}

// // // // // //           </div>

// // // // // //         </div>

// // // // // //       </div>

// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // import {
// // // // //   useEffect,
// // // // //   useState,
// // // // // } from "react";

// // // // // import {
// // // // //   NavLink,
// // // // //   useLocation,
// // // // //   useNavigate,
// // // // // } from "react-router-dom";

// // // // // import {
// // // // //   CalendarDays,
// // // // //   RefreshCw,
// // // // //   ChevronDown,
// // // // //   Plus,
// // // // //   Bookmark,
// // // // // } from "lucide-react";

// // // // // import EmployeeProfileCard from "../components/EmployeeProfileCard";
// // // // // import AttendanceSummaryTable from "../components/AttendanceSummaryTable";
// // // // // import PunchRecordCard from "../components/PunchRecordCard";

// // // // // import {
// // // // //   useReportingEmployees,
// // // // // } from "../hooks/useReportingEmployees";

// // // // // import {
// // // // //   usePunchDashboard,
// // // // // } from "../hooks/usePunchDashboard";

// // // // // import {
// // // // //   usePunchEditor,
// // // // // } from "../hooks/usePunchEditor";

// // // // // import type {
// // // // //   PunchPageProps,
// // // // //   PunchNavigationState,
// // // // //   ViewType,
// // // // // } from "../types/punch.types";


// // // // // /* =========================================================
// // // // //    DATE
// // // // // ========================================================= */

// // // // // function getToday(): string {
// // // // //   return new Date()
// // // // //     .toISOString()
// // // // //     .slice(0, 10);
// // // // // }


// // // // // /* =========================================================
// // // // //    DISPLAY DATE
// // // // // ========================================================= */

// // // // // function formatDisplayDate(
// // // // //   value?: string | null,
// // // // // ): string {
// // // // //   if (!value) {
// // // // //     return "";
// // // // //   }

// // // // //   const date = new Date(value);

// // // // //   if (Number.isNaN(date.getTime())) {
// // // // //     return value;
// // // // //   }

// // // // //   const day = String(
// // // // //     date.getDate(),
// // // // //   ).padStart(2, "0");

// // // // //   const month = date.toLocaleString(
// // // // //     "en-US",
// // // // //     {
// // // // //       month: "short",
// // // // //     },
// // // // //   );

// // // // //   const year = date.getFullYear();

// // // // //   return `${day}/${month}/${year}`;
// // // // // }


// // // // // /* =========================================================
// // // // //    PUNCH PAGE
// // // // // ========================================================= */

// // // // // export default function PunchPage({
// // // // //   employeeId: propEmployeeId,
// // // // // }: PunchPageProps) {

// // // // //   const navigate = useNavigate();

// // // // //   const location = useLocation();


// // // // //   /* =======================================================
// // // // //      NAVIGATION STATE
// // // // //   ======================================================= */

// // // // //   const navigationState =
// // // // //     location.state as
// // // // //       | PunchNavigationState
// // // // //       | null;


// // // // //   /* =======================================================
// // // // //      DATE
// // // // //   ======================================================= */

// // // // //   const today = getToday();

// // // // //   const [selectedDate, setSelectedDate] =
// // // // //     useState<string>(
// // // // //       navigationState?.selectedDate ||
// // // // //         today,
// // // // //     );


// // // // //   /* =======================================================
// // // // //      EMPLOYEE
// // // // //   ======================================================= */

// // // // //   const [selectedEmployeeId, setSelectedEmployeeId] =
// // // // //     useState<string>(
// // // // //       navigationState?.employeeId ||
// // // // //         propEmployeeId ||
// // // // //         localStorage.getItem(
// // // // //           "employeeId",
// // // // //         ) ||
// // // // //         localStorage.getItem(
// // // // //           "EmployeeID",
// // // // //         ) ||
// // // // //         "",
// // // // //     );


// // // // //   /* =======================================================
// // // // //      VIEW
// // // // //   ======================================================= */

// // // // //   const viewType: ViewType =
// // // // //     "SingleDate";


// // // // //   /* =======================================================
// // // // //      MONTH / WEEK FILTERS
// // // // //   ======================================================= */

// // // // //   const [periodType, setPeriodType] =
// // // // //     useState<
// // // // //       "Custom Month" |
// // // // //       "Custom Week"
// // // // //     >("Custom Month");

// // // // //   const [periodValue, setPeriodValue] =
// // // // //     useState("1");

// // // // //   const [leaveFilter, setLeaveFilter] =
// // // // //     useState("Select Leave");


// // // // //   /* =======================================================
// // // // //      REPORTING EMPLOYEES
// // // // //   ======================================================= */

// // // // //   const {
// // // // //   employees,
// // // // //   isLoading: employeesLoading,
// // // // //   error: employeesError,
// // // // //   refetch: refetchEmployees,
// // // // // } = useReportingEmployees();



// // // // //   /* =======================================================
// // // // //      SELECT FIRST EMPLOYEE
// // // // //   ======================================================= */

// // // // //   useEffect(() => {

// // // // //     if (
// // // // //       !selectedEmployeeId &&
// // // // //       employees.length > 0
// // // // //     ) {

// // // // //       setSelectedEmployeeId(
// // // // //         employees[0].employeeId,
// // // // //       );

// // // // //     }

// // // // //   }, [
// // // // //     employees,
// // // // //     selectedEmployeeId,
// // // // //   ]);


// // // // //   /* =======================================================
// // // // //      SAVE EMPLOYEE
// // // // //   ======================================================= */

// // // // //   useEffect(() => {

// // // // //     if (selectedEmployeeId) {

// // // // //       localStorage.setItem(
// // // // //         "employeeId",
// // // // //         selectedEmployeeId,
// // // // //       );

// // // // //     }

// // // // //   }, [
// // // // //     selectedEmployeeId,
// // // // //   ]);


// // // // //   /* =======================================================
// // // // //      DASHBOARD
// // // // //   ======================================================= */

// // // // //   const {
// // // // //     data,
// // // // //     isLoading,
// // // // //     error,
// // // // //     refetch,
// // // // //   } = usePunchDashboard({
// // // // //     employeeId:
// // // // //       selectedEmployeeId,

// // // // //     selectedDate,

// // // // //     viewType,
// // // // //   });


// // // // //   /* =======================================================
// // // // //      EDITOR
// // // // //   ======================================================= */

// // // // //   const {
// // // // //     edits,
// // // // //     savingId,
// // // // //     saveError,
// // // // //     updateField,
// // // // //     saveRecord,
// // // // //   } = usePunchEditor(
// // // // //     data?.punchRecords ?? [],
// // // // //   );


// // // // //   /* =======================================================
// // // // //      DYNAMIC DATA
// // // // //   ======================================================= */

// // // // //   const profile =
// // // // //     data?.employeeProfile?.[0] ??
// // // // //     null;

// // // // //   const attendanceSummary =
// // // // //     data?.attendanceSummary ?? [];

// // // // //   const punchRecords =
// // // // //     data?.punchRecords ?? [];


// // // // //   /* =======================================================
// // // // //      SELECTED EMPLOYEE OBJECT
// // // // //   ======================================================= */

  


// // // // //   /* =======================================================
// // // // //      EMPLOYEE CHANGE
// // // // //   ======================================================= */

// // // // //   const handleEmployeeChange = (
// // // // //     value: string,
// // // // //   ) => {

// // // // //     setSelectedEmployeeId(value);

// // // // //     navigate(
// // // // //       {
// // // // //         pathname:
// // // // //           location.pathname,

// // // // //         search:
// // // // //           `?employeeId=${encodeURIComponent(
// // // // //             value,
// // // // //           )}&date=${encodeURIComponent(
// // // // //             selectedDate,
// // // // //           )}`,
// // // // //       },
// // // // //       {
// // // // //         replace: true,
// // // // //       },
// // // // //     );
// // // // //   };


// // // // //   /* =======================================================
// // // // //      DATE CHANGE
// // // // //   ======================================================= */

// // // // //   const handleDateChange = (
// // // // //     value: string,
// // // // //   ) => {

// // // // //     setSelectedDate(value);

// // // // //   };


// // // // //   /* =======================================================
// // // // //      SAVE
// // // // //   ======================================================= */

// // // // //   const handleSave = async (
// // // // //     punchId: string | number,
// // // // //   ) => {

// // // // //     await saveRecord(
// // // // //       punchId,
// // // // //     );

// // // // //   };


// // // // //   /* =======================================================
// // // // //      REFRESH
// // // // //   ======================================================= */

// // // // //   const handleRefresh = () => {

// // // // //     void refetchEmployees();

// // // // //     if (selectedEmployeeId) {
// // // // //       void refetch();
// // // // //     }

// // // // //   };


// // // // //   return (
// // // // //     <div className="min-h-screen bg-[#f4f5f9] font-[Urbanist]">

// // // // //       {/* ===================================================
// // // // //           TOP NAVIGATION
// // // // //       =================================================== */}

// // // // //       <div className="border-b border-black bg-white font-[Urbanist]">

// // // // //         <div className="flex items-center justify-between gap-4 px-4 py-2 font-[Urbanist]">

// // // // //           {/* TABS */}

// // // // //           <div className="flex min-w-0 items-center gap-8 overflow-x-auto font-[Urbanist]">

// // // // //             <NavLink
// // // // //               to="../Punch"
// // // // //               className={({ isActive }) =>
// // // // //                 `whitespace-nowrap border-b-2 px-1 py-4 text-[15px] font-semibold ${
// // // // //                   isActive
// // // // //                     ? "border-[#1997e8] text-[#1997e8]"
// // // // //                     : "border-transparent text-gray-600"
// // // // //                 }`
// // // // //               }
// // // // //             >
// // // // //               Punch
// // // // //             </NavLink>

// // // // //             <NavLink
// // // // //               to="../MissedPunch"
// // // // //               className={({ isActive }) =>
// // // // //                 `whitespace-nowrap border-b-2 px-1 py-4 text-[15px] font-semibold ${
// // // // //                   isActive
// // // // //                     ? "border-[#1997e8] text-[#1997e8]"
// // // // //                     : "border-transparent text-gray-600"
// // // // //                 }`
// // // // //               }
// // // // //             >
// // // // //               Missed Punch
// // // // //             </NavLink>

// // // // //             <span className="whitespace-nowrap px-1 py-4 text-[15px] font-semibold text-gray-400 font-[Urbanist]">
// // // // //               Attendance
// // // // //             </span>

// // // // //             <span className="whitespace-nowrap px-1 py-4 text-[15px] font-semibold text-gray-400 font-[Urbanist]">
// // // // //               TA Insights
// // // // //             </span>

// // // // //           </div>


// // // // //           {/* RIGHT FILTERS */}

// // // // //           <div className="hidden items-center gap-4 xl:flex font-[Urbanist]">

// // // // //             {/* DATE */}

// // // // //             <div className="flex items-center gap-2 font-[Urbanist]">

// // // // //               <span className="text-sm font-medium text-gray-700 font-[Urbanist]">
// // // // //                 Date
// // // // //               </span>

// // // // //               <div className="relative font-[Urbanist]">

// // // // //                 <input
// // // // //                   type="date"
// // // // //                   value={selectedDate}
// // // // //                   onChange={(event) =>
// // // // //                     handleDateChange(
// // // // //                       event.target.value,
// // // // //                     )
// // // // //                   }
// // // // //                   className="h-10 w-[195px] rounded-md border border-black bg-white px-3 pr-9 text-sm text-gray-700 outline-none focus:border-black font-[Urbanist]"
// // // // //                 />

// // // // //                 <CalendarDays
// // // // //                   size={17}
// // // // //                   className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-[Urbanist]"
// // // // //                 />

// // // // //               </div>

// // // // //             </div>


// // // // //             {/* EMPLOYEE */}

// // // // //             <div className="flex items-center gap-2 font-[Urbanist]">

// // // // //               <span className="text-sm font-medium text-gray-700 font-[Urbanist]">
// // // // //                 Employee
// // // // //               </span>

// // // // //               <div className="relative font-[Urbanist]">

// // // // //                 <select
// // // // //                   value={
// // // // //                     selectedEmployeeId
// // // // //                   }
// // // // //                   onChange={(event) =>
// // // // //                     handleEmployeeChange(
// // // // //                       event.target.value,
// // // // //                     )
// // // // //                   }
// // // // //                   disabled={
// // // // //                     employeesLoading
// // // // //                   }
// // // // //                   className="h-10 w-[200px] appearance-none truncate rounded-md border border-black bg-gray-50 px-3 pr-9 text-sm font-medium text-gray-700 outline-none focus:border-black font-[Urbanist]"
// // // // //                 >

// // // // //                   <option value="">
// // // // //                     {employeesLoading
// // // // //                       ? "Loading..."
// // // // //                       : "Select Employee"}
// // // // //                   </option>

// // // // //                   {employees.map(
// // // // //                     (employee) => (

// // // // //                       <option
// // // // //                         key={
// // // // //                           employee.employeeId
// // // // //                         }
// // // // //                         value={
// // // // //                           employee.employeeId
// // // // //                         }
// // // // //                       >
// // // // //                         {
// // // // //                           employee.employeeId
// // // // //                         }{" "}
// // // // //                         {
// // // // //                           employee.employeeName
// // // // //                         }
// // // // //                       </option>

// // // // //                     ),
// // // // //                   )}

// // // // //                 </select>

// // // // //                 <ChevronDown
// // // // //                   size={16}
// // // // //                   className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-[Urbanist]"
// // // // //                 />

// // // // //               </div>

// // // // //             </div>


// // // // //             {/* UPDATE */}

// // // // //             <button
// // // // //               type="button"
// // // // //               onClick={() => {
// // // // //                 void refetch();
// // // // //               }}
// // // // //               className="flex h-10 items-center gap-2 rounded-md bg-[#1597e5] px-5 text-sm font-semibold text-white hover:bg-[#0788d2] font-[Urbanist]"
// // // // //             >

// // // // //               <Bookmark
// // // // //                 size={16}
// // // // //               />

// // // // //               Update

// // // // //             </button>


// // // // //             {/* REFRESH */}

// // // // //             <button
// // // // //               type="button"
// // // // //               onClick={
// // // // //                 handleRefresh
// // // // //               }
// // // // //               className="rounded-full p-2 text-gray-400 hover:bg-gray-100 font-[Urbanist]"
// // // // //             >

// // // // //               <RefreshCw
// // // // //                 size={20}
// // // // //                 className={
// // // // //                   isLoading ||
// // // // //                   employeesLoading
// // // // //                     ? "animate-spin"
// // // // //                     : ""
// // // // //                 }
// // // // //               />

// // // // //             </button>

// // // // //           </div>

// // // // //         </div>

// // // // //       </div>


// // // // //       {/* ===================================================
// // // // //           ERROR
// // // // //       =================================================== */}

// // // // //       {(employeesError ||
// // // // //         error ||
// // // // //         saveError) && (

// // // // //         <div className="mx-4 mt-3 rounded-lg border border-black bg-red-50 px-4 py-3 text-sm text-red-600 font-[Urbanist]">

// // // // //           {employeesError ||
// // // // //             error ||
// // // // //             saveError}

// // // // //         </div>

// // // // //       )}


// // // // //       {/* ===================================================
// // // // //           MAIN CONTENT
// // // // //       =================================================== */}

// // // // //       <div className="p-4 font-[Urbanist]">


// // // // //         {/* =================================================
// // // // //             TWO COLUMN AREA
// // // // //         ================================================= */}

// // // // //         <div className="grid grid-cols-1 gap-4 xl:grid-cols-[36%_64%] font-[Urbanist]">


// // // // //           {/* =================================================
// // // // //               LEFT SIDE
// // // // //           ================================================= */}

// // // // //           <div className="space-y-3 font-[Urbanist]">


// // // // //             {/* =================================================
// // // // //                 EMPLOYEE PROFILE
// // // // //             ================================================= */}

// // // // //             <div className="rounded-xl border border-black bg-white font-[Urbanist]">

// // // // //               {isLoading &&
// // // // //               !profile ? (

// // // // //                 <div className="flex min-h-[180px] items-center justify-center text-sm text-gray-400 font-[Urbanist]">
// // // // //                   Loading employee details...
// // // // //                 </div>

// // // // //               ) : profile ? (

// // // // //                 <div className="p-4 font-[Urbanist]">


// // // // //                   {/* EMPLOYEE NAME */}

// // // // //                   <div className="text-center font-[Urbanist]">

// // // // //                     <h1 className="text-[23px] font-semibold text-[#1597e5] font-[Urbanist]">
// // // // //                       {profile.employeeName}
// // // // //                     </h1>

// // // // //                     <div className="mt-1 inline-block rounded-sm bg-[#ddd4ff] px-2 py-1 text-[15px] font-semibold text-gray-800 font-[Urbanist]">
// // // // //                       {profile.employeeId}
// // // // //                     </div>

// // // // //                   </div>


// // // // //                   {/* REPORTING AUTHORITY */}

// // // // //                   <div className="mt-2 flex items-center justify-center gap-2 font-[Urbanist]">

// // // // //                     <span className="rounded-md border border-black bg-gray-100 px-2 py-1 text-sm font-semibold text-gray-700 font-[Urbanist]">
// // // // //                       R.A
// // // // //                     </span>

// // // // //                     <span className="truncate text-sm font-medium text-gray-600 font-[Urbanist]">
// // // // //                       {profile.reportingAuthorityName ||
// // // // //                         "Reporting Authority"}
// // // // //                     </span>

// // // // //                   </div>


// // // // //                   {/* DETAILS */}

// // // // //                   <div className="mt-5 grid grid-cols-2 gap-5 font-[Urbanist]">

// // // // //                     {/* POLICY */}

// // // // //                     <div>

// // // // //                       <h3 className="border-b border-black pb-2 text-[15px] font-semibold text-[#1597e5] font-[Urbanist]">
// // // // //                         Policy Details
// // // // //                       </h3>

// // // // //                       <div className="mt-2 space-y-1 font-[Urbanist]">

// // // // //                         <p className="text-sm text-gray-500 font-[Urbanist]">
// // // // //                           {profile.policyName ||
// // // // //                             "General Policy"}
// // // // //                         </p>

// // // // //                         <p className="text-sm text-gray-500 font-[Urbanist]">
// // // // //                           {profile.doublePunchPolicy ||
// // // // //                             "Double Punch"}
// // // // //                         </p>

// // // // //                       </div>

// // // // //                     </div>


// // // // //                     {/* SHIFT */}

// // // // //                     <div>

// // // // //                       <h3 className="border-b border-black pb-2 text-[15px] font-semibold text-[#1597e5] font-[Urbanist]">
// // // // //                         Shift Details
// // // // //                       </h3>

// // // // //                       <div className="mt-2 space-y-1 font-[Urbanist]">

// // // // //                         <p className="text-sm text-gray-500 font-[Urbanist]">
// // // // //                           {profile.shiftName ||
// // // // //                             "General Shift (GS)"}
// // // // //                         </p>

// // // // //                         <p className="text-sm text-gray-500 font-[Urbanist]">
// // // // //                           {profile.shiftTiming ||
// // // // //                             "10:00 TO 19:00"}
// // // // //                         </p>

// // // // //                       </div>

// // // // //                     </div>

// // // // //                   </div>

// // // // //                 </div>

// // // // //               ) : (

// // // // //                 <div className="p-6 text-center text-sm text-gray-400 font-[Urbanist]">
// // // // //                   Select an employee to view details.
// // // // //                 </div>

// // // // //               )}

// // // // //             </div>


// // // // //             {/* =================================================
// // // // //                 MONTH / WEEK FILTER
// // // // //             ================================================= */}

// // // // //             <div className="rounded-xl border border-black bg-white p-3 font-[Urbanist]">

// // // // //               <p className="mb-3 text-sm font-medium text-gray-700 font-[Urbanist]">
// // // // //                 Select a month or week to see absences for that period
// // // // //               </p>

// // // // //               <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 font-[Urbanist]">


// // // // //                 {/* PERIOD */}

// // // // //                 <div className="relative font-[Urbanist]">

// // // // //                   <select
// // // // //                     value={periodType}
// // // // //                     onChange={(event) =>
// // // // //                       setPeriodType(
// // // // //                         event.target.value as
// // // // //                           | "Custom Month"
// // // // //                           | "Custom Week",
// // // // //                       )
// // // // //                     }
// // // // //                     className="h-10 w-full appearance-none rounded-md border border-black bg-white px-3 pr-8 text-sm text-gray-700 outline-none font-[Urbanist]"
// // // // //                   >

// // // // //                     <option>
// // // // //                       Custom Month
// // // // //                     </option>

// // // // //                     <option>
// // // // //                       Custom Week
// // // // //                     </option>

// // // // //                   </select>

// // // // //                   <ChevronDown
// // // // //                     size={16}
// // // // //                     className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 font-[Urbanist]"
// // // // //                   />

// // // // //                 </div>


// // // // //                 {/* NUMBER */}

// // // // //                 <input
// // // // //                   type="number"
// // // // //                   min="1"
// // // // //                   value={periodValue}
// // // // //                   onChange={(event) =>
// // // // //                     setPeriodValue(
// // // // //                       event.target.value,
// // // // //                     )
// // // // //                   }
// // // // //                   className="h-10 rounded-md border border-black px-3 text-sm outline-none font-[Urbanist]"
// // // // //                 />


// // // // //                 {/* LEAVE */}

// // // // //                 <div className="relative font-[Urbanist]">

// // // // //                   <select
// // // // //                     value={leaveFilter}
// // // // //                     onChange={(event) =>
// // // // //                       setLeaveFilter(
// // // // //                         event.target.value,
// // // // //                       )
// // // // //                     }
// // // // //                     className="h-10 w-full appearance-none rounded-md border border-black bg-white px-3 pr-8 text-sm text-gray-700 outline-none font-[Urbanist]"
// // // // //                   >

// // // // //                     <option>
// // // // //                       Select Leave
// // // // //                     </option>

// // // // //                     <option>
// // // // //                       All Leave
// // // // //                     </option>

// // // // //                   </select>

// // // // //                   <ChevronDown
// // // // //                     size={16}
// // // // //                     className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 font-[Urbanist]"
// // // // //                   />

// // // // //                 </div>

// // // // //               </div>

// // // // //             </div>


// // // // //             {/* =================================================
// // // // //                 ATTENDANCE TABLE
// // // // //             ================================================= */}

// // // // //             <div className="overflow-hidden rounded-xl border border-black bg-white font-[Urbanist]">

// // // // //               <div className="overflow-x-auto font-[Urbanist]">

// // // // //                 <table className="w-full min-w-[520px] font-[Urbanist]">

// // // // //                   <thead>

// // // // //                     <tr className="bg-[#d4e9f7] font-[Urbanist]">

// // // // //                       <th className="px-3 py-4 text-left text-sm font-semibold text-gray-800 font-[Urbanist]">
// // // // //                         Date
// // // // //                       </th>

// // // // //                       <th className="px-3 py-4 text-left text-sm font-semibold text-gray-800 font-[Urbanist]">
// // // // //                         Shift
// // // // //                       </th>

// // // // //                       <th className="px-3 py-4 text-left text-sm font-semibold text-gray-800 font-[Urbanist]">
// // // // //                         First Half
// // // // //                       </th>

// // // // //                       <th className="px-3 py-4 text-left text-sm font-semibold text-gray-800 font-[Urbanist]">
// // // // //                         Second Half
// // // // //                       </th>

// // // // //                       <th className="px-3 py-4 text-left text-sm font-semibold text-gray-800 font-[Urbanist]">
// // // // //                         Day Status
// // // // //                       </th>

// // // // //                     </tr>

// // // // //                   </thead>


// // // // //                   <tbody>

// // // // //                     {isLoading ? (

// // // // //                       <tr>

// // // // //                         <td
// // // // //                           colSpan={5}
// // // // //                           className="px-4 py-8 text-center text-sm text-gray-400 font-[Urbanist]"
// // // // //                         >
// // // // //                           Loading attendance...
// // // // //                         </td>

// // // // //                       </tr>

// // // // //                     ) : attendanceSummary.length === 0 ? (

// // // // //                       <tr>

// // // // //                         <td
// // // // //                           colSpan={5}
// // // // //                           className="px-4 py-8 text-center text-sm text-gray-400 font-[Urbanist]"
// // // // //                         >
// // // // //                           No attendance data found.
// // // // //                         </td>

// // // // //                       </tr>

// // // // //                     ) : (

// // // // //                       attendanceSummary.map(
// // // // //                         (
// // // // //                           row,
// // // // //                           index,
// // // // //                         ) => (

// // // // //                           <tr
// // // // //                             key={`${row.date}-${index}`}
// // // // //                             className="border-t border-black bg-white font-[Urbanist]"
// // // // //                           >

// // // // //                             <td className="px-3 py-4 text-sm text-gray-700 font-[Urbanist]">
// // // // //                               {formatDisplayDate(
// // // // //                                 row.date,
// // // // //                               )}
// // // // //                             </td>

// // // // //                             <td className="px-3 py-4 text-sm text-gray-700 font-[Urbanist]">
// // // // //                               {row.shift}
// // // // //                             </td>

// // // // //                             <td className="px-3 py-4 font-[Urbanist]">

// // // // //                               <span className="inline-flex rounded-md border border-black bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600 font-[Urbanist]">
// // // // //                                 {row.firstHalf}
// // // // //                               </span>

// // // // //                             </td>

// // // // //                             <td className="px-3 py-4 font-[Urbanist]">

// // // // //                               <span className="inline-flex rounded-md border border-black bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600 font-[Urbanist]">
// // // // //                                 {row.secondHalf}
// // // // //                               </span>

// // // // //                             </td>

// // // // //                             <td className="px-3 py-4 font-[Urbanist]">

// // // // //                               <span className="inline-flex rounded-md border border-black bg-green-50 px-2 py-1 text-xs font-semibold text-green-600 font-[Urbanist]">
// // // // //                                 {row.dayStatus}
// // // // //                               </span>

// // // // //                             </td>

// // // // //                           </tr>

// // // // //                         ),
// // // // //                       )

// // // // //                     )}

// // // // //                   </tbody>

// // // // //                 </table>

// // // // //               </div>

// // // // //             </div>

// // // // //           </div>


// // // // //           {/* =================================================
// // // // //               RIGHT SIDE - PUNCH RECORDS
// // // // //           ================================================= */}

// // // // //           <div className="rounded-xl border border-black bg-white font-[Urbanist]">


// // // // //             {/* HEADER */}

// // // // //             <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-xl bg-[#d3e8f5] px-4 py-3 font-[Urbanist]">

// // // // //               <div>

// // // // //                 <h2 className="text-base font-semibold text-gray-800 font-[Urbanist]">
// // // // //                   Punch Records
// // // // //                 </h2>

// // // // //                 <p className="text-xs text-gray-500 font-[Urbanist]">
// // // // //                   Review, correct and add punch times
// // // // //                 </p>

// // // // //               </div>


// // // // //               <div className="flex items-center gap-2 font-[Urbanist]">

// // // // //                 <button
// // // // //                   type="button"
// // // // //                   className="rounded-full bg-[#b8d9e9] px-4 py-2 text-sm font-semibold text-[#1597e5] font-[Urbanist]"
// // // // //                 >
// // // // //                   Show All
// // // // //                 </button>

// // // // //                 <button
// // // // //                   type="button"
// // // // //                   className="flex items-center gap-2 rounded-md bg-[#1597e5] px-4 py-2 text-sm font-semibold text-white font-[Urbanist]"
// // // // //                 >
// // // // //                   <Plus size={16} />
// // // // //                   Permission
// // // // //                 </button>

// // // // //                 <button
// // // // //                   type="button"
// // // // //                   className="flex items-center gap-2 rounded-md bg-[#1597e5] px-4 py-2 text-sm font-semibold text-white font-[Urbanist]"
// // // // //                 >
// // // // //                   <Plus size={16} />
// // // // //                   Punch
// // // // //                 </button>

// // // // //               </div>

// // // // //             </div>


// // // // //             {/* PUNCH CARDS */}

// // // // //             <div className="p-4 font-[Urbanist]">

// // // // //               {isLoading ? (

// // // // //                 <div className="rounded-xl border border-black bg-white p-12 text-center text-sm text-gray-400 font-[Urbanist]">
// // // // //                   Loading punch records...
// // // // //                 </div>

// // // // //               ) : punchRecords.length === 0 ? (

// // // // //                 <div className="rounded-xl border border-black bg-white p-12 text-center text-sm text-gray-400 font-[Urbanist]">
// // // // //                   No punch records found.
// // // // //                 </div>

// // // // //               ) : (

// // // // //                 <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 font-[Urbanist]">

// // // // //                   {punchRecords.map(
// // // // //                     (record) => {

// // // // //                       const edit =
// // // // //                         edits[
// // // // //                           String(
// // // // //                             record.punchId,
// // // // //                           )
// // // // //                         ];


// // // // //                       return (

// // // // //                         <div
// // // // //                           key={
// // // // //                             record.punchId
// // // // //                           }
// // // // //                           className="min-w-0 font-[Urbanist]"
// // // // //                         >

// // // // //                           <PunchRecordCard
// // // // //                             record={
// // // // //                               record
// // // // //                             }

// // // // //                             correctedTime={
// // // // //                               edit?.correctedTime ??
// // // // //                               record.correctedTime ??
// // // // //                               record.originalTime ??
// // // // //                               ""
// // // // //                             }

// // // // //                             remarks={
// // // // //                               edit?.remarks ??
// // // // //                               record.remarks ??
// // // // //                               ""
// // // // //                             }

// // // // //                             isSaving={
// // // // //                               savingId ===
// // // // //                               record.punchId
// // // // //                             }

// // // // //                             onCorrectedTimeChange={(
// // // // //                               value,
// // // // //                             ) =>
// // // // //                               updateField(
// // // // //                                 record.punchId,
// // // // //                                 "correctedTime",
// // // // //                                 value,
// // // // //                               )
// // // // //                             }

// // // // //                             onRemarksChange={(
// // // // //                               value,
// // // // //                             ) =>
// // // // //                               updateField(
// // // // //                                 record.punchId,
// // // // //                                 "remarks",
// // // // //                                 value,
// // // // //                               )
// // // // //                             }

// // // // //                             onSave={() =>
// // // // //                               handleSave(
// // // // //                                 record.punchId,
// // // // //                               )
// // // // //                             }

// // // // //                           />

// // // // //                         </div>

// // // // //                       );

// // // // //                     },
// // // // //                   )}

// // // // //                 </div>

// // // // //               )}

// // // // //             </div>

// // // // //           </div>

// // // // //         </div>

// // // // //       </div>

// // // // //     </div>
// // // // //   );
// // // // // }


// // // // import {
// // // //   useCallback,
// // // //   useEffect,
// // // //   useState,
// // // // } from "react";

// // // // import {
// // // //   getEmployeePunchDashboard,
// // // // } from "../api/punchApi";

// // // // import type {
// // // //   EmployeePunchDashboardResponse,
// // // //   PunchDashboardParams,
// // // //   UsePunchDashboardResult,
// // // // } from "../types/punch.types";

// // // // export function usePunchDashboard(
// // // //   params: PunchDashboardParams | null,
// // // // ): UsePunchDashboardResult {
// // // //   const [
// // // //     data,
// // // //     setData,
// // // //   ] =
// // // //     useState<EmployeePunchDashboardResponse | null>(
// // // //       null,
// // // //     );

// // // //   const [
// // // //     isLoading,
// // // //     setIsLoading,
// // // //   ] = useState(false);

// // // //   const [
// // // //     error,
// // // //     setError,
// // // //   ] = useState<string | null>(
// // // //     null,
// // // //   );

// // // //   const fetchDashboard =
// // // //     useCallback(async () => {
// // // //       /*
// // // //        * Do not call API without employee.
// // // //        */
// // // //       if (
// // // //         !params ||
// // // //         !params.employeeId
// // // //       ) {
// // // //         setData(null);
// // // //         setError(null);
// // // //         setIsLoading(false);
// // // //         return;
// // // //       }

// // // //       /*
// // // //        * Prevent [object Object]
// // // //        */
// // // //       if (
// // // //         typeof params.employeeId !==
// // // //           "string" &&
// // // //         typeof params.employeeId !==
// // // //           "number"
// // // //       ) {
// // // //         setData(null);

// // // //         setError(
// // // //           "Invalid employee ID.",
// // // //         );

// // // //         setIsLoading(false);

// // // //         return;
// // // //       }

// // // //       setIsLoading(true);
// // // //       setError(null);

// // // //       try {
// // // //         console.log(
// // // //           "[Punch Hook] Fetching dashboard:",
// // // //           params,
// // // //         );

// // // //         const result =
// // // //           await getEmployeePunchDashboard(
// // // //             {
// // // //               employeeId:
// // // //                 String(
// // // //                   params.employeeId,
// // // //                 ),

// // // //               selectedDate:
// // // //                 params.selectedDate,

// // // //               viewType:
// // // //                 params.viewType ||
// // // //                 "SingleDate",
// // // //             },
// // // //           );

// // // //         console.log(
// // // //           "[Punch Hook] Dashboard result:",
// // // //           result,
// // // //         );

// // // //         setData(result);
// // // //       } catch (err) {
// // // //         console.error(
// // // //           "[Punch Hook] Dashboard error:",
// // // //           err,
// // // //         );

// // // //         setData(null);

// // // //         setError(
// // // //           err instanceof Error
// // // //             ? err.message
// // // //             : "Failed to load punch dashboard.",
// // // //         );
// // // //       } finally {
// // // //         setIsLoading(false);
// // // //       }
// // // //     }, [
// // // //       params?.employeeId,
// // // //       params?.selectedDate,
// // // //       params?.viewType,
// // // //     ]);

// // // //   useEffect(() => {
// // // //     void fetchDashboard();
// // // //   }, [fetchDashboard]);

// // // //   const refetch =
// // // //     useCallback(async () => {
// // // //       await fetchDashboard();
// // // //     }, [
// // // //       fetchDashboard,
// // // //     ]);

// // // //   return {
// // // //     data,

// // // //     isLoading,

// // // //     error,

// // // //     refetch,
// // // //   };
// // // // }

// // // import {
// // //   useEffect,
// // //   useState,
// // // } from "react";

// // // import {
// // //   NavLink,
// // //   useLocation,
// // //   useNavigate,
// // // } from "react-router-dom";

// // // import {
// // //   CalendarDays,
// // //   RefreshCw,
// // //   ChevronDown,
// // //   Plus,
// // //   Bookmark,
// // // } from "lucide-react";

// // // import EmployeeProfileCard from "../components/EmployeeProfileCard";
// // // import PunchRecordCard from "../components/PunchRecordCard";

// // // import {
// // //   useReportingEmployees,
// // // } from "../hooks/useReportingEmployees";

// // // import {
// // //   usePunchDashboard,
// // // } from "../hooks/usePunchDashboard";

// // // import {
// // //   usePunchEditor,
// // // } from "../hooks/usePunchEditor";

// // // import type {
// // //   PunchPageProps,
// // //   PunchNavigationState,
// // //   ViewType,
// // // } from "../types/punch.types";

// // // /* =========================================================
// // //    GET TODAY
// // // ========================================================= */

// // // function getToday(): string {
// // //   const date = new Date();

// // //   const year = date.getFullYear();

// // //   const month = String(
// // //     date.getMonth() + 1,
// // //   ).padStart(2, "0");

// // //   const day = String(
// // //     date.getDate(),
// // //   ).padStart(2, "0");

// // //   return `${year}-${month}-${day}`;
// // // }

// // // /* =========================================================
// // //    FORMAT DATE
// // // ========================================================= */

// // // function formatDisplayDate(
// // //   value?: string | null,
// // // ): string {
// // //   if (!value) {
// // //     return "";
// // //   }

// // //   const date = new Date(value);

// // //   if (Number.isNaN(date.getTime())) {
// // //     return value;
// // //   }

// // //   const day = String(
// // //     date.getDate(),
// // //   ).padStart(2, "0");

// // //   const month =
// // //     date.toLocaleString(
// // //       "en-US",
// // //       {
// // //         month: "short",
// // //       },
// // //     );

// // //   const year =
// // //     date.getFullYear();

// // //   return `${day}/${month}/${year}`;
// // // }

// // // /* =========================================================
// // //    PUNCH PAGE
// // // ========================================================= */

// // // export default function PunchPage({
// // //   employeeId: propEmployeeId,
// // // }: PunchPageProps) {
// // //   const navigate = useNavigate();

// // //   const location = useLocation();

// // //   /* =======================================================
// // //      NAVIGATION STATE
// // //   ======================================================= */

// // //   const navigationState =
// // //     location.state as
// // //       | PunchNavigationState
// // //       | null;

// // //   /* =======================================================
// // //      DATE
// // //   ======================================================= */

// // //   const today = getToday();

// // //   const [
// // //     selectedDate,
// // //     setSelectedDate,
// // //   ] = useState<string>(
// // //     navigationState?.selectedDate ||
// // //       today,
// // //   );

// // //   /* =======================================================
// // //      EMPLOYEE
// // //   ======================================================= */

// // //   const [
// // //     selectedEmployeeId,
// // //     setSelectedEmployeeId,
// // //   ] = useState<string>(
// // //     navigationState?.employeeId ||
// // //       propEmployeeId ||
// // //       localStorage.getItem(
// // //         "employeeId",
// // //       ) ||
// // //       localStorage.getItem(
// // //         "EmployeeID",
// // //       ) ||
// // //       "",
// // //   );

// // //   /* =======================================================
// // //      VIEW TYPE
// // //   ======================================================= */

// // //   const viewType: ViewType =
// // //     "SingleDate";

// // //   /* =======================================================
// // //      MONTH / WEEK FILTERS
// // //   ======================================================= */

// // //   const [
// // //     periodType,
// // //     setPeriodType,
// // //   ] = useState<
// // //     "Custom Month" | "Custom Week"
// // //   >("Custom Month");

// // //   const [
// // //     periodValue,
// // //     setPeriodValue,
// // //   ] = useState("1");

// // //   const [
// // //     leaveFilter,
// // //     setLeaveFilter,
// // //   ] = useState("Select Leave");

// // //   /* =======================================================
// // //      REPORTING EMPLOYEES
// // //   ======================================================= */

// // //   const {
// // //     employees,
// // //     isLoading:
// // //       employeesLoading,
// // //     error:
// // //       employeesError,
// // //     refetch:
// // //       refetchEmployees,
// // //   } = useReportingEmployees();

// // //   /* =======================================================
// // //      SELECT FIRST EMPLOYEE
// // //   ======================================================= */

// // //   useEffect(() => {
// // //     if (
// // //       !selectedEmployeeId &&
// // //       employees.length > 0
// // //     ) {
// // //       setSelectedEmployeeId(
// // //         String(
// // //           employees[0].employeeId,
// // //         ),
// // //       );
// // //     }
// // //   }, [
// // //     employees,
// // //     selectedEmployeeId,
// // //   ]);

// // //   /* =======================================================
// // //      SAVE EMPLOYEE
// // //   ======================================================= */

// // //   useEffect(() => {
// // //     if (
// // //       selectedEmployeeId
// // //     ) {
// // //       localStorage.setItem(
// // //         "employeeId",
// // //         selectedEmployeeId,
// // //       );

// // //       localStorage.setItem(
// // //         "EmployeeID",
// // //         selectedEmployeeId,
// // //       );
// // //     }
// // //   }, [
// // //     selectedEmployeeId,
// // //   ]);

// // //   /* =======================================================
// // //      PUNCH DASHBOARD
// // //   ======================================================= */

// // //   const {
// // //     data,
// // //     isLoading,
// // //     error,
// // //     refetch,
// // //   } = usePunchDashboard({
// // //     employeeId:
// // //       selectedEmployeeId,

// // //     selectedDate,

// // //     viewType,
// // //   });

// // //   /* =======================================================
// // //      PUNCH EDITOR
// // //   ======================================================= */

// // //   const {
// // //     edits,
// // //     savingId,
// // //     saveError,
// // //     updateField,
// // //     saveRecord,
// // //   } = usePunchEditor(
// // //     data?.punchRecords ?? [],
// // //   );

// // //   /* =======================================================
// // //      DATA
// // //   ======================================================= */

// // //   const profile =
// // //     data?.employeeProfile?.[0] ??
// // //     null;

// // //   const attendanceSummary =
// // //     data?.attendanceSummary ?? [];

// // //   const punchRecords =
// // //     data?.punchRecords ?? [];

// // //   /* =======================================================
// // //      EMPLOYEE CHANGE
// // //   ======================================================= */

// // //   const handleEmployeeChange = (
// // //     value: string,
// // //   ) => {
// // //     setSelectedEmployeeId(value);

// // //     navigate(
// // //       {
// // //         pathname:
// // //           location.pathname,

// // //         search:
// // //           `?employeeId=${encodeURIComponent(
// // //             value,
// // //           )}&date=${encodeURIComponent(
// // //             selectedDate,
// // //           )}`,
// // //       },
// // //       {
// // //         replace: true,
// // //       },
// // //     );
// // //   };

// // //   /* =======================================================
// // //      DATE CHANGE
// // //   ======================================================= */

// // //   const handleDateChange = (
// // //     value: string,
// // //   ) => {
// // //     setSelectedDate(value);

// // //     /*
// // //      * Keep URL synchronized
// // //      */
// // //     navigate(
// // //       {
// // //         pathname:
// // //           location.pathname,

// // //         search:
// // //           `?employeeId=${encodeURIComponent(
// // //             selectedEmployeeId,
// // //           )}&date=${encodeURIComponent(
// // //             value,
// // //           )}`,
// // //       },
// // //       {
// // //         replace: true,
// // //       },
// // //     );
// // //   };

// // //   /* =======================================================
// // //      SAVE
// // //   ======================================================= */

// // //   const handleSave = async (
// // //     punchId: string | number,
// // //   ) => {
// // //     await saveRecord(
// // //       punchId,
// // //     );

// // //     /*
// // //      * Refresh dashboard after save
// // //      */
// // //     await refetch();
// // //   };

// // //   /* =======================================================
// // //      REFRESH
// // //   ======================================================= */

// // //   const handleRefresh = () => {
// // //     void refetchEmployees();

// // //     if (
// // //       selectedEmployeeId
// // //     ) {
// // //       void refetch();
// // //     }
// // //   };

// // //   /* =======================================================
// // //      UPDATE
// // //   ======================================================= */

// // //   const handleUpdate = () => {
// // //     if (
// // //       selectedEmployeeId
// // //     ) {
// // //       void refetch();
// // //     }
// // //   };

// // //   /* =======================================================
// // //      RENDER
// // //   ======================================================= */

// // //   return (
// // //     <div className="min-h-screen bg-[#f4f5f9] font-[Urbanist]">

// // //       {/* ===================================================
// // //           TOP NAVIGATION
// // //       =================================================== */}

// // //       <div className="border-b border-black bg-white font-[Urbanist]">

// // //         <div className="flex items-center justify-between gap-4 px-4 py-2 font-[Urbanist]">

// // //           {/* =================================================
// // //               TABS
// // //           ================================================= */}

// // //           <div className="flex min-w-0 items-center gap-8 overflow-x-auto font-[Urbanist]">

// // //             {/* PUNCH */}

// // //             <NavLink
// // //               to="../Punch"
// // //               className={({
// // //                 isActive,
// // //               }) =>
// // //                 `whitespace-nowrap border-b-2 px-1 py-4 text-[15px] font-semibold ${
// // //                   isActive
// // //                     ? "border-[#1997e8] text-[#1997e8]"
// // //                     : "border-transparent text-gray-600"
// // //                 }`
// // //               }
// // //             >
// // //               Punch
// // //             </NavLink>

// // //             {/* MISSED PUNCH */}

// // //             <NavLink
// // //               to="../MissedPunch"
// // //               className={({
// // //                 isActive,
// // //               }) =>
// // //                 `whitespace-nowrap border-b-2 px-1 py-4 text-[15px] font-semibold ${
// // //                   isActive
// // //                     ? "border-[#1997e8] text-[#1997e8]"
// // //                     : "border-transparent text-gray-600"
// // //                 }`
// // //               }
// // //             >
// // //               Missed Punch
// // //             </NavLink>

// // //             {/* ATTENDANCE */}

// // //             <span className="whitespace-nowrap px-1 py-4 text-[15px] font-semibold text-gray-400 font-[Urbanist]">
// // //               Attendance
// // //             </span>

// // //             {/* TA INSIGHTS */}

// // //             <span className="whitespace-nowrap px-1 py-4 text-[15px] font-semibold text-gray-400 font-[Urbanist]">
// // //               TA Insights
// // //             </span>

// // //           </div>

// // //           {/* =================================================
// // //               RIGHT FILTERS
// // //           ================================================= */}

// // //           <div className="hidden items-center gap-4 xl:flex font-[Urbanist]">

// // //             {/* DATE */}

// // //             <div className="flex items-center gap-2 font-[Urbanist]">

// // //               <span className="text-sm font-medium text-gray-700 font-[Urbanist]">
// // //                 Date
// // //               </span>

// // //               <div className="relative font-[Urbanist]">

// // //                 <input
// // //                   type="date"
// // //                   value={
// // //                     selectedDate
// // //                   }
// // //                   onChange={(
// // //                     event,
// // //                   ) =>
// // //                     handleDateChange(
// // //                       event.target.value,
// // //                     )
// // //                   }
// // //                   className="h-10 w-[195px] rounded-md border border-black bg-white px-3 pr-9 text-sm text-gray-700 outline-none focus:border-black font-[Urbanist]"
// // //                 />

// // //                 <CalendarDays
// // //                   size={17}
// // //                   className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-[Urbanist]"
// // //                 />

// // //               </div>

// // //             </div>

// // //             {/* EMPLOYEE */}

// // //             <div className="flex items-center gap-2 font-[Urbanist]">

// // //               <span className="text-sm font-medium text-gray-700 font-[Urbanist]">
// // //                 Employee
// // //               </span>

// // //               <div className="relative font-[Urbanist]">

// // //                 <select
// // //                   value={
// // //                     selectedEmployeeId
// // //                   }
// // //                   onChange={(
// // //                     event,
// // //                   ) =>
// // //                     handleEmployeeChange(
// // //                       event.target.value,
// // //                     )
// // //                   }
// // //                   disabled={
// // //                     employeesLoading
// // //                   }
// // //                   className="h-10 w-[220px] appearance-none truncate rounded-md border border-black bg-gray-50 px-3 pr-9 text-sm font-medium text-gray-700 outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-60 font-[Urbanist]"
// // //                 >

// // //                   <option value="">
// // //                     {employeesLoading
// // //                       ? "Loading employees..."
// // //                       : "Select Employee"}
// // //                   </option>

// // //                   {employees.map(
// // //                     (
// // //                       employee,
// // //                     ) => (
// // //                       <option
// // //                         key={
// // //                           employee.employeeId
// // //                         }
// // //                         value={
// // //                           employee.employeeId
// // //                         }
// // //                       >
// // //                         {
// // //                           employee.employeeId
// // //                         }{" "}
// // //                         -{" "}
// // //                         {
// // //                           employee.employeeName
// // //                         }
// // //                       </option>
// // //                     ),
// // //                   )}

// // //                 </select>

// // //                 <ChevronDown
// // //                   size={16}
// // //                   className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-[Urbanist]"
// // //                 />

// // //               </div>

// // //             </div>

// // //             {/* UPDATE */}

// // //             <button
// // //               type="button"
// // //               onClick={
// // //                 handleUpdate
// // //               }
// // //               disabled={
// // //                 isLoading ||
// // //                 !selectedEmployeeId
// // //               }
// // //               className="flex h-10 items-center gap-2 rounded-md bg-[#1597e5] px-5 text-sm font-semibold text-white hover:bg-[#0788d2] disabled:cursor-not-allowed disabled:opacity-60 font-[Urbanist]"
// // //             >
// // //               <Bookmark
// // //                 size={16}
// // //               />

// // //               Update
// // //             </button>

// // //             {/* REFRESH */}

// // //             <button
// // //               type="button"
// // //               onClick={
// // //                 handleRefresh
// // //               }
// // //               disabled={
// // //                 isLoading ||
// // //                 employeesLoading
// // //               }
// // //               className="rounded-full p-2 text-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 font-[Urbanist]"
// // //             >
// // //               <RefreshCw
// // //                 size={20}
// // //                 className={
// // //                   isLoading ||
// // //                   employeesLoading
// // //                     ? "animate-spin"
// // //                     : ""
// // //                 }
// // //               />
// // //             </button>

// // //           </div>

// // //         </div>

// // //       </div>

// // //       {/* ===================================================
// // //           ERROR
// // //       =================================================== */}

// // //       {(employeesError ||
// // //         error ||
// // //         saveError) && (
// // //         <div className="mx-4 mt-3 rounded-lg border border-black bg-red-50 px-4 py-3 text-sm text-red-600 font-[Urbanist]">
// // //           {employeesError ||
// // //             error ||
// // //             saveError}
// // //         </div>
// // //       )}

// // //       {/* ===================================================
// // //           MOBILE FILTERS
// // //       =================================================== */}

// // //       <div className="block border-b border-black bg-white p-3 xl:hidden font-[Urbanist]">

// // //         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 font-[Urbanist]">

// // //           {/* DATE */}

// // //           <div>

// // //             <label className="mb-1 block text-xs font-medium text-gray-600 font-[Urbanist]">
// // //               Date
// // //             </label>

// // //             <div className="relative font-[Urbanist]">

// // //               <input
// // //                 type="date"
// // //                 value={
// // //                   selectedDate
// // //                 }
// // //                 onChange={(
// // //                   event,
// // //                 ) =>
// // //                   handleDateChange(
// // //                     event.target.value,
// // //                   )
// // //                 }
// // //                 className="h-10 w-full rounded-md border border-black bg-white px-3 pr-9 text-sm text-gray-700 outline-none focus:border-black font-[Urbanist]"
// // //               />

// // //               <CalendarDays
// // //                 size={17}
// // //                 className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-[Urbanist]"
// // //               />

// // //             </div>

// // //           </div>

// // //           {/* EMPLOYEE */}

// // //           <div>

// // //             <label className="mb-1 block text-xs font-medium text-gray-600 font-[Urbanist]">
// // //               Employee
// // //             </label>

// // //             <div className="relative font-[Urbanist]">

// // //               <select
// // //                 value={
// // //                   selectedEmployeeId
// // //                 }
// // //                 onChange={(
// // //                   event,
// // //                 ) =>
// // //                   handleEmployeeChange(
// // //                     event.target.value,
// // //                   )
// // //                 }
// // //                 disabled={
// // //                   employeesLoading
// // //                 }
// // //                 className="h-10 w-full appearance-none truncate rounded-md border border-black bg-gray-50 px-3 pr-9 text-sm font-medium text-gray-700 outline-none focus:border-black font-[Urbanist]"
// // //               >

// // //                 <option value="">
// // //                   {employeesLoading
// // //                     ? "Loading employees..."
// // //                     : "Select Employee"}
// // //                 </option>

// // //                 {employees.map(
// // //                   (
// // //                     employee,
// // //                   ) => (
// // //                     <option
// // //                       key={
// // //                         employee.employeeId
// // //                       }
// // //                       value={
// // //                         employee.employeeId
// // //                       }
// // //                     >
// // //                       {
// // //                         employee.employeeId
// // //                       }{" "}
// // //                       -{" "}
// // //                       {
// // //                         employee.employeeName
// // //                       }
// // //                     </option>
// // //                   ),
// // //                 )}

// // //               </select>

// // //               <ChevronDown
// // //                 size={16}
// // //                 className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-[Urbanist]"
// // //               />

// // //             </div>

// // //           </div>

// // //         </div>

// // //         <div className="mt-3 flex justify-end gap-2 font-[Urbanist]">

// // //           <button
// // //             type="button"
// // //             onClick={
// // //               handleRefresh
// // //             }
// // //             className="flex items-center gap-2 rounded-md border border-black bg-white px-4 py-2 text-sm text-gray-700 font-[Urbanist]"
// // //           >
// // //             <RefreshCw
// // //               size={16}
// // //               className={
// // //                 isLoading ||
// // //                 employeesLoading
// // //                   ? "animate-spin"
// // //                   : ""
// // //               }
// // //             />

// // //             Refresh
// // //           </button>

// // //           <button
// // //             type="button"
// // //             onClick={
// // //               handleUpdate
// // //             }
// // //             disabled={
// // //               !selectedEmployeeId
// // //             }
// // //             className="flex items-center gap-2 rounded-md bg-[#1597e5] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50 font-[Urbanist]"
// // //           >
// // //             <Bookmark
// // //               size={16}
// // //             />

// // //             Update
// // //           </button>

// // //         </div>

// // //       </div>

// // //       {/* ===================================================
// // //           MAIN CONTENT
// // //       =================================================== */}

// // //       <div className="p-4 font-[Urbanist]">

// // //         <div className="grid grid-cols-1 gap-4 xl:grid-cols-[36%_64%] font-[Urbanist]">

// // //           {/* =================================================
// // //               LEFT SIDE
// // //           ================================================= */}

// // //           <div className="space-y-3 font-[Urbanist]">

// // //             {/* =================================================
// // //                 EMPLOYEE PROFILE
// // //             ================================================= */}

// // //             <div className="rounded-xl border border-black bg-white font-[Urbanist]">

// // //               {isLoading &&
// // //               !profile ? (

// // //                 <div className="flex min-h-[180px] items-center justify-center text-sm text-gray-400 font-[Urbanist]">
// // //                   Loading employee details...
// // //                 </div>

// // //               ) : profile ? (

// // //                 <div className="p-4 font-[Urbanist]">

// // //                   {/* EMPLOYEE NAME */}

// // //                   <div className="text-center font-[Urbanist]">

// // //                     <h1 className="text-[23px] font-semibold text-[#1597e5] font-[Urbanist]">
// // //                       {
// // //                         profile.employeeName
// // //                       }
// // //                     </h1>

// // //                     <div className="mt-1 inline-block rounded-sm bg-[#ddd4ff] px-2 py-1 text-[15px] font-semibold text-gray-800 font-[Urbanist]">
// // //                       {
// // //                         profile.employeeId
// // //                       }
// // //                     </div>

// // //                   </div>

// // //                   {/* REPORTING AUTHORITY */}

// // //                   <div className="mt-2 flex items-center justify-center gap-2 font-[Urbanist]">

// // //                     <span className="rounded-md border border-black bg-gray-100 px-2 py-1 text-sm font-semibold text-gray-700 font-[Urbanist]">
// // //                       R.A
// // //                     </span>

// // //                     <span className="truncate text-sm font-medium text-gray-600 font-[Urbanist]">
// // //                       {
// // //                         profile.reportingAuthorityName ||
// // //                         "Reporting Authority"
// // //                       }
// // //                     </span>

// // //                   </div>

// // //                   {/* DETAILS */}

// // //                   <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 font-[Urbanist]">

// // //                     {/* POLICY */}

// // //                     <div>

// // //                       <h3 className="border-b border-black pb-2 text-[15px] font-semibold text-[#1597e5] font-[Urbanist]">
// // //                         Policy Details
// // //                       </h3>

// // //                       <div className="mt-2 space-y-1 font-[Urbanist]">

// // //                         <p className="text-sm text-gray-500 font-[Urbanist]">
// // //                           {
// // //                             profile.policyName ||
// // //                             "General Policy"
// // //                           }
// // //                         </p>

// // //                         <p className="text-sm text-gray-500 font-[Urbanist]">
// // //                           {
// // //                             profile.doublePunchPolicy ||
// // //                             "Double Punch"
// // //                           }
// // //                         </p>

// // //                       </div>

// // //                     </div>

// // //                     {/* SHIFT */}

// // //                     <div>

// // //                       <h3 className="border-b border-black pb-2 text-[15px] font-semibold text-[#1597e5] font-[Urbanist]">
// // //                         Shift Details
// // //                       </h3>

// // //                       <div className="mt-2 space-y-1 font-[Urbanist]">

// // //                         <p className="text-sm text-gray-500 font-[Urbanist]">
// // //                           {
// // //                             profile.shiftName ||
// // //                             "General Shift (GS)"
// // //                           }
// // //                         </p>

// // //                         <p className="text-sm text-gray-500 font-[Urbanist]">
// // //                           {
// // //                             profile.shiftTiming ||
// // //                             "10:00 TO 19:00"
// // //                           }
// // //                         </p>

// // //                       </div>

// // //                     </div>

// // //                   </div>

// // //                 </div>

// // //               ) : (

// // //                 <div className="p-6 text-center text-sm text-gray-400 font-[Urbanist]">
// // //                   {employeesLoading
// // //                     ? "Loading employees..."
// // //                     : "Select an employee to view details."}
// // //                 </div>

// // //               )}

// // //             </div>

// // //             {/* =================================================
// // //                 MONTH / WEEK FILTER
// // //             ================================================= */}

// // //             <div className="rounded-xl border border-black bg-white p-3 font-[Urbanist]">

// // //               <p className="mb-3 text-sm font-medium text-gray-700 font-[Urbanist]">
// // //                 Select a month or week to see absences for that period
// // //               </p>

// // //               <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 font-[Urbanist]">

// // //                 {/* PERIOD */}

// // //                 <div className="relative font-[Urbanist]">

// // //                   <select
// // //                     value={
// // //                       periodType
// // //                     }
// // //                     onChange={(
// // //                       event,
// // //                     ) =>
// // //                       setPeriodType(
// // //                         event.target
// // //                           .value as
// // //                           | "Custom Month"
// // //                           | "Custom Week",
// // //                       )
// // //                     }
// // //                     className="h-10 w-full appearance-none rounded-md border border-black bg-white px-3 pr-8 text-sm text-gray-700 outline-none font-[Urbanist]"
// // //                   >

// // //                     <option value="Custom Month">
// // //                       Custom Month
// // //                     </option>

// // //                     <option value="Custom Week">
// // //                       Custom Week
// // //                     </option>

// // //                   </select>

// // //                   <ChevronDown
// // //                     size={16}
// // //                     className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 font-[Urbanist]"
// // //                   />

// // //                 </div>

// // //                 {/* NUMBER */}

// // //                 <input
// // //                   type="number"
// // //                   min="1"
// // //                   value={
// // //                     periodValue
// // //                   }
// // //                   onChange={(
// // //                     event,
// // //                   ) =>
// // //                     setPeriodValue(
// // //                       event.target.value,
// // //                     )
// // //                   }
// // //                   className="h-10 rounded-md border border-black px-3 text-sm outline-none font-[Urbanist]"
// // //                 />

// // //                 {/* LEAVE */}

// // //                 <div className="relative font-[Urbanist]">

// // //                   <select
// // //                     value={
// // //                       leaveFilter
// // //                     }
// // //                     onChange={(
// // //                       event,
// // //                     ) =>
// // //                       setLeaveFilter(
// // //                         event.target.value,
// // //                       )
// // //                     }
// // //                     className="h-10 w-full appearance-none rounded-md border border-black bg-white px-3 pr-8 text-sm text-gray-700 outline-none font-[Urbanist]"
// // //                   >

// // //                     <option value="Select Leave">
// // //                       Select Leave
// // //                     </option>

// // //                     <option value="All Leave">
// // //                       All Leave
// // //                     </option>

// // //                   </select>

// // //                   <ChevronDown
// // //                     size={16}
// // //                     className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 font-[Urbanist]"
// // //                   />

// // //                 </div>

// // //               </div>

// // //             </div>

// // //             {/* =================================================
// // //                 ATTENDANCE TABLE
// // //             ================================================= */}

// // //             <div className="overflow-hidden rounded-xl border border-black bg-white font-[Urbanist]">

// // //               <div className="overflow-x-auto font-[Urbanist]">

// // //                 <table className="w-full min-w-[520px] font-[Urbanist]">

// // //                   <thead>

// // //                     <tr className="bg-[#d4e9f7] font-[Urbanist]">

// // //                       <th className="px-3 py-4 text-left text-sm font-semibold text-gray-800 font-[Urbanist]">
// // //                         Date
// // //                       </th>

// // //                       <th className="px-3 py-4 text-left text-sm font-semibold text-gray-800 font-[Urbanist]">
// // //                         Shift
// // //                       </th>

// // //                       <th className="px-3 py-4 text-left text-sm font-semibold text-gray-800 font-[Urbanist]">
// // //                         First Half
// // //                       </th>

// // //                       <th className="px-3 py-4 text-left text-sm font-semibold text-gray-800 font-[Urbanist]">
// // //                         Second Half
// // //                       </th>

// // //                       <th className="px-3 py-4 text-left text-sm font-semibold text-gray-800 font-[Urbanist]">
// // //                         Day Status
// // //                       </th>

// // //                     </tr>

// // //                   </thead>

// // //                   <tbody>

// // //                     {isLoading ? (

// // //                       <tr>

// // //                         <td
// // //                           colSpan={5}
// // //                           className="px-4 py-8 text-center text-sm text-gray-400 font-[Urbanist]"
// // //                         >
// // //                           Loading attendance...
// // //                         </td>

// // //                       </tr>

// // //                     ) : attendanceSummary.length ===
// // //                       0 ? (

// // //                       <tr>

// // //                         <td
// // //                           colSpan={5}
// // //                           className="px-4 py-8 text-center text-sm text-gray-400 font-[Urbanist]"
// // //                         >
// // //                           No attendance data found.
// // //                         </td>

// // //                       </tr>

// // //                     ) : (

// // //                       attendanceSummary.map(
// // //                         (
// // //                           row,
// // //                           index,
// // //                         ) => (

// // //                           <tr
// // //                             key={`${row.date}-${index}`}
// // //                             className="border-t border-black bg-white font-[Urbanist]"
// // //                           >

// // //                             <td className="px-3 py-4 text-sm text-gray-700 font-[Urbanist]">
// // //                               {
// // //                                 formatDisplayDate(
// // //                                   row.date,
// // //                                 )
// // //                               }
// // //                             </td>

// // //                             <td className="px-3 py-4 text-sm text-gray-700 font-[Urbanist]">
// // //                               {
// // //                                 row.shift
// // //                               }
// // //                             </td>

// // //                             <td className="px-3 py-4 font-[Urbanist]">

// // //                               <span className="inline-flex rounded-md border border-black bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600 font-[Urbanist]">
// // //                                 {
// // //                                   row.firstHalf
// // //                                 }
// // //                               </span>

// // //                             </td>

// // //                             <td className="px-3 py-4 font-[Urbanist]">

// // //                               <span className="inline-flex rounded-md border border-black bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600 font-[Urbanist]">
// // //                                 {
// // //                                   row.secondHalf
// // //                                 }
// // //                               </span>

// // //                             </td>

// // //                             <td className="px-3 py-4 font-[Urbanist]">

// // //                               <span className="inline-flex rounded-md border border-black bg-green-50 px-2 py-1 text-xs font-semibold text-green-600 font-[Urbanist]">
// // //                                 {
// // //                                   row.dayStatus
// // //                                 }
// // //                               </span>

// // //                             </td>

// // //                           </tr>

// // //                         ),
// // //                       )

// // //                     )}

// // //                   </tbody>

// // //                 </table>

// // //               </div>

// // //             </div>

// // //           </div>

// // //           {/* =================================================
// // //               RIGHT SIDE - PUNCH RECORDS
// // //           ================================================= */}

// // //           <div className="rounded-xl border border-black bg-white font-[Urbanist]">

// // //             {/* HEADER */}

// // //             <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-xl bg-[#d3e8f5] px-4 py-3 font-[Urbanist]">

// // //               <div>

// // //                 <h2 className="text-base font-semibold text-gray-800 font-[Urbanist]">
// // //                   Punch Records
// // //                 </h2>

// // //                 <p className="text-xs text-gray-500 font-[Urbanist]">
// // //                   Review, correct and add punch times
// // //                 </p>

// // //               </div>

// // //               <div className="flex flex-wrap items-center gap-2 font-[Urbanist]">

// // //                 <button
// // //                   type="button"
// // //                   className="rounded-full bg-[#b8d9e9] px-4 py-2 text-sm font-semibold text-[#1597e5] font-[Urbanist]"
// // //                 >
// // //                   Show All
// // //                 </button>

// // //                 <button
// // //                   type="button"
// // //                   className="flex items-center gap-2 rounded-md bg-[#1597e5] px-4 py-2 text-sm font-semibold text-white font-[Urbanist]"
// // //                 >
// // //                   <Plus
// // //                     size={16}
// // //                   />

// // //                   Permission
// // //                 </button>

// // //                 <button
// // //                   type="button"
// // //                   className="flex items-center gap-2 rounded-md bg-[#1597e5] px-4 py-2 text-sm font-semibold text-white font-[Urbanist]"
// // //                 >
// // //                   <Plus
// // //                     size={16}
// // //                   />

// // //                   Punch
// // //                 </button>

// // //               </div>

// // //             </div>

// // //             {/* PUNCH CARDS */}

// // //             <div className="p-4 font-[Urbanist]">

// // //               {isLoading ? (

// // //                 <div className="rounded-xl border border-black bg-white p-12 text-center text-sm text-gray-400 font-[Urbanist]">
// // //                   Loading punch records...
// // //                 </div>

// // //               ) : punchRecords.length ===
// // //                 0 ? (

// // //                 <div className="rounded-xl border border-black bg-white p-12 text-center text-sm text-gray-400 font-[Urbanist]">
// // //                   No punch records found.
// // //                 </div>

// // //               ) : (

// // //                 <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 font-[Urbanist]">

// // //                   {punchRecords.map(
// // //                     (record) => {

// // //                       const edit =
// // //                         edits[
// // //                           String(
// // //                             record.punchId,
// // //                           )
// // //                         ];

// // //                       return (

// // //                         <div
// // //                           key={
// // //                             record.punchId
// // //                           }
// // //                           className="min-w-0 font-[Urbanist]"
// // //                         >

// // //                           <PunchRecordCard
// // //                             record={
// // //                               record
// // //                             }

// // //                             correctedTime={
// // //                               edit?.correctedTime ??
// // //                               record.correctedTime ??
// // //                               record.originalTime ??
// // //                               ""
// // //                             }

// // //                             remarks={
// // //                               edit?.remarks ??
// // //                               record.remarks ??
// // //                               ""
// // //                             }

// // //                             isSaving={
// // //                               savingId ===
// // //                               record.punchId
// // //                             }

// // //                             onCorrectedTimeChange={(
// // //                               value,
// // //                             ) =>
// // //                               updateField(
// // //                                 record.punchId,
// // //                                 "correctedTime",
// // //                                 value,
// // //                               )
// // //                             }

// // //                             onRemarksChange={(
// // //                               value,
// // //                             ) =>
// // //                               updateField(
// // //                                 record.punchId,
// // //                                 "remarks",
// // //                                 value,
// // //                               )
// // //                             }

// // //                             onSave={() =>
// // //                               handleSave(
// // //                                 record.punchId,
// // //                               )
// // //                             }
// // //                           />

// // //                         </div>

// // //                       );
// // //                     },
// // //                   )}

// // //                 </div>

// // //               )}

// // //             </div>

// // //           </div>

// // //         </div>

// // //       </div>

// // //     </div>
// // //   );
// // // }

// // import {
// //   useEffect,
// //   useState,
// // } from "react";

// // import {
// //   NavLink,
// //   useLocation,
// //   useNavigate,
// // } from "react-router-dom";

// // import {
// //   CalendarDays,
// //   RefreshCw,
// //   ChevronDown,
// //   Plus,
// //   Bookmark,
// // } from "lucide-react";

// // import EmployeeProfileCard from "../components/EmployeeProfileCard";
// // import PunchRecordCard from "../components/PunchRecordCard";

// // import {
// //   useReportingEmployees,
// // } from "../hooks/useReportingEmployees";

// // import {
// //   usePunchDashboard,
// // } from "../hooks/usePunchDashboard";

// // import {
// //   usePunchEditor,
// // } from "../hooks/usePunchEditor";

// // import type {
// //   PunchPageProps,
// //   PunchNavigationState,
// //   ViewType,
// // } from "../types/punch.types";


// // /* =========================================================
// //    GET TODAY
// // ========================================================= */

// // function getToday(): string {
// //   const date =
// //     new Date();

// //   const year =
// //     date.getFullYear();

// //   const month =
// //     String(
// //       date.getMonth() + 1,
// //     ).padStart(2, "0");

// //   const day =
// //     String(
// //       date.getDate(),
// //     ).padStart(2, "0");

// //   return `${year}-${month}-${day}`;
// // }


// // /* =========================================================
// //    FORMAT DATE
// // ========================================================= */

// // function formatDisplayDate(
// //   value?: string | null,
// // ): string {

// //   if (!value) {
// //     return "";
// //   }


// //   const date =
// //     new Date(value);


// //   if (
// //     Number.isNaN(
// //       date.getTime(),
// //     )
// //   ) {
// //     return value;
// //   }


// //   const day =
// //     String(
// //       date.getDate(),
// //     ).padStart(2, "0");


// //   const month =
// //     date.toLocaleString(
// //       "en-US",
// //       {
// //         month: "short",
// //       },
// //     );


// //   const year =
// //     date.getFullYear();


// //   return `${day}/${month}/${year}`;
// // }


// // /* =========================================================
// //    PUNCH PAGE
// // ========================================================= */

// // export default function PunchPage({
// //   employeeId: propEmployeeId,
// // }: PunchPageProps) {

// //   const navigate =
// //     useNavigate();

// //   const location =
// //     useLocation();


// //   /* =======================================================
// //      NAVIGATION STATE
// //   ======================================================= */

// //   const navigationState =
// //     location.state as
// //       | PunchNavigationState
// //       | null;


// //   /* =======================================================
// //      DATE
// //   ======================================================= */

// //   const today =
// //     getToday();


// //   const [
// //     selectedDate,
// //     setSelectedDate,
// //   ] = useState<string>(
// //     navigationState?.selectedDate ||
// //       today,
// //   );


// //   /* =======================================================
// //      EMPLOYEE INTERNAL ID
// //   ======================================================= */

// //  const [
// //   selectedEmployeeId,
// //   setSelectedEmployeeId,
// // ] = useState<string>("");


// //   /* =======================================================
// //      VIEW TYPE
// //   ======================================================= */

// //   const viewType: ViewType =
// //     "SingleDate";


// //   /* =======================================================
// //      MONTH / WEEK FILTERS
// //   ======================================================= */

// //   const [
// //     periodType,
// //     setPeriodType,
// //   ] = useState<
// //     "Custom Month" |
// //     "Custom Week"
// //   >(
// //     "Custom Month",
// //   );


// //   const [
// //     periodValue,
// //     setPeriodValue,
// //   ] = useState("1");


// //   const [
// //     leaveFilter,
// //     setLeaveFilter,
// //   ] = useState(
// //     "Select Leave",
// //   );


// //   /* =======================================================
// //      REPORTING EMPLOYEES
// //   ======================================================= */

// //   const {
// //     employees,
// //     isLoading:
// //       employeesLoading,
// //     error:
// //       employeesError,
// //     refetch:
// //       refetchEmployees,
// //   } = useReportingEmployees();


// //   /* =======================================================
// //      RESTORE EMPLOYEE FROM LOCAL STORAGE
// //   ======================================================= */

// //   useEffect(() => {

// //     if (
// //       selectedEmployeeId
// //     ) {
// //       return;
// //     }


// //     const storedInternalId =
// //       localStorage.getItem(
// //         "punchEmployeeInternalId",
// //       );


// //     if (
// //       storedInternalId
// //     ) {
// //       setSelectedEmployeeId(
// //         storedInternalId,
// //       );
// //     }

// //   }, [
// //     selectedEmployeeId,
// //   ]);


// //   /* =======================================================
// //      SELECT FIRST VALID EMPLOYEE
// // ========================================================= */

// //   /* =======================================================
// //    RESOLVE EMPLOYEE INTERNAL ID
// // ======================================================= */

// // useEffect(() => {

// //   if (
// //     employees.length === 0
// //   ) {
// //     return;
// //   }


// //   /*
// //    * If we already have a valid EmployeeInternalID,
// //    * don't change it.
// //    */

// //   if (
// //     selectedEmployeeId &&
// //     employees.some(
// //       (employee) => {

// //         const internalId =
// //           employee.employeeInternalId ??
// //           employee.EmployeeInternalID;

// //         return (
// //           String(
// //             internalId ?? "",
// //           ) ===
// //           String(
// //             selectedEmployeeId,
// //           )
// //         );
// //       },
// //     )
// //   ) {

// //     return;
// //   }


// //   /*
// //    * First try the employee ID coming from
// //    * route/navigation.
// //    *
// //    * Your current URL has:
// //    *
// //    * employeeId=294697
// //    *
// //    * We check whether that corresponds to
// //    * EmployeeID / EmployeeCode / internal ID.
// //    */

// //   const incomingId =
// //     navigationState?.employeeId ||
// //     propEmployeeId ||
// //     "";


// //   if (
// //     incomingId
// //   ) {

// //     const matchedEmployee =
// //       employees.find(
// //         (employee) => {

// //           const internalId =
// //             employee.employeeInternalId ??
// //             employee.EmployeeInternalID;

// //           const employeeCode =
// //             employee.employeeCode ??
// //             employee.EmployeeCode;

// //           const employeeId =
// //             employee.employeeId ??
// //             employee.EmployeeID;


// //           return (

// //             String(
// //               internalId ?? "",
// //             ) ===
// //             String(
// //               incomingId,
// //             )

// //             ||

// //             String(
// //               employeeCode ?? "",
// //             ) ===
// //             String(
// //               incomingId,
// //             )

// //             ||

// //             String(
// //               employeeId ?? "",
// //             ) ===
// //             String(
// //               incomingId,
// //             )

// //           );
// //         },
// //       );


// //     if (
// //       matchedEmployee
// //     ) {

// //       const internalId =
// //         matchedEmployee.employeeInternalId ??
// //         matchedEmployee.EmployeeInternalID;


// //       if (
// //         internalId !==
// //           null &&
// //         internalId !==
// //           undefined
// //       ) {

// //         console.log(
// //           "[Punch] Route employee resolved:",
// //           {
// //             incomingId,
// //             employeeInternalId:
// //               internalId,
// //             employeeCode:
// //               matchedEmployee.employeeCode ??
// //               matchedEmployee.EmployeeCode,
// //             employeeName:
// //               matchedEmployee.employeeName ??
// //               matchedEmployee.EmployeeName,
// //           },
// //         );


// //         setSelectedEmployeeId(
// //           String(
// //             internalId,
// //           ),
// //         );


// //         return;
// //       }
// //     }
// //   }


// //   /*
// //    * If route employee cannot be matched,
// //    * select the first employee that has
// //    * EmployeeInternalID.
// //    */

// //   const firstValidEmployee =
// //     employees.find(
// //       (employee) => {

// //         const internalId =
// //           employee.employeeInternalId ??
// //           employee.EmployeeInternalID;

// //         return (
// //           internalId !==
// //             null &&
// //           internalId !==
// //             undefined &&
// //           String(
// //             internalId,
// //           ).trim() !== ""
// //         );
// //       },
// //     );


// //   if (
// //     firstValidEmployee
// //   ) {

// //     const internalId =
// //       firstValidEmployee.employeeInternalId ??
// //       firstValidEmployee.EmployeeInternalID;


// //     console.log(
// //       "[Punch] Selecting first employee:",
// //       {
// //         employeeInternalId:
// //           internalId,
// //         employeeCode:
// //           firstValidEmployee.employeeCode ??
// //           firstValidEmployee.EmployeeCode,
// //         employeeName:
// //           firstValidEmployee.employeeName ??
// //           firstValidEmployee.EmployeeName,
// //       },
// //     );


// //     setSelectedEmployeeId(
// //       String(
// //         internalId,
// //       ),
// //     );
// //   }

// // }, [
// //   employees,
// //   selectedEmployeeId,
// //   navigationState?.employeeId,
// //   propEmployeeId,
// // ]);


// //   /* =======================================================
// //      SAVE INTERNAL EMPLOYEE ID
// //   ======================================================= */

// //   useEffect(() => {

// //     if (
// //       !selectedEmployeeId
// //     ) {
// //       return;
// //     }


// //     /*
// //      * Store ONLY the internal ID here.
// //      */

// //     localStorage.setItem(
// //       "punchEmployeeInternalId",
// //       selectedEmployeeId,
// //     );


// //     /*
// //      * Do not overwrite employeeId / EmployeeID
// //      * with the employee code.
// //      */

// //   }, [
// //     selectedEmployeeId,
// //   ]);


// //   /* =======================================================
// //      PUNCH DASHBOARD
// //   ======================================================= */

// //   const {
// //     data,
// //     isLoading,
// //     error,
// //     refetch,
// //   } = usePunchDashboard({
// //     employeeId:
// //       selectedEmployeeId,

// //     selectedDate,

// //     viewType,
// //   });


// //   /* =======================================================
// //      PUNCH EDITOR
// //   ======================================================= */

// //   const {
// //     edits,
// //     savingId,
// //     saveError,
// //     updateField,
// //     saveRecord,
// //   } = usePunchEditor(
// //     data?.punchRecords ??
// //       [],
// //   );


// //   /* =======================================================
// //      DATA
// //   ======================================================= */

// //   const profile =
// //     data?.employeeProfile?.[0] ??
// //     null;


// //   const attendanceSummary =
// //     data?.attendanceSummary ??
// //     [];


// //   const punchRecords =
// //     data?.punchRecords ??
// //     [];


// //   /* =======================================================
// //      SELECTED EMPLOYEE
// // ========================================================= */

// //   const selectedEmployee =
// //     employees.find(
// //       (employee) => {

// //         const internalId =
// //           employee.employeeInternalId ??
// //           employee.EmployeeInternalID;

// //         return (
// //           String(
// //             internalId ?? "",
// //           ) ===
// //           selectedEmployeeId
// //         );
// //       },
// //     );


// //   /* =======================================================
// //      EMPLOYEE CHANGE
// //   ======================================================= */

// //   const handleEmployeeChange = (
// //     value: string,
// //   ) => {

// //     /*
// //      * VALUE IS EmployeeInternalID.
// //      */

// //     setSelectedEmployeeId(
// //       value,
// //     );


// //     navigate(
// //       {
// //         pathname:
// //           location.pathname,

// //         search:
// //           `?employeeId=${encodeURIComponent(
// //             value,
// //           )}&date=${encodeURIComponent(
// //             selectedDate,
// //           )}`,
// //       },
// //       {
// //         replace: true,
// //       },
// //     );
// //   };


// //   /* =======================================================
// //      DATE CHANGE
// //   ======================================================= */

// //   const handleDateChange = (
// //     value: string,
// //   ) => {

// //     setSelectedDate(
// //       value,
// //     );


// //     navigate(
// //       {
// //         pathname:
// //           location.pathname,

// //         search:
// //           `?employeeId=${encodeURIComponent(
// //             selectedEmployeeId,
// //           )}&date=${encodeURIComponent(
// //             value,
// //           )}`,
// //       },
// //       {
// //         replace: true,
// //       },
// //     );
// //   };


// //   /* =======================================================
// //      SAVE
// //   ======================================================= */

// //   const handleSave = async (
// //     punchId:
// //       string | number,
// //   ) => {

// //     await saveRecord(
// //       punchId,
// //     );


// //     await refetch();
// //   };


// //   /* =======================================================
// //      REFRESH
// //   ======================================================= */

// //   const handleRefresh = () => {

// //     void refetchEmployees();


// //     if (
// //       selectedEmployeeId
// //     ) {
// //       void refetch();
// //     }
// //   };


// //   /* =======================================================
// //      UPDATE
// //   ======================================================= */

// //   const handleUpdate = () => {

// //     if (
// //       selectedEmployeeId
// //     ) {
// //       void refetch();
// //     }
// //   };


// //   /* =======================================================
// //      EMPLOYEE OPTION
// //   ======================================================= */

// //   const renderEmployeeOptions = () => {

// //     return employees.map(
// //       (
// //         employee,
// //       ) => {

// //         const internalId =
// //           employee.employeeInternalId ??
// //           employee.EmployeeInternalID;


// //         const employeeCode =
// //           employee.employeeCode ??
// //           employee.EmployeeCode ??
// //           employee.employeeId ??
// //           employee.EmployeeID ??
// //           "";


// //         const employeeName =
// //           employee.employeeName ??
// //           employee.EmployeeName ??
// //           "";


// //         /*
// //          * Do not create an invalid option.
// //          */

// //         if (
// //           internalId ===
// //             null ||
// //           internalId ===
// //             undefined ||
// //           String(
// //             internalId,
// //           ).trim() === ""
// //         ) {
// //           return null;
// //         }


// //         return (
// //           <option
// //             key={String(
// //               internalId,
// //             )}
// //             value={String(
// //               internalId,
// //             )}
// //           >
// //             {String(
// //               employeeCode,
// //             )}{" "}
// //             -{" "}
// //             {String(
// //               employeeName,
// //             )}
// //           </option>
// //         );
// //       },
// //     );
// //   };


// //   /* =======================================================
// //      RENDER
// //   ======================================================= */

// //   return (
// //     <div className="min-h-screen bg-[#f4f5f9] font-[Urbanist]">

// //       {/* ===================================================
// //           TOP NAVIGATION
// //       =================================================== */}

// //       <div className="border-b border-black bg-white font-[Urbanist]">

// //         <div className="flex items-center justify-between gap-4 px-4 py-2 font-[Urbanist]">

// //           {/* TABS */}

// //           <div className="flex min-w-0 items-center gap-8 overflow-x-auto font-[Urbanist]">

// //             <NavLink
// //               to="../Punch"
// //               className={({
// //                 isActive,
// //               }) =>
// //                 `whitespace-nowrap border-b-2 px-1 py-4 text-[15px] font-semibold ${
// //                   isActive
// //                     ? "border-[#1997e8] text-[#1997e8]"
// //                     : "border-transparent text-gray-600"
// //                 }`
// //               }
// //             >
// //               Punch
// //             </NavLink>


// //             <NavLink
// //               to="../MissedPunch"
// //               className={({
// //                 isActive,
// //               }) =>
// //                 `whitespace-nowrap border-b-2 px-1 py-4 text-[15px] font-semibold ${
// //                   isActive
// //                     ? "border-[#1997e8] text-[#1997e8]"
// //                     : "border-transparent text-gray-600"
// //                 }`
// //               }
// //             >
// //               Missed Punch
// //             </NavLink>


// //             <span className="whitespace-nowrap px-1 py-4 text-[15px] font-semibold text-gray-400 font-[Urbanist]">
// //               Attendance
// //             </span>


// //             <span className="whitespace-nowrap px-1 py-4 text-[15px] font-semibold text-gray-400 font-[Urbanist]">
// //               TA Insights
// //             </span>

// //           </div>


// //           {/* DESKTOP FILTERS */}

// //           <div className="hidden items-center gap-4 xl:flex font-[Urbanist]">

// //             {/* DATE */}

// //             <div className="flex items-center gap-2 font-[Urbanist]">

// //               <span className="text-sm font-medium text-gray-700 font-[Urbanist]">
// //                 Date
// //               </span>


// //               <div className="relative font-[Urbanist]">

// //                 <input
// //                   type="date"
// //                   value={
// //                     selectedDate
// //                   }
// //                   onChange={(
// //                     event,
// //                   ) =>
// //                     handleDateChange(
// //                       event.target
// //                         .value,
// //                     )
// //                   }
// //                   className="h-10 w-[195px] rounded-md border border-black bg-white px-3 pr-9 text-sm text-gray-700 outline-none focus:border-black font-[Urbanist]"
// //                 />


// //                 <CalendarDays
// //                   size={17}
// //                   className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-[Urbanist]"
// //                 />

// //               </div>

// //             </div>


// //             {/* EMPLOYEE */}

// //             <div className="flex items-center gap-2 font-[Urbanist]">

// //               <span className="text-sm font-medium text-gray-700 font-[Urbanist]">
// //                 Employee
// //               </span>


// //               <div className="relative font-[Urbanist]">

// //                 <select
// //                   value={
// //                     selectedEmployeeId
// //                   }
// //                   onChange={(
// //                     event,
// //                   ) =>
// //                     handleEmployeeChange(
// //                       event.target
// //                         .value,
// //                     )
// //                   }
// //                   disabled={
// //                     employeesLoading
// //                   }
// //                   className="h-10 w-[220px] appearance-none truncate rounded-md border border-black bg-gray-50 px-3 pr-9 text-sm font-medium text-gray-700 outline-none focus:border-black disabled:cursor-not-allowed disabled:opacity-60 font-[Urbanist]"
// //                 >

// //                   <option value="">
// //                     {employeesLoading
// //                       ? "Loading employees..."
// //                       : "Select Employee"}
// //                   </option>


// //                   {renderEmployeeOptions()}

// //                 </select>


// //                 <ChevronDown
// //                   size={16}
// //                   className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-[Urbanist]"
// //                 />

// //               </div>

// //             </div>


// //             {/* UPDATE */}

// //             <button
// //               type="button"
// //               onClick={
// //                 handleUpdate
// //               }
// //               disabled={
// //                 isLoading ||
// //                 !selectedEmployeeId
// //               }
// //               className="flex h-10 items-center gap-2 rounded-md bg-[#1597e5] px-5 text-sm font-semibold text-white hover:bg-[#0788d2] disabled:cursor-not-allowed disabled:opacity-60 font-[Urbanist]"
// //             >

// //               <Bookmark
// //                 size={16}
// //               />

// //               Update

// //             </button>


// //             {/* REFRESH */}

// //             <button
// //               type="button"
// //               onClick={
// //                 handleRefresh
// //               }
// //               disabled={
// //                 isLoading ||
// //                 employeesLoading
// //               }
// //               className="rounded-full p-2 text-gray-400 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 font-[Urbanist]"
// //             >

// //               <RefreshCw
// //                 size={20}
// //                 className={
// //                   isLoading ||
// //                   employeesLoading
// //                     ? "animate-spin"
// //                     : ""
// //                 }
// //               />

// //             </button>

// //           </div>

// //         </div>

// //       </div>


// //       {/* ===================================================
// //           ERROR
// //       =================================================== */}

// //       {(employeesError ||
// //         error ||
// //         saveError) && (

// //         <div className="mx-4 mt-3 rounded-lg border border-black bg-red-50 px-4 py-3 text-sm text-red-600 font-[Urbanist]">

// //           {employeesError ||
// //             error ||
// //             saveError}

// //         </div>

// //       )}


// //       {/* ===================================================
// //           MOBILE FILTERS
// //       =================================================== */}

// //       <div className="block border-b border-black bg-white p-3 xl:hidden font-[Urbanist]">

// //         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 font-[Urbanist]">

// //           {/* DATE */}

// //           <div>

// //             <label className="mb-1 block text-xs font-medium text-gray-600 font-[Urbanist]">
// //               Date
// //             </label>


// //             <div className="relative font-[Urbanist]">

// //               <input
// //                 type="date"
// //                 value={
// //                   selectedDate
// //                 }
// //                 onChange={(
// //                   event,
// //                 ) =>
// //                   handleDateChange(
// //                     event.target
// //                       .value,
// //                   )
// //                 }
// //                 className="h-10 w-full rounded-md border border-black bg-white px-3 pr-9 text-sm text-gray-700 outline-none focus:border-black font-[Urbanist]"
// //               />


// //               <CalendarDays
// //                 size={17}
// //                 className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-[Urbanist]"
// //               />

// //             </div>

// //           </div>


// //           {/* EMPLOYEE */}

// //           <div>

// //             <label className="mb-1 block text-xs font-medium text-gray-600 font-[Urbanist]">
// //               Employee
// //             </label>


// //             <div className="relative font-[Urbanist]">

// //               <select
// //                 value={
// //                   selectedEmployeeId
// //                 }
// //                 onChange={(
// //                   event,
// //                 ) =>
// //                   handleEmployeeChange(
// //                     event.target
// //                       .value,
// //                   )
// //                 }
// //                 disabled={
// //                   employeesLoading
// //                 }
// //                 className="h-10 w-full appearance-none truncate rounded-md border border-black bg-gray-50 px-3 pr-9 text-sm font-medium text-gray-700 outline-none focus:border-black font-[Urbanist]"
// //               >

// //                 <option value="">
// //                   {employeesLoading
// //                     ? "Loading employees..."
// //                     : "Select Employee"}
// //                 </option>


// //                 {renderEmployeeOptions()}

// //               </select>


// //               <ChevronDown
// //                 size={16}
// //                 className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-[Urbanist]"
// //               />

// //             </div>

// //           </div>

// //         </div>


// //         <div className="mt-3 flex justify-end gap-2 font-[Urbanist]">

// //           <button
// //             type="button"
// //             onClick={
// //               handleRefresh
// //             }
// //             className="flex items-center gap-2 rounded-md border border-black bg-white px-4 py-2 text-sm text-gray-700 font-[Urbanist]"
// //           >

// //             <RefreshCw
// //               size={16}
// //               className={
// //                 isLoading ||
// //                 employeesLoading
// //                   ? "animate-spin"
// //                   : ""
// //               }
// //             />

// //             Refresh

// //           </button>


// //           <button
// //             type="button"
// //             onClick={
// //               handleUpdate
// //             }
// //             disabled={
// //               !selectedEmployeeId
// //             }
// //             className="flex items-center gap-2 rounded-md bg-[#1597e5] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50 font-[Urbanist]"
// //           >

// //             <Bookmark
// //               size={16}
// //             />

// //             Update

// //           </button>

// //         </div>

// //       </div>


// //       {/* ===================================================
// //           MAIN CONTENT
// //       =================================================== */}

// //       <div className="p-4 font-[Urbanist]">

// //         <div className="grid grid-cols-1 gap-4 xl:grid-cols-[36%_64%] font-[Urbanist]">

// //           {/* =================================================
// //               LEFT SIDE
// //           ================================================= */}

// //           <div className="space-y-3 font-[Urbanist]">

// //             {/* EMPLOYEE PROFILE */}

// //             <div className="rounded-xl border border-black bg-white font-[Urbanist]">

// //               {isLoading &&
// //               !profile ? (

// //                 <div className="flex min-h-[180px] items-center justify-center text-sm text-gray-400 font-[Urbanist]">
// //                   Loading employee details...
// //                 </div>

// //               ) : profile ? (

// //                 <div className="p-4 font-[Urbanist]">

// //                   <div className="text-center font-[Urbanist]">

// //                     <h1 className="text-[23px] font-semibold text-[#1597e5] font-[Urbanist]">
// //                       {
// //                         profile.employeeName
// //                       }
// //                     </h1>


// //                     <div className="mt-1 inline-block rounded-sm bg-[#ddd4ff] px-2 py-1 text-[15px] font-semibold text-gray-800 font-[Urbanist]">
// //                       {
// //                         profile.employeeId
// //                       }
// //                     </div>

// //                   </div>


// //                   <div className="mt-2 flex items-center justify-center gap-2 font-[Urbanist]">

// //                     <span className="rounded-md border border-black bg-gray-100 px-2 py-1 text-sm font-semibold text-gray-700 font-[Urbanist]">
// //                       R.A
// //                     </span>


// //                     <span className="truncate text-sm font-medium text-gray-600 font-[Urbanist]">
// //                       {
// //                         profile.reportingAuthorityName ||
// //                         "Reporting Authority"
// //                       }
// //                     </span>

// //                   </div>


// //                   <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 font-[Urbanist]">

// //                     <div>

// //                       <h3 className="border-b border-black pb-2 text-[15px] font-semibold text-[#1597e5] font-[Urbanist]">
// //                         Policy Details
// //                       </h3>


// //                       <div className="mt-2 space-y-1 font-[Urbanist]">

// //                         <p className="text-sm text-gray-500 font-[Urbanist]">
// //                           {
// //                             profile.policyName ||
// //                             "General Policy"
// //                           }
// //                         </p>


// //                         <p className="text-sm text-gray-500 font-[Urbanist]">
// //                           {
// //                             profile.doublePunchPolicy ||
// //                             "Double Punch"
// //                           }
// //                         </p>

// //                       </div>

// //                     </div>


// //                     <div>

// //                       <h3 className="border-b border-black pb-2 text-[15px] font-semibold text-[#1597e5] font-[Urbanist]">
// //                         Shift Details
// //                       </h3>


// //                       <div className="mt-2 space-y-1 font-[Urbanist]">

// //                         <p className="text-sm text-gray-500 font-[Urbanist]">
// //                           {
// //                             profile.shiftName ||
// //                             "General Shift (GS)"
// //                           }
// //                         </p>


// //                         <p className="text-sm text-gray-500 font-[Urbanist]">
// //                           {
// //                             profile.shiftTiming ||
// //                             "10:00 TO 19:00"
// //                           }
// //                         </p>

// //                       </div>

// //                     </div>

// //                   </div>

// //                 </div>

// //               ) : (

// //                 <div className="p-6 text-center text-sm text-gray-400 font-[Urbanist]">

// //                   {employeesLoading
// //                     ? "Loading employees..."
// //                     : selectedEmployee
// //                       ? "Loading employee details..."
// //                       : "Select an employee to view details."}

// //                 </div>

// //               )}

// //             </div>


// //             {/* =================================================
// //                 MONTH / WEEK FILTER
// //             ================================================= */}

// //             <div className="rounded-xl border border-black bg-white p-3 font-[Urbanist]">

// //               <p className="mb-3 text-sm font-medium text-gray-700 font-[Urbanist]">
// //                 Select a month or week to see absences for that period
// //               </p>


// //               <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 font-[Urbanist]">

// //                 <div className="relative font-[Urbanist]">

// //                   <select
// //                     value={
// //                       periodType
// //                     }
// //                     onChange={(
// //                       event,
// //                     ) =>
// //                       setPeriodType(
// //                         event.target
// //                           .value as
// //                           | "Custom Month"
// //                           | "Custom Week",
// //                       )
// //                     }
// //                     className="h-10 w-full appearance-none rounded-md border border-black bg-white px-3 pr-8 text-sm text-gray-700 outline-none font-[Urbanist]"
// //                   >

// //                     <option value="Custom Month">
// //                       Custom Month
// //                     </option>

// //                     <option value="Custom Week">
// //                       Custom Week
// //                     </option>

// //                   </select>


// //                   <ChevronDown
// //                     size={16}
// //                     className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 font-[Urbanist]"
// //                   />

// //                 </div>


// //                 <input
// //                   type="number"
// //                   min="1"
// //                   value={
// //                     periodValue
// //                   }
// //                   onChange={(
// //                     event,
// //                   ) =>
// //                     setPeriodValue(
// //                       event.target
// //                         .value,
// //                     )
// //                   }
// //                   className="h-10 rounded-md border border-black px-3 text-sm outline-none font-[Urbanist]"
// //                 />


// //                 <div className="relative font-[Urbanist]">

// //                   <select
// //                     value={
// //                       leaveFilter
// //                     }
// //                     onChange={(
// //                       event,
// //                     ) =>
// //                       setLeaveFilter(
// //                         event.target
// //                           .value,
// //                       )
// //                     }
// //                     className="h-10 w-full appearance-none rounded-md border border-black bg-white px-3 pr-8 text-sm text-gray-700 outline-none font-[Urbanist]"
// //                   >

// //                     <option value="Select Leave">
// //                       Select Leave
// //                     </option>

// //                     <option value="All Leave">
// //                       All Leave
// //                     </option>

// //                   </select>


// //                   <ChevronDown
// //                     size={16}
// //                     className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 font-[Urbanist]"
// //                   />

// //                 </div>

// //               </div>

// //             </div>


// //             {/* =================================================
// //                 ATTENDANCE TABLE
// //             ================================================= */}

// //             <div className="overflow-hidden rounded-xl border border-black bg-white font-[Urbanist]">

// //               <div className="overflow-x-auto font-[Urbanist]">

// //                 <table className="w-full min-w-[520px] font-[Urbanist]">

// //                   <thead>

// //                     <tr className="bg-[#d4e9f7] font-[Urbanist]">

// //                       <th className="px-3 py-4 text-left text-sm font-semibold text-gray-800 font-[Urbanist]">
// //                         Date
// //                       </th>

// //                       <th className="px-3 py-4 text-left text-sm font-semibold text-gray-800 font-[Urbanist]">
// //                         Shift
// //                       </th>

// //                       <th className="px-3 py-4 text-left text-sm font-semibold text-gray-800 font-[Urbanist]">
// //                         First Half
// //                       </th>

// //                       <th className="px-3 py-4 text-left text-sm font-semibold text-gray-800 font-[Urbanist]">
// //                         Second Half
// //                       </th>

// //                       <th className="px-3 py-4 text-left text-sm font-semibold text-gray-800 font-[Urbanist]">
// //                         Day Status
// //                       </th>

// //                     </tr>

// //                   </thead>


// //                   <tbody>

// //                     {isLoading ? (

// //                       <tr>

// //                         <td
// //                           colSpan={5}
// //                           className="px-4 py-8 text-center text-sm text-gray-400 font-[Urbanist]"
// //                         >
// //                           Loading attendance...
// //                         </td>

// //                       </tr>

// //                     ) : attendanceSummary.length ===
// //                       0 ? (

// //                       <tr>

// //                         <td
// //                           colSpan={5}
// //                           className="px-4 py-8 text-center text-sm text-gray-400 font-[Urbanist]"
// //                         >
// //                           No attendance data found.
// //                         </td>

// //                       </tr>

// //                     ) : (

// //                       attendanceSummary.map(
// //                         (
// //                           row,
// //                           index,
// //                         ) => (

// //                           <tr
// //                             key={`${row.date}-${index}`}
// //                             className="border-t border-black bg-white font-[Urbanist]"
// //                           >

// //                             <td className="px-3 py-4 text-sm text-gray-700 font-[Urbanist]">
// //                               {
// //                                 formatDisplayDate(
// //                                   row.date,
// //                                 )
// //                               }
// //                             </td>


// //                             <td className="px-3 py-4 text-sm text-gray-700 font-[Urbanist]">
// //                               {
// //                                 row.shift
// //                               }
// //                             </td>


// //                             <td className="px-3 py-4 font-[Urbanist]">

// //                               <span className="inline-flex rounded-md border border-black bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600 font-[Urbanist]">
// //                                 {
// //                                   row.firstHalf
// //                                 }
// //                               </span>

// //                             </td>


// //                             <td className="px-3 py-4 font-[Urbanist]">

// //                               <span className="inline-flex rounded-md border border-black bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-600 font-[Urbanist]">
// //                                 {
// //                                   row.secondHalf
// //                                 }
// //                               </span>

// //                             </td>


// //                             <td className="px-3 py-4 font-[Urbanist]">

// //                               <span className="inline-flex rounded-md border border-black bg-green-50 px-2 py-1 text-xs font-semibold text-green-600 font-[Urbanist]">
// //                                 {
// //                                   row.dayStatus
// //                                 }
// //                               </span>

// //                             </td>

// //                           </tr>

// //                         ),
// //                       )

// //                     )}

// //                   </tbody>

// //                 </table>

// //               </div>

// //             </div>

// //           </div>


// //           {/* =================================================
// //               RIGHT SIDE
// //           ================================================= */}

// //           <div className="rounded-xl border border-black bg-white font-[Urbanist]">

// //             {/* HEADER */}

// //             <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-xl bg-[#d3e8f5] px-4 py-3 font-[Urbanist]">

// //               <div>

// //                 <h2 className="text-base font-semibold text-gray-800 font-[Urbanist]">
// //                   Punch Records
// //                 </h2>

// //                 <p className="text-xs text-gray-500 font-[Urbanist]">
// //                   Review, correct and add punch times
// //                 </p>

// //               </div>


// //               <div className="flex flex-wrap items-center gap-2 font-[Urbanist]">

// //                 <button
// //                   type="button"
// //                   className="rounded-full bg-[#b8d9e9] px-4 py-2 text-sm font-semibold text-[#1597e5] font-[Urbanist]"
// //                 >
// //                   Show All
// //                 </button>


// //                 <button
// //                   type="button"
// //                   className="flex items-center gap-2 rounded-md bg-[#1597e5] px-4 py-2 text-sm font-semibold text-white font-[Urbanist]"
// //                 >

// //                   <Plus
// //                     size={16}
// //                   />

// //                   Permission

// //                 </button>


// //                 <button
// //                   type="button"
// //                   className="flex items-center gap-2 rounded-md bg-[#1597e5] px-4 py-2 text-sm font-semibold text-white font-[Urbanist]"
// //                 >

// //                   <Plus
// //                     size={16}
// //                   />

// //                   Punch

// //                 </button>

// //               </div>

// //             </div>


// //             {/* PUNCH RECORDS */}

// //             <div className="p-4 font-[Urbanist]">

// //               {isLoading ? (

// //                 <div className="rounded-xl border border-black bg-white p-12 text-center text-sm text-gray-400 font-[Urbanist]">
// //                   Loading punch records...
// //                 </div>

// //               ) : punchRecords.length ===
// //                 0 ? (

// //                 <div className="rounded-xl border border-black bg-white p-12 text-center text-sm text-gray-400 font-[Urbanist]">
// //                   No punch records found.
// //                 </div>

// //               ) : (

// //                 <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 font-[Urbanist]">

// //                   {punchRecords.map(
// //                     (
// //                       record,
// //                     ) => {

// //                       const edit =
// //                         edits[
// //                           String(
// //                             record.punchId,
// //                           )
// //                         ];


// //                       return (

// //                         <div
// //                           key={
// //                             record.punchId
// //                           }
// //                           className="min-w-0 font-[Urbanist]"
// //                         >

// //                           <PunchRecordCard
// //                             record={
// //                               record
// //                             }

// //                             correctedTime={
// //                               edit?.correctedTime ??
// //                               record.correctedTime ??
// //                               record.originalTime ??
// //                               ""
// //                             }

// //                             remarks={
// //                               edit?.remarks ??
// //                               record.remarks ??
// //                               ""
// //                             }

// //                             isSaving={
// //                               savingId ===
// //                               record.punchId
// //                             }

// //                             onCorrectedTimeChange={(
// //                               value,
// //                             ) =>
// //                               updateField(
// //                                 record.punchId,
// //                                 "correctedTime",
// //                                 value,
// //                               )
// //                             }

// //                             onRemarksChange={(
// //                               value,
// //                             ) =>
// //                               updateField(
// //                                 record.punchId,
// //                                 "remarks",
// //                                 value,
// //                               )
// //                             }

// //                             onSave={() =>
// //                               handleSave(
// //                                 record.punchId,
// //                               )
// //                             }
// //                           />

// //                         </div>

// //                       );
// //                     },
// //                   )}

// //                 </div>

// //               )}

// //             </div>

// //           </div>

// //         </div>

// //       </div>

// //     </div>
// //   );
// // }

// import {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import {
//   CalendarDays,
//   ChevronDown,
//   RefreshCw,
//   Plus,
//   Bookmark,
// } from "lucide-react";

// import {
//   useNavigate,
//   useSearchParams,
// } from "react-router-dom";

// import {
//   usePunchDashboard,
// } from "../hooks/usePunchDashboard";

// import {
//   useReportingEmployees,
// } from "../hooks/useReportingEmployees";

// import type {
//   ReportingEmployee,
//   PunchRecord,
//   AttendanceSummary,
// } from "../types/punch.types";


// /* =========================================================
//    HELPERS
// ========================================================= */

// function formatDateForApi(
//   value: string,
// ): string {

//   if (!value) {
//     return "";
//   }

//   /*
//    * HTML date input already gives:
//    *
//    * YYYY-MM-DD
//    */

//   return value;
// }


// /* =========================================================
//    EMPLOYEE INTERNAL ID
// ========================================================= */

// function getEmployeeInternalId(
//   employee: ReportingEmployee,
// ): string {

//   const value =
//     employee.EmployeeInternalID ??
//     employee.employeeInternalId ??
//     employee.EmployeeID ??
//     employee.employeeId;

//   if (
//     value === undefined ||
//     value === null ||
//     value === ""
//   ) {
//     return "";
//   }

//   return String(value);
// }


// /* =========================================================
//    EMPLOYEE CODE
// ========================================================= */

// function getEmployeeCode(
//   employee: ReportingEmployee,
// ): string {

//   const value =
//     employee.EmployeeCode ??
//     employee.employeeCode ??
//     employee.EmployeeID ??
//     employee.employeeId ??
//     "";

//   return String(value);
// }


// /* =========================================================
//    EMPLOYEE NAME
// ========================================================= */

// function getEmployeeName(
//   employee: ReportingEmployee,
// ): string {

//   const value =
//     employee.EmployeeName ??
//     employee.employeeName ??
//     "";

//   return String(value);
// }


// /* =========================================================
//    ATTENDANCE VALUE
// ========================================================= */

// function getAttendanceDate(
//   row: AttendanceSummary,
// ): string {

//   return (
//     row.FormattedDate ??
//     row.date ??
//     row.AttendanceDate ??
//     row.Date ??
//     ""
//   );
// }


// function getShift(
//   row: AttendanceSummary,
// ): string {

//   return (
//     row.shift ??
//     row.Shift ??
//     "-"
//   );
// }


// function getFirstHalf(
//   row: AttendanceSummary,
// ): string {

//   return (
//     row.firstHalf ??
//     row.FirstHalf ??
//     "-"
//   );
// }


// function getSecondHalf(
//   row: AttendanceSummary,
// ): string {

//   return (
//     row.secondHalf ??
//     row.SecondHalf ??
//     "-"
//   );
// }


// function getDayStatus(
//   row: AttendanceSummary,
// ): string {

//   return (
//     row.dayStatus ??
//     row.DayStatus ??
//     "-"
//   );
// }


// /* =========================================================
//    PUNCH VALUE HELPERS
// ========================================================= */

// function getPunchId(
//   record: PunchRecord,
// ): string {

//   return String(
//     record.punchId ??
//     record.PunchID ??
//     "",
//   );
// }


// function getOriginalTime(
//   record: PunchRecord,
// ): string {

//   return (
//     record.originalTime ??
//     record.OriginalTime ??
//     "-"
//   );
// }


// function getCorrectedTime(
//   record: PunchRecord,
// ): string {

//   return (
//     record.correctedTime ??
//     record.CorrectedTime ??
//     "-"
//   );
// }


// function getLocation(
//   record: PunchRecord,
// ): string {

//   return (
//     record.location ??
//     record.LocationAddress ??
//     "-"
//   );
// }


// function getDevice(
//   record: PunchRecord,
// ): string {

//   if (
//     record.device
//   ) {
//     return String(
//       record.device,
//     );
//   }

//   if (
//     record.Device
//   ) {
//     return String(
//       record.Device,
//     );
//   }

//   if (
//     record.CaptureSource !==
//     undefined
//   ) {
//     return `Capture Source ${record.CaptureSource}`;
//   }

//   return "-";
// }


// function getRemarks(
//   record: PunchRecord,
// ): string {

//   return (
//     record.remarks ??
//     record.Remarks ??
//     ""
//   );
// }


// function getDirection(
//   record: PunchRecord,
// ): string {

//   if (
//     record.direction ===
//     "IN"
//   ) {
//     return "IN";
//   }

//   if (
//     record.direction ===
//     "OUT"
//   ) {
//     return "OUT";
//   }

//   if (
//     typeof record.Direction ===
//     "string"
//   ) {
//     return record.Direction;
//   }

//   return "-";
// }


// /* =========================================================
//    PUNCH PAGE
// ========================================================= */

// export default function PunchPage() {

//   const navigate =
//     useNavigate();

//   const [
//     searchParams,
//     setSearchParams,
//   ] = useSearchParams();


//   /* =======================================================
//      EMPLOYEES
//   ======================================================= */

//   const {
//     employees,
//     isLoading:
//       employeesLoading,
//     error:
//       employeesError,
//     refetch:
//       refetchEmployees,
//   } =
//     useReportingEmployees();


//   /* =======================================================
//      URL PARAMETERS
//   ======================================================= */

//   const urlEmployeeId =
//     searchParams.get(
//       "employeeId",
//     );

//   const urlDate =
//     searchParams.get(
//       "date",
//     );


//   /* =======================================================
//      DATE
//   ======================================================= */

//   const [
//     selectedDate,
//     setSelectedDate,
//   ] = useState<string>(
//     urlDate ||
//       new Date()
//         .toISOString()
//         .slice(0, 10),
//   );


//   /* =======================================================
//      SELECTED EMPLOYEE
//   ======================================================= */

//   const [
//     selectedEmployeeId,
//     setSelectedEmployeeId,
//   ] = useState<string>(
//     urlEmployeeId ||
//       "",
//   );


//   /* =======================================================
//      DASHBOARD
//   ======================================================= */

//   const dashboardParams =
//     useMemo(() => {

//       if (
//         !selectedEmployeeId
//       ) {
//         return null;
//       }

//       return {
//         employeeId:
//           selectedEmployeeId,

//         selectedDate:
//           formatDateForApi(
//             selectedDate,
//           ),

//         viewType:
//           "SingleDate" as const,
//       };

//     }, [
//       selectedEmployeeId,
//       selectedDate,
//     ]);


//   const {
//     data,
//     isLoading:
//       dashboardLoading,
//     error:
//       dashboardError,
//     refetch:
//       refetchDashboard,
//   } =
//     usePunchDashboard(
//       dashboardParams,
//     );


//   /* =======================================================
//      AUTO SELECT FIRST EMPLOYEE
//   ======================================================= */

//   useEffect(() => {

//     if (
//       employeesLoading
//     ) {
//       return;
//     }

//     if (
//       employees.length === 0
//     ) {
//       return;
//     }

//     /*
//      * If URL already contains employee ID,
//      * keep it.
//      */

//     if (
//       selectedEmployeeId
//     ) {

//       const exists =
//         employees.some(
//           (
//             employee,
//           ) =>
//             getEmployeeInternalId(
//               employee,
//             ) ===
//             selectedEmployeeId,
//         );

//       if (exists) {
//         return;
//       }
//     }


//     /*
//      * Select first valid employee.
//      */

//     const firstEmployee =
//       employees.find(
//         (
//           employee,
//         ) =>
//           getEmployeeInternalId(
//             employee,
//           ) !== "",
//       );


//     if (
//       firstEmployee
//     ) {

//       const internalId =
//         getEmployeeInternalId(
//           firstEmployee,
//         );

//       setSelectedEmployeeId(
//         internalId,
//       );

//       setSearchParams(
//         {
//           employeeId:
//             internalId,

//           date:
//             selectedDate,
//         },
//         {
//           replace: true,
//         },
//       );
//     }

//   }, [
//     employees,
//     employeesLoading,
//     selectedEmployeeId,
//     selectedDate,
//     setSearchParams,
//   ]);


//   /* =======================================================
//      CHANGE EMPLOYEE
//   ======================================================= */

//   const handleEmployeeChange = (
//     event:
//       React.ChangeEvent<HTMLSelectElement>,
//   ) => {

//     const employeeId =
//       event.target.value;

//     setSelectedEmployeeId(
//       employeeId,
//     );

//     setSearchParams(
//       {
//         employeeId,
//         date:
//           selectedDate,
//       },
//       {
//         replace: true,
//       },
//     );
//   };


//   /* =======================================================
//      CHANGE DATE
//   ======================================================= */

//   const handleDateChange = (
//     event:
//       React.ChangeEvent<HTMLInputElement>,
//   ) => {

//     const date =
//       event.target.value;

//     setSelectedDate(
//       date,
//     );

//     if (
//       selectedEmployeeId
//     ) {

//       setSearchParams(
//         {
//           employeeId:
//             selectedEmployeeId,

//           date,
//         },
//         {
//           replace: true,
//         },
//       );
//     }
//   };


//   /* =======================================================
//      UPDATE BUTTON
//   ======================================================= */

//   const handleUpdate =
//     async () => {

//       await refetchDashboard();
//     };


//   /* =======================================================
//      REFRESH
//   ======================================================= */

//   const handleRefresh =
//     async () => {

//       await Promise.all([
//         refetchEmployees(),
//         refetchDashboard(),
//       ]);
//     };


//   /* =======================================================
//      PROFILE
//   ======================================================= */

//   const profile =
//     data?.employeeProfile?.[0] ??
//     null;


//   /* =======================================================
//      ATTENDANCE
//   ======================================================= */

//   const attendanceRows =
//     data?.attendanceSummary ??
//     [];


//   /* =======================================================
//      PUNCH RECORDS
//   ======================================================= */

//   const punchRecords =
//     data?.punchRecords ??
//     [];


//   /* =======================================================
//      ERROR
//   ======================================================= */

//   const errorMessage =
//     employeesError ||
//     dashboardError;


//   /* =======================================================
//      RENDER
//   ======================================================= */

//   return (
//     <div className="min-h-screen bg-[#f4f6fb] p-2 sm:p-4 font-[Urbanist]">

//       {/* ===================================================
//           TOP NAVIGATION
//       =================================================== */}

//       <div className="mb-3 flex items-center gap-6 overflow-x-auto rounded-md bg-white px-4 py-4 font-[Urbanist]">

//         <button
//           type="button"
//           className="whitespace-nowrap border-b-2 border-[#1498dc] pb-2 text-sm font-semibold text-[#17365d] font-[Urbanist]"
//         >
//           Punch
//         </button>

//         <button
//           type="button"
//           className="whitespace-nowrap text-sm font-medium text-[#17365d] font-[Urbanist]"
//           onClick={() =>
//             navigate(
//               "../MissedPunch",
//             )
//           }
//         >
//           Missed Punch
//         </button>

//         <button
//           type="button"
//           className="whitespace-nowrap text-sm font-medium text-[#8b93a7] font-[Urbanist]"
//         >
//           Attendance
//         </button>

//         <button
//           type="button"
//           className="whitespace-nowrap text-sm font-medium text-[#8b93a7] font-[Urbanist]"
//         >
//           TA Insights
//         </button>

//       </div>


//       {/* ===================================================
//           ERROR
//       =================================================== */}

//       {errorMessage && (
//         <div className="mb-3 rounded-md border border-black bg-red-50 px-4 py-3 text-sm text-red-600 font-[Urbanist]">
//           {errorMessage}
//         </div>
//       )}


//       {/* ===================================================
//           FILTER SECTION
//       =================================================== */}

//       <div className="rounded-md bg-white p-3 shadow-sm font-[Urbanist]">

//         <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto_auto] font-[Urbanist]">

//           {/* DATE */}

//           <div>
//             <label
//               htmlFor="punch-date"
//               className="mb-1 block text-xs font-medium text-[#263b5a] font-[Urbanist]"
//             >
//               Date
//             </label>

//             <div className="relative font-[Urbanist]">

//               <input
//                 id="punch-date"
//                 type="date"
//                 value={
//                   selectedDate
//                 }
//                 onChange={
//                   handleDateChange
//                 }
//                 className="h-10 w-full rounded-md border border-[#d9e0ea] bg-white px-3 pr-10 text-sm text-[#344563] outline-none focus:border-[#1598dc] font-[Urbanist]"
//               />

//               <CalendarDays
//                 size={16}
//                 className="pointer-events-none absolute right-3 top-3 text-[#66758c] font-[Urbanist]"
//               />

//             </div>
//           </div>


//           {/* EMPLOYEE */}

//           <div>
//             <label
//               htmlFor="punch-employee"
//               className="mb-1 block text-xs font-medium text-[#263b5a] font-[Urbanist]"
//             >
//               Employee
//             </label>

//             <div className="relative font-[Urbanist]">

//               <select
//                 id="punch-employee"
//                 value={
//                   selectedEmployeeId
//                 }
//                 onChange={
//                   handleEmployeeChange
//                 }
//                 disabled={
//                   employeesLoading
//                 }
//                 className="h-10 w-full appearance-none rounded-md border border-[#d9e0ea] bg-white px-3 pr-10 text-sm text-[#344563] outline-none focus:border-[#1598dc] disabled:bg-gray-100 font-[Urbanist]"
//               >

//                 <option value="">
//                   {employeesLoading
//                     ? "Loading employees..."
//                     : "Select Employee"}
//                 </option>

//                 {employees.map(
//                   (
//                     employee,
//                   ) => {

//                     const internalId =
//                       getEmployeeInternalId(
//                         employee,
//                       );

//                     if (
//                       !internalId
//                     ) {
//                       return null;
//                     }

//                     return (
//                       <option
//                         key={
//                           internalId
//                         }
//                         value={
//                           internalId
//                         }
//                       >
//                         {getEmployeeCode(
//                           employee,
//                         )}
//                         {" - "}
//                         {getEmployeeName(
//                           employee,
//                         )}
//                       </option>
//                     );
//                   },
//                 )}

//               </select>

//               <ChevronDown
//                 size={16}
//                 className="pointer-events-none absolute right-3 top-3 text-[#66758c] font-[Urbanist]"
//               />

//             </div>
//           </div>


//           {/* REFRESH */}

//           <div className="flex items-end font-[Urbanist]">

//             <button
//               type="button"
//               onClick={
//                 handleRefresh
//               }
//               disabled={
//                 employeesLoading ||
//                 dashboardLoading
//               }
//               className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-[#d6dce6] bg-white px-4 text-sm font-medium text-[#42526b] hover:bg-gray-50 disabled:opacity-60 md:w-auto font-[Urbanist]"
//             >

//               <RefreshCw
//                 size={15}
//                 className={
//                   dashboardLoading
//                     ? "animate-spin"
//                     : ""
//                 }
//               />

//               Refresh

//             </button>

//           </div>


//           {/* UPDATE */}

//           <div className="flex items-end font-[Urbanist]">

//             <button
//               type="button"
//               onClick={
//                 handleUpdate
//               }
//               disabled={
//                 !selectedEmployeeId ||
//                 dashboardLoading
//               }
//               className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#1598dc] px-5 text-sm font-semibold text-white hover:bg-[#1088c5] disabled:cursor-not-allowed disabled:opacity-50 md:w-auto font-[Urbanist]"
//             >

//               <RefreshCw
//                 size={15}
//                 className={
//                   dashboardLoading
//                     ? "animate-spin"
//                     : ""
//                 }
//               />

//               Update

//             </button>

//           </div>

//         </div>

//       </div>


//       {/* ===================================================
//           EMPLOYEE PROFILE
//       =================================================== */}

//       <div className="mt-3 rounded-md bg-white p-4 shadow-sm font-[Urbanist]">

//         {dashboardLoading ? (

//           <div className="py-6 text-center text-sm text-[#929bb0] font-[Urbanist]">
//             Loading employee details...
//           </div>

//         ) : profile ? (

//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 font-[Urbanist]">

//             <div>
//               <div className="text-xs text-[#8792a7] font-[Urbanist]">
//                 Employee
//               </div>

//               <div className="mt-1 text-sm font-semibold text-[#263b5a] font-[Urbanist]">
//                 {String(
//                   profile.EmployeeCode ??
//                   profile.employeeId ??
//                   "",
//                 )}
//                 {" - "}
//                 {String(
//                   profile.EmployeeName ??
//                   profile.employeeName ??
//                   "",
//                 )}
//               </div>
//             </div>


//             <div>
//               <div className="text-xs text-[#8792a7] font-[Urbanist]">
//                 Reporting Authority
//               </div>

//               <div className="mt-1 text-sm font-semibold text-[#263b5a] font-[Urbanist]">
//                 {String(
//                   profile.ReportingAuthority ??
//                   profile.reportingAuthorityName ??
//                   "-",
//                 )}
//               </div>
//             </div>


//             <div>
//               <div className="text-xs text-[#8792a7] font-[Urbanist]">
//                 Policy
//               </div>

//               <div className="mt-1 text-sm font-semibold text-[#263b5a] font-[Urbanist]">
//                 {String(
//                   profile.PolicyName ??
//                   profile.policyName ??
//                   "-",
//                 )}
//               </div>
//             </div>


//             <div>
//               <div className="text-xs text-[#8792a7] font-[Urbanist]">
//                 Shift
//               </div>

//               <div className="mt-1 text-sm font-semibold text-[#263b5a] font-[Urbanist]">
//                 {String(
//                   profile.CurrentShiftName ??
//                   profile.shiftName ??
//                   "-",
//                 )}

//                 {" "}

//                 <span className="font-normal text-[#8792a7] font-[Urbanist]">
//                   {String(
//                     profile.ShiftTiming ??
//                     profile.shiftTiming ??
//                     "",
//                   )}
//                 </span>
//               </div>
//             </div>

//           </div>

//         ) : (

//           <div className="py-6 text-center text-sm text-[#929bb0] font-[Urbanist]">
//             Select an employee to view details.
//           </div>

//         )}

//       </div>


//       {/* ===================================================
//           ATTENDANCE FILTERS
//       =================================================== */}

//       <div className="mt-3 rounded-md bg-white p-3 shadow-sm font-[Urbanist]">

//         <div className="mb-3 text-sm font-semibold text-[#263b5a] font-[Urbanist]">
//           Select a month or week to see absences for that period
//         </div>

//         <div className="grid grid-cols-1 gap-2 md:grid-cols-3 font-[Urbanist]">

//           <select
//             className="h-10 rounded-md border border-[#d9e0ea] bg-white px-3 text-sm text-[#344563] outline-none font-[Urbanist]"
//             defaultValue="Custom Month"
//           >
//             <option>
//               Custom Month
//             </option>

//             <option>
//               Current Month
//             </option>

//             <option>
//               Previous Month
//             </option>

//           </select>


//           <input
//             type="text"
//             defaultValue="1"
//             className="h-10 rounded-md border border-[#d9e0ea] px-3 text-sm text-[#344563] outline-none font-[Urbanist]"
//           />


//           <select
//             className="h-10 rounded-md border border-[#d9e0ea] bg-white px-3 text-sm text-[#344563] outline-none font-[Urbanist]"
//             defaultValue=""
//           >
//             <option value="">
//               Select Leave
//             </option>

//             <option value="L">
//               Leave
//             </option>

//             <option value="AB">
//               Absent
//             </option>

//             <option value="WO">
//               Week Off
//             </option>

//           </select>

//         </div>

//       </div>


//       {/* ===================================================
//           ATTENDANCE SUMMARY
//       =================================================== */}

//       <div className="mt-3 overflow-hidden rounded-md bg-white shadow-sm font-[Urbanist]">

//         <div className="overflow-x-auto font-[Urbanist]">

//           <table className="w-full min-w-[650px] text-left font-[Urbanist]">

//             <thead className="bg-[#d6ebf8] font-[Urbanist]">

//               <tr>

//                 <th className="px-4 py-3 text-xs font-semibold text-[#17365d] font-[Urbanist]">
//                   Date
//                 </th>

//                 <th className="px-4 py-3 text-xs font-semibold text-[#17365d] font-[Urbanist]">
//                   Shift
//                 </th>

//                 <th className="px-4 py-3 text-xs font-semibold text-[#17365d] font-[Urbanist]">
//                   First Half
//                 </th>

//                 <th className="px-4 py-3 text-xs font-semibold text-[#17365d] font-[Urbanist]">
//                   Second Half
//                 </th>

//                 <th className="px-4 py-3 text-xs font-semibold text-[#17365d] font-[Urbanist]">
//                   Day Status
//                 </th>

//               </tr>

//             </thead>


//             <tbody>

//               {dashboardLoading ? (

//                 <tr>

//                   <td
//                     colSpan={5}
//                     className="px-4 py-8 text-center text-sm text-[#929bb0] font-[Urbanist]"
//                   >
//                     Loading attendance data...
//                   </td>

//                 </tr>

//               ) : attendanceRows.length === 0 ? (

//                 <tr>

//                   <td
//                     colSpan={5}
//                     className="px-4 py-8 text-center text-sm text-[#929bb0] font-[Urbanist]"
//                   >
//                     No attendance data found.
//                   </td>

//                 </tr>

//               ) : (

//                 attendanceRows.map(
//                   (
//                     row,
//                     index,
//                   ) => (

//                     <tr
//                       key={
//                         `${getAttendanceDate(row)}-${index}`
//                       }
//                       className="border-t border-[#edf0f5] font-[Urbanist]"
//                     >

//                       <td className="px-4 py-3 text-sm text-[#344563] font-[Urbanist]">
//                         {getAttendanceDate(
//                           row,
//                         )}
//                       </td>

//                       <td className="px-4 py-3 text-sm text-[#344563] font-[Urbanist]">
//                         {getShift(
//                           row,
//                         )}
//                       </td>

//                       <td className="px-4 py-3 text-sm text-[#344563] font-[Urbanist]">
//                         {getFirstHalf(
//                           row,
//                         )}
//                       </td>

//                       <td className="px-4 py-3 text-sm text-[#344563] font-[Urbanist]">
//                         {getSecondHalf(
//                           row,
//                         )}
//                       </td>

//                       <td className="px-4 py-3 text-sm font-medium text-[#344563] font-[Urbanist]">
//                         {getDayStatus(
//                           row,
//                         )}
//                       </td>

//                     </tr>

//                   ),
//                 )

//               )}

//             </tbody>

//           </table>

//         </div>

//       </div>


//       {/* ===================================================
//           PUNCH RECORDS
//       =================================================== */}

//       <div className="mt-3 overflow-hidden rounded-md bg-white shadow-sm font-[Urbanist]">

//         {/* HEADER */}

//         <div className="flex flex-col gap-3 bg-[#d2e9f7] px-4 py-3 sm:flex-row sm:items-center sm:justify-between font-[Urbanist]">

//           <div>

//             <div className="text-sm font-semibold text-[#17365d] font-[Urbanist]">
//               Punch Records
//             </div>

//             <div className="text-xs text-[#6e8199] font-[Urbanist]">
//               Review, correct and add punch times
//             </div>

//           </div>


//           <div className="flex flex-wrap items-center gap-2 font-[Urbanist]">

//             <button
//               type="button"
//               className="rounded-full bg-[#b7def1] px-4 py-2 text-xs font-semibold text-[#1776a6] font-[Urbanist]"
//             >
//               Show All
//             </button>


//             <button
//               type="button"
//               className="flex items-center gap-1 rounded-md bg-[#1598dc] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1088c5] font-[Urbanist]"
//             >

//               <Plus
//                 size={14}
//               />

//               Permission

//             </button>


//             <button
//               type="button"
//               className="flex items-center gap-1 rounded-md bg-[#1598dc] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1088c5] font-[Urbanist]"
//             >

//               <Plus
//                 size={14}
//               />

//               Punch

//             </button>

//           </div>

//         </div>


//         {/* RECORDS */}

//         <div className="p-3 font-[Urbanist]">

//           {dashboardLoading ? (

//             <div className="rounded-md border border-[#e1e5eb] py-12 text-center text-sm text-[#929bb0] font-[Urbanist]">
//               Loading punch records...
//             </div>

//           ) : punchRecords.length === 0 ? (

//             <div className="rounded-md border border-[#e1e5eb] py-12 text-center text-sm text-[#929bb0] font-[Urbanist]">
//               No punch records found.
//             </div>

//           ) : (

//             <div className="space-y-3 font-[Urbanist]">

//               {punchRecords.map(
//                 (
//                   record,
//                   index,
//                 ) => {

//                   const punchId =
//                     getPunchId(
//                       record,
//                     );

//                   const direction =
//                     getDirection(
//                       record,
//                     );

//                   return (

//                     <div
//                       key={
//                         `${punchId}-${index}`
//                       }
//                       className="rounded-md border border-[#e1e5eb] bg-white p-4 font-[Urbanist]"
//                     >

//                       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 font-[Urbanist]">

//                         {/* PUNCH ID */}

//                         <div>

//                           <div className="text-xs text-[#8b96a8] font-[Urbanist]">
//                             Punch ID
//                           </div>

//                           <div className="mt-1 text-sm font-semibold text-[#263b5a] font-[Urbanist]">
//                             {punchId ||
//                               "-"}
//                           </div>

//                         </div>


//                         {/* DIRECTION */}

//                         <div>

//                           <div className="text-xs text-[#8b96a8] font-[Urbanist]">
//                             Direction
//                           </div>

//                           <div className="mt-1 text-sm font-semibold text-[#263b5a] font-[Urbanist]">
//                             {direction}
//                           </div>

//                         </div>


//                         {/* ORIGINAL */}

//                         <div>

//                           <div className="text-xs text-[#8b96a8] font-[Urbanist]">
//                             Original Time
//                           </div>

//                           <div className="mt-1 text-sm font-semibold text-[#263b5a] font-[Urbanist]">
//                             {getOriginalTime(
//                               record,
//                             )}
//                           </div>

//                         </div>


//                         {/* CORRECTED */}

//                         <div>

//                           <div className="text-xs text-[#8b96a8] font-[Urbanist]">
//                             Corrected Time
//                           </div>

//                           <div className="mt-1 text-sm font-semibold text-[#263b5a] font-[Urbanist]">
//                             {getCorrectedTime(
//                               record,
//                             )}
//                           </div>

//                         </div>


//                         {/* LOCATION */}

//                         <div className="md:col-span-2 lg:col-span-3 font-[Urbanist]">

//                           <div className="text-xs text-[#8b96a8] font-[Urbanist]">
//                             Location
//                           </div>

//                           <div className="mt-1 break-words text-sm text-[#344563] font-[Urbanist]">
//                             {getLocation(
//                               record,
//                             )}
//                           </div>

//                         </div>


//                         {/* DEVICE */}

//                         <div>

//                           <div className="text-xs text-[#8b96a8] font-[Urbanist]">
//                             Device
//                           </div>

//                           <div className="mt-1 text-sm text-[#344563] font-[Urbanist]">
//                             {getDevice(
//                               record,
//                             )}
//                           </div>

//                         </div>


//                         {/* REMARKS */}

//                         <div className="md:col-span-2 lg:col-span-4 font-[Urbanist]">

//                           <div className="text-xs text-[#8b96a8] font-[Urbanist]">
//                             Remarks
//                           </div>

//                           <div className="mt-1 text-sm text-[#344563] font-[Urbanist]">
//                             {getRemarks(
//                               record,
//                             ) || "-"}
//                           </div>

//                         </div>

//                       </div>


//                       {/* RECORD FOOTER */}

//                       <div className="mt-4 flex items-center gap-2 border-t border-[#edf0f5] pt-3 font-[Urbanist]">

//                         <Bookmark
//                           size={15}
//                           className="text-[#1598dc] font-[Urbanist]"
//                         />

//                         <span className="text-xs text-[#7b8799] font-[Urbanist]">
//                           Verification:{" "}
//                           {String(
//                             record.VerificationStatus ??
//                             "-",
//                           )}
//                         </span>

//                       </div>

//                     </div>

//                   );
//                 },
//               )}

//             </div>

//           )}

//         </div>

//       </div>

//     </div>
//   );
// }

import {
  useEffect,
  useState,
} from "react";

import {
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  ChevronDown,
  RefreshCw,
  Plus,
  Bookmark,
} from "lucide-react";
import DateField from "@/features/admin/TalentHub/TimeOffice/components/DateField";

import PunchRecordCard from "../components/PunchRecordCard";

import {
  useReportingEmployees,
} from "../hooks/useReportingEmployees";

import {
  usePunchDashboard,
} from "../hooks/usePunchDashboard";

import {
  usePunchEditor,
} from "../hooks/usePunchEditor";

import type {
  PunchPageProps,
  PunchNavigationState,
  ViewType,
} from "../types/punch.types";
import {
  DEFAULT_LEAVE_FILTER,
  DEFAULT_PERIOD_VALUE,
  DEFAULT_PUNCH_PERIOD,
  PUNCH_STORAGE_KEYS,
  PUNCH_VIEW_TYPE,
} from "../constants/punch.constants";
import type { PunchPeriodType } from "../constants/punch.constants";


/* =========================================================
   TODAY
========================================================= */

function getToday(): string {
  return new Date()
    .toISOString()
    .slice(0, 10);
}


/* =========================================================
   DISPLAY DATE
========================================================= */

function formatDisplayDate(
  value?: string | null,
): string {

  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  const month =
    date.toLocaleString(
      "en-US",
      {
        month: "short",
      },
    );

  const year =
    date.getFullYear();

  return `${day}/${month}/${year}`;
}


/* =========================================================
   EMPLOYEE ID
========================================================= */

function getEmployeeId(
  employee: Record<string, unknown>,
): string {

  return String(
    employee.employeeId ??
      employee.EmployeeID ??
      employee.EmployeeCode ??
      employee.EmployeeInternalID ??
      "",
  );
}


/* =========================================================
   EMPLOYEE NAME
========================================================= */

function getEmployeeName(
  employee: Record<string, unknown>,
): string {

  return String(
    employee.employeeName ??
      employee.EmployeeName ??
      employee.name ??
      employee.Name ??
      "",
  );
}


/* =========================================================
   EMPLOYEE CODE
========================================================= */

function getEmployeeCode(
  employee: Record<string, unknown>,
): string {

  return String(
    employee.EmployeeCode ??
      employee.employeeCode ??
      employee.employeeId ??
      employee.EmployeeID ??
      "",
  );
}


/* =========================================================
   PUNCH PAGE
========================================================= */

export default function PunchPage({
  employeeId: propEmployeeId,
}: PunchPageProps) {

  const navigate =
    useNavigate();

  const location =
    useLocation();


  /* =======================================================
     NAVIGATION STATE
  ======================================================= */

  const navigationState =
    location.state as
      | PunchNavigationState
      | null;


  /* =======================================================
     DATE
  ======================================================= */

  const today =
    getToday();

  const [
    selectedDate,
    setSelectedDate,
  ] = useState<string>(
    navigationState?.selectedDate ||
      new URLSearchParams(
        location.search,
      ).get("date") ||
      today,
  );


  /* =======================================================
     EMPLOYEE
  ======================================================= */

  const [
    selectedEmployeeId,
    setSelectedEmployeeId,
  ] = useState<string>(
    navigationState?.employeeId ||
      propEmployeeId ||
      new URLSearchParams(
        location.search,
      ).get("employeeId") ||
      localStorage.getItem(
        PUNCH_STORAGE_KEYS.employeeId,
      ) ||
      localStorage.getItem(
        PUNCH_STORAGE_KEYS.legacyEmployeeId,
      ) ||
      "",
  );


  /* =======================================================
     VIEW TYPE
  ======================================================= */

  const viewType: ViewType =
    PUNCH_VIEW_TYPE;


  /* =======================================================
     MONTH / WEEK
  ======================================================= */

  const [
    periodType,
    setPeriodType,
  ] = useState<PunchPeriodType>(
    DEFAULT_PUNCH_PERIOD,
  );

  const [
    periodValue,
    setPeriodValue,
  ] = useState(DEFAULT_PERIOD_VALUE);

  const [
    leaveFilter,
    setLeaveFilter,
  ] = useState(DEFAULT_LEAVE_FILTER);


  /* =======================================================
     REPORTING EMPLOYEES
  ======================================================= */

  const {
    employees,
    isLoading:
      employeesLoading,
    error:
      employeesError,
    refetch:
      refetchEmployees,
  } =
    useReportingEmployees();


  /* =======================================================
     SELECT FIRST EMPLOYEE
  ======================================================= */

  useEffect(() => {

    if (
      selectedEmployeeId
    ) {
      return;
    }

    if (
      employees.length === 0
    ) {
      return;
    }

    const first =
      employees[0] as Record<
        string,
        unknown
      >;

    const firstId =
      getEmployeeId(first);

    if (firstId) {

      setSelectedEmployeeId(
        firstId,
      );

      localStorage.setItem(
        PUNCH_STORAGE_KEYS.employeeId,
        firstId,
      );

    }

  }, [
    employees,
    selectedEmployeeId,
  ]);


  /* =======================================================
     SAVE EMPLOYEE
  ======================================================= */

  useEffect(() => {

    if (
      selectedEmployeeId
    ) {

      localStorage.setItem(
        PUNCH_STORAGE_KEYS.employeeId,
        selectedEmployeeId,
      );

    }

  }, [
    selectedEmployeeId,
  ]);


  /* =======================================================
     DASHBOARD
  ======================================================= */

  const {
    data,
    isLoading,
    error,
    refetch,
  } =
    usePunchDashboard({
      employeeId:
        selectedEmployeeId,

      selectedDate,

      viewType,
    });


  /* =======================================================
     PUNCH EDITOR
  ======================================================= */

  const {
    edits,
    savingId,
    saveError,
    updateField,
    saveRecord,
  } =
    usePunchEditor(
      data?.punchRecords ??
        [],
    );


  /* =======================================================
     DATA
  ======================================================= */

  const profile =
    data?.employeeProfile?.[0] ??
    null;

  const attendanceSummary =
    data?.attendanceSummary ??
    [];

  const punchRecords =
    data?.punchRecords ??
    [];


  /* =======================================================
     EMPLOYEE CHANGE
  ======================================================= */

  const handleEmployeeChange = (
    value: string,
  ) => {

    setSelectedEmployeeId(
      value,
    );

    navigate(
      {
        pathname:
          location.pathname,

        search:
          `?employeeId=${encodeURIComponent(
            value,
          )}&date=${encodeURIComponent(
            selectedDate,
          )}`,
      },
      {
        replace: true,
      },
    );

  };


  /* =======================================================
     DATE CHANGE
  ======================================================= */

  const handleDateChange = (
    value: string,
  ) => {

    setSelectedDate(
      value,
    );

    navigate(
      {
        pathname:
          location.pathname,

        search:
          `?employeeId=${encodeURIComponent(
            selectedEmployeeId,
          )}&date=${encodeURIComponent(
            value,
          )}`,
      },
      {
        replace: true,
      },
    );

  };


  /* =======================================================
     SAVE
  ======================================================= */

  const handleSave = async (
    punchId: string | number,
  ) => {

    await saveRecord(
      punchId,
    );

  };


  /* =======================================================
     REFRESH
  ======================================================= */

  const handleRefresh = () => {

    void refetchEmployees();

    if (
      selectedEmployeeId
    ) {
      void refetch();
    }

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="min-h-screen bg-[#f4f5f9] font-[Urbanist]">

      {/* ===================================================
          TOP PUNCH TOOLBAR
      =================================================== */}

      <div className="border-b border-[#e5e8ee] bg-white font-[Urbanist]">

        <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 font-[Urbanist]">

          {/* =================================================
              TABS
          ================================================= */}

          <div className="flex min-w-0 items-center gap-8 overflow-x-auto font-[Urbanist]">

            {/* PUNCH */}

            <NavLink
              to="../Punch"
              className={({ isActive }) =>
                `whitespace-nowrap border-b-2 px-1 py-6 text-[15px] font-semibold ${
                  isActive
                    ? "border-[#1597e5] text-[#1597e5]"
                    : "border-transparent text-[#5f6b7a]"
                }`
              }
            >
              Punch
            </NavLink>


            {/* MISSED PUNCH */}

            <NavLink
              to="../MissedPunch"
              className={({ isActive }) =>
                `whitespace-nowrap border-b-2 px-1 py-6 text-[15px] font-semibold ${
                  isActive
                    ? "border-[#1597e5] text-[#1597e5]"
                    : "border-transparent text-[#5f6b7a]"
                }`
              }
            >
              Missed Punch
            </NavLink>


            {/* ATTENDANCE */}

            <NavLink
              to="../time-office/regularization/attendance"
              className={({ isActive }) =>
                `whitespace-nowrap border-b-2 px-1 py-6 text-[15px] font-semibold ${
                  isActive
                    ? "border-[#1597e5] text-[#1597e5]"
                    : "border-transparent text-[#5f6b7a]"
                }`
              }
            >
              Attendance
            </NavLink>


            {/* TA INSIGHTS */}

            <NavLink
              to="../TAInsights"
              className={({ isActive }) =>
                `whitespace-nowrap border-b-2 px-1 py-6 text-[15px] font-semibold ${
                  isActive
                    ? "border-[#1597e5] text-[#1597e5]"
                    : "border-transparent text-[#5f6b7a]"
                }`
              }
            >
              TA Insights
            </NavLink>

          </div>


          {/* =================================================
              RIGHT SIDE FILTERS
          ================================================= */}

          <div className="hidden shrink-0 items-center gap-4 xl:flex font-[Urbanist]">

            {/* DATE */}

            <div className="flex items-center gap-2 font-[Urbanist]">

              <span className="text-sm font-medium text-[#303c50] font-[Urbanist]">
                Date
              </span>

              <DateField value={selectedDate} onChange={handleDateChange} />

            </div>


            {/* EMPLOYEE */}

            <div className="flex items-center gap-2 font-[Urbanist]">

              <span className="text-sm font-medium text-[#303c50] font-[Urbanist]">
                Employee
              </span>

              <div className="relative font-[Urbanist]">

                <select
                  value={
                    selectedEmployeeId
                  }
                  onChange={(
                    event,
                  ) =>
                    handleEmployeeChange(
                      event.target.value,
                    )
                  }
                  disabled={
                    employeesLoading
                  }
                  className="
                    h-10
                    w-[200px]
                    appearance-none
                    truncate
                    rounded-md
                    border
                    border-[#dfe4ec]
                    bg-[#f7f8fa]
                    px-3
                    pr-9
                    text-sm
                    font-medium
                    text-[#344054]
                    outline-none
                    focus:border-[#1597e5]
                    disabled:opacity-60
                   font-[Urbanist]"
                >

                  <option value="">
                    {employeesLoading
                      ? "Loading..."
                      : "Select Employee"}
                  </option>

                  {employees.map(
                    (
                      employee,
                    ) => {

                      const record =
                        employee as Record<
                          string,
                          unknown
                        >;

                      const id =
                        getEmployeeId(
                          record,
                        );

                      const name =
                        getEmployeeName(
                          record,
                        );

                      const code =
                        getEmployeeCode(
                          record,
                        );

                      if (!id) {
                        return null;
                      }

                      return (
                        <option
                          key={id}
                          value={id}
                        >
                          {code} - {name}
                        </option>
                      );

                    },
                  )}

                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8792a3] font-[Urbanist]"
                />

              </div>

            </div>


            {/* UPDATE */}

            <button
              type="button"
              onClick={() => {
                void refetch();
              }}
              disabled={
                !selectedEmployeeId ||
                isLoading
              }
              className="
                flex
                h-10
                items-center
                gap-2
                rounded-md
                bg-[#1597e5]
                px-5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-[#0788d2]
                disabled:cursor-not-allowed
                disabled:opacity-60
               font-[Urbanist]"
            >

              <Bookmark
                size={16}
              />

              Update

            </button>


            {/* REFRESH */}

            <button
              type="button"
              onClick={
                handleRefresh
              }
              className="
                rounded-full
                p-2
                text-[#9aa4b2]
                transition
                hover:bg-[#f1f3f6]
               font-[Urbanist]"
              title="Refresh"
            >

              <RefreshCw
                size={20}
                className={
                  isLoading ||
                  employeesLoading
                    ? "animate-spin"
                    : ""
                }
              />

            </button>

          </div>

        </div>


        {/* =================================================
            RESPONSIVE FILTER ROW
        ================================================= */}

        <div className="grid grid-cols-1 gap-3 border-t border-[#edf0f4] p-3 xl:hidden font-[Urbanist]">

          {/* DATE */}

          <div>

            <label className="mb-1 block text-xs font-medium text-[#596579] font-[Urbanist]">
              Date
            </label>

            <DateField value={selectedDate} onChange={handleDateChange} />

          </div>


          {/* EMPLOYEE */}

          <div>

            <label className="mb-1 block text-xs font-medium text-[#596579] font-[Urbanist]">
              Employee
            </label>

            <div className="relative font-[Urbanist]">

              <select
                value={
                  selectedEmployeeId
                }
                onChange={(
                  event,
                ) =>
                  handleEmployeeChange(
                    event.target.value,
                  )
                }
                className="
                  h-10
                  w-full
                  appearance-none
                  rounded-md
                  border
                  border-[#dfe4ec]
                  bg-white
                  px-3
                  pr-9
                  text-sm
                  text-[#344054]
                  outline-none
                 font-[Urbanist]"
              >

                <option value="">
                  Select Employee
                </option>

                {employees.map(
                  (
                    employee,
                  ) => {

                    const record =
                      employee as Record<
                        string,
                        unknown
                      >;

                    const id =
                      getEmployeeId(
                        record,
                      );

                    if (!id) {
                      return null;
                    }

                    return (
                      <option
                        key={id}
                        value={id}
                      >
                        {getEmployeeCode(
                          record,
                        )}{" "}
                        -{" "}
                        {getEmployeeName(
                          record,
                        )}
                      </option>
                    );

                  },
                )}

              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8792a3] font-[Urbanist]"
              />

            </div>

          </div>


          {/* BUTTONS */}

          <div className="flex gap-2 font-[Urbanist]">

            <button
              type="button"
              onClick={() => {
                void refetch();
              }}
              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-[#1597e5] text-sm font-semibold text-white font-[Urbanist]"
            >

              <Bookmark
                size={15}
              />

              Update

            </button>

            <button
              type="button"
              onClick={
                handleRefresh
              }
              className="flex h-10 w-12 items-center justify-center rounded-md border border-[#dfe4ec] bg-white text-[#8792a3] font-[Urbanist]"
            >

              <RefreshCw
                size={17}
              />

            </button>

          </div>

        </div>

      </div>


      {/* ===================================================
          ERROR
      =================================================== */}

      {(employeesError ||
        error ||
        saveError) && (

        <div className="mx-4 mt-3 rounded-lg border border-black bg-red-50 px-4 py-3 text-sm text-red-600 font-[Urbanist]">

          {employeesError ||
            error ||
            saveError}

        </div>

      )}


      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <div className="p-4 font-[Urbanist]">

        <div className="
          grid
          grid-cols-1
          gap-4
          xl:grid-cols-[34%_66%]
         font-[Urbanist]">


          {/* =================================================
              LEFT COLUMN
          ================================================= */}

          <div className="space-y-3 font-[Urbanist]">


            {/* =================================================
                EMPLOYEE PROFILE CARD
            ================================================= */}

            <div className="rounded-xl border border-[#e2e6ed] bg-white font-[Urbanist]">

              {isLoading &&
              !profile ? (

                <div className="flex min-h-[180px] items-center justify-center text-sm text-[#98a2b3] font-[Urbanist]">

                  Loading employee details...

                </div>

              ) : profile ? (

                <div className="p-4 font-[Urbanist]">


                  {/* EMPLOYEE */}

                  <div className="text-center font-[Urbanist]">

                    <h1 className="text-[23px] font-semibold text-[#1597e5] font-[Urbanist]">

                      {profile.employeeName}

                    </h1>

                    <div className="mt-1 inline-block rounded-sm bg-[#ddd5ff] px-2 py-1 text-[15px] font-semibold text-[#344054] font-[Urbanist]">

                      {profile.employeeId}

                    </div>

                  </div>


                  {/* REPORTING AUTHORITY */}

                  <div className="mt-2 flex items-center justify-center gap-2 font-[Urbanist]">

                    <span className="
                      rounded-md
                      border
                      border-[#d0d5dd]
                      bg-[#f2f4f7]
                      px-2
                      py-1
                      text-sm
                      font-semibold
                      text-[#475467]
                     font-[Urbanist]">
                      R.A
                    </span>

                    <span className="
                      max-w-[75%]
                      truncate
                      text-sm
                      font-medium
                      text-[#667085]
                     font-[Urbanist]">

                      {profile.reportingAuthorityName ||
                        profile.ReportingAuthority ||
                        "Reporting Authority"}

                    </span>

                  </div>


                  {/* DETAILS */}

                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 font-[Urbanist]">


                    {/* POLICY */}

                    <div>

                      <h3 className="
                        border-b
                        border-[#dfe4ea]
                        pb-2
                        text-[15px]
                        font-semibold
                        text-[#1597e5]
                       font-[Urbanist]">
                        Policy Details
                      </h3>

                      <div className="mt-2 space-y-1 font-[Urbanist]">

                        <p className="text-sm text-[#667085] font-[Urbanist]">

                          {profile.policyName ||
                            profile.PolicyName ||
                            "General Policy"}

                        </p>

                        <p className="text-sm text-[#667085] font-[Urbanist]">

                          {profile.doublePunchPolicy ||
                            profile.PunchTypeRule ||
                            "Double Punch"}

                        </p>

                      </div>

                    </div>


                    {/* SHIFT */}

                    <div>

                      <h3 className="
                        border-b
                        border-[#dfe4ea]
                        pb-2
                        text-[15px]
                        font-semibold
                        text-[#1597e5]
                       font-[Urbanist]">
                        Shift Details
                      </h3>

                      <div className="mt-2 space-y-1 font-[Urbanist]">

                        <p className="text-sm text-[#667085] font-[Urbanist]">

                          {profile.shiftName ||
                            profile.CurrentShiftName ||
                            "General Shift (GS)"}

                        </p>

                        <p className="text-sm text-[#667085] font-[Urbanist]">

                          {profile.shiftTiming ||
                            profile.ShiftTiming ||
                            "10:00 TO 19:00"}

                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              ) : (

                <div className="p-6 text-center text-sm text-[#98a2b3] font-[Urbanist]">

                  Select an employee to view details.

                </div>

              )}

            </div>


            {/* =================================================
                MONTH / WEEK FILTER
            ================================================= */}

            <div className="rounded-xl border border-[#e2e6ed] bg-white p-2 font-[Urbanist]">

              <p className="mb-3 text-sm font-medium text-[#344054] font-[Urbanist]">

                Select a month or week to see absences for that period

              </p>


              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 font-[Urbanist]">


                {/* PERIOD */}

                <div className="relative font-[Urbanist]">

                  <select
                    value={
                      periodType
                    }
                    onChange={(
                      event,
                    ) =>
                      setPeriodType(
                        event.target.value as
                          | "Custom Month"
                          | "Custom Week",
                      )
                    }
                    className="
                      h-10
                      w-full
                      appearance-none
                      rounded-md
                      border
                      border-[#dfe4ec]
                      bg-white
                      px-3
                      pr-8
                      text-sm
                      text-[#344054]
                      outline-none
                     font-[Urbanist]"
                  >

                    <option>
                      Custom Month
                    </option>

                    <option>
                      Custom Week
                    </option>

                  </select>

                  <ChevronDown
                    size={16}
                    className="
                      pointer-events-none
                      absolute
                      right-2
                      top-1/2
                      -translate-y-1/2
                      text-[#8792a3]
                     font-[Urbanist]"
                  />

                </div>


                {/* NUMBER */}

                <input
                  type="number"
                  min="1"
                  value={
                    periodValue
                  }
                  onChange={(
                    event,
                  ) =>
                    setPeriodValue(
                      event.target.value,
                    )
                  }
                  className="
                    h-10
                    rounded-md
                    border
                    border-[#dfe4ec]
                    px-3
                    text-sm
                    text-[#344054]
                    outline-none
                   font-[Urbanist]"
                />


                {/* LEAVE */}

                <div className="relative font-[Urbanist]">

                  <select
                    value={
                      leaveFilter
                    }
                    onChange={(
                      event,
                    ) =>
                      setLeaveFilter(
                        event.target.value,
                      )
                    }
                    className="
                      h-10
                      w-full
                      appearance-none
                      rounded-md
                      border
                      border-[#dfe4ec]
                      bg-white
                      px-3
                      pr-8
                      text-sm
                      text-[#344054]
                      outline-none
                     font-[Urbanist]"
                  >

                    <option>
                      Select Leave
                    </option>

                    <option>
                      All Leave
                    </option>

                  </select>

                  <ChevronDown
                    size={16}
                    className="
                      pointer-events-none
                      absolute
                      right-2
                      top-1/2
                      -translate-y-1/2
                      text-[#8792a3]
                     font-[Urbanist]"
                  />

                </div>

              </div>

            </div>


            {/* =================================================
                ATTENDANCE TABLE
            ================================================= */}

            <div className="
              overflow-hidden
              rounded-xl
              border
              border-[#e2e6ed]
              bg-white
             font-[Urbanist]">

              <div className="overflow-x-auto font-[Urbanist]">

                <table className="w-full min-w-[520px] font-[Urbanist]">


                  {/* HEADER */}

                  <thead>

                    <tr className="bg-[#d4e9f7] font-[Urbanist]">

                      <th className="
                        px-3
                        py-4
                        text-left
                        text-sm
                        font-semibold
                        text-[#344054]
                       font-[Urbanist]">
                        Date
                      </th>

                      <th className="
                        px-3
                        py-4
                        text-left
                        text-sm
                        font-semibold
                        text-[#344054]
                       font-[Urbanist]">
                        Shift
                      </th>

                      <th className="
                        px-3
                        py-4
                        text-left
                        text-sm
                        font-semibold
                        text-[#344054]
                       font-[Urbanist]">
                        First Half
                      </th>

                      <th className="
                        px-3
                        py-4
                        text-left
                        text-sm
                        font-semibold
                        text-[#344054]
                       font-[Urbanist]">
                        Second Half
                      </th>

                      <th className="
                        px-3
                        py-4
                        text-left
                        text-sm
                        font-semibold
                        text-[#344054]
                       font-[Urbanist]">
                        Day Status
                      </th>

                    </tr>

                  </thead>


                  {/* BODY */}

                  <tbody>

                    {isLoading ? (

                      <tr>

                        <td
                          colSpan={5}
                          className="
                            px-4
                            py-8
                            text-center
                            text-sm
                            text-[#98a2b3]
                           font-[Urbanist]"
                        >
                          Loading attendance...
                        </td>

                      </tr>

                    ) : attendanceSummary.length ===
                      0 ? (

                      <tr>

                        <td
                          colSpan={5}
                          className="
                            px-4
                            py-8
                            text-center
                            text-sm
                            text-[#98a2b3]
                           font-[Urbanist]"
                        >
                          No attendance data found.
                        </td>

                      </tr>

                    ) : (

                      attendanceSummary.map(
                        (
                          row,
                          index,
                        ) => (

                          <tr
                            key={`${row.date}-${index}`}
                            className="
                              border-t
                              border-[#f0f2f5]
                              bg-white
                             font-[Urbanist]"
                          >

                            {/* DATE */}

                            <td className="
                              px-3
                              py-4
                              text-sm
                              text-[#344054]
                             font-[Urbanist]">

                              {formatDisplayDate(
                                row.date,
                              )}

                            </td>


                            {/* SHIFT */}

                            <td className="
                              px-3
                              py-4
                              text-sm
                              text-[#344054]
                             font-[Urbanist]">

                              {row.shift}

                            </td>


                            {/* FIRST HALF */}

                            <td className="px-3 py-4 font-[Urbanist]">

                              <span className="
                                inline-flex
                                min-w-[30px]
                                items-center
                                justify-center
                                rounded-md
                                border
                                border-[#9fd3ff]
                                bg-[#edf7ff]
                                px-2
                                py-1
                                text-xs
                                font-semibold
                                text-[#2388d3]
                               font-[Urbanist]">

                                {row.firstHalf}

                              </span>

                            </td>


                            {/* SECOND HALF */}

                            <td className="px-3 py-4 font-[Urbanist]">

                              <span className="
                                inline-flex
                                min-w-[30px]
                                items-center
                                justify-center
                                rounded-md
                                border
                                border-[#9fd3ff]
                                bg-[#edf7ff]
                                px-2
                                py-1
                                text-xs
                                font-semibold
                                text-[#2388d3]
                               font-[Urbanist]">

                                {row.secondHalf}

                              </span>

                            </td>


                            {/* DAY STATUS */}

                            <td className="px-3 py-4 font-[Urbanist]">

                              <span className="
                                inline-flex
                                min-w-[30px]
                                items-center
                                justify-center
                                rounded-md
                                border
                                border-[#98e0bf]
                                bg-[#effcf6]
                                px-2
                                py-1
                                text-xs
                                font-semibold
                                text-[#12a66a]
                               font-[Urbanist]">

                                {row.dayStatus}

                              </span>

                            </td>

                          </tr>

                        ),
                      )

                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </div>


          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <div className="
            min-w-0
            overflow-hidden
            rounded-xl
            border
            border-[#e2e6ed]
            bg-white
           font-[Urbanist]">


            {/* =================================================
                PUNCH RECORD HEADER
            ================================================= */}

            <div className="
              flex
              flex-wrap
              items-center
              justify-between
              gap-3
              rounded-t-xl
              bg-[#d3e8f5]
              px-4
              py-3
             font-[Urbanist]">

              <div>

                <h2 className="
                  text-base
                  font-semibold
                  text-[#344054]
                 font-[Urbanist]">
                  Punch Records
                </h2>

                <p className="
                  text-xs
                  text-[#667085]
                 font-[Urbanist]">
                  Review, correct and add punch times
                </p>

              </div>


              {/* ACTIONS */}

              <div className="flex items-center gap-2 font-[Urbanist]">

                {/* SHOW ALL */}

                <button
                  type="button"
                  className="
                    rounded-full
                    bg-[#b9dcec]
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-[#1597e5]
                   font-[Urbanist]"
                >
                  Show All
                </button>


                {/* PERMISSION */}

                <button
                  type="button"
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-md
                    bg-[#1597e5]
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    hover:bg-[#0788d2]
                   font-[Urbanist]"
                >

                  <Plus
                    size={16}
                  />

                  Permission

                </button>


                {/* PUNCH */}

                <button
                  type="button"
                  className="
                    flex
                    items-center
                    gap-2
                    rounded-md
                    bg-[#1597e5]
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    hover:bg-[#0788d2]
                   font-[Urbanist]"
                >

                  <Plus
                    size={16}
                  />

                  Punch

                </button>

              </div>

            </div>


            {/* =================================================
                PUNCH RECORDS
            ================================================= */}

            <div className="p-4 font-[Urbanist]">

              {isLoading ? (

                <div className="
                  rounded-xl
                  border
                  border-[#e2e6ed]
                  bg-white
                  p-12
                  text-center
                  text-sm
                  text-[#98a2b3]
                 font-[Urbanist]">
                  Loading punch records...
                </div>

              ) : punchRecords.length ===
                0 ? (

                <div className="
                  rounded-xl
                  border
                  border-[#e2e6ed]
                  bg-white
                  p-12
                  text-center
                  text-sm
                  text-[#98a2b3]
                 font-[Urbanist]">
                  No punch records found.
                </div>

              ) : (

                <div className="
                  grid
                  grid-cols-1
                  gap-4
                  lg:grid-cols-2
                 font-[Urbanist]">

                  {punchRecords.map(
                    (
                      record,
                    ) => {

                      const edit =
                        edits[
                          String(
                            record.punchId,
                          )
                        ];


                      return (

                        <div
                          key={
                            record.punchId
                          }
                          className="min-w-0 font-[Urbanist]"
                        >

                          <PunchRecordCard

                            record={
                              record
                            }

                            correctedTime={
                              edit?.correctedTime ??
                              record.correctedTime ??
                              record.originalTime ??
                              ""
                            }

                            remarks={
                              edit?.remarks ??
                              record.remarks ??
                              ""
                            }

                            isSaving={
                              savingId ===
                              record.punchId
                            }

                            onCorrectedTimeChange={(
                              value,
                            ) =>
                              updateField(
                                record.punchId,
                                "correctedTime",
                                value,
                              )
                            }

                            onRemarksChange={(
                              value,
                            ) =>
                              updateField(
                                record.punchId,
                                "remarks",
                                value,
                              )
                            }

                            onSave={() =>
                              handleSave(
                                record.punchId,
                              )
                            }

                          />

                        </div>

                      );

                    },
                  )}

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
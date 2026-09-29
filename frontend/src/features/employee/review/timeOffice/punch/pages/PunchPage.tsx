import {
  useEffect,
  useState,
} from "react";

import { toast } from "react-toastify";

import {
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
import TimeOfficeTabs from "../../components/TimeOfficeTabs";
import PunchEntryModal from "@/features/admin/TalentHub/TimeOffice/components/PunchEntryModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

import {
  useReportingEmployees,
} from "../hooks/useReportingEmployees";

import {
  usePunchDashboard,
} from "../hooks/usePunchDashboard";

import {
  usePunchEditor,
} from "../hooks/usePunchEditor";
import { useAddDailyLogPunchMutation } from "@/features/admin/TalentHub/TimeOffice/api/regularizationApi";

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
  const selectedEmployee = employees.find(
    (employee) =>
      getEmployeeId(employee as Record<string, unknown>) === selectedEmployeeId,
  );


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
    selectedEmployeeId
      ? data?.employeeProfile?.[0] ??
        null
      : null;

  const attendanceSummary =
    selectedEmployeeId
      ? data?.attendanceSummary ??
        []
      : [];

  const punchRecords =
    selectedEmployeeId
      ? data?.punchRecords ??
        []
      : [];

  const [
    isPunchEntryOpen,
    setIsPunchEntryOpen,
  ] = useState(false);

  const [
    addDailyLogPunch,
  ] = useAddDailyLogPunchMutation();


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

  const handleSendPunch = async (
    direction: "In" | "Out",
    time: string,
    remarks: string,
  ) => {
    if (!selectedEmployeeId) {
      toast.error("Please select an employee first.");
      return;
    }

    try {
      await addDailyLogPunch({
        employeeId: selectedEmployeeId,
        date: selectedDate,
        punchType: direction,
        time,
        remarks,
      }).unwrap();

      toast.success("Punch sent successfully.");
      setIsPunchEntryOpen(false);
      await refetch();
    } catch (error) {
      console.error("Unable to send punch.", error);
      toast.error("Failed to send punch. Please try again.");
    }
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
    <>

    <div className="min-h-full w-full overflow-x-hidden bg-[#f4f5f9]">

      {/* ===================================================
          TOP PUNCH TOOLBAR
      =================================================== */}

      <div className="border-b border-[#e5e8ee] bg-white font-[Urbanist]">

        <div className="flex min-h-[72px] items-center justify-between gap-4 px-4 font-[Urbanist]">

          {/* =================================================
              TABS
          ================================================= */}

          <TimeOfficeTabs className="flex-1 font-[Urbanist]" />


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

        <div className="grid grid-cols-2 gap-3 border-t border-[#edf0f4] p-3 xl:hidden">

          {/* DATE */}

          <div className="min-w-0">

            <label className="mb-1 block text-xs font-medium text-[#596579] font-[Urbanist]">
              Date
            </label>

            <DateField value={selectedDate} onChange={handleDateChange} />

          </div>


          {/* EMPLOYEE */}

          <div className="min-w-0">

            <label className="mb-1 block text-xs font-medium text-[#596579] font-[Urbanist]">
              Employee
            </label>

            <Select
              value={selectedEmployeeId || null}
              onValueChange={(value) => {
                if (value !== null) {
                  handleEmployeeChange(value);
                }
              }}
              disabled={employeesLoading}
            >
              <SelectTrigger
                id="punch-employee"
                className="h-10 w-full min-w-0 rounded-md border-[#dfe4ec] bg-white text-sm text-[#344054] shadow-none focus:ring-0"
              >
                <span className="min-w-0 truncate">
                  {selectedEmployee
                    ? `${getEmployeeCode(
                        selectedEmployee as Record<string, unknown>,
                      )} - ${getEmployeeName(
                        selectedEmployee as Record<string, unknown>,
                      )}`
                    : employeesLoading
                      ? "Loading..."
                      : "Select Employee"}
                </span>
              </SelectTrigger>

              <SelectContent
                side="bottom"
                align="start"
                sideOffset={4}
                alignItemWithTrigger={false}
                className="max-h-60 w-(--anchor-width) min-w-0 max-w-[calc(100vw-2rem)] overflow-x-hidden overflow-y-auto"
              >
                {employees.map((employee) => {
                  const record = employee as Record<string, unknown>;
                  const id = getEmployeeId(record);

                  if (!id) {
                    return null;
                  }

                  return (
                    <SelectItem
                      key={id}
                      value={id}
                      className="min-w-0 whitespace-normal break-words"
                    >
                      {getEmployeeCode(record)} - {getEmployeeName(record)}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

          </div>


          {/* BUTTONS */}

          <div className="col-span-2 flex gap-2">

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
                  onClick={() => {
                    if (!selectedEmployeeId) {
                      toast.error("Please select an employee first.");
                      return;
                    }

                    setIsPunchEntryOpen(true);
                  }}
                  disabled={!selectedEmployeeId}
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
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
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
    {isPunchEntryOpen && (
      <PunchEntryModal
        date={selectedDate}
        onClose={() => setIsPunchEntryOpen(false)}
        onSave={handleSendPunch}
      />
    )}
    </>
  );
}
import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Filter,
  MoreVertical,
  Search,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PFYearlyEPFForm3APage() {
  const navigate = useNavigate();

  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const [attendanceSelected, setAttendanceSelected] = useState<string[]>(
    []
  );

  const [designationSelected, setDesignationSelected] = useState<string[]>(
    []
  );

  const filterRef = useRef<HTMLDivElement | null>(null);

  const designationOptions = [
    "ASSOCIATE SOFTWARE ENGINEER",
    "BUSINESS DEVELOPMENT EXECUTIVE",
    "BUSINESS DEVELOPMENT MANAGER",
    "Cloud DevOps Engineer",
    "Data Analyst",
    "Devops Engineer",
    "Flutter Developer",
    "HR EXECUTIVE",
    "HR MANAGER",
    "HR RECRUITER",
    "OFFICE BOY",
    "PROJECT LEAD",
    "PROJECT MANAGER",
    "Quality Analyst",
    "React Developer",
  ];

  /* =====================================================
     CLOSE DROPDOWN ON OUTSIDE CLICK
  ===================================================== */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setOpenFilter(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* =====================================================
     ATTENDANCE
  ===================================================== */

  const toggleAttendance = (value: string) => {
    setAttendanceSelected((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value]
    );
  };

  const clearAttendance = () => {
    setAttendanceSelected([]);
  };

  /* =====================================================
     DESIGNATION
  ===================================================== */

  const toggleDesignation = (value: string) => {
    setDesignationSelected((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value]
    );
  };

  const clearDesignation = () => {
    setDesignationSelected([]);
  };

  const toggleAllDesignations = () => {
    if (designationSelected.length === designationOptions.length) {
      setDesignationSelected([]);
    } else {
      setDesignationSelected([...designationOptions]);
    }
  };

  /* =====================================================
     CLEAR ALL
  ===================================================== */

  const clearAllFilters = () => {
    setAttendanceSelected([]);
    setDesignationSelected([]);
    setOpenFilter(null);
  };

  return (
    <div className="min-h-full w-full bg-[#f4f8fe] p-2 sm:p-3">

      {/* =====================================================
          TOP REPORT TABS
      ===================================================== */}

      <div className="w-full rounded-xl border-2 border-[#d8b6ad] bg-[#fff7f4] px-3 py-2 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">

          {/* PF REPORT */}

          <button
            type="button"
            className="flex h-11 min-w-[146px] items-center justify-center gap-2 rounded-lg border border-[#c99b8e] bg-white px-5 text-sm font-medium text-[#8b5e52] shadow-sm"
          >
            <ShieldIcon />
            <span>PF Report</span>
          </button>

          {/* ESI REPORT */}

          <button
            type="button"
            className="flex h-11 min-w-[146px] items-center justify-center gap-2 rounded-lg border border-[#dddddd] bg-white px-5 text-sm font-medium text-[#555555] shadow-sm"
          >
            <span className="text-xl leading-none">+</span>
            <span>ESI Report</span>
          </button>

          {/* LWF REPORT */}

          <button
            type="button"
            className="flex h-11 min-w-[146px] items-center justify-center gap-2 rounded-lg border border-[#dddddd] bg-white px-5 text-sm font-medium text-[#555555] shadow-sm"
          >
            <UsersIcon />
            <span>LWF Report</span>
          </button>

          {/* PT REPORT */}

          <button
            type="button"
            className="flex h-11 min-w-[146px] items-center justify-center gap-2 rounded-lg border border-[#dddddd] bg-white px-5 text-sm font-medium text-[#555555] shadow-sm"
          >
            <span className="text-lg font-semibold">₹</span>
            <span>PT Report</span>
          </button>
        </div>
      </div>

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="mt-5 w-full rounded-xl border border-[#ded5d1] bg-white px-4 py-3 shadow-sm">

        <div className="flex min-h-[48px] flex-wrap items-center gap-3">

          {/* TITLE */}

          <div className="flex h-10 items-center gap-2 rounded-lg border border-[#c89584] bg-white px-4 text-base font-semibold text-[#8b5e52]">
            <FileText
              size={17}
              strokeWidth={2}
            />

            <span>Yearly EPF FORM 3A</span>
          </div>

          {/* RIGHT SIDE */}

          <div className="ml-auto flex flex-wrap items-center gap-3">

            {/* DATE */}

            <button
              type="button"
              className="flex h-10 min-w-[137px] items-center justify-between gap-3 rounded-lg border border-[#e1e6ec] bg-white px-3 text-sm text-[#555555]"
            >
              <span>02-09-2026</span>

              <CalendarDays size={16} />
            </button>

            {/* PF GROUP */}

            <button
              type="button"
              className="flex h-10 min-w-[158px] items-center justify-between rounded-lg border border-[#e1e6ec] bg-white px-3 text-sm text-[#555555]"
            >
              <span>Select PF Group</span>

              <ChevronDown size={16} />
            </button>

            {/* ADVANCE FILTER */}

            <button
              type="button"
              className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#c89584] bg-white px-5 text-sm font-medium text-[#8b5e52] shadow-sm"
            >
              <span>Advance Filter</span>

              <Filter size={17} />
            </button>

            {/* BACK */}

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-10 min-w-[104px] items-center justify-center gap-2 rounded-lg bg-[#8b5e52] px-4 text-sm font-medium text-white shadow-sm hover:bg-[#74483d]"
            >
              <ChevronLeft size={18} />

              <span>Back</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          FILTER BAR
          ONE LINE
      ===================================================== */}

      <div
        ref={filterRef}
        className="relative z-40 mt-5 w-full overflow-visible rounded-xl border border-[#ded8d5] bg-white shadow-sm"
      >
        <div className="flex w-full flex-nowrap items-center gap-2 overflow-visible px-3 py-3">

          {/* SEARCH */}

          <div className="flex h-10 w-[220px] shrink items-center gap-2 rounded-lg border border-[#d9e0e8] bg-white px-3 text-sm text-[#a0a7b2]">
            <Search
              size={17}
              className="shrink-0"
            />

            <span className="truncate">
              Search...
            </span>
          </div>

          {/* ADD FILTER */}

          <button
            type="button"
            className="flex h-10 shrink-0 items-center gap-2 rounded-lg bg-[#8b5e52] px-4 text-sm font-medium text-white shadow-sm"
          >
            <span className="text-lg leading-none">
              +
            </span>

            <span>Add Filter</span>
          </button>

          {/* QUERY */}

          <FilterButton
            label="Query"
            isOpen={openFilter === "Query"}
            onClick={() =>
              setOpenFilter(
                openFilter === "Query"
                  ? null
                  : "Query"
              )
            }
          />

          {/* BRANCH */}

          <FilterButton
            label="Branch"
            isOpen={openFilter === "Branch"}
            onClick={() =>
              setOpenFilter(
                openFilter === "Branch"
                  ? null
                  : "Branch"
              )
            }
          />

          {/* SALARY STRUCTURE */}

          <FilterButton
            label="Salary Structure"
            isOpen={openFilter === "Salary Structure"}
            onClick={() =>
              setOpenFilter(
                openFilter === "Salary Structure"
                  ? null
                  : "Salary Structure"
              )
            }
          />

          {/* LEAVE */}

          <FilterButton
            label="Leave"
            isOpen={openFilter === "Leave"}
            onClick={() =>
              setOpenFilter(
                openFilter === "Leave"
                  ? null
                  : "Leave"
              )
            }
          />

          {/* ATTENDANCE */}

          <div className="relative shrink-0">

            <button
              type="button"
              onClick={() =>
                setOpenFilter(
                  openFilter === "Attendance"
                    ? null
                    : "Attendance"
                )
              }
              className={`flex h-10 items-center gap-2 whitespace-nowrap rounded-lg border px-3 text-sm ${
                openFilter === "Attendance"
                  ? "border-[#c89584] text-[#8b5e52]"
                  : "border-[#d9e0e8] text-[#555b66]"
              }`}
            >
              <span>Attendance</span>

              <ChevronDown
                size={14}
                className={`transition-transform ${
                  openFilter === "Attendance"
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {/* ATTENDANCE DROPDOWN */}

            {openFilter === "Attendance" && (
              <div className="absolute left-0 top-[46px] z-[9999] w-[225px] overflow-hidden rounded-lg border border-[#e0e0e0] bg-white shadow-xl">

                <label className="flex h-[55px] cursor-pointer items-center gap-3 border-b border-[#eeeeee] px-4 hover:bg-[#fff8f5]">

                  <input
                    type="checkbox"
                    checked={attendanceSelected.includes(
                      "Attendance"
                    )}
                    onChange={() =>
                      toggleAttendance("Attendance")
                    }
                    className="h-[19px] w-[19px] cursor-pointer accent-[#8b5e52]"
                  />

                  <span className="text-[16px] font-medium text-[#3d3d3d]">
                    Attendance
                  </span>

                </label>

                <label className="flex h-[55px] cursor-pointer items-center gap-3 border-b border-[#eeeeee] px-4 hover:bg-[#fff8f5]">

                  <input
                    type="checkbox"
                    checked={attendanceSelected.includes(
                      "Daily"
                    )}
                    onChange={() =>
                      toggleAttendance("Daily")
                    }
                    className="h-[19px] w-[19px] cursor-pointer accent-[#8b5e52]"
                  />

                  <span className="text-[16px] text-[#555555]">
                    Daily
                  </span>

                </label>

                <button
                  type="button"
                  onClick={clearAttendance}
                  disabled={
                    attendanceSelected.length === 0
                  }
                  className={`flex h-[55px] w-full items-center justify-center gap-2 ${
                    attendanceSelected.length === 0
                      ? "text-[#c5c5c5]"
                      : "text-[#8b5e52] hover:bg-[#fff8f5]"
                  }`}
                >
                  <X size={18} />
                  <span>Clear</span>
                </button>

              </div>
            )}
          </div>

          {/* DESIGNATION */}

          <div className="relative shrink-0">

            <button
              type="button"
              onClick={() =>
                setOpenFilter(
                  openFilter === "Designation"
                    ? null
                    : "Designation"
                )
              }
              className={`flex h-10 items-center gap-2 whitespace-nowrap rounded-lg border px-3 text-sm ${
                openFilter === "Designation"
                  ? "border-[#c89584] text-[#8b5e52]"
                  : "border-[#d9e0e8] text-[#555b66]"
              }`}
            >
              <span>Designation</span>

              <ChevronDown
                size={14}
                className={`transition-transform ${
                  openFilter === "Designation"
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {/* DESIGNATION DROPDOWN */}

            {openFilter === "Designation" && (
              <div className="absolute right-0 top-[46px] z-[9999] w-[395px] max-w-[calc(100vw-24px)] overflow-hidden rounded-lg border border-[#dddddd] bg-white shadow-xl">

                {/* HEADER */}

                <label className="flex h-[55px] cursor-pointer items-center gap-3 border-b border-[#eeeeee] px-4 hover:bg-[#fff8f5]">

                  <input
                    type="checkbox"
                    checked={
                      designationSelected.length ===
                      designationOptions.length
                    }
                    onChange={toggleAllDesignations}
                    className="h-[19px] w-[19px] cursor-pointer accent-[#8b5e52]"
                  />

                  <span className="text-[17px] font-medium text-[#3c3c3c]">
                    Designation
                  </span>

                </label>

                {/* OPTIONS */}

                <div className="max-h-[475px] overflow-y-auto">

                  {designationOptions.map(
                    (designation) => (
                      <label
                        key={designation}
                        className="flex min-h-[48px] cursor-pointer items-center gap-3 border-b border-[#f1f1f1] px-4 hover:bg-[#fff8f5]"
                      >

                        <input
                          type="checkbox"
                          checked={designationSelected.includes(
                            designation
                          )}
                          onChange={() =>
                            toggleDesignation(
                              designation
                            )
                          }
                          className="h-[19px] w-[19px] shrink-0 cursor-pointer accent-[#8b5e52]"
                        />

                        <span className="text-[15px] text-[#465467]">
                          {designation}
                        </span>

                      </label>
                    )
                  )}

                </div>

                {/* CLEAR */}

                <button
                  type="button"
                  onClick={clearDesignation}
                  disabled={
                    designationSelected.length === 0
                  }
                  className={`flex h-[55px] w-full items-center justify-center gap-2 border-t border-[#eeeeee] ${
                    designationSelected.length === 0
                      ? "text-[#c5c5c5]"
                      : "text-[#8b5e52] hover:bg-[#fff8f5]"
                  }`}
                >
                  <X size={18} />
                  <span>Clear</span>
                </button>

              </div>
            )}
          </div>

          {/* EMP STATUS */}

          <FilterButton
            label="Emp Status"
            isOpen={openFilter === "Emp Status"}
            onClick={() =>
              setOpenFilter(
                openFilter === "Emp Status"
                  ? null
                  : "Emp Status"
              )
            }
          />

          {/* MORE */}

          <button
            type="button"
            className="flex h-10 w-7 shrink-0 items-center justify-center text-[#8d8886]"
          >
            <MoreVertical size={18} />
          </button>

          {/* CLEAR */}

          <button
            type="button"
            onClick={clearAllFilters}
            className="flex h-10 shrink-0 items-center gap-1 whitespace-nowrap text-sm text-[#777777]"
          >
            <X size={15} />
            <span>Clear</span>
          </button>

        </div>
      </div>

      {/* =====================================================
          FORM 3A TABLE
          SAME TABLE STYLE AS SAMPLE 6A
      ===================================================== */}

      <div className="mt-6 w-full overflow-hidden rounded-xl border border-[#bfc1c3] bg-white shadow-sm">

        <div className="w-full overflow-x-auto">

          <table className="w-full min-w-[1050px] border-collapse">

            {/* HEADER */}

            <thead>

              <tr className="bg-[#fff1ec] text-left text-xs font-semibold text-[#423a37]">

                <th className="px-3 py-4">
                  Sl.
                </th>

                <th className="px-3 py-4">
                  Account No.
                </th>

                <th className="px-3 py-4">
                  Name of Member
                </th>

                <th className="px-3 py-4 text-center">
                  Wages
                </th>

                <th className="px-3 py-4 text-center">
                  Employee
                  <br />
                  Contribution
                </th>

                <th className="px-3 py-4 text-center">
                  Employer
                  <br />
                  Contribution
                </th>

                <th className="px-3 py-4 text-center">
                  Pension
                  <br />
                  Fund
                </th>

                <th className="px-3 py-4 text-center">
                  Remarks
                </th>

              </tr>

            </thead>

            {/* DATA */}

            <tbody>

              <Form3ARow
                sl="1"
                account="102256232603"
                name="Rama Veera Manikanta Pusunuri"
                wages="146300"
                employee="17556"
                employer="0"
                pension="8750"
              />

              <Form3ARow
                sl="2"
                account="102015096127"
                name="Umar Sharief Shaik"
                wages="79461"
                employee="9535"
                employer="0"
                pension="5650"
              />

              <Form3ARow
                sl="3"
                account="102338420795"
                name="Tharun Nagarjunapu"
                wages="37800"
                employee="4536"
                employer="0"
                pension="3150"
              />

              <Form3ARow
                sl="4"
                account="102174501947"
                name="Divyasree Tarugu"
                wages="79461"
                employee="9535"
                employer="0"
                pension="5650"
              />

              <Form3ARow
                sl="5"
                account="101483081741"
                name="Daniel Raju Ravi"
                wages="212136"
                employee="25456"
                employer="0"
                pension="5000"
              />

              <Form3ARow
                sl="4"
                account="102174501947"
                name="Rajesh Reddy Thuti"
                wages="79461"
                employee="9535"
                employer="0"
                pension="5650"
              />

            </tbody>

          </table>

        </div>

        {/* ===================================================
            PAGINATION
        =================================================== */}

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#e0e4e8] px-4 py-2 text-xs text-[#777777]">

          <span>
            Rows per page
          </span>

          <button
            type="button"
            className="flex h-7 items-center gap-1 rounded-md border border-[#e1e5e9] bg-white px-2 text-xs text-[#555555]"
          >
            10
            <ChevronDown size={13} />
          </button>

          <span>
            1 to 10 of 78
          </span>

          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-[#e1e5e9] bg-white text-[#777777]"
          >
            <ChevronLeft size={15} />
          </button>

          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-md bg-[#edf4ff] text-[#5c8fd4]"
          >
            1
          </button>

          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded-md border border-[#e1e5e9] bg-white text-[#777777]"
          >
            <ChevronRight size={15} />
          </button>

        </div>

      </div>

    </div>
  );
}

/* ==========================================================
   FILTER BUTTON
========================================================== */

function FilterButton({
  label,
  isOpen,
  onClick,
}: {
  label: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border px-3 text-sm ${
        isOpen
          ? "border-[#c89584] text-[#8b5e52]"
          : "border-[#d9e0e8] text-[#555b66]"
      }`}
    >
      <span>{label}</span>

      <ChevronDown
        size={14}
        className={`transition-transform ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
  );
}

/* ==========================================================
   FORM 3A ROW
========================================================== */

function Form3ARow({
  sl,
  account,
  name,
  wages,
  employee,
  employer,
  pension,
}: {
  sl: string;
  account: string;
  name: string;
  wages: string;
  employee: string;
  employer: string;
  pension: string;
}) {
  return (
    <tr className="border-t border-[#dfe4e8] bg-white text-sm text-[#26364d]">

      <td className="px-3 py-3.5">
        {sl}
      </td>

      <td className="whitespace-nowrap px-3 py-3.5">
        {account}
      </td>

      <td className="whitespace-nowrap px-3 py-3.5">
        {name}
      </td>

      <td className="px-3 py-3.5 text-center">
        {wages}
      </td>

      <td className="px-3 py-3.5 text-center">
        {employee}
      </td>

      <td className="px-3 py-3.5 text-center">
        {employer}
      </td>

      <td className="px-3 py-3.5 text-center">
        {pension}
      </td>

      <td className="px-3 py-3.5 text-center">
        -
      </td>

    </tr>
  );
}

/* ==========================================================
   SHIELD ICON
========================================================== */

function ShieldIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3L19 6V11C19 16 16 19 12 21C8 19 5 16 5 11V6L12 3Z" />
    </svg>
  );
}

/* ==========================================================
   USERS ICON
========================================================== */

function UsersIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 21V19C16 16.8 14.2 15 12 15H6C3.8 15 2 16.8 2 19V21" />

      <circle
        cx="9"
        cy="7"
        r="4"
      />

      <path d="M22 21V19C22 17.2 20.8 15.7 19 15.2" />

      <path d="M16 3.2C17.7 3.7 19 5.2 19 7C19 8.8 17.7 10.3 16 10.8" />
    </svg>
  );
}
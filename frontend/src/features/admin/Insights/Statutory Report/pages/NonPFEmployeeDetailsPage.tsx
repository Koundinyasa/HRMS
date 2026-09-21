import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  FileText,
  Filter,
  MoreVertical,
  Search,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NonPFEmployeeDetailsPage() {
  const navigate = useNavigate();

  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const [attendanceSelected, setAttendanceSelected] = useState<string[]>(
    []
  );

  const [designationSelected, setDesignationSelected] = useState<string[]>(
    []
  );

  const filterRef = useRef<HTMLDivElement>(null);

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
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ===================================================== */

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setOpenFilter(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  /* =====================================================
     ATTENDANCE
  ===================================================== */

  const toggleAttendance = (value: string) => {
    setAttendanceSelected((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  /* =====================================================
     DESIGNATION
  ===================================================== */

  const toggleDesignation = (value: string) => {
    setDesignationSelected((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const toggleAllDesignations = () => {
    if (designationSelected.length === designationOptions.length) {
      setDesignationSelected([]);
    } else {
      setDesignationSelected([...designationOptions]);
    }
  };

  /* =====================================================
     CLEAR
  ===================================================== */

  const clearAll = () => {
    setAttendanceSelected([]);
    setDesignationSelected([]);
    setOpenFilter(null);
  };

  return (
    <div className="min-h-full w-full bg-[#f4f8fe] p-3 sm:p-4">

      {/* ==================================================
          TOP PF REPORT TABS
      ================================================== */}

      <div className="w-full rounded-xl border border-[#d8b6ad] bg-[#fff7f4] px-3 py-2 shadow-sm">

        <div className="flex items-center gap-4">

          {/* PF REPORT */}

          <button
            type="button"
            className="flex h-11 min-w-[146px] items-center justify-center gap-2 rounded-lg border border-[#c89584] bg-white px-5 text-sm font-medium text-[#8b5e52] shadow-sm"
          >
            <ShieldIcon />
            PF Report
          </button>

          {/* ESI REPORT */}

          <button
            type="button"
            className="flex h-11 min-w-[146px] items-center justify-center gap-2 rounded-lg border border-[#dddddd] bg-white px-5 text-sm font-medium text-[#555555] shadow-sm"
          >
            <span className="text-xl leading-none">+</span>
            ESI Report
          </button>

          {/* LWF REPORT */}

          <button
            type="button"
            className="flex h-11 min-w-[146px] items-center justify-center gap-2 rounded-lg border border-[#dddddd] bg-white px-5 text-sm font-medium text-[#555555] shadow-sm"
          >
            <UsersIcon />
            LWF Report
          </button>

          {/* PT REPORT */}

          <button
            type="button"
            className="flex h-11 min-w-[146px] items-center justify-center gap-2 rounded-lg border border-[#dddddd] bg-white px-5 text-sm font-medium text-[#555555] shadow-sm"
          >
            <span className="text-lg font-semibold">₹</span>
            PT Report
          </button>

        </div>
      </div>

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="mt-5 w-full rounded-xl border border-[#d8d5d3] bg-white px-4 py-2 shadow-sm">

        <div className="flex min-h-[54px] items-center">

          {/* TITLE */}

          <div className="flex h-10 items-center gap-2 rounded-lg border border-[#c89584] bg-white px-4 text-sm font-semibold text-[#8b5e52]">

            <FileText size={17} />

            <span>
              Non PF Employee Details
            </span>

          </div>

          {/* RIGHT SIDE */}

          <div className="ml-auto flex items-center gap-3">

            {/* GENERATE */}

            <button
              type="button"
              className="flex h-10 items-center justify-center rounded-lg bg-[#2296e8] px-7 text-sm font-semibold text-white shadow-sm"
            >
              Generate
            </button>

            {/* FILTER */}

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center text-[#8b5e52]"
            >
              <Filter size={19} />
            </button>

            {/* HISTORY */}

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center text-[#8b5e52]"
            >
              <HistoryIcon />
            </button>

          </div>
        </div>
      </div>

      {/* ==================================================
          DATE / PF GROUP / BACK
      ================================================== */}

      <div className="mt-1 w-full rounded-xl border border-[#d8d5d3] bg-white px-4 shadow-sm">

        <div className="flex min-h-[54px] items-center justify-end gap-3">

          {/* BACK */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-10 items-center gap-2 rounded-lg border border-[#bfc2c5] bg-white px-5 text-sm font-medium text-[#555555]"
          >
            <ChevronLeft size={18} />
            Back
          </button>

          {/* MONTH */}

          <button
            type="button"
            className="flex h-10 min-w-[180px] items-center justify-between rounded-lg bg-[#eef2f7] px-4 text-sm text-[#374151]"
          >
            <span>
              Sep/2026
            </span>

            <ChevronDown size={16} />
          </button>

          {/* PF GROUP */}

          <button
            type="button"
            className="flex h-10 min-w-[195px] items-center justify-between rounded-lg border border-[#dfe3e8] bg-white px-4 text-sm text-[#374151]"
          >
            <span>
              Select PF Group
            </span>

            <ChevronDown size={16} />
          </button>

        </div>
      </div>

      {/* ==================================================
          FILTER BAR
      ================================================== */}

      <div
        ref={filterRef}
        className="relative z-40 mt-1 w-full rounded-xl border border-[#d8d5d3] bg-white px-3 shadow-sm"
      >

        <div className="flex h-[54px] w-full flex-nowrap items-center gap-2 overflow-visible">

          {/* SEARCH */}

          <div className="flex min-w-[200px] flex-1 items-center gap-2 px-2 text-sm text-[#a0a7b2]">

            <Search size={18} />

            <span>
              Search...
            </span>

          </div>

          {/* ADD FILTER */}

          <button
            type="button"
            className="flex h-9 shrink-0 items-center gap-2 rounded-lg bg-[#8b5e52] px-4 text-sm font-medium text-white"
          >
            <span className="text-lg leading-none">
              +
            </span>

            Add Filter
          </button>

          {/* QUERY */}

          <FilterButton
            label="Query"
            open={openFilter === "Query"}
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
            open={openFilter === "Branch"}
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
            open={openFilter === "Salary Structure"}
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
            open={openFilter === "Leave"}
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
              className="flex h-9 items-center gap-2 whitespace-nowrap rounded-lg border border-[#dfe3e8] px-3 text-sm text-[#555555]"
            >
              Attendance

              <ChevronDown
                size={14}
                className={
                  openFilter === "Attendance"
                    ? "rotate-180"
                    : ""
                }
              />
            </button>

            {openFilter === "Attendance" && (
              <div className="absolute left-0 top-[43px] z-[9999] w-[225px] overflow-hidden rounded-lg border border-[#dddddd] bg-white shadow-xl">

                <label className="flex h-[55px] items-center gap-3 border-b border-[#eeeeee] px-4">

                  <input
                    type="checkbox"
                    checked={attendanceSelected.includes(
                      "Attendance"
                    )}
                    onChange={() =>
                      toggleAttendance("Attendance")
                    }
                    className="h-[19px] w-[19px] accent-[#8b5e52]"
                  />

                  <span className="text-[15px] font-medium">
                    Attendance
                  </span>

                </label>

                <label className="flex h-[55px] items-center gap-3 border-b border-[#eeeeee] px-4">

                  <input
                    type="checkbox"
                    checked={attendanceSelected.includes(
                      "Daily"
                    )}
                    onChange={() =>
                      toggleAttendance("Daily")
                    }
                    className="h-[19px] w-[19px] accent-[#8b5e52]"
                  />

                  <span className="text-[15px]">
                    Daily
                  </span>

                </label>

                <button
                  type="button"
                  onClick={() =>
                    setAttendanceSelected([])
                  }
                  className="flex h-[55px] w-full items-center justify-center gap-2 text-[#999999]"
                >
                  <X size={17} />
                  Clear
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
              className="flex h-9 items-center gap-2 whitespace-nowrap rounded-lg border border-[#dfe3e8] px-3 text-sm text-[#555555]"
            >
              Designation

              <ChevronDown
                size={14}
                className={
                  openFilter === "Designation"
                    ? "rotate-180"
                    : ""
                }
              />
            </button>

            {openFilter === "Designation" && (
              <div className="absolute right-0 top-[43px] z-[9999] w-[395px] max-w-[calc(100vw-20px)] overflow-hidden rounded-lg border border-[#dddddd] bg-white shadow-xl">

                {/* HEADER */}

                <label className="flex h-[55px] items-center gap-3 border-b border-[#eeeeee] px-4">

                  <input
                    type="checkbox"
                    checked={
                      designationSelected.length ===
                      designationOptions.length
                    }
                    onChange={toggleAllDesignations}
                    className="h-[19px] w-[19px] accent-[#8b5e52]"
                  />

                  <span className="text-[16px] font-medium">
                    Designation
                  </span>

                </label>

                {/* OPTIONS */}

                <div className="max-h-[430px] overflow-y-auto">

                  {designationOptions.map(
                    (designation) => (
                      <label
                        key={designation}
                        className="flex min-h-[48px] items-center gap-3 border-b border-[#f1f1f1] px-4"
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
                          className="h-[19px] w-[19px] accent-[#8b5e52]"
                        />

                        <span className="text-sm text-[#465467]">
                          {designation}
                        </span>

                      </label>
                    )
                  )}

                </div>

                {/* CLEAR */}

                <button
                  type="button"
                  onClick={() =>
                    setDesignationSelected([])
                  }
                  className="flex h-[55px] w-full items-center justify-center gap-2 border-t border-[#eeeeee] text-[#999999]"
                >
                  <X size={17} />
                  Clear
                </button>

              </div>
            )}
          </div>

          {/* EMP STATUS */}

          <FilterButton
            label="Emp Status"
            open={openFilter === "Emp Status"}
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
            className="flex h-9 w-7 shrink-0 items-center justify-center text-[#888888]"
          >
            <MoreVertical size={18} />
          </button>

          {/* CLEAR */}

          <button
            type="button"
            onClick={clearAll}
            className="flex h-9 shrink-0 items-center gap-1 whitespace-nowrap px-1 text-sm text-[#777777]"
          >
            <X size={16} />
            Clear
          </button>

        </div>
      </div>

      {/* ==================================================
          NO DATA
      ================================================== */}

      <div className="flex min-h-[500px] w-full flex-col items-center pt-10">

        <NoDataIllustration />

        <p className="mt-2 text-[18px] font-medium text-[#17243a]">
          Did Not Find Any Pf Report
        </p>

      </div>

    </div>
  );
}

/* ==========================================================
   FILTER BUTTON
========================================================== */

function FilterButton({
  label,
  open,
  onClick,
}: {
  label: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-[#dfe3e8] px-3 text-sm text-[#555555]"
    >
      {label}

      <ChevronDown
        size={14}
        className={open ? "rotate-180" : ""}
      />
    </button>
  );
}

/* ==========================================================
   NO DATA
========================================================== */

function NoDataIllustration() {
  return (
    <div className="relative flex h-[250px] w-[330px] items-center justify-center">

      <div className="absolute h-[220px] w-[220px] rounded-full bg-[#f0f3ff]" />

      <div className="relative">

        <div className="h-[135px] w-[155px] rounded-md border-[4px] border-[#dfe5f0] bg-white">

          <div className="h-[18px] bg-[#91a7ed]" />

          <div className="flex flex-col items-center pt-5">

            <div className="flex h-[52px] w-[43px] items-center justify-center bg-[#9bb0ed]">

              <span className="text-2xl text-white">
                ☹
              </span>

            </div>

            <span className="mt-2 text-[8px] font-bold text-[#28364b]">
              NO DATA
            </span>

          </div>
        </div>

        <div className="absolute -bottom-3 left-[88px] h-8 w-12 rounded-t-full bg-[#26364d]" />

        <div className="absolute -bottom-1 left-[98px] h-6 w-6 rounded-full bg-[#e3a25d]" />

        <div className="absolute -bottom-1 left-[60px] h-3 w-[125px] rounded-sm bg-[#9aaef0]" />

      </div>

      <div className="absolute bottom-2 h-[3px] w-[280px] rounded-full bg-[#d6dce7]" />

    </div>
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
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 21V19C16 16.8 14.2 15 12 15H6C3.8 15 2 16.8 2 19V21" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21V19C22 17.2 20.8 15.7 19 15.2" />
      <path d="M16 3.2C17.7 3.7 19 5.2 19 7C19 8.8 17.7 10.3 16 10.8" />
    </svg>
  );
}

/* ==========================================================
   HISTORY ICON
========================================================== */

function HistoryIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7V12L15 14" />
    </svg>
  );
}
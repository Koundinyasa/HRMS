import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ChevronDown,
  FileSpreadsheet,
  Filter,
  MoreVertical,
  Plus,
  Search,
  Shield,
  Users,
  IndianRupee,
  X,
  FileText,
} from "lucide-react";

/* =========================================================
   FILTER DROPDOWN
========================================================= */

interface FilterDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function FilterDropdown({
  label,
  value,
  options,
  onChange,
}: FilterDropdownProps) {
  return (
    <div className="relative flex shrink-0 items-center">
      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="
          h-[42px]
          appearance-none
          border-none
          bg-transparent
          px-1
          pr-7
          text-[15px]
          font-medium
          text-[#747783]
          outline-none
        "
      >
        <option value="">
          {label}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={15}
        strokeWidth={1.8}
        className="
          pointer-events-none
          absolute
          right-1
          top-1/2
          -translate-y-1/2
          text-[#777]
        "
      />
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState() {
  return (
    <div
      className="
        flex
        min-h-[470px]
        w-full
        flex-col
        items-center
        justify-center
        bg-[#f3f6fb]
      "
    >
      {/* ===================================================
          ILLUSTRATION
      =================================================== */}

      <div className="relative mb-5 h-[225px] w-[350px]">

        {/* SOFT BACKGROUND */}

        <div
          className="
            absolute
            left-1/2
            top-[20px]
            h-[180px]
            w-[180px]
            -translate-x-1/2
            rounded-full
            bg-[#f1f4ff]
          "
        />

        {/* DECORATIVE CIRCLES */}

        <div
          className="
            absolute
            left-[42px]
            top-[58px]
            h-[35px]
            w-[35px]
            rounded-full
            border-[2px]
            border-dashed
            border-[#d8ddec]
          "
        />

        <div
          className="
            absolute
            right-[48px]
            top-[42px]
            h-[42px]
            w-[42px]
            rounded-full
            border-[2px]
            border-dashed
            border-[#d8ddec]
          "
        />

        <div
          className="
            absolute
            left-[75px]
            top-[112px]
            h-[28px]
            w-[28px]
            rounded-full
            border-[2px]
            border-dashed
            border-[#d8ddec]
          "
        />

        {/* DOCUMENT */}

        <div
          className="
            absolute
            left-1/2
            top-[55px]
            h-[105px]
            w-[105px]
            -translate-x-1/2
            rounded-t-md
            bg-[#f4f6ff]
            shadow-sm
          "
        >
          {/* DOCUMENT TOP */}

          <div
            className="
              flex
              h-[14px]
              items-center
              gap-[3px]
              rounded-t-md
              bg-[#7e8ff0]
              px-1
            "
          >
            <span className="h-[3px] w-[3px] rounded-full bg-white" />
            <span className="h-[3px] w-[3px] rounded-full bg-white" />
            <span className="h-[3px] w-[3px] rounded-full bg-white" />
          </div>

          {/* DOCUMENT BODY */}

          <div className="flex h-[91px] flex-col items-center justify-center">
            <div
              className="
                relative
                flex
                h-[48px]
                w-[38px]
                items-center
                justify-center
                bg-[#8594ee]
              "
            >
              <div
                className="
                  absolute
                  right-0
                  top-0
                  h-[12px]
                  w-[12px]
                  border-b
                  border-l
                  border-[#dce1ff]
                  bg-[#bfc7fa]
                "
              />

              <Users
                size={21}
                strokeWidth={1.8}
                className="text-white"
              />
            </div>

            <span
              className="
                mt-2
                text-[7px]
                font-bold
                tracking-wide
                text-[#26304b]
              "
            >
              NO DATA
            </span>
          </div>
        </div>

        {/* PERSON - SIMPLE ILLUSTRATION */}

        <div
          className="
            absolute
            bottom-[22px]
            right-[73px]
            flex
            flex-col
            items-center
          "
        >
          {/* HEAD */}

          <div
            className="
              h-[17px]
              w-[17px]
              rounded-full
              bg-[#f1c6a6]
            "
          />

          {/* HAIR */}

          <div
            className="
              absolute
              top-[-2px]
              h-[7px]
              w-[18px]
              rounded-t-full
              bg-[#24211f]
            "
          />

          {/* BODY */}

          <div
            className="
              mt-[3px]
              h-[34px]
              w-[40px]
              rounded-t-[14px]
              bg-[#27375c]
            "
          />

          {/* LAPTOP */}

          <div
            className="
              absolute
              top-[26px]
              h-[20px]
              w-[42px]
              rounded-sm
              bg-[#8190ed]
            "
          />
        </div>

        {/* FLOOR LINE */}

        <div
          className="
            absolute
            bottom-[17px]
            left-[75px]
            h-[2px]
            w-[200px]
            bg-[#d7dbe3]
          "
        />
      </div>

      {/* ===================================================
          EMPTY TEXT
      =================================================== */}

      <p
        className="
          text-center
          text-[18px]
          font-medium
          text-[#303a4c]
        "
      >
        Did Not Find Any Esi Report
      </p>
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default function ESISupplementaryReportPage() {
  const navigate = useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [month, setMonth] = useState("Sep/2026");

  const [esiGroup, setEsiGroup] =
    useState("");

  const [searchText, setSearchText] =
    useState("");

  const [showFilters, setShowFilters] =
    useState(true);

  const [query, setQuery] =
    useState("");

  const [branch, setBranch] =
    useState("");

  const [salaryStructure, setSalaryStructure] =
    useState("");

  const [leave, setLeave] =
    useState("");

  const [attendance, setAttendance] =
    useState("");

  const [designation, setDesignation] =
    useState("");

  const [employeeStatus, setEmployeeStatus] =
    useState("");

  /* =======================================================
     BACK
  ======================================================= */

  const handleBack = () => {
    navigate(-1);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        min-h-screen
        w-full
        bg-[#f3f6fb]
        p-3
        sm:p-4
      "
    >

      {/* ===================================================
          TOP REPORT NAVIGATION
      =================================================== */}

      <div
        className="
          rounded-md
          bg-white
          shadow-sm
        "
      >
        <div
          className="
            flex
            min-h-[70px]
            items-center
            justify-between
            px-5
          "
        >

          {/* LEFT NAVIGATION */}

          <div
            className="
              flex
              h-full
              items-center
              gap-8
              overflow-x-auto
            "
          >

            {/* PF */}

            <button
              type="button"
              onClick={() =>
                navigate("../..")
              }
              className="
                relative
                flex
                h-[70px]
                shrink-0
                items-center
                gap-2
                px-1
                text-[17px]
                font-medium
                text-[#666a73]
              "
            >
              <Shield
                size={18}
                strokeWidth={1.8}
              />

              <span>PF Report</span>
            </button>

            {/* ESI ACTIVE */}

            <button
              type="button"
              className="
                relative
                flex
                h-[70px]
                shrink-0
                items-center
                gap-2
                px-1
                text-[17px]
                font-semibold
                text-[#1598e5]
              "
            >
              <Plus
                size={18}
                strokeWidth={1.8}
              />

              <span>ESI Report</span>

              <span
                className="
                  absolute
                  bottom-0
                  left-0
                  right-0
                  h-[3px]
                  bg-[#1598e5]
                "
              />
            </button>

            {/* LWF */}

            <button
              type="button"
              onClick={() =>
                navigate("../../lwf")
              }
              className="
                flex
                h-[70px]
                shrink-0
                items-center
                gap-2
                px-1
                text-[17px]
                font-medium
                text-[#666a73]
              "
            >
              <Users
                size={18}
                strokeWidth={1.8}
              />

              <span>LWF Report</span>
            </button>

            {/* PT */}

            <button
              type="button"
              onClick={() =>
                navigate("../../pt")
              }
              className="
                flex
                h-[70px]
                shrink-0
                items-center
                gap-2
                px-1
                text-[17px]
                font-medium
                text-[#666a73]
              "
            >
              <IndianRupee
                size={18}
                strokeWidth={1.8}
              />

              <span>PT Report</span>
            </button>
          </div>

          {/* RIGHT ICONS */}

          <div
            className="
              hidden
              shrink-0
              items-center
              gap-7
              pr-2
              sm:flex
            "
          >
            <Filter
              size={23}
              strokeWidth={1.8}
              className="text-[#92a0bc]"
            />

            <span
              className="
                text-[28px]
                leading-none
                text-[#92a0bc]
              "
            >
              ◌
            </span>
          </div>
        </div>
      </div>

      {/* ===================================================
          REPORT HEADER
      =================================================== */}

      <div
        className="
          mt-3
          rounded-md
          bg-white
          shadow-sm
        "
      >
        <div
          className="
            flex
            min-h-[86px]
            flex-wrap
            items-center
            justify-between
            gap-3
            px-5
          "
        >

          {/* TITLE */}

          <div>
            <div
              className="
                border-b-[3px]
                border-[#1598e5]
                pb-3
              "
            >
              <h1
                className="
                  text-[18px]
                  font-semibold
                  text-[#1598e5]
                "
              >
                Supplementary Report
              </h1>
            </div>
          </div>

          {/* HEADER CONTROLS */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-3
            "
          >

            {/* BACK */}

            <button
              type="button"
              onClick={handleBack}
              className="
                flex
                h-[48px]
                min-w-[116px]
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-[#c9c9c9]
                bg-white
                px-5
                text-[15px]
                font-medium
                text-[#333333]
                shadow-sm
              "
            >
              <ArrowLeft
                size={20}
                strokeWidth={1.8}
              />

              <span>Back</span>
            </button>

            {/* MONTH */}

            <div className="relative">
              <select
                value={month}
                onChange={(event) =>
                  setMonth(event.target.value)
                }
                className="
                  h-[48px]
                  min-w-[185px]
                  appearance-none
                  rounded-lg
                  border
                  border-[#dce0e8]
                  bg-[#eef1f7]
                  px-4
                  pr-10
                  text-[15px]
                  text-[#1e293b]
                  outline-none
                "
              >
                <option value="Sep/2026">
                  Sep/2026
                </option>

                <option value="Aug/2026">
                  Aug/2026
                </option>

                <option value="Jul/2026">
                  Jul/2026
                </option>

                <option value="Jun/2026">
                  Jun/2026
                </option>
              </select>

              <ChevronDown
                size={17}
                strokeWidth={1.8}
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-[#777]
                "
              />
            </div>

            {/* ESI GROUP */}

            <div className="relative">
              <select
                value={esiGroup}
                onChange={(event) =>
                  setEsiGroup(
                    event.target.value
                  )
                }
                className="
                  h-[48px]
                  min-w-[200px]
                  appearance-none
                  rounded-lg
                  border
                  border-[#d9dce3]
                  bg-white
                  px-4
                  pr-10
                  text-[15px]
                  text-[#243044]
                  outline-none
                "
              >
                <option value="">
                  Select ESI Group
                </option>

                <option value="Group 1">
                  Group 1
                </option>

                <option value="Group 2">
                  Group 2
                </option>

                <option value="Group 3">
                  Group 3
                </option>
              </select>

              <ChevronDown
                size={17}
                strokeWidth={1.8}
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-[#777]
                "
              />
            </div>

            {/* ADVANCE FILTER */}

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (value) => !value
                )
              }
              className="
                flex
                h-[48px]
                items-center
                gap-3
                rounded-lg
                bg-[#1598e5]
                px-5
                text-[15px]
                font-medium
                text-white
                shadow-sm
              "
            >
              <Filter
                size={20}
                strokeWidth={2}
              />

              <span>
                Advance Filter
              </span>
            </button>

            {/* PDF */}

            <button
              type="button"
              title="Export PDF"
              className="
                flex
                h-[42px]
                w-[34px]
                items-center
                justify-center
              "
            >
              <span
                className="
                  rounded
                  bg-[#e53935]
                  px-1
                  py-[3px]
                  text-[9px]
                  font-bold
                  text-white
                "
              >
                PDF
              </span>
            </button>

            {/* EXCEL */}

            <button
              type="button"
              title="Export Excel"
              className="
                flex
                h-[42px]
                w-[34px]
                items-center
                justify-center
              "
            >
              <FileSpreadsheet
                size={27}
                strokeWidth={1.8}
                className="text-[#299447]"
              />
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================
          FILTER BAR
      =================================================== */}

      {showFilters && (
        <div
          className="
            mt-2
            rounded-md
            bg-white
            shadow-sm
          "
        >
          <div
            className="
              flex
              min-h-[52px]
              items-center
              gap-5
              overflow-x-auto
              px-4
            "
          >

            {/* SEARCH */}

            <div
              className="
                flex
                min-w-[270px]
                flex-1
                items-center
                gap-3
                text-[#9ca6bd]
              "
            >
              <Search
                size={22}
                strokeWidth={1.8}
              />

              <input
                type="text"
                value={searchText}
                onChange={(event) =>
                  setSearchText(
                    event.target.value
                  )
                }
                placeholder="Start Typing..."
                className="
                  w-full
                  border-none
                  bg-transparent
                  text-[15px]
                  outline-none
                  placeholder:text-[#d2d5dd]
                "
              />
            </div>

            {/* ADD FILTER */}

            <button
              type="button"
              className="
                flex
                min-w-fit
                items-center
                gap-2
                text-[15px]
                font-medium
                text-[#737785]
              "
            >
              <Plus
                size={21}
                strokeWidth={1.8}
              />

              <span>
                Add Filter
              </span>
            </button>

            {/* QUERY */}

            <FilterDropdown
              label="Query"
              value={query}
              options={[
                "All",
                "Active",
                "Inactive",
              ]}
              onChange={setQuery}
            />

            {/* BRANCH */}

            <FilterDropdown
              label="Branch"
              value={branch}
              options={[
                "Hyderabad",
                "Bangalore",
                "Chennai",
              ]}
              onChange={setBranch}
            />

            {/* SALARY STRUCTURE */}

            <FilterDropdown
              label="Salary Structure"
              value={salaryStructure}
              options={[
                "Monthly",
                "Annual",
              ]}
              onChange={setSalaryStructure}
            />

            {/* LEAVE */}

            <FilterDropdown
              label="Leave"
              value={leave}
              options={[
                "Available",
                "Not Available",
              ]}
              onChange={setLeave}
            />

            {/* ATTENDANCE */}

            <FilterDropdown
              label="Attendance"
              value={attendance}
              options={[
                "Present",
                "Absent",
              ]}
              onChange={setAttendance}
            />

            {/* DESIGNATION */}

            <FilterDropdown
              label="Designation"
              value={designation}
              options={[
                "Employee",
                "Manager",
              ]}
              onChange={setDesignation}
            />

            {/* EMP STATUS */}

            <FilterDropdown
              label="Emp Status"
              value={employeeStatus}
              options={[
                "Active",
                "Inactive",
              ]}
              onChange={setEmployeeStatus}
            />

            {/* MORE */}

            <button
              type="button"
              className="
                flex
                shrink-0
                items-center
                justify-center
                text-[#8d94a5]
              "
            >
              <MoreVertical
                size={23}
                strokeWidth={1.8}
              />
            </button>

            {/* CLOSE */}

            <button
              type="button"
              onClick={() =>
                setShowFilters(false)
              }
              className="
                flex
                shrink-0
                items-center
                justify-center
                text-[#e33b3b]
              "
            >
              <X
                size={23}
                strokeWidth={1.8}
              />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================
          EMPTY REPORT AREA
      =================================================== */}

      <div
        className="
          mt-0
          overflow-hidden
          rounded-b-md
        "
      >
        <EmptyState />
      </div>
    </div>
  );
}
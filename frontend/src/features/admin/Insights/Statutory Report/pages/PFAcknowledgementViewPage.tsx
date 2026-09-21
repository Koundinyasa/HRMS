import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ChevronDown,
  Search,
  Plus,
  MoreVertical,
  X,
  ShieldCheck,
  Users,
  FileText,
  FileSpreadsheet,
  Filter,
} from "lucide-react";

export default function PFAcknowledgementViewPage() {
  const navigate = useNavigate();

  /* ======================================================
     STATES
  ====================================================== */

  const [fromMonth, setFromMonth] = useState("2026-09");

  const [toMonth, setToMonth] = useState("2026-09");

  const [pfGroup, setPfGroup] = useState("");

  const [searchText, setSearchText] = useState("");

  const [showMore, setShowMore] = useState(false);

  /* ======================================================
     EXPORT EXCEL
  ====================================================== */

  const handleExportExcel = () => {
    console.log("Export PF Acknowledgement View");
  };

  /* ======================================================
     CLEAR SEARCH
  ====================================================== */

  const handleClear = () => {
    setSearchText("");
  };

  /* ======================================================
     COMMON STYLES
  ====================================================== */

  const tabButton =
    "flex h-[31px] shrink-0 items-center gap-1.5 rounded-md border bg-white px-4 text-[11px] font-medium transition";

  const filterButton =
    "flex items-center gap-1.5 whitespace-nowrap text-[11px] font-medium text-[#666] transition hover:text-[#8d4e3e]";

  return (
    <div
      className="
        min-h-screen
        bg-[#f6f8fb]
        px-3
        py-3
        sm:px-4
        md:px-5
        lg:px-7
      "
    >
      {/* ==================================================
          TOP REPORT NAVIGATION
      ================================================== */}

      <div
        className="
          mb-3
          w-full
          rounded-[9px]
          border
          border-[#d9a99b]
          bg-[#fff7f4]
          px-3
          py-2
        "
      >
        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3
          "
        >
          {/* PF REPORT */}

          <button
            type="button"
            className={`
              ${tabButton}
              border-[#a96554]
              text-[#824838]
              shadow-sm
            `}
          >
            <ShieldCheck size={14} />

            <span>PF Report</span>
          </button>

          {/* ESI REPORT */}

          <button
            type="button"
            className={`
              ${tabButton}
              border-[#d3d9de]
              text-[#333]
              hover:border-[#a96554]
              hover:text-[#824838]
            `}
          >
            <Plus size={14} />

            <span>ESI Report</span>
          </button>

          {/* LWF REPORT */}

          <button
            type="button"
            className={`
              ${tabButton}
              border-[#d3d9de]
              text-[#333]
              hover:border-[#a96554]
              hover:text-[#824838]
            `}
          >
            <Users size={14} />

            <span>LWF Report</span>
          </button>

          {/* PT REPORT */}

          <button
            type="button"
            className={`
              ${tabButton}
              border-[#d3d9de]
              text-[#333]
              hover:border-[#a96554]
              hover:text-[#824838]
            `}
          >
            <FileText size={14} />

            <span>PT Report</span>
          </button>

          {/* RIGHT ICONS */}

          <div
            className="
              ml-auto
              flex
              items-center
              gap-4
              text-[#858585]
            "
          >
            <button
              type="button"
              title="Filter"
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded
                hover:bg-white
                hover:text-[#8d4e3e]
              "
            >
              <Filter size={17} />
            </button>

            <button
              type="button"
              title="Settings"
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded
                hover:bg-white
                hover:text-[#8d4e3e]
              "
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="2.5 2.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================
          PF ACKNOWLEDGEMENT VIEW HEADER
      ================================================== */}

      <div
        className="
          mb-1
          flex
          flex-col
          gap-3
          rounded-[9px]
          border
          border-[#d8d8d8]
          bg-white
          px-3
          py-2
          shadow-sm
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        {/* LEFT */}

        <div
          className="
            flex
            min-w-0
            items-center
            gap-3
          "
        >
          {/* BACK */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              flex
              h-[31px]
              shrink-0
              items-center
              justify-center
              gap-1.5
              rounded-md
              border
              border-[#a96554]
              bg-white
              px-4
              text-[11px]
              font-medium
              text-[#824838]
              transition
              hover:bg-[#fff7f4]
            "
          >
            <ArrowLeft size={13} />

            Back
          </button>

          {/* TITLE */}

          <div
            className="
              relative
              flex
              h-[31px]
              items-center
            "
          >
            <span
              className="
                text-[13px]
                font-semibold
                text-[#824838]
              "
            >
              PF Acknowledgement View
            </span>

            <span
              className="
                absolute
                bottom-[-8px]
                left-0
                h-[2px]
                w-full
                rounded-full
                bg-[#a96554]
              "
            />
          </div>
        </div>

        {/* RIGHT CONTROLS */}

        <div
          className="
            flex
            flex-col
            gap-2
            sm:flex-row
            sm:flex-wrap
            sm:items-center
            lg:justify-end
          "
        >
          {/* FROM MONTH */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <label
              className="
                whitespace-nowrap
                text-[11px]
                font-medium
                text-[#333]
              "
            >
              From Month
            </label>

            <div className="relative">
              <input
                type="month"
                value={fromMonth}
                onChange={(e) =>
                  setFromMonth(e.target.value)
                }
                className="
                  h-[31px]
                  w-[118px]
                  cursor-pointer
                  rounded-md
                  border
                  border-[#d8dde1]
                  bg-[#f8fafb]
                  px-2
                  pr-7
                  text-[11px]
                  text-[#333]
                  outline-none
                  focus:border-[#a96554]
                "
              />

              <ChevronDown
                size={13}
                className="
                  pointer-events-none
                  absolute
                  right-2
                  top-1/2
                  -translate-y-1/2
                  text-[#777]
                "
              />
            </div>
          </div>

          {/* TO MONTH */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <label
              className="
                whitespace-nowrap
                text-[11px]
                font-medium
                text-[#333]
              "
            >
              To Month
            </label>

            <div className="relative">
              <input
                type="month"
                value={toMonth}
                onChange={(e) =>
                  setToMonth(e.target.value)
                }
                className="
                  h-[31px]
                  w-[118px]
                  cursor-pointer
                  rounded-md
                  border
                  border-[#d8dde1]
                  bg-[#f8fafb]
                  px-2
                  pr-7
                  text-[11px]
                  text-[#333]
                  outline-none
                  focus:border-[#a96554]
                "
              />

              <ChevronDown
                size={13}
                className="
                  pointer-events-none
                  absolute
                  right-2
                  top-1/2
                  -translate-y-1/2
                  text-[#777]
                "
              />
            </div>
          </div>

          {/* PF GROUP */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >
            <label
              className="
                whitespace-nowrap
                text-[11px]
                font-medium
                text-[#333]
              "
            >
              PF Group
            </label>

            <div className="relative">
              <select
                value={pfGroup}
                onChange={(e) =>
                  setPfGroup(e.target.value)
                }
                className="
                  h-[31px]
                  w-[150px]
                  appearance-none
                  rounded-md
                  border
                  border-[#d8dde1]
                  bg-white
                  px-2
                  pr-7
                  text-[11px]
                  text-[#555]
                  outline-none
                  focus:border-[#a96554]
                "
              >
                <option value="">
                  Select PF Group
                </option>

                <option value="Group A">
                  Group A
                </option>

                <option value="Group B">
                  Group B
                </option>

                <option value="Group C">
                  Group C
                </option>
              </select>

              <ChevronDown
                size={13}
                className="
                  pointer-events-none
                  absolute
                  right-2
                  top-1/2
                  -translate-y-1/2
                  text-[#777]
                "
              />
            </div>
          </div>

          {/* EXCEL */}

          <button
            type="button"
            onClick={handleExportExcel}
            title="Export Excel"
            className="
              flex
              h-[31px]
              w-[31px]
              items-center
              justify-center
              rounded-md
              text-[#258b43]
              transition
              hover:bg-[#f0f8f2]
            "
          >
            <FileSpreadsheet size={19} />
          </button>
        </div>
      </div>

      {/* ==================================================
          SEARCH + FILTER BAR
      ================================================== */}

      <div
        className="
          mb-3
          flex
          min-h-[44px]
          flex-col
          rounded-[9px]
          border
          border-[#d8d8d8]
          bg-white
          shadow-sm
          lg:flex-row
          lg:items-center
        "
      >
        {/* SEARCH */}

        <div
          className="
            flex
            h-[43px]
            min-w-0
            flex-1
            items-center
            px-3
          "
        >
          <Search
            size={18}
            className="
              mr-2
              shrink-0
              text-[#8a919b]
            "
          />

          <input
            type="text"
            value={searchText}
            onChange={(e) =>
              setSearchText(e.target.value)
            }
            placeholder="Start Typing..."
            className="
              min-w-0
              flex-1
              bg-transparent
              text-[11px]
              text-[#333]
              outline-none
              placeholder:text-[#adb3bb]
            "
          />
        </div>

        {/* FILTERS */}

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-x-5
            gap-y-2
            border-t
            border-[#eeeeee]
            px-3
            py-2
            lg:border-l
            lg:border-t-0
          "
        >
          {/* ADD FILTER */}

          <button
            type="button"
            className={filterButton}
          >
            <Plus size={15} />

            Add Filter
          </button>

          {/* QUERY */}

          <button
            type="button"
            className={filterButton}
          >
            Query

            <ChevronDown size={13} />
          </button>

          {/* BRANCH */}

          <button
            type="button"
            className={filterButton}
          >
            Branch

            <ChevronDown size={13} />
          </button>

          {/* SALARY STRUCTURE */}

          <button
            type="button"
            className={filterButton}
          >
            Salary Structure

            <ChevronDown size={13} />
          </button>

          {/* LEAVE */}

          <button
            type="button"
            className={filterButton}
          >
            Leave

            <ChevronDown size={13} />
          </button>

          {/* ATTENDANCE */}

          <button
            type="button"
            className={filterButton}
          >
            Attendance

            <ChevronDown size={13} />
          </button>

          {/* DESIGNATION */}

          <button
            type="button"
            className={filterButton}
          >
            Designation

            <ChevronDown size={13} />
          </button>

          {/* EMP STATUS */}

          <button
            type="button"
            className={filterButton}
          >
            Emp Status

            <ChevronDown size={13} />
          </button>

          {/* MORE */}

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setShowMore(!showMore)
              }
              title="More"
              className="
                flex
                h-6
                w-6
                items-center
                justify-center
                text-[#777]
                hover:text-[#8d4e3e]
              "
            >
              <MoreVertical size={17} />
            </button>

            {showMore && (
              <div
                className="
                  absolute
                  right-0
                  top-8
                  z-50
                  w-[145px]
                  rounded-md
                  border
                  border-[#ddd]
                  bg-white
                  py-1
                  shadow-lg
                "
              >
                <button
                  type="button"
                  className="
                    w-full
                    px-3
                    py-2
                    text-left
                    text-[11px]
                    text-[#555]
                    hover:bg-[#fff7f4]
                  "
                >
                  Reset Filters
                </button>

                <button
                  type="button"
                  className="
                    w-full
                    px-3
                    py-2
                    text-left
                    text-[11px]
                    text-[#555]
                    hover:bg-[#fff7f4]
                  "
                >
                  Save Filter
                </button>
              </div>
            )}
          </div>

          {/* CLEAR */}

          <button
            type="button"
            onClick={handleClear}
            title="Clear"
            className="
              flex
              h-6
              w-6
              items-center
              justify-center
              text-[#e34d55]
              hover:text-[#c52f38]
            "
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* ==================================================
          NO DATA AREA
      ================================================== */}

      <div
        className="
          flex
          min-h-[540px]
          flex-col
          items-center
          justify-center
          text-center
        "
      >
        {/* ILLUSTRATION */}

        <div
          className="
            relative
            mb-4
            h-[190px]
            w-[260px]
          "
        >
          {/* BACKGROUND CIRCLE */}

          <div
            className="
              absolute
              left-[54px]
              top-[10px]
              h-[135px]
              w-[155px]
              rounded-full
              bg-[#edf1ff]
            "
          />

          {/* DOCUMENT */}

          <div
            className="
              absolute
              left-[82px]
              top-[45px]
              h-[120px]
              w-[98px]
              rounded-[3px]
              border
              border-[#d4d9eb]
              bg-[#e9edff]
              shadow-sm
            "
          >
            {/* TOP */}

            <div
              className="
                h-[14px]
                rounded-t-[3px]
                bg-[#a4b5ef]
              "
            />

            {/* INNER DOCUMENT */}

            <div
              className="
                absolute
                left-[17px]
                top-[29px]
                flex
                h-[70px]
                w-[64px]
                items-center
                justify-center
                border
                border-[#c3cbea]
                bg-[#f6f7ff]
              "
            >
              <div className="text-center">
                <div
                  className="
                    mx-auto
                    mb-1
                    flex
                    h-[34px]
                    w-[27px]
                    items-center
                    justify-center
                    rounded-[2px]
                    bg-[#91a7eb]
                  "
                >
                  <span className="text-[17px] text-white">
                    ☹
                  </span>
                </div>

                <span
                  className="
                    text-[6px]
                    font-bold
                    text-[#58679d]
                  "
                >
                  NO DATA
                </span>
              </div>
            </div>
          </div>

          {/* LEFT CIRCLE */}

          <div
            className="
              absolute
              left-[30px]
              top-[78px]
              h-[24px]
              w-[24px]
              rounded-full
              border-2
              border-dashed
              border-[#d5dbee]
            "
          />

          {/* RIGHT SHAPE */}

          <div
            className="
              absolute
              right-[32px]
              top-[38px]
              h-[29px]
              w-[29px]
              rotate-12
              rounded-[5px]
              bg-[#e1e7fc]
            "
          />

          {/* PERSON */}

          <div
            className="
              absolute
              bottom-[9px]
              left-[132px]
            "
          >
            {/* HEAD */}

            <div
              className="
                mx-auto
                h-[20px]
                w-[20px]
                rounded-full
                bg-[#e5ae78]
              "
            />

            {/* BODY */}

            <div
              className="
                mx-auto
                mt-1
                h-[35px]
                w-[39px]
                rounded-t-[18px]
                bg-[#f1f3ff]
              "
            />

            {/* LAPTOP */}

            <div
              className="
                absolute
                left-[-7px]
                top-[34px]
                h-[15px]
                w-[53px]
                rounded-[2px]
                bg-[#89a3ef]
              "
            />

            {/* LEGS */}

            <div
              className="
                absolute
                left-[-5px]
                top-[47px]
                h-[12px]
                w-[23px]
                rounded-full
                bg-[#27316a]
              "
            />

            <div
              className="
                absolute
                left-[21px]
                top-[47px]
                h-[12px]
                w-[23px]
                rounded-full
                bg-[#27316a]
              "
            />

          </div>

          {/* FLOOR */}

          <div
            className="
              absolute
              bottom-0
              left-[44px]
              h-[3px]
              w-[180px]
              rounded-full
              bg-[#d7ddea]
            "
          />
        </div>

        {/* NO DATA TEXT */}

        <h2
          className="
            text-[17px]
            font-medium
            text-[#222]
          "
        >
          Did Not Find Any Pf Report
        </h2>
      </div>
    </div>
  );
}
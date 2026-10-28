import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ChevronDown,
  ChevronLeft,
  Filter,
  Search,
  FileSpreadsheet,
  MoreVertical,
  X,
  Clock3,
} from "lucide-react";

export default function LWFAcknowledgementViewPage() {
  const navigate = useNavigate();

  /* =====================================================
     STATES
  ===================================================== */

  const [fromMonth, setFromMonth] = useState("Sep/2026");
  const [toMonth, setToMonth] = useState("Sep/2026");

  const [fromMonthOpen, setFromMonthOpen] =
    useState(false);

  const [toMonthOpen, setToMonthOpen] =
    useState(false);

  const [lwfGroup, setLwfGroup] = useState("");
  const [lwfGroupOpen, setLwfGroupOpen] =
    useState(false);

  const [search, setSearch] = useState("");

  const [openFilter, setOpenFilter] =
    useState<string | null>(null);

  /* =====================================================
     MONTH OPTIONS
  ===================================================== */

  const months = [
    "Sep/2026",
    "Aug/2026",
    "Jul/2026",
    "Jun/2026",
    "May/2026",
    "Apr/2026",
    "Mar/2026",
    "Feb/2026",
    "Jan/2026",
  ];

  /* =====================================================
     FILTER OPTIONS
  ===================================================== */

  const filterOptions = [
    "Query",
    "Branch",
    "Salary Structure",
    "Leave",
    "Attendance",
    "Designation",
    "Emp Status",
  ];

  /* =====================================================
     CLOSE ALL DROPDOWNS
  ===================================================== */

  const closeDropdowns = () => {
    setFromMonthOpen(false);
    setToMonthOpen(false);
    setLwfGroupOpen(false);
    setOpenFilter(null);
  };

  /* =====================================================
     CLEAR SEARCH
  ===================================================== */

  const clearSearch = () => {
    setSearch("");
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      className="
        min-h-screen
        w-full
        bg-[#f4f8fe]
        p-2
        sm:p-3
        md:p-4
      "
      onClick={closeDropdowns}
    >

      {/* ==================================================
          TOP REPORT TABS
      ================================================== */}

      <div
        className="
          w-full
          rounded-lg
          border
          border-[#e2b7a8]
          bg-[#fff8f5]
          px-3
          py-2
          shadow-[0_2px_7px_rgba(0,0,0,0.05)]
          sm:px-4
        "
        onClick={(event) => {
          event.stopPropagation();
        }}
      >

        <div
          className="
            flex
            min-h-[58px]
            items-center
            gap-3
            overflow-x-auto
            scrollbar-hide
          "
        >

          {/* =================================================
              PF REPORT
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/insights/statutory-report/pf",
              )
            }
            className="
              flex
              h-10
              min-w-[145px]
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-[#ddd5d1]
              bg-white
              px-5
              text-sm
              font-medium
              text-[#4f4a47]
              shadow-[0_1px_3px_rgba(0,0,0,0.08)]
              transition
              hover:border-[#b17869]
              hover:text-[#8b5e52]
            "
          >
            <span className="text-[16px]">
              ♢
            </span>

            PF Report
          </button>

          {/* =================================================
              ESI REPORT
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/insights/statutory-report/esi",
              )
            }
            className="
              flex
              h-10
              min-w-[145px]
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-[#ddd5d1]
              bg-white
              px-5
              text-sm
              font-medium
              text-[#4f4a47]
              shadow-[0_1px_3px_rgba(0,0,0,0.08)]
              transition
              hover:border-[#b17869]
              hover:text-[#8b5e52]
            "
          >
            <span className="text-[17px]">
              +
            </span>

            ESI Report
          </button>

          {/* =================================================
              LWF REPORT - ACTIVE
          ================================================= */}

          <button
            type="button"
            className="
              flex
              h-10
              min-w-[145px]
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-[#c89584]
              bg-white
              px-5
              text-sm
              font-semibold
              text-[#8b5e52]
              shadow-[0_1px_3px_rgba(0,0,0,0.08)]
            "
          >
            <span className="text-[17px]">
              ♧
            </span>

            LWF Report
          </button>

          {/* =================================================
              PT REPORT
          ================================================= */}

          <button
            type="button"
            onClick={() =>
              navigate(
                "/insights/statutory-report/pt",
              )
            }
            className="
              flex
              h-10
              min-w-[145px]
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-[#ddd5d1]
              bg-white
              px-5
              text-sm
              font-medium
              text-[#4f4a47]
              shadow-[0_1px_3px_rgba(0,0,0,0.08)]
              transition
              hover:border-[#b17869]
              hover:text-[#8b5e52]
            "
          >
            <span className="text-[17px]">
              ₹
            </span>

            PT Report
          </button>

          {/* RIGHT ICONS */}

          <div
            className="
              ml-auto
              hidden
              shrink-0
              items-center
              gap-5
              pr-2
              sm:flex
            "
          >

            <button
              type="button"
              title="Filter"
              className="
                text-[#8b6b60]
                transition
                hover:text-[#7e4031]
              "
            >
              <Filter size={21} />
            </button>

            <button
              type="button"
              title="History"
              className="
                text-[#9a8b84]
                transition
                hover:text-[#7e4031]
              "
            >
              <Clock3 size={21} />
            </button>

          </div>

        </div>

      </div>

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div
        className="
          mt-3
          w-full
          rounded-lg
          border
          border-[#ded8d5]
          bg-white
          px-3
          py-2
          shadow-[0_1px_5px_rgba(0,0,0,0.06)]
        "
        onClick={(event) => {
          event.stopPropagation();
        }}
      >

        <div
          className="
            flex
            min-h-[58px]
            flex-wrap
            items-center
            gap-2
            sm:gap-3
          "
        >

          {/* =================================================
              TITLE
          ================================================= */}

          <h1
            className="
              mr-auto
              border-b-[3px]
              border-[#c89584]
              pb-2
              text-[16px]
              font-semibold
              text-[#8b5e52]
              sm:text-[18px]
            "
          >
            LWF Acknowledgement View
          </h1>

          {/* =================================================
              BACK
          ================================================= */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              order-2
              flex
              h-10
              items-center
              gap-2
              rounded-lg
              border
              border-[#d4ccc8]
              bg-white
              px-4
              text-sm
              font-medium
              text-[#55504d]
              transition
              hover:border-[#b17869]
              hover:text-[#8b5e52]
              sm:order-none
            "
          >
            <ChevronLeft size={19} />

            <span>Back</span>
          </button>

          {/* =================================================
              FROM MONTH LABEL
          ================================================= */}

          <span
            className="
              text-sm
              font-medium
              text-[#5a514d]
            "
          >
            From Month
          </span>

          {/* =================================================
              FROM MONTH
          ================================================= */}

          <div className="relative">

            <button
              type="button"
              onClick={() => {
                setFromMonthOpen(
                  (previous) => !previous,
                );

                setToMonthOpen(false);
                setLwfGroupOpen(false);
              }}
              className="
                flex
                h-10
                min-w-[155px]
                items-center
                justify-between
                rounded-lg
                border
                border-[#ddd7d3]
                bg-[#f5f3f2]
                px-4
                text-sm
                font-medium
                text-[#4d4845]
              "
            >
              <span>{fromMonth}</span>

              <ChevronDown
                size={16}
                className={`
                  transition-transform
                  ${
                    fromMonthOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {fromMonthOpen && (
              <MonthDropdown
                months={months}
                selected={fromMonth}
                onSelect={(value) => {
                  setFromMonth(value);
                  setFromMonthOpen(false);
                }}
              />
            )}

          </div>

          {/* =================================================
              TO MONTH LABEL
          ================================================= */}

          <span
            className="
              text-sm
              font-medium
              text-[#5a514d]
            "
          >
            To Month
          </span>

          {/* =================================================
              TO MONTH
          ================================================= */}

          <div className="relative">

            <button
              type="button"
              onClick={() => {
                setToMonthOpen(
                  (previous) => !previous,
                );

                setFromMonthOpen(false);
                setLwfGroupOpen(false);
              }}
              className="
                flex
                h-10
                min-w-[155px]
                items-center
                justify-between
                rounded-lg
                border
                border-[#ddd7d3]
                bg-[#f5f3f2]
                px-4
                text-sm
                font-medium
                text-[#4d4845]
              "
            >
              <span>{toMonth}</span>

              <ChevronDown
                size={16}
                className={`
                  transition-transform
                  ${
                    toMonthOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {toMonthOpen && (
              <MonthDropdown
                months={months}
                selected={toMonth}
                onSelect={(value) => {
                  setToMonth(value);
                  setToMonthOpen(false);
                }}
              />
            )}

          </div>

          {/* =================================================
              LWF GROUP LABEL
          ================================================= */}

          <span
            className="
              text-sm
              font-medium
              text-[#5a514d]
            "
          >
            LWF Group
          </span>

          {/* =================================================
              LWF GROUP
          ================================================= */}

          <div className="relative">

            <button
              type="button"
              onClick={() => {
                setLwfGroupOpen(
                  (previous) => !previous,
                );

                setFromMonthOpen(false);
                setToMonthOpen(false);
              }}
              className="
                flex
                h-10
                min-w-[175px]
                items-center
                justify-between
                rounded-lg
                border
                border-[#ddd7d3]
                bg-white
                px-4
                text-sm
                text-[#55504d]
              "
            >
              <span>
                {lwfGroup || "Select LWF Group"}
              </span>

              <ChevronDown
                size={16}
                className={`
                  transition-transform
                  ${
                    lwfGroupOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {lwfGroupOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-[45px]
                  z-[100]
                  w-[210px]
                  rounded-lg
                  border
                  border-[#ded5d1]
                  bg-white
                  p-2
                  shadow-[0_8px_20px_rgba(0,0,0,0.14)]
                "
              >

                <button
                  type="button"
                  onClick={() => {
                    setLwfGroup(
                      "Default LWF",
                    );
                    setLwfGroupOpen(false);
                  }}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-md
                    px-3
                    py-2.5
                    text-left
                    text-sm
                    text-[#55504d]
                    hover:bg-[#fff5f1]
                  "
                >

                  <span
                    className={`
                      flex
                      h-[18px]
                      w-[18px]
                      items-center
                      justify-center
                      rounded-[3px]
                      border
                      ${
                        lwfGroup ===
                        "Default LWF"
                          ? "border-[#8b5e52] bg-[#8b5e52]"
                          : "border-[#aaa29e]"
                      }
                    `}
                  >
                    {lwfGroup ===
                      "Default LWF" && (
                      <span className="text-xs text-white">
                        ✓
                      </span>
                    )}
                  </span>

                  Default LWF

                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLwfGroup("");
                    setLwfGroupOpen(false);
                  }}
                  className="
                    mt-1
                    w-full
                    rounded-md
                    px-3
                    py-2
                    text-left
                    text-sm
                    text-[#8b5e52]
                    hover:bg-[#fff5f1]
                  "
                >
                  Clear
                </button>

              </div>
            )}

          </div>

          {/* =================================================
              EXCEL
          ================================================= */}

          <button
            type="button"
            title="Export Excel"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              text-[#4e944b]
              transition
              hover:text-[#397d38]
            "
          >
            <FileSpreadsheet size={23} />
          </button>

        </div>

      </div>

      {/* ==================================================
          FILTER BAR
      ================================================== */}

      <div
        className="
          mt-3
          w-full
          rounded-lg
          border
          border-[#ded8d5]
          bg-white
          px-2
          py-2
          shadow-[0_1px_5px_rgba(0,0,0,0.06)]
        "
        onClick={(event) => {
          event.stopPropagation();
        }}
      >

        <div
          className="
            flex
            min-h-[45px]
            items-center
            gap-2
            overflow-x-auto
            pb-0.5
          "
        >

          {/* =================================================
              SEARCH
          ================================================= */}

          <div
            className="
              flex
              h-10
              min-w-[230px]
              shrink-0
              items-center
              rounded-lg
              border
              border-[#dcd7d4]
              bg-white
              px-3
            "
          >

            <Search
              size={18}
              className="shrink-0 text-[#9b9693]"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Start Typing..."
              className="
                ml-2
                w-full
                bg-transparent
                text-sm
                text-[#55504d]
                outline-none
                placeholder:text-[#aaa5a2]
              "
            />

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="
                  text-[#9c7770]
                  hover:text-[#7e4031]
                "
              >
                <X size={15} />
              </button>
            )}

          </div>

          {/* =================================================
              ADD FILTER
          ================================================= */}

          <button
            type="button"
            className="
              flex
              h-10
              shrink-0
              items-center
              gap-2
              rounded-lg
              px-4
              text-sm
              font-medium
              text-[#55504d]
              transition
              hover:bg-[#fff5f1]
              hover:text-[#8b5e52]
            "
          >
            <span className="text-lg">
              +
            </span>

            Add Filter
          </button>

          {/* =================================================
              FILTER DROPDOWNS
          ================================================= */}

          {filterOptions.map((filter) => (
            <FilterDropdown
              key={filter}
              label={filter}
              open={openFilter === filter}
              onToggle={() => {
                setOpenFilter(
                  (previous) =>
                    previous === filter
                      ? null
                      : filter,
                );

                setFromMonthOpen(false);
                setToMonthOpen(false);
                setLwfGroupOpen(false);
              }}
            />
          ))}

          {/* =================================================
              MORE
          ================================================= */}

          <button
            type="button"
            title="More"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              text-[#817873]
              hover:text-[#8b5e52]
            "
          >
            <MoreVertical size={19} />
          </button>

          {/* =================================================
              CLEAR
          ================================================= */}

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setLwfGroup("");
              setOpenFilter(null);
            }}
            className="
              flex
              h-9
              shrink-0
              items-center
              gap-2
              px-2
              text-sm
              text-[#77716e]
              transition
              hover:text-[#8b5e52]
            "
          >
            <X size={16} />

            Clear
          </button>

        </div>

      </div>

      {/* ==================================================
          EMPTY STATE
      ================================================== */}

      <div
        className="
          flex
          min-h-[470px]
          w-full
          items-center
          justify-center
          rounded-lg
          bg-transparent
        "
      >

        <div
          className="
            flex
            flex-col
            items-center
            justify-center
            px-5
            pb-20
            text-center
          "
        >

          {/* =================================================
              EMPTY ILLUSTRATION
          ================================================= */}

          <div
            className="
              relative
              mb-5
              flex
              h-[155px]
              w-[220px]
              items-end
              justify-center
            "
          >

            {/* Background circle */}

            <div
              className="
                absolute
                left-1/2
                top-4
                h-[120px]
                w-[150px]
                -translate-x-1/2
                rounded-full
                bg-[#fff8f5]
              "
            />

            {/* Document */}

            <div
              className="
                absolute
                left-1/2
                top-[25px]
                flex
                h-[100px]
                w-[78px]
                -translate-x-1/2
                flex-col
                items-center
                rounded-md
                border
                border-[#d8cbc6]
                bg-white
                shadow-[0_4px_10px_rgba(120,90,80,0.08)]
              "
            >

              <div
                className="
                  h-4
                  w-full
                  rounded-t-md
                  bg-[#c89584]
                "
              />

              <div
                className="
                  mt-3
                  flex
                  h-[40px]
                  w-[45px]
                  items-center
                  justify-center
                  rounded-md
                  bg-[#f4e3dd]
                "
              >

                <span
                  className="
                    text-[22px]
                    font-semibold
                    text-[#b17869]
                  "
                >
                  …
                </span>

              </div>

              <span
                className="
                  mt-2
                  text-[9px]
                  font-semibold
                  text-[#8b5e52]
                "
              >
                NO DATA
              </span>

            </div>

            {/* Small person */}

            <div
              className="
                absolute
                bottom-[14px]
                right-[32px]
              "
            >

              <div
                className="
                  mx-auto
                  h-[23px]
                  w-[23px]
                  rounded-full
                  bg-[#d5a184]
                "
              />

              <div
                className="
                  mt-1
                  h-[25px]
                  w-[38px]
                  rounded-t-[17px]
                  bg-[#8b5e52]
                "
              />

              <div
                className="
                  mx-auto
                  mt-[-1px]
                  h-[13px]
                  w-[48px]
                  rounded-b-full
                  bg-[#5c4037]
                "
              />

            </div>

            {/* Floor */}

            <div
              className="
                absolute
                bottom-[9px]
                left-1/2
                h-[2px]
                w-[185px]
                -translate-x-1/2
                rounded-full
                bg-[#cfc7c3]
              "
            />

          </div>

          {/* =================================================
              EMPTY MESSAGE
          ================================================= */}

          <h2
            className="
              text-[17px]
              font-semibold
              text-[#8b5e52]
              sm:text-[19px]
            "
          >
            Did Not Find Any Lwf Report
          </h2>

        </div>

      </div>

    </div>
  );
}

/* ==========================================================
   MONTH DROPDOWN
========================================================== */

function MonthDropdown({
  months,
  selected,
  onSelect,
}: {
  months: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div
      className="
        absolute
        right-0
        top-[45px]
        z-[100]
        w-[155px]
        overflow-hidden
        rounded-lg
        border
        border-[#ded5d1]
        bg-white
        shadow-[0_8px_20px_rgba(0,0,0,0.14)]
      "
    >
      {months.map((month) => (
        <button
          key={month}
          type="button"
          onClick={() => onSelect(month)}
          className={`
            block
            w-full
            px-4
            py-2.5
            text-left
            text-sm
            ${
              selected === month
                ? "bg-[#8b5e52] font-medium text-white"
                : "text-[#55504d] hover:bg-[#fff5f1]"
            }
          `}
        >
          {month}
        </button>
      ))}
    </div>
  );
}

/* ==========================================================
   FILTER DROPDOWN
========================================================== */

function FilterDropdown({
  label,
  open,
  onToggle,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative shrink-0">

      <button
        type="button"
        onClick={onToggle}
        className={`
          flex
          h-10
          items-center
          gap-2
          rounded-lg
          border
          px-3
          text-sm
          font-medium
          transition
          ${
            open
              ? "border-[#b17869] bg-[#fff8f5] text-[#8b5e52]"
              : "border-[#ded9d6] bg-white text-[#55504d]"
          }
        `}
      >

        {label}

        <ChevronDown
          size={15}
          className={`
            transition-transform
            ${open ? "rotate-180" : ""}
          `}
        />

      </button>

      {open && (
        <div
          className="
            absolute
            left-0
            top-[45px]
            z-[100]
            w-[190px]
            rounded-lg
            border
            border-[#ded5d1]
            bg-white
            p-2
            shadow-[0_8px_20px_rgba(0,0,0,0.14)]
          "
        >

          <button
            type="button"
            className="
              block
              w-full
              rounded-md
              px-3
              py-2.5
              text-left
              text-sm
              text-[#55504d]
              hover:bg-[#fff5f1]
            "
          >
            Select {label}
          </button>

          <button
            type="button"
            className="
              block
              w-full
              rounded-md
              px-3
              py-2.5
              text-left
              text-sm
              text-[#55504d]
              hover:bg-[#fff5f1]
            "
          >
            All
          </button>

        </div>
      )}

    </div>
  );
}
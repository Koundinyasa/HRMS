import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Filter,
  Clock,
  MoreVertical,
  X,
  Bookmark,
} from "lucide-react";

import { BULK_UPDATE_SECTION_PATH } from "../constants/bulkUpdate.constants";

const tabs = [
  {
    label: "Statutory",
    path: "statutory",
  },
  {
    label: "Classification",
    path: "classification",
  },
  {
    label: "Authority",
    path: "authority",
  },
  {
    label: "Role",
    path: "role",
  },
  {
    label: "PAN Verification",
    path: "pan-verification",
  },
];

const filterFields = [
  "Query",
  "Branch",
  "Salary Structure",
  "Leave",
  "Attendance",
  "Designation",
  "Emp Status",
];

export default function BulkUpdateClassificationPage() {
  const navigate = useNavigate();

  const { domain } = useParams<{
    domain: string;
  }>();

  const basePath = `/${domain ?? ""}/admin/${BULK_UPDATE_SECTION_PATH}`;

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<string | null>(null);

  const [month, setMonth] = useState("Jun/2026");

  const [changeType, setChangeType] =
    useState("Classification");

  /*
   * TAB NAVIGATION
   *
   * Do NOT use window.location.href.
   */
  const handleTabChange = (path: string) => {
    navigate(`${basePath}/${path}`);
  };

  /*
   * CLEAR FILTERS
   */
  const clearFilters = () => {
    setSearch("");
    setActiveFilter(null);
  };

  /*
   * No classification data.
   * This displays the empty-state screen.
   */
  const classifications: unknown[] = [];

  return (
    <div className="min-h-full w-full bg-[#f5f7fb] p-2">
      {/* =====================================================
          ROW 1 - TABS
      ====================================================== */}

      <div className="w-full rounded-md border border-[#edf0f3] bg-white">
        {/* <div className="flex h-[60px] items-center justify-between px-3"> */}
        <div className="flex h-[56px] items-center justify-between gap-2 px-2 sm:h-[60px] sm:px-3">
          {/* TABS */}

          {/* <div className="flex h-full items-center gap-9 overflow-x-auto whitespace-nowrap"> */}
          <div className="flex h-full min-w-0 items-center gap-5 overflow-x-auto whitespace-nowrap sm:gap-9">
            {tabs.map((tab) => {
              const isActive =
                tab.path === "classification";

              return (
                <button
                  key={tab.path}
                  type="button"

                  /*
                   * IMPORTANT:
                   * This replaces:
                   *
                   * window.location.href = `${basePath}/${tab.path}`;
                   */
                  onClick={() =>
                    handleTabChange(tab.path)
                  }

                  className={`relative flex h-full items-center px-1 text-[15px] font-medium transition-colors ${
                    isActive
                      ? "text-[#1687e8]"
                      : "text-[#344054] hover:text-[#1687e8]"
                  }`}
                >
                  {tab.label}

                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#1687e8]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* RIGHT ICONS */}

          {/* <div className="ml-4 flex shrink-0 items-center gap-4 text-[#8b99ad]"> */}
          <div className="ml-2 flex shrink-0 items-center gap-3 text-[#8b99ad] sm:ml-4 sm:gap-4">
            <button
              type="button"
              title="Filter"
              className="transition-colors hover:text-[#1687e8]"
            >
              <Filter size={19} />
            </button>

            <button
              type="button"
              title="History"
              className="transition-colors hover:text-[#1687e8]"
            >
              <Clock size={19} />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          ROW 2 - TO CHANGE / MONTH / UPDATE
      ====================================================== */}

      <div className="mt-2 w-full rounded-md border border-[#edf0f3] bg-white">
       {/* <div className="flex h-[62px] items-center justify-end gap-3 px-3">  */}
       <div className="flex min-h-[62px] flex-wrap items-center justify-end gap-2 px-2 py-2 sm:flex-nowrap sm:gap-3 sm:px-3 sm:py-0">
          {/* TO CHANGE */}

          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold text-[#101828]">
              To Change -
            </span>

            <div className="relative">
              <select
                value={changeType}
                onChange={(event) =>
                  setChangeType(
                    event.target.value
                  )
                }
                className="h-[42px] appearance-none border-0 bg-transparent px-2 pr-8 text-[15px] font-medium text-[#1687e8] outline-none"
              >
                <option value="Classification">
                  Classification
                </option>

                <option value="Department">
                  Department
                </option>

                <option value="Designation">
                  Designation
                </option>
              </select>

              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[#1687e8]"
              />
            </div>
          </div>

          {/* MONTH */}

          <div className="relative">
            <select
              value={month}
              onChange={(event) =>
                setMonth(event.target.value)
              }
              className="h-[44px] w-[158px] appearance-none rounded-lg border border-[#d9e1ea] bg-white px-4 pr-10 text-[15px] text-[#344054] outline-none focus:border-[#1687e8]"
            >
              <option value="Jun/2026">
                Jun/2026
              </option>

              <option value="May/2026">
                May/2026
              </option>

              <option value="Apr/2026">
                Apr/2026
              </option>

              <option value="Mar/2026">
                Mar/2026
              </option>

              <option value="Feb/2026">
                Feb/2026
              </option>

              <option value="Jan/2026">
                Jan/2026
              </option>
            </select>

            <ChevronDown
              size={15}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]"
            />
          </div>

          {/* UPDATE ALL */}

          <button
            type="button"
            disabled
            className="flex h-[44px] items-center gap-2 rounded-lg bg-[#8eaff0] px-5 text-[15px] font-semibold text-white opacity-90"
          >
            <Bookmark size={16} />

            Update All
          </button>

          {/* FILTER */}

          <button
            type="button"
            title="Filter"
            className="text-[#8b99ad] hover:text-[#1687e8]"
          >
            <Filter size={20} />
          </button>

          {/* HISTORY */}

          <button
            type="button"
            title="History"
            className="text-[#8b99ad] hover:text-[#1687e8]"
          >
            <Clock size={20} />
          </button>
        </div>
      </div>

      {/* =====================================================
          ROW 3 - SEARCH / FILTERS
      ====================================================== */}

      {/* <div className="mt-2 w-full rounded-md border border-[#edf0f3] bg-white">
        <div className="flex h-[58px] items-center gap-7 px-3"> */}
         <div className="mt-2 w-full overflow-x-auto rounded-md border border-[#edf0f3] bg-white [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
           <div className="flex h-[58px] min-w-[900px] items-center gap-5 px-2 sm:min-w-0 sm:gap-7 sm:px-3">
          {/* SEARCH */}

          <div className="relative min-w-[220px] flex-1">
            <Search
              size={19}
              className="absolute left-1 top-1/2 -translate-y-1/2 text-[#667085]"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Start Typing..."
              className="h-[42px] w-full border-0 bg-transparent pl-8 text-[15px] text-[#344054] outline-none placeholder:text-[#98a2b3]"
            />
          </div>

          {/* ADD FILTER */}

          <button
            type="button"
            className="flex shrink-0 items-center gap-2 text-[15px] font-medium text-[#344054] hover:text-[#1687e8]"
          >
            <span className="text-[22px] leading-none">
              +
            </span>

            Add Filter
          </button>

          {/* FILTER FIELDS */}

          {filterFields.map((field) => {
            const isActive =
              activeFilter === field;

            return (
              <button
                key={field}
                type="button"
                onClick={() =>
                  setActiveFilter(
                    isActive ? null : field
                  )
                }
                className={`flex shrink-0 items-center gap-1.5 text-[15px] ${
                  isActive
                    ? "font-semibold text-[#1687e8]"
                    : "text-[#344054] hover:text-[#1687e8]"
                }`}
              >
                {field}

                <ChevronDown size={14} />
              </button>
            );
          })}

          {/* MORE */}

          <button
            type="button"
            title="More"
            className="shrink-0 text-[#667085]"
          >
            <MoreVertical size={19} />
          </button>

          {/* CLEAR */}

          <button
            type="button"
            title="Clear Filters"
            onClick={clearFilters}
            className="shrink-0 text-red-500 hover:text-red-700"
          >
            <X size={19} />
          </button>
        </div>
      </div>

      {/* =====================================================
          CLASSIFICATION CONTENT
      ====================================================== */}

      {classifications.length === 0 && (
        <div className="flex min-h-[540px] w-full items-center justify-center">
          <div className="flex flex-col items-center">
            {/* EMPTY STATE IMAGE */}

            <div className="relative mb-5 h-[190px] w-[240px]">
              {/* Background */}

              <div className="absolute left-[42px] top-[35px] h-[105px] w-[155px] rounded-[50%] bg-[#eef3ff]" />

              <div className="absolute left-[20px] top-[78px] h-[65px] w-[65px] rounded-full bg-[#eef3ff]" />

              <div className="absolute right-[20px] top-[72px] h-[72px] w-[72px] rounded-full bg-[#eef3ff]" />

              {/* Browser */}

              <div className="absolute left-[67px] top-[48px] h-[108px] w-[108px] overflow-hidden rounded-md bg-white shadow-[0_2px_10px_rgba(16,24,40,0.08)]">
                <div className="flex h-[16px] items-center gap-1 bg-[#91aaf0] px-2">
                  <span className="h-[3px] w-[3px] rounded-full bg-white" />
                  <span className="h-[3px] w-[3px] rounded-full bg-white" />
                  <span className="h-[3px] w-[3px] rounded-full bg-white" />
                </div>

                <div className="flex h-[92px] items-center justify-center">
                  <div className="relative flex h-[48px] w-[38px] items-center justify-center rounded-sm bg-[#dfe8ff]">
                    <div className="absolute right-[5px] top-[5px] h-[8px] w-[8px] rounded-full bg-[#91aaf0]" />

                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-bold text-[#6d8fdc]">
                        NO
                      </span>

                      <span className="text-[7px] font-semibold text-[#6d8fdc]">
                        DATA
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Person */}

              <div className="absolute bottom-[15px] left-[106px]">
                <div className="mx-auto h-[15px] w-[15px] rounded-full bg-[#e7a36b]" />

                <div className="mt-1 h-[23px] w-[31px] rounded-t-[15px] bg-[#193660]" />

                <div className="mx-auto mt-[-2px] h-[8px] w-[43px] rounded-full bg-[#193660]" />
              </div>

              {/* Decorations */}

              <span className="absolute left-[28px] top-[40px] h-2 w-2 rounded-full bg-[#d9e4ff]" />

              <span className="absolute right-[23px] top-[35px] h-3 w-3 rounded-full bg-[#d9e4ff]" />

              <span className="absolute bottom-[25px] left-[46px] h-2 w-2 rounded-full bg-[#d9e4ff]" />
            </div>

            {/* EMPTY STATE TEXT */}

            <p className="text-[16px] font-medium text-[#344054]">
              Did Not Find Any Classification
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
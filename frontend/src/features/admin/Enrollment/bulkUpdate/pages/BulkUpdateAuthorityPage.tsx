import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Plus,
  MoreVertical,
  X,
  Filter,
  Clock,
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

const employees = [
  {
    id: "1",
    name: "RAJESH UBBAPALLY",
    authority: "Yogesh Kumar K",
  },
  {
    id: "KTSI64211",
    name: "Sathwika Achugatla",
    authority: "BHAGYARAJA AYYURAPALLI",
  },
  {
    id: "KTSI64212",
    name: "Sireesha Yarrameneni",
    authority: "Surekha Jonna",
  },
  {
    id: "KTSI64219",
    name: "Ram Bhupal Reddy Sanki",
    authority: "Venkata Ramana Kalaga",
  },
  {
    id: "284512",
    name: "Varalaxmi Gumudala",
    authority: "BHAGYARAJA AYYURAPALLI",
  },
  {
    id: "284513",
    name: "Nikhitha Narala",
    authority: "Surekha Jonna",
  },
  {
    id: "284514",
    name: "Sreya Chaluvaadi",
    authority: "Yogesh Kumar K",
  },
  {
    id: "284519",
    name: "Rakesh Peddi",
    authority: "Venkata Ramana Kalaga",
  },
  {
    id: "294621",
    name: "Rama Veeramanikanta Pusunuri",
    authority: "Yogesh Kumar K",
  },
  {
    id: "294622",
    name: "Umar Sharief Shaik",
    authority: "Surekha Jonna",
  },
  {
    id: "294623",
    name: "Tharun Nagarjunapu",
    authority: "BHAGYARAJA AYYURAPALLI",
  },
  {
    id: "294624",
    name: "Divyasree Taguru",
    authority: "Venkata Ramana Kalaga",
  },
  {
    id: "324833",
    name: "Aparna Karigam",
    authority: "Yogesh Kumar K",
  },
  {
    id: "334911",
    name: "Kavya N",
    authority: "Surekha Jonna",
  },
  {
    id: "334912",
    name: "Daniel Raju Ravi",
    authority: "BHAGYARAJA AYYURAPALLI",
  },
  {
    id: "344911",
    name: "Yogesh Kumar K",
    authority: "Venkata Ramana Kalaga",
  },
  {
    id: "344912",
    name: "Madhu D",
    authority: "Yogesh Kumar K",
  },
];

const reportingAuthorities = [
  {
    id: "1",
    name: "RAJESH UBBAPALLY",
  },
  {
    id: "KTSI64211",
    name: "Sathwika Achugatla",
  },
  {
    id: "KTSI64212",
    name: "Sireesha Yarrameneni",
  },
  {
    id: "KTSI64219",
    name: "Ram Bhupal Reddy Sanki",
  },
  {
    id: "284512",
    name: "Varalaxmi Gumudala",
  },
  {
    id: "284513",
    name: "Nikhitha Narala",
  },
  {
    id: "284514",
    name: "Sreya Chaluvaadi",
  },
  {
    id: "284519",
    name: "Rakesh Peddi",
  },
  {
    id: "294621",
    name: "Rama Veeramanikanta Pusunuri",
  },
  {
    id: "294622",
    name: "Umar Sharief Shaik",
  },
  {
    id: "294623",
    name: "Tharun Nagarjunapu",
  },
  {
    id: "294624",
    name: "Divyasree Taguru",
  },
  {
    id: "324833",
    name: "Aparna Karigam",
  },
  {
    id: "334911",
    name: "Kavya N",
  },
  {
    id: "334912",
    name: "Daniel Raju Ravi",
  },
  {
    id: "344911",
    name: "Yogesh Kumar K",
  },
  {
    id: "344912",
    name: "Madhu D",
  },
];

export default function BulkUpdateAuthorityPage() {
  const { domain } = useParams<{ domain: string }>();

  const navigate = useNavigate();

  const basePath = `/${domain ?? ""}/admin/${BULK_UPDATE_SECTION_PATH}`;

  const [search, setSearch] = useState("");

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [reportingAuthority, setReportingAuthority] = useState("");

  const [authorityDropdownOpen, setAuthorityDropdownOpen] =
    useState(false);

  const [authoritySearch, setAuthoritySearch] = useState("");

  const [month, setMonth] = useState("Jun/2026");

  const [page, setPage] = useState(1);

  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const pageSize = 10;

  const filteredEmployees = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return employees;
    }

    return employees.filter(
      (employee) =>
        employee.id.toLowerCase().includes(value) ||
        employee.name.toLowerCase().includes(value) ||
        employee.authority.toLowerCase().includes(value)
    );
  }, [search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / pageSize)
  );

  const paginatedEmployees = filteredEmployees.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const allSelected =
    paginatedEmployees.length > 0 &&
    paginatedEmployees.every((employee) =>
      selectedIds.includes(employee.id)
    );

  const toggleEmployee = (id: string) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds((previous) =>
        previous.filter(
          (id) =>
            !paginatedEmployees.some(
              (employee) => employee.id === id
            )
        )
      );
    } else {
      setSelectedIds((previous) => [
        ...new Set([
          ...previous,
          ...paginatedEmployees.map(
            (employee) => employee.id
          ),
        ]),
      ]);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setActiveFilter(null);
    setPage(1);
  };

  const handleUpdate = () => {
    console.log("Authority Update", {
      reportingAuthority,
      month,
      employeeIds: selectedIds,
    });
  };

  const filteredAuthorities = reportingAuthorities.filter(
    (authority) => {
      const value = authoritySearch.trim().toLowerCase();

      if (!value) {
        return true;
      }

      return (
        authority.id.toLowerCase().includes(value) ||
        authority.name.toLowerCase().includes(value)
      );
    }
  );

  return (
    <div className="min-h-full w-full overflow-x-hidden bg-[#f8fafc]">

      {/* ===================== TOP TABS ===================== */}

      <div className="mt-2 px-2 sm:px-4">
        {/* <div
          className="
            flex
            h-[64px]
            items-center
            justify-between
            rounded-md
            border
            border-[#eef1f5]
            bg-white
            px-4
            shadow-[0_1px_2px_rgba(16,24,40,0.03)]
          "
        >
          <div
            className="
              flex
              h-full
              items-center
              gap-8
              overflow-x-auto
              whitespace-nowrap
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
            "
          > */}
          <div className="flex h-[56px] items-center justify-between gap-2 rounded-md border border-[#eef1f5] bg-white px-2 shadow-[0_1px_2px_rgba(16,24,40,0.03)] sm:h-[64px] sm:gap-4 sm:px-4">
            <div className="flex h-full min-w-0 items-center gap-5 overflow-x-auto whitespace-nowrap [scrollbar-width:none] sm:gap-8 [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => {
              const isActive = tab.path === "authority";

              return (
                <button
                  key={tab.path}
                  type="button"
                  onClick={() =>
                    navigate(`${basePath}/${tab.path}`)
                  }
                  className={`
                    relative
                    flex
                    h-full
                    items-center
                    px-1
                    text-sm
                    font-medium
                    transition-colors
                    ${
                      isActive
                        ? "text-[#2196e0]"
                        : "text-[#667085] hover:text-[#344054]"
                    }
                  `}
                >
                  {tab.label}

                  {isActive && (
                    <span
                      className="
                        absolute
                        bottom-[10px]
                        left-0
                        right-0
                        h-[2px]
                        rounded-full
                        bg-[#2196e0]
                      "
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* <div
            className="
              flex
              shrink-0
              items-center
              gap-4
              text-[#98a2b3]
            "
          > */}
          <div className="flex shrink-0 items-center gap-3 text-[#98a2b3] sm:gap-4">
            <button
              type="button"
              title="Filter"
              className="hover:text-[#475467]"
            >
              <Filter size={17} />
            </button>

            <button
              type="button"
              title="History"
              className="hover:text-[#475467]"
            >
              <Clock size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* ============ REPORTING AUTHORITY / MONTH ============ */}

      <div className="px-2 sm:px-4">
        {/* <div
          className="
            relative
            mt-2
            flex
            min-h-[50px]
            items-center
            justify-end
            gap-3
            rounded-md
            border
            border-[#edf0f3]
            bg-white
            px-2
            shadow-[0_1px_2px_rgba(16,24,40,0.03)]
          "
        > */}
        <div className="relative mt-2 flex min-h-[50px] flex-wrap items-center justify-end gap-2 rounded-md border border-[#edf0f3] bg-white px-2 py-2 shadow-[0_1px_2px_rgba(16,24,40,0.03)] sm:flex-nowrap sm:gap-3 sm:py-0">
          <label className="text-sm font-semibold text-[#475467]">
            Reporting Authority
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setAuthorityDropdownOpen(
                  (previous) => !previous
                )
              }
              className="
                flex
                h-[36px]
                min-w-[215px]
                items-center
                justify-between
                rounded-md
                border
                border-[#d9e0e7]
                bg-[#f3f6fa]
                px-3
                text-sm
                text-[#475467]
                outline-none
              "
            >
              <span className="truncate">
                {reportingAuthority ||
                  "Select Reporting Authority"}
              </span>

              <ChevronDown
                size={15}
                className={`
                  ml-2
                  shrink-0
                  text-[#667085]
                  transition-transform
                  ${
                    authorityDropdownOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {authorityDropdownOpen && (
              // <div
              //   className="
              //     absolute
              //     left-0
              //     top-[40px]
              //     z-[100]
              //     w-[340px]
              //     overflow-hidden
              //     rounded-b-md
              //     border
              //     border-[#dfe5eb]
              //     bg-white
              //     shadow-[0_4px_12px_rgba(0,0,0,0.15)]
              //   "
              // >
              <div className="absolute left-0 top-[40px] z-[100] w-[min(340px,88vw)] overflow-hidden rounded-b-md border border-[#dfe5eb] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
                <div className="relative border-b border-[#e5e7eb] bg-white">
                  <Search
                    size={15}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-[#98a2b3]
                    "
                  />

                  <input
                    type="text"
                    value={authoritySearch}
                    onChange={(event) =>
                      setAuthoritySearch(
                        event.target.value
                      )
                    }
                    autoFocus
                    placeholder="Start Typing..."
                    className="
                      h-[36px]
                      w-full
                      border-0
                      bg-white
                      pl-9
                      pr-3
                      text-[13px]
                      text-[#344054]
                      outline-none
                      placeholder:text-[#b3bcc8]
                    "
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setReportingAuthority("");
                    setAuthorityDropdownOpen(false);
                    setAuthoritySearch("");
                  }}
                  className="
                    flex
                    h-[32px]
                    w-full
                    items-center
                    bg-[#eaf4fc]
                    px-3
                    text-left
                    text-[13px]
                    font-medium
                    text-[#475467]
                    hover:bg-[#dceeff]
                  "
                >
                  Select Reporting Authority
                </button>

                <div className="max-h-[500px] overflow-y-auto">
                  {filteredAuthorities.map(
                    (authority) => (
                      <button
                        key={authority.id}
                        type="button"
                        onClick={() => {
                          setReportingAuthority(
                            authority.name
                          );
                          setAuthorityDropdownOpen(false);
                          setAuthoritySearch("");
                        }}
                        className="
                          flex
                          min-h-[32px]
                          w-full
                          items-center
                          gap-1
                          px-3
                          text-left
                          text-[13px]
                          text-[#475467]
                          hover:bg-[#f5f8fb]
                        "
                      >
                        <span>
                          ({authority.id})
                        </span>

                        <span>
                          {authority.name}
                        </span>
                      </button>
                    )
                  )}

                  {filteredAuthorities.length === 0 && (
                    <div
                      className="
                        px-3
                        py-5
                        text-center
                        text-sm
                        text-[#98a2b3]
                      "
                    >
                      No reporting authority found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <select
              value={month}
              onChange={(event) =>
                setMonth(event.target.value)
              }
              className="
                h-[36px]
                min-w-[135px]
                appearance-none
                rounded-md
                border
                border-[#d9e0e7]
                bg-[#f3f6fa]
                px-3
                pr-9
                text-sm
                text-[#475467]
                outline-none
                focus:border-[#2196e0]
              "
            >
              <option>Jun/2026</option>
              <option>May/2026</option>
              <option>Apr/2026</option>
              <option>Mar/2026</option>
            </select>

            <ChevronDown
              size={15}
              className="
                pointer-events-none
                absolute
                right-2.5
                top-1/2
                -translate-y-1/2
                text-slate-500
              "
            />
          </div>

          <button
            type="button"
            onClick={handleUpdate}
            className="
              flex
              h-[36px]
              items-center
              gap-2
              rounded-md
              bg-[#2196e0]
              px-5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#1688d1]
            "
          >
            <Bookmark size={15} />
            Update
          </button>
        </div>
      </div>

      {/* ===================== FILTER BAR ===================== */}

      <div className="px-2 sm:px-4">
        {/* <div
          className="
            mt-2
            flex
            h-[52px]
            items-center
            gap-4
            overflow-x-auto
            whitespace-nowrap
            rounded-md
            border
            border-[#edf0f3]
            bg-white
            px-3
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          <div
            className="
              relative
              flex
              w-[240px]
              shrink-0
              items-center
            "
          > */}
          <div className="mt-2 flex h-[52px] items-center gap-3 overflow-x-auto whitespace-nowrap rounded-md border border-[#edf0f3] bg-white px-3 sm:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="relative flex w-[200px] shrink-0 items-center sm:w-[240px]">
            <Search
              size={17}
              className="absolute left-1 text-[#98a2b3]"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                handleSearch(event.target.value)
              }
              placeholder="Start Typing..."
              className="
                h-[36px]
                w-full
                border-0
                bg-transparent
                pl-7
                text-sm
                text-[#344054]
                outline-none
                placeholder:text-[#b3bcc8]
              "
            />
          </div>

          <button
            type="button"
            className="
              flex
              shrink-0
              items-center
              gap-1.5
              text-sm
              text-[#475467]
              hover:text-[#2196e0]
            "
          >
            <Plus size={15} />
            Add Filter
          </button>

          {filterFields.map((field) => (
            <button
              key={field}
              type="button"
              onClick={() =>
                setActiveFilter(
                  (previous) =>
                    previous === field
                      ? null
                      : field
                )
              }
              className={`
                flex
                shrink-0
                items-center
                gap-1.5
                text-sm
                ${
                  activeFilter === field
                    ? "font-semibold text-[#2196e0]"
                    : "text-[#667085] hover:text-[#2196e0]"
                }
              `}
            >
              {field}
              <ChevronDown size={14} />
            </button>
          ))}

          <div
            className="
              ml-auto
              flex
              shrink-0
              items-center
              gap-2
            "
          >
            <button
              type="button"
              className="text-[#98a2b3] hover:text-[#475467]"
            >
              <MoreVertical size={18} />
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="
                text-[#e05a5a]
                hover:text-[#c93434]
              "
            >
              <X size={19} />
            </button>
          </div>
        </div>
      </div>

      {/* ===================== TABLE ===================== */}

      <div className="px-2 sm:px-4">
        <div className="mt-2 overflow-x-auto rounded-md [scrollbar-width:thin]">
     <div className="min-w-[860px]"></div>

          {/* HEADER */}

          <div
            className="
              grid
              grid-cols-[220px_minmax(250px,1fr)_minmax(300px,1fr)_90px]
              items-center
              rounded-md
              bg-[#dceeff]
              px-3
              py-4
              text-sm
              font-semibold
              text-[#344054]
            "
          >
            <div>Employee ID</div>

            <div>Employee Name</div>

            <div>Authority</div>

            <div
              className="
                flex
                items-center
                justify-end
                gap-3
              "
            >
              <span>Action</span>

              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="
                  h-[15px]
                  w-[15px]
                  cursor-pointer
                  accent-[#2196e0]
                "
              />
            </div>
          </div>

          {/* ROWS */}

          <div className="mt-2 space-y-2">
            {paginatedEmployees.map(
              (employee) => {
                const checked =
                  selectedIds.includes(
                    employee.id
                  );

                return (
                  <div
                    key={employee.id}
                    className="
                      grid
                      min-h-[58px]
                      grid-cols-[220px_minmax(250px,1fr)_minmax(300px,1fr)_90px]
                      items-center
                      rounded-md
                      border
                      border-[#eef1f5]
                      bg-white
                      px-3
                      text-sm
                      text-[#344054]
                      shadow-[0_1px_2px_rgba(16,24,40,0.03)]
                    "
                  >
                    <div>{employee.id}</div>

                    <div>{employee.name}</div>

                    <div>{employee.authority}</div>

                    <div
                      className="
                        flex
                        justify-end
                        pr-1
                      "
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() =>
                          toggleEmployee(
                            employee.id
                          )
                        }
                        className="
                          h-[15px]
                          w-[15px]
                          cursor-pointer
                          accent-[#2196e0]
                        "
                      />
                    </div>
                  </div>
                );
              }
            )}

            {paginatedEmployees.length === 0 && (
              <div
                className="
                  rounded-md
                  border
                  bg-white
                  px-4
                  py-12
                  text-center
                  text-sm
                  text-slate-500
                "
              >
                No employees found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===================== PAGINATION ===================== */}

      <div className="px-2 sm:px-4">
        {/* <div
          className="
            flex
            h-[45px]
            items-center
            justify-end
            gap-4
            text-sm
            text-[#667085]
          "
        > */}
        <div className="flex min-h-[45px] flex-wrap items-center justify-center gap-2 py-2 text-sm text-[#667085] sm:justify-end sm:gap-4 sm:py-0">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>

            <select
              defaultValue="10"
              className="
                border-0
                bg-transparent
                text-sm
                outline-none
              "
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          <span>
            {filteredEmployees.length === 0
              ? "0"
              : `${(page - 1) * pageSize + 1} to ${Math.min(
                  page * pageSize,
                  filteredEmployees.length
                )}`}{" "}
            of {filteredEmployees.length}
          </span>

          <button
            type="button"
            disabled={page === 1}
            onClick={() =>
              setPage((previous) =>
                Math.max(1, previous - 1)
              )
            }
            className="
              px-1
              text-lg
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            ‹
          </button>

          <button
            type="button"
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              bg-[#e8edf3]
              text-sm
              text-[#344054]
            "
          >
            {page}
          </button>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() =>
              setPage((previous) =>
                Math.min(
                  totalPages,
                  previous + 1
                )
              )
            }
            className="
              px-1
              text-lg
              disabled:cursor-not-allowed
              disabled:opacity-30
            "
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
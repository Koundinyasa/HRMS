import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Plus,
  X,
  Filter,
  Clock,
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
    id: "294641",
    name: "Ajay Jetty",
    mobile: "9603090005",
    email: "ajay.j@koundinyasatech.com",
    essRole: "ESS",
    payrollRole: "",
  },
  {
    id: "294664",
    name: "Ajaykumar Akkapalli",
    mobile: "9581945447",
    email: "ajaykumar.a@koundinyasatech.com",
    essRole: "ESS",
    payrollRole: "",
  },
  {
    id: "294667",
    name: "Akhil Reddy",
    mobile: "8688076969",
    email: "akhil.b@koundinyasatech.com",
    essRole: "ESS",
    payrollRole: "",
  },
  {
    id: "294658",
    name: "Anuli Umesh Wandkar",
    mobile: "9850081160",
    email: "anuli.w@koundinyasatech.com",
    essRole: "ESS",
    payrollRole: "",
  },
  {
    id: "324833",
    name: "Aparna Karigam",
    mobile: "1234567890",
    email: "aparna.karigam@koundinyasatech.com",
    essRole: "ESS",
    payrollRole: "HR Executive",
  },
  {
    id: "KTS164222",
    name: "Shiva Prasad Avula",
    mobile: "7671853449",
    email: "avulashivaprasad46@gmail.com",
    essRole: "ESS",
    payrollRole: "",
  },
  {
    id: "294640",
    name: "BHAGYARAJA AVURAPALLI",
    mobile: "9491964186",
    email: "bhagyraja.a@koundinyasatech.com",
    essRole: "ESS",
    payrollRole: "",
  },
  {
    id: "294642",
    name: "Bhavani Kumari",
    mobile: "9849123456",
    email: "bhavani.k@koundinyasatech.com",
    essRole: "ESS",
    payrollRole: "",
  },
  {
    id: "294650",
    name: "Chandana Reddy",
    mobile: "9876543210",
    email: "chandana.r@koundinyasatech.com",
    essRole: "ESS",
    payrollRole: "",
  },
  {
    id: "294655",
    name: "Dinesh Kumar",
    mobile: "9988776655",
    email: "dinesh.k@koundinyasatech.com",
    essRole: "ESS",
    payrollRole: "",
  },
];

export default function BulkUpdateRolePage() {
  const navigate = useNavigate();

  const { domain } = useParams<{
    domain: string;
  }>();

  const basePath = `/${domain ?? ""}/admin/${BULK_UPDATE_SECTION_PATH}`;

  const [search, setSearch] = useState("");

  const [essRole, setEssRole] =
    useState("Select");

  const [payrollRole, setPayrollRole] =
    useState("Select");

  const [selectedIds, setSelectedIds] =
    useState<string[]>([]);

  const [activeFilter, setActiveFilter] =
    useState<string | null>(null);

  const [page, setPage] = useState(1);

  const pageSize = 10;

  const filteredEmployees = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return employees;
    }

    return employees.filter(
      (employee) =>
        employee.id
          .toLowerCase()
          .includes(value) ||
        employee.name
          .toLowerCase()
          .includes(value) ||
        employee.mobile
          .toLowerCase()
          .includes(value) ||
        employee.email
          .toLowerCase()
          .includes(value)
    );
  }, [search]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredEmployees.length / pageSize
    )
  );

  const paginatedEmployees =
    filteredEmployees.slice(
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
        ? previous.filter(
            (item) => item !== id
          )
        : [...previous, id]
    );
  };

  const toggleAll = () => {
    if (allSelected) {
      setSelectedIds((previous) =>
        previous.filter(
          (id) =>
            !paginatedEmployees.some(
              (employee) =>
                employee.id === id
            )
        )
      );

      return;
    }

    setSelectedIds((previous) => [
      ...new Set([
        ...previous,
        ...paginatedEmployees.map(
          (employee) => employee.id
        ),
      ]),
    ]);
  };

  const clearFilters = () => {
    setSearch("");
    setActiveFilter(null);
    setPage(1);
  };

  const handleUpdate = () => {
    console.log("Role Update", {
      essRole,
      payrollRole,
      employeeIds: selectedIds,
    });
  };

  const handleTabClick = (path: string) => {
    if (path === "role") {
      return;
    }

    navigate(`${basePath}/${path}`);
  };

  return (
    <div className="min-h-full w-full bg-[#f8fafc] text-[#344054]">
      {/* TOP TABS */}

      <div className="border-b border-[#edf0f3] bg-white">
        {/* <div className="flex h-[64px] items-center justify-between px-4">
          <div className="flex h-full items-center gap-8 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"> */}
          <div className="flex h-[56px] items-center justify-between gap-2 px-2 sm:h-[64px] sm:gap-4 sm:px-4">
      <div className="flex h-full min-w-0 items-center gap-5 overflow-x-auto whitespace-nowrap [scrollbar-width:none] sm:gap-8 [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => {
              const isActive =
                tab.path === "role";

              return (
                <button
                  key={tab.path}
                  type="button"
                  onClick={() =>
                    handleTabClick(tab.path)
                  }
                  className={`relative h-full px-1 text-[15px] font-medium transition ${
                    isActive
                      ? "text-[#2196e0]"
                      : "text-[#667085] hover:text-[#344054]"
                  }`}
                >
                  {tab.label}

                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#2196e0]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* <div className="flex shrink-0 items-center gap-5 text-[#98a2b3]"> */}
             <div className="flex shrink-0 items-center gap-3 text-[#98a2b3] sm:gap-5">
            <button
              type="button"
              title="Filter"
              className="hover:text-[#475467]"
            >
              <Filter size={18} />
            </button>

            <button
              type="button"
              title="History"
              className="hover:text-[#475467]"
            >
              <Clock size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ROLE CONTROLS */}

      {/* <div className="px-4">
        <div className="mt-2 flex min-h-[52px] items-center justify-end gap-3 rounded-md border border-[#edf0f3] bg-white px-3"> */}
        <div className="px-2 sm:px-4">
           <div className="mt-2 flex min-h-[52px] flex-wrap items-center justify-end gap-2 rounded-md border border-[#edf0f3] bg-white px-3 py-2 sm:flex-nowrap sm:gap-3 sm:py-0">
          <span className="text-[14px] font-medium text-[#344054]">
            Ess Role
          </span>

          <div className="relative">
            <select
              value={essRole}
              onChange={(event) =>
                setEssRole(
                  event.target.value
                )
              }
              className="h-[38px] w-[140px] appearance-none rounded-md border border-[#d9e0e7] bg-[#edf3f8] px-3 pr-8 text-[14px] text-[#475467] outline-none focus:border-[#2196e0]"
            >
              <option>Select</option>
              <option>ESS</option>
              <option>ESS Admin</option>
              <option>Employee</option>
            </select>

            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]"
            />
          </div>

          <span className="ml-2 text-[14px] font-medium text-[#344054]">
            Payroll Role
          </span>

          <div className="relative">
            <select
              value={payrollRole}
              onChange={(event) =>
                setPayrollRole(
                  event.target.value
                )
              }
              className="h-[38px] w-[140px] appearance-none rounded-md border border-[#d9e0e7] bg-[#edf3f8] px-3 pr-8 text-[14px] text-[#475467] outline-none focus:border-[#2196e0]"
            >
              <option>Select</option>
              <option>HR Executive</option>
              <option>Payroll Admin</option>
              <option>
                Payroll Executive
              </option>
              <option>Manager</option>
            </select>

            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#667085]"
            />
          </div>

          <button
            type="button"
            onClick={handleUpdate}
            className="h-[38px] rounded-md bg-[#2196e0] px-5 text-[14px] font-semibold text-white shadow-sm hover:bg-[#1688d1]"
          >
            Update
          </button>
        </div>

        {/* FILTER BAR */}

        {/* <div className="mt-2 flex h-[52px] items-center gap-4 overflow-x-auto whitespace-nowrap rounded-md border border-[#edf0f3] bg-white px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="relative flex w-[250px] shrink-0 items-center"> */}
           <div className="mt-2 flex h-[52px] items-center gap-3 overflow-x-auto whitespace-nowrap rounded-md border border-[#edf0f3] bg-white px-3 sm:gap-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
         <div className="relative flex w-[200px] shrink-0 items-center sm:w-[250px]">
            <Search
              size={17}
              className="absolute left-1 text-[#98a2b3]"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(
                  event.target.value
                );
                setPage(1);
              }}
              placeholder="Start Typing..."
              className="h-[36px] w-full border-0 bg-transparent pl-7 text-[14px] outline-none placeholder:text-[#c1c7d0]"
            />
          </div>

          <button
            type="button"
            className="flex shrink-0 items-center gap-1.5 text-[14px] text-[#475467]"
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
              className={`flex shrink-0 items-center gap-1.5 text-[14px] ${
                activeFilter === field
                  ? "font-semibold text-[#2196e0]"
                  : "text-[#667085]"
              }`}
            >
              {field}

              <ChevronDown size={14} />
            </button>
          ))}

          <button
            type="button"
            onClick={clearFilters}
            className="ml-auto shrink-0 text-[#e05a5a]"
          >
            <X size={19} />
          </button>
        </div>

        {/* TABLE HEADER */}

        <div
          className="
            mt-2
            grid
            h-[52px]
            grid-cols-[minmax(280px,1.2fr)_minmax(170px,0.7fr)_minmax(320px,1.4fr)_115px_150px_35px]
            items-center
            rounded-md
            bg-[#d7ebfa]
            px-3
            text-[14px]
            font-semibold
            text-[#344054]
            whitespace-nowrap
          "
        >
          <div>Employee Name</div>

          <div>Mobile No.</div>

          <div>Email Id.</div>

          <div>ESS Role</div>

          <div>Payroll Role</div>

          <div className="flex justify-end">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="h-[15px] w-[15px] cursor-pointer accent-[#2196e0]"
            />
          </div>
        </div>

        {/* EMPLOYEE ROWS */}

        <div className="space-y-2 pt-2">
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
                    h-[52px]
                    min-h-[52px]
                    grid-cols-[minmax(280px,1.2fr)_minmax(170px,0.7fr)_minmax(320px,1.4fr)_115px_150px_35px]
                    items-center
                    rounded-md
                    border
                    border-[#eef1f5]
                    bg-white
                    px-3
                    text-[14px]
                    text-[#344054]
                    shadow-[0_1px_2px_rgba(16,24,40,0.03)]
                    whitespace-nowrap
                  "
                >
                  {/* EMPLOYEE */}

                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="shrink-0 rounded-sm bg-[#20b99a] px-2 py-1 text-[12px] font-semibold text-white">
                      {employee.id}
                    </span>

                    <span className="truncate font-medium">
                      {employee.name}
                    </span>
                  </div>

                  {/* MOBILE */}

                  <div className="truncate">
                    {employee.mobile}
                  </div>

                  {/* EMAIL */}

                  <div className="truncate pr-3">
                    {employee.email}
                  </div>

                  {/* ESS ROLE */}

                  <div className="truncate">
                    {employee.essRole && (
                      <span className="inline-flex rounded-sm bg-[#eef2f6] px-2 py-1 text-[12px] font-medium text-[#667085]">
                        {employee.essRole}
                      </span>
                    )}
                  </div>

                  {/* PAYROLL ROLE */}

                  <div className="truncate">
                    {employee.payrollRole && (
                      <span className="inline-flex rounded-sm bg-[#eef2f6] px-2 py-1 text-[12px] font-medium text-[#667085]">
                        {employee.payrollRole}
                      </span>
                    )}
                  </div>

                  {/* CHECKBOX */}

                  <div className="flex justify-end">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        toggleEmployee(
                          employee.id
                        )
                      }
                      className="h-[15px] w-[15px] cursor-pointer accent-[#2196e0]"
                    />
                  </div>
                </div>
              );
            }
          )}

          {paginatedEmployees.length ===
            0 && (
            <div className="rounded-md border bg-white px-4 py-12 text-center text-sm text-[#98a2b3]">
              No employees found
            </div>
          )}
        </div>

        {/* PAGINATION */}

        {/* <div className="flex h-[52px] items-center justify-end gap-4 text-[14px] text-[#667085]"> */}
        <div className="flex min-h-[52px] flex-wrap items-center justify-center gap-2 py-2 text-[14px] text-[#667085] sm:justify-end sm:gap-4 sm:py-0">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>

            <span>10</span>
          </div>

          <span>
            {filteredEmployees.length ===
            0
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
                Math.max(
                  1,
                  previous - 1
                )
              )
            }
            className="text-lg disabled:opacity-30"
          >
            ‹
          </button>

          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e8edf3]">
            {page}
          </span>

          <button
            type="button"
            disabled={
              page >= totalPages
            }
            onClick={() =>
              setPage((previous) =>
                Math.min(
                  totalPages,
                  previous + 1
                )
              )
            }
            className="text-lg disabled:opacity-30"
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
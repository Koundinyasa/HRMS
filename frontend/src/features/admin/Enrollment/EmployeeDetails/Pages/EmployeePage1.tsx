import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  LayoutGrid,
  X,
  ChevronDown,
  ChevronUp,
  Filter,
  Clock,
  Check,
  MoreVertical,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";

import EnrollmentToolbarPortal from "../components/EnrollmentToolbarPortal";
import EnrollmentTabs from "../components/EnrollmentTabs";

import {
  useGetEmployeesQuery,
  isEmployeeFull,
  type Employee,
  type EmployeeFilterType,
} from "../api/employeedetailsApi";

/* ============================================================
   TYPES
============================================================ */

type SortConfig = {
  key: string | null;
  dir: "asc" | "desc";
};

type ColFilters = Record<string, string>;

type FilterMenuProps = {
  label: string;
  options: string[];
  selected: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
};

type Column = {
  key: string;
  label: string;
};

/* ============================================================
   VALID EMPLOYEE FILTER TYPES
============================================================ */

const VALID_TYPES: EmployeeFilterType[] = [
  "all",
  "male",
  "female",
  "joined",
  "left",
  "confirmation-pending",
];

/* ============================================================
   TABLE COLUMNS
============================================================ */

const FULL_COLUMNS: Column[] = [
  {
    key: "EmployeeName",
    label: "Name",
  },
  {
    key: "JoiningDate",
    label: "Joining Date",
  },
  {
    key: "Email",
    label: "Contact",
  },
  {
    key: "BranchName",
    label: "Branch",
  },
  {
    key: "LeavePolicyName",
    label: "Leave Policy",
  },
];

const BASIC_COLUMNS: Column[] = [
  {
    key: "EmployeeName",
    label: "Name",
  },
  {
    key: "ReportingAuthorityName",
    label: "Reporting Authority",
  },
];

/* ============================================================
   OUTSIDE CLICK
============================================================ */

function useOutsideClick(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void
) {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as Node;

      if (ref.current && !ref.current.contains(target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [ref, callback]);
}

/* ============================================================
   FIXED DROPDOWN
============================================================ */

function FixedDropdown({
  anchor,
  children,
  width = 220,
  onClose,
}: {
  anchor: HTMLElement | null;
  children: ReactNode;
  width?: number;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (!anchor) {
      return;
    }

    const update = () => {
      const rect = anchor.getBoundingClientRect();

      let left = rect.left;

      if (left + width > window.innerWidth - 10) {
        left = window.innerWidth - width - 10;
      }

      if (left < 10) {
        left = 10;
      }

      setPosition({
        top: rect.bottom + 5,
        left,
      });
    };

    update();

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [anchor, width]);

  useOutsideClick(ref, onClose);

  if (!anchor) {
    return null;
  }

  return (
    <div
      ref={ref}
      className="fixed z-[9999] overflow-hidden rounded-[5px] border border-[#DDE5EF] bg-white shadow-[0_7px_22px_rgba(30,55,90,0.16)]"
      style={{
        top: position.top,
        left: position.left,
        width,
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   CHECKBOX
============================================================ */

function CheckBox({
  checked,
}: {
  checked: boolean;
}) {
  return (
    <span
      className={[
        "flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-[2px] transition-all duration-100",
        checked
          ? "bg-[#F97316]"
          : "border border-[#C6D1DE] bg-white",
      ].join(" ")}
    >
      {checked && (
        <Check
          size={10}
          strokeWidth={3}
          className="text-white"
        />
      )}
    </span>
  );
}

/* ============================================================
   MULTI FILTER
============================================================ */

function MultiFilter({
  label,
  options,
  selected,
  onChange,
}: FilterMenuProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [open, setOpen] = useState(false);

  const toggle = (option: string) => {
    onChange((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const clear = () => {
    onChange([]);
    setOpen(false);
  };

  const active = selected.length > 0;

  if (options.length === 0) {
    return null;
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={[
          "flex h-[28px] shrink-0 items-center gap-[4px] rounded-[4px] px-[7px] text-[12px] font-medium transition-colors duration-100",
          active
            ? "bg-[#FFEDD5] text-[#F97316]"
            : "text-[#526174] hover:bg-[#FFF7ED]",
        ].join(" ")}
      >
        <span>
          {label}
          {selected.length > 1
            ? ` (+${selected.length - 1})`
            : ""}
        </span>

        {open ? (
          <ChevronUp
            size={12}
            strokeWidth={2}
          />
        ) : (
          <ChevronDown
            size={12}
            strokeWidth={2}
          />
        )}
      </button>

      {open && (
        <FixedDropdown
          anchor={buttonRef.current}
          width={224}
          onClose={() => setOpen(false)}
        >
          <div className="max-h-[270px] overflow-y-auto py-[4px]">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => toggle(option)}
                className="flex w-full items-center gap-[10px] px-[13px] py-[8px] text-left text-[12px] font-medium text-[#34445C] hover:bg-[#FFF7ED]"
              >
                <CheckBox
                  checked={selected.includes(option)}
                />

                <span className="truncate">
                  {option}
                </span>
              </button>
            ))}
          </div>

          <div className="border-t border-[#EEF2F6]">
            <button
              type="button"
              onClick={clear}
              className="flex h-[34px] w-full items-center justify-center gap-[5px] text-[12px] font-medium text-[#A2ACB9] hover:bg-[#FFF7ED]"
            >
              <X size={12} />
              Clear
            </button>
          </div>
        </FixedDropdown>
      )}
    </>
  );
}

/* ============================================================
   COLUMN HEADER
============================================================ */

function ColumnHeader({
  column,
  sortConfig,
  setSortConfig,
  filters,
  setFilters,
}: {
  column: Column;
  sortConfig: SortConfig;
  setSortConfig: Dispatch<SetStateAction<SortConfig>>;
  filters: ColFilters;
  setFilters: Dispatch<SetStateAction<ColFilters>>;
}) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [open, setOpen] = useState(false);

  const filterValue = filters[column.key] || "";

  const sorted = sortConfig.key === column.key;

  const active =
    sorted || Boolean(filterValue);

  const sort = (direction: "asc" | "desc") => {
    setSortConfig({
      key: column.key,
      dir: direction,
    });

    setOpen(false);
  };

  return (
    <>
      <div className="flex h-[39px] items-center gap-[3px] px-[10px]">
        <button
          type="button"
          onClick={() =>
            setSortConfig((prev) => ({
              key: column.key,
              dir:
                prev.key === column.key &&
                prev.dir === "asc"
                  ? "desc"
                  : "asc",
            }))
          }
          className="truncate text-[12px] font-semibold text-[#263B55]"
        >
          {column.label}
        </button>

        <button
          ref={buttonRef}
          type="button"
          title={`Filter ${column.label}`}
          onClick={() => setOpen((v) => !v)}
          className={[
            "flex h-[20px] w-[20px] items-center justify-center rounded",
            active
              ? "text-[#F97316]"
              : "text-[#91A6BC] hover:text-[#F97316]",
          ].join(" ")}
        >
          <Filter
            size={11}
            strokeWidth={2}
          />
        </button>
      </div>

      {open && (
        <FixedDropdown
          anchor={buttonRef.current}
          width={220}
          onClose={() => setOpen(false)}
        >
          <div className="p-[8px]">
            <button
              type="button"
              onClick={() => sort("asc")}
              className={[
                "flex w-full items-center gap-[8px] rounded px-[8px] py-[7px] text-left text-[12px]",
                sorted && sortConfig.dir === "asc"
                  ? "bg-[#FFEDD5] font-semibold text-[#F97316]"
                  : "text-[#34445C] hover:bg-[#FFF7ED]",
              ].join(" ")}
            >
              <ArrowUpDown size={12} />
              Sort A to Z
            </button>

            <button
              type="button"
              onClick={() => sort("desc")}
              className={[
                "flex w-full items-center gap-[8px] rounded px-[8px] py-[7px] text-left text-[12px]",
                sorted && sortConfig.dir === "desc"
                  ? "bg-[#FFEDD5] font-semibold text-[#F97316]"
                  : "text-[#34445C] hover:bg-[#FFF7ED]",
              ].join(" ")}
            >
              <ArrowUpDown size={12} />
              Sort Z to A
            </button>

            <div className="my-[7px] h-px bg-[#EDF1F5]" />

            <input
              autoFocus
              value={filterValue}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  [column.key]: e.target.value,
                }))
              }
              placeholder={`Filter ${column.label.toLowerCase()}`}
              className="h-[30px] w-full rounded-[4px] border border-[#D9E2EC] px-[9px] text-[11.5px] text-[#33415C] outline-none placeholder:text-[#A2AFBF] focus:border-[#F97316]"
            />

            {filterValue && (
              <button
                type="button"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    [column.key]: "",
                  }))
                }
                className="mt-[6px] flex w-full items-center justify-center gap-[4px] rounded py-[5px] text-[11.5px] font-medium text-[#F04438] hover:bg-[#FEF3F2]"
              >
                <X size={11} />
                Clear
              </button>
            )}
          </div>
        </FixedDropdown>
      )}
    </>
  );
}

/* ============================================================
   EMPLOYEE PAGE
============================================================ */

export default function EmployeePage1() {
  const navigate = useNavigate();

  const { domain } = useParams();

  const [searchParams] = useSearchParams();

  /* ============================================================
     URL FILTER TYPE
  ============================================================ */

  const rawType = searchParams.get("type") ?? "all";

  const type: EmployeeFilterType = VALID_TYPES.includes(
    rawType as EmployeeFilterType
  )
    ? (rawType as EmployeeFilterType)
    : "all";

  /* ============================================================
     BACKEND API

     IMPORTANT:
     Backend endpoint does NOT accept flags.

     GET /api/admin/employee-details/employees

     Therefore:
     useGetEmployeesQuery()
  ============================================================ */

  const {
    data,
    isLoading,
    isError,
  } = useGetEmployeesQuery();

  /* ============================================================
     FRONTEND FILTERING

     Backend returns all employees.

     We filter here according to the dashboard type.
  ============================================================ */

  const employees = useMemo(() => {
    // getEmployees now returns Employee[] directly (transformResponse
    // unwraps the backend's bare array), so no more `?.data`
    const allEmployees = data ?? [];

    if (type === "all") {
      return allEmployees;
    }

    return allEmployees.filter((employee) => {
      /* ======================================================
         MALE
      ====================================================== */

      if (type === "male") {
        return (
          String(
            (employee as any).Gender ?? ""
          )
            .trim()
            .toLowerCase() === "male"
        );
      }

      /* ======================================================
         FEMALE
      ====================================================== */

      if (type === "female") {
        return (
          String(
            (employee as any).Gender ?? ""
          )
            .trim()
            .toLowerCase() === "female"
        );
      }

      /* ======================================================
         JOINED

         Backend returns JoiningDate.
         Keep employees having JoiningDate.
      ====================================================== */

      if (type === "joined") {
        return Boolean(
          (employee as any).JoiningDate
        );
      }

      /* ======================================================
         LEFT

         Backend returns ExitDate.
         Keep employees having ExitDate.
      ====================================================== */

      if (type === "left") {
        return Boolean(
          (employee as any).ExitDate
        );
      }

      /* ======================================================
         CONFIRMATION PENDING
      ====================================================== */

      if (type === "confirmation-pending") {
        const confirmationStatus = String(
          (employee as any).ConfirmationStatus ??
            (employee as any).EmpStatus ??
            (employee as any).EmployeeStatus ??
            ""
        )
          .trim()
          .toLowerCase();

        return (
          confirmationStatus.includes("pending") ||
          confirmationStatus.includes(
            "confirmation pending"
          )
        );
      }

      return true;
    });
  }, [data, type]);

  /* ============================================================
     TABLE COLUMNS
  ============================================================ */

  const columns =
    type === "all"
      ? FULL_COLUMNS
      : BASIC_COLUMNS;

  /* ============================================================
     SEARCH
  ============================================================ */

  const [search, setSearch] = useState("");

  /* ============================================================
     SORT
  ============================================================ */

  const [sortConfig, setSortConfig] =
    useState<SortConfig>({
      key: null,
      dir: "asc",
    });

  /* ============================================================
     COLUMN FILTER
  ============================================================ */

  const [colFilters, setColFilters] =
    useState<ColFilters>({});

  /* ============================================================
     FILTER STATES
  ============================================================ */

  const [branchFilter, setBranchFilter] =
    useState<string[]>([]);

  const [leaveFilter, setLeaveFilter] =
    useState<string[]>([]);

  const [attendanceFilter, setAttendanceFilter] =
    useState<string[]>([]);

  const [salaryFilter, setSalaryFilter] =
    useState<string[]>([]);

  const [designationFilter, setDesignationFilter] =
    useState<string[]>([]);

  const [empStatusFilter, setEmpStatusFilter] =
    useState<string[]>([]);

  const [queryFilter, setQueryFilter] =
    useState<string[]>([]);

  /* ============================================================
     UI STATES
  ============================================================ */

  const [showFilterRow, setShowFilterRow] =
    useState(true);

  const [showMoreMenu, setShowMoreMenu] =
    useState(false);

  const [showClockMenu, setShowClockMenu] =
    useState(false);

  const [rightTab, setRightTab] =
    useState("Table");

  /* ============================================================
     PAGINATION
  ============================================================ */

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  const [page, setPage] =
    useState(1);

  /* ============================================================
     DELETE
  ============================================================ */

  const [deletingEmployee, setDeletingEmployee] =
    useState<Employee | null>(null);

  /* ============================================================
     TOAST
  ============================================================ */

  const [toast, setToast] =
    useState<string | null>(null);

  const flash = (message: string) => {
    setToast(message);

    window.setTimeout(() => {
      setToast(null);
    }, 2200);
  };

  /* ============================================================
     FILTER OPTIONS
  ============================================================ */

  const filterOptions = useMemo(() => {
    const fullRows =
      employees.filter(isEmployeeFull);

    const uniq = (
      values: (string | null | undefined)[]
    ) =>
      Array.from(
        new Set(
          values.filter(
            (v): v is string => Boolean(v)
          )
        )
      );

    return {
      branch: uniq(
        fullRows.map(
          (e) => e.BranchName
        )
      ),

      leave: uniq(
        fullRows.map(
          (e) => e.LeavePolicyName
        )
      ),

      attendance: uniq(
        fullRows.map(
          (e) => e.AttendanceType
        )
      ),

      salary: uniq(
        fullRows.map(
          (e) =>
            (e as any)
              .SalaryStructureName ??
            (e as any)
              .SalaryStructure
        )
      ),

      designation: uniq(
        fullRows.map(
          (e) => e.DesignationName
        )
      ),

      empStatus: uniq(
        fullRows.map(
          (e) =>
            (e as any).EmpStatus ??
            (e as any).EmployeeStatus ??
            (e.ExitDate
              ? "Left"
              : "Active")
        )
      ),

      query: [
        "Active",
        "Inactive",
        "On Notice",
        "Confirmed",
      ],
    };
  }, [employees]);

  /* ============================================================
     EMPLOYEE STATUS
  ============================================================ */

  const getEmpStatus = (
    employee: Employee
  ) =>
    String(
      (employee as any).EmpStatus ??
        (employee as any)
          .EmployeeStatus ??
        (isEmployeeFull(employee) &&
        employee.ExitDate
          ? "Left"
          : "Active")
    );

  /* ============================================================
     SEARCH + FILTER + SORT
  ============================================================ */

  const filteredEmployees = useMemo(() => {
    const q = search
      .trim()
      .toLowerCase();

    let result = employees.filter(
      (employee) => {
        /* ======================================================
           SEARCH
        ====================================================== */

        const searchMatch =
          !q ||
          employee.EmployeeName
            ?.toLowerCase()
            .includes(q) ||
          String(employee.EmployeeID)
            .toLowerCase()
            .includes(q) ||
          (isEmployeeFull(employee) &&
            (employee.Email
              ?.toLowerCase()
              .includes(q) ||
              employee.DesignationName
                ?.toLowerCase()
                .includes(q) ||
              employee.BranchName
                ?.toLowerCase()
                .includes(q)));

        /* ======================================================
           DROPDOWN FILTERS
        ====================================================== */

        const dropdownMatch =
          type !== "all" ||
          !isEmployeeFull(employee) ||
          ((branchFilter.length === 0 ||
            (employee.BranchName &&
              branchFilter.includes(
                employee.BranchName
              ))) &&
            (leaveFilter.length === 0 ||
              (employee.LeavePolicyName &&
                leaveFilter.includes(
                  employee.LeavePolicyName
                ))) &&
            (attendanceFilter.length === 0 ||
              (employee.AttendanceType &&
                attendanceFilter.includes(
                  employee.AttendanceType
                ))) &&
            (salaryFilter.length === 0 ||
              salaryFilter.includes(
                String(
                  (employee as any)
                    .SalaryStructureName ??
                    (employee as any)
                      .SalaryStructure ??
                    ""
                )
              )) &&
            (designationFilter.length === 0 ||
              (employee.DesignationName &&
                designationFilter.includes(
                  employee.DesignationName
                ))) &&
            (empStatusFilter.length === 0 ||
              empStatusFilter.includes(
                getEmpStatus(employee)
              )) &&
            (queryFilter.length === 0 ||
              queryFilter.includes(
                getEmpStatus(employee)
              )));

        /* ======================================================
           COLUMN FILTER
        ====================================================== */

        const columnMatch =
          Object.entries(
            colFilters
          ).every(([key, value]) => {
            if (!value) {
              return true;
            }

            const employeeValue =
              String(
                (employee as any)[key] ??
                  ""
              ).toLowerCase();

            return employeeValue.includes(
              value.toLowerCase()
            );
          });

        return (
          searchMatch &&
          dropdownMatch &&
          columnMatch
        );
      }
    );

    /* ==========================================================
       SORT
    ========================================================== */

    if (sortConfig.key) {
      result = [...result].sort(
        (a, b) => {
          const first = String(
            (a as any)[
              sortConfig.key!
            ] ?? ""
          ).toLowerCase();

          const second = String(
            (b as any)[
              sortConfig.key!
            ] ?? ""
          ).toLowerCase();

          if (first < second) {
            return sortConfig.dir === "asc"
              ? -1
              : 1;
          }

          if (first > second) {
            return sortConfig.dir === "asc"
              ? 1
              : -1;
          }

          return 0;
        }
      );
    }

    return result;
  }, [
    employees,
    search,
    branchFilter,
    leaveFilter,
    attendanceFilter,
    salaryFilter,
    designationFilter,
    empStatusFilter,
    queryFilter,
    colFilters,
    sortConfig,
    type,
  ]);

  /* ============================================================
     PAGINATION CALCULATIONS
  ============================================================ */

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredEmployees.length /
        rowsPerPage
    )
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const pageRows =
    filteredEmployees.slice(
      (currentPage - 1) *
        rowsPerPage,
      currentPage * rowsPerPage
    );

  const startIndex =
    filteredEmployees.length === 0
      ? 0
      : (currentPage - 1) *
          rowsPerPage +
        1;

  const endIndex = Math.min(
    currentPage * rowsPerPage,
    filteredEmployees.length
  );

  /* ============================================================
     RESET PAGE WHEN FILTERS CHANGE
  ============================================================ */

  useEffect(() => {
    setPage(1);
  }, [
    search,
    branchFilter,
    leaveFilter,
    attendanceFilter,
    salaryFilter,
    designationFilter,
    empStatusFilter,
    queryFilter,
    colFilters,
    rowsPerPage,
    type,
  ]);

  /* ============================================================
     CLEAR ALL FILTERS
  ============================================================ */

  const clearAllFilters = () => {
    setSearch("");

    setBranchFilter([]);
    setLeaveFilter([]);
    setAttendanceFilter([]);
    setSalaryFilter([]);
    setDesignationFilter([]);
    setEmpStatusFilter([]);
    setQueryFilter([]);

    setColFilters({});

    setSortConfig({
      key: null,
      dir: "asc",
    });

    setPage(1);

    flash("Filters cleared");
  };

  /* ============================================================
     EXPORT CSV
  ============================================================ */

  const exportCSV = () => {
    const headers =
      type === "all"
        ? [
            "Emp ID",
            "Name",
            "Designation",
            "Joining Date",
            "Email",
            "Mobile",
            "Branch",
            "Leave Policy",
            "Attendance",
          ]
        : [
            "Emp ID",
            "Name",
            "Reporting Authority",
          ];

    const rows =
      filteredEmployees.map((e) =>
        isEmployeeFull(e)
          ? [
              e.EmployeeID,
              e.EmployeeName,
              e.DesignationName,
              e.JoiningDate,
              e.Email,
              e.MobileNo,
              e.BranchName,
              e.LeavePolicyName,
              e.AttendanceType,
            ]
          : [
              e.EmployeeID,
              e.EmployeeName,
              e.ReportingAuthorityName,
            ]
      );

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(
                value ?? ""
              ).replace(
                /"/g,
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "Employees.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    flash(
      "Employees.csv downloaded"
    );
  };

  /* ============================================================
     PAGE NUMBERS
  ============================================================ */

  const pageNumbers = useMemo(() => {
    const numbers: (
      | number
      | string
    )[] = [];

    for (
      let i = 1;
      i <= totalPages;
      i++
    ) {
      if (
        i <= 5 ||
        i === totalPages ||
        Math.abs(
          i - currentPage
        ) <= 1
      ) {
        numbers.push(i);
      } else if (
        numbers[
          numbers.length - 1
        ] !== "..."
      ) {
        numbers.push("...");
      }
    }

    return numbers;
  }, [
    totalPages,
    currentPage,
  ]);

  /* ============================================================
     LOADING
  ============================================================ */

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-[12px] text-[#8291A4]">
        Loading employees...
      </div>
    );
  }

  /* ============================================================
     ERROR
  ============================================================ */

  if (isError) {
    return (
      <div className="flex min-h-[400px] items-center justify-center text-[12px] text-[#F04438]">
        Could not load employees.
        Please try again.
      </div>
    );
  }

  /* ============================================================
     GRID
  ============================================================ */

  const gridCols =
    type === "all"
      ? "minmax(210px,2.05fr) minmax(145px,1fr) minmax(210px,1.55fr) minmax(225px,1.75fr) minmax(160px,1.2fr) 112px"
      : "minmax(210px,2.05fr) minmax(210px,1.55fr) 112px";

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <div
      className="min-h-full w-full bg-[#EDEDED] text-[#131313]"
      style={{
        fontFamily:
          "Urbanist, Geist Variable, sans-serif",
      }}
    >
      {/* ======================================================
          TOAST
      ====================================================== */}

      {toast && (
        <div className="fixed right-[22px] top-[18px] z-[10000] flex items-center gap-[8px] rounded-[6px] bg-[#26364F] px-[13px] py-[8px] text-[12px] text-white shadow-[0_8px_24px_rgba(20,35,55,0.22)]">
          <Check
            size={13}
            className="text-[#4ADE80]"
          />

          {toast}
        </div>
      )}

      {/* ======================================================
          TABS
      ====================================================== */}

      <EnrollmentTabs />

      {/* ======================================================
          TOOLBAR
      ====================================================== */}

      <EnrollmentToolbarPortal>
        {/* ADD EMPLOYEE */}

        <button
          type="button"
          onClick={() =>
            navigate(
              `/${domain}/admin/enrollment/EmployeeDetails/add-employee`
            )
          }
          className="flex h-[27px] items-center gap-[6px] rounded-[5px] bg-[#FF6200] px-[12px] text-[11.5px] font-semibold text-white shadow-[0_2px_5px_rgba(255,98,0,0.2)] transition hover:bg-[#E55600]"
        >
          <Plus
            size={14}
            strokeWidth={2.8}
          />

          Add Employee
        </button>

        {/* EXPORT */}

        <button
          type="button"
          onClick={exportCSV}
          title="Export"
          className="flex h-[27px] w-[27px] items-center justify-center rounded-[5px] text-[#03884A] transition hover:bg-[#F5FFFA]"
        >
          <span className="text-[9px] font-bold">
            XLS
          </span>
        </button>

        {/* FILTER */}

        <button
          type="button"
          onClick={() =>
            setShowFilterRow(
              (v) => !v
            )
          }
          title="Filter"
          className={[
            "flex h-[27px] w-[27px] items-center justify-center rounded-[5px]",
            showFilterRow
              ? "text-[#FF6200]"
              : "text-[#626262]",
          ].join(" ")}
        >
          <Filter
            size={15}
            strokeWidth={1.9}
          />
        </button>

        {/* CLOCK */}

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setShowClockMenu(
                (v) => !v
              )
            }
            className="flex h-[27px] w-[27px] items-center justify-center rounded-[5px] text-[#626262] hover:bg-[#FFF5EE]"
          >
            <Clock
              size={15}
              strokeWidth={1.9}
            />
          </button>

          {showClockMenu && (
            <div className="absolute right-0 top-[31px] z-[100] w-[200px] rounded-[6px] border border-[#E0E6ED] bg-white py-[6px] shadow-[0_7px_22px_rgba(30,55,90,0.16)]">
              <div className="px-[12px] py-[5px] text-[10px] font-semibold uppercase tracking-wide text-[#A0ADBC]">
                Recent
              </div>

              <div className="px-[12px] py-[8px] text-[11.5px] text-[#68788D]">
                Nothing viewed
                yet.
              </div>
            </div>
          )}
        </div>
      </EnrollmentToolbarPortal>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <div className="flex w-full gap-[6px] pt-[6px]">
        <div className="min-w-0 flex-1">
          {/* ==================================================
              FILTER BAR
          ================================================== */}

          <div className="relative flex min-h-[40px] items-center gap-1 rounded-[8px] border border-[#E2E2E2] bg-white px-[10px] shadow-[0_1px_3px_rgba(19,19,19,0.07)]">
            {/* SEARCH */}

            <div className="relative w-[200px] shrink-0">
              <Search
                size={13}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-[#9DAEC0]"
              />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Start Typing..."
                className="h-[28px] w-full border-none bg-transparent pl-[19px] text-[12px] text-[#131313] outline-none placeholder:text-[#626262]"
              />
            </div>

            {/* ADD FILTER */}

            <button
              type="button"
              onClick={() =>
                setShowFilterRow(
                  (v) => !v
                )
              }
              className="flex h-[28px] shrink-0 items-center gap-[4px] rounded-[4px] px-[8px] text-[12px] font-medium text-[#FF6200] hover:bg-[#FFF5EE]"
            >
              <Plus
                size={12}
                strokeWidth={2.5}
              />

              Add Filter
            </button>

            {/* FILTER OPTIONS */}

            {showFilterRow &&
              type === "all" && (
                <div className="flex min-w-0 flex-1 items-center gap-[2px] overflow-x-auto scrollbar-none">
                  <MultiFilter
                    label="Query"
                    options={
                      filterOptions.query
                    }
                    selected={
                      queryFilter
                    }
                    onChange={
                      setQueryFilter
                    }
                  />

                  <MultiFilter
                    label="Branch"
                    options={
                      filterOptions.branch
                    }
                    selected={
                      branchFilter
                    }
                    onChange={
                      setBranchFilter
                    }
                  />

                  <MultiFilter
                    label="Salary Structure"
                    options={
                      filterOptions.salary
                    }
                    selected={
                      salaryFilter
                    }
                    onChange={
                      setSalaryFilter
                    }
                  />

                  <MultiFilter
                    label="Leave"
                    options={
                      filterOptions.leave
                    }
                    selected={
                      leaveFilter
                    }
                    onChange={
                      setLeaveFilter
                    }
                  />

                  <MultiFilter
                    label="Attendance"
                    options={
                      filterOptions.attendance
                    }
                    selected={
                      attendanceFilter
                    }
                    onChange={
                      setAttendanceFilter
                    }
                  />

                  <MultiFilter
                    label="Designation"
                    options={
                      filterOptions.designation
                    }
                    selected={
                      designationFilter
                    }
                    onChange={
                      setDesignationFilter
                    }
                  />

                  <MultiFilter
                    label="Emp Status"
                    options={
                      filterOptions.empStatus
                    }
                    selected={
                      empStatusFilter
                    }
                    onChange={
                      setEmpStatusFilter
                    }
                  />
                </div>
              )}

            {/* MORE */}

            <button
              type="button"
              onClick={() =>
                setShowMoreMenu(
                  (v) => !v
                )
              }
              className="ml-auto flex h-[25px] w-[22px] shrink-0 items-center justify-center text-[#7F91A7] hover:text-[#34445C]"
            >
              <MoreVertical
                size={15}
              />
            </button>

            {showMoreMenu && (
              <div className="absolute right-[34px] top-[36px] z-[100] w-[185px] overflow-hidden rounded-[5px] border border-[#E0E6ED] bg-white py-[4px] shadow-[0_7px_22px_rgba(30,55,90,0.16)]">
                <button
                  type="button"
                  onClick={() => {
                    clearAllFilters();
                    setShowMoreMenu(
                      false
                    );
                  }}
                  className="w-full px-[12px] py-[8px] text-left text-[11.5px] text-[#405168] hover:bg-[#FFF7ED]"
                >
                  Reset all filters
                </button>

                <button
                  type="button"
                  onClick={() => {
                    exportCSV();
                    setShowMoreMenu(
                      false
                    );
                  }}
                  className="w-full px-[12px] py-[8px] text-left text-[11.5px] text-[#405168] hover:bg-[#FFF7ED]"
                >
                  Download as CSV
                </button>
              </div>
            )}

            {/* CLEAR */}

            <button
              type="button"
              onClick={
                clearAllFilters
              }
              title="Clear all filters"
              className="flex h-[25px] w-[22px] shrink-0 items-center justify-center text-[#F04438] hover:bg-[#FEF3F2]"
            >
              <X
                size={15}
                strokeWidth={2.4}
              />
            </button>
          </div>

          {/* ==================================================
              NON-TABLE VIEWS
          ================================================== */}

          {rightTab !== "Table" ? (
            <div className="mt-[5px] flex min-h-[400px] items-center justify-center rounded-[7px] border border-[#E6EBF1] bg-white text-[12px] text-[#8291A4] shadow-[0_1px_3px_rgba(25,45,70,0.07)]">
              {rightTab} view
            </div>
          ) : (
            <>
              {/* ==================================================
                  TABLE HEADER
              ================================================== */}

              <div
                className="mt-[5px] min-w-[900px] grid items-center rounded-[7px] border border-[#FED7AA] bg-[#FFF7ED] shadow-[0_1px_2px_rgba(25,45,70,0.05)]"
                style={{
                  gridTemplateColumns:
                    gridCols,
                }}
              >
                {columns.map(
                  (column) => (
                    <ColumnHeader
                      key={
                        column.key
                      }
                      column={
                        column
                      }
                      sortConfig={
                        sortConfig
                      }
                      setSortConfig={
                        setSortConfig
                      }
                      filters={
                        colFilters
                      }
                      setFilters={
                        setColFilters
                      }
                    />
                  )
                )}

                <div className="flex h-[39px] items-center px-[10px] text-[12px] font-semibold text-[#9A3412]">
                  Action
                </div>
              </div>

              {/* ==================================================
                  ROWS
              ================================================== */}

              <div className="mt-[5px] min-w-[900px] space-y-[5px]">
                {pageRows.map(
                  (employee) => (
                    <div
                      key={
                        employee.EmployeeID
                      }
                      className="grid min-h-[55px] items-center rounded-[7px] border border-[#E5EAF0] bg-white shadow-[0_1px_3px_rgba(25,45,70,0.08)] transition-all duration-100 hover:border-[#FDBA74] hover:shadow-[0_2px_8px_rgba(25,45,70,0.11)]"
                      style={{
                        gridTemplateColumns:
                          gridCols,
                      }}
                    >
                      {/* ==================================================
                          NAME
                      ================================================== */}

                      <div className="min-w-0 px-[10px] py-[7px]">
                        <div className="flex min-w-0 items-center gap-[7px]">
                          <span className="shrink-0 rounded-[3px] bg-[#FFEDD5] px-[5px] py-[2px] font-mono text-[9px] font-semibold text-[#C2410C]">
                            {
                              employee.EmployeeID
                            }
                          </span>

                          <span className="truncate text-[11.5px] font-semibold text-[#263B55]">
                            {
                              employee.EmployeeName
                            }
                          </span>
                        </div>

                        {isEmployeeFull(
                          employee
                        ) &&
                          employee.DesignationName && (
                            <div className="mt-[6px] truncate text-[9.5px] font-medium uppercase tracking-[0.02em] text-[#718198]">
                              {
                                employee.DesignationName
                              }
                            </div>
                          )}
                      </div>

                      {/* ==================================================
                          FULL EMPLOYEE
                      ================================================== */}

                      {type === "all" &&
                      isEmployeeFull(
                        employee
                      ) ? (
                        <>
                          {/* JOINING / EXIT */}

                          <div className="px-[10px] py-[7px]">
                            {employee.JoiningDate && (
                              <div className="flex items-center gap-[6px]">
                                <span className="rounded-[2px] bg-[#FFEDD5] px-[4px] py-[1px] font-mono text-[8px] font-semibold text-[#F97316]">
                                  DOJ
                                </span>

                                <span className="text-[10.5px] text-[#34445C]">
                                  {
                                    employee.JoiningDate
                                  }
                                </span>
                              </div>
                            )}

                            {employee.ExitDate && (
                              <div className="mt-[5px] flex items-center gap-[6px]">
                                <span className="rounded-[2px] bg-[#FCE8EB] px-[4px] py-[1px] font-mono text-[8px] font-semibold text-[#E03A4A]">
                                  DOL
                                </span>

                                <span className="text-[10.5px] text-[#E03A4A]">
                                  {
                                    employee.ExitDate
                                  }
                                </span>
                              </div>
                            )}
                          </div>

                          {/* CONTACT */}

                          <div className="min-w-0 px-[10px] py-[7px]">
                            {employee.Email && (
                              <div className="truncate text-[10.5px] text-[#34445C]">
                                {
                                  employee.Email
                                }
                              </div>
                            )}

                            {employee.MobileNo && (
                              <div className="mt-[5px] flex items-center gap-[5px]">
                                <span className="rounded-[2px] bg-[#F0F3F7] px-[4px] py-[1px] font-mono text-[8px] font-semibold text-[#7C8B9D]">
                                  Mob
                                </span>

                                <span className="text-[9.5px] text-[#7C8B9D]">
                                  {
                                    employee.MobileNo
                                  }
                                </span>
                              </div>
                            )}
                          </div>

                          {/* BRANCH */}

                          <div className="min-w-0 px-[10px] py-[7px]">
                            {employee.BranchName && (
                              <div className="truncate text-[10.5px] text-[#34445C]">
                                {
                                  employee.BranchName
                                }
                              </div>
                            )}

                            {employee.ReportingManager && (
                              <div className="mt-[5px] flex min-w-0 items-center gap-[5px]">
                                <span className="shrink-0 text-[8.5px] font-semibold text-[#9AA9B9]">
                                  R.A.
                                </span>

                                <span className="truncate text-[9.5px] font-medium uppercase text-[#718198]">
                                  {
                                    employee.ReportingManager
                                  }
                                </span>
                              </div>
                            )}
                          </div>

                          {/* LEAVE / ATTENDANCE */}

                          <div className="min-w-0 px-[10px] py-[7px]">
                            {employee.LeavePolicyName && (
                              <div className="truncate text-[10.5px] text-[#34445C]">
                                {
                                  employee.LeavePolicyName
                                }
                              </div>
                            )}

                            {employee.AttendanceType && (
                              <div className="mt-[5px] flex items-center gap-[5px]">
                                <span className="rounded-[2px] bg-[#E5F4E8] px-[4px] py-[1px] text-[8px] font-semibold text-[#2E7D32]">
                                  Attendance
                                </span>

                                <span className="text-[9.5px] text-[#7B899A]">
                                  {
                                    employee.AttendanceType
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        /* ==================================================
                           BASIC EMPLOYEE
                        ================================================== */

                        <div className="min-w-0 px-[10px] py-[7px]">
                          {!isEmployeeFull(
                            employee
                          ) &&
                            "ReportingAuthorityName" in
                              employee &&
                            employee.ReportingAuthorityName && (
                              <div className="truncate text-[10.5px] text-[#34445C]">
                                {
                                  employee.ReportingAuthorityName
                                }
                              </div>
                            )}
                        </div>
                      )}

                      {/* ==================================================
                          ACTIONS
                      ================================================== */}

                      <div className="flex items-center gap-[3px] px-[10px]">
                        {/* DASHBOARD */}
{/* 
                        <button
                          type="button"
                          title="Employee dashboard"
                          onClick={() =>
                            navigate(
                              `/${domain}/admin/enrollment/employee/${employee.EmployeeID}`
                            )
                          }
                          className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] text-[#68798E] hover:bg-[#FFF7ED] hover:text-[#C2410C]"
                        >
                          <LayoutGrid */}



                                                  <button
                          type="button"
                          title="Open employee details"
                          // onClick={() =>
                          //   navigate(
                          //     `/${domain}/admin/enrollment/EmployeeDetails/add-employee/${employee.EmployeeID}`
                          //   )
                          // }



                          onClick={() =>
                            navigate(
                              `/${domain}/admin/enrollment/EmployeeDetails/add-employee`,
                              { state: { employeeId: employee.EmployeeID } }
                            )
                          }
                          className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] text-[#68798E] hover:bg-[#FFF7ED] hover:text-[#C2410C]"
                        >
                          <LayoutGrid
                            size={13}
                            strokeWidth={
                              2
                            }
                          />
                        </button>

                        {/* EDIT */}

                        <button
                          type="button"
                          title="Edit employee"
                          onClick={() =>
                            navigate(
                              `/${domain}/admin/enrollment/EmployeeDetails/add-employee`,
                              { state: { employeeId: employee.EmployeeID } }
                            )
                          }
                          className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] text-[#F97316] hover:bg-[#FFEDD5]"
                        >
                          <Pencil
                            size={13}
                            strokeWidth={
                              2
                            }
                          />
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          title="Delete employee"
                          onClick={() =>
                            setDeletingEmployee(
                              employee
                            )
                          }
                          className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] text-[#F04438] hover:bg-[#FEF3F2]"
                        >
                          <Trash2
                            size={13}
                            strokeWidth={
                              2
                            }
                          />
                        </button>
                      </div>
                    </div>
                  )
                )}

                {/* NO DATA */}

                {pageRows.length ===
                  0 && (
                  <div className="rounded-[7px] border border-[#E5EAF0] bg-white py-[70px] text-center text-[12px] text-[#8291A4] shadow-[0_1px_3px_rgba(25,45,70,0.07)]">
                    No employees
                    match these
                    filters.
                  </div>
                )}
              </div>

              {/* ==================================================
                  PAGINATION
              ================================================== */}

              <div className="mt-[5px] flex min-w-[900px] items-center justify-end gap-[14px] rounded-[7px] border border-[#E5EAF0] bg-white px-[10px] py-[6px] text-[10px] text-[#66778D] shadow-[0_1px_3px_rgba(25,45,70,0.07)]">
                {/* ROWS PER PAGE */}

                <div className="flex items-center gap-[5px]">
                  <span>
                    Rows per page
                  </span>

                  <div className="relative">
                    <select
                      value={
                        rowsPerPage
                      }
                      onChange={(e) =>
                        setRowsPerPage(
                          Number(
                            e.target.value
                          )
                        )
                      }
                      className="h-[23px] appearance-none rounded-[3px] border-none bg-transparent pl-[2px] pr-[15px] text-[10px] text-[#33445C] outline-none"
                    >
                      {[
                        10,
                        25,
                        50,
                        100,
                      ].map(
                        (n) => (
                          <option
                            key={n}
                            value={n}
                          >
                            {n}
                          </option>
                        )
                      )}
                    </select>

                    <ChevronDown
                      size={9}
                      className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#8494A7]"
                    />
                  </div>
                </div>

                {/* RANGE */}

                <span>
                  {startIndex} to{" "}
                  {endIndex} of{" "}
                  {
                    filteredEmployees.length
                  }
                </span>

                {/* PAGINATION BUTTONS */}

                <div className="flex items-center gap-[1px]">
                  {/* FIRST */}

                  <button
                    type="button"
                    disabled={
                      currentPage ===
                      1
                    }
                    onClick={() =>
                      setPage(1)
                    }
                    className="flex h-[21px] w-[21px] items-center justify-center rounded text-[#8C9BAE] hover:bg-[#FFF7ED] disabled:opacity-30"
                  >
                    <ChevronsLeft
                      size={12}
                    />
                  </button>

                  {/* PREVIOUS */}

                  <button
                    type="button"
                    disabled={
                      currentPage ===
                      1
                    }
                    onClick={() =>
                      setPage(
                        (v) =>
                          Math.max(
                            1,
                            v - 1
                          )
                      )
                    }
                    className="flex h-[21px] w-[21px] items-center justify-center rounded text-[#8C9BAE] hover:bg-[#FFF7ED] disabled:opacity-30"
                  >
                    <ChevronLeft
                      size={12}
                    />
                  </button>

                  {/* PAGE NUMBERS */}

                  {pageNumbers.map(
                    (
                      number,
                      index
                    ) =>
                      number ===
                      "..." ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-[3px] text-[#A7B3C1]"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={
                            number
                          }
                          type="button"
                          onClick={() =>
                            setPage(
                              Number(
                                number
                              )
                            )
                          }
                          className={[
                            "flex h-[21px] min-w-[21px] items-center justify-center rounded-[3px] text-[10px]",
                            number ===
                            currentPage
                              ? "bg-[#F97316] font-semibold text-white"
                              : "text-[#53657A] hover:bg-[#FFF7ED]",
                          ].join(
                            " "
                          )}
                        >
                          {
                            number
                          }
                        </button>
                      )
                  )}

                  {/* NEXT */}

                  <button
                    type="button"
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      setPage(
                        (v) =>
                          Math.min(
                            totalPages,
                            v + 1
                          )
                      )
                    }
                    className="flex h-[21px] w-[21px] items-center justify-center rounded text-[#8C9BAE] hover:bg-[#FFF7ED] disabled:opacity-30"
                  >
                    <ChevronRight
                      size={12}
                    />
                  </button>

                  {/* LAST */}

                  <button
                    type="button"
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      setPage(
                        totalPages
                      )
                    }
                    className="flex h-[21px] w-[21px] items-center justify-center rounded text-[#8C9BAE] hover:bg-[#FFF7ED] disabled:opacity-30"
                  >
                    <ChevronsRight
                      size={12}
                    />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ======================================================
            RIGHT SIDE TABS
        ====================================================== */}

        <div className="sticky top-[5px] flex w-[27px] shrink-0 flex-col gap-[3px]">
          {[
            "Table",
            "Pivot",
            "Ask Me",
            "Column",
          ].map((tab) => {
            const active =
              rightTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() =>
                  setRightTab(tab)
                }
                className={[
                  "relative flex h-[58px] w-[27px] items-center justify-center rounded-r-[5px] text-[10px] transition-all",
                  active
                    ? "bg-white font-semibold text-[#F97316] shadow-[0_1px_4px_rgba(25,45,70,0.10)]"
                    : "bg-[#E4E9F4] font-medium text-[#687991] hover:bg-[#DDE4EF]",
                ].join(" ")}
                style={{
                  writingMode:
                    "vertical-rl",
                }}
              >
                {tab ===
                  "Ask Me" && (
                  <span className="absolute left-1/2 top-[-2px] -translate-x-1/2 text-[12px] text-[#F04438]">
                    ✦
                  </span>
                )}

                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          DELETE MODAL
      ======================================================== */}

      {deletingEmployee && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#26364F]/40 backdrop-blur-[1px]">
          <div className="w-[360px] rounded-[8px] border border-[#E1E7EE] bg-white p-[20px] shadow-[0_18px_45px_rgba(25,45,70,0.22)]">
            <h3 className="text-[15px] font-semibold text-[#263B55]">
              Remove employee?
            </h3>

            <p className="mt-[7px] text-[12px] leading-[19px] text-[#68788D]">
              {
                deletingEmployee.EmployeeName
              }{" "}
              will be removed
              from this list.
            </p>

            <div className="mt-[18px] flex justify-end gap-[7px]">
              <button
                type="button"
                onClick={() =>
                  setDeletingEmployee(
                    null
                  )
                }
                className="rounded-[5px] border border-[#D8E1EA] px-[13px] py-[6px] text-[11.5px] font-medium text-[#68788D] hover:bg-[#F5F8FC]"
              >
                Keep employee
              </button>

              <button
                type="button"
                onClick={() => {
                  flash(
                    `${deletingEmployee.EmployeeName} removed`
                  );

                  setDeletingEmployee(
                    null
                  );
                }}
                className="rounded-[5px] bg-[#F04438] px-[13px] py-[6px] text-[11.5px] font-semibold text-white hover:bg-[#D92D20]"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
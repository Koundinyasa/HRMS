import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useNavigate } from "react-router-dom";
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

/* ============================================================
   DATA
============================================================ */

const FIRST_NAMES = [
  "Rajesh",
  "Anusha",
  "Chandra Shekar",
  "Varalaxmi",
  "Nikhitha",
  "Praveen",
  "Divya",
  "Srinivas",
  "Lakshmi",
  "Kiran",
  "Sowmya",
  "Naveen",
  "Ramya",
  "Suresh",
  "Pooja",
  "Manoj",
  "Sneha",
  "Vijay",
  "Meena",
  "Bhagyaraja",
];

const LAST_NAMES = [
  "Ubbapally",
  "Mavellapalli",
  "Saka",
  "Gumudala",
  "Narala",
  "Avurapalli",
  "Reddy",
  "Kumar",
  "Rao",
  "Chowdary",
  "Naidu",
  "Prasad",
  "Varma",
  "Sastry",
];

const DESIGNATIONS = [
  "HR MANAGER",
  "UX/UI DESIGNER",
  "OFFICE BOY",
  "ASSOCIATE SOFTWARE ENGINEER",
  "PRODUCT MANAGER",
  "QA ENGINEER",
  "DEVOPS ENGINEER",
  "TEAM LEAD",
  "SENIOR SOFTWARE ENGINEER",
  "BUSINESS DEVELOPMENT MANAGER",
  "BUSINESS DEVELOPMENT EXECUTIVE",
  "DATA ANALYST",
  "FLUTTER DEVELOPER",
  "HR EXECUTIVE",
  "HR RECRUITER",
  "PROJECT LEAD",
  "PROJECT MANAGER",
  "QUALITY ANALYST",
  "REACT DEVELOPER",
];

const LEAVE_POLICIES = [
  "Employee Leave Policy",
  "Intern Leave Policy",
];

const SALARY_STRUCTURES = [
  "Salary Structure",
  "CTC Salary Structure",
  "Salary structure",
  "Test Structure",
];

const BRANCHES = [
  "Koundinyasa Technology Services Pvt. Ltd.",
];

const REPORTERS = [
  "YOGESH KUMAR K",
  "RAJESH UBBAPALLY",
  "BHAGYARAJA AVURAPALLI",
  "DANIEL RAJU RAVI",
];

const QUERIES = [
  "My Team",
  "Probation",
  "Confirmed",
  "Notice Period",
];

const ATTENDANCE = [
  "Daily",
  "Monthly",
];

const EMP_STATUS = [
  "Active",
  "Separated",
];

function generateEmployees(count: number) {
  const rows = [];

  for (let i = 0; i < count; i++) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[(i * 3 + 1) % LAST_NAMES.length];

    const designation =
      DESIGNATIONS[(i * 2) % DESIGNATIONS.length];

    const separated = i % 7 === 1;

    const female = i % 3 === 1;

    const day = String((i % 27) + 1).padStart(2, "0");

    const month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
    ][i % 6];

    const email =
      i % 9 === 2
        ? ""
        : `${first
            .toLowerCase()
            .replace(/\s+/g, "")}.${last
            .charAt(0)
            .toLowerCase()}@koundinyasatech.com`;

    const mobile =
      i % 9 === 2 || i % 2 === 0
        ? ""
        : `852${String(2918639 + i * 7919).slice(0, 7)}`;

    rows.push({
      id: i + 1,

      empId:
        i === 0
          ? "1"
          : String(264631 + i * 47),

      name: `${female ? "Ms" : "Mr"} ${first} ${last}`,

      designation,

      doj: `${day}/${month}/2026`,

      dol: separated
        ? `${String((i % 27) + 1).padStart(2, "0")}/Apr/2026`
        : null,

      email,

      mobile,

      branch:
        BRANCHES[0],

      reporting:
        REPORTERS[i % REPORTERS.length],

      leavePolicy:
        LEAVE_POLICIES[i % LEAVE_POLICIES.length],

      salaryStructure:
        SALARY_STRUCTURES[i % SALARY_STRUCTURES.length],

      bankName:
        [
          "IDBI Bank",
          "HDFC Bank",
          "ICICI Bank",
          "State Bank of India",
        ][i % 4],

      attendance:
        ATTENDANCE[i % ATTENDANCE.length],

      query:
        QUERIES[i % QUERIES.length],

      empStatus:
        separated ? "Separated" : "Active",

      badgeTone:
        i === 0
          ? "green"
          : separated
          ? "pink"
          : i % 5 === 0
          ? "blue"
          : "green",
    });
  }

  return rows;
}

const ALL_EMPLOYEES = generateEmployees(106);

type Employee = (typeof ALL_EMPLOYEES)[number];

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
   FIGMA TOKENS
============================================================ */

const COLORS = {
  blue: "#2D8CF0",
  blueDark: "#1B7BE0",

  headerBlue: "#D3E6F6",

  text: "#26364F",
  textLight: "#718096",
  muted: "#94A3B8",

  border: "#E4EAF1",
  borderDark: "#D6E0EB",

  page: "#F4F7FB",

  greenBg: "#E6F6E9",
  greenText: "#2E7D32",

  pinkBg: "#FDE9ED",
  pinkText: "#C2185B",

  lightBlue: "#E5F0FB",
};

const BADGES: Record<string, string> = {
  green:
    "bg-[#E6F6E9] text-[#2E7D32]",

  pink:
    "bg-[#FDE9ED] text-[#C2185B]",

  blue:
    "bg-[#E5F0FB] text-[#1565C0]",
};

/*
 * IMPORTANT:
 * Header and row use exactly the same grid.
 */
const GRID =
  "grid grid-cols-[minmax(210px,2.05fr)_minmax(145px,1fr)_minmax(210px,1.55fr)_minmax(225px,1.75fr)_minmax(160px,1.2fr)_112px]";

/* ============================================================
   COLUMNS
============================================================ */

const COLUMNS: Column[] = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "doj",
    label: "Joining Date",
  },
  {
    key: "email",
    label: "Contact",
  },
  {
    key: "branch",
    label: "Branch",
  },
  {
    key: "leavePolicy",
    label: "Leave Policy",
  },
];

/* ============================================================
   UTILS
============================================================ */

function useOutsideClick(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void
) {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        ref.current &&
        !ref.current.contains(target)
      ) {
        callback();
      }
    };

    document.addEventListener(
      "mousedown",
      handler
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handler
      );
    };
  }, [ref, callback]);
}

/* ============================================================
   FIXED DROPDOWN
 *
 * Uses fixed positioning.
 *
 * This is important because the filter row has
 * overflow-x-auto. Absolute dropdowns inside it can
 * get clipped. Fixed positioning prevents that.
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
    if (!anchor) return;

    const update = () => {
      const rect =
        anchor.getBoundingClientRect();

      let left = rect.left;

      const dropdownRight =
        left + width;

      const screenWidth =
        window.innerWidth;

      if (
        dropdownRight >
        screenWidth - 10
      ) {
        left =
          screenWidth -
          width -
          10;
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

    window.addEventListener(
      "resize",
      update
    );

    window.addEventListener(
      "scroll",
      update,
      true
    );

    return () => {
      window.removeEventListener(
        "resize",
        update
      );

      window.removeEventListener(
        "scroll",
        update,
        true
      );
    };
  }, [anchor, width]);

  useOutsideClick(
    ref,
    onClose
  );

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
        "flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-[2px]",
        "transition-all duration-100",
        checked
          ? "bg-[#2D8CF0]"
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
   MULTI SELECT FILTER
============================================================ */

function MultiFilter({
  label,
  options,
  selected,
  onChange,
}: FilterMenuProps) {
  const buttonRef =
    useRef<HTMLButtonElement | null>(
      null
    );

  const [open, setOpen] =
    useState(false);

  const toggle = (
    option: string
  ) => {
    onChange((previous) => {
      if (
        previous.includes(option)
      ) {
        return previous.filter(
          (item) =>
            item !== option
        );
      }

      return [
        ...previous,
        option,
      ];
    });
  };

  const clear = () => {
    onChange([]);
    setOpen(false);
  };

  const active =
    selected.length > 0;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() =>
          setOpen((value) => !value)
        }
        className={[
          "flex h-[28px] shrink-0 items-center gap-[4px]",
          "rounded-[4px] px-[7px]",
          "text-[12px] font-medium",
          "transition-colors duration-100",
          active
            ? "bg-[#EDF5FE] text-[#2D8CF0]"
            : "text-[#526174] hover:bg-[#F4F7FA]",
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
          onClose={() =>
            setOpen(false)
          }
        >
          <div className="max-h-[270px] overflow-y-auto py-[4px]">
            {options.map(
              (option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    toggle(option)
                  }
                  className="flex w-full items-center gap-[10px] px-[13px] py-[8px] text-left text-[12px] font-medium text-[#34445C] hover:bg-[#F5F8FC]"
                >
                  <CheckBox
                    checked={selected.includes(
                      option
                    )}
                  />

                  <span className="truncate">
                    {option}
                  </span>
                </button>
              )
            )}
          </div>

          <div className="border-t border-[#EEF2F6]">
            <button
              type="button"
              onClick={clear}
              className="flex h-[34px] w-full items-center justify-center gap-[5px] text-[12px] font-medium text-[#A2ACB9] hover:bg-[#F8FAFC]"
            >
              <X
                size={12}
              />
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
  setSortConfig: Dispatch<
    SetStateAction<SortConfig>
  >;
  filters: ColFilters;
  setFilters: Dispatch<
    SetStateAction<ColFilters>
  >;
}) {
  const buttonRef =
    useRef<HTMLButtonElement | null>(
      null
    );

  const [open, setOpen] =
    useState(false);

  const filterValue =
    filters[column.key] || "";

  const sorted =
    sortConfig.key ===
    column.key;

  const active =
    sorted ||
    Boolean(filterValue);

  const sort = (
    direction: "asc" | "desc"
  ) => {
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
            setSortConfig(
              (previous) => ({
                key: column.key,
                dir:
                  previous.key ===
                    column.key &&
                  previous.dir ===
                    "asc"
                    ? "desc"
                    : "asc",
              })
            )
          }
          className="truncate text-[12px] font-semibold text-[#263B55]"
        >
          {column.label}
        </button>

        <button
          ref={buttonRef}
          type="button"
          title={`Filter ${column.label}`}
          onClick={() =>
            setOpen((value) => !value)
          }
          className={[
            "flex h-[20px] w-[20px] items-center justify-center rounded",
            active
              ? "text-[#2D8CF0]"
              : "text-[#91A6BC] hover:text-[#2D8CF0]",
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
          onClose={() =>
            setOpen(false)
          }
        >
          <div className="p-[8px]">
            <button
              type="button"
              onClick={() =>
                sort("asc")
              }
              className={[
                "flex w-full items-center gap-[8px] rounded px-[8px] py-[7px]",
                "text-left text-[12px]",
                sorted &&
                sortConfig.dir ===
                  "asc"
                  ? "bg-[#EDF5FE] font-semibold text-[#2D8CF0]"
                  : "text-[#34445C] hover:bg-[#F5F8FC]",
              ].join(" ")}
            >
              <ArrowUpDown
                size={12}
              />
              Sort A to Z
            </button>

            <button
              type="button"
              onClick={() =>
                sort("desc")
              }
              className={[
                "flex w-full items-center gap-[8px] rounded px-[8px] py-[7px]",
                "text-left text-[12px]",
                sorted &&
                sortConfig.dir ===
                  "desc"
                  ? "bg-[#EDF5FE] font-semibold text-[#2D8CF0]"
                  : "text-[#34445C] hover:bg-[#F5F8FC]",
              ].join(" ")}
            >
              <ArrowUpDown
                size={12}
              />
              Sort Z to A
            </button>

            <div className="my-[7px] h-px bg-[#EDF1F5]" />

            <input
              autoFocus
              value={filterValue}
              onChange={(event) =>
                setFilters(
                  (previous) => ({
                    ...previous,
                    [column.key]:
                      event.target.value,
                  })
                )
              }
              placeholder={`Filter ${column.label.toLowerCase()}`}
              className="h-[30px] w-full rounded-[4px] border border-[#D9E2EC] px-[9px] text-[11.5px] text-[#33415C] outline-none placeholder:text-[#A2AFBF] focus:border-[#2D8CF0]"
            />

            {filterValue && (
              <button
                type="button"
                onClick={() =>
                  setFilters(
                    (previous) => ({
                      ...previous,
                      [column.key]:
                        "",
                    })
                  )
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
   MAIN PAGE
============================================================ */

export default function EmployeePage1() {
  const navigate =
    useNavigate();

  /* -------------------------
     DATA
  ------------------------- */

  const [employees] =
    useState<Employee[]>(
      ALL_EMPLOYEES
    );

  /* -------------------------
     SEARCH
  ------------------------- */

  const [search, setSearch] =
    useState("");

  /* -------------------------
     SORT
  ------------------------- */

  const [
    sortConfig,
    setSortConfig,
  ] = useState<SortConfig>({
    key: null,
    dir: "asc",
  });

  /* -------------------------
     COLUMN FILTERS
  ------------------------- */

  const [
    colFilters,
    setColFilters,
  ] = useState<ColFilters>({});

  /* -------------------------
     FILTERS
  ------------------------- */

  const [
    queryFilter,
    setQueryFilter,
  ] = useState<string[]>([]);

  const [
    branchFilter,
    setBranchFilter,
  ] = useState<string[]>([]);

  const [
    salaryFilter,
    setSalaryFilter,
  ] = useState<string[]>([]);

  const [
    leaveFilter,
    setLeaveFilter,
  ] = useState<string[]>([]);

  const [
    attendanceFilter,
    setAttendanceFilter,
  ] = useState<string[]>([]);

  const [
    designationFilter,
    setDesignationFilter,
  ] = useState<string[]>([]);

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<string[]>([]);

  /* -------------------------
     UI
  ------------------------- */

  const [
    showFilterRow,
    setShowFilterRow,
  ] = useState(true);

  const [
    showMoreMenu,
    setShowMoreMenu,
  ] = useState(false);

  const [
    showClockMenu,
    setShowClockMenu,
  ] = useState(false);

  const [
    rightTab,
    setRightTab,
  ] = useState("Table");

  /* -------------------------
     PAGINATION
  ------------------------- */

  const [
    rowsPerPage,
    setRowsPerPage,
  ] = useState(10);

  const [
    page,
    setPage,
  ] = useState(1);

  /* -------------------------
     MODAL / TOAST
  ------------------------- */

  const [
    deletingEmployee,
    setDeletingEmployee,
  ] = useState<Employee | null>(
    null
  );

  const [
    toast,
    setToast,
  ] = useState<string | null>(
    null
  );

  /* ==========================================================
     TOAST
  ========================================================== */

  const flash = (
    message: string
  ) => {
    setToast(message);

    window.setTimeout(() => {
      setToast(null);
    }, 2200);
  };

  /* ==========================================================
     FILTER OPTIONS
  ========================================================== */

  const filterOptions =
    useMemo(
      () => ({
        query: QUERIES,

        branch: Array.from(
          new Set(
            employees.map(
              (employee) =>
                employee.branch
            )
          )
        ),

        salary:
          SALARY_STRUCTURES,

        leave:
          LEAVE_POLICIES,

        attendance:
          ATTENDANCE,

        designation:
          Array.from(
            new Set(
              employees.map(
                (employee) =>
                  employee.designation
              )
            )
          ),

        status:
          EMP_STATUS,
      }),
      [employees]
    );

  /* ==========================================================
     FILTERED DATA
  ========================================================== */

  const filteredEmployees =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      const hasValue = (
        selected: string[],
        value: string
      ) => {
        return (
          selected.length ===
            0 ||
          selected.includes(value)
        );
      };

      let result =
        employees.filter(
          (employee) => {
            /* SEARCH */

            const searchMatch =
              !query ||
              employee.name
                .toLowerCase()
                .includes(query) ||
              employee.email
                .toLowerCase()
                .includes(query) ||
              employee.designation
                .toLowerCase()
                .includes(query) ||
              employee.empId
                .toLowerCase()
                .includes(query) ||
              employee.branch
                .toLowerCase()
                .includes(query);

            /* DROPDOWN FILTERS */

            const dropdownMatch =
              hasValue(
                queryFilter,
                employee.query
              ) &&
              hasValue(
                branchFilter,
                employee.branch
              ) &&
              hasValue(
                salaryFilter,
                employee.salaryStructure
              ) &&
              hasValue(
                leaveFilter,
                employee.leavePolicy
              ) &&
              hasValue(
                attendanceFilter,
                employee.attendance
              ) &&
              hasValue(
                designationFilter,
                employee.designation
              ) &&
              hasValue(
                statusFilter,
                employee.empStatus
              );

            /* COLUMN FILTERS */

            const columnMatch =
              Object.entries(
                colFilters
              ).every(
                ([key, value]) => {
                  if (!value) {
                    return true;
                  }

                  const employeeValue =
                    String(
                      employee[
                        key as keyof Employee
                      ] ?? ""
                    ).toLowerCase();

                  return employeeValue.includes(
                    value.toLowerCase()
                  );
                }
              );

            return (
              searchMatch &&
              dropdownMatch &&
              columnMatch
            );
          }
        );

      /* SORT */

      if (
        sortConfig.key
      ) {
        result = [
          ...result,
        ].sort((a, b) => {
          const first =
            String(
              a[
                sortConfig.key as keyof Employee
              ] ?? ""
            ).toLowerCase();

          const second =
            String(
              b[
                sortConfig.key as keyof Employee
              ] ?? ""
            ).toLowerCase();

          if (first < second) {
            return sortConfig.dir ===
              "asc"
              ? -1
              : 1;
          }

          if (first > second) {
            return sortConfig.dir ===
              "asc"
              ? 1
              : -1;
          }

          return 0;
        });
      }

      return result;
    }, [
      employees,
      search,
      queryFilter,
      branchFilter,
      salaryFilter,
      leaveFilter,
      attendanceFilter,
      designationFilter,
      statusFilter,
      colFilters,
      sortConfig,
    ]);

  /* ==========================================================
     PAGINATION
  ========================================================== */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredEmployees.length /
          rowsPerPage
      )
    );

  const currentPage =
    Math.min(
      page,
      totalPages
    );

  const pageRows =
    filteredEmployees.slice(
      (currentPage - 1) *
        rowsPerPage,
      currentPage *
        rowsPerPage
    );

  const startIndex =
    filteredEmployees.length ===
    0
      ? 0
      : (currentPage - 1) *
          rowsPerPage +
        1;

  const endIndex =
    Math.min(
      currentPage *
        rowsPerPage,
      filteredEmployees.length
    );

  /* Reset page after filter */

  useEffect(() => {
    setPage(1);
  }, [
    search,
    queryFilter,
    branchFilter,
    salaryFilter,
    leaveFilter,
    attendanceFilter,
    designationFilter,
    statusFilter,
    colFilters,
    rowsPerPage,
  ]);

  /* ==========================================================
     CLEAR FILTERS
  ========================================================== */

  const clearAllFilters =
    () => {
      setSearch("");

      setQueryFilter([]);
      setBranchFilter([]);
      setSalaryFilter([]);
      setLeaveFilter([]);
      setAttendanceFilter([]);
      setDesignationFilter([]);
      setStatusFilter([]);

      setColFilters({});

      setSortConfig({
        key: null,
        dir: "asc",
      });

      setPage(1);

      flash(
        "Filters cleared"
      );
    };

  /* ==========================================================
     CSV EXPORT
  ========================================================== */

  const exportCSV = () => {
    const headers = [
      "Emp ID",
      "Name",
      "Designation",
      "Joining Date",
      "Email",
      "Mobile",
      "Branch",
      "Leave Policy",
      "Salary Structure",
      "Attendance",
      "Status",
    ];

    const data =
      filteredEmployees.map(
        (employee) => [
          employee.empId,
          employee.name,
          employee.designation,
          employee.doj,
          employee.email,
          employee.mobile,
          employee.branch,
          employee.leavePolicy,
          employee.salaryStructure,
          employee.attendance,
          employee.empStatus,
        ]
      );

    const csv = [
      headers,
      ...data,
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

    const blob =
      new Blob(
        [csv],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;
    link.download =
      "Employees.csv";

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(
      url
    );

    flash(
      "Employees.csv downloaded"
    );
  };

  /* ==========================================================
     PAGE NUMBERS
  ========================================================== */

  const pageNumbers =
    useMemo(() => {
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
          numbers.push(
            "..."
          );
        }
      }

      return numbers;
    }, [
      totalPages,
      currentPage,
    ]);

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div
      className="min-h-full w-full bg-[#F4F7FB] text-[#26364F]"
      style={{
        fontFamily:
          "Inter, Arial, Helvetica, sans-serif",
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
          TOP TOOLBAR
      ====================================================== */}

      <EnrollmentToolbarPortal>
        <button
          type="button"
          onClick={() =>
            flash(
              "Add Employee form opened"
            )
          }
          className="flex h-[27px] items-center gap-[6px] rounded-[5px] bg-[#2D8CF0] px-[12px] text-[11.5px] font-semibold text-white shadow-[0_2px_5px_rgba(45,140,240,0.25)] transition hover:bg-[#1B7BE0]"
        >
          <Plus
            size={14}
            strokeWidth={2.8}
          />

          Add Employee
        </button>

        <button
          type="button"
          onClick={exportCSV}
          title="Export"
          className="flex h-[27px] w-[27px] items-center justify-center rounded-[5px] text-[#29985B] transition hover:bg-[#EDF8F1]"
        >
          <span className="text-[9px] font-bold">
            XLS
          </span>
        </button>

        <button
          type="button"
          onClick={() =>
            setShowFilterRow(
              (value) => !value
            )
          }
          title="Filter"
          className={[
            "flex h-[27px] w-[27px] items-center justify-center rounded-[5px]",
            showFilterRow
              ? "text-[#2D8CF0]"
              : "text-[#9BAABD]",
          ].join(" ")}
        >
          <Filter
            size={15}
            strokeWidth={1.9}
          />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() =>
              setShowClockMenu(
                (value) =>
                  !value
              )
            }
            className="flex h-[27px] w-[27px] items-center justify-center rounded-[5px] text-[#9BAABD] hover:bg-[#F4F7FA]"
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
                Nothing viewed yet.
              </div>
            </div>
          )}
        </div>
      </EnrollmentToolbarPortal>

      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="flex w-full gap-[6px] pt-[6px]">
        {/* ====================================================
            MAIN TABLE AREA
        ==================================================== */}

        <div className="min-w-0 flex-1">
          {/* ==================================================
              FILTER BAR
          ================================================== */}

          <div className="relative flex min-h-[37px] items-center rounded-[7px] border border-[#E7ECF2] bg-white px-[10px] shadow-[0_1px_3px_rgba(25,45,70,0.07)]">
            {/* SEARCH */}

            <div className="relative w-[275px] shrink-0">
              <Search
                size={13}
                className="absolute left-0 top-1/2 -translate-y-1/2 text-[#9DAEC0]"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Start Typing..."
                className="h-[27px] w-full border-none bg-transparent pl-[19px] text-[11.5px] text-[#33445C] outline-none placeholder:text-[#A9B5C3]"
              />
            </div>

            {/* ADD FILTER */}

            <button
              type="button"
              onClick={() =>
                setShowFilterRow(
                  (value) => !value
                )
              }
              className="mr-[7px] flex h-[27px] shrink-0 items-center gap-[4px] rounded-[4px] px-[7px] text-[11.5px] font-medium text-[#2D8CF0] hover:bg-[#F0F7FE]"
            >
              <Plus
                size={12}
                strokeWidth={2.5}
              />

              Add Filter
            </button>

            {/* FILTERS */}

            {showFilterRow && (
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
                    filterOptions.status
                  }
                  selected={
                    statusFilter
                  }
                  onChange={
                    setStatusFilter
                  }
                />
              </div>
            )}

            {/* MORE */}

            <button
              type="button"
              onClick={() =>
                setShowMoreMenu(
                  (value) =>
                    !value
                )
              }
              className="ml-auto flex h-[25px] w-[22px] shrink-0 items-center justify-center text-[#7F91A7] hover:text-[#34445C]"
            >
              <MoreVertical
                size={15}
              />
            </button>

            {showMoreMenu && (
              <div className="absolute right-[34px] top-[34px] z-[100] w-[185px] overflow-hidden rounded-[5px] border border-[#E0E6ED] bg-white py-[4px] shadow-[0_7px_22px_rgba(30,55,90,0.16)]">
                <button
                  type="button"
                  onClick={() => {
                    clearAllFilters();
                    setShowMoreMenu(
                      false
                    );
                  }}
                  className="w-full px-[12px] py-[8px] text-left text-[11.5px] text-[#405168] hover:bg-[#F5F8FC]"
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
                  className="w-full px-[12px] py-[8px] text-left text-[11.5px] text-[#405168] hover:bg-[#F5F8FC]"
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
              NON TABLE VIEWS
          ================================================== */}

          {rightTab !==
          "Table" ? (
            <div className="mt-[5px] flex min-h-[400px] items-center justify-center rounded-[7px] border border-[#E6EBF1] bg-white text-[12px] text-[#8291A4] shadow-[0_1px_3px_rgba(25,45,70,0.07)]">
              {rightTab} view
            </div>
          ) : (
            <>
              {/* ==============================================
                  HEADER
              ============================================== */}

              <div
                className={[
                  GRID,
                  "mt-[5px]",
                  "min-w-[1050px]",
                  "items-center",
                  "rounded-[7px]",
                  "border border-[#CFE0EF]",
                  "bg-[#D3E6F6]",
                  "shadow-[0_1px_2px_rgba(25,45,70,0.05)]",
                ].join(" ")}
              >
                {COLUMNS.map(
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

                <div className="flex h-[39px] items-center px-[10px] text-[12px] font-semibold text-[#263B55]">
                  Action
                </div>
              </div>

              {/* ==============================================
                  ROWS
              ============================================== */}

              <div className="mt-[5px] min-w-[1050px] space-y-[5px]">
                {pageRows.map(
                  (employee) => (
                    <div
                      key={
                        employee.id
                      }
                      className={[
                        GRID,
                        "min-h-[55px]",
                        "items-center",
                        "rounded-[7px]",
                        "border border-[#E5EAF0]",
                        "bg-white",
                        "shadow-[0_1px_3px_rgba(25,45,70,0.08)]",
                        "transition-all duration-100",
                        "hover:border-[#D8E1EB]",
                        "hover:shadow-[0_2px_8px_rgba(25,45,70,0.11)]",
                      ].join(" ")}
                    >
                      {/* ==============================
                          NAME
                      ============================== */}

                      <div className="min-w-0 px-[10px] py-[7px]">
                        <div className="flex min-w-0 items-center gap-[7px]">
                          <span
                            className={[
                              "shrink-0 rounded-[3px] px-[5px] py-[2px]",
                              "font-mono text-[9px] font-semibold",
                              BADGES[
                                employee.badgeTone
                              ],
                            ].join(
                              " "
                            )}
                          >
                            {
                              employee.empId
                            }
                          </span>

                          <span className="truncate text-[11.5px] font-semibold text-[#263B55]">
                            {
                              employee.name
                            }
                          </span>
                        </div>

                        <div className="mt-[6px] truncate text-[9.5px] font-medium uppercase tracking-[0.02em] text-[#718198]">
                          {
                            employee.designation
                          }
                        </div>
                      </div>

                      {/* ==============================
                          JOINING DATE
                      ============================== */}

                      <div className="px-[10px] py-[7px]">
                        <div className="flex items-center gap-[6px]">
                          <span className="rounded-[2px] bg-[#E5EFF9] px-[4px] py-[1px] font-mono text-[8px] font-semibold text-[#2D8CF0]">
                            DOJ
                          </span>

                          <span className="text-[10.5px] text-[#34445C]">
                            {
                              employee.doj
                            }
                          </span>
                        </div>

                        {employee.dol && (
                          <div className="mt-[5px] flex items-center gap-[6px]">
                            <span className="rounded-[2px] bg-[#FCE8EB] px-[4px] py-[1px] font-mono text-[8px] font-semibold text-[#E03A4A]">
                              DOL
                            </span>

                            <span className="text-[10.5px] text-[#E03A4A]">
                              {
                                employee.dol
                              }
                            </span>
                          </div>
                        )}
                      </div>

                      {/* ==============================
                          CONTACT
                      ============================== */}

                      <div className="min-w-0 px-[10px] py-[7px]">
                        {employee.email && (
                          <div className="truncate text-[10.5px] text-[#34445C]">
                            {
                              employee.email
                            }
                          </div>
                        )}

                        {employee.mobile && (
                          <div className="mt-[5px] flex items-center gap-[5px]">
                            <span className="rounded-[2px] bg-[#F0F3F7] px-[4px] py-[1px] font-mono text-[8px] font-semibold text-[#7C8B9D]">
                              Mob
                            </span>

                            <span className="text-[9.5px] text-[#7C8B9D]">
                              {
                                employee.mobile
                              }
                            </span>
                          </div>
                        )}
                      </div>

                      {/* ==============================
                          BRANCH
                      ============================== */}

                      <div className="min-w-0 px-[10px] py-[7px]">
                        <div className="truncate text-[10.5px] text-[#34445C]">
                          {
                            employee.branch
                          }
                        </div>

                        <div className="mt-[5px] flex min-w-0 items-center gap-[5px]">
                          <span className="shrink-0 text-[8.5px] font-semibold text-[#9AA9B9]">
                            R.A.
                          </span>

                          <span className="truncate text-[9.5px] font-medium uppercase text-[#718198]">
                            {
                              employee.reporting
                            }
                          </span>
                        </div>
                      </div>

                      {/* ==============================
                          LEAVE POLICY
                      ============================== */}

                      <div className="min-w-0 px-[10px] py-[7px]">
                        <div className="truncate text-[10.5px] text-[#34445C]">
                          {
                            employee.leavePolicy
                          }
                        </div>

                        <div className="mt-[5px] flex items-center gap-[5px]">
                          <span className="rounded-[2px] bg-[#E5F4E8] px-[4px] py-[1px] text-[8px] font-semibold text-[#2E7D32]">
                            Attendance
                          </span>

                          <span className="text-[9.5px] text-[#7B899A]">
                            {
                              employee.attendance
                            }
                          </span>
                        </div>
                      </div>

                      {/* ==============================
                          ACTION
                      ============================== */}

                      <div className="flex items-center gap-[3px] px-[10px]">
                        {/* Dashboard */}

                        <button
                          type="button"
                          title="Employee dashboard"
                          onClick={() =>
                            navigate(
                              `/KOUNDINYASATECH/admin/enrollment/employee/${employee.empId}`
                            )
                          }
                          className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] text-[#68798E] hover:bg-[#EEF3F8] hover:text-[#263B55]"
                        >
                          <LayoutGrid
                            size={13}
                            strokeWidth={
                              2
                            }
                          />
                        </button>

                        {/* Edit */}

                        <button
                          type="button"
                          title="Edit employee"
                          onClick={() =>
                            flash(
                              `Editing ${employee.name}`
                            )
                          }
                          className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] text-[#2D8CF0] hover:bg-[#EDF5FE]"
                        >
                          <Pencil
                            size={13}
                            strokeWidth={
                              2
                            }
                          />
                        </button>

                        {/* Delete */}

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

                {/* EMPTY */}

                {pageRows.length ===
                  0 && (
                  <div className="rounded-[7px] border border-[#E5EAF0] bg-white py-[70px] text-center text-[12px] text-[#8291A4] shadow-[0_1px_3px_rgba(25,45,70,0.07)]">
                    No employees match
                    these filters.
                  </div>
                )}
              </div>

              {/* ==============================================
                  PAGINATION
              ============================================== */}

              <div className="mt-[5px] flex min-w-[1050px] items-center justify-end gap-[14px] rounded-[7px] border border-[#E5EAF0] bg-white px-[10px] py-[6px] text-[10px] text-[#66778D] shadow-[0_1px_3px_rgba(25,45,70,0.07)]">
                {/* ROWS */}

                <div className="flex items-center gap-[5px]">
                  <span>
                    Rows per page
                  </span>

                  <div className="relative">
                    <select
                      value={
                        rowsPerPage
                      }
                      onChange={(
                        event
                      ) =>
                        setRowsPerPage(
                          Number(
                            event
                              .target
                              .value
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
                        (number) => (
                          <option
                            key={
                              number
                            }
                            value={
                              number
                            }
                          >
                            {
                              number
                            }
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

                {/* NAVIGATION */}

                <div className="flex items-center gap-[1px]">
                  <button
                    type="button"
                    disabled={
                      currentPage ===
                      1
                    }
                    onClick={() =>
                      setPage(1)
                    }
                    className="flex h-[21px] w-[21px] items-center justify-center rounded text-[#8C9BAE] hover:bg-[#EFF4F8] disabled:opacity-30"
                  >
                    <ChevronsLeft
                      size={12}
                    />
                  </button>

                  <button
                    type="button"
                    disabled={
                      currentPage ===
                      1
                    }
                    onClick={() =>
                      setPage(
                        (value) =>
                          Math.max(
                            1,
                            value -
                              1
                          )
                      )
                    }
                    className="flex h-[21px] w-[21px] items-center justify-center rounded text-[#8C9BAE] hover:bg-[#EFF4F8] disabled:opacity-30"
                  >
                    <ChevronLeft
                      size={12}
                    />
                  </button>

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
                              ? "bg-[#2D8CF0] font-semibold text-white"
                              : "text-[#53657A] hover:bg-[#EFF4F8]",
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

                  <button
                    type="button"
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      setPage(
                        (value) =>
                          Math.min(
                            totalPages,
                            value +
                              1
                          )
                      )
                    }
                    className="flex h-[21px] w-[21px] items-center justify-center rounded text-[#8C9BAE] hover:bg-[#EFF4F8] disabled:opacity-30"
                  >
                    <ChevronRight
                      size={12}
                    />
                  </button>

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
                    className="flex h-[21px] w-[21px] items-center justify-center rounded text-[#8C9BAE] hover:bg-[#EFF4F8] disabled:opacity-30"
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

        {/* ====================================================
            RIGHT RAIL
        ==================================================== */}

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
                  setRightTab(
                    tab
                  )
                }
                className={[
                  "relative flex h-[58px] w-[27px] items-center justify-center rounded-r-[5px]",
                  "text-[10px]",
                  "transition-all",
                  active
                    ? "bg-white font-semibold text-[#2D8CF0] shadow-[0_1px_4px_rgba(25,45,70,0.10)]"
                    : "bg-[#E4E9F4] font-medium text-[#687991] hover:bg-[#DDE4EF]",
                ].join(
                  " "
                )}
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

      {/* ======================================================
          DELETE MODAL
      ====================================================== */}

      {deletingEmployee && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#26364F]/40 backdrop-blur-[1px]">
          <div className="w-[360px] rounded-[8px] border border-[#E1E7EE] bg-white p-[20px] shadow-[0_18px_45px_rgba(25,45,70,0.22)]">
            <h3 className="text-[15px] font-semibold text-[#263B55]">
              Remove employee?
            </h3>

            <p className="mt-[7px] text-[12px] leading-[19px] text-[#68788D]">
              {
                deletingEmployee.name
              }{" "}
              will be removed from
              this list.
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
                    `${deletingEmployee.name} removed`
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

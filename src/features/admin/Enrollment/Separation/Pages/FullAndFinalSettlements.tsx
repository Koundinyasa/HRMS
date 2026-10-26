import { useEffect, useRef, useState } from "react";
import {
  Save,
  Clock,
  Check,
  ChevronRight,
  ChevronDown,
  Search,
  Plus,
  ChevronLeft,
  CalendarDays,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type Tab =
  | "FFS Pending"
  | "FFS Summary"
  | "Import"
  | "Report";

type Employee = {
  id: string;
  name: string;
  leavingDate: string;
  settlementDate: string;
};

/* =========================================================
   TABS
========================================================= */

const TABS: Tab[] = [
  "FFS Pending",
  "FFS Summary",
  "Import",
  "Report",
];

/* =========================================================
   FFS SETTINGS
========================================================= */

const DEFAULT_COMPONENTS = [
  "Bonus",
  "Unpaid salary",
  "Leave Encashment",
  "Balance Loan",
  "Gratuity",
  "Balance Advance",
];

/* =========================================================
   ADD OPEN COMPONENT LIST
========================================================= */

const OPEN_COMPONENTS = [
  "Select",
  "Basic",
  "Basic CTC",
  "Company Allowance CTC",
  "Employer PF CTC",
  "Food Wallet CTC",
  "Holiday Allowance CTC",
  "HRA",
  "HRA CTC",
  "Medical and Insurance Benefits CTC",
  "Meal",
  "Monthly CTC",
  "Net Monthly",
  "Other Deductions CTC",
  "Special Allowance CTC",
];

/* =========================================================
   EMPLOYEE DATA
========================================================= */

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "KTS4262414",
    name: "Surya Dundu",
    leavingDate: "18/Feb/2026",
    settlementDate: "",
  },
  {
    id: "KTS4262415",
    name: "Khan Singhreddia",
    leavingDate: "12/May/2026",
    settlementDate: "",
  },
  {
    id: "KTS4262416",
    name: "Supriya Subbur",
    leavingDate: "09/Apr/2026",
    settlementDate: "",
  },
  {
    id: "KTS4262417",
    name: "Sai Prasanna Musula",
    leavingDate: "09/Apr/2026",
    settlementDate: "",
  },
  {
    id: "KTS4262418",
    name: "Raza Mohammad",
    leavingDate: "09/Apr/2026",
    settlementDate: "",
  },
  {
    id: "KTS4262419",
    name: "Suchithra Shirla",
    leavingDate: "09/Apr/2026",
    settlementDate: "",
  },
  {
    id: "KTS4262420",
    name: "Sandhya Ravula",
    leavingDate: "09/Apr/2026",
    settlementDate: "",
  },
];

/* =========================================================
   DROPDOWN DATA
========================================================= */

const DROPDOWN_DATA: Record<string, string[]> = {
  Query: ["All", "Active", "Inactive"],

  Branch: [
    "All Branches",
    "Hyderabad",
    "Bangalore",
  ],

  "Salary Structure": [
    "All",
    "Basic",
    "CTC",
  ],

  Leave: [
    "All",
    "Eligible",
    "Not Eligible",
  ],

  Attendance: [
    "All",
    "Present",
    "Absent",
  ],

  Designation: [
    "All",
    "Manager",
    "Employee",
  ],

  "Emp Status": [
    "All",
    "Active",
    "Inactive",
  ],
};

/* =========================================================
   RESPONSIVE DATE PICKER
   Uses an in-page popup instead of the browser's native date
   picker, so it stays inside the visible content area on mobile.
========================================================= */
function ResponsiveDatePicker({
  value,
  onChange,
  placeholder = "dd-mm-yyyy",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const updatePopupPosition = () => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popupWidth = viewportWidth < 640 ? 240 : 280;
    const estimatedPopupHeight = 320;
    const gap = 6;
    const margin = 8;

    let left = rect.left;
    if (left + popupWidth > viewportWidth - margin) {
      left = viewportWidth - popupWidth - margin;
    }
    left = Math.max(margin, left);

    const spaceBelow = viewportHeight - rect.bottom;
    const shouldOpenAbove = spaceBelow < estimatedPopupHeight && rect.top > estimatedPopupHeight;

    let top = shouldOpenAbove
      ? rect.top - estimatedPopupHeight - gap
      : rect.bottom + gap;

    top = Math.max(margin, Math.min(top, viewportHeight - estimatedPopupHeight - margin));

    setPopupPosition({ top, left });
  };

  const toggleCalendar = () => {
    if (!open) {
      updatePopupPosition();
    }
    setOpen((previous) => !previous);
  };

  useEffect(() => {
    if (!open) return;

    updatePopupPosition();

    const handleViewportChange = () => updatePopupPosition();
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [open]);

  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      const [year, month, day] = value.split("-").map(Number);
      if (year && month && day) return new Date(year, month - 1, day);
    }
    return new Date();
  });

  const monthName = viewDate.toLocaleString("en-US", { month: "long" });
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const previousMonthDays = new Date(year, month, 0).getDate();

  const cells = Array.from({ length: 42 }, (_, index) => {
    const dayNumber = index - firstDay + 1;
    if (dayNumber < 1) {
      return {
        day: previousMonthDays + dayNumber,
        currentMonth: false,
        date: new Date(year, month - 1, previousMonthDays + dayNumber),
      };
    }
    if (dayNumber > daysInMonth) {
      return {
        day: dayNumber - daysInMonth,
        currentMonth: false,
        date: new Date(year, month + 1, dayNumber - daysInMonth),
      };
    }
    return {
      day: dayNumber,
      currentMonth: true,
      date: new Date(year, month, dayNumber),
    };
  });

  const toIso = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const displayValue = value
    ? (() => {
        const [y, m, d] = value.split("-");
        return `${d}-${m}-${y}`;
      })()
    : placeholder;

  const selected = value;
  const today = toIso(new Date());

  const chooseDate = (date: Date) => {
    onChange(toIso(date));
    setViewDate(date);
    setOpen(false);
  };

  const changeMonth = (offset: number) => {
    setViewDate(new Date(year, month + offset, 1));
  };

  return (
    <div className="relative inline-block w-[105px]">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggleCalendar}
        className="w-[105px] h-[25px] border border-[#d5dde5] rounded-sm px-2 text-[9px] text-[#536273] outline-none focus:border-[#078fd3] bg-white flex items-center justify-between gap-1"
        aria-label="Choose date"
      >
        <span className={value ? "text-[#536273]" : "text-[#98a2b3]"}>
          {displayValue}
        </span>
        <CalendarDays size={10} className="shrink-0 text-[#667085]" />
      </button>

      {open && (
        <>
          <div
            ref={popupRef}
            className="fixed z-[10000] w-[240px] sm:w-[280px] max-w-[calc(100vw-16px)] max-h-[calc(100vh-16px)] overflow-auto rounded-sm border border-[#d0d5dd] bg-white shadow-[0_8px_24px_rgba(16,24,40,0.18)] p-3"
            style={{
              top: `${popupPosition.top}px`,
              left: `${popupPosition.left}px`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={() => changeMonth(-1)}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#f2f4f7] text-[#344054]"
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="text-[13px] font-semibold text-[#101828]">
                {monthName}, {year}
              </div>

              <button
                type="button"
                onClick={() => changeMonth(1)}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#f2f4f7] text-[#344054]"
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-7 mb-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="h-7 flex items-center justify-center text-[10px] font-medium text-[#344054]">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {cells.map(({ day, currentMonth, date }, index) => {
                const iso = toIso(date);
                const isSelected = iso === selected;
                const isToday = iso === today;

                return (
                  <button
                    type="button"
                    key={`${iso}-${index}`}
                    onClick={() => chooseDate(date)}
                    className={`h-8 flex items-center justify-center text-[10px] rounded-sm ${
                      isSelected
                        ? "bg-[#667085] text-white font-semibold"
                        : isToday
                        ? "border border-[#078fd3] text-[#078fd3] font-semibold"
                        : currentMonth
                        ? "text-[#344054] hover:bg-[#edf7fd]"
                        : "text-[#98a2b3] hover:bg-[#f8fafc]"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#eaecf0]">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setOpen(false);
                }}
                className="text-[10px] text-[#078fd3] hover:underline"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => chooseDate(new Date())}
                className="text-[10px] text-[#078fd3] hover:underline"
              >
                Today
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function FullAndFinalSettlementsPage() {
  /* =======================================================
     TAB
  ======================================================= */

  const [activeTab, setActiveTab] =
    useState<Tab>("FFS Pending");

  /* =======================================================
     DATE MODE
  ======================================================= */

  const [dateMode, setDateMode] = useState<
    "Calculation Date" | "Settlement Date"
  >("Settlement Date");

  const [calculationDate, setCalculationDate] =
    useState("");

  const [settlementDate, setSettlementDate] =
    useState("");

  /* =======================================================
     DEFAULT COMPONENT CHECKBOXES
  ======================================================= */

  const [components, setComponents] =
    useState<Record<string, boolean>>(
      Object.fromEntries(
        DEFAULT_COMPONENTS.map((component) => [
          component,
          true,
        ])
      )
    );

  /* =======================================================
     ADD OPEN COMPONENT
  ======================================================= */

  const [showOpenComponents, setShowOpenComponents] =
    useState(false);

  const [selectedOpenComponent, setSelectedOpenComponent] =
    useState("");

  /* =======================================================
     EMPLOYEES
  ======================================================= */

  const [employees, setEmployees] =
    useState<Employee[]>(INITIAL_EMPLOYEES);

  /* =======================================================
     SELECTED EMPLOYEES
  ======================================================= */

  const [selectedEmployees, setSelectedEmployees] =
    useState<Record<string, boolean>>({});

  /* =======================================================
     SEARCH
  ======================================================= */

  const [searchText, setSearchText] = useState("");

  /* =======================================================
     DROPDOWN
  ======================================================= */

  const [openDropdown, setOpenDropdown] =
    useState<string | null>(null);

  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
  });

  /* =======================================================
     TOGGLE DEFAULT COMPONENT
  ======================================================= */

  const toggleComponent = (name: string) => {
    setComponents((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));
  };

  /* =======================================================
     SELECT EMPLOYEE
  ======================================================= */

  const toggleEmployee = (id: string) => {
    setSelectedEmployees((previous) => ({
      ...previous,
      [id]: !previous[id],
    }));
  };

  /* =======================================================
     SELECT ALL EMPLOYEES
  ======================================================= */

  const toggleAllEmployees = () => {
    const allSelected =
      employees.length > 0 &&
      employees.every(
        (employee) =>
          selectedEmployees[employee.id]
      );

    if (allSelected) {
      setSelectedEmployees({});
      return;
    }

    const updated: Record<string, boolean> = {};

    employees.forEach((employee) => {
      updated[employee.id] = true;
    });

    setSelectedEmployees(updated);
  };

  /* =======================================================
     UPDATE EMPLOYEE SETTLEMENT DATE
  ======================================================= */

  const updateEmployeeSettlementDate = (
    id: string,
    value: string
  ) => {
    setEmployees((previous) =>
      previous.map((employee) =>
        employee.id === id
          ? {
              ...employee,
              settlementDate: value,
            }
          : employee
      )
    );
  };

  /* =======================================================
     SEARCH FILTER
  ======================================================= */

  const filteredEmployees = employees.filter(
    (employee) => {
      const search =
        searchText.trim().toLowerCase();

      if (!search) {
        return true;
      }

      return (
        employee.name
          .toLowerCase()
          .includes(search) ||
        employee.id
          .toLowerCase()
          .includes(search)
      );
    }
  );

  /* =======================================================
     SAVE
  ======================================================= */

  const handleSave = () => {
    console.log("FFS Saved", {
      activeTab,
      dateMode,
      calculationDate,
      settlementDate,
      components,
      selectedOpenComponent,
      employees,
      selectedEmployees,
    });

    alert(
      "Full & Final Settlement details saved successfully."
    );
  };

  /* =======================================================
     DROPDOWN RENDER
  ======================================================= */

  const renderDropdown = (name: string) => {
    const isOpen = openDropdown === name;

    return (
      <div
        key={name}
        className="relative flex-shrink-0"
      >
        <button
          type="button"
          onClick={(event) => {
            const rect =
              event.currentTarget.getBoundingClientRect();

            setDropdownPosition({
              top: rect.bottom + 2,
              left: rect.left,
            });

            setOpenDropdown(
              isOpen ? null : name
            );
          }}
          className="
            h-[30px]
            px-2
            flex
            items-center
            gap-1
            text-[9px]
            text-[#536273]
            whitespace-nowrap
            hover:text-[#078fd3]
          "
        >
          <span>{name}</span>
          <ChevronDown size={9} />
        </button>

        {isOpen && (
          <div
            className="
              fixed
              z-[9999]
              min-w-[135px]
              bg-white
              border
              border-[#d8e0e7]
              rounded-sm
              shadow-[0_6px_18px_rgba(0,0,0,0.16)]
              overflow-hidden
            "
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
            }}
          >
            {DROPDOWN_DATA[name].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setOpenDropdown(null)}
                className="
                  block
                  w-full
                  px-3
                  py-2
                  text-left
                  text-[9px]
                  text-[#526273]
                  whitespace-nowrap
                  hover:bg-[#eef7fc]
                  hover:text-[#078fd3]
                "
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div
      className="
        min-h-[calc(100vh-58px)]
        w-full
        flex
        flex-col
        bg-[#f7f9fc]
        text-[#3f5063]
      "
    >
      {/* ===================================================
          TOP TAB BAR
      ==================================================== */}

      <div
        className="
          h-[42px]
          min-h-[42px]
          bg-white
          border-b
          border-[#dce3e9]
          flex
          items-center
          justify-between
          px-3
        "
      >
        {/* TABS */}

        <div className="flex h-full items-center">
          {TABS.map((tab) => {
            const active =
              activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() =>
                  setActiveTab(tab)
                }
                className={`
                  h-full
                  px-4
                  text-[10px]
                  border-b-2
                  ${
                    active
                      ? "border-[#078fd3] text-[#078fd3] font-medium"
                      : "border-transparent text-[#526273]"
                  }
                  hover:text-[#078fd3]
                `}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* SAVE */}

        <button
          type="button"
          onClick={handleSave}
          className="
            flex
            items-center
            gap-1.5
            bg-[#078fd3]
            hover:bg-[#057fbf]
            text-white
            text-[10px]
            font-medium
            px-3
            py-1.5
            rounded-sm
          "
        >
          <Save size={12} />
          Save
        </button>
      </div>

      {/* ===================================================
          MAIN
      ==================================================== */}

      <div className="flex flex-1 min-h-0">
        {/* =================================================
            LEFT PANEL
        ================================================== */}

        <aside
          className="
            w-[145px]
            min-w-[145px]
            h-full
            bg-white
            border-r
            border-[#dce3e9]
            flex
            flex-col
          "
        >
          {/* HEADER */}

          <div
            className="
              h-[34px]
              min-h-[34px]
              px-3
              flex
              items-center
              bg-[#edf2f6]
              border-b
              border-[#dce3e9]
              text-[10px]
              font-semibold
              text-[#536273]
            "
          >
            FFS Settings
          </div>

          {/* DEFAULT SETTINGS */}

          <div className="flex-shrink-0">
            {DEFAULT_COMPONENTS.map(
              (component) => (
                <label
                  key={component}
                  className="
                    h-[29px]
                    px-3
                    flex
                    items-center
                    justify-between
                    border-b
                    border-[#edf0f3]
                    cursor-pointer
                    hover:bg-[#f5f9fc]
                  "
                >
                  <span
                    className="
                      text-[9px]
                      text-[#526273]
                      whitespace-nowrap
                    "
                  >
                    {component}
                  </span>

                  <input
                    type="checkbox"
                    checked={
                      components[component]
                    }
                    onChange={() =>
                      toggleComponent(
                        component
                      )
                    }
                    className="
                      w-[11px]
                      h-[11px]
                      accent-[#078fd3]
                      cursor-pointer
                    "
                  />
                </label>
              )
            )}
          </div>

          {/* =================================================
              ADD OPEN COMPONENT BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={() =>
              setShowOpenComponents(
                (previous) => !previous
              )
            }
            className="
              h-[34px]
              min-h-[34px]
              w-full
              px-3
              flex
              items-center
              justify-between
              bg-white
              border-t
              border-b
              border-[#dce3e9]
              text-[9px]
              text-[#526273]
              cursor-pointer
              hover:bg-[#eef7fc]
              hover:text-[#078fd3]
            "
          >
            <span>
              Add Open Component
            </span>

            <ChevronRight
              size={12}
              className={`
                transition-transform
                duration-200
                ${
                  showOpenComponents
                    ? "rotate-90 text-[#078fd3]"
                    : ""
                }
              `}
            />
          </button>

          {/* =================================================
              OPEN COMPONENTS
          ================================================== */}

          {showOpenComponents && (
            <div
              className="
                flex-1
                min-h-0
                overflow-y-auto
                overflow-x-hidden
                bg-white
              "
            >
              {OPEN_COMPONENTS.map(
                (component, index) => {
                  const selected =
                    selectedOpenComponent ===
                    component;

                  return (
                    <button
                      key={`${component}-${index}`}
                      type="button"
                      onClick={() =>
                        setSelectedOpenComponent(
                          component
                        )
                      }
                      className={`
                        w-full
                        min-h-[27px]
                        px-3
                        flex
                        items-center
                        justify-between
                        text-left
                        text-[8px]
                        border-b
                        border-[#edf0f3]
                        cursor-pointer
                        ${
                          selected
                            ? "bg-[#e5f4fc] text-[#078fd3]"
                            : "bg-white text-[#526273] hover:bg-[#f5f9fc]"
                        }
                      `}
                    >
                      <span>
                        {component}
                      </span>

                      {selected && (
                        <Check
                          size={10}
                          className="
                            text-[#078fd3]
                            flex-shrink-0
                          "
                        />
                      )}
                    </button>
                  );
                }
              )}
            </div>
          )}
        </aside>

        {/* =================================================
            RIGHT SIDE
        ================================================== */}

        <main
          className="
            flex-1
            min-w-0
            w-0
            flex
            flex-col
            overflow-hidden
          "
        >
          {/* =================================================
              FILTER TOOLBAR
          ================================================== */}

          <div
            className="
              relative
              z-[50]
              h-[38px]
              min-h-[38px]
              bg-white
              border-b
              border-[#dce3e9]
              flex
              items-center
              px-3
              gap-2
            "
          >
            {/* SEARCH */}

            <div
              className="
                w-[115px]
                flex-shrink-0
                flex
                items-center
                gap-1.5
                text-[#8b98a5]
                mr-4
              "
            >
              <Search size={11} />

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
                  outline-none
                  bg-transparent
                  text-[9px]
                  text-[#526273]
                  placeholder-[#9ca8b4]
                "
              />
            </div>

            {/* SCROLLABLE FILTER STRIP */}

            <div
              className="
                flex
                items-center
                gap-2
                flex-nowrap
                overflow-x-auto
                overflow-y-hidden
                flex-1
                min-w-0
                h-full
                pb-0.5
                [&::-webkit-scrollbar]:h-1.5
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-[#c7ccd4]
                [&::-webkit-scrollbar-thumb]:rounded-full
              "
            >
              {/* ADD FILTER */}

              <button
                type="button"
                className="
                  flex-shrink-0
                  flex
                  items-center
                  gap-1
                  px-1
                  text-[9px]
                  text-[#526273]
                  whitespace-nowrap
                  hover:text-[#078fd3]
                "
              >
                <Plus size={10} />
                Add Filter
              </button>

              {/* DROPDOWNS */}

              {renderDropdown("Query")}
              {renderDropdown("Branch")}
              {renderDropdown(
                "Salary Structure"
              )}
              {renderDropdown("Leave")}
              {renderDropdown("Attendance")}
              {renderDropdown("Designation")}
              {renderDropdown("Emp Status")}
            </div>
          </div>

          {/* =================================================
              DATE BAR
          ================================================== */}

          <div
            className="
              relative
              z-10
              w-full
              h-[40px]
              min-h-[40px]
              bg-white
              border-b
              border-[#dce3e9]
              flex
              items-center
              justify-start
              gap-2
              px-3
              overflow-x-auto
              overflow-y-visible
              whitespace-nowrap
              [scrollbar-width:thin]
              [scrollbar-color:#c7ccd4_transparent]
              [&::-webkit-scrollbar]:h-1.5
              [&::-webkit-scrollbar-track]:bg-transparent
              [&::-webkit-scrollbar-thumb]:bg-[#c7ccd4]
              [&::-webkit-scrollbar-thumb]:rounded-full
            "
          >
            {/* CALCULATION DATE */}

            <button
              type="button"
              onClick={() =>
                setDateMode(
                  "Calculation Date"
                )
              }
              className={`
                flex-shrink-0
                text-[9px]
                ${
                  dateMode ===
                  "Calculation Date"
                    ? "text-[#078fd3] font-medium"
                    : "text-[#536273]"
                }
              `}
            >
              Calculation Date
            </button>

            {/* SETTLEMENT DATE */}

            <button
              type="button"
              onClick={() =>
                setDateMode(
                  "Settlement Date"
                )
              }
              className={`
                flex-shrink-0
                text-[9px]
                ${
                  dateMode ===
                  "Settlement Date"
                    ? "text-[#078fd3] font-medium"
                    : "text-[#536273]"
                }
              `}
            >
              Settlement Date
            </button>

            {/* MAIN CALENDAR */}

            <ResponsiveDatePicker
              value={
                dateMode === "Calculation Date"
                  ? calculationDate
                  : settlementDate
              }
              onChange={(value) => {
                if (dateMode === "Calculation Date") {
                  setCalculationDate(value);
                } else {
                  setSettlementDate(value);
                }
              }}
            />

            <Clock
              size={12}
              className="text-[#8795a3]"
            />
          </div>

          {/* =================================================
              TABLE AREA
          ================================================== */}

          <div
            className="
              flex-1
              min-h-0
              overflow-auto
              bg-[#f7f9fc]
              p-2
            "
          >
            <div
              className="
                bg-white
                border
                border-[#d5dde5]
                min-w-[760px]
              "
            >
              {/* TABLE HEADER */}

              <div
                className="
                  grid
                  grid-cols-[1.5fr_1.2fr_1.3fr_1.5fr_40px]
                  min-h-[32px]
                  items-center
                  bg-[#dceef8]
                  border-b
                  border-[#cbdce7]
                  text-[9px]
                  font-medium
                  text-[#334b61]
                "
              >
                <div className="px-3">
                  Employee Name
                </div>

                <div className="px-3">
                  Date of Leaving
                </div>

                <div className="px-3">
                  Settlement Date
                </div>

                <div className="px-3">
                  Employee ID
                </div>

                <div className="flex justify-center">
                  <input
                    type="checkbox"
                    checked={
                      employees.length > 0 &&
                      employees.every(
                        (employee) =>
                          selectedEmployees[
                            employee.id
                          ]
                      )
                    }
                    onChange={
                      toggleAllEmployees
                    }
                    className="
                      w-[11px]
                      h-[11px]
                      accent-[#078fd3]
                      cursor-pointer
                    "
                  />
                </div>
              </div>

              {/* TABLE ROWS */}

              {filteredEmployees.length ===
              0 ? (
                <div
                  className="
                    py-12
                    text-center
                    text-[10px]
                    text-[#8996a3]
                  "
                >
                  No records found
                </div>
              ) : (
                filteredEmployees.map(
                  (employee) => (
                    <div
                      key={employee.id}
                      className="
                        grid
                        grid-cols-[1.5fr_1.2fr_1.3fr_1.5fr_40px]
                        min-h-[39px]
                        items-center
                        border-b
                        border-[#e5eaee]
                        hover:bg-[#f8fbfd]
                      "
                    >
                      {/* EMPLOYEE */}

                      <div className="px-3">
                        <div
                          className="
                            text-[8px]
                            text-[#71808f]
                          "
                        >
                          {employee.id}
                        </div>

                        <div
                          className="
                            text-[9px]
                            text-[#2f4255]
                            font-medium
                          "
                        >
                          {employee.name}
                        </div>
                      </div>

                      {/* LEAVING DATE */}

                      <div
                        className="
                          px-3
                          text-[9px]
                          text-[#526273]
                        "
                      >
                        {employee.leavingDate}
                      </div>

                      {/* SETTLEMENT DATE */}

                      <div className="px-3">
                        <ResponsiveDatePicker
                          value={employee.settlementDate}
                          onChange={(value) =>
                            updateEmployeeSettlementDate(
                              employee.id,
                              value
                            )
                          }
                        />
                      </div>

                      {/* EMPLOYEE ID */}

                      <div
                        className="
                          px-3
                          text-[9px]
                          text-[#607080]
                        "
                      >
                        {employee.id}
                      </div>

                      {/* CHECKBOX */}

                      <div className="flex justify-center">
                        <input
                          type="checkbox"
                          checked={
                            !!selectedEmployees[
                              employee.id
                            ]
                          }
                          onChange={() =>
                            toggleEmployee(
                              employee.id
                            )
                          }
                          className="
                            w-[11px]
                            h-[11px]
                            accent-[#078fd3]
                            cursor-pointer
                          "
                        />
                      </div>
                    </div>
                  )
                )
              )}
            </div>

            {/* =================================================
                PAGINATION
            ================================================== */}

            <div
              className="
                h-[30px]
                flex
                items-center
                justify-end
                px-3
                text-[8px]
                text-[#7d8b99]
              "
            >
              Rows per page&nbsp;

              <span className="font-medium">
                10
              </span>

              &nbsp;&nbsp;

              1 to{" "}
              {filteredEmployees.length} of{" "}
              {filteredEmployees.length}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

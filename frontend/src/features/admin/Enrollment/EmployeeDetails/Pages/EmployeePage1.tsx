import React, { useEffect, useMemo, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Search, Plus, Pencil, Trash2, LayoutGrid, X, ChevronDown, ChevronUp, Filter, Clock, Check, MoreVertical, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import EnrollmentToolbarPortal from "../components/EnrollmentToolbarPortal";
import {
  useGetEmployeesByFilterQuery,
  isEmployeeFull,
  type Employee,
  type EmployeeFilterType,
} from "../api/employeedetailsApi"; // adjust relative path

type SortConfig = { key: string | null; dir: "asc" | "desc" };
type ColFilters = Record<string, string>;

type FilterMenuProps = {
  label: string;
  options: string[];
  selected: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
};

type Column = { key: string; label: string };

const VALID_TYPES: EmployeeFilterType[] = ["all", "male", "female", "joined", "left", "confirmation-pending"];

const FULL_COLUMNS: Column[] = [
  { key: "EmployeeName", label: "Name" },
  { key: "JoiningDate", label: "Joining Date" },
  { key: "Email", label: "Contact" },
  { key: "BranchName", label: "Branch" },
  { key: "LeavePolicyName", label: "Leave Policy" },
];

const BASIC_COLUMNS: Column[] = [
  { key: "EmployeeName", label: "Name" },
  { key: "ReportingAuthorityName", label: "Reporting Authority" },
];

function useOutsideClick(ref: React.RefObject<HTMLElement | null>, callback: () => void) {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as Node;
      if (ref.current && !ref.current.contains(target)) callback();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, callback]);
}

function FixedDropdown({ anchor, children, width = 220, onClose }: { anchor: HTMLElement | null; children: ReactNode; width?: number; onClose: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!anchor) return;
    const update = () => {
      const rect = anchor.getBoundingClientRect();
      let left = rect.left;
      const dropdownRight = left + width;
      const screenWidth = window.innerWidth;
      if (dropdownRight > screenWidth - 10) left = screenWidth - width - 10;
      if (left < 10) left = 10;
      setPosition({ top: rect.bottom + 5, left });
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
  if (!anchor) return null;

  return (
    <div ref={ref} className="fixed z-[9999] overflow-hidden rounded-[5px] border border-[#DDE5EF] bg-white shadow-[0_7px_22px_rgba(30,55,90,0.16)]" style={{ top: position.top, left: position.left, width }}>
      {children}
    </div>
  );
}

function CheckBox({ checked }: { checked: boolean }) {
  return (
    <span className={["flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-[2px]", "transition-all duration-100", checked ? "bg-[#2D8CF0]" : "border border-[#C6D1DE] bg-white"].join(" ")}>
      {checked && <Check size={10} strokeWidth={3} className="text-white" />}
    </span>
  );
}

function MultiFilter({ label, options, selected, onChange }: FilterMenuProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);

  const toggle = (option: string) => {
    onChange((previous) => (previous.includes(option) ? previous.filter((item) => item !== option) : [...previous, option]));
  };

  const clear = () => {
    onChange([]);
    setOpen(false);
  };

  const active = selected.length > 0;
  if (options.length === 0) return null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={["flex h-[28px] shrink-0 items-center gap-[4px] rounded-[4px] px-[7px] text-[12px] font-medium transition-colors duration-100", active ? "bg-[#EDF5FE] text-[#2D8CF0]" : "text-[#526174] hover:bg-[#F4F7FA]"].join(" ")}
      >
        <span>
          {label}
          {selected.length > 1 ? ` (+${selected.length - 1})` : ""}
        </span>
        {open ? <ChevronUp size={12} strokeWidth={2} /> : <ChevronDown size={12} strokeWidth={2} />}
      </button>

      {open && (
        <FixedDropdown anchor={buttonRef.current} width={224} onClose={() => setOpen(false)}>
          <div className="max-h-[270px] overflow-y-auto py-[4px]">
            {options.map((option) => (
              <button key={option} type="button" onClick={() => toggle(option)} className="flex w-full items-center gap-[10px] px-[13px] py-[8px] text-left text-[12px] font-medium text-[#34445C] hover:bg-[#F5F8FC]">
                <CheckBox checked={selected.includes(option)} />
                <span className="truncate">{option}</span>
              </button>
            ))}
          </div>
          <div className="border-t border-[#EEF2F6]">
            <button type="button" onClick={clear} className="flex h-[34px] w-full items-center justify-center gap-[5px] text-[12px] font-medium text-[#A2ACB9] hover:bg-[#F8FAFC]">
              <X size={12} />
              Clear
            </button>
          </div>
        </FixedDropdown>
      )}
    </>
  );
}

function ColumnHeader({ column, sortConfig, setSortConfig, filters, setFilters }: {
  column: Column; sortConfig: SortConfig; setSortConfig: Dispatch<SetStateAction<SortConfig>>;
  filters: ColFilters; setFilters: Dispatch<SetStateAction<ColFilters>>;
}) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const filterValue = filters[column.key] || "";
  const sorted = sortConfig.key === column.key;
  const active = sorted || Boolean(filterValue);

  const sort = (direction: "asc" | "desc") => {
    setSortConfig({ key: column.key, dir: direction });
    setOpen(false);
  };

  return (
    <>
      <div className="flex h-[39px] items-center gap-[3px] px-[10px]">
        <button
          type="button"
          onClick={() => setSortConfig((previous) => ({ key: column.key, dir: previous.key === column.key && previous.dir === "asc" ? "desc" : "asc" }))}
          className="truncate text-[12px] font-semibold text-[#263B55]"
        >
          {column.label}
        </button>
        <button
          ref={buttonRef}
          type="button"
          title={`Filter ${column.label}`}
          onClick={() => setOpen((value) => !value)}
          className={["flex h-[20px] w-[20px] items-center justify-center rounded", active ? "text-[#2D8CF0]" : "text-[#91A6BC] hover:text-[#2D8CF0]"].join(" ")}
        >
          <Filter size={11} strokeWidth={2} />
        </button>
      </div>

      {open && (
        <FixedDropdown anchor={buttonRef.current} width={220} onClose={() => setOpen(false)}>
          <div className="p-[8px]">
            <button type="button" onClick={() => sort("asc")} className={["flex w-full items-center gap-[8px] rounded px-[8px] py-[7px] text-left text-[12px]", sorted && sortConfig.dir === "asc" ? "bg-[#EDF5FE] font-semibold text-[#2D8CF0]" : "text-[#34445C] hover:bg-[#F5F8FC]"].join(" ")}>
              <ArrowUpDown size={12} />
              Sort A to Z
            </button>
            <button type="button" onClick={() => sort("desc")} className={["flex w-full items-center gap-[8px] rounded px-[8px] py-[7px] text-left text-[12px]", sorted && sortConfig.dir === "desc" ? "bg-[#EDF5FE] font-semibold text-[#2D8CF0]" : "text-[#34445C] hover:bg-[#F5F8FC]"].join(" ")}>
              <ArrowUpDown size={12} />
              Sort Z to A
            </button>
            <div className="my-[7px] h-px bg-[#EDF1F5]" />
            <input
              autoFocus
              value={filterValue}
              onChange={(event) => setFilters((previous) => ({ ...previous, [column.key]: event.target.value }))}
              placeholder={`Filter ${column.label.toLowerCase()}`}
              className="h-[30px] w-full rounded-[4px] border border-[#D9E2EC] px-[9px] text-[11.5px] text-[#33415C] outline-none placeholder:text-[#A2AFBF] focus:border-[#2D8CF0]"
            />
            {filterValue && (
              <button type="button" onClick={() => setFilters((previous) => ({ ...previous, [column.key]: "" }))} className="mt-[6px] flex w-full items-center justify-center gap-[4px] rounded py-[5px] text-[11.5px] font-medium text-[#F04438] hover:bg-[#FEF3F2]">
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

export default function EmployeePage1() {
  const navigate = useNavigate();
  const { domain } = useParams();
  const [searchParams] = useSearchParams();

  const rawType = searchParams.get("type") ?? "all";
  const type: EmployeeFilterType = VALID_TYPES.includes(rawType as EmployeeFilterType) ? (rawType as EmployeeFilterType) : "all";
  const needsDate = type === "joined" || type === "left";
  const now = new Date();

  const { data, isLoading, isError } = useGetEmployeesByFilterQuery({
    type,
    month: needsDate ? now.getMonth() + 1 : undefined,
    year: needsDate ? now.getFullYear() : undefined,
  });

  const employees = useMemo(() => data?.data ?? [], [data]);
  const columns = type === "all" ? FULL_COLUMNS : BASIC_COLUMNS;

  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, dir: "asc" });
  const [colFilters, setColFilters] = useState<ColFilters>({});

  const [branchFilter, setBranchFilter] = useState<string[]>([]);
  const [leaveFilter, setLeaveFilter] = useState<string[]>([]);
  const [attendanceFilter, setAttendanceFilter] = useState<string[]>([]);

  const [showFilterRow, setShowFilterRow] = useState(true);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showClockMenu, setShowClockMenu] = useState(false);
  const [rightTab, setRightTab] = useState("Table");

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const filterOptions = useMemo(() => {
    if (type !== "all") return { branch: [], leave: [], attendance: [] };
    const fullRows = employees.filter(isEmployeeFull);
    const uniq = (values: (string | null)[]) => Array.from(new Set(values.filter((v): v is string => Boolean(v))));
    return {
      branch: uniq(fullRows.map((e) => e.BranchName)),
      leave: uniq(fullRows.map((e) => e.LeavePolicyName)),
      attendance: uniq(fullRows.map((e) => e.AttendanceType)),
    };
  }, [employees, type]);

  const filteredEmployees = useMemo(() => {
    const q = search.trim().toLowerCase();

    let result = employees.filter((employee) => {
      const searchMatch =
        !q ||
        employee.EmployeeName?.toLowerCase().includes(q) ||
        String(employee.EmployeeID).toLowerCase().includes(q) ||
        (isEmployeeFull(employee) && (employee.Email?.toLowerCase().includes(q) || employee.DesignationName?.toLowerCase().includes(q) || employee.BranchName?.toLowerCase().includes(q)));

      const dropdownMatch =
        type !== "all" ||
        !isEmployeeFull(employee) ||
        ((branchFilter.length === 0 || (employee.BranchName && branchFilter.includes(employee.BranchName))) &&
          (leaveFilter.length === 0 || (employee.LeavePolicyName && leaveFilter.includes(employee.LeavePolicyName))) &&
          (attendanceFilter.length === 0 || (employee.AttendanceType && attendanceFilter.includes(employee.AttendanceType))));

      const columnMatch = Object.entries(colFilters).every(([key, value]) => {
        if (!value) return true;
        const employeeValue = String((employee as any)[key] ?? "").toLowerCase();
        return employeeValue.includes(value.toLowerCase());
      });

      return searchMatch && dropdownMatch && columnMatch;
    });

    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        const first = String((a as any)[sortConfig.key!] ?? "").toLowerCase();
        const second = String((b as any)[sortConfig.key!] ?? "").toLowerCase();
        if (first < second) return sortConfig.dir === "asc" ? -1 : 1;
        if (first > second) return sortConfig.dir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [employees, search, branchFilter, leaveFilter, attendanceFilter, colFilters, sortConfig, type]);

  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / rowsPerPage));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filteredEmployees.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const startIndex = filteredEmployees.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endIndex = Math.min(currentPage * rowsPerPage, filteredEmployees.length);

  useEffect(() => {
    setPage(1);
  }, [search, branchFilter, leaveFilter, attendanceFilter, colFilters, rowsPerPage, type]);

  const clearAllFilters = () => {
    setSearch("");
    setBranchFilter([]);
    setLeaveFilter([]);
    setAttendanceFilter([]);
    setColFilters({});
    setSortConfig({ key: null, dir: "asc" });
    setPage(1);
    flash("Filters cleared");
  };

  const exportCSV = () => {
    const headers = type === "all"
      ? ["Emp ID", "Name", "Designation", "Joining Date", "Email", "Mobile", "Branch", "Leave Policy", "Attendance"]
      : ["Emp ID", "Name", "Reporting Authority"];

    const rows = filteredEmployees.map((e) =>
      isEmployeeFull(e)
        ? [e.EmployeeID, e.EmployeeName, e.DesignationName, e.JoiningDate, e.Email, e.MobileNo, e.BranchName, e.LeavePolicyName, e.AttendanceType]
        : [e.EmployeeID, e.EmployeeName, e.ReportingAuthorityName]
    );

    const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Employees.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    flash("Employees.csv downloaded");
  };

  const pageNumbers = useMemo(() => {
    const numbers: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i <= 5 || i === totalPages || Math.abs(i - currentPage) <= 1) numbers.push(i);
      else if (numbers[numbers.length - 1] !== "...") numbers.push("...");
    }
    return numbers;
  }, [totalPages, currentPage]);

  if (isLoading) {
    return <div className="flex min-h-[400px] items-center justify-center text-[12px] text-[#8291A4]">Loading employees...</div>;
  }

  if (isError) {
    return <div className="flex min-h-[400px] items-center justify-center text-[12px] text-[#F04438]">Could not load employees. Please try again.</div>;
  }

  return (
    <div className="min-h-full w-full bg-[#F4F7FB] text-[#26364F]" style={{ fontFamily: "Inter, Arial, Helvetica, sans-serif" }}>
      {toast && (
        <div className="fixed right-[22px] top-[18px] z-[10000] flex items-center gap-[8px] rounded-[6px] bg-[#26364F] px-[13px] py-[8px] text-[12px] text-white shadow-[0_8px_24px_rgba(20,35,55,0.22)]">
          <Check size={13} className="text-[#4ADE80]" />
          {toast}
        </div>
      )}

      <EnrollmentToolbarPortal>
        <button type="button" onClick={() => flash("Add Employee form opened")} className="flex h-[27px] items-center gap-[6px] rounded-[5px] bg-[#2D8CF0] px-[12px] text-[11.5px] font-semibold text-white shadow-[0_2px_5px_rgba(45,140,240,0.25)] transition hover:bg-[#1B7BE0]">
          <Plus size={14} strokeWidth={2.8} />
          Add Employee
        </button>
        <button type="button" onClick={exportCSV} title="Export" className="flex h-[27px] w-[27px] items-center justify-center rounded-[5px] text-[#29985B] transition hover:bg-[#EDF8F1]">
          <span className="text-[9px] font-bold">XLS</span>
        </button>
        <button type="button" onClick={() => setShowFilterRow((value) => !value)} title="Filter" className={["flex h-[27px] w-[27px] items-center justify-center rounded-[5px]", showFilterRow ? "text-[#2D8CF0]" : "text-[#9BAABD]"].join(" ")}>
          <Filter size={15} strokeWidth={1.9} />
        </button>
        <div className="relative">
          <button type="button" onClick={() => setShowClockMenu((value) => !value)} className="flex h-[27px] w-[27px] items-center justify-center rounded-[5px] text-[#9BAABD] hover:bg-[#F4F7FA]">
            <Clock size={15} strokeWidth={1.9} />
          </button>
          {showClockMenu && (
            <div className="absolute right-0 top-[31px] z-[100] w-[200px] rounded-[6px] border border-[#E0E6ED] bg-white py-[6px] shadow-[0_7px_22px_rgba(30,55,90,0.16)]">
              <div className="px-[12px] py-[5px] text-[10px] font-semibold uppercase tracking-wide text-[#A0ADBC]">Recent</div>
              <div className="px-[12px] py-[8px] text-[11.5px] text-[#68788D]">Nothing viewed yet.</div>
            </div>
          )}
        </div>
      </EnrollmentToolbarPortal>

      <div className="flex w-full gap-[6px] pt-[6px]">
        <div className="min-w-0 flex-1">
          <div className="relative flex min-h-[37px] items-center rounded-[7px] border border-[#E7ECF2] bg-white px-[10px] shadow-[0_1px_3px_rgba(25,45,70,0.07)]">
            <div className="relative w-[275px] shrink-0">
              <Search size={13} className="absolute left-0 top-1/2 -translate-y-1/2 text-[#9DAEC0]" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Start Typing..." className="h-[27px] w-full border-none bg-transparent pl-[19px] text-[11.5px] text-[#33445C] outline-none placeholder:text-[#A9B5C3]" />
            </div>

            <button type="button" onClick={() => setShowFilterRow((value) => !value)} className="mr-[7px] flex h-[27px] shrink-0 items-center gap-[4px] rounded-[4px] px-[7px] text-[11.5px] font-medium text-[#2D8CF0] hover:bg-[#F0F7FE]">
              <Plus size={12} strokeWidth={2.5} />
              Add Filter
            </button>

            {showFilterRow && type === "all" && (
              <div className="flex min-w-0 flex-1 items-center gap-[2px] overflow-x-auto scrollbar-none">
                <MultiFilter label="Branch" options={filterOptions.branch} selected={branchFilter} onChange={setBranchFilter} />
                <MultiFilter label="Leave" options={filterOptions.leave} selected={leaveFilter} onChange={setLeaveFilter} />
                <MultiFilter label="Attendance" options={filterOptions.attendance} selected={attendanceFilter} onChange={setAttendanceFilter} />
              </div>
            )}

            <button type="button" onClick={() => setShowMoreMenu((value) => !value)} className="ml-auto flex h-[25px] w-[22px] shrink-0 items-center justify-center text-[#7F91A7] hover:text-[#34445C]">
              <MoreVertical size={15} />
            </button>

            {showMoreMenu && (
              <div className="absolute right-[34px] top-[34px] z-[100] w-[185px] overflow-hidden rounded-[5px] border border-[#E0E6ED] bg-white py-[4px] shadow-[0_7px_22px_rgba(30,55,90,0.16)]">
                <button type="button" onClick={() => { clearAllFilters(); setShowMoreMenu(false); }} className="w-full px-[12px] py-[8px] text-left text-[11.5px] text-[#405168] hover:bg-[#F5F8FC]">
                  Reset all filters
                </button>
                <button type="button" onClick={() => { exportCSV(); setShowMoreMenu(false); }} className="w-full px-[12px] py-[8px] text-left text-[11.5px] text-[#405168] hover:bg-[#F5F8FC]">
                  Download as CSV
                </button>
              </div>
            )}

            <button type="button" onClick={clearAllFilters} title="Clear all filters" className="flex h-[25px] w-[22px] shrink-0 items-center justify-center text-[#F04438] hover:bg-[#FEF3F2]">
              <X size={15} strokeWidth={2.4} />
            </button>
          </div>

          {rightTab !== "Table" ? (
            <div className="mt-[5px] flex min-h-[400px] items-center justify-center rounded-[7px] border border-[#E6EBF1] bg-white text-[12px] text-[#8291A4] shadow-[0_1px_3px_rgba(25,45,70,0.07)]">
              {rightTab} view
            </div>
          ) : (
            <>
              <div className="mt-[5px] min-w-[900px] grid gap-0 items-center rounded-[7px] border border-[#CFE0EF] bg-[#D3E6F6] shadow-[0_1px_2px_rgba(25,45,70,0.05)]" style={{ gridTemplateColumns: type === "all" ? "minmax(210px,2.05fr) minmax(145px,1fr) minmax(210px,1.55fr) minmax(225px,1.75fr) minmax(160px,1.2fr) 112px" : "minmax(210px,2.05fr) minmax(210px,1.55fr) 112px" }}>
                {columns.map((column) => (
                  <ColumnHeader key={column.key} column={column} sortConfig={sortConfig} setSortConfig={setSortConfig} filters={colFilters} setFilters={setColFilters} />
                ))}
                <div className="flex h-[39px] items-center px-[10px] text-[12px] font-semibold text-[#263B55]">Action</div>
              </div>

              <div className="mt-[5px] min-w-[900px] space-y-[5px]">
                {pageRows.map((employee) => (
                  <div
                    key={employee.EmployeeID}
                    className="grid items-center rounded-[7px] border border-[#E5EAF0] bg-white shadow-[0_1px_3px_rgba(25,45,70,0.08)] transition-all duration-100 hover:border-[#D8E1EB] hover:shadow-[0_2px_8px_rgba(25,45,70,0.11)] min-h-[55px]"
                    style={{ gridTemplateColumns: type === "all" ? "minmax(210px,2.05fr) minmax(145px,1fr) minmax(210px,1.55fr) minmax(225px,1.75fr) minmax(160px,1.2fr) 112px" : "minmax(210px,2.05fr) minmax(210px,1.55fr) 112px" }}
                  >
                    <div className="min-w-0 px-[10px] py-[7px]">
                      <div className="flex min-w-0 items-center gap-[7px]">
                        <span className="shrink-0 rounded-[3px] px-[5px] py-[2px] font-mono text-[9px] font-semibold bg-[#E5F0FB] text-[#1565C0]">
                          {employee.EmployeeID}
                        </span>
                        <span className="truncate text-[11.5px] font-semibold text-[#263B55]">{employee.EmployeeName}</span>
                      </div>
                      {isEmployeeFull(employee) && employee.DesignationName && (
                        <div className="mt-[6px] truncate text-[9.5px] font-medium uppercase tracking-[0.02em] text-[#718198]">{employee.DesignationName}</div>
                      )}
                    </div>

                    {type === "all" && isEmployeeFull(employee) ? (
                      <>
                        <div className="px-[10px] py-[7px]">
                          {employee.JoiningDate && (
                            <div className="flex items-center gap-[6px]">
                              <span className="rounded-[2px] bg-[#E5EFF9] px-[4px] py-[1px] font-mono text-[8px] font-semibold text-[#2D8CF0]">DOJ</span>
                              <span className="text-[10.5px] text-[#34445C]">{employee.JoiningDate}</span>
                            </div>
                          )}
                          {employee.ExitDate && (
                            <div className="mt-[5px] flex items-center gap-[6px]">
                              <span className="rounded-[2px] bg-[#FCE8EB] px-[4px] py-[1px] font-mono text-[8px] font-semibold text-[#E03A4A]">DOL</span>
                              <span className="text-[10.5px] text-[#E03A4A]">{employee.ExitDate}</span>
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 px-[10px] py-[7px]">
                          {employee.Email && <div className="truncate text-[10.5px] text-[#34445C]">{employee.Email}</div>}
                          {employee.MobileNo && (
                            <div className="mt-[5px] flex items-center gap-[5px]">
                              <span className="rounded-[2px] bg-[#F0F3F7] px-[4px] py-[1px] font-mono text-[8px] font-semibold text-[#7C8B9D]">Mob</span>
                              <span className="text-[9.5px] text-[#7C8B9D]">{employee.MobileNo}</span>
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 px-[10px] py-[7px]">
                          {employee.BranchName && <div className="truncate text-[10.5px] text-[#34445C]">{employee.BranchName}</div>}
                          {employee.ReportingManager && (
                            <div className="mt-[5px] flex min-w-0 items-center gap-[5px]">
                              <span className="shrink-0 text-[8.5px] font-semibold text-[#9AA9B9]">R.A.</span>
                              <span className="truncate text-[9.5px] font-medium uppercase text-[#718198]">{employee.ReportingManager}</span>
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 px-[10px] py-[7px]">
                          {employee.LeavePolicyName && <div className="truncate text-[10.5px] text-[#34445C]">{employee.LeavePolicyName}</div>}
                          {employee.AttendanceType && (
                            <div className="mt-[5px] flex items-center gap-[5px]">
                              <span className="rounded-[2px] bg-[#E5F4E8] px-[4px] py-[1px] text-[8px] font-semibold text-[#2E7D32]">Attendance</span>
                              <span className="text-[9.5px] text-[#7B899A]">{employee.AttendanceType}</span>
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="min-w-0 px-[10px] py-[7px]">
                        {!isEmployeeFull(employee) && "ReportingAuthorityName" in employee && employee.ReportingAuthorityName && (
                          <div className="truncate text-[10.5px] text-[#34445C]">{employee.ReportingAuthorityName}</div>
                        )}
                        {!isEmployeeFull(employee) && "JoiningDate" in employee && employee.JoiningDate && (
                          <div className="mt-[5px] flex items-center gap-[6px]">
                            <span className="rounded-[2px] bg-[#E5EFF9] px-[4px] py-[1px] font-mono text-[8px] font-semibold text-[#2D8CF0]">DOJ</span>
                            <span className="text-[10.5px] text-[#34445C]">{employee.JoiningDate}</span>
                          </div>
                        )}
                        {!isEmployeeFull(employee) && "ExitDate" in employee && employee.ExitDate && (
                          <div className="mt-[5px] flex items-center gap-[6px]">
                            <span className="rounded-[2px] bg-[#FCE8EB] px-[4px] py-[1px] font-mono text-[8px] font-semibold text-[#E03A4A]">DOL</span>
                            <span className="text-[10.5px] text-[#E03A4A]">{employee.ExitDate}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-[3px] px-[10px]">
                      <button type="button" title="Employee dashboard" onClick={() => navigate(`/${domain}/admin/enrollment/employee/${employee.EmployeeID}`)} className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] text-[#68798E] hover:bg-[#EEF3F8] hover:text-[#263B55]">
                        <LayoutGrid size={13} strokeWidth={2} />
                      </button>
                      <button type="button" title="Edit employee" onClick={() => flash(`Editing ${employee.EmployeeName}`)} className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] text-[#2D8CF0] hover:bg-[#EDF5FE]">
                        <Pencil size={13} strokeWidth={2} />
                      </button>
                      <button type="button" title="Delete employee" onClick={() => setDeletingEmployee(employee)} className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] text-[#F04438] hover:bg-[#FEF3F2]">
                        <Trash2 size={13} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                ))}

                {pageRows.length === 0 && (
                  <div className="rounded-[7px] border border-[#E5EAF0] bg-white py-[70px] text-center text-[12px] text-[#8291A4] shadow-[0_1px_3px_rgba(25,45,70,0.07)]">
                    No employees match these filters.
                  </div>
                )}
              </div>

              <div className="mt-[5px] flex min-w-[900px] items-center justify-end gap-[14px] rounded-[7px] border border-[#E5EAF0] bg-white px-[10px] py-[6px] text-[10px] text-[#66778D] shadow-[0_1px_3px_rgba(25,45,70,0.07)]">
                <div className="flex items-center gap-[5px]">
                  <span>Rows per page</span>
                  <div className="relative">
                    <select value={rowsPerPage} onChange={(event) => setRowsPerPage(Number(event.target.value))} className="h-[23px] appearance-none rounded-[3px] border-none bg-transparent pl-[2px] pr-[15px] text-[10px] text-[#33445C] outline-none">
                      {[10, 25, 50, 100].map((number) => <option key={number} value={number}>{number}</option>)}
                    </select>
                    <ChevronDown size={9} className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#8494A7]" />
                  </div>
                </div>

                <span>{startIndex} to {endIndex} of {filteredEmployees.length}</span>

                <div className="flex items-center gap-[1px]">
                  <button type="button" disabled={currentPage === 1} onClick={() => setPage(1)} className="flex h-[21px] w-[21px] items-center justify-center rounded text-[#8C9BAE] hover:bg-[#EFF4F8] disabled:opacity-30">
                    <ChevronsLeft size={12} />
                  </button>
                  <button type="button" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="flex h-[21px] w-[21px] items-center justify-center rounded text-[#8C9BAE] hover:bg-[#EFF4F8] disabled:opacity-30">
                    <ChevronLeft size={12} />
                  </button>
                  {pageNumbers.map((number, index) =>
                    number === "..." ? (
                      <span key={`ellipsis-${index}`} className="px-[3px] text-[#A7B3C1]">...</span>
                    ) : (
                      <button key={number} type="button" onClick={() => setPage(Number(number))} className={["flex h-[21px] min-w-[21px] items-center justify-center rounded-[3px] text-[10px]", number === currentPage ? "bg-[#2D8CF0] font-semibold text-white" : "text-[#53657A] hover:bg-[#EFF4F8]"].join(" ")}>
                        {number}
                      </button>
                    )
                  )}
                  <button type="button" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))} className="flex h-[21px] w-[21px] items-center justify-center rounded text-[#8C9BAE] hover:bg-[#EFF4F8] disabled:opacity-30">
                    <ChevronRight size={12} />
                  </button>
                  <button type="button" disabled={currentPage === totalPages} onClick={() => setPage(totalPages)} className="flex h-[21px] w-[21px] items-center justify-center rounded text-[#8C9BAE] hover:bg-[#EFF4F8] disabled:opacity-30">
                    <ChevronsRight size={12} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="sticky top-[5px] flex w-[27px] shrink-0 flex-col gap-[3px]">
          {["Table", "Pivot", "Ask Me", "Column"].map((tab) => {
            const active = rightTab === tab;
            return (
              <button key={tab} type="button" onClick={() => setRightTab(tab)} className={["relative flex h-[58px] w-[27px] items-center justify-center rounded-r-[5px]", "text-[10px]", "transition-all", active ? "bg-white font-semibold text-[#2D8CF0] shadow-[0_1px_4px_rgba(25,45,70,0.10)]" : "bg-[#E4E9F4] font-medium text-[#687991] hover:bg-[#DDE4EF]"].join(" ")} style={{ writingMode: "vertical-rl" }}>
                {tab === "Ask Me" && <span className="absolute left-1/2 top-[-2px] -translate-x-1/2 text-[12px] text-[#F04438]">✦</span>}
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {deletingEmployee && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#26364F]/40 backdrop-blur-[1px]">
          <div className="w-[360px] rounded-[8px] border border-[#E1E7EE] bg-white p-[20px] shadow-[0_18px_45px_rgba(25,45,70,0.22)]">
            <h3 className="text-[15px] font-semibold text-[#263B55]">Remove employee?</h3>
            <p className="mt-[7px] text-[12px] leading-[19px] text-[#68788D]">{deletingEmployee.EmployeeName} will be removed from this list.</p>
            <div className="mt-[18px] flex justify-end gap-[7px]">
              <button type="button" onClick={() => setDeletingEmployee(null)} className="rounded-[5px] border border-[#D8E1EA] px-[13px] py-[6px] text-[11.5px] font-medium text-[#68788D] hover:bg-[#F5F8FC]">
                Keep employee
              </button>
              <button type="button" onClick={() => { flash(`${deletingEmployee.EmployeeName} removed`); setDeletingEmployee(null); }} className="rounded-[5px] bg-[#F04438] px-[13px] py-[6px] text-[11.5px] font-semibold text-white hover:bg-[#D92D20]">
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
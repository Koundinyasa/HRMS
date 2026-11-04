import { useState } from "react";
import { CheckCircle2, Download, Plus, RotateCcw, Search, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import type { Employee } from "../api/employeeListApi";
import ColumnHeaderCell from "../components/ColumnHeaderCell";
import DeleteEmployeeDialog from "../components/DeleteEmployeeDialog";
import EmployeeRow from "../components/EmployeeRow";
import MultiFilter from "../components/MultiFilter";
import Pagination from "../components/Pagination";
import {
  ACTION_COLUMN_WIDTH,
  COLUMNS,
  GRID_COLUMNS,
  TYPE_LABELS,
  addEmployeePath,
  employeeDetailPath,
} from "../constants/employeeList.constants";
import { useEmployeeList } from "../hooks/useEmployeeList";
import { exportEmployeesCsv } from "../utils/exportEmployees";

const card = "overflow-hidden rounded-xl border border-[#E2E2E2] bg-white shadow-[0_1px_3px_rgba(19,19,19,0.06)]";

/** Admin Center > Employee List. */
export default function EmployeeListPage() {
  const navigate = useNavigate();
  const { domain } = useParams();
  const list = useEmployeeList();
  const [toDelete, setToDelete] = useState<Employee | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (list.isLoading) {
    return (
      <div role="status" className="flex min-h-[400px] items-center justify-center text-[14px] text-[#626262]">
        Loading employees…
      </div>
    );
  }

  if (list.isError) {
    return (
      <div role="alert" className="flex min-h-[400px] flex-col items-center justify-center gap-3 text-[14px] text-[#DD3232]">
        Could not load employees.
        <button
          type="button"
          onClick={() => void list.refetch()}
          className="rounded-lg border border-[#E2E2E2] bg-white px-4 py-2 text-[13.5px] font-medium text-[#131313] hover:bg-[#F7F7F7]"
        >
          Try again
        </button>
      </div>
    );
  }

  const openEmployee = (employeeId: number) => navigate(employeeDetailPath(domain, employeeId));
  const filtered = list.employees.length !== list.totalCount;

  return (
    <div className="w-full text-[#131313]">
      {/* Title and actions */}
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF5EE] text-[#FF6200]">
            <Users size={22} strokeWidth={2} />
          </span>
          <div>
            <h1 className="text-[22px] font-bold leading-tight">Employee List</h1>
            <p className="mt-0.5 text-[13.5px] text-[#626262]">
              {filtered ? `${list.employees.length} of ${list.totalCount}` : list.totalCount} employees
              {list.type !== "all" && ` · ${TYPE_LABELS[list.type]}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => exportEmployeesCsv(list.employees)}
            disabled={list.employees.length === 0}
            className="flex h-10 items-center gap-2 rounded-lg border border-[#E2E2E2] bg-white px-4 text-[13.5px] font-semibold text-[#131313] transition-colors hover:bg-[#F7F7F7] disabled:pointer-events-none disabled:opacity-50"
          >
            <Download size={16} strokeWidth={2.2} />
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => navigate(addEmployeePath(domain))}
            className="flex h-10 items-center gap-2 rounded-lg bg-[#FF6200] px-4 text-[13.5px] font-semibold text-white shadow-[0_2px_6px_rgba(255,98,0,0.25)] transition-colors hover:bg-[#E55600]"
          >
            <Plus size={17} strokeWidth={2.6} />
            Add Employee
          </button>
        </div>
      </header>

      {notice && (
        <p
          role="status"
          className="mb-4 flex items-center gap-2 rounded-lg bg-[#E7F8F1] px-4 py-2.5 text-[13.5px] font-medium text-[#0B8F63]"
        >
          <CheckCircle2 size={16} />
          {notice}
        </p>
      )}

      {/* Search and filters */}
      <section aria-label="Search and filters" className={`${card} mb-4 flex flex-wrap items-center gap-2.5 p-3`}>
        <div className="relative w-full sm:w-[300px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
          <input
            type="search"
            value={list.search}
            onChange={(event) => list.setSearch(event.target.value)}
            placeholder="Search name, ID, email, branch…"
            aria-label="Search employees"
            className="h-9 w-full rounded-lg border border-[#E2E2E2] bg-white pl-9 pr-3 text-[13.5px] outline-none placeholder:text-[#8A8A8A] focus:border-[#FF6200]"
          />
        </div>

        {list.filterOptions.map((filter) => (
          <MultiFilter
            key={filter.key}
            label={filter.label}
            options={filter.options}
            selected={list.filters[filter.key] ?? []}
            onChange={(selected) => list.setFilter(filter.key, selected)}
          />
        ))}

        {list.hasActiveFilters && (
          <button
            type="button"
            onClick={list.clearAll}
            className="ml-auto flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13.5px] font-medium text-[#DD3232] hover:bg-[#FEF3F2]"
          >
            <RotateCcw size={14} strokeWidth={2.2} />
            Reset
          </button>
        )}
      </section>

      {/* Table */}
      <section aria-label="Employees" className={card}>
        <div className="overflow-x-auto">
          <div className="min-w-[1120px]">
            <div
              className="grid items-center bg-[#FAFAFA] py-3"
              style={{ gridTemplateColumns: GRID_COLUMNS }}
            >
              {COLUMNS.map((column) => (
                <ColumnHeaderCell
                  key={column.key}
                  column={column}
                  sort={list.sort}
                  onSort={list.toggleSort}
                  filterValue={list.columnFilters[column.key] ?? ""}
                  onFilter={list.setColumnFilter}
                />
              ))}
              <div
                className="text-center text-[12px] font-semibold uppercase tracking-[0.04em] text-[#626262]"
                style={{ width: ACTION_COLUMN_WIDTH }}
              >
                Actions
              </div>
            </div>

            {list.pageRows.map((employee) => (
              <EmployeeRow
                key={employee.EmployeeID}
                employee={employee}
                onOpen={openEmployee}
                onDelete={setToDelete}
              />
            ))}

            {list.pageRows.length === 0 && (
              <div className="flex flex-col items-center gap-3 border-t border-[#EDEDED] py-16 text-[14px] text-[#626262]">
                No employees match these filters.
                {list.hasActiveFilters && (
                  <button
                    type="button"
                    onClick={list.clearAll}
                    className="rounded-lg border border-[#E2E2E2] px-4 py-2 text-[13.5px] font-medium text-[#FF6200] hover:bg-[#FFF5EE]"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <Pagination
          page={list.page}
          totalPages={list.totalPages}
          total={list.employees.length}
          firstShown={list.firstShown}
          lastShown={list.lastShown}
          rowsPerPage={list.rowsPerPage}
          onPage={list.setPage}
          onRowsPerPage={list.setRowsPerPage}
        />
      </section>

      <DeleteEmployeeDialog
        employee={toDelete}
        onClose={() => setToDelete(null)}
        onRemoved={(employee) => {
          setToDelete(null);
          setNotice(`${employee.EmployeeName} was removed.`);
          window.setTimeout(() => setNotice(null), 5000);
        }}
      />
    </div>
  );
}

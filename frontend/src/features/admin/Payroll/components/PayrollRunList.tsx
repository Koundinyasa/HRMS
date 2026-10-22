import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react";
import { PAYROLL_RUN_STATUSES, PAYROLL_RUNS_PAGE_SIZE } from "../constants/payroll.constants";
import type { PayrollRun } from "../types/payroll.types";
import { formatDate, formatPeriod } from "../utils/payrollFormat";
import {
  EmptyState,
  ErrorNote,
  FormField,
  SectionCard,
  StatusBadge,
  inputClass,
  neutralBtn,
  primaryBtn,
  smallOutlineBtn,
  tableCell,
} from "./PayrollShared";

type CreateResult = { valid: true; runId: string } | { valid: false; message: string };

interface PayrollRunListProps {
  runs: PayrollRun[];
  onCreate: (period: string) => CreateResult;
  onView: (runId: string) => void;
  onPayslips: (runId: string) => void;
}

function NewRunModal({
  onCreate,
  onClose,
}: {
  onCreate: (period: string) => CreateResult;
  onClose: () => void;
}) {
  const [period, setPeriod] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    const result = onCreate(period);
    if (result.valid) onClose();
    else setError(result.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">New Payroll Run</h3>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5 text-[#6b7280]" />
          </button>
        </div>
        <FormField label="Pay Period *">
          <input
            type="month"
            className={inputClass}
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value);
              setError("");
            }}
          />
        </FormField>
        <p className="text-xs text-[#6b7280]">
          Includes every employee whose joining date and salary structure are effective in the selected month.
        </p>
        <ErrorNote message={error} />
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className={neutralBtn}>Cancel</button>
          <button type="button" onClick={submit} className={primaryBtn}>Run Payroll</button>
        </div>
      </div>
    </div>
  );
}

export function PayrollRunList({ runs, onCreate, onView, onPayslips }: PayrollRunListProps) {
  const [month, setMonth] = useState("All");
  const [status, setStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return runs.filter(
      (run) =>
        (month === "All" || run.period === month) &&
        (status === "All" || run.status === status) &&
        (!term || formatPeriod(run.period).toLowerCase().includes(term)),
    );
  }, [runs, month, status, search]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAYROLL_RUNS_PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice(
    (currentPage - 1) * PAYROLL_RUNS_PAGE_SIZE,
    currentPage * PAYROLL_RUNS_PAGE_SIZE,
  );
  const offset = (currentPage - 1) * PAYROLL_RUNS_PAGE_SIZE;

  const onFilter = (apply: () => void) => {
    apply();
    setPage(1);
  };

  return (
    <>
      <div className="flex justify-end">
        <button type="button" onClick={() => setCreating(true)} className={primaryBtn}>
          <Plus className="h-4 w-4" />
          New Payroll Run
        </button>
      </div>

      <SectionCard title="Payroll Runs">
        <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-[200px_200px_1fr]">
          <FormField label="Month">
            <select className={inputClass} value={month} onChange={(e) => onFilter(() => setMonth(e.target.value))}>
              <option value="All">All</option>
              {runs.map((run) => (
                <option key={run.id} value={run.period}>{formatPeriod(run.period)}</option>
              ))}
            </select>
          </FormField>
          <FormField label="Status">
            <select className={inputClass} value={status} onChange={(e) => onFilter(() => setStatus(e.target.value))}>
              <option value="All">All</option>
              {PAYROLL_RUN_STATUSES.map((item) => <option key={item}>{item}</option>)}
            </select>
          </FormField>
          <FormField label="Search">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa1b5]" />
              <input
                className={`${inputClass} pl-9`}
                placeholder="Search by pay period..."
                value={search}
                onChange={(e) => onFilter(() => setSearch(e.target.value))}
              />
            </div>
          </FormField>
        </div>

        {visible.length === 0 ? (
          <EmptyState message="No payroll runs match your filters." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="bg-[#f6f7fb] text-left">
                  <th className={tableCell}>#</th>
                  <th className={tableCell}>Pay Period</th>
                  <th className={tableCell}>Employees</th>
                  <th className={tableCell}>Status</th>
                  <th className={tableCell}>Created On</th>
                  <th className={`${tableCell} text-center`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((run, index) => (
                  <tr key={run.id}>
                    <td className={tableCell}>{offset + index + 1}</td>
                    <td className={tableCell}>{formatPeriod(run.period)}</td>
                    <td className={tableCell}>{run.payslips.length}</td>
                    <td className={tableCell}><StatusBadge tone="green">{run.status}</StatusBadge></td>
                    <td className={tableCell}>{formatDate(run.createdOn)}</td>
                    <td className={`${tableCell} text-center`}>
                      <span className="inline-flex gap-2">
                        <button type="button" className={smallOutlineBtn} onClick={() => onView(run.id)}>View</button>
                        <button type="button" className={smallOutlineBtn} onClick={() => onPayslips(run.id)}>Payslips</button>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > PAYROLL_RUNS_PAGE_SIZE && (
          <div className="mt-4 flex items-center justify-end gap-2 text-sm">
            <button
              type="button"
              aria-label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
              className="rounded-md border border-[#d9dce6] p-1.5 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-[#6b7280]">Page {currentPage} of {pageCount}</span>
            <button
              type="button"
              aria-label="Next page"
              disabled={currentPage === pageCount}
              onClick={() => setPage(currentPage + 1)}
              className="rounded-md border border-[#d9dce6] p-1.5 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </SectionCard>

      {creating && <NewRunModal onCreate={onCreate} onClose={() => setCreating(false)} />}
    </>
  );
}

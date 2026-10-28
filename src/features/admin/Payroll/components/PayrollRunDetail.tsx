import { formatINR } from "../utils/salaryCalculator";
import { formatPeriod } from "../utils/payrollFormat";
import type { PayrollRun } from "../types/payroll.types";
import { SectionCard, StatCard, neutralBtn, smallOutlineBtn, tableCell } from "./PayrollShared";

interface PayrollRunDetailProps {
  run: PayrollRun;
  mode: "view" | "payslips";
  onBack: () => void;
  onOpenPayslip: (employeeId: string) => void;
}

export function PayrollRunDetail({ run, mode, onBack, onOpenPayslip }: PayrollRunDetailProps) {
  const gross = run.payslips.reduce((sum, item) => sum + item.grossEarnings, 0);
  const deductions = run.payslips.reduce((sum, item) => sum + item.totalDeductions, 0);
  const net = run.payslips.reduce((sum, item) => sum + item.netPay, 0);

  return (
    <>
      {mode === "view" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Employees" value={String(run.payslips.length)} />
          <StatCard label="Gross Earnings" value={formatINR(gross)} />
          <StatCard label="Total Deductions" value={formatINR(deductions)} />
          <StatCard label="Net Pay" value={formatINR(net)} />
        </div>
      )}

      <SectionCard title={mode === "view" ? `Employees - ${formatPeriod(run.period)}` : `Payslips - ${formatPeriod(run.period)}`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-[#f6f7fb] text-left">
                <th className={tableCell}>#</th>
                <th className={tableCell}>Employee</th>
                <th className={tableCell}>Department</th>
                <th className={`${tableCell} text-right`}>Gross Earnings</th>
                <th className={`${tableCell} text-right`}>Deductions</th>
                <th className={`${tableCell} text-right`}>Net Pay</th>
                <th className={`${tableCell} text-center`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {run.payslips.map((slip, index) => (
                <tr key={slip.employeeId}>
                  <td className={tableCell}>{index + 1}</td>
                  <td className={tableCell}>
                    {slip.name}
                    <span className="block text-xs text-[#6b7280]">{slip.code}</span>
                  </td>
                  <td className={tableCell}>{slip.department}</td>
                  <td className={`${tableCell} text-right`}>{formatINR(slip.grossEarnings)}</td>
                  <td className={`${tableCell} text-right`}>{formatINR(slip.totalDeductions)}</td>
                  <td className={`${tableCell} text-right font-semibold`}>{formatINR(slip.netPay)}</td>
                  <td className={`${tableCell} text-center`}>
                    <button type="button" className={smallOutlineBtn} onClick={() => onOpenPayslip(slip.employeeId)}>
                      Payslip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#fafbfe] font-bold">
                <td colSpan={3} className={tableCell}>Total</td>
                <td className={`${tableCell} text-right`}>{formatINR(gross)}</td>
                <td className={`${tableCell} text-right`}>{formatINR(deductions)}</td>
                <td className={`${tableCell} text-right`}>{formatINR(net)}</td>
                <td className="border border-[#eceef5]" />
              </tr>
            </tfoot>
          </table>
        </div>
      </SectionCard>

      <div className="flex justify-end pb-6">
        <button type="button" onClick={onBack} className={neutralBtn}>Back</button>
      </div>
    </>
  );
}

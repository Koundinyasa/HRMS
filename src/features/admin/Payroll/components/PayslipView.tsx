import { Download } from "lucide-react";
import type { Payslip, PayslipLine } from "../types/payroll.types";
import { formatDate, formatPeriod } from "../utils/payrollFormat";
import { formatINR } from "../utils/salaryCalculator";
import { SectionCard, neutralBtn, outlineBtn, tableCell } from "./PayrollShared";

interface PayslipViewProps {
  payslip: Payslip;
  period: string;
  onBack: () => void;
}

function LinesTable({ lines, totalLabel, total }: { lines: PayslipLine[]; totalLabel: string; total: number }) {
  return (
    <table className="w-full border-collapse text-sm">
      <tbody>
        {lines.map((line) => (
          <tr key={line.component}>
            <td className={tableCell}>{line.component}</td>
            <td className={`${tableCell} text-right`}>{formatINR(line.amount)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="bg-[#fafbfe] font-bold">
          <td className={tableCell}>{totalLabel}</td>
          <td className={`${tableCell} text-right`}>{formatINR(total)}</td>
        </tr>
      </tfoot>
    </table>
  );
}

export function PayslipView({ payslip, period, onBack }: PayslipViewProps) {
  const details: [string, string][] = [
    ["Pay Period", formatPeriod(period)],
    ["Date of Joining", formatDate(payslip.dateOfJoining)],
    ["Location", payslip.location],
    ["Department", payslip.department],
  ];

  return (
    <>
      <div className="flex justify-end print:hidden">
        <button type="button" onClick={() => window.print()} className={outlineBtn}>
          <Download className="h-4 w-4" />
          Download PDF
        </button>
      </div>

      <SectionCard title="Payslip Details">
        <div className="rounded-2xl border border-[#e8eaf3] bg-gradient-to-br from-[#f7f8ff] to-white p-5">
          <p className="font-bold">{payslip.name} ({payslip.code})</p>
          <p className="text-sm text-[#6b7280]">{payslip.designation}</p>
          <dl className="mt-3 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            {details.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4">
                <dt className="text-[#6b7280]">{label}</dt>
                <dd className="font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-bold">Earnings</h3>
            <LinesTable lines={payslip.earnings} totalLabel="Gross Earnings" total={payslip.grossEarnings} />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-bold">Deductions</h3>
            <LinesTable lines={payslip.deductions} totalLabel="Total Deductions" total={payslip.totalDeductions} />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#3b49d6] to-[#6a76f5] px-6 py-5 text-white shadow-[0_14px_30px_-14px_rgba(59,73,214,0.8)]">
          <span className="font-bold">Net Pay</span>
          <span className="text-2xl font-extrabold">{formatINR(payslip.netPay)}</span>
        </div>
      </SectionCard>

      <div className="flex justify-end pb-6 print:hidden">
        <button type="button" onClick={onBack} className={neutralBtn}>Back</button>
      </div>
    </>
  );
}

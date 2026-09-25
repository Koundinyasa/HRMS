import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { ClipboardCheck } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import OnboardFilters from "../components/OnboardFilters";
import OnboardReportToolbar from "../components/OnboardReportToolbar";
import OnboardReportEmptyState from "../components/OnboardReportEmptyState";

import { useOnboard } from "../hooks/useOnboard";
import { useOnboardReports } from "../hooks/useOnboardReports";

import { ONBOARD_REPORT_MENU } from "../constants/onboard.constants";

export default function OnboardReportsPage() {
  const navigate = useNavigate();

  const { reportCategory = "month-wise-summary", domain } = useParams<{
    reportCategory?: string;
    domain?: string;
  }>();

  const basePath = domain
    ? `/${domain}/admin/insights/onboard`
    : "/insights/onboard";

  const { filters, updateFilter, resetFilters } = useOnboard();

  const {
    month,
    setMonth,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    rows,
  } = useOnboardReports();

  const isDateWise = reportCategory.startsWith("date-wise");

  const label =
    ONBOARD_REPORT_MENU.flatMap((column) => column.items).find(
      (item) => item.value === reportCategory,
    )?.label ?? reportCategory;

  const handleFilterChange = (
    key: "search" | "branch" | "designation" | "employeeStatus",
    value: string,
  ) => {
    updateFilter(key, value);
  };

  const handleBack = () => {
    navigate(basePath);
  };

  /* ==========================================================
     REAL PDF DOWNLOAD (no browser print dialog)
  ========================================================== */
  const handleExportPdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text(label, 14, 16);

    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(
      isDateWise ? "" : `Month: ${month || "Sep/2026"}`,
      14,
      22,
    );

    const tableBody =
      rows.length > 0
        ? rows.map((row, index) => {
            const r = row as Record<string, unknown>;
            return [
              String(index + 1),
              String(r.employeeId ?? "-"),
              String(r.employeeName ?? "-"),
              label,
            ];
          })
        : [["-", "-", "-", "No data found"]];

    autoTable(doc, {
      startY: 28,
      head: [["Sl.No.", "Employee ID", "Employee Name", "Report"]],
      body: tableBody,
      headStyles: {
        fillColor: [217, 123, 63],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [253, 241, 233],
      },
    });

    const fileName = `${label.replace(/\s+/g, "_")}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="w-full bg-[#F5F6F8] p-4">
      {/* Title pill */}
      <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-[#F3D9C9] bg-[#FDF1E9] px-4 py-2.5 shadow-sm">
        <ClipboardCheck size={16} className="text-[#D97B3F]" />
        <span className="text-[13px] font-semibold text-[#3F3F46]">
          Onboard Report
        </span>
      </div>

      <div className="overflow-hidden rounded-md border border-slate-200 bg-[#f8f9fc] shadow-sm">
        <OnboardReportToolbar
          label={label}
          isDateWise={isDateWise}
          month={month}
          fromDate={fromDate}
          toDate={toDate}
          onMonthChange={setMonth}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onBack={handleBack}
          onExportPdf={handleExportPdf}
        />

        <OnboardFilters
          filters={filters}
          onSearchChange={(value) => updateFilter("search", value)}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
        />

        {rows.length === 0 ? (
          <OnboardReportEmptyState />
        ) : (
          <div className="overflow-x-auto bg-white">
            <table className="w-full min-w-[700px] border-collapse">
              <thead>
                <tr className="bg-[#d7ebf7]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                    Sl.No.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                    Employee ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                    Employee Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700">
                    Report
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-100 bg-white"
                  >
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {String(
                        (row as Record<string, unknown>).employeeId ?? "-",
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {String(
                        (row as Record<string, unknown>).employeeName ?? "-",
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {label}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
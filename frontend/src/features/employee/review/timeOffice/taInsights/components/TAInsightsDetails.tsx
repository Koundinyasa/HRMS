import React from "react";
import { FileSpreadsheet, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import TAInsightsTable from "./TAInsightsTable";
import type {
  TAInsightEmployee,
  TAInsightCount,
} from "../types/taInsightsTypes";

interface TAInsightsDetailsProps {
  selectedCard: TAInsightCount | null;
  employees: TAInsightEmployee[];
  loading: boolean;
  onClose: () => void;
}

const TAInsightsDetails: React.FC<TAInsightsDetailsProps> = ({
  selectedCard,
  employees,
  loading,
  onClose,
}) => {
  const exportRows = () => {
    const header = [
      "Emp ID",
      "Emp Name",
      "Date",
      "First Punch",
      "Last Punch",
      "Work Hours",
      "Attendance Status",
    ];
    const rows = employees.map((employee) => [
      employee.empId,
      employee.empName,
      employee.date,
      employee.firstPunch,
      employee.lastPunch,
      employee.workHours,
      employee.attendanceStatus,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedCard?.title ?? "ta-insights"}-details.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!selectedCard) {
    return null;
  }

  return (
    <section className="mt-5 rounded-[20px] bg-[#d9f6ff] p-4 sm:p-7 font-[Urbanist]">
      <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-center font-[Urbanist]">
        <h2 className="text-lg font-semibold text-slate-800 sm:text-[22px] font-[Urbanist]">
          {selectedCard.title} Details
        </h2>

        <div className="flex items-center gap-2 sm:ml-auto font-[Urbanist]">
          <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-green-600 font-[Urbanist]"
          title="Export to Excel"
          onClick={exportRows}
        >
          <FileSpreadsheet size={20} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            title="Close details"
            aria-label="Close details"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 font-[Urbanist]"
          >
            <X size={20} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg bg-white p-10 text-center text-slate-500 font-[Urbanist]">
          Loading employee details...
        </div>
      ) : (
        <TAInsightsTable employees={employees} />
      )}
    </section>
  );
};

export default TAInsightsDetails;
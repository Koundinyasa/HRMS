import { useState } from "react";
import DataTable from "../components/DataTable";
import type { DataTableColumn } from "../types/reportUI.types";

interface LeaveRow {
  empId: string;
  name: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  status: "Approved" | "Pending" | "Rejected";
}

const MOCK_ROWS: LeaveRow[] = [
  {
    empId: "294794",
    name: "Sathwika Achugatla",
    leaveType: "Sick Leave",
    fromDate: "2026-08-26",
    toDate: "2026-08-26",
    status: "Approved",
  },
  {
    empId: "KTS164212",
    name: "Sireesha Yarramaneni",
    leaveType: "Sick Leave",
    fromDate: "2026-08-27",
    toDate: "2026-08-27",
    status: "Approved",
  },
  {
    empId: "294722",
    name: "Varalaxmi Gumudala",
    leaveType: "Restricted Holiday",
    fromDate: "2026-06-25",
    toDate: "2026-06-25",
    status: "Pending",
  },
];

const columns: DataTableColumn<LeaveRow>[] = [
  {
    key: "empId",
    label: "Emp. ID",
    width: "160px",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "leaveType",
    label: "Leave Type",
  },
  {
    key: "fromDate",
    label: "From Date",
  },
  {
    key: "toDate",
    label: "To Date",
  },
  {
    key: "status",
    label: "Status",
    render: (row) => {
      const styles: Record<LeaveRow["status"], string> = {
        Approved: "bg-green-100 text-green-700",
        Pending: "bg-amber-100 text-amber-700",
        Rejected: "bg-red-100 text-red-700",
      };

      return (
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[row.status]}`}
        >
          {row.status}
        </span>
      );
    },
  },
];

export default function LeaveReportPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");

  const filteredRows = MOCK_ROWS.filter((row) => {
    return statusFilter === "" || row.status === statusFilter;
  });

  return (
    <div className="rounded-md bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">
          Leave Report
        </h1>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All Status</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filteredRows}
      />
    </div>
  );
}
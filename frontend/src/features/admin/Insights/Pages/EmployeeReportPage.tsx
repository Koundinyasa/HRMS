import DataTable from "../components/DataTable";
import type { DataTableColumn } from "../types/reportUI.types";

interface EmployeeRow {
  empId: string;
  name: string;
  department: string;
  designation: string;
  dateOfJoining: string;
  status: "Active" | "Inactive";
}

const MOCK_ROWS: EmployeeRow[] = [
  {
    empId: "294794",
    name: "Sathwika Achugata",
    department: "Engineering",
    designation: "Software Engineer",
    dateOfJoining: "2024-06-12",
    status: "Active",
  },
  {
    empId: "294722",
    name: "Varalaxmi Gumudala",
    department: "HR",
    designation: "HR Executive",
    dateOfJoining: "2023-11-02",
    status: "Active",
  },
  {
    empId: "284513",
    name: "Nikhitha Narala",
    department: "Finance",
    designation: "Accountant",
    dateOfJoining: "2022-04-18",
    status: "Inactive",
  },
];

const columns: DataTableColumn<EmployeeRow>[] = [
  {
    key: "empId",
    label: "Emp. ID",
    width: "110px",
  },
  {
    key: "name",
    label: "Employee Name",
  },
  {
    key: "department",
    label: "Department",
  },
  {
    key: "designation",
    label: "Designation",
  },
  {
    key: "dateOfJoining",
    label: "Date Of Joining",
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <span
        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
          row.status === "Active"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {row.status}
      </span>
    ),
  },
];

export default function EmployeeReportPage() {
  return (
    <div className="rounded-md bg-white p-4 shadow-sm">
      <h1 className="mb-4 text-xl font-semibold text-gray-800">
        Employee Report
      </h1>

      <DataTable
        columns={columns}
        data={MOCK_ROWS}
      />
    </div>
  );
}
// Report-columns.constants.ts

export interface ReportColumn {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
}

export const COMMON_REPORT_COLUMNS = {
  employeeId: {
    key: "employeeId",
    label: "Employee ID",
    sortable: true,
    align: "left",
  },

  employeeName: {
    key: "employeeName",
    label: "Employee Name",
    sortable: true,
    align: "left",
  },

  department: {
    key: "department",
    label: "Department",
    sortable: true,
    align: "left",
  },

  designation: {
    key: "designation",
    label: "Designation",
    sortable: true,
    align: "left",
  },

  branch: {
    key: "branch",
    label: "Branch",
    sortable: true,
    align: "left",
  },

  date: {
    key: "date",
    label: "Date",
    sortable: true,
    align: "center",
  },

  month: {
    key: "month",
    label: "Month",
    sortable: true,
    align: "center",
  },
} as const;






export interface EmployeeReportMenuItem {
  label: string;
  path: string;
}

export interface EmployeeReportMenuColumn {
  title: string;
  items: EmployeeReportMenuItem[];
}

export const EMPLOYEE_REPORT_MENU: EmployeeReportMenuColumn[] = [
  {
    title: "Employee Report",
    items: [
      { label: "Employee Custom Report", path: "employee-custom-report" },
      { label: "Employee ID Card", path: "employee-id-card" },
      { label: "Employee Profile Report", path: "employee-profile-report" },
      { label: "Employee DOB Report", path: "employee-dob-report" },
      { label: "Employee DOJ Report", path: "employee-doj-report" },
      { label: "Employee DOL Report", path: "employee-dol-report" },
      { label: "Resignation Report", path: "resignation-report" },
    ],
  },
  {
    title: "Login Report",
    items: [{ label: "Login Not Disabled", path: "login-not-disabled-report" }],
  },
  {
    title: "Reporting Authority",
    items: [{ label: "Reporting Authority", path: "reporting-authority-report" }],
  },
  {
    title: "Classification Report",
    items: [{ label: "Classification Report", path: "classification-report" }],
  },
  {
    title: "Employee HR Category Report",
    items: [{ label: "Employee HR Category Report", path: "employee-hr-category-report" }],
  },
];


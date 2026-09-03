import type { SubNavItem } from "../../components/sidebar.types";
 
export const ENROLLMENT_SUB_NAV: SubNavItem[] = [
  { label: "Background Verification", path: "background-verification" },
  { label: "Pre-Enrollment", path: "pre-Enrollment" },
  { label: "Employee Details", path: "EmployeeDetails" },
  { label: "Bulk Update", path: "bulk-update" },
  {
    label: "Separation",
    path: "separation",
    children: [
      { label: "Exit Module", path: "exit-module" },
      { label: "Gratuity", path: "gratuity" },
      { label: "Full and Final Settlement", path: "full-and-final-settlements" },
    ],
  },

  { label: "Employee Force Approval", path: "employeeforceapproval" },
];
 
// leaveReport.constants.ts
import type { MonthOption } from "../types/filters";

export const generateMonthOptions = (monthsBack: number = 8): MonthOption[] => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const now = new Date();
  const options: MonthOption[] = [];

  for (let i = 0; i < monthsBack; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = `${months[d.getMonth()]}/${d.getFullYear()}`;
    options.push({ label, value: label });
  }
  return options;
};

export interface FilterDropdownOption {
  value: string;
  label: string;
}

export interface FilterDropdownConfig {
  key: "query" | "branch" | "salaryStructure" | "leave" | "attendance" | "designation" | "empStatus";
  label: string;
  /** "search" renders a free-text box (Query). "checkbox" renders a checkbox list. */
  type: "search" | "checkbox";
  /**
   * Bold header row above the option list that also acts as "select
   * all / clear all" for this dropdown (used by Branch, Salary Structure,
   * Designation).
   */
  showSelectAllHeader?: boolean;
  /**
   * Plain (non-selectable) title row above the option list — used by
   * Emp Status, which has a heading but the heading itself isn't a filter
   * value.
   */
  showHeaderLabel?: boolean;
  options?: FilterDropdownOption[];
}

export const FILTER_DROPDOWNS: FilterDropdownConfig[] = [
  {
    key: "query",
    label: "Query",
    type: "search",
  },
  {
    key: "branch",
    label: "Branch",
    type: "checkbox",
    showSelectAllHeader: true,
    options: [
      { value: "koundinyasa-technology-services", label: "Koundinyasa Technology Services Pvt. Ltd." },
    ],
  },
  {
    key: "salaryStructure",
    label: "Salary Structure",
    type: "checkbox",
    showSelectAllHeader: true,
    options: [
      { value: "ctc-salary-structure", label: "CTC Salary Structure" },
      { value: "new-salary-structure", label: "New Salary Structure" },
      { value: "salary-structure", label: "Salary structure" },
      { value: "test-structure", label: "Test Structure" },
      { value: "test-structure-2", label: "Test Structure 2" },
      { value: "test3", label: "TEST3" },
    ],
  },
  {
    key: "leave",
    label: "Leave",
    type: "checkbox",
    options: [
      { value: "leave", label: "Leave" },
      { value: "employee-leave-policy", label: "Employee Leave Policy" },
      { value: "intern-leave-policy", label: "Intern Leave Policy" },
    ],
  },
  {
    key: "attendance",
    label: "Attendance",
    type: "checkbox",
    options: [
      { value: "attendance", label: "Attendance" },
      { value: "daily", label: "Daily" },
    ],
  },
  {
    key: "designation",
    label: "Designation",
    type: "checkbox",
    showSelectAllHeader: true,
    options: [
      { value: "associate-software-engineer", label: "ASSOCIATE SOFTWARE ENGINEER" },
      { value: "bussiness-development-executive", label: "BUSSINESS DEVELOPMENT EXECUTIVE" },
      { value: "bussiness-development-manager", label: "BUSSINESS DEVELOPMENT MANAGER" },
      { value: "cloud-devops-engineer", label: "Cloud DevOps Engineer" },
      { value: "data-analyst", label: "Data Analyst" },
      { value: "devops-engineer", label: "Devops Engineer" },
      { value: "flutter-developer", label: "Flutter Developer" },
      { value: "hr-executive", label: "HR EXECUTIVE" },
      { value: "hr-manager", label: "HR MANAGER" },
      { value: "hr-recruiter", label: "HR RECRUITER" },
      { value: "office-boy", label: "OFFICE BOY" },
      { value: "project-lead", label: "PROJECT LEAD" },
      { value: "project-manager", label: "PROJECT MANAGER" },
      { value: "quality-analyst", label: "Quality Analyst" },
      { value: "react-developer", label: "React Developer" },
    ],
  },
  {
    key: "empStatus",
    label: "Emp Status",
    type: "checkbox",
    showHeaderLabel: true,
    options: [
      { value: "current-employees", label: "Current Employees" },
      { value: "left-employees", label: "Left Employees" },
    ],
  },
];

export const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

export const DEFAULT_ROWS_PER_PAGE = 10;
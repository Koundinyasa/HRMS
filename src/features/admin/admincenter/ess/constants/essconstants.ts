
export const ESS_TABS = [
  "Employee Group",
  "Module Settings",
  "Workflow",
  "Poll",
  "Circular",
  "Notification",
  "Help Desk",
];

/* ---------------------------------------------------------------- *
 * Employee Group
 * ---------------------------------------------------------------- */

export const EMPLOYEE_GROUP_OPTIONS = [
  "All Employees",
  "Department",
  "Designation",
  "Location",
];

export const EMPLOYEE_GROUP_STATUS_OPTIONS = [
  "Active",
  "Inactive",
];

export const MOCK_EMPLOYEE_GROUPS = [
  {
    id: 1,
    name: "All Employees",
    description: "All employees",
    status: "Active",
  },
  {
    id: 2,
    name: "IT Department",
    description: "Employees belonging to IT department",
    status: "Active",
  },
  {
    id: 3,
    name: "HR Department",
    description: "Employees belonging to HR department",
    status: "Active",
  },
];

/* ---------------------------------------------------------------- *
 * Module Settings
 * ---------------------------------------------------------------- */

export const MODULE_SETTINGS_OPTIONS = [
  "Attendance",
  "Leave",
  "Weekly Off",
  "Holiday",
  "Profile",
  "Notification",
  "Poll",
  "Circular",
  "Help Desk",
];

export const MOCK_MODULE_SETTINGS = [
  {
    id: 1,
    moduleName: "Attendance",
    enabled: true,
  },
  {
    id: 2,
    moduleName: "Leave",
    enabled: true,
  },
  {
    id: 3,
    moduleName: "Weekly Off",
    enabled: true,
  },
  {
    id: 4,
    moduleName: "Holiday",
    enabled: true,
  },
  {
    id: 5,
    moduleName: "Profile",
    enabled: true,
  },
  {
    id: 6,
    moduleName: "Notification",
    enabled: true,
  },
  {
    id: 7,
    moduleName: "Poll",
    enabled: true,
  },
  {
    id: 8,
    moduleName: "Circular",
    enabled: true,
  },
  {
    id: 9,
    moduleName: "Help Desk",
    enabled: true,
  },
];

/* ---------------------------------------------------------------- *
 * Workflow
 * ---------------------------------------------------------------- */

export const WORKFLOW_MODULE_OPTIONS = [
  "Leave",
  "Attendance",
  "Weekly Off",
  "Regularization",
  "Help Desk",
];

export const WORKFLOW_STATUS_OPTIONS = [
  "Active",
  "Inactive",
];

export const MOCK_WORKFLOWS = [
  {
    id: "WF001",
    name: "Leave Approval",
    module: "Leave",
    status: "Active",
  },
  {
    id: "WF002",
    name: "Attendance Approval",
    module: "Attendance",
    status: "Active",
  },
  {
    id: "WF003",
    name: "Weekly Off Approval",
    module: "Weekly Off",
    status: "Active",
  },
];

/* ---------------------------------------------------------------- *
 * Poll
 * ---------------------------------------------------------------- */

export const POLL_TARGET_AUDIENCE_OPTIONS = [
  "All Employees",
  "Department",
  "Designation",
  "Location",
];

export const POLL_QUESTION_TYPE_OPTIONS = [
  "Yes / No",
  "Single Choice",
  "Multiple Choice",
];

export const POLL_STATUS_OPTIONS = [
  "Draft",
  "Published",
  "Closed",
];

export const MOCK_POLLS = [
  {
    id: 1,
    question: "Are you satisfied with the current work environment?",
    startDate: "",
    endDate: "",
    targetAudience: "All Employees",
    questionType: "Yes / No",
    status: "Draft",
  },
  {
    id: 2,
    question: "Which benefit do you prefer the most?",
    startDate: "",
    endDate: "",
    targetAudience: "All Employees",
    questionType: "Single Choice",
    status: "Published",
  },
];

/* ---------------------------------------------------------------- *
 * Circular
 * ---------------------------------------------------------------- */

export const CIRCULAR_TARGET_AUDIENCE_OPTIONS = [
  "All Employees",
  "Department",
  "Designation",
  "Location",
];

export const CIRCULAR_STATUS_OPTIONS = [
  "Draft",
  "Published",
  "Expired",
];

export const MOCK_CIRCULARS = [
  {
    id: 1,
    title: "Company Holiday Circular",
    description: "Holiday information for all employees.",
    date: "",
    targetAudience: "All Employees",
    status: "Published",
  },
  {
    id: 2,
    title: "Important Company Update",
    description: "Important information for employees.",
    date: "",
    targetAudience: "All Employees",
    status: "Draft",
  },
];

/* ---------------------------------------------------------------- *
 * Notification
 * ---------------------------------------------------------------- */

export const NOTIFICATION_TYPE_OPTIONS = [
  "Current Notification",
  "Previous Notification",
];

export const NOTIFICATION_TARGET_AUDIENCE_OPTIONS = [
  "All Employees",
  "Department",
  "Designation",
  "Location",
];

export const NOTIFICATION_STATUS_OPTIONS = [
  "Draft",
  "Published",
  "Expired",
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    title: "Important Notification",
    description: "Important information for employees.",
    date: "",
    targetAudience: "All Employees",
    status: "Published",
  },
  {
    id: 2,
    title: "Upcoming Event",
    description: "Information about the upcoming company event.",
    date: "",
    targetAudience: "All Employees",
    status: "Draft",
  },
];

/* ---------------------------------------------------------------- *
 * Help Desk
 * ---------------------------------------------------------------- */

export const HELPDESK_CATEGORY_OPTIONS = [
  "IT Support",
  "HR",
  "Payroll",
  "Attendance",
  "Leave",
  "General",
];

export const HELPDESK_PRIORITY_OPTIONS = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

export const HELPDESK_STATUS_OPTIONS = [
  "Pending",
  "In Progress",
  "Completed",
  "Closed",
];

export const MOCK_HELPDESK_TICKETS = [
  {
    id: 1,
    subject: "Unable to login",
    category: "IT Support",
    priority: "High",
    status: "Pending",
  },
  {
    id: 2,
    subject: "Leave balance issue",
    category: "Leave",
    priority: "Medium",
    status: "In Progress",
  },
];

/* ---------------------------------------------------------------- *
 * Common Target Audience
 * ---------------------------------------------------------------- */

export const TARGET_AUDIENCE_OPTIONS = [
  "All Employees",
  "Department",
  "Designation",
  "Location",
];

/* ---------------------------------------------------------------- *
 * Common Status
 * ---------------------------------------------------------------- */

export const STATUS_OPTIONS = [
  "Active",
  "Inactive",
];

/* ---------------------------------------------------------------- *
 * Pagination
 * ---------------------------------------------------------------- */

export const DEFAULT_ROWS_PER_PAGE = 10;

export const ROWS_PER_PAGE_OPTIONS = [
  10,
  25,
  50,
];

export const PAGINATION_VISIBLE_PAGES = [
  1,
  2,
  3,
  4,
  5,
];
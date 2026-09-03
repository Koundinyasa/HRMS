// userManagementConstants.ts
// Static option lists and mock data backing the User Management module.
// The mock records below are served through api/userManagementApi.ts —
// swap that file's implementations for real requests when the backend is ready.

import type { CreatedEmployee, PendingEmployee, EmployeeSubTab } from "../types/employee.types";
import type { UserRow } from "../types/user.types";
import type { RoleRow, RoleMasterTab } from "../types/role.types";
import type { PermissionKey, PermissionRow, RoleAccessConfig } from "../types/role-access.types";

/* ---------------------------------------------------------------- *
 * Tabs / navigation
 * ---------------------------------------------------------------- */

export const ROLE_MASTER_TABS: RoleMasterTab[] = [
  "Roles",
  "Role Access Settings",
  "Employee",
  "User",
];

export const EMPLOYEE_SUB_TABS: EmployeeSubTab[] = [
  "Employee Created",
  "Pending Employee",
  "Updated Email ID",
  "InActive Employee's",
];

export const ROLE_LIST_MODULES: RoleRow["module"][] = ["ESS", "Payroll"];

export const ROLES_ACCESS_SIDEBAR_TABS = [
  "Request",
  "Profile",
  "Misc",
  "Report",
  "Review",
  "Dashboard",
];

/* ---------------------------------------------------------------- *
 * Employee filter bar
 * ---------------------------------------------------------------- */

export const EMPLOYEE_FILTER_DROPDOWNS = [
  { label: "Query" },
  { label: "Branch" },
  { label: "Salary Structure" },
  { label: "Leave" },
  { label: "Attendance" },
  { label: "Designation" },
  { label: "Emp Status" },
];

/* ---------------------------------------------------------------- *
 * Pagination defaults
 * ---------------------------------------------------------------- */

export const DEFAULT_ROWS_PER_PAGE = 10;
export const ROWS_PER_PAGE_OPTIONS = [10, 25, 50];
export const PAGINATION_VISIBLE_PAGES = [1, 2, 3, 4, 5];

/* ---------------------------------------------------------------- *
 * Role permissions grid
 * ---------------------------------------------------------------- */

export const PERMISSION_KEYS: PermissionKey[] = [
  "create",
  "read",
  "update",
  "delete",
  "audit",
  "selectAll",
];

export const PAGE_HEADERS = [
  "Pages",
  "Create",
  "Read",
  "Update",
  "Delete",
  "Audit",
  "Select All",
];

export const ROLE_LIST = [
  "ESS (ESS)",
  "HR Executive (Pay Roll)",
  "Support (Pay Roll)",
];

export const PERMISSION_COLORS: Record<PermissionKey, string> = {
  create: "text-blue-600",
  read: "text-orange-500",
  update: "text-violet-500",
  delete: "text-red-500",
  audit: "text-gray-600",
  selectAll: "text-green-600",
};

// small helper so we don't repeat create/read/update/delete/audit/selectAll every time
let idCounter = 0;
const row = (page: string, checked: boolean): PermissionRow => ({
  id: ++idCounter,
  page,
  create: checked,
  read: checked,
  update: checked,
  delete: checked,
  audit: checked,
  selectAll: checked,
});

export const ROLE_ACCESS_DATA: Record<string, RoleAccessConfig> = {
  "ESS (ESS)": {
    modules: ["Request", "Profile", "Misc", "Report", "Review", "Dashboard"],
    data: {
      Request: [
        row("Manual Punch Request", true),
        row("Punch Pending", true),
        row("Request Face Template", true),
        row("Monthly Overview", false),
        row("Request Weekly Off", true),
        row("Pending Weekly Off", true),
        row("Leave Summary", true),
        row("Leave History", true),
        row("Holiday List", true),
        row("Apply Leave Pending", true),
        row("Leave Encash", true),
        row("Leave Encash Pending", true),
      ],
      Profile: [],
      Misc: [],
      Report: [],
      Review: [],
      Dashboard: [],
    },
  },

  "HR Executive (Pay Roll)": {
    modules: [
      "Config",
      "Company Settings",
      "Groupofcompany",
      "Onboard",
      "T&A",
      "Salary",
      "Reports",
      "Approval",
      "Dashboard",
    ],
    data: {
      Config: [
        row("Company", false),
        row("Pf", false),
        row("Esi", false),
        row("Pt", false),
        row("Lwf", false),
        row("Establishment Details", false),
        row("Document", false),
        row("Contact Details", false),
        row("Subscription Details", false),
        row("Payroll", false),
        row("Reminder", false),
        row("Email", false),
        row("Tenant", false),
        row("Classification Summary", false),
        row("Branch", false),
        row("Additional Classification", false),
        row("Designation", false),
        row("Banks", false),
        row("Classifications Import", false),
        row("Roles", false),
        row("Roles Access Settings", false),
        row("Employee", false),
        row("User", false),
        row("Assign Company To User", false),
        row("Workflow", false),
        row("Poll", true),
        row("Poll Description", true),
        row("Feeds", true),
        row("Wall Of Fame", true),
        row("New Company", true),
        row("Employee Group", true),
        row("Module Settings", false),
        row("Circular", true),
        row("Policy", true),
        row("Current Notification", true),
        row("Previous Notification", true),
        row("Daily Thought Import", true),
        row("Current Flashnews", true),
        row("Create Help Desk", true),
        row("Pending", true),
        row("Completed", true),
      ],
      "Company Settings": [],
      Groupofcompany: [],
      Onboard: [],
      "T&A": [],
      Salary: [],
      Reports: [],
      Approval: [],
      Dashboard: [],
    },
  },

  "Support (Pay Roll)": {
    modules: [
      "Config",
      "Company Settings",
      "Groupofcompany",
      "Onboard",
      "T&A",
      "Salary",
      "Reports",
      "Approval",
      "Dashboard",
    ],
    data: {
      Config: [
        row("Company", true),
        row("Pf", true),
        row("Esi", true),
        row("Pt", false),
        row("Lwf", true),
        row("Establishment Details", true),
        row("Document", true),
        row("Contact Details", true),
        row("Subscription Details", true),
        row("Payroll", true),
        row("Reminder", true),
        row("Email", true),
        row("Tenant", true),
        row("Classification Summary", true),
        row("Wall Of Fame", true),
        row("New Company", true),
        row("Employee Group", true),
        row("Circular", true),
        row("Policy", true),
        row("Current Notification", true),
        row("Previous Notification", true),
        row("Daily Thought Import", true),
        row("Current Flashnews", true),
        row("Create Help Desk", true),
        row("Pending", true),
        row("Completed", true),
      ],
      "Company Settings": [],
      Groupofcompany: [],
      Onboard: [],
      "T&A": [],
      Salary: [],
      Reports: [],
      Approval: [],
      Dashboard: [],
    },
  },
};

/* ---------------------------------------------------------------- *
 * Roles (Roles tab)
 * ---------------------------------------------------------------- */

export const MOCK_ROLES: RoleRow[] = [
  { id: 1, roleName: "ESS", module: "ESS" },
  { id: 2, roleName: "HR Executive", module: "Payroll" },
  { id: 3, roleName: "Support", module: "Payroll" },
];

/* ---------------------------------------------------------------- *
 * Users (User tab)
 * ---------------------------------------------------------------- */

export const MOCK_USERS: UserRow[] = [
  {
    id: 1,
    userName: "Super Admin",
    email: "hr@koundinyasatech.com",
    mobile: "9542818517",
    active: true,
    payroll: "Super Admin",
  },
  {
    id: 2,
    userName: "Support",
    email: "payroll.hyderabad@relyonsoft.com",
    mobile: "9160877713",
    active: true,
    payroll: "Support",
  },
];

export const PAYROLL_ROLE_OPTIONS = ["Super Admin", "Support", "HR", "Manager"];

export const USER_TOTAL_RECORDS = 85;
export const USER_TOTAL_PAGES = 9;

/* ---------------------------------------------------------------- *
 * Employees (Employee tab)
 * ---------------------------------------------------------------- */

export const CREATED_EMPLOYEES: CreatedEmployee[] = [
  {
    id: 294641,
    name: "Ajay Jetty",
    mobile: "9603090005",
    email: "ajay.j@koundinyasatech.com",
    essRole: "ESS",
    payrollRole: "—",
    loginDone: true,
    active: true,
  },
  {
    id: 294664,
    name: "Ajaykumar Akkapalli",
    mobile: "9581945447",
    email: "ajaykumar.a@koundinyasat...",
    essRole: "ESS",
    payrollRole: "—",
    loginDone: true,
    active: true,
  },
  {
    id: 294667,
    name: "Akhil Reddy",
    mobile: "8688076969",
    email: "akhil.b@koundinyasatech.com",
    essRole: "ESS",
    payrollRole: "—",
    loginDone: true,
    active: true,
  },
  {
    id: 294658,
    name: "Anuli Umesh Wandkar",
    mobile: "9850081160",
    email: "anuli.w@koundinyasatech.com",
    essRole: "ESS",
    payrollRole: "—",
    loginDone: true,
    active: true,
  },
];

export const PENDING_EMPLOYEES: PendingEmployee[] = [
  {
    id: 294697,
    name: "Jasti Easwar Santhosh Prame",
    mobile: "7993624329",
    email: "",
    emailVerified: "valid",
  },
  {
    id: 294701,
    name: "Anjiraju Manthena",
    mobile: "7989435005",
    email: "",
    emailVerified: "valid",
  },
  {
    id: 294648,
    name: "Jayasri Dhana Nagasai Siddani",
    mobile: "9492226166",
    email: "",
    emailVerified: "valid",
  },
  {
    id: 294693,
    name: "Divya Lakkireddy",
    mobile: "9347043694",
    email: "divya.l@koundinyasatech.com",
    emailVerified: "valid",
  },
  {
    id: 344911,
    name: "Yogesh Kumar K",
    mobile: "9347043694",
    email: "",
    emailVerified: "not_verified",
  },
];

export const INACTIVE_EMPLOYEES: CreatedEmployee[] = [
  {
    id: 294661,
    name: "Akshitha Naidu Yetukooru",
    mobile: "9951539876",
    email: "akshitha.y@koundinyasatech.com",
    essRole: "ESS",
    payrollRole: "—",
    loginDone: true,
    active: true,
  },
  {
    id: 264631,
    name: "Anusha Mavellapalli",
    mobile: "8522918639",
    email: "anusha.m@koundinyasatech.com",
    essRole: "ESS",
    payrollRole: "—",
    loginDone: false,
    active: false,
  },
];

export const EMPLOYEE_TOTAL_RECORDS = 85;
export const EMPLOYEE_TOTAL_PAGES = 9;

/* ---------------------------------------------------------------- *
 * Legacy — carried over from the old data/mockRoles.ts.
 * Not wired into any component (it wasn't in the original code
 * either); kept here in case a future "single role" grid needs it.
 * ---------------------------------------------------------------- */

export const LEGACY_MOCK_ROLE_PERMISSIONS: PermissionRow[] = [
  { id: 1, page: "Manual Punch Request", create: true, read: true, update: true, delete: true, audit: true, selectAll: true },
  { id: 2, page: "Punch Pending", create: true, read: true, update: true, delete: true, audit: true, selectAll: true },
  { id: 3, page: "Request Face Template", create: true, read: true, update: true, delete: true, audit: true, selectAll: true },
  { id: 4, page: "Monthly Overview", create: false, read: false, update: false, delete: false, audit: false, selectAll: false },
  { id: 5, page: "Request Weekly Off", create: true, read: true, update: true, delete: true, audit: true, selectAll: true },
  { id: 6, page: "Pending Weekly Off", create: true, read: true, update: true, delete: true, audit: true, selectAll: true },
  { id: 7, page: "Leave Summary", create: true, read: true, update: true, delete: true, audit: true, selectAll: true },
  { id: 8, page: "Leave History", create: true, read: true, update: true, delete: true, audit: true, selectAll: true },
  { id: 9, page: "Holiday List", create: true, read: true, update: true, delete: true, audit: true, selectAll: true },
  { id: 10, page: "Apply Leave Pending", create: true, read: true, update: true, delete: true, audit: true, selectAll: true },
  { id: 11, page: "Leave Encash", create: true, read: true, update: true, delete: true, audit: true, selectAll: true },
  { id: 12, page: "Leave Encash Pending", create: true, read: true, update: true, delete: true, audit: true, selectAll: true },
];

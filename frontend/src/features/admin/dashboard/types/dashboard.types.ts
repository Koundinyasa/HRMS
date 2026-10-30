import type { EmployeeFilterType } from "../../Enrollment/EmployeeDetails/api/employeedetailsApi";
 
export interface WelcomeInfo {
  fullName: string;
  shortName: string;
  code: string;
  profilePhoto: string | null;
  companyId: number;
  companyCode: string;
  companyName: string;
  branchName: string;
  branchCode: string;
  routingUrl: string;
  deptId: number;
  department: string;
  roleId: number;
  defaultRole: string;
  designationId: number;
  designation: string;
  welcomeMessage: string;
  lastLoginDateTime: string | null;
  lastLogoutDateTime: string | null;
  loginFailedCount: number;
  isAccountLocked: boolean;
  accountLockedTime: string | null;
  employeeId: string;
  email: string;
  mobileNo: string | null;
}
 
export interface MenuInfo {
  menuId: number;
  parentId: number | null;
  menuName: string;
  routeUrl: string;
  displayOrder: number;
}
 
export interface KpiSummary {
  totalEmployees: number;
  joinedEmployee: number;
  confirmationPending: number;
  leftEmployee: number;
  openPositions: number;
}
 
export interface DepartmentCount {
  department: string;
  count: number;
}
 
export interface GenderCount {
  gender: string;
  count: number;
  percentage: number;
}
 
export interface AgeGroupCount {
  ageBetween: string;
  female: number;
  male: number;
}
 
// ── Root API response ─────────────────────────────────────────
export interface DashboardSummary {
  welcome: WelcomeInfo;
  menus: MenuInfo[];
  summary: KpiSummary;
  departmentWiseCount: DepartmentCount[];
  genderWiseCount: GenderCount[];
  ageGroupWiseCount: AgeGroupCount[];
  upcomingEvents: UpcomingEvent[];
  team: TeamMember[];
  avgTenure: string;
  AgeRangeDatum: AgeRangeDatum[];
  DeptDatum: DeptDatum[];
  TenureDatum: TenureDatum[];
  classifications: ClassificationMeta[];
  StatCardConfig: StatCardConfig[];
  ActivityItem: ActivityItem[];
}
 
// ── Stat card config ──────────────────────────────────────────
export interface StatCardConfig {
  key: string;
  label: string;
  icon: string;
  iconBg: string;
  format?: "currency" | "number";
  filterType?: EmployeeFilterType;
}
 
export interface ActivityItem {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  scheduledFor: string;
  done?: boolean;
}
 
export interface UpcomingEvent {
  fullName: string;
  code: string;
  eventName: "Birthday" | "Work Anniversary";
  eventDate: string;
}
 
export interface TeamMember {
  leadName: string;
  profilePhoto: string | null;
  team: string;
  badgeColor: string;
  email: string;
}
 
// ---------- Age Range (grouped bars) ----------
export interface AgeRangeDatum {
  range: string;
  men: number;
  women: number;
}
 
// ---------- Department Distribution (donut) ----------
export interface DeptDatum {
  name: string;
  value: number;
  color: string;
}
 
// ---------- Tenure Distribution (single bar) ----------
export interface TenureDatum {
  label: string;
  count: number;
}
 
export interface ClassificationMeta {
  id: number;
  code: string;
  label: string;
}
 
// ── Classification Wise ───────────────────────────────────────
export interface ClassificationCountItem {
  label: string;
  employeeCount: number;
  colorHex: string;
  colorHexLight: string;
}
 
export interface ClassificationWiseCountDto {
  classificationId: number;
  data: ClassificationCountItem[];
}
 
export interface StatsCardProps {
  config: StatCardConfig;
  value: number | null;
  change: number;
  onClick?: () => void;
}
 
// ── Team Employees (new APIs) ─────────────────────────────────
export interface TeamLead {
  LeadEmployeeID: string;
  LeadName: string;
  Team: string;
  BadgeColor: string;
  Email: string;
  ProfilePhoto?: string | null;
}
 
export interface TeamEmployee {
  EmployeeID: string;
  EmployeeName: string;
  Email: string;
  ReportingManagerID?: string;
  ProfilePhoto?: string | null;
}
 
export interface TeamEmployeeDetailsResponse {
  success: boolean;
  message: string;
  data: TeamLead[] | TeamEmployee[];
}
 
 
// ── Classification Dropdown ───────────────────────────────────
export interface ClassificationDropdownItem {
  classificationId: number;
  classificationName: string;
  code: string;
}
 
export interface ClassificationDropdownResponse {
  success: boolean;
  message: string;
  data: ClassificationDropdownItem[];
}
 
export interface WelcomeInfo {
  fullName:            string;
  shortName:           string;
  code:                string;
  profilePhoto:        string | null;
  companyId:           number;
  companyCode:         string;
  companyName:         string;
  branchName:          string;
  branchCode:          string;
  routingUrl:          string;
  deptId:              number;
  department:          string;
  roleId:              number;
  defaultRole:         string;
  designationId:       number;
  designation:         string;
  welcomeMessage:      string;
  lastLoginDateTime:   string | null;
  lastLogoutDateTime:  string | null;
  loginFailedCount:    number;
  isAccountLocked:     boolean;
  accountLockedTime:   string | null;
  employeeId:          string;
  email:               string;
  mobileNo:            string | null;
}

export interface MenuInfo {
  menuId:       number;
  parentId:     number | null;
  menuName:     string;
  routeUrl:     string;
  displayOrder: number;
}

export interface KpiSummary {
  totalEmployees:      number;
  joinedEmployee:      number;
  confirmationPending: number;
  leftEmployee:        number;
  openPositions:       number;
}

export interface DepartmentCount {
  department: string;
  count:      number;
}

export interface GenderCount {
  gender:     string;
  count:      number;
  percentage: number;
}

export interface AgeGroupCount {
  ageBetween: string;
  female:     number;
  male:       number;
}

// ── Root API response ─────────────────────────────────────────
export interface DashboardSummary {
  welcome:             WelcomeInfo;
  menus:               MenuInfo[];
  summary:             KpiSummary;
  departmentWiseCount: DepartmentCount[];
  genderWiseCount:     GenderCount[];
  ageGroupWiseCount:   AgeGroupCount[];
  upcomingEvents:      UpcomingEvent[];
  team:                TeamMember[];
  avgTenure:           string;
}

// ── Stat card config ──────────────────────────────────────────
export interface StatCardConfig {
  key:       keyof KpiSummary;
  label:     string;
  icon:      string;
  iconBg:    string;
  format?:   'number' | 'currency';
}

export interface ActivityItem {
  id:           string;
  title:        string;
  priority:     'High' | 'Medium' | 'Low';
  scheduledFor: string;
  done?:        boolean;
}


export interface UpcomingEvent {
  fullName:  string;
  code:      string;
  eventName: 'Birthday' | 'Work Anniversary';
  eventDate: string;
}

export interface TeamMember {
  leadName:     string;
  profilePhoto: string | null;
  team:         string;
  badgeColor:   string;
  email:        string;
}
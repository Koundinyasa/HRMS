// ── Result Set 0 : Welcome / User Info ───────────────────────
export class WelcomeDto {
  fullName!: string;
  shortName!: string;
  code!: string;
  profilePhoto!: string | null;
  companyId!: number;
  companyCode!: string;
  companyName!: string;
  branchName!: string;
  branchCode!: string;
  routingUrl!: string;
  deptId!: number;
  department!: string;
  roleId!: number;
  defaultRole!: string;
  designationId!: number;
  designation!: string;
  welcomeMessage!: string;
  lastLoginDateTime!: string | null;
  lastLogoutDateTime!: string | null;
  loginFailedCount!: number;
  isAccountLocked!: boolean;
  accountLockedTime!: string | null;
  employeeId!: string;
  email!: string;
  mobileNo!: string | null;
}

// ── Result Set 1 : Menu Permissions ──────────────────────────
export class MenuDto {
  menuId!: number;
  parentId!: number | null;
  menuName!: string;
  routeUrl!: string;
  displayOrder!: number;
}

// ── Result Set 2 : KPI Summary Cards ─────────────────────────
export class KpiSummaryDto {
  totalEmployees!: number;
  joinedEmployee!: number;
  confirmationPending!: number;
  leftEmployee!: number;
  openPositions!: number;
}

// ── Result Set 3 : Department Wise Count ─────────────────────
export class DepartmentCountDto {
  department!: string;
  count!: number;
}

// ── Result Set 4 : Gender Wise Count ─────────────────────────
export class GenderCountDto {
  gender!: string;
  count!: number;
  percentage!: number;
}

// ── Result Set 5 : Age Group Wise Count ──────────────────────
export class AgeGroupCountDto {
  ageBetween!: string;
  female!: number;
  male!: number;
}

export class ClassificationMetaDto {
  id!: number;
  code!: string;
  label!: string;
}

// ── Result Set 10 : Tenure Distribution buckets ───────────────
export class TenureBucketDto {
  label!: string;
  count!: number;
}

// ── Root Response DTO ─────────────────────────────────────────
export class DashboardSummaryDto {
  welcome!: WelcomeDto;
  menus!: MenuDto[];
  summary!: KpiSummaryDto;
  departmentWiseCount!: DepartmentCountDto[];
  genderWiseCount!: GenderCountDto[];
  ageGroupWiseCount!: AgeGroupCountDto[];
  upcomingEvents!: UpcomingEventDto[];
  team!: TeamMemberDto[];
  avgTenure!: string;
  classifications!: ClassificationMetaDto[];
  TenureDatum!: TenureBucketDto[];
}

export class UpcomingEventDto {
  fullName!: string;
  code!: string;
  eventName!: 'Birthday' | 'Work Anniversary';
  eventDate!: string; // "2026-07-08"
}

export class TeamMemberDto {
  leadName!: string;
  profilePhoto!: string | null;
  team!: string;
  badgeColor!: string;
  email!: string;
}

export class AvgTenureDto {
  avgTenure!: string; // e.g. "2 Months 3 Days"
}

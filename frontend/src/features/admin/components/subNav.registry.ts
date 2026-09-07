
import { ADMIN_CENTER_SUB_NAV } from "../admincenter/constants/admincenter.constants";
import { ENROLLMENT_SUB_NAV } from "../Enrollment/constants/enrollment.constants";
import { TALENT_HUB_SUB_NAV } from "../TalentHub/constants/talenthub.constants";
// import { PAYROLL_SUB_NAV } from "../payroll/constants/payroll.constants";
import { INSIGHTS_SUB_NAV } from "../Insights/constants/reports.constants";
// import { ORG_SUB_NAV } from "../org/constants/org.constants";
import type { SubNavItem } from "./sidebar.types";

export const SUB_NAV_REGISTRY: Record<string, SubNavItem[]> = {
  "admin-center": ADMIN_CENTER_SUB_NAV,
  "enrollment": ENROLLMENT_SUB_NAV,
  "talent-hub": TALENT_HUB_SUB_NAV,
//   "payroll": PAYROLL_SUB_NAV,
  "insights": INSIGHTS_SUB_NAV,
//   "organizations": ORG_SUB_NAV,
};
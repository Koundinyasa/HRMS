






 
 
export interface PayrollModules {
  attendance: boolean;
  loan: boolean;
  insurance: boolean;
  advance: boolean;
  arrear: boolean;
  bonus: boolean;
  reimbursement: boolean;
  disbursement: boolean;
  costCenter: boolean;
  additionalSalary: boolean;
  attendanceIntegration: boolean;
}
 
export interface PayrollSettings {
  payCycleDate: string;
  companyRoleCreation: boolean;
  effectiveFrom: string;
  holidayDefinedOn: string;
  weeklyHoliday: string;
  salaryRoundOff: string;
  retirementAge: string;
  customPayslip: boolean;
  modules: PayrollModules;
}
 
export type ReminderType =
  | "birthday"
  | "workAnniversary"
  | "confirmationDate"
  | "lastWorkingDay"
  | "probationCompletion"
  | "retirement"
  | "interviewReminder"
  | "subscriptionReminder"
  | "passportExpiry";
 
/**
 * Single source of truth for the sidebar list. The backend's "list all
 * reminders" endpoint only returns reminders that already have a saved
 * per-company config row, so a type with no row yet (e.g. Birthday before
 * it's ever been saved) silently disappears from that list. To guarantee
 * every reminder type always shows its name in the sidebar, the sidebar is
 * driven from this fixed local catalog instead - the backend is only used
 * to load/save the SELECTED reminder's details.
 *
 * If your database's ReminderTypeID values differ from 1-9 below, this is
 * the only place you need to change them.
 */
export interface ReminderCatalogEntry {
  id: number;
  type: ReminderType;
  label: string;
}
 
export const REMINDER_CATALOG: ReminderCatalogEntry[] = [
  { id: 1, type: "birthday", label: "Birthday" },
  { id: 2, type: "workAnniversary", label: "Work Anniversary" },
  { id: 3, type: "confirmationDate", label: "Confirmation Date" },
  { id: 4, type: "lastWorkingDay", label: "Last working day" },
  { id: 5, type: "probationCompletion", label: "Probation completion" },
  { id: 6, type: "retirement", label: "Retirement" },
  { id: 7, type: "interviewReminder", label: "Interview Reminder" },
  { id: 8, type: "subscriptionReminder", label: "Subscription Reminder" },
  { id: 9, type: "passportExpiry", label: "Passport Expiry" },
];
 
/** UI type -> backend numeric ReminderTypeID (derived from the catalog above). */
export const REMINDER_TYPE_IDS: Record<ReminderType, number> = REMINDER_CATALOG.reduce(
  (acc, entry) => {
    acc[entry.type] = entry.id;
    return acc;
  },
  {} as Record<ReminderType, number>
);
 
export interface ReminderApplicability {
  ess: boolean;
  hrms: boolean;
  sendMail: boolean;
  active: boolean;
}
 
export interface ReminderSettings {
  type: ReminderType | string;
  daysBefore: number;
  subject: string;
  body: string;
  applicability: ReminderApplicability;
}
 
/** Body for POST admin/setting/reminder (creates a new reminder TYPE, not settings). */
export interface AddReminderInput {
  code: string;
  displayName: string;
  shortLabel: string;
  sortOrder: number;
  templateName?: string;
  // ✅ CHANGED: required by the backend AddReminderDto validation
  fromEmail: string;
  toRecipient: string;
  ccRecipient?: string;
  // ✅ CHANGED: the insert needs it (column ReminderBefore does not allow NULL)
  reminderBefore: number;
  subject: string;
  body: string;
}
 
export interface EmailType {
  id: number;
  name: string;
}
 
export interface EmailPayslipSettings {
  enabled: boolean;
  sendOnDay: number;
  ccHr: boolean;
  templateId: string;
  subject: string;
  body: string;
}
 
export interface TenantSettings {
  companyLogoUrl: string;
  ipWhitelist: string[];
  passwordExpiryDays: number;
}
 
/**
 * Body for PUT admin/setting/tenant (backend UpdateCompanyTenantDto).
 * Keys must match the DTO exactly - companyId and modifiedBy come from the JWT,
 * never from the client. All fields are optional.
 *  - ipAddress            single string (VarChar 500); the UI joins its IP list with ","
 *  - passwordExpiryinDays integer >= 0  (note the lowercase "in")
 */
export interface UpdateCompanyTenantInput {
  companyLogoPath?: string;
  ipAddress?: string;
  passwordExpiryinDays?: number;
}
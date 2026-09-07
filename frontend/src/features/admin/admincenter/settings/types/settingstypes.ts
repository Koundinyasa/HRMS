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
    | 'birthday'
    | 'workAnniversary'
    | 'confirmationDate'
    | 'lastWorkingDay'
    | 'probationCompletion'
    | 'retirement'
    | 'interviewReminder'
    | 'subscriptionReminder'
    | 'passportExpiry';

export interface ReminderApplicability {
    ess: boolean;
    hrms: boolean;
    sendMail: boolean;
    active: boolean;
}

export interface ReminderSettings {
    type: ReminderType;
    daysBefore: number;
    subject: string;
    body: string;
    applicability: ReminderApplicability;
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
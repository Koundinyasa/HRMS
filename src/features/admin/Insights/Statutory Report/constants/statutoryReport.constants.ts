// export const STATUTORY_REPORT_ROUTES = {
//   ROOT: "statutory-report",

//   PF: "pf",
//   ESI: "esi",
//   LWF: "lwf",
//   PT: "pt",

//   PF_MONTHLY_REPORT: "pf/monthly-report",
//   PF_SUPPLEMENTARY_REPORT: "pf/supplementary-report",

// //   PF_ECR_SALARY: "pf/ecr/salary",
// //   PF_ECR_ARREAR: "pf/ecr/arrear",

// PF_ECR_SALARY: "pf/salary",
// PF_ECR_ARREAR: "pf/arrear",

//   PF_MONTHLY_FORM_5: "pf/monthly-form-5",
//   PF_MONTHLY_FORM_10: "pf/monthly-form-10",

//   PF_YEARLY_FORM_6A: "pf/yearly-form-6a",
//   PF_YEARLY_EPF_FORM_3A: "pf/yearly-epf-form-3a",

//   PF_NON_EMPLOYEE_DETAILS: "pf/non-pf-employee-details",
//   PF_REGISTRATION: "pf/registration",
//   PF_EXIT_FILE: "pf/exit-file",
//   PF_KYC_FILE: "pf/kyc-file",
//   PF_ACKNOWLEDGEMENT: "pf/acknowledgement",
//   PF_ACKNOWLEDGEMENT_VIEW: "pf/acknowledgement-view",
// } as const;

// ============================================================
// Statutory Report Constants
// ============================================================

export const STATUTORY_REPORT_CONSTANTS = {
  DEFAULT_MONTH: new Date().getMonth() + 1,

  DEFAULT_YEAR: new Date().getFullYear(),

  DEFAULT_BRANCH_ID: undefined,

  DEFAULT_COMPANY_ID: undefined,
} as const;

// ============================================================
// Statutory Report Types
// ============================================================

export const STATUTORY_REPORT_TYPES = {
  PF: "pf",
  ESI: "esi",
  LWF: "lwf",
  PT: "pt",
} as const;

// ============================================================
// API ENDPOINTS
// ============================================================

export const STATUTORY_REPORT_API_ROUTES = {
  // ----------------------------------------------------------
  // PF
  // ----------------------------------------------------------

  PF_MONTHLY:
    "/statutory-report/pf/monthly",

  PF_ACKNOWLEDGEMENT:
    "/statutory-report/pf/acknowledgement",

  // ----------------------------------------------------------
  // ESI
  // ----------------------------------------------------------

  ESI_MONTHLY:
    "/statutory-report/esi/monthly",

  ESI_ACKNOWLEDGEMENT:
    "/statutory-report/esi/acknowledgement",

  // ----------------------------------------------------------
  // LWF
  // ----------------------------------------------------------

  LWF_MONTHLY:
    "/statutory-report/lwf/monthly",

  LWF_ACKNOWLEDGEMENT:
    "/statutory-report/lwf/acknowledgement",

  // ----------------------------------------------------------
  // PT
  // ----------------------------------------------------------

  PT_MONTHLY:
    "/statutory-report/pt/monthly",

  PT_HALF_YEARLY:
    "/statutory-report/pt/half-yearly",

  PT_YEARLY:
    "/statutory-report/pt/yearly",

  PT_ACKNOWLEDGEMENT:
    "/statutory-report/pt/acknowledgement",
} as const;

// ============================================================
// UI ROUTES
// ============================================================

export const STATUTORY_REPORT_ROUTES = {
  ROOT: "statutory-report",

  PF: "pf",
  ESI: "esi",
  LWF: "lwf",
  PT: "pt",

  PF_MONTHLY_REPORT: "pf/monthly-report",

  PF_SUPPLEMENTARY_REPORT:
    "pf/supplementary-report",

  PF_ECR_SALARY:
    "pf/salary",

  PF_ECR_ARREAR:
    "pf/arrear",

  PF_MONTHLY_FORM_5:
    "pf/monthly-form-5",

  PF_MONTHLY_FORM_10:
    "pf/monthly-form-10",

  PF_YEARLY_FORM_6A:
    "pf/yearly-form-6a",

  PF_YEARLY_EPF_FORM_3A:
    "pf/yearly-epf-form-3a",

  PF_NON_EMPLOYEE_DETAILS:
    "pf/non-pf-employee-details",

  PF_REGISTRATION:
    "pf/registration",

  PF_EXIT_FILE:
    "pf/exit-file",

  PF_KYC_FILE:
    "pf/kyc-file",

  PF_ACKNOWLEDGEMENT:
    "pf/acknowledgement",

  PF_ACKNOWLEDGEMENT_VIEW:
    "pf/acknowledgement-view",
} as const;

// ============================================================
// Months
// ============================================================

export const STATUTORY_MONTHS = [
  {
    value: 1,
    label: "January",
  },
  {
    value: 2,
    label: "February",
  },
  {
    value: 3,
    label: "March",
  },
  {
    value: 4,
    label: "April",
  },
  {
    value: 5,
    label: "May",
  },
  {
    value: 6,
    label: "June",
  },
  {
    value: 7,
    label: "July",
  },
  {
    value: 8,
    label: "August",
  },
  {
    value: 9,
    label: "September",
  },
  {
    value: 10,
    label: "October",
  },
  {
    value: 11,
    label: "November",
  },
  {
    value: 12,
    label: "December",
  },
] as const;
/* =====================================================
   REPORT TABS
===================================================== */

export const REPORT_TABS = [
  "Report Writer",
  "Form Master",
  "Mail Merge",
  "Factory Act Forms",
];


/* =====================================================
   FIELD TABS
===================================================== */

export const FIELD_TABS = [
  "Employee Details",
  "Classification Details",
  "HR Category",
  "Leave",
  "Salary",
  "Theo. Salary",
  "Arrear",
  "Salary Rate",
];


/* =====================================================
   EMPLOYEE DETAILS
===================================================== */

export const EMPLOYEE_FIELDS = [
  "Ref No.",
  "Employee name",
  "Email",

  "Official Mail Id",
  "Father Name",
  "Last Name",

  "Middle Name",
  "First Name",
  "Mobile",

  "Alternate mobile",
  "Emergency Contact No.",
  "Remarks",

  "Leaving Reason",
  "Spouse Name",
  "Employee Title",

  "Note",
  "Retirement Date",
  "Resignation Date",

  "PF Applicable",
  "Zero PT",
  "ESI Applicable",

  "Restrict Employee PF",
  "Restrict PF",
  "Zero Pension",
];


/* =====================================================
   CLASSIFICATION DETAILS
===================================================== */

export const CLASSIFICATION_FIELDS = [
  "Department",
  "Team",
  "Branch Name",

  "Leave Policy",
  "Salary Structure",
  "Attendance Structure",

  "Designation",
  "Bank",
  "IFSC Code",

  "Account Number",
  "Time Sheet Policy",
  "Cost Center",
];


/* =====================================================
   HR CATEGORY
===================================================== */

export const HR_CATEGORY_FIELDS = [
  "Blood Group",
  "Nationality",
  "Issued At",

  "Name Of Relative",
  "Date Of Birth",
  "Nomination%",

  "Caste Category",
  "Driving Lic No",
  "Issued date",

  "Relation",
  "Dependent",
  "Nominee Address",

  "Qualification",
  "Number",
  "Expiry Date",

  "Remarks",
  "Nominee",
  "University",
];


/* =====================================================
   LEAVE
===================================================== */

export const LEAVE_FIELDS = [
  "compensatory_off",
  "compensatory_work",
  "loss_of_pay",

  "on_official_duty",
  "casual_leave",
  "sick_leave",

  "restricted_holiday",
  "medical_wellness_leave",
  "medical_wellness_leave.",
];


/* =====================================================
   SALARY
===================================================== */

export const SALARY_FIELDS = [
  "Pay Days",
  "Present Days",
  "Calender Days",

  "Ctc Total",
  "Gross salary",
  "Earning Total",

  "Deduction Total",
  "Net Amount",
  "PF Earning",

  "ESI Earning",
  "OT2",
  "OT2 units",

  "OT2 rates",
  "Basic",
  "OT1",

  "OT1 units",
  "OT1 rates",
  "EmployerPFEarnings",

  "TDS Earning",
  "Special Allow",
  "SupPF Earning",

  "SupESI Earning",
  "SupPT Earning",
  "SupCmpESI",

  "TdsIndp",
  "TDS OtherEarnings",
  "HRA",

  "Conv. Allow.",
  "Statutory Bonus",
  "EdliWages",

  "PensionWages",
  "Account01",
  "Account02",

  "IndpSupPT",
  "SupCmpEPF",
  "SupCmpPension",

  "Insurance",
  "Health Ins.",
  "Other Deduction",

  "Medical Benefit",
  "Employer PF",
  "IndpSupCmpEPF",

  "IndpSupCmpPension",
  "DupEdliWages",
  "DupPensionWages",

  "DupAccount01",
  "DupAccount02",
  "DupAccount10",

  "DupAccount21",
  "DupAccount22",
];


/* =====================================================
   THEO. SALARY
===================================================== */

export const THEO_SALARY_FIELDS = [
  "Basic",
  "Special Allow",
  "HRA",

  "Conv. Allow.",
  "Statutory Bonus",
  "Annual CTC",

  "Monthly CTC",
  "Holiday Allow",
  "Food Wallet",

  "Compensatory AI",
  "Net Monthly",
  "Danny",

  "Percentage - NA",
  "Health Ins.",
  "Other Deduction",

  "Medical Benefit",
  "Employer PF",
];


/* =====================================================
   ARREAR
===================================================== */

export const ARREAR_FIELDS = [
  "Basic",
  "Special Allow",
  "HRA",

  "Conv. Allow.",
  "Statutory Bonus",
  "Annual CTC",

  "Monthly CTC",
  "Holiday Allow",
  "Food Wallet",

  "Compensatory AI",
  "Net Monthly",
  "Danny",

  "Percentage - NA",
  "Health Ins.",
  "Other Deduction",

  "Medical Benefit",
  "Employer PF",
];


/* =====================================================
   SALARY RATE
===================================================== */

export const SALARY_RATE_FIELDS = [
  "Basic",
  "OT1",
  "Special Allow",

  "HRA",
  "Conv. Allow.",
  "Statutory Bonus",

  "Annual CTC",
  "Monthly CTC",
  "Holiday Allow",

  "Food Wallet",
  "Compensatory AI",
  "Net Monthly",

  "Danny",
  "Percentage - NA",
  "Health Ins.",

  "Other Deduction",
  "Medical Benefit",
  "Employer PF",
];


/* =====================================================
   FIELDS BY TAB
===================================================== */

export const FIELDS_BY_TAB: Record<
  string,
  string[]
> = {
  "Employee Details":
    EMPLOYEE_FIELDS,

  "Classification Details":
    CLASSIFICATION_FIELDS,

  "HR Category":
    HR_CATEGORY_FIELDS,

  "Leave":
    LEAVE_FIELDS,

  "Salary":
    SALARY_FIELDS,

  "Theo. Salary":
    THEO_SALARY_FIELDS,

  "Arrear":
    ARREAR_FIELDS,

  "Salary Rate":
    SALARY_RATE_FIELDS,
};


/* =====================================================
   DEFAULT SELECTED FIELDS
===================================================== */

export const DEFAULT_SELECTED_FIELDS = [
  "Ref No.",
  "Employee name",
];


/* =====================================================
   DEFAULT SELECTED COLUMNS
===================================================== */

export const DEFAULT_SELECTED_COLUMNS = [
  "Ref No",
  "Empname",
  "Month Name",
];
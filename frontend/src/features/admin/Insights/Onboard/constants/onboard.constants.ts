


export const ONBOARD_DOCUMENTS = [
  {
    label: "Confirmation Letter",
    value: "confirmation-letter",
  },
  {
    label: "PF Declaration",
    value: "pf-declaration",
  },
  {
    label: "Payment of Gratuity Form",
    value: "gratuity-form",
  },
  {
    label: "Form-11 Revised",
    value: "form-11",
  },
] as const;

export const ONBOARD_FILTERS = [
  {
    label: "Query",
    value: "query",
  },
  {
    label: "Branch",
    value: "branch",
  },
  {
    label: "Salary Structure",
    value: "salaryStructure",
  },
  {
    label: "Leave",
    value: "leave",
  },
  {
    label: "Attendance",
    value: "attendance",
  },
  {
    label: "Designation",
    value: "designation",
  },
  {
    label: "Emp Status",
    value: "employeeStatus",
  },
] as const;

export const EMPLOYEE_STATUS_OPTIONS = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Current",
    value: "Current",
  },
  {
    label: "Left",
    value: "Left",
  },
];

export const ROWS_PER_PAGE_OPTIONS = [
  10,
  20,
  50,
  100,
];

export const ONBOARD_REPORT_TYPES = [
  {
    label: "Month-Wise Onboard (Summary)",
    value: "month-wise-summary",
  },
  {
    label: "Month-Wise Onboard (Detailed)",
    value: "month-wise-detailed",
  },
  {
    label: "Date-Wise Onboard (Summary)",
    value: "date-wise-summary",
  },
  {
    label: "Date-Wise Onboard (Detailed)",
    value: "date-wise-detailed",
  },
] as const;

export const ONBOARD_REPORT_MENU = [
  {
    title: "Confirmation Letter",
    type: "document" as const,
    items: [
      {
        label: "Confirmation Letter",
        value: "confirmation-letter",
      },
    ],
  },

  {
    title: "On-Board Reports",
    type: "document" as const,
    items: [
      {
        label: "PF Declaration",
        value: "pf-declaration",
      },
      {
        label: "Payment of Gratuity Form",
        value: "gratuity-form",
      },
      {
        label: "Form-11 Revised",
        value: "form-11",
      },
    ],
  },

  {
    title: "Month-Wise Onboard Report",
    type: "report" as const,
    items: [
      {
        label: "Month-Wise Onboard (Summary)",
        value: "month-wise-summary",
      },
      {
        label: "Month-Wise Onboard (Detailed)",
        value: "month-wise-detailed",
      },
    ],
  },

  {
    title: "Date-Wise Onboard Report",
    type: "report" as const,
    items: [
      {
        label: "Date-Wise Onboard (Summary)",
        value: "date-wise-summary",
      },
      {
        label: "Date-Wise Onboard (Detailed)",
        value: "date-wise-detailed",
      },
    ],
  },
] as const;

export const FILTER_OPTIONS: Record<string, string[]> = {
  branch: ["Koundinyasa Technology Services Pvt. Ltd."],
  salaryStructure: [
    "CTC Salary Structure",
    "New Salary Structure",
    "Salary structure",
    "Test Structure",
    "Test Structure 2",
    "TEST3",
  ],
  leave: ["Employee Leave Policy", "Intern Leave Policy"],
  attendance: ["Present", "Absent", "On Leave", "Half Day"],
  designation: [
    "ASSOCIATE SOFTWARE ENGINEER",
    "BUSSINESS DEVELOPMENT EXECUTIVE",
    "BUSSINESS DEVELOPMENT MANAGER",
    "Cloud DevOps Engineer",
    "Data Analyst",
    "Devops Engineer",
    "Flutter Developer",
    "HR EXECUTIVE",
    "HR MANAGER",
    "HR RECRUITER",
    "OFFICE BOY",
    "PROJECT LEAD",
    "PROJECT MANAGER",
    "Quality Analyst",
    "React Developer",
    "Senior QA Engineer",
    "Senior Software Engineer",
    "Senior Test Engineer",
    "SOFTWARE DEVELOPER",
    "Software Engineer",
    "SOFTWARE INTERN",
    "SOFTWARE TRAINEE",
    "TEAM LEAD",
    "Test Engineer",
    "UX/UI DESIGNER",
  ],
  employeeStatus: ["Current Employees", "Left Employees"],
};
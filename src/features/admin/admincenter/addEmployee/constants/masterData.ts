import type { MasterData } from "../types/types";

/** Sample dropdown data used until real masters API is wired */
export const SAMPLE_MASTER_DATA: MasterData = {
  companies: [
    { id: 1, name: "Koundinyasa Technology Services Pvt. Ltd." },
    { id: 2, name: "KTS Consulting" },
  ],
  branches: [
    { id: 1, companyId: 1, name: "Hyderabad" },
    { id: 2, companyId: 1, name: "Bengaluru" },
    { id: 3, companyId: 1, name: "Pune" },
    { id: 4, companyId: 2, name: "Chennai" },
    { id: 5, companyId: 2, name: "Mumbai" },
  ],
  departments: [
    { id: 1, name: "Engineering" },
    { id: 2, name: "Human Resources" },
    { id: 3, name: "Finance" },
    { id: 4, name: "Sales" },
    { id: 5, name: "Operations" },
  ],
  designations: [
    { id: 1, deptId: 1, name: "Software Engineer" },
    { id: 2, deptId: 1, name: "Senior Software Engineer" },
    { id: 3, deptId: 1, name: "Tech Lead" },
    { id: 4, deptId: 2, name: "HR Executive" },
    { id: 5, deptId: 2, name: "HR Manager" },
    { id: 6, deptId: 3, name: "Accountant" },
    { id: 7, deptId: 3, name: "Finance Manager" },
    { id: 8, deptId: 4, name: "Sales Executive" },
    { id: 9, deptId: 4, name: "Regional Sales Manager" },
    { id: 10, deptId: 5, name: "Operations Associate" },
    { id: 11, deptId: 5, name: "Operations Manager" },
  ],
  roles: [
    { id: 1, name: "Administrator" },
    { id: 2, name: "HR" },
    { id: 3, name: "Manager" },
    { id: 4, name: "Employee" },
  ],
  genders: [
    { id: 1, name: "Male" },
    { id: 2, name: "Female" },
    { id: 3, name: "Other" },
    { id: 4, name: "Prefer not to say" },
  ],
  employmentTypes: [
    { id: 1, name: "Full-time" },
    { id: 2, name: "Part-time" },
    { id: 3, name: "Contract" },
    { id: 4, name: "Intern" },
    { id: 5, name: "Consultant" },
  ],
  employmentStatuses: [
    { id: 1, name: "Active" },
    { id: 2, name: "On probation" },
    { id: 3, name: "Serving notice" },
    { id: 4, name: "Relieved" },
  ],
  maritalStatuses: [
    { id: 1, name: "Single" },
    { id: 2, name: "Married" },
    { id: 3, name: "Divorced" },
    { id: 4, name: "Widowed" },
  ],
  grades: [
    { id: "G1", name: "G1 – Trainee" },
    { id: "G2", name: "G2 – Associate" },
    { id: "G3", name: "G3 – Senior associate" },
    { id: "G4", name: "G4 – Lead" },
    { id: "G5", name: "G5 – Manager" },
    { id: "G6", name: "G6 – Senior manager" },
  ],
  managers: [
    { id: "EMP0001", branchId: 1, name: "Priya Sharma (EMP0001)" },
    { id: "EMP0002", branchId: 1, name: "Arjun Reddy (EMP0002)" },
    { id: "EMP0003", branchId: 2, name: "Kavya Nair (EMP0003)" },
    { id: "EMP0004", branchId: 3, name: "Rohit Deshmukh (EMP0004)" },
    { id: "EMP0005", branchId: 4, name: "Lakshmi Iyer (EMP0005)" },
    { id: "EMP0006", branchId: 5, name: "Sameer Khan (EMP0006)" },
  ],
};
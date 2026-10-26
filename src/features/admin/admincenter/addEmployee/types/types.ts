




/* ---------- Master data (dropdown sources) ---------- */

export interface Option<T extends string | number = number> {
  id: T;
  name: string;
}

export interface Branch extends Option<number> {
  companyId: number;
}

export interface Designation extends Option<number> {
  deptId: number;
}

export interface Manager extends Option<string> {
  branchId: number;
}

export interface MasterData {
  companies: Option[];
  branches: Branch[];
  departments: Option[];
  designations: Designation[];
  roles: Option[];
  genders: Option[];
  employmentTypes: Option[];
  employmentStatuses: Option[];
  maritalStatuses: Option[];
  grades: Option<string>[];
  managers: Manager[];
}

/* ---------- Form state ---------- */

export interface EmployeeFormValues {
  EmployeeID: string;
  Code: string;
  FirstName: string;
  LastName: string;
  DOB: string;
  GenderID: string;
  MaritalStatusID: string;
  CompanyID: string;
  BranchID: string;
  DeptID: string;
  DesignationID: string;
  RoleID: string;
  ReportingManagerID: string;
  Grade: string;
  EmploymentTypeID: string;
  EmploymentStatusID: string;
  DOJ: string;
  DOL: string;
  Email: string;
  AlternateEmailId: string;
  Mobileno: string;
  AltMobileNo: string;
  EmergencyNo: string;
  AadhaarNumber: string;
  PANNumber: string;
  UANNumber: string;
  PFNumber: string;
  UserID: string;
}

export type FieldName = keyof EmployeeFormValues;
export type ErrorKey = FieldName | "ProfilePhoto";
export type FormErrors = Partial<Record<ErrorKey, string>>;

/* ---------- API ----------
 * Field names below are camelCase to match the POST
 * /admin/employee-details/AddEmployee contract the backend team supplied.
 * CompanyID and CreatedBy are deliberately NOT sent — the backend reads both
 * from the authenticated user's token (see EmployeeDetailsService.createEmployee).
 * There's no Password field either: the server generates the temporary
 * password itself and emails it — the client never sees or sends it.
 */

export interface CreateEmployeePayload {
  employeeId: string;
  code: string | null;
  firstName: string;
  lastName: string | null;
  fullName: string | null;

  branchId: number;
  deptId: number | null;
  roleId: number;
  designationId: number | null;
  reportingManagerId: string | null;

  dob: string | null;
  doj: string;
  dol: string | null;

  genderId: number | null;
  employmentTypeId: number | null;
  employmentStatusId: number | null;
  maritalStatusId: number | null;

  grade: string | null;
  profilePhoto: string | null;

  /** Login email. Falls back to the work email when the "User ID" field is left blank. */
  userId: string;
  email: string;

  mobileno: string | null;
  altMobileNo: string | null;
  emergencyNo: string | null;
  alternateEmailId: string | null;

  aadhaarNumber: string | null;
  panNumber: string | null;
  uanNumber: string | null;
  pfNumber: string | null;
}

/** Matches EmployeeDetailsService.createEmployee's actual return shape. */
export interface CreateEmployeeResult {
  statusCode: number;
  message: string;
  employeeId: string;
  fullName: string;
  userId: string;
  /** false if the employee was created but the credentials email failed to send. */
  emailSent: boolean;
}
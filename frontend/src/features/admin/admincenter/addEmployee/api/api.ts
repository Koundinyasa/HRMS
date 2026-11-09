import api from "@/api/api";
import type {
  Branch,
  Company,
  CreateEmployeePayload,
  CreateEmployeeResult,
  Designation,
  EmployeeFormValues,
  FieldName,
  Manager,
  MasterData,
  Option,
} from "../types/types";
 
/**
 * Shared axios instance: frontend/src/api/api.ts
 *   baseURL comes from VITE_API_URL, sends the login cookies, and renews the
 *   session on a 401. No token is attached by hand.
 */
 
/** Map backend USP_GetCompanyMasterData_N shape → form MasterData */
function mapMasterData(data: Record<string, unknown>): MasterData {
  const companies = ((data.companies as Record<string, unknown>[]) || []).map((r) => ({
    id: Number(r.CompanyID),
    name: String(r.CompanyName ?? ""),
    emailDomain: String(r.DomainName ?? "").trim(),
  })) as Company[];
 
  const branches = ((data.branches as Record<string, unknown>[]) || []).map((r) => ({
    id: Number(r.BranchID),
    name: String(r.BranchName ?? ""),
    companyId: Number(r.companyId ?? r.CompanyID),
  })) as Branch[];
 
  const departments = ((data.departments as Record<string, unknown>[]) || []).map((r) => ({
    id: Number(r.DepartmentID ?? r.DeptID),
    name: String(r.DepartmentName ?? r.DeptName ?? ""),
  })) as Option[];
 
  const designations = ((data.designations as Record<string, unknown>[]) || []).map((r) => ({
    id: Number(r.DesignationID),
    name: String(r.DesignationName ?? "").trim(),
    deptId: Number(r.deptId ?? r.DeptID ?? r.DepartmentID),
  })) as Designation[];
 
  const roles = ((data.roles as Record<string, unknown>[]) || []).map((r) => ({
    id: Number(r.Roleid ?? r.RoleID ?? r.RoleId),
    name: String(r.name ?? r.RoleName ?? r.Name ?? ""),
  })) as Option[];
 
  const genders = ((data.genders as Record<string, unknown>[]) || []).map((r) => ({
    id: Number(r.GenderId ?? r.GenderID),
    name: String(r.Gendername ?? r.GenderName ?? r.name ?? ""),
  })) as Option[];
 
  const employmentTypes = ((data.employmentTypes as Record<string, unknown>[]) || []).map((r) => ({
    id: Number(r.EmploymentTypeId ?? r.EmploymentTypeID),
    name: String(r.EmploymentType ?? r.EmploymentTypeName ?? r.name ?? ""),
  })) as Option[];
 
  const employmentStatuses = ((data.employmentStatuses as Record<string, unknown>[]) || []).map((r) => ({
    id: Number(r.EmploymentStatusId ?? r.EmploymentStatusID),
    name: String(r.EmploymentStatus ?? r.EmploymentStatusName ?? r.name ?? ""),
  })) as Option[];
 
  const maritalStatuses = ((data.maritalStatuses as Record<string, unknown>[]) || []).map((r) => ({
    id: Number(r.id ?? r.MaritalStatusID ?? r.MaritalStatusId),
    name: String(r.name ?? r.MaritalStatusName ?? ""),
  })) as Option[];
 
  const grades = ((data.grades as Record<string, unknown>[]) || []).map((r) => ({
    id: String(r.Gradeid ?? r.GradeID ?? r.Grade ?? ""),
    name: String(r.Gradename ?? r.GradeName ?? r.Grade ?? ""),
  })) as Option<string>[];
 
  const managers = ((data.managers as Record<string, unknown>[]) || []).map((r) => ({
    id: String(r.EmployeeID ?? r.EmployeeId ?? "").trim(),
    name: String(r.Employeename ?? r.EmployeeName ?? r.name ?? "").trim(),
    branchId: Number(r.branchId ?? r.BranchID),
  })) as Manager[];
 
  return {
    companies: companies.filter((x) => x.id && x.name),
    branches: branches.filter((x) => x.id && x.name && x.companyId),
    departments: departments.filter((x) => x.id && x.name),
    designations: designations.filter((x) => x.id && x.name && x.deptId),
    roles: roles.filter((x) => x.id && x.name),
    genders: genders.filter((x) => x.id && x.name),
    employmentTypes: employmentTypes.filter((x) => x.id && x.name),
    employmentStatuses: employmentStatuses.filter((x) => x.id && x.name),
    maritalStatuses: maritalStatuses.filter((x) => x.id && x.name),
    grades: grades.filter((x) => x.id && x.name),
    managers: managers.filter((x) => x.id && x.name && x.branchId),
  };
}
 
function axiosErrorMessage(err: unknown, fallback: string): string {
  const e = err as {
    response?: { data?: { message?: string; Message?: string }; status?: number };
    message?: string;
  };
  const msg =
    e?.response?.data?.message ||
    e?.response?.data?.Message ||
    e?.message;
  if (msg) return String(msg);
  if (e?.response?.status) return `${fallback} (${e.response.status}).`;
  return fallback;
}
 
/** GET /api/admin/employee-details */
export async function fetchMasterData(): Promise<MasterData> {
  try {
    const res = await api.get<Record<string, unknown>>("/admin/employee-details");
    return mapMasterData(res.data ?? {});
  } catch (err) {
    throw new Error(axiosErrorMessage(err, "Failed to load dropdown data"), {
      cause: err,
    });
  }
}
 
/**
 * Builds the JSON body for POST /admin/employee-details/AddEmployee.
 * (Same payload shape as before — no functional change.)
 */
export function buildPayload(
  values: EmployeeFormValues,
  photo: File | null,
  _createdBy?: string,
): CreateEmployeePayload {
  void _createdBy;
  const str = (n: FieldName): string | null => values[n].trim() || null;
  const num = (n: FieldName): number | null => (values[n] ? Number(values[n]) : null);
  const email = values.Email.trim().toLowerCase();
  const firstName = values.FirstName.trim();
  const lastName = str("LastName");
 
  return {
    employeeId: values.EmployeeID.trim(),
    code: str("Code"),
    firstName,
    lastName,
    fullName: [firstName, lastName].filter(Boolean).join(" ") || null,
 
    branchId: Number(values.BranchID),
    deptId: num("DeptID"),
    roleId: Number(values.RoleID),
    designationId: num("DesignationID"),
    reportingManagerId: str("ReportingManagerID"),
 
    dob: str("DOB"),
    doj: values.DOJ,
    dol: str("DOL"),
 
    genderId: num("GenderID"),
    employmentTypeId: num("EmploymentTypeID"),
    employmentStatusId: num("EmploymentStatusID"),
    maritalStatusId: num("MaritalStatusID"),
 
    grade: str("Grade"),
    profilePhoto: photo?.name ?? null,
 
    userId: str("UserID") ?? email,
    email,
 
    mobileno: str("Mobileno"),
    altMobileNo: str("AltMobileNo"),
    emergencyNo: str("EmergencyNo"),
    alternateEmailId: str("AlternateEmailId"),
 
    aadhaarNumber: str("AadhaarNumber"),
    panNumber: str("PANNumber"),
    uanNumber: str("UANNumber"),
    pfNumber: str("PFNumber"),
  };
}
 
/** POST /api/admin/employee-details/AddEmployee */
export async function saveEmployee(
  payload: CreateEmployeePayload,
  photo: File | null,
): Promise<CreateEmployeeResult> {
  try {
    const res = await api.post<CreateEmployeeResult>(
      "/admin/employee-details/AddEmployee",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    void photo;
    return res.data as CreateEmployeeResult;
  } catch (err) {
    throw new Error(
      axiosErrorMessage(err, "Employee could not be created. Try again."),
      { cause: err },
    );
  }
}
 
/** GET /api/admin/employee-details/validate-employee-id/:employeeId
 * Backend USP_ValidateNewEmployee:
 *   statusCode 1 = available (OK to use)
 *   statusCode 0 = already exists / not allowed
 */
export async function validateEmployeeId(
  employeeId: string,
): Promise<{ ok: boolean; message: string }> {
  const id = employeeId.trim();
  if (!id) {
    return { ok: false, message: "Employee ID is required." };
  }
 
  try {
    const res = await api.get<{
      statusCode?: number | string;
      StatusCode?: number | string;
      message?: string;
      Message?: string;
    }>(`/admin/employee-details/validate-employee-id/${encodeURIComponent(id)}`);
 
    const data = res.data ?? {};
    const status = Number(data.statusCode ?? data.StatusCode);
    const message = String(data.message || data.Message || "").trim();
    const lower = message.toLowerCase();
 
    if (status === 1) {
      return { ok: true, message: message || "Employee ID is available." };
    }
 
    if (status === 0) {
      return {
        ok: false,
        message: message || "An employee already exists with this Employee ID.",
      };
    }
 
    if (
      lower.includes("available") ||
      lower.includes("valid") ||
      lower.includes("success") ||
      lower.includes("not exist") ||
      lower.includes("does not exist")
    ) {
      return { ok: true, message: message || "Employee ID is available." };
    }
 
    if (
      lower.includes("already") ||
      lower.includes("exist") ||
      lower.includes("duplicate")
    ) {
      return {
        ok: false,
        message: message || "An employee already exists with this Employee ID.",
      };
    }
 
    if (!Number.isFinite(status)) {
      return {
        ok: true,
        message: message || "Employee ID is available.",
      };
    }
 
    return {
      ok: false,
      message: message || "Employee ID cannot be used.",
    };
  } catch (err) {
    // HTTP / network error — do NOT claim "already exists"
    return {
      ok: false,
      message: axiosErrorMessage(err, "Could not validate Employee ID"),
    };
  }
}

/** GET /api/admin/employee-details/validate-email?email=
 * The backend returns success=true when the email can be used.
 */
export async function validateEmployeeEmail(
  email: string,
): Promise<{ ok: boolean; message: string }> {
  const normalizedEmail = email.trim();
  if (!normalizedEmail) {
    return { ok: false, message: "Email is required." };
  }

  try {
    const res = await api.get<{
      success?: boolean;
      statusCode?: number | string;
      message?: string;
    }>("/admin/employee-details/validate-email", {
      params: { email: normalizedEmail },
    });

    const data = res.data ?? {};
    const message = String(data.message ?? "").trim();
    const available = data.success === true || Number(data.statusCode) === 200;

    return available
      ? { ok: true, message: message || "Email is available." }
      : {
          ok: false,
          message: message || "An employee already exists with this email.",
        };
  } catch (err) {
    return {
      ok: false,
      message: axiosErrorMessage(err, "Could not validate email."),
    };
  }
}

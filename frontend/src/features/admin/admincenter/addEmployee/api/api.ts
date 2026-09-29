// import type {
//   Branch,
//   CreateEmployeePayload,
//   CreateEmployeeResult,
//   Designation,
//   EmployeeFormValues,
//   FieldName,
//   Manager,
//   MasterData,
//   Option,
// } from "../types/types";

// const API_BASE =
//   (import.meta as any).env?.VITE_API_URL?.replace(/\/$/, "") ||
//   "http://localhost:3001/api";

// function authHeaders(): HeadersInit {
//   const token =
//     localStorage.getItem("token") ||
//     localStorage.getItem("accessToken") ||
//     sessionStorage.getItem("token") ||
//     "";
//   return {
//     Accept: "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// }

// /** Map backend USP_GetCompanyMasterData_N shape → form MasterData */
// function mapMasterData(data: Record<string, unknown>): MasterData {
//   const companies = ((data.companies as any[]) || []).map((r) => ({
//     id: Number(r.CompanyID),
//     name: String(r.CompanyName ?? ""),
//   })) as Option[];

//   const branches = ((data.branches as any[]) || []).map((r) => ({
//     id: Number(r.BranchID),
//     name: String(r.BranchName ?? ""),
//     companyId: Number(r.companyId ?? r.CompanyID),
//   })) as Branch[];

//   const departments = ((data.departments as any[]) || []).map((r) => ({
//     id: Number(r.DepartmentID ?? r.DeptID),
//     name: String(r.DepartmentName ?? r.DeptName ?? ""),
//   })) as Option[];

//   const designations = ((data.designations as any[]) || []).map((r) => ({
//     id: Number(r.DesignationID),
//     name: String(r.DesignationName ?? "").trim(),
//     deptId: Number(r.deptId ?? r.DeptID ?? r.DepartmentID),
//   })) as Designation[];

//   // Backend uses Roleid (lowercase i)
//   const roles = ((data.roles as any[]) || []).map((r) => ({
//     id: Number(r.Roleid ?? r.RoleID ?? r.RoleId),
//     name: String(r.name ?? r.RoleName ?? r.Name ?? ""),
//   })) as Option[];

//   // GenderId / Gendername
//   const genders = ((data.genders as any[]) || []).map((r) => ({
//     id: Number(r.GenderId ?? r.GenderID),
//     name: String(r.Gendername ?? r.GenderName ?? r.name ?? ""),
//   })) as Option[];

//   // EmploymentTypeId / EmploymentType
//   const employmentTypes = ((data.employmentTypes as any[]) || []).map((r) => ({
//     id: Number(r.EmploymentTypeId ?? r.EmploymentTypeID),
//     name: String(r.EmploymentType ?? r.EmploymentTypeName ?? r.name ?? ""),
//   })) as Option[];

//   // EmploymentStatusId / EmploymentStatus
//   const employmentStatuses = ((data.employmentStatuses as any[]) || []).map((r) => ({
//     id: Number(r.EmploymentStatusId ?? r.EmploymentStatusID),
//     name: String(r.EmploymentStatus ?? r.EmploymentStatusName ?? r.name ?? ""),
//   })) as Option[];

//   const maritalStatuses = ((data.maritalStatuses as any[]) || []).map((r) => ({
//     id: Number(r.id ?? r.MaritalStatusID ?? r.MaritalStatusId),
//     name: String(r.name ?? r.MaritalStatusName ?? ""),
//   })) as Option[];

//   // Gradeid / Gradename (string ids)
//   const grades = ((data.grades as any[]) || []).map((r) => ({
//     id: String(r.Gradeid ?? r.GradeID ?? r.Grade ?? ""),
//     name: String(r.Gradename ?? r.GradeName ?? r.Grade ?? ""),
//   })) as Option<string>[];

//   // EmployeeID / branchId / Employeename
//   const managers = ((data.managers as any[]) || []).map((r) => ({
//     id: String(r.EmployeeID ?? r.EmployeeId ?? "").trim(),
//     name: String(r.Employeename ?? r.EmployeeName ?? r.name ?? "").trim(),
//     branchId: Number(r.branchId ?? r.BranchID),
//   })) as Manager[];

//   return {
//     companies: companies.filter((x) => x.id && x.name),
//     branches: branches.filter((x) => x.id && x.name && x.companyId),
//     departments: departments.filter((x) => x.id && x.name),
//     designations: designations.filter((x) => x.id && x.name && x.deptId),
//     roles: roles.filter((x) => x.id && x.name),
//     genders: genders.filter((x) => x.id && x.name),
//     employmentTypes: employmentTypes.filter((x) => x.id && x.name),
//     employmentStatuses: employmentStatuses.filter((x) => x.id && x.name),
//     maritalStatuses: maritalStatuses.filter((x) => x.id && x.name),
//     grades: grades.filter((x) => x.id && x.name),
//     managers: managers.filter((x) => x.id && x.name && x.branchId),
//   };
// }

// /** GET /api/admin/employee-details */
// export async function fetchMasterData(): Promise<MasterData> {
//   const res = await fetch(`${API_BASE}/admin/employee-details`, {
//     method: "GET",
//     headers: authHeaders(),
//     credentials: "include",
//   });

//   const data = (await res.json().catch(() => ({}))) as Record<string, unknown> & {
//     message?: string;
//   };

//   if (!res.ok) {
//     throw new Error(data.message || `Failed to load dropdown data (${res.status}).`);
//   }

//   return mapMasterData(data);
// }

// /**
//  * Builds the JSON body for POST /admin/employee-details/AddEmployee.
//  *
//  * `createdBy` is accepted for backward compatibility with existing callers but
//  * is intentionally NOT sent — the backend takes CreatedBy from the logged-in
//  * user's auth token (see EmployeeDetailsService.createEmployee), same as
//  * CompanyID. There's also no password field: the server generates the
//  * temporary password itself and emails it to `userId`.
//  */
// export function buildPayload(
//   values: EmployeeFormValues,
//   photo: File | null,
//   _createdBy?: string,
// ): CreateEmployeePayload {
//   const str = (n: FieldName): string | null => values[n].trim() || null;
//   const num = (n: FieldName): number | null => (values[n] ? Number(values[n]) : null);
//   const email = values.Email.trim().toLowerCase();
//   const firstName = values.FirstName.trim();
//   const lastName = str("LastName");

//   return {
//     employeeId: values.EmployeeID.trim(),
//     code: str("Code"),
//     firstName,
//     lastName,
//     fullName: [firstName, lastName].filter(Boolean).join(" ") || null,

//     branchId: Number(values.BranchID),
//     deptId: num("DeptID"),
//     roleId: Number(values.RoleID),
//     designationId: num("DesignationID"),
//     reportingManagerId: str("ReportingManagerID"),

//     dob: str("DOB"),
//     doj: values.DOJ,
//     dol: str("DOL"),

//     genderId: num("GenderID"),
//     employmentTypeId: num("EmploymentTypeID"),
//     employmentStatusId: num("EmploymentStatusID"),
//     maritalStatusId: num("MaritalStatusID"),

//     grade: str("Grade"),
//     profilePhoto: photo?.name ?? null,

//     // Login email — this is what the server emails the temporary password to.
//     // Falls back to the work email when "User ID" is left blank, matching the
//     // "Leave blank to sign in with the work email" hint in the form.
//     userId: str("UserID") ?? email,
//     email,

//     mobileno: str("Mobileno"),
//     altMobileNo: str("AltMobileNo"),
//     emergencyNo: str("EmergencyNo"),
//     alternateEmailId: str("AlternateEmailId"),

//     aadhaarNumber: str("AadhaarNumber"),
//     panNumber: str("PANNumber"),
//     uanNumber: str("UANNumber"),
//     pfNumber: str("PFNumber"),
//   };
// }

// /** POST /api/admin/employee-details/AddEmployee */
// export async function saveEmployee(
//   payload: CreateEmployeePayload,
//   photo: File | null,
// ): Promise<CreateEmployeeResult> {
//   const res = await fetch(`${API_BASE}/admin/employee-details/AddEmployee`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       ...authHeaders(),
//     },
//     body: JSON.stringify(payload),
//     credentials: "include",
//   });

//   const data = (await res.json().catch(() => ({}))) as Partial<CreateEmployeeResult> & {
//     message?: string;
//   };

//   if (!res.ok) {
//     throw new Error(data.message ?? "Employee could not be created. Try again.");
//   }

//   // NOTE: AddEmployee only accepts JSON — there's no multipart handling on the
//   // backend for this route, so the profile photo file itself isn't uploaded
//   // here (only its file name, inside `payload.profilePhoto`). Once the backend
//   // exposes a document-upload endpoint (addEmployeeDocument is the closest
//   // match in the service), wire `photo` through there after a successful create.
//   void photo;

//   return data as CreateEmployeeResult;
// }

// /** GET /api/admin/employee-details/validate-employee-id/:employeeId */
// export async function validateEmployeeId(
//   employeeId: string,
// ): Promise<{ ok: boolean; message: string }> {
//   const id = employeeId.trim();
//   if (!id) {
//     return { ok: false, message: "Employee ID is required." };
//   }

//   const res = await fetch(
//     `${API_BASE}/admin/employee-details/validate-employee-id/${encodeURIComponent(id)}`,
//     {
//       method: "GET",
//       headers: authHeaders(),
//       credentials: "include",
//     },
//   );

//   const data = (await res.json().catch(() => ({}))) as {
//     statusCode?: number;
//     StatusCode?: number;
//     message?: string;
//     Message?: string;
//   };

//   const status = data.statusCode ?? data.StatusCode;
//   const message =
//     data.message ||
//     data.Message ||
//     (res.ok ? "" : "Could not validate Employee ID.");

//   // Backend: StatusCode 1 = available, 0 (or other) = already exists / error
//   if (!res.ok) {
//     return {
//       ok: false,
//       message: message || `Validation failed (${res.status}).`,
//     };
//   }

//   if (status === 1) {
//     return { ok: true, message: message || "Employee ID is available." };
//   }

//   // Already exists or invalid
//   return {
//     ok: false,
//     message:
//       message ||
//       "An employee already exists with this Employee ID.",
//   };
// }





 
import api from "@/api/api";
import type {
  Branch,
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
 *   baseURL: http://localhost:3001/api  (or VITE if you update that file)
 *
 * Functionality unchanged — only transport uses the shared client
 * instead of raw fetch + hardcoded API_BASE.
 */
 
function authHeaders(): Record<string, string> {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("token") ||
    "";
  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
 
/** Map backend USP_GetCompanyMasterData_N shape → form MasterData */
function mapMasterData(data: Record<string, unknown>): MasterData {
  const companies = ((data.companies as any[]) || []).map((r) => ({
    id: Number(r.CompanyID),
    name: String(r.CompanyName ?? ""),
  })) as Option[];
 
  const branches = ((data.branches as any[]) || []).map((r) => ({
    id: Number(r.BranchID),
    name: String(r.BranchName ?? ""),
    companyId: Number(r.companyId ?? r.CompanyID),
  })) as Branch[];
 
  const departments = ((data.departments as any[]) || []).map((r) => ({
    id: Number(r.DepartmentID ?? r.DeptID),
    name: String(r.DepartmentName ?? r.DeptName ?? ""),
  })) as Option[];
 
  const designations = ((data.designations as any[]) || []).map((r) => ({
    id: Number(r.DesignationID),
    name: String(r.DesignationName ?? "").trim(),
    deptId: Number(r.deptId ?? r.DeptID ?? r.DepartmentID),
  })) as Designation[];
 
  const roles = ((data.roles as any[]) || []).map((r) => ({
    id: Number(r.Roleid ?? r.RoleID ?? r.RoleId),
    name: String(r.name ?? r.RoleName ?? r.Name ?? ""),
  })) as Option[];
 
  const genders = ((data.genders as any[]) || []).map((r) => ({
    id: Number(r.GenderId ?? r.GenderID),
    name: String(r.Gendername ?? r.GenderName ?? r.name ?? ""),
  })) as Option[];
 
  const employmentTypes = ((data.employmentTypes as any[]) || []).map((r) => ({
    id: Number(r.EmploymentTypeId ?? r.EmploymentTypeID),
    name: String(r.EmploymentType ?? r.EmploymentTypeName ?? r.name ?? ""),
  })) as Option[];
 
  const employmentStatuses = ((data.employmentStatuses as any[]) || []).map((r) => ({
    id: Number(r.EmploymentStatusId ?? r.EmploymentStatusID),
    name: String(r.EmploymentStatus ?? r.EmploymentStatusName ?? r.name ?? ""),
  })) as Option[];
 
  const maritalStatuses = ((data.maritalStatuses as any[]) || []).map((r) => ({
    id: Number(r.id ?? r.MaritalStatusID ?? r.MaritalStatusId),
    name: String(r.name ?? r.MaritalStatusName ?? ""),
  })) as Option[];
 
  const grades = ((data.grades as any[]) || []).map((r) => ({
    id: String(r.Gradeid ?? r.GradeID ?? r.Grade ?? ""),
    name: String(r.Gradename ?? r.GradeName ?? r.Grade ?? ""),
  })) as Option<string>[];
 
  const managers = ((data.managers as any[]) || []).map((r) => ({
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
    const res = await api.get<Record<string, unknown>>("/admin/employee-details", {
      headers: authHeaders(),
      withCredentials: true,
    });
    return mapMasterData(res.data ?? {});
  } catch (err) {
    throw new Error(axiosErrorMessage(err, "Failed to load dropdown data"));
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
          ...authHeaders(),
        },
        withCredentials: true,
      },
    );
    void photo;
    return res.data as CreateEmployeeResult;
  } catch (err) {
    throw new Error(axiosErrorMessage(err, "Employee could not be created. Try again."));
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
    }>(`/admin/employee-details/validate-employee-id/${encodeURIComponent(id)}`, {
      headers: authHeaders(),
      withCredentials: true,
    });
 
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
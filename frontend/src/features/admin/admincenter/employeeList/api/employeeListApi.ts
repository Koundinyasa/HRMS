import { baseApi } from "@/app/baseApi";

/**
 * Employee List (Admin Center): the list of employees and one employee's
 * details. Moved here from Enrollment > Employee Details.
 *
 *   GET /api/admin/employee-details/employees
 *   GET /api/admin/employee-details/:employeeId
 */

function toNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

type UnknownRecord = Record<string, unknown>;

/* ============================================================
   EMPLOYEE TYPES
============================================================ */
 
export type EmployeeFilterType =
  | "all"
  | "male"
  | "female"
  | "joined"
  | "left"
  | "confirmation-pending";
 
/* ============================================================
   EMPLOYEE LIST
   BACKEND:
   GET /api/admin/employee-details/employees
 
   IMPORTANT:
   Backend does NOT use flags.
============================================================ */
 
export interface EmployeeFull {
  EmployeeID: number;
  EmployeeName: string;
 
  DesignationName: string | null;
 
  JoiningDate: string | null;
  ExitDate: string | null;
 
  Email: string | null;
  MobileNo: string | null;
 
  BranchName: string | null;
  ReportingManager: string | null;
 
  LeavePolicyName: string | null;
  AttendanceType: string | null;
 
  /* Optional fields if backend sends them */
  Gender?: string | null;
  EmployeeStatus?: string | null;
  EmpStatus?: string | null;
  ConfirmationStatus?: string | null;
  ConfirmationDate?: string | null;
 
  SalaryStructureName?: string | null;
  SalaryStructure?: string | null;
 
  ReportingAuthorityName?: string | null;
}
 
export interface EmployeeBasic {
  EmployeeID: number;
  EmployeeName: string;
  ReportingAuthorityName: string | null;
 
  Gender?: string | null;
  JoiningDate?: string | null;
  ExitDate?: string | null;
 
  EmployeeStatus?: string | null;
  EmpStatus?: string | null;
  ConfirmationStatus?: string | null;
  ConfirmationDate?: string | null;
}
 
export interface EmployeeWithDate extends EmployeeBasic {
  JoiningDate?: string;
  ExitDate?: string;
}
 
export type Employee =
  | EmployeeFull
  | EmployeeBasic
  | EmployeeWithDate;
 
export function isEmployeeFull(
  e: Employee
): e is EmployeeFull {
  return "DesignationName" in e;
}
 
/* ============================================================
   GET ALL EMPLOYEES RESPONSE
 
   BACKEND:
   GET /admin/employee-details/employees
============================================================ */
 
interface GetEmployeesResponse {
  success: boolean;
  data?: Employee[];
  statusCode?: number;
  message?: string;
}
 
/* ============================================================
   EMPLOYEE DETAIL
   BACKEND:
   GET /api/admin/employee-details/:employeeId
============================================================ */
 
export interface EmployeeGeneral {
  EmployeeID: string;
  ProfilePhoto: string | null;
  FirstName: string;
  LastName: string;
  FullName: string;
  DateofBirth: string | null;
  DateofJoining: string | null;
  Email: string | null;
  Gender: string | null;
  MaritalStatus: string | null;
  FatherName: string | null;
  SpouseName: string | null;
  ReportingAuthorityName: string | null;
}
 
export interface EmployeeClassification {
  EmployeeID: string;
  FullName: string;
  ProfilePhoto: string | null;
  BranchName: string | null;
  BankName: string | null;
  AccountNumber: string | null;
  IFSC: string | null;
  LeavePolicy: string | null;
  Department: string | null;
  DesignationName: string | null;
}
 
export interface EmployeeStatutory {
  EmployeeID: string;
  EmployeeName: string;
  AadhaarNumber: string | null;
  PANNumber: string | null;
  PFNumber: string | null;
  UANNumber: string | null;
  ESINumber: string | null;
  FinancialYear: string | null;
  EffectiveFrom: string | null;
 
  PFApplicable: 0 | 1;
  PFVoluntary: 0 | 1;
  ZeroPension: 0 | 1;
  RestrictEmployeePF: 0 | 1;
  ZeroPT: 0 | 1;
  ESIApplicable: 0 | 1;
  InternationalWorker: 0 | 1;
  LWFApplicable: 0 | 1;
}
 
export interface EmployeeAddress {
  ID: number;
  EmployeeID: string;
  AddressType: string | null;
  ResidentialNameNo: string | null;
  Street: string | null;
  Locality: string | null;
  City: string | null;
  State: string | null;
  PinCode: string | null;
  MobileNo: string | null;
  AltMobileNo: string | null;
  OfficialEmailId: string | null;
  AlternateEmailId: string | null;
  EmergencyNo: string | null;
}
 
export interface EmployeeDocument {
  ID: number;
  DocumentType: string | null;
  DocumentName: string | null;
  Date: string | null;
  FileName: string | null;
  FilePath: string | null;
}
 
export interface EmployeeSeparation {
  ResignationDate: string | null;
  DateofLeaving: string | null;
  Reason: string | null;
  Remarks: string | null;
}
 
export interface EmployeeWorkflow {
  Name: string;
  WorkflowName: string;
  SlNo: number;
  Approver: string | null;
  Level: number;
  GroupName: string | null;
}
 
export interface EmployeeDetailData {
  general: EmployeeGeneral[];
  classification: EmployeeClassification[];
  statutory: EmployeeStatutory[];
  address: EmployeeAddress[];
  documents: EmployeeDocument[];
  separation: EmployeeSeparation[];
  workflowDetails: EmployeeWorkflow[];
}
 
interface GetEmployeeDetailResponse {
  success: boolean;
  data?: EmployeeDetailData;
  statusCode?: number;
  message?: string;
}
 

export const employeeListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
      /* ========================================================
         GET ALL EMPLOYEES
 
         IMPORTANT:
         No flag
         No month
         No year
 
         Backend:
         GET /api/admin/employee-details/employees
      ======================================================== */
 
      getEmployees: builder.query<
        Employee[],
        void
      >({
        query: () => ({
          url: "admin/employee-details/employees",
          method: "GET",
        }),
 
        // Backend actually returns a bare JSON array
        // It also spells the attendance field "AttendenceType"
        // so we normalize it here.
 
        transformResponse: (
          response:
            | Employee[]
            | GetEmployeesResponse
        ): Employee[] => {
          const list = Array.isArray(response)
            ? response
            : response?.data ?? [];
 
          return list.map((raw) => {
            const rawRecord = raw as unknown as UnknownRecord;
            const attendanceType =
              rawRecord.AttendanceType ??
              rawRecord.AttendenceType;

            return {
              ...raw,
              AttendanceType: toNullableString(attendanceType),
            };
          });
        },
 
        providesTags: ["Employees"],
      }),
 
      /* ========================================================
         GET SINGLE EMPLOYEE
 
         Backend:
         GET /api/admin/employee-details/:employeeId
      ======================================================== */
 
      getEmployeeDetail: builder.query<
        EmployeeDetailData,
        string | number
      >({
        query: (employeeId) => ({
          url: `admin/employee-details/${employeeId}`,
          method: "GET",
        }),
 
        transformResponse: (
          response:
            | EmployeeDetailData
            | GetEmployeeDetailResponse
        ): EmployeeDetailData => {
          const body: Partial<EmployeeDetailData> =
            response &&
            typeof response === "object" &&
            "data" in response
              ? (
                  response as GetEmployeeDetailResponse
                ).data ?? {}
              : (response as EmployeeDetailData) ?? {};
 
          return {
            general: body.general ?? [],
            classification:
              body.classification ?? [],
            statutory:
              body.statutory ?? [],
            address:
              body.address ?? [],
            documents:
              body.documents ?? [],
            separation:
              body.separation ?? [],
            workflowDetails:
              body.workflowDetails ?? [],
          };
        },
 
        providesTags: (
          _result,
          _error,
          employeeId
        ) => [
          {
            type: "Employees",
            id: employeeId,
          },
        ],
      }),
 
  }),
});

export const { useGetEmployeesQuery, useGetEmployeeDetailQuery } =
  employeeListApi;

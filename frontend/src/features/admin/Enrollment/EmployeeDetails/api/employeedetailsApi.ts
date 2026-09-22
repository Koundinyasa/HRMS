import { baseApi } from "@/app/baseApi";
 
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
 
/* ============================================================
   PENDING CANDIDATES
============================================================ */
 
export interface PendingCandidateDTO {
  CandidateID: string | number;
  Title: string | null;
  FirstName: string;
  MiddleName: string | null;
  LastName: string;
  FullName: string | null;
  Gender: string | null;
  FatherName: string | null;
  MaritalStatus: string | null;
  SpouseName: string | null;
  DateofBirth: string | null;
  ProfilePhoto: string | null;
  PhysicallyChallenged: 0 | 1 | null;
}
 
interface GetPendingCandidatesResponse {
  success: boolean;
  data?: PendingCandidateDTO[];
  statusCode?: number;
  message?: string;
}
 
interface MutationResponse {
  success: boolean;
  statusCode?: number;
  message?: string;
}
 
interface UpdatePendingCandidateParams {
  candidateId: string | number;
  data: Partial<PendingCandidateDTO>;
}
 
/* ============================================================
   ORGANIZATION CHART
============================================================ */
 
export interface OrgChartEmployeeDTO {
  EmployeeID: string | number;
  EmployeeName: string;
  DesignationName: string | null;
  ProfilePhoto: string | null;
  ReportingAuthorityID: string | number | null;
}
 
export interface OrganizationChartDTO {
  OrganizationName: string;
  TotalStrength: number;
  TeamLabel: string | null;
  Employees: OrgChartEmployeeDTO[];
}
 
interface GetOrganizationChartParams {
  rootEmployeeId?: string | number;
  search?: string;
  branchId?: string | number;
}
 
interface GetOrganizationChartResponse {
  success?: boolean;
  data?: OrganizationChartDTO;
 
  /*
   * Supports a backend response where the organization
   * chart object is returned directly instead of inside data.
   */
  OrganizationName?: string;
  TotalStrength?: number;
  TeamLabel?: string | null;
  Employees?: OrgChartEmployeeDTO[];
 
  statusCode?: number;
  message?: string;
}
 
/* ============================================================
   BLOCKED USERS
============================================================ */
 
export interface BlockedUserDTO {
  EmployeeID: string | number;
  EmployeeName: string;
  Status: "Blocked" | "Active" | string;
}
 
interface GetBlockedUsersParams {
  search?: string;
  page: number;
  pageSize: number;
}
 
interface GetBlockedUsersResponse {
  success: boolean;
  data?: BlockedUserDTO[];
  totalCount?: number;
  statusCode?: number;
  message?: string;
}
 
interface UnblockUsersParams {
  employeeIds: (string | number)[];
}
 
export interface AuditLogEntryDTO {
  ID: string | number;
  RecordDetails: string;
  RecordChanges: string | null;
  ActionTime: string;
  UserName: string;
  EmployeeName: string;
}
 
interface GetAuditLogResponse {
  success: boolean;
  data?: AuditLogEntryDTO[];
  statusCode?: number;
  message?: string;
}
 
/* ============================================================
   API
============================================================ */
 
export const employeeDetailsApi =
  baseApi.injectEndpoints({
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
            const anyRaw = raw as any;
 
            return {
              ...raw,
              AttendanceType:
                anyRaw.AttendanceType ??
                anyRaw.AttendenceType ??
                null,
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
          const body: any =
            response &&
            typeof response === "object" &&
            "data" in response
              ? (
                  response as GetEmployeeDetailResponse
                ).data ?? {}
              : response ?? {};
 
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
          result,
          error,
          employeeId
        ) => [
          {
            type: "Employees",
            id: employeeId,
          },
        ],
      }),
 
      /* ========================================================
         PENDING CANDIDATES
      ======================================================== */
 
      getPendingCandidates:
        builder.query<
          GetPendingCandidatesResponse,
          void
        >({
          query: () => ({
            url: "enrollment/employeedetails/pending-candidates",
            method: "GET",
          }),
 
          providesTags: ["Employees"],
        }),
 
      updatePendingCandidate:
        builder.mutation<
          MutationResponse,
          UpdatePendingCandidateParams
        >({
          query: ({
            candidateId,
            data,
          }) => ({
            url: `enrollment/employeedetails/pending-candidates/${candidateId}`,
            method: "PUT",
            body: data,
          }),
 
          invalidatesTags: ["Employees"],
        }),
 
      removePendingCandidate:
        builder.mutation<
          MutationResponse,
          string | number
        >({
          query: (candidateId) => ({
            url: `enrollment/employeedetails/pending-candidates/${candidateId}`,
            method: "DELETE",
          }),
 
          invalidatesTags: ["Employees"],
        }),
 
      /* ========================================================
         ORGANIZATION CHART
 
         BACKEND:
         POST /api/admin/employee-details/organization-chart
 
         IMPORTANT:
         Only the organization-chart implementation
         is changed here.
      ======================================================== */
 
      getOrganizationChart:
        builder.query<
          OrganizationChartDTO,
          GetOrganizationChartParams | void
        >({
          query: (params) => {
            const body: Record<
              string,
              unknown
            > = {};
 
            if (
              params?.rootEmployeeId !==
              undefined
            ) {
              body.rootEmployeeId =
                params.rootEmployeeId;
            }
 
            if (
              params?.search?.trim()
            ) {
              body.search =
                params.search.trim();
            }
 
            if (
              params?.branchId !==
              undefined
            ) {
              body.branchId =
                params.branchId;
            }
 
            return {
              url: "admin/employee-details/organization-chart",
              method: "POST",
              body,
            };
          },
 
          transformResponse: (
            response:
              | GetOrganizationChartResponse
              | OrganizationChartDTO
          ): OrganizationChartDTO => {
            const responseAny =
              response as any;
 
            /*
             * Backend response can be:
             *
             * {
             *   success: true,
             *   data: {
             *     OrganizationName: "...",
             *     TotalStrength: 10,
             *     TeamLabel: "...",
             *     Employees: [...]
             *   }
             * }
             *
             * OR:
             *
             * {
             *   OrganizationName: "...",
             *   TotalStrength: 10,
             *   TeamLabel: "...",
             *   Employees: [...]
             * }
             */
 
            const data =
              responseAny?.data &&
              typeof responseAny.data ===
                "object"
                ? responseAny.data
                : responseAny;
 
            const employees =
              Array.isArray(data)
                ? data
                : Array.isArray(data?.Employees)
                  ? data.Employees
                  : [];
 
            return {
              OrganizationName:
                data?.OrganizationName ??
                "",
 
              TotalStrength:
                Number(
                  data?.TotalStrength ??
                    employees.length
                ),
 
              TeamLabel:
                data?.TeamLabel ?? null,
 
              Employees:
                employees.map(
                  (employee: any) => ({
                    EmployeeID:
                      employee?.EmployeeID ??
                      employee?.["Employee ID"],
 
                    EmployeeName:
                      employee?.EmployeeName ??
                      employee?.["Employee Name"] ??
                      "",
 
                    DesignationName:
                      employee?.DesignationName ??
                      employee?.Designation ??
                      null,
 
                    ProfilePhoto:
                      employee?.ProfilePhoto ??
                      employee?.ProfilePhotoUrl ??
                      null,
 
                    ReportingAuthorityID:
                      employee?.ReportingAuthorityID ??
                      employee?.["Manager ID"] ??
                      null,
                  })
                ),
            };
          },
 
          providesTags: ["Employees"],
        }),
 
      /* ========================================================
         BLOCKED USERS
      ======================================================== */
 
      getBlockedUsers:
        builder.query<
          GetBlockedUsersResponse,
          GetBlockedUsersParams
        >({
          query: ({
            search,
            page,
            pageSize,
          }) => ({
            url: "enrollment/employeedetails/blocked-users",
            method: "GET",
            params: {
              search:
                search || undefined,
              page,
              pageSize,
            },
          }),
 
          providesTags: ["Employees"],
        }),
 
      unblockUsers:
        builder.mutation<
          MutationResponse,
          UnblockUsersParams
        >({
          query: ({
            employeeIds,
          }) => ({
            url: "enrollment/employeedetails/blocked-users/unblock",
            method: "POST",
            body: {
              employeeIds,
            },
          }),
 
          invalidatesTags: ["Employees"],
        }),
 
      getBlockedUserAuditLog:
        builder.query<
          GetAuditLogResponse,
          void
        >({
          query: () => ({
            url: "enrollment/employeedetails/blocked-users/audit-log",
            method: "GET",
          }),
 
          providesTags: ["Employees"],
        }),
 
      /* ========================================================
         IMPORT
      ======================================================== */
 
      downloadEmployeeTemplate:
        builder.query<
          Blob,
          string
        >({
          query: (templateType) => ({
            url: "enrollment/employeedetails/import/template",
            method: "GET",
            params: {
              templateType,
            },
            responseHandler: (
              response: Response
            ) => response.blob(),
          }),
        }),
 
      uploadEmployeeDetails:
        builder.mutation<
          MutationResponse,
          {
            file: File;
            templateType: string;
          }
        >({
          query: ({
            file,
            templateType,
          }) => {
            const formData =
              new FormData();
 
            formData.append(
              "file",
              file
            );
 
            formData.append(
              "templateType",
              templateType
            );
 
            return {
              url: "enrollment/employeedetails/import/upload",
              method: "POST",
              body: formData,
            };
          },
 
          invalidatesTags: ["Employees"],
        }),
 
      /* ========================================================
         CREATE EMPLOYEE
      ======================================================== */
 
      createEmployee:
        builder.mutation<
          MutationResponse,
          Record<string, unknown>
        >({
          query: (employeeData) => ({
            url: "enrollment/employeedetails/employees",
            method: "POST",
            body: employeeData,
          }),
 
          invalidatesTags: ["Employees"],
        }),
    }),
  });
 
/* ============================================================
   EXPORT HOOKS
============================================================ */
 
export const {
  useGetEmployeesQuery,
  useGetEmployeeDetailQuery,
 
  useGetPendingCandidatesQuery,
  useUpdatePendingCandidateMutation,
  useRemovePendingCandidateMutation,
 
  useGetOrganizationChartQuery,
 
  useGetBlockedUsersQuery,
  useUnblockUsersMutation,
  useGetBlockedUserAuditLogQuery,
 
  useLazyDownloadEmployeeTemplateQuery,
  useUploadEmployeeDetailsMutation,
 
  useCreateEmployeeMutation,
} = employeeDetailsApi;
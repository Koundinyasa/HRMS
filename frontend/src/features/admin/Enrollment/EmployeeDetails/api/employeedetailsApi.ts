import { baseApi } from "@/app/baseApi"; // adjust path to match your actual baseApi.ts location

/* ============================================================
   LIST (flags 1–6) — dashboard drill-through / EmployeePage1
============================================================ */

export type EmployeeFilterType =
  | "all" | "male" | "female" | "joined" | "left" | "confirmation-pending";

const FLAG_MAP: Record<EmployeeFilterType, number> = {
  all: 1,
  male: 2,
  female: 3,
  joined: 4,
  left: 5,
  "confirmation-pending": 6,
};

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
}

export interface EmployeeBasic {
  EmployeeID: number;
  EmployeeName: string;
  ReportingAuthorityName: string | null;
}

export interface EmployeeWithDate extends EmployeeBasic {
  JoiningDate?: string;
  ExitDate?: string;
}

export type Employee = EmployeeFull | EmployeeBasic | EmployeeWithDate;

export function isEmployeeFull(e: Employee): e is EmployeeFull {
  return "DesignationName" in e;
}

interface GetEmployeesParams {
  type: EmployeeFilterType;
  month?: number;
  year?: number;
}

interface GetEmployeesResponse {
  success: boolean;
  data?: Employee[];
  statusCode?: number;
  message?: string;
}

/* ============================================================
   DETAIL (single employee) — EmployeeDetailsPage
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
   INJECTED ENDPOINTS
============================================================ */

export const employeeDetailsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeesByFilter: builder.query<GetEmployeesResponse, GetEmployeesParams>({
      query: ({ type, month, year }) => {
        const flag = FLAG_MAP[type];
        const needsDate = type === "joined" || type === "left";
        return {
          url: `enrollment/employeedetails/employees`,
          params: { flag, ...(needsDate ? { month, year } : {}) },
        };
      },
      providesTags: ["Employees"],
    }),

    getEmployeeDetail: builder.query<GetEmployeeDetailResponse, string>({
      query: (employeeId) => `enrollment/employeedetails/details/${employeeId}`,
      providesTags: (result, error, employeeId) => [{ type: "Employees", id: employeeId }],
    }),
  }),
});

export const { useGetEmployeesByFilterQuery, useGetEmployeeDetailQuery } = employeeDetailsApi;
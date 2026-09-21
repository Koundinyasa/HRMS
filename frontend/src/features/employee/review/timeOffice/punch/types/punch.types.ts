// // // // export type ViewType =
// // // //   | "SingleDate"
// // // //   | "CustomWeek"
// // // //   | "CustomMonth";

// // // // export type PunchDirection =
// // // //   | "IN"
// // // //   | "OUT";

// // // // /* =========================================================
// // // //    REPORTING EMPLOYEE
// // // //    ========================================================= */

// // // // export interface ReportingEmployee {
// // // //   employeeId: string;
// // // //   employeeName: string;

// // // //   companyId?: number | null;
// // // //   designation?: string | null;
// // // //   department?: string | null;

// // // //   // Actual backend field names
// // // //   EmployeeID?: string | number;
// // // //   EmployeeName?: string;
// // // //   CompanyID?: number;
// // // //   Designation?: string;
// // // //   Department?: string;

// // // //   [key: string]: unknown;
// // // // }

// // // // /* =========================================================
// // // //    EMPLOYEE PROFILE
// // // //    ========================================================= */

// // // // export interface EmployeeProfile {
// // // //   // Normalized frontend fields
// // // //   employeeId: string;
// // // //   employeeName: string;

// // // //   designation?: string | null;
// // // //   department?: string | null;

// // // //   reportingAuthorityCode?: string | null;
// // // //   reportingAuthorityName?: string | null;

// // // //   policyName?: string | null;
// // // //   doublePunchPolicy?: string | null;

// // // //   shiftName?: string | null;
// // // //   shiftTiming?: string | null;

// // // //   // Actual backend response fields
// // // //   EmployeeInternalID?: number;
// // // //   EmployeeCode?: string;
// // // //   EmployeeName?: string;
// // // //   ReportingAuthority?: string;

// // // //   PolicyName?: string;
// // // //   PunchTypeRule?: string;

// // // //   CurrentShiftCode?: string;
// // // //   CurrentShiftName?: string;
// // // //   ShiftTiming?: string;

// // // //   [key: string]: unknown;
// // // // }

// // // // /* =========================================================
// // // //    ATTENDANCE SUMMARY
// // // //    ========================================================= */

// // // // export interface AttendanceSummary {
// // // //   // Normalized frontend fields
// // // //   date: string;
// // // //   shift: string;
// // // //   firstHalf: string;
// // // //   secondHalf: string;
// // // //   dayStatus: string;

// // // //   // Allow actual backend fields if they differ
// // // //   Date?: string;
// // // //   Shift?: string;
// // // //   FirstHalf?: string;
// // // //   SecondHalf?: string;
// // // //   DayStatus?: string;

// // // //   [key: string]: unknown;
// // // // }

// // // // /* =========================================================
// // // //    PUNCH RECORD
// // // //    ========================================================= */

// // // // export interface PunchRecord {
// // // //   punchId: string | number;

// // // //   direction: PunchDirection;

// // // //   originalTime: string;
// // // //   correctedTime: string;

// // // //   remarks?: string | null;

// // // //   location?: string | null;

// // // //   latitude?: number | null;
// // // //   longitude?: number | null;

// // // //   selfieUrl?: string | null;

// // // //   device?: string | null;

// // // //   punchDate?: string | null;

// // // //   // Possible actual backend field names
// // // //   PunchID?: string | number;
// // // //   PunchId?: string | number;

// // // //   PunchType?: string;
// // // //   Direction?: string;

// // // //   OriginalTime?: string;
// // // //   CorrectedTime?: string;

// // // //   Remarks?: string | null;

// // // //   Location?: string | null;

// // // //   Latitude?: number | null;
// // // //   Longitude?: number | null;

// // // //   SelfieURL?: string | null;
// // // //   SelfieUrl?: string | null;

// // // //   Device?: string | null;

// // // //   PunchDate?: string | null;

// // // //   [key: string]: unknown;
// // // // }

// // // // /* =========================================================
// // // //    RAW PUNCH
// // // //    ========================================================= */

// // // // export interface RawPunch {
// // // //   [key: string]: unknown;
// // // // }

// // // // /* =========================================================
// // // //    PUNCH DASHBOARD RESPONSE
// // // //    ========================================================= */

// // // // export interface EmployeePunchDashboardResponse {
// // // //   employeeProfile: EmployeeProfile[];

// // // //   attendanceSummary: AttendanceSummary[];

// // // //   punchRecords: PunchRecord[];
// // // // }

// // // // /* =========================================================
// // // //    PUNCH DASHBOARD PARAMETERS
// // // //    ========================================================= */

// // // // export interface PunchDashboardParams {
// // // //   employeeId: string;

// // // //   selectedDate?: string;

// // // //   viewType?: ViewType;
// // // // }

// // // // /* =========================================================
// // // //    PUNCH PAGE PROPS
// // // //    ========================================================= */

// // // // export interface PunchPageProps {
// // // //   employeeId?: string;
// // // // }

// // // // /* =========================================================
// // // //    PUNCH NAVIGATION STATE
// // // //    ========================================================= */

// // // // export interface PunchNavigationState {
// // // //   employeeId?: string;

// // // //   selectedDate?: string;
// // // // }

// // // // /* =========================================================
// // // //    EMPLOYEE PROFILE CARD PROPS
// // // //    ========================================================= */

// // // // export interface EmployeeProfileCardProps {
// // // //   profile: EmployeeProfile | null;
// // // // }

// // // // /* =========================================================
// // // //    ATTENDANCE SUMMARY TABLE PROPS
// // // //    ========================================================= */

// // // // export interface AttendanceSummaryTableProps {
// // // //   rows: AttendanceSummary[];

// // // //   isLoading: boolean;
// // // // }

// // // // /* =========================================================
// // // //    PUNCH RECORD CARD PROPS
// // // //    ========================================================= */

// // // // export interface PunchRecordCardProps {
// // // //   record: PunchRecord;

// // // //   correctedTime: string;

// // // //   remarks: string;

// // // //   isSaving: boolean;

// // // //   onCorrectedTimeChange: (
// // // //     value: string,
// // // //   ) => void;

// // // //   onRemarksChange: (
// // // //     value: string,
// // // //   ) => void;

// // // //   onSave: () => void;
// // // // }

// // // // /* =========================================================
// // // //    EDITABLE PUNCH
// // // //    ========================================================= */

// // // // export interface EditablePunch {
// // // //   correctedTime: string;

// // // //   remarks: string;
// // // // }

// // // // /* =========================================================
// // // //    PUNCH EDITS
// // // //    ========================================================= */

// // // // export interface PunchEdits {
// // // //   [punchId: string]: EditablePunch;
// // // // }

// // // // /* =========================================================
// // // //    UPDATE PUNCH PAYLOAD
// // // //    ========================================================= */

// // // // export interface UpdatePunchPayload {
// // // //   punchId: string | number;

// // // //   employeeId: string;

// // // //   correctedTime: string;

// // // //   remarks?: string;
// // // // }

// // // // /* =========================================================
// // // //    ADD PUNCH PAYLOAD
// // // //    ========================================================= */

// // // // export interface AddPunchPayload {
// // // //   employeeId: string;

// // // //   punchDate: string;

// // // //   punchTime: string;

// // // //   direction: PunchDirection;

// // // //   remarks?: string;
// // // // }

// // // // /* =========================================================
// // // //    REPORTING EMPLOYEES HOOK RESULT
// // // //    ========================================================= */

// // // // export interface UseReportingEmployeesResult {
// // // //   employees: ReportingEmployee[];

// // // //   isLoading: boolean;

// // // //   error: string | null;

// // // //   refetch: () => Promise<void>;
// // // // }

// // // // /* =========================================================
// // // //    PUNCH DASHBOARD HOOK RESULT
// // // //    ========================================================= */

// // // // export interface UsePunchDashboardResult {
// // // //   data: EmployeePunchDashboardResponse | null;

// // // //   isLoading: boolean;

// // // //   error: string | null;

// // // //   refetch: () => Promise<void>;
// // // // }

// // // // /* =========================================================
// // // //    PUNCH EDITOR HOOK RESULT
// // // //    ========================================================= */

// // // // export interface UsePunchEditorResult {
// // // //   edits: PunchEdits;

// // // //   savingId: string | number | null;

// // // //   saveError: string | null;

// // // //   updateField: (
// // // //     punchId: string | number,
// // // //     field: keyof EditablePunch,
// // // //     value: string,
// // // //   ) => void;

// // // //   saveRecord: (
// // // //     punchId: string | number,
// // // //   ) => Promise<void>;
// // // // }

// // // export type ViewType =
// // //   | "SingleDate"
// // //   | "CustomWeek"
// // //   | "CustomMonth";

// // // export type PunchDirection =
// // //   | "IN"
// // //   | "OUT";

// // // /* =========================================================
// // //    REPORTING EMPLOYEE
// // //    ========================================================= */

// // // export interface ReportingEmployee {
// // //   employeeId: string;
// // //   employeeName: string;

// // //   companyId?: number | null;
// // //   designation?: string | null;
// // //   department?: string | null;

// // //   EmployeeID?: string | number;
// // //   EmployeeName?: string;
// // //   CompanyID?: number;
// // //   Designation?: string;
// // //   Department?: string;

// // //   [key: string]: unknown;
// // // }

// // // /* =========================================================
// // //    EMPLOYEE PROFILE
// // //    ========================================================= */

// // // export interface EmployeeProfile {
// // //   employeeId: string;
// // //   employeeName: string;

// // //   designation?: string | null;
// // //   department?: string | null;

// // //   reportingAuthorityCode?: string | null;
// // //   reportingAuthorityName?: string | null;

// // //   policyName?: string | null;
// // //   doublePunchPolicy?: string | null;

// // //   shiftName?: string | null;
// // //   shiftTiming?: string | null;

// // //   /* Actual backend fields */

// // //   EmployeeInternalID?: number;

// // //   EmployeeCode?: string;

// // //   EmployeeName?: string;

// // //   ReportingAuthority?: string;

// // //   PolicyName?: string;

// // //   PunchTypeRule?: string;

// // //   CurrentShiftCode?: string;

// // //   CurrentShiftName?: string;

// // //   ShiftTiming?: string;

// // //   [key: string]: unknown;
// // // }

// // // /* =========================================================
// // //    ATTENDANCE SUMMARY
// // //    ========================================================= */

// // // export interface AttendanceSummary {
// // //   /* Frontend normalized fields */

// // //   date: string;

// // //   shift: string;

// // //   firstHalf: string;

// // //   secondHalf: string;

// // //   dayStatus: string;

// // //   /* Actual backend fields */

// // //   AttendanceDate?: string;

// // //   FormattedDate?: string;

// // //   Shift?: string;

// // //   FirstHalf?: string;

// // //   SecondHalf?: string;

// // //   DayStatus?: string;

// // //   [key: string]: unknown;
// // // }

// // // /* =========================================================
// // //    PUNCH RECORD
// // //    ========================================================= */

// // // export interface PunchRecord {
// // //   /* Frontend normalized fields */

// // //   punchId: string | number;

// // //   direction: PunchDirection;

// // //   originalTime: string;

// // //   correctedTime: string;

// // //   remarks?: string | null;

// // //   location?: string | null;

// // //   latitude?: number | null;

// // //   longitude?: number | null;

// // //   selfieUrl?: string | null;

// // //   device?: string | null;

// // //   punchDate?: string | null;

// // //   /* Actual backend fields */

// // //   PunchID?: string | number;

// // //   EmployeeID?: string | number;

// // //   PunchType?: number;

// // //   CaptureSource?: number;

// // //   VerificationStatus?: string;

// // //   OriginalTime?: string;

// // //   CorrectedTime?: string;

// // //   LocationAddress?: string;

// // //   GPS?: string;

// // //   [key: string]: unknown;
// // // }

// // // /* =========================================================
// // //    RAW PUNCH
// // //    ========================================================= */

// // // export interface RawPunch {
// // //   [key: string]: unknown;
// // // }

// // // /* =========================================================
// // //    DASHBOARD RESPONSE
// // //    ========================================================= */

// // // export interface EmployeePunchDashboardResponse {
// // //   employeeProfile: EmployeeProfile[];

// // //   attendanceSummary: AttendanceSummary[];

// // //   punchRecords: PunchRecord[];
// // // }

// // // /* =========================================================
// // //    DASHBOARD PARAMS
// // //    ========================================================= */

// // // export interface PunchDashboardParams {
// // //   employeeId: string;

// // //   selectedDate?: string;

// // //   viewType?: ViewType;
// // // }

// // // /* =========================================================
// // //    PAGE PROPS
// // //    ========================================================= */

// // // export interface PunchPageProps {
// // //   employeeId?: string;
// // // }

// // // /* =========================================================
// // //    NAVIGATION STATE
// // //    ========================================================= */

// // // export interface PunchNavigationState {
// // //   employeeId?: string;

// // //   selectedDate?: string;
// // // }

// // // /* =========================================================
// // //    PROFILE CARD PROPS
// // //    ========================================================= */

// // // export interface EmployeeProfileCardProps {
// // //   profile: EmployeeProfile | null;
// // // }

// // // /* =========================================================
// // //    ATTENDANCE TABLE PROPS
// // //    ========================================================= */

// // // export interface AttendanceSummaryTableProps {
// // //   rows: AttendanceSummary[];

// // //   isLoading: boolean;
// // // }

// // // /* =========================================================
// // //    PUNCH RECORD CARD PROPS
// // //    ========================================================= */

// // // export interface PunchRecordCardProps {
// // //   record: PunchRecord;

// // //   correctedTime: string;

// // //   remarks: string;

// // //   isSaving: boolean;

// // //   onCorrectedTimeChange: (
// // //     value: string,
// // //   ) => void;

// // //   onRemarksChange: (
// // //     value: string,
// // //   ) => void;

// // //   onSave: () => void;
// // // }

// // // /* =========================================================
// // //    EDITABLE PUNCH
// // //    ========================================================= */

// // // export interface EditablePunch {
// // //   correctedTime: string;

// // //   remarks: string;
// // // }

// // // /* =========================================================
// // //    PUNCH EDITS
// // //    ========================================================= */

// // // export interface PunchEdits {
// // //   [punchId: string]: EditablePunch;
// // // }

// // // /* =========================================================
// // //    UPDATE PUNCH
// // //    ========================================================= */

// // // export interface UpdatePunchPayload {
// // //   punchId: string | number;

// // //   employeeId: string;

// // //   correctedTime: string;

// // //   remarks?: string;
// // // }

// // // /* =========================================================
// // //    ADD PUNCH
// // //    ========================================================= */

// // // export interface AddPunchPayload {
// // //   employeeId: string;

// // //   punchDate: string;

// // //   punchTime: string;

// // //   direction: PunchDirection;

// // //   remarks?: string;
// // // }

// // // /* =========================================================
// // //    REPORTING EMPLOYEE HOOK
// // //    ========================================================= */

// // // export interface UseReportingEmployeesResult {
// // //   employees: ReportingEmployee[];

// // //   isLoading: boolean;

// // //   error: string | null;

// // //   refetch: () => Promise<void>;
// // // }

// // // /* =========================================================
// // //    DASHBOARD HOOK
// // //    ========================================================= */

// // // export interface UsePunchDashboardResult {
// // //   data: EmployeePunchDashboardResponse | null;

// // //   isLoading: boolean;

// // //   error: string | null;

// // //   refetch: () => Promise<void>;
// // // }

// // // /* =========================================================
// // //    PUNCH EDITOR HOOK
// // //    ========================================================= */

// // // export interface UsePunchEditorResult {
// // //   edits: PunchEdits;

// // //   savingId: string | number | null;

// // //   saveError: string | null;

// // //   updateField: (
// // //     punchId: string | number,
// // //     field: keyof EditablePunch,
// // //     value: string,
// // //   ) => void;

// // //   saveRecord: (
// // //     punchId: string | number,
// // //   ) => Promise<void>;
// // // }

// // export type ViewType =
// //   | "SingleDate"
// //   | "CustomWeek"
// //   | "CustomMonth";

// // export type PunchDirection =
// //   | "IN"
// //   | "OUT";

// // /* =========================================================
// //    REPORTING EMPLOYEE
// // ========================================================= */

// // export interface ReportingEmployee {
// //   /*
// //    * Internal database ID.
// //    * This is used when calling the Punch Dashboard API.
// //    */
// //   employeeInternalId?: string | number | null;

// //   /*
// //    * Employee code shown in the dropdown.
// //    * Example: KTS164211
// //    */
// //   employeeCode?: string | null;

// //   /*
// //    * Existing normalized employee ID.
// //    * Kept for compatibility with existing components.
// //    */
// //   employeeId: string;

// //   /*
// //    * Employee name.
// //    */
// //   employeeName: string;

// //   companyId?: number | null;
// //   designation?: string | null;
// //   department?: string | null;

// //   /*
// //    * Actual backend fields.
// //    */
// //   EmployeeInternalID?: string | number | null;

// //   EmployeeID?: string | number | null;

// //   EmployeeCode?: string | null;

// //   EmployeeName?: string | null;

// //   CompanyID?: number | null;

// //   Designation?: string | null;

// //   Department?: string | null;

// //   [key: string]: unknown;
// // }


// // /* =========================================================
// //    EMPLOYEE PROFILE
// // ========================================================= */

// // export interface EmployeeProfile {
// //   employeeId: string;

// //   employeeName: string;

// //   designation?: string | null;

// //   department?: string | null;

// //   reportingAuthorityCode?: string | null;

// //   reportingAuthorityName?: string | null;

// //   policyName?: string | null;

// //   doublePunchPolicy?: string | null;

// //   shiftName?: string | null;

// //   shiftTiming?: string | null;

// //   /*
// //    * Actual backend fields
// //    */

// //   EmployeeInternalID?: number;

// //   EmployeeCode?: string;

// //   EmployeeName?: string;

// //   ReportingAuthority?: string;

// //   PolicyName?: string;

// //   PunchTypeRule?: string;

// //   CurrentShiftCode?: string;

// //   CurrentShiftName?: string;

// //   ShiftTiming?: string;

// //   [key: string]: unknown;
// // }


// // /* =========================================================
// //    ATTENDANCE SUMMARY
// // ========================================================= */

// // export interface AttendanceSummary {
// //   /*
// //    * Frontend normalized fields
// //    */

// //   date: string;

// //   shift: string;

// //   firstHalf: string;

// //   secondHalf: string;

// //   dayStatus: string;

// //   /*
// //    * Actual backend fields
// //    */

// //   AttendanceDate?: string;

// //   FormattedDate?: string;

// //   Date?: string;

// //   Shift?: string;

// //   FirstHalf?: string;

// //   SecondHalf?: string;

// //   DayStatus?: string;

// //   [key: string]: unknown;
// // }


// // /* =========================================================
// //    PUNCH RECORD
// // ========================================================= */

// // export interface PunchRecord {
// //   /*
// //    * Frontend normalized fields
// //    */

// //   punchId: string | number;

// //   direction: PunchDirection;

// //   originalTime: string;

// //   correctedTime: string;

// //   remarks?: string | null;

// //   location?: string | null;

// //   latitude?: number | null;

// //   longitude?: number | null;

// //   selfieUrl?: string | null;

// //   device?: string | null;

// //   punchDate?: string | null;

// //   /*
// //    * Actual backend fields
// //    */

// //   PunchID?: string | number;

// //   PunchId?: string | number;

// //   EmployeeID?: string | number;

// //   PunchType?: number | string;

// //   CaptureSource?: number | string;

// //   VerificationStatus?: string;

// //   Direction?: string;

// //   OriginalTime?: string;

// //   CorrectedTime?: string;

// //   Remarks?: string | null;

// //   Location?: string | null;

// //   LocationAddress?: string | null;

// //   GPS?: string | null;

// //   SelfieURL?: string | null;

// //   SelfieUrl?: string | null;

// //   Device?: string | null;

// //   PunchDate?: string | null;

// //   [key: string]: unknown;
// // }


// // /* =========================================================
// //    RAW PUNCH
// // ========================================================= */

// // export interface RawPunch {
// //   [key: string]: unknown;
// // }


// // /* =========================================================
// //    DASHBOARD RESPONSE
// // ========================================================= */

// // export interface EmployeePunchDashboardResponse {
// //   employeeProfile: EmployeeProfile[];

// //   attendanceSummary: AttendanceSummary[];

// //   punchRecords: PunchRecord[];
// // }


// // /* =========================================================
// //    DASHBOARD PARAMS
// // ========================================================= */

// // export interface PunchDashboardParams {
// //   /*
// //    * IMPORTANT:
// //    * This must contain EmployeeInternalID.
// //    */
// //   employeeId: string;

// //   selectedDate?: string;

// //   viewType?: ViewType;
// // }


// // /* =========================================================
// //    PAGE PROPS
// // ========================================================= */

// // export interface PunchPageProps {
// //   employeeId?: string;
// // }


// // /* =========================================================
// //    NAVIGATION STATE
// // ========================================================= */

// // export interface PunchNavigationState {
// //   /*
// //    * This stores the internal employee ID.
// //    */
// //   employeeId?: string;

// //   selectedDate?: string;
// // }


// // /* =========================================================
// //    PROFILE CARD PROPS
// // ========================================================= */

// // export interface EmployeeProfileCardProps {
// //   profile: EmployeeProfile | null;
// // }


// // /* =========================================================
// //    ATTENDANCE TABLE PROPS
// // ========================================================= */

// // export interface AttendanceSummaryTableProps {
// //   rows: AttendanceSummary[];

// //   isLoading: boolean;
// // }


// // /* =========================================================
// //    PUNCH RECORD CARD PROPS
// // ========================================================= */

// // export interface PunchRecordCardProps {
// //   record: PunchRecord;

// //   correctedTime: string;

// //   remarks: string;

// //   isSaving: boolean;

// //   onCorrectedTimeChange: (
// //     value: string,
// //   ) => void;

// //   onRemarksChange: (
// //     value: string,
// //   ) => void;

// //   onSave: () => void;
// // }


// // /* =========================================================
// //    EDITABLE PUNCH
// // ========================================================= */

// // export interface EditablePunch {
// //   correctedTime: string;

// //   remarks: string;
// // }


// // /* =========================================================
// //    PUNCH EDITS
// // ========================================================= */

// // export interface PunchEdits {
// //   [punchId: string]: EditablePunch;
// // }


// // /* =========================================================
// //    UPDATE PUNCH
// // ========================================================= */

// // export interface UpdatePunchPayload {
// //   punchId: string | number;

// //   employeeId: string;

// //   correctedTime: string;

// //   remarks?: string;
// // }


// // /* =========================================================
// //    ADD PUNCH
// // ========================================================= */

// // export interface AddPunchPayload {
// //   employeeId: string;

// //   punchDate: string;

// //   punchTime: string;

// //   direction: PunchDirection;

// //   remarks?: string;
// // }


// // /* =========================================================
// //    REPORTING EMPLOYEE HOOK
// // ========================================================= */

// // export interface UseReportingEmployeesResult {
// //   employees: ReportingEmployee[];

// //   isLoading: boolean;

// //   error: string | null;

// //   refetch: () => Promise<void>;
// // }


// // /* =========================================================
// //    DASHBOARD HOOK
// // ========================================================= */

// // export interface UsePunchDashboardResult {
// //   data: EmployeePunchDashboardResponse | null;

// //   isLoading: boolean;

// //   error: string | null;

// //   refetch: () => Promise<void>;
// // }


// // /* =========================================================
// //    PUNCH EDITOR HOOK
// // ========================================================= */

// // export interface UsePunchEditorResult {
// //   edits: PunchEdits;

// //   savingId: string | number | null;

// //   saveError: string | null;

// //   updateField: (
// //     punchId: string | number,
// //     field: keyof EditablePunch,
// //     value: string,
// //   ) => void;

// //   saveRecord: (
// //     punchId: string | number,
// //   ) => Promise<void>;
// // }

// export type ViewType =
//   | "SingleDate"
//   | "CustomWeek"
//   | "CustomMonth";

// export type PunchDirection =
//   | "IN"
//   | "OUT";


// /* =========================================================
//    REPORTING EMPLOYEE
// ========================================================= */

// export interface ReportingEmployee {

//   /* =========================================
//      INTERNAL DATABASE ID
//      Example: 4
//   ========================================= */

//   employeeInternalId?:
//     | string
//     | number
//     | null;

//   EmployeeInternalID?:
//     | string
//     | number
//     | null;


//   /* =========================================
//      EMPLOYEE CODE
//      Example: 284519
//   ========================================= */

//   employeeCode?:
//     | string
//     | null;

//   EmployeeCode?:
//     | string
//     | null;


//   /* =========================================
//      FRONTEND COMPATIBILITY
//   ========================================= */

//   employeeId: string;

//   employeeName: string;


//   /* =========================================
//      BACKEND FIELDS
//   ========================================= */

//   EmployeeID?:
//     | string
//     | number
//     | null;

//   EmployeeName?:
//     | string
//     | null;

//   CompanyID?:
//     | number
//     | null;

//   Designation?:
//     | string
//     | null;

//   Department?:
//     | string
//     | null;


//   companyId?:
//     | number
//     | null;

//   designation?:
//     | string
//     | null;

//   department?:
//     | string
//     | null;


//   [key: string]: unknown;
// }


// /* =========================================================
//    EMPLOYEE PROFILE
// ========================================================= */

// export interface EmployeeProfile {

//   employeeId: string;

//   employeeName: string;

//   designation?:
//     | string
//     | null;

//   department?:
//     | string
//     | null;

//   reportingAuthorityCode?:
//     | string
//     | null;

//   reportingAuthorityName?:
//     | string
//     | null;

//   policyName?:
//     | string
//     | null;

//   doublePunchPolicy?:
//     | string
//     | null;

//   shiftName?:
//     | string
//     | null;

//   shiftTiming?:
//     | string
//     | null;


//   EmployeeInternalID?:
//     | number
//     | string;

//   EmployeeCode?:
//     | string
//     | number;

//   EmployeeName?:
//     | string;

//   ReportingAuthority?:
//     | string;

//   PolicyName?:
//     | string;

//   PunchTypeRule?:
//     | string;

//   CurrentShiftCode?:
//     | string;

//   CurrentShiftName?:
//     | string;

//   ShiftTiming?:
//     | string;


//   [key: string]: unknown;
// }


// /* =========================================================
//    ATTENDANCE
// ========================================================= */

// export interface AttendanceSummary {

//   date: string;

//   shift: string;

//   firstHalf: string;

//   secondHalf: string;

//   dayStatus: string;


//   AttendanceDate?:
//     | string;

//   FormattedDate?:
//     | string;

//   Date?:
//     | string;

//   Shift?:
//     | string;

//   FirstHalf?:
//     | string;

//   SecondHalf?:
//     | string;

//   DayStatus?:
//     | string;


//   [key: string]: unknown;
// }


// /* =========================================================
//    PUNCH RECORD
// ========================================================= */

// export interface PunchRecord {

//   punchId:
//     | string
//     | number;

//   direction:
//     | "IN"
//     | "OUT";

//   originalTime: string;

//   correctedTime: string;

//   remarks?:
//     | string
//     | null;

//   location?:
//     | string
//     | null;

//   latitude?:
//     | number
//     | null;

//   longitude?:
//     | number
//     | null;

//   selfieUrl?:
//     | string
//     | null;

//   device?:
//     | string
//     | null;

//   punchDate?:
//     | string
//     | null;


//   PunchID?:
//     | string
//     | number;

//   EmployeeID?:
//     | string
//     | number;

//   PunchType?:
//     | string
//     | number;

//   CaptureSource?:
//     | string
//     | number;

//   VerificationStatus?:
//     | string;

//   OriginalTime?:
//     | string;

//   CorrectedTime?:
//     | string;

//   LocationAddress?:
//     | string
//     | null;

//   GPS?:
//     | string
//     | null;

//   [key: string]: unknown;
// }


// /* =========================================================
//    RAW PUNCH
// ========================================================= */

// export interface RawPunch {
//   [key: string]: unknown;
// }


// /* =========================================================
//    DASHBOARD RESPONSE
// ========================================================= */

// export interface EmployeePunchDashboardResponse {

//   employeeProfile:
//     EmployeeProfile[];

//   attendanceSummary:
//     AttendanceSummary[];

//   punchRecords:
//     PunchRecord[];
// }


// /* =========================================================
//    DASHBOARD PARAMS
// ========================================================= */

// export interface PunchDashboardParams {

//   /*
//    * IMPORTANT:
//    *
//    * This is EmployeeInternalID.
//    *
//    * Example:
//    * 4
//    */

//   employeeId: string;

//   selectedDate?: string;

//   viewType?: ViewType;
// }


// /* =========================================================
//    PAGE PROPS
// ========================================================= */

// export interface PunchPageProps {

//   /*
//    * This may be an external route ID.
//    * PunchPage will resolve it against
//    * reporting employees.
//    */

//   employeeId?: string;
// }


// /* =========================================================
//    NAVIGATION STATE
// ========================================================= */

// export interface PunchNavigationState {

//   employeeId?: string;

//   selectedDate?: string;
// }


// /* =========================================================
//    EDITABLE PUNCH
// ========================================================= */

// export interface EditablePunch {

//   correctedTime: string;

//   remarks: string;
// }


// /* =========================================================
//    PUNCH EDITS
// ========================================================= */

// export interface PunchEdits {

//   [punchId: string]:
//     EditablePunch;
// }


// /* =========================================================
//    UPDATE PUNCH
// ========================================================= */

// export interface UpdatePunchPayload {

//   punchId:
//     | string
//     | number;

//   employeeId: string;

//   correctedTime: string;

//   remarks?: string;
// }


// /* =========================================================
//    ADD PUNCH
// ========================================================= */

// export interface AddPunchPayload {

//   employeeId: string;

//   punchDate: string;

//   punchTime: string;

//   direction:
//     | "IN"
//     | "OUT";

//   remarks?: string;
// }


// /* =========================================================
//    REPORTING EMPLOYEE HOOK
// ========================================================= */

// export interface UseReportingEmployeesResult {

//   employees:
//     ReportingEmployee[];

//   isLoading: boolean;

//   error:
//     | string
//     | null;

//   refetch:
//     () => Promise<void>;
// }


// /* =========================================================
//    DASHBOARD HOOK
// ========================================================= */

// export interface UsePunchDashboardResult {

//   data:
//     | EmployeePunchDashboardResponse
//     | null;

//   isLoading: boolean;

//   error:
//     | string
//     | null;

//   refetch:
//     () => Promise<void>;
// }


// /* =========================================================
//    PUNCH EDITOR
// ========================================================= */

// export interface UsePunchEditorResult {

//   edits: PunchEdits;

//   savingId:
//     | string
//     | number
//     | null;

//   saveError:
//     | string
//     | null;

//   updateField: (
//     punchId:
//       | string
//       | number,
//     field:
//       | keyof EditablePunch,
//     value: string,
//   ) => void;

//   saveRecord: (
//     punchId:
//       | string
//       | number,
//   ) => Promise<void>;
// }

/* =========================================================
   VIEW TYPE
========================================================= */

export type ViewType =
  | "SingleDate"
  | "CustomWeek"
  | "CustomMonth";


/* =========================================================
   PUNCH DIRECTION
========================================================= */

export type PunchDirection =
  | "IN"
  | "OUT";


/* =========================================================
   REPORTING EMPLOYEE
========================================================= */

export interface ReportingEmployee {

  /*
   * IMPORTANT:
   *
   * Dashboard API requires EmployeeInternalID.
   *
   * Example:
   *
   * EmployeeInternalID = 4
   */

  employeeInternalId?:
    | string
    | number
    | null;

  EmployeeInternalID?:
    | string
    | number
    | null;


  /*
   * Employee Code
   *
   * Example:
   *
   * 284519
   */

  employeeCode?:
    | string
    | null;

  EmployeeCode?:
    | string
    | number
    | null;


  /*
   * Existing frontend employee ID
   */

  employeeId:
    string;


  /*
   * Backend EmployeeID
   */

  EmployeeID?:
    | string
    | number
    | null;


  /*
   * Employee Name
   */

  employeeName:
    string;

  EmployeeName?:
    | string
    | null;


  /*
   * Company
   */

  companyId?:
    | number
    | null;

  CompanyID?:
    | string
    | number
    | null;


  /*
   * Other employee information
   */

  designation?:
    | string
    | null;

  Designation?:
    | string
    | null;


  department?:
    | string
    | null;

  Department?:
    | string
    | null;


  /*
   * Allow additional backend properties
   */

  [key: string]: unknown;
}


/* =========================================================
   EMPLOYEE PROFILE
========================================================= */

export interface EmployeeProfile {

  /* Frontend normalized */

  employeeId:
    string;

  employeeName:
    string;

  designation?:
    | string
    | null;

  department?:
    | string
    | null;

  reportingAuthorityCode?:
    | string
    | null;

  reportingAuthorityName?:
    | string
    | null;

  policyName?:
    | string
    | null;

  doublePunchPolicy?:
    | string
    | null;

  shiftName?:
    | string
    | null;

  shiftTiming?:
    | string
    | null;


  /* Backend */

  EmployeeInternalID?:
    | string
    | number
    | null;

  EmployeeCode?:
    | string
    | number
    | null;

  EmployeeName?:
    | string
    | null;

  ReportingAuthority?:
    | string
    | null;

  ReportingAuthorityName?:
    | string
    | null;

  PolicyName?:
    | string
    | null;

  PunchTypeRule?:
    | string
    | null;

  CurrentShiftCode?:
    | string
    | null;

  CurrentShiftName?:
    | string
    | null;

  ShiftTiming?:
    | string
    | null;


  [key: string]: unknown;
}


/* =========================================================
   ATTENDANCE SUMMARY
========================================================= */

export interface AttendanceSummary {

  /* Normalized */

  date:
    string;

  shift:
    string;

  firstHalf:
    string;

  secondHalf:
    string;

  dayStatus:
    string;


  /* Backend */

  AttendanceDate?:
    string
    | null;

  FormattedDate?:
    string
    | null;

  Date?:
    string
    | null;

  Shift?:
    string
    | null;

  FirstHalf?:
    string
    | null;

  SecondHalf?:
    string
    | null;

  DayStatus?:
    string
    | null;


  [key: string]: unknown;
}


/* =========================================================
   PUNCH RECORD
========================================================= */

export interface PunchRecord {

  /* =======================================================
     NORMALIZED FRONTEND FIELDS
  ======================================================= */

  punchId:
    string
    | number;

  direction:
    PunchDirection;

  originalTime:
    string;

  correctedTime:
    string;

  remarks:
    string;

  location:
    string;

  latitude:
    number
    | null;

  longitude:
    number
    | null;

  selfieUrl:
    string
    | null;

  device:
    string;

  punchDate:
    string
    | null;


  /* =======================================================
     ACTUAL BACKEND FIELDS
  ======================================================= */

  PunchID?:
    string
    | number;

  EmployeeID?:
    string
    | number;

  PunchType?:
    number
    | string
    | null;

  CaptureSource?:
    number
    | string
    | null;

  VerificationStatus?:
    string
    | null;

  OriginalTime?:
    string
    | null;

  CorrectedTime?:
    string
    | null;

  LocationAddress?:
    string
    | null;

  GPS?:
    string
    | null;

  Remarks?:
    string
    | null;

  Direction?:
    string
    | null;

  Device?:
    string
    | null;

  PunchDate?:
    string
    | null;

  Latitude?:
    number
    | null;

  Longitude?:
    number
    | null;

  SelfieURL?:
    string
    | null;

  SelfieUrl?:
    string
    | null;


  [key: string]: unknown;
}


/* =========================================================
   RAW PUNCH
========================================================= */

export interface RawPunch {
  [key: string]: unknown;
}


/* =========================================================
   DASHBOARD RESPONSE
========================================================= */

export interface EmployeePunchDashboardResponse {

  employeeProfile:
    EmployeeProfile[];

  attendanceSummary:
    AttendanceSummary[];

  punchRecords:
    PunchRecord[];
}


/* =========================================================
   DASHBOARD PARAMETERS
========================================================= */

export interface PunchDashboardParams {

  /*
   * IMPORTANT
   *
   * This is EmployeeInternalID.
   *
   * Example:
   *
   * employeeId: "4"
   */

  employeeId:
    string;

  selectedDate?:
    string;

  viewType?:
    ViewType;
}


/* =========================================================
   PAGE PROPS
========================================================= */

export interface PunchPageProps {

  employeeId?:
    string;
}


/* =========================================================
   NAVIGATION STATE
========================================================= */

export interface PunchNavigationState {

  employeeId?:
    string;

  selectedDate?:
    string;
}


/* =========================================================
   PROFILE CARD PROPS
========================================================= */

export interface EmployeeProfileCardProps {

  profile:
    EmployeeProfile
    | null;
}


/* =========================================================
   ATTENDANCE TABLE PROPS
========================================================= */

export interface AttendanceSummaryTableProps {

  rows:
    AttendanceSummary[];

  isLoading:
    boolean;
}


/* =========================================================
   PUNCH RECORD CARD PROPS
========================================================= */

export interface PunchRecordCardProps {

  record:
    PunchRecord;

  correctedTime:
    string;

  remarks:
    string;

  isSaving:
    boolean;

  onCorrectedTimeChange:
    (
      value: string,
    ) => void;

  onRemarksChange:
    (
      value: string,
    ) => void;

  onSave:
    () => void;
}


/* =========================================================
   EDITABLE PUNCH
========================================================= */

export interface EditablePunch {

  correctedTime:
    string;

  remarks:
    string;
}


/* =========================================================
   PUNCH EDITS
========================================================= */

export interface PunchEdits {

  [punchId: string]:
    EditablePunch;
}


/* =========================================================
   UPDATE PUNCH
========================================================= */

export interface UpdatePunchPayload {

  punchId:
    string
    | number;

  employeeId:
    string;

  correctedTime:
    string;

  remarks?:
    string;
}


/* =========================================================
   ADD PUNCH
========================================================= */

export interface AddPunchPayload {

  employeeId:
    string;

  punchDate:
    string;

  punchTime:
    string;

  direction:
    PunchDirection;

  remarks?:
    string;
}


/* =========================================================
   REPORTING EMPLOYEE HOOK
========================================================= */

export interface UseReportingEmployeesResult {

  employees:
    ReportingEmployee[];

  isLoading:
    boolean;

  error:
    string
    | null;

  refetch:
    () => Promise<void>;
}


/* =========================================================
   PUNCH DASHBOARD HOOK
========================================================= */

export interface UsePunchDashboardResult {

  data:
    | EmployeePunchDashboardResponse
    | null;

  isLoading:
    boolean;

  error:
    string
    | null;

  refetch:
    () => Promise<void>;
}
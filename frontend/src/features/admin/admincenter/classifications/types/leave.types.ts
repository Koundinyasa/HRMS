// ---- GET employee/leave/leavetypes ----
// Backend sends { ID, Name, Code, Description, AnnualQuota, ... } — mapped in leaveApi.
export interface LeaveType {
    leaveTypeId: number;
    name: string;
    code: string;
}

// ---- GET employee/leave/balance ----
// Backend sends { LeaveTypeId, OpeningBalance, Accrued, Availed, ClosingBalance }.
// It carries no leave code, so the rail joins it against LeaveType.
export interface LeaveBalanceRow {
    leaveTypeId: number;
    openingBalance: number;
    accrued: number;
    availed: number;
    closingBalance: number;
}

// What the Leave/Balance rail renders, after the join.
export interface LeaveBalance {
    leaveTypeId: number;
    code: string;
    balance: number;
}

// ---- GET employee/leave/history ----
// Backend returns { sections: [{ records: [{ fields: [{label, value}] }] }] } —
// flattened into rows in leaveApi.
export interface LeaveHistoryRow {
    id: string;
    leaveTypeName: string;
    fromDate: string;
    toDate: string;
    days: string;
    appliedDate: string;
    reason: string;
    status: string;
    approvedBy: string;
}

// ---- GET employee/leave/summary (no backend route yet) ----
export interface LeaveSummaryRow {
    code: string;
    opening: number | null;
    allotted: number | null;
    availed: number | null;
    lapsed: number | null;
    encashed: number | null;
    adjusted: number | null;
    balance: number | null;
}

// ---- Employee selector (no backend route yet) ----
export interface LeaveEmployee {
    employeeId: string;
    name: string;
    code: string;
    mobile?: string;
    email?: string;
    branch?: string;
    designation?: string;
    policyName?: string;
}

// ---- POST employee/leave/applyhr ----
export interface ApplyLeaveHrPayload {
    employeeId: string;
    leaveTypeId: string;
    fromDate: string;      // ISO yyyy-mm-dd
    toDate: string;
}

export type LeaveTab = 'apply' | 'summary' | 'history';

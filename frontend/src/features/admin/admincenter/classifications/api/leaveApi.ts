import { baseApi } from '@/app/baseApi';
import type {
    LeaveEmployee,
    LeaveType,
    LeaveBalanceRow,
    LeaveSummaryRow,
    LeaveHistoryRow,
    ApplyLeaveHrPayload,
} from '../types/leave.types';

// Nest mounts this controller at @Controller('employee/leave').
const BASE = 'employee/leave';

interface RawLeaveType {
    ID: number;
    Name: string;
    Code: string;
}

interface RawLeaveBalance {
    LeaveTypeId: number;
    OpeningBalance: number | null;
    Accrued: number | null;
    Availed: number | null;
    ClosingBalance: number | null;
    StatusCode?: number;
}

interface RawHistoryField {
    label: string;
    value: string | number | null;
}

interface RawHistory {
    sections?: { title: string; records: { fields: RawHistoryField[] }[] }[];
}

const byLabel = (fields: RawHistoryField[]) =>
    Object.fromEntries(fields.map((f) => [f.label, f.value ?? '']));

export const leaveApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getLeaveEmployees: builder.query<LeaveEmployee[], void>({
            query: () => `${BASE}/employees`,
            providesTags: [{ type: 'Leave', id: 'EMPLOYEES' }],
        }),

        getLeaveTypes: builder.query<LeaveType[], void>({
            query: () => `${BASE}/leavetypes`,
            transformResponse: (rows: RawLeaveType[]) =>
                (rows ?? []).map((r) => ({
                    leaveTypeId: Number(r.ID),
                    name: r.Name,
                    code: r.Code,
                })),
            providesTags: [{ type: 'Leave', id: 'TYPES' }],
        }),

        getLeaveBalance: builder.query<LeaveBalanceRow[], void>({
            query: () => `${BASE}/balance`,
            transformResponse: (rows: RawLeaveBalance[]) => {
                if (!rows?.length || rows[0].StatusCode !== undefined) return [];
                return rows.map((r) => ({
                    leaveTypeId: Number(r.LeaveTypeId),
                    openingBalance: Number(r.OpeningBalance ?? 0),
                    accrued: Number(r.Accrued ?? 0),
                    availed: Number(r.Availed ?? 0),
                    closingBalance: Number(r.ClosingBalance ?? 0),
                }));
            },
            providesTags: [{ type: 'Leave', id: 'BALANCE' }],
        }),

        
        getLeaveSummary: builder.query<LeaveSummaryRow[], void>({
            query: () => `${BASE}/summary`,
            providesTags: [{ type: 'Leave', id: 'SUMMARY' }],
        }),

    
        getLeaveHistory: builder.query<LeaveHistoryRow[], void>({
            query: () => `${BASE}/history`,
            transformResponse: (res: RawHistory) =>
                (res?.sections?.[0]?.records ?? []).map((rec, i) => {
                    const f = byLabel(rec.fields ?? []);
                    return {
                        id: String(i),
                        leaveTypeName: String(f['Leave Type'] ?? ''),
                        fromDate: String(f['From Date'] ?? ''),
                        toDate: String(f['To Date'] ?? ''),
                        days: String(f['Days'] ?? ''),
                        appliedDate: String(f['Applied Date'] ?? ''),
                        reason: String(f['Reason'] ?? ''),
                        status: String(f['Status'] ?? ''),
                        approvedBy: String(f['Approved By'] ?? ''),
                    };
                }),
            providesTags: [{ type: 'Leave', id: 'HISTORY' }],
        }),

        
        applyLeaveAsHr: builder.mutation<void, ApplyLeaveHrPayload>({
            query: (payload) => {
                const form = new FormData();
                form.append('employeeId', payload.employeeId);
                form.append('leaveTypeId', String(payload.leaveTypeId));
                form.append('fromDate', payload.fromDate);
                form.append('toDate', payload.toDate);
                return { url: `${BASE}/applyhr`, method: 'POST', body: form };
            },
            invalidatesTags: [
                { type: 'Leave', id: 'HISTORY' },
                { type: 'Leave', id: 'BALANCE' },
                { type: 'Leave', id: 'SUMMARY' },
            ],
        }),
    }),
});

export const {
    useGetLeaveEmployeesQuery,
    useGetLeaveTypesQuery,
    useGetLeaveBalanceQuery,
    useGetLeaveSummaryQuery,
    useGetLeaveHistoryQuery,
    useApplyLeaveAsHrMutation,
} = leaveApi;

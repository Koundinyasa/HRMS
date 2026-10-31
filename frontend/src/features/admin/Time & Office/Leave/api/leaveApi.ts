import { baseApi } from '@/app/baseApi';

interface LeaveAllotmentReportRequest {
    FromMonth: string;
    ToMonth: string;
    LeavePolicyId?: number;
}

interface LeaveAllotmentReportResponse {
    success: boolean;
    data: Record<string, unknown>[];
    message?: string;
}

interface LeaveReportRequest {
    path: string;
    method: 'GET' | 'POST';
    params?: Record<string, string>;
    body?: Record<string, unknown>;
}

interface LeaveReportResponse {
    success?: boolean;
    data?: unknown;
    message?: string;
}
 
export const attendanceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getLeaveAllotmentReport: builder.query<LeaveAllotmentReportResponse, LeaveAllotmentReportRequest>({
            query: (body) => ({
                url: 'admin/ta/leave/report/allotment',
                method: 'POST',
                body,
            })
        }),

        getReportData: builder.query<LeaveReportResponse, LeaveReportRequest>({
            query: ({ path, method, params, body }) => ({
                url: path,
                method,
                params,
                body,
            })
        }),
    })
})
 
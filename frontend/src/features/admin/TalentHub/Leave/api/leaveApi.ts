import { baseApi } from '@/app/baseApi';
import type { CreateLeaveAdjustment, ImportLeaveAdjustment, ManualAllotmentEmployee, UpdateManualAllotment, ApplyLeave, ImportDaily, Reprocess, SaveLeaveForm, ApproveRejectLeave, CreateHoliday, UpdateLeavePolicySettings } from '../types/leave.types';
 
export const attendanceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTalentHubLeaveTypes: builder.query<LeaveTypes, void>({
            query: () => 'admin/ta/leave/adjustment/leavetypes',
        }),
        getLeaveAdjustmentConfiguration: builder.query<LeaveAdjustmentConfiguration, void>({
            query: () => 'admin/ta/leave/adjustment/configuration/:leaveId',
        }),
 
        getEmployees: builder.query<Employees, void>({
            query: () => 'admin/ta/leave/adjustment/employees',
        }),
 
        getcreateLeaveAdjustment: builder.query<createLeaveAdjustment, void>({
            query: () => 'admin/ta/leave/adjustment/configuration'
        }),
 
        getLeavePolicies: builder.query<LeavePolicies, void>({
            query: () => 'admin/ta/leave/adjustment/manualallotment/policies'
        }),
 
        getPolicyLeaves: builder.query<getPolicyLeaves, void>({
            query: () => 'admin/ta/leave/adjustment/manualallotment/policies/:policyId/leaves'
        }),
 
        getEmployeeAllotments: builder.query<etEmployeeAllotments, void>({
            query: () => 'admin/ta/leave/adjustment/manualallotment/employees'
        }),
 
        updateManualAllotment: builder.query<updateManualAllotment, void>({
            query: () => 'admin/ta/leave/adjustment/manualallotment'
        }),
 
        getPayMonths: builder.query<getPayMonths, void>({
            query: () => 'admin/ta/leave/adjustment/import/paymonths'
        }),
 
        PostLeaveAdjustment: builder.query<LeaveAdjustment, void>({
            query: () => 'admin/ta/leave/adjustment/import'
        }),
        getPolicies: builder.query<PolarGraphicalItemSettings, void>({
            query: () => 'admin/ta/leave/daily/policies'
        }),
        getMonths: builder.query<Months, void>({
            query: () => 'admin/ta/leave/daily/months'
        }),
        getLeavetypes: builder.query<Leavetypes, void>({
            query: () => 'admin/ta/leave/daily/leavetypes'
        }),
        getEmployees: builder.query<LeaveTypes, void>({
            query: () => 'admin/ta/leave/daily/employees'
        }),
        getLeaveForm: builder.query<LeaveForm, void>({
            query: () => 'admin/ta/leave/daily/leaveform'
        }),
        PostsaveLeaveForm: builder.query<saveLeaveForm, void>({
            query: () => 'admin/ta/leave/daily/leaveform'
        }),
 
        PostapplyLeave: builder.query<applyLeave, void>({
            query: () => 'admin/ta/leave/daily/apply'
        }),
        Postreprocess: builder.query<reprocess, void>({
            query: () => 'admin/ta/leave/daily/reprocess'
        }),
 
        PostimportDailyLeave: builder.query<reprocess, void>({
            query: () => 'admin/ta/leave/daily/import'
        }),
 
        getLeaveApproval: builder.query<LeaveApproval, void>({
            query: () => 'admin/ta/leave/forceleaveapproval'
        }),
        PostapproveLeave: builder.query<approveLeave, void>({
            query: () => 'admin/ta/leave/forceleaveapproval/approve'
        }),
 
        PostrejectLeave: builder.query<rejectLeave, void>({
            query: () => 'admin/ta/leave/forceleaveapproval/reject'
        }),
 
        getHolidayMonths: builder.query<getHolidayMonths, void>({
            query: () => 'admin/ta/leave/holidaysettings/months'
        }),
 
        getHolidayList: builder.query<getHolidayList, void>({
            query: () => 'admin/ta/leave/holidaysettings/months/:monthId'
        }),
        PostcreateHoliday: builder.query<createHoliday, void>({
            query: () => 'admin/ta/leave/holidaysettings'
        }),
        getWeeklyOffList: builder.query<getWeeklyOffList, void>({
            query: () => 'admin/ta/leave/holidaysettings/weeklyoff'
        }),
        PostuploadHolidayFile: builder.query<uploadHolidayFile, void>({
            query: () => 'admin/ta/leave/holidaysettings/import'
        }),
        getMonths: builder.query<getMonths, void>({
            query: () => 'admin/ta/leave/report/months'
        }),
 
        getLeaveAllotmentReport: builder.query<getLeaveAllotmentReport, void>({
            query: () => 'admin/ta/leave/report/allotment'
        }),
 
        getAttendanceIndependentReport: builder.query<getAttendanceIndependentReport, void>({
            query: () => 'admin/ta/leave/report/attendanceindependent'
        }),
 
        getTopAttendanceReport: builder.query<getTopAttendanceReport, void>({
            query: () => 'admin/ta/leave/report/topattendance'
        }),
 
        getTopLeaveTakenReport: builder.query<getTopLeaveTakenReport, void>({
            query: () => 'admin/ta/leave/report/topleavetaken'
        }),
 
        getLeavePolicies: builder.query<getLeavePolicies, void>({
            query: () => 'admin/ta/leave/settings/policies'
        }),
 
        getPolicyLeaves: builder.query<getPolicyLeaves, void>({
            query: () => 'admin/ta/leave/settings/policies/:policyId/leaves'
        }),
 
        getLeavePolicySettings: builder.query<getLeavePolicySettings, void>({
            query: () => 'admin/ta/leave/settings/policies/:policyId/leaves/:leaveId'
        }),
 
        updateLeavePolicySettings: builder.query<updateLeavePolicySettings, void>({
            query: () => 'admin/ta/leave/settings/policies/:policyId/leaves/:leaveId'
        }),
 
 
    })
})
 
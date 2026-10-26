import { baseApi } from '@/app/baseApi';
import type {PayrollSettings,ReminderSettings,ReminderType,EmailType,EmailPayslipSettings,TenantSettings} from '../types/settingstypes';

export const settingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPayrollDetails:builder.query<PayrollSettings, void>({
            query: ()=> 'admin/admincenter/settings/payrolldetails',
        }),

        getReminders:builder.query<ReminderSettings[], void>({
            query: ()=> 'admin/admincenter/settings/reminders',
        }),

        getReminderByType:builder.query<ReminderSettings, ReminderType>({
            query: (type)=> `admin/admincenter/settings/reminders/${type}`,
        }),

        getEmailTypes:builder.query<EmailType[], void>({
            query: ()=> 'admin/admincenter/settings/email/types',
        }),

        getEmailPayslipSettings:builder.query<EmailPayslipSettings, void>({
            query: ()=> 'admin/admincenter/settings/email/payslip',
        }),

        getTenantSettings:builder.query<TenantSettings, void>({
            query: ()=> 'admin/admincenter/settings/tenant',
        }),

        updatePayrollDetails:builder.mutation<void,PayrollSettings>({
            query:(body)=>({
                url:'admin/admincenter/settings/payrollupdate',
                method:'PUT',
                body,
            })
        }),

        updateReminderByType:builder.mutation<void,{ type: ReminderType; body: Partial<ReminderSettings> }>({
            query:({ type, body })=>({
                url:`admin/admincenter/settings/reminders/${type}`,
                method:'PUT',
                body,
            })
        }),

        updateEmailPayslipSettings:builder.mutation<void,EmailPayslipSettings>({
            query:(body)=>({
                url:'admin/admincenter/settings/email/payslip',
                method:'PUT',
                body,
            })
        }),

        updateTenantSettings:builder.mutation<void,TenantSettings>({
            query:(body)=>({
                url:'admin/admincenter/settings/tenant',
                method:'PUT',
                body,
            })
        }),

        addTenantIp:builder.mutation<void,{ ip: string }>({
            query:(body)=>({
                url:'admin/admincenter/settings/tenant/ip',
                method:'POST',
                body,
            })
        }),

        uploadTenantLogo:builder.mutation<void,FormData>({
            query:(formData)=>({
                url:'admin/admincenter/settings/tenant/logo',
                method:'POST',
                body:formData,
            })
        }),
    })
})


export const {
    useGetPayrollDetailsQuery,
    useGetRemindersQuery,
    useGetReminderByTypeQuery,
    useGetEmailTypesQuery,
    useGetEmailPayslipSettingsQuery,
    useGetTenantSettingsQuery,
    useUpdatePayrollDetailsMutation,
    useUpdateReminderByTypeMutation,
    useUpdateEmailPayslipSettingsMutation,
    useUpdateTenantSettingsMutation,
    useAddTenantIpMutation,
    useUploadTenantLogoMutation,
}=settingsApi;
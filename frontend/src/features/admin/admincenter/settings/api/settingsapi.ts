




import { baseApi } from "@/app/baseApi";
import type {
  EmailType,
  EmailPayslipSettings,
  TenantSettings,
  AddReminderInput,
  UpdateCompanyTenantInput,
} from "../types/settingstypes";

const api = baseApi.enhanceEndpoints({
  addTagTypes: ["PayrollSettings", "ReminderSettings", "EmailSettings", "TenantSettings"],
});

/** Turns any RTK Query error into a readable message for the UI. */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  const e = err as {
    status?: number | string;
    data?: { message?: string | string[]; error?: string; title?: string } | string;
    error?: string;
  };

  if (!e) return fallback;

  if (e.status === "FETCH_ERROR") {
    return "Cannot reach the server. Check that the backend is running and VITE_API_URL is correct.";
  }
  if (e.status === 401 || e.status === 403) {
    return "You are not authorised. Please log in again.";
  }
  if (e.status === 404) {
    return `${fallback} (endpoint not found - 404).`;
  }
  if (typeof e.data === "string" && e.data.trim()) {
    return e.data;
  }
  if (e.data && typeof e.data === "object") {
    const msg = e.data.message || e.data.error || e.data.title;
    if (msg) return Array.isArray(msg) ? msg.join(", ") : String(msg);
  }
  return e.status ? `${fallback} (status ${e.status}).` : fallback;
}

export const settingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // =========================================================
    // PAYROLL
    // =========================================================
    getPayrollDetails: builder.query<any, void>({
      query: () => "admin/setting/payroll",
      providesTags: ["PayrollSettings"],
    }),
    updatePayrollDetails: builder.mutation<any, any>({
      query: (body) => ({ url: "admin/setting/payroll", method: "PUT", body }),
      invalidatesTags: ["PayrollSettings"],
    }),
    getPayrollMasters: builder.query<any, void>({
      query: () => "admin/setting/payroll/masters",
    }),

    // =========================================================
    // REMINDER
    // =========================================================

    // ✅ FIXED: list all reminders so Add Reminder can appear in the sidebar
    // GET admin/setting/reminder
    getReminders: builder.query<any, void>({
      query: () => "admin/setting/reminder",
      providesTags: [{ type: "ReminderSettings", id: "LIST" }],
    }),

    // GET admin/setting/reminder/:reminderTypeId  (numeric id, e.g. 1 = Birthday)
    getReminderByType: builder.query<any, number>({
      query: (reminderTypeId) => `admin/setting/reminder/${reminderTypeId}`,
      providesTags: (_res, _err, id) => [
        { type: "ReminderSettings", id },
        { type: "ReminderSettings", id: "LIST" },
      ],
    }),

    // ✅ FIXED: backend endpoint is PUT /api/reminder/update
    // Body must be PascalCase exactly as backend expects.
    updateReminder: builder.mutation<
      any,
      {
        ReminderTypeID: number;
        ReminderBefore: number;
        FromEmail: string;
        ToRecipient: string;
        CCRecipient?: string | null;
        IsESS: boolean;
        IsHRMS: boolean;
        IsSendMail: boolean;
        IsActive: boolean;
        TemplateName: string;
        Subject: string;
        Body: string;
      }
    >({
      // ✅ PUT /api/admin/setting/update  (@Controller('admin/setting') + @Put('update'))
      query: (body) => {
        // class-validator @IsOptional @IsString rejects null — omit empty optional strings
        const clean: Record<string, unknown> = {
          ReminderTypeID: body.ReminderTypeID,
          ReminderBefore: body.ReminderBefore,
          FromEmail: body.FromEmail,
          ToRecipient: body.ToRecipient,
          IsESS: body.IsESS,
          IsHRMS: body.IsHRMS,
          IsSendMail: body.IsSendMail,
          IsActive: body.IsActive,
          TemplateName: body.TemplateName,
          Subject: body.Subject,
          Body: body.Body,
        };
        if (body.CCRecipient != null && String(body.CCRecipient).trim() !== "") {
          clean.CCRecipient = body.CCRecipient;
        }
        return {
          url: "admin/setting/update",
          method: "PUT",
          body: clean,
        };
      },
      invalidatesTags: (_res, _err, arg) => [
        { type: "ReminderSettings", id: arg.ReminderTypeID },
        { type: "ReminderSettings", id: "LIST" },
      ],
    }),

    // POST admin/setting/reminder -> creates a new reminder TYPE
    // (code, displayName, shortLabel, sortOrder, subject, body).
    addReminder: builder.mutation<any, AddReminderInput>({
      query: (body) => ({ url: "admin/setting/reminder", method: "POST", body }),
      invalidatesTags: [{ type: "ReminderSettings", id: "LIST" }],
    }),

    // PUT admin/setting/reminder/status -> Active flag only. Used as a fallback
    // if reminder/update is unavailable (404/405), and available for a quick
    // activate/deactivate toggle anywhere else in the UI.
    updateReminderStatus: builder.mutation<any, { reminderTypeId: number; isActive: boolean }>({
      query: (body) => ({ url: "admin/setting/reminder/status", method: "PUT", body }),
      invalidatesTags: (_res, _err, { reminderTypeId }) => [
        { type: "ReminderSettings", id: reminderTypeId },
        { type: "ReminderSettings", id: "LIST" },
      ],
    }),

    // =========================================================
    // EMAIL
    // =========================================================
    getEmailTypes: builder.query<EmailType[], void>({
      query: () => "admin/setting/email/types",
      providesTags: ["EmailSettings"],
    }),
    getEmailPayslipSettings: builder.query<EmailPayslipSettings, void>({
      query: () => "admin/setting/email/payslip",
      providesTags: ["EmailSettings"],
    }),
    updateEmailPayslipSettings: builder.mutation<void, EmailPayslipSettings>({
      query: (body) => ({ url: "admin/setting/email/payslip", method: "PUT", body }),
      invalidatesTags: ["EmailSettings"],
    }),

    // =========================================================
    // TENANT
    // =========================================================
    // Backend only exposes PUT admin/setting/tenant (no GET), so there is no query here.
    // PUT admin/setting/tenant  (UpdateCompanyTenantDto)
    // companyId + modifiedBy are taken from the JWT on the server.
    // Returns the updated row (recordset[0]) or null.
    // PUT admin/setting/tenant — JSON body OR multipart FormData.
    // Logo file field name MUST be "companyLogo" (FileInterceptor on backend).
    updateTenantSettings: builder.mutation<any, UpdateCompanyTenantInput | FormData>({
      query: (body) => {
        if (typeof FormData !== "undefined" && body instanceof FormData) {
          return {
            url: "admin/setting/tenant",
            method: "PUT",
            body,
            // Let the browser set multipart boundary — do not force JSON Content-Type
          };
        }
        return { url: "admin/setting/tenant", method: "PUT", body };
      },
      invalidatesTags: ["TenantSettings"],
    }),

    // Deprecated: backend has no POST tenant/logo — logo goes on PUT tenant as "companyLogo"
    uploadTenantLogo: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "admin/setting/tenant",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["TenantSettings"],
    }),
  }),
});

export const {
  // Payroll
  useGetPayrollDetailsQuery,
  useUpdatePayrollDetailsMutation,
  useGetPayrollMastersQuery,

  // Reminder
  useGetRemindersQuery,
  useGetReminderByTypeQuery,
  useUpdateReminderMutation,
  useAddReminderMutation,
  useUpdateReminderStatusMutation,

  // Email
  useGetEmailTypesQuery,
  useGetEmailPayslipSettingsQuery,
  useUpdateEmailPayslipSettingsMutation,

  // Tenant
  useUpdateTenantSettingsMutation,
  useUploadTenantLogoMutation,
} = settingsApi;

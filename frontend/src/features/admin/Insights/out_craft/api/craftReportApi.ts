import { baseApi } from "@/app/baseApi";

import type {
  CraftReportListItem,
  CraftReportListParams,
  CreateNewFilePayload,
  CraftReportTemplate,
  StoreTemplateListParams,
  SaveStoreTemplatesPayload,
  AiUploadResponse,
  PdfProtectionSettings,
  AuditLogEntry,
  AuditLogParams,
} from "../types/craftReport.types";

export const craftReportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ==================================================
    // GET CRAFT REPORTS (list)
    // ==================================================

    getCraftReports: builder.query<CraftReportListItem[], CraftReportListParams | void>({
      query: (params) => ({
        url: "/reports/craftreports",
        method: "GET",
        params: params
          ? {
              tab: params.tab,
              category: params.category,
              subCategory: params.subCategory,
              search: params.search,
            }
          : undefined,
      }),
    }),


    // ==================================================
    // GET CATEGORIES
    // ==================================================

    getCraftReportCategories: builder.query<string[], void>({
      query: () => ({
        url: "/reports/craftreports/categories",
        method: "GET",
      }),
    }),


    // ==================================================
    // GET SUB CATEGORIES
    // ==================================================

    getCraftReportSubCategories: builder.query<string[], { category?: string } | void>({
      query: (params) => ({
        url: "/reports/craftreports/subcategories",
        method: "GET",
        params: params?.category ? { category: params.category } : undefined,
      }),
    }),


    // ==================================================
    // CREATE NEW FILE (multipart upload)
    // ==================================================

    createCraftReportFile: builder.mutation<CraftReportListItem, CreateNewFilePayload>({
      query: ({ category, subCategory, fileName, file }) => {
        const formData = new FormData();

        formData.append("category", category);
        formData.append("subCategory", subCategory ?? "");
        formData.append("fileName", fileName);

        if (file) {
          formData.append("file", file);
        }

        return {
          url: "/reports/craftreports/files",
          method: "POST",
          body: formData,
        };
      },
    }),


    // ==================================================
    // GET STORE TEMPLATES
    // ==================================================

    getStoreTemplates: builder.query<CraftReportTemplate[], StoreTemplateListParams | void>({
      query: (params) => ({
        url: "/reports/craftreports/store/templates",
        method: "GET",
        params: params
          ? {
              search: params.search,
              categories: params.categories?.join(","),
            }
          : undefined,
      }),
    }),


    // ==================================================
    // SAVE (DOWNLOAD) STORE TEMPLATES
    // ==================================================

    saveStoreTemplates: builder.mutation<void, SaveStoreTemplatesPayload>({
      query: (body) => ({
        url: "/reports/craftreports/store/templates/save",
        method: "POST",
        body,
      }),
    }),


    // ==================================================
    // AI UPLOAD
    // ==================================================

    aiUploadCraftReport: builder.mutation<AiUploadResponse, { file: File }>({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append("file", file);

        return {
          url: "/reports/craftreports/ai/upload",
          method: "POST",
          body: formData,
        };
      },
    }),


    // ==================================================
    // UPDATE PDF PROTECTION SETTING
    // ==================================================

    updatePdfProtection: builder.mutation<void, PdfProtectionSettings>({
      query: (body) => ({
        url: "/reports/craftreports/pdfprotection",
        method: "PUT",
        body,
      }),
    }),


    // ==================================================
    // GET AUDIT LOG
    // ==================================================

    getAuditLog: builder.query<AuditLogEntry[], AuditLogParams | void>({
      query: (params) => ({
        url: "/reports/craftreports/auditlog",
        method: "GET",
        params: params
          ? {
              search: params.search,
              employeeId: params.employeeId,
              action: params.action,
            }
          : undefined,
      }),
    }),

  }),
});

export const {
  useGetCraftReportsQuery,
  useLazyGetCraftReportsQuery,
  useGetCraftReportCategoriesQuery,
  useGetCraftReportSubCategoriesQuery,
  useLazyGetCraftReportSubCategoriesQuery,
  useCreateCraftReportFileMutation,
  useGetStoreTemplatesQuery,
  useLazyGetStoreTemplatesQuery,
  useSaveStoreTemplatesMutation,
  useAiUploadCraftReportMutation,
  useUpdatePdfProtectionMutation,
  useGetAuditLogQuery,
  useLazyGetAuditLogQuery,
} = craftReportApi;
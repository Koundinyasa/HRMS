import { baseApi } from "@/app/baseApi";
import type {
  AdditionalClassification,
  AdditionalClassificationListResponse,
  ApiMessageResponse,
  Bank,
  BankFieldConfigResponse,
  BankListResponse,
  Branch,
  BranchListResponse,
  CreateAdditionalClassificationResponse,
  CreateBankResponse,
  CreateBranchResponse,
  CreateDesignationResponse,
  DesignationListResponse,
  ImportTemplateType,
  ImportUploadResponse,
  SalaryComponent,
  SalaryComponentListResponse,
  SalaryComponentType,
  CreateSalaryComponentResponse,
} from "../types/classificationTypes";

function throwIfApiError<T extends { StatusCode?: number; Message?: string }>(response: T): T {
  if (response.StatusCode && response.StatusCode >= 400) {
    throw { status: response.StatusCode, data: response };
  }
  return response;
}

export const classificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ===============================
    // ADDITIONAL CLASSIFICATION
    // ===============================

    getAdditionalClassifications: builder.query<AdditionalClassification[], void>({
      query: () => ({
        url: "/classifications/additional",
        method: "GET",
        cache: "no-store" as RequestCache,
      }),
      transformResponse: (response: AdditionalClassificationListResponse) =>
        response.AdditionalClassifications ?? [],
      providesTags: ["AdditionalClassifications"],
    }),

    createAdditionalClassification: builder.mutation<
      CreateAdditionalClassificationResponse,
      { name: string; tag: string }
    >({
      query: (body) => ({ url: "/classifications/additional", method: "POST", body }),
      transformResponse: throwIfApiError<CreateAdditionalClassificationResponse>,
      invalidatesTags: ["AdditionalClassifications"],
    }),

    updateAdditionalClassification: builder.mutation<
      ApiMessageResponse,
      { id: number; name: string; tag: string }
    >({
      query: (body) => ({ url: "/classifications/additional", method: "PUT", body }),
      transformResponse: throwIfApiError<ApiMessageResponse>,
      invalidatesTags: ["AdditionalClassifications"],
    }),

    deleteAdditionalClassification: builder.mutation<ApiMessageResponse, { id: number }>({
      query: (body) => ({ url: "/classifications/additional", method: "DELETE", body }),
      transformResponse: throwIfApiError<ApiMessageResponse>,
      invalidatesTags: ["AdditionalClassifications"],
    }),

    // ===============================
    // BRANCH
    // ===============================

    getBranches: builder.query<Branch[], void>({
      query: () => ({ url: "/classifications/branch", method: "GET", cache: "no-store" as RequestCache }),
      transformResponse: (response: BranchListResponse) => response.Branches ?? [],
      providesTags: ["Branches"],
    }),

    createBranch: builder.mutation<
      CreateBranchResponse,
      { branchName: string; address: string; state: string }
    >({
      query: (body) => ({ url: "/classifications/branch", method: "POST", body }),
      transformResponse: throwIfApiError<CreateBranchResponse>,
      invalidatesTags: ["Branches"],
    }),

    updateBranch: builder.mutation<
      ApiMessageResponse,
      { id: number; branchName: string; address: string; state: string; isActive: 0 | 1 }
    >({
      query: (body) => ({ url: "/classifications/branch", method: "PUT", body }),
      transformResponse: throwIfApiError<ApiMessageResponse>,
      invalidatesTags: ["Branches"],
    }),

    deleteBranch: builder.mutation<ApiMessageResponse, { id: number }>({
      query: (body) => ({ url: "/classifications/branch", method: "DELETE", body }),
      transformResponse: throwIfApiError<ApiMessageResponse>,
      invalidatesTags: ["Branches"],
    }),

    // ===============================
    // DESIGNATION
    // ===============================

    getDesignations: builder.query<DesignationListResponse, { page: number; pageSize: number }>({
      query: ({ page, pageSize }) => ({
        url: "/classifications/designation",
        method: "GET",
        params: { page, pageSize },
        cache: "no-store" as RequestCache,
      }),
      providesTags: ["Designations"],
    }),

    createDesignation: builder.mutation<CreateDesignationResponse, { designationName: string }>({
      query: (body) => ({ url: "/classifications/designation", method: "POST", body }),
      transformResponse: throwIfApiError<CreateDesignationResponse>,
      invalidatesTags: ["Designations"],
    }),

    updateDesignation: builder.mutation<ApiMessageResponse, { id: number; designationName: string }>({
      query: (body) => ({ url: "/classifications/designation", method: "PUT", body }),
      transformResponse: throwIfApiError<ApiMessageResponse>,
      invalidatesTags: ["Designations"],
    }),

    deleteDesignation: builder.mutation<ApiMessageResponse, { id: number }>({
      query: (body) => ({ url: "/classifications/designation", method: "DELETE", body }),
      transformResponse: throwIfApiError<ApiMessageResponse>,
      invalidatesTags: ["Designations"],
    }),

    // ===============================
    // BANK
    // ===============================

    getBanks: builder.query<Bank[], void>({
      query: () => ({ url: "/classifications/bank", method: "GET", cache: "no-store" as RequestCache }),
      transformResponse: (response: BankListResponse) => response.Banks ?? [],
      providesTags: ["Banks"],
    }),

    createBank: builder.mutation<CreateBankResponse, { bankName: string; acType: string; ifscCode: string }>({
      query: (body) => ({ url: "/classifications/bank", method: "POST", body }),
      transformResponse: throwIfApiError<CreateBankResponse>,
      invalidatesTags: ["Banks"],
    }),

    updateBank: builder.mutation<
      ApiMessageResponse,
      { id: number; bankName: string; acType: string; ifscCode: string }
    >({
      query: (body) => ({ url: "/classifications/bank", method: "PUT", body }),
      transformResponse: throwIfApiError<ApiMessageResponse>,
      invalidatesTags: ["Banks"],
    }),

    deleteBank: builder.mutation<ApiMessageResponse, { id: number }>({
      query: (body) => ({ url: "/classifications/bank", method: "DELETE", body }),
      transformResponse: throwIfApiError<ApiMessageResponse>,
      invalidatesTags: ["Banks"],
    }),

    // ---- Bank field-mapping drill-down (gear icon on a Bank row) ----
    getBankFieldConfig: builder.query<BankFieldConfigResponse, number>({
      query: (bankId) => ({
        url: `/classifications/bank/${bankId}/field-config`,
        method: "GET",
        cache: "no-store" as RequestCache,
      }),
      providesTags: ["BankFieldMapping"],
    }),

    saveBankFieldConfig: builder.mutation<ApiMessageResponse, BankFieldConfigResponse>({
      query: (body) => ({
        url: `/classifications/bank/${body.BankId}/field-config`,
        method: "PUT",
        body,
      }),
      transformResponse: throwIfApiError<ApiMessageResponse>,
      invalidatesTags: ["BankFieldMapping"],
    }),

    // ===============================
    // SALARY STRUCTURE — COMPONENTS
    // ===============================

    getSalaryComponents: builder.query<SalaryComponent[], SalaryComponentType | void>({
      query: (type) => ({
        url: "/classifications/salary-structure/components",
        method: "GET",
        params: type ? { type } : undefined,
        cache: "no-store" as RequestCache,
      }),
      transformResponse: (response: SalaryComponentListResponse) => response.Components ?? [],
      providesTags: ["SalaryComponents"],
    }),

    createSalaryComponent: builder.mutation<
      CreateSalaryComponentResponse,
      { componentName: string; printName: string; isCalculative: 0 | 1; isOpenComponent: 0 | 1; type: SalaryComponentType }
    >({
      query: (body) => ({ url: "/classifications/salary-structure/components", method: "POST", body }),
      transformResponse: throwIfApiError<CreateSalaryComponentResponse>,
      invalidatesTags: ["SalaryComponents"],
    }),

    updateSalaryComponent: builder.mutation<
      ApiMessageResponse,
      { id: number; componentName: string; printName: string; isCalculative: 0 | 1; isOpenComponent: 0 | 1; type: SalaryComponentType }
    >({
      query: (body) => ({ url: "/classifications/salary-structure/components", method: "PUT", body }),
      transformResponse: throwIfApiError<ApiMessageResponse>,
      invalidatesTags: ["SalaryComponents"],
    }),

    deleteSalaryComponent: builder.mutation<ApiMessageResponse, { id: number }>({
      query: (body) => ({ url: "/classifications/salary-structure/components", method: "DELETE", body }),
      transformResponse: throwIfApiError<ApiMessageResponse>,
      invalidatesTags: ["SalaryComponents"],
    }),

    reorderSalaryComponents: builder.mutation<ApiMessageResponse, { orderedIds: number[] }>({
      query: (body) => ({ url: "/classifications/salary-structure/components/sort", method: "PUT", body }),
      transformResponse: throwIfApiError<ApiMessageResponse>,
      invalidatesTags: ["SalaryComponents"],
    }),

    createDefaultSalaryComponents: builder.mutation<ApiMessageResponse, void>({
      query: () => ({ url: "/classifications/salary-structure/components/defaults", method: "POST" }),
      transformResponse: throwIfApiError<ApiMessageResponse>,
      invalidatesTags: ["SalaryComponents"],
    }),

    // ===============================
    // IMPORT
    // ===============================

    downloadImportTemplate: builder.query<Blob, ImportTemplateType>({
      query: (type) => ({
        url: "/classifications/import/template",
        method: "GET",
        params: { type },
        responseHandler: (response: Response) => response.blob(),
        cache: "no-store" as RequestCache,
      }),
    }),

    uploadImportFile: builder.mutation<ImportUploadResponse, { type: ImportTemplateType; file: File }>({
      query: ({ type, file }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);
        return { url: "/classifications/import", method: "POST", body: formData };
      },
      transformResponse: throwIfApiError<ImportUploadResponse>,
      invalidatesTags: ["Branches", "Designations", "Banks", "AdditionalClassifications"],
    }),
  }),
});

export const {
  useGetAdditionalClassificationsQuery,
  useCreateAdditionalClassificationMutation,
  useUpdateAdditionalClassificationMutation,
  useDeleteAdditionalClassificationMutation,
  useGetBranchesQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useGetDesignationsQuery,
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
  useDeleteDesignationMutation,
  useGetBanksQuery,
  useCreateBankMutation,
  useUpdateBankMutation,
  useDeleteBankMutation,
  useGetBankFieldConfigQuery,
  useSaveBankFieldConfigMutation,
  useLazyDownloadImportTemplateQuery,
  useUploadImportFileMutation,
  useGetSalaryComponentsQuery,
  useCreateSalaryComponentMutation,
  useUpdateSalaryComponentMutation,
  useDeleteSalaryComponentMutation,
  useReorderSalaryComponentsMutation,
  useCreateDefaultSalaryComponentsMutation,
} = classificationApi;

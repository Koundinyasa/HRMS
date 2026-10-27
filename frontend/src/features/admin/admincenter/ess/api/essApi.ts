import { baseApi } from "@/app/baseApi";

/* =========================================================
 * ESS modules — CONFIRMED against the real backend
 * (admin/ess/module GET, admin/ess/create POST, admin/ess/update PUT,
 * admin/ess/delete DELETE, plus ack-types / poll-types / policy-read-status)
 *
 * essInsightId: 1 = Circular, 2 = Notification, 3 = Flash News,
 *               4 = Poll, 5 = Policy
 * statusId:     63 = New (current), 62 = Old (previous) — omit for the SP
 *               default (63); ignored by the SP for Policy
 * ========================================================= */

export const ESS_INSIGHT = {
  CIRCULAR: 1 as const,
  NOTIFICATION: 2 as const,
  FLASH_NEWS: 3 as const,
  POLL: 4 as const,
  POLICY: 5 as const,
};

export const ESS_STATUS = {
  CURRENT: 63 as const,
  PREVIOUS: 62 as const,
};

export type EssInsightId = 1 | 2 | 3 | 4 | 5;
export type EssStatusId = 63 | 62;

// Columns differ per module; this is the union of everything the GET
// endpoint can return, so every page just reads the fields it needs.
export interface EssModuleRow {
  ID?: number;
  Id?: number;
  id?: number;
  Name?: string; // Circular
  CategoryID?: number; // Circular
  AckTypeID?: number; // Circular / Policy
  AckTypeName?: string; // Circular / Policy
  Description?: string; // Circular / Policy
  EventName?: string; // Notification
  FlashNews?: string; // Flash News
  Question?: string; // Poll
  QuestionTypeID?: number; // Poll
  QuestionTypeName?: string; // Poll
  PolicyName?: string; // Policy
  IsDownloadRestricted?: boolean; // Policy
  FilePath?: string | null;
  FromDate?: string;
  ToDate?: string;
  StartDate?: string; // Poll / some modules
  EndDate?: string;
  PolicyDate?: string; // Policy list effective date from SP
  PolicyToDate?: string;
  FilterID?: number;
  SubFilterID?: number;
  // Confirmed real field names from GET /module — FilterID/SubFilterID
  // above were a guess before this was verified; these are what the
  // backend actually sends.
  Filter?: number | null;
  SubFilter?: number | null;
  [key: string]: unknown;
}


/** Format API date for list UI (DD/MM/YYYY). Tries common field variants. */
export function formatEssDate(
  value?: string | null
): string {
  if (!value) return "—";
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[3]}/${match[2]}/${match[1]}`;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB");
}

/** Resolve start/from date from a module row (field names vary by SP). */
export function getRowFromDate(row: EssModuleRow): string | null {
  const v =
    row.FromDate ??
    (row as Record<string, unknown>).StartDate ??
    (row as Record<string, unknown>).EffectiveDate ??
    (row as Record<string, unknown>).fromDate ??
    null;
  return v != null ? String(v) : null;
}

/** Resolve end/to date from a module row. */
export function getRowToDate(row: EssModuleRow): string | null {
  const v =
    row.ToDate ??
    (row as Record<string, unknown>).EndDate ??
    (row as Record<string, unknown>).toDate ??
    null;
  return v != null ? String(v) : null;
}

export interface EssModuleResponse {
  success: boolean;
  message: string;
  data: EssModuleRow[];
}

export interface EssSaveResponse {
  success: boolean;
  message: string;
  data: { recordId: number; filePath: string | null };
}

export interface EssMutationPayload {
  essInsightId: EssInsightId;
  fromDate: string; // YYYY-MM-DD, required
  title?: string; // Circular Name / Notification EventName / Policy PolicyName
  content?: string; // Circular Description / Flash News text / Poll Question / Policy Description
  categoryId?: number | string; // Circular only, not validated by the SP
  ackTypeId?: number | string; // Circular / Policy
  questionTypeId?: number | string; // Poll only, required for Poll
  toDate?: string; // YYYY-MM-DD — ignored by the SP for Policy
  isDownloadRestricted?: boolean; // Policy only
  filter?: number | string; // "Select Filter" — All Employees / Department / Designation
  subFilter?: number | string; // the specific department/designation when filter needs one
  file?: File | null; // Circular / Notification / Policy only, PDF/PNG/JPG, 5MB max
}

export type CreateEssModulePayload = EssMutationPayload;
export interface UpdateEssModulePayload extends EssMutationPayload {
  id: number | string; // required on update
}

function buildMutationFormData(payload: EssMutationPayload & { id?: number | string }): FormData {
  const fd = new FormData();
  fd.append("essInsightId", String(payload.essInsightId));
  fd.append("fromDate", payload.fromDate);
  if (payload.id !== undefined && payload.id !== null && payload.id !== "") {
    fd.append("id", String(payload.id));
  }
  if (payload.title) fd.append("title", payload.title);
  if (payload.content) fd.append("content", payload.content);
  if (payload.categoryId !== undefined && payload.categoryId !== null && payload.categoryId !== "") {
    fd.append("categoryId", String(payload.categoryId));
  }
  if (payload.ackTypeId !== undefined && payload.ackTypeId !== null && payload.ackTypeId !== "") {
    fd.append("ackTypeId", String(payload.ackTypeId));
  }
  if (
    payload.questionTypeId !== undefined &&
    payload.questionTypeId !== null &&
    payload.questionTypeId !== ""
  ) {
    fd.append("questionTypeId", String(payload.questionTypeId));
  }
  if (payload.toDate) fd.append("toDate", payload.toDate);
  if (payload.isDownloadRestricted !== undefined) {
    fd.append("isDownloadRestricted", String(payload.isDownloadRestricted));
  }
  if (payload.filter !== undefined && payload.filter !== null && payload.filter !== "") {
    fd.append("filter", String(payload.filter));
  }
  if (payload.subFilter !== undefined && payload.subFilter !== null && payload.subFilter !== "") {
    fd.append("subFilter", String(payload.subFilter));
  }
  if (payload.file) fd.append("file", payload.file);
  return fd;
}

// UI date fields use DD-MM-YYYY; the API needs YYYY-MM-DD.
export function toApiDate(value: string): string {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parts = value.split("-");
  if (parts.length === 3 && parts[0].length === 2) {
    const [dd, mm, yyyy] = parts;
    return `${yyyy}-${mm}-${dd}`;
  }
  return value;
}

export function toUiDate(value?: string | null): string {
  if (!value) return "";
  const m = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return value;
}

export function getRowId(row: EssModuleRow): number | undefined {
  const raw = row.ID ?? row.Id ?? row.id;
  return raw != null ? Number(raw) : undefined;
}

// FilePath from the backend looks like "/uploads/circulars/townhall_q3.pdf".
// The download link is backend origin + /documents + that path.
export function buildDocumentUrl(
  filePath: string | null | undefined,
  backendOrigin = ""
): string | null {
  if (!filePath) return null;
  const base = backendOrigin.replace(/\/$/, "");
  return `${base}/documents/${filePath.replace(/^\//, "")}`;
}


/** Safe download name from title + FilePath extension */
export function buildDownloadFileName(
  title: string | null | undefined,
  filePath?: string | null,
  fallback = "download"
): string {
  const base =
    String(title ?? "")
      .replace(/[^\w\- ]+/g, "")
      .trim() || fallback;
  const extMatch = String(filePath ?? "").match(/\.[a-z0-9]{2,5}$/i);
  const ext = extMatch ? extMatch[0].toLowerCase() : "";
  if (ext && !base.toLowerCase().endsWith(ext)) return `${base}${ext}`;
  return base;
}


/**
 * Download attachment using FilePath from the list API.
 * Path is served by backend under /documents (Vite proxies /documents → 3001).
 * No dedicated /api/admin/ess/download endpoint is required.
 */
export async function downloadEssFile(params: {
  /** Relative path from list row, e.g. "uploads/circulars/file.pdf" or "/uploads/..." */
  filePath: string;
  fallbackFileName?: string;
  /** kept for call-site compatibility; ignored when using FilePath */
  essInsightId?: EssInsightId;
  id?: number | string;
  statusId?: EssStatusId;
}): Promise<void> {
  const { filePath, fallbackFileName } = params;
  if (!filePath) throw new Error("No file path.");

  const path = filePath.replace(/^\//, "");
  const url = `/documents/${path}`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    if (response.status === 404) throw new Error("File not found on the server.");
    if (response.status === 401 || response.status === 403)
      throw new Error("Not allowed to download this file.");
    throw new Error("Failed to download file.");
  }

  const contentType = (response.headers.get("Content-Type") || "").toLowerCase();
  if (contentType.includes("text/html")) {
    throw new Error(
      "Got a web page instead of a file. Check Vite proxy: /documents → http://localhost:3001"
    );
  }

  const blob = await response.blob();
  if (!blob.size) throw new Error("Downloaded file is empty.");

  let fileName = (fallbackFileName || path.split("/").pop() || "download").trim();
  const disposition = response.headers.get("Content-Disposition");
  if (disposition) {
    const match =
      /filename\*=UTF-8''([^;]+)|filename="([^"]+)"|filename=([^;\s]+)/i.exec(
        disposition
      );
    const raw = match?.[1] || match?.[2] || match?.[3];
    if (raw) fileName = decodeURIComponent(raw.trim().replace(/^["']|["']$/g, ""));
  }

  if (!/\.[a-z0-9]{2,5}$/i.test(fileName)) {
    const ext = path.match(/\.[a-z0-9]{2,5}$/i)?.[0];
    if (ext) fileName += ext.toLowerCase();
  }

  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = fileName;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(objectUrl);
}



export interface LookupOption {
  ID: number;
  // ackTypes/pollTypes use TypeName; filterTypes/departments/designations
  // use Name instead — both are read defensively wherever this is consumed.
  TypeName?: string;
  Name?: string;
}

export interface EssDropdowns {
  ackTypes: LookupOption[];
  pollTypes: LookupOption[];
  filterTypes: LookupOption[];
  departments: LookupOption[];
  designations: LookupOption[];
}

function lookupLabel(list: LookupOption[] | undefined, id: unknown): string | null {
  if (id === null || id === undefined) return null;
  const match = (list ?? []).find((o) => o.ID === Number(id));
  return match ? match.TypeName ?? match.Name ?? null : null;
}

// GET /module only ever returns the raw Filter/SubFilter IDs (e.g. Filter:
// 3, SubFilter: 4) — never the names. This resolves a row's saved filter
// into "Applicable Type" (Department / Designation / All Employees) and
// "Applicable For" (the specific department/designation name, if any)
// against the /dropdowns response.
export function resolveRowFilter(
  row: EssModuleRow,
  dropdowns: EssDropdowns | undefined
): { type: string; value: string | null } {
  const filterLabel = lookupLabel(dropdowns?.filterTypes, row.Filter);

  if (filterLabel == null) {
    return { type: "All Employees", value: null };
  }

  const isDepartment = /department/i.test(filterLabel);
  const list = isDepartment ? dropdowns?.departments : dropdowns?.designations;

  return { type: filterLabel, value: lookupLabel(list, row.SubFilter) };
}

export interface PolicyReadStatusRow {
  [key: string]: unknown;
}

export interface PolicyReadStatusResponse {
  success: boolean;
  message: string;
  data: {
    seen: PolicyReadStatusRow[];
    unseen: PolicyReadStatusRow[];
  };
}

/* =========================================================
 * HelpDesk — NOT part of the admin/ess/module API, no backend
 * controller shared for it yet. REST shape below is unconfirmed.
 * ========================================================= */

export interface HelpDesk {
  id: string | number;
  categoryType?: string;
  title?: string;
  description?: string;
  filter?: string;
  status?: string;
}

/* =========================================================
 * ESS API
 * ========================================================= */

export const essApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["EssModule", "PolicyReadStatus"] })
  .injectEndpoints({
  endpoints: (builder) => ({
    getEssModule: builder.query<
      EssModuleResponse,
      { essInsightId: EssInsightId; statusId?: EssStatusId; id?: number | string }
    >({
      query: ({ essInsightId, statusId, id }) => {
        const params: Record<string, string | number> = { essInsightId };
        if (statusId !== undefined) params.statusId = statusId;
        if (id !== undefined && id !== null && id !== "") params.id = id;
        return {
          url: "admin/ess/module",
          method: "GET",
          params,
          credentials: "include" as RequestCredentials,
        };
      },
      providesTags: (_r, _e, arg) => [
        { type: "EssModule" as const, id: `${arg.essInsightId}-${arg.statusId ?? "default"}` },
      ],
    }),

    createEssModule: builder.mutation<EssSaveResponse, CreateEssModulePayload>({
      query: (payload) => ({
        url: "admin/ess/create",
        method: "POST",
        body: buildMutationFormData(payload),
        formData: true,
        credentials: "include" as RequestCredentials,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "EssModule" as const, id: `${arg.essInsightId}-${ESS_STATUS.CURRENT}` },
        { type: "EssModule" as const, id: `${arg.essInsightId}-default` },
      ],
    }),

    updateEssModule: builder.mutation<EssSaveResponse, UpdateEssModulePayload>({
      query: (payload) => ({
        url: "admin/ess/update",
        method: "PUT",
        body: buildMutationFormData(payload),
        formData: true,
        credentials: "include" as RequestCredentials,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "EssModule" as const, id: `${arg.essInsightId}-${ESS_STATUS.CURRENT}` },
        { type: "EssModule" as const, id: `${arg.essInsightId}-${ESS_STATUS.PREVIOUS}` },
        { type: "EssModule" as const, id: `${arg.essInsightId}-default` },
      ],
    }),

    deleteEssModule: builder.mutation<
      EssSaveResponse,
      { essInsightId: EssInsightId; id: number | string }
    >({
      query: ({ essInsightId, id }) => ({
        url: "admin/ess/delete",
        method: "DELETE",
        params: { essInsightId, id },
        credentials: "include" as RequestCredentials,
      }),
      invalidatesTags: (_r, _e, arg) => [
        { type: "EssModule" as const, id: `${arg.essInsightId}-${ESS_STATUS.CURRENT}` },
        { type: "EssModule" as const, id: `${arg.essInsightId}-default` },
      ],
    }),

    getEssDropdowns: builder.query<EssDropdowns, void>({
      query: () => ({ url: "admin/ess/dropdowns", credentials: "include" as RequestCredentials }),
      transformResponse: (res: { data: EssDropdowns }) => res.data,
    }),

    getPolicyReadStatus: builder.query<PolicyReadStatusResponse["data"], number | string>({
      query: (policyId) => ({
        url: "admin/ess/policy-read-status",
        params: { policyId },
        credentials: "include" as RequestCredentials,
      }),
      transformResponse: (res: PolicyReadStatusResponse) => res.data,
      providesTags: (_r, _e, policyId) => [{ type: "PolicyReadStatus" as const, id: policyId }],
    }),

    /* =====================================================
     * HelpDesk — unconfirmed REST shape, see note above
     * ===================================================== */

    getHelpDeskItems: builder.query<HelpDesk[], void>({
      query: () => "helpdesk",
    }),

    getHelpDeskById: builder.query<HelpDesk, string | number>({
      query: (id) => `helpdesk/${id}`,
    }),

    createHelpDesk: builder.mutation<HelpDesk, Partial<HelpDesk>>({
      query: (body) => ({ url: "helpdesk", method: "POST", body }),
    }),

    updateHelpDesk: builder.mutation<HelpDesk, { id: string | number; body: Partial<HelpDesk> }>({
      query: ({ id, body }) => ({ url: `helpdesk/${id}`, method: "PUT", body }),
    }),

    deleteHelpDesk: builder.mutation<void, string | number>({
      query: (id) => ({ url: `helpdesk/${id}`, method: "DELETE" }),
    }),
  }),
});

export const {
  useGetEssModuleQuery,
  useLazyGetEssModuleQuery,
  useCreateEssModuleMutation,
  useUpdateEssModuleMutation,
  useDeleteEssModuleMutation,
  useGetEssDropdownsQuery,
  useGetPolicyReadStatusQuery,

  useGetHelpDeskItemsQuery,
  useGetHelpDeskByIdQuery,
  useCreateHelpDeskMutation,
  useUpdateHelpDeskMutation,
  useDeleteHelpDeskMutation,
} = essApi;
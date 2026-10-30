import { baseApi } from "@/app/baseApi";
import { fetchWithSession } from "@/app/apiFetch";

/* =========================================================
 * Types
 * ========================================================= */

export interface Policy {
  id: string | number;
  policyName?: string;
  name?: string;
  description?: string;
  filter?: string;
  date?: string;
  acknowledgementType?: string;
  file?: string;
  status?: string;
}

export interface Circular {
  id: string | number;
  title?: string;
  description?: string;
  date?: string;
  filter?: string;
  acknowledgementType?: string;
  file?: string;
  status?: string;
}

export interface Notification {
  id: string | number;
  title?: string;
  description?: string;
  date?: string;
  filter?: string;
  status?: string;
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

  const response = await fetchWithSession(url, { method: "GET" });

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

export interface Poll {
  id: string | number;
  startDate?: string;
  endDate?: string;
  targetAudienceFilter?: string;
  questionType?: string;
  question?: string;
  status?: string;
}

/* =========================================================
 * ESS API
 * ========================================================= */

export const essApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    /* =====================================================
     * Policy
     * ===================================================== */

    getPolicies: builder.query<Policy[], void>({
      query: () => "policies",
    }),

    getPolicyById: builder.query<Policy, string | number>({
      query: (id) => `policies/${id}`,
    }),

    createPolicy: builder.mutation<Policy, Partial<Policy>>({
      query: (body) => ({
        url: "policies",
        method: "POST",
        body,
      }),
    }),

    updatePolicy: builder.mutation<
      Policy,
      { id: string | number; body: Partial<Policy> }
    >({
      query: ({ id, body }) => ({
        url: `policies/${id}`,
        method: "PUT",
        body,
      }),
    }),

    deletePolicy: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `policies/${id}`,
        method: "DELETE",
      }),
    }),

    /* =====================================================
     * Circular
     * ===================================================== */

    getCirculars: builder.query<Circular[], void>({
      query: () => "circulars",
    }),

    getCircularById: builder.query<Circular, string | number>({
      query: (id) => `circulars/${id}`,
    }),

    createCircular: builder.mutation<Circular, Partial<Circular>>({
      query: (body) => ({
        url: "circulars",
        method: "POST",
        body,
      }),
    }),

    updateCircular: builder.mutation<
      Circular,
      { id: string | number; body: Partial<Circular> }
    >({
      query: ({ id, body }) => ({
        url: `circulars/${id}`,
        method: "PUT",
        body,
      }),
    }),

    deleteCircular: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `circulars/${id}`,
        method: "DELETE",
      }),
    }),

    /* =====================================================
     * Notification
     * ===================================================== */

    getNotifications: builder.query<Notification[], void>({
      query: () => "notifications",
    }),

    getNotificationById: builder.query<Notification, string | number>({
      query: (id) => `notifications/${id}`,
    }),

    createNotification: builder.mutation<
      Notification,
      Partial<Notification>
    >({
      query: (body) => ({
        url: "notifications",
        method: "POST",
        body,
      }),
    }),

    updateNotification: builder.mutation<
      Notification,
      { id: string | number; body: Partial<Notification> }
    >({
      query: ({ id, body }) => ({
        url: `notifications/${id}`,
        method: "PUT",
        body,
      }),
    }),

    deleteNotification: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `notifications/${id}`,
        method: "DELETE",
      }),
    }),

    /* =====================================================
     * HelpDesk
     * ===================================================== */

    getHelpDeskItems: builder.query<HelpDesk[], void>({
      query: () => "helpdesk",
    }),

    getHelpDeskById: builder.query<HelpDesk, string | number>({
      query: (id) => `helpdesk/${id}`,
    }),

    createHelpDesk: builder.mutation<
      HelpDesk,
      Partial<HelpDesk>
    >({
      query: (body) => ({
        url: "helpdesk",
        method: "POST",
        body,
      }),
    }),

    updateHelpDesk: builder.mutation<
      HelpDesk,
      { id: string | number; body: Partial<HelpDesk> }
    >({
      query: ({ id, body }) => ({
        url: `helpdesk/${id}`,
        method: "PUT",
        body,
      }),
    }),

    deleteHelpDesk: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `helpdesk/${id}`,
        method: "DELETE",
      }),
    }),

    /* =====================================================
     * Poll
     * ===================================================== */

    getPolls: builder.query<Poll[], void>({
      query: () => "polls",
    }),

    getPollById: builder.query<Poll, string | number>({
      query: (id) => `polls/${id}`,
    }),

    createPoll: builder.mutation<Poll, Partial<Poll>>({
      query: (body) => ({
        url: "polls",
        method: "POST",
        body,
      }),
    }),

    updatePoll: builder.mutation<
      Poll,
      { id: string | number; body: Partial<Poll> }
    >({
      query: ({ id, body }) => ({
        url: `polls/${id}`,
        method: "PUT",
        body,
      }),
    }),

    deletePoll: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `polls/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

/* =========================================================
 * Hooks
 * ========================================================= */

export const {
  // Policy
  useGetPoliciesQuery,
  useGetPolicyByIdQuery,
  useCreatePolicyMutation,
  useUpdatePolicyMutation,
  useDeletePolicyMutation,

  // Circular
  useGetCircularsQuery,
  useGetCircularByIdQuery,
  useCreateCircularMutation,
  useUpdateCircularMutation,
  useDeleteCircularMutation,

  // Notification
  useGetNotificationsQuery,
  useGetNotificationByIdQuery,
  useCreateNotificationMutation,
  useUpdateNotificationMutation,
  useDeleteNotificationMutation,

  // HelpDesk
  useGetHelpDeskItemsQuery,
  useGetHelpDeskByIdQuery,
  useCreateHelpDeskMutation,
  useUpdateHelpDeskMutation,
  useDeleteHelpDeskMutation,

  // Poll
  useGetPollsQuery,
  useGetPollByIdQuery,
  useCreatePollMutation,
  useUpdatePollMutation,
  useDeletePollMutation,
} = essApi;
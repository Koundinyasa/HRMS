import { baseApi } from "@/app/baseApi";
import type { HelpdeskRequest } from "../types/helpdeskRequests.types";

type PendingTicketRow = Record<string, unknown>;

const getValue = (
  row: PendingTicketRow,
  ...keys: string[]
): unknown => {
  const normalized = new Map(
    Object.entries(row).map(([key, value]) => [key.toLowerCase(), value]),
  );

  for (const key of keys) {
    const value = normalized.get(key.toLowerCase());
    if (value !== undefined && value !== null) {
      return value;
    }
  }

  return undefined;
};

const asText = (value: unknown): string =>
  typeof value === "string" || typeof value === "number"
    ? String(value)
    : "";

const asId = (value: unknown): string | number | undefined =>
  typeof value === "string" || typeof value === "number"
    ? value
    : undefined;

const normalizePendingTicket = (row: PendingTicketRow): HelpdeskRequest => {
  const id = getValue(row, "TicketID", "ID", "Id");
  const ticketNumber = getValue(row, "TicketNumber", "RequestID", "RequestNumber");

  return {
    id: typeof id === "number" || typeof id === "string" ? id : "",
    requestId: asText(ticketNumber ?? id),
    employeeId: asId(getValue(row, "EmployeeID", "CreatedByEmployeeID")),
    employeeName: asText(
      getValue(row, "EmployeeName", "RequesterName", "CreatedByName"),
    ),
    category: asText(getValue(row, "Category", "CategoryName")),
    subCategory: asText(getValue(row, "SubCategory", "SubCategoryName")),
    subject: asText(getValue(row, "Subject")),
    description: asText(getValue(row, "Description")),
    priority: asText(getValue(row, "Priority")),
    status: asText(getValue(row, "Status", "StatusName")) || "Pending",
    assignedTo: asText(getValue(row, "AssignedTo", "AssignedToName")),
    assignedToId: asId(getValue(row, "AssignedToEmployeeID")),
    createdDate: asText(
      getValue(row, "CreatedDateTime", "CreatedDate", "RequestDate"),
    ),
    updatedDate: asText(getValue(row, "ModifiedDateTime", "UpdatedDate")),
    resolvedDate: asText(getValue(row, "ResolvedDateTime", "ResolvedDate")),
    remarks: asText(getValue(row, "Remarks", "ClosureRemarks")),
  };
};

const helpdeskRequestsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPendingHelpdeskRequests: builder.query<HelpdeskRequest[], void>({
      query: () => ({
        url: "/employee/helpdesk/pending",
        method: "GET",
      }),
      transformResponse: (rows: PendingTicketRow[]) =>
        rows.map(normalizePendingTicket),
      providesTags: ["HelpDesk"],
    }),

    processHelpdeskRequest: builder.mutation<
      unknown,
      { ticketId: number; actionStatusId: number; remarks?: string }
    >({
      query: (body) => ({
        url: "/employee/helpdesk/action",
        method: "POST",
        body,
      }),
      invalidatesTags: ["HelpDesk"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPendingHelpdeskRequestsQuery,
  useProcessHelpdeskRequestMutation,
} = helpdeskRequestsApi;

export default helpdeskRequestsApi;

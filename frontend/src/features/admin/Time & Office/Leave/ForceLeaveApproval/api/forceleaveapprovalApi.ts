import { baseApi } from "@/app/baseApi"; 
import type {
  CompanyDropdownData,
  HierarchicalLeaveActionRequest,
  LeaveApprovalQuery,
  LeaveApprovalRow,
} from "../types/forceapproval.types";

function normalizeRow(record: unknown): LeaveApprovalRow {
  const fields =
    record && typeof record === "object"
      ? Object.entries(record as Record<string, unknown>)
      : [];
  const getValue = (...keys: string[]) => {
    for (const key of keys) {
      const normalizedKey = key.replace(/[^a-z0-9]/gi, "").toLowerCase();
      const match = fields.find(
        ([field]) =>
          field.replace(/[^a-z0-9]/gi, "").toLowerCase() === normalizedKey,
      );
      if (match?.[1] !== undefined && match[1] !== null) return match[1];
    }
    return undefined;
  };

  const id = Number(getValue("approvalId", "id"));
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("Leave approval data is missing a valid ApprovalId.");
  }

  const formatDate = (value: unknown) => {
    const dateText = value instanceof Date ? value.toISOString() : String(value ?? "");
    const isoDate = dateText.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoDate) {
      const [, year, month, day] = isoDate;
      return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
    const dmyDate = dateText.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (dmyDate) return `${dmyDate[1]}/${dmyDate[2]}/${dmyDate[3]}`;
    return dateText;
  };
  const fromDateValue = getValue("fromDate");
  const toDateValue = getValue("toDate");
  const asText = (value: unknown) => String(value ?? "");
  const asOptionalText = (value: unknown) =>
    value === undefined || value === null ? undefined : String(value).trim();
  const leaveFilterValues = fields.flatMap(([field, value]) => {
    const normalizedField = field.replace(/[^a-z0-9]/gi, "").toLowerCase();
    if (!normalizedField.includes("leave") || value === undefined || value === null) return [];
    if (typeof value !== "string" && typeof value !== "number") return [];
    const normalizedValue = String(value).trim();
    return normalizedValue ? [normalizedValue] : [];
  });
  const noofdays = asText(getValue("noofdays", "noOfDays", "numberOfDays")).trim();
  const noofdaysDisplay = noofdays || "-";
  const date = formatDate(getValue("leaveDate", "appliedDate", "date"));

  return {
    id,
    approverName: asText(getValue("approverName", "approver", "managerName")),
    employeeId: asText(getValue("employeeId", "employeeCode", "empId")),
    employeeName: asText(getValue("employeeName", "name")),
    leaveName: asText(getValue("leaveType", "leaveTypeName", "leaveName")),
    date,
    fromDate: formatDate(fromDateValue),
    toDate: formatDate(toDateValue),
    noofdays,
    noofdaysDisplay,
    reason: asText(getValue("remarks", "reason", "leaveReason", "comments")),
    branchId: asOptionalText(getValue("branchId", "branchID")),
    branchName: asOptionalText(getValue("branchName", "branch")),
    salaryStructureId: asOptionalText(getValue("salaryStructureId", "salaryStructureID")),
    salaryStructureName: asOptionalText(getValue("salaryStructureName", "salaryStructure")),
    leaveTypeId: asOptionalText(getValue("leaveTypeId", "leaveTypeID", "leaveId")),
    leaveCode: asOptionalText(getValue("leaveCode", "leaveTypeCode", "leaveAbbreviation", "leaveShortName")),
    leaveFilterValues,
    attendanceStatusId: asOptionalText(getValue("attendanceStatusId", "attendanceStatusID", "attendanceId")),
    attendanceStatus: asOptionalText(getValue("attendanceStatus", "attendanceStatusName")),
    designationId: asOptionalText(getValue("designationId", "designationID")),
    designationName: asOptionalText(getValue("designationName", "designation")),
    employeeStatusId: asOptionalText(getValue("employeeStatusId", "employeeStatusID", "empStatusId")),
    employeeStatus: asOptionalText(getValue("employeeStatus", "employeeStatusName", "empStatus")),
  };
}

function extractRows(response: unknown): LeaveApprovalRow[] {
  if (
    response &&
    typeof response === "object" &&
    !Array.isArray(response) &&
    (response as { success?: boolean }).success === false
  ) {
    throw new Error(
      (response as { message?: string }).message ??
        "Failed to fetch leave approval records.",
    );
  }

  const rows = Array.isArray(response)
    ? response
    : response &&
        typeof response === "object" &&
        Array.isArray((response as { data?: unknown }).data)
      ? (response as { data: unknown[] }).data
      : [];
  return rows.map(normalizeRow);
}


export const leaveApprovalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getForceLeaveApprovalDropdowns: builder.query<CompanyDropdownData, void>({
      query: () => ({
        url: "/admin/ta/leave/forceleaveapproval/company-dropdown",
        method: "GET",
      }),
      transformResponse: (response: { data?: CompanyDropdownData }) =>
        response.data ?? {
          branches: [],
          salaryStructures: [],
          leaveTypes: [],
          leaveTypeCodes: [],
          attendanceStatuses: [],
          designations: [],
          employeeStatuses: [],
        },
    }),
    getForceLeaveApprovals: builder.query<LeaveApprovalRow[], LeaveApprovalQuery>({
      query: (params) => ({
        url: "/admin/ta/leave/forceleaveapproval",
        method: "POST",
        body: {
          approverId: params.approverId,
          fromDate: params.fromDate,
          toDate: params.toDate,
          isCurrentMonth: params.monthType === "current",
          branchId: params.branchId,
          branchIds: params.branchIds,
          employmentStatusId: params.employmentStatusId,
          designationId: params.designationId,
          leaveTypeId: params.leaveTypeId,
          structureId: params.structureId,
          attendanceStatusId: params.attendanceStatusId,
        },
      }),
      transformResponse: extractRows,
      providesTags: ["ForceLeaveApproval"],
    }),

    approveLeaves: builder.mutation<unknown, HierarchicalLeaveActionRequest>({
      query: (body) => ({
        url: "/review/approval",
        method: "POST",
        body: { ...body, actionStatusId: 4 },
      }),
      invalidatesTags: ["ForceLeaveApproval"],
    }),

    rejectLeaves: builder.mutation<unknown, HierarchicalLeaveActionRequest>({
      query: (body) => ({
        url: "/review/approval",
        method: "POST",
        body: { ...body, actionStatusId: 5 },
      }),
      invalidatesTags: ["ForceLeaveApproval"],
    }),
  }),
});

export const {
  useGetForceLeaveApprovalDropdownsQuery,
  useGetForceLeaveApprovalsQuery,
  useApproveLeavesMutation,
  useRejectLeavesMutation,
} = leaveApprovalApi;

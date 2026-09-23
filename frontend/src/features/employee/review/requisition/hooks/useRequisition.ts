// import {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import {
//   useGetPendingLeaveRequestsMutation,
//   useApproveLeaveRequestsMutation,
//   useRejectLeaveRequestsMutation,
// } from "../api/requisitionApi";

// import {
//   REQUISITION_MESSAGES,
// } from "../constants/requisition.constants";

// import type {
//   PendingLeaveRequest,
//   Requisition,
// } from "../types/requisition.types";

// const extractRequests = (
//   response: unknown
// ): PendingLeaveRequest[] => {
//   if (Array.isArray(response)) {
//     return response as PendingLeaveRequest[];
//   }

//   if (response && typeof response === "object") {
//     const result = response as Record<string, unknown>;

//     const possibleKeys = [
//       "data",
//       "result",
//       "items",
//       "records",
//       "requests",
//     ];

//     for (const key of possibleKeys) {
//       const value = result[key];

//       if (Array.isArray(value)) {
//         return value as PendingLeaveRequest[];
//       }

//       if (value && typeof value === "object") {
//         const nested = extractRequests(value);

//         if (nested.length > 0) {
//           return nested;
//         }
//       }
//     }
//   }

//   return [];
// };

// const mapRequest = (
//   item: PendingLeaveRequest,
//   index: number
// ): Requisition => ({
//   id: String(item.LeaveId ?? item.LeaveID ?? item.Id ?? `${item.EmployeeId ?? "employee"}-${item.AppliedDate ?? index}-${index}`),
//   approvalId: Number(item.ApprovalId ?? item.ApprovalID ?? item.LeaveId ?? item.LeaveID ?? item.Id ?? 0),
//   leaveId: Number(item.LeaveId ?? item.LeaveID ?? item.Id ?? 0),
//   employeeId: String(item.EmployeeId ?? ""),
//   employeeName: String(item.EmployeeName ?? ""),
//   leaveName: String(item.LeaveName ?? ""),
//   date: String(item.FromDate ?? ""),
//   days: Number(item.NoDays ?? item.NoOfDays ?? 0),
//   reason: String(item.Reason ?? ""),
// });

// export const useRequisition = () => {
//   const [
//     getPendingLeaveRequests,
//     { data, isLoading, isError },
//   ] = useGetPendingLeaveRequestsMutation();
//   const [approveLeaveRequests] = useApproveLeaveRequestsMutation();
//   const [rejectLeaveRequests] = useRejectLeaveRequestsMutation();

//   const [search, setSearch] = useState("");
//   const [selectedIds, setSelectedIds] =
//     useState<string[]>([]);

//   useEffect(() => {
//     void getPendingLeaveRequests({
//       fromDate: "2026-09-01",
//       toDate: "2026-09-18",
//     });
//   }, [getPendingLeaveRequests]);

//   const requisitions: Requisition[] = useMemo(
//     () => extractRequests(data).map(mapRequest),
//     [data]
//   );

//   const filteredRequisitions = useMemo(() => {
//     const value = search.trim().toLowerCase();

//     if (!value) return requisitions;

//     return requisitions.filter((item) =>
//       [
//         item.id,
//         item.employeeId,
//         item.employeeName,
//         item.leaveName,
//         item.date,
//         item.days,
//         item.reason,
//       ].some((field) =>
//         String(field ?? "")
//           .toLowerCase()
//           .includes(value)
//       )
//     );
//   }, [requisitions, search]);

//   const toggleSelect = (id: string) => {
//     setSelectedIds((previous) =>
//       previous.includes(id)
//         ? previous.filter(
//             (selectedId) => selectedId !== id
//           )
//         : [...previous, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     const visibleIds = filteredRequisitions.map(
//       (item) => item.id
//     );

//     const allSelected =
//       visibleIds.length > 0 &&
//       visibleIds.every((id) =>
//         selectedIds.includes(id)
//       );

//     setSelectedIds((previous) =>
//       allSelected
//         ? previous.filter(
//             (id) => !visibleIds.includes(id)
//           )
//         : Array.from(
//             new Set([...previous, ...visibleIds])
//           )
//     );
//   };

//   const updateSelected = async (
//     action: "approved" | "rejected"
//   ): Promise<Requisition[]> => {
//     const selectedRequests = requisitions
//       .filter((item) => selectedIds.includes(item.id))
//     const approvalIds = selectedRequests
//       .map((item) => item.approvalId)
//       .filter((approvalId) => Number.isInteger(approvalId) && approvalId > 0);

//     if (approvalIds.length === 0) {
//       return [];
//     }

//     const mutation = action === "approved"
//       ? approveLeaveRequests
//       : rejectLeaveRequests;

//     for (const approvalId of approvalIds) {
//       await mutation({
//         approvalId,
//         actionStatusId: action === "approved" ? 4 : 5,
//       }).unwrap();
//     }

//     setSelectedIds([]);
//     await refetch();
//     return selectedRequests;
//   };

//   const refetch = () =>
//     getPendingLeaveRequests({
//       fromDate: "2026-09-01",
//       toDate: "2026-09-18",
//     });

//   return {
//     requisitions: filteredRequisitions,
//     search,
//     setSearch,
//     selectedIds,
//     toggleSelect,
//     toggleSelectAll,
//     updateSelected,
//     loading: isLoading,
//     error: isError
//       ? REQUISITION_MESSAGES.FETCH_ERROR
//       : "",
//     refetch,
//   };
// };




import {
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

import {
  useGetPendingLeaveRequestsMutation,
  useApproveLeaveRequestsMutation,
  useRejectLeaveRequestsMutation,
} from "../api/requisitionApi";

import {
  REQUISITION_MESSAGES,
} from "../constants/requisition.constants";

import type {
  PendingLeaveRequest,
  Requisition,
} from "../types/requisition.types";

const FROM_DATE = "2026-09-01";
const TO_DATE = "2026-09-18";

const extractRequests = (
  response: unknown
): PendingLeaveRequest[] => {
  if (Array.isArray(response)) {
    return response as PendingLeaveRequest[];
  }

  if (response && typeof response === "object") {
    const result = response as Record<string, unknown>;

    const possibleKeys = [
      "data",
      "result",
      "items",
      "records",
      "requests",
    ];

    for (const key of possibleKeys) {
      const value = result[key];

      if (Array.isArray(value)) {
        return value as PendingLeaveRequest[];
      }

      if (value && typeof value === "object") {
        const nested = extractRequests(value);

        if (nested.length > 0) {
          return nested;
        }
      }
    }
  }

  return [];
};

const getNumber = (
  ...values: (string | number | undefined)[]
): number => {
  const value = values.find(
    (item) => item !== undefined && item !== null && item !== ""
  );

  return Number(value ?? 0);
};

const mapRequest = (
  item: PendingLeaveRequest,
  index: number
): Requisition => {
  const approvalId = getNumber(
    item.ApprovalId,
    item.ApprovalID,
    item.approvalId,
    item.LeaveId,
    item.LeaveID,
    item.leaveId,
    item.Id,
    item.id
  );

  const leaveId = getNumber(
    item.LeaveId,
    item.LeaveID,
    item.leaveId,
    item.Id,
    item.id
  );

  const employeeId = String(
    item.EmployeeId ?? item.employeeId ?? ""
  );

  const appliedDate = String(
    item.AppliedDate ?? item.appliedDate ?? ""
  );

  return {
    id: String(
      approvalId > 0
        ? approvalId
        : `${employeeId}-${appliedDate}-${index}`
    ),

    approvalId,
    leaveId,
    employeeId,

    employeeName: String(
      item.EmployeeName ?? item.employeeName ?? ""
    ),

    leaveName: String(
      item.LeaveName ?? item.leaveName ?? ""
    ),

    date: String(
      item.FromDate ?? item.fromDate ?? ""
    ),

    days: getNumber(
      item.NoDays,
      item.NoOfDays
    ),

    reason: String(
      item.Reason ?? item.reason ?? ""
    ),

    approverEmployeeId: String(
      item.ApproverEmployeeId ??
      item.ApproverEmployeeID ??
      item.approverEmployeeId ??
      ""
    ),
  };
};

export const useRequisition = () => {
  const [
    getPendingLeaveRequests,
    {
      data,
      isLoading,
      isError,
    },
  ] = useGetPendingLeaveRequestsMutation();

  const [approveLeaveRequests] =
    useApproveLeaveRequestsMutation();

  const [rejectLeaveRequests] =
    useRejectLeaveRequestsMutation();

  const [search, setSearch] = useState("");

  const [selectedIds, setSelectedIds] =
    useState<string[]>([]);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [actionError, setActionError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const refetch = useCallback(
    () =>
      getPendingLeaveRequests({
        fromDate: FROM_DATE,
        toDate: TO_DATE,
      }),
    [getPendingLeaveRequests]
  );

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const requisitions: Requisition[] = useMemo(
    () => extractRequests(data).map(mapRequest),
    [data]
  );

  const filteredRequisitions = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return requisitions;

    return requisitions.filter((item) =>
      [
        item.id,
        item.employeeId,
        item.employeeName,
        item.leaveName,
        item.date,
        item.days,
        item.reason,
      ].some((field) =>
        String(field ?? "")
          .toLowerCase()
          .includes(value)
      )
    );
  }, [requisitions, search]);

  const toggleSelect = (id: string) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter(
            (selectedId) => selectedId !== id
          )
        : [...previous, id]
    );
  };

  const toggleSelectAll = () => {
    const visibleIds = filteredRequisitions.map(
      (item) => item.id
    );

    const allSelected =
      visibleIds.length > 0 &&
      visibleIds.every((id) =>
        selectedIds.includes(id)
      );

    setSelectedIds((previous) =>
      allSelected
        ? previous.filter(
            (id) => !visibleIds.includes(id)
          )
        : Array.from(
            new Set([...previous, ...visibleIds])
          )
    );
  };

  const updateSelected = async (
    action: "approved" | "rejected"
  ): Promise<Requisition[]> => {
    setActionError("");
    setSuccessMessage("");

    if (selectedIds.length === 0) {
      setActionError(
        "Please select at least one leave request."
      );
      return [];
    }

    const selectedRequests = requisitions.filter(
      (item) => selectedIds.includes(item.id)
    );

    const invalidRequest = selectedRequests.find(
      (item) => item.approvalId <= 0
    );

    if (invalidRequest) {
      setActionError(
        "A selected leave request is missing its approval ID."
      );
      return [];
    }

    setActionLoading(true);

    try {
      for (const item of selectedRequests) {
        const payload = {
          approvalId: item.approvalId,
        };

        if (action === "approved") {
          await approveLeaveRequests(payload).unwrap();
        } else {
          await rejectLeaveRequests(payload).unwrap();
        }
      }

      setSelectedIds([]);

      setSuccessMessage(
        action === "approved"
          ? "Leave approved successfully!"
          : "Leave rejected successfully!"
      );

      try {
        await refetch().unwrap();
      } catch (refreshError) {
        console.warn("Leave request status refresh failed.", refreshError);
      }

      return selectedRequests;
    } catch (error) {
      console.error(
        `Failed to ${action} leave request:`,
        error
      );

      setActionError(
        action === "approved"
          ? "Failed to approve leave. Please try again."
          : "Failed to reject leave. Please try again."
      );

      return [];
    } finally {
      setActionLoading(false);
    }
  };

  return {
    requisitions: filteredRequisitions,
    search,
    setSearch,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    updateSelected,
    loading: isLoading,
    actionLoading,
    actionError,
    successMessage,
    clearActionMessages: () => {
      setSuccessMessage("");
      setActionError("");
    },
    error: isError
      ? REQUISITION_MESSAGES.FETCH_ERROR
      : "",
    refetch,
  };
};
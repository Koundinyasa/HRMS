import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  useGetPendingHelpdeskRequestsQuery,
  useProcessHelpdeskRequestMutation,
} from "../api/helpdeskRequestsApi";
import type { HelpdeskRequest } from "../types/helpdeskRequests.types";

const ACTION_STATUS = {
  APPROVED: 4,
  REJECTED: 5,
} as const;

const getErrorMessage = (error: unknown): string | undefined => {
  if (!error || typeof error !== "object" || !("data" in error)) {
    return undefined;
  }

  const data = error.data;
  if (!data || typeof data !== "object") {
    return undefined;
  }

  const response = data as { message?: unknown; Message?: unknown };
  const message = response.message ?? response.Message;
  return typeof message === "string" && message.trim()
    ? message
    : undefined;
};

export const useHelpdeskRequests = () => {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);
  const {
    data: requests = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetPendingHelpdeskRequestsQuery();
  const [processRequest, { isLoading: isActionLoading }] =
    useProcessHelpdeskRequestMutation();

  const filteredRequests = useMemo(() => {
    const searchValue = search.trim().toLowerCase();
    if (!searchValue) {
      return requests;
    }

    return requests.filter((request) =>
      [
        request.requestId,
        request.employeeName,
        request.category,
        request.subject,
        request.status,
      ].some((value) => value?.toLowerCase().includes(searchValue)),
    );
  }, [requests, search]);

  const toggleSelection = (id: string | number) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const toggleSelectAll = () => {
    if (
      filteredRequests.length > 0 &&
      filteredRequests.every((request) => selectedIds.includes(request.id))
    ) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(filteredRequests.map((request) => request.id));
  };

  const processAction = async (
    request: HelpdeskRequest,
    action: "approve" | "reject",
    remarks?: string,
  ): Promise<boolean> => {
    if (action === "reject" && !remarks?.trim()) {
      toast.error("Please provide a reason for rejection.");
      return false;
    }

    if (typeof request.id !== "number" && !/^\d+$/.test(String(request.id))) {
      toast.error("This ticket has an invalid ID and cannot be processed.");
      return false;
    }

    try {
      await processRequest({
        ticketId: Number(request.id),
        actionStatusId:
          action === "approve"
            ? ACTION_STATUS.APPROVED
            : ACTION_STATUS.REJECTED,
        remarks: remarks?.trim() || undefined,
      }).unwrap();
      toast.success(action === "approve" ? "Ticket approved." : "Ticket rejected.");
      setSelectedIds([]);
      return true;
    } catch (error) {
      toast.error(
        getErrorMessage(error) ||
          `Unable to ${action} the ticket. Please try again.`,
      );
      return false;
    }
  };

  return {
    search,
    setSearch,
    requests: filteredRequests,
    selectedIds,
    toggleSelection,
    toggleSelectAll,
    processAction,
    refetch,
    isLoading,
    isFetching,
    isError,
    isActionLoading,
  };
};

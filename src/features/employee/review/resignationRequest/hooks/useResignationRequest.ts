import { useMemo, useState } from "react";

import {
  useApproveResignationRequestMutation,
  useGetResignationRequestsQuery,
  useRejectResignationRequestMutation,
} from "../api/resignationRequestApi";

import type {
  ResignationRequest,
} from "../types/resignationRequest.types";
import { SEPARATION_ACTION_STATUS } from "../types/resignationRequest.types";

export const useResignationRequest = () => {
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState<ResignationRequest | null>(null);

  const [selectedIds, setSelectedIds] = useState<Array<string | number>>([]);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetResignationRequestsQuery();

  const [approveRequest, { isLoading: isApproving }] =
    useApproveResignationRequestMutation();

  const [rejectRequest, { isLoading: isRejecting }] =
    useRejectResignationRequestMutation();

  const requests = useMemo(() => data ?? [], [data]);

  const filteredRequests = useMemo(() => {
    if (!search.trim()) {
      return requests;
    }

    const searchValue = search.toLowerCase().trim();

    return requests.filter((item) => {
      return (
        item.requestId?.toLowerCase().includes(searchValue) ||
        item.employeeName?.toLowerCase().includes(searchValue) ||
        item.reason?.toLowerCase().includes(searchValue) ||
        item.status?.toLowerCase().includes(searchValue)
      );
    });
  }, [requests, search]);

  const toggleSelection = (id: string | number) => {
    setSelectedIds((previous) => {
      if (previous.includes(id)) {
        return previous.filter((item) => item !== id);
      }

      return [...previous, id];
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredRequests.length) {
      setSelectedIds([]);
      return;
    }

    setSelectedIds(filteredRequests.map((item) => item.id));
  };

  const approveSelected = async () => {
    for (const id of selectedIds) {
      const request = requests.find((item) => item.id === id);
      if (!request) {
        throw new Error(`Resignation request ${id} was not found.`);
      }
      if (!request.stageOrder) {
        throw new Error(`Resignation request ${id} is missing its approval stage.`);
      }
      await approveRequest({
        resignationId: Number(id),
        stageOrder: request.stageOrder,
        actionStatus: SEPARATION_ACTION_STATUS.APPROVED,
        remarks: "Approved",
      }).unwrap();
    }

    setSelectedIds([]);
  };

  const rejectSelected = async (remarks?: string) => {
    for (const id of selectedIds) {
      const request = requests.find((item) => item.id === id);
      if (!request) {
        throw new Error(`Resignation request ${id} was not found.`);
      }
      if (!request.stageOrder) {
        throw new Error(`Resignation request ${id} is missing its approval stage.`);
      }
      await rejectRequest({
        resignationId: Number(id),
        stageOrder: request.stageOrder,
        actionStatus: SEPARATION_ACTION_STATUS.REJECTED,
        remarks,
      }).unwrap();
    }

    setSelectedIds([]);
  };

  return {
    search,
    setSearch,

    requests: filteredRequests,

    selectedIds,
    selectedRequest,
    setSelectedRequest,

    toggleSelection,
    toggleSelectAll,

    approveSelected,
    rejectSelected,

    refetch,

    isLoading,
    isFetching,
    isError,
    error,

    isApproving,
    isRejecting,

    isActionLoading: isApproving || isRejecting,
  };
};
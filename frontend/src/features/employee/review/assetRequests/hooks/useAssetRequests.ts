import { useMemo, useState } from "react";

import {
  useApproveAssetRequestMutation,
  useCancelAssetRequestMutation,
  useGetAssetRequestsQuery,
  useRejectAssetRequestMutation,
} from "../api/assetRequestApi";

import type {
  AssetRequest,
  AssetRequestFilterParams,
} from "../types/assetRequest.types";

export const useAssetRequests = () => {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAssetRequestsQuery();

  const [
    approveAssetRequest,
    { isLoading: isApproving },
  ] = useApproveAssetRequestMutation();

  const [
    rejectAssetRequest,
    { isLoading: isRejecting },
  ] = useRejectAssetRequestMutation();

  const [
    cancelAssetRequest,
    { isLoading: isCancelling },
  ] = useCancelAssetRequestMutation();

  const [filters, setFilters] =
    useState<AssetRequestFilterParams>({
      search: "",
      status: "All",
      assetType: "All",
      priority: "All",
    });

  const requests: AssetRequest[] = data?.data ?? [];

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const search = filters.search?.toLowerCase().trim();

      const matchesSearch =
        !search ||
        request.requestId
          ?.toLowerCase()
          .includes(search) ||
        request.employeeName
          ?.toLowerCase()
          .includes(search) ||
        request.assetName
          ?.toLowerCase()
          .includes(search) ||
        request.assetType
          ?.toLowerCase()
          .includes(search);

      const matchesStatus =
        !filters.status ||
        filters.status === "All" ||
        request.status === filters.status;

      const matchesAssetType =
        !filters.assetType ||
        filters.assetType === "All" ||
        request.assetType === filters.assetType;

      const matchesPriority =
        !filters.priority ||
        filters.priority === "All" ||
        request.priority === filters.priority;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAssetType &&
        matchesPriority
      );
    });
  }, [requests, filters]);

  const handleApprove = async (
    id: number,
    remarks = ""
  ) => {
    await approveAssetRequest({
      id,
      remarks,
    }).unwrap();
  };

  const handleReject = async (
    id: number,
    remarks = ""
  ) => {
    await rejectAssetRequest({
      id,
      remarks,
    }).unwrap();
  };

  const handleCancel = async (
    id: number,
    remarks = ""
  ) => {
    await cancelAssetRequest({
      id,
      remarks,
    }).unwrap();
  };

  return {
    requests,
    filteredRequests,

    filters,
    setFilters,

    isLoading,
    isFetching,
    isError,
    error,

    isApproving,
    isRejecting,
    isCancelling,

    handleApprove,
    handleReject,
    handleCancel,

    refetch,
  };
};
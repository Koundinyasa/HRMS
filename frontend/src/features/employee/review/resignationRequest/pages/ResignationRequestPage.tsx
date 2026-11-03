import { useState } from "react";
import { toast } from "react-toastify";

import ResignationRequestDetails from "../components/ResignationRequestDetails";
import ResignationRequestFilters from "../components/ResignationRequestFilters";
import ResignationRequestModal from "../components/ResignationRequestModal";
import ResignationRequestTable from "../components/ResignationRequestTable";
import { RESIGNATION_REQUEST_MESSAGES } from "../constants/resignationRequestConstants";

import { useResignationRequest } from "../hooks/useResignationRequest";

import type {
  ResignationRequest,
} from "../types/resignationRequest.types";

const ResignationRequestPage = () => {
  const {
    search,
    setSearch,
    requests,
    selectedIds,
    toggleSelection,
    toggleSelectAll,
    approveSelected,
    rejectSelected,
    refetch,
    isLoading,
    isFetching,
    isError,
    isActionLoading,
  } = useResignationRequest();

  const [detailsRequest, setDetailsRequest] =
    useState<ResignationRequest | null>(null);

  const [actionRequest, setActionRequest] =
    useState<ResignationRequest | null>(null);

  const handleApprove = async () => {
    try {
      await approveSelected();
      toast.success(RESIGNATION_REQUEST_MESSAGES.APPROVE_SUCCESS);
    } catch (error) {
      console.error("Resignation approval failed:", error);
      toast.error(RESIGNATION_REQUEST_MESSAGES.APPROVE_ERROR);
    }
  };

  const handleRejectConfirm = async (remarks?: string) => {
    if (!actionRequest) {
      return;
    }

    if (!remarks?.trim()) {
      toast.error("Please enter your reason for rejecting this request.");
      return;
    }

    try {
      await rejectSelected(remarks);
      toast.success(RESIGNATION_REQUEST_MESSAGES.REJECT_SUCCESS);

      setActionRequest(null);
    } catch (error) {
      console.error("Resignation rejection failed:", error);
      toast.error(RESIGNATION_REQUEST_MESSAGES.REJECT_ERROR);
    }
  };

  const openRejectModal = () => {
    if (selectedIds.length !== 1) {
      return;
    }

    const selected = requests.find(
      (request) => request.id === selectedIds[0],
    );

    if (!selected) {
      return;
    }

    setActionRequest(selected);
  };

  return (
    <div className="min-h-full w-full bg-[#f3f4fa] p-4 md:p-5">
      {/* Main white content */}
      <div className="space-y-4">
        {/* Page title */}
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-5">
          <div className="inline-block">
            <h1 className="text-[15px] font-medium text-[#0086d1]">
              Resignation Requests
            </h1>

            <div className="mt-2 h-[2px] w-[102px] bg-[#0086d1]" />
          </div>
        </div>

        {/* Search and action area */}
        <ResignationRequestFilters
          search={search}
          onSearchChange={setSearch}
          onApprove={() => void handleApprove()}
          onReject={openRejectModal}
          onRefresh={refetch}
          disableActions={selectedIds.length === 0 || isActionLoading}
        />

        {/* Loading */}
        {isLoading || isFetching ? (
          <div className="rounded-lg border border-slate-200 bg-white px-5 py-4">
            <p className="text-sm text-slate-500">
              Loading resignation requests...
            </p>
          </div>
        ) : null}

        {/* Error */}
        {isError && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-4">
            <p className="text-sm text-red-500">
              Failed to load resignation requests.
            </p>
          </div>
        )}

        {/* Table */}
        {!isLoading && !isFetching && (
          <ResignationRequestTable
            requests={requests}
            selectedIds={selectedIds}
            onToggle={toggleSelection}
            onToggleAll={toggleSelectAll}
            onView={(request) => setDetailsRequest(request)}
          />
        )}
      </div>

      {/* Details modal */}
      {detailsRequest && (
        <ResignationRequestDetails
          request={detailsRequest}
          onClose={() => setDetailsRequest(null)}
        />
      )}

      {/* Approve / Reject modal */}
      {actionRequest && (
        <ResignationRequestModal
          request={actionRequest}
          action="reject"
          loading={isActionLoading}
          onClose={() => {
            setActionRequest(null);
          }}
          onConfirm={handleRejectConfirm}
        />
      )}
    </div>
  );
};

export default ResignationRequestPage;

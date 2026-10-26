import { useState } from "react";

import HelpdeskRequestDetails from "../components/HelpdeskRequestDetails";
import HelpdeskRequestModal from "../components/HelpdeskRequestModal";
import HelpdeskRequestsFilters from "../components/HelpdeskRequestsFilters";
import HelpdeskRequestsTable from "../components/HelpdeskRequestsTable";

import { useHelpdeskRequests } from "../hooks/useHelpdeskRequests";

import type {
  HelpdeskRequest,
} from "../types/helpdeskRequests.types";

const HelpdeskRequestsPage = () => {
  const {
    search,
    setSearch,
    requests,
    selectedIds,
    toggleSelection,
    toggleSelectAll,
    processAction,
    refetch,
    isLoading,
    isFetching,
    isError,
    isActionLoading,
  } = useHelpdeskRequests();

  const [detailsRequest, setDetailsRequest] =
    useState<HelpdeskRequest | null>(null);

  const [actionTarget, setActionTarget] = useState<{
    request: HelpdeskRequest;
    action: "approve" | "reject";
  } | null>(null);

  const openAction = (action: "approve" | "reject") => {
    if (selectedIds.length !== 1) {
      return;
    }

    const request = requests.find(
      (item) => item.id === selectedIds[0],
    );

    if (!request) {
      return;
    }

    setActionTarget({ request, action });
  };

  const handleConfirmAction = async (remarks?: string) => {
    if (!actionTarget) {
      return;
    }

    const succeeded = await processAction(
      actionTarget.request,
      actionTarget.action,
      remarks,
    );
    if (succeeded) {
      setActionTarget(null);
    }
  };

  return (
    <div className="min-h-full w-full bg-[#f3f4fa] p-4 md:p-5">
      <div className="space-y-4">

        {/* Page Header */}
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-5">
          <div className="inline-block">
            <h1 className="text-[15px] font-medium text-[#0086d1]">
              Helpdesk Requests
            </h1>

            <div className="mt-2 h-[2px] w-[105px] bg-[#0086d1]" />
          </div>
        </div>

        {/* Search + Actions */}
        <HelpdeskRequestsFilters
          search={search}
          onSearchChange={setSearch}
          onApprove={() => openAction("approve")}
          onReject={() => openAction("reject")}
          onRefresh={refetch}
          disableActions={
            selectedIds.length !== 1 ||
            isActionLoading
          }
        />

        {/* Loading */}
        {(isLoading || isFetching) && (
          <div className="rounded-lg border border-slate-200 bg-white px-5 py-4">
            <p className="text-sm text-slate-500">
              Loading helpdesk requests...
            </p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-4">
            <p className="text-sm text-red-500">
              Failed to load helpdesk requests.
            </p>
          </div>
        )}

        {/* Table */}
        {!isLoading && !isFetching && (
          <HelpdeskRequestsTable
            requests={requests}
            selectedIds={selectedIds}
            onToggle={toggleSelection}
            onToggleAll={toggleSelectAll}
            onView={(request) =>
              setDetailsRequest(request)
            }
          />
        )}
      </div>

      {/* Details Modal */}
      {detailsRequest && (
        <HelpdeskRequestDetails
          request={detailsRequest}
          onClose={() =>
            setDetailsRequest(null)
          }
        />
      )}

      {/* Approval/rejection modal */}
      {actionTarget && (
        <HelpdeskRequestModal
          request={actionTarget.request}
          action={actionTarget.action}
          loading={isActionLoading}
          onClose={() =>
            setActionTarget(null)
          }
          onConfirm={handleConfirmAction}
        />
      )}
    </div>
  );
};

export default HelpdeskRequestsPage;
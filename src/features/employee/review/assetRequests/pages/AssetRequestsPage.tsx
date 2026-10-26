import { useMemo, useState } from "react";

import {
  CheckCircle2,
  Clock3,
  Package,
  Plus,
  XCircle,
} from "lucide-react";

import {
  useCreateAssetRequestMutation,
} from "../api/assetRequestApi";

import AssetRequestCard from "../components/AssetRequestCard";
import AssetRequestFilters from "../components/AssetRequestFilters";
import AssetRequestForm from "../components/AssetRequestForm";
import AssetRequestModal from "../components/AssetRequestModal";
import AssetRequestTable from "../components/AssetRequestTable";

import { useAssetRequests } from "../hooks/useAssetRequests";

import type {
  AssetRequest,
  AssetRequestFormData,
} from "../types/assetRequest.types";

const AssetRequestsPage = () => {
  const {
    requests,
    filteredRequests,
    filters,
    setFilters,
    isLoading,
    isFetching,
    isError,
    handleApprove,
    handleReject,
  } = useAssetRequests();

  const [
    createAssetRequest,
    {
      isLoading: isCreating,
    },
  ] = useCreateAssetRequestMutation();

  const [
    selectedRequest,
    setSelectedRequest,
  ] = useState<AssetRequest | null>(
    null
  );

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const statistics = useMemo(() => {
    return {
      total: requests.length,

      pending: requests.filter(
        (item) =>
          item.status === "Pending"
      ).length,

      approved: requests.filter(
        (item) =>
          item.status === "Approved"
      ).length,

      rejected: requests.filter(
        (item) =>
          item.status === "Rejected"
      ).length,
    };
  }, [requests]);

  const resetFilters = () => {
    setFilters({
      search: "",
      status: "All",
      assetType: "All",
      priority: "All",
    });
  };

  const handleCreate = async (
    data: AssetRequestFormData
  ) => {
    try {
      await createAssetRequest(
        data
      ).unwrap();

      setShowForm(false);
    } catch (error) {
      console.error(
        "Failed to create asset request:",
        error
      );
    }
  };

  const handleApproveRequest = async (
    request: AssetRequest
  ) => {
    try {
      await handleApprove(
        request.id
      );
    } catch (error) {
      console.error(
        "Failed to approve request:",
        error
      );
    }
  };

  const handleRejectRequest = async (
    request: AssetRequest
  ) => {
    const remarks = window.prompt(
      "Enter rejection remarks:"
    );

    if (remarks === null) {
      return;
    }

    try {
      await handleReject(
        request.id,
        remarks
      );
    } catch (error) {
      console.error(
        "Failed to reject request:",
        error
      );
    }
  };

  return (
    <div className="min-h-full bg-[#f5f8fc] p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#172033]">
            Asset Requests
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage employee asset requests
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowForm(true)
          }
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          New Asset Request
        </button>
      </div>

      {/* Statistics */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* Total */}
        <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Requests
              </p>

              <p className="mt-2 text-2xl font-semibold text-gray-800">
                {statistics.total}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Package size={21} />
            </div>
          </div>
        </div>

        {/* Pending */}
        <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Pending
              </p>

              <p className="mt-2 text-2xl font-semibold text-gray-800">
                {statistics.pending}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock3 size={21} />
            </div>
          </div>
        </div>

        {/* Approved */}
        <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Approved
              </p>

              <p className="mt-2 text-2xl font-semibold text-gray-800">
                {statistics.approved}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 size={21} />
            </div>
          </div>
        </div>

        {/* Rejected */}
        <div className="rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Rejected
              </p>

              <p className="mt-2 text-2xl font-semibold text-gray-800">
                {statistics.rejected}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <XCircle size={21} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <AssetRequestFilters
        filters={filters}
        onChange={setFilters}
        onReset={resetFilters}
      />

      {/* Loading */}
      {isLoading && (
        <div className="rounded-xl border border-blue-100 bg-white p-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="mt-3 text-sm text-gray-500">
            Loading asset requests...
          </p>
        </div>
      )}

      {/* Error */}
      {isError && !isLoading && (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-600">
            Failed to load asset requests.
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <>
          <div className="hidden md:block">
            <AssetRequestTable
              requests={filteredRequests}
              onView={setSelectedRequest}
              onApprove={
                handleApproveRequest
              }
              onReject={
                handleRejectRequest
              }
            />
          </div>

          {/* Mobile */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredRequests.length ===
            0 ? (
              <div className="rounded-xl border border-blue-100 bg-white p-10 text-center text-sm text-gray-500">
                No asset requests found
              </div>
            ) : (
              filteredRequests.map(
                (request) => (
                  <AssetRequestCard
                    key={request.id}
                    request={request}
                    onView={
                      setSelectedRequest
                    }
                    onApprove={
                      handleApproveRequest
                    }
                    onReject={
                      handleRejectRequest
                    }
                  />
                )
              )
            )}
          </div>
        </>
      )}

      {/* Refresh indicator */}
      {isFetching && !isLoading && (
        <p className="mt-3 text-right text-xs text-gray-400">
          Updating...
        </p>
      )}

      {/* Create modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">
                New Asset Request
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Submit a request for an employee asset.
              </p>
            </div>

            <div className="p-6">
              <AssetRequestForm
                onSubmit={handleCreate}
                onCancel={() =>
                  setShowForm(false)
                }
                isSubmitting={
                  isCreating
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Details modal */}
      <AssetRequestModal
        request={selectedRequest}
        onClose={() =>
          setSelectedRequest(null)
        }
      />
    </div>
  );
};

export default AssetRequestsPage;
import { useState } from "react";

import RequisitionNavbar from "../components/RequisitionNavbar";
import RequisitionToolbar from "../components/RequisitionToolbar";
import RequisitionTable from "../components/RequisitionTable";
import RequisitionRemarksPage from "../components/RequisitionRemarksPage";
import type { Requisition } from "../types/requisition.types";

import { useRequisition } from "../hooks/useRequisition";
export default function RequisitionPage() {
  const {
    requisitions,
    search,
    setSearch,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    updateSelected,
    loading,
    error,
    actionError,
  } = useRequisition();

  const [showHistory, setShowHistory] = useState(false);
  const [approved, setApproved] = useState(false);
  const [rejectedRequests, setRejectedRequests] =
    useState<Requisition[]>([]);

  const handleApprove = async () => {
    const approvedRequests = await updateSelected("approved");

    if (approvedRequests.length > 0) {
      setApproved(true);
      setRejectedRequests([]);
    }
  };

  const handleReject = () => {
    const rejected = requisitions.filter((item) =>
      selectedIds.includes(item.id)
    );

    if (rejected.length === 0) {
      return;
    }

    setRejectedRequests(rejected);
    setApproved(false);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f9] p-4 font-[Urbanist] sm:p-5 md:p-[26px]">
      <div className="mx-auto w-full space-y-3 font-[Urbanist]">
        {/* Navbar */}
        <RequisitionNavbar />

        {/* Toolbar */}
        <RequisitionToolbar
          search={search}
          onSearchChange={setSearch}
          onApprove={() => {
            void handleApprove();
          }}
          onReject={() => {
            handleReject();
          }}
          onHistory={() => {
            setShowHistory((previous) => !previous);
          }}
          hasSelection={selectedIds.length > 0}
          approved={approved}
        />

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600 font-[Urbanist]"
          >
            {error}
          </div>
        )}

        {actionError && (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600 font-[Urbanist]"
          >
            {actionError}
          </div>
        )}

        {approved && (
          <div
            role="status"
            className="rounded-md border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700 font-[Urbanist]"
          >
            Leave requests approved successfully.
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-md bg-white p-5 text-center text-sm text-slate-500 font-[Urbanist]">
            Loading leave requisitions...
          </div>
        )}

        {/* History */}
        {showHistory && (
          <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-600 font-[Urbanist]">
            Leave history

            <button
              type="button"
              onClick={() => setShowHistory(false)}
              className="ml-3 text-sky-600 font-[Urbanist]"
            >
              Close
            </button>
          </div>
        )}

        {!loading && (
          <RequisitionTable
            requisitions={requisitions}
            selectedIds={selectedIds}
            onSelectAll={toggleSelectAll}
            onSelect={toggleSelect}
          />
        )}

        {!loading && rejectedRequests.length > 0 && (
          <RequisitionRemarksPage
            requisitions={rejectedRequests}
            onBack={() => setRejectedRequests([])}
            onSubmit={async (remarks) => {
              const rejected = await updateSelected("rejected", remarks);
              if (rejected.length > 0) setRejectedRequests([]);
            }}
          />
        )}
      </div>
    </div>
  );
}
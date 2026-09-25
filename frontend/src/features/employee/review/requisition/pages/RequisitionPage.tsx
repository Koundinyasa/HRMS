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

  const handleReject = async () => {
    const rejected = requisitions.filter((item) =>
      selectedIds.includes(item.id)
    );

    if (rejected.length === 0) {
      return;
    }

    setRejectedRequests(rejected);
    setApproved(false);

    try {
      await updateSelected("rejected");
    } catch (actionError) {
      console.error("Unable to reject leave requests.", actionError);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4f9] p-4 sm:p-5 md:p-[26px] font-[Urbanist]">
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
            void handleReject();
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
            className="rounded-md border border-black bg-red-50 p-3 text-sm text-red-600 font-[Urbanist]"
          >
            {error}
          </div>
        )}

        {actionError && (
          <div
            role="alert"
            className="rounded-md border border-black bg-red-50 p-3 text-sm text-red-600 font-[Urbanist]"
          >
            {actionError}
          </div>
        )}

        {approved && (
          <div
            role="status"
            className="rounded-md border border-black bg-green-50 p-4 text-sm font-medium text-green-700 font-[Urbanist]"
          >
            REQUEST IS APPROVED SUCCESSFULLY
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
          <div className="rounded-md border border-black bg-white p-4 text-sm text-slate-600 font-[Urbanist]">
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

        {/* Rejected remarks */}
        {!loading && rejectedRequests.length > 0 && (
          <RequisitionRemarksPage
            requisitions={rejectedRequests}
            onBack={() => setRejectedRequests([])}
          />
        )}

        {/* Table */}
        {!loading && rejectedRequests.length === 0 && (
          <RequisitionTable
            requisitions={requisitions}
            selectedIds={selectedIds}
            onSelectAll={toggleSelectAll}
            onSelect={toggleSelect}
          />
        )}

      </div>
    </div>
  );
}
import { useState } from "react";

import RequisitionNavbar from "../components/RequisitionNavbar";
import RequisitionToolbar from "../components/RequisitionToolbar";
import RequisitionTable from "../components/RequisitionTable";
import RequisitionRemarksPage from "./RequisitionRemarksPage";

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

  // ---------------------------------------
  // APPROVE
  // ---------------------------------------
  const handleApprove = async () => {
    const approvedRequests =
      await updateSelected("approved");

    if (approvedRequests.length > 0) {
      setApproved(true);
      setRejectedRequests([]);
    }
  };

  // ---------------------------------------
  // REJECT
  // ---------------------------------------
  const handleReject = () => {
    const rejected = requisitions.filter((item) =>
      selectedIds.includes(item.id)
    );

    if (rejected.length === 0) {
      return;
    }

    /*
     * Clicking Reject only opens the
     * rejection remarks modal.
     *
     * Reject API is called only when
     * Submit is clicked inside the modal.
     */
    setRejectedRequests(rejected);
    setApproved(false);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f9] p-4 sm:p-5 md:p-[26px] font-[Urbanist]">
      <div className="mx-auto w-full space-y-3 font-[Urbanist]">
        {/* Navbar */}
        <RequisitionNavbar />

        {/* ---------------------------------------
            TOOLBAR
           --------------------------------------- */}
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

        {/* ---------------------------------------
            FETCH ERROR
           --------------------------------------- */}
        {error && (
          <div
            role="alert"
            className="rounded-md border border-black bg-red-50 p-3 text-sm text-red-600 font-[Urbanist]"
          >
            {error}
          </div>
        )}

        {/* ---------------------------------------
            ACTION ERROR
           --------------------------------------- */}
        {actionError && (
          <div
            role="alert"
            className="rounded-md border border-black bg-red-50 p-3 text-sm text-red-600 font-[Urbanist]"
          >
            {actionError}
          </div>
        )}

        {/* ---------------------------------------
            APPROVED MESSAGE
           --------------------------------------- */}
        {approved && (
          <div
            role="status"
            className="rounded-md border border-black bg-green-50 p-4 text-sm font-medium text-green-700 font-[Urbanist]"
          >
            Approve has been selected successfully.
          </div>
        )}

        {/* ---------------------------------------
            LOADING
           --------------------------------------- */}
        {loading && (
          <div className="rounded-md bg-white p-5 text-center text-sm text-slate-500 font-[Urbanist]">
            Loading leave requisitions...
          </div>
        )}

        {/* ---------------------------------------
            HISTORY
           --------------------------------------- */}
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

        {/* ---------------------------------------
            MAIN TABLE

            IMPORTANT:
            Do NOT check rejectedRequests here.

            The table must remain visible while
            the rejection modal is open.
           --------------------------------------- */}
        {!loading && (
          <RequisitionTable
            requisitions={requisitions}
            selectedIds={selectedIds}
            onSelectAll={toggleSelectAll}
            onSelect={toggleSelect}
          />
        )}

        {/* ---------------------------------------
            REJECT REMARKS MODAL

            Render this AFTER the table so that
            it appears above the table.
           --------------------------------------- */}
        {!loading && rejectedRequests.length > 0 && (
          <RequisitionRemarksPage
            requisitions={rejectedRequests}
            onBack={() => setRejectedRequests([])}
            onSubmit={async (remarks) => {
              const rejectionRemarks = Object.fromEntries(
                rejectedRequests.map(({ id }) => [id, remarks]),
              );
              await updateSelected("rejected", rejectionRemarks);
            }}
          />
        )}
      </div>
    </div>
  );
}
import { useState } from "react";

import {
  Bookmark,
  ChevronLeft,
  History,
  Plus,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function PFMemberRegistrationPage() {
  const navigate = useNavigate();

  /* =====================================================
     MODAL STATES
  ===================================================== */

  const [showBatchModal, setShowBatchModal] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [batchName, setBatchName] = useState("");

  /* =====================================================
     OPEN BATCH CREATE
  ===================================================== */

  const handleOpenBatchModal = () => {
    setShowBatchModal(true);
    setShowConfirmModal(false);
  };

  /* =====================================================
     CLOSE BATCH CREATE
     
     IMPORTANT:
     Close does NOT immediately close the form.
     It opens the confirmation popup.
  ===================================================== */

  const handleCloseBatchModal = () => {
    setShowConfirmModal(true);
  };

  /* =====================================================
     CANCEL DISCARD
     
     Return to Batch Create.
     Keep entered Batch Name.
  ===================================================== */

  const handleCancelDiscard = () => {
    setShowConfirmModal(false);
  };

  /* =====================================================
     DISCARD
     
     Close both dialogs and clear changes.
  ===================================================== */

  const handleDiscard = () => {
    setShowConfirmModal(false);
    setShowBatchModal(false);
    setBatchName("");
  };

  /* =====================================================
     SAVE
  ===================================================== */

  const handleSave = () => {
    if (!batchName.trim()) {
      return;
    }

    /*
      KEEP YOUR EXISTING SAVE/API FUNCTIONALITY HERE.
    */

    setShowBatchModal(false);
    setShowConfirmModal(false);
    setBatchName("");
  };

  return (
    <div className="min-h-full w-full bg-[#f4f8fe] p-3 sm:p-4">

      {/* ==================================================
          TOP PF REPORT TABS
      ================================================== */}

      <div className="w-full rounded-xl border border-[#d8b6ad] bg-[#fff7f4] px-3 py-2 shadow-sm">

        <div className="flex items-center gap-4">

          {/* =================================================
              PF REPORT
          ================================================= */}

          <button
            type="button"
            className="flex h-11 min-w-[146px] items-center justify-center gap-2 rounded-lg border border-[#c89584] bg-white px-5 text-sm font-medium text-[#8b5e52] shadow-sm"
          >
            <ShieldIcon />

            <span>
              PF Report
            </span>
          </button>

          {/* =================================================
              ESI REPORT
          ================================================= */}

          <button
            type="button"
            className="flex h-11 min-w-[146px] items-center justify-center gap-2 rounded-lg border border-[#dddddd] bg-white px-5 text-sm font-medium text-[#555555] shadow-sm"
          >
            <span className="text-xl leading-none">
              +
            </span>

            <span>
              ESI Report
            </span>
          </button>

          {/* =================================================
              LWF REPORT
          ================================================= */}

          <button
            type="button"
            className="flex h-11 min-w-[146px] items-center justify-center gap-2 rounded-lg border border-[#dddddd] bg-white px-5 text-sm font-medium text-[#555555] shadow-sm"
          >
            <UsersIcon />

            <span>
              LWF Report
            </span>
          </button>

          {/* =================================================
              PT REPORT
          ================================================= */}

          <button
            type="button"
            className="flex h-11 min-w-[146px] items-center justify-center gap-2 rounded-lg border border-[#dddddd] bg-white px-5 text-sm font-medium text-[#555555] shadow-sm"
          >
            <span className="text-lg font-semibold">
              ₹
            </span>

            <span>
              PT Report
            </span>
          </button>

          {/* =================================================
              HISTORY
          ================================================= */}

          <button
            type="button"
            className="ml-auto flex h-10 w-10 items-center justify-center text-[#8b5e52]"
          >
            <History size={21} />
          </button>

        </div>
      </div>

      {/* ==================================================
          PAGE HEADER
      ================================================== */}

      <div className="mt-5 w-full rounded-xl border border-[#d8d5d3] bg-white px-4 py-2 shadow-sm">

        <div className="flex min-h-[54px] items-center">

          {/* =================================================
              PAGE TITLE
          ================================================= */}

          <div className="flex h-10 items-center gap-2 rounded-lg border border-[#c89584] bg-white px-4 text-sm font-semibold text-[#8b5e52]">

            <FileIcon />

            <span>
              PF Member Registration
            </span>

          </div>

          {/* =================================================
              BACK
          ================================================= */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="ml-auto flex h-10 items-center gap-2 rounded-lg bg-[#8b5e52] px-6 text-sm font-medium text-white shadow-sm transition hover:bg-[#74483d]"
          >
            <ChevronLeft size={18} />

            <span>
              Back
            </span>
          </button>

        </div>
      </div>

      {/* ==================================================
          PF BATCH
      ================================================== */}

      <div className="mt-3 w-full overflow-hidden rounded-xl border border-[#d8d5d3] bg-white shadow-sm">

        {/* =================================================
            PF BATCH HEADER
        ================================================= */}

        <div className="flex h-[66px] items-center justify-between border-b border-[#e1e5ea] bg-white px-5">

          <span className="text-[18px] font-semibold text-[#27364d]">
            PF Batch
          </span>

          {/* =================================================
              ADD BATCH
          ================================================= */}

          <button
            type="button"
            onClick={handleOpenBatchModal}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#c89584] bg-white text-[#8b5e52] transition hover:bg-[#fff7f4]"
          >
            <Plus size={22} />
          </button>

        </div>

        {/* =================================================
            PF BATCH CONTENT
        ================================================= */}

        <div className="min-h-[520px] bg-white" />

      </div>

      {/* ==================================================
          BATCH CREATE MODAL
      ================================================== */}

      {showBatchModal && (
        <div className="fixed inset-0 z-[99990] flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-[440px] overflow-hidden rounded-xl bg-white shadow-2xl">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex h-[60px] items-center border-b border-[#e0e4e8] bg-[#f7f9fc] px-5">

              <h2 className="text-[20px] font-semibold text-[#17243a]">
                Batch Create
              </h2>

            </div>

            {/* =================================================
                BODY
            ================================================= */}

            <div className="px-5 py-4">

              <label className="mb-2 block text-[16px] text-[#27364d]">

                Batch Name

                <span className="ml-1 text-red-500">
                  *
                </span>

              </label>

              <input
                type="text"
                value={batchName}
                onChange={(event) =>
                  setBatchName(event.target.value)
                }
                placeholder="development"
                className="h-12 w-full rounded-lg border border-[#c89584] bg-white px-4 text-[16px] text-[#27364d] outline-none placeholder:text-[#d9dee5] focus:border-[#8b5e52] focus:ring-2 focus:ring-[#8b5e52]/20"
              />

            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="flex items-center justify-end gap-4 border-t border-[#e0e4e8] bg-[#f7f9fc] px-5 py-4">

              {/* =================================================
                  CLOSE
              ================================================= */}

              <button
                type="button"
                onClick={handleCloseBatchModal}
                className="flex h-11 min-w-[122px] items-center justify-center gap-2 rounded-lg border border-[#bfc5cd] bg-white px-5 text-[16px] font-medium text-[#555f6d] transition hover:bg-[#f8f8f8]"
              >
                <X size={19} />

                <span>
                  Close
                </span>
              </button>

              {/* =================================================
                  SAVE
              ================================================= */}

              <button
                type="button"
                onClick={handleSave}
                className="flex h-11 min-w-[112px] items-center justify-center gap-2 rounded-lg bg-[#8b5e52] px-5 text-[16px] font-medium text-white shadow-sm transition hover:bg-[#74483d]"
              >
                <Bookmark size={18} />

                <span>
                  Save
                </span>
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ==================================================
          FORM CONFIRM MODAL
      ================================================== */}

      {showConfirmModal && (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-[480px] overflow-hidden rounded-xl bg-white shadow-2xl">

            {/* =================================================
                CONFIRM HEADER
            ================================================= */}

            <div className="flex h-[62px] items-center gap-3 border-b border-[#e0e4e8] bg-[#f7f9fc] px-6">

              <div className="flex h-7 w-7 items-center justify-center text-[#8b5e52]">
                <ConfirmIcon />
              </div>

              <h2 className="text-[20px] font-semibold text-[#8b5e52]">
                Form Confirm
              </h2>

            </div>

            {/* =================================================
                MESSAGE
            ================================================= */}

            <div className="flex min-h-[96px] flex-col items-center justify-center border-b border-[#eee3df] bg-[#fffaf8] px-5 text-center">

              <p className="text-[19px] font-medium text-[#c89584]">
                Are you sure
              </p>

              <p className="mt-2 text-[19px] font-semibold text-[#c89584]">
                You want to Discard your Changes!
              </p>

            </div>

            {/* =================================================
                CONFIRM FOOTER
            ================================================= */}

            <div className="flex items-center justify-end gap-3 bg-[#f7f9fc] px-5 py-4">

              {/* =================================================
                  CANCEL
              ================================================= */}

              <button
                type="button"
                onClick={handleCancelDiscard}
                className="flex h-11 min-w-[132px] items-center justify-center gap-2 rounded-lg border border-[#9fa6ae] bg-white px-5 text-[16px] font-medium text-[#555f6d] transition hover:bg-[#f8f8f8]"
              >
                <X size={19} />

                <span>
                  Cancel
                </span>
              </button>

              {/* =================================================
                  DISCARD
              ================================================= */}

              <button
                type="button"
                onClick={handleDiscard}
                className="flex h-11 min-w-[140px] items-center justify-center gap-2 rounded-lg bg-[#8b5e52] px-5 text-[16px] font-medium text-white shadow-sm transition hover:bg-[#74483d]"
              >
                <DiscardIcon />

                <span>
                  Discard
                </span>
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* ==========================================================
   SHIELD ICON
========================================================== */

function ShieldIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3L19 6V11C19 16 16 19 12 21C8 19 5 16 5 11V6L12 3Z" />
    </svg>
  );
}

/* ==========================================================
   USERS ICON
========================================================== */

function UsersIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 21V19C16 16.8 14.2 15 12 15H6C3.8 15 2 16.8 2 19V21" />

      <circle
        cx="9"
        cy="7"
        r="4"
      />

      <path d="M22 21V19C22 17.2 20.8 15.7 19 15.2" />

      <path d="M16 3.2C17.7 3.7 19 5.2 19 7C19 8.8 17.7 10.3 16 10.8" />
    </svg>
  );
}

/* ==========================================================
   FILE ICON
========================================================== */

function FileIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" />

      <path d="M14 2V8H20" />

      <path d="M8 13H16" />

      <path d="M8 17H16" />
    </svg>
  );
}

/* ==========================================================
   FORM CONFIRM ICON
========================================================== */

function ConfirmIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7H20" />
      <path d="M4 12H20" />
      <path d="M4 17H20" />
    </svg>
  );
}

/* ==========================================================
   DISCARD ICON
========================================================== */

function DiscardIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 7H18" />
      <path d="M9 7V4H15V7" />
      <path d="M8 7L9 20H15L16 7" />
      <path d="M10 11V17" />
      <path d="M14 11V17" />
    </svg>
  );
}
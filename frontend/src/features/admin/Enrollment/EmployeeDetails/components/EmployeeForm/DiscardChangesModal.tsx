import React from "react";
import { Info } from "lucide-react";

interface DiscardChangesModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DiscardChangesModal({
  open,
  onConfirm,
  onCancel,
}: DiscardChangesModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <div
        className="
          w-[420px]
          rounded-lg
          bg-gradient-to-b
          from-[#FFF9E8]
          to-white
          shadow-2xl
          px-6
          py-6
          text-center
        "
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* TITLE */}
        <p className="text-[15px] font-semibold text-[#D6B34A]">
          Are you sure
        </p>

        <p className="mt-0.5 text-[15px] font-semibold text-[#D6B34A]">
          You want to Discard your Changes!
        </p>

        {/* INFO MESSAGE */}
        <div
          className="
            mt-4
            flex
            items-center
            justify-center
            gap-2
            rounded-full
            border
            border-[#D6ECFF]
            bg-[#EFF8FF]
            px-4
            py-2
            text-[12px]
            text-gray-600
          "
        >
          <Info
            size={15}
            className="shrink-0 text-[#2196F3]"
          />

          <span>
            If not, please save your changes.
          </span>
        </div>

        {/* BUTTONS */}
        <div className="mt-5 flex items-center justify-center gap-3">
          {/* YES */}
          <button
            type="button"
            onClick={onConfirm}
            className="
              min-w-[68px]
              rounded
              bg-[#2196F3]
              px-5
              py-1.5
              text-[13px]
              font-semibold
              tracking-wide
              text-white
              hover:bg-[#1976D2]
            "
          >
            YES
          </button>

          {/* NO */}
          <button
            type="button"
            onClick={onCancel}
            className="
              min-w-[68px]
              rounded
              border
              border-[#F0D77B]
              bg-[#FFF7DE]
              px-5
              py-1.5
              text-[13px]
              font-semibold
              tracking-wide
              text-[#B08900]
              hover:bg-[#FFF1C2]
            "
          >
            NO
          </button>
        </div>
      </div>
    </div>
  );
}
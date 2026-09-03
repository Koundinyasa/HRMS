import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ChatTeamMember } from "../types/chatbot.types";

const GRADIENT_STYLE = { backgroundImage: 'var(--primary-gradient)' };

interface TeamPreviewModalProps {
  teamName: string;
  members: ChatTeamMember[];
  onClose: () => void;
  onDownload?: () => void;
}

export default function TeamPreviewModal({
  teamName,
  members,
  onClose,
  onDownload,
}: TeamPreviewModalProps) {
  // Esc key closes the preview, same as the X button or clicking the backdrop.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[380px] rounded-2xl bg-white shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div style={GRADIENT_STYLE} className="px-[18px] py-3.5">
          <div className="flex items-center justify-between">
            <p className="text-[15px] font-semibold text-white m-0">
              {teamName}
            </p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="text-white/85 hover:text-white text-lg leading-none bg-transparent border-none cursor-pointer"
            >
              &times;
            </button>
          </div>
          <p className="text-[11px] text-white/80 mt-1 mb-0">
            {members.length} member{members.length === 1 ? "" : "s"}
          </p>
        </div>

        {/* Body */}
        <div className="px-[18px] py-1 max-h-[320px] overflow-y-auto">
          {members.length === 0 ? (
            <p className="text-[13px] text-[#8b86a3] py-6 text-center m-0">
              No members found for this team.
            </p>
          ) : (
            <table className="w-full text-[12.5px] border-collapse">
              <tbody>
                {members.map((m, i) => (
                  <tr
                    key={m.employeeId}
                    className={i > 0 ? "border-t border-[#eceef5]" : ""}
                  >
                    <td className="py-2 text-[#1f2430]">
                      {m.name}
                      <div className="text-[11px] text-[#8a90a5]">{m.employeeId}</div>
                    </td>
                    <td className="py-2 text-[#4a4f5c] text-right">{m.designation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-[18px] py-3.5 flex gap-2 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-[11px] text-[12.5px] font-medium text-[#4a4f5c] border border-[#eceef5] bg-white cursor-pointer hover:bg-[#f6f4ff]"
          >
            Close
          </button>
          {onDownload && (
            <button
              type="button"
              onClick={onDownload}
              style={GRADIENT_STYLE}
              className={`px-4 py-2 rounded-[11px] text-[12.5px] font-semibold text-white border-none cursor-pointer shadow-[0_5px_14px_rgba(109,94,252,0.3)]`}
            >
              Download
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
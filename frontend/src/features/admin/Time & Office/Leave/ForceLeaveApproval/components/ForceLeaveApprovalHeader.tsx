import { Check, ClockFading, FileSpreadsheet, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ForceLeaveApprovalHeaderProps } from "../types/forceapproval.types";

export default function ForceLeaveApprovalHeader({
  hasSelection,
  isApproving,
  isRejecting,
  onApprove,
  onReject,
  onExport,
}: ForceLeaveApprovalHeaderProps) {
  return (
    <div className="min-w-0 overflow-x-auto rounded-[10px] border border-[#df8d7c] bg-[#fff7f5] px-3 py-3 shadow-[0_1px_3px_rgba(15,23,42,0.04)] [scrollbar-color:#c58b7f_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#c58b7f] xl:overflow-x-visible sm:px-5">
      <div className="flex min-h-[48px] w-max min-w-full flex-nowrap items-center justify-between gap-3 xl:w-full">
        <h3 className="inline-flex min-h-[46px] w-fit max-w-full items-center rounded-[9px] border border-[#df8d7c] bg-white px-4 py-2 text-lg font-bold leading-7 text-[#9a5547] shadow-sm sm:text-[22px]">
          Leave Approval
        </h3>

        <div className="flex shrink-0 flex-nowrap items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            onClick={onApprove}
            disabled={!hasSelection || isApproving}
            className={`h-12 rounded-l-lg px-5 text-[15px] font-medium ${hasSelection ? "bg-[#16a34a] text-white hover:bg-[#15803d]" : "cursor-not-allowed bg-[#E5E5E5] text-[#AAAAAA]"}`}
          >
            <span className="flex items-center gap-2"><Check size={15} />{isApproving ? "Approving..." : "Approve"}</span>
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onReject}
            disabled={!hasSelection || isRejecting}
            className={`h-12 border-l border-white/50 px-5 text-[15px] font-medium ${hasSelection ? "bg-[#EF4444] text-white hover:bg-[#DC2626]" : "cursor-not-allowed bg-[#E5E5E5] text-[#AAAAAA]"}`}
          >
            <span className="flex items-center gap-2"><XIcon size={15} />{isRejecting ? "Rejecting..." : "Reject"}</span>
          </Button>
          <Button type="button" variant="ghost" onClick={onExport} title="Download Excel" className="ml-4 flex h-14 w-14 items-center justify-center text-[#378B35] transition-none hover:scale-100 hover:bg-transparent hover:text-[#378B35]">
            <FileSpreadsheet size={48} strokeWidth={3} />
          </Button>
          <Button type="button" variant="ghost" title="History" className="ml-2 flex h-14 w-14 items-center justify-center text-[#a45a4a]">
            <ClockFading size={48} strokeWidth={3} />
          </Button>
        </div>
      </div>
    </div>
  );
}

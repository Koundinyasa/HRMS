import { Button } from "@/components/ui/button";
import type { ForceLeaveApprovalTabsProps } from "../types/forceapproval.types";

const ForceLeaveApprovalTabs = ({
  activeTab,
  onTabChange,
}: ForceLeaveApprovalTabsProps) => {
  return (
    <div className="inline-flex items-center rounded-lg bg-[#F1F2F6] p-1.5 font-[Urbanist]">

      {/* Applied Leave */}

      <Button variant="ghost"
        type="button"
        onClick={() =>
          onTabChange("applied")
        }
        className={`rounded-md px-9 py-2.5 text-[16px] font-medium transition ${
          activeTab === "applied"
            ? "bg-[#f8e4df] text-[#9a5547]"
            : "bg-transparent text-[#27364F]"
        }`}
      >
        Applied Leave
      </Button>


      {/* Leave Cancellation tab temporarily hidden.
      <Button variant="ghost"
        type="button"
        onClick={() => onTabChange("cancellation")}
        className={`rounded-md px-5 py-2.5 text-[16px] font-medium transition ${
          activeTab === "cancellation"
            ? "bg-[#f8e4df] text-[#9a5547]"
            : "bg-transparent text-[#27364F]"
        }`}
      >
        Leave Cancellation
      </Button>
      */}

    </div>
  );
};

export default ForceLeaveApprovalTabs;

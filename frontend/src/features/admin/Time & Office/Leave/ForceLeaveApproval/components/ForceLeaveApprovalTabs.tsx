// interface ForceLeaveApprovalTabsProps {
//   activeTab: "applied" | "cancellation";
//   onTabChange: (tab: "applied" | "cancellation") => void;
// }

// const ForceLeaveApprovalTabs = ({
//   activeTab,
//   onTabChange,
// }: ForceLeaveApprovalTabsProps) => {
//   return (
//     <div className="flex items-center gap-8 border-b border-slate-200 font-[Urbanist]">
//       <button
//         type="button"
//         onClick={() => onTabChange("applied")}
//         className={`relative pb-3 text-[15px] font-medium ${
//           activeTab === "applied"
//             ? "font-semibold text-[#269BD7]"
//             : "text-slate-600"
//         }`}
//       >
//         Applied Leave
//         {activeTab === "applied" && (
//           <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#269BD7]" />
//         )}
//       </button>

//       <button
//         type="button"
//         onClick={() => onTabChange("cancellation")}
//         className={`relative pb-3 text-[15px] font-medium ${
//           activeTab === "cancellation"
//             ? "font-semibold text-[#269BD7]"
//             : "text-slate-600"
//         }`}
//       >
//         Leave Cancellation
//         {activeTab === "cancellation" && (
//           <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#269BD7]" />
//         )}
//       </button>
//     </div>
//   );
// };

// export default ForceLeaveApprovalTabs;

interface ForceLeaveApprovalTabsProps {
  activeTab: "applied" | "cancellation";
  onTabChange: (
    tab: "applied" | "cancellation",
  ) => void;
}

const ForceLeaveApprovalTabs = ({
  activeTab,
  onTabChange,
}: ForceLeaveApprovalTabsProps) => {
  return (
    <div className="inline-flex items-center rounded-lg bg-[#F1F2F6] p-1.5 font-[Urbanist]">

      {/* Applied Leave */}

      <button
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
      </button>


      {/* Leave Cancellation */}

      <button
        type="button"
        onClick={() =>
          onTabChange("cancellation")
        }
        className={`rounded-md px-5 py-2.5 text-[16px] font-medium transition ${
          activeTab === "cancellation"
            ? "bg-[#f8e4df] text-[#9a5547]"
            : "bg-transparent text-[#27364F]"
        }`}
      >
        Leave Cancellation
      </button>

    </div>
  );
};

export default ForceLeaveApprovalTabs;

// import { useState } from "react";
// import ForceLeaveApprovalFilters from "../components/ForceLeaveApprovalFilters";
// import ForceLeaveApprovalPanel from "../components/ForceLeaveApprovalPanel";
// import ForceLeaveApprovalTabs from "../components/ForceLeaveApprovalTabs";

// const ForceLeaveApprovalPage = () => {
//   const [activeTab, setActiveTab] = useState<
//     "applied" | "cancellation"
//   >("applied");

//   const [search, setSearch] = useState("");

//   return (
//     <div className="flex w-full min-w-0 flex-col gap-3 overflow-x-hidden font-[Urbanist]">
//       {/* Page / existing shared panel */}
//       <ForceLeaveApprovalPanel />

//       {/* Applied Leave / Leave Cancellation */}
//       <div className="w-full rounded-lg border border-slate-200 bg-white px-5 pt-4 shadow-sm">
//         <ForceLeaveApprovalTabs
//           activeTab={activeTab}
//           onTabChange={setActiveTab}
//         />
//       </div>

//       {/* Filters */}
//       <ForceLeaveApprovalFilters
//         searchValue={search}
//         onSearchChange={setSearch}
//         onAddFilter={() => {}}
//         onClear={() => setSearch("")}
//       />

//       {/* Main content */}
//       <div className="min-h-[500px] w-full rounded-lg bg-white">
//         {/* 
//           ForceLeaveApprovalPanel / API integration
//           will provide the actual approval data here.
          
//           No mock data is used.
//         */}
//       </div>
//     </div>
//   );
// };

// export default ForceLeaveApprovalPage;

import ForceLeaveApprovalPanel from "../components/ForceLeaveApproalPanel";

const ForceLeaveApprovalPage = () => {
  return (
    <div className="w-full font-[Urbanist]">
      <ForceLeaveApprovalPanel />
    </div>
  );
};

export default ForceLeaveApprovalPage;
// import {
//   Plus,
//   Pencil,
//   Trash2,
//   Clock3,
//   Settings2,
//   MoreVertical,
// } from "lucide-react";

// import { useGetPolicyLeavesQuery } from "../api/settingsApi";

// interface PolicyContentProps {
//   policyId: number | null;
//   policyName?: string;
//   onAddLeaveType: () => void;
//   onEditLeave?: (leaveId: number) => void;
//   onDeleteLeave?: (leaveId: number) => void;
//   onOpenBehavior?: (leaveId: number) => void;
//   onViewHistory?: (leaveId: number) => void;
// }

// interface PolicyLeaveItem {
//   leaveId: number;
//   leaveName?: string;
//   leaveTypeName?: string;
//   shortName?: string;
//   isActive?: boolean;
//   active?: boolean;
//   effectiveFrom?: string | null;
//   [key: string]: unknown;
// }

// function formatDate(value?: string | null) {
//   if (!value) return "-";

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return value;
//   }

//   return date.toLocaleDateString("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// }

// export default function PolicyContent({
//   policyId,
//   policyName,
//   onAddLeaveType,
//   onEditLeave,
//   onDeleteLeave,
//   onOpenBehavior,
//   onViewHistory,
// }: PolicyContentProps) {
//   const {
//     data: leaves,
//     isLoading,
//     isFetching,
//     isError,
//   } = useGetPolicyLeavesQuery(policyId ?? 0, {
//     skip: !policyId,
//   });

//   const leaveList = (leaves ?? []) as PolicyLeaveItem[];

//   if (!policyId) {
//     return (
//       <section className="flex min-w-0 flex-1 items-center justify-center rounded-[10px] border border-[#D9E6DF] bg-white p-6">
//         <div className="text-center">
//           <Settings2
//             size={32}
//             strokeWidth={1.5}
//             className="mx-auto text-[#8A938F]"
//           />

//           <h2 className="mt-3 font-serif text-[18px] font-semibold text-[#303532]">
//             Select a Leave Policy
//           </h2>

//           <p className="mt-1 max-w-[360px] font-[Urbanist] text-[13px] leading-5 text-[#7A8580]">
//             Select a policy from the left panel to view and manage its leave
//             types.
//           </p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[10px] border border-[#D9E6DF] bg-white">
//       {/* Header */}
//       <div className="flex flex-col gap-3 border-b border-[#E4EAE7] px-4 py-3 sm:px-5 md:flex-row md:items-center md:justify-between">
//         <div className="min-w-0">
//           <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
//             <h2 className="truncate font-serif text-[18px] font-semibold text-[#2F3431] sm:text-[20px]">
//               {policyName || "Leave Policy"}
//             </h2>

//             <span className="rounded-full bg-[#EAF8F0] px-2.5 py-1 font-[Urbanist] text-[11px] font-medium text-[#008A4E]">
//               Active Policy
//             </span>
//           </div>

//           <div className="mt-1.5 h-[2px] w-[48px] rounded-full bg-[#009B57]" />
//         </div>

//         <div className="flex shrink-0 items-center gap-2">
//           {onViewHistory && (
//             <button
//               type="button"
//               title="View History"
//               onClick={() => onViewHistory(0)}
//               className="flex h-[36px] w-[36px] items-center justify-center rounded-[7px] border border-[#D7E0DB] bg-white text-[#66716C] transition hover:border-[#009B57] hover:text-[#009B57]"
//             >
//               <Clock3 size={16} strokeWidth={1.8} />
//             </button>
//           )}

//           <button
//             type="button"
//             onClick={onAddLeaveType}
//             className="flex h-[36px] items-center justify-center gap-2 rounded-[7px] bg-[#009B57] px-3.5 font-[Urbanist] text-[13px] font-medium text-white transition hover:bg-[#00854A] sm:px-4"
//           >
//             <Plus size={16} strokeWidth={2} />
//             <span className="hidden xs:inline sm:inline">
//               Add Leave Type
//             </span>
//             <span className="sm:hidden">Add</span>
//           </button>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="min-h-0 flex-1 overflow-auto">
//         {isLoading || isFetching ? (
//           <div className="space-y-2 p-4">
//             {[1, 2, 3, 4].map((item) => (
//               <div
//                 key={item}
//                 className="h-[52px] animate-pulse rounded-[7px] bg-[#F2F5F3]"
//               />
//             ))}
//           </div>
//         ) : isError ? (
//           <div className="flex min-h-[300px] items-center justify-center p-6">
//             <p className="font-[Urbanist] text-[13px] text-[#B42318]">
//               Unable to load leave types for this policy.
//             </p>
//           </div>
//         ) : leaveList.length === 0 ? (
//           <div className="flex min-h-[300px] flex-col items-center justify-center p-6 text-center">
//             <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#EEF9F3]">
//               <Plus
//                 size={22}
//                 strokeWidth={1.8}
//                 className="text-[#009B57]"
//               />
//             </div>

//             <h3 className="mt-3 font-serif text-[17px] font-semibold text-[#343936]">
//               No Leave Types Added
//             </h3>

//             <p className="mt-1 max-w-[340px] font-[Urbanist] text-[13px] leading-5 text-[#7A8580]">
//               Add a leave type to this policy to start configuring its
//               settings.
//             </p>

//             <button
//               type="button"
//               onClick={onAddLeaveType}
//               className="mt-4 rounded-[7px] border border-[#009B57] px-4 py-2 font-[Urbanist] text-[13px] font-medium text-[#009B57] transition hover:bg-[#F0FBF5]"
//             >
//               Add Leave Type
//             </button>
//           </div>
//         ) : (
//           <div className="min-w-[760px]">
//             {/* Table Header */}
//             <div className="grid grid-cols-[minmax(190px,1.5fr)_110px_100px_120px_100px] items-center border-b border-[#E4EAE7] bg-[#F8FBF9] px-4 py-3 md:px-5">
//               <div className="font-[Urbanist] text-[11px] font-semibold uppercase tracking-[0.03em] text-[#66716C]">
//                 Leave Name
//               </div>

//               <div className="font-[Urbanist] text-[11px] font-semibold uppercase tracking-[0.03em] text-[#66716C]">
//                 Short Name
//               </div>

//               <div className="font-[Urbanist] text-[11px] font-semibold uppercase tracking-[0.03em] text-[#66716C]">
//                 Active
//               </div>

//               <div className="font-[Urbanist] text-[11px] font-semibold uppercase tracking-[0.03em] text-[#66716C]">
//                 Effective From
//               </div>

//               <div className="text-right font-[Urbanist] text-[11px] font-semibold uppercase tracking-[0.03em] text-[#66716C]">
//                 Action
//               </div>
//             </div>

//             {/* Rows */}
//             {leaveList.map((leave, index) => {
//               const leaveName =
//                 leave.leaveName ||
//                 leave.leaveTypeName ||
//                 "-";

//               const isActive =
//                 leave.isActive ?? leave.active ?? true;

//               return (
//                 <div
//                   key={
//                     leave.leaveId ??
//                     `${leaveName}-${index}`
//                   }
//                   className="grid grid-cols-[minmax(190px,1.5fr)_110px_100px_120px_100px] items-center border-b border-[#EDF0EE] px-4 py-3 transition hover:bg-[#FBFDFC] md:px-5"
//                 >
//                   {/* Leave */}
//                   <div className="min-w-0 pr-3">
//                     <div className="truncate font-[Urbanist] text-[13px] font-medium text-[#303633]">
//                       {leaveName}
//                     </div>
//                   </div>

//                   {/* Short name */}
//                   <div className="font-[Urbanist] text-[13px] text-[#5E6863]">
//                     {leave.shortName || "-"}
//                   </div>

//                   {/* Active */}
//                   <div>
//                     <span
//                       className={[
//                         "inline-flex items-center rounded-full px-2.5 py-1",
//                         "font-[Urbanist] text-[11px] font-medium",
//                         isActive
//                           ? "bg-[#EAF8F0] text-[#008A4E]"
//                           : "bg-[#F1F2F2] text-[#737B77]",
//                       ].join(" ")}
//                     >
//                       {isActive ? "Active" : "Inactive"}
//                     </span>
//                   </div>

//                   {/* Effective date */}
//                   <div className="font-[Urbanist] text-[12px] text-[#68736E]">
//                     {formatDate(leave.effectiveFrom)}
//                   </div>

//                   {/* Actions */}
//                   <div className="flex items-center justify-end gap-1">
//                     {onOpenBehavior && (
//                       <button
//                         type="button"
//                         title="Leave Settings"
//                         onClick={() =>
//                           onOpenBehavior(leave.leaveId)
//                         }
//                         className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] text-[#66716C] transition hover:bg-[#EEF9F3] hover:text-[#009B57]"
//                       >
//                         <Settings2
//                           size={15}
//                           strokeWidth={1.8}
//                         />
//                       </button>
//                     )}

//                     {onEditLeave && (
//                       <button
//                         type="button"
//                         title="Edit"
//                         onClick={() =>
//                           onEditLeave(leave.leaveId)
//                         }
//                         className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] text-[#66716C] transition hover:bg-[#EEF9F3] hover:text-[#009B57]"
//                       >
//                         <Pencil
//                           size={14}
//                           strokeWidth={1.8}
//                         />
//                       </button>
//                     )}

//                     {onDeleteLeave && (
//                       <button
//                         type="button"
//                         title="Delete"
//                         onClick={() =>
//                           onDeleteLeave(leave.leaveId)
//                         }
//                         className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] text-[#66716C] transition hover:bg-[#FFF2F1] hover:text-[#D92D20]"
//                       >
//                         <Trash2
//                           size={14}
//                           strokeWidth={1.8}
//                         />
//                       </button>
//                     )}

//                     {!onOpenBehavior &&
//                       !onEditLeave &&
//                       !onDeleteLeave && (
//                         <button
//                           type="button"
//                           title="More"
//                           className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] text-[#66716C]"
//                         >
//                           <MoreVertical
//                             size={15}
//                             strokeWidth={1.8}
//                           />
//                         </button>
//                       )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* Mobile horizontal-scroll hint */}
//       {leaveList.length > 0 && (
//         <div className="border-t border-[#E8ECEA] px-4 py-2 text-center sm:hidden">
//           <span className="font-[Urbanist] text-[10px] text-[#8A938F]">
//             Swipe horizontally to view all columns
//           </span>
//         </div>
//       )}
//     </section>
//   );
// }

import { Settings as SettingsIcon, Trash2 } from "lucide-react";

interface LeaveItem {
  leaveId: number;
  leaveName: string;
  shortName: string;
  active: boolean;
  icon?: React.ComponentType<{ size?: number }>;
}

interface PolicyContentProps {
  leaves: LeaveItem[];
  loading?: boolean;
  onSettings: (leaveId: number) => void;
  onDeleteLeave: (leaveId: number) => void;
}

export default function PolicyContent({
  leaves,
  loading = false,
  onSettings,
  onDeleteLeave,
}: PolicyContentProps) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-slate-100 bg-white p-3 shadow-sm sm:p-5">
      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-slate-500">
              <th className="pb-3 font-medium">Leave Name</th>
              <th className="pb-3 font-medium">Short Name</th>
              <th className="pb-3 font-medium">Active</th>
              <th className="pb-3 text-right font-medium">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 text-center text-slate-400"
                >
                  Loading...
                </td>
              </tr>
            ) : leaves.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-8 text-center text-slate-400"
                >
                  No leave types added to this policy yet.
                </td>
              </tr>
            ) : (
              leaves.map((leave) => {
                const Icon = leave.icon;

                return (
                  <tr
                    key={leave.leaveId}
                    className="border-b border-slate-50"
                  >
                    {/* Leave Name */}
                    <td className="py-3">
                      <span className="flex items-center gap-2">
                        {Icon && (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                            <Icon size={13} />
                          </span>
                        )}

                        <span className="text-slate-700">
                          {leave.leaveName}
                        </span>
                      </span>
                    </td>

                    {/* Short Name */}
                    <td className="py-3">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        {leave.shortName}
                      </span>
                    </td>

                    {/* Active */}
                    <td className="py-3">
                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold ${
                          leave.active
                            ? "bg-emerald-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {leave.active ? "True" : "False"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 text-right">
                      <span className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          aria-label={`Configure ${leave.leaveName}`}
                          onClick={() => onSettings(leave.leaveId)}
                          className="text-slate-400 transition-colors hover:text-slate-600"
                        >
                          <SettingsIcon size={15} />
                        </button>

                        <button
                          type="button"
                          aria-label={`Remove ${leave.leaveName}`}
                          onClick={() => onDeleteLeave(leave.leaveId)}
                          className="text-red-400 transition-colors hover:text-red-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
// // import {
// //   Plus,
// //   Search,
// //   ChevronRight,
// //   Pencil,
// //   Trash2,
// // } from "lucide-react";

// // import { useGetLeavePoliciesQuery } from "../api/settingsApi";

// // export interface LeavePolicyItem {
// //   policyId: number;
// //   policyName: string;
// //   isActive?: boolean;
// // }

// // interface PolicySidebarProps {
// //   selectedPolicyId: number | null;
// //   onPolicySelect: (policyId: number) => void;
// //   onAddPolicy: () => void;
// //   onEditPolicy?: (policyId: number) => void;
// //   onDeletePolicy?: (policyId: number) => void;
// // }

// // export default function PolicySidebar({
// //   selectedPolicyId,
// //   onPolicySelect,
// //   onAddPolicy,
// //   onEditPolicy,
// //   onDeletePolicy,
// // }: PolicySidebarProps) {
// //   const {
// //     data: policies,
// //     isLoading,
// //     isFetching,
// //     isError,
// //   } = useGetLeavePoliciesQuery();

// //   const policyList = (policies ?? []) as LeavePolicyItem[];

// //   return (
// //     <aside className="flex h-full w-full min-w-[250px] max-w-[285px] flex-col overflow-hidden rounded-[10px] border border-[#D9E6DF] bg-white">
// //       {/* Header */}
// //       <div className="flex items-center justify-between border-b border-[#E4EAE7] px-4 py-3">
// //         <div>
// //           <h2 className="font-serif text-[17px] font-semibold text-[#2E2E2E]">
// //             Leave Policy
// //           </h2>

// //           <div className="mt-1 h-[2px] w-[42px] rounded-full bg-[#009B57]" />
// //         </div>

// //         <button
// //           type="button"
// //           onClick={onAddPolicy}
// //           title="Add Leave Policy"
// //           className="flex h-[32px] w-[32px] items-center justify-center rounded-[7px] bg-[#009B57] text-white transition hover:bg-[#00854A]"
// //         >
// //           <Plus size={17} strokeWidth={2} />
// //         </button>
// //       </div>

// //       {/* Search */}
// //       <div className="border-b border-[#E8ECEA] px-3 py-3">
// //         <div className="flex h-[36px] items-center gap-2 rounded-[7px] border border-[#D8DFDC] bg-[#FAFCFB] px-3">
// //           <Search
// //             size={15}
// //             strokeWidth={1.8}
// //             className="shrink-0 text-[#7A8580]"
// //           />

// //           <input
// //             type="text"
// //             placeholder="Search policy"
// //             className="min-w-0 flex-1 bg-transparent font-[Urbanist] text-[13px] text-[#333] outline-none placeholder:text-[#9AA39F]"
// //           />
// //         </div>
// //       </div>

// //       {/* Policy list */}
// //       <div className="min-h-0 flex-1 overflow-y-auto">
// //         {isLoading || isFetching ? (
// //           <div className="space-y-2 px-3 py-3">
// //             {[1, 2, 3].map((item) => (
// //               <div
// //                 key={item}
// //                 className="h-[42px] animate-pulse rounded-[7px] bg-[#F1F5F3]"
// //               />
// //             ))}
// //           </div>
// //         ) : isError ? (
// //           <div className="px-4 py-8 text-center">
// //             <p className="font-[Urbanist] text-[13px] text-[#B42318]">
// //               Unable to load leave policies.
// //             </p>
// //           </div>
// //         ) : policyList.length === 0 ? (
// //           <div className="px-4 py-10 text-center">
// //             <p className="font-[Urbanist] text-[13px] text-[#7A8580]">
// //               No leave policies found.
// //             </p>

// //             <button
// //               type="button"
// //               onClick={onAddPolicy}
// //               className="mt-3 font-[Urbanist] text-[13px] font-medium text-[#009B57] hover:underline"
// //             >
// //               Add Leave Policy
// //             </button>
// //           </div>
// //         ) : (
// //           <div className="p-2">
// //             {policyList.map((policy) => {
// //               const isSelected =
// //                 selectedPolicyId === policy.policyId;

// //               return (
// //                 <div
// //                   key={policy.policyId}
// //                   className={[
// //                     "group mb-1 flex min-h-[43px] items-center rounded-[7px]",
// //                     "border transition-all duration-150",
// //                     isSelected
// //                       ? "border-[#B7E1CD] bg-[#F0FBF5]"
// //                       : "border-transparent hover:border-[#DDE9E3] hover:bg-[#FAFCFB]",
// //                   ].join(" ")}
// //                 >
// //                   <button
// //                     type="button"
// //                     onClick={() =>
// //                       onPolicySelect(policy.policyId)
// //                     }
// //                     className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2 text-left"
// //                   >
// //                     <ChevronRight
// //                       size={15}
// //                       strokeWidth={1.8}
// //                       className={[
// //                         "shrink-0 transition-transform",
// //                         isSelected
// //                           ? "rotate-90 text-[#009B57]"
// //                           : "text-[#8A938F]",
// //                       ].join(" ")}
// //                     />

// //                     <span
// //                       className={[
// //                         "truncate font-[Urbanist] text-[13px]",
// //                         isSelected
// //                           ? "font-semibold text-[#009B57]"
// //                           : "text-[#343A37]",
// //                       ].join(" ")}
// //                     >
// //                       {policy.policyName}
// //                     </span>
// //                   </button>

// //                   {/* Actions */}
// //                   {(onEditPolicy || onDeletePolicy) && (
// //                     <div className="mr-1 hidden items-center gap-0.5 group-hover:flex">
// //                       {onEditPolicy && (
// //                         <button
// //                           type="button"
// //                           title="Edit Policy"
// //                           onClick={() =>
// //                             onEditPolicy(policy.policyId)
// //                           }
// //                           className="flex h-[27px] w-[27px] items-center justify-center rounded-[5px] text-[#68736E] hover:bg-white hover:text-[#009B57]"
// //                         >
// //                           <Pencil
// //                             size={13}
// //                             strokeWidth={1.8}
// //                           />
// //                         </button>
// //                       )}

// //                       {onDeletePolicy && (
// //                         <button
// //                           type="button"
// //                           title="Delete Policy"
// //                           onClick={() =>
// //                             onDeletePolicy(policy.policyId)
// //                           }
// //                           className="flex h-[27px] w-[27px] items-center justify-center rounded-[5px] text-[#68736E] hover:bg-white hover:text-[#D92D20]"
// //                         >
// //                           <Trash2
// //                             size={13}
// //                             strokeWidth={1.8}
// //                           />
// //                         </button>
// //                       )}
// //                     </div>
// //                   )}
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         )}
// //       </div>
// //     </aside>
// //   );
// // }

// import { Pencil, Plus, Trash2 } from "lucide-react";

// interface PolicyItem {
//   policyId: number;
//   name: string;
//   shortLabel: string;
// }

// interface PolicySidebarProps {
//   policies: PolicyItem[];
//   activePolicyId: number | null;
//   loading?: boolean;
//   onSelectPolicy: (policyId: number) => void;
//   onAddPolicy: () => void;
//   onEditPolicy: (policyId: number) => void;
//   onDeletePolicy: (policyId: number) => void;
// }

// export default function PolicySidebar({
//   policies,
//   activePolicyId,
//   loading = false,
//   onSelectPolicy,
//   onAddPolicy,
//   onEditPolicy,
//   onDeletePolicy,
// }: PolicySidebarProps) {
//   return (
//     <div className="w-full rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
//       {/* Header */}
//       <div className="mb-3 flex items-center justify-between">
//         <h3 className="font-serif text-sm font-semibold text-slate-800">
//           Leave Policy
//         </h3>

//         <button
//           type="button"
//           onClick={onAddPolicy}
//           aria-label="Add leave policy"
//           className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500 text-emerald-600 transition-colors hover:bg-emerald-50"
//         >
//           <Plus size={14} />
//         </button>
//       </div>

//       {/* Policy List */}
//       <div className="flex flex-col gap-2">
//         {loading ? (
//           <p className="px-1 py-2 text-xs text-slate-400">
//             Loading...
//           </p>
//         ) : policies.length === 0 ? (
//           <p className="px-1 py-2 text-xs text-slate-400">
//             No leave policies found.
//           </p>
//         ) : (
//           policies.map((policy) => {
//             const isActive = policy.policyId === activePolicyId;

//             return (
//               <div
//                 key={policy.policyId}
//                 onClick={() => onSelectPolicy(policy.policyId)}
//                 className={`flex cursor-pointer items-center justify-between gap-2 rounded-lg border px-3 py-2.5 transition-colors ${
//                   isActive
//                     ? "border-slate-200 bg-slate-50"
//                     : "border-transparent hover:bg-slate-50"
//                 }`}
//               >
//                 {/* Policy information */}
//                 <div className="flex min-w-0 items-center gap-2">
//                   <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-100 text-xs font-semibold text-blue-600">
//                     {policy.shortLabel}
//                   </span>

//                   <span className="truncate text-sm font-medium text-sky-600">
//                     {policy.name}
//                   </span>
//                 </div>

//                 {/* Actions */}
//                 <div className="flex shrink-0 items-center gap-1">
//                   <button
//                     type="button"
//                     aria-label={`Edit ${policy.name}`}
//                     onClick={(event) => {
//                       event.stopPropagation();
//                       onEditPolicy(policy.policyId);
//                     }}
//                     className="text-slate-400 transition-colors hover:text-slate-600"
//                   >
//                     <Pencil size={13} />
//                   </button>

//                   <button
//                     type="button"
//                     aria-label={`Delete ${policy.name}`}
//                     onClick={(event) => {
//                       event.stopPropagation();
//                       onDeletePolicy(policy.policyId);
//                     }}
//                     className="text-red-400 transition-colors hover:text-red-600"
//                   >
//                     <Trash2 size={13} />
//                   </button>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );
// }

import { FileText, Plus, Pencil, Trash2 } from "lucide-react";

export interface PolicySidebarItem {
  policyId: number;
  policyName: string;
}

interface PolicySidebarProps {
  policies: PolicySidebarItem[];
  activePolicyId: number | null;
  onPolicySelect: (policyId: number) => void;
  onAddPolicy: () => void;
  onEditPolicy?: (policyId: number) => void;
  onDeletePolicy?: (policyId: number) => void;
}

export default function PolicySidebar({
  policies,
  activePolicyId,
  onPolicySelect,
  onAddPolicy,
  onEditPolicy,
  onDeletePolicy,
}: PolicySidebarProps) {
  return (
    <aside className="w-[235px] shrink-0 border-r border-[#D7DDE5] bg-white">
      {/* Header */}
      <div className="flex h-[61px] items-center justify-between bg-[#E8EDF5] px-[21px]">
        <h2 className="font-urbanist text-[18px] font-semibold text-[#172033]">
          Leave Policy
        </h2>

        <button
          type="button"
          onClick={onAddPolicy}
          title="Add Leave Policy"
          className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] border border-[#1FA9F5] bg-white text-[#1FA9F5] transition hover:bg-[#EFF9FF]"
        >
          <Plus size={23} strokeWidth={1.8} />
        </button>
      </div>

      {/* Policies */}
      <div className="px-[5px] pt-[8px]">
        {policies.map((policy) => {
          const selected =
            policy.policyId === activePolicyId;

          return (
            <div
              key={policy.policyId}
              className={`group mb-[8px] flex items-center rounded-[9px] ${
                selected
                  ? "border border-[#00A86B] bg-white"
                  : "border border-transparent"
              }`}
            >
              <button
                type="button"
                onClick={() =>
                  onPolicySelect(policy.policyId)
                }
                className="flex min-w-0 flex-1 items-center gap-[9px] px-[9px] py-[10px] text-left"
              >
                <span
                  className={`flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[6px] border ${
                    selected
                      ? "border-[#B8DDC9] bg-[#F3FBF7] text-[#00A86B]"
                      : "border-[#B7BEC8] bg-white text-[#536174]"
                  }`}
                >
                  <FileText
                    size={15}
                    strokeWidth={1.7}
                  />
                </span>

                <span
                  className={`truncate font-urbanist text-[13px] ${
                    selected
                      ? "font-medium text-[#00A86B]"
                      : "font-medium text-[#172033]"
                  }`}
                >
                  {policy.policyName}
                </span>
              </button>

              {/* Optional edit/delete actions */}
              <div className="mr-[6px] hidden items-center gap-[4px] group-hover:flex">
                {onEditPolicy && (
                  <button
                    type="button"
                    onClick={() =>
                      onEditPolicy(policy.policyId)
                    }
                    className="p-1 text-[#64748B] hover:text-[#00A86B]"
                  >
                    <Pencil size={13} />
                  </button>
                )}

                {onDeletePolicy && (
                  <button
                    type="button"
                    onClick={() =>
                      onDeletePolicy(policy.policyId)
                    }
                    className="p-1 text-[#EF4444]"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

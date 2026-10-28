import ApprovalsEmptyState from "../components/ApprovalsEmptyState";

export default function AllCompanyApprovalsPage() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4">
      <div className="border-b border-slate-200 pb-2">
        <span className="relative inline-block px-1 pb-2 text-sm font-semibold text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600">
          All Company Approvals
        </span>
      </div>
      <ApprovalsEmptyState />
    </div>
  );
}








// import ApprovalsEmptyState from "../components/ApprovalsEmptyState";
// import { useAllCompanyApprovals } from "../hooks/useAllCompanyApprovals";

// export default function AllCompanyApprovalsPage() {
//   const { items, isLoading, isError } = useAllCompanyApprovals();

//   return (
//     <div className="flex w-full min-w-0 flex-col gap-4">
//       <div className="border-b border-slate-200 pb-2">
//         <span className="relative inline-block px-1 pb-2 text-sm font-semibold text-blue-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600">
//           All Company Approvals
//         </span>
//       </div>

//       {isLoading && (
//         <div className="p-6 text-sm text-slate-500">Loading…</div>
//       )}

//       {isError && (
//         <div className="p-6 text-sm text-red-500">Failed to load approvals.</div>
//       )}

//       {!isLoading && !isError && items.length === 0 && <ApprovalsEmptyState />}

//       {!isLoading && !isError && items.length > 0 && (
//         <ul className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
//           {items.map((item) => (
//             <li
//               key={item.id}
//               className="border-b border-slate-100 py-2 text-sm last:border-0"
//             >
//               {item.companyName} — {item.requestType} ({item.status})
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }
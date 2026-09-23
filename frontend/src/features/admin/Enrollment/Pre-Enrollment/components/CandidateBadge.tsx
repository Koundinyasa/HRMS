// import type { CandidateStatus } from "../../types/preEnrollment.types";

// interface CandidateBadgeProps {
//   status: CandidateStatus;
// }

// export default function CandidateBadge({
//   status,
// }: CandidateBadgeProps) {
//   const isCompleted = status === "Completed";

//   return (
//     <span
//       className={`inline-flex max-w-full shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-semibold sm:px-3 sm:text-xs ${
//         isCompleted
//           ? "bg-emerald-100 text-emerald-700"
//           : "bg-slate-100 text-slate-700"
//       }`}
//     >
//       {status}
//     </span>
//   );
// }


import type { CandidateStatus } from "../../types/preEnrollment.types";

interface CandidateBadgeProps {
  status: CandidateStatus;
}

export default function CandidateBadge({
  status,
}: CandidateBadgeProps) {
  const isCompleted = status === "Completed";

  return (
    <span
      className={`inline-flex max-w-full shrink-0 items-center rounded-full px-2.5 py-1 font-urbanist text-xs font-semibold leading-4 sm:px-3 ${
        isCompleted
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}
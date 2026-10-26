// import { BadgeCheck } from "lucide-react";
// import { candidateDocuments } from "../../constants/completed-candidate.constants";
// import CandidateFormsSection from "../../components/CandidateFormsSection";

// export default function CandidateFormsPage() {
//   return (
//     <div className="space-y-6">

//       {
// }
//       <CandidateFormsSection documents={candidateDocuments} />

//       {
// }
//       <div className="w-full max-w-[365px] overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">

//         {
// }
//         <div className="bg-slate-200 px-4 py-2.5">
//           <h2 className="text-sm font-semibold text-slate-800">
//             File Requirement
//           </h2>
//         </div>

//         {
// }
//         <div className="flex min-h-[100px] items-center border-b border-slate-100 px-4 py-4">
//           <div className="flex min-w-0 items-center gap-3">
//             <BadgeCheck
//               size={19}
//               strokeWidth={2}
//               className="text-emerald-400"
//             />

//             <span className="text-[11px] font-semibold leading-5 text-emerald-400">
//               The Selected File Should be Valid
//             </span>
//           </div>
//         </div>

//         {
// }
//         <div className="h-9 bg-white" />
//       </div>

//     </div>
//   );
// }

import noDataImage from "@/assets/images/no-data.png";

export default function CandidateFormsPage() {
  return (
      <div className="w-full overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
        <div className="grid grid-cols-2 border-b border-slate-200 bg-[#f4eae7] text-sm font-semibold text-[#7a3d32]">
          <div className="px-4 py-3 text-center">Emp ID</div>
          <div className="px-4 py-3 text-center">Emp Name</div>
        </div>

        <div className="flex min-h-[420px] flex-col items-center justify-center bg-[#f8f9fb] px-4 py-10 text-center">
          <img
            src={noDataImage}
            alt="No data available"
            className="h-[220px] w-auto object-contain"
          />

          <p className="mt-6 text-base font-medium text-slate-600 md:text-lg">
            Select at least one category to view records.
          </p>
        </div>
      </div>
    );
}
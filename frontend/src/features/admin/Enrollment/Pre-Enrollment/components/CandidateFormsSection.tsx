// import { Download, Eye } from "lucide-react";
// import type { CandidateDocumentItem } from "../../types/preEnrollment.types";

// interface CandidateFormsSectionProps {
//   documents: CandidateDocumentItem[];
// }

// export default function CandidateFormsSection({
//   documents,
// }: CandidateFormsSectionProps) {
//   return (
//     <div className="space-y-4">
//     <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 shadow-sm sm:rounded-[32px]">
        
//         {
// }
//         <div className="grid min-w-max grid-cols-[1fr_160px_120px_80px] gap-2 border-b border-slate-200 bg-slate-100 px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">
//           <span>Document</span>

//           <span className="text-right">
//             View
//           </span>

//           <span className="text-right">
//             Download
//           </span>

//           <span className="text-right">
//             Select
//           </span>
//         </div>

//         {
// }
//         <div className="divide-y divide-slate-200 bg-white px-5 py-3">
//           {documents.map((document) => (
//             <div
//               key={document.id}
//               className="grid min-w-max grid-cols-[1fr_160px_120px_80px] items-center gap-2 py-4 text-sm text-slate-700"
//             >
//               {
// }
//               <span>
//                 {document.label}
//               </span>

//               {
// }
//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   title="View Document"
//                   className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-sky-100 hover:text-sky-600"
//                 >
//                   <Eye
//                     size={18}
//                     strokeWidth={2}
//                   />
//                 </button>
//               </div>

//               {
// }
//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   title="Download Document"
//                   className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-sky-100 hover:text-sky-600"
//                 >
//                   <Download
//                     size={18}
//                     strokeWidth={2}
//                   />
//                 </button>
//               </div>

//               {
// }
//               <div className="flex justify-end">
//                 <input
//                   type="checkbox"
//                   className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
//                 />
//               </div>
//             </div>
//           ))}

//           {
// }
//           {documents.length === 0 && (
//             <div className="px-5 py-10 text-center text-sm text-slate-500">
//               No documents found.
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


import { Download, Eye } from "lucide-react";
import type { CandidateDocumentItem } from "../../types/preEnrollment.types";

interface CandidateFormsSectionProps {
  documents: CandidateDocumentItem[];
}

export default function CandidateFormsSection({
  documents,
}: CandidateFormsSectionProps) {
  return (
    <div className="space-y-4 font-urbanist">
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 shadow-sm sm:rounded-[32px]">
        {/* Table Header */}
        <div className="grid min-w-max grid-cols-[1fr_160px_120px_80px] gap-2 border-b border-slate-200 bg-slate-100 px-5 py-4 font-urbanist text-sm font-semibold leading-5 text-slate-600">
          <span>Document</span>

          <span className="text-right">
            View
          </span>

          <span className="text-right">
            Download
          </span>

          <span className="text-right">
            Select
          </span>
        </div>

        {/* Table Content */}
        <div className="divide-y divide-slate-200 bg-white px-5 py-3">
          {documents.map((document) => (
            <div
              key={document.id}
              className="grid min-w-max grid-cols-[1fr_160px_120px_80px] items-center gap-2 py-4 font-urbanist text-sm font-medium leading-5 text-slate-700"
            >
              {/* Document */}
              <span className="font-medium text-slate-800">
                {document.label}
              </span>

              {/* View */}
              <div className="flex justify-end">
                <button
                  type="button"
                  title="View Document"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-sky-100 hover:text-sky-600"
                >
                  <Eye
                    size={18}
                    strokeWidth={2}
                  />
                </button>
              </div>

              {/* Download */}
              <div className="flex justify-end">
                <button
                  type="button"
                  title="Download Document"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-sky-100 hover:text-sky-600"
                >
                  <Download
                    size={18}
                    strokeWidth={2}
                  />
                </button>
              </div>

              {/* Select */}
              <div className="flex justify-end">
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
              </div>
            </div>
          ))}

          {/* Empty State */}
          {documents.length === 0 && (
            <div className="px-5 py-10 text-center font-urbanist text-sm font-medium leading-5 text-slate-500">
              No documents found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


import { BadgeCheck } from "lucide-react";
import { candidateDocuments } from "../../constants/completed-candidate.constants";
import CandidateFormsSection from "../../components/CandidateFormsSection";

export default function CandidateFormsPage() {
  return (
    <div className="space-y-6">

      {
}
      <CandidateFormsSection documents={candidateDocuments} />

      {
}
      <div className="w-full max-w-[365px] overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">

        {
}
        <div className="bg-slate-200 px-4 py-2.5">
          <h2 className="text-sm font-semibold text-slate-800">
            File Requirement
          </h2>
        </div>

        {
}
        <div className="flex min-h-[100px] items-center border-b border-slate-100 px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <BadgeCheck
              size={19}
              strokeWidth={2}
              className="text-emerald-400"
            />

            <span className="text-[11px] font-semibold leading-5 text-emerald-400">
              The Selected File Should be Valid
            </span>
          </div>
        </div>

        {
}
        <div className="h-9 bg-white" />
      </div>

    </div>
  );
}

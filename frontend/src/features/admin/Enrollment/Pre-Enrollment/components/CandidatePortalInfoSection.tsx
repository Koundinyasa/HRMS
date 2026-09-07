import type { CompletedCandidateRow } from "../../types/preEnrollment.types";

interface CandidatePortalInfoSectionProps {
  candidate: CompletedCandidateRow;
}

export default function CandidatePortalInfoSection({ candidate }: CandidatePortalInfoSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Contact Details</p>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <div>
              <p className="font-medium text-slate-800">Email</p>
              <p className="mt-1">{candidate.email}</p>
            </div>
            <div>
              <p className="font-medium text-slate-800">Mobile</p>
              <p className="mt-1">{candidate.mobile}</p>
            </div>
            <div>
              <p className="font-medium text-slate-800">Designation</p>
              <p className="mt-1">{candidate.designation}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-slate-50 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Address</p>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <div>
              <p className="font-medium text-slate-800">Street</p>
              <p className="mt-1">{candidate.address}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="font-medium text-slate-800">City</p>
                <p className="mt-1">{candidate.city}</p>
              </div>
              <div>
                <p className="font-medium text-slate-800">State</p>
                <p className="mt-1">{candidate.state}</p>
              </div>
              <div>
                <p className="font-medium text-slate-800">Zip</p>
                <p className="mt-1">{candidate.zipCode}</p>
              </div>
            </div>
            <div>
              <p className="font-medium text-slate-800">Country</p>
              <p className="mt-1">{candidate.country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


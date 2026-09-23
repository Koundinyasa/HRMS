// import type { CompletedCandidateRow } from "../../types/preEnrollment.types";

// interface CandidateDetailsSectionProps {
//   candidate: CompletedCandidateRow;
// }

// export default function CandidateDetailsSection({ candidate }: CandidateDetailsSectionProps) {
//   return (
//     <div className="grid gap-4 md:grid-cols-2">
//       <div className="rounded-3xl bg-slate-50 p-5 shadow-sm">
//         <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Profile Photo</p>
//         <div className="mt-4 flex items-center gap-4">
//           <img src={candidate.profilePhotoUrl} alt={candidate.name} className="h-24 w-24 rounded-3xl object-cover" />
//           <div>
//             <p className="text-sm font-semibold text-slate-900">{candidate.name}</p>
//             <p className="mt-1 text-sm text-slate-500">{candidate.designation}</p>
//           </div>
//         </div>
//       </div>
//       <div className="grid gap-4">
//         <div className="rounded-3xl bg-slate-50 p-5 shadow-sm">
//           <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Personal Details</p>
//           <div className="mt-4 grid gap-3 sm:grid-cols-2">
//             <div>
//               <p className="text-sm font-medium text-slate-700">Full Name</p>
//               <p className="mt-1 text-sm text-slate-900">{candidate.name}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-slate-700">Date of Birth</p>
//               <p className="mt-1 text-sm text-slate-900">{candidate.dob}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-slate-700">Gender</p>
//               <p className="mt-1 text-sm text-slate-900">{candidate.gender}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-slate-700">Marital Status</p>
//               <p className="mt-1 text-sm text-slate-900">{candidate.maritalStatus}</p>
//             </div>
//             <div className="sm:col-span-2">
//               <p className="text-sm font-medium text-slate-700">Qualification</p>
//               <p className="mt-1 text-sm text-slate-900">{candidate.qualification}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import type { CompletedCandidateRow } from "../../types/preEnrollment.types";

interface CandidateDetailsSectionProps {
  candidate: CompletedCandidateRow;
}

export default function CandidateDetailsSection({
  candidate,
}: CandidateDetailsSectionProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Profile */}
      <div className="rounded-3xl bg-slate-50 p-5 shadow-sm font-urbanist">
        {/* Heading */}
        <p className="text-sm font-semibold leading-5 tracking-normal text-slate-600">
          Profile Photo
        </p>

        <div className="mt-4 flex items-center gap-4">
          <img
            src={candidate.profilePhotoUrl}
            alt={candidate.name}
            className="h-24 w-24 rounded-3xl object-cover"
          />

          <div>
            {/* Subheading */}
            <p className="text-base font-semibold leading-6 text-slate-900">
              {candidate.name}
            </p>

            {/* Body */}
            <p className="mt-1 text-sm font-medium leading-5 text-slate-500">
              {candidate.designation}
            </p>
          </div>
        </div>
      </div>

      {/* Personal Details */}
      <div className="grid gap-4">
        <div className="rounded-3xl bg-slate-50 p-5 shadow-sm font-urbanist">
          {/* Heading */}
          <p className="text-sm font-semibold leading-5 tracking-normal text-slate-600">
            Personal Details
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {/* Full Name */}
            <div>
              {/* Label */}
              <p className="text-sm font-semibold leading-5 text-slate-700">
                Full Name
              </p>

              {/* Body */}
              <p className="mt-1 text-sm font-medium leading-5 text-slate-900">
                {candidate.name}
              </p>
            </div>

            {/* Date of Birth */}
            <div>
              {/* Label */}
              <p className="text-sm font-semibold leading-5 text-slate-700">
                Date of Birth
              </p>

              {/* Body */}
              <p className="mt-1 text-sm font-medium leading-5 text-slate-900">
                {candidate.dob}
              </p>
            </div>

            {/* Gender */}
            <div>
              {/* Label */}
              <p className="text-sm font-semibold leading-5 text-slate-700">
                Gender
              </p>

              {/* Body */}
              <p className="mt-1 text-sm font-medium leading-5 text-slate-900">
                {candidate.gender}
              </p>
            </div>

            {/* Marital Status */}
            <div>
              {/* Label */}
              <p className="text-sm font-semibold leading-5 text-slate-700">
                Marital Status
              </p>

              {/* Body */}
              <p className="mt-1 text-sm font-medium leading-5 text-slate-900">
                {candidate.maritalStatus}
              </p>
            </div>

            {/* Qualification */}
            <div className="sm:col-span-2">
              {/* Label */}
              <p className="text-sm font-semibold leading-5 text-slate-700">
                Qualification
              </p>

              {/* Body */}
              <p className="mt-1 text-sm font-medium leading-5 text-slate-900">
                {candidate.qualification}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

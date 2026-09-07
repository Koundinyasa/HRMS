
// import { useMemo } from "react";
// import {
//   NavLink,
//   Outlet,
//   useLocation,
//   useNavigate,
//   useParams,
// } from "react-router-dom";
// import { ChevronLeft } from "lucide-react";

// import PreOnboardPageShell from "../components/PreOnboardPageShell";
// import { getCandidateById } from "../constants/completed-candidate.constants";
// import type { AddCandidateRow } from "../constants/add-candidate.constants";
// import type { CompletedCandidateRow } from "../types/completed-candidate.types";

// type CandidateNavigationState = {
//   candidateSource?: "add";
//   candidate?: AddCandidateRow;
// };

// function toDetailCandidate(
//   candidate: AddCandidateRow | undefined,
// ): CompletedCandidateRow | undefined {
//   if (!candidate) return undefined;

//   return {
//     ...candidate,
//     joiningDate: candidate.joining,
//     designation: "Not provided",
//     employeeId: "Not provided",
//     reportingTo: "Not provided",
//     address: "",
//     city: "",
//     state: "",
//     country: "",
//     zipCode: "",
//     profilePhotoUrl: "",
//     dob: "",
//     gender: "",
//     maritalStatus: "",
//     qualification: "",
//   };
// }

// export default function CompletedCandidateDetails() {
//   const { candidateId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const navigationState =
//     location.state as CandidateNavigationState | null;

//   const id = Number(candidateId);

//   const candidate = useMemo(
//     () =>
//       navigationState?.candidateSource === "add"
//         ? toDetailCandidate(navigationState.candidate)
//         : getCandidateById(id),
//     [id, navigationState],
//   );

//   /* =========================================================
//      SECONDARY TAB STYLE
//   ========================================================= */
//   const subNavClass = ({ isActive }: { isActive: boolean }) =>
//     `inline-flex h-10 items-center justify-center rounded-lg border px-3 text-[11px] font-medium whitespace-nowrap transition-all duration-200 ${
//       isActive
//         ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-200"
//         : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500"
//     }`;

//   /* =========================================================
//      CANDIDATE NOT FOUND
//   ========================================================= */
//   if (!candidate) {
//     return (
//       <PreOnboardPageShell>
//         <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
//           <p className="text-lg font-semibold text-slate-900">
//             Candidate not found
//           </p>

//           <p className="mt-2 text-sm text-slate-500">
//             Please return to the completed candidate list.
//           </p>

//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="mt-5 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
//           >
//             Back
//           </button>
//         </div>
//       </PreOnboardPageShell>
//     );
//   }

//   return (
//     <PreOnboardPageShell>
//       <div className="w-full min-w-0 space-y-4">

//         {/* =====================================================
//             SECONDARY NAVIGATION
//         ===================================================== */}
//         <div className="relative w-full min-h-[100px]">

//           {/* =================================================
//               LEFT SIDE - 3 + 2 TABS
//           ================================================= */}
//           <div className="grid w-fit grid-cols-3 gap-2">

//             {/* Row 1 - Candidate Tasks */}
//             <NavLink
//               to="tasks"
//               state={navigationState}
//               className={subNavClass}
//             >
//               Candidate Tasks
//             </NavLink>

//             {/* Row 1 - Candidate Portal Info */}
//             <NavLink
//               to="portal-info"
//               state={navigationState}
//               className={subNavClass}
//             >
//               Candidate Portal Info
//             </NavLink>

//             {/* Row 1 - Candidate Forms */}
//             <NavLink
//               to="forms"
//               state={navigationState}
//               className={subNavClass}
//             >
//               Candidate Forms
//             </NavLink>

//             {/* Row 2 - Activities Completed */}
//             <NavLink
//               to="activities-completed"
//               state={navigationState}
//               className={subNavClass}
//             >
//               Activities Completed
//             </NavLink>

//             {/* Row 2 - Offboard Candidate */}
//             <NavLink
//               to="offboard-candidate"
//               state={navigationState}
//               className={subNavClass}
//             >
//               Offboard Candidate
//             </NavLink>

//           </div>

//           {/* =================================================
//               BACK BUTTON - FAR RIGHT / SECOND ROW
//           ================================================= */}
//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="
//               absolute
//               right-0
//               top-[64px]
//               inline-flex
//               h-9
//               shrink-0
//               items-center
//               gap-1.5
//               rounded-lg
//               border
//               border-slate-200
//               bg-white
//               px-4
//               text-[11px]
//               font-medium
//               text-slate-600
//               shadow-sm
//               transition-all
//               hover:border-orange-300
//               hover:bg-orange-50
//               hover:text-orange-500
//             "
//           >
//             <ChevronLeft
//               size={15}
//               strokeWidth={2}
//             />

//             <span>Back</span>
//           </button>

//         </div>

//         {/* =====================================================
//             CANDIDATE INFORMATION CARD
//         ===================================================== */}
//         <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_5px_20px_rgba(15,23,42,0.10)]">

//           <div className="flex min-h-[130px] w-full items-center px-5 py-5">

//             {/* =================================================
//                 PROFILE
//             ================================================= */}
//             <div className="flex min-w-[320px] shrink-0 items-center gap-4">

//               {/* Profile Image */}
//               <div className="h-[80px] w-[80px] shrink-0 overflow-hidden rounded-full bg-slate-100">
//                 <img
//                   src="/images/candidate-profile.png"
//                   alt={candidate.name}
//                   className="h-full w-full object-cover"
//                 />
//               </div>

//               {/* Name + Status */}
//               <div className="min-w-0">

//                 <h2 className="truncate text-lg font-semibold text-slate-900">
//                   {candidate.name}
//                 </h2>

//                 <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
//                   <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//                   Onboarding Active
//                 </div>

//               </div>
//             </div>

//             {/* =================================================
//                 VERTICAL DIVIDER
//             ================================================= */}
//             <div className="mx-5 h-20 w-px shrink-0 bg-slate-200" />

//             {/* =================================================
//                 EMPLOYEE ID
//             ================================================= */}
//             <div className="min-w-0 flex-1 px-3">

//               <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
//                 Employee ID
//               </p>

//               <p className="mt-1 text-sm font-semibold text-slate-800">
//                 {candidate.employeeId}
//               </p>

//             </div>

//             {/* =================================================
//                 REPORTING TO
//             ================================================= */}
//             <div className="min-w-0 flex-1 px-3">

//               <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
//                 Reporting To
//               </p>

//               <p className="mt-1 truncate text-sm font-semibold text-slate-800">
//                 {candidate.reportingTo}
//               </p>

//             </div>

//             {/* =================================================
//                 JOINING DATE
//             ================================================= */}
//             <div className="min-w-0 flex-1 px-3">

//               <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
//                 Joining Date
//               </p>

//               <p className="mt-1 text-sm font-semibold text-slate-800">
//                 {candidate.joiningDate}
//               </p>

//             </div>

//             {/* =================================================
//                 MOBILE
//             ================================================= */}
//             <div className="min-w-0 flex-1 px-3">

//               <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
//                 Mobile No
//               </p>

//               <p className="mt-1 text-sm font-semibold text-slate-800">
//                 {candidate.mobile}
//               </p>

//             </div>

//             {/* =================================================
//                 DESIGNATION
//             ================================================= */}
//             <div className="min-w-0 flex-1 px-3">

//               <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
//                 Designation
//               </p>

//               <p className="mt-1 max-w-[150px] text-sm font-semibold leading-5 text-slate-800">
//                 {candidate.designation}
//               </p>

//             </div>

//           </div>
//         </div>

//         {/* =====================================================
//             CHILD PAGE CONTENT
//         ===================================================== */}
//         <Outlet />

//       </div>
//     </PreOnboardPageShell>
//   );
// }

import { useMemo } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { ChevronLeft } from "lucide-react";

import PreOnboardPageShell from "../components/PreEnrollmentPageShell";
import { getCandidateById } from "../constants/completed-candidate.constants";
import type { AddCandidateRow } from "../constants/add-candidate.constants";
import type { CompletedCandidateRow } from "../types/preEnrollment.types";

type CandidateNavigationState = {
  candidateSource?: "add";
  candidate?: AddCandidateRow;
};

function toDetailCandidate(
  candidate: AddCandidateRow | undefined,
): CompletedCandidateRow | undefined {
  if (!candidate) return undefined;

  return {
    ...candidate,
    joiningDate: candidate.joining,
    designation: "Not provided",
    employeeId: "Not provided",
    reportingTo: "Not provided",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    profilePhotoUrl: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    qualification: "",
  };
}

export default function CompletedCandidateDetails() {
  const { candidateId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationState =
    location.state as CandidateNavigationState | null;

  const id = Number(candidateId);

  const candidate = useMemo(
    () =>
      navigationState?.candidateSource === "add"
        ? toDetailCandidate(navigationState.candidate)
        : getCandidateById(id),
    [id, navigationState],
  );

  /* =========================================================
     SECONDARY TAB STYLE
  ========================================================= */
  const subNavClass = ({ isActive }: { isActive: boolean }) =>
    `
      inline-flex
      h-10
      items-center
      justify-center
      rounded-lg
      border
      px-3
      text-[12px]
      font-medium
      whitespace-nowrap
      transition-all
      duration-200
      ${
        isActive
          ? "border-orange-500 bg-orange-500 text-white shadow-[0_4px_10px_rgba(249,115,22,0.25)]"
          : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500"
      }
    `;

  /* =========================================================
     CANDIDATE NOT FOUND
  ========================================================= */
  if (!candidate) {
    return (
      <PreOnboardPageShell>
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
          <p className="text-lg font-semibold text-slate-900">
            Candidate not found
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Please return to the completed candidate list.
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              mt-5
              rounded-lg
              bg-orange-500
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-orange-600
            "
          >
            Back
          </button>
        </div>
      </PreOnboardPageShell>
    );
  }

  return (
    <PreOnboardPageShell>
      <div className="w-full min-w-0 space-y-4 px-3 sm:px-4">

        {/* =====================================================
            SECONDARY NAVIGATION
        ===================================================== */}
        <div className="flex w-full flex-col gap-3">

          {/* =================================================
              SECONDARY TABS
              3 TABS FIRST ROW
              2 TABS SECOND ROW
          ================================================= */}
          <div
            className="
              flex
              w-full
              flex-wrap
              gap-2
              sm:gap-x-4
              md:gap-x-8
            "
          >

            {/* Candidate Tasks */}
            <NavLink
              to="tasks"
              state={navigationState}
              className={subNavClass}
            >
              Candidate Tasks
            </NavLink>

            {/* Candidate Portal Info */}
            <NavLink
              to="portal-info"
              state={navigationState}
              className={subNavClass}
            >
              Candidate Portal Info
            </NavLink>

            {/* Candidate Forms */}
            <NavLink
              to="forms"
              state={navigationState}
              className={subNavClass}
            >
              Candidate Forms
            </NavLink>

            {/* Activities Completed */}
            <NavLink
              to="activities-completed"
              state={navigationState}
              className={subNavClass}
            >
              Activities Completed
            </NavLink>

            {/* Offboard Candidate */}
            <NavLink
              to="offboard-candidate"
              state={navigationState}
              className={subNavClass}
            >
              Offboard Candidate
            </NavLink>

          </div>

          {/* =================================================
              BACK BUTTON
              FAR RIGHT / SECOND ROW
          ================================================= */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              self-start
              sm:self-end
              inline-flex
              h-9
              shrink-0
              items-center
              gap-1.5
              rounded-lg
              border
              border-slate-200
              bg-white
              px-4
              text-[11px]
              font-medium
              text-slate-600
              shadow-sm
              transition-all
              hover:border-orange-300
              hover:bg-orange-50
              hover:text-orange-500
            "
          >
            <ChevronLeft
              size={15}
              strokeWidth={2}
            />

            <span>Back</span>
          </button>

        </div>

        {/* =====================================================
            CANDIDATE INFORMATION CARD
        ===================================================== */}
        <div
          className="
            w-full
            overflow-hidden
            rounded-2xl
            border
            border-slate-200
            bg-white
            shadow-[0_5px_20px_rgba(15,23,42,0.10)]
          "
        >
          <div className="grid w-full grid-cols-1 gap-4 px-4 py-5 sm:grid-cols-2 lg:grid-cols-[minmax(260px,1.4fr)_repeat(5,minmax(0,1fr))] lg:items-center lg:gap-0 lg:px-5">

            {/* =================================================
                PROFILE
            ================================================= */}
            <div className="flex min-w-0 items-center gap-4 lg:min-w-[260px]">

              {/* Profile Image */}
              <div className="h-[80px] w-[80px] shrink-0 overflow-hidden rounded-full bg-slate-100">
                <img
                  src="/images/candidate-profile.png"
                  alt={candidate.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Name + Status */}
              <div className="min-w-0">

                <h2 className="truncate text-lg font-semibold text-slate-900">
                  {candidate.name}
                </h2>

                <div
                  className="
                    mt-2
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-emerald-50
                    px-3
                    py-1
                    text-xs
                    font-medium
                    text-emerald-600
                  "
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  Onboarding Active
                </div>

              </div>
            </div>

            {/* =================================================
                VERTICAL DIVIDER
            ================================================= */}
            <div className="hidden lg:mx-5 lg:block lg:h-20 lg:w-px lg:shrink-0 lg:bg-slate-200" />

            {/* =================================================
                EMPLOYEE ID
            ================================================= */}
            <div className="min-w-0 lg:flex-1 lg:px-3">

              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Employee ID
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {candidate.employeeId}
              </p>

            </div>

            {/* =================================================
                REPORTING TO
            ================================================= */}
            <div className="min-w-0 lg:flex-1 lg:px-3">

              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Reporting To
              </p>

              <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                {candidate.reportingTo}
              </p>

            </div>

            {/* =================================================
                JOINING DATE
            ================================================= */}
            <div className="min-w-0 lg:flex-1 lg:px-3">

              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Joining Date
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {candidate.joiningDate}
              </p>

            </div>

            {/* =================================================
                MOBILE
            ================================================= */}
            <div className="min-w-0 lg:flex-1 lg:px-3">

              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Mobile No
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-800">
                {candidate.mobile}
              </p>

            </div>

            {/* =================================================
                DESIGNATION
            ================================================= */}
            <div className="min-w-0 lg:flex-1 lg:px-3">

              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Designation
              </p>

              <p className="mt-1 max-w-[150px] text-sm font-semibold leading-5 text-slate-800">
                {candidate.designation}
              </p>

            </div>

          </div>
        </div>

        {/* =====================================================
            CHILD PAGE CONTENT
        ===================================================== */}
        <Outlet />

      </div>
    </PreOnboardPageShell>
  );
}

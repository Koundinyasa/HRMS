// import { useState } from "react";
// import {
//   useNavigate,
//   useParams,
//   useSearchParams,
// } from "react-router-dom";

// import {
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   Eye,
//   Pencil,
//   History,
//   Plus,
//   Send,
//   PanelsTopLeft,
//   BookOpen,
//   Mail,
// } from "lucide-react";

// import AuditLogModal from "./AuditLog";
// import PreOnboardPageShell from "../components/PreEnrollmentPageShell";
// import {
//   addCandidates,
//   getAddedCandidates,
//   type AddCandidateRow,
// } from "../constants/add-candidate.constants";

// type Candidate = AddCandidateRow;

// export default function AddCandidate() {
//   const navigate = useNavigate();
//   const { domain } = useParams();
//   const [searchParams] = useSearchParams();

//   const basePath = domain
//     ? `/${domain}/admin/enrollment/pre-enrollment`
//     : "/admin/enrollment/pre-enrollment";

//   const [auditOpen, setAuditOpen] = useState(false);

//   const [selectedCandidate, setSelectedCandidate] =
//     useState<Candidate | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 5;

//   const candidates = [...getAddedCandidates(), ...addCandidates];
//   const searchQuery = (searchParams.get("q") ?? "").trim().toLowerCase();
//   const filteredCandidates = candidates.filter((candidate) =>
//     !searchQuery ||
//     candidate.name.toLowerCase().includes(searchQuery) ||
//     candidate.email.toLowerCase().includes(searchQuery) ||
//     candidate.mobile.toLowerCase().includes(searchQuery),
//   );
//   const totalPages = Math.max(1, Math.ceil(filteredCandidates.length / rowsPerPage));
//   const safePage = Math.min(currentPage, totalPages);
//   const visibleCandidates = filteredCandidates.slice(
//     (safePage - 1) * rowsPerPage,
//     safePage * rowsPerPage,
//   );

//   const getInitial = (name: string) =>
//     name.trim().charAt(0).toUpperCase();

//   const handleView = (candidate: Candidate) => {
//     navigate(
//       `${basePath}/completed-candidate/${candidate.id}/tasks`,
//       {
//         state: {
//           candidateSource: "add",
//           candidate,
//         },
//       },
//     );
//   };

//   const handleEdit = (candidate: Candidate) => {
//     navigate(
//       `${basePath}/completed-candidate/${candidate.id}/portal-info`,
//       {
//         state: {
//           candidateSource: "add",
//           candidate,
//         },
//       },
//     );
//   };

//   const handleHistory = (candidate: Candidate) => {
//     setSelectedCandidate(candidate);
//     setAuditOpen(true);
//   };

//   const closeAuditLog = () => {
//     setAuditOpen(false);
//     setSelectedCandidate(null);
//   };

//   return (
//     <PreOnboardPageShell>
//       <div className="w-full min-w-0 px-4 pb-6 pt-2 sm:px-4 md:px-5">

//         {/* =====================================================
//             TOP POLICY + ADD CANDIDATE
//         ===================================================== */}

//         <div className="mb-5 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

//           {/* Onboarding Policy */}

//           <button
//             type="button"
//             className="
//               inline-flex
//               h-9
//               items-center
//               gap-2
//               rounded-lg
//               border
//               border-slate-200
//               bg-white
//               px-3.5
//               text-[12px]
//               text-slate-700
//               shadow-sm
//               transition
//               hover:border-orange-300
//               hover:bg-orange-50
//             "
//           >
//             <span className="text-slate-600">
//               Onboarding Policy:
//             </span>

//             <span className="font-semibold text-slate-800">
//               Standard Policy
//             </span>

//             <ChevronDown
//               size={15}
//               strokeWidth={2}
//               className="text-slate-700"
//             />
//           </button>

//           {/* Add Candidate */}

//           <button
//             type="button"
//             onClick={() =>
//               navigate(`${basePath}/add-candidate/new`)
//             }
//             className="
//               -mt-1
//               inline-flex
//               h-9
//               items-center
//               gap-2
//               rounded-lg
//               border
//               border-orange-500
//               bg-white
//               px-4
//               text-sm
//               font-semibold
//               text-orange-500
//               transition
//               hover:bg-orange-50
//             "
//           >
//             <Plus
//               size={15}
//               strokeWidth={2.5}
//             />

//             Add Candidate
//           </button>
//         </div>

//         {/* =====================================================
//             MAIN CARD
//         ===================================================== */}

//         <div
//           className="
//             w-full
//             overflow-hidden
//             rounded-[16px]
//             border
//             border-slate-100
//             bg-white
//             shadow-[0_6px_20px_rgba(15,23,42,0.14)]
//           "
//         >

//           {/* ===================================================
//               CARD HEADER
//           =================================================== */}

//           <div
//             className="
//               flex
//               flex-wrap
//               min-h-[58px]
//               items-center
//               justify-between
//               px-3
//               py-3
//               sm:px-6
//             "
//           >

//             <h2
//               className="
//                 text-[15px]
//                 font-semibold
//                 text-slate-800
//               "
//             >
//               Onboarding Actions &amp; Candidates
//             </h2>

//             <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap">

//               {/* Asset Issue */}

//               <button
//                 type="button"
//                 className="
//                   inline-flex
//                   h-8
//                   items-center
//                   gap-1.5
//                   rounded-lg
//                   border
//                   border-slate-200
//                   bg-white
//                   px-3
//                   text-xs
//                   font-semibold
//                   text-slate-800
//                   shadow-sm
//                   transition
//                   hover:border-orange-300
//                   hover:bg-orange-50
//                   hover:text-orange-500
//                 "
//               >
//                 <PanelsTopLeft
//                   size={13}
//                   strokeWidth={2}
//                   className="text-slate-800"
//                 />

//                 Asset Issue
//               </button>

//               {/* Training Request */}

//               <button
//                 type="button"
//                 className="
//                   inline-flex
//                   h-8
//                   items-center
//                   gap-1.5
//                   rounded-lg
//                   border
//                   border-slate-200
//                   bg-white
//                   px-3
//                   text-xs
//                   font-semibold
//                   text-slate-800
//                   shadow-sm
//                   transition
//                   hover:border-orange-300
//                   hover:bg-orange-50
//                   hover:text-orange-500
//                 "
//               >
//                 <BookOpen
//                   size={13}
//                   strokeWidth={2}
//                   className="text-slate-800"
//                 />

//                 Training Request
//               </button>

//               {/* Intimation Mail */}

//               <button
//                 type="button"
//                 className="
//                   inline-flex
//                   h-8
//                   items-center
//                   gap-1.5
//                   rounded-lg
//                   border
//                   border-slate-200
//                   bg-white
//                   px-3
//                   text-xs
//                   font-semibold
//                   text-slate-800
//                   shadow-sm
//                   transition
//                   hover:border-orange-300
//                   hover:bg-orange-50
//                   hover:text-orange-500
//                 "
//               >
//                 <Mail
//                   size={13}
//                   strokeWidth={2}
//                   className="text-slate-800"
//                 />

//                 Intimation Mail
//               </button>

//               {/* Send */}

//               <button
//                 type="button"
//                 className="
//                   inline-flex
//                   h-8
//                   items-center
//                   gap-1.5
//                   rounded-lg
//                   bg-orange-500
//                   px-4
//                   text-xs
//                   font-semibold
//                   text-white
//                   shadow-sm
//                   transition
//                   hover:bg-orange-600
//                 "
//               >
//                 <Send
//                   size={13}
//                   strokeWidth={2}
//                 />

//                 Send
//               </button>
//             </div>
//           </div>

//           {/* ===================================================
//               TABLE
//           =================================================== */}

//           <div className="px-3 pb-3 sm:px-6">

//             <div className="w-full overflow-x-auto rounded-xl border border-slate-200">
//               <div
//               className="
//                 min-w-[850px]
//                 rounded-xl
//                 border
//                 border-slate-200
//               "
//               >

//               {/* Table Header */}

//               <div
//                 className="
//                   grid
//                   grid-cols-[1.25fr_1.5fr_1fr_1fr_0.75fr_1fr_0.75fr]
//                   items-center
//                   bg-slate-50
//                   px-5
//                   py-3
//                   text-[11px]
//                   font-semibold
//                   uppercase
//                   tracking-wide
//                   text-slate-600
//                 "
//               >
//                 <div>Candidate Name</div>
//                 <div>Email ID</div>
//                 <div>Mobile No</div>
//                 <div>Joining Date</div>
//                 <div>Status</div>
//                 <div>Verification</div>
//                 <div className="text-center">
//                   Action
//                 </div>
//               </div>

//               {/* Table Rows */}

//               {visibleCandidates.map((candidate) => {
//                 const [completed = 0, total = 0] =
//                   candidate.status
//                     .split("/")
//                     .map(Number);

//                 const percentage = candidate.progress;

//                 return (
//                   <div
//                     key={candidate.id}
//                     className="
//                       grid
//                       min-h-[59px]
//                       grid-cols-[1.25fr_1.5fr_1fr_1fr_0.75fr_1fr_0.75fr]
//                       items-center
//                       border-t
//                       border-slate-200
//                       px-5
//                       text-sm
//                       text-slate-700
//                       transition
//                       hover:bg-orange-50/30
//                     "
//                   >

//                     {/* Candidate Name */}

//                     <div
//                       className="
//                         flex
//                         min-w-0
//                         items-center
//                         gap-2.5
//                       "
//                     >
//                       <span
//                         className="
//                           flex
//                           h-7
//                           w-7
//                           shrink-0
//                           items-center
//                           justify-center
//                           rounded-full
//                           bg-orange-50
//                           text-xs
//                           font-semibold
//                           text-orange-500
//                         "
//                       >
//                         {getInitial(candidate.name)}
//                       </span>

//                       <span
//                         className="
//                           truncate
//                           text-[12px]
//                           font-semibold
//                           text-slate-800
//                         "
//                       >
//                         {candidate.name}
//                       </span>
//                     </div>

//                     {/* Email */}

//                     <div className="truncate text-[12px] text-slate-700">
//                       {candidate.email}
//                     </div>

//                     {/* Mobile */}

//                     <div className="text-[12px] text-slate-700">
//                       {candidate.mobile}
//                     </div>

//                     {/* Joining Date */}

//                     <div className="text-[12px] text-slate-700">
//                       {candidate.joining}
//                     </div>

//                     {/* Status */}

//                     <div className="flex items-center gap-2">
//                       <div
//                         className="
//                           h-1.5
//                           w-10
//                           overflow-hidden
//                           rounded-full
//                           bg-slate-200
//                         "
//                       >
//                         <div
//                           className="
//                             h-full
//                             rounded-full
//                             bg-orange-500
//                           "
//                           style={{
//                             width: `${percentage}%`,
//                           }}
//                         />
//                       </div>

//                       <span className="text-[11px] font-medium text-slate-700">
//                         {completed}/{total}
//                       </span>
//                     </div>

//                     {/* Verification */}

//                     <div>
//                       <span
//                         className={`
//                           inline-flex
//                           items-center
//                           gap-1.5
//                           rounded-full
//                           px-2.5
//                           py-1
//                           text-[11px]
//                           font-medium
//                           ${
//                             candidate.verification ===
//                             "Verified"
//                               ? "bg-emerald-50 text-emerald-600"
//                               : "bg-red-50 text-red-500"
//                           }
//                         `}
//                       >
//                         <span className="h-1.5 w-1.5 rounded-full bg-current" />

//                         {candidate.verification ===
//                         "Verified"
//                           ? "Verified"
//                           : "Unverified"}
//                       </span>
//                     </div>

//                     {/* Actions */}

//                     <div
//                       className="
//                         flex
//                         items-center
//                         justify-center
//                         gap-2
//                       "
//                     >

//                       {/* View */}

//                       <button
//                         type="button"
//                         title="View Candidate"
//                         aria-label="View Candidate"
//                         onClick={() =>
//                           handleView(candidate)
//                         }
//                         className="
//                           flex
//                           h-7
//                           w-7
//                           items-center
//                           justify-center
//                           rounded-md
//                           text-slate-600
//                           transition
//                           hover:bg-orange-50
//                           hover:text-orange-500
//                         "
//                       >
//                         <Eye
//                           size={17}
//                           strokeWidth={2}
//                         />
//                       </button>

//                       {/* Edit */}

//                       <button
//                         type="button"
//                         title="Edit Candidate"
//                         aria-label="Edit Candidate"
//                         onClick={() =>
//                           handleEdit(candidate)
//                         }
//                         className="
//                           flex
//                           h-7
//                           w-7
//                           items-center
//                           justify-center
//                           rounded-md
//                           text-slate-600
//                           transition
//                           hover:bg-orange-50
//                           hover:text-orange-500
//                         "
//                       >
//                         <Pencil
//                           size={17}
//                           strokeWidth={2}
//                         />
//                       </button>

//                       {/* History */}

//                       <button
//                         type="button"
//                         title="Candidate History"
//                         aria-label="Candidate History"
//                         onClick={() =>
//                           handleHistory(candidate)
//                         }
//                         className="
//                           flex
//                           h-7
//                           w-7
//                           items-center
//                           justify-center
//                           rounded-md
//                           text-red-500
//                           transition
//                           hover:bg-red-50
//                           hover:text-red-600
//                         "
//                       >
//                         <History
//                           size={18}
//                           strokeWidth={2}
//                         />
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}

//               {visibleCandidates.length === 0 && (
//                 <div className="border-t border-slate-200 px-5 py-10 text-center text-sm text-slate-500">
//                   No candidates match your search.
//                 </div>
//               )}
//               </div>
//             </div>
//           </div>

//           {/* =====================================================
//               FOOTER
//           ===================================================== */}

//           <div
//             className="
//               flex
//               flex-col
//               gap-3
//               min-h-[70px]
//               items-center
//               justify-between
//               px-3
//               py-4
//               sm:flex-row
//               sm:px-6
//             "
//           >
//             <p className="text-[12px] text-slate-600">
//               {searchQuery
//                 ? `Showing ${(safePage - 1) * rowsPerPage + 1}-${Math.min(safePage * rowsPerPage, filteredCandidates.length)} of ${filteredCandidates.length} matching candidates`
//                 : `Showing ${(safePage - 1) * rowsPerPage + 1}-${Math.min(safePage * rowsPerPage, candidates.length)} of ${candidates.length} candidates`}
//             </p>

//             <div className="flex items-center gap-1.5">

//               <button
//                 type="button"
//                 disabled={safePage === 1}
//                 onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
//                 className="
//                   flex
//                   h-8
//                   w-8
//                   items-center
//                   justify-center
//                   rounded-lg
//                   border
//                   border-slate-200
//                   bg-white
//                   text-slate-600
//                   transition
//                   hover:border-orange-300
//                   hover:bg-orange-50
//                   hover:text-orange-500
//                 "
//               >
//                 <ChevronLeft size={15} />
//               </button>

//               {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
//                 <button
//                   key={page}
//                   type="button"
//                   onClick={() => setCurrentPage(page)}
//                   className={`
//                   flex
//                   h-8
//                   w-8
//                   items-center
//                   justify-center
//                   rounded-lg
//                   ${safePage === page ? "bg-orange-500 text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500"}
//                   text-sm
//                   font-semibold
//                   shadow-sm
//                 `}
//                 >
//                   {page}
//                 </button>
//               ))}

//               <button
//                 type="button"
//                 disabled={safePage === totalPages}
//                 onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
//                 className="
//                   flex
//                   h-8
//                   w-8
//                   items-center
//                   justify-center
//                   rounded-lg
//                   border
//                   border-slate-200
//                   bg-white
//                   text-slate-600
//                   transition
//                   hover:border-orange-300
//                   hover:bg-orange-50
//                   hover:text-orange-500
//                 "
//               >
//                 <ChevronRight size={15} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {auditOpen && selectedCandidate && (
//         <AuditLogModal
//           candidateName={selectedCandidate.name}
//           onClose={closeAuditLog}
//         />
//       )}
//     </PreOnboardPageShell>
//   );
// }


// import { useState } from "react";
// import {
//   useNavigate,
//   useParams,
//   useSearchParams,
// } from "react-router-dom";

// import {
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   Eye,
//   Pencil,
//   History,
//   Plus,
//   Send,
//   PanelsTopLeft,
//   BookOpen,
//   Mail,
// } from "lucide-react";

// import AuditLogModal from "./AuditLog";
// import PreOnboardPageShell from "../components/PreEnrollmentPageShell";
// import {
//   addCandidates,
//   getAddedCandidates,
//   type AddCandidateRow,
// } from "../constants/add-candidate.constants";

// type Candidate = AddCandidateRow;

// export default function AddCandidate() {
//   const navigate = useNavigate();
//   const { domain } = useParams();
//   const [searchParams] = useSearchParams();

//   const basePath = domain
//     ? `/${domain}/admin/enrollment/pre-enrollment`
//     : "/admin/enrollment/pre-enrollment";

//   const [auditOpen, setAuditOpen] = useState(false);

//   const [selectedCandidate, setSelectedCandidate] =
//     useState<Candidate | null>(null);

//   const [currentPage, setCurrentPage] = useState(1);

//   const rowsPerPage = 5;

//   const candidates = [...getAddedCandidates(), ...addCandidates];

//   const searchQuery = (searchParams.get("q") ?? "")
//     .trim()
//     .toLowerCase();

//   const filteredCandidates = candidates.filter(
//     (candidate) =>
//       !searchQuery ||
//       candidate.name.toLowerCase().includes(searchQuery) ||
//       candidate.email.toLowerCase().includes(searchQuery) ||
//       candidate.mobile.toLowerCase().includes(searchQuery),
//   );

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredCandidates.length / rowsPerPage),
//   );

//   const safePage = Math.min(currentPage, totalPages);

//   const visibleCandidates = filteredCandidates.slice(
//     (safePage - 1) * rowsPerPage,
//     safePage * rowsPerPage,
//   );

//   const getInitial = (name: string) =>
//     name.trim().charAt(0).toUpperCase();

//   const handleView = (candidate: Candidate) => {
//     navigate(
//       `${basePath}/completed-candidate/${candidate.id}/tasks`,
//       {
//         state: {
//           candidateSource: "add",
//           candidate,
//         },
//       },
//     );
//   };

//   const handleEdit = (candidate: Candidate) => {
//     navigate(
//       `${basePath}/completed-candidate/${candidate.id}/portal-info`,
//       {
//         state: {
//           candidateSource: "add",
//           candidate,
//         },
//       },
//     );
//   };

//   const handleHistory = (candidate: Candidate) => {
//     setSelectedCandidate(candidate);
//     setAuditOpen(true);
//   };

//   const closeAuditLog = () => {
//     setAuditOpen(false);
//     setSelectedCandidate(null);
//   };

//   return (
//     <PreOnboardPageShell>
//       <div
//         className="
//           w-full
//           min-w-0
//           px-4
//           pb-6
//           pt-2
//           font-urbanist
//           sm:px-4
//           md:px-5
//         "
//       >
//         {/* =====================================================
//             TOP POLICY + ADD CANDIDATE
//         ===================================================== */}

//         <div
//           className="
//             mb-5
//             flex
//             w-full
//             flex-col
//             gap-3
//             font-urbanist
//             sm:flex-row
//             sm:items-center
//             sm:justify-between
//           "
//         >
//           {/* Onboarding Policy */}

//           <button
//             type="button"
//             className="
//               inline-flex
//               h-9
//               items-center
//               gap-2
//               rounded-lg
//               border
//               border-slate-200
//               bg-white
//               px-3.5
//               font-urbanist
//               text-sm
//               font-medium
//               leading-5
//               text-slate-700
//               shadow-sm
//               transition
//               hover:border-orange-300
//               hover:bg-orange-50
//             "
//           >
//             {/* Label */}
//             <span
//               className="
//                 font-urbanist
//                 text-sm
//                 font-semibold
//                 leading-5
//                 text-slate-600
//               "
//             >
//               Onboarding Policy:
//             </span>

//             {/* Body */}
//             <span
//               className="
//                 font-urbanist
//                 text-sm
//                 font-medium
//                 leading-5
//                 text-slate-800
//               "
//             >
//               Standard Policy
//             </span>

//             <ChevronDown
//               size={15}
//               strokeWidth={2}
//               className="shrink-0 text-slate-700"
//             />
//           </button>

//           {/* Add Candidate */}

//           <button
//             type="button"
//             onClick={() =>
//               navigate(`${basePath}/add-candidate/new`)
//             }
//             className="
//               -mt-1
//               inline-flex
//               h-9
//               items-center
//               gap-2
//               rounded-lg
//               border
//               border-orange-500
//               bg-white
//               px-4
//               font-urbanist
//               text-sm
//               font-semibold
//               leading-5
//               text-orange-500
//               transition
//               hover:bg-orange-50
//             "
//           >
//             <Plus
//               size={15}
//               strokeWidth={2.5}
//             />

//             {/* Utility / UI */}
//             <span className="font-urbanist text-sm font-semibold leading-5">
//               Add Candidate
//             </span>
//           </button>
//         </div>

//         {/* =====================================================
//             MAIN CARD
//         ===================================================== */}

//         <div
//           className="
//             w-full
//             overflow-hidden
//             rounded-[16px]
//             border
//             border-slate-100
//             bg-white
//             font-urbanist
//             shadow-[0_6px_20px_rgba(15,23,42,0.14)]
//           "
//         >
//           {/* ===================================================
//               CARD HEADER
//           =================================================== */}

//           <div
//             className="
//               flex
//               min-h-[58px]
//               flex-wrap
//               items-center
//               justify-between
//               px-3
//               py-3
//               font-urbanist
//               sm:px-6
//             "
//           >
//             {/* Heading */}
//             <h2
//               className="
//                 font-urbanist
//                 text-lg
//                 font-semibold
//                 leading-6
//                 tracking-normal
//                 text-slate-800
//               "
//             >
//               Onboarding Actions &amp; Candidates
//             </h2>

//             <div
//               className="
//                 flex
//                 w-full
//                 flex-wrap
//                 items-center
//                 gap-2
//                 font-urbanist
//                 sm:w-auto
//                 sm:flex-nowrap
//               "
//             >
//               {/* Asset Issue */}

//               <button
//                 type="button"
//                 className="
//                   inline-flex
//                   h-8
//                   items-center
//                   gap-1.5
//                   rounded-lg
//                   border
//                   border-slate-200
//                   bg-white
//                   px-3
//                   font-urbanist
//                   text-xs
//                   font-semibold
//                   leading-4
//                   text-slate-800
//                   shadow-sm
//                   transition
//                   hover:border-orange-300
//                   hover:bg-orange-50
//                   hover:text-orange-500
//                 "
//               >
//                 <PanelsTopLeft
//                   size={13}
//                   strokeWidth={2}
//                   className="text-slate-800"
//                 />

//                 {/* Utility / UI */}
//                 <span className="font-urbanist text-xs font-semibold leading-4">
//                   Asset Issue
//                 </span>
//               </button>

//               {/* Training Request */}

//               <button
//                 type="button"
//                 className="
//                   inline-flex
//                   h-8
//                   items-center
//                   gap-1.5
//                   rounded-lg
//                   border
//                   border-slate-200
//                   bg-white
//                   px-3
//                   font-urbanist
//                   text-xs
//                   font-semibold
//                   leading-4
//                   text-slate-800
//                   shadow-sm
//                   transition
//                   hover:border-orange-300
//                   hover:bg-orange-50
//                   hover:text-orange-500
//                 "
//               >
//                 <BookOpen
//                   size={13}
//                   strokeWidth={2}
//                   className="text-slate-800"
//                 />

//                 {/* Utility / UI */}
//                 <span className="font-urbanist text-xs font-semibold leading-4">
//                   Training Request
//                 </span>
//               </button>

//               {/* Intimation Mail */}

//               <button
//                 type="button"
//                 className="
//                   inline-flex
//                   h-8
//                   items-center
//                   gap-1.5
//                   rounded-lg
//                   border
//                   border-slate-200
//                   bg-white
//                   px-3
//                   font-urbanist
//                   text-xs
//                   font-semibold
//                   leading-4
//                   text-slate-800
//                   shadow-sm
//                   transition
//                   hover:border-orange-300
//                   hover:bg-orange-50
//                   hover:text-orange-500
//                 "
//               >
//                 <Mail
//                   size={13}
//                   strokeWidth={2}
//                   className="text-slate-800"
//                 />

//                 {/* Utility / UI */}
//                 <span className="font-urbanist text-xs font-semibold leading-4">
//                   Intimation Mail
//                 </span>
//               </button>

//               {/* Send */}

//               <button
//                 type="button"
//                 className="
//                   inline-flex
//                   h-8
//                   items-center
//                   gap-1.5
//                   rounded-lg
//                   bg-orange-500
//                   px-4
//                   font-urbanist
//                   text-xs
//                   font-semibold
//                   leading-4
//                   text-white
//                   shadow-sm
//                   transition
//                   hover:bg-orange-600
//                 "
//               >
//                 <Send
//                   size={13}
//                   strokeWidth={2}
//                 />

//                 {/* Utility / UI */}
//                 <span className="font-urbanist text-xs font-semibold leading-4">
//                   Send
//                 </span>
//               </button>
//             </div>
//           </div>

//           {/* ===================================================
//               TABLE
//           =================================================== */}

//           <div className="px-3 pb-3 font-urbanist sm:px-6">
//             <div className="w-full overflow-x-auto rounded-xl border border-slate-200">
//               <div
//                 className="
//                   min-w-[850px]
//                   rounded-xl
//                   border
//                   border-slate-200
//                   font-urbanist
//                 "
//               >
//                 {/* Table Header */}

//                 <div
//                   className="
//                     grid
//                     grid-cols-[1.25fr_1.5fr_1fr_1fr_0.75fr_1fr_0.75fr]
//                     items-center
//                     bg-slate-50
//                     px-5
//                     py-3
//                     font-urbanist
//                     text-[13px]
//                     font-semibold
//                     leading-[18px]
//                     text-slate-600
//                   "
//                 >
//                   {/* Label */}
//                   <div className="font-urbanist text-[13px] font-semibold leading-[18px]">
//                     Candidate Name
//                   </div>

//                   {/* Label */}
//                   <div className="font-urbanist text-[13px] font-semibold leading-[18px]">
//                     Email ID
//                   </div>

//                   {/* Label */}
//                   <div className="font-urbanist text-[13px] font-semibold leading-[18px]">
//                     Mobile No
//                   </div>

//                   {/* Label */}
//                   <div className="font-urbanist text-[13px] font-semibold leading-[18px]">
//                     Joining Date
//                   </div>

//                   {/* Label */}
//                   <div className="font-urbanist text-[13px] font-semibold leading-[18px]">
//                     Status
//                   </div>

//                   {/* Label */}
//                   <div className="font-urbanist text-[13px] font-semibold leading-[18px]">
//                     Verification
//                   </div>

//                   {/* Label */}
//                   <div className="text-center font-urbanist text-[13px] font-semibold leading-[18px]">
//                     Action
//                   </div>
//                 </div>

//                 {/* Table Rows */}

//                 {visibleCandidates.map((candidate) => {
//                   const [completed = 0, total = 0] =
//                     candidate.status
//                       .split("/")
//                       .map(Number);

//                   const percentage = candidate.progress;

//                   return (
//                     <div
//                       key={candidate.id}
//                       className="
//                         grid
//                         min-h-[59px]
//                         grid-cols-[1.25fr_1.5fr_1fr_1fr_0.75fr_1fr_0.75fr]
//                         items-center
//                         border-t
//                         border-slate-200
//                         px-5
//                         font-urbanist
//                         text-sm
//                         leading-5
//                         text-slate-700
//                         transition
//                         hover:bg-orange-50/30
//                       "
//                     >
//                       {/* Candidate Name */}

//                       <div
//                         className="
//                           flex
//                           min-w-0
//                           items-center
//                           gap-2.5
//                           font-urbanist
//                         "
//                       >
//                         <span
//                           className="
//                             flex
//                             h-7
//                             w-7
//                             shrink-0
//                             items-center
//                             justify-center
//                             rounded-full
//                             bg-orange-50
//                             font-urbanist
//                             text-xs
//                             font-semibold
//                             leading-4
//                             text-orange-500
//                           "
//                         >
//                           {getInitial(candidate.name)}
//                         </span>

//                         {/* Body */}
//                         <span
//                           className="
//                             truncate
//                             font-urbanist
//                             text-sm
//                             font-semibold
//                             leading-5
//                             text-slate-800
//                           "
//                         >
//                           {candidate.name}
//                         </span>
//                       </div>

//                       {/* Email */}

//                       <div
//                         className="
//                           truncate
//                           font-urbanist
//                           text-sm
//                           font-medium
//                           leading-5
//                           text-slate-700
//                         "
//                       >
//                         {candidate.email}
//                       </div>

//                       {/* Mobile */}

//                       <div
//                         className="
//                           font-urbanist
//                           text-sm
//                           font-medium
//                           leading-5
//                           text-slate-700
//                         "
//                       >
//                         {candidate.mobile}
//                       </div>

//                       {/* Joining Date */}

//                       <div
//                         className="
//                           font-urbanist
//                           text-sm
//                           font-medium
//                           leading-5
//                           text-slate-700
//                         "
//                       >
//                         {candidate.joining}
//                       </div>

//                       {/* Status */}

//                       <div className="flex items-center gap-2 font-urbanist">
//                         <div
//                           className="
//                             h-1.5
//                             w-10
//                             overflow-hidden
//                             rounded-full
//                             bg-slate-200
//                           "
//                         >
//                           <div
//                             className="
//                               h-full
//                               rounded-full
//                               bg-orange-500
//                             "
//                             style={{
//                               width: `${percentage}%`,
//                             }}
//                           />
//                         </div>

//                         {/* Utility / UI */}
//                         <span
//                           className="
//                             font-urbanist
//                             text-xs
//                             font-semibold
//                             leading-4
//                             text-slate-700
//                           "
//                         >
//                           {completed}/{total}
//                         </span>
//                       </div>

//                       {/* Verification */}

//                       <div>
//                         <span
//                           className={`
//                             inline-flex
//                             items-center
//                             gap-1.5
//                             rounded-full
//                             px-2.5
//                             py-1
//                             font-urbanist
//                             text-xs
//                             font-semibold
//                             leading-4
//                             ${
//                               candidate.verification === "Verified"
//                                 ? "bg-emerald-50 text-emerald-600"
//                                 : "bg-red-50 text-red-500"
//                             }
//                           `}
//                         >
//                           <span className="h-1.5 w-1.5 rounded-full bg-current" />

//                           {candidate.verification === "Verified"
//                             ? "Verified"
//                             : "Unverified"}
//                         </span>
//                       </div>

//                       {/* Actions */}

//                       <div
//                         className="
//                           flex
//                           items-center
//                           justify-center
//                           gap-2
//                           font-urbanist
//                         "
//                       >
//                         {/* View */}

//                         <button
//                           type="button"
//                           title="View Candidate"
//                           aria-label="View Candidate"
//                           onClick={() =>
//                             handleView(candidate)
//                           }
//                           className="
//                             flex
//                             h-7
//                             w-7
//                             items-center
//                             justify-center
//                             rounded-md
//                             text-slate-600
//                             transition
//                             hover:bg-orange-50
//                             hover:text-orange-500
//                           "
//                         >
//                           <Eye
//                             size={17}
//                             strokeWidth={2}
//                           />
//                         </button>

//                         {/* Edit */}

//                         <button
//                           type="button"
//                           title="Edit Candidate"
//                           aria-label="Edit Candidate"
//                           onClick={() =>
//                             handleEdit(candidate)
//                           }
//                           className="
//                             flex
//                             h-7
//                             w-7
//                             items-center
//                             justify-center
//                             rounded-md
//                             text-slate-600
//                             transition
//                             hover:bg-orange-50
//                             hover:text-orange-500
//                           "
//                         >
//                           <Pencil
//                             size={17}
//                             strokeWidth={2}
//                           />
//                         </button>

//                         {/* History */}

//                         <button
//                           type="button"
//                           title="Candidate History"
//                           aria-label="Candidate History"
//                           onClick={() =>
//                             handleHistory(candidate)
//                           }
//                           className="
//                             flex
//                             h-7
//                             w-7
//                             items-center
//                             justify-center
//                             rounded-md
//                             text-red-500
//                             transition
//                             hover:bg-red-50
//                             hover:text-red-600
//                           "
//                         >
//                           <History
//                             size={18}
//                             strokeWidth={2}
//                           />
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}

//                 {visibleCandidates.length === 0 && (
//                   <div
//                     className="
//                       border-t
//                       border-slate-200
//                       px-5
//                       py-10
//                       text-center
//                       font-urbanist
//                       text-sm
//                       font-medium
//                       leading-5
//                       text-slate-500
//                     "
//                   >
//                     No candidates match your search.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* =====================================================
//               FOOTER
//           ===================================================== */}

//           <div
//             className="
//               flex
//               min-h-[70px]
//               flex-col
//               items-center
//               justify-between
//               gap-3
//               px-3
//               py-4
//               font-urbanist
//               sm:flex-row
//               sm:px-6
//             "
//           >
//             {/* Body */}
//             <p
//               className="
//                 font-urbanist
//                 text-sm
//                 font-medium
//                 leading-5
//                 text-slate-600
//               "
//             >
//               {searchQuery
//                 ? `Showing ${(safePage - 1) * rowsPerPage + 1}-${Math.min(
//                     safePage * rowsPerPage,
//                     filteredCandidates.length,
//                   )} of ${filteredCandidates.length} matching candidates`
//                 : `Showing ${(safePage - 1) * rowsPerPage + 1}-${Math.min(
//                     safePage * rowsPerPage,
//                     candidates.length,
//                   )} of ${candidates.length} candidates`}
//             </p>

//             <div
//               className="
//                 flex
//                 items-center
//                 gap-1.5
//                 font-urbanist
//               "
//             >
//               {/* Previous */}

//               <button
//                 type="button"
//                 disabled={safePage === 1}
//                 onClick={() =>
//                   setCurrentPage((page) =>
//                     Math.max(1, page - 1),
//                   )
//                 }
//                 className="
//                   flex
//                   h-8
//                   w-8
//                   items-center
//                   justify-center
//                   rounded-lg
//                   border
//                   border-slate-200
//                   bg-white
//                   font-urbanist
//                   text-slate-600
//                   transition
//                   hover:border-orange-300
//                   hover:bg-orange-50
//                   hover:text-orange-500
//                 "
//                 aria-label="Previous page"
//               >
//                 <ChevronLeft size={15} />
//               </button>

//               {/* Page Numbers */}

//               {Array.from(
//                 { length: totalPages },
//                 (_, index) => index + 1,
//               ).map((page) => (
//                 <button
//                   key={page}
//                   type="button"
//                   onClick={() =>
//                     setCurrentPage(page)
//                   }
//                   className={`
//                     flex
//                     h-8
//                     w-8
//                     items-center
//                     justify-center
//                     rounded-lg
//                     font-urbanist
//                     text-sm
//                     font-semibold
//                     leading-5
//                     shadow-sm
//                     ${
//                       safePage === page
//                         ? "bg-orange-500 text-white"
//                         : "border border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500"
//                     }
//                   `}
//                   aria-current={
//                     safePage === page
//                       ? "page"
//                       : undefined
//                   }
//                 >
//                   {page}
//                 </button>
//               ))}

//               {/* Next */}

//               <button
//                 type="button"
//                 disabled={safePage === totalPages}
//                 onClick={() =>
//                   setCurrentPage((page) =>
//                     Math.min(totalPages, page + 1),
//                   )
//                 }
//                 className="
//                   flex
//                   h-8
//                   w-8
//                   items-center
//                   justify-center
//                   rounded-lg
//                   border
//                   border-slate-200
//                   bg-white
//                   font-urbanist
//                   text-slate-600
//                   transition
//                   hover:border-orange-300
//                   hover:bg-orange-50
//                   hover:text-orange-500
//                 "
//                 aria-label="Next page"
//               >
//                 <ChevronRight size={15} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {auditOpen && selectedCandidate && (
//         <AuditLogModal
//           candidateName={selectedCandidate.name}
//           onClose={closeAuditLog}
//         />
//       )}
//     </PreOnboardPageShell>
//   );
// }

// import { useState } from "react";
// import {
//   useNavigate,
//   useParams,
//   useSearchParams,
// } from "react-router-dom";

// import {
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   Eye,
//   Pencil,
//   History,
//   Plus,
//   Send,
//   PanelsTopLeft,
//   BookOpen,
//   Mail,
// } from "lucide-react";

// import AuditLogModal from "./AuditLog";
// import PreOnboardPageShell from "../components/PreEnrollmentPageShell";
// import {
//   addCandidates,
//   getAddedCandidates,
//   type AddCandidateRow,
// } from "../constants/add-candidate.constants";

// type Candidate = AddCandidateRow;

// export default function AddCandidate() {
//   const navigate = useNavigate();
//   const { domain } = useParams();
//   const [searchParams] = useSearchParams();

//   const basePath = domain
//     ? `/${domain}/admin/enrollment/pre-enrollment`
//     : "/admin/enrollment/pre-enrollment";

//   const [auditOpen, setAuditOpen] = useState(false);

//   const [selectedCandidate, setSelectedCandidate] =
//     useState<Candidate | null>(null);

//   const [currentPage, setCurrentPage] = useState(1);

//   const rowsPerPage = 5;

//   const candidates = [
//     ...getAddedCandidates(),
//     ...addCandidates,
//   ];

//   const searchQuery = (
//     searchParams.get("q") ?? ""
//   )
//     .trim()
//     .toLowerCase();

//   const filteredCandidates = candidates.filter(
//     (candidate) =>
//       !searchQuery ||
//       candidate.name
//         .toLowerCase()
//         .includes(searchQuery) ||
//       candidate.email
//         .toLowerCase()
//         .includes(searchQuery) ||
//       candidate.mobile
//         .toLowerCase()
//         .includes(searchQuery),
//   );

//   const totalPages = Math.max(
//     1,
//     Math.ceil(
//       filteredCandidates.length / rowsPerPage,
//     ),
//   );

//   const safePage = Math.min(
//     currentPage,
//     totalPages,
//   );

//   const visibleCandidates =
//     filteredCandidates.slice(
//       (safePage - 1) * rowsPerPage,
//       safePage * rowsPerPage,
//     );

//   const getInitial = (name: string) =>
//     name.trim().charAt(0).toUpperCase();

//   const handleView = (candidate: Candidate) => {
//     navigate(
//       `${basePath}/completed-candidate/${candidate.id}/tasks`,
//       {
//         state: {
//           candidateSource: "add",
//           candidate,
//         },
//       },
//     );
//   };

//   const handleEdit = (candidate: Candidate) => {
//     navigate(
//       `${basePath}/completed-candidate/${candidate.id}/portal-info`,
//       {
//         state: {
//           candidateSource: "add",
//           candidate,
//         },
//       },
//     );
//   };

//   const handleHistory = (candidate: Candidate) => {
//     setSelectedCandidate(candidate);
//     setAuditOpen(true);
//   };

//   const closeAuditLog = () => {
//     setAuditOpen(false);
//     setSelectedCandidate(null);
//   };

//   return (
//     <PreOnboardPageShell>
//       <div
//         className="
//           w-full
//           min-w-0
//           px-4
//           pb-6
//           pt-2
//           font-urbanist
//           sm:px-4
//           md:px-5
//         "
//       >
//         {/* =====================================================
//             TOP POLICY + ADD CANDIDATE
//         ===================================================== */}

//         <div
//           className="
//             mb-5
//             flex
//             w-full
//             flex-col
//             gap-3
//             font-urbanist
//             sm:flex-row
//             sm:items-center
//             sm:justify-between
//           "
//         >
//           {/* ONBOARDING POLICY */}

//           <button
//             type="button"
//             className="
//               inline-flex
//               h-9
//               items-center
//               gap-2
//               rounded-lg
//               border
//               border-slate-200
//               bg-white
//               px-3.5
//               font-urbanist
//               shadow-sm
//               transition
//               hover:border-orange-300
//               hover:bg-orange-50
//             "
//           >
//             {/* Label/SM
//                 Urbanist Medium — 13px */}

//             <span
//               className="
//                 font-urbanist
//                 text-[13px]
//                 font-medium
//                 leading-[18px]
//                 text-slate-600
//               "
//             >
//               Onboarding Policy:
//             </span>

//             {/* Body/SM
//                 Urbanist Regular — 13px */}

//             <span
//               className="
//                 font-urbanist
//                 text-[13px]
//                 font-normal
//                 leading-[18px]
//                 text-slate-800
//               "
//             >
//               Standard Policy
//             </span>

//             <ChevronDown
//               size={15}
//               strokeWidth={2}
//               className="shrink-0 text-slate-700"
//             />
//           </button>

//           {/* ADD CANDIDATE */}

//           <button
//             type="button"
//             onClick={() =>
//               navigate(
//                 `${basePath}/add-candidate/new`,
//               )
//             }
//             className="
//               -mt-1
//               inline-flex
//               h-9
//               items-center
//               gap-2
//               rounded-lg
//               border
//               border-orange-500
//               bg-white
//               px-4
//               font-urbanist
//               text-[14px]
//               font-medium
//               leading-[18px]
//               text-orange-500
//               transition
//               hover:bg-orange-50
//             "
//           >
//             <Plus
//               size={15}
//               strokeWidth={2.5}
//             />

//             {/* Utility/UI
//                 Urbanist Medium — 14px */}

//             <span
//               className="
//                 font-urbanist
//                 text-[14px]
//                 font-medium
//                 leading-[18px]
//               "
//             >
//               Add Candidate
//             </span>
//           </button>
//         </div>

//         {/* =====================================================
//             MAIN CARD
//         ===================================================== */}

//         <div
//           className="
//             w-full
//             overflow-hidden
//             rounded-[16px]
//             border
//             border-slate-100
//             bg-white
//             font-urbanist
//             shadow-[0_6px_20px_rgba(15,23,42,0.14)]
//           "
//         >
//           {/* ===================================================
//               CARD HEADER
//           =================================================== */}

//           <div
//             className="
//               flex
//               min-h-[58px]
//               flex-wrap
//               items-center
//               justify-between
//               px-3
//               py-3
//               font-urbanist
//               sm:px-6
//             "
//           >
//             {/* Heading/MD
//                 Urbanist Bold — 16px */}

//             <h2
//               className="
//                 font-urbanist
//                 text-[16px]
//                 font-bold
//                 leading-[20px]
//                 text-slate-800
//               "
//             >
//               Onboarding Actions &amp; Candidates
//             </h2>

//             <div
//               className="
//                 flex
//                 w-full
//                 flex-wrap
//                 items-center
//                 gap-2
//                 font-urbanist
//                 sm:w-auto
//                 sm:flex-nowrap
//               "
//             >
//               {/* ASSET ISSUE */}

//               <button
//                 type="button"
//                 className="
//                   inline-flex
//                   h-8
//                   items-center
//                   gap-1.5
//                   rounded-lg
//                   border
//                   border-slate-200
//                   bg-white
//                   px-3
//                   font-urbanist
//                   text-[14px]
//                   font-medium
//                   leading-[18px]
//                   text-slate-800
//                   shadow-sm
//                   transition
//                   hover:border-orange-300
//                   hover:bg-orange-50
//                   hover:text-orange-500
//                 "
//               >
//                 <PanelsTopLeft
//                   size={13}
//                   strokeWidth={2}
//                   className="text-slate-800"
//                 />

//                 Asset Issue
//               </button>

//               {/* TRAINING REQUEST */}

//               <button
//                 type="button"
//                 className="
//                   inline-flex
//                   h-8
//                   items-center
//                   gap-1.5
//                   rounded-lg
//                   border
//                   border-slate-200
//                   bg-white
//                   px-3
//                   font-urbanist
//                   text-[14px]
//                   font-medium
//                   leading-[18px]
//                   text-slate-800
//                   shadow-sm
//                   transition
//                   hover:border-orange-300
//                   hover:bg-orange-50
//                   hover:text-orange-500
//                 "
//               >
//                 <BookOpen
//                   size={13}
//                   strokeWidth={2}
//                   className="text-slate-800"
//                 />

//                 Training Request
//               </button>

//               {/* INTIMATION MAIL */}

//               <button
//                 type="button"
//                 className="
//                   inline-flex
//                   h-8
//                   items-center
//                   gap-1.5
//                   rounded-lg
//                   border
//                   border-slate-200
//                   bg-white
//                   px-3
//                   font-urbanist
//                   text-[14px]
//                   font-medium
//                   leading-[18px]
//                   text-slate-800
//                   shadow-sm
//                   transition
//                   hover:border-orange-300
//                   hover:bg-orange-50
//                   hover:text-orange-500
//                 "
//               >
//                 <Mail
//                   size={13}
//                   strokeWidth={2}
//                   className="text-slate-800"
//                 />

//                 Intimation Mail
//               </button>

//               {/* SEND */}

//               <button
//                 type="button"
//                 className="
//                   inline-flex
//                   h-8
//                   items-center
//                   gap-1.5
//                   rounded-lg
//                   bg-orange-500
//                   px-4
//                   font-urbanist
//                   text-[14px]
//                   font-medium
//                   leading-[18px]
//                   text-white
//                   shadow-sm
//                   transition
//                   hover:bg-orange-600
//                 "
//               >
//                 <Send
//                   size={13}
//                   strokeWidth={2}
//                 />

//                 Send
//               </button>
//             </div>
//           </div>

//           {/* ===================================================
//               TABLE
//           =================================================== */}

//           <div
//             className="
//               px-3
//               pb-3
//               font-urbanist
//               sm:px-6
//             "
//           >
//             <div
//               className="
//                 w-full
//                 overflow-x-auto
//                 rounded-xl
//                 border
//                 border-slate-200
//                 font-urbanist
//               "
//             >
//               <div
//                 className="
//                   min-w-[850px]
//                   rounded-xl
//                   font-urbanist
//                 "
//               >
//                 {/* =================================================
//                     TABLE HEADER
//                 ================================================= */}

//                 <div
//                   className="
//                     grid
//                     grid-cols-[1.25fr_1.5fr_1fr_1fr_0.75fr_1fr_0.75fr]
//                     items-center
//                     bg-slate-50
//                     px-5
//                     py-3
//                     font-urbanist
//                   "
//                 >
//                   {/* Utility/UI — Table/Header
//                       Urbanist Medium — 12px */}

//                   <div
//                     className="
//                       font-urbanist
//                       text-[12px]
//                       font-medium
//                       leading-[16px]
//                       text-slate-600
//                     "
//                   >
//                     Candidate Name
//                   </div>

//                   <div
//                     className="
//                       font-urbanist
//                       text-[12px]
//                       font-medium
//                       leading-[16px]
//                       text-slate-600
//                     "
//                   >
//                     Email ID
//                   </div>

//                   <div
//                     className="
//                       font-urbanist
//                       text-[12px]
//                       font-medium
//                       leading-[16px]
//                       text-slate-600
//                     "
//                   >
//                     Mobile No
//                   </div>

//                   <div
//                     className="
//                       font-urbanist
//                       text-[12px]
//                       font-medium
//                       leading-[16px]
//                       text-slate-600
//                     "
//                   >
//                     Joining Date
//                   </div>

//                   <div
//                     className="
//                       font-urbanist
//                       text-[12px]
//                       font-medium
//                       leading-[16px]
//                       text-slate-600
//                     "
//                   >
//                     Status
//                   </div>

//                   <div
//                     className="
//                       font-urbanist
//                       text-[12px]
//                       font-medium
//                       leading-[16px]
//                       text-slate-600
//                     "
//                   >
//                     Verification
//                   </div>

//                   <div
//                     className="
//                       text-center
//                       font-urbanist
//                       text-[12px]
//                       font-medium
//                       leading-[16px]
//                       text-slate-600
//                     "
//                   >
//                     Action
//                   </div>
//                 </div>

//                 {/* =================================================
//                     TABLE ROWS
//                 ================================================= */}

//                 {visibleCandidates.map(
//                   (candidate) => {
//                     const [
//                       completed = 0,
//                       total = 0,
//                     ] = candidate.status
//                       .split("/")
//                       .map(Number);

//                     const percentage =
//                       candidate.progress;

//                     return (
//                       <div
//                         key={candidate.id}
//                         className="
//                           grid
//                           min-h-[59px]
//                           grid-cols-[1.25fr_1.5fr_1fr_1fr_0.75fr_1fr_0.75fr]
//                           items-center
//                           border-t
//                           border-slate-200
//                           px-5
//                           font-urbanist
//                           transition
//                           hover:bg-orange-50/30
//                         "
//                       >
//                         {/* CANDIDATE NAME */}

//                         <div
//                           className="
//                             flex
//                             min-w-0
//                             items-center
//                             gap-2.5
//                             font-urbanist
//                           "
//                         >
//                           {/* Label/SM
//                               Urbanist Medium — 13px */}

//                           <span
//                             className="
//                               flex
//                               h-7
//                               w-7
//                               shrink-0
//                               items-center
//                               justify-center
//                               rounded-full
//                               bg-orange-50
//                               font-urbanist
//                               text-[13px]
//                               font-medium
//                               leading-[18px]
//                               text-orange-500
//                             "
//                           >
//                             {getInitial(candidate.name)}
//                           </span>

//                           {/* Body/SM
//                               Urbanist Regular — 13px */}

//                           <span
//                             className="
//                               truncate
//                               font-urbanist
//                               text-[13px]
//                               font-normal
//                               leading-[18px]
//                               text-slate-800
//                             "
//                           >
//                             {candidate.name}
//                           </span>
//                         </div>

//                         {/* EMAIL
//                             Body/SM */}

//                         <div
//                           className="
//                             truncate
//                             font-urbanist
//                             text-[13px]
//                             font-normal
//                             leading-[18px]
//                             text-slate-700
//                           "
//                         >
//                           {candidate.email}
//                         </div>

//                         {/* MOBILE
//                             Body/SM */}

//                         <div
//                           className="
//                             font-urbanist
//                             text-[13px]
//                             font-normal
//                             leading-[18px]
//                             text-slate-700
//                           "
//                         >
//                           {candidate.mobile}
//                         </div>

//                         {/* JOINING DATE
//                             Body/SM */}

//                         <div
//                           className="
//                             font-urbanist
//                             text-[13px]
//                             font-normal
//                             leading-[18px]
//                             text-slate-700
//                           "
//                         >
//                           {candidate.joining}
//                         </div>

//                         {/* STATUS */}

//                         <div
//                           className="
//                             flex
//                             items-center
//                             gap-2
//                             font-urbanist
//                           "
//                         >
//                           <div
//                             className="
//                               h-1.5
//                               w-10
//                               overflow-hidden
//                               rounded-full
//                               bg-slate-200
//                             "
//                           >
//                             <div
//                               className="
//                                 h-full
//                                 rounded-full
//                                 bg-orange-500
//                               "
//                               style={{
//                                 width: `${percentage}%`,
//                               }}
//                             />
//                           </div>

//                           {/* Label/XXS-11
//                               Urbanist Medium — 11px */}

//                           <span
//                             className="
//                               font-urbanist
//                               text-[11px]
//                               font-medium
//                               leading-[14px]
//                               text-slate-700
//                             "
//                           >
//                             {completed}/{total}
//                           </span>
//                         </div>

//                         {/* VERIFICATION */}

//                         <div>
//                           <span
//                             className={`
//                               inline-flex
//                               items-center
//                               gap-1.5
//                               rounded-full
//                               px-2.5
//                               py-1
//                               font-urbanist
//                               text-[11px]
//                               font-medium
//                               leading-[14px]
//                               ${
//                                 candidate.verification ===
//                                 "Verified"
//                                   ? "bg-emerald-50 text-emerald-600"
//                                   : "bg-red-50 text-red-500"
//                               }
//                             `}
//                           >
//                             <span className="h-1.5 w-1.5 rounded-full bg-current" />

//                             {candidate.verification ===
//                             "Verified"
//                               ? "Verified"
//                               : "Unverified"}
//                           </span>
//                         </div>

//                         {/* ACTIONS */}

//                         <div
//                           className="
//                             flex
//                             items-center
//                             justify-center
//                             gap-2
//                             font-urbanist
//                           "
//                         >
//                           <button
//                             type="button"
//                             title="View Candidate"
//                             aria-label="View Candidate"
//                             onClick={() =>
//                               handleView(candidate)
//                             }
//                             className="
//                               flex
//                               h-7
//                               w-7
//                               items-center
//                               justify-center
//                               rounded-md
//                               text-slate-600
//                               transition
//                               hover:bg-orange-50
//                               hover:text-orange-500
//                             "
//                           >
//                             <Eye
//                               size={17}
//                               strokeWidth={2}
//                             />
//                           </button>

//                           <button
//                             type="button"
//                             title="Edit Candidate"
//                             aria-label="Edit Candidate"
//                             onClick={() =>
//                               handleEdit(candidate)
//                             }
//                             className="
//                               flex
//                               h-7
//                               w-7
//                               items-center
//                               justify-center
//                               rounded-md
//                               text-slate-600
//                               transition
//                               hover:bg-orange-50
//                               hover:text-orange-500
//                             "
//                           >
//                             <Pencil
//                               size={17}
//                               strokeWidth={2}
//                             />
//                           </button>

//                           <button
//                             type="button"
//                             title="Candidate History"
//                             aria-label="Candidate History"
//                             onClick={() =>
//                               handleHistory(candidate)
//                             }
//                             className="
//                               flex
//                               h-7
//                               w-7
//                               items-center
//                               justify-center
//                               rounded-md
//                               text-red-500
//                               transition
//                               hover:bg-red-50
//                               hover:text-red-600
//                             "
//                           >
//                             <History
//                               size={18}
//                               strokeWidth={2}
//                             />
//                           </button>
//                         </div>
//                       </div>
//                     );
//                   },
//                 )}

//                 {visibleCandidates.length === 0 && (
//                   <div
//                     className="
//                       border-t
//                       border-slate-200
//                       px-5
//                       py-10
//                       text-center
//                       font-urbanist
//                       text-[13px]
//                       font-normal
//                       leading-[18px]
//                       text-slate-500
//                     "
//                   >
//                     No candidates match your search.
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* =====================================================
//               FOOTER
//           ===================================================== */}

//           <div
//             className="
//               flex
//               min-h-[70px]
//               flex-col
//               items-center
//               justify-between
//               gap-3
//               px-3
//               py-4
//               font-urbanist
//               sm:flex-row
//               sm:px-6
//             "
//           >
//             {/* Body/SM
//                 Urbanist Regular — 13px */}

//             <p
//               className="
//                 font-urbanist
//                 text-[13px]
//                 font-normal
//                 leading-[18px]
//                 text-slate-600
//               "
//             >
//               {searchQuery
//                 ? `Showing ${
//                     (safePage - 1) * rowsPerPage + 1
//                   }-${Math.min(
//                     safePage * rowsPerPage,
//                     filteredCandidates.length,
//                   )} of ${
//                     filteredCandidates.length
//                   } matching candidates`
//                 : `Showing ${
//                     (safePage - 1) * rowsPerPage + 1
//                   }-${Math.min(
//                     safePage * rowsPerPage,
//                     candidates.length,
//                   )} of ${
//                     candidates.length
//                   } candidates`}
//             </p>

//             {/* Utility / UI */}

//             <div
//               className="
//                 flex
//                 items-center
//                 gap-1.5
//                 font-urbanist
//               "
//             >
//               <button
//                 type="button"
//                 disabled={safePage === 1}
//                 onClick={() =>
//                   setCurrentPage((page) =>
//                     Math.max(1, page - 1),
//                   )
//                 }
//                 className="
//                   flex
//                   h-8
//                   w-8
//                   items-center
//                   justify-center
//                   rounded-lg
//                   border
//                   border-slate-200
//                   bg-white
//                   font-urbanist
//                   text-slate-600
//                   transition
//                   hover:border-orange-300
//                   hover:bg-orange-50
//                   hover:text-orange-500
//                 "
//                 aria-label="Previous page"
//               >
//                 <ChevronLeft size={15} />
//               </button>

//               {/* Nav/Item
//                   Urbanist Medium — 14px
                  
//                   Active:
//                   Nav/Item Active
//                   Urbanist Semi Bold — 14px */}

//               {Array.from(
//                 {
//                   length: totalPages,
//                 },
//                 (_, index) => index + 1,
//               ).map((page) => (
//                 <button
//                   key={page}
//                   type="button"
//                   onClick={() =>
//                     setCurrentPage(page)
//                   }
//                   className={`
//                     flex
//                     h-8
//                     w-8
//                     items-center
//                     justify-center
//                     rounded-lg
//                     font-urbanist
//                     text-[14px]
//                     leading-[18px]
//                     shadow-sm
//                     transition
//                     ${
//                       safePage === page
//                         ? "font-semibold bg-orange-500 text-white"
//                         : "font-medium border border-slate-200 bg-white text-slate-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500"
//                     }
//                   `}
//                   aria-current={
//                     safePage === page
//                       ? "page"
//                       : undefined
//                   }
//                 >
//                   {page}
//                 </button>
//               ))}

//               <button
//                 type="button"
//                 disabled={
//                   safePage === totalPages
//                 }
//                 onClick={() =>
//                   setCurrentPage((page) =>
//                     Math.min(
//                       totalPages,
//                       page + 1,
//                     ),
//                   )
//                 }
//                 className="
//                   flex
//                   h-8
//                   w-8
//                   items-center
//                   justify-center
//                   rounded-lg
//                   border
//                   border-slate-200
//                   bg-white
//                   font-urbanist
//                   text-slate-600
//                   transition
//                   hover:border-orange-300
//                   hover:bg-orange-50
//                   hover:text-orange-500
//                 "
//                 aria-label="Next page"
//               >
//                 <ChevronRight size={15} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {auditOpen && selectedCandidate && (
//         <AuditLogModal
//           candidateName={selectedCandidate.name}
//           onClose={closeAuditLog}
//         />
//       )}
//     </PreOnboardPageShell>
//   );
// }

import { useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Pencil,
  History,
  Plus,
  Send,
  PanelsTopLeft,
  BookOpen,
  Mail,
} from "lucide-react";

import AuditLogModal from "./AuditLog";
import PreOnboardPageShell from "../components/PreEnrollmentPageShell";
import {
  addCandidates,
  getAddedCandidates,
  type AddCandidateRow,
} from "../constants/add-candidate.constants";

type Candidate = AddCandidateRow;

export default function AddCandidate() {
  const navigate = useNavigate();
  const { domain } = useParams();
  const [searchParams] = useSearchParams();

  const basePath = domain
    ? `/${domain}/admin/enrollment/pre-enrollment`
    : "/admin/enrollment/pre-enrollment";

  const [auditOpen, setAuditOpen] = useState(false);

  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate | null>(null);

  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 5;

  const candidates = [
    ...getAddedCandidates(),
    ...addCandidates,
  ];

  const searchQuery = (
    searchParams.get("q") ?? ""
  )
    .trim()
    .toLowerCase();

  const filteredCandidates = candidates.filter(
    (candidate) =>
      !searchQuery ||
      candidate.name
        .toLowerCase()
        .includes(searchQuery) ||
      candidate.email
        .toLowerCase()
        .includes(searchQuery) ||
      candidate.mobile
        .toLowerCase()
        .includes(searchQuery),
  );

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredCandidates.length / rowsPerPage,
    ),
  );

  const safePage = Math.min(
    currentPage,
    totalPages,
  );

  const visibleCandidates =
    filteredCandidates.slice(
      (safePage - 1) * rowsPerPage,
      safePage * rowsPerPage,
    );

  const getInitial = (name: string) =>
    name.trim().charAt(0).toUpperCase();

  const handleView = (candidate: Candidate) => {
    navigate(
      `${basePath}/completed-candidate/${candidate.id}/tasks`,
      {
        state: {
          candidateSource: "add",
          candidate,
        },
      },
    );
  };

  const handleEdit = (candidate: Candidate) => {
    navigate(
      `${basePath}/completed-candidate/${candidate.id}/portal-info`,
      {
        state: {
          candidateSource: "add",
          candidate,
        },
      },
    );
  };

  const handleHistory = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setAuditOpen(true);
  };

  const closeAuditLog = () => {
    setAuditOpen(false);
    setSelectedCandidate(null);
  };

  return (
    <PreOnboardPageShell>
      <div
        className="
          w-full
          min-w-0
          px-4
          pb-6
          pt-2
          font-urbanist
          sm:px-4
          md:px-5
        "
      >
        {/* =====================================================
            TOP POLICY + ADD CANDIDATE
        ===================================================== */}

        <div
          className="
            mb-5
            flex
            w-full
            flex-col
            gap-3
            font-urbanist
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* ONBOARDING POLICY */}

          <button
            type="button"
            className="
              inline-flex
              h-9
              items-center
              gap-2
              rounded-lg
              border
              border-slate-200
              bg-white
              px-3.5
              font-urbanist
              shadow-sm
              transition
              hover:border-orange-300
              hover:bg-orange-50
            "
          >
            {/* Label/SM
                Urbanist Medium — 13px */}

            <span
              className="
                whitespace-nowrap
                font-urbanist
                text-[13px]
                font-medium
                leading-[18px]
                text-slate-600
              "
            >
              Onboarding Policy:
            </span>

            {/* Body/SM
                Urbanist Regular — 13px */}

            <span
              className="
                whitespace-nowrap
                font-urbanist
                text-[13px]
                font-normal
                leading-[18px]
                text-slate-800
              "
            >
              Standard Policy
            </span>

            <ChevronDown
              size={15}
              strokeWidth={2}
              className="shrink-0 text-slate-700"
            />
          </button>

          {/* ADD CANDIDATE */}

          <button
            type="button"
            onClick={() =>
              navigate(
                `${basePath}/add-candidate/new`,
              )
            }
            className="
              -mt-1
              inline-flex
              h-9
              items-center
              gap-2
              rounded-lg
              border
              border-orange-500
              bg-white
              px-4
              font-urbanist
              text-[14px]
              font-medium
              leading-[18px]
              text-orange-500
              transition
              hover:bg-orange-50
            "
          >
            <Plus
              size={15}
              strokeWidth={2.5}
            />

            {/* Utility/UI
                Urbanist Medium — 14px */}

            <span
              className="
                font-urbanist
                text-[14px]
                font-medium
                leading-[18px]
              "
            >
              Add Candidate
            </span>
          </button>
        </div>

        {/* =====================================================
            MAIN CARD
        ===================================================== */}

        <div
          className="
            w-full
            overflow-hidden
            rounded-[16px]
            border
            border-slate-100
            bg-white
            font-urbanist
            shadow-[0_6px_20px_rgba(15,23,42,0.14)]
          "
        >
          {/* ===================================================
              CARD HEADER
          =================================================== */}

          <div
            className="
              flex
              min-h-[58px]
              flex-wrap
              items-center
              justify-between
              px-3
              py-3
              font-urbanist
              sm:px-6
            "
          >
            {/* Heading/MD
                Urbanist Bold — 16px */}

            <h2
              className="
                font-urbanist
                text-[16px]
                font-bold
                leading-[20px]
                text-slate-800
              "
            >
              Onboarding Actions &amp; Candidates
            </h2>

            <div
              className="
                flex
                w-full
                flex-wrap
                items-center
                gap-2
                font-urbanist
                sm:w-auto
                sm:flex-nowrap
              "
            >
              {/* ASSET ISSUE */}

              <button
                type="button"
                className="
                  inline-flex
                  h-8
                  items-center
                  gap-1.5
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-3
                  font-urbanist
                  text-[14px]
                  font-medium
                  leading-[18px]
                  text-slate-800
                  shadow-sm
                  transition
                  hover:border-orange-300
                  hover:bg-orange-50
                  hover:text-orange-500
                "
              >
                <PanelsTopLeft
                  size={13}
                  strokeWidth={2}
                  className="text-slate-800"
                />

                Asset Issue
              </button>

              {/* TRAINING REQUEST */}

              <button
                type="button"
                className="
                  inline-flex
                  h-8
                  items-center
                  gap-1.5
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-3
                  font-urbanist
                  text-[14px]
                  font-medium
                  leading-[18px]
                  text-slate-800
                  shadow-sm
                  transition
                  hover:border-orange-300
                  hover:bg-orange-50
                  hover:text-orange-500
                "
              >
                <BookOpen
                  size={13}
                  strokeWidth={2}
                  className="text-slate-800"
                />

                Training Request
              </button>

              {/* INTIMATION MAIL */}

              <button
                type="button"
                className="
                  inline-flex
                  h-8
                  items-center
                  gap-1.5
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-3
                  font-urbanist
                  text-[14px]
                  font-medium
                  leading-[18px]
                  text-slate-800
                  shadow-sm
                  transition
                  hover:border-orange-300
                  hover:bg-orange-50
                  hover:text-orange-500
                "
              >
                <Mail
                  size={13}
                  strokeWidth={2}
                  className="text-slate-800"
                />

                Intimation Mail
              </button>

              {/* SEND */}

              <button
                type="button"
                className="
                  inline-flex
                  h-8
                  items-center
                  gap-1.5
                  rounded-lg
                  bg-orange-500
                  px-4
                  font-urbanist
                  text-[14px]
                  font-medium
                  leading-[18px]
                  text-white
                  shadow-sm
                  transition
                  hover:bg-orange-600
                "
              >
                <Send
                  size={13}
                  strokeWidth={2}
                />

                Send
              </button>
            </div>
          </div>

          {/* ===================================================
              TABLE
          =================================================== */}

          <div
            className="
              px-3
              pb-3
              font-urbanist
              sm:px-6
            "
          >
            <div
              className="
                w-full
                overflow-x-auto
                rounded-xl
                border
                border-slate-200
                font-urbanist
              "
            >
              <div
                className="
                  min-w-[850px]
                  rounded-xl
                  font-urbanist
                "
              >
                {/* TABLE HEADER */}

                <div
                  className="
                    grid
                    grid-cols-[1.25fr_1.5fr_1fr_1fr_0.75fr_1fr_0.75fr]
                    items-center
                    bg-slate-50
                    px-5
                    py-3
                    font-urbanist
                  "
                >
                  {/* Utility/UI — Table/Header
                      Urbanist Medium — 12px */}

                  <div
                    className="
                      font-urbanist
                      text-[12px]
                      font-medium
                      leading-[16px]
                      text-slate-600
                    "
                  >
                    Candidate Name
                  </div>

                  <div
                    className="
                      font-urbanist
                      text-[12px]
                      font-medium
                      leading-[16px]
                      text-slate-600
                    "
                  >
                    Email ID
                  </div>

                  <div
                    className="
                      font-urbanist
                      text-[12px]
                      font-medium
                      leading-[16px]
                      text-slate-600
                    "
                  >
                    Mobile No
                  </div>

                  <div
                    className="
                      font-urbanist
                      text-[12px]
                      font-medium
                      leading-[16px]
                      text-slate-600
                    "
                  >
                    Joining Date
                  </div>

                  <div
                    className="
                      font-urbanist
                      text-[12px]
                      font-medium
                      leading-[16px]
                      text-slate-600
                    "
                  >
                    Status
                  </div>

                  <div
                    className="
                      font-urbanist
                      text-[12px]
                      font-medium
                      leading-[16px]
                      text-slate-600
                    "
                  >
                    Verification
                  </div>

                  <div
                    className="
                      text-center
                      font-urbanist
                      text-[12px]
                      font-medium
                      leading-[16px]
                      text-slate-600
                    "
                  >
                    Action
                  </div>
                </div>

                {/* TABLE ROWS */}

                {visibleCandidates.map(
                  (candidate) => {
                    const [
                      completed = 0,
                      total = 0,
                    ] = candidate.status
                      .split("/")
                      .map(Number);

                    const percentage =
                      candidate.progress;

                    return (
                      <div
                        key={candidate.id}
                        className="
                          grid
                          min-h-[59px]
                          grid-cols-[1.25fr_1.5fr_1fr_1fr_0.75fr_1fr_0.75fr]
                          items-center
                          border-t
                          border-slate-200
                          px-5
                          font-urbanist
                          transition
                          hover:bg-orange-50/30
                        "
                      >
                        {/* CANDIDATE NAME */}

                        <div
                          className="
                            flex
                            min-w-0
                            items-center
                            gap-2.5
                            font-urbanist
                          "
                        >
                          {/* Label/SM
                              Urbanist Medium — 13px */}

                          <span
                            className="
                              flex
                              h-7
                              w-7
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-orange-50
                              font-urbanist
                              text-[13px]
                              font-medium
                              leading-[18px]
                              text-orange-500
                            "
                          >
                            {getInitial(
                              candidate.name,
                            )}
                          </span>

                          {/* Label/LG
                              Urbanist Medium — 16px */}

                          <span
                            className="
                              truncate
                              font-urbanist
                              text-[16px]
                              font-medium
                              leading-[20px]
                              text-slate-800
                            "
                          >
                            {candidate.name}
                          </span>
                        </div>

                        {/* EMAIL
                            Body/SM
                            Urbanist Regular — 13px */}

                        <div
                          className="
                            truncate
                            font-urbanist
                            text-[13px]
                            font-normal
                            leading-[18px]
                            text-slate-700
                          "
                        >
                          {candidate.email}
                        </div>

                        {/* MOBILE */}

                        <div
                          className="
                            font-urbanist
                            text-[13px]
                            font-normal
                            leading-[18px]
                            text-slate-700
                          "
                        >
                          {candidate.mobile}
                        </div>

                        {/* JOINING DATE */}

                        <div
                          className="
                            font-urbanist
                            text-[13px]
                            font-normal
                            leading-[18px]
                            text-slate-700
                          "
                        >
                          {candidate.joining}
                        </div>

                        {/* STATUS */}

                        <div
                          className="
                            flex
                            items-center
                            gap-2
                            font-urbanist
                          "
                        >
                          <div
                            className="
                              h-1.5
                              w-10
                              overflow-hidden
                              rounded-full
                              bg-slate-200
                            "
                          >
                            <div
                              className="
                                h-full
                                rounded-full
                                bg-orange-500
                              "
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>

                          {/* Label/XXS-11
                              Urbanist Medium — 11px */}

                          <span
                            className="
                              font-urbanist
                              text-[11px]
                              font-medium
                              leading-[14px]
                              text-slate-700
                            "
                          >
                            {completed}/{total}
                          </span>
                        </div>

                        {/* VERIFICATION */}

                        <div>
                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              px-2.5
                              py-1
                              font-urbanist
                              text-[11px]
                              font-medium
                              leading-[14px]
                              ${
                                candidate.verification ===
                                "Verified"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-red-50 text-red-500"
                              }
                            `}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />

                            {candidate.verification ===
                            "Verified"
                              ? "Verified"
                              : "Unverified"}
                          </span>
                        </div>

                        {/* ACTIONS */}

                        <div
                          className="
                            flex
                            items-center
                            justify-center
                            gap-2
                            font-urbanist
                          "
                        >
                          <button
                            type="button"
                            title="View Candidate"
                            aria-label="View Candidate"
                            onClick={() =>
                              handleView(candidate)
                            }
                            className="
                              flex
                              h-7
                              w-7
                              items-center
                              justify-center
                              rounded-md
                              text-slate-600
                              transition
                              hover:bg-orange-50
                              hover:text-orange-500
                            "
                          >
                            <Eye
                              size={17}
                              strokeWidth={2}
                            />
                          </button>

                          <button
                            type="button"
                            title="Edit Candidate"
                            aria-label="Edit Candidate"
                            onClick={() =>
                              handleEdit(candidate)
                            }
                            className="
                              flex
                              h-7
                              w-7
                              items-center
                              justify-center
                              rounded-md
                              text-slate-600
                              transition
                              hover:bg-orange-50
                              hover:text-orange-500
                            "
                          >
                            <Pencil
                              size={17}
                              strokeWidth={2}
                            />
                          </button>

                          <button
                            type="button"
                            title="Candidate History"
                            aria-label="Candidate History"
                            onClick={() =>
                              handleHistory(candidate)
                            }
                            className="
                              flex
                              h-7
                              w-7
                              items-center
                              justify-center
                              rounded-md
                              text-red-500
                              transition
                              hover:bg-red-50
                              hover:text-red-600
                            "
                          >
                            <History
                              size={18}
                              strokeWidth={2}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  },
                )}

                {visibleCandidates.length === 0 && (
                  <div
                    className="
                      border-t
                      border-slate-200
                      px-5
                      py-10
                      text-center
                      font-urbanist
                      text-[13px]
                      font-normal
                      leading-[18px]
                      text-slate-500
                    "
                  >
                    No candidates match your
                    search.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =====================================================
              FOOTER
          ===================================================== */}

          <div
            className="
              flex
              min-h-[70px]
              flex-col
              items-center
              justify-between
              gap-3
              px-3
              py-4
              font-urbanist
              sm:flex-row
              sm:px-6
            "
          >
            {/* Body/SM
                Urbanist Regular — 13px */}

            <p
              className="
                font-urbanist
                text-[13px]
                font-normal
                leading-[18px]
                text-slate-600
              "
            >
              {searchQuery
                ? `Showing ${
                    (safePage - 1) *
                      rowsPerPage +
                    1
                  }-${Math.min(
                    safePage * rowsPerPage,
                    filteredCandidates.length,
                  )} of ${
                    filteredCandidates.length
                  } matching candidates`
                : `Showing ${
                    (safePage - 1) *
                      rowsPerPage +
                    1
                  }-${Math.min(
                    safePage * rowsPerPage,
                    candidates.length,
                  )} of ${
                    candidates.length
                  } candidates`}
            </p>

            {/* PAGINATION */}

            <div
              className="
                flex
                items-center
                gap-1.5
                font-urbanist
              "
            >
              {/* Previous */}

              <button
                type="button"
                disabled={safePage === 1}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.max(
                      1,
                      page - 1,
                    ),
                  )
                }
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  font-urbanist
                  text-slate-600
                  transition
                  hover:border-orange-300
                  hover:bg-orange-50
                  hover:text-orange-500
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
                aria-label="Previous page"
              >
                <ChevronLeft size={15} />
              </button>

              {/* Page Numbers */}

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) =>
                  index + 1,
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() =>
                    setCurrentPage(page)
                  }
                  className={`
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    font-urbanist
                    text-[14px]
                    leading-[18px]
                    shadow-sm
                    transition
                    ${
                      safePage === page
                        ? "bg-orange-500 font-semibold text-white"
                        : "border border-slate-200 bg-white font-medium text-slate-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-500"
                    }
                  `}
                  aria-current={
                    safePage === page
                      ? "page"
                      : undefined
                  }
                >
                  {page}
                </button>
              ))}

              {/* Next */}

              <button
                type="button"
                disabled={
                  safePage === totalPages
                }
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(
                      totalPages,
                      page + 1,
                    ),
                  )
                }
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  font-urbanist
                  text-slate-600
                  transition
                  hover:border-orange-300
                  hover:bg-orange-50
                  hover:text-orange-500
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
                aria-label="Next page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AUDIT LOG */}

      {auditOpen &&
        selectedCandidate && (
          <AuditLogModal
            candidateName={
              selectedCandidate.name
            }
            onClose={closeAuditLog}
          />
        )}
    </PreOnboardPageShell>
  );
}
// import { useMemo, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";

// import PreOnboardPageShell from "../components/PreOnboardPageShell";

// type CompletedCandidateRow = {
//   id: number;
//   candidateName: string;
//   email: string;
//   mobile: string;
//   joiningDate: string;
// };

// const completedCandidates: CompletedCandidateRow[] = [
//   {
//     id: 1,
//     candidateName: "Anusha Mamidipalli",
//     email: "anusha.m@koundinyasa.com",
//     mobile: "+91 98480 22334",
//     joiningDate: "13-Mar-2026",
//   },
//   {
//     id: 2,
//     candidateName: "Prathyusha Reddy",
//     email: "prathyusha.r@koundinyasa.com",
//     mobile: "+91 80081 23456",
//     joiningDate: "25-Mar-2026",
//   },
//   {
//     id: 3,
//     candidateName: "Chishtanvi Sowmya",
//     email: "sowmya.c@koundinyasa.com",
//     mobile: "+91 99499 87654",
//     joiningDate: "25-Mar-2026",
//   },
//   {
//     id: 4,
//     candidateName: "Rakshitha Golagani",
//     email: "rakshitha.c@koundinyasa.com",
//     mobile: "+91 77020 70627",
//     joiningDate: "06-Apr-2026",
//   },
//   {
//     id: 5,
//     candidateName: "Karishel Malka",
//     email: "karishel.m@koundinyasa.com",
//     mobile: "+91 80740 69190",
//     joiningDate: "08-Apr-2026",
//   },
//   {
//     id: 6,
//     candidateName: "Naveen Ponaganti",
//     email: "naveen.p@koundinyasa.com",
//     mobile: "+91 99510 18954",
//     joiningDate: "06-Apr-2026",
//   },
//   {
//     id: 7,
//     candidateName: "Hinduvani Varadayapu",
//     email: "hinduvani.v@koundinyasa.com",
//     mobile: "+91 80089 06785",
//     joiningDate: "06-Apr-2024",
//   },
// ];

// export default function CompletedCandidate() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();

//   const searchTerm = (searchParams.get("q") ?? "").trim();

//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(5);

//   const filteredCandidates = useMemo(() => {
//     if (!searchTerm) {
//       return completedCandidates;
//     }

//     const search = searchTerm.toLowerCase();

//     return completedCandidates.filter(
//       (candidate) =>
//         candidate.candidateName.toLowerCase().includes(search) ||
//         candidate.email.toLowerCase().includes(search) ||
//         candidate.mobile.toLowerCase().includes(search),
//     );
//   }, [searchTerm]);

//   const totalCandidates = filteredCandidates.length;

//   const totalPages = Math.max(
//     1,
//     Math.ceil(totalCandidates / rowsPerPage),
//   );

//   const safePage = Math.min(currentPage, totalPages);

//   const startIndex = (safePage - 1) * rowsPerPage;

//   const visibleCandidates = filteredCandidates.slice(
//     startIndex,
//     startIndex + rowsPerPage,
//   );

//   const getInitial = (name: string) => {
//     return name.charAt(0).toUpperCase();
//   };

//   return (
//     <PreOnboardPageShell>
//       <div
//         className="
//           relative
//           -mt-1
//           w-full
//           min-w-0
//           px-3
//           pb-8
//           sm:px-4
//           md:px-5
//           lg:px-6
//         "
//       >
//         {/* CARD */}
//         <div
//           className="
//             w-full
//             overflow-hidden
//             rounded-[18px]
//             border
//             border-slate-200
//             bg-white
//             shadow-[0_8px_24px_rgba(15,23,42,0.14)]
//           "
//         >
//           {/* TABLE SCROLL AREA */}
//           <div className="w-full overflow-x-auto">
//             <table className="w-full min-w-[900px] border-collapse">
//               {/* HEADER */}
//               <thead>
//                 <tr className="h-[52px] border-b border-slate-200 bg-slate-50">
//                   <th
//                     className="
//                       px-6
//                       text-left
//                       text-[12px]
//                       font-semibold
//                       uppercase
//                       tracking-[0.01em]
//                       text-slate-700
//                     "
//                   >
//                     Candidate Name
//                   </th>

//                   <th
//                     className="
//                       px-6
//                       text-left
//                       text-[12px]
//                       font-semibold
//                       uppercase
//                       text-slate-700
//                     "
//                   >
//                     Email ID
//                   </th>

//                   <th
//                     className="
//                       px-6
//                       text-left
//                       text-[12px]
//                       font-semibold
//                       uppercase
//                       text-slate-700
//                     "
//                   >
//                     Mobile No
//                   </th>

//                   <th
//                     className="
//                       px-6
//                       text-left
//                       text-[12px]
//                       font-semibold
//                       uppercase
//                       text-slate-700
//                     "
//                   >
//                     Joining Date
//                   </th>

//                   <th
//                     className="
//                       px-6
//                       text-center
//                       text-[12px]
//                       font-semibold
//                       uppercase
//                       text-slate-700
//                     "
//                   >
//                     Actions
//                   </th>
//                 </tr>
//               </thead>

//               {/* BODY */}
//               <tbody>
//                 {visibleCandidates.length > 0 ? (
//                   visibleCandidates.map((candidate) => (
//                     <tr
//                       key={candidate.id}
//                       className="
//                         h-[63px]
//                         border-b
//                         border-slate-200
//                         last:border-b-0
//                         hover:bg-slate-50
//                       "
//                     >
//                       {/* NAME */}
//                       <td className="px-6">
//                         <div className="flex items-center gap-4">
//                           <div
//                             className="
//                               flex
//                               h-8
//                               w-8
//                               shrink-0
//                               items-center
//                               justify-center
//                               rounded-full
//                               bg-orange-50
//                               text-[12px]
//                               font-semibold
//                               text-orange-500
//                             "
//                           >
//                             {getInitial(candidate.candidateName)}
//                           </div>

//                           <span
//                             className="
//                               whitespace-nowrap
//                               text-[13px]
//                               font-semibold
//                               text-slate-800
//                             "
//                           >
//                             {candidate.candidateName}
//                           </span>
//                         </div>
//                       </td>

//                       {/* EMAIL */}
//                       <td
//                         className="
//                           whitespace-nowrap
//                           px-6
//                           text-[13px]
//                           text-slate-500
//                         "
//                       >
//                         {candidate.email}
//                       </td>

//                       {/* MOBILE */}
//                       <td
//                         className="
//                           whitespace-nowrap
//                           px-6
//                           text-[13px]
//                           text-slate-500
//                         "
//                       >
//                         {candidate.mobile}
//                       </td>

//                       {/* DATE */}
//                       <td
//                         className="
//                           whitespace-nowrap
//                           px-6
//                           text-[13px]
//                           text-slate-500
//                         "
//                       >
//                         {candidate.joiningDate}
//                       </td>

//                       {/* ACTION */}
//                       <td className="px-6 text-center">
//                         <button
//                           type="button"
//                           onClick={() =>
//                             navigate(
//                               `${candidate.id}/tasks`,
//                             )
//                           }
//                           className="
//                             inline-flex
//                             items-center
//                             gap-2
//                             rounded-full
//                             bg-emerald-50
//                             px-5
//                             py-2
//                             text-[13px]
//                             font-semibold
//                             text-emerald-600
//                             transition
//                             hover:bg-emerald-100
//                           "
//                         >
//                           <span className="text-[14px]">
//                             ◉
//                           </span>

//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={5}
//                       className="
//                         h-[180px]
//                         text-center
//                         text-sm
//                         text-slate-500
//                       "
//                     >
//                       No candidates found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* PAGINATION */}
//           <div
//             className="
//               flex
//               min-h-[78px]
//               flex-col
//               gap-4
//               border-t
//               border-slate-200
//               bg-white
//               px-6
//               py-4
//               sm:flex-row
//               sm:items-center
//               sm:justify-between
//             "
//           >
//             {/* ROWS PER PAGE */}
//             <div className="flex items-center gap-2 text-[13px] text-slate-500">
//               <span>Rows per page:</span>

//               <select
//                 value={rowsPerPage}
//                 onChange={(event) => {
//                   setRowsPerPage(
//                     Number(event.target.value),
//                   );
//                   setCurrentPage(1);
//                 }}
//                 className="
//                   cursor-pointer
//                   rounded-md
//                   border
//                   border-slate-200
//                   bg-white
//                   px-2
//                   py-1
//                   text-[13px]
//                   text-slate-700
//                   outline-none
//                 "
//               >
//                 <option value={5}>5</option>
//                 <option value={10}>10</option>
//                 <option value={20}>20</option>
//                 <option value={50}>50</option>
//               </select>
//             </div>

//             {/* PAGE NUMBERS */}
//             <div className="flex items-center gap-5">
//               <span className="whitespace-nowrap text-[13px] text-slate-500">
//                 {totalCandidates === 0
//                   ? "0-0 of 0 candidates"
//                   : `${startIndex + 1}-${Math.min(
//                       startIndex + rowsPerPage,
//                       totalCandidates,
//                     )} of ${totalCandidates} candidates`}
//               </span>

//               <div className="flex items-center gap-3">
//                 {Array.from(
//                   { length: totalPages },
//                   (_, index) => index + 1,
//                 ).map((page) => (
//                   <button
//                     key={page}
//                     type="button"
//                     onClick={() => setCurrentPage(page)}
//                     className={`
//                       flex
//                       h-8
//                       min-w-8
//                       items-center
//                       justify-center
//                       rounded-md
//                       px-2
//                       text-[13px]
//                       font-medium
//                       transition
//                       ${
//                         safePage === page
//                           ? "bg-orange-500 text-white"
//                           : "text-slate-600 hover:bg-slate-100"
//                       }
//                     `}
//                   >
//                     {page}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </PreOnboardPageShell>
//   );
// }


import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import PreOnboardPageShell from "../components/PreEnrollmentPageShell";

type CompletedCandidateRow = {
  id: number;
  candidateName: string;
  email: string;
  mobile: string;
  joiningDate: string;
};

const completedCandidates: CompletedCandidateRow[] = [
  {
    id: 1,
    candidateName: "Anusha Mamidipalli",
    email: "anusha.m@koundinyasa.com",
    mobile: "+91 98480 22334",
    joiningDate: "13-Mar-2026",
  },
  {
    id: 2,
    candidateName: "Prathyusha Reddy",
    email: "prathyusha.r@koundinyasa.com",
    mobile: "+91 80081 23456",
    joiningDate: "25-Mar-2026",
  },
  {
    id: 3,
    candidateName: "Chishtanvi Sowmya",
    email: "sowmya.c@koundinyasa.com",
    mobile: "+91 99499 87654",
    joiningDate: "25-Mar-2026",
  },
  {
    id: 4,
    candidateName: "Rakshitha Golagani",
    email: "rakshitha.c@koundinyasa.com",
    mobile: "+91 77020 70627",
    joiningDate: "06-Apr-2026",
  },
  {
    id: 5,
    candidateName: "Karishel Malka",
    email: "karishel.m@koundinyasa.com",
    mobile: "+91 80740 69190",
    joiningDate: "08-Apr-2026",
  },
  {
    id: 6,
    candidateName: "Naveen Ponaganti",
    email: "naveen.p@koundinyasa.com",
    mobile: "+91 99510 18954",
    joiningDate: "06-Apr-2026",
  },
  {
    id: 7,
    candidateName: "Hinduvani Varadayapu",
    email: "hinduvani.v@koundinyasa.com",
    mobile: "+91 80089 06785",
    joiningDate: "06-Apr-2024",
  },
];

export default function CompletedCandidate() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const searchTerm = (searchParams.get("q") ?? "").trim();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredCandidates = useMemo(() => {
    if (!searchTerm) {
      return completedCandidates;
    }

    const search = searchTerm.toLowerCase();

    return completedCandidates.filter(
      (candidate) =>
        candidate.candidateName.toLowerCase().includes(search) ||
        candidate.email.toLowerCase().includes(search) ||
        candidate.mobile.toLowerCase().includes(search),
    );
  }, [searchTerm]);

  const totalCandidates = filteredCandidates.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalCandidates / rowsPerPage),
  );

  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * rowsPerPage;

  const visibleCandidates = filteredCandidates.slice(
    startIndex,
    startIndex + rowsPerPage,
  );

  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <PreOnboardPageShell>
      {/* Candidate Table Container */}
      <div
        className="
          relative
          -mt-1
          w-full
          min-w-0
          pb-8
        "
      >
        {/* CARD */}
        <div
          className="
            w-full
            overflow-hidden
            rounded-[18px]
            border
            border-slate-200
            bg-white
            shadow-[0_8px_45px_rgba(15,23,42,0.16)]
          "
        >
          {/* TABLE SCROLL AREA */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              {/* HEADER */}
              <thead>
                <tr className="h-[52px] border-b border-slate-200 bg-slate-50">
                  <th
                    className="
                      px-6
                      text-left
                      text-[12px]
                      font-semibold
                      uppercase
                      tracking-[0.01em]
                      text-slate-700
                    "
                  >
                    Candidate Name
                  </th>

                  <th
                    className="
                      px-6
                      text-left
                      text-[12px]
                      font-semibold
                      uppercase
                      text-slate-700
                    "
                  >
                    Email ID
                  </th>

                  <th
                    className="
                      px-6
                      text-left
                      text-[12px]
                      font-semibold
                      uppercase
                      text-slate-700
                    "
                  >
                    Mobile No
                  </th>

                  <th
                    className="
                      px-6
                      text-left
                      text-[12px]
                      font-semibold
                      uppercase
                      text-slate-700
                    "
                  >
                    Joining Date
                  </th>

                  <th
                    className="
                      px-6
                      text-center
                      text-[12px]
                      font-semibold
                      uppercase
                      text-slate-700
                    "
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              {/* BODY */}
              <tbody>
                {visibleCandidates.length > 0 ? (
                  visibleCandidates.map((candidate) => (
                    <tr
                      key={candidate.id}
                      className="
                        h-[63px]
                        border-b
                        border-slate-200
                        last:border-b-0
                        hover:bg-slate-50
                      "
                    >
                      {/* NAME */}
                      <td className="px-6">
                        <div className="flex items-center gap-4">
                          <div
                            className="
                              flex
                              h-8
                              w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              bg-orange-50
                              text-[12px]
                              font-semibold
                              text-orange-500
                            "
                          >
                            {getInitial(candidate.candidateName)}
                          </div>

                          <span
                            className="
                              whitespace-nowrap
                              text-[13px]
                              font-semibold
                              text-slate-800
                            "
                          >
                            {candidate.candidateName}
                          </span>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td
                        className="
                          whitespace-nowrap
                          px-6
                          text-[13px]
                          text-slate-500
                        "
                      >
                        {candidate.email}
                      </td>

                      {/* MOBILE */}
                      <td
                        className="
                          whitespace-nowrap
                          px-6
                          text-[13px]
                          text-slate-500
                        "
                      >
                        {candidate.mobile}
                      </td>

                      {/* DATE */}
                      <td
                        className="
                          whitespace-nowrap
                          px-6
                          text-[13px]
                          text-slate-500
                        "
                      >
                        {candidate.joiningDate}
                      </td>

                      {/* ACTION */}
                      <td className="px-6 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`${candidate.id}/tasks`)
                          }
                          className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            bg-emerald-50
                            px-5
                            py-2
                            text-[13px]
                            font-semibold
                            text-emerald-600
                            transition
                            hover:bg-emerald-100
                          "
                        >
                          <span className="text-[14px]">
                            ◉
                          </span>

                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="
                        h-[180px]
                        text-center
                        text-sm
                        text-slate-500
                      "
                    >
                      No candidates found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div
            className="
              flex
              min-h-[78px]
              flex-col
              gap-4
              border-t
              border-slate-200
              bg-white
              px-6
              py-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            {/* ROWS PER PAGE */}
            <div className="flex items-center gap-2 text-[13px] text-slate-500">
              <span>Rows per page:</span>

              <select
                value={rowsPerPage}
                onChange={(event) => {
                  setRowsPerPage(Number(event.target.value));
                  setCurrentPage(1);
                }}
                className="
                  cursor-pointer
                  rounded-md
                  border
                  border-slate-200
                  bg-white
                  px-2
                  py-1
                  text-[13px]
                  text-slate-700
                  outline-none
                "
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            {/* PAGE NUMBERS */}
            <div className="flex items-center gap-5">
              <span className="whitespace-nowrap text-[13px] text-slate-500">
                {totalCandidates === 0
                  ? "0-0 of 0 candidates"
                  : `${startIndex + 1}-${Math.min(
                      startIndex + rowsPerPage,
                      totalCandidates,
                    )} of ${totalCandidates} candidates`}
              </span>

              <div className="flex items-center gap-3">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`
                      flex
                      h-8
                      min-w-8
                      items-center
                      justify-center
                      rounded-md
                      px-2
                      text-[13px]
                      font-medium
                      transition
                      ${
                        safePage === page
                          ? "bg-orange-500 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }
                    `}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PreOnboardPageShell>
  );
}
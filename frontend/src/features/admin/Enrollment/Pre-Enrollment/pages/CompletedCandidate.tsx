// import { useMemo, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";

// import PreOnboardPageShell from "../components/PreEnrollmentPageShell";

// type CompletedCandidateRow = {
//   id: number;
//   candidateName: string;
//   email: string;
//   mobile: string;
//   joiningDate: string;
// };

// /*
//  * MOCK DATA
//  * Backend integration is still in progress.
//  * Keep this data until the real API is available.
//  */
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
//         candidate.candidateName
//           .toLowerCase()
//           .includes(search) ||
//         candidate.email
//           .toLowerCase()
//           .includes(search) ||
//         candidate.mobile
//           .toLowerCase()
//           .includes(search),
//     );
//   }, [searchTerm]);

//   const totalCandidates = filteredCandidates.length;

//   const totalPages = Math.max(
//     1,
//     Math.ceil(totalCandidates / rowsPerPage),
//   );

//   const safePage = Math.min(
//     currentPage,
//     totalPages,
//   );

//   const startIndex =
//     (safePage - 1) * rowsPerPage;

//   const visibleCandidates =
//     filteredCandidates.slice(
//       startIndex,
//       startIndex + rowsPerPage,
//     );

//   const getInitial = (name: string) => {
//     return name.charAt(0).toUpperCase();
//   };

//   return (
//     <PreOnboardPageShell>
//       {/* =====================================================
//           CANDIDATE TABLE CONTAINER
//       ===================================================== */}

//       <div
//         className="
//           relative
//           -mt-1
//           w-full
//           min-w-0
//           pb-8
//           font-urbanist
//         "
//       >
//         {/* ===================================================
//             CARD
//         =================================================== */}

//         <div
//           className="
//             w-full
//             overflow-hidden
//             rounded-[18px]
//             border
//             border-slate-200
//             bg-white
//             font-urbanist
//             shadow-[0_8px_45px_rgba(15,23,42,0.16)]
//           "
//         >
//           {/* =================================================
//               TABLE SCROLL AREA
//           ================================================= */}

//           <div className="w-full overflow-x-auto font-urbanist">
//             <table
//               className="
//                 w-full
//                 min-w-[900px]
//                 border-collapse
//                 font-urbanist
//               "
//             >
//               {/* =================================================
//                   HEADER
//               ================================================= */}

//               <thead>
//                 <tr
//                   className="
//                     h-[52px]
//                     border-b
//                     border-slate-200
//                     bg-slate-50
//                     font-urbanist
//                   "
//                 >
//                   {/* Label */}

//                   <th
//                     className="
//                       px-6
//                       text-left
//                       font-urbanist
//                       text-[13px]
//                       font-semibold
//                       leading-[18px]
//                       text-slate-700
//                     "
//                   >
//                     Candidate Name
//                   </th>

//                   {/* Label */}

//                   <th
//                     className="
//                       px-6
//                       text-left
//                       font-urbanist
//                       text-[13px]
//                       font-semibold
//                       leading-[18px]
//                       text-slate-700
//                     "
//                   >
//                     Email ID
//                   </th>

//                   {/* Label */}

//                   <th
//                     className="
//                       px-6
//                       text-left
//                       font-urbanist
//                       text-[13px]
//                       font-semibold
//                       leading-[18px]
//                       text-slate-700
//                     "
//                   >
//                     Mobile No
//                   </th>

//                   {/* Label */}

//                   <th
//                     className="
//                       px-6
//                       text-left
//                       font-urbanist
//                       text-[13px]
//                       font-semibold
//                       leading-[18px]
//                       text-slate-700
//                     "
//                   >
//                     Joining Date
//                   </th>

//                   {/* Label */}

//                   <th
//                     className="
//                       px-6
//                       text-center
//                       font-urbanist
//                       text-[13px]
//                       font-semibold
//                       leading-[18px]
//                       text-slate-700
//                     "
//                   >
//                     Actions
//                   </th>
//                 </tr>
//               </thead>

//               {/* =================================================
//                   BODY
//               ================================================= */}

//               <tbody>
//                 {visibleCandidates.length > 0 ? (
//                   visibleCandidates.map(
//                     (candidate) => (
//                       <tr
//                         key={candidate.id}
//                         className="
//                           h-[63px]
//                           border-b
//                           border-slate-200
//                           font-urbanist
//                           last:border-b-0
//                           hover:bg-slate-50
//                         "
//                       >
//                         {/* NAME */}

//                         <td className="px-6 font-urbanist">
//                           <div
//                             className="
//                               flex
//                               items-center
//                               gap-4
//                               font-urbanist
//                             "
//                           >
//                             <div
//                               className="
//                                 flex
//                                 h-8
//                                 w-8
//                                 shrink-0
//                                 items-center
//                                 justify-center
//                                 rounded-full
//                                 bg-orange-50
//                                 font-urbanist
//                                 text-xs
//                                 font-semibold
//                                 leading-4
//                                 text-orange-500
//                               "
//                             >
//                               {getInitial(
//                                 candidate.candidateName,
//                               )}
//                             </div>

//                             {/* Body */}

//                             <span
//                               className="
//                                 whitespace-nowrap
//                                 font-urbanist
//                                 text-sm
//                                 font-semibold
//                                 leading-5
//                                 text-slate-800
//                               "
//                             >
//                               {candidate.candidateName}
//                             </span>
//                           </div>
//                         </td>

//                         {/* EMAIL */}

//                         <td
//                           className="
//                             whitespace-nowrap
//                             px-6
//                             font-urbanist
//                             text-sm
//                             font-medium
//                             leading-5
//                             text-slate-500
//                           "
//                         >
//                           {candidate.email}
//                         </td>

//                         {/* MOBILE */}

//                         <td
//                           className="
//                             whitespace-nowrap
//                             px-6
//                             font-urbanist
//                             text-sm
//                             font-medium
//                             leading-5
//                             text-slate-500
//                           "
//                         >
//                           {candidate.mobile}
//                         </td>

//                         {/* DATE */}

//                         <td
//                           className="
//                             whitespace-nowrap
//                             px-6
//                             font-urbanist
//                             text-sm
//                             font-medium
//                             leading-5
//                             text-slate-500
//                           "
//                         >
//                           {candidate.joiningDate}
//                         </td>

//                         {/* ACTION */}

//                         <td className="px-6 text-center font-urbanist">
//                           <button
//                             type="button"
//                             onClick={() =>
//                               navigate(
//                                 `${candidate.id}/tasks`,
//                               )
//                             }
//                             className="
//                               inline-flex
//                               items-center
//                               gap-2
//                               rounded-full
//                               bg-emerald-50
//                               px-5
//                               py-2
//                               font-urbanist
//                               text-xs
//                               font-semibold
//                               leading-4
//                               text-emerald-600
//                               transition
//                               hover:bg-emerald-100
//                             "
//                           >
//                             {/* Utility / UI */}

//                             <span
//                               className="
//                                 font-urbanist
//                                 text-sm
//                                 font-semibold
//                                 leading-5
//                               "
//                             >
//                               ◉
//                             </span>

//                             View
//                           </button>
//                         </td>
//                       </tr>
//                     ),
//                   )
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={5}
//                       className="
//                         h-[180px]
//                         text-center
//                         font-urbanist
//                         text-sm
//                         font-medium
//                         leading-5
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

//           {/* =================================================
//               PAGINATION
//           ================================================= */}

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
//               font-urbanist
//               sm:flex-row
//               sm:items-center
//               sm:justify-between
//             "
//           >
//             {/* ROWS PER PAGE */}

//             <div
//               className="
//                 flex
//                 items-center
//                 gap-2
//                 font-urbanist
//               "
//             >
//               {/* Label */}

//               <span
//                 className="
//                   font-urbanist
//                   text-sm
//                   font-semibold
//                   leading-5
//                   text-slate-500
//                 "
//               >
//                 Rows per page:
//               </span>

//               {/* Utility / UI */}

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
//                   font-urbanist
//                   text-sm
//                   font-medium
//                   leading-5
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

//             {/* PAGE INFORMATION */}

//             <div
//               className="
//                 flex
//                 items-center
//                 gap-5
//                 font-urbanist
//               "
//             >
//               {/* Body */}

//               <span
//                 className="
//                   whitespace-nowrap
//                   font-urbanist
//                   text-sm
//                   font-medium
//                   leading-5
//                   text-slate-500
//                 "
//               >
//                 {totalCandidates === 0
//                   ? "0-0 of 0 candidates"
//                   : `${startIndex + 1}-${Math.min(
//                       startIndex +
//                         rowsPerPage,
//                       totalCandidates,
//                     )} of ${totalCandidates} candidates`}
//               </span>

//               {/* Page Numbers */}

//               <div
//                 className="
//                   flex
//                   items-center
//                   gap-3
//                   font-urbanist
//                 "
//               >
//                 {Array.from(
//                   {
//                     length: totalPages,
//                   },
//                   (_, index) =>
//                     index + 1,
//                 ).map((page) => (
//                   <button
//                     key={page}
//                     type="button"
//                     onClick={() =>
//                       setCurrentPage(page)
//                     }
//                     className={`
//                       flex
//                       h-8
//                       min-w-8
//                       items-center
//                       justify-center
//                       rounded-md
//                       px-2
//                       font-urbanist
//                       text-sm
//                       font-semibold
//                       leading-5
//                       transition
//                       ${
//                         safePage === page
//                           ? "bg-orange-500 text-white"
//                           : "text-slate-600 hover:bg-slate-100"
//                       }
//                     `}
//                     aria-current={
//                       safePage === page
//                         ? "page"
//                         : undefined
//                     }
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

/*
 * MOCK DATA
 * Backend integration is still in progress.
 * Keep this data until the real API is available.
 */
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
      {/* =====================================================
          CANDIDATE TABLE CONTAINER
      ===================================================== */}

      <div
        className="
          relative
          -mt-1
          w-full
          min-w-0
          pb-8
          font-urbanist
        "
      >
        {/* ===================================================
            CARD
        =================================================== */}

        <div
          className="
            w-full
            overflow-hidden
            rounded-[18px]
            border
            border-slate-200
            bg-white
            font-urbanist
            shadow-[0_8px_45px_rgba(15,23,42,0.16)]
          "
        >
          {/* =================================================
              TABLE SCROLL AREA
          ================================================= */}

          <div className="w-full overflow-x-auto font-urbanist">
            <table
              className="
                w-full
                min-w-[900px]
                border-collapse
                font-urbanist
              "
            >
              {/* =================================================
                  HEADER
              ================================================= */}

              <thead>
                <tr
                  className="
                    h-[52px]
                    border-b
                    border-slate-200
                    bg-slate-50
                    font-urbanist
                  "
                >
                  {/* Utility / UI — Table/Header */}

                  <th
                    className="
                      px-6
                      text-left
                      font-urbanist
                      text-[12px]
                      font-medium
                      leading-[16px]
                      text-slate-700
                    "
                  >
                    Candidate Name
                  </th>

                  <th
                    className="
                      px-6
                      text-left
                      font-urbanist
                      text-[12px]
                      font-medium
                      leading-[16px]
                      text-slate-700
                    "
                  >
                    Email ID
                  </th>

                  <th
                    className="
                      px-6
                      text-left
                      font-urbanist
                      text-[12px]
                      font-medium
                      leading-[16px]
                      text-slate-700
                    "
                  >
                    Mobile No
                  </th>

                  <th
                    className="
                      px-6
                      text-left
                      font-urbanist
                      text-[12px]
                      font-medium
                      leading-[16px]
                      text-slate-700
                    "
                  >
                    Joining Date
                  </th>

                  <th
                    className="
                      px-6
                      text-center
                      font-urbanist
                      text-[12px]
                      font-medium
                      leading-[16px]
                      text-slate-700
                    "
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              {/* =================================================
                  BODY
              ================================================= */}

              <tbody>
                {visibleCandidates.length > 0 ? (
                  visibleCandidates.map((candidate) => (
                    <tr
                      key={candidate.id}
                      className="
                        h-[63px]
                        border-b
                        border-slate-200
                        font-urbanist
                        last:border-b-0
                        hover:bg-slate-50
                      "
                    >
                      {/* NAME */}

                      <td className="px-6 font-urbanist">
                        <div
                          className="
                            flex
                            items-center
                            gap-4
                            font-urbanist
                          "
                        >
                          {/* Label/SM
                              Urbanist Medium 13px */}

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
                              font-urbanist
                              text-[13px]
                              font-medium
                              leading-[18px]
                              text-orange-500
                            "
                          >
                            {getInitial(candidate.candidateName)}
                          </div>

                          {/* Label/LG
                              Urbanist Medium 16px */}

                          <span
                            className="
                              whitespace-nowrap
                              font-urbanist
                              text-[16px]
                              font-medium
                              leading-[20px]
                              text-slate-800
                            "
                          >
                            {candidate.candidateName}
                          </span>
                        </div>
                      </td>

                      {/* EMAIL
                          Body/SM
                          Urbanist Regular 13px */}

                      <td
                        className="
                          whitespace-nowrap
                          px-6
                          font-urbanist
                          text-[13px]
                          font-normal
                          leading-[18px]
                          text-slate-500
                        "
                      >
                        {candidate.email}
                      </td>

                      {/* MOBILE
                          Body/SM
                          Urbanist Regular 13px */}

                      <td
                        className="
                          whitespace-nowrap
                          px-6
                          font-urbanist
                          text-[13px]
                          font-normal
                          leading-[18px]
                          text-slate-500
                        "
                      >
                        {candidate.mobile}
                      </td>

                      {/* DATE
                          Body/SM
                          Urbanist Regular 13px */}

                      <td
                        className="
                          whitespace-nowrap
                          px-6
                          font-urbanist
                          text-[13px]
                          font-normal
                          leading-[18px]
                          text-slate-500
                        "
                      >
                        {candidate.joiningDate}
                      </td>

                      {/* ACTION */}

                      <td className="px-6 text-center font-urbanist">
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
                            font-urbanist
                            text-[14px]
                            font-medium
                            leading-[18px]
                            text-emerald-600
                            transition
                            hover:bg-emerald-100
                          "
                        >
                          {/* Utility / UI */}

                          <span
                            className="
                              font-urbanist
                              text-[12px]
                              font-medium
                              leading-[16px]
                            "
                          >
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
                        font-urbanist
                        text-[13px]
                        font-normal
                        leading-[18px]
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

          {/* =================================================
              PAGINATION
          ================================================= */}

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
              font-urbanist
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            {/* ROWS PER PAGE */}

            <div
              className="
                flex
                items-center
                gap-2
                font-urbanist
              "
            >
              {/* Label/SM
                  Urbanist Medium 13px */}

              <span
                className="
                  font-urbanist
                  text-[13px]
                  font-medium
                  leading-[18px]
                  text-slate-500
                "
              >
                Rows per page:
              </span>

              {/* Body/SM
                  Urbanist Regular 13px */}

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
                  font-urbanist
                  text-[13px]
                  font-normal
                  leading-[18px]
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

            {/* PAGE INFORMATION */}

            <div
              className="
                flex
                items-center
                gap-5
                font-urbanist
              "
            >
              {/* Body/SM
                  Urbanist Regular 13px */}

              <span
                className="
                  whitespace-nowrap
                  font-urbanist
                  text-[13px]
                  font-normal
                  leading-[18px]
                  text-slate-500
                "
              >
                {totalCandidates === 0
                  ? "0-0 of 0 candidates"
                  : `${startIndex + 1}-${Math.min(
                      startIndex + rowsPerPage,
                      totalCandidates,
                    )} of ${totalCandidates} candidates`}
              </span>

              {/* PAGE NUMBERS */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  font-urbanist
                "
              >
                {Array.from(
                  {
                    length: totalPages,
                  },
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
                      font-urbanist
                      text-[14px]
                      leading-[18px]
                      transition
                      ${
                        safePage === page
                          ? "font-semibold bg-orange-500 text-white"
                          : "font-medium text-slate-600 hover:bg-slate-100"
                      }
                    `}
                    aria-current={
                      safePage === page ? "page" : undefined
                    }
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
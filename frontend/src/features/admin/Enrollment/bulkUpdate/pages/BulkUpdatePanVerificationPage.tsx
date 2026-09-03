// import { useMemo, useState } from "react";
// import { NavLink, useParams } from "react-router-dom";
// import {
//   Search,
//   ChevronDown,
//   Clock,
//   FileSpreadsheet,
//   Bookmark,
//   X,
//   AlertCircle,
// } from "lucide-react";

// import { BULK_UPDATE_SECTION_PATH } from "../constants/bulkUpdate.constants";

// /* =========================================================
//    EMPLOYEE DATA
//    ========================================================= */

// const employees = [
//   {
//     id: "KTSI64211",
//     name: "Sathwika Achugatla",
//     pan: "PJWPS1643P",
//   },
//   {
//     id: "KTSI64212",
//     name: "Sireesha Yarrameneni",
//     pan: "RWVPS5329N",
//   },
//   {
//     id: "KTSI64219",
//     name: "Ram Bhupal Reddy Sanki",
//     pan: "FMOPR6816J",
//   },
//   {
//     id: "284512",
//     name: "Varalaxmi Gumudala",
//     pan: "CLYPV8424J",
//   },
//   {
//     id: "284513",
//     name: "Nikhitha Narala",
//     pan: "DLGPN8693Q",
//   },
//   {
//     id: "284514",
//     name: "Sreya Chaluvaadi",
//     pan: "NDTPS5624D",
//   },
//   {
//     id: "284519",
//     name: "Rakesh Peddi",
//     pan: "ABCDE1234F",
//   },
//   {
//     id: "294621",
//     name: "Rama Veeramanikanta Pusunuri",
//     pan: "FGHIJ5678K",
//   },
//   {
//     id: "294622",
//     name: "Umar Sharief Shaik",
//     pan: "LMNOP9012Q",
//   },
//   {
//     id: "294623",
//     name: "Tharun Nagarjunapu",
//     pan: "QRSTU3456R",
//   },
//   {
//     id: "294624",
//     name: "Divyasree Taguru",
//     pan: "VWXYZ7890S",
//   },
//   {
//     id: "324833",
//     name: "Aparna Karigam",
//     pan: "ABCDE5678T",
//   },
//   {
//     id: "334911",
//     name: "Kavya N",
//     pan: "FGHIJ1234U",
//   },
//   {
//     id: "334912",
//     name: "Daniel Raju Ravi",
//     pan: "KLMNO5678V",
//   },
//   {
//     id: "344911",
//     name: "Yogesh Kumar K",
//     pan: "PQRST9012W",
//   },
//   {
//     id: "344912",
//     name: "Madhu D",
//     pan: "UVWXY3456X",
//   },

//   /* =======================================================
//      ADDITIONAL ROWS FROM YOUR SECOND SCREEN
//   ======================================================= */

//   {
//     id: "294643",
//     name: "Hindusena Varadarajula",
//     pan: "BSYPV8372D",
//   },
//   {
//     id: "294667",
//     name: "Akhil Reddy",
//     pan: "EPPP B7344J".replace(" ", ""),
//   },
//   {
//     id: "294662",
//     name: "Venkat Rathnam Ch",
//     pan: "EVCPR9948R",
//   },
//   {
//     id: "294642",
//     name: "JAYAKRISHNA KALLURI",
//     pan: "CDPPJ3148A",
//   },
//   {
//     id: "294649",
//     name: "Pranay Kumar Rayarao",
//     pan: "FFKPR2935M",
//   },
//   {
//     id: "294650",
//     name: "Venkata Ramana Kalaga",
//     pan: "ENPPK4370D",
//   },
//   {
//     id: "294651",
//     name: "Akshitha Naidu Yetukooru",
//     pan: "DJBPA5355P",
//   },
// ];

// /* =========================================================
//    BULK UPDATE TABS
//    ========================================================= */

// const tabs = [
//   {
//     label: "Statutory",
//     path: "statutory",
//   },
//   {
//     label: "Classification",
//     path: "classification",
//   },
//   {
//     label: "Authority",
//     path: "authority",
//   },
//   {
//     label: "Role",
//     path: "role",
//   },
//   {
//     label: "PAN Verification",
//     path: "pan-verification",
//   },
// ];

// /* =========================================================
//    PAGE
//    ========================================================= */

// export default function BulkUpdatePanVerificationPage() {
//   const { domain } = useParams<{ domain: string }>();

//   const basePath = `/${domain ?? ""}/admin/${BULK_UPDATE_SECTION_PATH}`;

//   const [search, setSearch] = useState("");
//   const [financialYear, setFinancialYear] =
//     useState("2026-2027");

//   const [showCount, setShowCount] =
//     useState("84");

//   const [showHistory, setShowHistory] =
//     useState(false);

//   const [showToast, setShowToast] =
//     useState(false);

//   /* =======================================================
//      FILTER EMPLOYEES
//   ======================================================= */

//   const filteredEmployees = useMemo(() => {
//     const value = search.trim().toLowerCase();

//     if (!value) {
//       return employees;
//     }

//     return employees.filter(
//       (employee) =>
//         employee.id
//           .toLowerCase()
//           .includes(value) ||
//         employee.name
//           .toLowerCase()
//           .includes(value) ||
//         employee.pan
//           .toLowerCase()
//           .includes(value)
//     );
//   }, [search]);

//   /* =======================================================
//      PAN VERIFY
//   ======================================================= */

//   const handlePanVerify = () => {
//     setShowToast(true);

//     window.setTimeout(() => {
//       setShowToast(false);
//     }, 4000);
//   };

//   /* =======================================================
//      RENDER
//   ======================================================= */

//   return (
//     <div className="min-h-screen w-full bg-[#f7f9fc] text-[#344054]">

//       {/* =====================================================
//           TOAST
//       ===================================================== */}

//       {showToast && (
//         <div
//           className="
//             fixed
//             left-1/2
//             top-[5px]
//             z-[10000]
//             flex
//             min-h-[46px]
//             w-[385px]
//             -translate-x-1/2
//             items-center
//             justify-between
//             rounded-md
//             border
//             border-[#f1caca]
//             bg-[#fff6f6]
//             px-4
//             shadow-[0_4px_15px_rgba(0,0,0,0.12)]
//           "
//         >
//           <div className="flex items-center gap-2">
//             <AlertCircle
//               size={18}
//               className="text-[#e56b6b]"
//             />

//             <span
//               className="
//                 text-[13px]
//                 font-medium
//                 text-[#6b6b6b]
//               "
//             >
//               TAN not available yet.
//               Please try again shortly
//             </span>
//           </div>

//           <button
//             type="button"
//             onClick={() => setShowToast(false)}
//             className="text-[#666] hover:text-[#222]"
//           >
//             <X size={17} />
//           </button>
//         </div>
//       )}

//       {/* =====================================================
//           TOP NAVIGATION
//       ===================================================== */}

//       <div className="px-2 pt-2 sm:px-4">
//         <div
//           className="
//             flex
//             h-[64px]
//             items-center
//             justify-between
//             rounded-md
//             border
//             border-[#edf0f3]
//             bg-white
//             px-5
//             shadow-[0_1px_3px_rgba(16,24,40,0.04)]
//           "
//         >
//           {/* TABS */}

//           <div
//             className="
//               flex
//               h-full
//               items-center
//               gap-9
//               overflow-x-auto
//               whitespace-nowrap
//               [scrollbar-width:none]
//               [&::-webkit-scrollbar]:hidden
//             "
//           >
//             {tabs.map((tab) => (
//               <NavLink
//                 key={tab.path}
//                 to={`${basePath}/${tab.path}`}
//                 className={({ isActive }) =>
//                   `
//                     relative
//                     flex
//                     h-full
//                     items-center
//                     px-1
//                     text-[15px]
//                     font-medium
//                     ${
//                       isActive
//                         ? "text-[#168ce0]"
//                         : "text-[#667085] hover:text-[#344054]"
//                     }
//                   `
//                 }
//               >
//                 {({ isActive }) => (
//                   <>
//                     {tab.label}

//                     {isActive && (
//                       <span
//                         className="
//                           absolute
//                           bottom-[10px]
//                           left-0
//                           right-0
//                           h-[2px]
//                           bg-[#168ce0]
//                         "
//                       />
//                     )}
//                   </>
//                 )}
//               </NavLink>
//             ))}
//           </div>

//           {/* SEARCH / ICONS */}

//           <div
//             className="
//               flex
//               shrink-0
//               items-center
//               gap-5
//             "
//           >
//             <div
//               className="
//                 relative
//                 hidden
//                 w-[175px]
//                 md:block
//               "
//             >
//               <Search
//                 size={17}
//                 className="
//                   absolute
//                   left-3
//                   top-1/2
//                   -translate-y-1/2
//                   text-[#98a2b3]
//                 "
//               />

//               <input
//                 type="text"
//                 value={search}
//                 onChange={(event) =>
//                   setSearch(event.target.value)
//                 }
//                 placeholder="Search..."
//                 className="
//                   h-[38px]
//                   w-full
//                   rounded-md
//                   border-0
//                   bg-[#f1f4f8]
//                   pl-9
//                   pr-3
//                   text-sm
//                   text-[#344054]
//                   outline-none
//                   placeholder:text-[#98a2b3]
//                 "
//               />
//             </div>

//             <button
//               type="button"
//               title="Export Excel"
//               className="
//                 text-[#4d9d61]
//                 hover:text-[#328149]
//               "
//             >
//               <FileSpreadsheet size={20} />
//             </button>

//             <button
//               type="button"
//               title="History"
//               onClick={() => setShowHistory(true)}
//               className="
//                 text-[#98a2b3]
//                 hover:text-[#475467]
//               "
//             >
//               <Clock size={20} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* =====================================================
//           CONTROL BAR
//       ===================================================== */}

//       <div className="px-2 sm:px-4">
//         <div
//           className="
//             mt-2
//             flex
//             min-h-[50px]
//             items-center
//             justify-end
//             gap-3
//             rounded-md
//             border
//             border-[#edf0f3]
//             bg-white
//             px-3
//           "
//         >
//           {/* FINANCIAL YEAR */}

//           <div className="relative">
//             <select
//               value={financialYear}
//               onChange={(event) =>
//                 setFinancialYear(event.target.value)
//               }
//               className="
//                 h-[38px]
//                 min-w-[140px]
//                 appearance-none
//                 rounded-md
//                 border
//                 border-[#d9e1e8]
//                 bg-white
//                 px-3
//                 pr-9
//                 text-[15px]
//                 text-[#344054]
//                 outline-none
//                 focus:border-[#2196e0]
//               "
//             >
//               <option value="2026-2027">
//                 2026-2027
//               </option>

//               <option value="2025-2026">
//                 2025-2026
//               </option>

//               <option value="2024-2025">
//                 2024-2025
//               </option>
//             </select>

//             <ChevronDown
//               size={15}
//               className="
//                 pointer-events-none
//                 absolute
//                 right-3
//                 top-1/2
//                 -translate-y-1/2
//                 text-[#667085]
//               "
//             />
//           </div>

//           {/* SHOW COUNT */}

//           <div className="relative">
//             <select
//               value={showCount}
//               onChange={(event) =>
//                 setShowCount(event.target.value)
//               }
//               className="
//                 h-[38px]
//                 min-w-[130px]
//                 appearance-none
//                 rounded-md
//                 border
//                 border-[#d9e1e8]
//                 bg-white
//                 px-3
//                 pr-16
//                 text-[15px]
//                 text-[#344054]
//                 outline-none
//               "
//             >
//               <option value="84">
//                 Show All
//               </option>

//               <option value="10">
//                 Show 10
//               </option>

//               <option value="20">
//                 Show 20
//               </option>

//               <option value="50">
//                 Show 50
//               </option>
//             </select>

//             <span
//               className="
//                 pointer-events-none
//                 absolute
//                 right-8
//                 top-1/2
//                 -translate-y-1/2
//                 text-[14px]
//                 text-[#667085]
//               "
//             >
//               {showCount}
//             </span>

//             <ChevronDown
//               size={14}
//               className="
//                 pointer-events-none
//                 absolute
//                 right-2
//                 top-1/2
//                 -translate-y-1/2
//                 text-[#667085]
//               "
//             />
//           </div>

//           {/* PAN VERIFY */}

//           <button
//             type="button"
//             onClick={handlePanVerify}
//             className="
//               flex
//               h-[38px]
//               items-center
//               gap-2
//               rounded-md
//               bg-[#2196e0]
//               px-5
//               text-[15px]
//               font-semibold
//               text-white
//               shadow-sm
//               transition
//               hover:bg-[#1688d1]
//             "
//           >
//             <Bookmark size={16} />
//             PAN Verify
//           </button>

//           {/* CHECK STATUS */}

//           <button
//             type="button"
//             onClick={() => setShowHistory(true)}
//             className="
//               h-[38px]
//               rounded-md
//               bg-[#2196e0]
//               px-5
//               text-[15px]
//               font-semibold
//               text-white
//               shadow-sm
//               transition
//               hover:bg-[#1688d1]
//             "
//           >
//             Check Status
//           </button>
//         </div>
//       </div>

//       {/* =====================================================
//           TABLE
//       ===================================================== */}

//       <div className="px-2 pb-6 sm:px-4">
//         <div className="mt-2">

//           {/* TABLE HEADER */}

//           <div
//             className="
//               grid
//               grid-cols-[70px_140px_minmax(230px,1fr)_150px_minmax(190px,1fr)_190px]
//               items-center
//               rounded-md
//               bg-[#d7ebfa]
//               px-4
//               py-[18px]
//               text-[14px]
//               font-semibold
//               text-[#344054]
//             "
//           >
//             <div>Sl. No.</div>

//             <div>Employee Id</div>

//             <div>Employee Name</div>

//             <div>PAN</div>

//             <div>Name from PAN</div>

//             <div>PAN Status</div>
//           </div>

//           {/* TABLE ROWS */}

//           <div className="mt-2 space-y-2">

//             {filteredEmployees.map(
//               (employee, index) => (
//                 <div
//                   key={employee.id}
//                   className="
//                     grid
//                     min-h-[60px]
//                     grid-cols-[70px_140px_minmax(230px,1fr)_150px_minmax(190px,1fr)_190px]
//                     items-center
//                     rounded-md
//                     border
//                     border-[#e8edf2]
//                     bg-white
//                     px-4
//                     text-[15px]
//                     text-[#344054]
//                     shadow-[0_1px_2px_rgba(16,24,40,0.03)]
//                   "
//                 >
//                   {/* SL NO */}

//                   <div>
//                     {index + 1}
//                   </div>

//                   {/* EMPLOYEE ID */}

//                   <div>
//                     {employee.id}
//                   </div>

//                   {/* EMPLOYEE NAME */}

//                   <div>
//                     <button
//                       type="button"
//                       className="
//                         rounded-full
//                         border
//                         border-[#b9def8]
//                         bg-[#eef8ff]
//                         px-3
//                         py-1
//                         text-left
//                         text-[14px]
//                         font-medium
//                         text-[#1684ce]
//                       "
//                     >
//                       {employee.name}
//                     </button>
//                   </div>

//                   {/* PAN */}

//                   <div>
//                     {employee.pan}
//                   </div>

//                   {/* NAME FROM PAN */}

//                   <div />

//                   {/* PAN STATUS */}

//                   <div className="flex justify-end">
//                     <button
//                       type="button"
//                       className="
//                         flex
//                         h-[34px]
//                         w-[180px]
//                         items-center
//                         justify-center
//                         rounded-md
//                         border
//                         border-[#d0d5dd]
//                         bg-white
//                         text-[14px]
//                         font-medium
//                         text-[#344054]
//                         transition
//                         hover:bg-[#f8fafc]
//                       "
//                     >
//                       PAN Not Verified
//                     </button>
//                   </div>
//                 </div>
//               )
//             )}

//             {filteredEmployees.length === 0 && (
//               <div
//                 className="
//                   rounded-md
//                   border
//                   border-[#e8edf2]
//                   bg-white
//                   py-12
//                   text-center
//                   text-sm
//                   text-[#667085]
//                 "
//               >
//                 No employees found
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* =====================================================
//           HISTORY MODAL
//       ===================================================== */}

//       {showHistory && (
//         <div
//           className="
//             fixed
//             inset-0
//             z-[9999]
//             flex
//             items-center
//             justify-center
//             bg-black/50
//             px-4
//           "
//         >
//           <div
//             className="
//               w-[750px]
//               max-w-full
//               overflow-hidden
//               rounded-md
//               border
//               border-[#d8dde5]
//               bg-white
//               shadow-[0_10px_35px_rgba(0,0,0,0.25)]
//             "
//           >
//             {/* TITLE */}

//             <div
//               className="
//                 flex
//                 h-[44px]
//                 items-center
//                 border-b
//                 border-[#e5e7eb]
//                 bg-white
//                 px-3
//               "
//             >
//               <h2
//                 className="
//                   text-[15px]
//                   font-semibold
//                   text-[#344054]
//                 "
//               >
//                 History
//               </h2>
//             </div>

//             {/* HEADER */}

//             <div
//               className="
//                 grid
//                 grid-cols-[1fr_1fr_1.5fr_1.3fr_1.3fr_0.8fr]
//                 items-center
//                 bg-[#d7ebfa]
//                 px-3
//                 py-4
//                 text-[13px]
//                 font-semibold
//                 text-[#344054]
//               "
//             >
//               <div>Token No</div>
//               <div>Status</div>
//               <div>Requested PAN Count</div>
//               <div>Submitted Date</div>
//               <div>Processed Date</div>
//               <div>Action</div>
//             </div>

//             {/* NO RECORDS */}

//             <div
//               className="
//                 flex
//                 h-[40px]
//                 items-center
//                 justify-center
//                 bg-white
//                 text-[13px]
//                 font-semibold
//                 text-[#475467]
//               "
//             >
//               No Records Found
//             </div>

//             {/* FOOTER */}

//             <div
//               className="
//                 flex
//                 h-[58px]
//                 items-center
//                 justify-end
//                 border-t
//                 border-[#edf0f3]
//                 bg-[#f8fafc]
//                 px-4
//               "
//             >
//               <button
//                 type="button"
//                 onClick={() => setShowHistory(false)}
//                 className="
//                   flex
//                   h-[36px]
//                   items-center
//                   gap-2
//                   rounded-md
//                   border
//                   border-[#d0d5dd]
//                   bg-white
//                   px-4
//                   text-[14px]
//                   font-medium
//                   text-[#475467]
//                   shadow-sm
//                   transition
//                   hover:bg-[#f9fafb]
//                 "
//               >
//                 <X size={15} />
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useMemo, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import {
  Search,
  ChevronDown,
  Clock,
  FileSpreadsheet,
  Bookmark,
  X,
  AlertCircle,
} from "lucide-react";

import { BULK_UPDATE_SECTION_PATH } from "../constants/bulkUpdate.constants";

/* =========================================================
   EMPLOYEE DATA
   ========================================================= */

const employees = [
  {
    id: "KTSI64211",
    name: "Sathwika Achugatla",
    pan: "PJWPS1643P",
  },
  {
    id: "KTSI64212",
    name: "Sireesha Yarrameneni",
    pan: "RWVPS5329N",
  },
  {
    id: "KTSI64219",
    name: "Ram Bhupal Reddy Sanki",
    pan: "FMOPR6816J",
  },
  {
    id: "284512",
    name: "Varalaxmi Gumudala",
    pan: "CLYPV8424J",
  },
  {
    id: "284513",
    name: "Nikhitha Narala",
    pan: "DLGPN8693Q",
  },
  {
    id: "284514",
    name: "Sreya Chaluvaadi",
    pan: "NDTPS5624D",
  },
  {
    id: "284519",
    name: "Rakesh Peddi",
    pan: "ABCDE1234F",
  },
  {
    id: "294621",
    name: "Rama Veeramanikanta Pusunuri",
    pan: "FGHIJ5678K",
  },
  {
    id: "294622",
    name: "Umar Sharief Shaik",
    pan: "LMNOP9012Q",
  },
  {
    id: "294623",
    name: "Tharun Nagarjunapu",
    pan: "QRSTU3456R",
  },
  {
    id: "294624",
    name: "Divyasree Taguru",
    pan: "VWXYZ7890S",
  },
  {
    id: "324833",
    name: "Aparna Karigam",
    pan: "ABCDE5678T",
  },
  {
    id: "334911",
    name: "Kavya N",
    pan: "FGHIJ1234U",
  },
  {
    id: "334912",
    name: "Daniel Raju Ravi",
    pan: "KLMNO5678V",
  },
  {
    id: "344911",
    name: "Yogesh Kumar K",
    pan: "PQRST9012W",
  },
  {
    id: "344912",
    name: "Madhu D",
    pan: "UVWXY3456X",
  },

  /* =======================================================
     ADDITIONAL ROWS FROM YOUR SECOND SCREEN
  ======================================================= */

  {
    id: "294643",
    name: "Hindusena Varadarajula",
    pan: "BSYPV8372D",
  },
  {
    id: "294667",
    name: "Akhil Reddy",
    pan: "EPPP B7344J".replace(" ", ""),
  },
  {
    id: "294662",
    name: "Venkat Rathnam Ch",
    pan: "EVCPR9948R",
  },
  {
    id: "294642",
    name: "JAYAKRISHNA KALLURI",
    pan: "CDPPJ3148A",
  },
  {
    id: "294649",
    name: "Pranay Kumar Rayarao",
    pan: "FFKPR2935M",
  },
  {
    id: "294650",
    name: "Venkata Ramana Kalaga",
    pan: "ENPPK4370D",
  },
  {
    id: "294651",
    name: "Akshitha Naidu Yetukooru",
    pan: "DJBPA5355P",
  },
];

/* =========================================================
   BULK UPDATE TABS
   ========================================================= */

const tabs = [
  {
    label: "Statutory",
    path: "statutory",
  },
  {
    label: "Classification",
    path: "classification",
  },
  {
    label: "Authority",
    path: "authority",
  },
  {
    label: "Role",
    path: "role",
  },
  {
    label: "PAN Verification",
    path: "pan-verification",
  },
];

/* =========================================================
   PAGE
   ========================================================= */

export default function BulkUpdatePanVerificationPage() {
  const { domain } = useParams<{ domain: string }>();

  const basePath = `/${domain ?? ""}/admin/${BULK_UPDATE_SECTION_PATH}`;

  const [search, setSearch] = useState("");
  const [financialYear, setFinancialYear] =
    useState("2026-2027");

  const [showCount, setShowCount] =
    useState("84");

  const [showHistory, setShowHistory] =
    useState(false);

  const [showToast, setShowToast] =
    useState(false);

  /* =======================================================
     FILTER EMPLOYEES
  ======================================================= */

  const filteredEmployees = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return employees;
    }

    return employees.filter(
      (employee) =>
        employee.id
          .toLowerCase()
          .includes(value) ||
        employee.name
          .toLowerCase()
          .includes(value) ||
        employee.pan
          .toLowerCase()
          .includes(value)
    );
  }, [search]);

  /* =======================================================
     PAN VERIFY
  ======================================================= */

  const handlePanVerify = () => {
    setShowToast(true);

    window.setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen w-full bg-[#f7f9fc] text-[#344054]">

      {/* =====================================================
          TOAST
      ===================================================== */}

      {showToast && (
        <div
          className="
            fixed
            left-1/2
            top-[5px]
            z-[10000]
            flex
            min-h-[46px]
            w-[min(385px,92vw)]
            -translate-x-1/2
            items-center
            justify-between
            rounded-md
            border
            border-[#f1caca]
            bg-[#fff6f6]
            px-4
            shadow-[0_4px_15px_rgba(0,0,0,0.12)]
          "
        >
          <div className="flex items-center gap-2">
            <AlertCircle
              size={18}
              className="text-[#e56b6b]"
            />

            <span
              className="
                text-[13px]
                font-medium
                text-[#6b6b6b]
              "
            >
              TAN not available yet.
              Please try again shortly
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="text-[#666] hover:text-[#222]"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <div className="px-2 pt-2 sm:px-4">
        <div
          className="
            flex
            h-[56px]
            items-center
            justify-between
            gap-2
            rounded-md
            border
            border-[#edf0f3]
            bg-white
            px-2
            shadow-[0_1px_3px_rgba(16,24,40,0.04)]
            sm:h-[64px]
            sm:gap-4
            sm:px-5
          "
        >
          {/* TABS */}

          <div
            className="
              flex
              h-full
              min-w-0
              items-center
              gap-5
              overflow-x-auto
              whitespace-nowrap
              [scrollbar-width:none]
              sm:gap-9
              [&::-webkit-scrollbar]:hidden
            "
          >
            {tabs.map((tab) => (
              <NavLink
                key={tab.path}
                to={`${basePath}/${tab.path}`}
                className={({ isActive }) =>
                  `
                    relative
                    flex
                    h-full
                    items-center
                    px-1
                    text-[15px]
                    font-medium
                    ${
                      isActive
                        ? "text-[#168ce0]"
                        : "text-[#667085] hover:text-[#344054]"
                    }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    {tab.label}

                    {isActive && (
                      <span
                        className="
                          absolute
                          bottom-[10px]
                          left-0
                          right-0
                          h-[2px]
                          bg-[#168ce0]
                        "
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* SEARCH / ICONS */}

          <div
            className="
              flex
              shrink-0
              items-center
              gap-3
              sm:gap-5
            "
          >
            <div
              className="
                relative
                hidden
                w-[175px]
                md:block
              "
            >
              <Search
                size={17}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-[#98a2b3]
                "
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search..."
                className="
                  h-[38px]
                  w-full
                  rounded-md
                  border-0
                  bg-[#f1f4f8]
                  pl-9
                  pr-3
                  text-sm
                  text-[#344054]
                  outline-none
                  placeholder:text-[#98a2b3]
                "
              />
            </div>

            <button
              type="button"
              title="Export Excel"
              className="
                text-[#4d9d61]
                hover:text-[#328149]
              "
            >
              <FileSpreadsheet size={20} />
            </button>

            <button
              type="button"
              title="History"
              onClick={() => setShowHistory(true)}
              className="
                text-[#98a2b3]
                hover:text-[#475467]
              "
            >
              <Clock size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTROL BAR
      ===================================================== */}

      <div className="px-2 sm:px-4">
        <div
          className="
            mt-2
            flex
            min-h-[50px]
            flex-wrap
            items-center
            justify-end
            gap-2
            rounded-md
            border
            border-[#edf0f3]
            bg-white
            px-3
            py-2
            sm:flex-nowrap
            sm:gap-3
            sm:py-0
          "
        >
          {/* FINANCIAL YEAR */}

          <div className="relative">
            <select
              value={financialYear}
              onChange={(event) =>
                setFinancialYear(event.target.value)
              }
              className="
                h-[38px]
                min-w-[140px]
                appearance-none
                rounded-md
                border
                border-[#d9e1e8]
                bg-white
                px-3
                pr-9
                text-[15px]
                text-[#344054]
                outline-none
                focus:border-[#2196e0]
              "
            >
              <option value="2026-2027">
                2026-2027
              </option>

              <option value="2025-2026">
                2025-2026
              </option>

              <option value="2024-2025">
                2024-2025
              </option>
            </select>

            <ChevronDown
              size={15}
              className="
                pointer-events-none
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                text-[#667085]
              "
            />
          </div>

          {/* SHOW COUNT */}

          <div className="relative">
            <select
              value={showCount}
              onChange={(event) =>
                setShowCount(event.target.value)
              }
              className="
                h-[38px]
                min-w-[130px]
                appearance-none
                rounded-md
                border
                border-[#d9e1e8]
                bg-white
                px-3
                pr-16
                text-[15px]
                text-[#344054]
                outline-none
              "
            >
              <option value="84">
                Show All
              </option>

              <option value="10">
                Show 10
              </option>

              <option value="20">
                Show 20
              </option>

              <option value="50">
                Show 50
              </option>
            </select>

            <span
              className="
                pointer-events-none
                absolute
                right-8
                top-1/2
                -translate-y-1/2
                text-[14px]
                text-[#667085]
              "
            >
              {showCount}
            </span>

            <ChevronDown
              size={14}
              className="
                pointer-events-none
                absolute
                right-2
                top-1/2
                -translate-y-1/2
                text-[#667085]
              "
            />
          </div>

          {/* PAN VERIFY */}

          <button
            type="button"
            onClick={handlePanVerify}
            className="
              flex
              h-[38px]
              items-center
              gap-2
              rounded-md
              bg-[#2196e0]
              px-5
              text-[15px]
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#1688d1]
            "
          >
            <Bookmark size={16} />
            PAN Verify
          </button>

          {/* CHECK STATUS */}

          <button
            type="button"
            onClick={() => setShowHistory(true)}
            className="
              h-[38px]
              rounded-md
              bg-[#2196e0]
              px-5
              text-[15px]
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-[#1688d1]
            "
          >
            Check Status
          </button>
        </div>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}

      <div className="px-2 pb-6 sm:px-4">
        <div className="mt-2 overflow-x-auto [scrollbar-width:thin]">
          <div className="min-w-[970px]">

            {/* TABLE HEADER */}

            <div
              className="
                grid
                grid-cols-[70px_140px_minmax(230px,1fr)_150px_minmax(190px,1fr)_190px]
                items-center
                rounded-md
                bg-[#d7ebfa]
                px-4
                py-[18px]
                text-[14px]
                font-semibold
                text-[#344054]
              "
            >
              <div>Sl. No.</div>

              <div>Employee Id</div>

              <div>Employee Name</div>

              <div>PAN</div>

              <div>Name from PAN</div>

              <div>PAN Status</div>
            </div>

            {/* TABLE ROWS */}

            <div className="mt-2 space-y-2">

              {filteredEmployees.map(
                (employee, index) => (
                  <div
                    key={employee.id}
                    className="
                      grid
                      min-h-[60px]
                      grid-cols-[70px_140px_minmax(230px,1fr)_150px_minmax(190px,1fr)_190px]
                      items-center
                      rounded-md
                      border
                      border-[#e8edf2]
                      bg-white
                      px-4
                      text-[15px]
                      text-[#344054]
                      shadow-[0_1px_2px_rgba(16,24,40,0.03)]
                    "
                  >
                    {/* SL NO */}

                    <div>
                      {index + 1}
                    </div>

                    {/* EMPLOYEE ID */}

                    <div>
                      {employee.id}
                    </div>

                    {/* EMPLOYEE NAME */}

                    <div>
                      <button
                        type="button"
                        className="
                          rounded-full
                          border
                          border-[#b9def8]
                          bg-[#eef8ff]
                          px-3
                          py-1
                          text-left
                          text-[14px]
                          font-medium
                          text-[#1684ce]
                        "
                      >
                        {employee.name}
                      </button>
                    </div>

                    {/* PAN */}

                    <div>
                      {employee.pan}
                    </div>

                    {/* NAME FROM PAN */}

                    <div />

                    {/* PAN STATUS */}

                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="
                          flex
                          h-[34px]
                          w-[180px]
                          items-center
                          justify-center
                          rounded-md
                          border
                          border-[#d0d5dd]
                          bg-white
                          text-[14px]
                          font-medium
                          text-[#344054]
                          transition
                          hover:bg-[#f8fafc]
                        "
                      >
                        PAN Not Verified
                      </button>
                    </div>
                  </div>
                )
              )}

              {filteredEmployees.length === 0 && (
                <div
                  className="
                    rounded-md
                    border
                    border-[#e8edf2]
                    bg-white
                    py-12
                    text-center
                    text-sm
                    text-[#667085]
                  "
                >
                  No employees found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          HISTORY MODAL
      ===================================================== */}

      {showHistory && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/50
            px-4
          "
        >
          <div
            className="
              w-[750px]
              max-w-full
              overflow-hidden
              rounded-md
              border
              border-[#d8dde5]
              bg-white
              shadow-[0_10px_35px_rgba(0,0,0,0.25)]
            "
          >
            {/* TITLE */}

            <div
              className="
                flex
                h-[44px]
                items-center
                border-b
                border-[#e5e7eb]
                bg-white
                px-3
              "
            >
              <h2
                className="
                  text-[15px]
                  font-semibold
                  text-[#344054]
                "
              >
                History
              </h2>
            </div>

            {/* HEADER + NO RECORDS (scrolls together on narrow screens) */}

            <div className="overflow-x-auto [scrollbar-width:thin]">
              <div className="min-w-[560px]">

                {/* HEADER */}

                <div
                  className="
                    grid
                    grid-cols-[1fr_1fr_1.5fr_1.3fr_1.3fr_0.8fr]
                    items-center
                    bg-[#d7ebfa]
                    px-3
                    py-4
                    text-[13px]
                    font-semibold
                    text-[#344054]
                  "
                >
                  <div>Token No</div>
                  <div>Status</div>
                  <div>Requested PAN Count</div>
                  <div>Submitted Date</div>
                  <div>Processed Date</div>
                  <div>Action</div>
                </div>

                {/* NO RECORDS */}

                <div
                  className="
                    flex
                    h-[40px]
                    items-center
                    justify-center
                    bg-white
                    text-[13px]
                    font-semibold
                    text-[#475467]
                  "
                >
                  No Records Found
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div
              className="
                flex
                h-[58px]
                items-center
                justify-end
                border-t
                border-[#edf0f3]
                bg-[#f8fafc]
                px-4
              "
            >
              <button
                type="button"
                onClick={() => setShowHistory(false)}
                className="
                  flex
                  h-[36px]
                  items-center
                  gap-2
                  rounded-md
                  border
                  border-[#d0d5dd]
                  bg-white
                  px-4
                  text-[14px]
                  font-medium
                  text-[#475467]
                  shadow-sm
                  transition
                  hover:bg-[#f9fafb]
                "
              >
                <X size={15} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
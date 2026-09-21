// import { useState } from "react";

// import {
//   ChevronDown,
//   ChevronLeft,
//   FileDown,
//   Filter,
//   MoreVertical,
//   Search,
//   X,
// } from "lucide-react";

// import { useNavigate } from "react-router-dom";

// /* =========================================================
//    MONTHLY PF REPORT DATA
//    ========================================================= */

// const monthlyReportData = [
//   {
//     slNo: 1,
//     empId: "294621",
//     pfNumber: "-",
//     uan: "102256232603",
//     name: "Rama Veera Manikanta Pusunuri",
//     employerPf: "15000.00",
//     employeePfEarnings: "21000.00",
//     employeeEpf: "2520.00",
//     pfVol: "0.00",
//     employerEpfDifference: "550.00",
//     pension: "-",
//   },
//   {
//     slNo: 2,
//     empId: "294622",
//     pfNumber: "-",
//     uan: "102015096127",
//     name: "Umar Sharief Shaik",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 3,
//     empId: "294623",
//     pfNumber: "-",
//     uan: "102338420795",
//     name: "Tharun Nagarjunapu",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 4,
//     empId: "294624",
//     pfNumber: "-",
//     uan: "102174501947",
//     name: "Divyasree Tarugu",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 5,
//     empId: "334912",
//     pfNumber: "-",
//     uan: "101483081741",
//     name: "Daniel Raju Ravi",
//     employerPf: "15000.00",
//     employeePfEarnings: "53034.00",
//     employeeEpf: "6364.00",
//     pfVol: "0.00",
//     employerEpfDifference: "5114.00",
//     pension: "-",
//   },
//   {
//     slNo: 6,
//     empId: "294626",
//     pfNumber: "-",
//     uan: "102338421282",
//     name: "Rajesh Reddy Thuti",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 7,
//     empId: "294632",
//     pfNumber: "-",
//     uan: "102338415769",
//     name: "Himasaiteja Tummala",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 8,
//     empId: "294639",
//     pfNumber: "-",
//     uan: "102338424388",
//     name: "Prathyusha Reddy",
//     employerPf: "15000.00",
//     employeePfEarnings: "21000.00",
//     employeeEpf: "2520.00",
//     pfVol: "0.00",
//     employerEpfDifference: "1270.00",
//     pension: "-",
//   },

//   /* Rows 9 and 10 are not clearly readable in the supplied
//      video/screenshots, so they are intentionally not invented. */

//   {
//     slNo: 11,
//     empId: "294639",
//     pfNumber: "-",
//     uan: "102338424388",
//     name: "Prathyusha Reddy",
//     employerPf: "15000.00",
//     employeePfEarnings: "21000.00",
//     employeeEpf: "2520.00",
//     pfVol: "0.00",
//     employerEpfDifference: "1270.00",
//     pension: "-",
//   },
//   {
//     slNo: 12,
//     empId: "294640",
//     pfNumber: "-",
//     uan: "101479234461",
//     name: "BHAGYARAJA AVURAPALLI",
//     employerPf: "15000.00",
//     employeePfEarnings: "55076.00",
//     employeeEpf: "6609.00",
//     pfVol: "0.00",
//     employerEpfDifference: "5359.00",
//     pension: "-",
//   },
//   {
//     slNo: 13,
//     empId: "294625",
//     pfNumber: "GRVSP00703260000010143",
//     uan: "101452100870",
//     name: "Naveen Penaganti",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 14,
//     empId: "294646",
//     pfNumber: "-",
//     uan: "102338422957",
//     name: "Revanth Reddy Polam",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 15,
//     empId: "294651",
//     pfNumber: "-",
//     uan: "102338419870",
//     name: "Saran Guntur",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 16,
//     empId: "294655",
//     pfNumber: "-",
//     uan: "102338421984",
//     name: "Veera Reddy Chinthapalli",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 17,
//     empId: "294654",
//     pfNumber: "-",
//     uan: "102249320034",
//     name: "Jagadeeshwar Chary Vadla",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 18,
//     empId: "294653",
//     pfNumber: "-",
//     uan: "102338416159",
//     name: "PONNAPU REDDY JEEVANI",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 19,
//     empId: "294662",
//     pfNumber: "-",
//     uan: "102339348815",
//     name: "Venkat Rathnam Ch",
//     employerPf: "15000.00",
//     employeePfEarnings: "31104.00",
//     employeeEpf: "3732.00",
//     pfVol: "0.00",
//     employerEpfDifference: "2482.00",
//     pension: "-",
//   },
//   {
//     slNo: 20,
//     empId: "294642",
//     pfNumber: "-",
//     uan: "102339290503",
//     name: "JAYAKRISHNA KALLURI",
//     employerPf: "15000.00",
//     employeePfEarnings: "19197.00",
//     employeeEpf: "2304.00",
//     pfVol: "0.00",
//     employerEpfDifference: "1054.00",
//     pension: "-",
//   },
//   {
//     slNo: 21,
//     empId: "294661",
//     pfNumber: "-",
//     uan: "102341141838",
//     name: "Naidu Yetukooru",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 22,
//     empId: "294659",
//     pfNumber: "-",
//     uan: "102288071152",
//     name: "Kavya M",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 23,
//     empId: "294663",
//     pfNumber: "-",
//     uan: "102338413454",
//     name: "Sriram Preetham Kalwa",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 24,
//     empId: "294669",
//     pfNumber: "PYKRP309105100000010013",
//     uan: "102160154461",
//     name: "Konidela Revanth Kumar",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 25,
//     empId: "294671",
//     pfNumber: "-",
//     uan: "102338424181",
//     name: "Villuri Vivek",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },

//   /* Additional records clearly visible later in the video */

//   {
//     slNo: 33,
//     empId: "294691",
//     pfNumber: "-",
//     uan: "102144254373",
//     name: "INALA T V V SATYA NAGA SAI PRAVALLICA",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 34,
//     empId: "294674",
//     pfNumber: "-",
//     uan: "102338463594",
//     name: "Srinivas Kotaru",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 35,
//     empId: "294680",
//     pfNumber: "-",
//     uan: "102338416657",
//     name: "Dhanush Kumar Nizampatnam",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 36,
//     empId: "294647",
//     pfNumber: "-",
//     uan: "101998160482",
//     name: "Vadia Shrishta",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 37,
//     empId: "294673",
//     pfNumber: "-",
//     uan: "102358445163",
//     name: "Siddala Suresh",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },

//   {
//     slNo: 46,
//     empId: "294677",
//     pfNumber: "-",
//     uan: "102338460775",
//     name: "Murali Krishna Puta",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 47,
//     empId: "294685",
//     pfNumber: "-",
//     uan: "101919260477",
//     name: "Marati Sai Teja",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 48,
//     empId: "294705",
//     pfNumber: "-",
//     uan: "102348959324",
//     name: "Novah Macharla",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 49,
//     empId: "294712",
//     pfNumber: "-",
//     uan: "102351254245",
//     name: "Santhoshini Kanuri",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 50,
//     empId: "294689",
//     pfNumber: "-",
//     uan: "102259596417",
//     name: "Leela Sandeep Jogi",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },

//   {
//     slNo: 75,
//     empId: "294746",
//     pfNumber: "-",
//     uan: "102358556411",
//     name: "Madhu Mohan Gummula",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 76,
//     empId: "294755",
//     pfNumber: "-",
//     uan: "102267393155",
//     name: "Reddy Abhishek Nayani",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
//   {
//     slNo: 77,
//     empId: "294747",
//     pfNumber: "-",
//     uan: "101735152127",
//     name: "Yuvasree Mallakka",
//     employerPf: "15000.00",
//     employeePfEarnings: "15400.00",
//     employeeEpf: "1848.00",
//     pfVol: "0.00",
//     employerEpfDifference: "598.00",
//     pension: "-",
//   },
//   {
//     slNo: 78,
//     empId: "294729",
//     pfNumber: "-",
//     uan: "102338414181",
//     name: "Sri Ram Satyendra",
//     employerPf: "12600.00",
//     employeePfEarnings: "12600.00",
//     employeeEpf: "1512.00",
//     pfVol: "0.00",
//     employerEpfDifference: "462.00",
//     pension: "-",
//   },
// ];

// /* =========================================================
//    PAGE
//    ========================================================= */

// export default function PFMonthlyReportPage() {
//   const navigate = useNavigate();

//   const [pfGroupOpen, setPfGroupOpen] = useState(false);
//   const [selectedPFGroup, setSelectedPFGroup] = useState("");

//   return (
//     <div className="min-h-screen w-full bg-[#f3f6fb] p-2 sm:p-3">

//       {/* =====================================================
//           TOP REPORT TABS
//       ===================================================== */}

//       <div className="rounded-xl border-2 border-[#d8b2a5] bg-[#fff8f5] px-3 py-2 shadow-none">
//         <div className="flex min-h-[54px] items-center gap-3 sm:gap-4">

//           <button
//             type="button"
//             className="relative flex h-[38px] items-center rounded-lg border border-[#c89584] bg-white px-5 text-[15px] font-semibold text-[#8c5a4d] shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
//           >
//             PF Report
//             <span className="hidden" />
//           </button>

//           <button
//             type="button"
//             className="flex h-[38px] items-center rounded-lg border border-[#ded9d6] bg-white px-5 text-[15px] font-medium text-[#4f4a47] shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
//           >
//             ESI Report
//           </button>

//           <button
//             type="button"
//             className="flex h-[38px] items-center rounded-lg border border-[#ded9d6] bg-white px-5 text-[15px] font-medium text-[#4f4a47] shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
//           >
//             LWF Report
//           </button>

//           <button
//             type="button"
//             className="flex h-[38px] items-center rounded-lg border border-[#ded9d6] bg-white px-5 text-[15px] font-medium text-[#4f4a47] shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
//           >
//             PT Report
//           </button>

//           <div className="ml-auto flex items-center gap-7">

//             <button
//               type="button"
//               className="text-[#268c3c]"
//               title="Export"
//             >
//               <FileDown size={24} />
//             </button>

//             <button
//               type="button"
//               className="text-[#8c7c75]"
//               title="Filter"
//             >
//               <Filter size={23} />
//             </button>

//             <button
//               type="button"
//               className="text-[#8c7c75]"
//               title="History"
//             >
//               <svg
//                 width="25"
//                 height="25"
//                 viewBox="0 0 25 25"
//                 fill="none"
//               >
//                 <circle
//                   cx="12.5"
//                   cy="12.5"
//                   r="9"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                 />

//                 <path
//                   d="M12.5 7V12.5L16 15"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                 />
//               </svg>
//             </button>

//           </div>
//         </div>
//       </div>


//       {/* =====================================================
//           REPORT HEADER
//       ===================================================== */}

//       <div className="mt-3 rounded-xl border border-[#dedad8] bg-white px-4 py-2 shadow-[0_1px_5px_rgba(0,0,0,0.06)]">

//         <div className="flex min-h-[58px] flex-wrap items-center gap-4">

//           <h1 className="inline-block border-b-[3px] border-[#c89584] pb-2 text-[19px] font-semibold text-[#8c5a4d]">
//             Monthly Report
//           </h1>

//           <button
//             type="button"
//             onClick={() => navigate(-1)}
//             className="order-2 ml-auto flex h-12 items-center gap-2 rounded-lg border border-[#c9c4c1] bg-white px-5 text-base font-medium text-[#555555]"
//           >
//             <ChevronLeft size={21} />
//             <span>Back</span>
//           </button>

//           <div className="order-3 flex flex-wrap items-center gap-3">

//             <button
//               type="button"
//               className="flex h-12 min-w-[185px] items-center justify-between rounded-lg bg-[#f5f3f2] px-5 text-base font-medium text-[#444444]"
//             >
//               <span>Sep/2026</span>
//               <ChevronDown size={18} />
//             </button>

//             {/* =================================================
//                 SELECT PF GROUP
//             ================================================== */}

//             <div className="relative">

//               <button
//                 type="button"
//                 onClick={() => setPfGroupOpen((previous) => !previous)}
//                 className={`flex h-12 min-w-[195px] items-center justify-between rounded-lg border bg-white px-4 text-base text-[#444444] ${
//                   pfGroupOpen
//                     ? "border-[#c89584]"
//                     : "border-[#d5d1cf]"
//                 }`}
//               >
//                 <span>
//                   {selectedPFGroup || "Select PF Group"}
//                 </span>

//                 <ChevronDown
//                   size={17}
//                   className={`transition-transform ${
//                     pfGroupOpen ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>

//               {pfGroupOpen && (
//                 <div className="absolute left-0 top-[55px] z-[100] w-[195px] rounded-lg bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.18)]">

//                   <button
//                     type="button"
//                     onClick={() => {
//                       setSelectedPFGroup(
//                         selectedPFGroup === "Default PF"
//                           ? ""
//                           : "Default PF"
//                       );
//                     }}
//                     className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-[16px] text-[#3f4249] hover:bg-[#faf5f2]"
//                   >
//                     <span
//                       className={`flex h-[19px] w-[19px] items-center justify-center rounded-[2px] border-2 ${
//                         selectedPFGroup === "Default PF"
//                           ? "border-[#c89584] bg-[#a87566]"
//                           : "border-[#8d939c] bg-white"
//                       }`}
//                     >
//                       {selectedPFGroup === "Default PF" && (
//                         <span className="text-[13px] font-bold text-white">
//                           ✓
//                         </span>
//                       )}
//                     </span>

//                     <span>Default PF</span>
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => {
//                       setSelectedPFGroup("");
//                       setPfGroupOpen(false);
//                     }}
//                     className="mt-3 flex h-[48px] w-full items-center justify-center gap-3 rounded-lg border border-[#cfc8c5] bg-white text-[16px] font-medium text-[#746b67] hover:bg-[#faf7f5]"
//                   >
//                     <span className="text-[20px]">≡</span>
//                     <span>Clear</span>
//                   </button>

//                 </div>
//               )}

//             </div>

//             <button
//               type="button"
//               className="flex h-12 items-center gap-3 rounded-lg bg-[#a87566] px-5 text-base font-medium text-white"
//             >
//               <Filter size={18} />
//               <span>Advance Filter</span>
//             </button>

//             <button
//               type="button"
//               className="flex h-12 w-12 items-center justify-center text-[#b85c67]"
//               title="PDF"
//             >
//               <span className="text-sm font-bold">
//                 PDF
//               </span>
//             </button>

//           </div>

//         </div>

//       </div>


//       {/* =====================================================
//           MAIN REPORT AREA
//           TARGET UI:
//           FILTER + TABLE ON LEFT
//           GRAND TOTAL ON RIGHT
//       ===================================================== */}

//       <div className="mt-3 flex w-full items-start gap-2">

//         {/* =====================================================
//             LEFT REPORT SECTION
//         ===================================================== */}

//         <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-[#dedad8] bg-white shadow-[0_1px_5px_rgba(0,0,0,0.06)]">

//           {/* =================================================
//               FILTER BAR
//           ================================================= */}

//           <div className="w-full overflow-x-auto border-b border-[#e3e0de]">

//             <div className="flex h-[92px] min-w-[1020px] items-center gap-5 border-b border-[#e3e0de] px-4">

//               <button
//                 type="button"
//                 className="shrink-0 text-[#9ba2b2]"
//               >
//                 <MoreVertical size={22} />
//               </button>

//               <button
//                 type="button"
//                 className="shrink-0 text-[#b85c67]"
//               >
//                 <X size={23} />
//               </button>

//               <div className="flex min-w-[150px] flex-1 items-center gap-3 text-[#b7bcc8]">

//                 <Search size={22} />

//                 <span className="whitespace-nowrap text-[15px]">
//                   Start Typing...
//                 </span>

//               </div>

//               <button
//                 type="button"
//                 className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[15px] font-medium text-[#555555]"
//               >
//                 <span className="text-xl">+</span>
//                 <span>Add Filter</span>
//               </button>

//               <button
//                 type="button"
//                 className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[15px] text-[#555555]"
//               >
//                 Query
//                 <ChevronDown size={15} />
//               </button>

//               <button
//                 type="button"
//                 className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[15px] text-[#555555]"
//               >
//                 Branch
//                 <ChevronDown size={15} />
//               </button>

//               <button
//                 type="button"
//                 className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[15px] text-[#555555]"
//               >
//                 Salary Structure
//                 <ChevronDown size={15} />
//               </button>

//               <button
//                 type="button"
//                 className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[15px] text-[#555555]"
//               >
//                 Leave
//                 <ChevronDown size={15} />
//               </button>

//               <button
//                 type="button"
//                 className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[15px] text-[#555555]"
//               >
//                 Attendance
//                 <ChevronDown size={15} />
//               </button>

//               <button
//                 type="button"
//                 className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[15px] text-[#555555]"
//               >
//                 Designation
//                 <ChevronDown size={15} />
//               </button>

//               <button
//                 type="button"
//                 className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[15px] text-[#555555]"
//               >
//                 Emp Status
//                 <ChevronDown size={15} />
//               </button>

//             </div>

//           </div>


//           {/* =================================================
//               TABLE
//           ================================================== */}

//           <div className="w-full overflow-auto">

//             <table className="w-full min-w-[1020px] table-fixed border-separate border-spacing-0">

//               <colgroup>
//                 <col className="w-[5%]" />
//                 <col className="w-[9%]" />
//                 <col className="w-[12%]" />
//                 <col className="w-[13%]" />
//                 <col className="w-[14%]" />
//                 <col className="w-[11%]" />
//                 <col className="w-[11%]" />
//                 <col className="w-[11%]" />
//                 <col className="w-[7%]" />
//                 <col className="w-[11%]" />
//                 <col className="w-[7%]" />
//               </colgroup>

//               {/* =================================================
//                   TABLE HEADER
//               ================================================== */}

//               <thead>

//                 <tr className="bg-[#f3f5f6] text-[#4a2f28]">

//                   <th className="px-2 py-3 text-left text-[15px] font-semibold">
//                     Sl.
//                     <br />
//                     No.
//                   </th>

//                   <th className="px-2 py-3 text-left text-[15px] font-semibold">
//                     Emp
//                     <br />
//                     ID
//                   </th>

//                   <th className="px-2 py-3 text-left text-[15px] font-semibold">
//                     PF Number
//                   </th>

//                   <th className="px-2 py-3 text-left text-[15px] font-semibold">
//                     UAN
//                   </th>

//                   <th className="px-2 py-3 text-left text-[15px] font-semibold">
//                     Name Of
//                     <br />
//                     Member
//                   </th>

//                   <th className="px-2 py-3 text-center text-[15px] font-semibold">
//                     Employer
//                     <br />
//                     PF
//                     <br />
//                     contribution
//                   </th>

//                   <th className="px-2 py-3 text-center text-[15px] font-semibold">
//                     Employee
//                     <br />
//                     PF
//                     <br />
//                     Earnings
//                   </th>

//                   <th className="px-2 py-3 text-center text-[15px] font-semibold">
//                     Employee
//                     <br />
//                     EPF
//                     <br />
//                     contribution
//                   </th>

//                   <th className="px-2 py-3 text-center text-[15px] font-semibold">
//                     PF
//                     <br />
//                     Vol.
//                   </th>

//                   <th className="px-2 py-3 text-center text-[15px] font-semibold">
//                     Employer
//                     <br />
//                     EPF
//                     <br />
//                     Difference
//                   </th>

//                   <th className="px-2 py-3 text-center text-[15px] font-semibold">
//                     Pension
//                   </th>

//                 </tr>

//               </thead>


//               {/* =================================================
//                   TABLE DATA
//               ================================================== */}

//               <tbody>

//                 {monthlyReportData.map((employee) => (

//                   <tr
//                     key={`${employee.slNo}-${employee.empId}`}
//                     className="h-[74px] bg-white"
//                   >

//                     <td className="border-b-[6px] border-[#f0eeee] px-2 py-3 text-[14px] text-[#342c29]">
//                       {employee.slNo}
//                     </td>

//                     <td className="border-b-[6px] border-[#f0eeee] px-2 py-3 text-[14px] text-[#342c29]">
//                       {employee.empId}
//                     </td>

//                     <td className="border-b-[6px] border-[#f0eeee] px-2 py-3 text-[14px] text-[#342c29]">
//                       {employee.pfNumber}
//                     </td>

//                     <td className="border-b-[6px] border-[#f0eeee] px-2 py-3 text-[14px] text-[#342c29]">
//                       {employee.uan}
//                     </td>

//                     <td className="border-b-[6px] border-[#f0eeee] px-2 py-3 text-[14px] leading-7 text-[#342c29]">
//                       {employee.name}
//                     </td>

//                     <td className="border-b-[6px] border-[#f0eeee] px-2 py-3 text-center text-[14px] text-[#342c29]">
//                       {employee.employerPf}
//                     </td>

//                     <td className="border-b-[6px] border-[#f0eeee] px-2 py-3 text-center text-[14px] text-[#342c29]">
//                       {employee.employeePfEarnings}
//                     </td>

//                     <td className="border-b-[6px] border-[#f0eeee] px-2 py-3 text-center text-[14px] text-[#342c29]">
//                       {employee.employeeEpf}
//                     </td>

//                     <td className="border-b-[6px] border-[#f0eeee] px-2 py-3 text-center text-[14px] text-[#342c29]">
//                       {employee.pfVol}
//                     </td>

//                     <td className="border-b-[6px] border-[#f0eeee] px-2 py-3 text-center text-[14px] text-[#342c29]">
//                       {employee.employerEpfDifference}
//                     </td>

//                     <td className="border-b-[6px] border-[#f0eeee] px-2 py-3 text-center text-[14px] text-[#342c29]">
//                       {employee.pension}
//                     </td>

//                   </tr>

//                 ))}

//               </tbody>

//             </table>

//           </div>

//         </div>


//         {/* =====================================================
//             CALCULATION ON GRAND TOTAL
//         ===================================================== */}

//         <div className="w-[350px] shrink-0 rounded-xl border border-[#d8b2a5] bg-[#fff8f5] px-5 py-4 shadow-[0_1px_5px_rgba(0,0,0,0.05)]">

//           <h2 className="border-b border-[#e5d7d1] pb-4 text-center text-[18px] font-semibold text-[#111827]">
//             Calculation On Grand Total
//           </h2>

//           <div className="mt-4 space-y-4 text-[14px] text-[#342c29]">

//             <div className="flex items-center justify-between gap-3">
//               <span className="whitespace-nowrap">
//                 EPF+PF VOL+EPF Diff(Acc01)
//               </span>

//               <span className="shrink-0 font-medium">
//                 183628
//               </span>
//             </div>

//             <div className="flex items-center justify-between gap-3">
//               <span className="whitespace-nowrap">
//                 0.5% Of PF Earning(Acc02)
//               </span>

//               <span className="shrink-0 font-medium">
//                 5580
//               </span>
//             </div>

//             <div className="flex items-center justify-between gap-3">
//               <span className="whitespace-nowrap">
//                 Total Pension Fund(Acc10)
//               </span>

//               <span className="shrink-0 font-medium">
//                 83500
//               </span>
//             </div>

//             <div className="flex items-center justify-between gap-3">
//               <span className="whitespace-nowrap">
//                 EDLI Wages*0.5%(Acc21)
//               </span>

//               <span className="shrink-0 font-medium">
//                 5010
//               </span>
//             </div>

//             <div className="mt-7 flex items-center justify-between border-t border-[#e5d7d1] pt-5 text-[16px] font-semibold">
//               <span>
//                 TOTAL
//               </span>

//               <span>
//                 277718
//               </span>
//             </div>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }



import { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  FileDown,
  Filter,
  MoreVertical,
  Search,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { usePFMonthlyReport } from "../hooks/useStatutoryReport";
// import StatutoryReportNavbar from "../components/StatutoryReportNavbar";

export default function PFMonthlyReportPage() {
  const navigate = useNavigate();

  const [pfGroupOpen, setPfGroupOpen] = useState(false);
  const [selectedPFGroup, setSelectedPFGroup] = useState("");

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = usePFMonthlyReport({
    companyId: 1,
    year: 2026,
    month: 9,
    branchId: 1,
  });

  console.log("PF Monthly Report:", data);
  console.log("PF Monthly Report Error:", error);

  /*
   * Keep API loading/error handling.
   * The report UI is displayed after the API request completes.
   */

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f3f6fb]">
        <div className="rounded-xl bg-white px-8 py-6 text-center shadow">
          <p className="text-[16px] font-medium text-[#555555]">
            Loading PF Monthly Report...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f3f6fb]">
        <div className="rounded-xl bg-white px-8 py-6 text-center shadow">
          <p className="mb-4 text-[16px] font-medium text-red-600">
            Failed to load PF monthly report.
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-[#a87566] px-5 py-2 text-sm font-medium text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /*
   * API data can be inspected here without breaking
   * the existing report UI.
   */
  console.log("PF API data:", data);

  return (
    <div className="min-h-screen w-full bg-[#f3f6fb] p-2 sm:p-3">
      {/* =====================================================
          COMMON STATUTORY REPORT NAVBAR
      ===================================================== */}

      {/* <StatutoryReportNavbar /> */}

      {/* =====================================================
          REPORT HEADER
      ===================================================== */}

      <div className="mt-3 rounded-xl border border-[#dedad8] bg-white px-4 py-2 shadow-[0_1px_5px_rgba(0,0,0,0.06)]">
        <div className="flex min-h-[58px] flex-wrap items-center gap-4">
          <h1 className="inline-block border-b-[3px] border-[#c89584] pb-2 text-[19px] font-semibold text-[#8c5a4d]">
            Monthly Report
          </h1>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="order-2 ml-auto flex h-12 items-center gap-2 rounded-lg border border-[#c9c4c1] bg-white px-5 text-base font-medium text-[#555555]"
          >
            <ChevronLeft size={21} />
            <span>Back</span>
          </button>

          <div className="order-3 flex flex-wrap items-center gap-3">
            {/* MONTH */}

            <button
              type="button"
              className="flex h-12 min-w-[185px] items-center justify-between rounded-lg bg-[#f5f3f2] px-5 text-base font-medium text-[#444444]"
            >
              <span>Sep/2026</span>
              <ChevronDown size={18} />
            </button>

            {/* SELECT PF GROUP */}

            <div className="relative">
              <button
                type="button"
                onClick={() => setPfGroupOpen((previous) => !previous)}
                className={`flex h-12 min-w-[195px] items-center justify-between rounded-lg border bg-white px-4 text-base text-[#444444] ${
                  pfGroupOpen
                    ? "border-[#c89584]"
                    : "border-[#d5d1cf]"
                }`}
              >
                <span>
                  {selectedPFGroup || "Select PF Group"}
                </span>

                <ChevronDown
                  size={17}
                  className={`transition-transform ${
                    pfGroupOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {pfGroupOpen && (
                <div className="absolute left-0 top-[55px] z-[100] w-[195px] rounded-lg bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.18)]">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPFGroup(
                        selectedPFGroup === "Default PF"
                          ? ""
                          : "Default PF",
                      );
                    }}
                    className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-[16px] text-[#3f4249] hover:bg-[#faf5f2]"
                  >
                    <span
                      className={`flex h-[19px] w-[19px] items-center justify-center rounded-[2px] border-2 ${
                        selectedPFGroup === "Default PF"
                          ? "border-[#c89584] bg-[#a87566]"
                          : "border-[#8d939c] bg-white"
                      }`}
                    >
                      {selectedPFGroup === "Default PF" && (
                        <span className="text-[13px] font-bold text-white">
                          ✓
                        </span>
                      )}
                    </span>

                    <span>Default PF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPFGroup("");
                      setPfGroupOpen(false);
                    }}
                    className="mt-3 flex h-[48px] w-full items-center justify-center gap-3 rounded-lg border border-[#cfc8c5] bg-white text-[16px] font-medium text-[#746b67] hover:bg-[#faf7f5]"
                  >
                    <span className="text-[20px]">≡</span>
                    <span>Clear</span>
                  </button>
                </div>
              )}
            </div>

            {/* ADVANCE FILTER */}

            <button
              type="button"
              className="flex h-12 items-center gap-3 rounded-lg bg-[#a87566] px-5 text-base font-medium text-white"
            >
              <Filter size={18} />
              <span>Advance Filter</span>
            </button>

            {/* PDF */}

            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center text-[#b85c67]"
              title="PDF"
            >
              <span className="text-sm font-bold">PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN REPORT AREA
      ===================================================== */}

      <div className="mt-3 flex w-full items-start gap-2">
        {/* =====================================================
            LEFT REPORT SECTION
        ===================================================== */}

        <div className="min-w-0 flex-1 overflow-hidden rounded-xl border border-[#dedad8] bg-white shadow-[0_1px_5px_rgba(0,0,0,0.06)]">
          {/* =================================================
              FILTER BAR
          ================================================== */}

          <div className="w-full overflow-x-auto border-b border-[#e3e0de]">
            <div className="flex h-[92px] min-w-[1020px] items-center gap-5 border-b border-[#e3e0de] px-4">
              <button
                type="button"
                className="shrink-0 text-[#9ba2b2]"
              >
                <MoreVertical size={22} />
              </button>

              <button
                type="button"
                className="shrink-0 text-[#b85c67]"
              >
                <X size={23} />
              </button>

              <div className="flex min-w-[150px] flex-1 items-center gap-3 text-[#b7bcc8]">
                <Search size={22} />

                <span className="whitespace-nowrap text-[15px]">
                  Start Typing...
                </span>
              </div>

              <button
                type="button"
                className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[15px] font-medium text-[#555555]"
              >
                <span className="text-xl">+</span>
                <span>Add Filter</span>
              </button>

              <button
                type="button"
                className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[15px] text-[#555555]"
              >
                Query
                <ChevronDown size={15} />
              </button>

              <button
                type="button"
                className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[15px] text-[#555555]"
              >
                Branch
                <ChevronDown size={15} />
              </button>

              <button
                type="button"
                className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[15px] text-[#555555]"
              >
                Salary Structure
                <ChevronDown size={15} />
              </button>

              <button
                type="button"
                className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[15px] text-[#555555]"
              >
                Leave
                <ChevronDown size={15} />
              </button>

              <button
                type="button"
                className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[15px] text-[#555555]"
              >
                Attendance
                <ChevronDown size={15} />
              </button>

              <button
                type="button"
                className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[15px] text-[#555555]"
              >
                Designation
                <ChevronDown size={15} />
              </button>

              <button
                type="button"
                className="flex shrink-0 items-center gap-1 whitespace-nowrap text-[15px] text-[#555555]"
              >
                Emp Status
                <ChevronDown size={15} />
              </button>
            </div>
          </div>

          {/* =================================================
              API RESPONSE
          ================================================== */}

          <div className="w-full overflow-auto">
            <table className="w-full min-w-[1020px] table-fixed border-separate border-spacing-0">
              <colgroup>
                <col className="w-[5%]" />
                <col className="w-[9%]" />
                <col className="w-[12%]" />
                <col className="w-[13%]" />
                <col className="w-[14%]" />
                <col className="w-[11%]" />
                <col className="w-[11%]" />
                <col className="w-[11%]" />
                <col className="w-[7%]" />
                <col className="w-[11%]" />
                <col className="w-[7%]" />
              </colgroup>

              <thead>
                <tr className="bg-[#f3f5f6] text-[#4a2f28]">
                  <th className="px-2 py-3 text-left text-[15px] font-semibold">
                    Sl.
                    <br />
                    No.
                  </th>

                  <th className="px-2 py-3 text-left text-[15px] font-semibold">
                    Emp
                    <br />
                    ID
                  </th>

                  <th className="px-2 py-3 text-left text-[15px] font-semibold">
                    PF Number
                  </th>

                  <th className="px-2 py-3 text-left text-[15px] font-semibold">
                    UAN
                  </th>

                  <th className="px-2 py-3 text-left text-[15px] font-semibold">
                    Name Of
                    <br />
                    Member
                  </th>

                  <th className="px-2 py-3 text-center text-[15px] font-semibold">
                    Employer
                    <br />
                    PF
                    <br />
                    contribution
                  </th>

                  <th className="px-2 py-3 text-center text-[15px] font-semibold">
                    Employee
                    <br />
                    PF
                    <br />
                    Earnings
                  </th>

                  <th className="px-2 py-3 text-center text-[15px] font-semibold">
                    Employee
                    <br />
                    EPF
                    <br />
                    contribution
                  </th>

                  <th className="px-2 py-3 text-center text-[15px] font-semibold">
                    PF
                    <br />
                    Vol.
                  </th>

                  <th className="px-2 py-3 text-center text-[15px] font-semibold">
                    Employer
                    <br />
                    EPF
                    <br />
                    Difference
                  </th>

                  <th className="px-2 py-3 text-center text-[15px] font-semibold">
                    Pension
                  </th>
                </tr>
              </thead>

              <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                  data.map((employee: any, index: number) => (
                    <tr
                      key={
                        employee.id ??
                        employee.empId ??
                        `${index}`
                      }
                      className="h-[74px] bg-white"
                    >
                      <td className="border-b-[6px] border-[#f0eeee] px-2 py-3 text-[14px] text-[#342c29]">
                        {employee.slNo ?? index + 1}
                      </td>

                      <td className="border-b-[6px] border-[#f0eeee] px-2 py-3 text-[14px] text-[#342c29]">
                        {employee.empId ?? "-"}
                      </td>

                      <td className="border-b-[6px] border-[#f0eeee] px-2 py-3 text-[14px] text-[#342c29]">
                        {employee.pfNumber ?? "-"}
                      </td>

                      <td className="border-b-[6px] border-[#f0eeee] px-2 py-3 text-[14px] text-[#342c29]">
                        {employee.uan ?? "-"}
                      </td>

                      <td className="border-b-[6px] border-[#f0eeee] px-2 py-3 text-[14px] leading-7 text-[#342c29]">
                        {employee.name ??
                          employee.employeeName ??
                          "-"}
                      </td>

                      <td className="border-b-[6px] border-[#f0eeee] px-2 py-3 text-center text-[14px] text-[#342c29]">
                        {employee.employerPf ??
                          employee.employerPF ??
                          "-"}
                      </td>

                      <td className="border-b-[6px] border-[#f0eeee] px-2 py-3 text-center text-[14px] text-[#342c29]">
                        {employee.employeePfEarnings ??
                          employee.employeePFEarnings ??
                          "-"}
                      </td>

                      <td className="border-b-[6px] border-[#f0eeee] px-2 py-3 text-center text-[14px] text-[#342c29]">
                        {employee.employeeEpf ??
                          employee.employeeEPF ??
                          "-"}
                      </td>

                      <td className="border-b-[6px] border-[#f0eeee] px-2 py-3 text-center text-[14px] text-[#342c29]">
                        {employee.pfVol ?? "-"}
                      </td>

                      <td className="border-b-[6px] border-[#f0eeee] px-2 py-3 text-center text-[14px] text-[#342c29]">
                        {employee.employerEpfDifference ??
                          employee.employerEPFDifference ??
                          "-"}
                      </td>

                      <td className="border-b-[6px] border-[#f0eeee] px-2 py-3 text-center text-[14px] text-[#342c29]">
                        {employee.pension ?? "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={11}
                      className="px-5 py-12 text-center text-[15px] text-[#777777]"
                    >
                      {isFetching
                        ? "Loading report data..."
                        : "No PF monthly report data found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* =====================================================
            GRAND TOTAL
        ===================================================== */}

        <div className="hidden w-[350px] shrink-0 rounded-xl border border-[#d8b2a5] bg-[#fff8f5] px-5 py-4 shadow-[0_1px_5px_rgba(0,0,0,0.05)] xl:block">
          <h2 className="border-b border-[#e5d7d1] pb-4 text-center text-[18px] font-semibold text-[#111827]">
            Calculation On Grand Total
          </h2>

          <div className="mt-4 space-y-4 text-[14px] text-[#342c29]">
            <div className="flex items-center justify-between gap-3">
              <span className="whitespace-nowrap">
                EPF+PF VOL+EPF Diff(Acc01)
              </span>

              <span className="shrink-0 font-medium">
                183628
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="whitespace-nowrap">
                0.5% Of PF Earning(Acc02)
              </span>

              <span className="shrink-0 font-medium">
                5580
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="whitespace-nowrap">
                Total Pension Fund(Acc10)
              </span>

              <span className="shrink-0 font-medium">
                83500
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="whitespace-nowrap">
                EDLI Wages*0.5%(Acc21)
              </span>

              <span className="shrink-0 font-medium">
                5010
              </span>
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-[#e5d7d1] pt-5 text-[16px] font-semibold">
              <span>TOTAL</span>

              <span>277718</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
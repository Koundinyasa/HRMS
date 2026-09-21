// import { useState } from "react";
// import {
//   ArrowLeft,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
//   Clock3,
//   FileSpreadsheet,
//   FileText,
//   Filter,
//   MoreVertical,
//   Plus,
//   Search,
//   X,
// } from "lucide-react";

// import { useNavigate } from "react-router-dom";

// type ESIEmployee = {
//   id: number;
//   employeeId: string;
//   esiNo: string;
//   name: string;
//   payDays: string;
//   esiEarning: string;
//   esiContribution: string;
// };

// const employees: ESIEmployee[] = [
//   {
//     id: 1,
//     employeeId: "284520",
//     esiNo: "",
//     name: "Ishika Santosh Mokati",
//     payDays: "30.00",
//     esiEarning: "0.00",
//     esiContribution: "0.00",
//   },
//   {
//     id: 2,
//     employeeId: "294621",
//     esiNo: "",
//     name: "Rama Veera Manikanta Pusunuri",
//     payDays: "30.00",
//     esiEarning: "34576.00",
//     esiContribution: "260.00",
//   },
//   {
//     id: 3,
//     employeeId: "294625",
//     esiNo: "",
//     name: "Naveen Penaganti",
//     payDays: "30.00",
//     esiEarning: "0.00",
//     esiContribution: "0.00",
//   },
//   {
//     id: 4,
//     employeeId: "294638",
//     esiNo: "",
//     name: "Chithanuri Sowmya",
//     payDays: "30.00",
//     esiEarning: "0.00",
//     esiContribution: "0.00",
//   },
//   {
//     id: 5,
//     employeeId: "294639",
//     esiNo: "",
//     name: "Prathyusha Reddy",
//     payDays: "30.00",
//     esiEarning: "34576.00",
//     esiContribution: "260.00",
//   },
//   {
//     id: 6,
//     employeeId: "294640",
//     esiNo: "",
//     name: "BHAGYARAJA AVURAPALLI",
//     payDays: "30.00",
//     esiEarning: "93510.00",
//     esiContribution: "702.00",
//   },
//   {
//     id: 7,
//     employeeId: "294641",
//     esiNo: "",
//     name: "Ajay Jetty",
//     payDays: "30.00",
//     esiEarning: "0.00",
//     esiContribution: "0.00",
//   },
//   {
//     id: 8,
//     employeeId: "294642",
//     esiNo: "",
//     name: "Employee Name",
//     payDays: "30.00",
//     esiEarning: "0.00",
//     esiContribution: "0.00",
//   },
//   {
//     id: 9,
//     employeeId: "294643",
//     esiNo: "",
//     name: "Employee Name",
//     payDays: "30.00",
//     esiEarning: "0.00",
//     esiContribution: "0.00",
//   },
//   {
//     id: 10,
//     employeeId: "294644",
//     esiNo: "",
//     name: "Employee Name",
//     payDays: "30.00",
//     esiEarning: "0.00",
//     esiContribution: "0.00",
//   },
// ];

// const filterItems = [
//   "Query",
//   "Branch",
//   "Salary Structure",
//   "Leave",
//   "Attendance",
//   "Designation",
//   "Emp Status",
// ];

// export default function ESIMonthlyReportPage() {
//   const navigate = useNavigate();

//   const [month, setMonth] = useState("Sep/2026");
//   const [esiGroup, setEsiGroup] = useState("Select ESI Group");
//   const [search, setSearch] = useState("");
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   const filteredEmployees = employees.filter((employee) => {
//     const value = search.toLowerCase().trim();

//     if (!value) return true;

//     return (
//       employee.employeeId.toLowerCase().includes(value) ||
//       employee.name.toLowerCase().includes(value) ||
//       employee.esiNo.toLowerCase().includes(value)
//     );
//   });

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredEmployees.length / rowsPerPage)
//   );

//   const startIndex = (currentPage - 1) * rowsPerPage;

//   const displayedEmployees = filteredEmployees.slice(
//     startIndex,
//     startIndex + rowsPerPage
//   );

//   const handleBack = () => {
//     navigate("/insights/statutory-report/esi");
//   };

//   const handleSearch = (value: string) => {
//     setSearch(value);
//     setCurrentPage(1);
//   };

//   const handleRowsChange = (value: number) => {
//     setRowsPerPage(value);
//     setCurrentPage(1);
//   };

//   return (
//     <div className="min-h-screen w-full bg-[#f5f6f8] text-[#172033]">

//       {/* =====================================================
//           TOP REPORT NAVIGATION
//       ===================================================== */}
//       <div className="mx-[22px] pt-[20px]">
//         <div className="flex min-h-[73px] items-center justify-between rounded-[6px] border border-[#e6e9ee] bg-white px-[20px] shadow-[0_1px_4px_rgba(0,0,0,0.04)]">

//           {/* REPORT TABS */}
//           <div className="flex h-full items-center gap-[48px]">

//             <button
//               type="button"
//               onClick={() =>
//                 navigate("/insights/statutory-report/pf")
//               }
//               className="relative flex h-[73px] items-center px-[1px] text-[17px] font-semibold text-[#70737b]"
//             >
//               PF Report
//             </button>

//             <button
//               type="button"
//               className="relative flex h-[73px] items-center px-[1px] text-[17px] font-semibold text-[#1699e8]"
//             >
//               ESI Report

//               <span className="absolute bottom-[9px] left-0 h-[3px] w-full rounded-full bg-[#229fe8]" />
//             </button>

//             <button
//               type="button"
//               className="relative flex h-[73px] items-center px-[1px] text-[17px] font-semibold text-[#70737b]"
//             >
//               LWF Report
//             </button>

//             <button
//               type="button"
//               className="relative flex h-[73px] items-center px-[1px] text-[17px] font-semibold text-[#70737b]"
//             >
//               PT Report
//             </button>
//           </div>

//           {/* RIGHT ICONS */}
//           <div className="flex items-center gap-[27px]">

//             <button
//               type="button"
//               className="text-[#94a3c2] transition hover:text-[#229fe8]"
//               title="Filter"
//             >
//               <Filter size={23} strokeWidth={2.4} />
//             </button>

//             <button
//               type="button"
//               className="text-[#94a3c2] transition hover:text-[#229fe8]"
//               title="History"
//             >
//               <Clock3 size={23} strokeWidth={2.2} />
//             </button>

//           </div>
//         </div>
//       </div>


//       {/* =====================================================
//           TITLE / ACTION BAR
//       ===================================================== */}
//       <div className="mx-[22px] mt-[12px]">

//         <div className="flex min-h-[76px] items-center justify-between rounded-[6px] border border-[#e6e9ee] bg-white px-[20px]">

//           {/* TITLE */}
//           <div className="flex h-full items-center">
//             <h1 className="relative flex h-full items-center text-[18px] font-semibold text-[#1599e8]">
//               ESI Monthly Report

//               <span className="absolute bottom-[9px] left-0 h-[3px] w-[176px] rounded-full bg-[#229fe8]" />
//             </h1>
//           </div>


//           {/* ACTIONS */}
//           <div className="flex items-center gap-[10px]">

//             {/* BACK */}
//             <button
//               type="button"
//               onClick={handleBack}
//               className="flex h-[48px] min-w-[118px] items-center justify-center gap-[13px] rounded-[8px] border border-[#bfc3c9] bg-white px-[18px] text-[16px] font-medium text-[#65676c] transition hover:bg-[#f8fafc]"
//             >
//               <ArrowLeft size={22} strokeWidth={2.2} />
//               <span>Back</span>
//             </button>


//             {/* MONTH */}
//             <div className="relative">
//               <select
//                 value={month}
//                 onChange={(e) => setMonth(e.target.value)}
//                 className="h-[48px] w-[185px] appearance-none rounded-[7px] border border-[#e2e6ec] bg-[#edf1f7] px-[15px] pr-[40px] text-[16px] font-medium text-[#222b3a] outline-none focus:border-[#229fe8]"
//               >
//                 <option>Sep/2026</option>
//                 <option>Aug/2026</option>
//                 <option>Jul/2026</option>
//                 <option>Jun/2026</option>
//                 <option>May/2026</option>
//               </select>

//               <ChevronDown
//                 size={17}
//                 className="pointer-events-none absolute right-[13px] top-1/2 -translate-y-1/2 text-[#777d86]"
//               />
//             </div>


//             {/* ESI GROUP */}
//             <div className="relative">
//               <select
//                 value={esiGroup}
//                 onChange={(e) => setEsiGroup(e.target.value)}
//                 className="h-[48px] w-[202px] appearance-none rounded-[7px] border border-[#dfe3e8] bg-white px-[15px] pr-[40px] text-[16px] font-medium text-[#242a35] outline-none focus:border-[#229fe8]"
//               >
//                 <option>Select ESI Group</option>
//                 <option>ESI Group 1</option>
//                 <option>ESI Group 2</option>
//                 <option>ESI Group 3</option>
//               </select>

//               <ChevronDown
//                 size={17}
//                 className="pointer-events-none absolute right-[13px] top-1/2 -translate-y-1/2 text-[#777d86]"
//               />
//             </div>


//             {/* ADVANCED FILTER */}
//             <button
//               type="button"
//               className="flex h-[48px] items-center gap-[14px] rounded-[8px] bg-[#239fe8] px-[21px] text-[16px] font-medium text-white shadow-sm transition hover:bg-[#168fd8]"
//             >
//               <Filter size={20} strokeWidth={2.2} />
//               <span>Advance Filter</span>
//             </button>


//             {/* PDF */}
//             <button
//               type="button"
//               title="Export PDF"
//               className="flex h-[48px] w-[42px] items-center justify-center rounded-[6px] bg-white transition hover:bg-[#f4f7fa]"
//             >
//               <FileText
//                 size={25}
//                 strokeWidth={2.2}
//                 className="text-[#e53935]"
//               />
//             </button>


//             {/* EXCEL */}
//             <button
//               type="button"
//               title="Export Excel"
//               className="flex h-[48px] w-[42px] items-center justify-center rounded-[6px] bg-white transition hover:bg-[#f4f7fa]"
//             >
//               <FileSpreadsheet
//                 size={26}
//                 strokeWidth={2}
//                 className="text-[#3d9348]"
//               />
//             </button>

//           </div>
//         </div>
//       </div>


//       {/* =====================================================
//           FILTER BAR
//       ===================================================== */}
//       <div className="mx-[22px] mt-[7px]">

//         <div className="flex min-h-[57px] items-center rounded-[6px] border border-[#e5e8ed] bg-white px-[17px]">

//           {/* SEARCH */}
//           <div className="flex w-[590px] min-w-[250px] items-center">

//             <Search
//               size={23}
//               strokeWidth={2}
//               className="mr-[10px] shrink-0 text-[#8792aa]"
//             />

//             <input
//               type="text"
//               value={search}
//               onChange={(e) => handleSearch(e.target.value)}
//               placeholder="Start Typing..."
//               className="w-full bg-transparent text-[16px] text-[#333] outline-none placeholder:text-[#d0d2d7]"
//             />

//           </div>


//           {/* ADD FILTER */}
//           <button
//             type="button"
//             className="ml-[10px] flex items-center gap-[9px] whitespace-nowrap text-[16px] font-medium text-[#71747c] hover:text-[#229fe8]"
//           >
//             <Plus size={20} strokeWidth={2.2} />
//             Add Filter
//           </button>


//           {/* FILTER OPTIONS */}
//           <div className="ml-auto flex items-center gap-[31px]">

//             {filterItems.map((item) => (
//               <button
//                 key={item}
//                 type="button"
//                 className="flex items-center gap-[8px] whitespace-nowrap text-[15px] font-medium text-[#777b84] hover:text-[#229fe8]"
//               >
//                 <span>{item}</span>
//                 <ChevronDown size={15} strokeWidth={2} />
//               </button>
//             ))}


//             {/* MORE */}
//             <button
//               type="button"
//               className="text-[#9299ab]"
//               title="More"
//             >
//               <MoreVertical size={22} />
//             </button>


//             {/* CLEAR */}
//             <button
//               type="button"
//               onClick={() => handleSearch("")}
//               className="text-[#ef3340] transition hover:text-[#d91d2a]"
//               title="Clear"
//             >
//               <X size={23} strokeWidth={2.3} />
//             </button>

//           </div>
//         </div>
//       </div>


//       {/* =====================================================
//           TABLE
//       ===================================================== */}
//       <div className="mx-[22px] mt-[14px] overflow-hidden rounded-[6px]">

//         <div className="w-full overflow-x-auto">

//           <table className="w-full min-w-[1250px] border-separate border-spacing-y-[13px]">

//             {/* TABLE HEADER */}
//             <thead>
//               <tr className="bg-[#d7ebf9]">

//                 <th className="h-[74px] rounded-l-[5px] px-[13px] text-left text-[16px] font-semibold text-[#172033]">
//                   Sl. No.
//                 </th>

//                 <th className="px-[13px] text-left text-[16px] font-semibold text-[#172033]">
//                   Employee ID
//                 </th>

//                 <th className="px-[13px] text-left text-[16px] font-semibold text-[#172033]">
//                   ESI No.
//                 </th>

//                 <th className="px-[13px] text-left text-[16px] font-semibold text-[#172033]">
//                   Name Of Member
//                 </th>

//                 <th className="px-[13px] text-right text-[16px] font-semibold text-[#172033]">
//                   Pay Days
//                 </th>

//                 <th className="px-[13px] text-right text-[16px] font-semibold text-[#172033]">
//                   ESI Earning
//                 </th>

//                 <th className="rounded-r-[5px] px-[13px] text-right text-[16px] font-semibold text-[#172033]">
//                   ESI Contribution
//                 </th>

//               </tr>
//             </thead>


//             {/* TABLE BODY */}
//             <tbody>

//               {displayedEmployees.map((employee, index) => (

//                 <tr
//                   key={employee.id}
//                   className="bg-white shadow-[0_1px_4px_rgba(0,0,0,0.03)]"
//                 >

//                   <td className="h-[48px] rounded-l-[5px] px-[13px] text-[16px] text-[#182236]">
//                     {startIndex + index + 1}
//                   </td>

//                   <td className="px-[13px] text-[16px] text-[#182236]">
//                     {employee.employeeId}
//                   </td>

//                   <td className="px-[13px] text-[16px] text-[#182236]">
//                     {employee.esiNo}
//                   </td>

//                   <td className="px-[13px] text-[16px] text-[#182236]">
//                     {employee.name}
//                   </td>

//                   <td className="px-[13px] text-right text-[16px] text-[#182236]">
//                     {employee.payDays}
//                   </td>

//                   <td className="px-[13px] text-right text-[16px] text-[#182236]">
//                     {employee.esiEarning}
//                   </td>

//                   <td className="rounded-r-[5px] px-[13px] text-right text-[16px] text-[#182236]">
//                     {employee.esiContribution}
//                   </td>

//                 </tr>

//               ))}

//             </tbody>
//           </table>
//         </div>
//       </div>


//       {/* =====================================================
//           PAGINATION
//       ===================================================== */}
//       <div className="mx-[22px] flex min-h-[57px] items-center justify-end gap-[30px] bg-transparent px-[10px]">

//         {/* ROWS PER PAGE */}
//         <div className="flex items-center gap-[8px] text-[14px] text-[#303744]">

//           <span>Rows per page</span>

//           <div className="relative">
//             <select
//               value={rowsPerPage}
//               onChange={(e) =>
//                 handleRowsChange(Number(e.target.value))
//               }
//               className="appearance-none bg-transparent px-[4px] pr-[22px] text-[14px] outline-none"
//             >
//               <option value={10}>10</option>
//               <option value={20}>20</option>
//               <option value={50}>50</option>
//             </select>

//             <ChevronDown
//               size={14}
//               className="pointer-events-none absolute right-[2px] top-1/2 -translate-y-1/2"
//             />
//           </div>
//         </div>


//         {/* RECORD COUNT */}
//         <div className="text-[14px] text-[#303744]">
//           {filteredEmployees.length === 0
//             ? "0 to 0 of 0"
//             : `${startIndex + 1} to ${Math.min(
//                 startIndex + rowsPerPage,
//                 filteredEmployees.length
//               )} of 172`}
//         </div>


//         {/* PAGINATION BUTTONS */}
//         <div className="flex items-center gap-[18px]">

//           <button
//             type="button"
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage(1)}
//             className="text-[#a5a9b0] disabled:cursor-not-allowed"
//           >
//             <ChevronsLeft size={18} />
//           </button>

//           <button
//             type="button"
//             disabled={currentPage === 1}
//             onClick={() =>
//               setCurrentPage((page) => Math.max(1, page - 1))
//             }
//             className="text-[#a5a9b0] disabled:cursor-not-allowed"
//           >
//             <ChevronLeft size={18} />
//           </button>


//           <button
//             type="button"
//             className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#f0f1f3] text-[14px] text-[#333]"
//           >
//             1
//           </button>

//           <button
//             type="button"
//             className="text-[14px] text-[#303744]"
//           >
//             2
//           </button>

//           <button
//             type="button"
//             className="text-[14px] text-[#303744]"
//           >
//             3
//           </button>

//           <button
//             type="button"
//             className="text-[14px] text-[#303744]"
//           >
//             4
//           </button>

//           <button
//             type="button"
//             className="text-[14px] text-[#303744]"
//           >
//             5
//           </button>

//           <span className="text-[14px] text-[#303744]">
//             ...
//           </span>

//           <button
//             type="button"
//             className="text-[14px] text-[#303744]"
//           >
//             18
//           </button>


//           <button
//             type="button"
//             disabled={currentPage === totalPages}
//             onClick={() =>
//               setCurrentPage((page) =>
//                 Math.min(totalPages, page + 1)
//               )
//             }
//             className="text-[#303744] disabled:text-[#a5a9b0]"
//           >
//             <ChevronRight size={18} />
//           </button>

//           <button
//             type="button"
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage(totalPages)}
//             className="text-[#303744] disabled:text-[#a5a9b0]"
//           >
//             <ChevronsRight size={18} />
//           </button>

//         </div>
//       </div>

//     </div>
//   );
// }


import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  FileSpreadsheet,
  Filter,
  MoreVertical,
  Search,
  X,
  Plus,
  Shield,
  Users,
  IndianRupee,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

interface EmployeeRow {
  id: number;
  employeeId: string;
  esiNo: string;
  name: string;
  payDays: string;
  esiEarning: string;
  esiContribution: string;
}

/* =========================================================
   SAMPLE TABLE DATA
========================================================= */

const EMPLOYEE_DATA: EmployeeRow[] = [
  {
    id: 1,
    employeeId: "284520",
    esiNo: "",
    name: "Ishika Santosh Mokati",
    payDays: "30.00",
    esiEarning: "0.00",
    esiContribution: "0.00",
  },
  {
    id: 2,
    employeeId: "294621",
    esiNo: "",
    name: "Rama Veera Manikanta Pusunuri",
    payDays: "30.00",
    esiEarning: "34576.00",
    esiContribution: "260.00",
  },
  {
    id: 3,
    employeeId: "294625",
    esiNo: "",
    name: "Naveen Penaganti",
    payDays: "30.00",
    esiEarning: "0.00",
    esiContribution: "0.00",
  },
  {
    id: 4,
    employeeId: "294638",
    esiNo: "",
    name: "Chithanuri Sowmya",
    payDays: "30.00",
    esiEarning: "0.00",
    esiContribution: "0.00",
  },
  {
    id: 5,
    employeeId: "294639",
    esiNo: "",
    name: "Prathyusha Reddy",
    payDays: "30.00",
    esiEarning: "34576.00",
    esiContribution: "260.00",
  },
  {
    id: 6,
    employeeId: "294640",
    esiNo: "",
    name: "BHAGYARAJA AVURAPALLI",
    payDays: "30.00",
    esiEarning: "93510.00",
    esiContribution: "702.00",
  },
  {
    id: 7,
    employeeId: "294641",
    esiNo: "",
    name: "Ajay Jetty",
    payDays: "30.00",
    esiEarning: "0.00",
    esiContribution: "0.00",
  },
  {
    id: 8,
    employeeId: "294642",
    esiNo: "",
    name: "JAYAKRISHNA KALLURI",
    payDays: "30.00",
    esiEarning: "0.00",
    esiContribution: "0.00",
  },
  {
    id: 9,
    employeeId: "294643",
    esiNo: "",
    name: "Hindusena Varadarajula",
    payDays: "30.00",
    esiEarning: "0.00",
    esiContribution: "0.00",
  },
  {
    id: 10,
    employeeId: "294644",
    esiNo: "",
    name: "Karicheti Venkata Suresh Babu",
    payDays: "30.00",
    esiEarning: "0.00",
    esiContribution: "0.00",
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function ESIMonthlyReportPage() {
  const navigate = useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [month, setMonth] = useState("Sep/2026");
  const [esiGroup, setEsiGroup] = useState("");

  const [searchText, setSearchText] = useState("");

  const [showFilters, setShowFilters] = useState(true);

  const [branch, setBranch] = useState("");
  const [salaryStructure, setSalaryStructure] =
    useState("");
  const [leave, setLeave] = useState("");
  const [attendance, setAttendance] = useState("");
  const [designation, setDesignation] =
    useState("");
  const [employeeStatus, setEmployeeStatus] =
    useState("");

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [currentPage, setCurrentPage] = useState(1);

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredEmployees = useMemo(() => {
    const value = searchText.trim().toLowerCase();

    if (!value) {
      return EMPLOYEE_DATA;
    }

    return EMPLOYEE_DATA.filter((employee) => {
      return (
        employee.employeeId
          .toLowerCase()
          .includes(value) ||
        employee.name
          .toLowerCase()
          .includes(value) ||
        employee.esiNo
          .toLowerCase()
          .includes(value)
      );
    });
  }, [searchText]);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const totalRecords = 172;

  const totalPages = Math.max(
    1,
    Math.ceil(totalRecords / rowsPerPage)
  );

  const visibleEmployees = filteredEmployees.slice(
    0,
    rowsPerPage
  );

  /* =======================================================
     BACK
  ======================================================= */

  const handleBack = () => {
    navigate("../");
  };

  /* =======================================================
     PAGE CHANGE
  ======================================================= */

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) {
      return;
    }

    setCurrentPage(page);
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen w-full bg-[#f3f6fb] p-3 sm:p-4">

      {/* ===================================================
          TOP NAVIGATION
      =================================================== */}

      <div className="rounded-md bg-white shadow-sm">

        <div className="flex min-h-[70px] items-center justify-between px-5">

          <div className="flex h-full items-center gap-8">

            {/* PF */}

            <button
              type="button"
              onClick={() => navigate("../")}
              className="relative flex h-[70px] items-center gap-2 px-1 text-[17px] font-medium text-[#666a73]"
            >
              <Shield
                size={18}
                strokeWidth={1.8}
              />

              <span>PF Report</span>
            </button>

            {/* ESI ACTIVE */}

            <button
              type="button"
              className="relative flex h-[70px] items-center gap-2 px-1 text-[17px] font-semibold text-[#1598e5]"
            >
              <Plus
                size={18}
                strokeWidth={1.8}
              />

              <span>ESI Report</span>

              <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1598e5]" />
            </button>

            {/* LWF */}

            <button
              type="button"
              onClick={() => navigate("../lwf")}
              className="flex h-[70px] items-center gap-2 px-1 text-[17px] font-medium text-[#666a73]"
            >
              <Users
                size={18}
                strokeWidth={1.8}
              />

              <span>LWF Report</span>
            </button>

            {/* PT */}

            <button
              type="button"
              onClick={() => navigate("../pt")}
              className="flex h-[70px] items-center gap-2 px-1 text-[17px] font-medium text-[#666a73]"
            >
              <IndianRupee
                size={18}
                strokeWidth={1.8}
              />

              <span>PT Report</span>
            </button>
          </div>

          {/* RIGHT ICONS */}

          <div className="flex items-center gap-7 pr-2">

            <Filter
              size={23}
              strokeWidth={1.8}
              className="text-[#92a0bc]"
            />

            <span className="text-[#92a0bc]">
              ◌
            </span>
          </div>
        </div>
      </div>

      {/* ===================================================
          REPORT HEADER
      =================================================== */}

      <div className="mt-3 rounded-md bg-white shadow-sm">

        <div className="flex min-h-[86px] flex-wrap items-center justify-between gap-3 px-5">

          {/* TITLE */}

          <div>
            <div className="border-b-[3px] border-[#1598e5] pb-3">
              <h1 className="text-[18px] font-semibold text-[#1598e5]">
                ESI Monthly Report
              </h1>
            </div>
          </div>

          {/* CONTROLS */}

          <div className="flex flex-wrap items-center gap-3">

            {/* BACK */}

            <button
              type="button"
              onClick={handleBack}
              className="
                flex
                h-[48px]
                min-w-[116px]
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-[#c9c9c9]
                bg-white
                px-5
                text-[15px]
                font-medium
                text-[#333333]
                shadow-sm
              "
            >
              <ArrowLeft
                size={20}
                strokeWidth={1.8}
              />

              <span>Back</span>
            </button>

            {/* MONTH */}

            <div className="relative">

              <select
                value={month}
                onChange={(e) =>
                  setMonth(e.target.value)
                }
                className="
                  h-[48px]
                  min-w-[185px]
                  appearance-none
                  rounded-lg
                  border
                  border-[#dce0e8]
                  bg-[#eef1f7]
                  px-4
                  pr-10
                  text-[15px]
                  text-[#1e293b]
                  outline-none
                "
              >
                <option>Sep/2026</option>
                <option>Aug/2026</option>
                <option>Jul/2026</option>
                <option>Jun/2026</option>
              </select>

              <ChevronDown
                size={17}
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-[#777]
                "
              />
            </div>

            {/* ESI GROUP */}

            <div className="relative">

              <select
                value={esiGroup}
                onChange={(e) =>
                  setEsiGroup(e.target.value)
                }
                className="
                  h-[48px]
                  min-w-[200px]
                  appearance-none
                  rounded-lg
                  border
                  border-[#d9dce3]
                  bg-white
                  px-4
                  pr-10
                  text-[15px]
                  text-[#243044]
                  outline-none
                "
              >
                <option value="">
                  Select ESI Group
                </option>

                <option value="Group 1">
                  Group 1
                </option>

                <option value="Group 2">
                  Group 2
                </option>

                <option value="Group 3">
                  Group 3
                </option>
              </select>

              <ChevronDown
                size={17}
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-[#777]
                "
              />
            </div>

            {/* ADVANCE FILTER */}

            <button
              type="button"
              onClick={() =>
                setShowFilters((value) => !value)
              }
              className="
                flex
                h-[48px]
                items-center
                gap-3
                rounded-lg
                bg-[#1598e5]
                px-5
                text-[15px]
                font-medium
                text-white
                shadow-sm
              "
            >
              <Filter
                size={20}
                strokeWidth={2}
              />

              <span>Advance Filter</span>
            </button>

            {/* PDF */}

            <button
              type="button"
              title="Export PDF"
              className="flex h-10 w-9 items-center justify-center"
            >
              <span className="rounded bg-[#e53935] px-1 py-[2px] text-[9px] font-bold text-white">
                PDF
              </span>
            </button>

            {/* EXCEL */}

            <button
              type="button"
              title="Export Excel"
              className="flex h-10 w-9 items-center justify-center"
            >
              <FileSpreadsheet
                size={27}
                strokeWidth={1.8}
                className="text-[#299447]"
              />
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================
          FILTER BAR
      =================================================== */}

      {showFilters && (
        <div className="mt-2 rounded-md bg-white shadow-sm">

          <div className="flex min-h-[52px] items-center gap-5 overflow-x-auto px-4">

            {/* SEARCH */}

            <div className="flex min-w-[260px] flex-1 items-center gap-3 text-[#9ca6bd]">

              <Search
                size={22}
                strokeWidth={1.8}
              />

              <input
                type="text"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Start Typing..."
                className="
                  w-full
                  border-none
                  bg-transparent
                  text-[15px]
                  outline-none
                  placeholder:text-[#d2d5dd]
                "
              />
            </div>

            {/* ADD FILTER */}

            <button
              type="button"
              className="
                flex
                min-w-fit
                items-center
                gap-2
                text-[15px]
                font-medium
                text-[#737785]
              "
            >
              <span className="text-[24px] leading-none">
                +
              </span>

              <span>Add Filter</span>
            </button>

            {/* QUERY */}

            <FilterDropdown
              label="Query"
              value=""
              options={[
                "All",
                "Active",
                "Inactive",
              ]}
            />

            {/* BRANCH */}

            <FilterDropdown
              label="Branch"
              value={branch}
              options={[
                "",
                "Hyderabad",
                "Bangalore",
                "Chennai",
              ]}
              onChange={setBranch}
            />

            {/* SALARY */}

            <FilterDropdown
              label="Salary Structure"
              value={salaryStructure}
              options={[
                "",
                "Monthly",
                "Annual",
              ]}
              onChange={setSalaryStructure}
            />

            {/* LEAVE */}

            <FilterDropdown
              label="Leave"
              value={leave}
              options={[
                "",
                "Available",
                "Not Available",
              ]}
              onChange={setLeave}
            />

            {/* ATTENDANCE */}

            <FilterDropdown
              label="Attendance"
              value={attendance}
              options={[
                "",
                "Present",
                "Absent",
              ]}
              onChange={setAttendance}
            />

            {/* DESIGNATION */}

            <FilterDropdown
              label="Designation"
              value={designation}
              options={[
                "",
                "Employee",
                "Manager",
              ]}
              onChange={setDesignation}
            />

            {/* EMP STATUS */}

            <FilterDropdown
              label="Emp Status"
              value={employeeStatus}
              options={[
                "",
                "Active",
                "Inactive",
              ]}
              onChange={setEmployeeStatus}
            />

            {/* MORE */}

            <button
              type="button"
              className="flex shrink-0 items-center justify-center text-[#8d94a5]"
            >
              <MoreVertical
                size={23}
              />
            </button>

            {/* CLOSE */}

            <button
              type="button"
              onClick={() =>
                setShowFilters(false)
              }
              className="flex shrink-0 items-center justify-center text-[#f03b3b]"
            >
              <X
                size={23}
                strokeWidth={2}
              />
            </button>
          </div>
        </div>
      )}

      {/* ===================================================
          TABLE
      =================================================== */}

      <div className="mt-3 w-full overflow-hidden rounded-md">

        {/* HORIZONTAL SCROLL */}

        <div className="w-full overflow-x-auto">

          <div className="min-w-[1200px]">

            {/* TABLE HEADER */}

            <div
              className="
                grid
                grid-cols-[8%_14%_10%_35%_10%_12%_11%]
                items-center
                rounded-t-md
                bg-[#cfe6f7]
                px-3
                py-4
                text-[16px]
                font-semibold
                text-[#10213b]
              "
            >
              <div>Sl. No.</div>

              <div>Employee ID</div>

              <div>ESI No.</div>

              <div>Name Of Member</div>

              <div className="text-right">
                Pay Days
              </div>

              <div className="text-right">
                ESI Earning
              </div>

              <div className="text-right">
                ESI Contribution
              </div>
            </div>

            {/* TABLE BODY */}

            <div className="space-y-3 bg-[#f3f6fb] py-3">

              {visibleEmployees.map(
                (employee) => (
                  <div
                    key={employee.id}
                    className="
                      grid
                      grid-cols-[8%_14%_10%_35%_10%_12%_11%]
                      items-center
                      rounded-md
                      bg-white
                      px-3
                      py-3
                      text-[16px]
                      text-[#071a36]
                      shadow-[0_3px_8px_rgba(0,0,0,0.05)]
                    "
                  >
                    <div>
                      {employee.id}
                    </div>

                    <div>
                      {employee.employeeId}
                    </div>

                    <div>
                      {employee.esiNo}
                    </div>

                    <div className="truncate pr-3">
                      {employee.name}
                    </div>

                    <div className="text-right">
                      {employee.payDays}
                    </div>

                    <div className="text-right">
                      {employee.esiEarning}
                    </div>

                    <div className="text-right">
                      {employee.esiContribution}
                    </div>
                  </div>
                )
              )}

              {/* ===========================================
                  GRAND TOTAL
              ============================================ */}

              <div
                className="
                  grid
                  grid-cols-[8%_14%_10%_35%_10%_12%_11%]
                  items-center
                  bg-[#cfe6f7]
                  px-3
                  py-4
                  text-[16px]
                  font-medium
                  text-[#13213a]
                "
              >
                <div
                  className="col-span-4"
                >
                  Grand Total
                </div>

                <div />

                <div className="text-right">
                  162662.00
                </div>

                <div className="text-right">
                  1222.00
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            PAGINATION
        ================================================== */}

        <div
          className="
            flex
            min-h-[58px]
            items-center
            justify-end
            gap-5
            bg-[#f3f6fb]
            px-4
            text-[15px]
            text-[#16233b]
          "
        >
          {/* ROWS */}

          <div className="flex items-center gap-2">
            <span>
              Rows per page
            </span>

            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(
                    Number(e.target.value)
                  );
                  setCurrentPage(1);
                }}
                className="
                  appearance-none
                  border-none
                  bg-transparent
                  px-1
                  pr-5
                  text-[15px]
                  outline-none
                "
              >
                <option value={10}>
                  10
                </option>

                <option value={20}>
                  20
                </option>

                <option value={50}>
                  50
                </option>
              </select>

              <ChevronDown
                size={15}
                className="
                  pointer-events-none
                  absolute
                  right-0
                  top-1/2
                  -translate-y-1/2
                "
              />
            </div>
          </div>

          {/* RANGE */}

          <span>
            {filteredEmployees.length === 0
              ? "0"
              : `${(currentPage - 1) * rowsPerPage + 1} to ${Math.min(
                  currentPage * rowsPerPage,
                  totalRecords
                )}`}{" "}
            of {totalRecords}
          </span>

          {/* FIRST */}

          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => goToPage(1)}
            className="disabled:opacity-30"
          >
            <ChevronsLeft
              size={19}
            />
          </button>

          {/* PREVIOUS */}

          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() =>
              goToPage(currentPage - 1)
            }
            className="disabled:opacity-30"
          >
            <ChevronLeft
              size={19}
            />
          </button>

          {/* PAGE 1 */}

          <button
            type="button"
            onClick={() => goToPage(1)}
            className={`
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              ${
                currentPage === 1
                  ? "bg-[#e2e2e2]"
                  : ""
              }
            `}
          >
            1
          </button>

          {/* PAGE 2 */}

          <button
            type="button"
            onClick={() => goToPage(2)}
            className="h-8 w-8"
          >
            2
          </button>

          {/* PAGE 3 */}

          <button
            type="button"
            onClick={() => goToPage(3)}
            className="h-8 w-8"
          >
            3
          </button>

          {/* PAGE 4 */}

          <button
            type="button"
            onClick={() => goToPage(4)}
            className="h-8 w-8"
          >
            4
          </button>

          {/* PAGE 5 */}

          <button
            type="button"
            onClick={() => goToPage(5)}
            className="h-8 w-8"
          >
            5
          </button>

          <span>...</span>

          {/* LAST PAGE */}

          <button
            type="button"
            onClick={() =>
              goToPage(totalPages)
            }
            className="h-8 w-8"
          >
            18
          </button>

          {/* NEXT */}

          <button
            type="button"
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              goToPage(currentPage + 1)
            }
            className="disabled:opacity-30"
          >
            <ChevronRight
              size={19}
            />
          </button>

          {/* LAST */}

          <button
            type="button"
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              goToPage(totalPages)
            }
            className="disabled:opacity-30"
          >
            <ChevronsRight
              size={19}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   FILTER DROPDOWN
========================================================= */

interface FilterDropdownProps {
  label: string;
  value?: string;
  options?: string[];
  onChange?: (value: string) => void;
}

function FilterDropdown({
  label,
  value = "",
  options = [],
  onChange,
}: FilterDropdownProps) {
  return (
    <div className="relative flex shrink-0 items-center">

      <select
        value={value}
        onChange={(e) =>
          onChange?.(e.target.value)
        }
        className="
          h-[40px]
          min-w-[95px]
          appearance-none
          border-none
          bg-transparent
          px-1
          pr-6
          text-[15px]
          font-medium
          text-[#747783]
          outline-none
        "
      >
        <option value="">
          {label}
        </option>

        {options
          .filter((option) => option !== "")
          .map((option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          ))}
      </select>

      <ChevronDown
        size={15}
        className="
          pointer-events-none
          absolute
          right-1
          top-1/2
          -translate-y-1/2
          text-[#777]
        "
      />
    </div>
  );
}
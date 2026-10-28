// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// import {
//   ArrowLeft,
//   ChevronDown,
//   Filter,
//   MoreVertical,
//   Search,
//   X,
//   FileText,
//   FileSpreadsheet,
//   Clock3,
//   FileDown,
// } from "lucide-react";


// /* ==========================================================
//    TYPES
// ========================================================== */

// interface PTEmployee {
//   id: number;
//   employeeId: string;
//   employeeName: string;
//   ptGross: number;
//   ptDeducted: number;
// }


// /* ==========================================================
//    SAMPLE TABLE DATA
// ========================================================== */

// const EMPLOYEE_DATA: PTEmployee[] = [
//   {
//     id: 1,
//     employeeId: "294621",
//     employeeName: "Rama Veera Manikanta Pusunuri",
//     ptGross: 34576,
//     ptDeducted: 200,
//   },
//   {
//     id: 2,
//     employeeId: "294639",
//     employeeName: "Prathyusha Reddy",
//     ptGross: 34576,
//     ptDeducted: 200,
//   },
//   {
//     id: 3,
//     employeeId: "294640",
//     employeeName: "BHAGYARAJA AVURAPALLI",
//     ptGross: 93510,
//     ptDeducted: 200,
//   },
// ];


// /* ==========================================================
//    MAIN COMPONENT
// ========================================================== */

// export default function PTMonthlyReportPage() {
//   const navigate = useNavigate();

//   const [month, setMonth] = useState("Sep/2026");
//   const [ptState, setPtState] = useState("");
//   const [ptGroup, setPtGroup] = useState("");

//   const [searchText, setSearchText] = useState("");

//   const [activeFilter, setActiveFilter] = useState<string | null>(
//     null,
//   );

//   const [showFilters, setShowFilters] = useState(false);

//   /* ========================================================
//      SEARCH
//   ======================================================== */

//   const filteredEmployees = EMPLOYEE_DATA.filter((employee) => {
//     const search = searchText.toLowerCase().trim();

//     if (!search) {
//       return true;
//     }

//     return (
//       employee.employeeId.toLowerCase().includes(search) ||
//       employee.employeeName.toLowerCase().includes(search)
//     );
//   });


//   /* ========================================================
//      TOTALS
//   ======================================================== */

//   const totalGross = filteredEmployees.reduce(
//     (total, employee) => total + employee.ptGross,
//     0,
//   );

//   const totalDeducted = filteredEmployees.reduce(
//     (total, employee) => total + employee.ptDeducted,
//     0,
//   );


//   /* ========================================================
//      NAVIGATION
//   ======================================================== */

//   const goToPF = () => {
//     navigate("../pf");
//   };

//   const goToESI = () => {
//     navigate("../esi");
//   };

//   const goToLWF = () => {
//     navigate("../lwf");
//   };

//   const goToPT = () => {
//     navigate("../pt");
//   };

//   const handleBack = () => {
//     navigate("../pt");
//   };


//   /* ========================================================
//      FILTER HANDLER
//   ======================================================== */

//   const handleFilterClick = (filter: string) => {
//     setActiveFilter(
//       activeFilter === filter ? null : filter,
//     );
//   };


//   return (
//     <div className="min-h-screen w-full bg-[#f3f6fb]">

//       {/* ====================================================
//           TOP REPORT NAVIGATION
//       ==================================================== */}

//       <div className="px-4 pt-4 sm:px-5">

//         <div
//           className="
//             flex
//             h-[70px]
//             items-center
//             gap-8
//             overflow-x-auto
//             rounded-md
//             border
//             border-[#e1e4e9]
//             bg-white
//             px-5
//             shadow-sm
//           "
//         >

//           {/* PF */}

//           <button
//             type="button"
//             onClick={goToPF}
//             className="
//               relative
//               flex
//               h-full
//               shrink-0
//               items-center
//               text-[18px]
//               font-medium
//               text-[#4d5360]
//             "
//           >
//             PF Report
//           </button>


//           {/* ESI */}

//           <button
//             type="button"
//             onClick={goToESI}
//             className="
//               relative
//               flex
//               h-full
//               shrink-0
//               items-center
//               text-[18px]
//               font-medium
//               text-[#4d5360]
//             "
//           >
//             ESI Report
//           </button>


//           {/* LWF */}

//           <button
//             type="button"
//             onClick={goToLWF}
//             className="
//               relative
//               flex
//               h-full
//               shrink-0
//               items-center
//               text-[18px]
//               font-medium
//               text-[#4d5360]
//             "
//           >
//             LWF Report
//           </button>


//           {/* PT ACTIVE */}

//           <button
//             type="button"
//             onClick={goToPT}
//             className="
//               relative
//               flex
//               h-full
//               shrink-0
//               items-center
//               text-[18px]
//               font-medium
//               text-[#168ed2]
//             "
//           >
//             PT Report

//             <span
//               className="
//                 absolute
//                 bottom-[7px]
//                 left-0
//                 right-0
//                 h-[3px]
//                 rounded-full
//                 bg-[#168ed2]
//               "
//             />
//           </button>


//           {/* FILTER ICON */}

//           <div className="ml-auto flex shrink-0 items-center">
//             <Filter
//               size={22}
//               strokeWidth={1.8}
//               className="text-[#8d9bb1]"
//             />
//           </div>

//         </div>
//       </div>


//       {/* ====================================================
//           REPORT HEADER
//       ==================================================== */}

//       <div className="px-4 pt-3 sm:px-5">

//         <div
//           className="
//             flex
//             min-h-[76px]
//             flex-wrap
//             items-center
//             justify-end
//             gap-3
//             rounded-md
//             border
//             border-[#e1e4e9]
//             bg-white
//             px-4
//             shadow-sm
//           "
//         >

//           {/* TITLE */}

//           <div className="mr-auto">

//             <div
//               className="
//                 border-b-[3px]
//                 border-[#168ed2]
//                 pb-[13px]
//                 pt-[5px]
//               "
//             >
//               <h1
//                 className="
//                   text-[18px]
//                   font-medium
//                   text-[#168ed2]
//                 "
//               >
//                 PT Monthly Report
//               </h1>
//             </div>

//           </div>


//           {/* BACK */}

//           <button
//             type="button"
//             onClick={handleBack}
//             className="
//               flex
//               h-[48px]
//               items-center
//               gap-2
//               rounded-md
//               border
//               border-[#c8cbd0]
//               bg-white
//               px-5
//               text-[17px]
//               text-[#5b6068]
//               shadow-sm
//             "
//           >
//             <ArrowLeft size={21} />

//             <span>
//               Back
//             </span>
//           </button>


//           {/* MONTH */}

//           <SelectBox
//             value={month}
//             onChange={setMonth}
//             options={[
//               "Sep/2026",
//               "Aug/2026",
//               "Jul/2026",
//               "Jun/2026",
//             ]}
//             width="185px"
//           />


//           {/* PT STATE */}

//           <SelectBox
//             value={ptState}
//             onChange={setPtState}
//             placeholder="Select PT state"
//             options={[
//               "Andhra Pradesh",
//               "Goa",
//               "Gujarat",
//               "Karnataka",
//               "Maharashtra",
//               "Telangana",
//             ]}
//             width="190px"
//           />


//           {/* PT GROUP */}

//           <SelectBox
//             value={ptGroup}
//             onChange={setPtGroup}
//             placeholder="Select PT Group"
//             options={[
//               "Group 1",
//               "Group 2",
//               "Group 3",
//             ]}
//             width="195px"
//           />


//           {/* ADVANCE FILTER */}

//           <button
//             type="button"
//             onClick={() =>
//               setShowFilters(!showFilters)
//             }
//             className="
//               flex
//               h-[48px]
//               items-center
//               gap-3
//               rounded-md
//               bg-[#2097df]
//               px-5
//               text-[16px]
//               font-medium
//               text-white
//               shadow-sm
//             "
//           >
//             <Filter size={19} />

//             <span>
//               Advance Filter
//             </span>
//           </button>


//           {/* PDF */}

//           <button
//             type="button"
//             title="PDF"
//             className="
//               flex
//               h-[48px]
//               w-[38px]
//               items-center
//               justify-center
//               text-[#e33434]
//             "
//           >
//             <FileDown size={22} />
//           </button>


//           {/* EXCEL */}

//           <button
//             type="button"
//             title="Excel"
//             className="
//               flex
//               h-[48px]
//               w-[38px]
//               items-center
//               justify-center
//               text-[#299447]
//             "
//           >
//             <FileSpreadsheet size={23} />
//           </button>


//           {/* HISTORY */}

//           <button
//             type="button"
//             title="History"
//             className="
//               flex
//               h-[48px]
//               w-[38px]
//               items-center
//               justify-center
//               text-[#8f9aad]
//             "
//           >
//             <Clock3 size={22} />
//           </button>

//         </div>
//       </div>


//       {/* ====================================================
//           FILTER BAR
//       ==================================================== */}

//       <div className="px-4 pt-2 sm:px-5">

//         <div
//           className="
//             flex
//             min-h-[56px]
//             flex-wrap
//             items-center
//             gap-5
//             rounded-md
//             border
//             border-[#e1e4e9]
//             bg-white
//             px-4
//             shadow-sm
//           "
//         >

//           {/* SEARCH */}

//           <div
//             className="
//               flex
//               min-w-[210px]
//               flex-1
//               items-center
//               gap-3
//             "
//           >

//             <Search
//               size={22}
//               className="text-[#8e99b0]"
//             />

//             <input
//               type="text"
//               value={searchText}
//               onChange={(e) =>
//                 setSearchText(e.target.value)
//               }
//               placeholder="Start Typing..."
//               className="
//                 h-[40px]
//                 w-full
//                 bg-transparent
//                 text-[16px]
//                 text-[#4b5360]
//                 outline-none
//                 placeholder:text-[#b8bec8]
//               "
//             />

//           </div>


//           {/* ADD FILTER */}

//           <button
//             type="button"
//             onClick={() =>
//               setShowFilters(!showFilters)
//             }
//             className="
//               flex
//               shrink-0
//               items-center
//               gap-2
//               text-[17px]
//               text-[#666c76]
//             "
//           >
//             <span className="text-[24px]">
//               +
//             </span>

//             <span>
//               Add Filter
//             </span>
//           </button>


//           {/* QUERY */}

//           <FilterDropdown
//             label="Query"
//             active={activeFilter === "Query"}
//             onClick={() =>
//               handleFilterClick("Query")
//             }
//           />


//           {/* BRANCH */}

//           <FilterDropdown
//             label="Branch"
//             active={activeFilter === "Branch"}
//             onClick={() =>
//               handleFilterClick("Branch")
//             }
//           />


//           {/* SALARY STRUCTURE */}

//           <FilterDropdown
//             label="Salary Structure"
//             active={
//               activeFilter === "Salary Structure"
//             }
//             onClick={() =>
//               handleFilterClick(
//                 "Salary Structure",
//               )
//             }
//           />


//           {/* LEAVE */}

//           <FilterDropdown
//             label="Leave"
//             active={activeFilter === "Leave"}
//             onClick={() =>
//               handleFilterClick("Leave")
//             }
//           />


//           {/* ATTENDANCE */}

//           <FilterDropdown
//             label="Attendance"
//             active={
//               activeFilter === "Attendance"
//             }
//             onClick={() =>
//               handleFilterClick("Attendance")
//             }
//           />


//           {/* DESIGNATION */}

//           <FilterDropdown
//             label="Designation"
//             active={
//               activeFilter === "Designation"
//             }
//             onClick={() =>
//               handleFilterClick(
//                 "Designation",
//               )
//             }
//           />


//           {/* EMP STATUS */}

//           <FilterDropdown
//             label="Emp Status"
//             active={
//               activeFilter === "Emp Status"
//             }
//             onClick={() =>
//               handleFilterClick("Emp Status")
//             }
//           />


//           {/* MORE */}

//           <button
//             type="button"
//             className="
//               flex
//               h-[40px]
//               w-[25px]
//               items-center
//               justify-center
//               text-[#8c96a8]
//             "
//           >
//             <MoreVertical size={21} />
//           </button>


//           {/* CLEAR */}

//           <button
//             type="button"
//             onClick={() => {
//               setSearchText("");
//               setPtState("");
//               setPtGroup("");
//               setActiveFilter(null);
//             }}
//             className="
//               flex
//               h-[40px]
//               w-[25px]
//               items-center
//               justify-center
//               text-[#e33b3b]
//             "
//           >
//             <X size={22} />
//           </button>

//         </div>

//       </div>


//       {/* ====================================================
//           ADVANCE FILTER AREA
//       ==================================================== */}

//       {showFilters && (
//         <div className="px-4 pt-2 sm:px-5">

//           <div
//             className="
//               rounded-md
//               border
//               border-[#dfe3e9]
//               bg-white
//               p-4
//               shadow-sm
//             "
//           >

//             <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-4">

//               <FilterInput
//                 label="Employee ID"
//               />

//               <FilterInput
//                 label="Employee Name"
//               />

//               <FilterInput
//                 label="PT State"
//               />

//               <FilterInput
//                 label="PT Group"
//               />

//             </div>

//           </div>

//         </div>
//       )}


//       {/* ====================================================
//           TABLE
//       ==================================================== */}

//       <div className="px-4 pb-2 pt-3 sm:px-5">

//         <div className="w-full overflow-x-auto">

//           <div className="min-w-[900px]">

//             {/* TABLE HEADER */}

//             <div
//               className="
//                 grid
//                 grid-cols-[1fr_2fr_3fr_2fr_2fr]
//                 items-center
//                 rounded-md
//                 bg-[#d8eaf7]
//                 px-3
//                 py-5
//                 text-[16px]
//                 font-semibold
//                 text-[#17243a]
//               "
//             >

//               <div>
//                 Sl. No.
//               </div>

//               <div>
//                 Emp. ID
//               </div>

//               <div>
//                 Employee Name
//               </div>

//               <div>
//                 PT Gross
//               </div>

//               <div>
//                 PT Deducted
//               </div>

//             </div>


//             {/* TABLE ROWS */}

//             <div className="space-y-3 pt-3">

//               {filteredEmployees.map(
//                 (employee, index) => (
//                   <div
//                     key={employee.id}
//                     className="
//                       grid
//                       grid-cols-[1fr_2fr_3fr_2fr_2fr]
//                       items-center
//                       rounded-md
//                       bg-white
//                       px-3
//                       py-4
//                       text-[16px]
//                       text-[#17243a]
//                       shadow-sm
//                     "
//                   >

//                     <div>
//                       {index + 1}
//                     </div>

//                     <div>
//                       {employee.employeeId}
//                     </div>

//                     <div>
//                       {employee.employeeName}
//                     </div>

//                     <div>
//                       {employee.ptGross.toFixed(2)}
//                     </div>

//                     <div>
//                       {employee.ptDeducted.toFixed(2)}
//                     </div>

//                   </div>
//                 ),
//               )}


//               {/* EMPTY SEARCH RESULT */}

//               {filteredEmployees.length === 0 && (
//                 <div
//                   className="
//                     rounded-md
//                     bg-white
//                     py-10
//                     text-center
//                     text-[15px]
//                     text-[#777]
//                   "
//                 >
//                   No records found
//                 </div>
//               )}

//             </div>


//             {/* =================================================
//                 GRAND TOTAL
//             ================================================= */}

//             <div
//               className="
//                 mt-3
//                 grid
//                 grid-cols-[1fr_2fr_3fr_2fr_2fr]
//                 items-center
//                 rounded-md
//                 bg-[#edf6fc]
//                 px-3
//                 py-7
//                 text-[16px]
//                 font-medium
//                 text-[#17243a]
//               "
//             >

//               <div className="col-span-3">
//                 Grand Total
//               </div>

//               <div>
//                 {totalGross.toFixed(2)}
//               </div>

//               <div>
//                 {totalDeducted.toFixed(2)}
//               </div>

//             </div>

//           </div>

//         </div>

//       </div>


//       {/* ====================================================
//           PAGINATION
//       ==================================================== */}

//       <div className="flex justify-end px-5 pb-5 pt-4">

//         <div
//           className="
//             flex
//             items-center
//             gap-5
//             text-[14px]
//             text-[#343a46]
//           "
//         >

//           <span>
//             Rows per page
//           </span>

//           <div className="flex items-center gap-1">
//             <span>
//               10
//             </span>

//             <ChevronDown size={15} />
//           </div>

//           <span>
//             1 to {filteredEmployees.length} of{" "}
//             {filteredEmployees.length}
//           </span>

//           <button
//             type="button"
//             className="text-[#a5aab3]"
//           >
//             ‹
//           </button>

//           <span
//             className="
//               flex
//               h-8
//               w-8
//               items-center
//               justify-center
//               rounded-full
//               bg-[#edf0f5]
//             "
//           >
//             1
//           </span>

//           <button
//             type="button"
//             className="text-[#707783]"
//           >
//             ›
//           </button>

//         </div>

//       </div>

//     </div>
//   );
// }


// /* ==========================================================
//    SELECT BOX
// ========================================================== */

// interface SelectBoxProps {
//   value: string;
//   onChange: (value: string) => void;
//   options: string[];
//   placeholder?: string;
//   width?: string;
// }

// function SelectBox({
//   value,
//   onChange,
//   options,
//   placeholder,
//   width = "180px",
// }: SelectBoxProps) {
//   return (
//     <div
//       className="relative"
//       style={{ width }}
//     >

//       <select
//         value={value}
//         onChange={(e) =>
//           onChange(e.target.value)
//         }
//         className="
//           h-[48px]
//           w-full
//           appearance-none
//           rounded-md
//           border
//           border-[#e0e3e8]
//           bg-[#f5f6fa]
//           px-4
//           pr-10
//           text-[16px]
//           text-[#343b48]
//           outline-none
//           focus:border-[#2097df]
//         "
//       >

//         {placeholder && (
//           <option value="">
//             {placeholder}
//           </option>
//         )}

//         {options.map((option) => (
//           <option
//             key={option}
//             value={option}
//           >
//             {option}
//           </option>
//         ))}

//       </select>

//       <ChevronDown
//         size={16}
//         className="
//           pointer-events-none
//           absolute
//           right-3
//           top-1/2
//           -translate-y-1/2
//           text-[#8a93a3]
//         "
//       />

//     </div>
//   );
// }


// /* ==========================================================
//    FILTER DROPDOWN
// ========================================================== */

// interface FilterDropdownProps {
//   label: string;
//   active: boolean;
//   onClick: () => void;
// }

// function FilterDropdown({
//   label,
//   active,
//   onClick,
// }: FilterDropdownProps) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={`
//         flex
//         shrink-0
//         items-center
//         gap-1
//         text-[16px]
//         ${
//           active
//             ? "text-[#168ed2]"
//             : "text-[#666c76]"
//         }
//       `}
//     >

//       <span>
//         {label}
//       </span>

//       <ChevronDown size={15} />

//     </button>
//   );
// }


// /* ==========================================================
//    FILTER INPUT
// ========================================================== */

// interface FilterInputProps {
//   label: string;
// }

// function FilterInput({
//   label,
// }: FilterInputProps) {
//   return (
//     <div>

//       <label
//         className="
//           mb-1
//           block
//           text-[13px]
//           font-medium
//           text-[#555d68]
//         "
//       >
//         {label}
//       </label>

//       <input
//         type="text"
//         className="
//           h-[40px]
//           w-full
//           rounded-md
//           border
//           border-[#dfe3e9]
//           bg-white
//           px-3
//           text-[14px]
//           outline-none
//           focus:border-[#2097df]
//         "
//       />

//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  ChevronDown,
  Filter,
  MoreVertical,
  Search,
  X,
  FileSpreadsheet,
  Clock3,
  FileDown,
} from "lucide-react";

/* ==========================================================
   TYPES
========================================================== */

interface PTEmployee {
  id: number;
  employeeId: string;
  employeeName: string;
  ptGross: number;
  ptDeducted: number;
}

/* ==========================================================
   SAMPLE TABLE DATA
========================================================== */

const EMPLOYEE_DATA: PTEmployee[] = [
  {
    id: 1,
    employeeId: "294621",
    employeeName: "Rama Veera Manikanta Pusunuri",
    ptGross: 34576,
    ptDeducted: 200,
  },
  {
    id: 2,
    employeeId: "294639",
    employeeName: "Prathyusha Reddy",
    ptGross: 34576,
    ptDeducted: 200,
  },
  {
    id: 3,
    employeeId: "294640",
    employeeName: "BHAGYARAJA AVURAPALLI",
    ptGross: 93510,
    ptDeducted: 200,
  },
];

/* ==========================================================
   MAIN COMPONENT
========================================================== */

export default function PTMonthlyReportPage() {
  const navigate = useNavigate();

  const [month, setMonth] = useState("Sep/2026");
  const [ptState, setPtState] = useState("");
  const [ptGroup, setPtGroup] = useState("");

  const [searchText, setSearchText] = useState("");

  const [activeFilter, setActiveFilter] = useState<string | null>(
    null,
  );

  const [showFilters, setShowFilters] = useState(false);

  /* ========================================================
     SEARCH
  ======================================================== */

  const filteredEmployees = EMPLOYEE_DATA.filter((employee) => {
    const search = searchText.toLowerCase().trim();

    if (!search) {
      return true;
    }

    return (
      employee.employeeId.toLowerCase().includes(search) ||
      employee.employeeName.toLowerCase().includes(search)
    );
  });

  /* ========================================================
     TOTALS
  ======================================================== */

  const totalGross = filteredEmployees.reduce(
    (total, employee) => total + employee.ptGross,
    0,
  );

  const totalDeducted = filteredEmployees.reduce(
    (total, employee) => total + employee.ptDeducted,
    0,
  );

  /* ========================================================
     NAVIGATION
  ======================================================== */

  const goToPF = () => {
    navigate("../pf");
  };

  const goToESI = () => {
    navigate("../esi");
  };

  const goToLWF = () => {
    navigate("../lwf");
  };

  const goToPT = () => {
    navigate("../pt");
  };

  const handleBack = () => {
    navigate("../pt");
  };

  /* ========================================================
     FILTER HANDLER
  ======================================================== */

  const handleFilterClick = (filter: string) => {
    setActiveFilter(
      activeFilter === filter ? null : filter,
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f7fb]">

      {/* ====================================================
          TOP REPORT NAVIGATION
      ==================================================== */}

      <div className="px-4 pt-4 sm:px-5">

        <div
          className="
            flex
            min-h-[58px]
            w-full
            items-center
            gap-3
            overflow-x-auto
            rounded-xl
            border-2
            border-[#ddb6a8]
            bg-[#fffaf8]
            px-3
            py-2
          "
        >

          {/* PF REPORT */}

          <button
            type="button"
            onClick={goToPF}
            className="
              flex
              h-[38px]
              shrink-0
              items-center
              gap-2
              rounded-xl
              border
              border-[#ddb3a3]
              bg-white
              px-4
              text-[14px]
              font-medium
              text-[#754536]
              shadow-sm
            "
          >
            <span className="text-[17px]">
              ♧
            </span>

            <span>
              PF Report
            </span>
          </button>

          {/* ESI REPORT */}

          <button
            type="button"
            onClick={goToESI}
            className="
              flex
              h-[38px]
              shrink-0
              items-center
              gap-2
              rounded-xl
              border
              border-[#ded9d6]
              bg-white
              px-4
              text-[14px]
              font-medium
              text-[#754536]
              shadow-sm
            "
          >
            <span className="text-[18px]">
              +
            </span>

            <span>
              ESI Report
            </span>
          </button>

          {/* LWF REPORT */}

          <button
            type="button"
            onClick={goToLWF}
            className="
              flex
              h-[38px]
              shrink-0
              items-center
              gap-2
              rounded-xl
              border
              border-[#ded9d6]
              bg-white
              px-4
              text-[14px]
              font-medium
              text-[#754536]
              shadow-sm
            "
          >
            <span className="text-[17px]">
              ♧
            </span>

            <span>
              LWF Report
            </span>
          </button>

          {/* PT REPORT - ACTIVE */}

          <button
            type="button"
            onClick={goToPT}
            className="
              flex
              h-[38px]
              shrink-0
              items-center
              gap-2
              rounded-xl
              border
              border-[#d9a996]
              bg-white
              px-4
              text-[14px]
              font-medium
              text-[#754536]
              shadow-sm
            "
          >
            <span className="text-[16px]">
              ₹
            </span>

            <span>
              PT Report
            </span>
          </button>

          {/* RIGHT FILTER ICON */}

          <div className="ml-auto flex shrink-0 items-center px-2">
            <Filter
              size={21}
              strokeWidth={1.8}
              className="text-[#8e8b89]"
            />
          </div>

        </div>

      </div>

      {/* ====================================================
          REPORT HEADER
      ==================================================== */}

      <div className="px-4 pt-3 sm:px-5">

        <div
          className="
            flex
            min-h-[64px]
            w-full
            flex-wrap
            items-center
            justify-end
            gap-2
            rounded-xl
            border
            border-[#d9dde2]
            bg-white
            px-4
            shadow-sm
          "
        >

          {/* TITLE */}

          <div className="mr-auto">

            <div
              className="
                border-b-[3px]
                border-[#9a5a46]
                pb-[10px]
                pt-[5px]
              "
            >

              <h1
                className="
                  text-[17px]
                  font-semibold
                  text-[#8b4d3b]
                "
              >
                PT Monthly Report
              </h1>

            </div>

          </div>

          {/* BACK */}

          <button
            type="button"
            onClick={handleBack}
            className="
              flex
              h-[42px]
              items-center
              gap-2
              rounded-lg
              border
              border-[#d5d1ce]
              bg-white
              px-4
              text-[14px]
              font-medium
              text-[#625d59]
              shadow-sm
            "
          >
            <ArrowLeft
              size={18}
              strokeWidth={1.8}
            />

            <span>
              Back
            </span>
          </button>

          {/* MONTH */}

          <SelectBox
            value={month}
            onChange={setMonth}
            options={[
              "Sep/2026",
              "Aug/2026",
              "Jul/2026",
              "Jun/2026",
            ]}
            width="155px"
          />

          {/* PT STATE */}

          <SelectBox
            value={ptState}
            onChange={setPtState}
            placeholder="Select PT state"
            options={[
              "Andhra Pradesh",
              "Goa",
              "Gujarat",
              "Karnataka",
              "Maharashtra",
              "Telangana",
            ]}
            width="175px"
          />

          {/* PT GROUP */}

          <SelectBox
            value={ptGroup}
            onChange={setPtGroup}
            placeholder="Select PT Group"
            options={[
              "Group 1",
              "Group 2",
              "Group 3",
            ]}
            width="175px"
          />

          {/* ADVANCE FILTER */}

          <button
            type="button"
            onClick={() =>
              setShowFilters(!showFilters)
            }
            className="
              flex
              h-[42px]
              items-center
              gap-2
              rounded-lg
              border
              border-[#d7aa99]
              bg-[#fff8f5]
              px-4
              text-[14px]
              font-semibold
              text-[#754536]
              shadow-sm
            "
          >
            <Filter size={17} />

            <span>
              Advance Filter
            </span>
          </button>

          {/* PDF */}

          <button
            type="button"
            title="PDF"
            className="
              flex
              h-[42px]
              w-[34px]
              items-center
              justify-center
              text-[#c94b42]
            "
          >
            <FileDown size={20} />
          </button>

          {/* EXCEL */}

          <button
            type="button"
            title="Excel"
            className="
              flex
              h-[42px]
              w-[34px]
              items-center
              justify-center
              text-[#368c4b]
            "
          >
            <FileSpreadsheet size={20} />
          </button>

          {/* HISTORY */}

          <button
            type="button"
            title="History"
            className="
              flex
              h-[42px]
              w-[34px]
              items-center
              justify-center
              text-[#8d8a87]
            "
          >
            <Clock3 size={19} />
          </button>

        </div>

      </div>

      {/* ====================================================
          FILTER BAR
      ==================================================== */}

      <div className="px-4 pt-2 sm:px-5">

        <div
          className="
            flex
            min-h-[54px]
            w-full
            flex-wrap
            items-center
            gap-5
            rounded-xl
            border
            border-[#d9dde2]
            bg-white
            px-4
            shadow-sm
          "
        >

          {/* SEARCH */}

          <div
            className="
              flex
              min-w-[190px]
              flex-1
              items-center
              gap-2
            "
          >

            <Search
              size={19}
              strokeWidth={1.8}
              className="text-[#9a9a9a]"
            />

            <input
              type="text"
              value={searchText}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
              placeholder="Start Typing..."
              className="
                h-[38px]
                w-full
                bg-transparent
                text-[14px]
                text-[#514f4d]
                outline-none
                placeholder:text-[#b4b1ae]
              "
            />

          </div>

          {/* ADD FILTER */}

          <button
            type="button"
            onClick={() =>
              setShowFilters(!showFilters)
            }
            className="
              flex
              shrink-0
              items-center
              gap-2
              text-[14px]
              font-medium
              text-[#665f5b]
            "
          >
            <span className="text-[21px]">
              +
            </span>

            <span>
              Add Filter
            </span>
          </button>

          {/* QUERY */}

          <FilterDropdown
            label="Query"
            active={activeFilter === "Query"}
            onClick={() =>
              handleFilterClick("Query")
            }
          />

          {/* BRANCH */}

          <FilterDropdown
            label="Branch"
            active={activeFilter === "Branch"}
            onClick={() =>
              handleFilterClick("Branch")
            }
          />

          {/* SALARY STRUCTURE */}

          <FilterDropdown
            label="Salary Structure"
            active={
              activeFilter === "Salary Structure"
            }
            onClick={() =>
              handleFilterClick(
                "Salary Structure",
              )
            }
          />

          {/* LEAVE */}

          <FilterDropdown
            label="Leave"
            active={activeFilter === "Leave"}
            onClick={() =>
              handleFilterClick("Leave")
            }
          />

          {/* ATTENDANCE */}

          <FilterDropdown
            label="Attendance"
            active={
              activeFilter === "Attendance"
            }
            onClick={() =>
              handleFilterClick("Attendance")
            }
          />

          {/* DESIGNATION */}

          <FilterDropdown
            label="Designation"
            active={
              activeFilter === "Designation"
            }
            onClick={() =>
              handleFilterClick("Designation")
            }
          />

          {/* EMP STATUS */}

          <FilterDropdown
            label="Emp Status"
            active={
              activeFilter === "Emp Status"
            }
            onClick={() =>
              handleFilterClick("Emp Status")
            }
          />

          {/* MORE */}

          <button
            type="button"
            className="
              flex
              h-[35px]
              w-[25px]
              items-center
              justify-center
              text-[#8d8884]
            "
          >
            <MoreVertical size={19} />
          </button>

          {/* CLEAR */}

          <button
            type="button"
            onClick={() => {
              setSearchText("");
              setPtState("");
              setPtGroup("");
              setActiveFilter(null);
            }}
            className="
              flex
              h-[35px]
              w-[25px]
              items-center
              justify-center
              text-[#d14b43]
            "
          >
            <X size={20} />
          </button>

        </div>

      </div>

      {/* ====================================================
          ADVANCE FILTER AREA
      ==================================================== */}

      {showFilters && (
        <div className="px-4 pt-2 sm:px-5">

          <div
            className="
              rounded-xl
              border
              border-[#ddd9d6]
              bg-white
              p-4
              shadow-sm
            "
          >

            <div
              className="
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-3
                lg:grid-cols-4
              "
            >

              <FilterInput
                label="Employee ID"
              />

              <FilterInput
                label="Employee Name"
              />

              <FilterInput
                label="PT State"
              />

              <FilterInput
                label="PT Group"
              />

            </div>

          </div>

        </div>
      )}

      {/* ====================================================
          TABLE
      ==================================================== */}

      <div className="px-4 pb-2 pt-3 sm:px-5">

        <div className="w-full overflow-x-auto">

          <div className="min-w-[900px]">

            {/* TABLE HEADER */}

            <div
              className="
                grid
                grid-cols-[1fr_2fr_4fr_2fr_2fr]
                items-center
                rounded-xl
                border
                border-[#d7dadd]
                bg-[#eef0f1]
                px-4
                py-4
                text-[14px]
                font-semibold
                text-[#754536]
              "
            >

              <div>
                Sl. No.
              </div>

              <div>
                Emp. ID
              </div>

              <div>
                Employee Name
              </div>

              <div>
                PT Gross
              </div>

              <div>
                PT Deducted
              </div>

            </div>

            {/* TABLE ROWS */}

            <div className="space-y-2 pt-2">

              {filteredEmployees.map(
                (employee, index) => (
                  <div
                    key={employee.id}
                    className="
                      grid
                      grid-cols-[1fr_2fr_4fr_2fr_2fr]
                      items-center
                      rounded-xl
                      border
                      border-[#e2e2e2]
                      bg-white
                      px-4
                      py-4
                      text-[14px]
                      text-[#344052]
                      shadow-sm
                    "
                  >

                    <div>
                      {index + 1}
                    </div>

                    <div>
                      {employee.employeeId}
                    </div>

                    <div>
                      {employee.employeeName}
                    </div>

                    <div>
                      {employee.ptGross.toFixed(2)}
                    </div>

                    <div>
                      {employee.ptDeducted.toFixed(2)}
                    </div>

                  </div>
                ),
              )}

              {/* EMPTY RESULT */}

              {filteredEmployees.length === 0 && (
                <div
                  className="
                    rounded-xl
                    border
                    border-[#e2e2e2]
                    bg-white
                    py-10
                    text-center
                    text-[14px]
                    text-[#777]
                  "
                >
                  No records found
                </div>
              )}

            </div>

            {/* =================================================
                GRAND TOTAL
            ================================================= */}

            <div
              className="
                mt-2
                grid
                grid-cols-[1fr_2fr_4fr_2fr_2fr]
                items-center
                rounded-xl
                border
                border-[#dddfe1]
                bg-[#f0f4f6]
                px-4
                py-6
                text-[14px]
                font-semibold
                text-[#344052]
              "
            >

              <div className="col-span-3">
                Grand Total
              </div>

              <div>
                {totalGross.toFixed(2)}
              </div>

              <div>
                {totalDeducted.toFixed(2)}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ====================================================
          PAGINATION
      ==================================================== */}

      <div className="flex justify-end px-5 pb-5 pt-3">

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-4
            text-[13px]
            text-[#55514e]
          "
        >

          <span>
            Rows per page
          </span>

          <div className="flex items-center gap-1">
            <span>
              10
            </span>

            <ChevronDown
              size={14}
              className="text-[#77716d]"
            />
          </div>

          <span>
            1 to {filteredEmployees.length} of{" "}
            {filteredEmployees.length}
          </span>

          <button
            type="button"
            className="text-[#aaa5a1]"
          >
            ‹
          </button>

          <span
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-[#f0efed]
              text-[#625e5a]
            "
          >
            1
          </span>

          <button
            type="button"
            className="text-[#77716d]"
          >
            ›
          </button>

        </div>

      </div>

    </div>
  );
}

/* ==========================================================
   SELECT BOX
========================================================== */

interface SelectBoxProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  width?: string;
}

function SelectBox({
  value,
  onChange,
  options,
  placeholder,
  width = "180px",
}: SelectBoxProps) {
  return (
    <div
      className="relative shrink-0"
      style={{ width }}
    >

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="
          h-[42px]
          w-full
          appearance-none
          rounded-lg
          border
          border-[#dedbd8]
          bg-[#f6f5f3]
          px-3
          pr-9
          text-[14px]
          text-[#514f4d]
          outline-none
          focus:border-[#c99b8b]
        "
      >

        {placeholder && (
          <option value="">
            {placeholder}
          </option>
        )}

        {options.map((option) => (
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
          right-3
          top-1/2
          -translate-y-1/2
          text-[#77716d]
        "
      />

    </div>
  );
}

/* ==========================================================
   FILTER DROPDOWN
========================================================== */

interface FilterDropdownProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterDropdown({
  label,
  active,
  onClick,
}: FilterDropdownProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex
        shrink-0
        items-center
        gap-1
        text-[14px]
        font-medium
        ${
          active
            ? "text-[#8b4d3b]"
            : "text-[#625e5a]"
        }
      `}
    >

      <span>
        {label}
      </span>

      <ChevronDown size={14} />

    </button>
  );
}

/* ==========================================================
   FILTER INPUT
========================================================== */

interface FilterInputProps {
  label: string;
}

function FilterInput({
  label,
}: FilterInputProps) {
  return (
    <div>

      <label
        className="
          mb-1
          block
          text-[13px]
          font-medium
          text-[#625e5a]
        "
      >
        {label}
      </label>

      <input
        type="text"
        className="
          h-[40px]
          w-full
          rounded-lg
          border
          border-[#dedbd8]
          bg-white
          px-3
          text-[14px]
          text-[#514f4d]
          outline-none
          focus:border-[#c99b8b]
        "
      />

    </div>
  );
}
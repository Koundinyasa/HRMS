// import { useMemo, useState } from "react";

// import {
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
//   Plus,
//   Search,
//   Trash2,
//   ArrowUp,
//   ArrowDown,
//   Bookmark,
// } from "lucide-react";

// const FIELD_TABS = [
//   "Employee Details",
//   "Classification Details",
//   "HR Category",
//   "Leave",
//   "Salary",
//   "Theo. Salary",
//   "Salary Rate",
// ];

// const EMPLOYEE_FIELDS = [
//   "Ref No",
//   "Empname",
//   "Email",
//   "Official Mail Id",
//   "Father Name",
//   "Last Name",
//   "Middle Name",
//   "First Name",
//   "Mobile",
//   "Alt Mobile",
//   "Emergency Contact No",
//   "Remarks",
//   "Leaving Reason",
//   "Spouse Name",
//   "Employee Title",
//   "Note",
//   "Retirement Date",
//   "Resignation Date",
//   "PF Applicable",
//   "Zero PT",
//   "ESI Applicable",
//   "Restrict Employee PF",
//   "Restrict PF",
//   "Zero Pension",
// ];

// const CLASSIFICATION_FIELDS = [
//   "Department",
//   "Team",
//   "Branch Name",
//   "Leave Policy",
//   "Salary Structure",
//   "Attendance Structure",
//   "Designation",
//   "Bank",
//   "IFSC Code",
//   "Account Number",
//   "Time Sheet Policy",
//   "Cost Center",
// ];

// const HR_CATEGORY_FIELDS = [
//   "Blood Group",
//   "Nationality",
//   "Issued At",
//   "Issued date",
//   "Expiry Date",
//   "Name Of Relative",
//   "Relation",
//   "Remarks",
//   "Date Of Birth",
//   "Dependent",
//   "Nominee",
//   "Nomination%",
//   "Nominee Address",
//   "University",
//   "Qualification",
//   "Driving Lic No",
//   "Number",
//   "Caste Category",
// ];

// const LEAVE_FIELDS = [
//   "compensatory_off",
//   "compensatory_work",
//   "loss_of_pay",
//   "on_official_duty",
//   "casual_leave",
//   "sick_leave",
//   "restricted_holiday",
//   "medical_wellness_leave",
//   "medical_wellness_leave.",
// ];

// const SALARY_FIELDS = [
//   "Pay Days",
//   "Present Days",
//   "Calender Days",
//   "Ctc Total",
//   "Gross salary",
//   "Earning Total",
//   "Deduction Total",
//   "Net Amount",
//   "PF Earning",
//   "ESI Earning",
//   "OT2",
//   "OT2 units",
//   "OT2 rates",
//   "Basic",
//   "OT1",
//   "OT1 units",
//   "OT1 rates",
//   "EmployerPFEarnings",
//   "TDS Earning",
//   "Special Allow",
//   "SuppF Earning",
//   "SupESI Earning",
//   "SupPT Earning",
//   "SupCmpESI",
//   "TdsIndp",
//   "TDS OtherEarnings",
//   "HRA",
//   "Conv. Allow.",
//   "Statutory Bonus",
//   "EdliWages",
//   "PensionWages",
//   "Account01",
//   "Account02",
//   "IndpSupPT",
//   "SupCmpEPF",
//   "SupCmpPension",
//   "Insurance",
//   "Health Ins.",
//   "Other Deduction",
//   "Medical Benefit",
//   "Employer PF",
//   "IndpSupCmpEPF",
//   "IndpSupCmpPension",
//   "DupEdliWages",
//   "DupPensionWages",
//   "DupAccount01",
//   "DupAccount02",
//   "DupAccount10",
//   "DupAccount21",
//   "DupAccount22",
// ];

// const THEO_SALARY_FIELDS = [
//   "Basic",
//   "Special Allow",
//   "HRA",
//   "Conv. Allow.",
//   "Statutory Bonus",
//   "Annual CTC",
//   "Monthly CTC",
//   "Holiday Allow",
//   "Food Wallet",
//   "Compensatory AI",
//   "Net Monthly",
//   "Danny",
//   "Percentage - NA",
//   "Health Ins.",
//   "Other Deduction",
//   "Medical Benefit",
//   "Employer PF",
// ];

// const SALARY_RATE_FIELDS = [
//   "Basic",
//   "OT1",
//   "Special Allow",
//   "HRA",
//   "Conv Allow",
//   "Statutory",
//   "Annual CTC",
//   "Monthly CTC",
//   "Holiday",
//   "Food Wallet",
//   "Compensatory AI",
//   "Net Monthly",
//   "Danny",
//   "Percentage-NA",
//   "Health Ins",
//   "Other Deduction",
//   "Medical Benefit",
//   "Employer PF",
// ];

// const FIELD_MAP: Record<string, string[]> = {
//   "Employee Details": EMPLOYEE_FIELDS,
//   "Classification Details": CLASSIFICATION_FIELDS,
//   "HR Category": HR_CATEGORY_FIELDS,
//   Leave: LEAVE_FIELDS,
//   Salary: SALARY_FIELDS,
//   "Theo. Salary": THEO_SALARY_FIELDS,
//   "Salary Rate": SALARY_RATE_FIELDS,
// };

// type SelectedField = {
//   id: string;
//   label: string;
// };

// export default function FormMasterPage() {
//   const [activeStep, setActiveStep] =
//     useState("Step 1 - Settings");

//   const [activeFieldTab, setActiveFieldTab] =
//     useState("Salary Rate");

//   const [documentName, setDocumentName] =
//     useState("Employee Audit Report_v2");

//   const [formatType, setFormatType] =
//     useState("");

//   const [moduleType, setModuleType] =
//     useState("");

//   const [allCompany, setAllCompany] =
//     useState(false);

//   const [searchText, setSearchText] =
//     useState("");

//   const [showExpression, setShowExpression] =
//     useState(false);

//   const [groupBy, setGroupBy] =
//     useState("");

//   const [orderBy, setOrderBy] =
//     useState("");

//   const [selectedFields, setSelectedFields] =
//     useState<SelectedField[]>([
//       {
//         id: "ref-no",
//         label: "Ref No",
//       },
//       {
//         id: "empname",
//         label: "Empname",
//       },
//       {
//         id: "month-name",
//         label: "Month Name",
//       },
//       {
//         id: "official-mail-id",
//         label: "Official Mail ID",
//       },
//     ]);

//   const currentFields =
//     FIELD_MAP[activeFieldTab] ?? [];

//   const filteredFields = useMemo(() => {
//     const search =
//       searchText.trim().toLowerCase();

//     if (!search) {
//       return currentFields;
//     }

//     return currentFields.filter((field) =>
//       field.toLowerCase().includes(search)
//     );
//   }, [activeFieldTab, currentFields, searchText]);

//   /* =====================================================
//      SELECT / UNSELECT FIELD
//   ===================================================== */

//   const toggleField = (field: string) => {
//     const exists = selectedFields.some(
//       (item) => item.label === field
//     );

//     if (exists) {
//       setSelectedFields((previous) =>
//         previous.filter(
//           (item) => item.label !== field
//         )
//       );

//       return;
//     }

//     setSelectedFields((previous) => [
//       ...previous,
//       {
//         id: `${field}-${Date.now()}`,
//         label: field,
//       },
//     ]);
//   };

//   /* =====================================================
//      MOVE SELECTED FIELD UP
//   ===================================================== */

//   const moveUp = (index: number) => {
//     if (index === 0) {
//       return;
//     }

//     setSelectedFields((previous) => {
//       const next = [...previous];

//       const current = next[index];

//       next[index] = next[index - 1];
//       next[index - 1] = current;

//       return next;
//     });
//   };

//   /* =====================================================
//      MOVE SELECTED FIELD DOWN
//   ===================================================== */

//   const moveDown = (index: number) => {
//     setSelectedFields((previous) => {
//       if (index === previous.length - 1) {
//         return previous;
//       }

//       const next = [...previous];

//       const current = next[index];

//       next[index] = next[index + 1];
//       next[index + 1] = current;

//       return next;
//     });
//   };

//   /* =====================================================
//      REMOVE SELECTED FIELD
//   ===================================================== */

//   const removeSelected = (index: number) => {
//     setSelectedFields((previous) =>
//       previous.filter(
//         (_, itemIndex) =>
//           itemIndex !== index
//       )
//     );
//   };

//   return (
//     <div
//       className="
//         min-h-screen
//         w-full
//         overflow-x-hidden
//         bg-[#f4f7fb]
//         p-0
//       "
//     >

//       {/* =====================================================
//           MAIN CONTENT
//       ===================================================== */}

//       <div
//         className="
//           mt-2
//           grid
//           grid-cols-1
//           gap-[14px]
//           xl:grid-cols-[236px_minmax(0,1fr)_315px]
//           xl:items-start
//         "
//       >

//         {/* ===================================================
//             CREATE DOCUMENT SIDEBAR
//         =================================================== */}

//         <aside
//           className="
//             min-h-[calc(100vh-8px)]
//             rounded-[12px]
//             border
//             border-[#d9d9d9]
//             bg-white
//             shadow-sm
//           "
//         >

//           <div
//             className="
//               flex
//               h-[61px]
//               items-center
//               justify-between
//               border-b
//               border-[#d9d9d9]
//               px-3
//             "
//           >

//             <h2
//               className="
//                 text-[16px]
//                 font-semibold
//                 text-[#263238]
//               "
//             >
//               Create Document
//             </h2>

//             <button
//               type="button"
//               className="
//                 flex
//                 h-[40px]
//                 w-[40px]
//                 items-center
//                 justify-center
//                 rounded-lg
//                 border
//                 border-[#b17869]
//                 text-[#8f5142]
//                 hover:bg-[#fff8f5]
//               "
//             >
//               <Plus size={24} />
//             </button>

//           </div>

//         </aside>




//         {/* ===================================================
//             CENTER FORM MASTER CONTENT
//         =================================================== */}

//         <div className="min-w-0">

//           <div
//             className="
//               rounded-[10px]
//               border
//               border-[#d9d9d9]
//               bg-white
//               p-2
//               shadow-sm
//             "
//           >
//           {/* =================================================
//               STEPS
//           ================================================= */}

//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-1
//               rounded-[10px]
//               border
//               border-[#e2e2e2]
//               bg-white
//               p-1
//               md:grid-cols-3
//             "
//           >

//             {[
//               "Step 1 - Settings",
//               "Step 2 - Email Settings",
//               "Design Step - Design Document (Word)",
//             ].map((step) => (
//               <button
//                 key={step}
//                 type="button"
//                 onClick={() =>
//                   setActiveStep(step)
//                 }
//                 className={`
//                   min-h-[40px]
//                   rounded-[7px]
//                   border
//                   px-3
//                   text-[15px]
//                   font-medium
//                   transition

//                   ${
//                     activeStep === step
//                       ? "border-[#b17869] bg-white text-[#956050]"
//                       : "border-transparent bg-white text-[#555]"
//                   }
//                 `}
//               >
//                 {step}
//               </button>
//             ))}

//           </div>



//           </div>

//           <main
//             className="
//               mt-[28px]
//               min-w-0
//               rounded-[12px]
//               border
//               border-[#d9d9d9]
//               bg-white
//               p-3
//               shadow-[0_2px_7px_rgba(0,0,0,0.12)]
//             "
//           >
//           {/* =================================================
//               DOCUMENT SETTINGS
//           ================================================= */}

//           <div
//             className="
//               mt-3
//               grid
//               grid-cols-1
//               gap-3
//               lg:grid-cols-[minmax(0,1fr)_220px_220px_180px]
//               lg:items-end
//             "
//           >

//             {/* DOCUMENT NAME */}

//             <div className="min-w-0">
//               <label className="mb-1 block text-[12px] font-medium text-[#333]">
//                 Document Name<span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={documentName}
//                 onChange={(event) =>
//                   setDocumentName(event.target.value)
//                 }
//                 placeholder="Document Name..."
//                 className="
//                   h-[40px]
//                   w-full
//                   rounded-md
//                   border
//                   border-[#bfc4c8]
//                   px-3
//                   text-[13px]
//                   text-[#455a64]
//                   outline-none
//                   focus:border-[#b17869]
//                   focus:ring-1
//                   focus:ring-[#b17869]
//                 "
//               />
//             </div>


//             {/* FORMAT TYPE */}

//             <div className="relative">

//               <select
//                 value={formatType}
//                 onChange={(event) =>
//                   setFormatType(event.target.value)
//                 }
//                 className="
//                   h-[40px]
//                   w-full
//                   appearance-none
//                   rounded-md
//                   border
//                   border-[#e3e7eb]
//                   bg-white
//                   px-4
//                   pr-9
//                   text-[14px]
//                   text-[#555]
//                   outline-none
//                   focus:border-[#b17869]
//                 "
//               >
//                 <option value="">
//                   Select Format Type
//                 </option>

//                 <option value="word">
//                   Word
//                 </option>

//                 <option value="pdf">
//                   PDF
//                 </option>

//               </select>

//               <ChevronDown
//                 size={16}
//                 className="
//                   pointer-events-none
//                   absolute
//                   right-3
//                   top-1/2
//                   -translate-y-1/2
//                   text-[#666]
//                 "
//               />

//             </div>


//             {/* MODULE TYPE */}

//             <div className="relative">

//               <select
//                 value={moduleType}
//                 onChange={(event) =>
//                   setModuleType(event.target.value)
//                 }
//                 className="
//                   h-[40px]
//                   w-full
//                   appearance-none
//                   rounded-md
//                   border
//                   border-[#e3e7eb]
//                   bg-white
//                   px-4
//                   pr-9
//                   text-[14px]
//                   text-[#555]
//                   outline-none
//                   focus:border-[#b17869]
//                 "
//               >
//                 <option value="">
//                   Select module Type
//                 </option>

//                 <option value="employee">
//                   Employee
//                 </option>

//                 <option value="salary">
//                   Salary
//                 </option>

//                 <option value="leave">
//                   Leave
//                 </option>

//               </select>

//               <ChevronDown
//                 size={16}
//                 className="
//                   pointer-events-none
//                   absolute
//                   right-3
//                   top-1/2
//                   -translate-y-1/2
//                   text-[#666]
//                 "
//               />

//             </div>


//             {/* ALL COMPANY */}

//             <label
//               className="
//                 flex
//                 h-[40px]
//                 items-center
//                 gap-2
//                 whitespace-nowrap
//                 text-[14px]
//                 text-[#455a64]
//               "
//             >

//               <input
//                 type="checkbox"
//                 checked={allCompany}
//                 onChange={(event) =>
//                   setAllCompany(event.target.checked)
//                 }
//                 className="
//                   h-[18px]
//                   w-[18px]
//                   accent-[#8f5142]
//                 "
//               />

//               for All Company

//             </label>

//           </div>



//           {/* =================================================
//               ADD FIELDS HEADER
//           ================================================= */}

//           <div
//             className="
//               mt-4
//               flex
//               items-center
//               justify-between
//               gap-3
//               border-b
//               border-[#e5e7eb]
//               pb-3
//             "
//           >

//             <h2
//               className="
//                 text-[17px]
//                 font-semibold
//                 text-[#263238]
//               "
//             >
//               Add fields and prioritize
//             </h2>

//             <button
//               type="button"
//               onClick={() =>
//                 setShowExpression(true)
//               }
//               className="
//                 flex
//                 items-center
//                 gap-1
//                 text-[14px]
//                 font-semibold
//                 text-[#955847]
//               "
//             >
//               <Plus size={17} />

//               Add Expression
//             </button>

//           </div>




//             <div
//               className="
//                 mt-3
//                 min-w-0
//               "
//             >
//             <section
//               className="
//                 min-w-0
//                 overflow-hidden
//                 rounded-md
//                 border
//                 border-[#e3e7eb]
//               "
//             >

//               {/* FIELD TABS */}

//               <div
//                 className="
//                   flex
//                   h-[46px]
//                   items-center
//                   overflow-x-auto
//                   border-b
//                   border-[#e5e7eb]
//                 "
//               >

//                 <button
//                   type="button"
//                   className="
//                     flex
//                     h-full
//                     w-[42px]
//                     shrink-0
//                     items-center
//                     justify-center
//                     text-[#777]
//                   "
//                 >
//                   <ChevronLeft size={18} />
//                 </button>

//                 {FIELD_TABS.map((tab) => {
//                   const active =
//                     activeFieldTab === tab;

//                   return (
//                     <button
//                       key={tab}
//                       type="button"
//                       onClick={() =>
//                         setActiveFieldTab(tab)
//                       }
//                       className={`
//                         relative
//                         flex
//                         h-full
//                         shrink-0
//                         items-center
//                         px-4
//                         text-[13px]
//                         font-medium
//                         whitespace-nowrap

//                         ${
//                           active
//                             ? "bg-[#fff8f5] text-[#956050]"
//                             : "text-[#444]"
//                         }
//                       `}
//                     >

//                       {tab}

//                       {active && (
//                         <span
//                           className="
//                             absolute
//                             bottom-0
//                             left-0
//                             right-0
//                             h-[2px]
//                             bg-[#b17869]
//                           "
//                         />
//                       )}

//                     </button>
//                   );
//                 })}

//                 <button
//                   type="button"
//                   className="
//                     flex
//                     h-full
//                     w-[42px]
//                     shrink-0
//                     items-center
//                     justify-center
//                     text-[#777]
//                   "
//                 >
//                   <ChevronRight size={18} />
//                 </button>

//               </div>


//               {/* SEARCH + SELECTED COUNT */}

//               <div
//                 className="
//                   flex
//                   items-center
//                   justify-between
//                   gap-3
//                   px-3
//                   py-2
//                 "
//               >

//                 <div className="relative w-[250px]">

//                   <Search
//                     size={17}
//                     className="
//                       pointer-events-none
//                       absolute
//                       left-3
//                       top-1/2
//                       -translate-y-1/2
//                       text-[#8b96a1]
//                     "
//                   />

//                   <input
//                     type="text"
//                     value={searchText}
//                     onChange={(event) =>
//                       setSearchText(event.target.value)
//                     }
//                     placeholder="Search..."
//                     className="
//                       h-[34px]
//                       w-full
//                       rounded-md
//                       border
//                       border-[#dfe5eb]
//                       pl-9
//                       pr-3
//                       text-[12px]
//                       outline-none
//                       focus:border-[#b17869]
//                     "
//                   />

//                 </div>


//                 <div
//                   className="
//                     flex
//                     shrink-0
//                     items-center
//                     gap-2
//                     text-[13px]
//                     font-medium
//                     text-[#333]
//                   "
//                 >

//                   <span
//                     className="
//                       flex
//                       h-[18px]
//                       w-[18px]
//                       items-center
//                       justify-center
//                       rounded-[4px]
//                       bg-[#8f5142]
//                     "
//                   >
//                     <svg
//                       width="12"
//                       height="12"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="white"
//                       strokeWidth="3"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     >
//                       <path d="M5 12l4 4L19 8" />
//                     </svg>
//                   </span>

//                   Selected Columns :{" "}
//                   {selectedFields.length}

//                 </div>

//               </div>


//               {/* =================================================
//                   FIELD LIST
//               ================================================= */}

//               <div
//                 className="
//                   h-[215px]
//                   overflow-y-auto
//                   overflow-x-hidden
//                   border-t
//                   border-[#e5e7eb]
//                 "
//               >

//                 <div
//                   className="
//                     grid
//                     grid-cols-1
//                     md:grid-cols-2
//                     lg:grid-cols-3
//                   "
//                 >

//                   {filteredFields.map(
//                     (field, index) => {

//                       const checked =
//                         selectedFields.some(
//                           (item) =>
//                             item.label === field
//                         );

//                       return (
//                         <label
//                           key={`${field}-${index}`}
//                           className="
//                             flex
//                             min-h-[45px]
//                             cursor-pointer
//                             items-center
//                             gap-3
//                             border-b
//                             border-r
//                             border-[#e5e7eb]
//                             px-3
//                             text-[13px]
//                             text-[#37474f]
//                             hover:bg-[#fafafa]
//                           "
//                         >

//                           <input
//                             type="checkbox"
//                             checked={checked}
//                             onChange={() =>
//                               toggleField(field)
//                             }
//                             className="
//                               h-[18px]
//                               w-[18px]
//                               shrink-0
//                               accent-[#8f5142]
//                             "
//                           />

//                           <span
//                             className={`
//                               ${
//                                 checked
//                                   ? "font-medium"
//                                   : ""
//                               }
//                             `}
//                           >
//                             {field}
//                           </span>

//                         </label>
//                       );
//                     }
//                   )}

//                 </div>

//               </div>

//               {/* GROUP BY / ORDER BY */}

//               <div
//                 className="
//                   grid
//                   grid-cols-1
//                   gap-3
//                   border-t
//                   border-[#e5e7eb]
//                   px-3
//                   py-3
//                   sm:grid-cols-2
//                 "
//               >
//                 <div>
//                   <label className="mb-1 block text-[12px] font-medium text-[#333]">
//                     Group By
//                   </label>
//                   <div className="relative">
//                     <select
//                       value={groupBy}
//                       onChange={(event) =>
//                         setGroupBy(event.target.value)
//                       }
//                       className="
//                         h-[34px]
//                         w-full
//                         appearance-none
//                         rounded-md
//                         border
//                         border-[#dfe5eb]
//                         bg-white
//                         px-3
//                         pr-8
//                         text-[12px]
//                         text-[#98a2ad]
//                         outline-none
//                         focus:border-[#b17869]
//                       "
//                     >
//                       <option value="">Select Column</option>
//                       {selectedFields.map((field) => (
//                         <option key={`group-${field.id}`} value={field.label}>
//                           {field.label}
//                         </option>
//                       ))}
//                     </select>
//                     <ChevronDown
//                       size={15}
//                       className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#555]"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="mb-1 block text-[12px] font-medium text-[#333]">
//                     Order By
//                   </label>
//                   <div className="relative">
//                     <select
//                       value={orderBy}
//                       onChange={(event) =>
//                         setOrderBy(event.target.value)
//                       }
//                       className="
//                         h-[34px]
//                         w-full
//                         appearance-none
//                         rounded-md
//                         border
//                         border-[#dfe5eb]
//                         bg-white
//                         px-3
//                         pr-8
//                         text-[12px]
//                         text-[#98a2ad]
//                         outline-none
//                         focus:border-[#b17869]
//                       "
//                     >
//                       <option value="">Select Column</option>
//                       {selectedFields.map((field) => (
//                         <option key={`order-${field.id}`} value={field.label}>
//                           {field.label}
//                         </option>
//                       ))}
//                     </select>
//                     <ChevronDown
//                       size={15}
//                       className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#555]"
//                     />
//                   </div>
//                 </div>
//               </div>

//             </section>



//             </div>

//           </main>

//         </div>

//         {/* ===================================================
//             SELECTED COLUMNS
//         =================================================== */}

//         <div
//           className="
//             min-w-0
//             xl:mt-[93px]
//           "
//         >
//             <section
//               className="
//                 min-w-0
//                 rounded-lg
//                 border
//                 border-[#e0e5ea]
//                 bg-white
//                 p-3
//                 shadow-sm
//               "
//             >

//               <div
//                 className="
//                   mb-3
//                   flex
//                   items-center
//                   justify-between
//                 "
//               >

//                 <h2
//                   className="
//                     text-[16px]
//                     font-semibold
//                     text-[#263238]
//                   "
//                 >
//                   Selected Columns
//                 </h2>

//                 <span
//                   className="
//                     rounded-md
//                     bg-[#fff0eb]
//                     px-3
//                     py-2
//                     text-[11px]
//                     font-semibold
//                     text-[#955847]
//                   "
//                 >
//                   {selectedFields.length} Fields Selected
//                 </span>

//               </div>


//               <div
//                 className="
//                   max-h-[300px]
//                   space-y-2
//                   overflow-y-auto
//                   overflow-x-hidden
//                   pr-1
//                 "
//               >

//                 {selectedFields.map(
//                   (field, index) => (
//                     <div
//                       key={field.id}
//                       className="
//                         flex
//                         min-h-[38px]
//                         items-center
//                         gap-2
//                         rounded-md
//                         border
//                         border-[#dfe5eb]
//                         px-3
//                       "
//                     >

//                       <span
//                         className="
//                           w-[22px]
//                           shrink-0
//                           text-[11px]
//                           text-[#7d8791]
//                         "
//                       >
//                         {index + 1}.
//                       </span>

//                       <span
//                         className="
//                           min-w-0
//                           flex-1
//                           truncate
//                           text-[13px]
//                           text-[#455a64]
//                         "
//                       >
//                         {field.label}
//                       </span>

//                       <button
//                         type="button"
//                         onClick={() =>
//                           moveUp(index)
//                         }
//                         className="text-[#777]"
//                       >
//                         <ArrowUp size={15} />
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() =>
//                           moveDown(index)
//                         }
//                         className="text-[#777]"
//                       >
//                         <ArrowDown size={15} />
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() =>
//                           removeSelected(index)
//                         }
//                         className="text-[#ff6b6b]"
//                       >
//                         <Trash2 size={16} />
//                       </button>

//                     </div>
//                   )
//                 )}

//               </div>


//               <div
//                 className="
//                   mt-4
//                   rounded-md
//                   bg-[#f6f8fa]
//                   px-3
//                   py-3
//                   text-[11px]
//                   leading-5
//                   text-[#89939d]
//                 "
//               >
//                 Drag and drop fields to prioritize
//                 report hierarchy. Group and sort
//                 rules will follow this column layout.
//               </div>

//             </section>
//         </div>

//       </div>

//       {/* =====================================================
//           ADD EXPRESSION MODAL
//       ===================================================== */}

//       {showExpression && (
//         <div
//           className="
//             fixed
//             inset-0
//             z-[99999]
//             flex
//             items-center
//             justify-center
//             bg-black/50
//             p-4
//           "
//         >

//           <div
//             className="
//               w-full
//               max-w-[780px]
//               overflow-hidden
//               rounded-lg
//               bg-white
//               shadow-2xl
//             "
//           >

//             {/* MODAL HEADER */}

//             <div
//               className="
//                 flex
//                 items-center
//                 justify-between
//                 border-b
//                 border-[#e5e7eb]
//                 px-6
//                 py-4
//               "
//             >

//               <h2
//                 className="
//                   text-[22px]
//                   font-semibold
//                   text-[#263238]
//                 "
//               >
//                 Formula List
//               </h2>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowExpression(false)
//                 }
//                 className="
//                   text-[#777]
//                   hover:text-[#333]
//                 "
//               >
//                 <ChevronDown
//                   size={20}
//                   className="rotate-180"
//                 />
//               </button>

//             </div>


//             {/* WARNING */}

//             <div className="p-5">

//               <div
//                 className="
//                   mb-5
//                   rounded-md
//                   border
//                   border-[#f0e2bc]
//                   bg-[#fffaf0]
//                   px-5
//                   py-4
//                   text-[14px]
//                   text-[#777]
//                 "
//               >
//                 Please do not change the variable
//                 ex:{`{username}`}, and Please do not
//                 use space between the lines.
//               </div>


//               <div
//                 className="
//                   grid
//                   grid-cols-1
//                   gap-4
//                   md:grid-cols-2
//                 "
//               >

//                 {/* LEFT */}

//                 <div>

//                   <label
//                     className="
//                       mb-2
//                       block
//                       text-[15px]
//                       font-medium
//                       text-[#333]
//                     "
//                   >
//                     Formula Name
//                     <span className="text-red-500">
//                       *
//                     </span>
//                   </label>

//                   <input
//                     type="text"
//                     className="
//                       h-[44px]
//                       w-full
//                       rounded-md
//                       border
//                       border-[#dfe5eb]
//                       bg-[#f1f4f8]
//                       px-3
//                       outline-none
//                       focus:border-[#b17869]
//                     "
//                   />


//                   <label
//                     className="
//                       mb-2
//                       mt-5
//                       block
//                       text-[15px]
//                       font-medium
//                       text-[#333]
//                     "
//                   >
//                     Expression 1
//                   </label>

//                   <textarea
//                     className="
//                       h-[160px]
//                       w-full
//                       resize-none
//                       rounded-md
//                       border
//                       border-[#dfe5eb]
//                       bg-[#f1f4f8]
//                       p-3
//                       outline-none
//                       focus:border-[#b17869]
//                     "
//                   />

//                 </div>


//                 {/* RIGHT */}

//                 <div
//                   className="
//                     min-h-[230px]
//                     rounded-lg
//                     bg-[#eee9fa]
//                     p-5
//                   "
//                 >

//                   <div
//                     className="
//                       flex
//                       h-7
//                       w-7
//                       items-center
//                       justify-center
//                       rounded-full
//                       border
//                       border-[#a995ef]
//                       text-[#8b72e8]
//                     "
//                   >
//                     i
//                   </div>

//                 </div>

//               </div>

//             </div>


//             {/* MODAL FOOTER */}

//             <div
//               className="
//                 flex
//                 items-center
//                 justify-end
//                 gap-3
//                 border-t
//                 border-[#e5e7eb]
//                 bg-[#f5f7fa]
//                 px-5
//                 py-4
//               "
//             >

//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowExpression(false)
//                 }
//                 className="
//                   flex
//                   h-[48px]
//                   items-center
//                   gap-2
//                   rounded-lg
//                   border
//                   border-[#aeb4bc]
//                   bg-white
//                   px-6
//                   text-[16px]
//                   text-[#555]
//                 "
//               >
//                 <XIcon />

//                 Close
//               </button>


//               <button
//                 type="button"
//                 className="
//                   flex
//                   h-[48px]
//                   items-center
//                   gap-2
//                   rounded-lg
//                   bg-[#7e4031]
//                   px-7
//                   text-[16px]
//                   font-semibold
//                   text-white
//                 "
//               >
//                 <Bookmark size={18} />

//                 Save
//               </button>

//             </div>

//           </div>

//         </div>
//       )}

//     </div>
//   );
// }


// /* =========================================================
//    CLOSE ICON
// ========================================================= */

// function XIcon() {
//   return (
//     <svg
//       width="19"
//       height="19"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M18 6L6 18" />
//       <path d="M6 6L18 18" />
//     </svg>
//   );
// }


import { useEffect, useMemo, useRef, useState } from "react";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Trash2,
  ArrowUp,
  ArrowDown,
  Bookmark,
} from "lucide-react";

const FIELD_TABS = [
  "Employee Details",
  "Classification Details",
  "HR Category",
  "Leave",
  "Salary",
  "Theo. Salary",
  "Salary Rate",
];

const EMPLOYEE_FIELDS = [
  "Ref No",
  "Empname",
  "Email",
  "Official Mail Id",
  "Father Name",
  "Last Name",
  "Middle Name",
  "First Name",
  "Mobile",
  "Alt Mobile",
  "Emergency Contact No",
  "Remarks",
  "Leaving Reason",
  "Spouse Name",
  "Employee Title",
  "Note",
  "Retirement Date",
  "Resignation Date",
  "PF Applicable",
  "Zero PT",
  "ESI Applicable",
  "Restrict Employee PF",
  "Restrict PF",
  "Zero Pension",
];

const CLASSIFICATION_FIELDS = [
  "Department",
  "Team",
  "Branch Name",
  "Leave Policy",
  "Salary Structure",
  "Attendance Structure",
  "Designation",
  "Bank",
  "IFSC Code",
  "Account Number",
  "Time Sheet Policy",
  "Cost Center",
];

const HR_CATEGORY_FIELDS = [
  "Blood Group",
  "Nationality",
  "Issued At",
  "Issued date",
  "Expiry Date",
  "Name Of Relative",
  "Relation",
  "Remarks",
  "Date Of Birth",
  "Dependent",
  "Nominee",
  "Nomination%",
  "Nominee Address",
  "University",
  "Qualification",
  "Driving Lic No",
  "Number",
  "Caste Category",
];

const LEAVE_FIELDS = [
  "compensatory_off",
  "compensatory_work",
  "loss_of_pay",
  "on_official_duty",
  "casual_leave",
  "sick_leave",
  "restricted_holiday",
  "medical_wellness_leave",
  "medical_wellness_leave.",
];

const SALARY_FIELDS = [
  "Pay Days",
  "Present Days",
  "Calender Days",
  "Ctc Total",
  "Gross salary",
  "Earning Total",
  "Deduction Total",
  "Net Amount",
  "PF Earning",
  "ESI Earning",
  "OT2",
  "OT2 units",
  "OT2 rates",
  "Basic",
  "OT1",
  "OT1 units",
  "OT1 rates",
  "EmployerPFEarnings",
  "TDS Earning",
  "Special Allow",
  "SuppF Earning",
  "SupESI Earning",
  "SupPT Earning",
  "SupCmpESI",
  "TdsIndp",
  "TDS OtherEarnings",
  "HRA",
  "Conv. Allow.",
  "Statutory Bonus",
  "EdliWages",
  "PensionWages",
  "Account01",
  "Account02",
  "IndpSupPT",
  "SupCmpEPF",
  "SupCmpPension",
  "Insurance",
  "Health Ins.",
  "Other Deduction",
  "Medical Benefit",
  "Employer PF",
  "IndpSupCmpEPF",
  "IndpSupCmpPension",
  "DupEdliWages",
  "DupPensionWages",
  "DupAccount01",
  "DupAccount02",
  "DupAccount10",
  "DupAccount21",
  "DupAccount22",
];

const THEO_SALARY_FIELDS = [
  "Basic",
  "Special Allow",
  "HRA",
  "Conv. Allow.",
  "Statutory Bonus",
  "Annual CTC",
  "Monthly CTC",
  "Holiday Allow",
  "Food Wallet",
  "Compensatory AI",
  "Net Monthly",
  "Danny",
  "Percentage - NA",
  "Health Ins.",
  "Other Deduction",
  "Medical Benefit",
  "Employer PF",
];

const SALARY_RATE_FIELDS = [
  "Basic",
  "OT1",
  "Special Allow",
  "HRA",
  "Conv Allow",
  "Statutory",
  "Annual CTC",
  "Monthly CTC",
  "Holiday",
  "Food Wallet",
  "Compensatory AI",
  "Net Monthly",
  "Danny",
  "Percentage-NA",
  "Health Ins",
  "Other Deduction",
  "Medical Benefit",
  "Employer PF",
];

const FIELD_MAP: Record<string, string[]> = {
  "Employee Details": EMPLOYEE_FIELDS,
  "Classification Details": CLASSIFICATION_FIELDS,
  "HR Category": HR_CATEGORY_FIELDS,
  Leave: LEAVE_FIELDS,
  Salary: SALARY_FIELDS,
  "Theo. Salary": THEO_SALARY_FIELDS,
  "Salary Rate": SALARY_RATE_FIELDS,
};

type SelectedField = {
  id: string;
  label: string;
};

export default function FormMasterPage() {
  const [activeStep, setActiveStep] =
    useState("Step 1 - Settings");

  const [activeFieldTab, setActiveFieldTab] =
    useState("Salary Rate");

  const [documentName, setDocumentName] =
    useState("Employee Audit Report_v2");

  const [formatType, setFormatType] =
    useState("");

  const [moduleType, setModuleType] =
    useState("");

  const [allCompany, setAllCompany] =
    useState(false);

  const [searchText, setSearchText] =
    useState("");

  const [showExpression, setShowExpression] =
    useState(false);

  const [groupBy, setGroupBy] =
    useState("");

  const [orderBy, setOrderBy] =
    useState("");

  const [selectedFields, setSelectedFields] =
    useState<SelectedField[]>([
      {
        id: "ref-no",
        label: "Ref No",
      },
      {
        id: "empname",
        label: "Empname",
      },
      {
        id: "month-name",
        label: "Month Name",
      },
      {
        id: "official-mail-id",
        label: "Official Mail ID",
      },
    ]);

  const currentFields =
    FIELD_MAP[activeFieldTab] ?? [];

  const filteredFields = useMemo(() => {
    const search =
      searchText.trim().toLowerCase();

    if (!search) {
      return currentFields;
    }

    return currentFields.filter((field) =>
      field.toLowerCase().includes(search)
    );
  }, [activeFieldTab, currentFields, searchText]);

  /* =====================================================
     SELECT / UNSELECT FIELD
  ===================================================== */

  const toggleField = (field: string) => {
    const exists = selectedFields.some(
      (item) => item.label === field
    );

    if (exists) {
      setSelectedFields((previous) =>
        previous.filter(
          (item) => item.label !== field
        )
      );

      return;
    }

    setSelectedFields((previous) => [
      ...previous,
      {
        id: `${field}-${Date.now()}`,
        label: field,
      },
    ]);
  };

  /* =====================================================
     MOVE SELECTED FIELD UP
  ===================================================== */

  const moveUp = (index: number) => {
    if (index === 0) {
      return;
    }

    setSelectedFields((previous) => {
      const next = [...previous];

      const current = next[index];

      next[index] = next[index - 1];
      next[index - 1] = current;

      return next;
    });
  };

  /* =====================================================
     MOVE SELECTED FIELD DOWN
  ===================================================== */

  const moveDown = (index: number) => {
    setSelectedFields((previous) => {
      if (index === previous.length - 1) {
        return previous;
      }

      const next = [...previous];

      const current = next[index];

      next[index] = next[index + 1];
      next[index + 1] = current;

      return next;
    });
  };

  /* =====================================================
     REMOVE SELECTED FIELD
  ===================================================== */

  const removeSelected = (index: number) => {
    setSelectedFields((previous) =>
      previous.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  };

  return (
    <div
      className="
        min-h-screen
        w-full
        overflow-x-hidden
        bg-[#f4f7fb]
        p-0
      "
    >

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div
        className="
          mt-2
          grid
          grid-cols-1
          gap-[14px]
          xl:grid-cols-[236px_minmax(0,1fr)_315px]
          xl:items-start
        "
      >

        {/* ===================================================
            CREATE DOCUMENT SIDEBAR
        =================================================== */}

        <aside
          className="
            h-fit
    min-h-0
    w-full
    self-start
    rounded-[12px]
    border
    border-[#d9d9d9]
    bg-white
    shadow-sm
          "
        >

          <div
            className="
              flex
              h-[61px]
              items-center
              justify-between
              border-b
              border-[#d9d9d9]
              px-3
            "
          >

            <h2
              className="
                text-[16px]
                font-semibold
                text-[#263238]
              "
            >
              Create Document
            </h2>

            <button
              type="button"
              className="
                flex
                h-[40px]
                w-[40px]
                items-center
                justify-center
                rounded-lg
                border
                border-[#b17869]
                text-[#8f5142]
                hover:bg-[#fff8f5]
              "
            >
              <Plus size={24} />
            </button>

          </div>

        </aside>




        {/* ===================================================
            CENTER FORM MASTER CONTENT
        =================================================== */}

        <div
          className={
            activeStep === "Step 2 - Email Settings"
              ? "min-w-0 xl:col-span-2"
              : "min-w-0"
          }
        >

          <div
            className="
              rounded-[10px]
              border
              border-[#d9d9d9]
              bg-white
              p-2
              shadow-sm
            "
          >
          {/* =================================================
              STEPS
          ================================================= */}

          <div
            className="
              grid
              grid-cols-1
              gap-1
              rounded-[10px]
              border
              border-[#e2e2e2]
              bg-white
              p-1
              md:grid-cols-3
            "
          >

            {[
              "Step 1 - Settings",
              "Step 2 - Email Settings",
              "Design Step - Design Document (Word)",
            ].map((step) => (
              <button
                key={step}
                type="button"
                onClick={() =>
                  setActiveStep(step)
                }
                className={`
                  min-h-[40px]
                  rounded-[7px]
                  border
                  px-3
                  text-[15px]
                  font-medium
                  transition

                  ${
                    activeStep === step
                      ? "border-[#b17869] bg-white text-[#956050]"
                      : "border-transparent bg-white text-[#555]"
                  }
                `}
              >
                {step}
              </button>
            ))}

          </div>



          </div>

          {activeStep === "Step 1 - Settings" && (
            <>
          <main
            className="
              mt-[28px]
              min-w-0
              rounded-[12px]
              border
              border-[#d9d9d9]
              bg-white
              p-3
              shadow-[0_2px_7px_rgba(0,0,0,0.12)]
            "
          >
          {/* =================================================
              DOCUMENT SETTINGS
          ================================================= */}

          {/* =================================================
              DOCUMENT NAME - FULL ROW
          ================================================= */}

          <div className="mt-3 w-full">
            <label className="mb-1 block text-[12px] font-medium text-[#333]">
              Document Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={documentName}
              onChange={(event) =>
                setDocumentName(event.target.value)
              }
              placeholder="Document Name..."
              className="
                h-[40px]
                w-full
                rounded-md
                border
                border-[#bfc4c8]
                px-3
                text-[13px]
                text-[#455a64]
                outline-none
                focus:border-[#b17869]
                focus:ring-1
                focus:ring-[#b17869]
              "
            />
          </div>

          {/* =================================================
              FORMAT / MODULE / COMPANY - SECOND ROW
          ================================================= */}

          <div
            className="
              mt-3
              flex
              w-full
              min-w-0
              max-w-full
              flex-wrap
              items-start
              gap-3
            "
          >

            {/* FORMAT TYPE */}

            <div className="relative w-full min-w-0 sm:w-[220px]">
              <ResponsiveDropdown
                value={formatType}
                placeholder="Select Format Type"
                options={[
                  { value: "word", label: "Word" },
                  { value: "pdf", label: "PDF" },
                ]}
                onChange={setFormatType}
              />
            </div>


            {/* MODULE TYPE */}

            <div className="relative w-full min-w-0 sm:w-[220px]">
              <ResponsiveDropdown
                value={moduleType}
                placeholder="Select module Type"
                options={[
                  { value: "employee", label: "Employee" },
                  { value: "salary", label: "Salary" },
                  { value: "leave", label: "Leave" },
                ]}
                onChange={setModuleType}
              />
            </div>


            {/* ALL COMPANY */}

            <label
              className="
                flex
                h-[40px]
                items-center
                gap-2
                whitespace-nowrap
                text-[14px]
                text-[#455a64]
              "
            >

              <input
                type="checkbox"
                checked={allCompany}
                onChange={(event) =>
                  setAllCompany(event.target.checked)
                }
                className="
                  h-[18px]
                  w-[18px]
                  accent-[#8f5142]
                "
              />

              for All Company

            </label>

          </div>



          {/* =================================================
              ADD FIELDS HEADER
          ================================================= */}

          <div
            className="
              mt-4
              flex
              items-center
              justify-between
              gap-3
              pb-3
            "
          >

            <h2
              className="
                text-[17px]
                font-semibold
                text-[#263238]
              "
            >
              Add fields and prioritize
            </h2>

            <button
              type="button"
              onClick={() =>
                setShowExpression(true)
              }
              className="
                flex
                items-center
                gap-1
                text-[14px]
                font-semibold
                text-[#955847]
              "
            >
              <Plus size={17} />

              Add Expression
            </button>

          </div>




            <div
              className="
                mt-3
                min-w-0
              "
            >
            <section
              className="
                min-w-0
                overflow-visible
                rounded-md
                border
                border-[#e3e7eb]
              "
            >

              {/* FIELD TABS */}

              <div
                className="
                  flex
                  h-[46px]
                  items-center
                  overflow-x-auto
                "
              >

                <button
                  type="button"
                  className="
                    flex
                    h-full
                    w-[42px]
                    shrink-0
                    items-center
                    justify-center
                    text-[#777]
                  "
                >
                  <ChevronLeft size={18} />
                </button>

                {FIELD_TABS.map((tab) => {
                  const active =
                    activeFieldTab === tab;

                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() =>
                        setActiveFieldTab(tab)
                      }
                      className={`
                        relative
                        flex
                        h-full
                        shrink-0
                        items-center
                        px-4
                        text-[13px]
                        font-medium
                        whitespace-nowrap

                        ${
                          active
                            ? "bg-[#fff8f5] text-[#956050]"
                            : "text-[#444]"
                        }
                      `}
                    >

                      {tab}

                      {active && (
                        <span
                          className="
                            absolute
                            bottom-0
                            left-0
                            right-0
                            h-[2px]
                            bg-[#b17869]
                          "
                        />
                      )}

                    </button>
                  );
                })}

                <button
                  type="button"
                  className="
                    flex
                    h-full
                    w-[42px]
                    shrink-0
                    items-center
                    justify-center
                    text-[#777]
                  "
                >
                  <ChevronRight size={18} />
                </button>

              </div>


              {/* SEARCH + SELECTED COUNT */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  px-3
                  py-2
                "
              >

                <div className="relative w-[250px]">

                  <Search
                    size={17}
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-[#8b96a1]
                    "
                  />

                  <input
                    type="text"
                    value={searchText}
                    onChange={(event) =>
                      setSearchText(event.target.value)
                    }
                    placeholder="Search..."
                    className="
                      h-[34px]
                      w-full
                      rounded-md
                      border
                      border-[#dfe5eb]
                      pl-9
                      pr-3
                      text-[12px]
                      outline-none
                      focus:border-[#b17869]
                    "
                  />

                </div>


                <div
                  className="
                    flex
                    shrink-0
                    items-center
                    gap-2
                    text-[13px]
                    font-medium
                    text-[#333]
                  "
                >

                  <span
                    className="
                      flex
                      h-[18px]
                      w-[18px]
                      items-center
                      justify-center
                      rounded-[4px]
                      bg-[#8f5142]
                    "
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12l4 4L19 8" />
                    </svg>
                  </span>

                  Selected Columns :{" "}
                  {selectedFields.length}

                </div>

              </div>


              {/* =================================================
                  FIELD LIST
              ================================================= */}

              <div
                className="
                  h-[215px]
                  overflow-y-auto
                  overflow-x-hidden
                "
              >

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-3
                  "
                >

                  {filteredFields.map(
                    (field, index) => {

                      const checked =
                        selectedFields.some(
                          (item) =>
                            item.label === field
                        );

                      return (
                        <label
                          key={`${field}-${index}`}
                          className="
                            flex
                            min-h-[45px]
                            cursor-pointer
                            items-center
                            gap-3
                            px-3
                            text-[13px]
                            text-[#37474f]
                            hover:bg-[#fafafa]
                          "
                        >

                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              toggleField(field)
                            }
                            className="
                              h-[18px]
                              w-[18px]
                              shrink-0
                              accent-[#8f5142]
                            "
                          />

                          <span
                            className={`
                              ${
                                checked
                                  ? "font-medium"
                                  : ""
                              }
                            `}
                          >
                            {field}
                          </span>

                        </label>
                      );
                    }
                  )}

                </div>

              </div>

              {/* GROUP BY / ORDER BY */}

              <div
                className="
                  grid
                  w-full
                  min-w-0
                  max-w-full
                  grid-cols-1
                  gap-3
                  overflow-visible
                  px-3
                  py-3
                  sm:grid-cols-2
                "
              >
                {/* GROUP BY */}
                <div className="w-full min-w-0">
                  <label className="mb-1 block text-[12px] font-medium text-[#333]">
                    Group By
                  </label>

                  <ColumnDropdown
                    value={groupBy}
                    options={selectedFields.map(
                      (field) => field.label,
                    )}
                    onChange={setGroupBy}
                  />
                </div>

                {/* ORDER BY */}
                <div className="w-full min-w-0">
                  <label className="mb-1 block text-[12px] font-medium text-[#333]">
                    Order By
                  </label>

                  <ColumnDropdown
                    value={orderBy}
                    options={selectedFields.map(
                      (field) => field.label,
                    )}
                    onChange={setOrderBy}
                  />
                </div>
              </div>

            </section>



            </div>

          </main>
            </>
          )}

          {activeStep === "Step 2 - Email Settings" && (
            <div
              className="
                mt-[28px]
                min-w-0
                rounded-[12px]
                border
                border-[#d9d9d9]
                bg-white
                p-4
                shadow-[0_2px_7px_rgba(0,0,0,0.12)]
              "
            >
              {/* =================================================
                  EMAIL SETTINGS
              ================================================= */}

              <div className="w-full">
                <label className="mb-1 block text-[14px] font-medium text-[#263238]">
                  Subject<span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  placeholder="Enter Information"
                  className="
                    h-[60px]
                    w-full
                    rounded-[7px]
                    border
                    border-[#d56b7d]
                    bg-white
                    px-4
                    text-[14px]
                    text-[#455a64]
                    outline-none
                    focus:border-[#b17869]
                  "
                />

                <p className="mt-1 px-2 text-[13px] text-[#d56b7d]">
                  Field Required
                </p>
              </div>

              <div
                className="
                  mt-5
                  grid
                  grid-cols-1
                  gap-4
                  lg:grid-cols-[minmax(240px,0.34fr)_minmax(0,1fr)]
                "
              >
                <div
                  className="
                    min-h-[430px]
                    rounded-[8px]
                    bg-[#f5f3ff]
                    p-5
                  "
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="
                        flex
                        h-6
                        w-6
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#9b8ce6]
                        text-[15px]
                        font-semibold
                        text-[#8b72e8]
                      "
                    >
                      i
                    </span>

                    <p className="text-[15px] font-medium leading-6 text-[#4b5563]">
                      Use below placeholder for these
                      <br />
                      information, click to copy
                    </p>
                  </div>

                  <div className="mt-3 space-y-4 pl-12 text-[14px] text-[#667085]">
                    <p>User Name : {"{username}"}</p>
                    <p>Employee Name : {"{empname}"}</p>
                    <p>Company Name : {"{companyname}"}</p>
                    <p>Company Address : {"{address}"}</p>
                    <p>Logo : {"{logo}"}</p>
                  </div>
                </div>

                <div className="min-w-0">
                  <div
                    className="
                      rounded-[7px]
                      border
                      border-[#f0e2bc]
                      bg-[#fffaf0]
                      px-4
                      py-3
                      text-[14px]
                      text-[#777]
                    "
                  >
                    <span className="mr-2 text-[#d6b74c]">⚠</span>
                    Please do not change the variable ex:{"{username}"},
                    and Please do not use space between the lines.
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <label className="text-[14px] font-medium text-[#263238]">
                      Message<span className="text-red-500">*</span>
                    </label>

                    <button
                      type="button"
                      className="
                        rounded-full
                        bg-[#dff6ff]
                        px-4
                        py-2
                        text-[14px]
                        font-semibold
                        text-[#2196df]
                      "
                    >
                      ✦ Generate
                    </button>
                  </div>

                  <div
                    className="
                      mt-2
                      overflow-hidden
                      rounded-[6px]
                      border
                      border-[#cfd4d9]
                      bg-white
                    "
                  >
                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-4
                        border-b
                        border-[#d9d9d9]
                        px-4
                        py-3
                        text-[15px]
                        text-[#4b5563]
                      "
                    >
                      <span>Arial</span>
                      <span>⌄</span>
                      <span>Size 3</span>
                      <span>⌄</span>
                      <span>Normal</span>
                      <span>⌄</span>
                      <strong>B</strong>
                      <em>I</em>
                      <u>U</u>
                      <span>≋</span>
                      <span>☷</span>
                      <span>≡</span>
                      <span>↤</span>
                      <span>↦</span>
                      <span>x²</span>
                      <span>x₂</span>
                      <span>❝</span>
                      <span>¶</span>
                      <span>A</span>
                      <span>⌁</span>
                      <span>↗</span>
                      <span>&lt;/&gt;</span>
                      <span>↶</span>
                      <span>↷</span>
                    </div>

                    <textarea
                      placeholder="Write something awesome..."
                      className="
                        h-[310px]
                        w-full
                        resize-none
                        border-0
                        p-4
                        text-[14px]
                        italic
                        text-[#777]
                        outline-none
                      "
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ===================================================
            SELECTED COLUMNS
        =================================================== */}

        {activeStep === "Step 1 - Settings" && (
        <div
          className="
            min-w-0
            xl:mt-[93px]
          "
        >
            <section
              className="
                min-w-0
                rounded-lg
                border
                border-[#e0e5ea]
                bg-white
                p-3
                shadow-sm
              "
            >

              <div
                className="
                  mb-3
                  flex
                  items-center
                  justify-between
                "
              >

                <h2
                  className="
                    text-[16px]
                    font-semibold
                    text-[#263238]
                  "
                >
                  Selected Columns
                </h2>

                <span
                  className="
                    rounded-md
                    bg-[#fff0eb]
                    px-3
                    py-2
                    text-[11px]
                    font-semibold
                    text-[#955847]
                  "
                >
                  {selectedFields.length} Fields Selected
                </span>

              </div>


              <div
                className="
                  max-h-[300px]
                  space-y-2
                  overflow-y-auto
                  overflow-x-hidden
                  pr-1
                "
              >

                {selectedFields.map(
                  (field, index) => (
                    <div
                      key={field.id}
                      className="
                        flex
                        min-h-[38px]
                        items-center
                        gap-2
                        rounded-md
                        border
                        border-[#dfe5eb]
                        px-3
                      "
                    >

                      <span
                        className="
                          w-[22px]
                          shrink-0
                          text-[11px]
                          text-[#7d8791]
                        "
                      >
                        {index + 1}.
                      </span>

                      <span
                        className="
                          min-w-0
                          flex-1
                          truncate
                          text-[13px]
                          text-[#455a64]
                        "
                      >
                        {field.label}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          moveUp(index)
                        }
                        className="text-[#777]"
                      >
                        <ArrowUp size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          moveDown(index)
                        }
                        className="text-[#777]"
                      >
                        <ArrowDown size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          removeSelected(index)
                        }
                        className="text-[#ff6b6b]"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  )
                )}

              </div>


              <div
                className="
                  mt-4
                  rounded-md
                  bg-[#f6f8fa]
                  px-3
                  py-3
                  text-[11px]
                  leading-5
                  text-[#89939d]
                "
              >
                Drag and drop fields to prioritize
                report hierarchy. Group and sort
                rules will follow this column layout.
              </div>

            </section>
        </div>
        )}

      </div>

      {/* =====================================================
          ADD EXPRESSION MODAL
      ===================================================== */}

      {showExpression && (
        <div
          className="
            fixed
            inset-0
            z-[99999]
            flex
            items-center
            justify-center
            bg-black/50
            p-4
          "
        >

          <div
            className="
              w-full
              max-w-[780px]
              overflow-hidden
              rounded-lg
              bg-white
              shadow-2xl
            "
          >

            {/* MODAL HEADER */}

            <div
              className="
                flex
                items-center
                justify-between
                border-b
                border-[#e5e7eb]
                px-6
                py-4
              "
            >

              <h2
                className="
                  text-[22px]
                  font-semibold
                  text-[#263238]
                "
              >
                Formula List
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowExpression(false)
                }
                className="
                  text-[#777]
                  hover:text-[#333]
                "
              >
                <ChevronDown
                  size={20}
                  className="rotate-180"
                />
              </button>

            </div>


            {/* WARNING */}

            <div className="p-5">

              <div
                className="
                  mb-5
                  rounded-md
                  border
                  border-[#f0e2bc]
                  bg-[#fffaf0]
                  px-5
                  py-4
                  text-[14px]
                  text-[#777]
                "
              >
                Please do not change the variable
                ex:{`{username}`}, and Please do not
                use space between the lines.
              </div>


              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  md:grid-cols-2
                "
              >

                {/* LEFT */}

                <div>

                  <label
                    className="
                      mb-2
                      block
                      text-[15px]
                      font-medium
                      text-[#333]
                    "
                  >
                    Formula Name
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    className="
                      h-[44px]
                      w-full
                      rounded-md
                      border
                      border-[#dfe5eb]
                      bg-[#f1f4f8]
                      px-3
                      outline-none
                      focus:border-[#b17869]
                    "
                  />


                  <label
                    className="
                      mb-2
                      mt-5
                      block
                      text-[15px]
                      font-medium
                      text-[#333]
                    "
                  >
                    Expression 1
                  </label>

                  <textarea
                    className="
                      h-[160px]
                      w-full
                      resize-none
                      rounded-md
                      border
                      border-[#dfe5eb]
                      bg-[#f1f4f8]
                      p-3
                      outline-none
                      focus:border-[#b17869]
                    "
                  />

                </div>


                {/* RIGHT */}

                <div
                  className="
                    min-h-[230px]
                    rounded-lg
                    bg-[#eee9fa]
                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#a995ef]
                      text-[#8b72e8]
                    "
                  >
                    i
                  </div>

                </div>

              </div>

            </div>


            {/* MODAL FOOTER */}

            <div
              className="
                flex
                items-center
                justify-end
                gap-3
                border-t
                border-[#e5e7eb]
                bg-[#f5f7fa]
                px-5
                py-4
              "
            >

              <button
                type="button"
                onClick={() =>
                  setShowExpression(false)
                }
                className="
                  flex
                  h-[48px]
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-[#aeb4bc]
                  bg-white
                  px-6
                  text-[16px]
                  text-[#555]
                "
              >
                <XIcon />

                Close
              </button>


              <button
                type="button"
                className="
                  flex
                  h-[48px]
                  items-center
                  gap-2
                  rounded-lg
                  bg-[#7e4031]
                  px-7
                  text-[16px]
                  font-semibold
                  text-white
                "
              >
                <Bookmark size={18} />

                Save
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}



/* =========================================================
   MOBILE-SAFE GENERIC DROPDOWN

   Used for Format Type and Module Type.
   The option list is rendered in normal document flow so it
   cannot escape the mobile responsive card.
========================================================= */

type ResponsiveDropdownOption = {
  value: string;
  label: string;
};

type ResponsiveDropdownProps = {
  value: string;
  placeholder: string;
  options: ResponsiveDropdownOption[];
  onChange: (value: string) => void;
};

function ResponsiveDropdown({
  value,
  placeholder,
  options,
  onChange,
}: ResponsiveDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    };

    globalThis.document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      globalThis.document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  const selectedOption = options.find(
    (option) => option.value === value,
  );

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="w-full min-w-0"
    >
      <button
        type="button"
        onClick={() =>
          setOpen((previous) => !previous)
        }
        aria-haspopup="listbox"
        aria-expanded={open}
        className="
          flex
          h-[40px]
          w-full
          min-w-0
          items-center
          justify-between
          gap-2
          rounded-md
          border
          border-[#b17869]
          bg-white
          px-4
          text-left
          text-[14px]
          outline-none
          transition
          focus:border-[#8f5142]
          focus:ring-1
          focus:ring-[#b17869]/30
        "
      >
        <span
          className={`
            min-w-0
            flex-1
            truncate
            ${
              selectedOption
                ? "text-[#555]"
                : "text-[#777]"
            }
          `}
        >
          {selectedOption?.label ?? placeholder}
        </span>

        <ChevronDown
          size={16}
          className={`
            shrink-0
            text-[#666]
            transition-transform
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="
            mt-1
            w-full
            min-w-0
            max-w-full
            overflow-hidden
            rounded-md
            border
            border-[#b17869]
            bg-white
            shadow-[0_4px_12px_rgba(0,0,0,0.14)]
          "
        >
          <div className="max-h-[180px] w-full min-w-0 overflow-y-auto overflow-x-hidden">
            <button
              type="button"
              role="option"
              aria-selected={value === ""}
              onClick={() => handleSelect("")}
              className={`
                block
                min-h-[40px]
                w-full
                min-w-0
                truncate
                px-4
                py-2
                text-left
                text-[14px]
                transition
                ${
                  value === ""
                    ? "bg-[#8f5142] text-white"
                    : "bg-white text-[#555] hover:bg-[#fff3ef]"
                }
              `}
            >
              {placeholder}
            </button>

            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={
                  value === option.value
                }
                onClick={() =>
                  handleSelect(option.value)
                }
                className={`
                  block
                  min-h-[40px]
                  w-full
                  min-w-0
                  truncate
                  px-4
                  py-2
                  text-left
                  text-[14px]
                  transition
                  ${
                    value === option.value
                      ? "bg-[#8f5142] text-white"
                      : "bg-white text-[#555] hover:bg-[#fff3ef]"
                  }
                `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


/* =========================================================
   MOBILE-SAFE COLUMN DROPDOWN

   Group By / Order By use the same normal-flow behavior.
   Existing groupBy/orderBy state and setters are preserved.
========================================================= */

type ColumnDropdownProps = {
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function ColumnDropdown({
  value,
  options,
  onChange,
}: ColumnDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
      }
    };

    globalThis.document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      globalThis.document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className="w-full min-w-0"
    >
      <button
        type="button"
        onClick={() =>
          setOpen((previous) => !previous)
        }
        aria-haspopup="listbox"
        aria-expanded={open}
        className="
          flex
          h-[34px]
          w-full
          min-w-0
          items-center
          justify-between
          gap-2
          rounded-md
          border
          border-[#b17869]
          bg-white
          px-3
          text-left
          text-[12px]
          outline-none
          transition
          focus:border-[#8f5142]
          focus:ring-1
          focus:ring-[#b17869]/30
        "
      >
        <span
          className={`
            min-w-0
            flex-1
            truncate
            ${
              value
                ? "text-[#4f5965]"
                : "text-[#98a2ad]"
            }
          `}
        >
          {value || "Select Column"}
        </span>

        <ChevronDown
          size={15}
          className={`
            shrink-0
            text-[#555]
            transition-transform
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="
            mt-1
            w-full
            min-w-0
            max-w-full
            overflow-hidden
            rounded-md
            border
            border-[#b17869]
            bg-white
            shadow-[0_4px_12px_rgba(0,0,0,0.14)]
          "
        >
          <div className="max-h-[180px] w-full min-w-0 overflow-y-auto overflow-x-hidden">
            <button
              type="button"
              role="option"
              aria-selected={value === ""}
              onClick={() => handleSelect("")}
              className={`
                block
                min-h-[36px]
                w-full
                min-w-0
                truncate
                px-3
                py-2
                text-left
                text-[12px]
                transition
                ${
                  value === ""
                    ? "bg-[#8f5142] text-white"
                    : "bg-white text-[#4f5965] hover:bg-[#fff3ef]"
                }
              `}
            >
              Select Column
            </button>

            {options.map((option) => (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={value === option}
                onClick={() => handleSelect(option)}
                className={`
                  block
                  min-h-[36px]
                  w-full
                  min-w-0
                  truncate
                  px-3
                  py-2
                  text-left
                  text-[12px]
                  transition
                  ${
                    value === option
                      ? "bg-[#8f5142] text-white"
                      : "bg-white text-[#4f5965] hover:bg-[#fff3ef]"
                  }
                `}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


/* =========================================================
   CLOSE ICON
========================================================= */

function XIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6L6 18" />
      <path d="M6 6L18 18" />
    </svg>
  );
}
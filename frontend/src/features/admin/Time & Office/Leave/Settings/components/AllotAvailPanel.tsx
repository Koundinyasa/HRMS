// import {
//   CalendarDays,
//   ChevronDown,
//   RefreshCcw,
//   Save,
//   Search,
// } from "lucide-react";

// export interface AllotAvailEmployeeRow {
//   id: string | number;
//   employeeId: string;
//   employeeName: string;
//   leaveName: string;
//   currentBalance?: number;
//   allotted?: number;
//   available?: number;
// }

// export interface AllotAvailValues {
//   employeeLeavePolicy: string;
//   allotmentMode: string;
//   allotmentType: string;
//   period: string;
//   yearType: string;
//   allotBasedOn: string;
//   asPer: string;
//   formulaBased: boolean;
//   customQuery: boolean;
//   formula: string;
//   query: string;
//   numberOfLeaves: number | "";
//   effectiveFrom: string;
//   effectiveTo: string;
// }

// interface AllotAvailPanelProps {
//   values: AllotAvailValues;
//   policyOptions?: string[];

//   onChange: (
//     field: keyof AllotAvailValues,
//     value: AllotAvailValues[keyof AllotAvailValues],
//   ) => void;

//   employees?: AllotAvailEmployeeRow[];

//   selectedEmployeeIds?: string[];

//   onSelectedEmployeesChange?: (
//     employeeIds: string[],
//   ) => void;

//   search?: string;
//   onSearchChange?: (value: string) => void;

//   onSave?: () => void;
//   onRefresh?: () => void;

//   loading?: boolean;
//   saving?: boolean;
// }

// const selectOptions = {
//   allotmentMode: [
//     "Manual Leave Allotment",
//     "Auto Leave Allotment",
//     "Advance Allotment",
//   ],

//   allotmentType: [
//     "Fixed",
//     "Formula Based",
//     "Custom Query",
//   ],

//   period: [
//     "Monthly",
//     "Quarterly",
//     "Half Yearly",
//     "Yearly",
//   ],

//   yearType: [
//     "Calendar Year",
//     "Financial Year",
//     "Joining Year",
//   ],

//   allotBasedOn: [
//     "Employee",
//     "Designation",
//     "Department",
//     "Branch",
//     "Employee Category",
//   ],

//   asPer: [
//     "Leave Policy",
//     "Employee Grade",
//     "Employee Classification",
//   ],
// };

// const FieldLabel = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => (
//   <label className="mb-1.5 block font-[Urbanist] text-[12px] font-medium text-[#4D5752]">
//     {children}
//   </label>
// );

// const SelectField = ({
//   value,
//   options,
//   onChange,
//   disabled,
// }: {
//   value: string;
//   options: string[];
//   onChange: (value: string) => void;
//   disabled?: boolean;
// }) => (
//   <div className="relative">
//     <select
//       value={value}
//       onChange={(event) =>
//         onChange(event.target.value)
//       }
//       disabled={disabled}
//       className="
//         h-[38px] w-full
//         appearance-none
//         rounded-[7px]
//         border border-[#D5DED9]
//         bg-white
//         px-3 pr-9
//         font-[Urbanist]
//         text-[13px]
//         text-[#303532]
//         outline-none
//         transition
//         focus:border-[#009B57]
//         focus:ring-2
//         focus:ring-[#009B57]/10
//         disabled:bg-[#F5F7F6]
//         disabled:text-[#89938E]
//       "
//     >
//       <option value="">Select</option>

//       {options.map((option) => (
//         <option
//           key={option}
//           value={option}
//         >
//           {option}
//         </option>
//       ))}
//     </select>

//     <ChevronDown
//       size={14}
//       strokeWidth={1.8}
//       className="
//         pointer-events-none
//         absolute right-2.5 top-1/2
//         -translate-y-1/2
//         text-[#7A8580]
//       "
//     />
//   </div>
// );

// export default function AllotAvailPanel({
//   values,
//   onChange,
//   policyOptions = [],
//   employees = [],
//   selectedEmployeeIds = [],
//   onSelectedEmployeesChange,
//   search = "",
//   onSearchChange,
//   onSave,
//   onRefresh,
//   loading = false,
//   saving = false,
// }: AllotAvailPanelProps) {
//   const disabled = loading || saving;

//   const visibleEmployees = employees.filter(
//     (employee) => {
//       const query = search
//         .trim()
//         .toLowerCase();

//       if (!query) return true;

//       return (
//         employee.employeeId
//           .toLowerCase()
//           .includes(query) ||
//         employee.employeeName
//           .toLowerCase()
//           .includes(query) ||
//         employee.leaveName
//           .toLowerCase()
//           .includes(query)
//       );
//     },
//   );

//   const allVisibleSelected =
//     visibleEmployees.length > 0 &&
//     visibleEmployees.every((employee) =>
//       selectedEmployeeIds.includes(
//         String(employee.id),
//       ),
//     );

//   const toggleEmployee = (
//     employeeId: string,
//   ) => {
//     if (!onSelectedEmployeesChange) return;

//     if (
//       selectedEmployeeIds.includes(employeeId)
//     ) {
//       onSelectedEmployeesChange(
//         selectedEmployeeIds.filter(
//           (id) => id !== employeeId,
//         ),
//       );
//     } else {
//       onSelectedEmployeesChange([
//         ...selectedEmployeeIds,
//         employeeId,
//       ]);
//     }
//   };

//   const toggleAllVisible = () => {
//     if (!onSelectedEmployeesChange) return;

//     const visibleIds = visibleEmployees.map(
//       (employee) => String(employee.id),
//     );

//     if (allVisibleSelected) {
//       onSelectedEmployeesChange(
//         selectedEmployeeIds.filter(
//           (id) => !visibleIds.includes(id),
//         ),
//       );
//     } else {
//       onSelectedEmployeesChange(
//         Array.from(
//           new Set([
//             ...selectedEmployeeIds,
//             ...visibleIds,
//           ]),
//         ),
//       );
//     }
//   };

//   return (
//     <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[10px] border border-[#D9E6DF] bg-white">
//       {/* =====================================================
//           HEADER
//       ====================================================== */}
//       <div
//         className="
//           flex flex-col gap-3
//           border-b border-[#E4EAE7]
//           px-4 py-3.5
//           sm:px-5
//           md:flex-row
//           md:items-center
//           md:justify-between
//         "
//       >
//         <div>
//           <h2 className="font-serif text-[20px] font-semibold text-[#303532]">
//             Allot / Avail Date
//           </h2>

//           <div className="mt-1.5 h-[2px] w-[48px] rounded-full bg-[#009B57]" />
//         </div>

//         <div className="flex flex-wrap items-center gap-2">
//           {onRefresh && (
//             <button
//               type="button"
//               onClick={onRefresh}
//               disabled={disabled}
//               className="
//                 flex h-[36px]
//                 items-center justify-center
//                 gap-1.5 rounded-[7px]
//                 border border-[#D5DED9]
//                 bg-white px-3
//                 font-[Urbanist]
//                 text-[12px]
//                 font-medium
//                 text-[#59645F]
//                 transition
//                 hover:border-[#009B57]
//                 hover:text-[#009B57]
//                 disabled:cursor-not-allowed
//                 disabled:opacity-50
//               "
//             >
//               <RefreshCcw
//                 size={14}
//                 strokeWidth={1.8}
//               />
//               Refresh
//             </button>
//           )}

//           {onSave && (
//             <button
//               type="button"
//               onClick={onSave}
//               disabled={disabled}
//               className="
//                 flex h-[36px]
//                 items-center justify-center
//                 gap-1.5 rounded-[7px]
//                 bg-[#009B57] px-3.5
//                 font-[Urbanist]
//                 text-[12px]
//                 font-medium
//                 text-white
//                 transition
//                 hover:bg-[#00854A]
//                 disabled:cursor-not-allowed
//                 disabled:opacity-50
//               "
//             >
//               <Save
//                 size={14}
//                 strokeWidth={1.8}
//               />
//               {saving ? "Saving..." : "Save"}
//             </button>
//           )}
//         </div>
//       </div>

//       {/* =====================================================
//           BODY
//       ====================================================== */}
//       <div className="min-h-0 flex-1 overflow-y-auto">
//         <div className="space-y-4 p-4 sm:p-5">

//           {/* =================================================
//               ALLOTMENT CONFIGURATION
//           ================================================== */}
//           <section
//             className="
//               rounded-[9px]
//               border border-[#E0E8E3]
//               bg-[#F9FCFA]
//               p-3.5
//               sm:p-4
//             "
//           >
//             <div>
//               <h3 className="font-serif text-[15px] font-semibold text-[#39413D]">
//                 Leave Allotment
//               </h3>

//               <p className="mt-0.5 font-[Urbanist] text-[10px] text-[#8A938F]">
//                 Configure how leave should be allotted
//                 and made available.
//               </p>
//             </div>

//             <div
//               className="
//                 mt-3
//                 grid grid-cols-1
//                 gap-3
//                 sm:grid-cols-2
//                 lg:grid-cols-3
//               "
//             >
//               {/* Employee Leave Policy */}
//               <div>
//                 <FieldLabel>
//                   Employee Leave Policy
//                 </FieldLabel>

//                 <SelectField
//                   value={
//                     values.employeeLeavePolicy
//                   }
//                   options={policyOptions}
//                   disabled={disabled}
//                   onChange={(value) =>
//                     onChange(
//                       "employeeLeavePolicy",
//                       value,
//                     )
//                   }
//                 />
//               </div>

//               {/* Allotment Mode */}
//               <div>
//                 <FieldLabel>
//                   Allotment Mode
//                 </FieldLabel>

//                 <SelectField
//                   value={
//                     values.allotmentMode
//                   }
//                   options={
//                     selectOptions.allotmentMode
//                   }
//                   disabled={disabled}
//                   onChange={(value) =>
//                     onChange(
//                       "allotmentMode",
//                       value,
//                     )
//                   }
//                 />
//               </div>

//               {/* Allotment Type */}
//               <div>
//                 <FieldLabel>
//                   Allotment Type
//                 </FieldLabel>

//                 <SelectField
//                   value={
//                     values.allotmentType
//                   }
//                   options={
//                     selectOptions.allotmentType
//                   }
//                   disabled={disabled}
//                   onChange={(value) =>
//                     onChange(
//                       "allotmentType",
//                       value,
//                     )
//                   }
//                 />
//               </div>

//               {/* Period */}
//               <div>
//                 <FieldLabel>
//                   Period
//                 </FieldLabel>

//                 <SelectField
//                   value={values.period}
//                   options={
//                     selectOptions.period
//                   }
//                   disabled={disabled}
//                   onChange={(value) =>
//                     onChange(
//                       "period",
//                       value,
//                     )
//                   }
//                 />
//               </div>

//               {/* Year Type */}
//               <div>
//                 <FieldLabel>
//                   Year Type
//                 </FieldLabel>

//                 <SelectField
//                   value={
//                     values.yearType
//                   }
//                   options={
//                     selectOptions.yearType
//                   }
//                   disabled={disabled}
//                   onChange={(value) =>
//                     onChange(
//                       "yearType",
//                       value,
//                     )
//                   }
//                 />
//               </div>

//               {/* Allot Based On */}
//               <div>
//                 <FieldLabel>
//                   Allot Based On
//                 </FieldLabel>

//                 <SelectField
//                   value={
//                     values.allotBasedOn
//                   }
//                   options={
//                     selectOptions.allotBasedOn
//                   }
//                   disabled={disabled}
//                   onChange={(value) =>
//                     onChange(
//                       "allotBasedOn",
//                       value,
//                     )
//                   }
//                 />
//               </div>

//               {/* As Per */}
//               <div>
//                 <FieldLabel>
//                   As Per
//                 </FieldLabel>

//                 <SelectField
//                   value={values.asPer}
//                   options={
//                     selectOptions.asPer
//                   }
//                   disabled={disabled}
//                   onChange={(value) =>
//                     onChange(
//                       "asPer",
//                       value,
//                     )
//                   }
//                 />
//               </div>

//               {/* Number Of Leaves */}
//               <div>
//                 <FieldLabel>
//                   Number of Leaves
//                 </FieldLabel>

//                 <input
//                   type="number"
//                   min={0}
//                   step="0.5"
//                   value={
//                     values.numberOfLeaves
//                   }
//                   disabled={disabled}
//                   onChange={(event) => {
//                     const value =
//                       event.target.value;

//                     onChange(
//                       "numberOfLeaves",
//                       value === ""
//                         ? ""
//                         : Number(value),
//                     );
//                   }}
//                   className="
//                     h-[38px] w-full
//                     rounded-[7px]
//                     border border-[#D5DED9]
//                     bg-white px-3
//                     font-[Urbanist]
//                     text-[13px]
//                     text-[#303532]
//                     outline-none
//                     focus:border-[#009B57]
//                     focus:ring-2
//                     focus:ring-[#009B57]/10
//                     disabled:bg-[#F5F7F6]
//                   "
//                 />
//               </div>

//               {/* Effective From */}
//               <div>
//                 <FieldLabel>
//                   Effective From
//                 </FieldLabel>

//                 <div className="relative">
//                   <input
//                     type="date"
//                     value={
//                       values.effectiveFrom
//                     }
//                     disabled={disabled}
//                     onChange={(event) =>
//                       onChange(
//                         "effectiveFrom",
//                         event.target.value,
//                       )
//                     }
//                     className="
//                       h-[38px] w-full
//                       rounded-[7px]
//                       border border-[#D5DED9]
//                       bg-white px-3
//                       font-[Urbanist]
//                       text-[13px]
//                       text-[#303532]
//                       outline-none
//                       focus:border-[#009B57]
//                       focus:ring-2
//                       focus:ring-[#009B57]/10
//                       disabled:bg-[#F5F7F6]
//                     "
//                   />
//                 </div>
//               </div>

//               {/* Effective To */}
//               <div>
//                 <FieldLabel>
//                   Effective To
//                 </FieldLabel>

//                 <input
//                   type="date"
//                   value={
//                     values.effectiveTo
//                   }
//                   disabled={disabled}
//                   onChange={(event) =>
//                     onChange(
//                       "effectiveTo",
//                       event.target.value,
//                     )
//                   }
//                   className="
//                     h-[38px] w-full
//                     rounded-[7px]
//                     border border-[#D5DED9]
//                     bg-white px-3
//                     font-[Urbanist]
//                     text-[13px]
//                     text-[#303532]
//                     outline-none
//                     focus:border-[#009B57]
//                     focus:ring-2
//                     focus:ring-[#009B57]/10
//                     disabled:bg-[#F5F7F6]
//                   "
//                 />
//               </div>
//             </div>
//           </section>

//           {/* =================================================
//               FORMULA / QUERY
//           ================================================== */}
//           <section
//             className="
//               rounded-[9px]
//               border border-[#E0E8E3]
//               bg-[#F9FCFA]
//               p-3.5
//               sm:p-4
//             "
//           >
//             <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//               <div>
//                 <h3 className="font-serif text-[15px] font-semibold text-[#39413D]">
//                   Allocation Rule
//                 </h3>

//                 <p className="mt-0.5 font-[Urbanist] text-[10px] text-[#8A938F]">
//                   Use a formula or custom query when
//                   allocation is rule based.
//                 </p>
//               </div>

//               <div className="flex flex-wrap gap-2">
//                 <label
//                   className="
//                     flex cursor-pointer
//                     items-center gap-2
//                     rounded-[7px]
//                     border border-[#DDE6E1]
//                     bg-white px-3 py-2
//                   "
//                 >
//                   <input
//                     type="checkbox"
//                     checked={
//                       values.formulaBased
//                     }
//                     disabled={disabled}
//                     onChange={(event) =>
//                       onChange(
//                         "formulaBased",
//                         event.target.checked,
//                       )
//                     }
//                     className="h-3.5 w-3.5 accent-[#009B57]"
//                   />

//                   <span className="font-[Urbanist] text-[11px] text-[#4D5752]">
//                     Formula Based
//                   </span>
//                 </label>

//                 <label
//                   className="
//                     flex cursor-pointer
//                     items-center gap-2
//                     rounded-[7px]
//                     border border-[#DDE6E1]
//                     bg-white px-3 py-2
//                   "
//                 >
//                   <input
//                     type="checkbox"
//                     checked={
//                       values.customQuery
//                     }
//                     disabled={disabled}
//                     onChange={(event) =>
//                       onChange(
//                         "customQuery",
//                         event.target.checked,
//                       )
//                     }
//                     className="h-3.5 w-3.5 accent-[#009B57]"
//                   />

//                   <span className="font-[Urbanist] text-[11px] text-[#4D5752]">
//                     Custom Query
//                   </span>
//                 </label>
//               </div>
//             </div>

//             {values.formulaBased && (
//               <div className="mt-3">
//                 <FieldLabel>
//                   Formula
//                 </FieldLabel>

//                 <textarea
//                   value={values.formula}
//                   disabled={disabled}
//                   onChange={(event) =>
//                     onChange(
//                       "formula",
//                       event.target.value,
//                     )
//                   }
//                   placeholder="Enter allocation formula"
//                   rows={3}
//                   className="
//                     w-full resize-y
//                     rounded-[7px]
//                     border border-[#D5DED9]
//                     bg-white px-3 py-2.5
//                     font-mono
//                     text-[12px]
//                     leading-5
//                     text-[#303532]
//                     outline-none
//                     placeholder:text-[#A0A8A4]
//                     focus:border-[#009B57]
//                     focus:ring-2
//                     focus:ring-[#009B57]/10
//                     disabled:bg-[#F5F7F6]
//                   "
//                 />
//               </div>
//             )}

//             {values.customQuery && (
//               <div className="mt-3">
//                 <FieldLabel>
//                   Custom Query
//                 </FieldLabel>

//                 <textarea
//                   value={values.query}
//                   disabled={disabled}
//                   onChange={(event) =>
//                     onChange(
//                       "query",
//                       event.target.value,
//                     )
//                   }
//                   placeholder="Enter custom query"
//                   rows={4}
//                   className="
//                     w-full resize-y
//                     rounded-[7px]
//                     border border-[#D5DED9]
//                     bg-white px-3 py-2.5
//                     font-mono
//                     text-[12px]
//                     leading-5
//                     text-[#303532]
//                     outline-none
//                     placeholder:text-[#A0A8A4]
//                     focus:border-[#009B57]
//                     focus:ring-2
//                     focus:ring-[#009B57]/10
//                     disabled:bg-[#F5F7F6]
//                   "
//                 />
//               </div>
//             )}
//           </section>

//           {/* =================================================
//               EMPLOYEE LIST
//           ================================================== */}
//           <section
//             className="
//               overflow-hidden
//               rounded-[9px]
//               border border-[#DCE6E1]
//               bg-white
//             "
//           >
//             {/* Table header */}
//             <div
//               className="
//                 flex flex-col gap-3
//                 border-b border-[#E4EAE7]
//                 bg-[#F9FCFA]
//                 px-3.5 py-3
//                 sm:flex-row
//                 sm:items-center
//                 sm:justify-between
//               "
//             >
//               <div>
//                 <h3 className="font-serif text-[15px] font-semibold text-[#39413D]">
//                   Employee Leave Allocation
//                 </h3>
//               </div>

//               {onSearchChange && (
//                 <div className="relative w-full sm:w-[230px]">
//                   <Search
//                     size={14}
//                     strokeWidth={1.8}
//                     className="
//                       pointer-events-none
//                       absolute left-3 top-1/2
//                       -translate-y-1/2
//                       text-[#8A938F]
//                     "
//                   />

//                   <input
//                     value={search}
//                     onChange={(event) =>
//                       onSearchChange(
//                         event.target.value,
//                       )
//                     }
//                     placeholder="Search employee..."
//                     className="
//                       h-[34px] w-full
//                       rounded-[7px]
//                       border border-[#D5DED9]
//                       bg-white
//                       pl-9 pr-3
//                       font-[Urbanist]
//                       text-[12px]
//                       text-[#303532]
//                       outline-none
//                       placeholder:text-[#A0A8A4]
//                       focus:border-[#009B57]
//                     "
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Responsive table */}
//             <div className="overflow-x-auto">
//               <table className="min-w-[760px] w-full border-collapse">
//                 <thead>
//                   <tr className="border-b border-[#E5EAE7] bg-[#FCFDFC]">
//                     <th className="w-[46px] px-3 py-2.5 text-left">
//                       <input
//                         type="checkbox"
//                         checked={
//                           allVisibleSelected
//                         }
//                         onChange={
//                           toggleAllVisible
//                         }
//                         disabled={
//                           disabled ||
//                           visibleEmployees.length === 0
//                         }
//                         className="h-3.5 w-3.5 accent-[#009B57]"
//                       />
//                     </th>

//                     <th className="px-3 py-2.5 text-left font-[Urbanist] text-[11px] font-semibold text-[#59645F]">
//                       Employee ID
//                     </th>

//                     <th className="px-3 py-2.5 text-left font-[Urbanist] text-[11px] font-semibold text-[#59645F]">
//                       Employee Name
//                     </th>

//                     <th className="px-3 py-2.5 text-left font-[Urbanist] text-[11px] font-semibold text-[#59645F]">
//                       Leave
//                     </th>

//                     <th className="px-3 py-2.5 text-right font-[Urbanist] text-[11px] font-semibold text-[#59645F]">
//                       Balance
//                     </th>

//                     <th className="px-3 py-2.5 text-right font-[Urbanist] text-[11px] font-semibold text-[#59645F]">
//                       Allotted
//                     </th>

//                     <th className="px-3 py-2.5 text-right font-[Urbanist] text-[11px] font-semibold text-[#59645F]">
//                       Available
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {loading ? (
//                     <tr>
//                       <td
//                         colSpan={7}
//                         className="px-4 py-12 text-center font-[Urbanist] text-[12px] text-[#7A8580]"
//                       >
//                         Loading...
//                       </td>
//                     </tr>
//                   ) : visibleEmployees.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan={7}
//                         className="px-4 py-12 text-center"
//                       >
//                         <div className="mx-auto flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#EEF9F3]">
//                           <CalendarDays
//                             size={19}
//                             strokeWidth={1.7}
//                             className="text-[#009B57]"
//                           />
//                         </div>

//                         <p className="mt-2 font-serif text-[15px] font-semibold text-[#39413D]">
//                           No employees found
//                         </p>

//                         <p className="mt-0.5 font-[Urbanist] text-[11px] text-[#8A938F]">
//                           No employee allocation
//                           records are available.
//                         </p>
//                       </td>
//                     </tr>
//                   ) : (
//                     visibleEmployees.map(
//                       (employee) => {
//                         const id =
//                           String(employee.id);

//                         const selected =
//                           selectedEmployeeIds.includes(
//                             id,
//                           );

//                         return (
//                           <tr
//                             key={id}
//                             className={[
//                               "border-b border-[#EEF1EF]",
//                               "transition",
//                               selected
//                                 ? "bg-[#F2FBF6]"
//                                 : "hover:bg-[#FAFCFB]",
//                             ].join(" ")}
//                           >
//                             <td className="px-3 py-2.5">
//                               <input
//                                 type="checkbox"
//                                 checked={selected}
//                                 onChange={() =>
//                                   toggleEmployee(
//                                     id,
//                                   )
//                                 }
//                                 disabled={disabled}
//                                 className="h-3.5 w-3.5 accent-[#009B57]"
//                               />
//                             </td>

//                             <td className="px-3 py-2.5 font-[Urbanist] text-[12px] text-[#3F4743]">
//                               {employee.employeeId}
//                             </td>

//                             <td className="px-3 py-2.5 font-[Urbanist] text-[12px] font-medium text-[#303532]">
//                               {employee.employeeName}
//                             </td>

//                             <td className="px-3 py-2.5 font-[Urbanist] text-[12px] text-[#59645F]">
//                               {employee.leaveName}
//                             </td>

//                             <td className="px-3 py-2.5 text-right font-[Urbanist] text-[12px] text-[#59645F]">
//                               {employee.currentBalance ??
//                                 0}
//                             </td>

//                             <td className="px-3 py-2.5 text-right font-[Urbanist] text-[12px] text-[#59645F]">
//                               {employee.allotted ??
//                                 0}
//                             </td>

//                             <td className="px-3 py-2.5 text-right font-[Urbanist] text-[12px] font-medium text-[#009B57]">
//                               {employee.available ??
//                                 0}
//                             </td>
//                           </tr>
//                         );
//                       },
//                     )
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         </div>
//       </div>
//     </section>
//   );
// }

import { useMemo, useState } from "react";
import {
  ChevronDown,
  Filter,
  MoreVertical,
  Pencil,
  Search,
  X,
} from "lucide-react";

export interface AllotAvailLeaveType {
  id: number | string;
  name: string;
  shortName?: string;
}

export interface AllotAvailEmployeeRow {
  id: number | string;
  employeeId: string;
  employeeName: string;
  allotStartDate: string | null;
  availStartDate: string | null;
}

interface AllotAvailPanelProps {
  /* REAL BACKEND DATA */
  leaveTypes?: AllotAvailLeaveType[];
  employees?: AllotAvailEmployeeRow[];

  /* REAL BACKEND STATE */
  loading?: boolean;
  showFilters: boolean;
  onShowFiltersChange: (visible: boolean) => void;

  /* SELECTED LEAVE */
  selectedLeaveId?: number | string | null;
  onLeaveChange?: (leaveId: number | string) => void;

  /* EDIT */
  onEdit?: (row: AllotAvailEmployeeRow) => void;

  /* OPTIONAL FILTER CALLBACK */
  onSearch?: (value: string) => void;
}

const formatDate = (value: string | null | undefined) => {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function AllotAvailPanel({
  leaveTypes = [],
  employees = [],
  loading = false,
  showFilters,
  onShowFiltersChange,
  selectedLeaveId,
  onLeaveChange,
  onEdit,
  onSearch,
}: AllotAvailPanelProps) {
  const [search, setSearch] = useState("");

  const [branch, setBranch] = useState("Branch");
  const [salaryStructure, setSalaryStructure] =
    useState("Salary Structure");
  const [leave, setLeave] = useState("Leave");
  const [attendance, setAttendance] =
    useState("Attendance");
  const [designation, setDesignation] =
    useState("Designation");
  const [empStatus, setEmpStatus] =
    useState("Emp Status");

  const [openDropdown, setOpenDropdown] =
    useState<string | null>(null);

  const [queryOpen, setQueryOpen] =
    useState(false);

  const [queryType, setQueryType] =
    useState("Employee Name");

  const activeLeaveId =
    selectedLeaveId ?? leaveTypes[0]?.id ?? null;

  const filteredEmployees = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return employees;
    }

    return employees.filter((employee) => {
      return (
        employee.employeeId
          ?.toLowerCase()
          .includes(value) ||
        employee.employeeName
          ?.toLowerCase()
          .includes(value)
      );
    });
  }, [employees, search]);

  const handleSearch = (value: string) => {
    setSearch(value);
    onSearch?.(value);
  };

  const toggleDropdown = (name: string) => {
    setOpenDropdown((current) =>
      current === name ? null : name,
    );
  };

  const Dropdown = ({
    name,
    value,
    options,
    onChange,
    width = "auto",
  }: {
    name: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
    width?: string;
  }) => {
    const isOpen = openDropdown === name;

    return (
      <div
        className="relative shrink-0"
        style={{ width }}
      >
        <button
          type="button"
          onClick={() => toggleDropdown(name)}
          className="
            flex
            items-center
            gap-1.5
            whitespace-nowrap
            font-[Urbanist]
            text-[14px]
            font-medium
            text-[#344054]
          "
        >
          <span>{value}</span>

          <ChevronDown
            size={16}
            strokeWidth={1.8}
            className="text-[#667085]"
          />
        </button>

        {isOpen && (
          <div
            className="
              absolute
              left-0
              top-[28px]
              z-[100]
              min-w-[170px]
              overflow-hidden
              rounded-[8px]
              border
              border-[#E0E5EB]
              bg-white
              py-1
              shadow-[0_8px_24px_rgba(15,23,42,0.12)]
            "
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setOpenDropdown(null);
                }}
                className={`
                  block
                  w-full
                  px-4
                  py-2.5
                  text-left
                  font-[Urbanist]
                  text-[13px]
                  ${
                    value === option
                      ? "bg-[#EFF8FF] text-[#269BD7]"
                      : "text-[#344054] hover:bg-[#F8FAFC]"
                  }
                `}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div
        className="
          grid
          grid-cols-[300px_minmax(0,1fr)]
          gap-5
        "
      >
        {/* =====================================================
            LEFT : LEAVE TYPES
        ====================================================== */}
        <div
          className="
            overflow-hidden
            rounded-[8px]
            border
            border-[#E2E7ED]
            bg-white
            shadow-[0_1px_4px_rgba(15,23,42,0.05)]
          "
        >
          <div className="max-h-[620px] overflow-y-auto">
            {leaveTypes.map((leaveType) => {
              const isActive =
                String(activeLeaveId) ===
                String(leaveType.id);

              return (
                <button
                  key={leaveType.id}
                  type="button"
                  onClick={() =>
                    onLeaveChange?.(leaveType.id)
                  }
                  className={`
                    relative
                    flex
                    min-h-[78px]
                    w-full
                    items-center
                    gap-4
                    border-b
                    border-[#E7EBF0]
                    px-3
                    text-left
                    transition-colors
                    ${
                      isActive
                        ? "bg-[#CFE5F3]"
                        : "bg-white hover:bg-[#F8FAFC]"
                    }
                  `}
                >
                  {/* ACTIVE BAR */}
                  {isActive && (
                    <span
                      className="
                        absolute
                        right-0
                        top-0
                        h-full
                        w-[5px]
                        bg-[#269BD7]
                      "
                    />
                  )}

                  {/* ICON */}
                  <div
                    className={`
                      flex
                      h-[40px]
                      w-[40px]
                      shrink-0
                      items-center
                      justify-center
                      rounded-[8px]
                      font-[Urbanist]
                      text-[18px]
                      font-medium
                      ${
                        isActive
                          ? "bg-[#E5F4FC] text-[#269BD7]"
                          : "bg-[#E5E7EB] text-[#475467]"
                      }
                    `}
                  >
                    {leaveType.name
                      ?.charAt(0)
                      .toUpperCase() || "L"}
                  </div>

                  {/* NAME + SHORT NAME */}
                  <div className="min-w-0">
                    <div
                      className={`
                        truncate
                        font-[Urbanist]
                        text-[16px]
                        font-semibold
                        ${
                          isActive
                            ? "text-[#269BD7]"
                            : "text-[#344054]"
                        }
                      `}
                    >
                      {leaveType.name}
                    </div>

                    {leaveType.shortName && (
                      <span
                        className="
                          mt-1
                          inline-flex
                          rounded-[4px]
                          bg-[#E8ECF2]
                          px-2
                          py-0.5
                          font-[Urbanist]
                          text-[13px]
                          font-medium
                          text-[#667085]
                        "
                      >
                        {leaveType.shortName}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}

            {!loading && leaveTypes.length === 0 && (
              <div
                className="
                  flex
                  min-h-[220px]
                  items-center
                  justify-center
                  px-5
                  text-center
                  font-[Urbanist]
                  text-[14px]
                  text-[#667085]
                "
              >
                No leave types found.
              </div>
            )}

            {loading && (
              <div
                className="
                  flex
                  min-h-[220px]
                  items-center
                  justify-center
                  font-[Urbanist]
                  text-[14px]
                  text-[#667085]
                "
              >
                Loading...
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            RIGHT : EMPLOYEE DATA
        ====================================================== */}
        <div className="min-w-0">
          {/* =================================================
              FILTER BAR
          ================================================== */}
          {showFilters && (
            <div
              className="
                mb-4
                overflow-visible
                rounded-[8px]
                border
                border-[#E1E6EC]
                bg-white
                shadow-[0_1px_4px_rgba(15,23,42,0.05)]
              "
            >
              {/* TOP FILTER ROW */}
              <div
                className="
                  flex
                  min-h-[54px]
                  items-center
                  gap-8
                  border-b
                  border-[#EEF1F4]
                  px-5
                "
              >
                <Dropdown
                  name="branch"
                  value={branch}
                  options={[
                    "Branch",
                    "All",
                  ]}
                  onChange={setBranch}
                />

                <Dropdown
                  name="salary"
                  value={salaryStructure}
                  options={[
                    "Salary Structure",
                    "All",
                  ]}
                  onChange={setSalaryStructure}
                />

                <Dropdown
                  name="leave"
                  value={leave}
                  options={[
                    "Leave",
                    "All",
                  ]}
                  onChange={setLeave}
                />

                <Dropdown
                  name="attendance"
                  value={attendance}
                  options={[
                    "Attendance",
                    "All",
                  ]}
                  onChange={setAttendance}
                />

                <Dropdown
                  name="designation"
                  value={designation}
                  options={[
                    "Designation",
                    "All",
                  ]}
                  onChange={setDesignation}
                />

                <Dropdown
                  name="empStatus"
                  value={empStatus}
                  options={[
                    "Emp Status",
                    "All",
                    "Active",
                    "Inactive",
                  ]}
                  onChange={setEmpStatus}
                />

                <button
                  type="button"
                  title="More filters"
                  className="
                    ml-auto
                    flex
                    h-[30px]
                    w-[28px]
                    items-center
                    justify-center
                    text-[#91A0B5]
                    hover:text-[#344054]
                  "
                >
                  <MoreVertical size={21} />
                </button>

                <button
                  type="button"
                  title="Hide filters"
                  onClick={() =>
                    onShowFiltersChange(false)
                  }
                  className="
                    flex
                    h-[30px]
                    w-[28px]
                    items-center
                    justify-center
                    text-[#D92D20]
                    hover:bg-[#FFF5F5]
                  "
                >
                  <X size={20} />
                </button>
              </div>

              {/* BOTTOM FILTER ROW */}
              <div
                className="
                  flex
                  min-h-[56px]
                  items-center
                  px-5
                "
              >
                <div className="relative min-w-0 flex-1">
                  <Search
                    size={22}
                    strokeWidth={1.7}
                    className="
                      absolute
                      left-0
                      top-1/2
                      -translate-y-1/2
                      text-[#91A0B5]
                    "
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      handleSearch(
                        event.target.value,
                      )
                    }
                    placeholder="Start Typing..."
                    className="
                      h-[40px]
                      w-full
                      border-0
                      bg-transparent
                      pl-9
                      pr-3
                      font-[Urbanist]
                      text-[14px]
                      text-[#344054]
                      outline-none
                      placeholder:text-[#C4CAD3]
                    "
                  />
                </div>

                {/* ADD FILTER */}
                <button
                  type="button"
                  className="
                    ml-5
                    flex
                    shrink-0
                    items-center
                    gap-2
                    whitespace-nowrap
                    font-[Urbanist]
                    text-[15px]
                    font-medium
                    text-[#344054]
                    hover:text-[#269BD7]
                  "
                >
                  <span className="text-[24px] font-light leading-none">
                    +
                  </span>

                  Add Filter
                </button>

                {/* QUERY */}
                <div className="relative ml-8 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setQueryOpen(
                        (current) => !current,
                      )
                    }
                    className="
                      flex
                      items-center
                      gap-2
                      whitespace-nowrap
                      font-[Urbanist]
                      text-[15px]
                      font-medium
                      text-[#344054]
                    "
                  >
                    Query

                    <ChevronDown
                      size={16}
                      strokeWidth={1.8}
                    />
                  </button>

                  {queryOpen && (
                    <div
                      className="
                        absolute
                        right-0
                        top-[30px]
                        z-[100]
                        w-[180px]
                        overflow-hidden
                        rounded-[8px]
                        border
                        border-[#E1E6EC]
                        bg-white
                        py-1
                        shadow-[0_8px_24px_rgba(15,23,42,0.12)]
                      "
                    >
                      {[
                        "Employee Name",
                        "Employee ID",
                      ].map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setQueryType(
                              option,
                            );
                            setQueryOpen(false);
                          }}
                          className={`
                            block
                            w-full
                            px-4
                            py-2.5
                            text-left
                            font-[Urbanist]
                            text-[13px]
                            ${
                              queryType ===
                              option
                                ? "bg-[#EFF8FF] text-[#269BD7]"
                                : "text-[#344054] hover:bg-[#F8FAFC]"
                            }
                          `}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              TABLE
          ================================================== */}
          <div className="overflow-hidden rounded-[8px]">
            {/* HEADER */}
            <div
              className="
                grid
                grid-cols-[1fr_1.5fr_1.2fr_1.2fr_70px]
                items-center
                rounded-[8px]
                bg-[#CFE5F3]
                px-4
                py-[18px]
                font-[Urbanist]
                text-[15px]
                font-semibold
                text-[#172033]
              "
            >
              <div className="flex items-center gap-2">
                Employee ID

                <Filter
                  size={16}
                  className="text-[#91A0B5]"
                />
              </div>

              <div className="flex items-center gap-2">
                Employee Name

                <Filter
                  size={16}
                  className="text-[#91A0B5]"
                />
              </div>

              <div className="flex items-center gap-2">
                Allot Start Date

                <Filter
                  size={16}
                  className="text-[#91A0B5]"
                />
              </div>

              <div className="flex items-center gap-2">
                Avail Start Date

                <Filter
                  size={16}
                  className="text-[#91A0B5]"
                />
              </div>

              <div className="text-center">
                Action
              </div>
            </div>

            {/* LOADING */}
            {loading && (
              <div
                className="
                  flex
                  min-h-[250px]
                  items-center
                  justify-center
                  rounded-b-[8px]
                  bg-white
                  font-[Urbanist]
                  text-[14px]
                  text-[#667085]
                "
              >
                Loading...
              </div>
            )}

            {/* EMPTY */}
            {!loading &&
              filteredEmployees.length === 0 && (
                <div
                  className="
                    flex
                    min-h-[320px]
                    flex-col
                    items-center
                    justify-center
                    rounded-b-[8px]
                    bg-white
                  "
                >
                  <img
                    src="/no-data.png"
                    alt="No data"
                    className="
                      mb-4
                      h-[150px]
                      w-[150px]
                      object-contain
                    "
                  />

                  <p
                    className="
                      font-[Urbanist]
                      text-[14px]
                      text-[#667085]
                    "
                  >
                    No records found.
                  </p>
                </div>
              )}

            {/* ROWS */}
            {!loading &&
              filteredEmployees.length > 0 &&
              filteredEmployees.map((row) => (
                <div
                  key={row.id}
                  className="
                    mt-3
                    grid
                    grid-cols-[1fr_1.5fr_1.2fr_1.2fr_70px]
                    items-center
                    rounded-[8px]
                    bg-white
                    px-4
                    py-[20px]
                    font-[Urbanist]
                    text-[15px]
                    text-[#172033]
                    shadow-[0_1px_4px_rgba(15,23,42,0.04)]
                  "
                >
                  <div>
                    {row.employeeId}
                  </div>

                  <div className="truncate pr-3">
                    {row.employeeName}
                  </div>

                  <div>
                    {formatDate(
                      row.allotStartDate,
                    )}
                  </div>

                  <div>
                    {formatDate(
                      row.availStartDate,
                    )}
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      title="Edit"
                      onClick={() =>
                        onEdit?.(row)
                      }
                      className="
                        flex
                        h-[32px]
                        w-[32px]
                        items-center
                        justify-center
                        rounded-[6px]
                        text-[#8EA0BD]
                        hover:bg-[#F2F8FC]
                        hover:text-[#269BD7]
                      "
                    >
                      <Pencil
                        size={20}
                        strokeWidth={1.8}
                      />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

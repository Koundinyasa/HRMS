// import React, { useRef, useState } from "react";
// import { Calendar, ChevronDown, Plus } from "lucide-react";
// import AddEmployeeWizard, { type EmployeeFormData } from "./AddEmployeeWizard";
// import EnrollmentToolbarPortal from "../components/EnrollmentToolbarPortal";

// /* =========================================================
//    TYPES
// ========================================================= */

// type CandidateForm = {
//   title: string;
//   firstName: string;
//   middleName: string;
//   lastName: string;
//   fullName: string;
//   fatherName: string;
//   maritalStatus: string;
//   spouseName: string;
//   dob: string;
//   gender: string;
//   physicallyChallenged: boolean;
//   photoUrl: string;
// };

// /* =========================================================
//    DESIGN TOKENS  — sized to the Figma
// ========================================================= */

// const FIELD = `
//   h-[40px] w-full rounded-[4px] border border-[#E8E2D6]
//   bg-[#FEFAF2] px-[12px] text-[13px] text-[#5B6572]
//   outline-none transition-all duration-150
//   placeholder:text-[#BEB4A4]
//   focus:border-[#2D8CF0] focus:ring-2 focus:ring-[#2D8CF0]/15
// `;

// const LABEL =
//   "mb-[6px] block text-[12px] leading-[15px] font-medium text-[#596273]";

// /* =========================================================
//    DATE HELPERS
// ========================================================= */

// const toISO = (ddmmyyyy: string): string => {
//   if (!ddmmyyyy || ddmmyyyy.length !== 10) return "";
//   const [dd, mm, yyyy] = ddmmyyyy.split("-");
//   return dd && mm && yyyy ? `${yyyy}-${mm}-${dd}` : "";
// };

// const toDisplay = (iso: string): string => {
//   if (!iso || iso.length !== 10) return "";
//   const [yyyy, mm, dd] = iso.split("-");
//   return yyyy && mm && dd ? `${dd}-${mm}-${yyyy}` : "";
// };

// /* =========================================================
//    FIELD
// ========================================================= */

// interface FieldProps {
//   label: string;
//   children: React.ReactNode;
//   className?: string;
// }

// const Field: React.FC<FieldProps> = ({ label, children, className = "" }) => (
//   <div className={className}>
//     <label className={LABEL}>{label}</label>
//     {children}
//   </div>
// );

// /* =========================================================
//    DATE INPUT
// ========================================================= */

// interface DateInputProps {
//   value: string;
//   onChange: (value: string) => void;
// }

// const DateInput: React.FC<DateInputProps> = ({ value, onChange }) => {
//   const hiddenDateRef = useRef<HTMLInputElement>(null);

//   const openPicker = () => {
//     const el = hiddenDateRef.current;
//     if (!el) return;
//     if (typeof (el as any).showPicker === "function") (el as any).showPicker();
//     else {
//       el.focus();
//       el.click();
//     }
//   };

//   return (
//     <div className="relative">
//       <input
//         type="text"
//         value={value}
//         readOnly
//         onClick={openPicker}
//         placeholder="DD-MM-YYYY"
//         className={`${FIELD} pr-[36px] cursor-pointer`}
//       />
//       <button
//         type="button"
//         onClick={openPicker}
//         className="absolute right-2 top-1/2 -translate-y-1/2 flex h-[24px] w-[24px] items-center justify-center rounded text-[#A98A5A] hover:bg-[#F5F0E8]"
//       >
//         <Calendar size={15} />
//       </button>
//       <input
//         ref={hiddenDateRef}
//         type="date"
//         value={toISO(value)}
//         onChange={(e) => {
//           const iso = e.target.value;
//           onChange(iso ? toDisplay(iso) : "");
//         }}
//         className="absolute opacity-0 pointer-events-none w-0 h-0"
//         tabIndex={-1}
//       />
//     </div>
//   );
// };

// /* =========================================================
//    PAGE
// ========================================================= */

// const PendingCandidatePage: React.FC = () => {
//   const [wizardOpen, setWizardOpen] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState("Vakati Nandhini");

//   const [form, setForm] = useState<CandidateForm>({
//     title: "Ms",
//     firstName: "Vakati",
//     middleName: "Kumar",
//     lastName: "Nandhini",
//     fullName: "Vakati Nandhini",
//     fatherName: "Vakati Vijaya Bhaskar Reddy",
//     maritalStatus: "Unmarried",
//     spouseName: "Khushaboo Sharma",
//     dob: "16-08-2002",
//     gender: "Female",
//     physicallyChallenged: true,
//     photoUrl: "https://randomuser.me/api/portraits/women/68.jpg",
//   });

//   const candidates = ["Vakati Nandhini"];

//   const handleChange = (field: keyof CandidateForm, value: string | boolean) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const wizardPrefill: Partial<EmployeeFormData> = {
//     employeeId: "344913",
//     title: form.title,
//     firstName: form.firstName,
//     middleName: form.middleName,
//     lastName: form.lastName,
//     fullName: form.fullName,
//     gender: form.gender,
//     fatherName: form.fatherName,
//     maritalStatus: form.maritalStatus,
//     spouseName: form.spouseName,
//     photoUrl: form.photoUrl,
//     confirmationDate: "",
//     notes: "",
//     dateOfJoining: "",
//     dateOfSalary: "",
//     prefix: "",
//     probationPeriod: 30,
//     panNumber: "",
//     aadhaarNumber: "",
//     uanNumber: "",
//     pfApplicable: true,
//     pfNumber: "",
//     esiApplicable: false,
//     esiNumber: "",
//     bankAccountNumber: "",
//     bankIfsc: "",
//     bankName: "",
//     documents: [],
//   };

//   const handleWizardSubmit = (data: EmployeeFormData) => {
//     console.log("Employee created:", data);
//     setWizardOpen(false);
//   };

//   return (
//     <div className="relative h-[calc(100vh-80px)] w-full bg-[#F5F7FA] flex flex-col overflow-hidden">
//       <EnrollmentToolbarPortal>
//         <button
//           type="button"
//           onClick={() => setWizardOpen(true)}
//           className="flex h-[32px] items-center gap-1.5 rounded-[5px] bg-[#2589E8] px-3.5 text-[12.5px] font-semibold text-white shadow-[0_1px_3px_rgba(37,137,232,0.3)] hover:bg-[#147BD8]"
//         >
//           <Plus size={14} strokeWidth={2.5} />
//           <span>Add Employee</span>
//         </button>
//       </EnrollmentToolbarPortal>

//       {/* FULL HEIGHT CARD — stretches to fill the viewport */}
//       <div className="flex-1 min-h-0 flex overflow-hidden rounded-[6px] border border-[#E7E9ED] bg-white m-2 shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
//         {/* LEFT SIDEBAR — full height */}
//         <aside className="w-[190px] shrink-0 border-r border-[#EEF0F3] bg-white overflow-y-auto">
//           <div className="py-1.5">
//             {candidates.map((candidate) => {
//               const active = candidate === selectedCandidate;
//               return (
//                 <button
//                   key={candidate}
//                   type="button"
//                   onClick={() => setSelectedCandidate(candidate)}
//                   className={`
//                     relative flex h-[42px] w-full items-center px-4 text-left text-[13px] transition-colors
//                     ${
//                       active
//                         ? "bg-[#F5F8FC] font-semibold text-[#2589E8]"
//                         : "text-[#687384] hover:bg-[#F8FAFC]"
//                     }
//                   `}
//                 >
//                   {candidate}
//                   {active && (
//                     <span className="absolute right-0 top-0 h-full w-[3px] bg-[#2589E8]" />
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         </aside>

//         {/* MAIN CONTENT — fills remaining width + height */}
//         <main className="flex-1 min-w-0 overflow-y-auto bg-white">
//           <div className="flex h-full gap-10 px-10 py-7">
//             {/* PHOTO */}
//             <div className="flex-shrink-0 pt-[26px]">
//               <div className="flex h-[190px] w-[160px] items-center justify-center rounded-[3px] border border-dashed border-[#D6D9DE] bg-white p-2">
//                 <img
//                   src={form.photoUrl}
//                   alt="Candidate"
//                   className="h-full w-full object-cover"
//                 />
//               </div>
//             </div>

//             {/* FORM — grows to fill available width */}
//             <section className="flex-1 min-w-0">
//               <div className="mb-5 border-b border-[#ECEEF2] pb-3">
//                 <h2 className="text-[15px] font-semibold text-[#38455A]">
//                   General Details
//                 </h2>
//               </div>

//               <div className="grid grid-cols-2 gap-x-10 gap-y-[18px]">
//                 <div className="flex items-end gap-3">
//                   <Field label="Title" className="w-[70px] shrink-0">
//                     <input
//                       value={form.title}
//                       onChange={(e) => handleChange("title", e.target.value)}
//                       className={FIELD}
//                     />
//                   </Field>
//                   <Field label="First Name" className="min-w-0 flex-1">
//                     <input
//                       value={form.firstName}
//                       onChange={(e) => handleChange("firstName", e.target.value)}
//                       className={FIELD}
//                     />
//                   </Field>
//                 </div>

//                 <Field label="Father Name">
//                   <input
//                     value={form.fatherName}
//                     onChange={(e) => handleChange("fatherName", e.target.value)}
//                     className={FIELD}
//                   />
//                 </Field>

//                 <Field label="Middle Name">
//                   <input
//                     value={form.middleName}
//                     onChange={(e) => handleChange("middleName", e.target.value)}
//                     className={FIELD}
//                   />
//                 </Field>

//                 <Field label="Marital Status">
//                   <div className="relative">
//                     <select
//                       value={form.maritalStatus}
//                       onChange={(e) => handleChange("maritalStatus", e.target.value)}
//                       className={`${FIELD} cursor-pointer appearance-none pr-9`}
//                     >
//                       <option>Unmarried</option>
//                       <option>Married</option>
//                       <option>Divorced</option>
//                       <option>Widowed</option>
//                     </select>
//                     <ChevronDown
//                       size={15}
//                       className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8C97A6]"
//                     />
//                   </div>
//                 </Field>

//                 <Field label="Last Name">
//                   <input
//                     value={form.lastName}
//                     onChange={(e) => handleChange("lastName", e.target.value)}
//                     className={FIELD}
//                   />
//                 </Field>

//                 <Field label="Spouse Name">
//                   <input
//                     value={form.spouseName}
//                     onChange={(e) => handleChange("spouseName", e.target.value)}
//                     className={FIELD}
//                   />
//                 </Field>

//                 <Field label="Full Name">
//                   <input
//                     value={form.fullName}
//                     onChange={(e) => handleChange("fullName", e.target.value)}
//                     className={FIELD}
//                   />
//                 </Field>

//                 <Field label="Date Of Birth">
//                   <DateInput value={form.dob} onChange={(v) => handleChange("dob", v)} />
//                 </Field>

//                 <Field label="Gender">
//                   <div className="relative">
//                     <select
//                       value={form.gender}
//                       onChange={(e) => handleChange("gender", e.target.value)}
//                       className={`${FIELD} cursor-pointer appearance-none pr-9`}
//                     >
//                       <option>Female</option>
//                       <option>Male</option>
//                       <option>Other</option>
//                     </select>
//                     <ChevronDown
//                       size={15}
//                       className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8C97A6]"
//                     />
//                   </div>
//                 </Field>

//                 <label
//                   htmlFor="physically-challenged"
//                   className="flex cursor-pointer items-center gap-2.5 pt-[27px] text-[13px] text-[#596273]"
//                 >
//                   <input
//                     id="physically-challenged"
//                     type="checkbox"
//                     checked={form.physicallyChallenged}
//                     onChange={(e) =>
//                       handleChange("physicallyChallenged", e.target.checked)
//                     }
//                     className="h-4 w-4 cursor-pointer rounded-[3px] accent-[#2589E8]"
//                   />
//                   Physically Challenged
//                 </label>
//               </div>
//             </section>
//           </div>
//         </main>
//       </div>

//       <AddEmployeeWizard
//         open={wizardOpen}
//         onClose={() => setWizardOpen(false)}
//         onSubmit={handleWizardSubmit}
//         initialData={wizardPrefill}
//       />
//     </div>
//   );
// };

// export default PendingCandidatePage;











// import React, { useState } from "react";
// import { ChevronDown, Plus } from "lucide-react";
// import DatePicker from "../../../../../components/ui/datepicker";
// import AddEmployeeWizard, { type EmployeeFormData } from "./AddEmployeeWizard";
// import EnrollmentToolbarPortal from "../components/EnrollmentToolbarPortal";

// /* =========================================================
//    TYPES
// ========================================================= */

// type CandidateForm = {
//   title: string;
//   firstName: string;
//   middleName: string;
//   lastName: string;
//   fullName: string;
//   fatherName: string;
//   maritalStatus: string;
//   spouseName: string;
//   dob: string;
//   gender: string;
//   physicallyChallenged: boolean;
//   photoUrl: string;
// };

// /* =========================================================
//    DESIGN TOKENS
// ========================================================= */

// const FIELD = `
//   h-[40px] w-full rounded-[4px] border border-[#E8E2D6]
//   bg-[#FEFAF2] px-[12px] text-[13px] text-[#5B6572]
//   outline-none transition-all duration-150
//   placeholder:text-[#BEB4A4]
//   focus:border-[#2D8CF0] focus:ring-2 focus:ring-[#2D8CF0]/15
// `;

// const LABEL =
//   "mb-[6px] block text-[12px] leading-[15px] font-medium text-[#596273]";

// /* =========================================================
//    DATE HELPERS
// ========================================================= */

// const toISO = (ddmmyyyy: string): string => {
//   if (!ddmmyyyy || ddmmyyyy.length !== 10) return "";

//   const [dd, mm, yyyy] = ddmmyyyy.split("-");

//   return dd && mm && yyyy
//     ? `${yyyy}-${mm}-${dd}`
//     : "";
// };

// const toDisplay = (iso: string): string => {
//   if (!iso || iso.length !== 10) return "";

//   const [yyyy, mm, dd] = iso.split("-");

//   return yyyy && mm && dd
//     ? `${dd}-${mm}-${yyyy}`
//     : "";
// };

// const MONTHS = [
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];

// const WEEKDAYS = [
//   "Su",
//   "Mo",
//   "Tu",
//   "We",
//   "Th",
//   "Fr",
//   "Sa",
// ];

// const isoToDate = (
//   iso: string
// ): Date | null => {
//   if (!iso) return null;

//   const [yyyy, mm, dd] = iso
//     .split("-")
//     .map(Number);

//   if (!yyyy || !mm || !dd) {
//     return null;
//   }

//   return new Date(
//     yyyy,
//     mm - 1,
//     dd
//   );
// };

// const formatISO = (date: Date): string => {
//   const yyyy =
//     date.getFullYear();

//   const mm = String(
//     date.getMonth() + 1
//   ).padStart(2, "0");

//   const dd = String(
//     date.getDate()
//   ).padStart(2, "0");

//   return `${yyyy}-${mm}-${dd}`;
// };

// /* =========================================================
//    COMMON DATE PICKER
// ========================================================= */

// interface DateInputProps {
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
// }

// const DateInput: React.FC<DateInputProps> = ({
//   value,
//   onChange,
//   placeholder = "DD-MM-YYYY",
// }) => {
//   const selectedISO = toISO(value);

//   const [open, setOpen] =
//     useState(false);

//   const [currentMonth, setCurrentMonth] =
//     useState<Date>(() => {
//       return (
//         isoToDate(selectedISO) ??
//         new Date()
//       );
//     });

//   const cells = React.useMemo(() => {
//     const year =
//       currentMonth.getFullYear();

//     const month =
//       currentMonth.getMonth();

//     const firstDay =
//       new Date(
//         year,
//         month,
//         1
//       ).getDay();

//     const daysInMonth =
//       new Date(
//         year,
//         month + 1,
//         0
//       ).getDate();

//     const previousMonthDays =
//       new Date(
//         year,
//         month,
//         0
//       ).getDate();

//     const result: Array<{
//       iso: string;
//       day: number;
//       inMonth: boolean;
//       disabled: boolean;
//       selected: boolean;
//     }> = [];

//     for (
//       let i = firstDay - 1;
//       i >= 0;
//       i--
//     ) {
//       const day =
//         previousMonthDays - i;

//       const date = new Date(
//         year,
//         month - 1,
//         day
//       );

//       const iso =
//         formatISO(date);

//       result.push({
//         iso,
//         day,
//         inMonth: false,
//         disabled: false,
//         selected:
//           iso === selectedISO,
//       });
//     }

//     for (
//       let day = 1;
//       day <= daysInMonth;
//       day++
//     ) {
//       const date = new Date(
//         year,
//         month,
//         day
//       );

//       const iso =
//         formatISO(date);

//       result.push({
//         iso,
//         day,
//         inMonth: true,
//         disabled: false,
//         selected:
//           iso === selectedISO,
//       });
//     }

//     let nextDay = 1;

//     while (
//       result.length < 42
//     ) {
//       const date = new Date(
//         year,
//         month + 1,
//         nextDay
//       );

//       const iso =
//         formatISO(date);

//       result.push({
//         iso,
//         day: nextDay,
//         inMonth: false,
//         disabled: false,
//         selected:
//           iso === selectedISO,
//       });

//       nextDay++;
//     }

//     return result;
//   }, [
//     currentMonth,
//     selectedISO,
//   ]);

//   const monthLabel = `${
//     MONTHS[
//       currentMonth.getMonth()
//     ]
//   } ${currentMonth.getFullYear()}`;

//   const handleOpenChange = (
//     nextOpen: boolean
//   ) => {
//     if (nextOpen) {
//       const selectedDate =
//         isoToDate(selectedISO);

//       if (selectedDate) {
//         setCurrentMonth(
//           selectedDate
//         );
//       }
//     }

//     setOpen(nextOpen);
//   };

//   const handleSelectDay = (
//     iso: string
//   ) => {
//     onChange(
//       toDisplay(iso)
//     );

//     setOpen(false);
//   };

//   const handlePrevMonth = () => {
//     setCurrentMonth(
//       (previous) =>
//         new Date(
//           previous.getFullYear(),
//           previous.getMonth() - 1,
//           1
//         )
//     );
//   };

//   const handleNextMonth = () => {
//     setCurrentMonth(
//       (previous) =>
//         new Date(
//           previous.getFullYear(),
//           previous.getMonth() + 1,
//           1
//         )
//     );
//   };

//   const handleClear = () => {
//     onChange("");

//     setOpen(false);
//   };

//   const handleToday = () => {
//     const today =
//       new Date();

//     onChange(
//       toDisplay(
//         formatISO(today)
//       )
//     );

//     setCurrentMonth(
//       today
//     );

//     setOpen(false);
//   };

//   return (
//     <DatePicker
//       text={value}
//       onTextChange={onChange}
//       onBlur={() => {}}
//       placeholder={placeholder}
//       open={open}
//       onOpenChange={
//         handleOpenChange
//       }
//       monthLabel={
//         monthLabel
//       }
//       weekdayLabels={
//         WEEKDAYS
//       }
//       cells={cells}
//       onSelectDay={
//         handleSelectDay
//       }
//       onPrevMonth={
//         handlePrevMonth
//       }
//       onNextMonth={
//         handleNextMonth
//       }
//       onClear={
//         handleClear
//       }
//       onToday={
//         handleToday
//       }
//     />
//   );
// };

// /* =========================================================
//    PAGE
// ========================================================= */

// const PendingCandidatePage: React.FC =
//   () => {
//     const [
//       wizardOpen,
//       setWizardOpen,
//     ] = useState(false);

//     const [
//       selectedCandidate,
//       setSelectedCandidate,
//     ] = useState(
//       "Vakati Nandhini"
//     );

//     const [form, setForm] =
//       useState<CandidateForm>({
//         title: "Ms",
//         firstName: "Vakati",
//         middleName: "Kumar",
//         lastName: "Nandhini",
//         fullName:
//           "Vakati Nandhini",
//         fatherName:
//           "Vakati Vijaya Bhaskar Reddy",
//         maritalStatus:
//           "Unmarried",
//         spouseName:
//           "Khushaboo Sharma",
//         dob: "16-08-2002",
//         gender: "Female",
//         physicallyChallenged:
//           true,
//         photoUrl:
//           "https://randomuser.me/api/portraits/women/68.jpg",
//       });

//     const candidates = [
//       "Vakati Nandhini",
//     ];

//     const handleChange = (
//       field: keyof CandidateForm,
//       value:
//         | string
//         | boolean
//     ) => {
//       setForm(
//         (prev) => ({
//           ...prev,
//           [field]: value,
//         })
//       );
//     };

//     const wizardPrefill:
//       Partial<EmployeeFormData> =
//       {
//         employeeId:
//           "344913",
//         title:
//           form.title,
//         firstName:
//           form.firstName,
//         middleName:
//           form.middleName,
//         lastName:
//           form.lastName,
//         fullName:
//           form.fullName,
//         gender:
//           form.gender,
//         fatherName:
//           form.fatherName,
//         maritalStatus:
//           form.maritalStatus,
//         spouseName:
//           form.spouseName,
//         photoUrl:
//           form.photoUrl,
//         confirmationDate:
//           "",
//         notes: "",
//         dateOfJoining:
//           "",
//         dateOfSalary:
//           "",
//         prefix: "",
//         probationPeriod:
//           30,
//         panNumber: "",
//         aadhaarNumber:
//           "",
//         uanNumber: "",
//         pfApplicable:
//           true,
//         pfNumber: "",
//         esiApplicable:
//           false,
//         esiNumber: "",
//         bankAccountNumber:
//           "",
//         bankIfsc: "",
//         bankName: "",
//         documents: [],
//       };

//     const handleWizardSubmit = (
//       data: EmployeeFormData
//     ) => {
//       console.log(
//         "Employee created:",
//         data
//       );

//       setWizardOpen(false);
//     };

//     return (
//       <div className="relative h-[calc(100vh-80px)] w-full bg-[#F5F7FA] flex flex-col overflow-hidden">

//         <EnrollmentToolbarPortal>
//           <button
//             type="button"
//             onClick={() =>
//               setWizardOpen(
//                 true
//               )
//             }
//             className="flex h-[32px] items-center gap-1.5 rounded-[5px] bg-[#2589E8] px-3.5 text-[12.5px] font-semibold text-white shadow-[0_1px_3px_rgba(37,137,232,0.3)] hover:bg-[#147BD8]"
//           >
//             <Plus
//               size={14}
//               strokeWidth={
//                 2.5
//               }
//             />

//             <span>
//               Add Employee
//             </span>
//           </button>
//         </EnrollmentToolbarPortal>

//         <div className="flex-1 min-h-0 flex overflow-hidden rounded-[6px] border border-[#E7E9ED] bg-white m-2 shadow-[0_1px_3px_rgba(16,24,40,0.06)]">

//           <aside className="w-[190px] shrink-0 border-r border-[#EEF0F3] bg-white overflow-y-auto">
//             <div className="py-1.5">
//               {candidates.map(
//                 (
//                   candidate
//                 ) => {
//                   const active =
//                     candidate ===
//                     selectedCandidate;

//                   return (
//                     <button
//                       key={
//                         candidate
//                       }
//                       type="button"
//                       onClick={() =>
//                         setSelectedCandidate(
//                           candidate
//                         )
//                       }
//                       className={`
//                         relative flex h-[42px] w-full items-center px-4 text-left text-[13px] transition-colors
//                         ${
//                           active
//                             ? "bg-[#F5F8FC] font-semibold text-[#2589E8]"
//                             : "text-[#687384] hover:bg-[#F8FAFC]"
//                         }
//                       `}
//                     >
//                       {
//                         candidate
//                       }

//                       {active && (
//                         <span className="absolute right-0 top-0 h-full w-[3px] bg-[#2589E8]" />
//                       )}
//                     </button>
//                   );
//                 }
//               )}
//             </div>
//           </aside>

//           <main className="flex-1 min-w-0 overflow-y-auto bg-white">

//             <div className="flex h-full gap-10 px-10 py-7">

//               <div className="flex-shrink-0 pt-[26px]">
//                 <div className="flex h-[190px] w-[160px] items-center justify-center rounded-[3px] border border-dashed border-[#D6D9DE] bg-white p-2">

//                   <img
//                     src={
//                       form.photoUrl
//                     }
//                     alt="Candidate"
//                     className="h-full w-full object-cover"
//                   />

//                 </div>
//               </div>

//               <section className="flex-1 min-w-0">

//                 <div className="mb-5 border-b border-[#ECEEF2] pb-3">

//                   <h2 className="text-[15px] font-semibold text-[#38455A]">
//                     General Details
//                   </h2>

//                 </div>

//                 <div className="grid grid-cols-2 gap-x-10 gap-y-[18px]">

//                   <div className="flex items-end gap-3">

//                     <Field
//                       label="Title"
//                       className="w-[70px] shrink-0"
//                     >
//                       <input
//                         value={
//                           form.title
//                         }
//                         onChange={(e) =>
//                           handleChange(
//                             "title",
//                             e.target
//                               .value
//                           )
//                         }
//                         className={
//                           FIELD
//                         }
//                       />
//                     </Field>

//                     <Field
//                       label="First Name"
//                       className="min-w-0 flex-1"
//                     >
//                       <input
//                         value={
//                           form.firstName
//                         }
//                         onChange={(e) =>
//                           handleChange(
//                             "firstName",
//                             e.target
//                               .value
//                           )
//                         }
//                         className={
//                           FIELD
//                         }
//                       />
//                     </Field>

//                   </div>

//                   <Field label="Father Name">
//                     <input
//                       value={
//                         form.fatherName
//                       }
//                       onChange={(e) =>
//                         handleChange(
//                           "fatherName",
//                           e.target
//                             .value
//                         )
//                       }
//                       className={
//                         FIELD
//                       }
//                     />
//                   </Field>

//                   <Field label="Middle Name">
//                     <input
//                       value={
//                         form.middleName
//                       }
//                       onChange={(e) =>
//                         handleChange(
//                           "middleName",
//                           e.target
//                             .value
//                         )
//                       }
//                       className={
//                         FIELD
//                       }
//                     />
//                   </Field>

//                   <Field label="Marital Status">
//                     <div className="relative">

//                       <select
//                         value={
//                           form.maritalStatus
//                         }
//                         onChange={(e) =>
//                           handleChange(
//                             "maritalStatus",
//                             e.target
//                               .value
//                           )
//                         }
//                         className={`${FIELD} cursor-pointer appearance-none pr-9`}
//                       >
//                         <option>
//                           Unmarried
//                         </option>

//                         <option>
//                           Married
//                         </option>

//                         <option>
//                           Divorced
//                         </option>

//                         <option>
//                           Widowed
//                         </option>
//                       </select>

//                       <ChevronDown
//                         size={15}
//                         className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8C97A6]"
//                       />

//                     </div>
//                   </Field>

//                   <Field label="Last Name">
//                     <input
//                       value={
//                         form.lastName
//                       }
//                       onChange={(e) =>
//                         handleChange(
//                           "lastName",
//                           e.target
//                             .value
//                         )
//                       }
//                       className={
//                         FIELD
//                       }
//                     />
//                   </Field>

//                   <Field label="Spouse Name">
//                     <input
//                       value={
//                         form.spouseName
//                       }
//                       onChange={(e) =>
//                         handleChange(
//                           "spouseName",
//                           e.target
//                             .value
//                         )
//                       }
//                       className={
//                         FIELD
//                       }
//                     />
//                   </Field>

//                   <Field label="Full Name">
//                     <input
//                       value={
//                         form.fullName
//                       }
//                       onChange={(e) =>
//                         handleChange(
//                           "fullName",
//                           e.target
//                             .value
//                         )
//                       }
//                       className={
//                         FIELD
//                       }
//                     />
//                   </Field>

//                   <Field label="Date Of Birth">
//                     <DateInput
//                       value={
//                         form.dob
//                       }
//                       onChange={(
//                         value
//                       ) =>
//                         handleChange(
//                           "dob",
//                           value
//                         )
//                       }
//                     />
//                   </Field>

//                   <Field label="Gender">
//                     <div className="relative">

//                       <select
//                         value={
//                           form.gender
//                         }
//                         onChange={(e) =>
//                           handleChange(
//                             "gender",
//                             e.target
//                               .value
//                           )
//                         }
//                         className={`${FIELD} cursor-pointer appearance-none pr-9`}
//                       >
//                         <option>
//                           Female
//                         </option>

//                         <option>
//                           Male
//                         </option>

//                         <option>
//                           Other
//                         </option>
//                       </select>

//                       <ChevronDown
//                         size={15}
//                         className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8C97A6]"
//                       />

//                     </div>
//                   </Field>

//                   <label
//                     htmlFor="physically-challenged"
//                     className="flex cursor-pointer items-center gap-2.5 pt-[27px] text-[13px] text-[#596273]"
//                   >
//                     <input
//                       id="physically-challenged"
//                       type="checkbox"
//                       checked={
//                         form.physicallyChallenged
//                       }
//                       onChange={(e) =>
//                         handleChange(
//                           "physicallyChallenged",
//                           e.target
//                             .checked
//                         )
//                       }
//                       className="h-4 w-4 cursor-pointer rounded-[3px] accent-[#2589E8]"
//                     />

//                     Physically
//                     Challenged
//                   </label>

//                 </div>

//               </section>

//             </div>

//           </main>

//         </div>

//         <AddEmployeeWizard
//           open={
//             wizardOpen
//           }
//           onClose={() =>
//             setWizardOpen(
//               false
//             )
//           }
//           onSubmit={
//             handleWizardSubmit
//           }
//           initialData={
//             wizardPrefill
//           }
//         />

//       </div>
//     );
//   };

// /* =========================================================
//    FIELD
// ========================================================= */

// interface FieldProps {
//   label: string;
//   children: React.ReactNode;
//   className?: string;
// }

// const Field: React.FC<
//   FieldProps
// > = ({
//   label,
//   children,
//   className = "",
// }) => {
//   return (
//     <div
//       className={
//         className
//       }
//     >
//       <label
//         className={
//           LABEL
//         }
//       >
//         {label}
//       </label>

//       {children}
//     </div>
//   );
// };

// export default PendingCandidatePage;















// import React, { useMemo, useState } from "react";
// import { User, Trash2 } from "lucide-react";
// import EnrollmentTabs from "../components/EnrollmentTabs";

// export interface PendingCandidate {
//   id: string | number;
//   title?: string;
//   firstName: string;
//   middleName?: string;
//   lastName: string;
//   fullName?: string;
//   gender?: string;
//   fatherName?: string;
//   maritalStatus?: string;
//   spouseName?: string;
//   dateOfBirth?: string;
//   photoUrl?: string;
//   physicallyChallenged?: boolean;
// }

// interface Props {
//   /** From backend — [] shows empty list */
//   candidates?: PendingCandidate[];
//   isLoading?: boolean;
//   onRemove?: (id: string | number) => void;
//   onChange?: (id: string | number, patch: Partial<PendingCandidate>) => void;
//   onSave?: (candidate: PendingCandidate) => void;
// }

// const inputCls =
//   "h-[38px] w-full rounded-[6px] border border-[#E4E7EC] bg-white px-3 text-[13px] text-[#344054] outline-none transition focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/15";
// const labelCls = "mb-1 block text-[12px] font-medium text-[#475467]";

// const PendingCandidatePage: React.FC<Props> = ({
//   candidates = [],
//   isLoading = false,
//   onRemove,
//   onChange,
//   onSave,
// }) => {
//   const [selectedId, setSelectedId] = useState<string | number | null>(
//     candidates[0]?.id ?? null
//   );

//   // keep selection valid when list changes
//   const selected = useMemo(() => {
//     if (!candidates.length) return null;
//     const found = candidates.find((c) => c.id === selectedId);
//     return found ?? candidates[0];
//   }, [candidates, selectedId]);

//   const displayName = (c: PendingCandidate) =>
//     c.fullName ||
//     [c.firstName, c.middleName, c.lastName].filter(Boolean).join(" ") ||
//     "—";

//   const update = (patch: Partial<PendingCandidate>) => {
//     if (!selected) return;
//     onChange?.(selected.id, patch);
//   };

//   return (
//     <div className="min-h-[calc(100vh-100px)] bg-[#F5F7FA]">
//       {/* Top tabs — Figma */}
//       <div className="px-3 pt-2">
//         <EnrollmentTabs />
//       </div>

//       <div className="flex gap-3 px-3 pb-3 pt-1">
//         {/* LEFT — Candidates list */}
//         <aside className="w-[200px] shrink-0 rounded-[12px] border border-[#E8ECF0] bg-white shadow-sm">
//           <div className="border-b border-[#F0F2F5] px-3 py-2.5">
//             <p className="text-[11px] font-semibold uppercase tracking-wide text-[#98A2B3]">
//               Candidates List
//             </p>
//           </div>

//           {isLoading ? (
//             <div className="px-3 py-8 text-center text-[12px] text-[#98A2B3]">
//               Loading…
//             </div>
//           ) : candidates.length === 0 ? (
//             <div className="px-3 py-10 text-center text-[12px] text-[#98A2B3]">
//               No pending candidates
//             </div>
//           ) : (
//             <ul className="py-1">
//               {candidates.map((c) => {
//                 const active = selected?.id === c.id;
//                 return (
//                   <li key={c.id}>
//                     <button
//                       type="button"
//                       onClick={() => setSelectedId(c.id)}
//                       className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] transition-colors ${
//                         active
//                           ? "border-l-[3px] border-[#F97316] bg-[#FFF7ED] font-medium text-[#C2410C]"
//                           : "border-l-[3px] border-transparent text-[#475467] hover:bg-[#F9FAFB]"
//                       }`}
//                     >
//                       <User
//                         size={14}
//                         className={active ? "text-[#F97316]" : "text-[#98A2B3]"}
//                       />
//                       <span className="truncate">{displayName(c)}</span>
//                     </button>
//                   </li>
//                 );
//               })}
//             </ul>
//           )}
//         </aside>

//         {/* RIGHT — Detail card */}
//         <div className="min-w-0 flex-1 rounded-[12px] border border-[#E8ECF0] bg-white p-5 shadow-sm">
//           {!selected ? (
//             <div className="flex h-[400px] items-center justify-center text-[13px] text-[#98A2B3]">
//               Select a candidate from the list
//             </div>
//           ) : (
//             <div className="flex flex-col gap-6 lg:flex-row">
//               {/* Photo + Remove */}
//               <div className="flex w-full shrink-0 flex-col items-center lg:w-[180px]">
//                 <div className="flex h-[160px] w-[140px] items-center justify-center overflow-hidden rounded-[10px] border border-[#E8ECF0] bg-[#F9FAFB]">
//                   {selected.photoUrl ? (
//                     <img
//                       src={selected.photoUrl}
//                       alt={displayName(selected)}
//                       className="h-full w-full object-cover"
//                     />
//                   ) : (
//                     <User size={48} className="text-[#D0D5DD]" />
//                   )}
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => onRemove?.(selected.id)}
//                   className="mt-3 flex h-[32px] items-center gap-1.5 rounded-[6px] border border-[#FECDCA] bg-[#FEF3F2] px-3 text-[12px] font-medium text-[#D92D20] hover:bg-[#FEE4E2]"
//                 >
//                   <Trash2 size={13} />
//                   Remove
//                 </button>
//               </div>

//               {/* General Details form */}
//               <div className="min-w-0 flex-1">
//                 <h3 className="mb-4 text-[15px] font-semibold text-[#1D2939]">
//                   General Details
//                 </h3>

//                 <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
//                   {/* Title */}
//                   <div>
//                     <label className={labelCls}>Title</label>
//                     <select
//                       value={selected.title ?? ""}
//                       onChange={(e) => update({ title: e.target.value })}
//                       className={inputCls}
//                     >
//                       <option value="">Select</option>
//                       <option value="Mr">Mr</option>
//                       <option value="Ms">Ms</option>
//                       <option value="Mrs">Mrs</option>
//                       <option value="Dr">Dr</option>
//                     </select>
//                   </div>

//                   {/* Father Name */}
//                   <div>
//                     <label className={labelCls}>Father Name</label>
//                     <input
//                       value={selected.fatherName ?? ""}
//                       onChange={(e) => update({ fatherName: e.target.value })}
//                       className={inputCls}
//                       placeholder="Father name"
//                     />
//                   </div>

//                   {/* First Name */}
//                   <div>
//                     <label className={labelCls}>First Name</label>
//                     <input
//                       value={selected.firstName ?? ""}
//                       onChange={(e) => update({ firstName: e.target.value })}
//                       className={inputCls}
//                       placeholder="First name"
//                     />
//                   </div>

//                   {/* Marital Status */}
//                   <div>
//                     <label className={labelCls}>Marital Status</label>
//                     <select
//                       value={selected.maritalStatus ?? ""}
//                       onChange={(e) =>
//                         update({ maritalStatus: e.target.value })
//                       }
//                       className={inputCls}
//                     >
//                       <option value="">Select</option>
//                       <option value="Unmarried">Unmarried</option>
//                       <option value="Married">Married</option>
//                       <option value="Divorced">Divorced</option>
//                       <option value="Widowed">Widowed</option>
//                     </select>
//                   </div>

//                   {/* Middle Name */}
//                   <div>
//                     <label className={labelCls}>Middle Name</label>
//                     <input
//                       value={selected.middleName ?? ""}
//                       onChange={(e) => update({ middleName: e.target.value })}
//                       className={inputCls}
//                       placeholder="Middle name"
//                     />
//                   </div>

//                   {/* Spouse Name */}
//                   <div>
//                     <label className={labelCls}>Spouse Name</label>
//                     <input
//                       value={selected.spouseName ?? ""}
//                       onChange={(e) => update({ spouseName: e.target.value })}
//                       className={inputCls}
//                       placeholder="Spouse name"
//                     />
//                   </div>

//                   {/* Last Name */}
//                   <div>
//                     <label className={labelCls}>Last Name</label>
//                     <input
//                       value={selected.lastName ?? ""}
//                       onChange={(e) => update({ lastName: e.target.value })}
//                       className={inputCls}
//                       placeholder="Last name"
//                     />
//                   </div>

//                   {/* Date Of Birth */}
//                   <div>
//                     <label className={labelCls}>Date Of Birth</label>
//                     <input
//                       type="text"
//                       value={selected.dateOfBirth ?? ""}
//                       onChange={(e) => update({ dateOfBirth: e.target.value })}
//                       className={inputCls}
//                       placeholder="DD-MM-YYYY"
//                     />
//                   </div>

//                   {/* Full Name */}
//                   <div>
//                     <label className={labelCls}>Full Name</label>
//                     <input
//                       value={
//                         selected.fullName ??
//                         [selected.firstName, selected.middleName, selected.lastName]
//                           .filter(Boolean)
//                           .join(" ")
//                       }
//                       onChange={(e) => update({ fullName: e.target.value })}
//                       className={inputCls}
//                       placeholder="Full name"
//                     />
//                   </div>

//                   {/* Physically Challenged */}
//                   <div className="flex items-end pb-2">
//                     <label className="flex cursor-pointer items-center gap-2 text-[13px] text-[#344054]">
//                       <input
//                         type="checkbox"
//                         checked={!!selected.physicallyChallenged}
//                         onChange={(e) =>
//                           update({ physicallyChallenged: e.target.checked })
//                         }
//                         className="h-[15px] w-[15px] accent-[#F97316]"
//                       />
//                       Physically Challenged
//                     </label>
//                   </div>

//                   {/* Gender */}
//                   <div>
//                     <label className={labelCls}>Gender</label>
//                     <select
//                       value={selected.gender ?? ""}
//                       onChange={(e) => update({ gender: e.target.value })}
//                       className={inputCls}
//                     >
//                       <option value="">Select</option>
//                       <option value="Male">Male</option>
//                       <option value="Female">Female</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>
//                 </div>

//                 {onSave && (
//                   <div className="mt-6 flex justify-end">
//                     <button
//                       type="button"
//                       onClick={() => onSave(selected)}
//                       className="h-[36px] rounded-[8px] bg-[#F97316] px-5 text-[13px] font-semibold text-white hover:bg-[#EA580C]"
//                     >
//                       Save
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PendingCandidatePage;




















// import React, { useMemo, useState } from "react";
// import { User, Trash2, Calendar } from "lucide-react";
// import EnrollmentTabs from "../components/EnrollmentTabs";

// export interface PendingCandidate {
//   id: string | number;
//   title?: string;
//   firstName: string;
//   middleName?: string;
//   lastName: string;
//   fullName?: string;
//   gender?: string;
//   fatherName?: string;
//   maritalStatus?: string;
//   spouseName?: string;
//   dateOfBirth?: string;
//   photoUrl?: string;
//   physicallyChallenged?: boolean;
// }

// interface Props {
//   /** From backend — [] shows empty list */
//   candidates?: PendingCandidate[];
//   isLoading?: boolean;
//   onRemove?: (id: string | number) => void;
//   onChange?: (id: string | number, patch: Partial<PendingCandidate>) => void;
//   onSave?: (candidate: PendingCandidate) => void;
// }

// const inputCls =
//   "h-[38px] w-full rounded-[6px] border border-[#E4E7EC] bg-white px-3 text-[13px] text-[#344054] outline-none transition focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/15";
// const labelCls = "mb-1 block text-[12px] font-medium text-[#475467]";

// const PendingCandidatePage: React.FC<Props> = ({
//   candidates = [],
//   isLoading = false,
//   onRemove,
//   onChange,
//   onSave,
// }) => {
//   const [selectedId, setSelectedId] = useState<string | number | null>(
//     candidates[0]?.id ?? null
//   );

//   // keep selection valid when list changes
//   const selected = useMemo(() => {
//     if (!candidates.length) return null;
//     const found = candidates.find((c) => c.id === selectedId);
//     return found ?? candidates[0];
//   }, [candidates, selectedId]);

//   const displayName = (c: PendingCandidate) =>
//     c.fullName ||
//     [c.firstName, c.middleName, c.lastName].filter(Boolean).join(" ") ||
//     "—";

//   const update = (patch: Partial<PendingCandidate>) => {
//     if (!selected) return;
//     onChange?.(selected.id, patch);
//   };

//   return (
//     <div className="min-h-[calc(100vh-100px)] bg-[#F5F7FA]">
//       {/* Top tabs — Figma */}
//       <div className="px-3 pt-2">
//         <EnrollmentTabs />
//       </div>

//       <div className="flex gap-3 px-3 pb-3 pt-1">
//         {/* LEFT — Candidates list */}
//         <aside className="w-[200px] shrink-0 rounded-[12px] border border-[#E8ECF0] bg-white shadow-sm">
//           <div className="border-b border-[#F0F2F5] px-3 py-2.5">
//             <p className="text-[11px] font-semibold uppercase tracking-wide text-[#98A2B3]">
//               Candidates List
//             </p>
//           </div>

//           {isLoading ? (
//             <div className="px-3 py-8 text-center text-[12px] text-[#98A2B3]">
//               Loading…
//             </div>
//           ) : candidates.length === 0 ? (
//             <div className="px-3 py-10 text-center text-[12px] text-[#98A2B3]">
//               No pending candidates
//             </div>
//           ) : (
//             <ul className="py-1">
//               {candidates.map((c) => {
//                 const active = selected?.id === c.id;
//                 return (
//                   <li key={c.id}>
//                     <button
//                       type="button"
//                       onClick={() => setSelectedId(c.id)}
//                       className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] transition-colors ${
//                         active
//                           ? "border-l-[3px] border-[#F97316] bg-[#FFF7ED] font-medium text-[#C2410C]"
//                           : "border-l-[3px] border-transparent text-[#475467] hover:bg-[#F9FAFB]"
//                       }`}
//                     >
//                       <User
//                         size={14}
//                         className={active ? "text-[#F97316]" : "text-[#98A2B3]"}
//                       />
//                       <span className="truncate">{displayName(c)}</span>
//                     </button>
//                   </li>
//                 );
//               })}
//             </ul>
//           )}
//         </aside>

//         {/* RIGHT — Detail card */}
//         <div className="min-w-0 flex-1 rounded-[12px] border border-[#E8ECF0] bg-white p-5 shadow-sm">
//           {!selected ? (
//             <div className="flex h-[400px] items-center justify-center text-[13px] text-[#98A2B3]">
//               Select a candidate from the list
//             </div>
//           ) : (
//             <div className="flex flex-col gap-6 lg:flex-row">
//               {/* Photo + Remove */}
//               <div className="flex w-full shrink-0 flex-col items-center lg:w-[180px]">
//                 <div className="flex h-[160px] w-[140px] items-center justify-center overflow-hidden rounded-[10px] border border-[#E8ECF0] bg-[#F9FAFB]">
//                   {selected.photoUrl ? (
//                     <img
//                       src={selected.photoUrl}
//                       alt={displayName(selected)}
//                       className="h-full w-full object-cover"
//                     />
//                   ) : (
//                     <User size={48} className="text-[#D0D5DD]" />
//                   )}
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => onRemove?.(selected.id)}
//                   className="mt-3 flex h-[32px] items-center gap-1.5 rounded-[6px] border border-[#FECDCA] bg-[#FEF3F2] px-3 text-[12px] font-medium text-[#D92D20] hover:bg-[#FEE4E2]"
//                 >
//                   <Trash2 size={13} />
//                   I REMOVE
//                 </button>
//               </div>

//               {/* General Details form */}
//               <div className="min-w-0 flex-1">
//                 <h3 className="mb-4 text-[15px] font-semibold text-[#1D2939]">
//                   General Details
//                 </h3>

//                 <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
//                   {/* Title */}
//                   <div>
//                     <label className={labelCls}>Title</label>
//                     <select
//                       value={selected.title ?? ""}
//                       onChange={(e) => update({ title: e.target.value })}
//                       className={inputCls}
//                     >
//                       <option value="">Select</option>
//                       <option value="Mr">Mr</option>
//                       <option value="Ms">Ms</option>
//                       <option value="Mrs">Mrs</option>
//                       <option value="Dr">Dr</option>
//                     </select>
//                   </div>

//                   {/* Father Name */}
//                   <div>
//                     <label className={labelCls}>Father Name</label>
//                     <input
//                       value={selected.fatherName ?? ""}
//                       onChange={(e) => update({ fatherName: e.target.value })}
//                       className={inputCls}
//                       placeholder="Father name"
//                     />
//                   </div>

//                   {/* First Name */}
//                   <div>
//                     <label className={labelCls}>First Name</label>
//                     <input
//                       value={selected.firstName ?? ""}
//                       onChange={(e) => update({ firstName: e.target.value })}
//                       className={inputCls}
//                       placeholder="First name"
//                     />
//                   </div>

//                   {/* Marital Status */}
//                   <div>
//                     <label className={labelCls}>Marital Status</label>
//                     <select
//                       value={selected.maritalStatus ?? ""}
//                       onChange={(e) =>
//                         update({ maritalStatus: e.target.value })
//                       }
//                       className={inputCls}
//                     >
//                       <option value="">Select</option>
//                       <option value="Unmarried">Unmarried</option>
//                       <option value="Married">Married</option>
//                       <option value="Divorced">Divorced</option>
//                       <option value="Widowed">Widowed</option>
//                     </select>
//                   </div>

//                   {/* Middle Name */}
//                   <div>
//                     <label className={labelCls}>Middle Name</label>
//                     <input
//                       value={selected.middleName ?? ""}
//                       onChange={(e) => update({ middleName: e.target.value })}
//                       className={inputCls}
//                       placeholder="Middle name"
//                     />
//                   </div>

//                   {/* Spouse Name */}
//                   <div>
//                     <label className={labelCls}>Spouse Name</label>
//                     <input
//                       value={selected.spouseName ?? ""}
//                       onChange={(e) => update({ spouseName: e.target.value })}
//                       className={inputCls}
//                       placeholder="Spouse name"
//                     />
//                   </div>

//                   {/* Last Name */}
//                   <div>
//                     <label className={labelCls}>Last Name</label>
//                     <input
//                       value={selected.lastName ?? ""}
//                       onChange={(e) => update({ lastName: e.target.value })}
//                       className={inputCls}
//                       placeholder="Last name"
//                     />
//                   </div>

//                   {/* Date Of Birth */}
//                   <div>
//                     <label className={labelCls}>Date Of Birth</label>
//                     <div className="relative">
//                       <input
//                         type="text"
//                         value={selected.dateOfBirth ?? ""}
//                         onChange={(e) =>
//                           update({ dateOfBirth: e.target.value })
//                         }
//                         className={`${inputCls} pr-9`}
//                         placeholder="DD-MM-YYYY"
//                       />
//                       <Calendar
//                         size={15}
//                         className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
//                       />
//                     </div>
//                   </div>

//                   {/* Full Name */}
//                   <div>
//                     <label className={labelCls}>Full Name</label>
//                     <input
//                       value={
//                         selected.fullName ??
//                         [selected.firstName, selected.middleName, selected.lastName]
//                           .filter(Boolean)
//                           .join(" ")
//                       }
//                       onChange={(e) => update({ fullName: e.target.value })}
//                       className={inputCls}
//                       placeholder="Full name"
//                     />
//                   </div>

//                   {/* Physically Challenged */}
//                   <div className="flex items-end pb-2">
//                     <label className="flex cursor-pointer items-center gap-2 text-[13px] text-[#344054]">
//                       <input
//                         type="checkbox"
//                         checked={!!selected.physicallyChallenged}
//                         onChange={(e) =>
//                           update({ physicallyChallenged: e.target.checked })
//                         }
//                         className="h-[15px] w-[15px] accent-[#F97316]"
//                       />
//                       Physically Challenged
//                     </label>
//                   </div>

//                   {/* Gender */}
//                   <div>
//                     <label className={labelCls}>Gender</label>
//                     <select
//                       value={selected.gender ?? ""}
//                       onChange={(e) => update({ gender: e.target.value })}
//                       className={inputCls}
//                     >
//                       <option value="">Select</option>
//                       <option value="Male">Male</option>
//                       <option value="Female">Female</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>
//                 </div>

//                 {onSave && (
//                   <div className="mt-6 flex justify-end">
//                     <button
//                       type="button"
//                       onClick={() => onSave(selected)}
//                       className="h-[36px] rounded-[8px] bg-[#F97316] px-5 text-[13px] font-semibold text-white hover:bg-[#EA580C]"
//                     >
//                       Save
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PendingCandidatePage;














import React, { useEffect, useMemo, useState } from "react";
import { User, Trash2, Calendar } from "lucide-react";
import EnrollmentTabs from "../components/EnrollmentTabs";
import {
  useGetPendingCandidatesQuery,
  useRemovePendingCandidateMutation,
  useUpdatePendingCandidateMutation,
  type PendingCandidateDTO,
} from "../api/employeedetailsApi";

/* =========================================================
   UI-SIDE SHAPE — what the form/list actually bind to
========================================================= */

export interface PendingCandidate {
  id: string | number;
  title?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName?: string;
  gender?: string;
  fatherName?: string;
  maritalStatus?: string;
  spouseName?: string;
  dateOfBirth?: string; // DD-MM-YYYY for display
  photoUrl?: string;
  physicallyChallenged?: boolean;
}

const inputCls =
  "h-[38px] w-full rounded-[6px] border border-[#E2E2E2] bg-white px-3 text-[13px] text-[#131313] outline-none transition focus:border-[#FF6200] focus:ring-2 focus:ring-[#FF6200]/15";
const labelCls = "mb-1 block text-[12px] font-medium text-[#626262]";

/* =========================================================
   DATE HELPERS — backend sends ISO (yyyy-mm-dd), UI shows DD-MM-YYYY
========================================================= */

const toDisplayDate = (iso: string | null | undefined): string => {
  if (!iso) return "";
  const datePart = iso.split("T")[0];
  const [yyyy, mm, dd] = datePart.split("-");
  return yyyy && mm && dd ? `${dd}-${mm}-${yyyy}` : "";
};

const toIsoDate = (display: string | undefined): string => {
  if (!display || display.length !== 10) return "";
  const [dd, mm, yyyy] = display.split("-");
  return dd && mm && yyyy ? `${yyyy}-${mm}-${dd}` : "";
};

/* =========================================================
   DTO  <->  UI mapping
========================================================= */

const mapDtoToCandidate = (dto: PendingCandidateDTO): PendingCandidate => ({
  id: dto.CandidateID,
  title: dto.Title ?? "",
  firstName: dto.FirstName ?? "",
  middleName: dto.MiddleName ?? "",
  lastName: dto.LastName ?? "",
  fullName: dto.FullName ?? "",
  gender: dto.Gender ?? "",
  fatherName: dto.FatherName ?? "",
  maritalStatus: dto.MaritalStatus ?? "",
  spouseName: dto.SpouseName ?? "",
  dateOfBirth: toDisplayDate(dto.DateofBirth),
  photoUrl: dto.ProfilePhoto ?? "",
  physicallyChallenged: dto.PhysicallyChallenged === 1,
});

const mapCandidateToDto = (c: PendingCandidate): Partial<PendingCandidateDTO> => ({
  Title: c.title || null,
  FirstName: c.firstName,
  MiddleName: c.middleName || null,
  LastName: c.lastName,
  FullName:
    c.fullName ||
    [c.firstName, c.middleName, c.lastName].filter(Boolean).join(" ") ||
    null,
  Gender: c.gender || null,
  FatherName: c.fatherName || null,
  MaritalStatus: c.maritalStatus || null,
  SpouseName: c.spouseName || null,
  DateofBirth: toIsoDate(c.dateOfBirth) || null,
  PhysicallyChallenged: c.physicallyChallenged ? 1 : 0,
});

/* =========================================================
   PAGE
========================================================= */

const PendingCandidatePage: React.FC = () => {
  // Real backend data — no mock/hardcoded candidates anywhere below.
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetPendingCandidatesQuery();

  const [removeCandidate, { isLoading: isRemoving }] =
    useRemovePendingCandidateMutation();
  const [updateCandidate, { isLoading: isSaving }] =
    useUpdatePendingCandidateMutation();

  const candidates = useMemo<PendingCandidate[]>(
    () => (data?.data ?? []).map(mapDtoToCandidate),
    [data]
  );

  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [draft, setDraft] = useState<PendingCandidate | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // keep selection valid as the backend list changes (first load, after remove, refetch, etc.)
  useEffect(() => {
    if (candidates.length === 0) {
      setSelectedId(null);
      return;
    }
    if (selectedId === null || !candidates.some((c) => c.id === selectedId)) {
      setSelectedId(candidates[0].id);
    }
  }, [candidates, selectedId]);

  // refresh the editable draft whenever the selection or the underlying backend data changes
  useEffect(() => {
    const found = candidates.find((c) => c.id === selectedId) ?? null;
    setDraft(found);
  }, [candidates, selectedId]);

  const displayName = (c: PendingCandidate) =>
    c.fullName ||
    [c.firstName, c.middleName, c.lastName].filter(Boolean).join(" ") ||
    "—";

  const update = (patch: Partial<PendingCandidate>) => {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const handleRemove = async (id: string | number) => {
    if (!window.confirm("Remove this candidate from the pending list?")) return;
    setActionError(null);
    try {
      await removeCandidate(id).unwrap();
    } catch (err) {
      console.error("Failed to remove candidate", err);
      setActionError("Couldn't remove this candidate. Please try again.");
    }
  };

  const handleSave = async () => {
    if (!draft) return;
    setActionError(null);
    try {
      await updateCandidate({
        candidateId: draft.id,
        data: mapCandidateToDto(draft),
      }).unwrap();
    } catch (err) {
      console.error("Failed to save candidate", err);
      setActionError("Couldn't save changes. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-[#EDEDED] text-[#131313]">
      {/* Top tabs — Figma */}
      <div className="px-3 pt-2">
        <EnrollmentTabs />
      </div>

      <div className="flex gap-3 px-3 pb-3 pt-1">
        {/* LEFT — Candidates list (from backend) */}
        <aside className="w-[200px] shrink-0 rounded-[8px] border border-[#E2E2E2] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E2E2E2] px-3 py-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#626262]">
              Candidates List
            </p>
            {isFetching && !isLoading && (
              <span className="text-[10px] text-[#626262]">Refreshing…</span>
            )}
          </div>

          {isLoading ? (
            <div className="px-3 py-8 text-center text-[12px] text-[#626262]">
              Loading…
            </div>
          ) : isError ? (
            <div className="px-3 py-8 text-center text-[12px] text-[#D92D20]">
              Couldn't load candidates.
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-2 block w-full text-[12px] font-medium text-[#FF6200] underline"
              >
                Retry
              </button>
            </div>
          ) : candidates.length === 0 ? (
            <div className="px-3 py-10 text-center text-[12px] text-[#626262]">
              No pending candidates
            </div>
          ) : (
            <ul className="py-1">
              {candidates.map((c) => {
                const active = selectedId === c.id;
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(c.id)}
                      className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] transition-colors ${
                        active
                          ? "border-l-[3px] border-[#FF6200] bg-[#FFF5EE] font-medium text-[#FF6200]"
                          : "border-l-[3px] border-transparent text-[#626262] hover:bg-[#FFF5EE]"
                      }`}
                    >
                      <User
                        size={14}
                        className={active ? "text-[#FF6200]" : "text-[#626262]"}
                      />
                      <span className="truncate">{displayName(c)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        {/* RIGHT — Detail card, bound to the selected candidate's live data */}
        <div className="min-w-0 flex-1 rounded-[8px] border border-[#E2E2E2] bg-white p-5 shadow-sm">
          {isLoading ? (
            <div className="flex h-[400px] items-center justify-center text-[13px] text-[#626262]">
              Loading candidate…
            </div>
          ) : isError ? (
            <div className="flex h-[400px] flex-col items-center justify-center gap-2 text-[13px] text-[#D92D20]">
              Couldn't load candidate details.
              <button
                type="button"
                onClick={() => refetch()}
                className="text-[12px] font-medium text-[#2589E8] underline"
              >
                Retry
              </button>
            </div>
          ) : !draft ? (
            <div className="flex h-[400px] items-center justify-center text-[13px] text-[#626262]">
              {candidates.length === 0
                ? "No pending candidates"
                : "Select a candidate from the list"}
            </div>
          ) : (
            <div className="flex flex-col gap-6 lg:flex-row">
              {/* Photo + Remove */}
              <div className="flex w-full shrink-0 flex-col items-center lg:w-[180px]">
                <div className="flex h-[160px] w-[140px] items-center justify-center overflow-hidden rounded-[8px] border border-[#E2E2E2] bg-[#F5F5F5]">
                  {draft.photoUrl ? (
                    <img
                      src={draft.photoUrl}
                      alt={displayName(draft)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-[#D0D5DD]" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(draft.id)}
                  disabled={isRemoving}
                  className="mt-3 flex h-[32px] items-center gap-1.5 rounded-[6px] border border-[#FAD5D1] bg-[#FAD5D1] px-3 text-[12px] font-medium text-[#DD3232] hover:bg-[#F5BDB7] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Trash2 size={13} />
                  {isRemoving ? "REMOVING…" : "I REMOVE"}
                </button>
              </div>

              {/* General Details form */}
              <div className="min-w-0 flex-1">
                <h3 className="mb-4 text-[15px] font-semibold text-[#131313]">
                  General Details
                </h3>

                {actionError && (
                    <div className="mb-4 rounded-[6px] border border-[#FAD5D1] bg-[#FAD5D1] px-3 py-2 text-[12px] text-[#DD3232]">
                    {actionError}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                  {/* Title */}
                  <div>
                    <label className={labelCls}>Title</label>
                    <select
                      value={draft.title ?? ""}
                      onChange={(e) => update({ title: e.target.value })}
                      className={inputCls}
                    >
                      <option value="">Select</option>
                      <option value="Mr">Mr</option>
                      <option value="Ms">Ms</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Dr">Dr</option>
                    </select>
                  </div>

                  {/* Father Name */}
                  <div>
                    <label className={labelCls}>Father Name</label>
                    <input
                      value={draft.fatherName ?? ""}
                      onChange={(e) => update({ fatherName: e.target.value })}
                      className={inputCls}
                      placeholder="Father name"
                    />
                  </div>

                  {/* First Name */}
                  <div>
                    <label className={labelCls}>First Name</label>
                    <input
                      value={draft.firstName ?? ""}
                      onChange={(e) => update({ firstName: e.target.value })}
                      className={inputCls}
                      placeholder="First name"
                    />
                  </div>

                  {/* Marital Status */}
                  <div>
                    <label className={labelCls}>Marital Status</label>
                    <select
                      value={draft.maritalStatus ?? ""}
                      onChange={(e) => update({ maritalStatus: e.target.value })}
                      className={inputCls}
                    >
                      <option value="">Select</option>
                      <option value="Unmarried">Unmarried</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>

                  {/* Middle Name */}
                  <div>
                    <label className={labelCls}>Middle Name</label>
                    <input
                      value={draft.middleName ?? ""}
                      onChange={(e) => update({ middleName: e.target.value })}
                      className={inputCls}
                      placeholder="Middle name"
                    />
                  </div>

                  {/* Spouse Name */}
                  <div>
                    <label className={labelCls}>Spouse Name</label>
                    <input
                      value={draft.spouseName ?? ""}
                      onChange={(e) => update({ spouseName: e.target.value })}
                      className={inputCls}
                      placeholder="Spouse name"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className={labelCls}>Last Name</label>
                    <input
                      value={draft.lastName ?? ""}
                      onChange={(e) => update({ lastName: e.target.value })}
                      className={inputCls}
                      placeholder="Last name"
                    />
                  </div>

                  {/* Date Of Birth */}
                  <div>
                    <label className={labelCls}>Date Of Birth</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={draft.dateOfBirth ?? ""}
                        onChange={(e) => update({ dateOfBirth: e.target.value })}
                        className={`${inputCls} pr-9`}
                        placeholder="DD-MM-YYYY"
                      />
                      <Calendar
                        size={15}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
                      />
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className={labelCls}>Full Name</label>
                    <input
                      value={
                        draft.fullName ??
                        [draft.firstName, draft.middleName, draft.lastName]
                          .filter(Boolean)
                          .join(" ")
                      }
                      onChange={(e) => update({ fullName: e.target.value })}
                      className={inputCls}
                      placeholder="Full name"
                    />
                  </div>

                  {/* Physically Challenged */}
                  <div className="flex items-end pb-2">
                    <label className="flex cursor-pointer items-center gap-2 text-[13px] text-[#344054]">
                      <input
                        type="checkbox"
                        checked={!!draft.physicallyChallenged}
                        onChange={(e) =>
                          update({ physicallyChallenged: e.target.checked })
                        }
                        className="h-[15px] w-[15px] accent-[#FF6200]"
                      />
                      Physically Challenged
                    </label>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className={labelCls}>Gender</label>
                    <select
                      value={draft.gender ?? ""}
                      onChange={(e) => update({ gender: e.target.value })}
                      className={inputCls}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-[36px] rounded-[8px] bg-[#FF6200] px-5 text-[13px] font-semibold text-white hover:bg-[#E55600] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSaving ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingCandidatePage;
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ChevronDown,
//   X,
//   Save,
//   Phone,
//   Mail,
// } from "lucide-react";

// import DatePicker from "../../../../../../components/ui/datepicker";

// /* ============================================================
//    TYPES
// ============================================================ */

// interface SeparationTabProps {
//   form: any;
//   set: (key: string, value: any) => void;
//   onSave?: () => void;
//   onDiscard?: () => void;
// }

// /* ============================================================
//    COMMON STYLES
// ============================================================ */

// const fieldLabel =
//   "block text-[13px] font-medium text-gray-700 mb-1.5";

// /* ============================================================
//    REASON OPTIONS
// ============================================================ */

// const REASON_OPTIONS = [
//   "Career Advancement",
//   "Relocation",
//   "Retired",
//   "Death In Service",
//   "Permanent Disability",
//   "Suspension Of Work",
// ];

// /* ============================================================
//    DATE HELPERS
// ============================================================ */

// const pad2 = (value: number) =>
//   String(value).padStart(2, "0");

// const toIsoDate = (date: Date) =>
//   `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(
//     date.getDate()
//   )}`;

// const formatDisplayDate = (iso: string) => {
//   if (!iso) return "";

//   const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);

//   if (!match) return "";

//   const [, year, month, day] = match;

//   return `${day}-${month}-${year}`;
// };

// const parseDisplayDate = (value: string): string | null => {
//   const trimmed = value.trim();

//   if (!trimmed) return "";

//   /* DD-MM-YYYY */
//   const ddmmyyyy = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec(
//     trimmed
//   );

//   if (ddmmyyyy) {
//     const day = Number(ddmmyyyy[1]);
//     const month = Number(ddmmyyyy[2]);
//     const year = Number(ddmmyyyy[3]);

//     const date = new Date(year, month - 1, day);

//     if (
//       date.getFullYear() === year &&
//       date.getMonth() === month - 1 &&
//       date.getDate() === day
//     ) {
//       return toIsoDate(date);
//     }

//     return null;
//   }

//   /* YYYY-MM-DD */
//   const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);

//   if (iso) {
//     const year = Number(iso[1]);
//     const month = Number(iso[2]);
//     const day = Number(iso[3]);

//     const date = new Date(year, month - 1, day);

//     if (
//       date.getFullYear() === year &&
//       date.getMonth() === month - 1 &&
//       date.getDate() === day
//     ) {
//       return toIsoDate(date);
//     }
//   }

//   return null;
// };

// const getInitialMonth = (value: string) => {
//   const parsed = parseDisplayDate(value);

//   if (parsed) {
//     const [year, month] = parsed
//       .split("-")
//       .map(Number);

//     return new Date(year, month - 1, 1);
//   }

//   const today = new Date();

//   return new Date(
//     today.getFullYear(),
//     today.getMonth(),
//     1
//   );
// };

// /* ============================================================
//    COMMON DATE PICKER STATE
// ============================================================ */

// function useSeparationDatePicker(
//   value: string,
//   onChange: (value: string) => void
// ) {
//   const [open, setOpen] = useState(false);

//   const [text, setText] = useState(
//     formatDisplayDate(value)
//   );

//   const [viewMonth, setViewMonth] = useState(() =>
//     getInitialMonth(value)
//   );

//   /* Sync when parent form value changes */
//   useEffect(() => {
//     setText(formatDisplayDate(value));

//     const parsed = parseDisplayDate(value);

//     if (parsed) {
//       const [year, month] = parsed
//         .split("-")
//         .map(Number);

//       setViewMonth(
//         new Date(year, month - 1, 1)
//       );
//     }
//   }, [value]);

//   const monthLabel = useMemo(
//     () =>
//       new Intl.DateTimeFormat("en-US", {
//         month: "long",
//         year: "numeric",
//       }).format(viewMonth),
//     [viewMonth]
//   );

//   const weekdayLabels = useMemo(
//     () => ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
//     []
//   );

//   const cells = useMemo(() => {
//     const firstDay = new Date(
//       viewMonth.getFullYear(),
//       viewMonth.getMonth(),
//       1
//     );

//     const startDate = new Date(firstDay);

//     startDate.setDate(
//       firstDay.getDate() - firstDay.getDay()
//     );

//     const selectedIso = parseDisplayDate(value);

//     return Array.from({ length: 42 }, (_, index) => {
//       const date = new Date(startDate);

//       date.setDate(
//         startDate.getDate() + index
//       );

//       const iso = toIsoDate(date);

//       return {
//         iso,
//         day: date.getDate(),
//         inMonth:
//           date.getMonth() ===
//           viewMonth.getMonth(),
//         disabled: false,
//         selected:
//           selectedIso === iso,
//       };
//     });
//   }, [viewMonth, value]);

//   const handleTextChange = (raw: string) => {
//     setText(raw);

//     /*
//       Do not immediately change the parent value.
//       This allows the user to type:
//       DD-MM-YYYY
//     */
//   };

//   const handleBlur = () => {
//     const parsed = parseDisplayDate(text);

//     if (parsed === null) {
//       setText(formatDisplayDate(value));
//       return;
//     }

//     if (parsed === "") {
//       setText("");
//       onChange("");
//       return;
//     }

//     setText(formatDisplayDate(parsed));
//     onChange(parsed);

//     const [year, month] = parsed
//       .split("-")
//       .map(Number);

//     setViewMonth(
//       new Date(year, month - 1, 1)
//     );
//   };

//   const handleSelectDay = (iso: string) => {
//     onChange(iso);
//     setText(formatDisplayDate(iso));

//     const [year, month] = iso
//       .split("-")
//       .map(Number);

//     setViewMonth(
//       new Date(year, month - 1, 1)
//     );

//     setOpen(false);
//   };

//   const handlePrevMonth = () => {
//     setViewMonth(
//       (previous) =>
//         new Date(
//           previous.getFullYear(),
//           previous.getMonth() - 1,
//           1
//         )
//     );
//   };

//   const handleNextMonth = () => {
//     setViewMonth(
//       (previous) =>
//         new Date(
//           previous.getFullYear(),
//           previous.getMonth() + 1,
//           1
//         )
//     );
//   };

//   const handleClear = () => {
//     setText("");
//     onChange("");
//     setOpen(false);
//   };

//   const handleToday = () => {
//     const today = toIsoDate(new Date());

//     onChange(today);
//     setText(formatDisplayDate(today));

//     const current = new Date();

//     setViewMonth(
//       new Date(
//         current.getFullYear(),
//         current.getMonth(),
//         1
//       )
//     );

//     setOpen(false);
//   };

//   return {
//     text,
//     open,
//     setOpen,
//     monthLabel,
//     weekdayLabels,
//     cells,
//     handleTextChange,
//     handleBlur,
//     handleSelectDay,
//     handlePrevMonth,
//     handleNextMonth,
//     handleClear,
//     handleToday,
//   };
// }

// /* ============================================================
//    SEPARATION TAB
// ============================================================ */

// const SeparationTab: React.FC<SeparationTabProps> = ({
//   form,
//   set,
// }) => {
//   const [reasonModalOpen, setReasonModalOpen] =
//     useState(false);

//   const [reasonDraft, setReasonDraft] =
//     useState("");

//   const [toast, setToast] =
//     useState<string | null>(null);

//   /* ==========================================================
//      RESIGNATION DATE PICKER
//   ========================================================== */

//   const resignationPicker =
//     useSeparationDatePicker(
//       form.resignationDate || "",
//       (value) =>
//         set("resignationDate", value)
//     );

//   /* ==========================================================
//      DATE OF LEAVING PICKER
//   ========================================================== */

//   const leavingPicker =
//     useSeparationDatePicker(
//       form.dateOfLeaving || "",
//       (value) =>
//         set("dateOfLeaving", value)
//     );

//   /* ==========================================================
//      SETTER
//   ========================================================== */

//   const wrappedSet = (
//     key: string,
//     value: any
//   ) => {
//     set(key, value);
//   };

//   /* ==========================================================
//      TOAST
//   ========================================================== */

//   const showToast = (msg: string) => {
//     setToast(msg);

//     window.setTimeout(() => {
//       setToast(null);
//     }, 1800);
//   };

//   /* ==========================================================
//      REASON SELECT
//   ========================================================== */

//   const handleReasonSelect = (
//     value: string
//   ) => {
//     if (value === "__add_reason__") {
//       setReasonDraft("");
//       setReasonModalOpen(true);
//       return;
//     }

//     if (value === "__custom__") {
//       return;
//     }

//     wrappedSet(
//       "reasonForLeaving",
//       value
//     );
//   };

//   /* ==========================================================
//      SAVE CUSTOM REASON
//   ========================================================== */

//   const handleReasonModalSave = () => {
//     const trimmed =
//       reasonDraft.trim();

//     if (!trimmed) return;

//     wrappedSet(
//       "reasonForLeaving",
//       trimmed
//     );

//     setReasonModalOpen(false);
//     setReasonDraft("");

//     showToast(
//       "Reason added successfully"
//     );
//   };

//   /* ==========================================================
//      CLOSE REASON MODAL
//   ========================================================== */

//   const handleReasonModalClose = () => {
//     setReasonModalOpen(false);
//     setReasonDraft("");
//   };

//   return (
//     <div className="relative">

//       {/* =====================================================
//           MAIN CONTENT
//       ===================================================== */}

//       <div className="flex gap-5 min-h-[480px]">

//         {/* ===================================================
//             LEFT SIDEBAR
//         =================================================== */}

//         <div className="w-[210px] shrink-0">

//           <div className="bg-white rounded-[10px] border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">

//             {/* PHOTO */}

//             <div className="pt-4 px-4 flex justify-center">

//               <div className="w-[158px] h-[188px] rounded-[8px] overflow-hidden border border-gray-200 bg-gray-50 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">

//                 {form.photoUrl ? (
//                   <img
//                     src={form.photoUrl}
//                     alt={
//                       form.fullName ||
//                       "Employee"
//                     }
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <img
//                     src="https://i.pravatar.cc/300?u=294640"
//                     alt="Employee"
//                     className="w-full h-full object-cover"
//                   />
//                 )}

//               </div>

//             </div>

//             {/* EMPLOYEE INFORMATION */}

//             <div className="px-4 pt-3 pb-4 text-center">

//               <h3 className="text-[13.5px] font-semibold text-[#2D8CF0] leading-tight tracking-tight">
//                 {form.fullName ||
//                   "BHAGYARAJA AVURAPALLI"}
//               </h3>

//               <div className="mt-1.5 inline-flex items-center px-2.5 py-[2px] rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[11px] font-medium">
//                 {form.empId || "294640"}
//               </div>

//               <p className="mt-2 text-[11px] text-gray-500 leading-[1.35]">
//                 {form.designation ||
//                   "Senior Software Engineer"}{" "}
//                 |{" "}
//                 {form.branch ||
//                   "Koundinyasa Technology Services Pvt. Ltd."}
//               </p>

//               <p className="mt-1 text-[11px] text-gray-400">
//                 DOJ{" "}
//                 {form.dateOfJoining ||
//                   "31/Mar/2026"}
//               </p>

//               <div className="mt-3 space-y-1.5 text-left pl-1">

//                 {/* MOBILE */}

//                 <div className="flex items-center gap-2 text-[12px] text-gray-600">

//                   <Phone
//                     size={12}
//                     className="text-gray-400 shrink-0"
//                   />

//                   <span>
//                     {form.mobile ||
//                       "9491964186"}
//                   </span>

//                 </div>

//                 {/* EMAIL */}

//                 <div className="flex items-center gap-2 text-[12px] text-gray-600">

//                   <Mail
//                     size={12}
//                     className="text-gray-400 shrink-0"
//                   />

//                   <span
//                     className="truncate"
//                     title={form.email}
//                   >
//                     {form.email ||
//                       "bhagyaraja.a@koundinyasatech.com"}
//                   </span>

//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ===================================================
//             RIGHT CONTENT
//         =================================================== */}

//         <div className="flex-1 min-w-0 bg-white rounded-[10px] border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] px-6 py-6">

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">

//             {/* =================================================
//                 COLUMN 1
//             ================================================= */}

//             <div className="space-y-5">

//               {/* RESIGNATION DATE */}

//               <div>

//                 <label className={fieldLabel}>
//                   Resignation Date
//                 </label>

//                 <DatePicker
//                   id="resignation-date"
//                   text={
//                     resignationPicker.text
//                   }
//                   onTextChange={
//                     resignationPicker.handleTextChange
//                   }
//                   onBlur={
//                     resignationPicker.handleBlur
//                   }
//                   placeholder="dd-mm-yyyy"
//                   open={
//                     resignationPicker.open
//                   }
//                   onOpenChange={
//                     resignationPicker.setOpen
//                   }
//                   monthLabel={
//                     resignationPicker.monthLabel
//                   }
//                   weekdayLabels={
//                     resignationPicker.weekdayLabels
//                   }
//                   cells={
//                     resignationPicker.cells
//                   }
//                   onSelectDay={
//                     resignationPicker.handleSelectDay
//                   }
//                   onPrevMonth={
//                     resignationPicker.handlePrevMonth
//                   }
//                   onNextMonth={
//                     resignationPicker.handleNextMonth
//                   }
//                   onClear={
//                     resignationPicker.handleClear
//                   }
//                   onToday={
//                     resignationPicker.handleToday
//                   }
//                 />

//               </div>

//               {/* NOTICE PERIOD */}

//               <div>

//                 <label className={fieldLabel}>
//                   Notice Period Days
//                 </label>

//                 <input
//                   type="text"
//                   className="w-full h-[38px] px-3 text-[13px] text-gray-700 border border-gray-300 rounded-[6px] bg-[#FDF3E1] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all focus:outline-none focus:ring-2 focus:ring-[#2196F3]/20 focus:border-[#2196F3]"
//                   value={
//                     form.noticePeriodDays ||
//                     ""
//                   }
//                   onChange={(e) =>
//                     wrappedSet(
//                       "noticePeriodDays",
//                       e.target.value
//                     )
//                   }
//                 />

//               </div>

//               {/* DATE OF LEAVING */}

//               <div>

//                 <label className={fieldLabel}>
//                   Date of leaving
//                 </label>

//                 <DatePicker
//                   id="date-of-leaving"
//                   text={
//                     leavingPicker.text
//                   }
//                   onTextChange={
//                     leavingPicker.handleTextChange
//                   }
//                   onBlur={
//                     leavingPicker.handleBlur
//                   }
//                   placeholder="dd-mm-yyyy"
//                   open={
//                     leavingPicker.open
//                   }
//                   onOpenChange={
//                     leavingPicker.setOpen
//                   }
//                   monthLabel={
//                     leavingPicker.monthLabel
//                   }
//                   weekdayLabels={
//                     leavingPicker.weekdayLabels
//                   }
//                   cells={
//                     leavingPicker.cells
//                   }
//                   onSelectDay={
//                     leavingPicker.handleSelectDay
//                   }
//                   onPrevMonth={
//                     leavingPicker.handlePrevMonth
//                   }
//                   onNextMonth={
//                     leavingPicker.handleNextMonth
//                   }
//                   onClear={
//                     leavingPicker.handleClear
//                   }
//                   onToday={
//                     leavingPicker.handleToday
//                   }
//                 />

//               </div>

//             </div>

//             {/* =================================================
//                 COLUMN 2
//             ================================================= */}

//             <div className="space-y-5">

//               {/* REASON FOR LEAVING */}

//               <div>

//                 <label className={fieldLabel}>
//                   Reason for leaving
//                 </label>

//                 <div className="relative">

//                   <select
//                     className="w-full h-[38px] pl-3 pr-8 text-[13px] text-gray-700 border border-gray-300 rounded-[6px] bg-white appearance-none shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all focus:outline-none focus:ring-2 focus:ring-[#2196F3]/20 focus:border-[#2196F3]"
//                     value={
//                       REASON_OPTIONS.includes(
//                         form.reasonForLeaving
//                       )
//                         ? form.reasonForLeaving
//                         : form.reasonForLeaving
//                         ? "__custom__"
//                         : ""
//                     }
//                     onChange={(e) =>
//                       handleReasonSelect(
//                         e.target.value
//                       )
//                     }
//                   >

//                     <option value="">
//                       Select Reason for leaving
//                     </option>

//                     {REASON_OPTIONS.map(
//                       (reason) => (
//                         <option
//                           key={reason}
//                           value={reason}
//                         >
//                           {reason}
//                         </option>
//                       )
//                     )}

//                     {form.reasonForLeaving &&
//                       !REASON_OPTIONS.includes(
//                         form.reasonForLeaving
//                       ) && (
//                         <option value="__custom__">
//                           {form.reasonForLeaving}
//                         </option>
//                       )}

//                     <option value="__add_reason__">
//                       + Add Reason
//                     </option>

//                   </select>

//                   <ChevronDown
//                     size={15}
//                     className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
//                   />

//                 </div>
//               </div>

//               {/* REMARKS */}

//               <div>

//                 <label className={fieldLabel}>
//                   Remarks
//                 </label>

//                 <input
//                   type="text"
//                   className="w-full h-[38px] px-3 text-[13px] text-gray-700 border border-gray-300 rounded-[6px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all focus:outline-none focus:ring-2 focus:ring-[#2196F3]/20 focus:border-[#2196F3]"
//                   value={
//                     form.remarks || ""
//                   }
//                   onChange={(e) =>
//                     wrappedSet(
//                       "remarks",
//                       e.target.value
//                     )
//                   }
//                 />

//               </div>

//               {/* EMPLOYEE LOCK */}

//               <div className="flex items-center gap-2 pt-1">

//                 <input
//                   id="employeeLock"
//                   type="checkbox"
//                   className="w-[15px] h-[15px] rounded border-gray-300 text-[#2196F3] focus:ring-[#2196F3]/30"
//                   checked={
//                     !!form.employeeLock
//                   }
//                   onChange={(e) =>
//                     wrappedSet(
//                       "employeeLock",
//                       e.target.checked
//                     )
//                   }
//                 />

//                 <label
//                   htmlFor="employeeLock"
//                   className="text-[13px] text-gray-700"
//                 >
//                   Employee Lock
//                 </label>

//               </div>

//             </div>

//             {/* =================================================
//                 COLUMN 3
//             ================================================= */}

//             <div className="hidden md:block" />

//           </div>
//         </div>
//       </div>

//       {/* =====================================================
//           ADD REASON MODAL
//       ===================================================== */}

//       {reasonModalOpen && (

//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">

//           <div className="bg-white rounded-[10px] shadow-[0_10px_40px_rgba(0,0,0,0.2)] w-[300px] overflow-hidden">

//             {/* MODAL HEADER */}

//             <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">

//               <h4 className="text-[13px] font-semibold text-gray-800">
//                 Reason
//               </h4>

//               <button
//                 type="button"
//                 onClick={
//                   handleReasonModalClose
//                 }
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X size={16} />
//               </button>

//             </div>

//             {/* MODAL BODY */}

//             <div className="px-4 py-4">

//               <label className="block text-[12px] text-gray-600 mb-1.5">

//                 Reason{" "}

//                 <span className="text-red-500">
//                   *
//                 </span>

//               </label>

//               <input
//                 type="text"
//                 autoFocus
//                 value={reasonDraft}
//                 onChange={(e) =>
//                   setReasonDraft(
//                     e.target.value
//                   )
//                 }
//                 className="w-full h-[34px] px-2.5 text-[13px] text-gray-700 border border-gray-300 rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-[#2196F3]/20 focus:border-[#2196F3]"
//               />

//             </div>

//             {/* MODAL FOOTER */}

//             <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50">

//               <button
//                 type="button"
//                 onClick={
//                   handleReasonModalClose
//                 }
//                 className="h-[30px] px-3 text-[12.5px] font-medium text-gray-600 border border-gray-300 rounded-[6px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-gray-50 flex items-center gap-1"
//               >

//                 <X size={12} />

//                 Close

//               </button>

//               <button
//                 type="button"
//                 onClick={
//                   handleReasonModalSave
//                 }
//                 disabled={
//                   !reasonDraft.trim()
//                 }
//                 className="h-[30px] px-3 text-[12.5px] font-medium text-white bg-[#2196F3] rounded-[6px] shadow-[0_2px_4px_rgba(33,150,243,0.25)] hover:bg-[#1E88E5] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-1"
//               >

//                 <Save size={12} />

//                 Save

//               </button>

//             </div>

//           </div>

//         </div>

//       )}

//       {/* =====================================================
//           TOAST
//       ===================================================== */}

//       {toast && (

//         <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-[13px] px-4 py-2.5 rounded-[6px] shadow-[0_4px_12px_rgba(0,0,0,0.25)]">

//           {toast}

//         </div>

//       )}

//     </div>
//   );
// };

// export default SeparationTab;
















import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  X,
  Save,
  Phone,
  Mail,
} from "lucide-react";

import DatePicker from "../ui/datepicker";

/* ============================================================
   TYPES
============================================================ */

interface SeparationTabProps {
  form: any;
  set: (key: string, value: any) => void;
  onSave?: () => void;
  onDiscard?: () => void;
}

/* ============================================================
   COMMON STYLES
============================================================ */

const fieldLabel =
  "mb-1.5 block text-[13px] font-medium text-[#626262]";

/* ============================================================
   REASON OPTIONS
============================================================ */

const REASON_OPTIONS = [
  "Career Advancement",
  "Relocation",
  "Retired",
  "Death In Service",
  "Permanent Disability",
  "Suspension Of Work",
];

/* ============================================================
   DATE HELPERS
============================================================ */

const pad2 = (value: number) =>
  String(value).padStart(2, "0");

const toIsoDate = (date: Date) =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(
    date.getDate()
  )}`;

const formatDisplayDate = (iso: string) => {
  if (!iso) return "";

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);

  if (!match) return "";

  const [, year, month, day] = match;

  return `${day}-${month}-${year}`;
};

const parseDisplayDate = (value: string): string | null => {
  const trimmed = value.trim();

  if (!trimmed) return "";

  /* DD-MM-YYYY */
  const ddmmyyyy = /^(\d{1,2})-(\d{1,2})-(\d{4})$/.exec(
    trimmed
  );

  if (ddmmyyyy) {
    const day = Number(ddmmyyyy[1]);
    const month = Number(ddmmyyyy[2]);
    const year = Number(ddmmyyyy[3]);

    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return toIsoDate(date);
    }

    return null;
  }

  /* YYYY-MM-DD */
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);

  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]);
    const day = Number(iso[3]);

    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    ) {
      return toIsoDate(date);
    }
  }

  return null;
};

const getInitialMonth = (value: string) => {
  const parsed = parseDisplayDate(value);

  if (parsed) {
    const [year, month] = parsed
      .split("-")
      .map(Number);

    return new Date(year, month - 1, 1);
  }

  const today = new Date();

  return new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );
};

/* ============================================================
   COMMON DATE PICKER STATE
============================================================ */

function useSeparationDatePicker(
  value: string,
  onChange: (value: string) => void
) {
  const [open, setOpen] = useState(false);

  const [text, setText] = useState(
    formatDisplayDate(value)
  );

  const [viewMonth, setViewMonth] = useState(() =>
    getInitialMonth(value)
  );

  /* Sync when parent form value changes */
  useEffect(() => {
    setText(formatDisplayDate(value));

    const parsed = parseDisplayDate(value);

    if (parsed) {
      const [year, month] = parsed
        .split("-")
        .map(Number);

      setViewMonth(
        new Date(year, month - 1, 1)
      );
    }
  }, [value]);

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(viewMonth),
    [viewMonth]
  );

  const weekdayLabels = useMemo(
    () => ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    []
  );

  const cells = useMemo(() => {
    const firstDay = new Date(
      viewMonth.getFullYear(),
      viewMonth.getMonth(),
      1
    );

    const startDate = new Date(firstDay);

    startDate.setDate(
      firstDay.getDate() - firstDay.getDay()
    );

    const selectedIso = parseDisplayDate(value);

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(startDate);

      date.setDate(
        startDate.getDate() + index
      );

      const iso = toIsoDate(date);

      return {
        iso,
        day: date.getDate(),
        inMonth:
          date.getMonth() ===
          viewMonth.getMonth(),
        disabled: false,
        selected:
          selectedIso === iso,
      };
    });
  }, [viewMonth, value]);

  const handleTextChange = (raw: string) => {
    setText(raw);

    /*
      Do not immediately change the parent value.
      This allows the user to type:
      DD-MM-YYYY
    */
  };

  const handleBlur = () => {
    const parsed = parseDisplayDate(text);

    if (parsed === null) {
      setText(formatDisplayDate(value));
      return;
    }

    if (parsed === "") {
      setText("");
      onChange("");
      return;
    }

    setText(formatDisplayDate(parsed));
    onChange(parsed);

    const [year, month] = parsed
      .split("-")
      .map(Number);

    setViewMonth(
      new Date(year, month - 1, 1)
    );
  };

  const handleSelectDay = (iso: string) => {
    onChange(iso);
    setText(formatDisplayDate(iso));

    const [year, month] = iso
      .split("-")
      .map(Number);

    setViewMonth(
      new Date(year, month - 1, 1)
    );

    setOpen(false);
  };

  const handlePrevMonth = () => {
    setViewMonth(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() - 1,
          1
        )
    );
  };

  const handleNextMonth = () => {
    setViewMonth(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() + 1,
          1
        )
    );
  };

  const handleClear = () => {
    setText("");
    onChange("");
    setOpen(false);
  };

  const handleToday = () => {
    const today = toIsoDate(new Date());

    onChange(today);
    setText(formatDisplayDate(today));

    const current = new Date();

    setViewMonth(
      new Date(
        current.getFullYear(),
        current.getMonth(),
        1
      )
    );

    setOpen(false);
  };

  return {
    text,
    open,
    setOpen,
    monthLabel,
    weekdayLabels,
    cells,
    handleTextChange,
    handleBlur,
    handleSelectDay,
    handlePrevMonth,
    handleNextMonth,
    handleClear,
    handleToday,
  };
}

/* ============================================================
   SEPARATION TAB
============================================================ */

const SeparationTab: React.FC<SeparationTabProps> = ({
  form,
  set,
}) => {
  const [reasonModalOpen, setReasonModalOpen] =
    useState(false);

  const [reasonDraft, setReasonDraft] =
    useState("");

  const [toast, setToast] =
    useState<string | null>(null);

  /* ==========================================================
     RESIGNATION DATE PICKER
  ========================================================== */

  const resignationPicker =
    useSeparationDatePicker(
      form.resignationDate || "",
      (value) =>
        set("resignationDate", value)
    );

  /* ==========================================================
     DATE OF LEAVING PICKER
  ========================================================== */

  const leavingPicker =
    useSeparationDatePicker(
      form.dateOfLeaving || "",
      (value) =>
        set("dateOfLeaving", value)
    );

  /* ==========================================================
     SETTER
  ========================================================== */

  const wrappedSet = (
    key: string,
    value: any
  ) => {
    set(key, value);
  };

  /* ==========================================================
     TOAST
  ========================================================== */

  const showToast = (msg: string) => {
    setToast(msg);

    window.setTimeout(() => {
      setToast(null);
    }, 1800);
  };

  /* ==========================================================
     REASON SELECT
  ========================================================== */

  const handleReasonSelect = (
    value: string
  ) => {
    if (value === "__add_reason__") {
      setReasonDraft("");
      setReasonModalOpen(true);
      return;
    }

    if (value === "__custom__") {
      return;
    }

    wrappedSet(
      "reasonForLeaving",
      value
    );
  };

  /* ==========================================================
     SAVE CUSTOM REASON
  ========================================================== */

  const handleReasonModalSave = () => {
    const trimmed =
      reasonDraft.trim();

    if (!trimmed) return;

    wrappedSet(
      "reasonForLeaving",
      trimmed
    );

    setReasonModalOpen(false);
    setReasonDraft("");

    showToast(
      "Reason added successfully"
    );
  };

  /* ==========================================================
     CLOSE REASON MODAL
  ========================================================== */

  const handleReasonModalClose = () => {
    setReasonModalOpen(false);
    setReasonDraft("");
  };

  return (
    <div className="relative">

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="flex gap-5 min-h-[480px]">

        {/* ===================================================
            LEFT SIDEBAR
        =================================================== */}

        <div className="w-[210px] shrink-0">

          <div className="bg-white rounded-[10px] border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] overflow-hidden">

            {/* PHOTO */}

            <div className="pt-4 px-4 flex justify-center">

              <div className="w-[158px] h-[188px] rounded-[8px] overflow-hidden border border-gray-200 bg-gray-50 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">

                {form.photoUrl ? (
                  <img
                    src={form.photoUrl}
                    alt={
                      form.fullName ||
                      "Employee"
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="https://i.pravatar.cc/300?u=294640"
                    alt="Employee"
                    className="w-full h-full object-cover"
                  />
                )}

              </div>

            </div>

            {/* EMPLOYEE INFORMATION */}

            <div className="px-4 pt-3 pb-4 text-center">

              <h3 className="text-[13.5px] font-semibold text-[#F97316] leading-tight tracking-tight">
                {form.fullName ||
                  "BHAGYARAJA AVURAPALLI"}
              </h3>

              <div className="mt-1.5 inline-flex items-center px-2.5 py-[2px] rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[11px] font-medium">
                {form.empId || "294640"}
              </div>

              <p className="mt-2 text-[11px] text-gray-500 leading-[1.35]">
                {form.designation ||
                  "Senior Software Engineer"}{" "}
                |{" "}
                {form.branch ||
                  "Koundinyasa Technology Services Pvt. Ltd."}
              </p>

              <p className="mt-1 text-[11px] text-gray-400">
                DOJ{" "}
                {form.dateOfJoining ||
                  "31/Mar/2026"}
              </p>

              <div className="mt-3 space-y-1.5 text-left pl-1">

                {/* MOBILE */}

                <div className="flex items-center gap-2 text-[12px] text-gray-600">

                  <Phone
                    size={12}
                    className="text-gray-400 shrink-0"
                  />

                  <span>
                    {form.mobile ||
                      "9491964186"}
                  </span>

                </div>

                {/* EMAIL */}

                <div className="flex items-center gap-2 text-[12px] text-gray-600">

                  <Mail
                    size={12}
                    className="text-gray-400 shrink-0"
                  />

                  <span
                    className="truncate"
                    title={form.email}
                  >
                    {form.email ||
                      "bhagyaraja.a@koundinyasatech.com"}
                  </span>

                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            RIGHT CONTENT
        =================================================== */}

        <div className="flex-1 min-w-0 bg-white rounded-[10px] border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] px-6 py-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">

            {/* =================================================
                COLUMN 1
            ================================================= */}

            <div className="space-y-5">

              {/* RESIGNATION DATE */}

              <div>

                <label className={fieldLabel}>
                  Resignation Date
                </label>

                <DatePicker
                  id="resignation-date"
                  text={
                    resignationPicker.text
                  }
                  onTextChange={
                    resignationPicker.handleTextChange
                  }
                  onBlur={
                    resignationPicker.handleBlur
                  }
                  placeholder="dd-mm-yyyy"
                  open={
                    resignationPicker.open
                  }
                  onOpenChange={
                    resignationPicker.setOpen
                  }
                  monthLabel={
                    resignationPicker.monthLabel
                  }
                  weekdayLabels={
                    resignationPicker.weekdayLabels
                  }
                  cells={
                    resignationPicker.cells
                  }
                  onSelectDay={
                    resignationPicker.handleSelectDay
                  }
                  onPrevMonth={
                    resignationPicker.handlePrevMonth
                  }
                  onNextMonth={
                    resignationPicker.handleNextMonth
                  }
                  onClear={
                    resignationPicker.handleClear
                  }
                  onToday={
                    resignationPicker.handleToday
                  }
                />

              </div>

              {/* NOTICE PERIOD */}

              <div>

                <label className={fieldLabel}>
                  Notice Period Days
                </label>

                <input
                  type="text"
                  className="w-full h-[38px] px-3 text-[13px] text-gray-700 border border-gray-300 rounded-[6px] bg-[#FDF3E1] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316]"
                  value={
                    form.noticePeriodDays ||
                    ""
                  }
                  onChange={(e) =>
                    wrappedSet(
                      "noticePeriodDays",
                      e.target.value
                    )
                  }
                />

              </div>

              {/* DATE OF LEAVING */}

              <div>

                <label className={fieldLabel}>
                  Date of leaving
                </label>

                <DatePicker
                  id="date-of-leaving"
                  text={
                    leavingPicker.text
                  }
                  onTextChange={
                    leavingPicker.handleTextChange
                  }
                  onBlur={
                    leavingPicker.handleBlur
                  }
                  placeholder="dd-mm-yyyy"
                  open={
                    leavingPicker.open
                  }
                  onOpenChange={
                    leavingPicker.setOpen
                  }
                  monthLabel={
                    leavingPicker.monthLabel
                  }
                  weekdayLabels={
                    leavingPicker.weekdayLabels
                  }
                  cells={
                    leavingPicker.cells
                  }
                  onSelectDay={
                    leavingPicker.handleSelectDay
                  }
                  onPrevMonth={
                    leavingPicker.handlePrevMonth
                  }
                  onNextMonth={
                    leavingPicker.handleNextMonth
                  }
                  onClear={
                    leavingPicker.handleClear
                  }
                  onToday={
                    leavingPicker.handleToday
                  }
                />

              </div>

            </div>

            {/* =================================================
                COLUMN 2
            ================================================= */}

            <div className="space-y-5">

              {/* REASON FOR LEAVING */}

              <div>

                <label className={fieldLabel}>
                  Reason for leaving
                </label>

                <div className="relative">

                  <select
                    className="w-full h-[38px] pl-3 pr-8 text-[13px] text-gray-700 border border-gray-300 rounded-[6px] bg-white appearance-none shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316]"
                    value={
                      REASON_OPTIONS.includes(
                        form.reasonForLeaving
                      )
                        ? form.reasonForLeaving
                        : form.reasonForLeaving
                        ? "__custom__"
                        : ""
                    }
                    onChange={(e) =>
                      handleReasonSelect(
                        e.target.value
                      )
                    }
                  >

                    <option value="">
                      Select Reason for leaving
                    </option>

                    {REASON_OPTIONS.map(
                      (reason) => (
                        <option
                          key={reason}
                          value={reason}
                        >
                          {reason}
                        </option>
                      )
                    )}

                    {form.reasonForLeaving &&
                      !REASON_OPTIONS.includes(
                        form.reasonForLeaving
                      ) && (
                        <option value="__custom__">
                          {form.reasonForLeaving}
                        </option>
                      )}

                    <option value="__add_reason__">
                      + Add Reason
                    </option>

                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                </div>
              </div>

              {/* REMARKS */}

              <div>

                <label className={fieldLabel}>
                  Remarks
                </label>

                <input
                  type="text"
                  className="w-full h-[38px] px-3 text-[13px] text-gray-700 border border-gray-300 rounded-[6px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316]"
                  value={
                    form.remarks || ""
                  }
                  onChange={(e) =>
                    wrappedSet(
                      "remarks",
                      e.target.value
                    )
                  }
                />

              </div>

              {/* EMPLOYEE LOCK */}

              <div className="flex items-center gap-2 pt-1">

                <input
                  id="employeeLock"
                  type="checkbox"
                  className="w-[15px] h-[15px] rounded border-gray-300 text-[#F97316] focus:ring-[#F97316]/30"
                  checked={
                    !!form.employeeLock
                  }
                  onChange={(e) =>
                    wrappedSet(
                      "employeeLock",
                      e.target.checked
                    )
                  }
                />

                <label
                  htmlFor="employeeLock"
                  className="text-[13px] text-gray-700"
                >
                  Employee Lock
                </label>

              </div>

            </div>

            {/* =================================================
                COLUMN 3
            ================================================= */}

            <div className="hidden md:block" />

          </div>
        </div>
      </div>

      {/* =====================================================
          ADD REASON MODAL
      ===================================================== */}

      {reasonModalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">

          <div className="bg-white rounded-[10px] shadow-[0_10px_40px_rgba(0,0,0,0.2)] w-[300px] overflow-hidden">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">

              <h4 className="text-[13px] font-semibold text-gray-800">
                Reason
              </h4>

              <button
                type="button"
                onClick={
                  handleReasonModalClose
                }
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>

            </div>

            {/* MODAL BODY */}

            <div className="px-4 py-4">

              <label className="block text-[12px] text-gray-600 mb-1.5">

                Reason{" "}

                <span className="text-red-500">
                  *
                </span>

              </label>

              <input
                type="text"
                autoFocus
                value={reasonDraft}
                onChange={(e) =>
                  setReasonDraft(
                    e.target.value
                  )
                }
                className="w-full h-[34px] px-2.5 text-[13px] text-gray-700 border border-gray-300 rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316]"
              />

            </div>

            {/* MODAL FOOTER */}

            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-200 bg-gray-50">

              <button
                type="button"
                onClick={
                  handleReasonModalClose
                }
                className="h-[30px] px-3 text-[12.5px] font-medium text-gray-600 border border-gray-300 rounded-[6px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-gray-50 flex items-center gap-1"
              >

                <X size={12} />

                Close

              </button>

              <button
                type="button"
                onClick={
                  handleReasonModalSave
                }
                disabled={
                  !reasonDraft.trim()
                }
                className="h-[30px] px-3 text-[12.5px] font-medium text-white bg-[#F97316] rounded-[6px] shadow-[0_2px_4px_rgba(33,150,243,0.25)] hover:bg-[#EA580C] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center gap-1"
              >

                <Save size={12} />

                Save

              </button>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          TOAST
      ===================================================== */}

      {toast && (

        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-[13px] px-4 py-2.5 rounded-[6px] shadow-[0_4px_12px_rgba(0,0,0,0.25)]">

          {toast}

        </div>

      )}

    </div>
  );
};

export default SeparationTab;
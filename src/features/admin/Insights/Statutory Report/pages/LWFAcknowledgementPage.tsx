// import { useRef, useState } from "react";
// import type { ChangeEvent } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowLeft,
//   CalendarDays,
//   ChevronDown,
//   CloudUpload,
//   FileText,
//   Filter,
//   Clock3,
//   X,
// } from "lucide-react";

// export default function LWFAcknowledgementPage() {
//   const navigate = useNavigate();

//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const [paidAmount, setPaidAmount] = useState("");
//   const [modeOfPayment, setModeOfPayment] = useState("");
//   const [bank, setBank] = useState("");
//   const [referenceNo, setReferenceNo] = useState("");
//   const [paidDate, setPaidDate] = useState("");
//   const [tprnNo, setTprnNo] = useState("");
//   const [crnNo, setCrnNo] = useState("");

//   const [acknowledgementNumber, setAcknowledgementNumber] =
//     useState("");
//   const [ackPaidDate, setAckPaidDate] = useState("");

//   const [attachment, setAttachment] = useState<File | null>(null);
//   const [fileError, setFileError] = useState("");

//   const [month, setMonth] = useState("Sep/2026");
//   const [lwfGroup, setLwfGroup] = useState("");

//   const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];

//     if (!file) {
//       return;
//     }

//     const maxSize = 1 * 1024 * 1024;

//     if (file.size > maxSize) {
//       setFileError("Maximum file size is 1 MB");
//       setAttachment(null);

//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }

//       return;
//     }

//     setFileError("");
//     setAttachment(file);
//   };

//   const handleBrowse = () => {
//     fileInputRef.current?.click();
//   };

//   const removeAttachment = () => {
//     setAttachment(null);
//     setFileError("");

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const handleBack = () => {
//     navigate(-1);
//   };

//   return (
//     <div className="min-h-screen w-full bg-[#f4f7fb] text-[#252525] p-4">

//       {/* =====================================================
//           TOP REPORT NAVIGATION - SAMPLE UI
//       ===================================================== */}
//       <div className="w-full rounded-xl border border-[#dedede] bg-white shadow-sm">
//         <div className="flex min-h-[68px] items-center px-5">

//           {/* PF REPORT */}
//           <button
//             type="button"
//             className="relative mr-12 flex h-[68px] items-center text-[17px] font-medium text-[#333333]"
//           >
//             PF Report
//           </button>

//           {/* ESI REPORT */}
//           <button
//             type="button"
//             className="relative mr-12 flex h-[68px] items-center text-[17px] font-medium text-[#333333]"
//           >
//             ESI Report
//           </button>

//           {/* LWF REPORT - ACTIVE */}
//           <button
//             type="button"
//             className="relative mr-12 flex h-[68px] items-center text-[17px] font-semibold text-[#1598e5]"
//           >
//             LWF Report
//             <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1598e5]" />
//           </button>

//           {/* PT REPORT */}
//           <button
//             type="button"
//             className="relative flex h-[68px] items-center text-[17px] font-medium text-[#333333]"
//           >
//             PT Report
//           </button>

//           {/* RIGHT SIDE ICONS */}
//           <div className="ml-auto flex items-center gap-7">
//             <Filter
//               size={23}
//               strokeWidth={1.8}
//               className="text-[#91a0b5]"
//             />

//             <Clock3
//               size={23}
//               strokeWidth={1.8}
//               className="text-[#91a0b5]"
//             />
//           </div>
//         </div>
//       </div>

//       {/* =====================================================
//           LWF ACKNOWLEDGEMENT HEADER
//       ===================================================== */}
//       <div className="mt-3 w-full rounded-xl border border-[#dedede] bg-white shadow-sm">
//         <div className="flex min-h-[76px] flex-wrap items-center justify-between gap-3 px-5 py-3">

//           {/* PAGE TITLE */}
//           <div className="flex min-w-[220px] items-center">
//             <div className="border-b-[3px] border-[#1598e5] pb-[10px] pt-[4px]">
//               <h1 className="text-[18px] font-semibold text-[#1598e5] sm:text-[19px]">
//                 LWF Acknowledgement
//               </h1>
//             </div>
//           </div>

//           {/* HEADER CONTROLS */}
//           <div className="flex flex-wrap items-center justify-end gap-3">

//             {/* BACK */}
//             <button
//               type="button"
//               onClick={handleBack}
//               className="flex h-[48px] min-w-[108px] items-center justify-center gap-2 rounded-lg border border-[#d5d5d5] bg-white px-5 text-[16px] font-medium text-[#555555] shadow-sm transition hover:bg-[#f8f8f8]"
//             >
//               <ArrowLeft size={19} strokeWidth={1.8} />
//               <span>Back</span>
//             </button>

//             {/* MONTH */}
//             <div className="relative">
//               <select
//                 value={month}
//                 onChange={(e) => setMonth(e.target.value)}
//                 className="h-[48px] min-w-[190px] appearance-none rounded-lg border border-[#dfe3e9] bg-[#f1f3f8] px-4 pr-10 text-[15px] font-medium text-[#333333] outline-none focus:border-[#8b4a2f]"
//               >
//                 <option value="Sep/2026">Sep/2026</option>
//                 <option value="Aug/2026">Aug/2026</option>
//                 <option value="Jul/2026">Jul/2026</option>
//                 <option value="Jun/2026">Jun/2026</option>
//               </select>

//               <ChevronDown
//                 size={17}
//                 className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#777777]"
//               />
//             </div>

//             {/* LWF GROUP LABEL */}
//             <span className="whitespace-nowrap text-[15px] font-medium text-[#333333]">
//               LWF Group
//             </span>

//             {/* LWF GROUP DROPDOWN */}
//             <div className="relative">
//               <select
//                 value={lwfGroup}
//                 onChange={(e) => setLwfGroup(e.target.value)}
//                 className="h-[48px] min-w-[185px] appearance-none rounded-lg border border-[#dedede] bg-white px-4 pr-10 text-[15px] text-[#333333] outline-none focus:border-[#8b4a2f]"
//               >
//                 <option value="">Select</option>
//                 <option value="Group 1">Group 1</option>
//                 <option value="Group 2">Group 2</option>
//                 <option value="Group 3">Group 3</option>
//               </select>

//               <ChevronDown
//                 size={17}
//                 className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#777777]"
//               />
//             </div>

//             {/* EXCEL ICON */}
//             <button
//               type="button"
//               title="Export"
//               className="flex h-[48px] w-[42px] items-center justify-center rounded-md bg-white text-[#258b38] transition hover:bg-[#f5f5f5]"
//             >
//               <span className="flex h-[24px] w-[24px] items-center justify-center rounded-[3px] border-[2px] border-[#258b38] text-[11px] font-bold">
//                 X
//               </span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* =====================================================
//           MAIN CONTENT
//       ===================================================== */}
//       <div className="p-3 sm:p-4 lg:p-5">
//         <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

//           {/* =================================================
//               LEFT - PAYMENT DETAILS
//           ================================================= */}
//           <section className="rounded-xl border border-[#e2e5eb] bg-white shadow-sm">

//             <div className="border-b border-[#e8e9ed] px-4 py-3">
//               <h2 className="text-[16px] font-semibold text-[#34373c]">
//                 Payment Details
//               </h2>
//             </div>

//             <div className="space-y-4 p-4">

//               {/* PAID AMOUNT */}
//               <FormField label="Paid Amount">
//                 <input
//                   type="text"
//                   value={paidAmount}
//                   onChange={(e) => setPaidAmount(e.target.value)}
//                   className={inputClass}
//                 />
//               </FormField>

//               {/* MODE OF PAYMENT */}
//               <FormField label="Mode of Payment">
//                 <SelectField
//                   value={modeOfPayment}
//                   onChange={setModeOfPayment}
//                   options={[
//                     "Online",
//                     "Cheque",
//                     "DD",
//                     "NEFT",
//                     "RTGS",
//                   ]}
//                 />
//               </FormField>

//               {/* BANK */}
//               <FormField label="Bank">
//                 <input
//                   type="text"
//                   value={bank}
//                   onChange={(e) => setBank(e.target.value)}
//                   className={inputClass}
//                 />
//               </FormField>

//               {/* REFERENCE NUMBER */}
//               <FormField label="Reference No" required>
//                 <input
//                   type="text"
//                   value={referenceNo}
//                   onChange={(e) => setReferenceNo(e.target.value)}
//                   className={inputClass}
//                 />
//               </FormField>

//               {/* PAID DATE */}
//               <FormField label="Paid Date">
//                 <DateField
//                   value={paidDate}
//                   onChange={setPaidDate}
//                 />
//               </FormField>

//               {/* TPRN */}
//               <FormField label="TPRN No.">
//                 <input
//                   type="text"
//                   value={tprnNo}
//                   onChange={(e) => setTprnNo(e.target.value)}
//                   className={inputClass}
//                 />
//               </FormField>

//               {/* CRN */}
//               <FormField label="CRN No.">
//                 <input
//                   type="text"
//                   value={crnNo}
//                   onChange={(e) => setCrnNo(e.target.value)}
//                   className={inputClass}
//                 />
//               </FormField>

//             </div>
//           </section>

//           {/* =================================================
//               RIGHT - ACKNOWLEDGEMENT DETAILS
//           ================================================= */}
//           <section className="rounded-xl border border-[#e2e5eb] bg-white shadow-sm">

//             <div className="border-b border-[#e8e9ed] px-4 py-3">
//               <h2 className="text-[16px] font-semibold text-[#34373c]">
//                 Acknowledgement Details
//               </h2>
//             </div>

//             <div className="p-4">

//               {/* ACKNOWLEDGEMENT NUMBER */}
//               <FormField label="Acknowledgement Number">
//                 <input
//                   type="text"
//                   value={acknowledgementNumber}
//                   onChange={(e) =>
//                     setAcknowledgementNumber(e.target.value)
//                   }
//                   className={inputClass}
//                 />
//               </FormField>

//               {/* ACK PAID DATE */}
//               <div className="mt-5">
//                 <FormField label="Ack Paid Date">
//                   <DateField
//                     value={ackPaidDate}
//                     onChange={setAckPaidDate}
//                   />
//                 </FormField>
//               </div>

//               {/* SEPARATOR */}
//               <div className="my-5 border-t border-[#e7e8eb]" />

//               {/* ATTACHMENT */}
//               <div>
//                 <label className="mb-2 block text-[14px] font-medium text-[#41444a]">
//                   Attachment
//                 </label>

//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xlsx,.xls"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />

//                 {/* DROP AREA */}
//                 {!attachment ? (
//                   <button
//                     type="button"
//                     onClick={handleBrowse}
//                     className="flex min-h-[285px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#b9c0c8] bg-white px-4 text-center transition hover:border-[#8b4a2f] hover:bg-[#fffdfb]"
//                   >
//                     <CloudUpload
//                       size={28}
//                       strokeWidth={2}
//                       className="mb-2 text-[#aeb3ba]"
//                     />

//                     <p className="text-[15px] text-[#9b9da2]">
//                       Drag and drop
//                     </p>

//                     <p className="my-1 text-[14px] text-[#a3a5aa]">
//                       or
//                     </p>

//                     <span className="text-[15px] font-semibold text-[#2d78b8] underline">
//                       Browse
//                     </span>
//                   </button>
//                 ) : (
//                   <div className="flex min-h-[285px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#b9c0c8] bg-white px-4">

//                     <div className="flex items-center gap-3 rounded-md border border-[#e3e5e9] bg-[#f8f9fb] px-4 py-3">

//                       <FileText
//                         size={24}
//                         className="text-[#8b4a2f]"
//                       />

//                       <div className="max-w-[220px]">
//                         <p className="truncate text-[14px] font-medium text-[#34373c]">
//                           {attachment.name}
//                         </p>

//                         <p className="text-[12px] text-[#8b8d92]">
//                           {(attachment.size / 1024).toFixed(1)} KB
//                         </p>
//                       </div>

//                       <button
//                         type="button"
//                         onClick={removeAttachment}
//                         className="ml-2 flex h-7 w-7 items-center justify-center rounded-full hover:bg-[#eeeeee]"
//                       >
//                         <X size={16} />
//                       </button>
//                     </div>

//                     <button
//                       type="button"
//                       onClick={handleBrowse}
//                       className="mt-4 text-[14px] font-semibold text-[#2d78b8] underline"
//                     >
//                       Change file
//                     </button>
//                   </div>
//                 )}

//                 {/* ERROR */}
//                 {fileError && (
//                   <div className="mt-2 rounded-md border border-[#ead9a0] bg-[#fffbea] px-3 py-2 text-[13px] text-[#7a641d]">
//                     ⚠ {fileError}
//                   </div>
//                 )}

//                 {/* MAX SIZE */}
//                 {!fileError && (
//                   <div className="mt-2 flex items-center gap-2 rounded-md border border-[#eee4c7] bg-[#fffdf4] px-3 py-2 text-[13px] font-medium text-[#635c43]">
//                     <span className="text-[16px]">⚠</span>
//                     <span>Max.Size 1 MB</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// }


// /* ==========================================================
//    FORM FIELD
// ========================================================== */

// interface FormFieldProps {
//   label: string;
//   required?: boolean;
//   children: React.ReactNode;
// }

// function FormField({
//   label,
//   required = false,
//   children,
// }: FormFieldProps) {
//   return (
//     <div>
//       <label className="mb-2 block text-[14px] font-medium text-[#41444a]">
//         {label}
//         {required && (
//           <span className="ml-1 text-[#c33b3b]">*</span>
//         )}
//       </label>

//       {children}
//     </div>
//   );
// }


// /* ==========================================================
//    SELECT FIELD
// ========================================================== */

// interface SelectFieldProps {
//   value: string;
//   onChange: (value: string) => void;
//   options: string[];
// }

// function SelectField({
//   value,
//   onChange,
//   options,
// }: SelectFieldProps) {
//   return (
//     <div className="relative">
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className={inputClass + " appearance-none pr-10"}
//       >
//         <option value="">Select</option>

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
//         className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#666]"
//       />
//     </div>
//   );
// }


// /* ==========================================================
//    DATE FIELD
// ========================================================== */

// interface DateFieldProps {
//   value: string;
//   onChange: (value: string) => void;
// }

// function DateField({
//   value,
//   onChange,
// }: DateFieldProps) {
//   return (
//     <div className="relative">
//       <input
//         type="date"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className={inputClass + " pr-11"}
//       />

//       <CalendarDays
//         size={17}
//         className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#777]"
//       />
//     </div>
//   );
// }


// /* ==========================================================
//    COMMON INPUT STYLE
// ========================================================== */

// const inputClass =
//   "h-[46px] w-full rounded-sm border border-[#e2e5eb] bg-[#eef1f7] px-3 text-[14px] text-[#34373c] outline-none transition focus:border-[#8b4a2f] focus:bg-white";

import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  CloudUpload,
  FileText,
  Filter,
  Clock3,
  X,
} from "lucide-react";

export default function LWFAcknowledgementPage() {
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [paidAmount, setPaidAmount] = useState("");
  const [modeOfPayment, setModeOfPayment] = useState("");
  const [bank, setBank] = useState("");
  const [referenceNo, setReferenceNo] = useState("");
  const [paidDate, setPaidDate] = useState("");
  const [tprnNo, setTprnNo] = useState("");
  const [crnNo, setCrnNo] = useState("");

  const [acknowledgementNumber, setAcknowledgementNumber] =
    useState("");
  const [ackPaidDate, setAckPaidDate] = useState("");

  const [attachment, setAttachment] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");

  const [month, setMonth] = useState("Sep/2026");
  const [lwfGroup, setLwfGroup] = useState("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const maxSize = 1 * 1024 * 1024;

    if (file.size > maxSize) {
      setFileError("Maximum file size is 1 MB");
      setAttachment(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setFileError("");
    setAttachment(file);
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const removeAttachment = () => {
    setAttachment(null);
    setFileError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f7fb] text-[#252525] p-4">

      {/* =====================================================
          TOP REPORT NAVIGATION - SAMPLE UI
      ===================================================== */}
      <div className="w-full rounded-xl border border-[#dedede] bg-white shadow-sm">
        <div className="flex min-h-[68px] items-center px-5">

          {/* PF REPORT */}
          <button
            type="button"
            className="relative mr-12 flex h-[68px] items-center text-[17px] font-medium text-[#333333]"
          >
            PF Report
          </button>

          {/* ESI REPORT */}
          <button
            type="button"
            className="relative mr-12 flex h-[68px] items-center text-[17px] font-medium text-[#333333]"
          >
            ESI Report
          </button>

          {/* LWF REPORT - ACTIVE */}
          <button
            type="button"
            className="relative mr-12 flex h-[68px] items-center text-[17px] font-semibold text-[#1598e5]"
          >
            LWF Report
            <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1598e5]" />
          </button>

          {/* PT REPORT */}
          <button
            type="button"
            className="relative flex h-[68px] items-center text-[17px] font-medium text-[#333333]"
          >
            PT Report
          </button>

          {/* RIGHT SIDE ICONS */}
          <div className="ml-auto flex items-center gap-7">
            <Filter
              size={23}
              strokeWidth={1.8}
              className="text-[#91a0b5]"
            />

            <Clock3
              size={23}
              strokeWidth={1.8}
              className="text-[#91a0b5]"
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          LWF ACKNOWLEDGEMENT HEADER
      ===================================================== */}
      <div className="mt-3 w-full rounded-xl border border-[#dedede] bg-white shadow-sm">
        <div className="flex min-h-[76px] flex-wrap items-center justify-between gap-3 px-5 py-3">

          {/* PAGE TITLE */}
          <div className="flex min-w-[220px] items-center">
            <div className="border-b-[3px] border-[#1598e5] pb-[10px] pt-[4px]">
              <h1 className="text-[18px] font-semibold text-[#1598e5] sm:text-[19px]">
                LWF Acknowledgement
              </h1>
            </div>
          </div>

          {/* HEADER CONTROLS */}
          <div className="flex flex-wrap items-center justify-end gap-3">

            {/* BACK */}
            <button
              type="button"
              onClick={handleBack}
              className="flex h-[48px] min-w-[108px] items-center justify-center gap-2 rounded-lg border border-[#d5d5d5] bg-white px-5 text-[16px] font-medium text-[#555555] shadow-sm transition hover:bg-[#f8f8f8]"
            >
              <ArrowLeft size={19} strokeWidth={1.8} />
              <span>Back</span>
            </button>

            {/* MONTH */}
            <div className="relative">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="h-[48px] min-w-[190px] appearance-none rounded-lg border border-[#dfe3e9] bg-[#f1f3f8] px-4 pr-10 text-[15px] font-medium text-[#333333] outline-none focus:border-[#8b4a2f]"
              >
                <option value="Sep/2026">Sep/2026</option>
                <option value="Aug/2026">Aug/2026</option>
                <option value="Jul/2026">Jul/2026</option>
                <option value="Jun/2026">Jun/2026</option>
              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#777777]"
              />
            </div>

            {/* LWF GROUP LABEL */}
            <span className="whitespace-nowrap text-[15px] font-medium text-[#333333]">
              LWF Group
            </span>

            {/* LWF GROUP DROPDOWN */}
            <div className="relative">
              <select
                value={lwfGroup}
                onChange={(e) => setLwfGroup(e.target.value)}
                className="h-[48px] min-w-[185px] appearance-none rounded-lg border border-[#dedede] bg-white px-4 pr-10 text-[15px] text-[#333333] outline-none focus:border-[#8b4a2f]"
              >
                <option value="">Select</option>
                <option value="Group 1">Group 1</option>
                <option value="Group 2">Group 2</option>
                <option value="Group 3">Group 3</option>
              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#777777]"
              />
            </div>

            {/* EXCEL ICON */}
            <button
              type="button"
              title="Export"
              className="flex h-[48px] w-[42px] items-center justify-center rounded-md bg-white text-[#258b38] transition hover:bg-[#f5f5f5]"
            >
              <span className="flex h-[24px] w-[24px] items-center justify-center rounded-[3px] border-[2px] border-[#258b38] text-[11px] font-bold">
                X
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <div className="p-3 sm:p-4 lg:p-5">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

          {/* =================================================
              LEFT - PAYMENT DETAILS
          ================================================= */}
          <section className="rounded-xl border border-[#e2e5eb] bg-white shadow-sm">

            <div className="border-b border-[#e8e9ed] px-4 py-3">
              <h2 className="text-[16px] font-semibold text-[#34373c]">
                Payment Details
              </h2>
            </div>

            <div className="space-y-4 p-4">

              {/* PAID AMOUNT */}
              <FormField label="Paid Amount">
                <input
                  type="text"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  className={inputClass}
                />
              </FormField>

              {/* MODE OF PAYMENT */}
              <FormField label="Mode of Payment">
                <SelectField
                  value={modeOfPayment}
                  onChange={setModeOfPayment}
                  options={[
                    "Online",
                    "Cheque",
                    "DD",
                    "NEFT",
                    "RTGS",
                  ]}
                />
              </FormField>

              {/* BANK */}
              <FormField label="Bank">
                <input
                  type="text"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className={inputClass}
                />
              </FormField>

              {/* REFERENCE NUMBER */}
              <FormField label="Reference No" required>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  className={inputClass}
                />
              </FormField>

              {/* PAID DATE */}
              <FormField label="Paid Date">
                <DateField
                  value={paidDate}
                  onChange={setPaidDate}
                />
              </FormField>

              {/* TPRN */}
              <FormField label="TPRN No.">
                <input
                  type="text"
                  value={tprnNo}
                  onChange={(e) => setTprnNo(e.target.value)}
                  className={inputClass}
                />
              </FormField>

              {/* CRN */}
              <FormField label="CRN No.">
                <input
                  type="text"
                  value={crnNo}
                  onChange={(e) => setCrnNo(e.target.value)}
                  className={inputClass}
                />
              </FormField>

            </div>
          </section>

          {/* =================================================
              RIGHT - ACKNOWLEDGEMENT DETAILS
          ================================================= */}
          <section className="rounded-xl border border-[#e2e5eb] bg-white shadow-sm">

            <div className="border-b border-[#e8e9ed] px-4 py-3">
              <h2 className="text-[16px] font-semibold text-[#34373c]">
                Acknowledgement Details
              </h2>
            </div>

            <div className="p-4">

              {/* ACKNOWLEDGEMENT NUMBER */}
              <FormField label="Acknowledgement Number">
                <input
                  type="text"
                  value={acknowledgementNumber}
                  onChange={(e) =>
                    setAcknowledgementNumber(e.target.value)
                  }
                  className={inputClass}
                />
              </FormField>

              {/* ACK PAID DATE */}
              <div className="mt-5">
                <FormField label="Ack Paid Date">
                  <DateField
                    value={ackPaidDate}
                    onChange={setAckPaidDate}
                  />
                </FormField>
              </div>

              {/* SEPARATOR */}
              <div className="my-5 border-t border-[#e7e8eb]" />

              {/* ATTACHMENT */}
              <div>
                <label className="mb-2 block text-[14px] font-medium text-[#41444a]">
                  Attachment
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {/* DROP AREA */}
                {!attachment ? (
                  <button
                    type="button"
                    onClick={handleBrowse}
                    className="flex min-h-[285px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#b9c0c8] bg-white px-4 text-center transition hover:border-[#8b4a2f] hover:bg-[#fffdfb]"
                  >
                    <CloudUpload
                      size={28}
                      strokeWidth={2}
                      className="mb-2 text-[#aeb3ba]"
                    />

                    <p className="text-[15px] text-[#9b9da2]">
                      Drag and drop
                    </p>

                    <p className="my-1 text-[14px] text-[#a3a5aa]">
                      or
                    </p>

                    <span className="text-[15px] font-semibold text-[#2d78b8] underline">
                      Browse
                    </span>
                  </button>
                ) : (
                  <div className="flex min-h-[285px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#b9c0c8] bg-white px-4">

                    <div className="flex items-center gap-3 rounded-md border border-[#e3e5e9] bg-[#f8f9fb] px-4 py-3">

                      <FileText
                        size={24}
                        className="text-[#8b4a2f]"
                      />

                      <div className="max-w-[220px]">
                        <p className="truncate text-[14px] font-medium text-[#34373c]">
                          {attachment.name}
                        </p>

                        <p className="text-[12px] text-[#8b8d92]">
                          {(attachment.size / 1024).toFixed(1)} KB
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={removeAttachment}
                        className="ml-2 flex h-7 w-7 items-center justify-center rounded-full hover:bg-[#eeeeee]"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleBrowse}
                      className="mt-4 text-[14px] font-semibold text-[#2d78b8] underline"
                    >
                      Change file
                    </button>
                  </div>
                )}

                {/* ERROR */}
                {fileError && (
                  <div className="mt-2 rounded-md border border-[#ead9a0] bg-[#fffbea] px-3 py-2 text-[13px] text-[#7a641d]">
                    ⚠ {fileError}
                  </div>
                )}

                {/* MAX SIZE */}
                {!fileError && (
                  <div className="mt-2 flex items-center gap-2 rounded-md border border-[#eee4c7] bg-[#fffdf4] px-3 py-2 text-[13px] font-medium text-[#635c43]">
                    <span className="text-[16px]">⚠</span>
                    <span>Max.Size 1 MB</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}


/* ==========================================================
   FORM FIELD
========================================================== */

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({
  label,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-[14px] font-medium text-[#41444a]">
        {label}
        {required && (
          <span className="ml-1 text-[#c33b3b]">*</span>
        )}
      </label>

      {children}
    </div>
  );
}


/* ==========================================================
   SELECT FIELD
========================================================== */

interface SelectFieldProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

function SelectField({
  value,
  onChange,
  options,
}: SelectFieldProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass + " appearance-none pr-10"}
      >
        <option value="">Select</option>

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
        size={16}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#666]"
      />
    </div>
  );
}


/* ==========================================================
   DATE FIELD
========================================================== */

interface DateFieldProps {
  value: string;
  onChange: (value: string) => void;
}

function DateField({
  value,
  onChange,
}: DateFieldProps) {
  return (
    <div className="relative">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass + " pr-11"}
      />

      <CalendarDays
        size={17}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#777]"
      />
    </div>
  );
}


/* ==========================================================
   COMMON INPUT STYLE
========================================================== */

const inputClass =
  "h-[46px] w-full rounded-sm border border-[#e2e5eb] bg-[#eef1f7] px-3 text-[14px] text-[#34373c] outline-none transition focus:border-[#8b4a2f] focus:bg-white";
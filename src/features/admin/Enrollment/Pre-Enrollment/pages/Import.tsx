// import { BadgeCheck, UploadCloud } from "lucide-react";
// import { useRef, useState } from "react";

// export default function Import() {
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isDragging, setIsDragging] = useState(false);

//   const openFilePicker = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (
//     event: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     const file = event.target.files?.[0];

//     if (file) {
//       setSelectedFile(file);
//     }
//   };

//   const handleDragOver = (
//     event: React.DragEvent<HTMLDivElement>,
//   ) => {
//     event.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (
//     event: React.DragEvent<HTMLDivElement>,
//   ) => {
//     event.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = (
//     event: React.DragEvent<HTMLDivElement>,
//   ) => {
//     event.preventDefault();
//     setIsDragging(false);

//     const file = event.dataTransfer.files?.[0];

//     if (file) {
//       setSelectedFile(file);
//     }
//   };

//   const handleUploadFile = () => {
//     openFilePicker();
//   };

//   const handleTemplate = () => {
//     console.log("Template clicked");
//   };

//   return (
//     <div className="w-full min-w-0 bg-slate-50">

//       {/* Hidden File Input */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         className="hidden"
//         accept=".xlsx,.xls,.csv"
//         onChange={handleFileChange}
//       />

//       {/* Page Heading */}
//       <div className="mb-2 flex min-h-8 items-center justify-center border border-slate-200 bg-slate-200 px-3 py-2">
//         <h1 className="text-center text-xs font-semibold text-slate-700 sm:text-[13px]">
//           Add Candidate
//         </h1>
//       </div>

//       {/* Main Content */}
//       <div className="w-full rounded-md border border-slate-200 bg-white p-3 sm:p-5">
//         <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr] lg:gap-8">

//           {/* ==================================================
//               UPLOAD SECTION
//           ================================================== */}

//           <div className="flex min-w-0 flex-col">

//             {/* Upload / Drag & Drop */}
//             <div
//               onClick={openFilePicker}
//               onDragOver={handleDragOver}
//               onDragLeave={handleDragLeave}
//               onDrop={handleDrop}
//               className={`
//                 flex
//                 min-h-[145px]
//                 w-full
//                 cursor-pointer
//                 flex-col
//                 items-center
//                 justify-center
//                 rounded-md
//                 border-2
//                 border-dashed
//                 px-4
//                 transition
//                 ${
//                   isDragging
//                     ? "border-orange-500 bg-orange-50"
//                     : "border-orange-300 bg-white hover:bg-orange-50"
//                 }
//               `}
//             >
//               <UploadCloud
//                 size={20}
//                 strokeWidth={2}
//                 className="mb-2 text-slate-400"
//               />

//               <p className="text-center text-xs font-medium text-slate-400">
//                 Drag and drop
//               </p>

//               <p className="py-1 text-[11px] text-slate-400">
//                 - or -
//               </p>

//               <button
//                 type="button"
//                 onClick={(event) => {
//                   event.stopPropagation();
//                   openFilePicker();
//                 }}
//                 className="
//                   text-xs
//                   font-semibold
//                   text-orange-500
//                   transition
//                   hover:text-orange-600
//                 "
//               >
//                 Browse
//               </button>

//               {/* Selected File */}
//               {selectedFile && (
//                 <p className="mt-2 max-w-full truncate px-4 text-center text-[10px] font-semibold text-emerald-500">
//                   Selected: {selectedFile.name}
//                 </p>
//               )}
//             </div>

//             {/* ==================================================
//                 ACTION BUTTONS
//             ================================================== */}

//             <div className="flex flex-col gap-2 pt-3 sm:flex-row sm:items-center sm:justify-end">

//               {/* Template */}
//               <button
//                 type="button"
//                 onClick={handleTemplate}
//                 className="
//                   w-full
//                   rounded-md
//                   bg-slate-500
//                   px-4
//                   py-2
//                   text-xs
//                   font-semibold
//                   text-white
//                   transition
//                   hover:bg-slate-600
//                   sm:w-auto
//                 "
//               >
//                 Template
//               </button>

//               {/* Upload File */}
//               <button
//                 type="button"
//                 onClick={handleUploadFile}
//                 className="
//                   w-full
//                   rounded-md
//                   bg-orange-500
//                   px-4
//                   py-2
//                   text-xs
//                   font-semibold
//                   text-white
//                   transition
//                   hover:bg-orange-600
//                   sm:w-auto
//                 "
//               >
//                 Upload File
//               </button>

//             </div>
//           </div>

//           {/* ==================================================
//               FILE REQUIREMENT
//           ================================================== */}

//           <div className="min-w-0 overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">

//             {/* Header */}
//             <div className="bg-slate-200 px-4 py-3">
//               <h2 className="text-sm font-semibold text-slate-700">
//                 File Requirement
//               </h2>
//             </div>

//             {/* Requirement */}
//             <div className="flex min-h-[102px] items-center px-4 py-5">
//               <div className="flex items-start gap-3">

//                 <BadgeCheck
//                   size={19}
//                   strokeWidth={2}
//                   className="mt-0.5 shrink-0 text-emerald-400"
//                 />

//                 <span className="text-xs font-semibold leading-5 text-emerald-400">
//                   The Selected File Should be Valid
//                 </span>

//               </div>
//             </div>

//             {/* Bottom Space */}
//             <div className="h-9 border-t border-slate-100" />

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { BadgeCheck, UploadCloud } from "lucide-react";
// import { useRef, useState } from "react";

// export default function Import() {
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isDragging, setIsDragging] = useState(false);

//   const openFilePicker = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (
//     event: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     const file = event.target.files?.[0];

//     if (file) {
//       setSelectedFile(file);
//     }
//   };

//   const handleDragOver = (
//     event: React.DragEvent<HTMLDivElement>,
//   ) => {
//     event.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (
//     event: React.DragEvent<HTMLDivElement>,
//   ) => {
//     event.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = (
//     event: React.DragEvent<HTMLDivElement>,
//   ) => {
//     event.preventDefault();
//     setIsDragging(false);

//     const file = event.dataTransfer.files?.[0];

//     if (file) {
//       setSelectedFile(file);
//     }
//   };

//   const handleUploadFile = () => {
//     openFilePicker();
//   };

//   const handleTemplate = () => {
//     console.log("Template clicked");
//   };

//   return (
//     <div className="w-full min-w-0 bg-slate-50">

//       {/* Hidden File Input */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         className="hidden"
//         accept=".xlsx,.xls,.csv"
//         onChange={handleFileChange}
//       />

//       {/* ==================================================
//           PAGE CONTENT
//       ================================================== */}
//       <div
//         className="
//           mx-auto
//           w-full
//           max-w-[1180px]
//           px-4
//           pb-8
//           pt-3
//           sm:px-5
//           md:px-6
//         "
//       >

//         {/* ==================================================
//             PAGE HEADING
//         ================================================== */}
//         <div
//           className="
//             mb-3
//             flex
//             min-h-[40px]
//             items-center
//             justify-center
//             rounded-sm
//             border
//             border-slate-200
//             bg-slate-200
//             px-3
//             py-2
//           "
//         >
//           <h1
//             className="
//               text-center
//               text-[13px]
//               font-semibold
//               text-slate-700
//             "
//           >
//             Add Candidate
//           </h1>
//         </div>

//         {/* ==================================================
//             MAIN CONTENT CARD
//         ================================================== */}
//         <div
//           className="
//             w-full
//             rounded-md
//             border
//             border-slate-200
//             bg-white
//             p-4
//             sm:p-5
//           "
//         >

//           <div
//             className="
//               grid
//               w-full
//               grid-cols-1
//               gap-5
//               lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]
//               lg:gap-7
//             "
//           >

//             {/* ==================================================
//                 UPLOAD SECTION
//             ================================================== */}
//             <div className="flex min-w-0 flex-col">

//               {/* Upload / Drag & Drop */}
//               <div
//                 onClick={openFilePicker}
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//                 onDrop={handleDrop}
//                 className={`
//                   flex
//                   min-h-[145px]
//                   w-full
//                   cursor-pointer
//                   flex-col
//                   items-center
//                   justify-center
//                   rounded-md
//                   border-2
//                   border-dashed
//                   px-4
//                   transition
//                   ${
//                     isDragging
//                       ? "border-orange-500 bg-orange-50"
//                       : "border-orange-300 bg-white hover:bg-orange-50"
//                   }
//                 `}
//               >
//                 <UploadCloud
//                   size={20}
//                   strokeWidth={2}
//                   className="mb-2 text-slate-400"
//                 />

//                 <p
//                   className="
//                     text-center
//                     text-xs
//                     font-medium
//                     text-slate-400
//                   "
//                 >
//                   Drag and drop
//                 </p>

//                 <p
//                   className="
//                     py-1
//                     text-[11px]
//                     text-slate-400
//                   "
//                 >
//                   - or -
//                 </p>

//                 <button
//                   type="button"
//                   onClick={(event) => {
//                     event.stopPropagation();
//                     openFilePicker();
//                   }}
//                   className="
//                     text-xs
//                     font-semibold
//                     text-orange-500
//                     transition
//                     hover:text-orange-600
//                   "
//                 >
//                   Browse
//                 </button>

//                 {/* Selected File */}
//                 {selectedFile && (
//                   <p
//                     className="
//                       mt-2
//                       max-w-full
//                       truncate
//                       px-4
//                       text-center
//                       text-[10px]
//                       font-semibold
//                       text-emerald-500
//                     "
//                   >
//                     Selected: {selectedFile.name}
//                   </p>
//                 )}
//               </div>

//               {/* ==================================================
//                   ACTION BUTTONS
//               ================================================== */}
//               <div
//                 className="
//                   flex
//                   flex-col
//                   gap-2
//                   pt-3
//                   sm:flex-row
//                   sm:items-center
//                   sm:justify-end
//                 "
//               >
//                 {/* Template */}
//                 <button
//                   type="button"
//                   onClick={handleTemplate}
//                   className="
//                     w-full
//                     rounded-md
//                     bg-slate-500
//                     px-4
//                     py-2
//                     text-xs
//                     font-semibold
//                     text-white
//                     transition
//                     hover:bg-slate-600
//                     sm:w-auto
//                   "
//                 >
//                   Template
//                 </button>

//                 {/* Upload File */}
//                 <button
//                   type="button"
//                   onClick={handleUploadFile}
//                   className="
//                     w-full
//                     rounded-md
//                     bg-orange-500
//                     px-4
//                     py-2
//                     text-xs
//                     font-semibold
//                     text-white
//                     transition
//                     hover:bg-orange-600
//                     sm:w-auto
//                   "
//                 >
//                   Upload File
//                 </button>
//               </div>
//             </div>

//             {/* ==================================================
//                 FILE REQUIREMENT
//             ================================================== */}
//             <div
//               className="
//                 min-w-0
//                 overflow-hidden
//                 rounded-md
//                 border
//                 border-slate-200
//                 bg-white
//                 shadow-[0_4px_12px_rgba(15,23,42,0.06)]
//               "
//             >

//               {/* Header */}
//               <div
//                 className="
//                   bg-slate-200
//                   px-4
//                   py-3
//                 "
//               >
//                 <h2
//                   className="
//                     text-sm
//                     font-semibold
//                     text-slate-700
//                   "
//                 >
//                   File Requirement
//                 </h2>
//               </div>

//               {/* Requirement */}
//               <div
//                 className="
//                   flex
//                   min-h-[102px]
//                   items-center
//                   px-4
//                   py-5
//                 "
//               >
//                 <div className="flex items-start gap-3">

//                   <BadgeCheck
//                     size={19}
//                     strokeWidth={2}
//                     className="
//                       mt-0.5
//                       shrink-0
//                       text-emerald-400
//                     "
//                   />

//                   <span
//                     className="
//                       text-xs
//                       font-semibold
//                       leading-5
//                       text-emerald-400
//                     "
//                   >
//                     The Selected File Should be Valid
//                   </span>

//                 </div>
//               </div>

//               {/* Bottom Space */}
//               <div
//                 className="
//                   h-9
//                   border-t
//                   border-slate-100
//                 "
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



///-------------------//


// import {
//   BadgeCheck,
//   Download,
//   Upload,
//   UploadCloud,
// } from "lucide-react";
// import { useRef, useState } from "react";

// export default function Import() {
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isDragging, setIsDragging] = useState(false);

//   const openFilePicker = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (
//     event: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     const file = event.target.files?.[0];

//     if (file) {
//       setSelectedFile(file);
//     }
//   };

//   const handleDragOver = (
//     event: React.DragEvent<HTMLDivElement>,
//   ) => {
//     event.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (
//     event: React.DragEvent<HTMLDivElement>,
//   ) => {
//     event.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = (
//     event: React.DragEvent<HTMLDivElement>,
//   ) => {
//     event.preventDefault();
//     setIsDragging(false);

//     const file = event.dataTransfer.files?.[0];

//     if (file) {
//       setSelectedFile(file);
//     }
//   };

//   const handleUploadFile = () => {
//     openFilePicker();
//   };

//   const handleTemplate = () => {
//     console.log("Template clicked");
//   };

//   return (
//     <div className="w-full min-w-0 bg-slate-50">
//       {/* Hidden File Input */}
//       <input
//         ref={fileInputRef}
//         type="file"
//         className="hidden"
//         accept=".xlsx,.xls,.csv"
//         onChange={handleFileChange}
//       />

//       {/* ==================================================
//           MAIN PAGE CONTAINER
//       ================================================== */}
//       <div
//         className="
//           mx-auto
//           w-full
//           max-w-[1400px]
//           px-4
//           pb-6
//           pt-3
//           sm:px-6
//           sm:pb-8
//           sm:pt-4
//           lg:px-8
//           lg:pt-5
//         "
//       >
//         {/* ==================================================
//             MAIN CARD
//         ================================================== */}
//         <div
//           className="
//             overflow-hidden
//             rounded-xl
//             border
//             border-slate-200
//             bg-white
//             shadow-[0_4px_18px_rgba(15,23,42,0.06)]
//           "
//         >
//           {/* ==================================================
//               PAGE HEADER
//           ================================================== */}
//           <div
//             className="
//               border-b
//               border-slate-200
//               px-5
//               py-4
//               sm:px-6
//               sm:py-5
//               lg:px-8
//             "
//           >
//             <h1
//               className="
//                 text-xl
//                 font-semibold
//                 tracking-tight
//                 text-slate-900
//                 sm:text-2xl
//               "
//             >
//               Add Candidate
//             </h1>

//             <p
//               className="
//                 mt-1
//                 text-sm
//                 text-slate-500
//               "
//             >
//               Import candidate information using the approved template.
//             </p>
//           </div>

//           {/* ==================================================
//               CONTENT
//           ================================================== */}
//           <div
//             className="
//               grid
//               grid-cols-1
//               gap-5
//               p-5
//               sm:p-6
//               lg:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)]
//               lg:gap-6
//               lg:p-7
//             "
//           >
//             {/* ==================================================
//                 UPLOAD CARD
//             ================================================== */}
//             <section
//               className="
//                 min-w-0
//                 rounded-xl
//                 border
//                 border-slate-200
//                 bg-white
//                 p-5
//                 shadow-[0_3px_12px_rgba(15,23,42,0.04)]
//                 sm:p-6
//               "
//             >
//               {/* Section Heading */}
//               <div className="mb-4">
//                 <h2
//                   className="
//                     text-base
//                     font-semibold
//                     text-slate-900
//                   "
//                 >
//                   Upload Candidate File
//                 </h2>

//                 <p
//                   className="
//                     mt-1
//                     text-xs
//                     text-slate-500
//                   "
//                 >
//                   Upload the candidate details file to continue.
//                 </p>
//               </div>

//               {/* ==================================================
//                   DROP ZONE
//               ================================================== */}
//               <div
//                 onClick={openFilePicker}
//                 onDragOver={handleDragOver}
//                 onDragLeave={handleDragLeave}
//                 onDrop={handleDrop}
//                 className={`
//                   flex
//                   min-h-[250px]
//                   w-full
//                   cursor-pointer
//                   flex-col
//                   items-center
//                   justify-center
//                   rounded-lg
//                   border-2
//                   border-dashed
//                   px-4
//                   py-7
//                   text-center
//                   transition-colors
//                   ${
//                     isDragging
//                       ? "border-orange-500 bg-orange-50"
//                       : "border-orange-300 bg-orange-50/20 hover:border-orange-400 hover:bg-orange-50/40"
//                   }
//                 `}
//               >
//                 {/* Upload Icon */}
//                 <div
//                   className="
//                     mb-4
//                     flex
//                     h-14
//                     w-14
//                     items-center
//                     justify-center
//                     rounded-full
//                     bg-slate-100
//                   "
//                 >
//                   <UploadCloud
//                     size={29}
//                     strokeWidth={1.8}
//                     className="text-slate-500"
//                   />
//                 </div>

//                 {/* Title */}
//                 <p
//                   className="
//                     text-sm
//                     font-semibold
//                     text-slate-900
//                   "
//                 >
//                   Upload Candidate File
//                 </p>

//                 {/* Description */}
//                 <p
//                   className="
//                     mt-2
//                     text-sm
//                     text-slate-500
//                   "
//                 >
//                   Drag & drop your file here
//                 </p>

//                 <p
//                   className="
//                     my-2
//                     text-xs
//                     text-slate-400
//                   "
//                 >
//                   — or —
//                 </p>

//                 {/* Browse */}
//                 <button
//                   type="button"
//                   onClick={(event) => {
//                     event.stopPropagation();
//                     openFilePicker();
//                   }}
//                   className="
//                     rounded-lg
//                     border
//                     border-orange-500
//                     bg-white
//                     px-5
//                     py-2
//                     text-sm
//                     font-semibold
//                     text-orange-500
//                     transition
//                     hover:bg-orange-50
//                   "
//                 >
//                   Browse
//                 </button>

//                 {/* Selected File */}
//                 {selectedFile && (
//                   <p
//                     className="
//                       mt-4
//                       max-w-full
//                       truncate
//                       px-4
//                       text-xs
//                       font-medium
//                       text-emerald-600
//                     "
//                   >
//                     Selected: {selectedFile.name}
//                   </p>
//                 )}
//               </div>

//               {/* ==================================================
//                   ACTION BUTTONS
//               ================================================== */}
//               <div
//                 className="
//                   mt-5
//                   flex
//                   flex-col-reverse
//                   gap-3
//                   sm:flex-row
//                   sm:justify-end
//                 "
//               >
//                 {/* Download Template */}
//                 <button
//                   type="button"
//                   onClick={handleTemplate}
//                   className="
//                     inline-flex
//                     w-full
//                     items-center
//                     justify-center
//                     gap-2
//                     rounded-lg
//                     border
//                     border-slate-200
//                     bg-white
//                     px-5
//                     py-2.5
//                     text-sm
//                     font-medium
//                     text-slate-600
//                     transition
//                     hover:bg-slate-50
//                     sm:w-auto
//                   "
//                 >
//                   <Download
//                     size={16}
//                     strokeWidth={2}
//                   />

//                   Download Template
//                 </button>

//                 {/* Upload File */}
//                 <button
//                   type="button"
//                   onClick={handleUploadFile}
//                   className="
//                     inline-flex
//                     w-full
//                     items-center
//                     justify-center
//                     gap-2
//                     rounded-lg
//                     bg-orange-500
//                     px-5
//                     py-2.5
//                     text-sm
//                     font-semibold
//                     text-white
//                     shadow-sm
//                     transition
//                     hover:bg-orange-600
//                     sm:w-auto
//                   "
//                 >
//                   <Upload
//                     size={16}
//                     strokeWidth={2}
//                   />

//                   Upload File
//                 </button>
//               </div>
//             </section>

//             {/* ==================================================
//                 FILE REQUIREMENTS
//             ================================================== */}
//             <section
//               className="
//                 min-w-0
//                 rounded-xl
//                 border
//                 border-slate-200
//                 bg-white
//                 p-5
//                 shadow-[0_3px_12px_rgba(15,23,42,0.04)]
//                 sm:p-6
//               "
//             >
//               {/* Heading */}
//               <h2
//                 className="
//                   text-base
//                   font-semibold
//                   text-slate-900
//                 "
//               >
//                 File Requirements
//               </h2>

//               {/* Divider */}
//               <div
//                 className="
//                   mt-5
//                   border-t
//                   border-slate-100
//                 "
//               />

//               {/* ==================================================
//                   REQUIREMENT 1
//               ================================================== */}
//               <div
//                 className="
//                   flex
//                   gap-4
//                   border-b
//                   border-slate-100
//                   py-5
//                 "
//               >
//                 <div
//                   className="
//                     flex
//                     h-10
//                     w-10
//                     shrink-0
//                     items-center
//                     justify-center
//                     rounded-full
//                     bg-emerald-50
//                   "
//                 >
//                   <BadgeCheck
//                     size={20}
//                     strokeWidth={2}
//                     className="text-emerald-500"
//                   />
//                 </div>

//                 <div className="min-w-0">
//                   <p
//                     className="
//                       text-sm
//                       font-semibold
//                       text-slate-800
//                     "
//                   >
//                     Supported formats
//                   </p>

//                   <p
//                     className="
//                       mt-1
//                       text-sm
//                       text-slate-500
//                     "
//                   >
//                     XLSX, XLS, CSV
//                   </p>
//                 </div>
//               </div>

//               {/* ==================================================
//                   REQUIREMENT 2
//               ================================================== */}
//               <div
//                 className="
//                   flex
//                   gap-4
//                   border-b
//                   border-slate-100
//                   py-5
//                 "
//               >
//                 <div
//                   className="
//                     flex
//                     h-10
//                     w-10
//                     shrink-0
//                     items-center
//                     justify-center
//                     rounded-full
//                     bg-emerald-50
//                   "
//                 >
//                   <BadgeCheck
//                     size={20}
//                     strokeWidth={2}
//                     className="text-emerald-500"
//                   />
//                 </div>

//                 <div className="min-w-0">
//                   <p
//                     className="
//                       text-sm
//                       font-semibold
//                       text-slate-800
//                     "
//                   >
//                     Use the approved template
//                   </p>

//                   <p
//                     className="
//                       mt-1
//                       text-sm
//                       leading-5
//                       text-slate-500
//                     "
//                   >
//                     Download and use our template
//                     for best results.
//                   </p>
//                 </div>
//               </div>

//               {/* ==================================================
//                   REQUIREMENT 3
//               ================================================== */}
//               <div
//                 className="
//                   flex
//                   gap-4
//                   py-5
//                 "
//               >
//                 <div
//                   className="
//                     flex
//                     h-10
//                     w-10
//                     shrink-0
//                     items-center
//                     justify-center
//                     rounded-full
//                     bg-emerald-50
//                   "
//                 >
//                   <BadgeCheck
//                     size={20}
//                     strokeWidth={2}
//                     className="text-emerald-500"
//                   />
//                 </div>

//                 <div className="min-w-0">
//                   <p
//                     className="
//                       text-sm
//                       font-semibold
//                       text-slate-800
//                     "
//                   >
//                     Required fields must exist
//                   </p>

//                   <p
//                     className="
//                       mt-1
//                       text-sm
//                       leading-5
//                       text-slate-500
//                     "
//                   >
//                     All mandatory columns should be
//                     present.
//                   </p>
//                 </div>
//               </div>
//             </section>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



//---------------//

import {
  BadgeCheck,
  Download,
  Upload,
  UploadCloud,
} from "lucide-react";
import { useRef, useState } from "react";

export default function Import() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (
    event: React.DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadFile = () => {
    openFilePicker();
  };

  const handleTemplate = () => {
    console.log("Template clicked");
  };

  return (
    <div
      className="
        w-full
        min-w-0
        overflow-x-hidden
        bg-slate-50
      "
    >
      {/* ==================================================
          HIDDEN FILE INPUT
      ================================================== */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileChange}
      />

      {/* ==================================================
          MAIN PAGE CONTAINER
      ================================================== */}
      <div
        className="
          mx-auto
          w-full
          max-w-[1400px]
          px-4
          pb-5
          pt-0
          sm:px-6
          sm:pb-6
          lg:px-8
        "
      >
        {/* ==================================================
            MAIN CARD
        ================================================== */}
        <div
          className="
            overflow-hidden
            rounded-xl
            border
            border-slate-200
            bg-white
            shadow-[0_4px_18px_rgba(15,23,42,0.06)]
          "
        >
          {/* ==================================================
              PAGE HEADER
          ================================================== */}
          <div
            className="
              border-b
              border-slate-200
              px-5
              py-4
              sm:px-6
              sm:py-5
              lg:px-7
            "
          >
            <h1
              className="
                text-xl
                font-semibold
                tracking-tight
                text-slate-900
                sm:text-2xl
              "
            >
              Add Candidate
            </h1>

            <p
              className="
                mt-1
                text-sm
                text-slate-500
              "
            >
              Import candidate information using the approved template.
            </p>
          </div>

          {/* ==================================================
              CONTENT
          ================================================== */}
          <div
            className="
              grid
              min-w-0
              grid-cols-1
              gap-5
              p-5
              sm:p-6
              lg:grid-cols-[minmax(0,1.8fr)_minmax(300px,1fr)]
              lg:gap-6
              lg:p-7
            "
          >
            {/* ==================================================
                UPLOAD CARD
            ================================================== */}
            <section
              className="
                min-w-0
                rounded-xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-[0_3px_12px_rgba(15,23,42,0.04)]
                sm:p-6
              "
            >
              {/* Section Header */}
              <div className="mb-4">
                <h2
                  className="
                    text-base
                    font-semibold
                    text-slate-900
                  "
                >
                  Upload Candidate File
                </h2>

                <p
                  className="
                    mt-1
                    text-xs
                    text-slate-500
                  "
                >
                  Upload the candidate details file to continue.
                </p>
              </div>

              {/* ==================================================
                  DRAG & DROP AREA
              ================================================== */}
              <div
                onClick={openFilePicker}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  flex
                  min-h-[220px]
                  w-full
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-lg
                  border-2
                  border-dashed
                  px-4
                  py-6
                  text-center
                  transition-colors
                  ${
                    isDragging
                      ? "border-orange-500 bg-orange-50"
                      : "border-orange-300 bg-orange-50/20 hover:border-orange-400 hover:bg-orange-50/40"
                  }
                `}
              >
                {/* Upload Icon */}
                <div
                  className="
                    mb-3
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-slate-100
                  "
                >
                  <UploadCloud
                    size={26}
                    strokeWidth={1.8}
                    className="text-slate-500"
                  />
                </div>

                {/* Title */}
                <p
                  className="
                    text-sm
                    font-semibold
                    text-slate-900
                  "
                >
                  Upload Candidate File
                </p>

                {/* Description */}
                <p
                  className="
                    mt-1.5
                    text-sm
                    text-slate-500
                  "
                >
                  Drag & drop your file here
                </p>

                <p
                  className="
                    my-1.5
                    text-xs
                    text-slate-400
                  "
                >
                  — or —
                </p>

                {/* Browse */}
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    openFilePicker();
                  }}
                  className="
                    rounded-lg
                    border
                    border-orange-500
                    bg-white
                    px-5
                    py-1.5
                    text-sm
                    font-semibold
                    text-orange-500
                    transition
                    hover:bg-orange-50
                  "
                >
                  Browse
                </button>

                {/* Selected File */}
                {selectedFile && (
                  <p
                    className="
                      mt-3
                      max-w-full
                      truncate
                      px-4
                      text-xs
                      font-medium
                      text-emerald-600
                    "
                  >
                    Selected: {selectedFile.name}
                  </p>
                )}
              </div>

              {/* ==================================================
                  ACTION BUTTONS
              ================================================== */}
              <div
                className="
                  mt-4
                  flex
                  flex-col-reverse
                  gap-3
                  sm:flex-row
                  sm:justify-end
                "
              >
                {/* Download Template */}
                <button
                  type="button"
                  onClick={handleTemplate}
                  className="
                    inline-flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    px-5
                    py-2
                    text-sm
                    font-medium
                    text-slate-600
                    transition
                    hover:bg-slate-50
                    sm:w-auto
                  "
                >
                  <Download
                    size={16}
                    strokeWidth={2}
                  />

                  Download Template
                </button>

                {/* Upload File */}
                <button
                  type="button"
                  onClick={handleUploadFile}
                  className="
                    inline-flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-orange-500
                    px-5
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition
                    hover:bg-orange-600
                    sm:w-auto
                  "
                >
                  <Upload
                    size={16}
                    strokeWidth={2}
                  />

                  Upload File
                </button>
              </div>
            </section>

            {/* ==================================================
                FILE REQUIREMENTS CARD
            ================================================== */}
            <section
              className="
                min-w-0
                rounded-xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-[0_3px_12px_rgba(15,23,42,0.04)]
                sm:p-6
              "
            >
              {/* Heading */}
              <h2
                className="
                  text-base
                  font-semibold
                  text-slate-900
                "
              >
                File Requirements
              </h2>

              {/* Divider */}
              <div
                className="
                  mt-4
                  border-t
                  border-slate-100
                "
              />

              {/* ==================================================
                  REQUIREMENT 1
              ================================================== */}
              <div
                className="
                  flex
                  gap-3
                  border-b
                  border-slate-100
                  py-4
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-emerald-50
                  "
                >
                  <BadgeCheck
                    size={19}
                    strokeWidth={2}
                    className="text-emerald-500"
                  />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      text-sm
                      font-semibold
                      text-slate-800
                    "
                  >
                    Supported formats
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-sm
                      text-slate-500
                    "
                  >
                    XLSX, XLS, CSV
                  </p>
                </div>
              </div>

              {/* ==================================================
                  REQUIREMENT 2
              ================================================== */}
              <div
                className="
                  flex
                  gap-3
                  border-b
                  border-slate-100
                  py-4
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-emerald-50
                  "
                >
                  <BadgeCheck
                    size={19}
                    strokeWidth={2}
                    className="text-emerald-500"
                  />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      text-sm
                      font-semibold
                      text-slate-800
                    "
                  >
                    Use the approved template
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-sm
                      leading-5
                      text-slate-500
                    "
                  >
                    Download and use our template
                    for best results.
                  </p>
                </div>
              </div>

              {/* ==================================================
                  REQUIREMENT 3
              ================================================== */}
              <div
                className="
                  flex
                  gap-3
                  py-4
                "
              >
                <div
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-emerald-50
                  "
                >
                  <BadgeCheck
                    size={19}
                    strokeWidth={2}
                    className="text-emerald-500"
                  />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      text-sm
                      font-semibold
                      text-slate-800
                    "
                  >
                    Required fields must exist
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-sm
                      leading-5
                      text-slate-500
                    "
                  >
                    All mandatory columns should be
                    present.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
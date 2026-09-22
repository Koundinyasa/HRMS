// import React, { useRef, useState } from "react";
// import {
//   ChevronDown,
//   ChevronUp,
//   CloudUpload,
//   Download,
//   FileCheck2,
//   FileSpreadsheet,
//   X,
// } from "lucide-react";

// const TEMPLATE_OPTIONS = [
//   "Employee Details",
//   "Employee Contact Details",
//   "Employee Bank A/c Number",
//   "Employee Classification Details",
//   "Employee DOL",
//   "Employee Basic Details",
//   "Employee HR Category",
// ];

// const ImportPage = () => {
//   const [selectedTemplate, setSelectedTemplate] =
//     useState("Employee Details");

//   const [showDropdown, setShowDropdown] =
//     useState(false);

//   const [selectedFile, setSelectedFile] =
//     useState<File | null>(null);

//   const [isDragOver, setIsDragOver] =
//     useState(false);

//   const fileInputRef =
//     useRef<HTMLInputElement | null>(null);

//   const handleFile = (file: File | undefined) => {
//     if (!file) return;

//     const allowedExtensions = [
//       ".xlsx",
//       ".xls",
//       ".csv",
//     ];

//     const fileName = file.name.toLowerCase();

//     const isValid = allowedExtensions.some(
//       (extension) =>
//         fileName.endsWith(extension)
//     );

//     if (!isValid) {
//       alert(
//         "Please upload a valid Excel or CSV file."
//       );
//       return;
//     }

//     setSelectedFile(file);
//   };

//   const handleFileChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     handleFile(event.target.files?.[0]);
//   };

//   const handleDrop = (
//     event: React.DragEvent<HTMLDivElement>
//   ) => {
//     event.preventDefault();
//     setIsDragOver(false);

//     handleFile(event.dataTransfer.files?.[0]);
//   };

//   const removeFile = () => {
//     setSelectedFile(null);

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const handleBrowse = () => {
//     fileInputRef.current?.click();
//   };

//   const handleTemplateDownload = () => {
//     const content =
//       "Employee ID,Employee Name,Date of Joining\n";

//     const blob = new Blob([content], {
//       type: "text/csv;charset=utf-8;",
//     });

//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `${selectedTemplate.replace(
//       /\s+/g,
//       "_"
//     )}_Template.csv`;

//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     URL.revokeObjectURL(url);
//   };

//   const handleUpload = () => {
//     if (!selectedFile) {
//       alert("Please select a file first.");
//       return;
//     }

//     alert(
//       `${selectedFile.name} is ready for upload.`
//     );
//   };

//   return (
//     <div className="min-h-[calc(100vh-120px)] bg-white">
//       {/* Page Header */}
//       <div className="h-[36px] bg-[#eaf2fb] border-b border-gray-200 flex items-center justify-center">
//         <h2 className="text-[13px] font-semibold text-gray-700">
//           Employee Details
//         </h2>
//       </div>

//       <div className="p-4">
//         {/* Template Selection */}
//         <div className="relative w-[200px]">
//           <label className="block text-[12px] font-medium text-gray-600 mb-1">
//             Template Type
//             <span className="text-red-500">
//               *
//             </span>
//           </label>

//           <button
//             type="button"
//             onClick={() =>
//               setShowDropdown((value) => !value)
//             }
//             className={`w-[170px] h-[34px] px-3 flex items-center justify-between border rounded-md bg-white text-[12px] ${
//               showDropdown
//                 ? "border-[#2196F3] ring-1 ring-[#90CAF9]"
//                 : "border-gray-300"
//             }`}
//           >
//             <span className="text-gray-700">
//               {selectedTemplate}
//             </span>

//             {showDropdown ? (
//               <ChevronUp size={14} />
//             ) : (
//               <ChevronDown size={14} />
//             )}
//           </button>

//           {showDropdown && (
//             <div className="absolute left-0 top-[56px] z-50 w-[210px] rounded-md border border-gray-200 bg-white shadow-lg overflow-hidden">
//               <div className="px-3 py-2 text-[11px] text-gray-400 border-b border-gray-100">
//                 Select Template Type
//               </div>

//               {TEMPLATE_OPTIONS.map(
//                 (option) => (
//                   <button
//                     key={option}
//                     type="button"
//                     onClick={() => {
//                       setSelectedTemplate(
//                         option
//                       );
//                       setShowDropdown(false);
//                       removeFile();
//                     }}
//                     className={`w-full text-left px-3 py-2 text-[12px] hover:bg-blue-50 ${
//                       selectedTemplate ===
//                       option
//                         ? "bg-blue-50 text-blue-600 font-medium"
//                         : "text-gray-700"
//                     }`}
//                   >
//                     {option}
//                   </button>
//                 )
//               )}
//             </div>
//           )}
//         </div>

//         {/* Information Message */}
//         <div className="mt-4 rounded-md bg-[#f5f3ff] border border-[#ece7ff] px-4 py-2.5 text-[12px] text-gray-600">
//           <span className="font-medium">
//             Important:
//           </span>{" "}
//           For Date of Joining, change the
//           "Statutory Effective From" field to
//           text format in the Excel template before
//           uploading file.
//         </div>

//         {/* Main Upload Section */}
//         <div className="mt-2 grid grid-cols-[1fr_32%] gap-6">
//           {/* Upload Area */}
//           <div
//             onDragOver={(event) => {
//               event.preventDefault();
//               setIsDragOver(true);
//             }}
//             onDragLeave={() =>
//               setIsDragOver(false)
//             }
//             onDrop={handleDrop}
//             className={`min-h-[270px] border-2 border-dashed rounded-md bg-white flex flex-col items-center justify-center transition-colors ${
//               isDragOver
//                 ? "border-[#2196F3] bg-blue-50"
//                 : "border-gray-300"
//             }`}
//           >
//             {!selectedFile ? (
//               <>
//                 <CloudUpload
//                   size={30}
//                   className="text-gray-300 mb-2"
//                 />

//                 <p className="text-[13px] text-gray-400">
//                   Drag and drop
//                 </p>

//                 <p className="text-[12px] text-gray-400 my-1">
//                   - or -
//                 </p>

//                 <button
//                   type="button"
//                   onClick={handleBrowse}
//                   className="text-[13px] font-medium text-[#2196F3] hover:underline"
//                 >
//                   Browse
//                 </button>

//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept=".xlsx,.xls,.csv"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//               </>
//             ) : (
//               <div className="flex flex-col items-center">
//                 <FileSpreadsheet
//                   size={34}
//                   className="text-green-500 mb-3"
//                 />

//                 <p className="text-[13px] font-medium text-gray-700">
//                   {selectedFile.name}
//                 </p>

//                 <p className="text-[11px] text-gray-400 mt-1">
//                   {(
//                     selectedFile.size /
//                     1024
//                   ).toFixed(1)}{" "}
//                   KB
//                 </p>

//                 <div className="flex items-center gap-2 mt-4">
//                   <button
//                     type="button"
//                     onClick={handleBrowse}
//                     className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-md hover:bg-gray-50"
//                   >
//                     Replace
//                   </button>

//                   <button
//                     type="button"
//                     onClick={removeFile}
//                     className="flex items-center gap-1 px-3 py-1.5 text-[12px] text-red-500 border border-red-200 rounded-md hover:bg-red-50"
//                   >
//                     <X size={13} />
//                     Remove
//                   </button>
//                 </div>

//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept=".xlsx,.xls,.csv"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//               </div>
//             )}
//           </div>

//           {/* File Requirement */}
//           <div className="border border-gray-200 rounded-md overflow-hidden min-h-[270px]">
//             <div className="bg-[#e7eef6] px-4 py-3">
//               <h3 className="text-[15px] font-semibold text-gray-700">
//                 File Requirement
//               </h3>
//             </div>

//             <div className="px-4 py-7">
//               <div className="flex items-center gap-3">
//                 <FileCheck2
//                   size={22}
//                   className="text-emerald-400"
//                 />

//                 <span className="text-[13px] font-medium text-emerald-500">
//                   The Selected File
//                   should be valid
//                 </span>
//               </div>

//               <div className="mt-6 border-t border-gray-100 pt-4">
//                 <div className="text-[11px] text-gray-400">
//                   Supported formats
//                 </div>

//                 <div className="mt-1 text-[12px] text-gray-600">
//                   .xlsx, .xls, .csv
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Buttons */}
//         <div className="flex justify-center gap-2 mt-[-52px] relative z-10">
//           <button
//             type="button"
//             onClick={handleTemplateDownload}
//             className="flex items-center gap-1.5 px-5 py-2 rounded-md bg-gray-500 hover:bg-gray-600 text-white text-[13px] font-medium"
//           >
//             <Download size={14} />
//             Template
//           </button>

//           <button
//             type="button"
//             onClick={handleUpload}
//             className="flex items-center gap-1.5 px-5 py-2 rounded-md bg-[#2196F3] hover:bg-[#1976D2] text-white text-[13px] font-medium"
//           >
//             <FileCheck2 size={14} />
//             Upload File
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImportPage;
















// import React, { useRef, useState } from "react";
// import {
//   ChevronDown,
//   ChevronUp,
//   CloudUpload,
//   Download,
//   FileCheck2,
//   FileSpreadsheet,
//   X,
// } from "lucide-react";

// const TEMPLATE_OPTIONS = [
//   "Employee Details",
//   "Employee Contact Details",
//   "Employee Bank A/c Number",
//   "Employee Classification Details",
//   "Employee DOL",
//   "Employee Basic Details",
//   "Employee HR Category",
// ];

// const ImportPage = () => {
//   const [selectedTemplate, setSelectedTemplate] =
//     useState("Employee Details");

//   const [showDropdown, setShowDropdown] =
//     useState(false);

//   const [selectedFile, setSelectedFile] =
//     useState<File | null>(null);

//   const [isDragOver, setIsDragOver] =
//     useState(false);

//   const fileInputRef =
//     useRef<HTMLInputElement | null>(null);

//   const handleFile = (file: File | undefined) => {
//     if (!file) return;

//     const allowedExtensions = [
//       ".xlsx",
//       ".xls",
//       ".csv",
//     ];

//     const fileName = file.name.toLowerCase();

//     const isValid = allowedExtensions.some(
//       (extension) =>
//         fileName.endsWith(extension)
//     );

//     if (!isValid) {
//       alert(
//         "Please upload a valid Excel or CSV file."
//       );
//       return;
//     }

//     setSelectedFile(file);
//   };

//   const handleFileChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     handleFile(event.target.files?.[0]);
//   };

//   const handleDrop = (
//     event: React.DragEvent<HTMLDivElement>
//   ) => {
//     event.preventDefault();
//     setIsDragOver(false);

//     handleFile(event.dataTransfer.files?.[0]);
//   };

//   const removeFile = () => {
//     setSelectedFile(null);

//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const handleBrowse = () => {
//     fileInputRef.current?.click();
//   };

//   const handleTemplateDownload = () => {
//     const content =
//       "Employee ID,Employee Name,Date of Joining\n";

//     const blob = new Blob([content], {
//       type: "text/csv;charset=utf-8;",
//     });

//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `${selectedTemplate.replace(
//       /\s+/g,
//       "_"
//     )}_Template.csv`;

//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);

//     URL.revokeObjectURL(url);
//   };

//   const handleUpload = () => {
//     if (!selectedFile) {
//       alert("Please select a file first.");
//       return;
//     }

//     alert(
//       `${selectedFile.name} is ready for upload.`
//     );
//   };

//   return (
//     <div className="min-h-[calc(100vh-120px)] bg-white">
//       {/* Page Header */}
//       <div className="h-[36px] bg-[#eaf2fb] border-b border-gray-200 flex items-center justify-center">
//         <h2 className="text-[13px] font-semibold text-gray-700">
//           Employee Details
//         </h2>
//       </div>

//       <div className="p-4">
//         {/* Template Selection */}
//         <div className="relative w-[200px]">
//           <label className="block text-[12px] font-medium text-gray-600 mb-1">
//             Template Type
//             <span className="text-red-500">
//               *
//             </span>
//           </label>

//           <button
//             type="button"
//             onClick={() =>
//               setShowDropdown((value) => !value)
//             }
//             className={`w-[170px] h-[34px] px-3 flex items-center justify-between border rounded-md bg-white text-[12px] ${
//               showDropdown
//                 ? "border-[#F97316] ring-1 ring-[#FDBA74]"
//                 : "border-gray-300"
//             }`}
//           >
//             <span className="text-gray-700">
//               {selectedTemplate}
//             </span>

//             {showDropdown ? (
//               <ChevronUp size={14} />
//             ) : (
//               <ChevronDown size={14} />
//             )}
//           </button>

//           {showDropdown && (
//             <div className="absolute left-0 top-[56px] z-50 w-[210px] rounded-md border border-gray-200 bg-white shadow-lg overflow-hidden">
//               <div className="px-3 py-2 text-[11px] text-gray-400 border-b border-gray-100">
//                 Select Template Type
//               </div>

//               {TEMPLATE_OPTIONS.map(
//                 (option) => (
//                   <button
//                     key={option}
//                     type="button"
//                     onClick={() => {
//                       setSelectedTemplate(
//                         option
//                       );
//                       setShowDropdown(false);
//                       removeFile();
//                     }}
//                     className={`w-full text-left px-3 py-2 text-[12px] hover:bg-blue-50 ${
//                       selectedTemplate ===
//                       option
//                         ? "bg-blue-50 text-blue-600 font-medium"
//                         : "text-gray-700"
//                     }`}
//                   >
//                     {option}
//                   </button>
//                 )
//               )}
//             </div>
//           )}
//         </div>

//         {/* Information Message */}
//         <div className="mt-4 rounded-md bg-[#f5f3ff] border border-[#ece7ff] px-4 py-2.5 text-[12px] text-gray-600">
//           <span className="font-medium">
//             Important:
//           </span>{" "}
//           For Date of Joining, change the
//           "Statutory Effective From" field to
//           text format in the Excel template before
//           uploading file.
//         </div>

//         {/* Main Upload Section */}
//         <div className="mt-2 grid grid-cols-[1fr_32%] gap-6">
//           {/* Upload Area */}
//           <div
//             onDragOver={(event) => {
//               event.preventDefault();
//               setIsDragOver(true);
//             }}
//             onDragLeave={() =>
//               setIsDragOver(false)
//             }
//             onDrop={handleDrop}
//             className={`min-h-[270px] border-2 border-dashed rounded-md bg-white flex flex-col items-center justify-center transition-colors ${
//               isDragOver
//                 ? "border-[#F97316] bg-blue-50"
//                 : "border-gray-300"
//             }`}
//           >
//             {!selectedFile ? (
//               <>
//                 <CloudUpload
//                   size={30}
//                   className="text-gray-300 mb-2"
//                 />

//                 <p className="text-[13px] text-gray-400">
//                   Drag and drop
//                 </p>

//                 <p className="text-[12px] text-gray-400 my-1">
//                   - or -
//                 </p>

//                 <button
//                   type="button"
//                   onClick={handleBrowse}
//                   className="text-[13px] font-medium text-[#F97316] hover:underline"
//                 >
//                   Browse
//                 </button>

//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept=".xlsx,.xls,.csv"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//               </>
//             ) : (
//               <div className="flex flex-col items-center">
//                 <FileSpreadsheet
//                   size={34}
//                   className="text-green-500 mb-3"
//                 />

//                 <p className="text-[13px] font-medium text-gray-700">
//                   {selectedFile.name}
//                 </p>

//                 <p className="text-[11px] text-gray-400 mt-1">
//                   {(
//                     selectedFile.size /
//                     1024
//                   ).toFixed(1)}{" "}
//                   KB
//                 </p>

//                 <div className="flex items-center gap-2 mt-4">
//                   <button
//                     type="button"
//                     onClick={handleBrowse}
//                     className="px-3 py-1.5 text-[12px] border border-gray-300 rounded-md hover:bg-gray-50"
//                   >
//                     Replace
//                   </button>

//                   <button
//                     type="button"
//                     onClick={removeFile}
//                     className="flex items-center gap-1 px-3 py-1.5 text-[12px] text-red-500 border border-red-200 rounded-md hover:bg-red-50"
//                   >
//                     <X size={13} />
//                     Remove
//                   </button>
//                 </div>

//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept=".xlsx,.xls,.csv"
//                   onChange={handleFileChange}
//                   className="hidden"
//                 />
//               </div>
//             )}
//           </div>

//           {/* File Requirement */}
//           <div className="border border-gray-200 rounded-md overflow-hidden min-h-[270px]">
//             <div className="bg-[#e7eef6] px-4 py-3">
//               <h3 className="text-[15px] font-semibold text-gray-700">
//                 File Requirement
//               </h3>
//             </div>

//             <div className="px-4 py-7">
//               <div className="flex items-center gap-3">
//                 <FileCheck2
//                   size={22}
//                   className="text-emerald-400"
//                 />

//                 <span className="text-[13px] font-medium text-emerald-500">
//                   The Selected File
//                   should be valid
//                 </span>
//               </div>

//               <div className="mt-6 border-t border-gray-100 pt-4">
//                 <div className="text-[11px] text-gray-400">
//                   Supported formats
//                 </div>

//                 <div className="mt-1 text-[12px] text-gray-600">
//                   .xlsx, .xls, .csv
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Buttons */}
//         <div className="flex justify-center gap-2 mt-[-52px] relative z-10">
//           <button
//             type="button"
//             onClick={handleTemplateDownload}
//             className="flex items-center gap-1.5 px-5 py-2 rounded-md bg-gray-500 hover:bg-gray-600 text-white text-[13px] font-medium"
//           >
//             <Download size={14} />
//             Template
//           </button>

//           <button
//             type="button"
//             onClick={handleUpload}
//             className="flex items-center gap-1.5 px-5 py-2 rounded-md bg-[#F97316] hover:bg-[#C2410C] text-white text-[13px] font-medium"
//           >
//             <FileCheck2 size={14} />
//             Upload File
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImportPage;


















// import React, { useEffect, useRef, useState } from "react";
// import {
//   ChevronDown,
//   Download,
//   FileSpreadsheet,
//   UploadCloud,
//   X,
//   CheckCircle2,
//   AlertCircle,
//   Info,
// } from "lucide-react";

// import EnrollmentTabs from "../components/EnrollmentTabs";
// import {
//   useUploadEmployeeImportMutation,
//   useLazyGetImportTemplateQuery,
// } from "../api/employeedetailsApi";

// /* =========================================================
//    Template types — these mirror the Figma dropdown.
//    If your backend exposes a template-type list endpoint,
//    swap TEMPLATE_OPTIONS for that query instead.
// ========================================================= */

// const TEMPLATE_OPTIONS = [
//   "Employee Details",
//   "Employee Contact Details",
//   "Employee Bank A/c Number",
//   "Employee Classification Details",
//   "Employee DOL",
//   "Employee Basic Details",
//   "Employee HR Category",
// ] as const;

// const ACCEPTED = [".xlsx", ".xls", ".csv"];

// const ImportPage: React.FC = () => {
//   const [templateType, setTemplateType] =
//     useState<string>("Employee Details");
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [file, setFile] = useState<File | null>(null);
//   const [dragOver, setDragOver] = useState(false);
//   const [fileError, setFileError] = useState<string | null>(null);

//   const fileInputRef = useRef<HTMLInputElement | null>(null);
//   const dropdownRef = useRef<HTMLDivElement | null>(null);

//   /* ---------------- backend calls ---------------- */

//   const [uploadImport, { data: uploadResult, isLoading: isUploading, error: uploadError, reset: resetUpload }] =
//     useUploadEmployeeImportMutation();

//   const [fetchTemplate, { isFetching: isTemplateLoading }] =
//     useLazyGetImportTemplateQuery();

//   const [templateError, setTemplateError] = useState<string | null>(null);

//   /* ---------------- dropdown outside click ---------------- */

//   useEffect(() => {
//     if (!dropdownOpen) return;
//     const onDown = (e: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", onDown);
//     return () => document.removeEventListener("mousedown", onDown);
//   }, [dropdownOpen]);

//   /* ---------------- file handling ---------------- */

//   const pickFile = (picked?: File | null) => {
//     if (!picked) return;
//     const valid = ACCEPTED.some((ext) =>
//       picked.name.toLowerCase().endsWith(ext)
//     );
//     if (!valid) {
//       setFile(null);
//       setFileError("Choose an .xlsx, .xls or .csv file.");
//       return;
//     }
//     setFileError(null);
//     resetUpload();
//     setFile(picked);
//   };

//   const clearFile = () => {
//     setFile(null);
//     setFileError(null);
//     resetUpload();
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   /* ---------------- actions ---------------- */

//   const handleDownloadTemplate = async () => {
//     setTemplateError(null);
//     try {
//       const blob = await fetchTemplate(templateType).unwrap();
//       const url = URL.createObjectURL(blob as Blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `${templateType.replace(/[\s/]+/g, "_")}_Template.xlsx`;
//       a.click();
//       URL.revokeObjectURL(url);
//     } catch (err) {
//       console.error("Template download failed", err);
//       setTemplateError("Couldn't download the template. Try again.");
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) return;
//     try {
//       await uploadImport({ templateType, file }).unwrap();
//     } catch (err) {
//       console.error("Import upload failed", err);
//     }
//   };

//   const uploadFailed = Boolean(uploadError) || uploadResult?.success === false;
//   const uploadSucceeded = uploadResult?.success === true;

//   return (
//     <div className="min-h-[calc(100vh-100px)] bg-[#F5F7FA]">
//       {/* ---------- TOP TAB BAR ---------- */}
//       <div className="px-3 pt-2">
//         <EnrollmentTabs />
//       </div>

//       <div className="px-3 pb-4">
//         <div className="overflow-hidden rounded-[12px] border border-[#E8ECF0] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
//           {/* ---------- SECTION BAND ---------- */}
//           <div className="border-b border-[#FED7AA] bg-[#FFF7ED] px-5 py-2.5 text-center text-[13px] font-semibold text-[#9A3412]">
//             {templateType}
//           </div>

//           <div className="p-5">
//             {/* ---------- TEMPLATE TYPE ---------- */}
//             <div ref={dropdownRef} className="relative max-w-[280px]">
//               <label className="mb-1.5 block text-[12px] font-medium text-[#475467]">
//                 Template Type <span className="text-[#F04438]">*</span>
//               </label>

//               <button
//                 type="button"
//                 onClick={() => setDropdownOpen((v) => !v)}
//                 aria-haspopup="listbox"
//                 aria-expanded={dropdownOpen}
//                 className={`flex h-[38px] w-full items-center justify-between rounded-[8px] border bg-white px-3 text-[13px] transition-colors ${
//                   dropdownOpen
//                     ? "border-[#F97316] shadow-[0_0_0_3px_rgba(249,115,22,0.15)]"
//                     : "border-[#D0D5DD] hover:border-[#FDBA74]"
//                 }`}
//               >
//                 <span className="text-[#344054]">{templateType}</span>
//                 <ChevronDown
//                   size={16}
//                   className={`text-[#98A2B3] transition-transform ${
//                     dropdownOpen ? "rotate-180" : ""
//                   }`}
//                 />
//               </button>

//               {dropdownOpen && (
//                 <div
//                   role="listbox"
//                   className="absolute left-0 top-[calc(100%+4px)] z-50 w-full overflow-hidden rounded-[8px] border border-[#E8ECF0] bg-white shadow-[0_8px_24px_rgba(16,24,40,0.12)]"
//                 >
//                   {TEMPLATE_OPTIONS.map((opt) => (
//                     <button
//                       key={opt}
//                       type="button"
//                       role="option"
//                       aria-selected={templateType === opt}
//                       onClick={() => {
//                         setTemplateType(opt);
//                         setDropdownOpen(false);
//                         clearFile();
//                         setTemplateError(null);
//                       }}
//                       className={`w-full px-3 py-2.5 text-left text-[12.5px] transition-colors hover:bg-[#FFF7ED] ${
//                         templateType === opt
//                           ? "bg-[#FFF7ED] font-semibold text-[#C2410C]"
//                           : "text-[#344054]"
//                       }`}
//                     >
//                       {opt}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* ---------- DOJ NOTICE ---------- */}
//             <div className="mt-4 flex gap-2 rounded-[8px] border border-[#FED7AA] bg-[#FFF7ED] px-4 py-2.5 text-[12px] text-[#9A3412]">
//               <Info size={15} className="mt-[1px] shrink-0 text-[#F97316]" />
//               <p>
//                 For a future-month date of joining, change the “Statutory
//                 Effective From” field to text format in the Excel template
//                 before uploading.
//               </p>
//             </div>

//             {/* ---------- DROP ZONE + REQUIREMENTS ---------- */}
//             <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(260px,1fr)]">
//               {/* drop zone */}
//               <div>
//                 <div
//                   onDragOver={(e) => {
//                     e.preventDefault();
//                     setDragOver(true);
//                   }}
//                   onDragLeave={() => setDragOver(false)}
//                   onDrop={(e) => {
//                     e.preventDefault();
//                     setDragOver(false);
//                     pickFile(e.dataTransfer.files?.[0]);
//                   }}
//                   className={`flex min-h-[230px] flex-col items-center justify-center rounded-[10px] border-2 border-dashed px-4 text-center transition-colors ${
//                     dragOver
//                       ? "border-[#F97316] bg-[#FFF7ED]"
//                       : "border-[#D6DAE0] bg-[#FCFCFD]"
//                   }`}
//                 >
//                   {file ? (
//                     <div className="flex flex-col items-center gap-2.5">
//                       <FileSpreadsheet size={34} className="text-[#16A34A]" />
//                       <p className="max-w-[320px] truncate text-[13px] font-medium text-[#344054]">
//                         {file.name}
//                       </p>
//                       <p className="text-[11.5px] text-[#98A2B3]">
//                         {(file.size / 1024).toFixed(0)} KB
//                       </p>
//                       <button
//                         type="button"
//                         onClick={clearFile}
//                         className="mt-1 flex items-center gap-1 rounded-[6px] border border-[#FECDCA] px-3 py-1.5 text-[12px] font-medium text-[#D92D20] transition-colors hover:bg-[#FEF3F2]"
//                       >
//                         <X size={13} />
//                         Remove
//                       </button>
//                     </div>
//                   ) : (
//                     <>
//                       <UploadCloud size={30} className="mb-2 text-[#98A2B3]" />
//                       <p className="text-[13px] text-[#667085]">Drag and drop</p>
//                       <p className="my-0.5 text-[12px] text-[#98A2B3]">- or -</p>
//                       <button
//                         type="button"
//                         onClick={() => fileInputRef.current?.click()}
//                         className="text-[13px] font-semibold text-[#F97316] hover:underline"
//                       >
//                         Browse
//                       </button>
//                     </>
//                   )}

//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept={ACCEPTED.join(",")}
//                     onChange={(e) => pickFile(e.target.files?.[0])}
//                     className="hidden"
//                   />
//                 </div>

//                 {/* ---------- BUTTONS ---------- */}
//                 <div className="mt-4 flex justify-end gap-2">
//                   <button
//                     type="button"
//                     onClick={handleDownloadTemplate}
//                     disabled={isTemplateLoading}
//                     className="flex h-[38px] items-center gap-1.5 rounded-[8px] border border-[#D0D5DD] bg-white px-4 text-[13px] font-medium text-[#344054] transition-colors hover:bg-[#F9FAFB] disabled:opacity-50"
//                   >
//                     <Download size={14} />
//                     {isTemplateLoading ? "Preparing…" : "Template"}
//                   </button>

//                   <button
//                     type="button"
//                     onClick={handleUpload}
//                     disabled={!file || isUploading}
//                     className="flex h-[38px] items-center gap-1.5 rounded-[8px] bg-[#F97316] px-4 text-[13px] font-semibold text-white transition-colors hover:bg-[#EA6A0B] disabled:cursor-not-allowed disabled:opacity-40"
//                   >
//                     <UploadCloud size={14} />
//                     {isUploading ? "Uploading…" : "Upload File"}
//                   </button>
//                 </div>
//               </div>

//               {/* file requirement panel */}
//               <div className="overflow-hidden rounded-[10px] border border-[#E8ECF0]">
//                 <div className="flex items-center gap-2 border-b border-[#E8ECF0] bg-[#F9FAFB] px-4 py-2.5">
//                   <CheckCircle2 size={15} className="text-[#667085]" />
//                   <h3 className="text-[13px] font-semibold text-[#344054]">
//                     File requirement
//                   </h3>
//                 </div>

//                 <div className="space-y-2 p-3">
//                   {/* file type / selection state */}
//                   <div
//                     className={`flex items-start gap-2 rounded-[8px] border px-3 py-2.5 text-[12.5px] ${
//                       fileError
//                         ? "border-[#FECDCA] bg-[#FEF3F2] text-[#B42318]"
//                         : file
//                         ? "border-[#ABEFC6] bg-[#ECFDF3] text-[#067647]"
//                         : "border-[#E8ECF0] bg-white text-[#667085]"
//                     }`}
//                   >
//                     {fileError ? (
//                       <AlertCircle size={15} className="mt-[1px] shrink-0" />
//                     ) : (
//                       <CheckCircle2 size={15} className="mt-[1px] shrink-0" />
//                     )}
//                     <span>
//                       {fileError
//                         ? fileError
//                         : file
//                         ? "Selected file is valid"
//                         : "Selected file should be a valid .xlsx, .xls or .csv"}
//                     </span>
//                   </div>

//                   {/* template download failure */}
//                   {templateError && (
//                     <div className="flex items-start gap-2 rounded-[8px] border border-[#FECDCA] bg-[#FEF3F2] px-3 py-2.5 text-[12.5px] text-[#B42318]">
//                       <AlertCircle size={15} className="mt-[1px] shrink-0" />
//                       <span>{templateError}</span>
//                     </div>
//                   )}

//                   {/* upload outcome — straight from the backend response */}
//                   {uploadSucceeded && (
//                     <div className="rounded-[8px] border border-[#ABEFC6] bg-[#ECFDF3] px-3 py-2.5 text-[12.5px] text-[#067647]">
//                       <p className="flex items-start gap-2 font-medium">
//                         <CheckCircle2 size={15} className="mt-[1px] shrink-0" />
//                         {uploadResult?.message ?? "Import completed."}
//                       </p>
//                       {(uploadResult?.data?.successCount != null ||
//                         uploadResult?.data?.failureCount != null) && (
//                         <p className="mt-1 pl-[23px] text-[#3E6E52]">
//                           {uploadResult?.data?.successCount ?? 0} imported
//                           {uploadResult?.data?.failureCount
//                             ? `, ${uploadResult.data.failureCount} failed`
//                             : ""}
//                         </p>
//                       )}
//                     </div>
//                   )}

//                   {uploadFailed && (
//                     <div className="rounded-[8px] border border-[#FECDCA] bg-[#FEF3F2] px-3 py-2.5 text-[12.5px] text-[#B42318]">
//                       <p className="flex items-start gap-2 font-medium">
//                         <AlertCircle size={15} className="mt-[1px] shrink-0" />
//                         {uploadResult?.message ??
//                           "Upload failed. Check the file and try again."}
//                       </p>
//                     </div>
//                   )}

//                   {/* per-row errors returned by the backend */}
//                   {uploadResult?.data?.errors?.length ? (
//                     <div className="max-h-[180px] overflow-y-auto rounded-[8px] border border-[#E8ECF0]">
//                       <table className="w-full border-collapse text-left text-[12px]">
//                         <thead>
//                           <tr className="border-b border-[#FED7AA] bg-[#FFF7ED] text-[11.5px] font-semibold text-[#9A3412]">
//                             <th className="px-3 py-2">Row</th>
//                             <th className="px-3 py-2">Issue</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {uploadResult.data.errors.map((e, i) => (
//                             <tr
//                               key={`${e.row}-${i}`}
//                               className="border-b border-[#F0F2F5] text-[#475467] last:border-b-0"
//                             >
//                               <td className="px-3 py-2">{e.row}</td>
//                               <td className="px-3 py-2">{e.message}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>
//                   ) : null}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImportPage;










// import React, { useRef, useState } from "react";
// import {
//   ChevronDown,
//   CloudUpload,
//   Download,
//   FileCheck2,
//   FileSpreadsheet,
//   Loader2,
//   X,
// } from "lucide-react";
// import {
//   useLazyDownloadEmployeeTemplateQuery,
//   useUploadEmployeeDetailsMutation,
// } from "../api/employeedetailsApi";

// const TEMPLATE_OPTIONS = [
//   "Employee Details",
//   "Employee Contact Details",
//   "Employee Bank A/c Number",
//   "Employee Classification Details",
//   "Employee DOL",
//   "Employee Basic Details",
//   "Employee HR Category",
// ];

// const ImportPage: React.FC = () => {
//   const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATE_OPTIONS[0]);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [isDragOver, setIsDragOver] = useState(false);
//   const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   const [triggerDownload, { isFetching: isDownloading }] = useLazyDownloadEmployeeTemplateQuery();
//   const [uploadEmployeeDetails, { isLoading: isUploading }] = useUploadEmployeeDetailsMutation();

//   const handleFile = (file?: File) => {
//     if (!file) return;
//     const isValid = [".xlsx", ".xls", ".csv"].some((ext) => file.name.toLowerCase().endsWith(ext));
//     if (!isValid) {
//       setStatusMessage({ type: "error", text: "Please upload a valid Excel (.xlsx, .xls) or CSV file." });
//       return;
//     }
//     setStatusMessage(null);
//     setSelectedFile(file);
//   };

//   const removeFile = () => {
//     setSelectedFile(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   const handleTemplateDownload = async () => {
//     setStatusMessage(null);
//     try {
//       const blob = await triggerDownload(selectedTemplate).unwrap();
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `${selectedTemplate.replace(/\s+/g, "_")}_Template.xlsx`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
//     } catch {
//       setStatusMessage({ type: "error", text: "Could not download the template. Please try again." });
//     }
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) {
//       setStatusMessage({ type: "error", text: "Please select a file first." });
//       return;
//     }
//     setStatusMessage(null);
//     try {
//       await uploadEmployeeDetails({ file: selectedFile, templateType: selectedTemplate }).unwrap();
//       setStatusMessage({ type: "success", text: `${selectedFile.name} uploaded successfully.` });
//       removeFile();
//     } catch (err: unknown) {
//       const message =
//         (err as { data?: { message?: string } })?.data?.message ??
//         "Upload failed. Please check the file and try again.";
//       setStatusMessage({ type: "error", text: message });
//     }
//   };

//   return (
//     <div className="min-h-[calc(100vh-120px)] bg-white">
//       {/* Page header strip */}
//       <div className="flex h-[36px] items-center justify-center border-b border-[#E5EAF0] bg-[#EAF2FB]">
//         <h2 className="text-[13px] font-semibold text-[#344054]">{selectedTemplate}</h2>
//       </div>

//       <div className="p-4">
//         {/* Template Type dropdown */}
//         <div className="relative w-[210px]">
//           <label className="mb-1 block text-[12px] font-medium text-[#475467]">
//             Template Type <span className="text-[#F97316]">*</span>
//           </label>
//           <button
//             type="button"
//             onClick={() => setShowDropdown((v) => !v)}
//             className={`flex h-[34px] w-[180px] items-center justify-between rounded-[6px] border bg-white px-3 text-[12px] ${
//               showDropdown ? "border-[#F97316] ring-1 ring-[#FDBA74]" : "border-[#D0D5DD]"
//             }`}
//           >
//             <span className="text-[#344054]">{selectedTemplate}</span>
//             <ChevronDown size={14} className={`text-[#98A2B3] transition-transform ${showDropdown ? "rotate-180" : ""}`} />
//           </button>
//           {showDropdown && (
//             <div className="absolute left-0 top-[58px] z-50 w-[220px] overflow-hidden rounded-[6px] border border-[#E5EAF0] bg-white shadow-lg">
//               <div className="border-b border-[#F0F2F5] px-3 py-2 text-[11px] text-[#98A2B3]">Select Template Type</div>
//               {TEMPLATE_OPTIONS.map((opt) => (
//                 <button
//                   key={opt}
//                   type="button"
//                   onClick={() => {
//                     setSelectedTemplate(opt);
//                     setShowDropdown(false);
//                     removeFile();
//                     setStatusMessage(null);
//                   }}
//                   className={`w-full px-3 py-2 text-left text-[12px] hover:bg-[#FFF7ED] ${
//                     selectedTemplate === opt ? "bg-[#FFF7ED] font-medium text-[#C2410C]" : "text-[#344054]"
//                   }`}
//                 >
//                   {opt}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Info banner */}
//         <div className="mt-4 rounded-[6px] border border-[#ECE7FF] bg-[#F5F3FF] px-4 py-2.5 text-[12px] text-[#475467]">
//           <span className="font-medium text-[#344054]">Important:</span> For future month DOJ (Date of Joining),
//           change the &quot;Statutory Effective From&quot; field to text format in the Excel template before
//           uploading file.
//         </div>

//         {/* Status banner */}
//         {statusMessage && (
//           <div
//             className={`mt-3 rounded-[6px] border px-4 py-2.5 text-[12.5px] font-medium ${
//               statusMessage.type === "success"
//                 ? "border-[#B7EBC6] bg-[#ECFDF3] text-[#067647]"
//                 : "border-[#FECDCA] bg-[#FEF3F2] text-[#B42318]"
//             }`}
//           >
//             {statusMessage.text}
//           </div>
//         )}

//         {/* Upload area + File Requirement side panel */}
//         <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-[1fr_32%]">
//           {/* Drag & drop zone */}
//           <div
//             onDragOver={(e) => {
//               e.preventDefault();
//               setIsDragOver(true);
//             }}
//             onDragLeave={() => setIsDragOver(false)}
//             onDrop={(e) => {
//               e.preventDefault();
//               setIsDragOver(false);
//               handleFile(e.dataTransfer.files?.[0]);
//             }}
//             className={`flex min-h-[270px] flex-col items-center justify-center rounded-[6px] border-2 border-dashed bg-white transition-colors ${
//               isDragOver ? "border-[#F97316] bg-[#FFF7ED]" : "border-[#D0D5DD]"
//             }`}
//           >
//             {!selectedFile ? (
//               <>
//                 <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF7ED]">
//                   <CloudUpload size={26} className="text-[#F97316]" />
//                 </div>
//                 <p className="text-[13px] text-[#475467]">
//                   Drag and drop
//                   <br />
//                   - or -
//                 </p>
//                 <button
//                   type="button"
//                   onClick={() => fileInputRef.current?.click()}
//                   className="mt-1 text-[13px] font-semibold text-[#F97316] hover:underline"
//                 >
//                   Browse
//                 </button>
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept=".xlsx,.xls,.csv"
//                   onChange={(e) => handleFile(e.target.files?.[0])}
//                   className="hidden"
//                 />
//               </>
//             ) : (
//               <div className="flex flex-col items-center gap-3">
//                 <FileSpreadsheet size={36} className="text-[#16A34A]" />
//                 <p className="max-w-[240px] truncate text-[13px] font-medium text-[#344054]">{selectedFile.name}</p>
//                 <button
//                   type="button"
//                   onClick={removeFile}
//                   className="flex items-center gap-1 rounded-[6px] border border-[#FECDCA] px-3 py-1.5 text-[12px] text-[#D92D20] hover:bg-[#FEF3F2]"
//                 >
//                   <X size={13} /> Remove
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* File Requirement panel */}
//           <div className="min-h-[270px] rounded-[6px] border border-[#E5EAF0] bg-white p-4">
//             <div className="mb-3 flex items-center gap-2">
//               <FileCheck2 size={16} className="text-[#344054]" />
//               <h3 className="text-[13px] font-semibold text-[#344054]">File Requirement</h3>
//             </div>
//             <div className="flex items-center gap-2 rounded-[6px] border border-[#B7EBC6] bg-[#ECFDF3] px-3 py-2.5 text-[12.5px] font-medium text-[#067647]">
//               <FileCheck2 size={14} className="shrink-0" />
//               Selected file should be valid
//             </div>
//             <p className="mt-3 text-[12px] text-[#98A2B3]">Accepted formats: .xlsx, .xls, .csv</p>
//           </div>
//         </div>

//         {/* Action buttons */}
//         <div className="mt-5 flex justify-center gap-2">
//           <button
//             type="button"
//             onClick={handleTemplateDownload}
//             disabled={isDownloading}
//             className="flex items-center gap-1.5 rounded-[6px] bg-[#667085] px-5 py-2 text-[13px] font-medium text-white hover:bg-[#475467] disabled:opacity-50"
//           >
//             {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
//             Template
//           </button>
//           <button
//             type="button"
//             onClick={handleUpload}
//             disabled={!selectedFile || isUploading}
//             className="flex items-center gap-1.5 rounded-[6px] bg-[#F97316] px-5 py-2 text-[13px] font-medium text-white hover:bg-[#C2410C] disabled:opacity-50"
//           >
//             {isUploading ? <Loader2 size={14} className="animate-spin" /> : <FileCheck2 size={14} />}
//             {isUploading ? "Uploading…" : "Upload File"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImportPage;

















import React, { useRef, useState } from "react";
import {
  ChevronDown,
  CloudUpload,
  Download,
  FileCheck2,
  FileSpreadsheet,
  Loader2,
  X,
} from "lucide-react";
import {
  useLazyDownloadEmployeeTemplateQuery,
  useUploadEmployeeDetailsMutation,
} from "../api/employeedetailsApi";
import EnrollmentTabs from "../components/EnrollmentTabs";

const TEMPLATE_OPTIONS = [
  "Employee Details",
  "Employee Contact Details",
  "Employee Bank A/c Number",
  "Employee Classification Details",
  "Employee DOL",
  "Employee Basic Details",
  "Employee HR Category",
];

const ImportPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATE_OPTIONS[0]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [triggerDownload, { isFetching: isDownloading }] = useLazyDownloadEmployeeTemplateQuery();
  const [uploadEmployeeDetails, { isLoading: isUploading }] = useUploadEmployeeDetailsMutation();

  const handleFile = (file?: File) => {
    if (!file) return;
    const isValid = [".xlsx", ".xls", ".csv"].some((ext) => file.name.toLowerCase().endsWith(ext));
    if (!isValid) {
      setStatusMessage({ type: "error", text: "Please upload a valid Excel (.xlsx, .xls) or CSV file." });
      return;
    }
    setStatusMessage(null);
    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTemplateDownload = async () => {
    setStatusMessage(null);
    try {
      const blob = await triggerDownload(selectedTemplate).unwrap();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${selectedTemplate.replace(/\s+/g, "_")}_Template.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      setStatusMessage({ type: "error", text: "Could not download the template. Please try again." });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatusMessage({ type: "error", text: "Please select a file first." });
      return;
    }
    setStatusMessage(null);
    try {
      await uploadEmployeeDetails({ file: selectedFile, templateType: selectedTemplate }).unwrap();
      setStatusMessage({ type: "success", text: `${selectedFile.name} uploaded successfully.` });
      removeFile();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ??
        "Upload failed. Please check the file and try again.";
      setStatusMessage({ type: "error", text: message });
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-120px)] bg-[#EDEDED] text-[#131313]"
      style={{ fontFamily: "Urbanist, Geist Variable, sans-serif" }}
    >
      <EnrollmentTabs />

      {/* Page header strip */}
      <div className="flex h-[36px] items-center justify-center border-b border-[#E2E2E2] bg-[#FFF5EE]">
        <h2 className="text-[13px] font-semibold text-[#131313]">{selectedTemplate}</h2>
      </div>

      <div className="p-4">
        {/* Template Type dropdown */}
        <div className="relative w-[210px]">
          <label className="mb-1 block text-[12px] font-medium text-[#475467]">
            Template Type <span className="text-[#F97316]">*</span>
          </label>
          <button
            type="button"
            onClick={() => setShowDropdown((v) => !v)}
            className={`flex h-[34px] w-[180px] items-center justify-between rounded-[6px] border bg-white px-3 text-[12px] ${
              showDropdown ? "border-[#F97316] ring-1 ring-[#FDBA74]" : "border-[#D0D5DD]"
            }`}
          >
            <span className="text-[#344054]">{selectedTemplate}</span>
            <ChevronDown size={14} className={`text-[#98A2B3] transition-transform ${showDropdown ? "rotate-180" : ""}`} />
          </button>
          {showDropdown && (
            <div className="absolute left-0 top-[58px] z-50 w-[220px] overflow-hidden rounded-[6px] border border-[#E5EAF0] bg-white shadow-lg">
              <div className="border-b border-[#F0F2F5] px-3 py-2 text-[11px] text-[#98A2B3]">Select Template Type</div>
              {TEMPLATE_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(opt);
                    setShowDropdown(false);
                    removeFile();
                    setStatusMessage(null);
                  }}
                  className={`w-full px-3 py-2 text-left text-[12px] hover:bg-[#FFF7ED] ${
                    selectedTemplate === opt ? "bg-[#FFF7ED] font-medium text-[#C2410C]" : "text-[#344054]"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info banner */}
        <div className="mt-4 rounded-[6px] border border-[#ECE7FF] bg-[#F5F3FF] px-4 py-2.5 text-[12px] text-[#475467]">
          <span className="font-medium text-[#344054]">Important:</span> For future month DOJ (Date of Joining),
          change the &quot;Statutory Effective From&quot; field to text format in the Excel template before
          uploading file.
        </div>

        {/* Status banner */}
        {statusMessage && (
          <div
            className={`mt-3 rounded-[6px] border px-4 py-2.5 text-[12.5px] font-medium ${
              statusMessage.type === "success"
                ? "border-[#B7EBC6] bg-[#ECFDF3] text-[#067647]"
                : "border-[#FECDCA] bg-[#FEF3F2] text-[#B42318]"
            }`}
          >
            {statusMessage.text}
          </div>
        )}

        {/* Upload area + File Requirement side panel */}
        <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-[1fr_32%]">
          {/* Drag & drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className={`flex min-h-[270px] flex-col items-center justify-center rounded-[6px] border-2 border-dashed bg-white transition-colors ${
              isDragOver ? "border-[#F97316] bg-[#FFF7ED]" : "border-[#D0D5DD]"
            }`}
          >
            {!selectedFile ? (
              <>
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF7ED]">
                  <CloudUpload size={26} className="text-[#F97316]" />
                </div>
                <p className="text-[13px] text-[#475467]">
                  Drag and drop
                  <br />
                  - or -
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 text-[13px] font-semibold text-[#F97316] hover:underline"
                >
                  Browse
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                  className="hidden"
                />
              </>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <FileSpreadsheet size={36} className="text-[#16A34A]" />
                <p className="max-w-[240px] truncate text-[13px] font-medium text-[#344054]">{selectedFile.name}</p>
                <button
                  type="button"
                  onClick={removeFile}
                  className="flex items-center gap-1 rounded-[6px] border border-[#FECDCA] px-3 py-1.5 text-[12px] text-[#D92D20] hover:bg-[#FEF3F2]"
                >
                  <X size={13} /> Remove
                </button>
              </div>
            )}
          </div>

          {/* File Requirement panel */}
          <div className="min-h-[270px] rounded-[6px] border border-[#E5EAF0] bg-white p-4">
            <div className="mb-3 flex items-center gap-2">
              <FileCheck2 size={16} className="text-[#344054]" />
              <h3 className="text-[13px] font-semibold text-[#344054]">File Requirement</h3>
            </div>
            <div className="flex items-center gap-2 rounded-[6px] border border-[#B7EBC6] bg-[#ECFDF3] px-3 py-2.5 text-[12.5px] font-medium text-[#067647]">
              <FileCheck2 size={14} className="shrink-0" />
              Selected file should be valid
            </div>
            <p className="mt-3 text-[12px] text-[#98A2B3]">Accepted formats: .xlsx, .xls, .csv</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex justify-center gap-2">
          <button
            type="button"
            onClick={handleTemplateDownload}
            disabled={isDownloading}
            className="flex items-center gap-1.5 rounded-[6px] bg-[#667085] px-5 py-2 text-[13px] font-medium text-white hover:bg-[#475467] disabled:opacity-50"
          >
            {isDownloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            Template
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            className="flex items-center gap-1.5 rounded-[6px] bg-[#F97316] px-5 py-2 text-[13px] font-medium text-white hover:bg-[#C2410C] disabled:opacity-50"
          >
            {isUploading ? <Loader2 size={14} className="animate-spin" /> : <FileCheck2 size={14} />}
            {isUploading ? "Uploading…" : "Upload File"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportPage;
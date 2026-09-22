// import React, { useEffect, useState } from "react";
// import {
//   Eye,
//   Download,
//   Trash2,
//   Phone,
//   Mail,
//   X,
//   Maximize2,
//   Menu,
//   RotateCw,
//   Printer,
//   FileText,
//   Plus,
// } from "lucide-react";

// export interface EmployeeDocument {
//   id: string;
//   type: string;
//   description: string;
//   date: string;
//   fileUrl?: string;
// }

// interface DocumentsTabProps {
//   form: any;
//   set?: (key: string, value: any) => void;
//   documents?: EmployeeDocument[];
//   onDelete?: (doc: EmployeeDocument) => void;
//   onDownload?: (doc: EmployeeDocument) => void;
//   onAdd?: (doc: EmployeeDocument) => void;
// }

// /* ============================================================
//    DEMO DOCUMENTS
// ============================================================ */

// const DEMO_DOCUMENTS: EmployeeDocument[] = [
//   {
//     id: "1",
//     type: "Senior secondary/ Diploma",
//     description: "Senior secondary/ Diploma",
//     date: "13/Apr/2026",
//   },
//   {
//     id: "2",
//     type: "Graduation certificate",
//     description: "Graduation certificate",
//     date: "13/Apr/2026",
//   },
//   {
//     id: "3",
//     type: "Graduation certificate",
//     description: "Graduation certificate",
//     date: "13/Apr/2026",
//   },
//   {
//     id: "4",
//     type: "Post graduation certificate",
//     description: "Post graduation certificate",
//     date: "13/Apr/2026",
//   },
//   {
//     id: "5",
//     type: "Post graduation certificate",
//     description: "Post graduation certificate",
//     date: "13/Apr/2026",
//   },
//   {
//     id: "6",
//     type: "Post graduation certificate",
//     description: "Post graduation certificate",
//     date: "13/Apr/2026",
//   },
//   {
//     id: "7",
//     type: "Post graduation certificate",
//     description: "Post graduation certificate",
//     date: "13/Apr/2026",
//   },
// ];

// /* ============================================================
//    TABLE STYLES
// ============================================================ */

// const thCls =
//   "bg-[#C9E7F6] text-[#24333F] text-[12.5px] font-semibold text-left px-[18px] py-[13px] whitespace-nowrap";

// const tdCls =
//   "px-[18px] py-[13px] text-[12.5px] text-[#5B6672] border-b border-[#E6ECF1]";

// /* ============================================================
//    COMPONENT
// ============================================================ */

// const DocumentsTab: React.FC<DocumentsTabProps> = ({
//   form,
//   documents,
//   onDelete,
//   onDownload,
//   onAdd,
// }) => {
//   /* ==========================================================
//      DOCUMENT ROWS
//   ========================================================== */

//   const [rows, setRows] = useState<EmployeeDocument[]>(
//     documents ?? DEMO_DOCUMENTS
//   );

//   /* ==========================================================
//      VIEWER
//   ========================================================== */

//   const [viewerDoc, setViewerDoc] =
//     useState<EmployeeDocument | null>(null);

//   /* ==========================================================
//      DELETE CONFIRMATION
//   ========================================================== */

//   const [confirmDoc, setConfirmDoc] =
//     useState<EmployeeDocument | null>(null);

//   /* ==========================================================
//      ADD DOCUMENT MODAL
//   ========================================================== */

//   const [addDocumentOpen, setAddDocumentOpen] =
//     useState(false);

//   /* ==========================================================
//      ADD DOCUMENT FORM
//   ========================================================== */

//   const [documentType, setDocumentType] =
//     useState("");

//   const [description, setDescription] =
//     useState("");

//   const [documentDate, setDocumentDate] =
//     useState("");

//   const [selectedFile, setSelectedFile] =
//     useState<File | null>(null);

//   /* ==========================================================
//      OPEN ADD MODAL FROM EMPLOYEE DETAILS HEADER
//   ========================================================== */

//   useEffect(() => {
//     const openAddDocument = () => {
//       setAddDocumentOpen(true);
//     };

//     window.addEventListener(
//       "open-add-document",
//       openAddDocument
//     );

//     return () => {
//       window.removeEventListener(
//         "open-add-document",
//         openAddDocument
//       );
//     };
//   }, []);

//   /* ==========================================================
//      SYNC DOCUMENTS IF PROPS CHANGE
//   ========================================================== */

//   useEffect(() => {
//     if (documents) {
//       setRows(documents);
//     }
//   }, [documents]);

//   /* ==========================================================
//      DOWNLOAD
//   ========================================================== */

//   const handleDownload = (
//     doc: EmployeeDocument
//   ) => {
//     if (onDownload) {
//       onDownload(doc);
//       return;
//     }

//     if (doc.fileUrl) {
//       window.open(doc.fileUrl, "_blank");
//     } else {
//       alert("No file is attached to this document.");
//     }
//   };

//   /* ==========================================================
//      DELETE
//   ========================================================== */

//   const handleDelete = () => {
//     if (!confirmDoc) return;

//     if (onDelete) {
//       onDelete(confirmDoc);
//     }

//     setRows((prev) =>
//       prev.filter(
//         (item) => item.id !== confirmDoc.id
//       )
//     );

//     setConfirmDoc(null);
//   };

//   /* ==========================================================
//      RESET ADD FORM
//   ========================================================== */

//   const resetAddForm = () => {
//     setDocumentType("");
//     setDescription("");
//     setDocumentDate("");
//     setSelectedFile(null);
//   };

//   /* ==========================================================
//      CLOSE ADD MODAL
//   ========================================================== */

//   const closeAddModal = () => {
//     setAddDocumentOpen(false);
//     resetAddForm();
//   };

//   /* ==========================================================
//      ADD DOCUMENT
//   ========================================================== */

//   const handleAddDocument = () => {
//     if (!documentType) {
//       alert("Please select Document Type.");
//       return;
//     }

//     if (!description.trim()) {
//       alert("Please enter Description.");
//       return;
//     }

//     if (!documentDate) {
//       alert("Please select Date.");
//       return;
//     }

//     let fileUrl = "";

//     if (selectedFile) {
//       fileUrl = URL.createObjectURL(selectedFile);
//     }

//     const formattedDate = new Date(
//       documentDate
//     ).toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });

//     const newDocument: EmployeeDocument = {
//       id: Date.now().toString(),
//       type: documentType,
//       description: description.trim(),
//       date: formattedDate,
//       fileUrl,
//     };

//     setRows((prev) => [
//       ...prev,
//       newDocument,
//     ]);

//     if (onAdd) {
//       onAdd(newDocument);
//     }

//     closeAddModal();
//   };

//   return (
//     <div className="flex gap-5 min-h-[480px]">

//       {/* ======================================================
//           LEFT SIDEBAR
//       ====================================================== */}

//       <div className="w-[210px] shrink-0">

//         <div className="bg-white rounded-lg border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">

//           {/* PHOTO */}

//           <div className="pt-4 px-4 flex justify-center">

//             <div className="w-[158px] h-[188px] rounded-md overflow-hidden border border-gray-200 bg-gray-50">

//               <img
//                 src={
//                   form?.photoUrl ||
//                   "https://i.pravatar.cc/300?u=294640"
//                 }
//                 alt={
//                   form?.fullName ||
//                   "Employee"
//                 }
//                 className="w-full h-full object-cover"
//               />

//             </div>

//           </div>

//           {/* EMPLOYEE INFORMATION */}

//           <div className="px-4 pt-3 pb-4 text-center">

//             <h3 className="text-[13.5px] font-semibold text-gray-800 leading-tight tracking-tight uppercase">
//               {form?.fullName ||
//                 "BHAGYARAJA AVURAPALLI"}
//             </h3>

//             <div className="mt-1.5 inline-flex items-center px-2.5 py-[2px] rounded-full bg-[#D5ECFA] text-[#1A7CBB] text-[11px] font-medium">
//               {form?.empId || "294640"}
//             </div>

//             <p className="mt-2 text-[11px] text-gray-500 leading-[1.35]">
//               {form?.designation ||
//                 "Senior Software Engineer"}{" "}
//               |{" "}
//               {form?.branch ||
//                 "Koundinyasa Technology Services Pvt. Ltd."}
//             </p>

//             <p className="mt-1 text-[11px] text-gray-400">
//               DOJ{" "}
//               {form?.dateOfJoining ||
//                 "31/Mar/2026"}
//             </p>

//             <div className="mt-3 space-y-1.5 text-left pl-1">

//               <div className="flex items-center gap-2 text-[12px] text-gray-600">

//                 <Phone
//                   size={12}
//                   className="text-[#2196F3] shrink-0"
//                 />

//                 <span>
//                   {form?.mobile ||
//                     "9497964186"}
//                 </span>

//               </div>

//               <div className="flex items-center gap-2 text-[12px] text-gray-600">

//                 <Mail
//                   size={12}
//                   className="text-[#2196F3] shrink-0"
//                 />

//                 <span
//                   className="truncate"
//                   title={form?.email}
//                 >
//                   {form?.email ||
//                     "bhagyaraja.a@koundinyasatech.com"}
//                 </span>

//               </div>

//             </div>

//           </div>

//         </div>

//       </div>

//       {/* ======================================================
//           RIGHT DOCUMENT TABLE
//       ====================================================== */}

//       <div className="flex-1 min-w-0">

//         <div className="bg-white rounded-lg border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">

//           <div className="overflow-x-auto">

//             <table className="w-full border-collapse min-w-[620px]">

//               <thead>

//                 <tr>

//                   <th className={thCls}>
//                     Document Type
//                   </th>

//                   <th className={thCls}>
//                     Description
//                   </th>

//                   <th
//                     className={`${thCls} w-[150px]`}
//                   >
//                     Date
//                   </th>

//                   <th
//                     className={`${thCls} w-[120px] !text-center`}
//                   >
//                     Action
//                   </th>

//                 </tr>

//               </thead>

//               <tbody>

//                 {rows.length === 0 && (
//                   <tr>

//                     <td
//                       colSpan={4}
//                       className="px-[18px] py-12 text-center"
//                     >

//                       <FileText
//                         size={22}
//                         className="mx-auto mb-2 text-gray-300"
//                       />

//                       <p className="text-[13px] font-medium text-gray-500">
//                         No documents yet
//                       </p>

//                       <p className="text-[12px] text-gray-400 mt-0.5">
//                         Click Add to upload the
//                         first document.
//                       </p>

//                     </td>

//                   </tr>
//                 )}

//                 {rows.map((doc, i) => (

//                   <tr
//                     key={doc.id}
//                     className={`transition-colors hover:bg-[#F1F8FD] ${
//                       i % 2 === 1
//                         ? "bg-[#F8FBFD]"
//                         : "bg-white"
//                     }`}
//                   >

//                     <td className={tdCls}>
//                       {doc.type}
//                     </td>

//                     <td className={tdCls}>
//                       {doc.description}
//                     </td>

//                     <td className={tdCls}>
//                       {doc.date}
//                     </td>

//                     <td
//                       className={`${tdCls} text-center`}
//                     >

//                       <span className="inline-flex items-center gap-3.5">

//                         {/* VIEW */}

//                         <button
//                           type="button"
//                           title="View"
//                           onClick={() =>
//                             setViewerDoc(doc)
//                           }
//                           className="p-1 rounded text-[#2196F3] hover:bg-[#E8F4FC] transition-colors"
//                         >
//                           <Eye size={15} />
//                         </button>

//                         {/* DOWNLOAD */}

//                         <button
//                           type="button"
//                           title="Download"
//                           onClick={() =>
//                             handleDownload(doc)
//                           }
//                           className="p-1 rounded text-[#2196F3] hover:bg-[#E8F4FC] transition-colors"
//                         >
//                           <Download size={15} />
//                         </button>

//                         {/* DELETE */}

//                         <button
//                           type="button"
//                           title="Delete"
//                           onClick={() =>
//                             setConfirmDoc(doc)
//                           }
//                           className="p-1 rounded text-[#E53935] hover:bg-[#FDECEC] transition-colors"
//                         >
//                           <Trash2 size={15} />
//                         </button>

//                       </span>

//                     </td>

//                   </tr>

//                 ))}

//               </tbody>

//             </table>

//           </div>

//         </div>

//       </div>

//       {/* ======================================================
//           ADD DOCUMENT MODAL
//       ====================================================== */}

//       {addDocumentOpen && (

//         <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">

//           <div
//             className="w-[500px] max-w-[calc(100vw-30px)] bg-white rounded-lg shadow-xl"
//             onClick={(e) =>
//               e.stopPropagation()
//             }
//           >

//             {/* HEADER */}

//             <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">

//               <h3 className="text-[14px] font-semibold text-gray-800">
//                 Add Document
//               </h3>

//               <button
//                 type="button"
//                 onClick={closeAddModal}
//                 className="p-1 text-gray-500 hover:text-gray-800"
//               >
//                 <X size={17} />
//               </button>

//             </div>

//             {/* FORM */}

//             <div className="p-5 space-y-4">

//               {/* DOCUMENT TYPE */}

//               <div>

//                 <label className="block text-[12px] text-gray-500 mb-1">
//                   Document Type{" "}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <select
//                   value={documentType}
//                   onChange={(e) =>
//                     setDocumentType(
//                       e.target.value
//                     )
//                   }
//                   className="w-full h-[36px] px-3 border border-gray-300 rounded text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-[#2196F3] focus:border-[#2196F3]"
//                 >

//                   <option value="">
//                     Select Document Type
//                   </option>

//                   <option value="Aadhar">
//                     Aadhar
//                   </option>

//                   <option value="PAN Card">
//                     PAN Card
//                   </option>

//                   <option value="Driving License">
//                     Driving License
//                   </option>

//                   <option value="High school education">
//                     High school education
//                   </option>

//                   <option value="Senior secondary/ Diploma">
//                     Senior secondary/ Diploma
//                   </option>

//                   <option value="Graduation certificate">
//                     Graduation certificate
//                   </option>

//                   <option value="Post graduation certificate">
//                     Post graduation certificate
//                   </option>

//                 </select>

//               </div>

//               {/* DESCRIPTION */}

//               <div>

//                 <label className="block text-[12px] text-gray-500 mb-1">
//                   Description{" "}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <input
//                   type="text"
//                   value={description}
//                   onChange={(e) =>
//                     setDescription(
//                       e.target.value
//                     )
//                   }
//                   placeholder="Enter description"
//                   className="w-full h-[36px] px-3 border border-gray-300 rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-[#2196F3] focus:border-[#2196F3]"
//                 />

//               </div>

//               {/* DATE */}

//               <div>

//                 <label className="block text-[12px] text-gray-500 mb-1">
//                   Date{" "}
//                   <span className="text-red-500">
//                     *
//                   </span>
//                 </label>

//                 <input
//                   type="date"
//                   value={documentDate}
//                   onChange={(e) =>
//                     setDocumentDate(
//                       e.target.value
//                     )
//                   }
//                   className="w-full h-[36px] px-3 border border-gray-300 rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-[#2196F3] focus:border-[#2196F3]"
//                 />

//               </div>

//               {/* FILE */}

//               <div>

//                 <label className="block text-[12px] text-gray-500 mb-1">
//                   Upload Document
//                 </label>

//                 <input
//                   type="file"
//                   accept=".pdf,.jpg,.jpeg,.png"
//                   onChange={(e) =>
//                     setSelectedFile(
//                       e.target.files?.[0] ||
//                         null
//                     )
//                   }
//                   className="w-full h-[38px] px-3 py-1.5 border border-gray-300 rounded text-[12px] bg-white"
//                 />

//                 {selectedFile && (
//                   <p className="mt-1 text-[11px] text-gray-500">
//                     Selected:{" "}
//                     {selectedFile.name}
//                   </p>
//                 )}

//               </div>

//             </div>

//             {/* FOOTER */}

//             <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-200">

//               <button
//                 type="button"
//                 onClick={closeAddModal}
//                 className="h-[32px] px-4 text-[12px] text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={handleAddDocument}
//                 className="h-[32px] px-4 text-[12px] font-medium text-white bg-[#2196F3] rounded hover:bg-[#1976D2] flex items-center gap-1.5"
//               >
//                 <Plus size={14} />
//                 Add
//               </button>

//             </div>

//           </div>

//         </div>

//       )}

//       {/* ======================================================
//           DOCUMENT VIEWER MODAL
//       ====================================================== */}

//       {viewerDoc && (

//         <div
//           className="fixed inset-0 z-50 bg-black/50"
//           onClick={() =>
//             setViewerDoc(null)
//           }
//         >

//           <div
//             className="absolute inset-5 flex flex-col bg-white rounded-[5px] overflow-hidden shadow-[0_18px_60px_rgba(0,0,0,0.45)]"
//             onClick={(e) =>
//               e.stopPropagation()
//             }
//           >

//             {/* BLUE TITLE BAR */}

//             <div className="flex items-center justify-between h-[38px] px-3.5 shrink-0 bg-[#2196F3] text-white text-[12.5px]">

//               <span>
//                 {viewerDoc.type}
//               </span>

//               <div className="flex items-center gap-4">

//                 <button
//                   type="button"
//                   title="Expand"
//                   className="opacity-90 hover:opacity-100"
//                 >
//                   <Maximize2 size={13} />
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setViewerDoc(null)
//                   }
//                   className="flex items-center gap-1.5 opacity-90 hover:opacity-100 hover:underline"
//                 >
//                   <X size={13} />
//                   Close
//                 </button>

//               </div>

//             </div>

//             {/* TOOLBAR */}

//             <div className="flex items-center gap-2.5 h-[34px] px-2.5 shrink-0 bg-[#F4F6F7] border-b border-[#DFE4E8] text-[11px] text-[#5B6672]">

//               <button
//                 type="button"
//                 className="p-1 rounded hover:bg-[#E6EAEE] text-[#66727D]"
//               >
//                 <Menu size={13} />
//               </button>

//               <span className="flex-1 min-w-0 truncate text-[#98A3AD]">
//                 {viewerDoc.description ||
//                   viewerDoc.type}
//               </span>

//               <span className="px-2 py-[2px] bg-white border border-[#DFE4E8] rounded-[3px]">
//                 1 / 1
//               </span>

//               <span className="px-2 py-[2px] bg-white border border-[#DFE4E8] rounded-[3px]">
//                 −&nbsp;&nbsp;100%&nbsp;&nbsp;+
//               </span>

//               <button
//                 type="button"
//                 className="p-1 rounded hover:bg-[#E6EAEE] text-[#66727D]"
//                 title="Rotate"
//               >
//                 <RotateCw size={13} />
//               </button>

//               <button
//                 type="button"
//                 onClick={() =>
//                   handleDownload(viewerDoc)
//                 }
//                 className="p-1 rounded hover:bg-[#E6EAEE] text-[#66727D]"
//                 title="Download"
//               >
//                 <Download size={13} />
//               </button>

//               <button
//                 type="button"
//                 className="p-1 rounded hover:bg-[#E6EAEE] text-[#66727D]"
//                 title="Print"
//               >
//                 <Printer size={13} />
//               </button>

//             </div>

//             {/* BODY */}

//             <div className="flex-1 flex min-h-0 bg-[#525659]">

//               {/* THUMBNAIL */}

//               <div className="w-[132px] shrink-0 bg-[#F4F6F7] border-r border-[#DFE4E8] py-3 flex flex-col items-center gap-1.5 overflow-auto">

//                 <div className="w-[86px] h-[112px] bg-white border-2 border-[#2196F3] rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.18)] p-1.5 space-y-1">

//                   <div className="h-[2px] w-[70%] bg-[#DDE3E8] rounded-full" />

//                   <div className="h-[2px] w-full bg-[#DDE3E8] rounded-full" />

//                   <div className="h-[2px] w-[92%] bg-[#DDE3E8] rounded-full" />

//                   <div className="h-[2px] w-[96%] bg-[#DDE3E8] rounded-full" />

//                   <div className="h-[2px] w-[60%] bg-[#DDE3E8] rounded-full" />

//                   <div className="h-[4px] w-full bg-[#E8EDF1] rounded-sm" />

//                   <div className="h-[4px] w-full bg-[#E8EDF1] rounded-sm" />

//                 </div>

//                 <span className="text-[10px] text-[#7B8794]">
//                   1
//                 </span>

//               </div>

//               {/* PAGE */}

//               <div className="flex-1 overflow-auto flex justify-center p-5">

//                 {viewerDoc.fileUrl ? (

//                   <iframe
//                     src={viewerDoc.fileUrl}
//                     title={
//                       viewerDoc.description ||
//                       viewerDoc.type
//                     }
//                     className="w-full h-full bg-white rounded-[2px] shadow-[0_2px_10px_rgba(0,0,0,0.4)] border-0"
//                   />

//                 ) : (

//                   <div className="w-[640px] max-w-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.4)] p-10 flex flex-col items-center justify-center text-center">

//                     <FileText
//                       size={30}
//                       className="text-gray-300 mb-2.5"
//                     />

//                     <p className="text-[13px] font-medium text-gray-600">
//                       Preview not available
//                     </p>

//                     <p className="text-[12px] text-gray-400 mt-1">
//                       This document has no file
//                       attached yet.
//                     </p>

//                   </div>

//                 )}

//               </div>

//             </div>

//           </div>

//         </div>

//       )}

//       {/* ======================================================
//           DELETE CONFIRMATION
//       ====================================================== */}

//       {confirmDoc && (

//         <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">

//           <div className="w-[360px] bg-white rounded-lg shadow-xl p-5">

//             <h4 className="text-[14px] font-semibold text-gray-800">
//               Delete document
//             </h4>

//             <p className="mt-1.5 text-[12.5px] text-gray-500 leading-relaxed">

//               {confirmDoc.description ||
//                 confirmDoc.type}{" "}
//               will be removed from this
//               employee's records. This can't
//               be undone.

//             </p>

//             <div className="mt-4 flex justify-end gap-2">

//               <button
//                 type="button"
//                 onClick={() =>
//                   setConfirmDoc(null)
//                 }
//                 className="h-[30px] px-3 text-[12px] text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
//               >
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={handleDelete}
//                 className="h-[30px] px-3.5 text-[12px] font-medium text-white bg-[#E53935] rounded hover:bg-[#C62828]"
//               >
//                 Delete
//               </button>

//             </div>

//           </div>

//         </div>

//       )}

//     </div>
//   );
// };

// export default DocumentsTab;














import React, { useEffect, useState } from "react";
import {
  Eye,
  Download,
  Trash2,
  Phone,
  Mail,
  X,
  Maximize2,
  Menu,
  RotateCw,
  Printer,
  FileText,
  Plus,
} from "lucide-react";

export interface EmployeeDocument {
  id: string;
  type: string;
  description: string;
  date: string;
  fileUrl?: string;
}

interface DocumentsTabProps {
  form: any;
  set?: (key: string, value: any) => void;
  documents?: EmployeeDocument[];
  onDelete?: (doc: EmployeeDocument) => void;
  onDownload?: (doc: EmployeeDocument) => void;
  onAdd?: (doc: EmployeeDocument) => void;
}

/* ============================================================
   DEMO DOCUMENTS
============================================================ */

const DEMO_DOCUMENTS: EmployeeDocument[] = [
  {
    id: "1",
    type: "Senior secondary/ Diploma",
    description: "Senior secondary/ Diploma",
    date: "13/Apr/2026",
  },
  {
    id: "2",
    type: "Graduation certificate",
    description: "Graduation certificate",
    date: "13/Apr/2026",
  },
  {
    id: "3",
    type: "Graduation certificate",
    description: "Graduation certificate",
    date: "13/Apr/2026",
  },
  {
    id: "4",
    type: "Post graduation certificate",
    description: "Post graduation certificate",
    date: "13/Apr/2026",
  },
  {
    id: "5",
    type: "Post graduation certificate",
    description: "Post graduation certificate",
    date: "13/Apr/2026",
  },
  {
    id: "6",
    type: "Post graduation certificate",
    description: "Post graduation certificate",
    date: "13/Apr/2026",
  },
  {
    id: "7",
    type: "Post graduation certificate",
    description: "Post graduation certificate",
    date: "13/Apr/2026",
  },
];

/* ============================================================
   TABLE STYLES
============================================================ */

const thCls =
  "bg-[#FFF5EE] text-[#131313] text-[12.5px] font-medium text-left px-[18px] py-[13px] whitespace-nowrap";

const tdCls =
  "px-[18px] py-[13px] text-[12.5px] text-[#626262] border-b border-[#E2E2E2]";

/* ============================================================
   COMPONENT
============================================================ */

const DocumentsTab: React.FC<DocumentsTabProps> = ({
  form,
  documents,
  onDelete,
  onDownload,
  onAdd,
}) => {
  /* ==========================================================
     DOCUMENT ROWS
  ========================================================== */

  const [rows, setRows] = useState<EmployeeDocument[]>(
    documents ?? DEMO_DOCUMENTS
  );

  /* ==========================================================
     VIEWER
  ========================================================== */

  const [viewerDoc, setViewerDoc] =
    useState<EmployeeDocument | null>(null);

  /* ==========================================================
     DELETE CONFIRMATION
  ========================================================== */

  const [confirmDoc, setConfirmDoc] =
    useState<EmployeeDocument | null>(null);

  /* ==========================================================
     ADD DOCUMENT MODAL
  ========================================================== */

  const [addDocumentOpen, setAddDocumentOpen] =
    useState(false);

  /* ==========================================================
     ADD DOCUMENT FORM
  ========================================================== */

  const [documentType, setDocumentType] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [documentDate, setDocumentDate] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  /* ==========================================================
     OPEN ADD MODAL FROM EMPLOYEE DETAILS HEADER
  ========================================================== */

  useEffect(() => {
    const openAddDocument = () => {
      setAddDocumentOpen(true);
    };

    window.addEventListener(
      "open-add-document",
      openAddDocument
    );

    return () => {
      window.removeEventListener(
        "open-add-document",
        openAddDocument
      );
    };
  }, []);

  /* ==========================================================
     SYNC DOCUMENTS IF PROPS CHANGE
  ========================================================== */

  useEffect(() => {
    if (documents) {
      setRows(documents);
    }
  }, [documents]);

  /* ==========================================================
     DOWNLOAD
  ========================================================== */

  const handleDownload = (
    doc: EmployeeDocument
  ) => {
    if (onDownload) {
      onDownload(doc);
      return;
    }

    if (doc.fileUrl) {
      window.open(doc.fileUrl, "_blank");
    } else {
      alert("No file is attached to this document.");
    }
  };

  /* ==========================================================
     DELETE
  ========================================================== */

  const handleDelete = () => {
    if (!confirmDoc) return;

    if (onDelete) {
      onDelete(confirmDoc);
    }

    setRows((prev) =>
      prev.filter(
        (item) => item.id !== confirmDoc.id
      )
    );

    setConfirmDoc(null);
  };

  /* ==========================================================
     RESET ADD FORM
  ========================================================== */

  const resetAddForm = () => {
    setDocumentType("");
    setDescription("");
    setDocumentDate("");
    setSelectedFile(null);
  };

  /* ==========================================================
     CLOSE ADD MODAL
  ========================================================== */

  const closeAddModal = () => {
    setAddDocumentOpen(false);
    resetAddForm();
  };

  /* ==========================================================
     ADD DOCUMENT
  ========================================================== */

  const handleAddDocument = () => {
    if (!documentType) {
      alert("Please select Document Type.");
      return;
    }

    if (!description.trim()) {
      alert("Please enter Description.");
      return;
    }

    if (!documentDate) {
      alert("Please select Date.");
      return;
    }

    let fileUrl = "";

    if (selectedFile) {
      fileUrl = URL.createObjectURL(selectedFile);
    }

    const formattedDate = new Date(
      documentDate
    ).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const newDocument: EmployeeDocument = {
      id: Date.now().toString(),
      type: documentType,
      description: description.trim(),
      date: formattedDate,
      fileUrl,
    };

    setRows((prev) => [
      ...prev,
      newDocument,
    ]);

    if (onAdd) {
      onAdd(newDocument);
    }

    closeAddModal();
  };

  return (
    <div className="flex gap-5 min-h-[480px]">

      {/* ======================================================
          LEFT SIDEBAR
      ====================================================== */}

      <div className="w-[210px] shrink-0">

        <div className="bg-white rounded-lg border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">

          {/* PHOTO */}

          <div className="pt-4 px-4 flex justify-center">

            <div className="w-[158px] h-[188px] rounded-md overflow-hidden border border-gray-200 bg-gray-50">

              <img
                src={
                  form?.photoUrl ||
                  "https://i.pravatar.cc/300?u=294640"
                }
                alt={
                  form?.fullName ||
                  "Employee"
                }
                className="w-full h-full object-cover"
              />

            </div>

          </div>

          {/* EMPLOYEE INFORMATION */}

          <div className="px-4 pt-3 pb-4 text-center">

            <h3 className="text-[13.5px] font-semibold text-gray-800 leading-tight tracking-tight uppercase">
              {form?.fullName ||
                "BHAGYARAJA AVURAPALLI"}
            </h3>

            <div className="mt-1.5 inline-flex items-center px-2.5 py-[2px] rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[11px] font-medium">
              {form?.empId || "294640"}
            </div>

            <p className="mt-2 text-[11px] text-gray-500 leading-[1.35]">
              {form?.designation ||
                "Senior Software Engineer"}{" "}
              |{" "}
              {form?.branch ||
                "Koundinyasa Technology Services Pvt. Ltd."}
            </p>

            <p className="mt-1 text-[11px] text-gray-400">
              DOJ{" "}
              {form?.dateOfJoining ||
                "31/Mar/2026"}
            </p>

            <div className="mt-3 space-y-1.5 text-left pl-1">

              <div className="flex items-center gap-2 text-[12px] text-gray-600">

                <Phone
                  size={12}
                  className="text-[#F97316] shrink-0"
                />

                <span>
                  {form?.mobile ||
                    "9497964186"}
                </span>

              </div>

              <div className="flex items-center gap-2 text-[12px] text-gray-600">

                <Mail
                  size={12}
                  className="text-[#F97316] shrink-0"
                />

                <span
                  className="truncate"
                  title={form?.email}
                >
                  {form?.email ||
                    "bhagyaraja.a@koundinyasatech.com"}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          RIGHT DOCUMENT TABLE
      ====================================================== */}

      <div className="flex-1 min-w-0">

        <div className="bg-white rounded-lg border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full border-collapse min-w-[620px]">

              <thead>

                <tr>

                  <th className={thCls}>
                    Document Type
                  </th>

                  <th className={thCls}>
                    Description
                  </th>

                  <th
                    className={`${thCls} w-[150px]`}
                  >
                    Date
                  </th>

                  <th
                    className={`${thCls} w-[120px] !text-center`}
                  >
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {rows.length === 0 && (
                  <tr>

                    <td
                      colSpan={4}
                      className="px-[18px] py-12 text-center"
                    >

                      <FileText
                        size={22}
                        className="mx-auto mb-2 text-gray-300"
                      />

                      <p className="text-[13px] font-medium text-gray-500">
                        No documents yet
                      </p>

                      <p className="text-[12px] text-gray-400 mt-0.5">
                        Click Add to upload the
                        first document.
                      </p>

                    </td>

                  </tr>
                )}

                {rows.map((doc, i) => (

                  <tr
                    key={doc.id}
                    className={`transition-colors hover:bg-[#F1F8FD] ${
                      i % 2 === 1
                        ? "bg-[#F8FBFD]"
                        : "bg-white"
                    }`}
                  >

                    <td className={tdCls}>
                      {doc.type}
                    </td>

                    <td className={tdCls}>
                      {doc.description}
                    </td>

                    <td className={tdCls}>
                      {doc.date}
                    </td>

                    <td
                      className={`${tdCls} text-center`}
                    >

                      <span className="inline-flex items-center gap-3.5">

                        {/* VIEW */}

                        <button
                          type="button"
                          title="View"
                          onClick={() =>
                            setViewerDoc(doc)
                          }
                          className="p-1 rounded text-[#F97316] hover:bg-[#FFF4E8] transition-colors"
                        >
                          <Eye size={15} />
                        </button>

                        {/* DOWNLOAD */}

                        <button
                          type="button"
                          title="Download"
                          onClick={() =>
                            handleDownload(doc)
                          }
                          className="p-1 rounded text-[#F97316] hover:bg-[#FFF4E8] transition-colors"
                        >
                          <Download size={15} />
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          title="Delete"
                          onClick={() =>
                            setConfirmDoc(doc)
                          }
                          className="p-1 rounded text-[#E53935] hover:bg-[#FDECEC] transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>

                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

      {/* ======================================================
          ADD DOCUMENT MODAL
      ====================================================== */}

      {addDocumentOpen && (

        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">

          <div
            className="w-[500px] max-w-[calc(100vw-30px)] bg-white rounded-lg shadow-xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">

              <h3 className="text-[14px] font-semibold text-gray-800">
                Add Document
              </h3>

              <button
                type="button"
                onClick={closeAddModal}
                className="p-1 text-gray-500 hover:text-gray-800"
              >
                <X size={17} />
              </button>

            </div>

            {/* FORM */}

            <div className="p-5 space-y-4">

              {/* DOCUMENT TYPE */}

              <div>

                <label className="block text-[12px] text-gray-500 mb-1">
                  Document Type{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <select
                  value={documentType}
                  onChange={(e) =>
                    setDocumentType(
                      e.target.value
                    )
                  }
                  className="w-full h-[36px] px-3 border border-gray-300 rounded text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-[#F97316] focus:border-[#F97316]"
                >

                  <option value="">
                    Select Document Type
                  </option>

                  <option value="Aadhar">
                    Aadhar
                  </option>

                  <option value="PAN Card">
                    PAN Card
                  </option>

                  <option value="Driving License">
                    Driving License
                  </option>

                  <option value="High school education">
                    High school education
                  </option>

                  <option value="Senior secondary/ Diploma">
                    Senior secondary/ Diploma
                  </option>

                  <option value="Graduation certificate">
                    Graduation certificate
                  </option>

                  <option value="Post graduation certificate">
                    Post graduation certificate
                  </option>

                </select>

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-[12px] text-gray-500 mb-1">
                  Description{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Enter description"
                  className="w-full h-[36px] px-3 border border-gray-300 rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-[#F97316] focus:border-[#F97316]"
                />

              </div>

              {/* DATE */}

              <div>

                <label className="block text-[12px] text-gray-500 mb-1">
                  Date{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="date"
                  value={documentDate}
                  onChange={(e) =>
                    setDocumentDate(
                      e.target.value
                    )
                  }
                  className="w-full h-[36px] px-3 border border-gray-300 rounded text-[13px] focus:outline-none focus:ring-1 focus:ring-[#F97316] focus:border-[#F97316]"
                />

              </div>

              {/* FILE */}

              <div>

                <label className="block text-[12px] text-gray-500 mb-1">
                  Upload Document
                </label>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setSelectedFile(
                      e.target.files?.[0] ||
                        null
                    )
                  }
                  className="w-full h-[38px] px-3 py-1.5 border border-gray-300 rounded text-[12px] bg-white"
                />

                {selectedFile && (
                  <p className="mt-1 text-[11px] text-gray-500">
                    Selected:{" "}
                    {selectedFile.name}
                  </p>
                )}

              </div>

            </div>

            {/* FOOTER */}

            <div className="flex justify-end gap-2 px-5 py-3 border-t border-gray-200">

              <button
                type="button"
                onClick={closeAddModal}
                className="h-[32px] px-4 text-[12px] text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleAddDocument}
                className="h-[32px] px-4 text-[12px] font-medium text-white bg-[#F97316] rounded hover:bg-[#C2410C] flex items-center gap-1.5"
              >
                <Plus size={14} />
                Add
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ======================================================
          DOCUMENT VIEWER MODAL
      ====================================================== */}

      {viewerDoc && (

        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() =>
            setViewerDoc(null)
          }
        >

          <div
            className="absolute inset-5 flex flex-col bg-white rounded-[5px] overflow-hidden shadow-[0_18px_60px_rgba(0,0,0,0.45)]"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* TITLE BAR */}

            <div className="flex items-center justify-between h-[38px] px-3.5 shrink-0 bg-[#F97316] text-white text-[12.5px]">

              <span>
                {viewerDoc.type}
              </span>

              <div className="flex items-center gap-4">

                <button
                  type="button"
                  title="Expand"
                  className="opacity-90 hover:opacity-100"
                >
                  <Maximize2 size={13} />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setViewerDoc(null)
                  }
                  className="flex items-center gap-1.5 opacity-90 hover:opacity-100 hover:underline"
                >
                  <X size={13} />
                  Close
                </button>

              </div>

            </div>

            {/* TOOLBAR */}

            <div className="flex items-center gap-2.5 h-[34px] px-2.5 shrink-0 bg-[#F4F6F7] border-b border-[#DFE4E8] text-[11px] text-[#5B6672]">

              <button
                type="button"
                className="p-1 rounded hover:bg-[#E6EAEE] text-[#66727D]"
              >
                <Menu size={13} />
              </button>

              <span className="flex-1 min-w-0 truncate text-[#98A3AD]">
                {viewerDoc.description ||
                  viewerDoc.type}
              </span>

              <span className="px-2 py-[2px] bg-white border border-[#DFE4E8] rounded-[3px]">
                1 / 1
              </span>

              <span className="px-2 py-[2px] bg-white border border-[#DFE4E8] rounded-[3px]">
                −&nbsp;&nbsp;100%&nbsp;&nbsp;+
              </span>

              <button
                type="button"
                className="p-1 rounded hover:bg-[#E6EAEE] text-[#66727D]"
                title="Rotate"
              >
                <RotateCw size={13} />
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDownload(viewerDoc)
                }
                className="p-1 rounded hover:bg-[#E6EAEE] text-[#66727D]"
                title="Download"
              >
                <Download size={13} />
              </button>

              <button
                type="button"
                className="p-1 rounded hover:bg-[#E6EAEE] text-[#66727D]"
                title="Print"
              >
                <Printer size={13} />
              </button>

            </div>

            {/* BODY */}

            <div className="flex-1 flex min-h-0 bg-[#525659]">

              {/* THUMBNAIL */}

              <div className="w-[132px] shrink-0 bg-[#F4F6F7] border-r border-[#DFE4E8] py-3 flex flex-col items-center gap-1.5 overflow-auto">

                <div className="w-[86px] h-[112px] bg-white border-2 border-[#F97316] rounded-[2px] shadow-[0_1px_3px_rgba(0,0,0,0.18)] p-1.5 space-y-1">

                  <div className="h-[2px] w-[70%] bg-[#DDE3E8] rounded-full" />

                  <div className="h-[2px] w-full bg-[#DDE3E8] rounded-full" />

                  <div className="h-[2px] w-[92%] bg-[#DDE3E8] rounded-full" />

                  <div className="h-[2px] w-[96%] bg-[#DDE3E8] rounded-full" />

                  <div className="h-[2px] w-[60%] bg-[#DDE3E8] rounded-full" />

                  <div className="h-[4px] w-full bg-[#E8EDF1] rounded-sm" />

                  <div className="h-[4px] w-full bg-[#E8EDF1] rounded-sm" />

                </div>

                <span className="text-[10px] text-[#7B8794]">
                  1
                </span>

              </div>

              {/* PAGE */}

              <div className="flex-1 overflow-auto flex justify-center p-5">

                {viewerDoc.fileUrl ? (

                  <iframe
                    src={viewerDoc.fileUrl}
                    title={
                      viewerDoc.description ||
                      viewerDoc.type
                    }
                    className="w-full h-full bg-white rounded-[2px] shadow-[0_2px_10px_rgba(0,0,0,0.4)] border-0"
                  />

                ) : (

                  <div className="w-[640px] max-w-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.4)] p-10 flex flex-col items-center justify-center text-center">

                    <FileText
                      size={30}
                      className="text-gray-300 mb-2.5"
                    />

                    <p className="text-[13px] font-medium text-gray-600">
                      Preview not available
                    </p>

                    <p className="text-[12px] text-gray-400 mt-1">
                      This document has no file
                      attached yet.
                    </p>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      )}

      {/* ======================================================
          DELETE CONFIRMATION
      ====================================================== */}

      {confirmDoc && (

        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">

          <div className="w-[360px] bg-white rounded-lg shadow-xl p-5">

            <h4 className="text-[14px] font-semibold text-gray-800">
              Delete document
            </h4>

            <p className="mt-1.5 text-[12.5px] text-gray-500 leading-relaxed">

              {confirmDoc.description ||
                confirmDoc.type}{" "}
              will be removed from this
              employee's records. This can't
              be undone.

            </p>

            <div className="mt-4 flex justify-end gap-2">

              <button
                type="button"
                onClick={() =>
                  setConfirmDoc(null)
                }
                className="h-[30px] px-3 text-[12px] text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="h-[30px] px-3.5 text-[12px] font-medium text-white bg-[#E53935] rounded hover:bg-[#C62828]"
              >
                Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default DocumentsTab;
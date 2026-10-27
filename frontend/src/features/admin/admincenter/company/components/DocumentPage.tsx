// import React, { useState } from "react";
// import {Search,Plus,Clock,Filter,List,X,Upload} from "lucide-react";

// interface Document {
//   id: number;
//   documentName: string;
//   description: string;
//   date: string;
//   extension: string;
//   showInSIA: string;
// }

// const tabs = [
//   "Document",
//   "Contact Details",
//   "Subscription Details",
// ];

// const tableHeaders = [
//   "Document Name",
//   "Description",
//   "Date",
//   "File Extension",
//   "Show in SIA",
//   "Action",
// ];

// const documents: Document[] = [];

// export default function DocumentPage() {
//   const [activeTab, setActiveTab] = useState("Subscription Details");
//   const [search, setSearch] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const [documentName, setDocumentName] = useState("");
//   const [description, setDescription] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [showInSIA, setShowInSIA] = useState(true);


//   return (
//     <div className="w-full min-h-screen bg-[#F7F5FF] p-5">

//       {/* Top Tabs */}

//       <div className="rounded-xl bg-[#E8E0FF] px-6 py-4">

//         <div className="flex items-center justify-between">

//           {/* Left Tabs */}

//           <div className="flex gap-12">


            

//             {tabs.map((tab) => (

//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`relative pb-2 text-[15px] font-medium transition-all ${activeTab === tab
//                     ? "text-[#6C4BFF]"
//                     : "text-gray-700"
//                   }`}
//               >
//                 {tab}

//                 {activeTab === tab && (
//                   <span className="absolute left-0 bottom-0 h-[2px] w-full rounded bg-[#6C4BFF]" />
//                 )}

//               </button>

//             ))}

//           </div>

//           {/* Right Actions */}

//           <div className="flex items-center gap-4">

//             {/* Search */}

//             <div className="relative">

//               <Search
//                 size={16}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//               />

//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="h-10 w-64 rounded-full border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-violet-500"
//               />

//             </div>
//             <button
//               onClick={() => setShowModal(true)}
//               className="flex items-center gap-2 rounded-md bg-[#6C4BFF] px-5 py-2.5 text-white"
//             >
//               <Plus size={18} />
//               Add Document
//             </button>

//             {/* History */}

//             <button className="rounded-full p-2">

//               <Clock
//                 size={22}
//                 className="text-gray-600"
//               />

//             </button>

//           </div>

//         </div>

//       </div>

//       {/* Toolbar */}

//       {/* Toolbar */}

//       <div className="mt-5 flex items-center justify-between rounded-xl border bg-white px-5 py-3">

//         <div className="flex items-center gap-3">

//           <button className="rounded-lg border p-2 hover:bg-gray-100">
//             <List size={18} />
//           </button>

//           <button className="rounded-lg border p-2 hover:bg-gray-100">
//             <X size={18} className="text-red-500" />
//           </button>

//         </div>

//         <div className="flex items-center gap-3">

//           <button className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
//             <Filter size={16} />
//             Filter
//           </button>

//           <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
//             Export
//           </button>

//           <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
//             Sort
//           </button>

//         </div>

//       </div>

//       {/* Table */}

//       <div className="mt-5 overflow-hidden rounded-2xl border bg-white">
//         <div className="bg-[#E8E0FF]">

//           <div className="grid grid-cols-6 px-8 py-5">

//             {tableHeaders.map((header) => (

//               <div
//                 key={header}
//                 className="flex items-center gap-2 text-sm font-semibold text-gray-700"
//               >
//                 <span>{header}</span>

//                 {header !== "Action" && (
//                   <Filter
//                     size={14}
//                     className="text-gray-500"
//                   />
//                 )}

//               </div>

//             ))}

//           </div>

//         </div>

//         {/* Empty State */}

//         {documents.length === 0 ? (

//           <div className="flex min-h-[420px] flex-col items-center justify-center">

//             <img
//               src="/assets/Documentpage.png"
//               alt="No Record"
//               className="mb-8 w-72"
//             />

//             <h2 className="text-2xl font-semibold text-gray-700">
//               No Record Found
//             </h2>

//             <p className="mt-3 text-base text-gray-500">
//               There are no documents available.
//             </p>

//           </div>

//         ) : (

//           <div>

//             {documents.map((document) => (

//               <div
//                 key={document.id}
//                 className="grid grid-cols-6 border-t px-8 py-5 hover:bg-gray-50"
//               >

//                 <div>{document.documentName}</div>

//                 <div>{document.description}</div>

//                 <div>{document.date}</div>

//                 <div>{document.extension}</div>

//                 <div>{document.showInSIA}</div>

//                 <div className="flex gap-3">

//                   <button className="text-blue-600 hover:underline">
//                     View
//                   </button>

//                   <button className="text-green-600 hover:underline">
//                     Edit
//                   </button>

//                   <button className="text-red-600 hover:underline">
//                     Delete
//                   </button>

//                 </div>

//               </div>

//             ))}

//           </div>

//         )}

//       </div>
//       {showModal && (

//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

//           <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">

//             <div className="mb-6 flex items-center justify-between">

//               <h2 className="text-2xl font-semibold">
//                 Add Document
//               </h2>

//               <button onClick={() => setShowModal(false)}>
//                 <X />
//               </button>

//             </div>

//             <div className="space-y-5">

//               <div>

//                 <label className="mb-2 block text-sm font-medium">
//                   Document Name
//                 </label>

//                 <input
//                   value={documentName}
//                   onChange={(e) => setDocumentName(e.target.value)}
//                   className="w-full rounded-lg border p-3"
//                   placeholder="Enter document name"
//                 />

//               </div>

//               <div>

//                 <label className="mb-2 block text-sm font-medium">
//                   Description
//                 </label>

//                 <textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   className="h-28 w-full rounded-lg border p-3"
//                   placeholder="Enter description"
//                 />

//               </div>

//               <div>

//                 <label className="mb-2 block text-sm font-medium">
//                   Upload File
//                 </label>

//                 <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-violet-300 p-8">

//                   <Upload
//                     size={32}
//                     className="mb-3 text-violet-600"
//                   />

//                   <p className="text-sm text-gray-600">
//                     Click to Upload
//                   </p>

//                   <input
//                     type="file"
//                     className="hidden"
//                     onChange={(e) =>
//                       setFile(e.target.files?.[0] || null)
//                     }
//                   />

//                 </label>

//                 {file && (

//                   <p className="mt-2 text-sm text-green-600">
//                     {file.name}
//                   </p>

//                 )}

//               </div>

//               <div className="flex items-center justify-between rounded-lg border p-4">

//                 <span className="font-medium">
//                   Show in SIA
//                 </span>

//                 <button
//                   onClick={() => setShowInSIA(!showInSIA)}
//                   className={`relative h-7 w-14 rounded-full transition ${showInSIA
//                       ? "bg-green-500"
//                       : "bg-gray-300"
//                     }`}
//                 >

//                   <span
//                     className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${showInSIA
//                         ? "left-8"
//                         : "left-1"
//                       }`}
//                   />

//                 </button>

//               </div>

//               <div className="flex justify-end gap-3">

//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="rounded-lg border px-5 py-2"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   className="rounded-lg bg-[#6C4BFF] px-6 py-2 text-white"
//                 >
//                   Save
//                 </button>

//               </div>

//             </div>

//           </div>

//         </div>

//       )}

//     </div>

//   );
// }




// import React, { useState } from "react";
// import {
//   Search,
//   Plus,
//   Clock,
//   Filter,
//   List,
//   X,
//   Upload,
// } from "lucide-react";

// interface Document {
//   id: number;
//   documentName: string;
//   description: string;
//   date: string;
//   extension: string;
//   showInSIA: string;
// }

// const tabs = [
//   "Document",
//   "Contact Details",
//   "Subscription Details",
// ];

// const tableHeaders = [
//   "Document Name",
//   "Description",
//   "Date",
//   "File Extension",
//   "Show in SIA",
//   "Action",
// ];

// const documents: Document[] = [];

// export default function DocumentPage() {
//   const [activeTab, setActiveTab] = useState("Subscription Details");
//   const [search, setSearch] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   const [documentName, setDocumentName] = useState("");
//   const [description, setDescription] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [showInSIA, setShowInSIA] = useState(true);

//   return (
//     <div className="w-full min-h-screen bg-[#F7F5FF] p-5">

//       {/* Top Tabs */}
//       <div className="rounded-xl bg-[#E8E0FF] px-6 py-4">
//         <div className="flex items-center justify-between">

//           {/* Left Tabs */}
//           <div className="flex gap-12">
//             {tabs.map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`relative pb-2 text-[15px] font-medium transition-all ${
//                   activeTab === tab
//                     ? "text-[#6C4BFF]"
//                     : "text-gray-700"
//                 }`}
//               >
//                 {tab}

//                 {activeTab === tab && (
//                   <span className="absolute left-0 bottom-0 h-[2px] w-full rounded bg-[#6C4BFF]" />
//                 )}
//               </button>
//             ))}
//           </div>

//           {/* Right Actions */}
//           <div className="flex items-center gap-4">

//             {/* Search */}
//             <div className="relative">
//               <Search
//                 size={16}
//                 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
//               />

//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 className="h-10 w-64 rounded-full border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 outline-none focus:border-violet-500"
//               />
//             </div>

//             <button
//               onClick={() => setShowModal(true)}
//               className="flex items-center gap-2 rounded-md bg-[#6C4BFF] px-5 py-2.5 text-white"
//             >
//               <Plus size={18} />
//               Add Document
//             </button>

//             {/* History */}
//             <button className="rounded-full p-2">
//               <Clock
//                 size={22}
//                 className="text-gray-600"
//               />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Toolbar */}
//       <div className="mt-5 flex items-center justify-between rounded-xl border bg-white px-5 py-3">

//         <div className="flex items-center gap-3">
//           <button className="rounded-lg border p-2 hover:bg-gray-100">
//             <List size={18} />
//           </button>

//           <button className="rounded-lg border p-2 hover:bg-gray-100">
//             <X size={18} className="text-red-500" />
//           </button>
//         </div>

//         <div className="flex items-center gap-3">
//           <button className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
//             <Filter size={16} />
//             Filter
//           </button>

//           <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
//             Export
//           </button>

//           <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
//             Sort
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="mt-5 overflow-hidden rounded-2xl border bg-white">

//         <div className="bg-[#E8E0FF]">
//           <div className="grid grid-cols-6 px-8 py-5">

//             {tableHeaders.map((header) => (
//               <div
//                 key={header}
//                 className="flex items-center gap-2 text-sm font-semibold text-gray-700"
//               >
//                 <span>{header}</span>

//                 {header !== "Action" && (
//                   <Filter
//                     size={14}
//                     className="text-gray-500"
//                   />
//                 )}
//               </div>
//             ))}

//           </div>
//         </div>

//         {/* Empty State */}
//         {documents.length === 0 ? (
//           <div className="flex min-h-[420px] flex-col items-center justify-center">

//             <img
//               src="/assets/Documentpage.png"
//               alt="No Record"
//               className="mb-8 w-72"
//             />

//             <h2 className="text-2xl font-semibold text-gray-700">
//               No Record Found
//             </h2>

//             <p className="mt-3 text-base text-gray-500">
//               There are no documents available.
//             </p>

//           </div>
//         ) : (
//           <div>
//             {documents.map((document) => (
//               <div
//                 key={document.id}
//                 className="grid grid-cols-6 border-t px-8 py-5 hover:bg-gray-50"
//               >
//                 <div>{document.documentName}</div>
//                 <div>{document.description}</div>
//                 <div>{document.date}</div>
//                 <div>{document.extension}</div>
//                 <div>{document.showInSIA}</div>

//                 <div className="flex gap-3">
//                   <button className="text-blue-600 hover:underline">
//                     View
//                   </button>

//                   <button className="text-green-600 hover:underline">
//                     Edit
//                   </button>

//                   <button className="text-red-600 hover:underline">
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Add Document Modal */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

//           <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl">

//             <div className="mb-6 flex items-center justify-between">
//               <h2 className="text-2xl font-semibold">
//                 Add Document
//               </h2>

//               <button onClick={() => setShowModal(false)}>
//                 <X />
//               </button>
//             </div>

//             <div className="space-y-5">

//               {/* Document Name */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium">
//                   Document Name
//                 </label>

//                 <input
//                   value={documentName}
//                   onChange={(e) => setDocumentName(e.target.value)}
//                   className="w-full rounded-lg border p-3"
//                   placeholder="Enter document name"
//                 />
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium">
//                   Description
//                 </label>

//                 <textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   className="h-28 w-full rounded-lg border p-3"
//                   placeholder="Enter description"
//                 />
//               </div>

//               {/* Upload */}
//               <div>
//                 <label className="mb-2 block text-sm font-medium">
//                   Upload File
//                 </label>

//                 <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-violet-300 p-8">

//                   <Upload
//                     size={32}
//                     className="mb-3 text-violet-600"
//                   />

//                   <p className="text-sm text-gray-600">
//                     Click to Upload
//                   </p>

//                   <input
//                     type="file"
//                     className="hidden"
//                     onChange={(e) =>
//                       setFile(e.target.files?.[0] || null)
//                     }
//                   />
//                 </label>

//                 {file && (
//                   <p className="mt-2 text-sm text-green-600">
//                     {file.name}
//                   </p>
//                 )}
//               </div>

//               {/* Show in SIA */}
//               <div className="flex items-center justify-between rounded-lg border p-4">

//                 <span className="font-medium">
//                   Show in SIA
//                 </span>

//                 <button
//                   onClick={() => setShowInSIA(!showInSIA)}
//                   className={`relative h-7 w-14 rounded-full transition ${
//                     showInSIA
//                       ? "bg-green-500"
//                       : "bg-gray-300"
//                   }`}
//                 >
//                   <span
//                     className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
//                       showInSIA
//                         ? "left-8"
//                         : "left-1"
//                     }`}
//                   />
//                 </button>

//               </div>

//               {/* Buttons */}
//               <div className="flex justify-end gap-3">

//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="rounded-lg border px-5 py-2"
//                 >
//                   Cancel
//                 </button>

//                 <button
//                   className="rounded-lg bg-[#6C4BFF] px-6 py-2 text-white"
//                 >
//                   Save
//                 </button>

//               </div>

//             </div>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// }








// import React, { useState } from "react";
// import { Filter, X, Upload } from "lucide-react";
// import documentImage from "../../../../../assets/images/documentImage.png";

// interface Document {
//   id: number;
//   documentName: string;
//   description: string;
//   date: string;
//   extension: string;
//   showInSIA: string;
// }

// const tableHeaders = [
//   "Document Name",
//   "Description",
//   "Date",
//   "File Extension",
//   "Show in SIA",
//   "Action",
// ];

// const documents: Document[] = [];

// export default function DocumentPage() {
//   const [showModal, setShowModal] = useState(false);
//   const [documentName, setDocumentName] = useState("");
//   const [description, setDescription] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [showInSIA, setShowInSIA] = useState(true);

//   return (
//     <div className="w-full">
//       <div className="overflow-hidden rounded-2xl border bg-white">

//         {/* TABLE HEADER - Desktop */}
//         <div className="hidden bg-[#E8E0FF] md:block">
//           <div className="grid grid-cols-6 px-6 py-4 lg:px-8 lg:py-5">
//             {tableHeaders.map((header) => (
//               <div
//                 key={header}
//                 className="flex items-center gap-2 text-sm font-semibold text-gray-700"
//               >
//                 <span className="truncate">{header}</span>
//                 {header !== "Action" && (
//                   <Filter size={14} className="flex-shrink-0 text-gray-500" />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* TABLE HEADER - Mobile */}
//         <div className="bg-[#E8E0FF] px-4 py-3 md:hidden">
//           <p className="text-sm font-semibold text-gray-700">Documents</p>
//         </div>

//         {/* EMPTY STATE */}
//         {documents.length === 0 ? (
//           <div className="flex min-h-[340px] flex-col items-center justify-center px-4 py-10 sm:min-h-[400px]">
//             <img
//               src={documentImage}
//               alt="No Documents"
//               className="mb-5 w-48 sm:mb-6 sm:w-64 md:w-72"
//             />
//             <p className="text-center text-sm text-gray-500 sm:text-base">
//               Did Not Find Any Documents
//             </p>
//             <div className="mt-5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs text-gray-500 shadow-sm sm:text-sm">
//               No Record Found
//             </div>
//           </div>
//         ) : (
//           <div>
//             {documents.map((document) => (
//               <div
//                 key={document.id}
//                 className="grid grid-cols-1 gap-3 border-t px-4 py-4 hover:bg-gray-50 sm:grid-cols-2 md:grid-cols-6 md:gap-0 md:px-8 md:py-5"
//               >
//                 <div>
//                   <span className="text-xs font-medium text-gray-400 md:hidden">Document Name</span>
//                   <p className="text-sm">{document.documentName}</p>
//                 </div>
//                 <div>
//                   <span className="text-xs font-medium text-gray-400 md:hidden">Description</span>
//                   <p className="text-sm">{document.description}</p>
//                 </div>
//                 <div>
//                   <span className="text-xs font-medium text-gray-400 md:hidden">Date</span>
//                   <p className="text-sm">{document.date}</p>
//                 </div>
//                 <div>
//                   <span className="text-xs font-medium text-gray-400 md:hidden">File Extension</span>
//                   <p className="text-sm">{document.extension}</p>
//                 </div>
//                 <div>
//                   <span className="text-xs font-medium text-gray-400 md:hidden">Show in SIA</span>
//                   <p className="text-sm">{document.showInSIA}</p>
//                 </div>
//                 <div className="flex gap-3">
//                   <button type="button" className="text-sm text-blue-600 hover:underline">View</button>
//                   <button type="button" className="text-sm text-green-600 hover:underline">Edit</button>
//                   <button type="button" className="text-sm text-red-600 hover:underline">Delete</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//           <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-8">
//             <div className="mb-5 flex items-center justify-between sm:mb-6">
//               <h2 className="text-lg font-semibold sm:text-2xl">Add Document</h2>
//               <button type="button" onClick={() => setShowModal(false)}>
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="space-y-4 sm:space-y-5">
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium">Document Name</label>
//                 <input
//                   value={documentName}
//                   onChange={(e) => setDocumentName(e.target.value)}
//                   className="w-full rounded-lg border p-2.5 text-sm sm:p-3"
//                   placeholder="Enter document name"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium">Description</label>
//                 <textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   className="h-24 w-full rounded-lg border p-2.5 text-sm sm:h-28 sm:p-3"
//                   placeholder="Enter description"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium">Upload File</label>
//                 <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-violet-300 p-5 sm:p-8">
//                   <Upload size={28} className="mb-2 text-violet-600" />
//                   <p className="text-sm text-gray-600">Click to Upload</p>
//                   <input
//                     type="file"
//                     className="hidden"
//                     onChange={(e) => setFile(e.target.files?.[0] || null)}
//                   />
//                 </label>
//                 {file && <p className="mt-2 text-sm text-green-600">{file.name}</p>}
//               </div>

//               <div className="flex items-center justify-between rounded-lg border p-3 sm:p-4">
//                 <span className="text-sm font-medium">Show in SIA</span>
//                 <button
//                   type="button"
//                   onClick={() => setShowInSIA(!showInSIA)}
//                   className={`relative h-6 w-12 rounded-full transition sm:h-7 sm:w-14 ${
//                     showInSIA ? "bg-green-500" : "bg-gray-300"
//                   }`}
//                 >
//                   <span
//                     className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition sm:top-1 ${
//                       showInSIA ? "left-6 sm:left-8" : "left-0.5 sm:left-1"
//                     }`}
//                   />
//                 </button>
//               </div>

//               <div className="flex justify-end gap-3 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="rounded-lg border px-4 py-2 text-sm"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   className="rounded-lg bg-[#6C4BFF] px-5 py-2 text-sm text-white"
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }









// import React, { useState } from "react";
// import { Filter, X, Upload } from "lucide-react";
// import documentImage from "../../../../../assets/images/documentImage.png";

// interface Document {
//   id: number;
//   documentName: string;
//   description: string;
//   date: string;
//   extension: string;
//   showInSIA: string;
// }

// const tableHeaders = [
//   "Document Name",
//   "Description",
//   "Date",
//   "File Extension",
//   "Show in SIA",
//   "Action",
// ];

// const documents: Document[] = [];

// export default function DocumentPage() {
//   const [showModal, setShowModal] = useState(false);
//   const [documentName, setDocumentName] = useState("");
//   const [description, setDescription] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const [showInSIA, setShowInSIA] = useState(true);

//   return (
//     <div className="w-full">
//       <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
//         {/* TABLE HEADER - Desktop */}
//         <div className="hidden md:block" style={{ backgroundColor: "#EDE9FE" }}>
//           <div className="grid grid-cols-6 px-6 py-4 lg:px-8 lg:py-5">
//             {tableHeaders.map((header) => (
//               <div
//                 key={header}
//                 className="flex items-center gap-2 text-sm font-semibold text-gray-800"
//               >
//                 <span className="truncate">{header}</span>
//                 {header !== "Action" && (
//                   <Filter size={14} className="flex-shrink-0 text-gray-400" />
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* TABLE HEADER - Mobile */}
//         <div className="px-4 py-3 md:hidden" style={{ backgroundColor: "#EDE9FE" }}>
//           <p className="text-sm font-semibold text-gray-800">Documents</p>
//         </div>

//         {/* EMPTY STATE */}
//         {documents.length === 0 ? (
//           <div className="flex min-h-[380px] flex-col items-center justify-center px-4 py-12 sm:min-h-[440px]">
//             <img
//               src={documentImage}
//               alt="No Documents"
//               className="mb-6 w-52 sm:mb-7 sm:w-64 md:w-72"
//             />
//             <p className="text-center text-base text-gray-600">
//               Did Not Find Any Documents
//             </p>
//             <div className="mt-5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-500 shadow-sm">
//               No Record Found
//             </div>
//           </div>
//         ) : (
//           <div>
//             {documents.map((document) => (
//               <div
//                 key={document.id}
//                 className="grid grid-cols-1 gap-3 border-t px-4 py-4 hover:bg-gray-50 sm:grid-cols-2 md:grid-cols-6 md:gap-0 md:px-8 md:py-5"
//               >
//                 <div>
//                   <span className="text-xs font-medium text-gray-400 md:hidden">Document Name</span>
//                   <p className="text-sm">{document.documentName}</p>
//                 </div>
//                 <div>
//                   <span className="text-xs font-medium text-gray-400 md:hidden">Description</span>
//                   <p className="text-sm">{document.description}</p>
//                 </div>
//                 <div>
//                   <span className="text-xs font-medium text-gray-400 md:hidden">Date</span>
//                   <p className="text-sm">{document.date}</p>
//                 </div>
//                 <div>
//                   <span className="text-xs font-medium text-gray-400 md:hidden">File Extension</span>
//                   <p className="text-sm">{document.extension}</p>
//                 </div>
//                 <div>
//                   <span className="text-xs font-medium text-gray-400 md:hidden">Show in SIA</span>
//                   <p className="text-sm">{document.showInSIA}</p>
//                 </div>
//                 <div className="flex gap-3">
//                   <button type="button" className="text-sm text-blue-600 hover:underline">View</button>
//                   <button type="button" className="text-sm text-green-600 hover:underline">Edit</button>
//                   <button type="button" className="text-sm text-red-600 hover:underline">Delete</button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
//           <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-8">
//             <div className="mb-5 flex items-center justify-between sm:mb-6">
//               <h2 className="text-lg font-semibold sm:text-2xl">Add Document</h2>
//               <button type="button" onClick={() => setShowModal(false)}>
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="space-y-4 sm:space-y-5">
//               <div>
//                 <label className="mb-1.5 block text-sm font-medium">Document Name</label>
//                 <input
//                   value={documentName}
//                   onChange={(e) => setDocumentName(e.target.value)}
//                   className="w-full rounded-lg border border-gray-200 p-2.5 text-sm sm:p-3"
//                   placeholder="Enter document name"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium">Description</label>
//                 <textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   className="h-24 w-full rounded-lg border border-gray-200 p-2.5 text-sm sm:h-28 sm:p-3"
//                   placeholder="Enter description"
//                 />
//               </div>

//               <div>
//                 <label className="mb-1.5 block text-sm font-medium">Upload File</label>
//                 <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#DDD6FE] p-5 sm:p-8">
//                   <Upload size={28} className="mb-2 text-[#6C4BFF]" />
//                   <p className="text-sm text-gray-600">Click to Upload</p>
//                   <input
//                     type="file"
//                     className="hidden"
//                     onChange={(e) => setFile(e.target.files?.[0] || null)}
//                   />
//                 </label>
//                 {file && <p className="mt-2 text-sm text-green-600">{file.name}</p>}
//               </div>

//               <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 sm:p-4">
//                 <span className="text-sm font-medium">Show in SIA</span>
//                 <button
//                   type="button"
//                   onClick={() => setShowInSIA(!showInSIA)}
//                   className={`relative h-6 w-12 rounded-full transition sm:h-7 sm:w-14 ${
//                     showInSIA ? "bg-green-500" : "bg-gray-300"
//                   }`}
//                 >
//                   <span
//                     className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition sm:top-1 ${
//                       showInSIA ? "left-6 sm:left-8" : "left-0.5 sm:left-1"
//                     }`}
//                   />
//                 </button>
//               </div>

//               <div className="flex justify-end gap-3 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   className="rounded-lg bg-[#6C4BFF] px-5 py-2 text-sm text-white"
//                 >
//                   Save
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }







import React, { useState, useEffect } from "react";
import { Filter, X, Upload } from "lucide-react";
import documentImage from "../../../../../assets/images/documentImage.png";

interface Document {
  id: number;
  documentName: string;
  description: string;
  date: string;
  extension: string;
  showInSIA: string;
}

const tableHeaders = [
  "Document Name",
  "Description",
  "Date",
  "File Extension",
  "Show in SIA",
  "Action",
];

const documents: Document[] = [];

export default function DocumentPage() {
  const [showModal, setShowModal] = useState(false);
  const [documentName, setDocumentName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showInSIA, setShowInSIA] = useState(true);

  useEffect(() => {
    const open = () => setShowModal(true);
    window.addEventListener("open-add-document-modal", open);
    return () => window.removeEventListener("open-add-document-modal", open);
  }, []);

  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {/* TABLE HEADER – Desktop */}
        <div className="hidden md:block" style={{ backgroundColor: "#EDE9FE" }}>
          <div className="grid grid-cols-6 items-center px-5 py-3 lg:px-6">
            {tableHeaders.map((header) => (
              <div
                key={header}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-slate-700"
              >
                <span className="truncate">{header}</span>
                {header !== "Action" && (
                  <Filter size={13} className="shrink-0 text-slate-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* TABLE HEADER – Mobile */}
        <div className="px-4 py-3 md:hidden" style={{ backgroundColor: "#EDE9FE" }}>
          <p className="text-sm font-semibold text-slate-700">Documents</p>
        </div>

        {/* EMPTY / ROWS */}
        {documents.length === 0 ? (
          <div className="flex min-h-[380px] flex-col items-center justify-center px-4 py-12 sm:min-h-[440px]">
            <img
              src={documentImage}
              alt="No Documents"
              className="mb-6 w-52 sm:mb-7 sm:w-64 md:w-72"
            />
            <p className="text-center text-base text-gray-600">
              Did Not Find Any Documents
            </p>
            <div className="mt-5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-500 shadow-sm">
              No Record Found
            </div>
          </div>
        ) : (
          <div>
            {documents.map((document) => (
              <div
                key={document.id}
                className="grid grid-cols-1 gap-3 border-t px-4 py-4 hover:bg-gray-50 sm:grid-cols-2 md:grid-cols-6 md:gap-0 md:px-6 md:py-4"
              >
                <div>
                  <span className="text-xs font-medium text-gray-400 md:hidden">Document Name</span>
                  <p className="text-sm">{document.documentName}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-400 md:hidden">Description</span>
                  <p className="text-sm">{document.description}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-400 md:hidden">Date</span>
                  <p className="text-sm">{document.date}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-400 md:hidden">File Extension</span>
                  <p className="text-sm">{document.extension}</p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-400 md:hidden">Show in SIA</span>
                  <p className="text-sm">{document.showInSIA}</p>
                </div>
                <div className="flex gap-3">
                  <button type="button" className="text-sm text-blue-600 hover:underline">View</button>
                  <button type="button" className="text-sm text-green-600 hover:underline">Edit</button>
                  <button type="button" className="text-sm text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-8">
            <div className="mb-5 flex items-center justify-between sm:mb-6">
              <h2 className="text-lg font-semibold sm:text-2xl">Add Document</h2>
              <button type="button" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 sm:space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Document Name</label>
                <input
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-2.5 text-sm sm:p-3"
                  placeholder="Enter document name"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-24 w-full rounded-lg border border-gray-200 p-2.5 text-sm sm:h-28 sm:p-3"
                  placeholder="Enter description"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Upload File</label>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#DDD6FE] p-5 sm:p-8">
                  <Upload size={28} className="mb-2 text-[#6C4BFF]" />
                  <p className="text-sm text-gray-600">Click to Upload</p>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
                {file && <p className="mt-2 text-sm text-green-600">{file.name}</p>}
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-200 p-3 sm:p-4">
                <span className="text-sm font-medium">Show in SIA</span>
                <button
                  type="button"
                  onClick={() => setShowInSIA(!showInSIA)}
                  className={`relative h-6 w-12 rounded-full transition sm:h-7 sm:w-14 ${
                    showInSIA ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition sm:top-1 ${
                      showInSIA ? "left-6 sm:left-8" : "left-0.5 sm:left-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-[#6C4BFF] px-5 py-2 text-sm text-white"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
